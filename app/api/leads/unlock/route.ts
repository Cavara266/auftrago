import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const user = await requireUser();

    if (!user) {
      return NextResponse.json(
        { error: "Nicht eingeloggt." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const leadId = body.leadId;

    if (!leadId) {
      return NextResponse.json(
        { error: "Lead ID fehlt." },
        { status: 400 }
      );
    }

    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
    });

    if (!lead) {
      return NextResponse.json(
        { error: "Lead nicht gefunden." },
        { status: 404 }
      );
    }

    const alreadyUnlocked = await prisma.unlock.findUnique({
      where: {
        userId_leadId: {
          userId: user.id,
          leadId: lead.id,
        },
      },
    });

    if (alreadyUnlocked) {
      return NextResponse.json({ ok: true });
    }

    const cost = lead.priceCredits;

    if (user.credits < cost) {
      return NextResponse.json(
        { error: "Nicht genug Credits." },
        { status: 400 }
      );
    }

    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: {
          credits: {
            decrement: cost,
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
          amount: -cost,
          meta: {
            leadId: lead.id,
          },
        },
      }),
    ]);

    return NextResponse.json({ ok: true });

  } catch (error) {
    console.error("UNLOCK ERROR:", error);

    return NextResponse.json(
      { error: "Serverfehler." },
      { status: 500 }
    );
  }
}