import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = {
  params: {
    purchaseId: string;
  };
};

export async function GET(_req: Request, context: RouteContext) {
  try {
    const cookieStore = await cookies();
    const providerId = cookieStore.get("auftrago_session")?.value;

    if (!providerId) {
      return NextResponse.json(
        { ok: false, error: "Nicht eingeloggt." },
        { status: 401 }
      );
    }

    const purchase = await prisma.leadPurchase.findFirst({
      where: {
        id: context.params.purchaseId,
        providerId,
      },
    });

    if (!purchase) {
      return NextResponse.json(
        { ok: false, error: "Lead nicht gefunden." },
        { status: 404 }
      );
    }

    const activities = await prisma.leadActivity.findMany({
      where: {
        leadPurchaseId: purchase.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      ok: true,
      activities: activities.map((activity) => ({
        id: activity.id,
        type: activity.type,
        description: activity.description,
        createdAt: activity.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error("LEAD ACTIVITIES ERROR:", error);

    return NextResponse.json(
      { ok: false, error: "Aktivitäten konnten nicht geladen werden." },
      { status: 500 }
    );
  }
}