import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const user = await getSessionUser();
    if (!user) return new NextResponse("Unauthorized", { status: 401 });

    const body = await req.json().catch(() => ({}));
    const leadId = String(body?.leadId ?? "");
    if (!leadId) return new NextResponse("Missing leadId", { status: 400 });

    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
      select: {
        id: true,
        priceCredits: true,
        contactName: true,
        contactPhone: true,
        contactEmail: true,
      },
    });

    if (!lead) return new NextResponse("Lead not found", { status: 404 });

    // Schon freigeschaltet?
    const existing = await prisma.unlock.findFirst({
      where: { userId: user.id, leadId },
      select: { id: true },
    });

    if (existing) {
      return NextResponse.json({ ok: true, alreadyUnlocked: true });
    }

    // Credits prüfen (aktuell aus DB lesen, nicht aus Cookie-select)
    const freshUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { id: true, credits: true },
    });

    if (!freshUser) return new NextResponse("Unauthorized", { status: 401 });

    if (freshUser.credits < lead.priceCredits) {
      return new NextResponse("Not enough credits", { status: 402 });
    }

    // Transaktion atomar
    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: user.id },
        data: { credits: { decrement: lead.priceCredits } },
      });

      await tx.unlock.create({
        data: { userId: user.id, leadId },
      });

      // optional, falls du Transaction-Model hast
      // Wenn du KEIN transaction Model hast, kommentier diesen Block aus.
      await tx.transaction.create({
        data: {
          userId: user.id,
          amount: -lead.priceCredits,
          kind: "UNLOCK",
          meta: `lead:${leadId}`,
        },
      });
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return new NextResponse("Serverfehler.", { status: 500 });
  }
}