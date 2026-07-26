"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";

function createTitle(service: string, city: string) {
  return `${service} ${city} – Anbieter vergleichen | Auftrago`;
}

function createDescription(service: string, city: string) {
  return (
    `Finde passende Anbieter für ${service} in ${city}. ` +
    `Erstelle kostenlos eine Anfrage und vergleiche regionale Angebote unverbindlich.`
  );
}

function createIntroduction(service: string, city: string) {
  return (
    `Du suchst einen zuverlässigen Anbieter für ${service} in ${city}? ` +
    `Über Auftrago kannst du deinen Auftrag kostenlos erfassen und passende ` +
    `Fachbetriebe aus der Region erreichen.`
  );
}

function createContent(
  service: string,
  city: string,
  canton: string,
  serviceDescription: string | null,
  cityIntroduction: string | null
) {
  return [
    serviceDescription ||
      `${service} umfasst je nach Auftrag unterschiedliche Arbeiten und Anforderungen.`,

    cityIntroduction ||
      `${city} liegt im Kanton ${canton} und verfügt über zahlreiche regionale Dienstleister.`,

    `Damit Anbieter deinen Auftrag für ${service} in ${city} möglichst genau beurteilen können, ` +
      `solltest du den gewünschten Leistungsumfang, den Ausführungsort, den Termin und besondere Anforderungen vollständig angeben.`,

    `Über Auftrago erreichst du passende Fachbetriebe aus ${city} und der näheren Umgebung. ` +
      `Du kannst Rückmeldungen, Leistungen und Preise vergleichen und selbst entscheiden, welchen Anbieter du beauftragen möchtest.`,

    `Die tatsächlichen Kosten hängen unter anderem vom Arbeitsumfang, der Objektgrösse, ` +
      `der Zugänglichkeit, dem gewünschten Termin und möglichen Zusatzleistungen ab.`,

    `Eine detaillierte Anfrage mit Fotos und genauen Angaben erhöht die Wahrscheinlichkeit, ` +
      `dass du rasch eine realistische und passende Offerte erhältst.`,
  ].join("\n\n");
}

export async function generateSeoLandingPages(formData: FormData) {
  const rawLimit = Number(formData.get("limit") || 100);
  const publishImmediately =
    formData.get("publishImmediately") === "on";

  const limit = Math.min(
    Math.max(Number.isFinite(rawLimit) ? rawLimit : 100, 1),
    5000
  );

  const [cities, services] = await Promise.all([
    prisma.seoCity.findMany({
      where: {
        status: "ACTIVE",
        indexable: true,
      },
      orderBy: {
        sortOrder: "asc",
      },
    }),

    prisma.seoServicePage.findMany({
      where: {
        status: "ACTIVE",
        indexable: true,
      },
      orderBy: {
        sortOrder: "asc",
      },
    }),
  ]);

  if (cities.length === 0) {
    return {
      success: false,
      message: "Keine aktiven Städte gefunden.",
      created: 0,
      skipped: 0,
    };
  }

  if (services.length === 0) {
    return {
      success: false,
      message: "Keine aktiven Dienstleistungen gefunden.",
      created: 0,
      skipped: 0,
    };
  }

  const existingPages = await prisma.seoLandingPage.findMany({
    select: {
      cityId: true,
      serviceId: true,
    },
  });

  const existingKeys = new Set(
    existingPages.map(
      (page) => `${page.cityId}:${page.serviceId}`
    )
  );

  const combinations: Array<{
    city: (typeof cities)[number];
    service: (typeof services)[number];
  }> = [];

  for (const city of cities) {
    for (const service of services) {
      const key = `${city.id}:${service.id}`;

      if (!existingKeys.has(key)) {
        combinations.push({
          city,
          service,
        });
      }
    }
  }

  const selectedCombinations = combinations.slice(0, limit);

  let created = 0;
  let failed = 0;

  for (const combination of selectedCombinations) {
    const { city, service } = combination;

    try {
      await prisma.seoLandingPage.create({
        data: {
          cityId: city.id,
          serviceId: service.id,
          slug: `${service.slug}-${city.slug}`,
          headline: `${service.name} in ${city.name}`,
          introduction: createIntroduction(
            service.name,
            city.name
          ),
          content: createContent(
            service.name,
            city.name,
            city.canton,
            service.description,
            city.introduction
          ),
          seoTitle: createTitle(
            service.name,
            city.name
          ),
          seoDescription: createDescription(
            service.name,
            city.name
          ),
          canonicalUrl:
            `https://www.auftrago.ch/dienstleistung/` +
            `${service.slug}/${city.slug}`,
          customPriceMinCents:
            service.priceMinCents ?? 15000,
          customPriceMaxCents:
            service.priceMaxCents ?? 90000,
          status: publishImmediately
            ? "ACTIVE"
            : "DRAFT",
          indexable: publishImmediately,
          publishedAt: publishImmediately
            ? new Date()
            : null,
        },
      });

      created += 1;
    } catch (error) {
      console.error(
        `Landingpage für ${service.slug}/${city.slug} konnte nicht erstellt werden:`,
        error
      );

      failed += 1;
    }
  }

  revalidatePath("/admin/seo");
  revalidatePath("/admin/seo/generator");
  revalidatePath("/admin/seo/landingpages");
  revalidatePath("/admin/seo/health");
  revalidatePath("/sitemap.xml");

  return {
    success: true,
    message:
      `${created} Landingpages wurden erstellt.` +
      (failed > 0
        ? ` ${failed} konnten nicht erstellt werden.`
        : ""),
    created,
    failed,
    skipped:
      existingPages.length,
    remaining:
      Math.max(combinations.length - created - failed, 0),
  };
}
