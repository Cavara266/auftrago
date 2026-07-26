"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";

import { canPublishSeoPage } from "./seo-quality";

const MINIMUM_SCORE = 70;

function createSeoTitle(
  serviceName: string,
  cityName: string
) {
  return `${serviceName} ${cityName} – Anbieter vergleichen | Auftrago`;
}

function createSeoDescription(
  serviceName: string,
  cityName: string
) {
  return (
    `Finde passende Anbieter für ${serviceName} in ${cityName}. ` +
    `Jetzt kostenlos Anfrage erstellen und regionale Angebote unverbindlich vergleichen.`
  );
}

function createIntroduction(
  serviceName: string,
  cityName: string
) {
  return (
    `Du suchst einen zuverlässigen Anbieter für ${serviceName} in ${cityName}? ` +
    `Über Auftrago kannst du deinen Auftrag kostenlos erfassen und passende ` +
    `regionale Fachbetriebe erreichen. Vergleiche Leistungen, Rückmeldungen ` +
    `und Preise unverbindlich an einem Ort.`
  );
}

function createContent(
  serviceName: string,
  cityName: string,
  canton: string,
  serviceDescription: string | null,
  cityIntroduction: string | null,
  localContent: string | null
) {
  return [
    serviceDescription ||
      `${serviceName} umfasst je nach Auftrag unterschiedliche Arbeiten und Anforderungen.`,

    cityIntroduction ||
      `${cityName} liegt im Kanton ${canton} und bietet eine Auswahl regionaler Dienstleister.`,

    localContent ||
      `Auftrago verbindet Auftraggeber mit passenden Fachbetrieben aus ${cityName} und der Umgebung.`,

    `Für eine genaue Offerte solltest du den gewünschten Leistungsumfang, den Ausführungsort, ` +
      `den Termin und besondere Anforderungen möglichst vollständig beschreiben.`,

    `Fotos, Mengenangaben und Informationen zur Zugänglichkeit helfen den Anbietern, ` +
      `den Aufwand realistisch einzuschätzen und dir eine passende Rückmeldung zu senden.`,

    `Die Kosten für ${serviceName} in ${cityName} hängen unter anderem vom Arbeitsumfang, ` +
      `der Objektgrösse, dem Termin und möglichen Zusatzleistungen ab.`,

    `Über Auftrago kannst du verschiedene Anbieter erreichen und selbst entscheiden, ` +
      `welches Angebot am besten zu deinem Auftrag passt.`,
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
        `Die Kosten hängen vom Umfang, Termin, Objekt und den gewünschten Zusatzleistungen ab. ` +
        `Eine detaillierte Anfrage ermöglicht eine genauere Einschätzung.`,
      sortOrder: 10,
    },
    {
      question: `Wie finde ich einen Anbieter für ${serviceName} in ${cityName}?`,
      answer:
        `Erstelle auf Auftrago eine kostenlose Anfrage. Passende regionale Anbieter können ` +
        `sich anschliessend mit einer Rückmeldung oder Offerte bei dir melden.`,
      sortOrder: 20,
    },
    {
      question: `Ist die Anfrage unverbindlich?`,
      answer:
        `Ja. Du kannst eingehende Angebote prüfen und selbst entscheiden, ob du einen Anbieter beauftragst.`,
      sortOrder: 30,
    },
    {
      question: `Welche Angaben sind für die Anfrage wichtig?`,
      answer:
        `Beschreibe den Leistungsumfang, den Termin, die Adresse, die Objektgrösse und besondere Anforderungen möglichst genau.`,
      sortOrder: 40,
    },
  ];
}

function revalidateSeo() {
  revalidatePath("/admin/seo");
  revalidatePath("/admin/seo/publish");
  revalidatePath("/admin/seo/health");
  revalidatePath("/admin/seo/analytics");
  revalidatePath("/admin/seo/landingpages");
  revalidatePath("/admin/seo/generator");
  revalidatePath("/sitemap.xml");
}

export async function optimizeAndPublishDrafts() {
  const drafts = await prisma.seoLandingPage.findMany({
    where: {
      status: "DRAFT",
    },
    include: {
      city: true,
      service: {
        include: {
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
    orderBy: {
      createdAt: "asc",
    },
  });

  let optimized = 0;
  let published = 0;
  let blocked = 0;
  let failed = 0;

  for (const page of drafts) {
    try {
      const serviceName = page.service.name;
      const cityName = page.city.name;

      const seoTitle =
        page.seoTitle &&
        page.seoTitle.trim().length >= 30 &&
        page.seoTitle.trim().length <= 65
          ? page.seoTitle
          : createSeoTitle(
              serviceName,
              cityName
            );

      const seoDescription =
        page.seoDescription &&
        page.seoDescription.trim().length >= 110 &&
        page.seoDescription.trim().length <= 170
          ? page.seoDescription
          : createSeoDescription(
              serviceName,
              cityName
            );

      const headline =
        page.headline?.trim() ||
        `${serviceName} in ${cityName}`;

      const introduction =
        page.introduction?.trim() ||
        createIntroduction(
          serviceName,
          cityName
        );

      const content =
        page.content?.trim() ||
        createContent(
          serviceName,
          cityName,
          page.city.canton,
          page.service.description,
          page.city.introduction,
          page.city.localContent
        );

      const canonicalUrl =
        page.canonicalUrl?.trim() ||
        `https://www.auftrago.ch/dienstleistung/${page.service.slug}/${page.city.slug}`;

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
            customPriceMinCents:
              page.customPriceMinCents ??
              page.service.priceMinCents ??
              15000,
            customPriceMaxCents:
              page.customPriceMaxCents ??
              page.service.priceMaxCents ??
              90000,
          },
        });

        if (page.service.faqs.length < 3) {
          const existingQuestions =
            await transaction.seoFaq.findMany({
              where: {
                serviceId: page.serviceId,
                status: "ACTIVE",
              },
              select: {
                question: true,
              },
            });

          const existingQuestionSet = new Set(
            existingQuestions.map(
              (faq) => faq.question
            )
          );

          const missingFaqs = createFaqs(
            serviceName,
            cityName
          ).filter(
            (faq) =>
              !existingQuestionSet.has(
                faq.question
              )
          );

          if (missingFaqs.length > 0) {
            await transaction.seoFaq.createMany({
              data: missingFaqs.map((faq) => ({
                serviceId: page.serviceId,
                question: faq.question,
                answer: faq.answer,
                sortOrder: faq.sortOrder,
                status: "ACTIVE",
              })),
            });
          }
        }
      });

      optimized += 1;

      const refreshedPage =
        await prisma.seoLandingPage.findUnique({
          where: {
            id: page.id,
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

      if (!refreshedPage) {
        failed += 1;
        continue;
      }

      const quality = canPublishSeoPage(
        refreshedPage,
        MINIMUM_SCORE
      );

      if (!quality.allowed) {
        blocked += 1;
        continue;
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

      published += 1;
    } catch (error) {
      console.error(
        `SEO-Pipeline für Landingpage ${page.id} fehlgeschlagen:`,
        error
      );

      failed += 1;
    }
  }

  revalidateSeo();

  return {
    success: true,
    total: drafts.length,
    optimized,
    published,
    blocked,
    failed,
    minimumScore: MINIMUM_SCORE,
    message:
      `${optimized} Entwürfe optimiert, ` +
      `${published} veröffentlicht, ` +
      `${blocked} wegen zu niedrigem SEO-Score blockiert.` +
      (failed > 0
        ? ` ${failed} Aktionen sind fehlgeschlagen.`
        : ""),
  };
}
