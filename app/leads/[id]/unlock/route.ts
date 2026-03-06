// app/api/leads/[id]/unlock/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireUser();

    const leadId = Number(params.id);
    if (!Number.isFinite(leadId)) {
      return new NextResponse("Ungültige Lead-ID.", { status: 400 });
    }

    // Lead holen (für priceCredits)
    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
      select: {
        id: true,
        priceCredits: true,
      },
    });

    if (!lead) {
      return new NextResponse("Lead nicht gefunden.", { status: 404 });
    }

    // Atomar: prüfen + credits abziehen + unlock erstellen
    await prisma.$transaction(async (tx) => {
      // schon unlocked?
      const existing = await tx.leadUnlock.findUnique({
        where: {
          userId_leadId: {
            userId: user.id,
            leadId: lead.id,
          },
        },
        select: { id: true },
      });

      if (existing) {
        // bereits freigeschaltet -> nichts abziehen
        return;
      }

      const freshUser = await tx.user.findUnique({
        where: { id: user.id },
        select: { id: true, credits: true },
      });

      if (!freshUser) {
        throw new Error("USER_NOT_FOUND");
      }

      if (freshUser.credits < lead.priceCredits) {
        throw new Error("NOT_ENOUGH_CREDITS");
      }

      // Credits runter
      await tx.user.update({
        where: { id: user.id },
        data: { credits: { decrement: lead.priceCredits } },
      });

      // Unlock schreiben (unique schützt doppelt)
      await tx.leadUnlock.create({
        data: {
          userId: user.id,
          leadId: lead.id,
        },
      });
    });

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    if (e?.message === "NOT_ENOUGH_CREDITS") {
      return new NextResponse("Nicht genug Credits.", { status: 402 });
    }
    if (e?.message === "USER_NOT_FOUND") {
      return new NextResponse("User nicht gefunden.", { status: 401 });
    }

    console.error("UNLOCK ERROR:", e);
    return new NextResponse("Serverfehler.", { status: 500 });
  }
}