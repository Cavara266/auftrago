import { NextResponse } from "next/server";
import Stripe from "stripe";

import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

function unixToDate(value: number | null | undefined) {
  return typeof value === "number" ? new Date(value * 1000) : null;
}

function normalizeStatus(status: string) {
  return status.toUpperCase();
}

async function updateCandidateFromSubscription(
  subscription: Stripe.Subscription,
) {
  const customerId =
    typeof subscription.customer === "string"
      ? subscription.customer
      : subscription.customer.id;

  const candidateAccountId = subscription.metadata?.candidateAccountId || null;

  const data = {
    stripeCustomerId: customerId,
    stripeSubscriptionId: subscription.id,
    subscriptionStatus: normalizeStatus(subscription.status),

    subscriptionCurrentPeriodEnd: unixToDate(subscription.current_period_end),

    subscriptionCancelAtPeriodEnd: subscription.cancel_at_period_end,

    subscriptionStartedAt: unixToDate(subscription.start_date) ?? new Date(),

    subscriptionCancelledAt:
      subscription.status === "canceled" ? new Date() : null,
  };

  if (candidateAccountId) {
    await prisma.candidateAccount.updateMany({
      where: {
        id: candidateAccountId,
      },
      data,
    });

    return;
  }

  await prisma.candidateAccount.updateMany({
    where: {
      stripeCustomerId: customerId,
    },
    data,
  });
}

export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_TALENT_SUBSCRIPTION_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error("STRIPE_TALENT_SUBSCRIPTION_WEBHOOK_SECRET fehlt.");

    return NextResponse.json(
      {
        ok: false,
        error: "webhook-secret-missing",
      },
      {
        status: 500,
      },
    );
  }

  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      {
        ok: false,
        error: "stripe-signature-missing",
      },
      {
        status: 400,
      },
    );
  }

  let event: Stripe.Event;

  try {
    const body = await request.text();

    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    console.error("===== TALENT WEBHOOK SIGNATURE ERROR =====");
    console.error(error);
    console.error("==========================================");

    return NextResponse.json(
      {
        ok: false,
        error: "invalid-signature",
      },
      {
        status: 400,
      },
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        if (session.mode !== "subscription") {
          break;
        }

        const candidateAccountId =
          session.metadata?.candidateAccountId ||
          session.client_reference_id ||
          null;

        const stripeCustomerId =
          typeof session.customer === "string"
            ? session.customer
            : session.customer?.id || null;

        const stripeSubscriptionId =
          typeof session.subscription === "string"
            ? session.subscription
            : session.subscription?.id || null;

        if (stripeSubscriptionId) {
          const subscription =
            await stripe.subscriptions.retrieve(stripeSubscriptionId);

          await updateCandidateFromSubscription(subscription);
        } else if (candidateAccountId) {
          await prisma.candidateAccount.updateMany({
            where: {
              id: candidateAccountId,
            },
            data: {
              stripeCustomerId,
            },
          });
        }

        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;

        await updateCandidateFromSubscription(subscription);

        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;

        const customerId =
          typeof invoice.customer === "string"
            ? invoice.customer
            : invoice.customer?.id || null;

        if (customerId) {
          await prisma.candidateAccount.updateMany({
            where: {
              stripeCustomerId: customerId,
            },
            data: {
              subscriptionStatus: "PAST_DUE",
            },
          });
        }

        break;
      }

      default:
        break;
    }

    return NextResponse.json({
      received: true,
    });
  } catch (error) {
    console.error("===== TALENT WEBHOOK ERROR =====");
    console.error("event:", event.type);
    console.error(error);
    console.error("===============================");

    return NextResponse.json(
      {
        ok: false,
        error: "webhook-processing-error",
      },
      {
        status: 500,
      },
    );
  }
}
