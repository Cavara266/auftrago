import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

function text(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function cents(value: unknown) {
  const n =
    typeof value === "number"
      ? value
      : Number(String(value ?? "0").replace(",", "."));

  return Number.isFinite(n) ? Math.max(0, Math.round(n * 100)) : 0;
}

export async function POST(request: Request) {
  try {
    const user = await requireUser();

    if (!user) {
      return NextResponse.json(
        { error: "Nicht angemeldet." },
        { status: 401 }
      );
    }

    const body = await request.json();

    const customerName = text(body.customerName);
    const customerEmail = text(body.customerEmail);
    const customerPhone = text(body.customerPhone);
    const customerAddress = text(body.customerAddress);

    if (!customerName) {
      return NextResponse.json(
        { error: "Bitte einen Kundennamen eingeben." },
        { status: 400 }
      );
    }

    const rawItems = Array.isArray(body.items) ? body.items : [];

    const items = rawItems
      .map((item: any, index: number) => {
        const quantity = Math.max(0, Number(item.quantity) || 0);
        const unitPriceCents = cents(item.unitPrice);

        return {
          position: index + 1,
          description: text(item.description),
          quantity,
          unit: text(item.unit) || "pauschal",
          unitPriceCents,
          totalCents: Math.round(quantity * unitPriceCents),
        };
      })
      .filter(
        (item: any) =>
          item.description.length > 0 &&
          item.quantity > 0
      );

    if (!items.length) {
      return NextResponse.json(
        { error: "Bitte mindestens eine Position erfassen." },
        { status: 400 }
      );
    }

    const subtotalCents = items.reduce(
      (sum: number, item: any) => sum + item.totalCents,
      0
    );

    const discountCents = cents(body.discount);

    const vatRate = Math.max(
      0,
      Number(String(body.vatRate ?? "0").replace(",", ".")) || 0
    );

    const taxableCents = Math.max(0, subtotalCents - discountCents);
    const vatCents = Math.round(taxableCents * (vatRate / 100));
    const totalCents = taxableCents + vatCents;

    const now = new Date();

    const quoteNumber =
      "OFF-" +
      now.getFullYear() +
      "-" +
      String(now.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(now.getDate()).padStart(2, "0") +
      "-" +
      String(now.getTime()).slice(-6);

    const result = await prisma.$transaction(async (tx) => {
      let customer = null;

      if (customerEmail) {
        customer = await tx.businessCustomer.findFirst({
          where: {
            providerId: user.id,
            email: customerEmail,
          },
        });
      }

      if (!customer) {
        customer = await tx.businessCustomer.create({
          data: {
            providerId: user.id,
            companyName: customerName,
            email: customerEmail || null,
            phone: customerPhone || null,
            address: customerAddress || null,
          },
        });
      } else {
        customer = await tx.businessCustomer.update({
          where: {
            id: customer.id,
          },
          data: {
            companyName: customerName,
            phone: customerPhone || customer.phone,
            address: customerAddress || customer.address,
          },
        });
      }

      const quote = await tx.businessQuote.create({
        data: {
          providerId: user.id,
          customerId: customer.id,

          quoteNumber,

          title: text(body.title) || "Offerte",
          status: "DRAFT",

          customerName,
          customerEmail: customerEmail || null,
          customerAddress: customerAddress || null,

          subtotalCents,
          discountCents,
          vatCents,
          totalCents,

          validUntil: body.validUntil
            ? new Date(body.validUntil)
            : null,

          notes: text(body.notes) || null,

          items: {
            create: items,
          },
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

      return quote;
    });

    return NextResponse.json({
      ok: true,
      quote: result,
    });
  } catch (error) {
    console.error("BUSINESS_QUOTE_CREATE_ERROR", error);

    return NextResponse.json(
      {
        error: "Die Offerte konnte nicht gespeichert werden.",
      },
      { status: 500 }
    );
  }
}
