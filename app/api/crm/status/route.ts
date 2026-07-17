import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const ALLOWED_STATUSES = [
  "OPEN",
  "CONTACTED",
  "APPOINTMENT_SET",
  "OFFER_SENT",
  "WON",
  "LOST",
  "NO_OFFER",
] as const;

type AllowedStatus = (typeof ALLOWED_STATUSES)[number];

function isAllowedStatus(value: unknown): value is AllowedStatus {
  return (
    typeof value === "string" &&
    ALLOWED_STATUSES.includes(value as AllowedStatus)
  );
}

function statusLabel(status: AllowedStatus) {
  switch (status) {
    case "OPEN":
      return "Neu";
    case "CONTACTED":
      return "Kontaktiert";
    case "APPOINTMENT_SET":
      return "Termin vereinbart";
    case "OFFER_SENT":
      return "Offerte gesendet";
    case "WON":
      return "Gewonnen";
    case "LOST":
      return "Verloren";
    case "NO_OFFER":
      return "Keine Offerte";
  }
}

export async function PATCH(request: Request) {
  try {
    const user = await requireUser();

    if (!user) {
      return NextResponse.json(
        {
          ok: false,
          message: "Nicht angemeldet.",
        },
        {
          status: 401,
        }
      );
    }

    const body = await request.json().catch(() => null);

    const purchaseId =
      typeof body?.purchaseId === "string" ? body.purchaseId.trim() : "";

    const nextStatus = body?.status;

    if (!purchaseId) {
      return NextResponse.json(
        {
          ok: false,
          message: "Die Lead-Freischaltung fehlt.",
        },
        {
          status: 400,
        }
      );
    }

    if (!isAllowedStatus(nextStatus)) {
      return NextResponse.json(
        {
          ok: false,
          message: "Der ausgewählte Status ist ungültig.",
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
          message: "Diese Kundenanfrage wurde nicht gefunden.",
        },
        {
          status: 404,
        }
      );
    }

    if (purchase.status === nextStatus) {
      return NextResponse.json({
        ok: true,
        status: purchase.status,
        activity: null,
      });
    }

    const result = await prisma.$transaction(async (tx) => {
      const updatedPurchase = await tx.leadPurchase.update({
        where: {
          id: purchase.id,
        },
        data: {
          status: nextStatus,
        },
        select: {
          id: true,
          status: true,
          updatedAt: true,
        },
      });

      const activity = await tx.leadActivity.create({
        data: {
          leadPurchaseId: purchase.id,
          type: "STATUS_CHANGED",
          description: `Status geändert: ${statusLabel(nextStatus)}`,
        },
        select: {
          id: true,
          type: true,
          description: true,
          createdAt: true,
        },
      });

      return {
        updatedPurchase,
        activity,
      };
    });

    return NextResponse.json({
      ok: true,
      status: result.updatedPurchase.status,
      activity: {
        ...result.activity,
        createdAt: result.activity.createdAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("CRM STATUS PATCH ERROR:", error);

    return NextResponse.json(
      {
        ok: false,
        message: "Status konnte nicht gespeichert werden.",
      },
      {
        status: 500,
      }
    );
  }
}