import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { requireUser } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

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

  return "https://www.auftrago.ch";
}

export async function POST(request: Request) {
  try {
    /*
     * Der eingeloggte Anbieter wird ausschliesslich serverseitig
     * aus der Session geladen. Eine fremde providerId kann deshalb
     * nicht über den Browser eingeschleust werden.
     */
    const user = await requireUser();

    if (!user) {
      return NextResponse.json(
        {
          ok: false,
          error: "Du musst eingeloggt sein, um Credits zu kaufen.",
        },
        {
          status: 401,
        }
      );
    }

    if (user.status !== "APPROVED") {
      return NextResponse.json(
        {
          ok: false,
          error:
            user.status === "PENDING"
              ? "Dein Anbieterkonto wird noch geprüft."
              : "Dein Anbieterkonto wurde gesperrt.",
        },
        {
          status: 403,
        }
      );
    }

    const body = await request.json().catch(() => null);
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

      /*
       * Interne Zuordnung der Zahlung zum Anbieter.
       */
      client_reference_id: user.id,

      customer_email: user.email,

      line_items: [
        {
          price: selectedPlan.priceId,
          quantity: 1,
        },
      ],

      allow_promotion_codes: true,

      billing_address_collection: "auto",

      /*
       * Nach erfolgreicher Zahlung direkt zurück ins Dashboard.
       */
      success_url:
        `${baseUrl}/portal` +
        `?payment=success` +
        `&session_id={CHECKOUT_SESSION_ID}`,

      /*
       * Bei abgebrochener Zahlung zurück zur Guthaben-Seite.
       */
      cancel_url:
        `${baseUrl}/portal/guthaben` +
        `?payment=cancelled`,

      /*
       * Diese Angaben liest der Stripe-Webhook aus.
       */
      metadata: {
        providerId: user.id,
        packageId: planId,
        planId,
        credits: String(selectedPlan.credits),
        packageName: selectedPlan.name,
      },

      /*
       * Metadaten zusätzlich am PaymentIntent speichern.
       */
      payment_intent_data: {
        metadata: {
          providerId: user.id,
          packageId: planId,
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
      sessionId: session.id,
    });
  } catch (error) {
    console.error("STRIPE CHECKOUT ERROR:", error);

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