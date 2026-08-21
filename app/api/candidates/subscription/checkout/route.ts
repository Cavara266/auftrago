import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { requireCandidate } from "@/lib/candidate-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const ACTIVE_SUBSCRIPTION_STATUSES = new Set(["ACTIVE", "TRIALING"]);

export async function POST(request: Request) {
  try {
    const user = await requireCandidate();

    const account = await prisma.candidateAccount.findUnique({
      where: {
        id: user.id,
      },
      include: {
        candidateProfile: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    if (!account) {
      return NextResponse.redirect(
        new URL("/arbeit-suchen/login", request.url),
        303,
      );
    }

    if (
      account.subscriptionExempt ||
      ACTIVE_SUBSCRIPTION_STATUSES.has(
        (account.subscriptionStatus || "").toUpperCase(),
      )
    ) {
      return NextResponse.redirect(
        new URL("/arbeit-suchen/konto?subscription=active", request.url),
        303,
      );
    }

    const priceId = process.env.STRIPE_TALENT_SUBSCRIPTION_PRICE_ID;

    if (!priceId) {
      throw new Error("STRIPE_TALENT_SUBSCRIPTION_PRICE_ID fehlt.");
    }

    let stripeCustomerId = account.stripeCustomerId;

    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: account.candidateProfile.email || user.email || undefined,
        name:
          [
            account.candidateProfile.firstName,
            account.candidateProfile.lastName,
          ]
            .filter(Boolean)
            .join(" ") || undefined,
        metadata: {
          accountType: "candidate",
          candidateAccountId: account.id,
          candidateProfileId: account.candidateProfileId,
        },
      });

      stripeCustomerId = customer.id;

      await prisma.candidateAccount.update({
        where: {
          id: account.id,
        },
        data: {
          stripeCustomerId,
        },
      });
    }

    const origin = new URL(request.url).origin;

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: stripeCustomerId,
      client_reference_id: account.id,

      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],

      success_url: `${origin}/arbeit-suchen/konto?subscription=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/arbeit-suchen/abo?cancelled=1`,

      allow_promotion_codes: true,

      metadata: {
        accountType: "candidate",
        candidateAccountId: account.id,
        candidateProfileId: account.candidateProfileId,
      },

      subscription_data: {
        metadata: {
          accountType: "candidate",
          candidateAccountId: account.id,
          candidateProfileId: account.candidateProfileId,
        },
      },
    });

    if (!session.url) {
      throw new Error("Stripe Checkout URL fehlt.");
    }

    return NextResponse.redirect(session.url, 303);
  } catch (error) {
    console.error("===== TALENT SUBSCRIPTION CHECKOUT ERROR =====");
    console.error(error);
    console.error("==============================================");

    return NextResponse.redirect(
      new URL("/arbeit-suchen/abo?error=checkout", request.url),
      303,
    );
  }
}
