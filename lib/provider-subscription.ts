import Stripe from "stripe";

import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export const PROVIDER_SUBSCRIPTION_PRICE_CENTS = 6900;
export const PROVIDER_SUBSCRIPTION_TRIAL_DAYS = 14;

export const ACTIVE_SUBSCRIPTION_STATUSES = [
  "ACTIVE",
  "TRIALING",
] as const;

export function hasSubscriptionAccess(provider: {
  subscriptionExempt: boolean;
  subscriptionStatus: string | null;
}) {
  if (provider.subscriptionExempt) {
    return true;
  }

  const status = String(
    provider.subscriptionStatus || "INACTIVE",
  ).toUpperCase();

  return ACTIVE_SUBSCRIPTION_STATUSES.includes(
    status as (typeof ACTIVE_SUBSCRIPTION_STATUSES)[number],
  );
}

export function normalizeStripeId(
  value:
    | string
    | {
        id?: string | null;
      }
    | null
    | undefined,
): string | null {
  if (typeof value === "string") {
    return value;
  }

  if (
    value &&
    typeof value === "object" &&
    typeof value.id === "string"
  ) {
    return value.id;
  }

  return null;
}

export function getApplicationBaseUrl(
  fallbackOrigin?: string,
): string {
  const configuredUrl =
    process.env.NEXT_PUBLIC_APP_URL?.trim() ||
    process.env.APP_URL?.trim() ||
    process.env.NEXTAUTH_URL?.trim();

  if (configuredUrl) {
    return configuredUrl.replace(/\/+$/, "");
  }

  if (process.env.VERCEL_URL?.trim()) {
    return `https://${process.env.VERCEL_URL.trim()}`;
  }

  if (fallbackOrigin) {
    return fallbackOrigin.replace(/\/+$/, "");
  }

  return "http://localhost:3000";
}

export async function getOrCreateStripeCustomer(
  provider: {
    id: string;
    email: string;
    companyName: string;
    contactName: string;
    phone?: string | null;
    stripeCustomerId?: string | null;
  },
): Promise<string> {
  if (provider.stripeCustomerId) {
    try {
      const existingCustomer =
        await stripe.customers.retrieve(
          provider.stripeCustomerId,
        );

      if (!existingCustomer.deleted) {
        return existingCustomer.id;
      }
    } catch (error) {
      console.warn(
        "STRIPE CUSTOMER COULD NOT BE RETRIEVED:",
        {
          providerId: provider.id,
          stripeCustomerId:
            provider.stripeCustomerId,
          error,
        },
      );
    }
  }

  const customer = await stripe.customers.create({
    email: provider.email,
    name: provider.companyName,
    phone: provider.phone || undefined,

    metadata: {
      providerId: provider.id,
      contactName: provider.contactName,
      platform: "auftrago",
    },
  });

  await prisma.provider.update({
    where: {
      id: provider.id,
    },
    data: {
      stripeCustomerId: customer.id,
    },
  });

  return customer.id;
}

export async function createProviderSubscriptionCheckout(
  providerId: string,
  baseUrl: string,
): Promise<Stripe.Checkout.Session> {
  const provider = await prisma.provider.findUnique({
    where: {
      id: providerId,
    },
    select: {
      id: true,
      email: true,
      companyName: true,
      contactName: true,
      phone: true,
      status: true,
      subscriptionExempt: true,
      subscriptionStatus: true,
      stripeCustomerId: true,
      stripeSubscriptionId: true,
    },
  });

  if (!provider) {
    throw new Error("PROVIDER_NOT_FOUND");
  }

  if (provider.status === "BLOCKED") {
    throw new Error("PROVIDER_BLOCKED");
  }

  if (provider.subscriptionExempt) {
    throw new Error("PROVIDER_SUBSCRIPTION_EXEMPT");
  }

  if (hasSubscriptionAccess(provider)) {
    throw new Error(
      "PROVIDER_SUBSCRIPTION_ALREADY_ACTIVE",
    );
  }

  if (provider.stripeSubscriptionId) {
    try {
      const existingSubscription =
        await stripe.subscriptions.retrieve(
          provider.stripeSubscriptionId,
        );

      if (
        existingSubscription.status === "active" ||
        existingSubscription.status === "trialing"
      ) {
        await synchronizeProviderSubscription(
          existingSubscription,
        );

        throw new Error(
          "PROVIDER_SUBSCRIPTION_ALREADY_ACTIVE",
        );
      }
    } catch (error) {
      if (
        error instanceof Error &&
        error.message ===
          "PROVIDER_SUBSCRIPTION_ALREADY_ACTIVE"
      ) {
        throw error;
      }

      console.warn(
        "EXISTING SUBSCRIPTION COULD NOT BE RETRIEVED:",
        {
          providerId: provider.id,
          subscriptionId:
            provider.stripeSubscriptionId,
          error,
        },
      );
    }
  }

  const customerId =
    await getOrCreateStripeCustomer(provider);

  const configuredPriceId =
    process.env
      .STRIPE_PROVIDER_SUBSCRIPTION_PRICE_ID
      ?.trim();

  const lineItem: Stripe.Checkout.SessionCreateParams.LineItem =
    configuredPriceId
      ? {
          price: configuredPriceId,
          quantity: 1,
        }
      : {
          price_data: {
            currency: "chf",
            unit_amount:
              PROVIDER_SUBSCRIPTION_PRICE_CENTS,

            recurring: {
              interval: "month",
            },

            product_data: {
              name: "Auftrago Anbieter-Mitgliedschaft",

              description:
                "Monatlicher Zugang zum Auftrago Anbieterportal. Lead-Credits werden separat gekauft.",
            },
          },

          quantity: 1,
        };

  const session =
    await stripe.checkout.sessions.create({
      mode: "subscription",

      customer: customerId,

      client_reference_id: provider.id,

      line_items: [lineItem],

      payment_method_collection: "always",

      billing_address_collection: "auto",

      allow_promotion_codes: false,

      metadata: {
        type: "provider-subscription",
        purpose: "provider-subscription",
        providerId: provider.id,
      },

      subscription_data: {
        trial_period_days:
          PROVIDER_SUBSCRIPTION_TRIAL_DAYS,

        metadata: {
          type: "provider-subscription",
          purpose: "provider-subscription",
          providerId: provider.id,
        },
      },

      success_url:
        `${baseUrl}/subscription-required` +
        "?success=1&session_id={CHECKOUT_SESSION_ID}",

      cancel_url:
        `${baseUrl}/subscription-required?cancelled=1`,
    });

  return session;
}

export async function synchronizeProviderSubscription(
  subscription: Stripe.Subscription,
) {
  const customerId = normalizeStripeId(
    subscription.customer,
  );

  const providerIdFromMetadata =
    subscription.metadata?.providerId?.trim();

  let provider:
    | {
        id: string;
      }
    | null = null;

  if (providerIdFromMetadata) {
    provider = await prisma.provider.findUnique({
      where: {
        id: providerIdFromMetadata,
      },
      select: {
        id: true,
      },
    });
  }

  if (!provider && customerId) {
    provider = await prisma.provider.findUnique({
      where: {
        stripeCustomerId: customerId,
      },
      select: {
        id: true,
      },
    });
  }

  if (!provider) {
    provider = await prisma.provider.findUnique({
      where: {
        stripeSubscriptionId: subscription.id,
      },
      select: {
        id: true,
      },
    });
  }

  if (!provider) {
    throw new Error(
      "SUBSCRIPTION_PROVIDER_NOT_FOUND",
    );
  }

  const subscriptionWithPeriod =
    subscription as Stripe.Subscription & {
      current_period_end?: number;
      started_at?: number;
      canceled_at?: number | null;
    };

  const currentPeriodEnd =
    typeof subscriptionWithPeriod.current_period_end ===
    "number"
      ? new Date(
          subscriptionWithPeriod.current_period_end *
            1000,
        )
      : null;

  const startedAt =
    typeof subscriptionWithPeriod.started_at ===
    "number"
      ? new Date(
          subscriptionWithPeriod.started_at * 1000,
        )
      : new Date();

  const cancelledAt =
    typeof subscriptionWithPeriod.canceled_at ===
    "number"
      ? new Date(
          subscriptionWithPeriod.canceled_at * 1000,
        )
      : subscription.status === "canceled"
        ? new Date()
        : null;

  await prisma.provider.update({
    where: {
      id: provider.id,
    },
    data: {
      stripeCustomerId:
        customerId || undefined,

      stripeSubscriptionId:
        subscription.id,

      subscriptionStatus:
        subscription.status.toUpperCase(),

      subscriptionCurrentPeriodEnd:
        currentPeriodEnd,

      subscriptionCancelAtPeriodEnd:
        subscription.cancel_at_period_end,

      subscriptionStartedAt:
        startedAt,

      subscriptionCancelledAt:
        cancelledAt,
    },
  });

  return {
    providerId: provider.id,
    subscriptionStatus:
      subscription.status.toUpperCase(),
  };
}
