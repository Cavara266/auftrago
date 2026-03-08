import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/db";
import { stripe } from "@/lib/stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = headers().get("stripe-signature");

    if (!signature) {
      return new NextResponse("Missing stripe signature", { status: 400 });
    }

    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      return new NextResponse("Missing STRIPE_WEBHOOK_SECRET", { status: 500 });
    }

    const event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    if (event.type !== "checkout.session.completed") {
      return NextResponse.json({
        ok: true,
        ignored: true,
        eventType: event.type,
      });
    }

    const session = event.data.object as Stripe.Checkout.Session;

    if (session.payment_status !== "paid") {
      return NextResponse.json({
        ok: true,
        skipped: "not_paid",
      });
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
        alreadyProcessed: true,
        creditsAdded: existingTransaction.amount,
      });
    }

    const userId = String(session.metadata?.userId ?? "").trim();
    const credits = Number(session.metadata?.credits ?? 0);
    const planId = String(session.metadata?.planId ?? "").trim();
    const planName = String(session.metadata?.planName ?? "").trim();

    if (!userId) {
      return new NextResponse("Missing userId in metadata", { status: 400 });
    }

    if (!Number.isFinite(credits) || credits <= 0) {
      return new NextResponse("Invalid credits in metadata", { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
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
            source: "stripe_webhook",
          },
        },
      });
    });

    return NextResponse.json({
      ok: true,
      processed: true,
      creditsAdded: credits,
    });
  } catch (error) {
    console.error("STRIPE WEBHOOK ERROR:", error);
    return new NextResponse("Webhook Error", { status: 400 });
  }
}