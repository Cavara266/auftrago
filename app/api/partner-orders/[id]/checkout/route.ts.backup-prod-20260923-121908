import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { requireUser } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

function getBaseUrl(request: Request) {
  const configuredUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    process.env.NEXT_PUBLIC_APP_URL?.trim();

  if (configuredUrl) {
    return configuredUrl.replace(/\/$/, "");
  }

  const origin = request.headers.get("origin");

  if (origin) {
    return origin.replace(/\/$/, "");
  }

  return "https://www.auftrago.ch";
}

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function POST(request: Request, context: RouteContext) {
  try {
    const user = await requireUser();

    if (!user) {
      return NextResponse.json(
        {
          ok: false,
          error: "Du musst eingeloggt sein.",
        },
        { status: 401 }
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
        { status: 403 }
      );
    }

    const { id } = await context.params;

    const order = await prisma.partnerOrder.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        title: true,
        category: true,
        city: true,
        status: true,
        selectedProviderId: true,
        partnerAmountCents: true,
        commissionCents: true,
        commissionPaidAt: true,
      },
    });

    if (!order) {
      return NextResponse.json(
        {
          ok: false,
          error: "Auftrag wurde nicht gefunden.",
        },
        { status: 404 }
      );
    }

    if (order.selectedProviderId !== user.id) {
      return NextResponse.json(
        {
          ok: false,
          error: "Dieser Auftrag wurde nicht dir zugeteilt.",
        },
        { status: 403 }
      );
    }

    if (order.status === "UNLOCKED" || order.commissionPaidAt) {
      return NextResponse.json(
        {
          ok: false,
          error: "Die Provision wurde bereits bezahlt.",
        },
        { status: 409 }
      );
    }

    if (order.status !== "PAYMENT_PENDING") {
      return NextResponse.json(
        {
          ok: false,
          error: "Für diesen Auftrag ist aktuell keine Zahlung möglich.",
        },
        { status: 409 }
      );
    }

    const commissionCents =
      order.commissionCents ??
      Math.max(
        Math.round(order.partnerAmountCents * 0.12),
        2500
      );

    if (!Number.isInteger(commissionCents) || commissionCents < 50) {
      return NextResponse.json(
        {
          ok: false,
          error: "Ungültiger Provisionsbetrag.",
        },
        { status: 400 }
      );
    }

    const baseUrl = getBaseUrl(request);

    const session = await stripe.checkout.sessions.create({
      mode: "payment",

      client_reference_id: user.id,
      customer_email: user.email,

      line_items: [
        {
          price_data: {
            currency: "chf",
            unit_amount: commissionCents,
            product_data: {
              name: `Auftrago Provision: ${order.title}`,
              description:
                `${order.category}` +
                (order.city ? ` in ${order.city}` : "") +
                " – 12 % Vermittlungsprovision",
            },
          },
          quantity: 1,
        },
      ],

      billing_address_collection: "auto",

      success_url:
        `${baseUrl}/portal` +
        `?partnerOrderPayment=success` +
        `&orderId=${order.id}` +
        `&session_id={CHECKOUT_SESSION_ID}`,

      cancel_url:
        `${baseUrl}/portal` +
        `?partnerOrderPayment=cancelled` +
        `&orderId=${order.id}`,

      metadata: {
        type: "partner-order",
        providerId: user.id,
        partnerOrderId: order.id,
        commissionCents: String(commissionCents),
      },

      payment_intent_data: {
        metadata: {
          type: "partner-order",
          providerId: user.id,
          partnerOrderId: order.id,
        },
      },
    });

    if (!session.url) {
      throw new Error("STRIPE_URL_MISSING");
    }

    const updated = await prisma.partnerOrder.updateMany({
      where: {
        id: order.id,
        status: "PAYMENT_PENDING",
        selectedProviderId: user.id,
      },
      data: {
        stripeCheckoutSessionId: session.id,
        commissionCents,
      },
    });

    if (updated.count !== 1) {
      throw new Error("PARTNER_ORDER_UPDATE_FAILED");
    }

    return NextResponse.json({
      ok: true,
      url: session.url,
      sessionId: session.id,
      commissionCHF: commissionCents / 100,
    });
  } catch (error) {
    console.error("PARTNER ORDER CHECKOUT ERROR:", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Stripe Checkout konnte nicht gestartet werden.",
      },
      { status: 500 }
    );
  }
}
