import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

function createQuoteNumber() {
  const now = new Date();

  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const h = String(now.getHours()).padStart(2, "0");
  const min = String(now.getMinutes()).padStart(2, "0");
  const s = String(now.getSeconds()).padStart(2, "0");
  const random = Math.floor(Math.random() * 900 + 100);

  return `OF-${y}-${m}-${d}-${h}${min}${s}-${random}`;
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

    const title = String(body.title || "Neue Offerte").trim();
    const customerName = String(body.customerName || "").trim();
    const customerEmail = String(body.customerEmail || "").trim();
    const description = String(body.description || "").trim();

    const positions = Array.isArray(body.positions)
      ? body.positions
      : [];

    if (positions.length === 0) {
      return NextResponse.json(
        { error: "Keine Positionen vorhanden." },
        { status: 400 }
      );
    }

    const normalizedItems = positions.map(
      (item: any, index: number) => {
        const quantity =
          Number(item.quantity) > 0
            ? Number(item.quantity)
            : 1;

        const price = Math.max(
          0,
          Number(item.price || 0)
        );

        const unitPriceCents = Math.round(price * 100);
        const totalCents = Math.round(
          unitPriceCents * quantity
        );

        return {
          position: index + 1,
          description: String(
            item.description || `Position ${index + 1}`
          ),
          quantity,
          unit: String(item.unit || "pauschal"),
          unitPriceCents,
          totalCents,
        };
      }
    );

    const subtotalCents = normalizedItems.reduce(
      (sum: number, item: any) =>
        sum + item.totalCents,
      0
    );

    const vatPercent =
      typeof body.vatPercent === "number"
        ? body.vatPercent
        : 8.1;

    const vatCents = Math.round(
      subtotalCents * (vatPercent / 100)
    );

    const totalCents =
      subtotalCents + vatCents;

    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + 30);

    let customerId: string | null = null;

    if (customerEmail || customerName) {
      const existingCustomer =
        await prisma.businessCustomer.findFirst({
          where: {
            providerId: user.id,
            OR: [
              ...(customerEmail
                ? [{ email: customerEmail }]
                : []),
              ...(customerName
                ? [{ companyName: customerName }]
                : []),
            ],
          },
          select: {
            id: true,
          },
        });

      if (existingCustomer) {
        customerId = existingCustomer.id;
      } else {
        const createdCustomer =
          await prisma.businessCustomer.create({
            data: {
              providerId: user.id,
              companyName: customerName || null,
              email: customerEmail || null,
            },
            select: {
              id: true,
            },
          });

        customerId = createdCustomer.id;
      }
    }

    const quote = await prisma.businessQuote.create({
      data: {
        providerId: user.id,
        customerId,

        quoteNumber: createQuoteNumber(),

        title,
        status: "DRAFT",

        customerName:
          customerName || null,

        customerEmail:
          customerEmail || null,

        notes:
          description || null,

        discountPercent: 0,
        vatPercent,

        subtotalCents,
        discountCents: 0,
        vatCents,
        totalCents,

        validUntil,

        items: {
          create: normalizedItems,
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

    return NextResponse.json({
      ok: true,
      quote,
      redirectUrl:
        `/portal/business/offerten/${quote.id}`,
    });
  } catch (error) {
    console.error("AI SAVE QUOTE ERROR", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Offerte konnte nicht gespeichert werden.",
      },
      { status: 500 }
    );
  }
}
