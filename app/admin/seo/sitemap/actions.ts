"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";

const BASE_URL = "https://www.auftrago.ch";

function createCanonicalUrl(
  serviceSlug: string,
  citySlug: string
) {
  return `${BASE_URL}/dienstleistung/${serviceSlug}/${citySlug}`;
}

function revalidateSeoPages() {
  revalidatePath("/admin/seo");
  revalidatePath("/admin/seo/sitemap");
  revalidatePath("/admin/seo/health");
  revalidatePath("/admin/seo/analytics");
  revalidatePath("/admin/seo/publish");
  revalidatePath("/admin/seo/landingpages");
  revalidatePath("/sitemap.xml");
}

export async function repairCanonicalUrls() {
  const landingPages =
    await prisma.seoLandingPage.findMany({
      include: {
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

  let checked = 0;
  let repaired = 0;
  let unchanged = 0;
  let failed = 0;

  for (const page of landingPages) {
    checked += 1;

    const expectedCanonical = createCanonicalUrl(
      page.service.slug,
      page.city.slug
    );

    if (
      page.canonicalUrl?.trim() ===
      expectedCanonical
    ) {
      unchanged += 1;
      continue;
    }

    try {
      await prisma.seoLandingPage.update({
        where: {
          id: page.id,
        },
        data: {
          canonicalUrl: expectedCanonical,
        },
      });

      repaired += 1;

      revalidatePath(
        `/dienstleistung/${page.service.slug}/${page.city.slug}`
      );
    } catch (error) {
      console.error(
        `Canonical für Landingpage ${page.id} konnte nicht repariert werden:`,
        error
      );

      failed += 1;
    }
  }

  revalidateSeoPages();

  return {
    success: failed === 0,
    checked,
    repaired,
    unchanged,
    failed,
    message:
      `${checked} Landingpages geprüft. ` +
      `${repaired} Canonical-URLs repariert, ` +
      `${unchanged} waren bereits korrekt.` +
      (failed > 0
        ? ` ${failed} Reparaturen sind fehlgeschlagen.`
        : ""),
  };
}
