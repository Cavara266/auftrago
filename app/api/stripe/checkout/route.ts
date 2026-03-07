import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { requireUser } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const PLANS = {
  starter: {
    id: "starter",
    credits: 20,
    price: 28,
    name: "Starter",
  },
  pro: {
    id: "pro",
    credits: 50,
    price: 63,
    name: "Pro",
  },
  business: {
    id: "business",
    credits: 100,
    price: 112,
    name: "Business",
  },
} as const;

type PlanId = keyof typeof PLANS;

function getBaseUrl() {
  const raw = process.env.NEXT_PUBLIC_APP_URL?.trim();

  if (!raw) {
    throw new Error("NEXT_PUBLIC_APP_URL fehlt.");
  }

  const normalized = raw.replace(/\/+$/, "");

  if (
    !normalized.startsWith("http://") &&
    !normalized.startsWith("https://")
  ) {
    throw new Error(
      "NEXT_PUBLIC_APP_URL muss mit http:// oder https:// beginnen."
    );
  }

  return normalized;
}

function isPlanId(value: string): value is PlanId {
  return value in PLANS;
}

export async function POST(req: Request) {
  try {
    const user = await requireUser();

    if (!user) {
      return NextResponse.json(
        { ok: false, error: "Nicht eingeloggt." },
        { status: 401 }
      );
    }

    const body = await req.json().catch(() => null);
    const planId = String(body?.planId ?? "").trim();

    if (!isPlanId(planId)) {
      return NextResponse.json(
        { ok: false, error: "Ungültiges Paket." },
        { status: 400 }
      );
    }

    const plan = PLANS[planId];
    const baseUrl = getBaseUrl();

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: user.email,
      line_items: [
        {
          price_data: {
            currency: "chf",
            product_data: {
              name: `${plan.credits} Credits`,
              description: `Auftrago Credits Paket ${plan.name} mit ${plan.credits} Credits`,
            },
            unit_amount: plan.price * 100,
          },
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/credits/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/credits`,
      metadata: {
        userId: String(user.id),
        userEmail: String(user.email),
        credits: String(plan.credits),
        planId: plan.id,
        planName: plan.name,
      },
    });

    if (!session.url) {
      return NextResponse.json(
        { ok: false, error: "Keine Stripe URL erhalten." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      url: session.url,
    });
  } catch (error) {
    console.error("STRIPE CHECKOUT ERROR:", error);

    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Serverfehler.",
      },
      { status: 500 }
    );
  }
}