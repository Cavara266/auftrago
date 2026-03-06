import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const user = await requireUser();

    if (!user) {
      return NextResponse.json(
        { ok: false, error: "Nicht eingeloggt." },
        { status: 401 }
      );
    }

    const body = await req.json().catch(() => null);
    const sessionId = String(body?.sessionId ?? "").trim();

    if (!sessionId) {
      return NextResponse.json(
        { ok: false, error: "Session ID fehlt." },
        { status: 400 }
      );
    }

    const existingTransaction = await prisma.transaction.findUnique({
      where: {
        stripeSessionId: sessionId,
      },
      select: {
        id: true,
        userId: true,
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

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session) {
      return NextResponse.json(
        { ok: false, error: "Stripe Session nicht gefunden." },
        { status: 404 }
      );
    }

    const paymentStatus = String(session.payment_status ?? "");
    const metadataUserId = String(session.metadata?.userId ?? "");
    const credits = Number(session.metadata?.credits ?? 0);

    if (paymentStatus !== "paid") {
      return NextResponse.json(
        { ok: false, error: "Zahlung ist noch nicht abgeschlossen." },
        { status: 400 }
      );
    }

    if (!metadataUserId || !credits) {
      return NextResponse.json(
        { ok: false, error: "Stripe Metadaten fehlen." },
        { status: 400 }
      );
    }

    if (metadataUserId !== user.id) {
      return NextResponse.json(
        { ok: false, error: "Diese Zahlung gehört zu einem anderen Benutzer." },
        { status: 403 }
      );
    }

    const currentTransaction = await prisma.transaction.findUnique({
      where: {
        stripeSessionId: sessionId,
      },
      select: {
        id: true,
        amount: true,
      },
    });

    if (currentTransaction) {
      return NextResponse.json({
        ok: true,
        alreadyProcessed: true,
        creditsAdded: currentTransaction.amount,
      });
    }

    const updatedUser = await prisma.user.updateMany({
      where: {
        id: user.id,
      },
      data: {
        credits: {
          increment: credits,
        },
      },
    });

    if (updatedUser.count === 0) {
      return NextResponse.json(
        { ok: false, error: "Benutzer nicht gefunden." },
        { status: 404 }
      );
    }

    try {
      await prisma.transaction.create({
        data: {
          userId: user.id,
          type: "CREDIT_PURCHASE",
          amount: credits,
          stripeSessionId: sessionId,
          meta: {
            credits,
            stripePaymentStatus: paymentStatus,
          },
        },
      });
    } catch {
      const alreadyCreated = await prisma.transaction.findUnique({
        where: {
          stripeSessionId: sessionId,
        },
        select: {
          id: true,
          amount: true,
        },
      });

      if (alreadyCreated) {
        return NextResponse.json({
          ok: true,
          alreadyProcessed: true,
          creditsAdded: alreadyCreated.amount,
        });
      }

      return NextResponse.json(
        { ok: false, error: "Transaktion konnte nicht gespeichert werden." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      creditsAdded: credits,
    });
  } catch (error) {
    console.error("STRIPE FINALIZE ERROR:", error);

    return NextResponse.json(
      { ok: false, error: "Serverfehler." },
      { status: 500 }
    );
  }
}