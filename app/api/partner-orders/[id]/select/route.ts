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

export async function POST(req: Request, context: RouteContext) {
  try {
    const session = await requireUser();

    if (!session?.id) {
      return NextResponse.json(
        { ok: false, error: "Nicht eingeloggt." },
        { status: 401 }
      );
    }

    const { id } = await context.params;
    const body = await req.json();

    const applicationId = String(body.applicationId ?? "").trim();

    if (!applicationId) {
      return NextResponse.json(
        { ok: false, error: "Bewerbung fehlt." },
        { status: 400 }
      );
    }

    const order = await prisma.partnerOrder.findUnique({
      where: { id },
      select: {
        id: true,
        ownerProviderId: true,
        status: true,
        partnerAmountCents: true,
        commissionCents: true,
      },
    });

    if (!order) {
      return NextResponse.json(
        { ok: false, error: "Auftrag nicht gefunden." },
        { status: 404 }
      );
    }

    if (order.ownerProviderId !== session.id) {
      return NextResponse.json(
        {
          ok: false,
          error: "Sie dürfen diesen Auftrag nicht vergeben.",
        },
        { status: 403 }
      );
    }

    if (order.status !== "OPEN") {
      return NextResponse.json(
        {
          ok: false,
          error: "Dieser Auftrag kann nicht mehr vergeben werden.",
        },
        { status: 409 }
      );
    }

    const application = await prisma.partnerOrderApplication.findFirst({
      where: {
        id: applicationId,
        orderId: order.id,
        status: "PENDING",
      },
      select: {
        id: true,
        providerId: true,
      },
    });

    if (!application) {
      return NextResponse.json(
        {
          ok: false,
          error: "Bewerbung wurde nicht gefunden.",
        },
        { status: 404 }
      );
    }

    const commissionCents =
      order.commissionCents ??
      Math.max(
        Math.round(order.partnerAmountCents * 0.12),
        2500
      );

    await prisma.$transaction([
      prisma.partnerOrder.update({
        where: {
          id: order.id,
        },
        data: {
          selectedProviderId: application.providerId,
          status: "PAYMENT_PENDING",
          commissionCents,
        },
      }),

      prisma.partnerOrderApplication.update({
        where: {
          id: application.id,
        },
        data: {
          status: "ACCEPTED",
        },
      }),

      prisma.partnerOrderApplication.updateMany({
        where: {
          orderId: order.id,
          id: {
            not: application.id,
          },
          status: "PENDING",
        },
        data: {
          status: "REJECTED",
        },
      }),
    ]);

    return NextResponse.json({
      ok: true,
      orderId: order.id,
      selectedProviderId: application.providerId,
      status: "PAYMENT_PENDING",
      partnerAmountCHF: order.partnerAmountCents / 100,
      commissionCHF: commissionCents / 100,
      commissionRate: 12,
    });
  } catch (error) {
    console.error("PARTNER ORDER SELECT ERROR:", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Firma konnte nicht bestätigt werden.",
      },
      { status: 500 }
    );
  }
}
