import { NextResponse } from "next/server";
import Stripe from "stripe";

import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY || ""
);

function stripeDate(
  seconds?: number | null
) {
  return seconds
    ? new Date(seconds * 1000)
    : null;
}

async function updateFromSubscription(
  subscription: any,
  forceDeleted = false
) {
  const providerId =
    subscription.metadata?.providerId;

  const existing =
    providerId
      ? await prisma.provider.findUnique({
          where: {
            id: providerId,
          },
          select: {
            id: true,
          },
        })
      : await prisma.provider.findFirst({
          where: {
            businessStripeSubscriptionId:
              subscription.id,
          },
          select: {
            id: true,
          },
        });

  if (!existing) {
    console.error(
      "BUSINESS WEBHOOK: Provider nicht gefunden",
      subscription.id
    );
    return;
  }

  const customerId =
    typeof subscription.customer === "string"
      ? subscription.customer
      : subscription.customer?.id;

  const status = forceDeleted
    ? "CANCELED"
    : String(
        subscription.status || "INACTIVE"
      ).toUpperCase();

  await prisma.provider.update({
    where: {
      id: existing.id,
    },
    data: {
      businessStripeCustomerId:
        customerId || undefined,

      businessStripeSubscriptionId:
        subscription.id,

      businessSubscriptionStatus:
        status,

      businessSubscriptionCurrentPeriodEnd:
        stripeDate(
          subscription.current_period_end
        ),

      businessSubscriptionCancelAtPeriodEnd:
        Boolean(
          subscription.cancel_at_period_end
        ),

      businessSubscriptionCancelledAt:
        forceDeleted
          ? new Date()
          : subscription.canceled_at
          ? stripeDate(
              subscription.canceled_at
            )
          : null,
    },
  });
}

export async function POST(
  request: Request
) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      {
        error: "stripe-not-configured",
      },
      {
        status: 500,
      }
    );
  }

  const webhookSecret =
    process.env
      .STRIPE_BUSINESS_SUBSCRIPTION_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error(
      "STRIPE_BUSINESS_SUBSCRIPTION_WEBHOOK_SECRET fehlt."
    );

    return NextResponse.json(
      {
        error:
          "business-webhook-secret-missing",
      },
      {
        status: 500,
      }
    );
  }

  const signature =
    request.headers.get(
      "stripe-signature"
    );

  if (!signature) {
    return NextResponse.json(
      {
        error: "signature-missing",
      },
      {
        status: 400,
      }
    );
  }

  const rawBody =
    await request.text();

  let event: Stripe.Event;

  try {
    event =
      stripe.webhooks.constructEvent(
        rawBody,
        signature,
        webhookSecret
      );
  } catch (error) {
    console.error(
      "BUSINESS WEBHOOK SIGNATURE ERROR",
      error
    );

    return NextResponse.json(
      {
        error:
          "invalid-webhook-signature",
      },
      {
        status: 400,
      }
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session =
          event.data.object as Stripe.Checkout.Session;

        if (
          session.metadata?.subscriptionType !==
            "BUSINESS" &&
          session.metadata?.plan !==
            "business"
        ) {
          break;
        }

        const subscriptionId =
          typeof session.subscription ===
          "string"
            ? session.subscription
            : session.subscription?.id;

        if (subscriptionId) {
          const subscription: any =
            await stripe.subscriptions.retrieve(
              subscriptionId
            );

          await updateFromSubscription(
            subscription
          );
        }

        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription: any =
          event.data.object;

        if (
          subscription.metadata
            ?.subscriptionType !==
            "BUSINESS" &&
          subscription.metadata?.plan !==
            "business"
        ) {
          // Fallback über gespeicherte Business Subscription-ID
          const existing =
            await prisma.provider.findFirst({
              where: {
                businessStripeSubscriptionId:
                  subscription.id,
              },
              select: {
                id: true,
              },
            });

          if (!existing) {
            break;
          }
        }

        await updateFromSubscription(
          subscription
        );

        break;
      }

      case "customer.subscription.deleted": {
        const subscription: any =
          event.data.object;

        const businessProvider =
          await prisma.provider.findFirst({
            where: {
              businessStripeSubscriptionId:
                subscription.id,
            },
            select: {
              id: true,
            },
          });

        if (
          subscription.metadata
            ?.subscriptionType !==
            "BUSINESS" &&
          subscription.metadata?.plan !==
            "business" &&
          !businessProvider
        ) {
          break;
        }

        await updateFromSubscription(
          subscription,
          true
        );

        break;
      }

      default:
        break;
    }

    return NextResponse.json({
      ok: true,
      received: true,
      eventType: event.type,
    });
  } catch (error) {
    console.error(
      "BUSINESS SUBSCRIPTION WEBHOOK ERROR",
      {
        eventType: event.type,
        error,
      }
    );

    return NextResponse.json(
      {
        ok: false,
        error:
          "business-subscription-webhook-failed",
      },
      {
        status: 500,
      }
    );
  }
}
