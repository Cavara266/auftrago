import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { addInvoiceActivity } from "@/lib/business/invoiceActivity";

function createInvoiceNumber() {
  const now = new Date();

  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const h = String(now.getHours()).padStart(2, "0");
  const min = String(now.getMinutes()).padStart(2, "0");
  const s = String(now.getSeconds()).padStart(2, "0");
  const random = Math.floor(Math.random() * 900 + 100);

  return `RE-${y}-${m}-${d}-${h}${min}${s}-${random}`;
}

export async function POST(
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

    const invoice = await prisma.businessInvoice.findFirst({
      where: {
        id,
        providerId: user.id,
      },
      include: {
        items: {
          orderBy: {
            position: "asc",
          },
        },
      },
    });

    if (!invoice) {
      return NextResponse.json(
        { error: "Rechnung nicht gefunden" },
        { status: 404 }
      );
    }

    const dueAt = new Date();
    dueAt.setDate(dueAt.getDate() + 14);

    const duplicate = await prisma.businessInvoice.create({
      data: {
        providerId: invoice.providerId,
        customerId: invoice.customerId,
        quoteId: null,

        invoiceNumber: createInvoiceNumber(),

        title: invoice.title,
        status: "DRAFT",

        customerName: invoice.customerName,
        customerEmail: invoice.customerEmail,
        customerAddress: invoice.customerAddress,

        subtotalCents: invoice.subtotalCents,
        discountCents: invoice.discountCents,
        vatCents: invoice.vatCents,
        totalCents: invoice.totalCents,

        issuedAt: new Date(),
        dueAt,
        paidAt: null,

        reminderLevel: 0,
        firstReminderAt: null,
        secondReminderAt: null,
        reminderFeeCents: 0,
        paidAmountCents: 0,
        lastPaymentAt: null,

        notes: invoice.notes,

        items: {
          create: invoice.items.map((item) => ({
            position: item.position,
            description: item.description,
            quantity: item.quantity,
            unit: item.unit,
            unitPriceCents: item.unitPriceCents,
            totalCents: item.totalCents,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    await addInvoiceActivity(
      invoice.id,
      "DUPLICATED",
      `Rechnung ${invoice.invoiceNumber} wurde dupliziert.`
    );

    await addInvoiceActivity(
      duplicate.id,
      "CREATED",
      `Rechnung ${duplicate.invoiceNumber} wurde als Kopie von ${invoice.invoiceNumber} erstellt.`
    );

    return NextResponse.json({
      ok: true,
      invoice: duplicate,
    });
  } catch (error) {
    console.error("INVOICE DUPLICATE ERROR", error);

    return NextResponse.json(
      { error: "Rechnung konnte nicht dupliziert werden." },
      { status: 500 }
    );
  }
}
