"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";

function createSeoTitle(serviceName: string, cityName: string) {
  return `${serviceName} ${cityName} – Anbieter vergleichen | Auftrago`;
}

function createSeoDescription(
  serviceName: string,
  cityName: string
) {
  return (
    `Finde passende Anbieter für ${serviceName} in ${cityName}. ` +
    `Jetzt kostenlos Anfrage erstellen und regionale Angebote vergleichen.`
  );
}

function createIntroduction(
  serviceName: string,
  cityName: string
) {
  return (
    `Du suchst einen zuverlässigen Anbieter für ${serviceName} in ${cityName}? ` +
    `Über Auftrago kannst du deinen Auftrag kostenlos erfassen und passende ` +
    `regionale Fachbetriebe erreichen. Vergleiche Rückmeldungen, Leistungen ` +
    `und Preise unverbindlich an einem Ort.`
  );
}

function createContent(
  serviceName: string,
  cityName: string,
  canton: string,
  serviceDescription: string | null,
  cityIntroduction: string | null
) {
  const serviceText =
    serviceDescription ||
    `${serviceName} kann je nach Auftrag unterschiedliche Arbeiten und Anforderungen umfassen.`;

  const cityText =
    cityIntroduction ||
    `${cityName} liegt im Kanton ${canton} und verfügt über eine grosse Auswahl regionaler Dienstleister.`;

  return [
    `${serviceText}`,
    `${cityText}`,
    `Für eine möglichst genaue Offerte solltest du den Umfang des Auftrags, ` +
      `den gewünschten Termin, die Adresse und besondere Anforderungen vollständig angeben.`,
    `Über Auftrago erreichst du passende Anbieter aus ${cityName} und der Umgebung. ` +
      `Die Anfrage ist unverbindlich und ermöglicht dir, verschiedene Rückmeldungen miteinander zu vergleichen.`,
    `Die tatsächlichen Kosten hängen vom Arbeitsumfang, der Objektgrösse, dem Termin, ` +
      `der Zugänglichkeit und den gewünschten Zusatzleistungen ab. Eine detaillierte Beschreibung ` +
      `hilft den Anbietern dabei, ein realistisches Angebot zu erstellen.`,
  ].join("\n\n");
}

function createFaqs(
  serviceName: string,
  cityName: string
) {
  return [
    {
      question: `Was kostet ${serviceName} in ${cityName}?`,
      answer:
        `Die Kosten hängen vom Umfang, Termin, Objekt und den gewünschten Leistungen ab. ` +
        `Mit einer vollständigen Anfrage können Anbieter den Preis genauer einschätzen.`,
      sortOrder: 10,
    },
    {
      question: `Wie finde ich einen Anbieter für ${serviceName} in ${cityName}?`,
      answer:
        `Erstelle auf Auftrago eine kostenlose Anfrage mit allen wichtigen Angaben. ` +
        `Passende regionale Anbieter können sich anschliessend bei dir melden.`,
      sortOrder: 20,
    },
    {
      question: `Ist die Anfrage für ${serviceName} unverbindlich?`,
      answer:
        `Ja. Das Erstellen einer Anfrage ist unverbindlich. Du kannst eingehende Rückmeldungen ` +
        `prüfen und selbst entscheiden, ob du einen Anbieter beauftragen möchtest.`,
      sortOrder: 30,
    },
    {
      question: `Welche Angaben sollte meine Anfrage enthalten?`,
      answer:
        `Beschreibe den gewünschten Leistungsumfang, die Adresse, den Termin, die Objektgrösse ` +
        `und mögliche Besonderheiten möglichst genau.`,
      sortOrder: 40,
    },
  ];
}

export async function optimizeLandingPage(id: string) {
  const page = await prisma.seoLandingPage.findUnique({
    where: {
      id,
    },
    include: {
      city: true,
      service: {
        include: {
          faqs: {
            where: {
              status: "ACTIVE",
            },
            orderBy: {
              sortOrder: "asc",
            },
          },
        },
      },
    },
  });

  if (!page) {
    throw new Error("Landingpage wurde nicht gefunden.");
  }

  const serviceName = page.service.name;
  const cityName = page.city.name;

  const seoTitle =
    page.seoTitle &&
    page.seoTitle.trim().length >= 30 &&
    page.seoTitle.trim().length <= 65
      ? page.seoTitle
      : createSeoTitle(serviceName, cityName);

  const seoDescription =
    page.seoDescription &&
    page.seoDescription.trim().length >= 110 &&
    page.seoDescription.trim().length <= 170
      ? page.seoDescription
      : createSeoDescription(serviceName, cityName);

  const headline =
    page.headline?.trim() ||
    `${serviceName} in ${cityName}`;

  const introduction =
    page.introduction?.trim() ||
    createIntroduction(serviceName, cityName);

  const existingText = [
    page.content,
    page.city.introduction,
    page.city.localContent,
  ]
    .filter(Boolean)
    .join(" ");

  const wordCount = existingText
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

  const content =
    wordCount >= 120
      ? page.content
      : createContent(
          serviceName,
          cityName,
          page.city.canton,
          page.service.description,
          page.city.introduction
        );

  const canonicalUrl =
    page.canonicalUrl?.trim() ||
    `https://www.auftrago.ch/dienstleistung/${page.service.slug}/${page.city.slug}`;

  const priceMinCents =
    page.customPriceMinCents ??
    page.service.priceMinCents ??
    15000;

  const priceMaxCents =
    page.customPriceMaxCents ??
    page.service.priceMaxCents ??
    90000;

  await prisma.$transaction(async (transaction) => {
    await transaction.seoLandingPage.update({
      where: {
        id: page.id,
      },
      data: {
        headline,
        introduction,
        content,
        seoTitle,
        seoDescription,
        canonicalUrl,
        customPriceMinCents: priceMinCents,
        customPriceMaxCents: priceMaxCents,
        status: "ACTIVE",
        indexable: true,
        publishedAt: page.publishedAt || new Date(),
      },
    });

    if (page.service.faqs.length < 3) {
      await transaction.seoFaq.deleteMany({
        where: {
          serviceId: page.serviceId,
          status: "ACTIVE",
        },
      });

      await transaction.seoFaq.createMany({
        data: createFaqs(serviceName, cityName).map((faq) => ({
          serviceId: page.serviceId,
          question: faq.question,
          answer: faq.answer,
          sortOrder: faq.sortOrder,
          status: "ACTIVE",
        })),
      });
    }
  });

  revalidatePath("/admin/seo");
  revalidatePath("/admin/seo/health");
  revalidatePath("/admin/seo/landingpages");
  revalidatePath(
    `/dienstleistung/${page.service.slug}/${page.city.slug}`
  );
  revalidatePath("/sitemap.xml");

  return {
    success: true,
    title: `${serviceName} in ${cityName}`,
  };
}

export async function optimizeAllLandingPages() {
  const pages = await prisma.seoLandingPage.findMany({
    select: {
      id: true,
    },
  });

  let optimized = 0;
  let failed = 0;

  for (const page of pages) {
    try {
      await optimizeLandingPage(page.id);
      optimized += 1;
    } catch (error) {
      console.error(
        `SEO-Optimierung für ${page.id} fehlgeschlagen:`,
        error
      );
      failed += 1;
    }
  }

  revalidatePath("/admin/seo/health");

  return {
    optimized,
    failed,
    total: pages.length,
  };
}
