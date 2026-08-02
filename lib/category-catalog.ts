import type { ServiceCategory } from "@/lib/service-catalog";

export type CategoryCatalogItem = {
  slug: ServiceCategory;
  name: string;
  shortName: string;
  eyebrow: string;
  title: string;
  description: string;
  metaDescription: string;
  icon: string;
};

export const categoryCatalog: CategoryCatalogItem[] = [
  {
    slug: "haus-reinigung",
    name: "Haus & Reinigung",
    shortName: "Reinigung",
    eyebrow: "Sauberkeit und Objektpflege",
    title: "Reinigungs- und Hauswartungsangebote vergleichen",
    description:
      "Finde passende Anbieter für Reinigung, Hauswartung, Gebäudeunterhalt und Spezialreinigungen. Beschreibe deinen Auftrag einmal und erhalte unverbindliche Offerten aus deiner Region.",
    metaDescription:
      "Reinigung und Hauswartung vergleichen: regionale Anbieter finden und kostenlos mehrere Offerten für deinen Auftrag erhalten.",
    icon: "🏠",
  },
  {
    slug: "handwerk",
    name: "Handwerk",
    shortName: "Handwerk",
    eyebrow: "Renovation, Reparatur und Montage",
    title: "Handwerker finden und Offerten vergleichen",
    description:
      "Vergleiche qualifizierte Anbieter für Malerarbeiten, Elektro, Sanitär, Bodenbeläge, Schreinerarbeiten, Renovationen und viele weitere Handwerksleistungen.",
    metaDescription:
      "Handwerker in der Schweiz finden. Auftrag kostenlos beschreiben und passende Offerten von regionalen Fachbetrieben vergleichen.",
    icon: "🛠️",
  },
  {
    slug: "umzug-transport",
    name: "Umzug & Transport",
    shortName: "Umzug",
    eyebrow: "Umziehen, transportieren und entsorgen",
    title: "Umzugs- und Transportangebote vergleichen",
    description:
      "Finde Unterstützung für Privatumzüge, Firmenumzüge, Möbeltransporte, Räumungen, Entsorgungen und Lagerungen. Vergleiche mehrere passende Anbieter.",
    metaDescription:
      "Umzug, Transport und Entsorgung vergleichen. Kostenlos Anfrage stellen und Offerten von passenden Anbietern erhalten.",
    icon: "🚚",
  },
  {
    slug: "garten-aussenbereich",
    name: "Garten & Aussenbereich",
    shortName: "Garten",
    eyebrow: "Pflege und Gestaltung im Freien",
    title: "Gartenarbeiten und Aussenpflege vergleichen",
    description:
      "Finde Gärtner und Fachbetriebe für Gartenpflege, Gartenbau, Baumpflege, Terrassen, Zäune, Winterdienst und weitere Arbeiten im Aussenbereich.",
    metaDescription:
      "Gartenpflege und Gartenbau vergleichen. Regionale Gärtner finden und kostenlos passende Offerten erhalten.",
    icon: "🌿",
  },
  {
    slug: "immobilien",
    name: "Immobilien",
    shortName: "Immobilien",
    eyebrow: "Bewerten, verkaufen und verwalten",
    title: "Immobiliendienstleistungen vergleichen",
    description:
      "Vergleiche Anbieter für Immobilienverkauf, Bewertung, Verwaltung, Vermietung, Bauplanung, Wohnungsübergaben und weitere Leistungen rund um Immobilien.",
    metaDescription:
      "Immobiliendienstleister vergleichen: Makler, Verwaltungen, Bewertungen und weitere Fachanbieter aus deiner Region finden.",
    icon: "🏢",
  },
  {
    slug: "energie-technik",
    name: "Energie & Technik",
    shortName: "Energie",
    eyebrow: "Moderne Lösungen für Gebäude",
    title: "Energie- und Technikangebote vergleichen",
    description:
      "Finde Fachbetriebe für Solaranlagen, Wärmepumpen, Ladeinfrastruktur, Gebäudeautomation, Sicherheitstechnik und energetische Optimierungen.",
    metaDescription:
      "Anbieter für Solar, Wärmepumpen, Energieberatung und Gebäudetechnik vergleichen und regionale Offerten erhalten.",
    icon: "⚡",
  },
  {
    slug: "it-digital",
    name: "IT & Digital",
    shortName: "IT & Digital",
    eyebrow: "Technologie, Web und Marketing",
    title: "IT- und Digitaldienstleister vergleichen",
    description:
      "Vergleiche Anbieter für IT-Support, Webdesign, Softwareentwicklung, SEO, Online-Marketing, Cyber Security und weitere digitale Dienstleistungen.",
    metaDescription:
      "IT- und Digitalagenturen vergleichen. Passende Anbieter für Web, Software, Marketing und IT-Support finden.",
    icon: "💻",
  },
  {
    slug: "finanzen-beratung",
    name: "Finanzen & Beratung",
    shortName: "Finanzen",
    eyebrow: "Unternehmen und Privatpersonen beraten",
    title: "Finanz- und Beratungsangebote vergleichen",
    description:
      "Finde Treuhänder, Buchhalter, Steuerberater, Versicherungsberater, Unternehmensberater und weitere Fachpersonen für finanzielle und rechtliche Themen.",
    metaDescription:
      "Treuhand, Buchhaltung, Versicherungen und Beratung vergleichen. Geeignete Fachpersonen in der Schweiz finden.",
    icon: "📊",
  },
];

export const categorySlugs = categoryCatalog.map((category) => category.slug);

export function getCategoryBySlug(slug: string) {
  return categoryCatalog.find((category) => category.slug === slug);
}
