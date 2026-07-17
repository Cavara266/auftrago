import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const MAX_NOTE_LENGTH = 5000;

export async function POST(request: Request) {
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

    const content =
      typeof body?.content === "string" ? body.content.trim() : "";

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

    if (!content) {
      return NextResponse.json(
        {
          ok: false,
          message: "Bitte gib eine Notiz ein.",
        },
        {
          status: 400,
        }
      );
    }

    if (content.length > MAX_NOTE_LENGTH) {
      return NextResponse.json(
        {
          ok: false,
          message: `Die Notiz darf höchstens ${MAX_NOTE_LENGTH} Zeichen enthalten.`,
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

    const result = await prisma.$transaction(async (tx) => {
      const note = await tx.leadNote.create({
        data: {
          leadPurchaseId: purchase.id,
          content,
        },
        select: {
          id: true,
          content: true,
          createdAt: true,
        },
      });

      const activity = await tx.leadActivity.create({
        data: {
          leadPurchaseId: purchase.id,
          type: "NOTE_ADDED",
          description: "Notiz hinzugefügt",
        },
        select: {
          id: true,
          type: true,
          description: true,
          createdAt: true,
        },
      });

      return {
        note,
        activity,
      };
    });

    return NextResponse.json({
      ok: true,
      note: {
        ...result.note,
        createdAt: result.note.createdAt.toISOString(),
      },
      activity: {
        ...result.activity,
        createdAt: result.activity.createdAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("CRM NOTE POST ERROR:", error);

    return NextResponse.json(
      {
        ok: false,
        message: "Notiz konnte nicht gespeichert werden.",
      },
      {
        status: 500,
      }
    );
  }
}