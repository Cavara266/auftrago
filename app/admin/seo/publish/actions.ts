"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";

import { canPublishSeoPage } from "./seo-quality";

const MINIMUM_PUBLISH_SCORE = 70;

function revalidateSeoPages(
  serviceSlug?: string,
  citySlug?: string
) {
  revalidatePath("/admin/seo");
  revalidatePath("/admin/seo/publish");
  revalidatePath("/admin/seo/landingpages");
  revalidatePath("/admin/seo/health");
  revalidatePath("/admin/seo/generator");
  revalidatePath("/admin/seo/analytics");
  revalidatePath("/sitemap.xml");

  if (serviceSlug && citySlug) {
    revalidatePath(
      `/dienstleistung/${serviceSlug}/${citySlug}`
    );
  }
}

export async function publishLandingPage(
  landingPageId: string
) {
  const page = await prisma.seoLandingPage.findUnique({
    where: {
      id: landingPageId,
    },
    include: {
      city: {
        select: {
          slug: true,
          status: true,
          indexable: true,
          introduction: true,
          localContent: true,
        },
      },
      service: {
        select: {
          slug: true,
          status: true,
          indexable: true,
          description: true,
          priceMinCents: true,
          priceMaxCents: true,
          faqs: {
            where: {
              status: "ACTIVE",
            },
            select: {
              id: true,
            },
          },
        },
      },
    },
  });

  if (!page) {
    throw new Error(
      "Landingpage wurde nicht gefunden."
    );
  }

  const quality = canPublishSeoPage(
    page,
    MINIMUM_PUBLISH_SCORE
  );

  if (!quality.allowed) {
    const missing = quality.failedChecks
      .map((check) => check.label)
      .join(", ");

    throw new Error(
      `Veröffentlichung blockiert: SEO-Score ${quality.score}/100. ` +
        `Mindestens ${quality.minimumScore}/100 erforderlich. ` +
        `Offene Punkte: ${missing}.`
    );
  }

  await prisma.seoLandingPage.update({
    where: {
      id: page.id,
    },
    data: {
      status: "ACTIVE",
      indexable: true,
      publishedAt:
        page.publishedAt ?? new Date(),
    },
  });

  revalidateSeoPages(
    page.service.slug,
    page.city.slug
  );

  return {
    success: true,
    score: quality.score,
    message:
      `Landingpage wurde mit einem SEO-Score von ` +
      `${quality.score}/100 veröffentlicht.`,
  };
}

export async function unpublishLandingPage(
  landingPageId: string
) {
  const page = await prisma.seoLandingPage.findUnique({
    where: {
      id: landingPageId,
    },
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

  if (!page) {
    throw new Error(
      "Landingpage wurde nicht gefunden."
    );
  }

  await prisma.seoLandingPage.update({
    where: {
      id: page.id,
    },
    data: {
      status: "DRAFT",
      indexable: false,
    },
  });

  revalidateSeoPages(
    page.service.slug,
    page.city.slug
  );

  return {
    success: true,
    message:
      "Landingpage wurde als Entwurf gespeichert.",
  };
}

export async function publishAllDraftLandingPages() {
  const drafts =
    await prisma.seoLandingPage.findMany({
      where: {
        status: "DRAFT",
      },
      include: {
        city: {
          select: {
            status: true,
            indexable: true,
            introduction: true,
            localContent: true,
          },
        },
        service: {
          select: {
            status: true,
            indexable: true,
            description: true,
            priceMinCents: true,
            priceMaxCents: true,
            faqs: {
              where: {
                status: "ACTIVE",
              },
              select: {
                id: true,
              },
            },
          },
        },
      },
    });

  let published = 0;
  let blocked = 0;
  let failed = 0;

  for (const page of drafts) {
    const quality = canPublishSeoPage(
      page,
      MINIMUM_PUBLISH_SCORE
    );

    if (!quality.allowed) {
      blocked += 1;
      continue;
    }

    try {
      await prisma.seoLandingPage.update({
        where: {
          id: page.id,
        },
        data: {
          status: "ACTIVE",
          indexable: true,
          publishedAt:
            page.publishedAt ?? new Date(),
        },
      });

      published += 1;
    } catch (error) {
      console.error(
        `Landingpage ${page.id} konnte nicht veröffentlicht werden:`,
        error
      );

      failed += 1;
    }
  }

  revalidateSeoPages();

  return {
    success: true,
    published,
    blocked,
    failed,
    total: drafts.length,
    minimumScore: MINIMUM_PUBLISH_SCORE,
    message:
      `${published} Landingpages wurden veröffentlicht. ` +
      `${blocked} wurden wegen zu niedrigem SEO-Score blockiert.` +
      (failed > 0
        ? ` ${failed} Aktionen sind fehlgeschlagen.`
        : ""),
  };
}
