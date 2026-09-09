import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

async function loadInvoice(invoiceId: string, providerId: string) {
  return prisma.businessInvoice.findFirst({
    where: {
      id: invoiceId,
      providerId,
    },
    include: {
      items: {
        orderBy: {
          position: "asc",
        },
      },
    },
  });
}

async function recalculateInvoice(invoiceId: string) {
  const invoice = await prisma.businessInvoice.findUnique({
    where: {
      id: invoiceId,
    },
    include: {
      items: true,
    },
  });

  if (!invoice) return null;

  const subtotalCents = invoice.items.reduce(
    (sum, item) => sum + item.totalCents,
    0
  );

  const taxableCents = Math.max(
    0,
    subtotalCents - invoice.discountCents
  );

  const oldTaxableBase = Math.max(
    1,
    invoice.subtotalCents - invoice.discountCents
  );

  const vatRate =
    invoice.vatCents > 0
      ? invoice.vatCents / oldTaxableBase
      : 0.081;

  const vatCents = Math.round(taxableCents * vatRate);

  const totalCents =
    taxableCents + vatCents + (invoice.reminderFeeCents || 0);

  return prisma.businessInvoice.update({
    where: {
      id: invoice.id,
    },
    data: {
      subtotalCents,
      vatCents,
      totalCents,
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
    const body = await request.json();

    const invoice = await loadInvoice(id, user.id);

    if (!invoice) {
      return NextResponse.json(
        { error: "Rechnung nicht gefunden" },
        { status: 404 }
      );
    }

    const description =
      String(body.description || "").trim();

    const quantity = Number(body.quantity || 1);
    const unit = String(body.unit || "pauschal").trim();
    const unitPriceCents = Math.round(
      Number(body.unitPrice || 0) * 100
    );

    if (!description) {
      return NextResponse.json(
        { error: "Beschreibung fehlt" },
        { status: 400 }
      );
    }

    if (!Number.isFinite(quantity) || quantity <= 0) {
      return NextResponse.json(
        { error: "Ungültige Menge" },
        { status: 400 }
      );
    }

    if (!Number.isFinite(unitPriceCents) || unitPriceCents < 0) {
      return NextResponse.json(
        { error: "Ungültiger Preis" },
        { status: 400 }
      );
    }

    const position =
      invoice.items.length > 0
        ? Math.max(...invoice.items.map((x) => x.position)) + 1
        : 1;

    const totalCents = Math.round(
      quantity * unitPriceCents
    );

    await prisma.businessInvoiceItem.create({
      data: {
        invoiceId: invoice.id,
        position,
        description,
        quantity,
        unit,
        unitPriceCents,
        totalCents,
      },
    });

    const updated = await recalculateInvoice(invoice.id);

    return NextResponse.json({
      ok: true,
      invoice: updated,
    });
  } catch (error) {
    console.error("INVOICE ITEM CREATE ERROR", error);

    return NextResponse.json(
      { error: "Position konnte nicht erstellt werden." },
      { status: 500 }
    );
  }
}

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

    const invoice = await loadInvoice(id, user.id);

    if (!invoice) {
      return NextResponse.json(
        { error: "Rechnung nicht gefunden" },
        { status: 404 }
      );
    }

    const itemId = String(body.itemId || "");

    const item = invoice.items.find(
      (x) => x.id === itemId
    );

    if (!item) {
      return NextResponse.json(
        { error: "Position nicht gefunden" },
        { status: 404 }
      );
    }

    const description =
      typeof body.description === "string"
        ? body.description.trim()
        : item.description;

    const quantity =
      body.quantity !== undefined
        ? Number(body.quantity)
        : item.quantity;

    const unit =
      typeof body.unit === "string"
        ? body.unit.trim()
        : item.unit;

    const unitPriceCents =
      body.unitPrice !== undefined
        ? Math.round(Number(body.unitPrice) * 100)
        : item.unitPriceCents;

    if (!description) {
      return NextResponse.json(
        { error: "Beschreibung darf nicht leer sein" },
        { status: 400 }
      );
    }

    if (!Number.isFinite(quantity) || quantity <= 0) {
      return NextResponse.json(
        { error: "Ungültige Menge" },
        { status: 400 }
      );
    }

    if (!Number.isFinite(unitPriceCents) || unitPriceCents < 0) {
      return NextResponse.json(
        { error: "Ungültiger Preis" },
        { status: 400 }
      );
    }

    const totalCents = Math.round(
      quantity * unitPriceCents
    );

    await prisma.businessInvoiceItem.update({
      where: {
        id: item.id,
      },
      data: {
        description,
        quantity,
        unit,
        unitPriceCents,
        totalCents,
      },
    });

    const updated = await recalculateInvoice(invoice.id);

    return NextResponse.json({
      ok: true,
      invoice: updated,
    });
  } catch (error) {
    console.error("INVOICE ITEM UPDATE ERROR", error);

    return NextResponse.json(
      { error: "Position konnte nicht gespeichert werden." },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    const invoice = await loadInvoice(id, user.id);

    if (!invoice) {
      return NextResponse.json(
        { error: "Rechnung nicht gefunden" },
        { status: 404 }
      );
    }

    const itemId = String(body.itemId || "");

    const item = invoice.items.find(
      (x) => x.id === itemId
    );

    if (!item) {
      return NextResponse.json(
        { error: "Position nicht gefunden" },
        { status: 404 }
      );
    }

    await prisma.businessInvoiceItem.delete({
      where: {
        id: item.id,
      },
    });

    const remainingItems =
      await prisma.businessInvoiceItem.findMany({
        where: {
          invoiceId: invoice.id,
        },
        orderBy: {
          position: "asc",
        },
      });

    for (let index = 0; index < remainingItems.length; index++) {
      await prisma.businessInvoiceItem.update({
        where: {
          id: remainingItems[index].id,
        },
        data: {
          position: index + 1,
        },
      });
    }

    const updated = await recalculateInvoice(invoice.id);

    return NextResponse.json({
      ok: true,
      invoice: updated,
    });
  } catch (error) {
    console.error("INVOICE ITEM DELETE ERROR", error);

    return NextResponse.json(
      { error: "Position konnte nicht gelöscht werden." },
      { status: 500 }
    );
  }
}
