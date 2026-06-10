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
    const messageText = clean(data.message);

    if (!messageText) {
      return NextResponse.json(
        { ok: false, error: "Bitte eine Nachricht eingeben." },
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

    const message = await prisma.leadMessage.create({
      data: {
        leadPurchaseId: purchase.id,
        sender: "provider",
        message: messageText,
      },
    });

    await prisma.leadActivity.create({
      data: {
        leadPurchaseId: purchase.id,
        type: "MESSAGE_SENT",
        description: "Nachricht gespeichert",
      },
    });

    return NextResponse.json({
      ok: true,
      message: {
        id: message.id,
        sender: message.sender,
        message: message.message,
        createdAt: message.createdAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("LEAD MESSAGE ERROR:", error);

    return NextResponse.json(
      { ok: false, error: "Nachricht konnte nicht gespeichert werden." },
      { status: 500 }
    );
  }
}