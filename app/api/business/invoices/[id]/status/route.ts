import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const status = String(body.status || "").toUpperCase();

    const allowed = ["DRAFT", "SENT", "OPEN", "PAID", "OVERDUE", "CANCELLED"];

    if (!allowed.includes(status)) {
      return NextResponse.json({ error: "Ungültiger Status" }, { status: 400 });
    }

    const existing = await prisma.businessInvoice.findFirst({
      where: {
        id,
        providerId: user.id,
      },
    });

    if (!existing) {
      return NextResponse.json({ error: "Rechnung nicht gefunden" }, { status: 404 });
    }

    const invoice = await prisma.businessInvoice.update({
      where: { id },
      data: {
        status,
        paidAt: status === "PAID" ? new Date() : null,
      },
    });

    return NextResponse.json({ ok: true, invoice });
  } catch (error) {
    console.error("INVOICE STATUS ERROR", error);

    return NextResponse.json(
      { error: "Status konnte nicht geändert werden" },
      { status: 500 }
    );
  }
}
