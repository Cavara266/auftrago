import {
  NextRequest,
  NextResponse,
} from "next/server";

import Stripe from "stripe";

import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

import {
  normalizeStripeId,
  synchronizeProviderSubscription,
} from "@/lib/provider-subscription";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

async function handleCheckoutSession(
  session: Stripe.Checkout.Session,
) {
  if (
    session.mode !== "subscription" ||
    session.metadata?.type !==
      "provider-subscription"
  ) {
    return {
      ignored: true,
    };
  }

  const providerId =
    session.metadata?.providerId?.trim() ||
    session.client_reference_id?.trim();

  const customerId = normalizeStripeId(
    session.customer,
  );

  const subscriptionId = normalizeStripeId(
    session.subscription,
  );

  if (!providerId) {
    throw new Error(
      "SUBSCRIPTION_CHECKOUT_PROVIDER_MISSING",
    );
  }

  if (!subscriptionId) {
    await prisma.provider.update({
      where: {
        id: providerId,
      },
      data: {
        stripeCustomerId:
          customerId || undefined,

        subscriptionStatus:
          "INCOMPLETE",
      },
    });

    return {
      ignored: false,
      synchronized: false,
    };
  }

  const subscription =
    await stripe.subscriptions.retrieve(
      subscriptionId,
    );

  await synchronizeProviderSubscription(
    subscription,
  );

  return {
    ignored: false,
    synchronized: true,
  };
}

async function handleInvoice(
  invoice: Stripe.Invoice,
  fallbackStatus?: string,
) {
  const invoiceData =
    invoice as Stripe.Invoice & {
      subscription?:
        | string
        | Stripe.Subscription
        | null;
    };

  const subscriptionId = normalizeStripeId(
    invoiceData.subscription,
  );

  if (!subscriptionId) {
    return {
      ignored: true,
    };
  }

  const subscription =
    typeof invoiceData.subscription ===
      "object" &&
    invoiceData.subscription &&
    "status" in invoiceData.subscription
      ? (invoiceData.subscription as Stripe.Subscription)
      : await stripe.subscriptions.retrieve(
          subscriptionId,
        );

  const synchronized =
    await synchronizeProviderSubscription(
      subscription,
    );

  if (fallbackStatus) {
    await prisma.provider.update({
      where: {
        id: synchronized.providerId,
      },
      data: {
        subscriptionStatus:
          fallbackStatus.toUpperCase(),
      },
    });
  }

  return {
    ignored: false,
  };
}

export async function POST(
  request: NextRequest,
) {
  const signature =
    request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      {
        ok: false,
        error: "Stripe-Signatur fehlt.",
      },
      {
        status: 400,
      },
    );
  }

  const webhookSecret =
    process.env
      .STRIPE_SUBSCRIPTION_WEBHOOK_SECRET
      ?.trim();

  if (!webhookSecret) {
    console.error(
      "STRIPE_SUBSCRIPTION_WEBHOOK_SECRET fehlt.",
    );

    return NextResponse.json(
      {
        ok: false,
        error:
          "Subscription-Webhook ist nicht konfiguriert.",
      },
      {
        status: 500,
      },
    );
  }

  let event: Stripe.Event;

  try {
    const rawBody = await request.text();

    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      webhookSecret,
    );
  } catch (error) {
    console.error(
      "SUBSCRIPTION WEBHOOK SIGNATURE ERROR:",
      error,
    );

    return NextResponse.json(
      {
        ok: false,
        error:
          "Webhook-Signatur ist ungültig.",
      },
      {
        status: 400,
      },
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
      case "checkout.session.async_payment_succeeded": {
        await handleCheckoutSession(
          event.data
            .object as Stripe.Checkout.Session,
        );

        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        await synchronizeProviderSubscription(
          event.data
            .object as Stripe.Subscription,
        );

        break;
      }

      case "invoice.paid": {
        await handleInvoice(
          event.data.object as Stripe.Invoice,
        );

        break;
      }

      case "invoice.payment_failed": {
        await handleInvoice(
          event.data.object as Stripe.Invoice,
          "PAST_DUE",
        );

        break;
      }

      default:
        return NextResponse.json({
          ok: true,
          received: true,
          ignored: true,
          eventType: event.type,
        });
    }

    return NextResponse.json({
      ok: true,
      received: true,
      eventType: event.type,
    });
  } catch (error) {
    console.error(
      "SUBSCRIPTION WEBHOOK PROCESSING ERROR:",
      {
        eventId: event.id,
        eventType: event.type,
        error,
      },
    );

    return NextResponse.json(
      {
        ok: false,
        error:
          "Subscription-Webhook konnte nicht verarbeitet werden.",
      },
      {
        status: 500,
      },
    );
  }
}
