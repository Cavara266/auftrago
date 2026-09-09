import { NextResponse } from "next/server";
import Stripe from "stripe";

import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getBusinessSubscriptionAccess } from "@/lib/business/subscription-access";

export const dynamic = "force-dynamic";

const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY || ""
);

function appUrl() {
  return (
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "http://localhost:3000"
  ).replace(/\/$/, "");
}

export async function POST() {
  const user = await requireUser();

  if (!user) {
    return NextResponse.redirect(
      `${appUrl()}/login?redirect=/portal/business`,
      303
    );
  }

  const provider = await prisma.provider.findUnique({
    where: {
      id: user.id,
    },
    select: {
      id: true,
      email: true,

      subscriptionExempt: true,
      subscriptionStatus: true,
      subscriptionCurrentPeriodEnd: true,

      businessSubscriptionExempt: true,
      businessSubscriptionStatus: true,
      businessSubscriptionCurrentPeriodEnd: true,

      businessStripeCustomerId: true,
      businessStripeSubscriptionId: true,
    },
  });

  if (!provider) {
    return NextResponse.redirect(
      `${appUrl()}/portal`,
      303
    );
  }

  const access =
    getBusinessSubscriptionAccess(provider);

  // CHF 69 ist zwingende Voraussetzung
  if (!access.baseSubscriptionActive) {
    return NextResponse.redirect(
      `${appUrl()}/portal/business-upgrade?reason=base`,
      303
    );
  }

  // Bereits freigeschaltet
  if (access.businessSubscriptionActive) {
    return NextResponse.redirect(
      `${appUrl()}/portal/business`,
      303
    );
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      {
        error: "STRIPE_SECRET_KEY fehlt.",
      },
      {
        status: 500,
      }
    );
  }

  const configuredPriceId =
    process.env.STRIPE_BUSINESS_SUBSCRIPTION_PRICE_ID;

  /*
   * Wenn später eine feste Stripe Price-ID hinterlegt wird,
   * wird diese verwendet.
   *
   * Solange keine vorhanden ist, funktioniert der Checkout
   * trotzdem mit CHF 79 / Monat über price_data.
   */
  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] =
    configuredPriceId
      ? [
          {
            price: configuredPriceId,
            quantity: 1,
          },
        ]
      : [
          {
            quantity: 1,
            price_data: {
              currency: "chf",
              unit_amount: 7900,
              recurring: {
                interval: "month",
              },
              product_data: {
                name: "Auftrago Business",
                description:
                  "Business Cockpit, Kunden, Offerten, Rechnungen, Operations, Aufgaben, Kalender und Analytics.",
              },
            },
          },
        ];

  const session =
    await stripe.checkout.sessions.create({
      mode: "subscription",

      line_items: lineItems,

      customer:
        provider.businessStripeCustomerId ||
        undefined,

      customer_email:
        provider.businessStripeCustomerId
          ? undefined
          : provider.email || undefined,

      success_url:
        `${appUrl()}/portal/business-subscription-success` +
        `?session_id={CHECKOUT_SESSION_ID}`,

      cancel_url:
        `${appUrl()}/portal/business-upgrade` +
        `?reason=business&cancelled=1`,

      allow_promotion_codes: true,

      metadata: {
        providerId: provider.id,
        subscriptionType: "BUSINESS",
        plan: "business",
      },

      subscription_data: {
        metadata: {
          providerId: provider.id,
          subscriptionType: "BUSINESS",
          plan: "business",
        },
      },
    });

  if (!session.url) {
    return NextResponse.json(
      {
        error:
          "Stripe Checkout konnte nicht gestartet werden.",
      },
      {
        status: 500,
      }
    );
  }

  return NextResponse.redirect(
    session.url,
    303
  );
}
