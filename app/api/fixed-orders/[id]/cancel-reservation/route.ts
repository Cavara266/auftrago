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

export async function POST(
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

    if (
      fixedOrder.status === "SOLD" ||
      fixedOrder.status === "COMPLETED"
    ) {
      return NextResponse.json({
        ok: true,
        released: false,
        alreadyPaid: true,
      });
    }

    if (
      fixedOrder.status !== "RESERVED" ||
      fixedOrder.buyerId !== user.id
    ) {
      return NextResponse.json({
        ok: true,
        released: false,
      });
    }

    const released =
      await prisma.fixedOrder.updateMany({
        where: {
          id: fixedOrderId,
          status: "RESERVED",
          buyerId: user.id,
        },
        data: {
          status: "OPEN",
          buyerId: null,
          reservedAt: null,
          stripeCheckoutSessionId: null,
          stripePaymentIntentId: null,
        },
      });

    return NextResponse.json({
      ok: true,
      released: released.count === 1,
    });
  } catch (error) {
    console.error(
      "FIXED ORDER CANCEL RESERVATION ERROR:",
      error
    );

    return NextResponse.json(
      {
        ok: false,
        error:
          "Die Reservierung konnte nicht freigegeben werden.",
      },
      {
        status: 500,
      }
    );
  }
}