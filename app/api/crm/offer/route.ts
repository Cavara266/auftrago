import { LeadStatus, OfferStatus } from "@prisma/client";
import { NextResponse } from "next/server";

import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ALLOWED_STATUSES = new Set<OfferStatus>([
  OfferStatus.SENT,
  OfferStatus.ACCEPTED,
  OfferStatus.DECLINED,
]);

export async function POST(request: Request) {
  try {
    const user = await requireUser();

    if (!user || user.status !== "APPROVED") {
      return NextResponse.json(
        {
          ok: false,
          message: "Nicht autorisiert.",
        },
        {
          status: 401,
        }
      );
    }

    const body = await request.json().catch(() => null);

    const purchaseId = String(body?.purchaseId || "").trim();
    const title = String(body?.title || "").trim();
    const description = body?.description
      ? String(body.description).trim()
      : null;
    const amount = Number(body?.amount);

    if (
      !purchaseId ||
      !title ||
      title.length > 150 ||
      (description && description.length > 3000) ||
      !Number.isFinite(amount) ||
      amount <= 0 ||
      amount > 10000000
    ) {
      return NextResponse.json(
        {
          ok: false,
          message: "Bitte Eingaben prüfen.",
        },
        {
          status: 400,
        }
      );
    }

    const purchase = await prisma.leadPurchase.findFirst({
      where: {
        id: purchaseId,
        providerId: user.id,
      },
      select: {
        id: true,
        status: true,
      },
    });

    if (!purchase) {
      return NextResponse.json(
        {
          ok: false,
          message: "Freigeschalteter Lead nicht gefunden.",
        },
        {
          status: 404,
        }
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      const offer = await tx.leadOffer.create({
        data: {
          leadPurchaseId: purchase.id,
          title,
          description,
          amount,
          status: OfferStatus.SENT,
        },
        select: {
          id: true,
          title: true,
          description: true,
          amount: true,
          status: true,
          pdfUrl: true,
          createdAt: true,
        },
      });

      await tx.leadActivity.create({
        data: {
          leadPurchaseId: purchase.id,
          type: "OFFER_CREATED",
          description: `Offerte erstellt: CHF ${amount.toLocaleString(
            "de-CH"
          )}`,
        },
      });

      if (purchase.status !== LeadStatus.WON) {
        await tx.leadPurchase.update({
          where: {
            id: purchase.id,
          },
          data: {
            status: LeadStatus.OFFER_SENT,
          },
        });
      }

      return offer;
    });

    return NextResponse.json({
      ok: true,
      offer: {
        ...result,
        createdAt: result.createdAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("CRM OFFER CREATE ERROR:", error);

    return NextResponse.json(
      {
        ok: false,
        message: "Offerte konnte nicht erstellt werden.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const user = await requireUser();

    if (!user || user.status !== "APPROVED") {
      return NextResponse.json(
        {
          ok: false,
          message: "Nicht autorisiert.",
        },
        {
          status: 401,
        }
      );
    }

    const body = await request.json().catch(() => null);

    const offerId = String(body?.offerId || "").trim();
    const status = String(body?.status || "").trim() as OfferStatus;

    if (!offerId || !ALLOWED_STATUSES.has(status)) {
      return NextResponse.json(
        {
          ok: false,
          message: "Ungültige Anfrage.",
        },
        {
          status: 400,
        }
      );
    }

    const offer = await prisma.leadOffer.findFirst({
      where: {
        id: offerId,
        leadPurchase: {
          providerId: user.id,
        },
      },
      select: {
        id: true,
        status: true,
        leadPurchaseId: true,
      },
    });

    if (!offer) {
      return NextResponse.json(
        {
          ok: false,
          message: "Offerte nicht gefunden.",
        },
        {
          status: 404,
        }
      );
    }

    await prisma.$transaction(async (tx) => {
      await tx.leadOffer.update({
        where: {
          id: offer.id,
        },
        data: {
          status,
        },
      });

      await tx.leadActivity.create({
        data: {
          leadPurchaseId: offer.leadPurchaseId,
          type: "OFFER_STATUS_CHANGED",
          description: `Offertenstatus geändert: ${offer.status} → ${status}`,
        },
      });

      if (status === OfferStatus.ACCEPTED) {
        await tx.leadPurchase.update({
          where: {
            id: offer.leadPurchaseId,
          },
          data: {
            status: LeadStatus.WON,
          },
        });
      }
    });

    return NextResponse.json({
      ok: true,
      status,
    });
  } catch (error) {
    console.error("CRM OFFER STATUS ERROR:", error);

    return NextResponse.json(
      {
        ok: false,
        message: "Offertenstatus konnte nicht geändert werden.",
      },
      {
        status: 500,
      }
    );
  }
}