import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Nicht angemeldet." },
        { status: 401 }
      );
    }

    const { id } = await params;

    const job =
      await prisma.businessJob.findFirst({
        where: {
          id,
          providerId: user.id,
        },
      });

    if (!job) {
      return NextResponse.json(
        { error: "Einsatz nicht gefunden." },
        { status: 404 }
      );
    }

    if (job.status !== "DONE") {
      return NextResponse.json(
        {
          error:
            "Eine Rechnung kann erst erstellt werden, wenn der Einsatz erledigt ist.",
        },
        { status: 400 }
      );
    }

    if (!job.quoteId) {
      return NextResponse.json(
        {
          error:
            "Dieser Einsatz ist mit keiner Offerte verknüpft.",
        },
        { status: 400 }
      );
    }

    const quote =
      await prisma.businessQuote.findFirst({
        where: {
          id: job.quoteId,
          providerId: user.id,
        },
        include: {
          items: true,
          customer: true,
        },
      });

    if (!quote) {
      return NextResponse.json(
        { error: "Verknüpfte Offerte nicht gefunden." },
        { status: 404 }
      );
    }

    const existingInvoice =
      await prisma.businessInvoice.findFirst({
        where: {
          providerId: user.id,
          quoteId: quote.id,
          status: {
            not: "CANCELLED",
          },
        },
      });

    if (existingInvoice) {
      return NextResponse.json({
        ok: true,
        alreadyExists: true,
        invoice: existingInvoice,
      });
    }

    const now = new Date();

    const dueAt = new Date(now);
    dueAt.setDate(dueAt.getDate() + 14);

    const invoiceNumber =
      `RE-${now.getFullYear()}-${String(
        now.getMonth() + 1
      ).padStart(2, "0")}-${String(
        now.getDate()
      ).padStart(2, "0")}-${Math.floor(
        100000 + Math.random() * 900000
      )}`;

    const invoice =
      await prisma.businessInvoice.create({
        data: {
          providerId: user.id,

          customerId:
            quote.customerId || null,

          quoteId: quote.id,

          invoiceNumber,

          title:
            quote.title ||
            job.title ||
            `Rechnung ${invoiceNumber}`,

          status: "DRAFT",

          customerName:
            quote.customerName ||
            job.customerName ||
            null,

          customerEmail:
            quote.customerEmail ||
            job.customerEmail ||
            quote.customer?.email ||
            null,

          customerAddress:
            quote.customerAddress ||
            job.location ||
            quote.customer?.address ||
            null,

          subtotalCents:
            quote.subtotalCents,

          discountCents:
            quote.discountCents,

          vatCents:
            quote.vatCents,

          totalCents:
            quote.totalCents,

          issuedAt: now,
          dueAt,

          paidAmountCents: 0,

          notes:
            `Erstellt aus Offerte ${quote.quoteNumber}. Einsatz abgeschlossen.`,

          items: {
            create:
              quote.items.length > 0
                ? quote.items.map((item) => ({
                    position: item.position,
                    description: item.description,
                    quantity: item.quantity,
                    unit: item.unit,
                    unitPriceCents: item.unitPriceCents,
                    totalCents: item.totalCents,
                  }))
                : [
                    {
                      position: 1,
                      description:
                        quote.title || job.title,
                      quantity: 1,
                      unit: "pauschal",
                      unitPriceCents:
                        quote.totalCents,
                      totalCents:
                        quote.totalCents,
                    },
                  ],
          },
        },
        include: {
          items: true,
        },
      });

    return NextResponse.json({
      ok: true,
      invoice,
    });
  } catch (error) {
    console.error(
      "JOB CREATE INVOICE ERROR",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Rechnung konnte nicht erstellt werden.",
      },
      { status: 500 }
    );
  }
}
