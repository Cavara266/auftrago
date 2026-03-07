import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const sessionId = String(body?.sessionId ?? "").trim();

    if (!sessionId) {
      return NextResponse.json(
        { ok: false, error: "Missing sessionId" },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session) {
      return NextResponse.json(
        { ok: false, error: "Session not found" },
        { status: 404 }
      );
    }

    if (session.payment_status !== "paid") {
      return NextResponse.json(
        { ok: false, error: "Payment not completed" },
        { status: 400 }
      );
    }

    const userId = String(session.metadata?.userId ?? "").trim();
    const credits = Number(session.metadata?.credits ?? 0);
    const planId = String(session.metadata?.planId ?? "").trim();
    const planName = String(session.metadata?.planName ?? "").trim();

    if (!userId) {
      return NextResponse.json(
        { ok: false, error: "Missing userId in metadata" },
        { status: 400 }
      );
    }

    if (!Number.isFinite(credits) || credits <= 0) {
      return NextResponse.json(
        { ok: false, error: "Invalid credits in metadata" },
        { status: 400 }
      );
    }

    const existingTransaction = await prisma.transaction.findUnique({
      where: {
        stripeSessionId: session.id,
      },
      select: {
        id: true,
        amount: true,
      },
    });

    if (existingTransaction) {
      return NextResponse.json({
        ok: true,
        success: true,
        creditsAdded: existingTransaction.amount,
        alreadyProcessed: true,
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        credits: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { ok: false, error: "User not found" },
        { status: 404 }
      );
    }

    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: userId },
        data: {
          credits: {
            increment: credits,
          },
        },
      });

      await tx.transaction.create({
        data: {
          userId,
          type: "CREDITS_PURCHASE",
          amount: credits,
          stripeSessionId: session.id,
          meta: {
            sessionId: session.id,
            planId,
            planName,
            credits,
            paymentStatus: session.payment_status,
            customerEmail: session.customer_details?.email ?? null,
          },
        },
      });
    });

    return NextResponse.json({
      ok: true,
      success: true,
      creditsAdded: credits,
      alreadyProcessed: false,
    });
  } catch (error) {
    console.error("Finalize error:", error);

    return NextResponse.json(
      { ok: false, error: "Server error" },
      { status: 500 }
    );
  }
}