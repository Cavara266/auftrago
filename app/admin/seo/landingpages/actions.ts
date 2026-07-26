"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function generateLandingPages() {
  const [cities, services] = await Promise.all([
    prisma.seoCity.findMany({
      where: {
        status: "ACTIVE",
        indexable: true,
      },
      orderBy: {
        name: "asc",
      },
    }),

    prisma.seoServicePage.findMany({
      where: {
        status: "ACTIVE",
        indexable: true,
      },
      orderBy: {
        name: "asc",
      },
    }),
  ]);

  if (cities.length === 0) {
    throw new Error(
      "Es ist noch keine aktive und indexierbare SEO-Stadt vorhanden."
    );
  }

  if (services.length === 0) {
    throw new Error(
      "Es ist noch keine aktive und indexierbare SEO-Dienstleistung vorhanden."
    );
  }

  let created = 0;
  let updated = 0;

  for (const city of cities) {
    for (const service of services) {
      const slug = `${service.slug}-${city.slug}`;

      const headline = `${service.name} in ${city.name}`;

      const introduction =
        `Finden Sie passende Anbieter für ${service.name} in ${city.name} ` +
        `und vergleichen Sie unverbindlich regionale Angebote.`;

      const seoTitle =
        `${service.name} ${city.name} – Anbieter vergleichen | Auftrago`;

      const seoDescription =
        `Finden Sie geprüfte Anbieter für ${service.name} in ${city.name}. ` +
        `Jetzt kostenlos Anfrage erstellen und regionale Angebote vergleichen.`;

      const canonicalUrl =
        `https://www.auftrago.ch/dienstleistung/${service.slug}/${city.slug}`;

      const existing = await prisma.seoLandingPage.findUnique({
        where: {
          cityId_serviceId: {
            cityId: city.id,
            serviceId: service.id,
          },
        },
        select: {
          id: true,
        },
      });

      await prisma.seoLandingPage.upsert({
        where: {
          cityId_serviceId: {
            cityId: city.id,
            serviceId: service.id,
          },
        },
        create: {
          cityId: city.id,
          serviceId: service.id,
          slug,
          headline,
          introduction,
          content:
            service.content ||
            service.description ||
            `${service.name} in ${city.name} einfach online anfragen.`,
          seoTitle,
          seoDescription,
          canonicalUrl,
          customPriceMinCents: service.priceMinCents,
          customPriceMaxCents: service.priceMaxCents,
          status: "ACTIVE",
          indexable: true,
          publishedAt: new Date(),
        },
        update: {
          slug,
          headline,
          introduction,
          seoTitle,
          seoDescription,
          canonicalUrl,
          customPriceMinCents: service.priceMinCents,
          customPriceMaxCents: service.priceMaxCents,
          status: "ACTIVE",
          indexable: true,
          publishedAt: new Date(),
        },
      });

      if (existing) {
        updated += 1;
      } else {
        created += 1;
      }
    }
  }

  revalidatePath("/admin/seo");
  revalidatePath("/admin/seo/landingpages");
  revalidatePath("/sitemap.xml");

  return {
    created,
    updated,
    total: created + updated,
  };
}

export async function toggleLandingPage(id: string) {
  const page = await prisma.seoLandingPage.findUnique({
    where: {
      id,
    },
    select: {
      status: true,
      indexable: true,
    },
  });

  if (!page) {
    throw new Error("Landingpage wurde nicht gefunden.");
  }

  const activate = page.status !== "ACTIVE";

  await prisma.seoLandingPage.update({
    where: {
      id,
    },
    data: {
      status: activate ? "ACTIVE" : "INACTIVE",
      indexable: activate,
    },
  });

  revalidatePath("/admin/seo/landingpages");
  revalidatePath("/sitemap.xml");
}

export async function deleteLandingPage(id: string) {
  await prisma.seoLandingPage.delete({
    where: {
      id,
    },
  });

  revalidatePath("/admin/seo/landingpages");
  revalidatePath("/sitemap.xml");
}
