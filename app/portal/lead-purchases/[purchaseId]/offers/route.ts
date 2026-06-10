import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = {
  params: {
    purchaseId: string;
  };
};

function clean(value: unknown) {
  return String(value || "").trim();
}

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

    const body = await req.json();

    const title = clean(body.title);
    const description = clean(body.description);
    const amount = Number(body.amount);

    if (!title || !amount || amount <= 0) {
      return NextResponse.json(
        { ok: false, error: "Bitte Titel und gültigen Betrag eingeben." },
        { status: 400 }
      );
    }

    const offer = await prisma.leadOffer.create({
      data: {
        leadPurchaseId: purchase.id,
        title,
        description: description || null,
        amount,
      },
    });

    await prisma.leadPurchase.update({
      where: {
        id: purchase.id,
      },
      data: {
        status: "OFFER_SENT",
      },
    });

    await prisma.leadActivity.create({
      data: {
        leadPurchaseId: purchase.id,
        type: "OFFER_CREATED",
        description: `Offerte erstellt (${amount} CHF)`,
      },
    });

    return NextResponse.json({
      ok: true,
      offer: {
        id: offer.id,
        title: offer.title,
        description: offer.description,
        amount: offer.amount,
        status: offer.status,
        pdfUrl: offer.pdfUrl,
        createdAt: offer.createdAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("LEAD OFFER ERROR:", error);

    return NextResponse.json(
      { ok: false, error: "Offerte konnte nicht erstellt werden." },
      { status: 500 }
    );
  }
}