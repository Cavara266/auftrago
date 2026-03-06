import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { requireUser } from "@/lib/auth";

export const runtime = "nodejs";

const PLANS = {
  starter: {
    credits: 20,
    price: 28,
  },
  pro: {
    credits: 50,
    price: 63,
  },
  business: {
    credits: 100,
    price: 112,
  },
};

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

export async function POST(req: Request) {
  try {
    const user = await requireUser();

    if (!user) {
      return NextResponse.json(
        { error: "Nicht eingeloggt." },
        { status: 401 }
      );
    }

    const body = await req.json().catch(() => null);
    const planId = String(body?.planId ?? "");

    const plan = PLANS[planId as keyof typeof PLANS];

    if (!plan) {
      return NextResponse.json(
        { error: "Ungültiges Paket." },
        { status: 400 }
      );
    }

    const baseUrl = getBaseUrl();

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "chf",
            product_data: {
              name: `${plan.credits} Credits`,
              description: `Auftrago Credits Paket mit ${plan.credits} Credits`,
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
        credits: String(plan.credits),
        planId,
      },
    });

    return NextResponse.json({
      url: session.url,
    });
  } catch (error) {
    console.error("STRIPE CHECKOUT ERROR:", error);

    const message =
      error instanceof Error ? error.message : "Serverfehler.";

    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}