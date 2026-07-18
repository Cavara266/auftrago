import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { filterMatchingLeads } from "@/lib/provider-lead-matching";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const user = await requireUser();

  if (!user) {
    return NextResponse.json(
      {
        error: "Nicht angemeldet.",
      },
      {
        status: 401,
      }
    );
  }

  const provider = await prisma.provider.findUnique({
    where: {
      id: user.id,
    },

    select: {
      region: true,
      category: true,

      serviceRegions: true,
      serviceCategories: true,
      serviceCities: true,
      servicePostalCodes: true,

      receiveAllLeadEmails: true,
    },
  });

  if (!provider) {
    return NextResponse.json(
      {
        error: "Anbieter wurde nicht gefunden.",
      },
      {
        status: 404,
      }
    );
  }

  const latestLeads = await prisma.lead.findMany({
    take: 100,

    orderBy: {
      createdAt: "desc",
    },

    select: {
      id: true,
      title: true,
      region: true,
      category: true,
      city: true,
      postalCode: true,
      price: true,
      createdAt: true,
    },
  });

  const matchingLeads = filterMatchingLeads(
    provider,
    latestLeads
  )
    .slice(0, 10)
    .map(({ lead, match }) => ({
      id: lead.id,
      title: lead.title,
      region: lead.region,
      category: lead.category,
      city: lead.city,
      postalCode: lead.postalCode,
      price: lead.price,
      createdAt: lead.createdAt.toISOString(),
      matchScore: match.score,
      matchReasons: match.reasons,
    }));

  return NextResponse.json(
    {
      leads: matchingLeads,
    },
    {
      headers: {
        "Cache-Control":
          "no-store, no-cache, must-revalidate",
      },
    }
  );
}