import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const sessionId = String(body?.sessionId ?? "").trim();

    if (!sessionId) {
      return NextResponse.json(
        { ok: false, error: "Missing sessionId" },
        { status: 400 }
      );
    }

    const tx = await prisma.transaction.findUnique({
      where: {
        stripeSessionId: sessionId,
      },
      select: {
        id: true,
        amount: true,
        type: true,
        createdAt: true,
      },
    });

    if (!tx) {
      return NextResponse.json({
        ok: true,
        processed: false,
      });
    }

    return NextResponse.json({
      ok: true,
      processed: true,
      creditsAdded: tx.amount,
      type: tx.type,
      createdAt: tx.createdAt,
    });
  } catch (error) {
    console.error("STRIPE STATUS ERROR:", error);

    return NextResponse.json(
      { ok: false, error: "Server error" },
      { status: 500 }
    );
  }
}