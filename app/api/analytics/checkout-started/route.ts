import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { trackProviderActivity } from "@/lib/provider-activity";

export const runtime = "nodejs";

function getClientIp(request: NextRequest) {
  const forwarded = request.headers.get("x-forwarded-for");

  if (forwarded) {
    return forwarded.split(",")[0]?.trim();
  }

  return (
    request.headers.get("x-real-ip") ??
    request.headers.get("cf-connecting-ip") ??
    undefined
  );
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireUser();

    if (!user) {
      return NextResponse.json(
        { error: "UNAUTHORIZED" },
        { status: 401 }
      );
    }

    const body = await request.json();

    const leadId = String(body.leadId ?? "");

    if (!leadId) {
      return NextResponse.json(
        { error: "INVALID_LEAD" },
        { status: 400 }
      );
    }

    const lead = await prisma.lead.findUnique({
      where: {
        id: leadId,
      },
      select: {
        id: true,
        title: true,
        category: true,
        region: true,
        price: true,
      },
    });

    if (!lead) {
      return NextResponse.json(
        { error: "LEAD_NOT_FOUND" },
        { status: 404 }
      );
    }

    await trackProviderActivity({
      providerId: user.id,
      event: "CHECKOUT_STARTED",
      description: "Anbieter hat den Lead-Kauf gestartet",
      page: `/leads/${lead.id}`,
      leadId: lead.id,
      ipAddress: getClientIp(request),
      userAgent: request.headers.get("user-agent") ?? undefined,
      metadata: {
        leadTitle: lead.title,
        category: lead.category,
        region: lead.region,
        price: lead.price,
        providerCredits: user.credits,
        enoughCredits: user.credits >= lead.price,
      },
    });

    return NextResponse.json({
      ok: true,
    });
  } catch (error) {
    console.error("CHECKOUT START ERROR:", error);

    return NextResponse.json(
      {
        error: "INTERNAL_ERROR",
      },
      {
        status: 500,
      }
    );
  }
}