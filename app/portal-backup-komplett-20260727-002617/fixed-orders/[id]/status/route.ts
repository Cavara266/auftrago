import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

type RouteContext = {
  params: {
    id: string;
  };
};

export async function GET(
  _request: Request,
  context: RouteContext
) {
  try {
    const user = await requireUser();

    if (!user) {
      return NextResponse.json(
        {
          ok: false,
          error: "Nicht eingeloggt.",
        },
        {
          status: 401,
        }
      );
    }

    const fixedOrderId = context.params.id?.trim();

    if (!fixedOrderId) {
      return NextResponse.json(
        {
          ok: false,
          error: "Fixauftrag fehlt.",
        },
        {
          status: 400,
        }
      );
    }

    const fixedOrder =
      await prisma.fixedOrder.findUnique({
        where: {
          id: fixedOrderId,
        },
        select: {
          id: true,
          status: true,
          buyerId: true,
          stripeCheckoutSessionId: true,
          stripePaymentIntentId: true,
          soldAt: true,
        },
      });

    if (!fixedOrder) {
      return NextResponse.json(
        {
          ok: false,
          error: "Fixauftrag wurde nicht gefunden.",
        },
        {
          status: 404,
        }
      );
    }

    const isOwner =
      fixedOrder.buyerId === user.id &&
      (fixedOrder.status === "SOLD" ||
        fixedOrder.status === "COMPLETED");

    return NextResponse.json({
      ok: true,
      status: fixedOrder.status,
      isOwner,
      customerUrl: isOwner
        ? `/portal/fixed-orders/${fixedOrder.id}/customer`
        : null,
      soldAt: fixedOrder.soldAt,
      hasStripeSession:
        Boolean(
          fixedOrder.stripeCheckoutSessionId
        ),
      hasPaymentIntent:
        Boolean(
          fixedOrder.stripePaymentIntentId
        ),
    });
  } catch (error) {
    console.error(
      "FIXED ORDER STATUS ERROR:",
      error
    );

    return NextResponse.json(
      {
        ok: false,
        error:
          "Der Auftragsstatus konnte nicht geladen werden.",
      },
      {
        status: 500,
      }
    );
  }
}