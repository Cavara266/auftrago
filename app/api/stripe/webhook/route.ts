import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Stripe signature fehlt." },
      { status: 400 }
    );
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return NextResponse.json(
      { error: "STRIPE_WEBHOOK_SECRET fehlt." },
      { status: 500 }
    );
  }

  let event: Stripe.Event;

  try {
    const body = await req.text();

    event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    );
  } catch {
    return NextResponse.json(
      { error: "Webhook konnte nicht verifiziert werden." },
      { status: 400 }
    );
  }

  if (event.type !== "checkout.session.completed") {
    return NextResponse.json({ received: true });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  if (session.payment_status !== "paid") {
    return NextResponse.json({ received: true });
  }

  const providerId = session.metadata?.providerId;
  const packageId = session.metadata?.packageId || "";
  const credits = Number(session.metadata?.credits || 0);
  const amount = session.amount_total || 0;
  const currency = session.currency || "chf";

  if (!providerId || !session.id || credits <= 0) {
    return NextResponse.json({ received: true });
  }

  await prisma.$transaction(async (tx) => {
    const existingPurchase = await tx.creditPurchase.findUnique({
      where: {
        stripeSessionId: session.id,
      },
    });

    if (existingPurchase) {
      return;
    }

    const provider = await tx.provider.findUnique({
      where: {
        id: providerId,
      },
      select: {
        id: true,
      },
    });

    if (!provider) {
      return;
    }

    await tx.creditPurchase.create({
      data: {
        providerId,
        stripeSessionId: session.id,
        packageId,
        credits,
        amount,
        currency,
        status: "paid",
      },
    });

    await tx.provider.update({
      where: {
        id: providerId,
      },
      data: {
        credits: {
          increment: credits,
        },
      },
    });
  });

  return NextResponse.json({ received: true });
}