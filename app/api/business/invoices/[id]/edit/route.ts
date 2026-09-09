import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { addInvoiceActivity } from "@/lib/business/invoiceActivity";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Nicht angemeldet" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    const existing = await prisma.businessInvoice.findFirst({
      where: {
        id,
        providerId: user.id,
      },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Rechnung nicht gefunden" },
        { status: 404 }
      );
    }

    const subtotalCents = Number(existing.subtotalCents || 0);

    const discountCents = Math.max(
      0,
      Math.round(Number(body.discountAmount || 0) * 100)
    );

    const taxableCents = Math.max(0, subtotalCents - discountCents);

    const vatPercent = Math.max(
      0,
      Number(body.vatPercent ?? 8.1)
    );

    const vatCents = Math.round(
      taxableCents * (vatPercent / 100)
    );

    const totalCents = taxableCents + vatCents;

    const dueAt = body.dueAt
      ? new Date(body.dueAt)
      : existing.dueAt;

    const updated = await prisma.businessInvoice.update({
      where: {
        id: existing.id,
      },
      data: {
        title:
          typeof body.title === "string"
            ? body.title.trim()
            : existing.title,

        customerName:
          typeof body.customerName === "string"
            ? body.customerName.trim() || null
            : existing.customerName,

        customerEmail:
          typeof body.customerEmail === "string"
            ? body.customerEmail.trim() || null
            : existing.customerEmail,

        customerAddress:
          typeof body.customerAddress === "string"
            ? body.customerAddress.trim() || null
            : existing.customerAddress,

        notes:
          typeof body.notes === "string"
            ? body.notes.trim() || null
            : existing.notes,

        discountCents,
        vatCents,
        totalCents,
        dueAt,
      },
      include: {
        items: {
          orderBy: {
            position: "asc",
          },
        },
        payments: {
          orderBy: {
            paymentDate: "desc",
          },
        },
      },
    });

    await addInvoiceActivity(
      updated.id,
      "EDITED",
      `Rechnung ${updated.invoiceNumber} wurde bearbeitet.`
    );

    return NextResponse.json({
      ok: true,
      invoice: updated,
    });
  } catch (error) {
    console.error("INVOICE EDIT ERROR", error);

    return NextResponse.json(
      { error: "Rechnung konnte nicht gespeichert werden." },
      { status: 500 }
    );
  }
}
