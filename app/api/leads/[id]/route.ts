import { NextResponse } from "next/server";

import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { calculateSmartPrice } from "@/lib/smart-pricing";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

type RouteContext = {
  params: {
    id: string;
  };
};

export async function GET(
  _req: Request,
  ctx: RouteContext
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

    const id = ctx.params.id;

    if (!id) {
      return NextResponse.json(
        {
          ok: false,
          error: "Ungültige Lead-ID.",
        },
        {
          status: 400,
        }
      );
    }

    const lead = await prisma.lead.findUnique({
      where: {
        id,
      },
    });

    if (!lead) {
      return NextResponse.json(
        {
          ok: false,
          error: "Lead nicht gefunden.",
        },
        {
          status: 404,
        }
      );
    }

    const [userUnlock, latestUnlock] =
      await Promise.all([
        prisma.unlock.findFirst({
          where: {
            userId: user.id,
            leadId: id,
          },

          select: {
            id: true,
          },
        }),

        prisma.unlock.findFirst({
          where: {
            leadId: id,
          },

          orderBy: {
            createdAt: "desc",
          },

          select: {
            createdAt: true,
          },
        }),
      ]);

    const smartPrice = calculateSmartPrice({
      originalPrice: lead.price,
      createdAt: lead.createdAt,
      lastPurchaseAt:
        latestUnlock?.createdAt ?? null,
    });

    const pricing = {
      price: smartPrice.currentPrice,
      originalPrice:
        smartPrice.originalPrice,
      currentPrice:
        smartPrice.currentPrice,
      discountPercent:
        smartPrice.discountPercent,
      discountAmount:
        smartPrice.discountAmount,
      isDiscounted:
        smartPrice.isDiscounted,
      discountLabel:
        smartPrice.label,
      nextDiscountAt:
        smartPrice.nextDiscountAt,
    };

    if (!userUnlock) {
      return NextResponse.json({
        ok: true,

        lead: {
          ...lead,
          ...pricing,

          locked: true,

          contactName: null,
          contactPhone: null,
          contactEmail: null,

          name: null,
          phone: null,
          email: null,
        },
      });
    }

    return NextResponse.json({
      ok: true,

      lead: {
        ...lead,
        ...pricing,
        locked: false,
      },
    });
  } catch (error) {
    console.error("LEAD GET ERROR:", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Serverfehler.",
      },
      {
        status: 500,
      }
    );
  }
}