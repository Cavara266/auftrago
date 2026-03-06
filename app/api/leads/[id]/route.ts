import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(
  _req: Request,
  ctx: { params: { id: string } }
) {
  try {
    const user = await requireUser();

    if (!user) {
      return NextResponse.json(
        { error: "Nicht eingeloggt." },
        { status: 401 }
      );
    }

    const id = ctx.params.id;

    const lead = await prisma.lead.findUnique({
      where: { id },
    });

    if (!lead) {
      return NextResponse.json(
        { error: "Lead nicht gefunden." },
        { status: 404 }
      );
    }

    const unlocked = await prisma.unlock.findFirst({
      where: {
        userId: user.id,
        leadId: id,
      },
      select: { id: true },
    });

    if (!unlocked) {
      return NextResponse.json({
        ok: true,
        lead: {
          ...lead,
          locked: true,
          contactName: null,
          contactPhone: null,
          contactEmail: null,
        },
      });
    }

    return NextResponse.json({
      ok: true,
      lead: {
        ...lead,
        locked: false,
      },
    });
  } catch (error) {
    console.error("LEAD GET ERROR:", error);

    return NextResponse.json(
      { error: "Serverfehler." },
      { status: 500 }
    );
  }
}