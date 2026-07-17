import { NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { trackProviderActivity } from "@/lib/provider-activity";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const ALLOWED_EVENTS = new Set([
  "DASHBOARD_VIEWED",
  "LEADS_VIEWED",
  "LEAD_VIEWED",
  "CREDITS_VIEWED",
  "CHECKOUT_STARTED",
  "LOGOUT",
]);

type ActivityRequestBody = {
  event?: string;
  description?: string;
  page?: string;
  leadId?: string;
  metadata?: Prisma.InputJsonValue;
};

function getClientIp(request: Request): string | undefined {
  const forwardedFor = request.headers.get("x-forwarded-for");

  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || undefined;
  }

  return (
    request.headers.get("x-real-ip") ||
    request.headers.get("cf-connecting-ip") ||
    undefined
  );
}

export async function POST(request: Request) {
  try {
    const user = await requireUser();

    if (!user) {
      return NextResponse.json(
        {
          ok: false,
          error: "Nicht angemeldet.",
        },
        {
          status: 401,
        }
      );
    }

    const body =
      (await request.json().catch(() => null)) as ActivityRequestBody | null;

    const event = String(body?.event || "")
      .trim()
      .toUpperCase();

    const description = String(body?.description || "").trim();
    const page = String(body?.page || "").trim();
    const leadId = String(body?.leadId || "").trim();

    if (!event || !ALLOWED_EVENTS.has(event)) {
      return NextResponse.json(
        {
          ok: false,
          error: "Ungültiges Aktivitätsereignis.",
        },
        {
          status: 400,
        }
      );
    }

    const duplicateWindowStart = new Date(Date.now() - 15_000);

    const recentDuplicate = await prisma.providerActivity.findFirst({
      where: {
        providerId: user.id,
        event,
        page: page || null,
        leadId: leadId || null,
        createdAt: {
          gte: duplicateWindowStart,
        },
      },
      select: {
        id: true,
      },
    });

    if (recentDuplicate) {
      return NextResponse.json({
        ok: true,
        duplicate: true,
      });
    }

    const ipAddress = getClientIp(request);
    const userAgent = request.headers.get("user-agent") || undefined;

    await trackProviderActivity({
      providerId: user.id,
      event,
      description: description || undefined,
      page: page || undefined,
      leadId: leadId || undefined,
      metadata: body?.metadata,
      ipAddress,
      userAgent,
    });

    return NextResponse.json({
      ok: true,
    });
  } catch (error) {
    console.error("PROVIDER ACTIVITY API ERROR:", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Aktivität konnte nicht gespeichert werden.",
      },
      {
        status: 500,
      }
    );
  }
}