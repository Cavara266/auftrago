import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    if (!signature) {
      console.error("WEBHOOK ERROR: Missing stripe-signature header");
      return new NextResponse("Missing stripe signature", { status: 400 });
    }

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    console.log("WEBHOOK EVENT RECEIVED:", event.type);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      const userId = String(session.metadata?.userId ?? "");
      const credits = Number(session.metadata?.credits ?? 0);
      const sessionId = String(session.id ?? "");

      console.log("CHECKOUT SESSION:", {
        sessionId,
        userId,
        credits,
      });

      if (!userId || !credits || !sessionId) {
        console.error("WEBHOOK ERROR: Missing metadata", {
          userId,
          credits,
          sessionId,
        });
        return new NextResponse("Missing metadata", { status: 400 });
      }

      const existingTransaction = await prisma.transaction.findFirst({
        where: {
          type: "CREDIT_PURCHASE",
        },
        select: {
          id: true,
          meta: true,
        },
      });

      console.log("EXISTING TRANSACTION CHECK:", existingTransaction);

      const alreadyProcessed = await prisma.transaction.findFirst({
        where: {
          type: "CREDIT_PURCHASE",
        },
        select: {
          id: true,
          meta: true,
        },
      });

      if (
        alreadyProcessed &&
        typeof alreadyProcessed.meta === "object" &&
        alreadyProcessed.meta !== null &&
        "stripeSessionId" in (alreadyProcessed.meta as Record<string, unknown>) &&
        (alreadyProcessed.meta as Record<string, unknown>).stripeSessionId === sessionId
      ) {
        console.log("WEBHOOK: already processed", sessionId);
        return NextResponse.json({ ok: true, alreadyProcessed: true });
      }

      await prisma.$transaction([
        prisma.user.update({
          where: { id: userId },
          data: {
            credits: {
              increment: credits,
            },
          },
        }),
        prisma.transaction.create({
          data: {
            userId,
            type: "CREDIT_PURCHASE",
            amount: credits,
            meta: {
              stripeSessionId: sessionId,
              credits,
            },
          },
        }),
      ]);

      console.log("WEBHOOK SUCCESS: credits added", { userId, credits });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("STRIPE WEBHOOK ERROR:", error);
    return new NextResponse("Webhook Error", { status: 400 });
  }
}