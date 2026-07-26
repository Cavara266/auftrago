import type { MetadataRoute } from "next";

import { prisma } from "@/lib/prisma";
import { citiesSeo } from "@/lib/city-data";
import { regions } from "@/lib/region-data";
import { seoConfig } from "@/lib/seo";
import { services } from "@/lib/seo-data";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 3600;

const staticPages = [
  "",
  "/dienstleistungen",
  "/offerte-anfragen",
  "/auftrag-erstellen",
  "/anbieter",
  "/anbieter-registrieren",
  "/ueber-uns",
  "/kontakt",
  "/datenschutz",
  "/agb",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  /*
   * Bestehende Sitemap-Einträge
   * Diese bleiben vollständig erhalten.
   */

  const staticEntries: MetadataRoute.Sitemap = staticPages.map((path) => ({
    url: `${seoConfig.siteUrl}${path}`,
    lastModified: now,
    changeFrequency: path === "" ? "daily" : "monthly",
    priority: path === "" ? 1 : 0.65,
  }));

  const serviceEntries: MetadataRoute.Sitemap = services.map((service) => ({
    url: `${seoConfig.siteUrl}/leistungen/${service}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const cityEntries: MetadataRoute.Sitemap = citiesSeo.map((city) => ({
    url: `${seoConfig.siteUrl}/stadt/${city.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.75,
  }));

  const regionEntries: MetadataRoute.Sitemap = regions.map((region) => ({
    url: `${seoConfig.siteUrl}/region/${region.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const combinationEntries: MetadataRoute.Sitemap = services.flatMap(
    (service) =>
      citiesSeo.map((city) => ({
        url: `${seoConfig.siteUrl}/dienstleistung/${service}/${city.slug}`,
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      })),
  );

  /*
   * Neue SEO-CMS-Landingpages aus Prisma
   * Es werden nur aktive und indexierbare Seiten aufgenommen.
   */

  const databaseLandingPages = await prisma.seoLandingPage.findMany({
    where: {
      status: "ACTIVE",
      indexable: true,
      city: {
        status: "ACTIVE",
        indexable: true,
      },
      service: {
        status: "ACTIVE",
        indexable: true,
      },
    },
    select: {
      updatedAt: true,
      city: {
        select: {
          slug: true,
        },
      },
      service: {
        select: {
          slug: true,
        },
      },
    },
  });

  const databaseEntries: MetadataRoute.Sitemap = databaseLandingPages.map(
    (page) => ({
      url: `${seoConfig.siteUrl}/dienstleistung/${page.service.slug}/${page.city.slug}`,
      lastModified: page.updatedAt,
      changeFrequency: "weekly",
      priority: 0.75,
    }),
  );

  /*
   * Alle bestehenden und neuen URLs zusammenführen.
   * Doppelte URLs werden automatisch entfernt.
   */

  const allEntries: MetadataRoute.Sitemap = [
    ...staticEntries,
    ...serviceEntries,
    ...cityEntries,
    ...regionEntries,
    ...combinationEntries,
    ...databaseEntries,
  ];

  const uniqueEntries = new Map<string, MetadataRoute.Sitemap[number]>();

  for (const entry of allEntries) {
    const existingEntry = uniqueEntries.get(entry.url);

    if (!existingEntry) {
      uniqueEntries.set(entry.url, entry);
      continue;
    }

    const existingDate = existingEntry.lastModified
      ? new Date(existingEntry.lastModified).getTime()
      : 0;

    const newDate = entry.lastModified
      ? new Date(entry.lastModified).getTime()
      : 0;

    if (newDate >= existingDate) {
      uniqueEntries.set(entry.url, entry);
    }
  }

  return Array.from(uniqueEntries.values());
}
