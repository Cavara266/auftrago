import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type PlanId =
  | "starter"
  | "pro"
  | "business"
  | "agency"
  | "enterprise";

type CreditPlan = {
  name: string;
  credits: number;
  priceId: string;
};

const CREDIT_PLANS: Record<PlanId, CreditPlan> = {
  starter: {
    name: "20 Credits",
    credits: 20,
    priceId: "price_1Ts63WJzn0dPpvjkCd5nEWh2",
  },

  pro: {
    name: "50 Credits",
    credits: 50,
    priceId: "price_1Ts683Jzn0dPpvjkzMw2f0mY",
  },

  business: {
    name: "100 Credits",
    credits: 100,
    priceId: "price_1Ts68gJzn0dPpvjkCFREz5cb",
  },

  agency: {
    name: "250 Credits",
    credits: 250,
    priceId: "price_1Ts69PJzn0dPpvjkryXntIeu",
  },

  enterprise: {
    name: "500 Credits",
    credits: 500,
    priceId: "price_1Ts69yJzn0dPpvjkDESB2YRb",
  },
};

function isValidPlanId(value: unknown): value is PlanId {
  return (
    value === "starter" ||
    value === "pro" ||
    value === "business" ||
    value === "agency" ||
    value === "enterprise"
  );
}

function getBaseUrl(request: Request) {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (configuredUrl) {
    return configuredUrl.replace(/\/$/, "");
  }

  const origin = request.headers.get("origin");

  if (origin) {
    return origin.replace(/\/$/, "");
  }

  return "https://auftrago.ch";
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const planId = body?.planId;

    if (!isValidPlanId(planId)) {
      return NextResponse.json(
        {
          ok: false,
          error: "Ungültiges Credit-Paket.",
        },
        {
          status: 400,
        }
      );
    }

    const selectedPlan = CREDIT_PLANS[planId];
    const baseUrl = getBaseUrl(request);

    const session = await stripe.checkout.sessions.create({
      mode: "payment",

      line_items: [
        {
          price: selectedPlan.priceId,
          quantity: 1,
        },
      ],

      allow_promotion_codes: true,

      billing_address_collection: "auto",

      success_url: `${baseUrl}/credits/success?session_id={CHECKOUT_SESSION_ID}`,

      cancel_url: `${baseUrl}/credits/cancel`,

      metadata: {
        planId,
        credits: String(selectedPlan.credits),
        packageName: selectedPlan.name,
      },

      payment_intent_data: {
        metadata: {
          planId,
          credits: String(selectedPlan.credits),
          packageName: selectedPlan.name,
        },
      },
    });

    if (!session.url) {
      return NextResponse.json(
        {
          ok: false,
          error: "Stripe hat keine Checkout-URL erstellt.",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json({
      ok: true,
      url: session.url,
    });
  } catch (error) {
    console.error("Stripe Checkout Fehler:", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Der Stripe Checkout konnte nicht gestartet werden.",
      },
      {
        status: 500,
      }
    );
  }
}