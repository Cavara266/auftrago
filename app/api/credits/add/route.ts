// app/api/credits/add/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getOrCreateDemoUser } from "@/lib/demoUser";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const user = await getOrCreateDemoUser();

    const body = await req.json().catch(() => ({}));
    const amountRaw = body?.amount;

    const amount = Number(amountRaw);

    if (!Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json(
        { error: "Invalid amount. Use { amount: 10 }" },
        { status: 400 }
      );
    }

    const updated = await prisma.$transaction(async (tx) => {
      const u = await tx.user.update({
        where: { id: user.id },
        data: { credits: { increment: amount } },
      });

      await tx.creditTransaction.create({
        data: {
          userId: user.id,
          amount,
          type: "PURCHASE",
        },
      });

      return u;
    });

    return NextResponse.json({ ok: true, credits: updated.credits, amount });
  } catch (e: any) {
    console.error("CREDITS ADD ERROR:", e);
    return NextResponse.json(
      { error: e?.message || "Server error" },
      { status: 500 }
    );
  }
}