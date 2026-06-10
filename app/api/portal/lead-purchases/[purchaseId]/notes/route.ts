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

    const data = await req.json();
    const content = clean(data.content);

    if (!content) {
      return NextResponse.json(
        { ok: false, error: "Bitte eine Notiz eingeben." },
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

    const note = await prisma.leadNote.create({
      data: {
        leadPurchaseId: purchase.id,
        content,
      },
    });

    await prisma.leadActivity.create({
      data: {
        leadPurchaseId: purchase.id,
        type: "NOTE_CREATED",
        description: "Notiz erstellt",
      },
    });

    return NextResponse.json({
      ok: true,
      note: {
        id: note.id,
        content: note.content,
        createdAt: note.createdAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("LEAD NOTE ERROR:", error);

    return NextResponse.json(
      { ok: false, error: "Notiz konnte nicht gespeichert werden." },
      { status: 500 }
    );
  }
}