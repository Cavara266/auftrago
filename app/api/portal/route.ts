import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { LeadStatus } from "@prisma/client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const statusLabels: Record<LeadStatus, string> = {
  OPEN: "Offene Anfrage",
  CONTACTED: "Kontaktiert",
  APPOINTMENT_SET: "Termin abgemacht",
  OFFER_SENT: "Offerte geschickt",
  WON: "Auftrag gewonnen",
  LOST: "Auftrag verloren",
  NO_OFFER: "Kein Angebot gemacht",
};

type RouteContext = {
  params: {
    purchaseId: string;
  };
};

export async function POST(req: Request, context: RouteContext) {
  try {
    const cookieStore = await cookies();
    const providerId = cookieStore.get("auftrago_session")?.value;

    if (!providerId) {
      return NextResponse.json(
        { ok: false, error: "Nicht eingeloggt." },
        { status: 401 }
      );
    }

    const { status } = await req.json();

    if (!status || !(status in LeadStatus)) {
      return NextResponse.json(
        { ok: false, error: "Ungültiger Status." },
        { status: 400 }
      );
    }

    const purchase = await prisma.leadPurchase.findFirst({
      where: {
        id: context.params.purchaseId,
        providerId,
      },
    });

    if (!purchase) {
      return NextResponse.json(
        { ok: false, error: "Lead nicht gefunden." },
        { status: 404 }
      );
    }

    const updatedPurchase = await prisma.leadPurchase.update({
      where: {
        id: purchase.id,
      },
      data: {
        status,
      },
    });

    await prisma.leadActivity.create({
      data: {
        leadPurchaseId: purchase.id,
        type: "STATUS_CHANGED",
        description: `Status geändert auf "${statusLabels[status as LeadStatus]}"`,
      },
    });

    return NextResponse.json({
      ok: true,
      status: updatedPurchase.status,
    });
  } catch (error) {
    console.error("LEAD STATUS ERROR:", error);

    return NextResponse.json(
      { ok: false, error: "Status konnte nicht geändert werden." },
      { status: 500 }
    );
  }
}