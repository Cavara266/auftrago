export const seoIntents = [
  "kosten",
  "preise",
  "offerte",
  "anbieter",
  "firma",
  "vergleich",
  "guenstig",
  "schnell",
  "kurzfristig",
  "professionell",
  "privat",
  "gewerbe",
] as const;

export const seoAudiences = [
  "privathaushalt",
  "mieter",
  "eigentuemer",
  "verwaltung",
  "gewerbe",
  "buero",
  "unternehmen",
  "immobilienverwaltung",
] as const;

export const seoModifiers = [
  "mit-offerte",
  "kostenlos-anfragen",
  "regional",
  "in-der-naehe",
  "kurzfristig",
  "mit-abnahmegarantie",
  "inkl-material",
  "wochenende",
  "dringend",
  "professionell",
] as const;

export type SeoIntent = typeof seoIntents[number];
export type SeoAudience = typeof seoAudiences[number];
export type SeoModifier = typeof seoModifiers[number];
