// app/api/credits/topup/route.ts
import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const user = await requireUser();
    const { amount } = await req.json();

    const n = Number(amount);
    if (!Number.isFinite(n) || n < 1 || n > 500) {
      return new NextResponse("Ungültiger Betrag.", { status: 400 });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { credits: { increment: n } },
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return new NextResponse("Serverfehler.", { status: 500 });
  }
}