import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";

export const runtime = "nodejs";

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
    const amount = Number(body?.amount ?? 0);

    if (!Number.isInteger(amount) || amount <= 0) {
      return NextResponse.json(
        { ok: false, error: "Ungültiger Credit-Betrag." },
        { status: 400 }
      );
    }

    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: {
          credits: {
            increment: amount,
          },
        },
      }),
      prisma.transaction.create({
        data: {
          userId: user.id,
          type: "CREDIT_ADD",
          amount,
          meta: {
            source: "manual",
          },
        },
      }),
    ]);

    return NextResponse.json({
      ok: true,
      addedCredits: amount,
    });
  } catch (error) {
    console.error("CREDITS ADD ERROR:", error);

    return NextResponse.json(
      { ok: false, error: "Serverfehler." },
      { status: 500 }
    );
  }
}