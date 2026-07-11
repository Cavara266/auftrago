import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      {
        ok: false,
        error: "Stripe-Signatur fehlt.",
      },
      {
        status: 400,
      }
    );
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET fehlt.");

    return NextResponse.json(
      {
        ok: false,
        error: "Webhook-Konfiguration fehlt.",
      },
      {
        status: 500,
      }
    );
  }

  let event: Stripe.Event;

  try {
    const rawBody = await req.text();

    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      webhookSecret
    );
  } catch (error) {
    console.error("STRIPE WEBHOOK SIGNATURE ERROR:", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Webhook konnte nicht verifiziert werden.",
      },
      {
        status: 400,
      }
    );
  }

  if (event.type !== "checkout.session.completed") {
    return NextResponse.json({
      ok: true,
      received: true,
    });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  if (session.payment_status !== "paid") {
    return NextResponse.json({
      ok: true,
      received: true,
    });
  }

  const providerId = session.metadata?.providerId?.trim();
  const packageId = session.metadata?.packageId?.trim() || null;
  const credits = Number(session.metadata?.credits || 0);
  const amount = session.amount_total || 0;
  const currency = session.currency || "chf";

  if (!providerId) {
    console.error(
      "STRIPE WEBHOOK ERROR: providerId fehlt.",
      session.id
    );

    return NextResponse.json({
      ok: true,
      received: true,
    });
  }

  if (!Number.isInteger(credits) || credits <= 0) {
    console.error(
      "STRIPE WEBHOOK ERROR: Ungültige Credit-Anzahl.",
      session.id,
      credits
    );

    return NextResponse.json({
      ok: true,
      received: true,
    });
  }

  try {
    await prisma.$transaction(
      async (tx) => {
        const existingPurchase = await tx.creditPurchase.findUnique({
          where: {
            stripeSessionId: session.id,
          },
          select: {
            id: true,
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
            status: true,
          },
        });

        if (!provider) {
          throw new Error(
            `Provider ${providerId} wurde nicht gefunden.`
          );
        }

        if (provider.status === "BLOCKED") {
          throw new Error(
            `Provider ${providerId} ist gesperrt.`
          );
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
      },
      {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
      }
    );
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json({
        ok: true,
        received: true,
        duplicate: true,
      });
    }

    console.error("STRIPE WEBHOOK DATABASE ERROR:", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Credit-Gutschrift fehlgeschlagen.",
      },
      {
        status: 500,
      }
    );
  }

  return NextResponse.json({
    ok: true,
    received: true,
  });
}