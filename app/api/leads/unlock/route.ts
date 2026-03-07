import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(req: Request) {
  try {
    const user = await requireUser();

    if (!user) {
      return NextResponse.json(
        { ok: false, error: "Nicht eingeloggt." },
        { status: 401 }
      );
    }

    const body = await req.json().catch(() => null);
    const leadId = String(body?.leadId ?? "").trim();

    if (!leadId) {
      return NextResponse.json(
        { ok: false, error: "Lead ID fehlt." },
        { status: 400 }
      );
    }

    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
      select: {
        id: true,
        priceCredits: true,
        expiresAt: true,
      },
    });

    if (!lead) {
      return NextResponse.json(
        { ok: false, error: "Lead nicht gefunden." },
        { status: 404 }
      );
    }

    if (lead.expiresAt && new Date(lead.expiresAt) < new Date()) {
      return NextResponse.json(
        { ok: false, error: "Dieser Lead ist abgelaufen." },
        { status: 400 }
      );
    }

    const existingUnlock = await prisma.unlock.findUnique({
      where: {
        userId_leadId: {
          userId: user.id,
          leadId,
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

    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: user.id },
        data: {
          credits: {
            decrement: lead.priceCredits,
          },
        },
      });

      await tx.unlock.create({
        data: {
          userId: user.id,
          leadId,
        },
      });

      await tx.transaction.create({
        data: {
          userId: user.id,
          type: "LEAD_UNLOCK",
          amount: -lead.priceCredits,
          meta: {
            leadId,
          },
        },
      });
    });

    return NextResponse.json({
      ok: true,
      unlocked: true,
    });
  } catch (error) {
    console.error("UNLOCK ERROR:", error);

    return NextResponse.json(
      { ok: false, error: "Serverfehler." },
      { status: 500 }
    );
  }
}