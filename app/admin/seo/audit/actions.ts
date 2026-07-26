"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";

const BASE_URL = "https://www.auftrago.ch";

function createTitle(
  serviceName: string,
  cityName: string
) {
  return `${serviceName} in ${cityName} – Anbieter vergleichen | Auftrago`;
}

function createDescription(
  serviceName: string,
  cityName: string
) {
  return (
    `Finde passende Anbieter für ${serviceName} in ${cityName}. ` +
    `Erstelle kostenlos deine Anfrage und vergleiche regionale Angebote unverbindlich über Auftrago.`
  );
}

function createHeadline(
  serviceName: string,
  cityName: string
) {
  return `${serviceName} in ${cityName}`;
}

function createIntroduction(
  serviceName: string,
  cityName: string
) {
  return (
    `Du suchst einen zuverlässigen Anbieter für ${serviceName} in ${cityName}? ` +
    `Mit Auftrago kannst du deinen Auftrag kostenlos erfassen und passende regionale Fachbetriebe erreichen. ` +
    `Du erhältst Rückmeldungen und kannst Leistungen sowie Angebote unverbindlich vergleichen.`
  );
}

function createContent(
  serviceName: string,
  cityName: string,
  existingContent: string | null
) {
  const baseContent = existingContent?.trim() ?? "";

  const additionalContent = [
    `Die Anforderungen an ${serviceName} in ${cityName} können je nach Auftrag unterschiedlich sein. ` +
      `Eine möglichst genaue Beschreibung hilft den Anbietern, den Aufwand realistisch einzuschätzen.`,

    `Gib bei deiner Anfrage den gewünschten Termin, den Ausführungsort, den Leistungsumfang und besondere Anforderungen an. ` +
      `Fotos und Mengenangaben können die Preisberechnung zusätzlich erleichtern.`,

    `Die Kosten hängen unter anderem vom Arbeitsumfang, der Objektgrösse, der Zugänglichkeit, dem Termin und möglichen Zusatzleistungen ab. ` +
      `Deshalb empfiehlt es sich, mehrere Angebote zu prüfen und die enthaltenen Leistungen genau zu vergleichen.`,

    `Über Auftrago erreichst du regionale Anbieter aus ${cityName} und der Umgebung. ` +
      `Du entscheidest selbst, welches Angebot am besten zu deinem Auftrag passt.`,
  ].join("\n\n");

  if (!baseContent) {
    return additionalContent;
  }

  const wordCount = baseContent
    .split(/\s+/)
    .filter(Boolean).length;

  if (wordCount >= 250) {
    return baseContent;
  }

  return `${baseContent}\n\n${additionalContent}`;
}

function isValidTitle(value: string | null) {
  if (!value?.trim()) {
    return false;
  }

  const length = value.trim().length;

  return length >= 30 && length <= 65;
}

function isValidDescription(
  value: string | null
) {
  if (!value?.trim()) {
    return false;
  }

  const length = value.trim().length;

  return length >= 110 && length <= 170;
}

function countWords(
  value: string | null | undefined
) {
  if (!value?.trim()) {
    return 0;
  }

  return value
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

function revalidateSeo() {
  revalidatePath("/admin/seo");
  revalidatePath("/admin/seo/audit");
  revalidatePath("/admin/seo/health");
  revalidatePath("/admin/seo/sitemap");
  revalidatePath("/admin/seo/publish");
  revalidatePath("/admin/seo/landingpages");
  revalidatePath("/sitemap.xml");
}

export async function repairSeoAuditIssues() {
  const pages =
    await prisma.seoLandingPage.findMany({
      include: {
        city: {
          select: {
            name: true,
            slug: true,
          },
        },
        service: {
          select: {
            name: true,
            slug: true,
            priceMinCents: true,
            priceMaxCents: true,
          },
        },
      },
    });

  let checked = 0;
  let repaired = 0;
  let unchanged = 0;
  let failed = 0;

  for (const page of pages) {
    checked += 1;

    try {
      const expectedCanonical =
        `${BASE_URL}/dienstleistung/` +
        `${page.service.slug}/${page.city.slug}`;

      const currentWordCount =
        countWords(page.introduction) +
        countWords(page.content);

      const data: {
        seoTitle?: string;
        seoDescription?: string;
        headline?: string;
        introduction?: string;
        content?: string;
        canonicalUrl?: string;
        customPriceMinCents?: number;
        customPriceMaxCents?: number;
      } = {};

      if (!isValidTitle(page.seoTitle)) {
        data.seoTitle = createTitle(
          page.service.name,
          page.city.name
        );
      }

      if (
        !isValidDescription(
          page.seoDescription
        )
      ) {
        data.seoDescription =
          createDescription(
            page.service.name,
            page.city.name
          );
      }

      if (!page.headline?.trim()) {
        data.headline = createHeadline(
          page.service.name,
          page.city.name
        );
      }

      if (!page.introduction?.trim()) {
        data.introduction =
          createIntroduction(
            page.service.name,
            page.city.name
          );
      }

      if (currentWordCount < 250) {
        data.content = createContent(
          page.service.name,
          page.city.name,
          page.content
        );
      }

      if (
        page.canonicalUrl?.trim() !==
        expectedCanonical
      ) {
        data.canonicalUrl =
          expectedCanonical;
      }

      if (
        page.customPriceMinCents == null
      ) {
        data.customPriceMinCents =
          page.service.priceMinCents ??
          15000;
      }

      if (
        page.customPriceMaxCents == null
      ) {
        data.customPriceMaxCents =
          page.service.priceMaxCents ??
          90000;
      }

      if (Object.keys(data).length === 0) {
        unchanged += 1;
        continue;
      }

      await prisma.seoLandingPage.update({
        where: {
          id: page.id,
        },
        data,
      });

      revalidatePath(
        `/dienstleistung/${page.service.slug}/${page.city.slug}`
      );

      repaired += 1;
    } catch (error) {
      console.error(
        `SEO-Audit-Reparatur für ${page.id} fehlgeschlagen:`,
        error
      );

      failed += 1;
    }
  }

  revalidateSeo();

  return {
    success: failed === 0,
    checked,
    repaired,
    unchanged,
    failed,
    message:
      `${checked} Landingpages geprüft. ` +
      `${repaired} Seiten wurden optimiert, ` +
      `${unchanged} waren bereits in Ordnung.` +
      (failed > 0
        ? ` ${failed} Reparaturen sind fehlgeschlagen.`
        : ""),
  };
}
