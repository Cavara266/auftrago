import fs from "node:fs";
import path from "node:path";

import OpenAI from "openai";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

function loadEnvFile(filename: string) {
  const fullPath = path.resolve(process.cwd(), filename);

  if (!fs.existsSync(fullPath)) {
    return;
  }

  const content = fs.readFileSync(fullPath, "utf8");

  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const separatorIndex = trimmed.indexOf("=");

    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmed
      .slice(0, separatorIndex)
      .trim();

    let value = trimmed
      .slice(separatorIndex + 1)
      .trim();

    if (
      (value.startsWith('"') &&
        value.endsWith('"')) ||
      (value.startsWith("'") &&
        value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

loadEnvFile(".env.local");
loadEnvFile(".env");

const prisma = new PrismaClient();

const GeneratedSeoSchema = z.object({
  seoTitle: z.string().min(10).max(60),
  seoDescription: z
    .string()
    .min(50)
    .max(155),
  headline: z.string().min(10).max(120),
  introduction: z
    .string()
    .min(100)
    .max(1200),
  content: z
    .string()
    .min(2000)
    .max(30000),
  faqs: z
    .array(
      z.object({
        question: z
          .string()
          .min(15)
          .max(180),
        answer: z
          .string()
          .min(60)
          .max(900),
      })
    )
    .length(5),
});

type GeneratedSeo = z.infer<
  typeof GeneratedSeoSchema
>;

type Job = {
  city: {
    id: string;
    slug: string;
    name: string;
    canton: string;
    region: string | null;
    country: string;
    introduction: string | null;
    localContent: string | null;
    neighboringCities: string[];
  };
  service: {
    id: string;
    slug: string;
    name: string;
    shortName: string | null;
    description: string | null;
    content: string | null;
    priceMinCents: number | null;
    priceMaxCents: number | null;
    priceUnit: string | null;
    benefits: string[];
    relatedServices: string[];
  };
};

type Arguments = {
  limit: number;
  concurrency: number;
  serviceSlug: string | null;
  citySlug: string | null;
  overwrite: boolean;
  publish: boolean;
};

function getArgument(
  name: string
): string | null {
  const prefix = `--${name}=`;

  const value = process.argv.find((item) =>
    item.startsWith(prefix)
  );

  return value
    ? value.slice(prefix.length).trim()
    : null;
}

function hasFlag(name: string) {
  return process.argv.includes(`--${name}`);
}

function parsePositiveInteger(
  value: string | null,
  fallback: number,
  maximum: number
) {
  if (!value) {
    return fallback;
  }

  const parsed = Number.parseInt(value, 10);

  if (
    !Number.isFinite(parsed) ||
    parsed <= 0
  ) {
    return fallback;
  }

  return Math.min(parsed, maximum);
}

const args: Arguments = {
  limit: parsePositiveInteger(
    getArgument("limit"),
    10,
    500
  ),
  concurrency: parsePositiveInteger(
    getArgument("concurrency"),
    2,
    5
  ),
  serviceSlug:
    getArgument("service") || null,
  citySlug: getArgument("city") || null,
  overwrite: hasFlag("overwrite"),
  publish: hasFlag("publish"),
};

const apiKey =
  process.env.OPENAI_API_KEY?.trim();

if (!apiKey) {
  console.error(
    "FEHLER: OPENAI_API_KEY fehlt in .env.local."
  );
  process.exit(1);
}

const model =
  process.env.OPENAI_MODEL?.trim() ||
  "gpt-5-mini";

const openai = new OpenAI({
  apiKey,
});

function cleanJsonOutput(value: string) {
  return value
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
}

function sleep(milliseconds: number) {
  return new Promise((resolve) =>
    setTimeout(resolve, milliseconds)
  );
}

function formatFaqs(
  faqs: GeneratedSeo["faqs"]
) {
  return [
    "## Häufige Fragen",
    "",
    ...faqs.flatMap((faq) => [
      `### ${faq.question.trim()}`,
      "",
      faq.answer.trim(),
      "",
    ]),
  ]
    .join("\n")
    .trim();
}

function buildPrompt(job: Job) {
  const { city, service } = job;

  const serviceName =
    service.shortName?.trim() ||
    service.name;

  const priceMin =
    service.priceMinCents !== null
      ? Math.round(
          service.priceMinCents / 100
        )
      : null;

  const priceMax =
    service.priceMaxCents !== null
      ? Math.round(
          service.priceMaxCents / 100
        )
      : null;

  const variationSeed = [
    city.slug.length,
    service.slug.length,
    city.name.charCodeAt(0),
    service.name.charCodeAt(0),
  ].reduce(
    (sum, number) => sum + number,
    0
  );

  const structureVariant =
    variationSeed % 4;

  const structureInstructions = [
    "Beginne mit dem Nutzen für Auftraggeber. Erkläre danach Leistungen, Kostenfaktoren, Ablauf und Auswahlkriterien.",
    "Beginne mit typischen Situationen, in denen die Dienstleistung benötigt wird. Erkläre danach Leistungen, Planung, Preise und Anbietervergleich.",
    "Beginne mit der regionalen Suche in der Stadt. Erkläre danach Leistungsumfang, Qualitätsmerkmale, Kosten und Auftragserfassung.",
    "Beginne mit den wichtigsten Entscheidungsfaktoren. Erkläre danach mögliche Arbeiten, Preisfaktoren, Vorbereitung und Ablauf.",
  ][structureVariant];

  return `
Du bist ein professioneller Schweizer SEO-Texter für Auftrago.ch.

Auftrago.ch ist ein Schweizer Marktplatz. Privatpersonen und Unternehmen können dort Anfragen erfassen und Rückmeldungen von passenden regionalen Dienstleistern erhalten.

Erstelle eine eigenständige lokale SEO-Landingpage.

STADT:
- Name: ${city.name}
- Kanton: ${city.canton}
- Region: ${city.region || "nicht angegeben"}
- Land: ${city.country}
- Nachbarorte: ${
    city.neighboringCities.length > 0
      ? city.neighboringCities.join(", ")
      : "nicht angegeben"
  }
- Lokale Informationen: ${
    city.localContent ||
    city.introduction ||
    "keine zusätzlichen Informationen"
  }

DIENSTLEISTUNG:
- Name: ${serviceName}
- Beschreibung: ${
    service.description ||
    "keine zusätzliche Beschreibung"
  }
- Bestehender Basisinhalt: ${
    service.content ||
    "kein Basisinhalt vorhanden"
  }
- Vorteile: ${
    service.benefits.length > 0
      ? service.benefits.join(", ")
      : "keine zusätzlichen Vorteile angegeben"
  }
- Verwandte Dienstleistungen: ${
    service.relatedServices.length > 0
      ? service.relatedServices.join(", ")
      : "keine angegeben"
  }
- Mindestpreis: ${
    priceMin !== null
      ? `CHF ${priceMin}`
      : "nicht angegeben"
  }
- Höchstpreis: ${
    priceMax !== null
      ? `CHF ${priceMax}`
      : "nicht angegeben"
  }
- Preiseinheit: ${
    service.priceUnit ||
    "nicht angegeben"
  }

STRUKTURVARIANTE:
${structureInstructions}

ANFORDERUNGEN:
- Schreibe auf Deutsch für die Schweiz.
- Verwende Schweizer Schreibweise ohne ß.
- Schreibe natürlich, fachlich und hilfreich.
- Erstelle einen eigenständigen Text für diese Kombination.
- Vermeide austauschbare Standardformulierungen.
- Keine erfundenen Firmen, Bewertungen oder Statistiken.
- Keine erfundenen Garantien, Preise oder Fristen.
- Keine unbelegten Aussagen über die Stadt.
- Auftrago führt die Arbeiten nicht selbst aus.
- Auftrago vermittelt die Anfrage an passende Anbieter.
- Haupttext ungefähr 750 bis 1'100 Wörter.
- Verwende Markdown mit sinnvollen H2-Überschriften.
- Keine H1 innerhalb des Haupttextes.
- Verwende keine FAQ im Haupttext.
- Integriere Stadt und Kanton natürlich.
- Nenne Nachbarorte nur, wenn sie oben angegeben sind.
- Erkläre Leistungsumfang, Kostenfaktoren und Ablauf.
- Erkläre, worauf beim Anbietervergleich zu achten ist.
- Beende den Text mit einer klaren Aufforderung zur Anfrage.
- SEO-Titel maximal 60 Zeichen.
- Meta-Beschreibung maximal 155 Zeichen.
- Einleitung ungefähr 70 bis 110 Wörter.
- Erstelle genau 5 eigenständige FAQs.
- Jede FAQ-Antwort ungefähr 40 bis 90 Wörter.
- Keine Wiederholung ganzer Abschnitte aus dem Haupttext.

Antworte ausschliesslich mit gültigem JSON:

{
  "seoTitle": "Text",
  "seoDescription": "Text",
  "headline": "Text",
  "introduction": "Text",
  "content": "Markdown-Haupttext",
  "faqs": [
    {
      "question": "Frage",
      "answer": "Antwort"
    },
    {
      "question": "Frage",
      "answer": "Antwort"
    },
    {
      "question": "Frage",
      "answer": "Antwort"
    },
    {
      "question": "Frage",
      "answer": "Antwort"
    },
    {
      "question": "Frage",
      "answer": "Antwort"
    }
  ]
}
`.trim();
}

async function generateContent(
  job: Job
): Promise<GeneratedSeo> {
  const prompt = buildPrompt(job);

  let lastError: unknown = null;

  for (
    let attempt = 1;
    attempt <= 3;
    attempt += 1
  ) {
    try {
      const response =
        await openai.responses.create({
          model,
          instructions:
            "Antworte ausschliesslich mit gültigem JSON ohne Markdown-Codeblock.",
          input: prompt,
          reasoning: {
            effort: "low",
          },
          text: {
            verbosity: "medium",
          },
          max_output_tokens: 5500,
        });

      const rawOutput =
        response.output_text?.trim();

      if (!rawOutput) {
        throw new Error(
          "Die API hat keinen sichtbaren Text zurückgegeben."
        );
      }

      const json = JSON.parse(
        cleanJsonOutput(rawOutput)
      );

      const parsed =
        GeneratedSeoSchema.safeParse(
          json
        );

      if (!parsed.success) {
        console.error(
          "Validierungsfehler:",
          parsed.error.flatten()
        );

        throw new Error(
          "Die KI-Antwort erfüllt das Inhaltsformat nicht."
        );
      }

      return parsed.data;
    } catch (error) {
      lastError = error;

      const status =
        error instanceof OpenAI.APIError
          ? error.status
          : null;

      if (
        status === 401 ||
        status === 403
      ) {
        throw error;
      }

      const waitTime =
        attempt * 5000;

      console.log(
        `   Versuch ${attempt} fehlgeschlagen. Neuer Versuch in ${waitTime / 1000} Sekunden.`
      );

      await sleep(waitTime);
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error(
        "Generierung nach drei Versuchen fehlgeschlagen."
      );
}

async function getJobs(): Promise<Job[]> {
  const [cities, services, existing] =
    await Promise.all([
      prisma.seoCity.findMany({
        where: {
          status: {
            in: ["ACTIVE", "DRAFT"],
          },
          ...(args.citySlug
            ? {
                slug: args.citySlug,
              }
            : {}),
        },
        select: {
          id: true,
          slug: true,
          name: true,
          canton: true,
          region: true,
          country: true,
          introduction: true,
          localContent: true,
          neighboringCities: true,
        },
        orderBy: [
          {
            canton: "asc",
          },
          {
            name: "asc",
          },
        ],
      }),

      prisma.seoServicePage.findMany({
        where: {
          status: {
            in: ["ACTIVE", "DRAFT"],
          },
          ...(args.serviceSlug
            ? {
                slug: args.serviceSlug,
              }
            : {}),
        },
        select: {
          id: true,
          slug: true,
          name: true,
          shortName: true,
          description: true,
          content: true,
          priceMinCents: true,
          priceMaxCents: true,
          priceUnit: true,
          benefits: true,
          relatedServices: true,
        },
        orderBy: {
          name: "asc",
        },
      }),

      args.overwrite
        ? Promise.resolve([])
        : prisma.seoLandingPage.findMany({
            select: {
              cityId: true,
              serviceId: true,
            },
          }),
    ]);

  if (cities.length === 0) {
    throw new Error(
      args.citySlug
        ? `Keine SEO-Stadt mit dem Slug "${args.citySlug}" gefunden.`
        : "Keine SEO-Städte gefunden."
    );
  }

  if (services.length === 0) {
    throw new Error(
      args.serviceSlug
        ? `Keine SEO-Dienstleistung mit dem Slug "${args.serviceSlug}" gefunden.`
        : "Keine SEO-Dienstleistungen gefunden."
    );
  }

  const existingKeys = new Set(
    existing.map(
      (page) =>
        `${page.cityId}:${page.serviceId}`
    )
  );

  const jobs: Job[] = [];

  for (const service of services) {
    for (const city of cities) {
      const key =
        `${city.id}:${service.id}`;

      if (
        !args.overwrite &&
        existingKeys.has(key)
      ) {
        continue;
      }

      jobs.push({
        city,
        service,
      });

      if (jobs.length >= args.limit) {
        return jobs;
      }
    }
  }

  return jobs;
}

async function saveLandingPage(
  job: Job,
  generated: GeneratedSeo
) {
  const { city, service } = job;

  const slug =
    `${service.slug}-${city.slug}`;

  const canonicalUrl =
    `https://www.auftrago.ch/dienstleistung/${service.slug}/${city.slug}`;

  const content = [
    generated.content.trim(),
    "",
    formatFaqs(generated.faqs),
  ]
    .join("\n")
    .trim();

  const now = new Date();

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
      headline:
        generated.headline.trim(),
      introduction:
        generated.introduction.trim(),
      content,
      seoTitle:
        generated.seoTitle.trim(),
      seoDescription:
        generated.seoDescription.trim(),
      canonicalUrl,
      customPriceMinCents:
        service.priceMinCents,
      customPriceMaxCents:
        service.priceMaxCents,
      status: args.publish
        ? "ACTIVE"
        : "DRAFT",
      indexable: true,
      publishedAt: args.publish
        ? now
        : null,
    },
    update: {
      slug,
      headline:
        generated.headline.trim(),
      introduction:
        generated.introduction.trim(),
      content,
      seoTitle:
        generated.seoTitle.trim(),
      seoDescription:
        generated.seoDescription.trim(),
      canonicalUrl,
      customPriceMinCents:
        service.priceMinCents,
      customPriceMaxCents:
        service.priceMaxCents,
      status: args.publish
        ? "ACTIVE"
        : "DRAFT",
      indexable: true,
      publishedAt: args.publish
        ? now
        : undefined,
    },
  });
}

async function runWorker(
  workerNumber: number,
  jobs: Job[],
  state: {
    nextIndex: number;
    success: number;
    failed: number;
  }
) {
  while (true) {
    const index = state.nextIndex;
    state.nextIndex += 1;

    const job = jobs[index];

    if (!job) {
      return;
    }

    const label =
      `${job.service.name} in ${job.city.name}`;

    console.log(
      `\n[Worker ${workerNumber}] ${index + 1}/${jobs.length}: ${label}`
    );

    try {
      const generated =
        await generateContent(job);

      await saveLandingPage(
        job,
        generated
      );

      state.success += 1;

      console.log(
        `✅ Gespeichert: ${label}`
      );
    } catch (error) {
      state.failed += 1;

      console.error(
        `❌ Fehler bei ${label}:`,
        error instanceof Error
          ? error.message
          : error
      );

      if (
        error instanceof OpenAI.APIError &&
        error.status === 429
      ) {
        console.error(
          "API-Limit oder Guthaben erreicht."
        );
      }
    }

    await sleep(1500);
  }
}

async function main() {
  console.log("");
  console.log(
    "======================================"
  );
  console.log(
    " AUFTRAGO BULK SEO GENERATOR"
  );
  console.log(
    "======================================"
  );
  console.log(`Modell: ${model}`);
  console.log(`Limit: ${args.limit}`);
  console.log(
    `Parallel: ${args.concurrency}`
  );
  console.log(
    `Status: ${
      args.publish ? "ACTIVE" : "DRAFT"
    }`
  );
  console.log(
    `Überschreiben: ${
      args.overwrite ? "Ja" : "Nein"
    }`
  );

  if (args.serviceSlug) {
    console.log(
      `Dienstleistung: ${args.serviceSlug}`
    );
  }

  if (args.citySlug) {
    console.log(
      `Stadt: ${args.citySlug}`
    );
  }

  const jobs = await getJobs();

  console.log(
    `\n${jobs.length} Landingpages werden verarbeitet.`
  );

  if (jobs.length === 0) {
    console.log(
      "Keine fehlenden Kombinationen gefunden."
    );
    return;
  }

  const state = {
    nextIndex: 0,
    success: 0,
    failed: 0,
  };

  const workerCount = Math.min(
    args.concurrency,
    jobs.length
  );

  await Promise.all(
    Array.from(
      {
        length: workerCount,
      },
      (_, index) =>
        runWorker(
          index + 1,
          jobs,
          state
        )
    )
  );

  console.log("");
  console.log(
    "======================================"
  );
  console.log(
    `✅ Erfolgreich: ${state.success}`
  );
  console.log(
    `❌ Fehlgeschlagen: ${state.failed}`
  );
  console.log(
    "======================================"
  );
}

main()
  .catch((error) => {
    console.error(
      "\nBulk-Generator abgebrochen:",
      error instanceof Error
        ? error.message
        : error
    );

    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
