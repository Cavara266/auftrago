import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { requireUser } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const RESERVATION_MINUTES = 30;

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

function getReservationExpiryDate() {
  return new Date(
    Date.now() - RESERVATION_MINUTES * 60 * 1000
  );
}

function getStripeExpiryTimestamp() {
  return Math.floor(
    (Date.now() + RESERVATION_MINUTES * 60 * 1000) /
      1000
  );
}

export async function POST(request: Request) {
  let reservedOrderId: string | null = null;
  let providerId: string | null = null;

  try {
    const user = await requireUser();

    if (!user) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Du musst eingeloggt sein, um einen Fixauftrag zu übernehmen.",
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

    providerId = user.id;

    const body = await request.json().catch(() => null);

    const fixedOrderId =
      typeof body?.fixedOrderId === "string"
        ? body.fixedOrderId.trim()
        : "";

    if (!fixedOrderId) {
      return NextResponse.json(
        {
          ok: false,
          error: "Der Fixauftrag fehlt.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * Eine abgelaufene Reservierung dieses Auftrags wird
     * automatisch wieder freigegeben.
     */
    await prisma.fixedOrder.updateMany({
      where: {
        id: fixedOrderId,
        status: "RESERVED",
        reservedAt: {
          lt: getReservationExpiryDate(),
        },
      },
      data: {
        status: "OPEN",
        buyerId: null,
        reservedAt: null,
        stripeCheckoutSessionId: null,
        stripePaymentIntentId: null,
      },
    });

    /*
     * Den Auftrag atomar reservieren.
     * updateMany verhindert Doppelreservierungen.
     */
    const reservation = await prisma.fixedOrder.updateMany({
      where: {
        id: fixedOrderId,
        status: "OPEN",
        buyerId: null,
      },
      data: {
        status: "RESERVED",
        buyerId: user.id,
        reservedAt: new Date(),
      },
    });

    if (reservation.count !== 1) {
      const existingOrder =
        await prisma.fixedOrder.findUnique({
          where: {
            id: fixedOrderId,
          },
          select: {
            id: true,
            status: true,
            buyerId: true,
          },
        });

      if (!existingOrder) {
        return NextResponse.json(
          {
            ok: false,
            error: "Der Fixauftrag wurde nicht gefunden.",
          },
          {
            status: 404,
          }
        );
      }

      const isReservedByCurrentProvider =
        existingOrder.status === "RESERVED" &&
        existingOrder.buyerId === user.id;

      if (!isReservedByCurrentProvider) {
        return NextResponse.json(
          {
            ok: false,
            error:
              existingOrder.status === "SOLD" ||
              existingOrder.status === "COMPLETED"
                ? "Dieser Auftrag wurde bereits vergeben."
                : existingOrder.status === "CANCELLED"
                  ? "Dieser Auftrag ist nicht mehr verfügbar."
                  : "Dieser Auftrag wird momentan von einem anderen Anbieter übernommen.",
          },
          {
            status: 409,
          }
        );
      }
    }

    reservedOrderId = fixedOrderId;

    const fixedOrder =
      await prisma.fixedOrder.findUnique({
        where: {
          id: fixedOrderId,
        },
        select: {
          id: true,
          title: true,
          category: true,
          city: true,
          orderValueCents: true,
          commissionPercent: true,
          commissionAmountCents: true,
          status: true,
          buyerId: true,
        },
      });

    if (!fixedOrder) {
      throw new Error("FIXED_ORDER_NOT_FOUND");
    }

    if (
      fixedOrder.status !== "RESERVED" ||
      fixedOrder.buyerId !== user.id
    ) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Der Auftrag konnte nicht für dich reserviert werden.",
        },
        {
          status: 409,
        }
      );
    }

    if (
      !Number.isInteger(
        fixedOrder.commissionAmountCents
      ) ||
      fixedOrder.commissionAmountCents < 50
    ) {
      throw new Error("INVALID_COMMISSION_AMOUNT");
    }

    const baseUrl = getBaseUrl(request);

    const session =
      await stripe.checkout.sessions.create({
        mode: "payment",

        client_reference_id: user.id,
        customer_email: user.email,

        line_items: [
          {
            price_data: {
              currency: "chf",
              unit_amount:
                fixedOrder.commissionAmountCents,
              product_data: {
                name: `Fixauftrag: ${fixedOrder.title}`,
                description:
                  `${fixedOrder.category} in ${fixedOrder.city} – ` +
                  `${fixedOrder.commissionPercent} % Vermittlungsgebühr`,
              },
            },
            quantity: 1,
          },
        ],

        billing_address_collection: "auto",

        expires_at: getStripeExpiryTimestamp(),

        success_url:
          `${baseUrl}/portal/fixed-orders/${fixedOrder.id}` +
          `?payment=success` +
          `&session_id={CHECKOUT_SESSION_ID}`,

        cancel_url:
          `${baseUrl}/portal/fixed-orders/${fixedOrder.id}` +
          `?payment=cancelled`,

        metadata: {
          type: "fixed-order",
          providerId: user.id,
          fixedOrderId: fixedOrder.id,
          orderValueCents: String(
            fixedOrder.orderValueCents
          ),
          commissionAmountCents: String(
            fixedOrder.commissionAmountCents
          ),
        },

        payment_intent_data: {
          metadata: {
            type: "fixed-order",
            providerId: user.id,
            fixedOrderId: fixedOrder.id,
          },
        },
      });

    if (!session.url) {
      throw new Error("STRIPE_URL_MISSING");
    }

    const sessionUpdate =
      await prisma.fixedOrder.updateMany({
        where: {
          id: fixedOrder.id,
          status: "RESERVED",
          buyerId: user.id,
        },
        data: {
          stripeCheckoutSessionId: session.id,
        },
      });

    if (sessionUpdate.count !== 1) {
      throw new Error("RESERVATION_LOST");
    }

    return NextResponse.json({
      ok: true,
      url: session.url,
      sessionId: session.id,
    });
  } catch (error) {
    console.error(
      "FIXED ORDER CHECKOUT ERROR:",
      error
    );

    /*
     * Falls Stripe nicht gestartet werden konnte, wird nur
     * eine noch nicht mit Stripe verknüpfte Reservierung
     * des aktuellen Anbieters freigegeben.
     */
    if (reservedOrderId && providerId) {
      await prisma.fixedOrder
        .updateMany({
          where: {
            id: reservedOrderId,
            status: "RESERVED",
            buyerId: providerId,
            stripeCheckoutSessionId: null,
          },
          data: {
            status: "OPEN",
            buyerId: null,
            reservedAt: null,
          },
        })
        .catch((releaseError) => {
          console.error(
            "FIXED ORDER RESERVATION RELEASE FAILED:",
            releaseError
          );
        });
    }

    return NextResponse.json(
      {
        ok: false,
        error:
          "Der Stripe Checkout konnte nicht gestartet werden.",
      },
      {
        status: 500,
      }
    );
  }
}