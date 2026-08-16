export type AuftragoLocale = "de" | "fr" | "it" | "en" | "sq" | "tr" | "pt" | "es";

export const defaultLocale: AuftragoLocale = "de";

export const translations = {
  de: {
    nav: {
      services: "Dienstleistungen",
      providers: "Anbieter",
      regions: "Regionen",
      insurance: "Versicherungen",
      forProviders: "Für Anbieter",
      priceCalculator: "Preisrechner",
      calculateNow: "Sofort berechnen",
      search: "Suche",
      startOrder: "Auftrag starten",
      requestOffer: "Offerte anfragen",
    },
    search: {
      eyebrow: "Auftrago Suche",
      title: "Wonach suchst du?",
      placeholder:
        "Zum Beispiel Reinigung, Elektriker oder Krankenkasse",
      close: "Suche schliessen",
      open: "Suche öffnen",
      submit: "Suchen",
    },
    menu: {
      open: "Menü öffnen",
      close: "Menü schliessen",
    },
  },

  fr: {
    nav: {
      services: "Services",
      providers: "Prestataires",
      regions: "Régions",
      insurance: "Assurances",
      forProviders: "Pour prestataires",
      priceCalculator: "Calculateur de prix",
      calculateNow: "Calculer maintenant",
      search: "Recherche",
      startOrder: "Créer une demande",
      requestOffer: "Demander une offre",
    },
    search: {
      eyebrow: "Recherche Auftrago",
      title: "Que recherchez-vous ?",
      placeholder:
        "Par exemple nettoyage, électricien ou assurance maladie",
      close: "Fermer la recherche",
      open: "Ouvrir la recherche",
      submit: "Rechercher",
    },
    menu: {
      open: "Ouvrir le menu",
      close: "Fermer le menu",
    },
  },

  it: {
    nav: {
      services: "Servizi",
      providers: "Fornitori",
      regions: "Regioni",
      insurance: "Assicurazioni",
      forProviders: "Per fornitori",
      priceCalculator: "Calcolatore prezzi",
      calculateNow: "Calcola ora",
      search: "Cerca",
      startOrder: "Crea richiesta",
      requestOffer: "Richiedi offerta",
    },
    search: {
      eyebrow: "Ricerca Auftrago",
      title: "Cosa stai cercando?",
      placeholder:
        "Ad esempio pulizia, elettricista o assicurazione malattia",
      close: "Chiudi ricerca",
      open: "Apri ricerca",
      submit: "Cerca",
    },
    menu: {
      open: "Apri menu",
      close: "Chiudi menu",
    },
  },

  en: {
    nav: {
      services: "Services",
      providers: "Providers",
      regions: "Regions",
      insurance: "Insurance",
      forProviders: "For providers",
      priceCalculator: "Price calculator",
      calculateNow: "Calculate now",
      search: "Search",
      startOrder: "Start request",
      requestOffer: "Request quote",
    },
    search: {
      eyebrow: "Auftrago Search",
      title: "What are you looking for?",
      placeholder:
        "For example cleaning, electrician or health insurance",
      close: "Close search",
      open: "Open search",
      submit: "Search",
    },
    menu: {
      open: "Open menu",
      close: "Close menu",
    },
  },
} as const;

export function normalizeLocale(value?: string | null): AuftragoLocale {
  if (
    value === "fr" ||
    value === "it" ||
    value === "en" ||
    value === "sq" ||
    value === "tr" ||
    value === "pt" ||
    value === "es"
  ) {
    return value;
  }

  return "de";
}
