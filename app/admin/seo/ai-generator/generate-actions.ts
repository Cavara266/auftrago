"use server";

import OpenAI from "openai";
import { z } from "zod";

import { prisma } from "@/lib/prisma";

type GenerateSeoInput = {
  cityId: string;
  serviceId: string;
};

const GeneratedSeoSchema = z.object({
  seoTitle: z.string().min(10).max(60),
  seoDescription: z.string().min(50).max(155),
  headline: z.string().min(10).max(120),
  introduction: z.string().min(100).max(1200),
  content: z.string().min(2500).max(30000),
  faqs: z
    .array(
      z.object({
        question: z.string().min(15).max(180),
        answer: z.string().min(60).max(900),
      })
    )
    .min(4)
    .max(6),
});

type GeneratedSeoContent = z.infer<
  typeof GeneratedSeoSchema
> & {
  canonicalUrl: string;
  priceMin: string;
  priceMax: string;
};

function cleanJsonOutput(value: string) {
  return value
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
}

export async function generateSeoLandingContent(
  input: GenerateSeoInput
): Promise<GeneratedSeoContent> {
  const apiKey =
    process.env.OPENAI_API_KEY?.trim();

  if (!apiKey) {
    throw new Error(
      "OPENAI_API_KEY fehlt in .env.local."
    );
  }

  const cityId = input.cityId?.trim();
  const serviceId =
    input.serviceId?.trim();

  if (!cityId || !serviceId) {
    throw new Error(
      "Bitte zuerst eine Stadt und eine Dienstleistung auswählen."
    );
  }

  const [city, service] =
    await Promise.all([
      prisma.seoCity.findUnique({
        where: {
          id: cityId,
        },
        select: {
          name: true,
          slug: true,
          canton: true,
          region: true,
          country: true,
          introduction: true,
          localContent: true,
          neighboringCities: true,
        },
      }),

      prisma.seoServicePage.findUnique({
        where: {
          id: serviceId,
        },
        select: {
          name: true,
          shortName: true,
          slug: true,
          description: true,
          content: true,
          priceMinCents: true,
          priceMaxCents: true,
          priceUnit: true,
          benefits: true,
          relatedServices: true,
        },
      }),
    ]);

  if (!city) {
    throw new Error(
      "Die ausgewählte Stadt wurde nicht gefunden."
    );
  }

  if (!service) {
    throw new Error(
      "Die ausgewählte Dienstleistung wurde nicht gefunden."
    );
  }

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

  const canonicalUrl =
    `https://www.auftrago.ch/dienstleistung/${service.slug}/${city.slug}`;

  const client = new OpenAI({
    apiKey,
  });

  const model =
    process.env.OPENAI_MODEL?.trim() ||
    "gpt-5-mini";

  const prompt = `
Du bist ein professioneller Schweizer SEO-Texter für Auftrago.ch.

Auftrago.ch ist ein Schweizer Marktplatz, auf dem Privatpersonen und Unternehmen regionale Dienstleister finden und Angebote vergleichen können.

Erstelle eine hochwertige lokale SEO-Landingpage.

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
    "keine"
  }

DIENSTLEISTUNG:
- Name: ${serviceName}
- Beschreibung: ${
    service.description || "keine"
  }
- Bestehender Inhalt: ${
    service.content || "keiner"
  }
- Vorteile: ${
    service.benefits.length > 0
      ? service.benefits.join(", ")
      : "keine angegeben"
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

ANFORDERUNGEN:
- Schreibe auf Deutsch für die Schweiz.
- Verwende Schweizer Schreibweise ohne ß.
- Schreibe seriös, natürlich und hilfreich.
- Keine erfundenen Firmen.
- Keine erfundenen Bewertungen.
- Keine erfundenen Garantien.
- Keine erfundenen Statistiken.
- Keine Keyword-Wiederholungen.
- Auftrago führt die Arbeiten nicht selbst aus.
- Auftrago vermittelt Anfragen an passende Anbieter.
- Haupttext ungefähr 900 bis 1'300 Wörter.
- Verwende Markdown mit H2-Überschriften.
- Keine H1 im Haupttext.
- Erkläre Leistungen, Kostenfaktoren, Ablauf und Anbieterauswahl.
- Integriere Stadt und Kanton natürlich.
- Abschluss mit klarer Aufforderung zur Anfrage.
- SEO-Titel maximal 60 Zeichen.
- Meta-Beschreibung maximal 155 Zeichen.
- Einleitung ungefähr 70 bis 110 Wörter.
- Erstelle genau 5 hilfreiche FAQ-Fragen.
- Die FAQs müssen zur Dienstleistung und zur Stadt passen.
- Keine erfundenen Preise, Fristen oder Garantien.
- Jede FAQ-Antwort soll ungefähr 40 bis 90 Wörter enthalten.
- Wiederhole in den FAQs nicht einfach den Haupttext.
- Keine FAQ-Überschrift im Haupttext, da sie separat ergänzt wird.

Antworte ausschliesslich als gültiges JSON mit:

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

  try {
    const response =
      await client.responses.create({
        model,
        instructions:
          "Antworte ausschliesslich als gültiges JSON ohne Markdown-Codeblock.",
        input: prompt,
        reasoning: {
          effort: "low",
        },
        text: {
          verbosity: "medium",
        },
        max_output_tokens: 6000,
      });

    const rawOutput =
      response.output_text?.trim();

    if (!rawOutput) {
      throw new Error(
        "Die OpenAI API hat keinen sichtbaren Text zurückgegeben."
      );
    }

    let parsedJson: unknown;

    try {
      parsedJson = JSON.parse(
        cleanJsonOutput(rawOutput)
      );
    } catch {
      console.error(
        "Ungültige KI-Ausgabe:",
        rawOutput
      );

      throw new Error(
        "Die KI-Antwort war kein gültiges JSON. Bitte erneut versuchen."
      );
    }

    const parsed =
      GeneratedSeoSchema.safeParse(
        parsedJson
      );

    if (!parsed.success) {
      console.error(
        "Ungültige KI-Felder:",
        parsed.error.flatten()
      );

      throw new Error(
        "Die KI-Antwort enthält unvollständige oder zu kurze Inhalte."
      );
    }

    return {
      ...parsed.data,
      canonicalUrl,
      priceMin:
        priceMin !== null
          ? String(priceMin)
          : "",
      priceMax:
        priceMax !== null
          ? String(priceMax)
          : "",
    };
  } catch (error) {
    console.error(
      "OpenAI SEO generation failed:",
      error
    );

    if (
      error instanceof OpenAI.APIError
    ) {
      if (error.status === 401) {
        throw new Error(
          "Der OpenAI API-Key ist ungültig."
        );
      }

      if (error.status === 429) {
        throw new Error(
          "Das OpenAI-Guthaben oder API-Limit reicht nicht aus."
        );
      }

      throw new Error(
        `OpenAI-Fehler ${
          error.status || ""
        }: ${error.message}`
      );
    }

    throw error instanceof Error
      ? error
      : new Error(
          "Die KI-Inhalte konnten nicht generiert werden."
        );
  }
}
