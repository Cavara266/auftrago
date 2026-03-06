import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";

export const runtime = "nodejs";

type RouteContext = {
  params: {
    id: string;
  };
};

export async function POST(_req: Request, { params }: RouteContext) {
  try {
    const user = await requireUser();

    if (!user) {
      return NextResponse.json(
        { ok: false, error: "Nicht eingeloggt." },
        { status: 401 }
      );
    }

    const leadId = String(params.id);

    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
      select: {
        id: true,
        priceCredits: true,
      },
    });

    if (!lead) {
      return NextResponse.json(
        { ok: false, error: "Lead nicht gefunden." },
        { status: 404 }
      );
    }

    const existingUnlock = await prisma.unlock.findUnique({
      where: {
        userId_leadId: {
          userId: user.id,
          leadId: lead.id,
        },
      },
      select: {
        id: true,
      },
    });

    if (existingUnlock) {
      return NextResponse.json({
        ok: true,
        alreadyUnlocked: true,
      });
    }

    if (user.credits < lead.priceCredits) {
      return NextResponse.json(
        { ok: false, error: "Zu wenig Credits." },
        { status: 400 }
      );
    }

    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: {
          credits: {
            decrement: lead.priceCredits,
          },
        },
      }),
      prisma.unlock.create({
        data: {
          userId: user.id,
          leadId: lead.id,
        },
      }),
      prisma.transaction.create({
        data: {
          userId: user.id,
          type: "LEAD_UNLOCK",
          amount: -lead.priceCredits,
          meta: {
            leadId: lead.id,
          },
        },
      }),
    ]);

    return NextResponse.json({
      ok: true,
      unlocked: true,
    });
  } catch (error) {
    console.error("LEAD UNLOCK ERROR:", error);

    return NextResponse.json(
      { ok: false, error: "Serverfehler." },
      { status: 500 }
    );
  }
}