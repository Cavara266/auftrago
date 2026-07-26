import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BASE_URL = "https://www.auftrago.ch";

function escapeCsv(
  value: string | number | boolean | Date | null | undefined
) {
  if (value === null || value === undefined) {
    return "";
  }

  const normalized =
    value instanceof Date
      ? value.toISOString()
      : String(value);

  return `"${normalized.replace(/"/g, '""')}"`;
}

export async function GET() {
  const landingPages =
    await prisma.seoLandingPage.findMany({
      include: {
        city: {
          select: {
            name: true,
            slug: true,
            status: true,
            indexable: true,
          },
        },
        service: {
          select: {
            name: true,
            slug: true,
            status: true,
            indexable: true,
          },
        },
      },
      orderBy: [
        {
          city: {
            name: "asc",
          },
        },
        {
          service: {
            name: "asc",
          },
        },
      ],
    });

  const headers = [
    "Landingpage",
    "URL",
    "Stadt",
    "Dienstleistung",
    "SEO-Titel",
    "Meta-Beschreibung",
    "Canonical",
    "Status",
    "Indexierbar",
    "Stadt aktiv",
    "Stadt indexierbar",
    "Dienstleistung aktiv",
    "Dienstleistung indexierbar",
    "Veröffentlicht am",
    "Aktualisiert am",
  ];

  const rows = landingPages.map((page) => {
    const publicUrl =
      `${BASE_URL}/dienstleistung/` +
      `${page.service.slug}/${page.city.slug}`;

    return [
      page.headline ||
        `${page.service.name} in ${page.city.name}`,
      publicUrl,
      page.city.name,
      page.service.name,
      page.seoTitle,
      page.seoDescription,
      page.canonicalUrl || publicUrl,
      page.status,
      page.indexable,
      page.city.status === "ACTIVE",
      page.city.indexable,
      page.service.status === "ACTIVE",
      page.service.indexable,
      page.publishedAt,
      page.updatedAt,
    ];
  });

  const csv = [
    headers.map(escapeCsv).join(";"),
    ...rows.map((row) =>
      row.map(escapeCsv).join(";")
    ),
  ].join("\n");

  const fileName =
    `auftrago-seo-export-` +
    `${new Date().toISOString().slice(0, 10)}.csv`;

  return new NextResponse(
    `\uFEFF${csv}`,
    {
      status: 200,
      headers: {
        "Content-Type":
          "text/csv; charset=utf-8",
        "Content-Disposition":
          `attachment; filename="${fileName}"`,
        "Cache-Control":
          "no-store, max-age=0",
      },
    }
  );
}
