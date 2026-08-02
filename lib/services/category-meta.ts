type CategoryMeta = {
  icon: string;
  description: string;
};

export const CATEGORY_META: Record<string, CategoryMeta> = {
  "Haus & Reinigung": {
    icon: "🏠",
    description:
      "Reinigung, Hauswartung, Gartenpflege und Arbeiten rund um die Liegenschaft.",
  },

  "Umzug & Transport": {
    icon: "🚚",
    description:
      "Umzüge, Transporte, Räumungen, Entsorgung und Logistik.",
  },

  Handwerk: {
    icon: "🛠️",
    description:
      "Maler, Elektriker, Sanitär, Schreiner, Bodenleger und Renovationen.",
  },

  Energie: {
    icon: "⚡",
    description:
      "Solaranlagen, Wärmepumpen, Heizung und Energieberatung.",
  },

  Immobilien: {
    icon: "🏢",
    description:
      "Makler, Bewertung, Verkauf, Vermietung und Immobilienservices.",
  },

  Finanzen: {
    icon: "💰",
    description:
      "Treuhand, Hypotheken, Buchhaltung, Steuern und Finanzberatung.",
  },

  Versicherungen: {
    icon: "🛡️",
    description:
      "Versicherungsvergleiche, Vorsorge und persönliche Beratung.",
  },

  "IT & Digital": {
    icon: "💻",
    description:
      "Webseiten, SEO, IT-Support, Marketing und digitale Dienstleistungen.",
  },

  Fahrzeuge: {
    icon: "🚗",
    description:
      "Garage, Reparaturen, Fahrzeugpflege, Transport und Mobilität.",
  },

  Gesundheit: {
    icon: "❤️",
    description:
      "Gesundheit, Therapie, Fitness, Pflege und persönliche Betreuung.",
  },

  Recht: {
    icon: "⚖️",
    description:
      "Rechtsberatung, Verträge und Unterstützung bei rechtlichen Fragen.",
  },

  Events: {
    icon: "🎉",
    description:
      "Fotografie, Musik, Catering, Dekoration und Veranstaltungsservices.",
  },

  Bildung: {
    icon: "📚",
    description:
      "Nachhilfe, Kurse, Coaching, Sprachen und Weiterbildung.",
  },

  Tiere: {
    icon: "🐾",
    description:
      "Tierbetreuung, Hundeservice, Training und weitere Tierdienstleistungen.",
  },

  Beauty: {
    icon: "✨",
    description:
      "Kosmetik, Styling, Coiffeur und persönliche Beauty-Dienstleistungen.",
  },
};

export function createCategorySlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, " und ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
