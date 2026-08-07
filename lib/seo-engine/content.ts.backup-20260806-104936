import type { CityProfile } from "@/data/seo/city-profiles";
import type { ServiceProfile } from "@/data/seo/service-profiles";

function stableIndex(seed: string, length: number) {
  let hash = 0;

  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash * 31 + seed.charCodeAt(index)) >>> 0;
  }

  return length ? hash % length : 0;
}

function choose(seed: string, values: string[]) {
  return values[stableIndex(seed, values.length)];
}

export function buildSeoContent(
  service: ServiceProfile,
  city: CityProfile
) {
  const seed = `${service.slug}-${city.slug}`;

  const opening = choose(seed, [
    `Wer in ${city.name} einen passenden Anbieter für ${service.name} sucht, sollte den Auftrag möglichst genau beschreiben und mehrere Rückmeldungen vergleichen.`,
    `${service.name} in ${city.name} lässt sich einfacher organisieren, wenn Umfang, Termin und gewünschte Zusatzleistungen von Anfang an klar sind.`,
    `Für ${service.name} in ${city.name} lohnt sich ein Vergleich regionaler Firmen, damit Leistung, Termin und Preis zum Auftrag passen.`,
  ]);

  const comparison = choose(`${seed}-comparison`, [
    "Achte darauf, ob Anfahrt, Material, Entsorgung und mögliche Zusatzarbeiten bereits im Preis enthalten sind.",
    "Vergleiche neben dem Preis auch Erreichbarkeit, Leistungsumfang, Terminbestätigung und den Umgang mit Zusatzaufwand.",
    "Eine nachvollziehbare Offerte sollte die wichtigsten Arbeiten, Ausschlüsse und Kostenpositionen verständlich ausweisen.",
  ]);

  return {
    heroTitle: `${service.name} in ${city.name}`,
    heroDescription: `${service.description} Erstelle eine kostenlose Anfrage und vergleiche regionale Anbieter in ${city.name} und Umgebung.`,
    localIntro: `${city.introVariant} ${opening}`,
    comparisonText: comparison,
    priceIntro:
      service.priceFrom && service.priceTo
        ? `Als grobe Orientierung können Aufträge je nach Umfang zwischen CHF ${service.priceFrom.toLocaleString("de-CH")} und CHF ${service.priceTo.toLocaleString("de-CH")} liegen. Der konkrete Preis hängt von Aufwand, Objekt, Termin, Material und Zusatzleistungen ab.`
        : "Der Preis hängt von Umfang, Termin, Material, Zugänglichkeit und gewünschten Zusatzleistungen ab.",
    ctaTitle: `${service.name} in ${city.name} anfragen`,
    ctaText:
      "Beschreibe deinen Auftrag kostenlos und unverbindlich. Passende Anbieter können sich direkt bei dir melden.",
  };
}

export function buildFaqs(
  service: ServiceProfile,
  city: CityProfile
) {
  return [
    {
      question: `Wie finde ich Anbieter für ${service.name} in ${city.name}?`,
      answer:
        "Erstelle auf Auftrago eine möglichst vollständige Anfrage. Regionale Anbieter können sich danach mit einer Offerte oder Rückfrage bei dir melden.",
    },
    {
      question: `Was kostet ${service.name} in ${city.name}?`,
      answer:
        service.priceFrom && service.priceTo
          ? `Je nach Umfang kann der Preis grob zwischen CHF ${service.priceFrom.toLocaleString("de-CH")} und CHF ${service.priceTo.toLocaleString("de-CH")} liegen. Entscheidend sind Aufwand, Objekt, Termin und Zusatzleistungen.`
          : "Der Preis wird durch Umfang, Aufwand, Termin, Zugänglichkeit und Zusatzleistungen bestimmt.",
    },
    {
      question: "Welche Angaben sollte meine Anfrage enthalten?",
      answer: `Hilfreich sind insbesondere: ${service.requestTips.join(", ")}.`,
    },
    {
      question: "Ist die Anfrage kostenlos und unverbindlich?",
      answer:
        "Ja. Als Kunde kannst du deine Anfrage kostenlos erstellen und selbst entscheiden, ob du eine Offerte annehmen möchtest.",
    },
    {
      question: "Worauf sollte ich beim Vergleich achten?",
      answer:
        "Vergleiche Leistungsumfang, Gesamtpreis, Termin, Kommunikation, Erfahrung und mögliche Zusatzkosten.",
    },
  ];
}
