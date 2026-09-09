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

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Nicht angemeldet." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const quoteId = String(body?.quoteId || "").trim();

    if (!quoteId) {
      return NextResponse.json(
        { error: "Offerten-ID fehlt." },
        { status: 400 }
      );
    }

    const quote = await prisma.businessQuote.findFirst({
      where: {
        id: quoteId,
        providerId: user.id,
      },
      include: {
        customer: true,
        items: {
          orderBy: {
            position: "asc",
          },
        },
      },
    });

    if (!quote) {
      return NextResponse.json(
        { error: "Offerte wurde nicht gefunden." },
        { status: 404 }
      );
    }

    const existingInvoice = await prisma.businessInvoice.findFirst({
      where: {
        providerId: user.id,
        quoteId: quote.id,
      },
      select: {
        id: true,
        invoiceNumber: true,
      },
    });

    if (existingInvoice) {
      return NextResponse.json({
        ok: true,
        alreadyExists: true,
        invoice: existingInvoice,
      });
    }

    const dueAt = new Date();
    dueAt.setDate(dueAt.getDate() + 14);

    const invoice = await prisma.businessInvoice.create({
      data: {
        providerId: user.id,
        customerId: quote.customerId,
        quoteId: quote.id,

        invoiceNumber: createInvoiceNumber(),

        title: quote.title,
        status: "DRAFT",

        customerName:
          quote.customer?.companyName ||
          quote.customerName ||
          null,

        customerEmail:
          quote.customer?.email ||
          quote.customerEmail ||
          null,

        customerAddress:
          quote.customer?.address ||
          quote.customerAddress ||
          null,

        subtotalCents: quote.subtotalCents,
        discountCents: quote.discountCents,
        vatCents: quote.vatCents,
        totalCents: quote.totalCents,

        issuedAt: new Date(),
        dueAt,

        notes: quote.notes,

        items: {
          create: quote.items.map((item) => ({
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
        items: {
          orderBy: {
            position: "asc",
          },
        },
      },
    });

    await addInvoiceActivity(
      invoice.id,
      "CREATED",
      `Rechnung ${invoice.invoiceNumber} wurde aus einer Offerte erstellt.`
    );

    return NextResponse.json({
      ok: true,
      invoice,
    });
  } catch (error) {
    console.error("BUSINESS_INVOICE_FROM_QUOTE_ERROR", error);

    return NextResponse.json(
      {
        error: "Die Rechnung konnte nicht erstellt werden.",
      },
      {
        status: 500,
      }
    );
  }
}
