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
    const body = await req.json().catch(() => ({}));
    const message = String(body.message ?? "").trim() || null;

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

    if (order.ownerProviderId === session.id) {
      return NextResponse.json(
        {
          ok: false,
          error: "Sie können sich nicht auf Ihren eigenen Auftrag bewerben.",
        },
        { status: 400 }
      );
    }

    if (order.status !== "OPEN") {
      return NextResponse.json(
        {
          ok: false,
          error: "Dieser Auftrag ist nicht mehr verfügbar.",
        },
        { status: 409 }
      );
    }

    const application = await prisma.partnerOrderApplication.upsert({
      where: {
        orderId_providerId: {
          orderId: order.id,
          providerId: session.id,
        },
      },
      update: {
        message,
        status: "PENDING",
      },
      create: {
        orderId: order.id,
        providerId: session.id,
        message,
        status: "PENDING",
      },
      select: {
        id: true,
        orderId: true,
        providerId: true,
        message: true,
        status: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      ok: true,
      application,
    });
  } catch (error) {
    console.error("PARTNER ORDER APPLY ERROR:", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Bewerbung konnte nicht gespeichert werden.",
      },
      { status: 500 }
    );
  }
}
