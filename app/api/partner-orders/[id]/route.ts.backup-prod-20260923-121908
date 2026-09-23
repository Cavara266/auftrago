import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_req: Request, context: RouteContext) {
  try {
    const user = await requireUser();

    if (!user?.id) {
      return NextResponse.json(
        { ok: false, error: "Nicht eingeloggt." },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    const order = await prisma.partnerOrder.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        title: true,
        category: true,
        description: true,

        postalCode: true,
        city: true,
        region: true,

        scheduledAt: true,
        flexibleDate: true,

        partnerAmountCents: true,
        commissionCents: true,

        status: true,
        ownerProviderId: true,
        selectedProviderId: true,

        commissionPaidAt: true,
        contactsUnlockedAt: true,

        customerName: true,
        customerEmail: true,
        customerPhone: true,
        customerStreet: true,
        customerPostalCode: true,
        customerCity: true,

        createdAt: true,

        ownerProvider: {
          select: {
            id: true,
            companyName: true,
            logoUrl: true,
          },
        },

        selectedProvider: {
          select: {
            id: true,
            companyName: true,
            logoUrl: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        { ok: false, error: "Auftrag nicht gefunden." },
        { status: 404 }
      );
    }

    const isOwner = order.ownerProviderId === user.id;
    const isSelectedProvider = order.selectedProviderId === user.id;

    if (!isOwner && !isSelectedProvider) {
      return NextResponse.json(
        {
          ok: false,
          error: "Du hast keinen Zugriff auf diesen Auftrag.",
        },
        { status: 403 }
      );
    }

    const contactsUnlocked =
      isOwner ||
      (
        isSelectedProvider &&
        order.status === "UNLOCKED" &&
        Boolean(order.commissionPaidAt) &&
        Boolean(order.contactsUnlockedAt)
      );

    return NextResponse.json({
      ok: true,

      order: {
        id: order.id,
        title: order.title,
        category: order.category,
        description: order.description,

        postalCode: order.postalCode,
        city: order.city,
        region: order.region,

        scheduledAt: order.scheduledAt,
        flexibleDate: order.flexibleDate,

        partnerAmountCHF: order.partnerAmountCents / 100,
        commissionCHF: (order.commissionCents ?? 0) / 100,

        status: order.status,
        commissionPaidAt: order.commissionPaidAt,
        contactsUnlockedAt: order.contactsUnlockedAt,

        ownerProvider: order.ownerProvider,
        selectedProvider: order.selectedProvider,

        contactsUnlocked,

        customer: contactsUnlocked
          ? {
              name: order.customerName,
              email: order.customerEmail,
              phone: order.customerPhone,
              street: order.customerStreet,
              postalCode: order.customerPostalCode,
              city: order.customerCity,
            }
          : null,
      },
    });
  } catch (error) {
    console.error("PARTNER ORDER DETAIL ERROR:", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Auftrag konnte nicht geladen werden.",
      },
      { status: 500 }
    );
  }
}


export async function DELETE(_req: Request, context: RouteContext) {
  try {
    const user = await requireUser();

    if (!user?.id) {
      return NextResponse.json(
        { ok: false, error: "Nicht eingeloggt." },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    const order = await prisma.partnerOrder.findUnique({
      where: { id },
      select: {
        id: true,
        ownerProviderId: true,
        status: true,
      },
    });

    if (!order) {
      return NextResponse.json(
        { ok: false, error: "Auftrag nicht gefunden." },
        { status: 404 }
      );
    }

    if (order.ownerProviderId !== user.id) {
      return NextResponse.json(
        { ok: false, error: "Du darfst diesen Auftrag nicht löschen." },
        { status: 403 }
      );
    }

    if (order.status !== "OPEN") {
      return NextResponse.json(
        {
          ok: false,
          error: "Nur offene Aufträge können gelöscht werden.",
        },
        { status: 409 }
      );
    }

    await prisma.partnerOrder.delete({
      where: { id },
    });

    return NextResponse.json({
      ok: true,
      deleted: true,
      orderId: id,
    });
  } catch (error) {
    console.error("PARTNER ORDER DELETE ERROR:", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Auftrag konnte nicht gelöscht werden.",
      },
      { status: 500 }
    );
  }
}


export async function PATCH(req: Request, context: RouteContext) {
  try {
    const user = await requireUser();

    if (!user?.id) {
      return NextResponse.json(
        { ok: false, error: "Nicht eingeloggt." },
        { status: 401 }
      );
    }

    const { id } = await context.params;
    const body = await req.json();

    const existingOrder = await prisma.partnerOrder.findUnique({
      where: { id },
      select: {
        id: true,
        ownerProviderId: true,
        status: true,
      },
    });

    if (!existingOrder) {
      return NextResponse.json(
        { ok: false, error: "Auftrag nicht gefunden." },
        { status: 404 }
      );
    }

    if (existingOrder.ownerProviderId !== user.id) {
      return NextResponse.json(
        { ok: false, error: "Du darfst diesen Auftrag nicht bearbeiten." },
        { status: 403 }
      );
    }

    if (existingOrder.status !== "OPEN") {
      return NextResponse.json(
        {
          ok: false,
          error: "Nur offene Aufträge können bearbeitet werden.",
        },
        { status: 409 }
      );
    }

    const title = String(body.title ?? "").trim();
    const postalCode = String(body.postalCode ?? "").trim() || null;
    const city = String(body.city ?? "").trim() || null;

    const rawAmount =
      body.partnerAmountCHF ??
      body.partnerAmount ??
      "";

    const normalizedAmount = String(rawAmount)
      .trim()
      .replace(/CHF/gi, "")
      .replace(/['’\s]/g, "")
      .replace(",", ".");

    const partnerAmount = Number(normalizedAmount);

    if (!title) {
      return NextResponse.json(
        { ok: false, error: "Titel ist erforderlich." },
        { status: 400 }
      );
    }

    if (!Number.isFinite(partnerAmount) || partnerAmount <= 0) {
      return NextResponse.json(
        { ok: false, error: "Ungültiger Auftragsbetrag." },
        { status: 400 }
      );
    }

    const partnerAmountCents = Math.round(partnerAmount * 100);

    const commissionCents = Math.max(
      Math.round(partnerAmountCents * 0.12),
      2500
    );

    const updated = await prisma.partnerOrder.update({
      where: { id },
      data: {
        title,
        postalCode,
        city,
        partnerAmountCents,
        commissionCents,
      },
      select: {
        id: true,
        title: true,
        postalCode: true,
        city: true,
        partnerAmountCents: true,
        commissionCents: true,
        status: true,
      },
    });

    return NextResponse.json({
      ok: true,
      order: {
        ...updated,
        partnerAmountCHF: updated.partnerAmountCents / 100,
        commissionCHF: updated.commissionCents / 100,
      },
    });
  } catch (error) {
    console.error("PARTNER ORDER PATCH ERROR:", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Auftrag konnte nicht bearbeitet werden.",
      },
      { status: 500 }
    );
  }
}

