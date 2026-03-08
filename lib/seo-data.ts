export type ServiceKey =
  | "reinigung"
  | "umzug"
  | "transport"
  | "entsorgung"
  | "hauswartung";

export type CityKey =
  | "zuerich"
  | "bern"
  | "basel"
  | "winterthur"
  | "luzern"
  | "st-gallen"
  | "aarau"
  | "baden"
  | "zug"
  | "thun"
  | "schaffhausen"
  | "solothurn"
  | "bietigheim";

export type ServiceItem = {
  key: ServiceKey;
  name: string;
  title: string;
  intro: string;
  benefits: string[];
  faqs: {
    question: string;
    answer: string;
  }[];
};

export type CityItem = {
  key: CityKey;
  name: string;
  canton: string;
  regionLabel: string;
};

export const services: ServiceItem[] = [
  {
    key: "reinigung",
    name: "Reinigung",
    title: "Reinigung",
    intro:
      "Vergleichen Sie Offerten für private und gewerbliche Reinigungen mit passenden Anbietern in Ihrer Region.",
    benefits: [
      "Kostenlose Anfrage in 1 Minute",
      "Passende Anbieter aus Ihrer Region",
      "Ideal für Büro-, Umzugs- und Unterhaltsreinigung",
      "Schnelle Rückmeldungen und mehrere Offerten möglich",
    ],
    faqs: [
      {
        question: "Wie schnell erhalte ich Offerten für eine Reinigung?",
        answer:
          "In vielen Fällen erhalten Sie bereits innerhalb kurzer Zeit erste Rückmeldungen von passenden Anbietern.",
      },
      {
        question: "Kann ich auch eine Umzugsreinigung anfragen?",
        answer:
          "Ja, über Auftrago können Sie auch Umzugsreinigungen, Wohnungsreinigungen und Büroreinigungen anfragen.",
      },
    ],
  },
  {
    key: "umzug",
    name: "Umzug",
    title: "Umzug",
    intro:
      "Erhalten Sie Offerten für private und geschäftliche Umzüge, inklusive Planung, Transport und optionaler Zusatzservices.",
    benefits: [
      "Privatumzug und Firmenumzug",
      "Transparente Anfrage für bessere Offerten",
      "Regionale Umzugsfirmen vergleichen",
      "Optional mit Entsorgung oder Reinigung kombinierbar",
    ],
    faqs: [
      {
        question: "Kann ich auch kurzfristige Umzüge anfragen?",
        answer:
          "Ja, auch kurzfristige Umzüge können angefragt werden. Je klarer Ihre Angaben, desto besser die Rückmeldungen.",
      },
      {
        question: "Kann ich Zusatzleistungen mitanfragen?",
        answer:
          "Ja, viele Anbieter decken zusätzlich Transport, Entsorgung oder Endreinigung ab.",
      },
    ],
  },
  {
    key: "transport",
    name: "Transport",
    title: "Transport",
    intro:
      "Vergleichen Sie Offerten für Möbeltransporte, Kleintransporte, Kurierfahrten und individuelle Transporte.",
    benefits: [
      "Ideal für Möbel, Geräte und Einzelstücke",
      "Schnelle Transportanfragen in Ihrer Region",
      "Für Privatpersonen und Unternehmen",
      "Unkomplizierte Offertanfrage ohne lange Suche",
    ],
    faqs: [
      {
        question: "Für welche Transporte eignet sich Auftrago?",
        answer:
          "Für Kleintransporte, Möbeltransporte, Kurierfahrten und flexible Transporte in der ganzen Schweiz.",
      },
      {
        question: "Kann ich auch einmalige Transporte anfragen?",
        answer:
          "Ja, Auftrago eignet sich sowohl für einmalige Transporte als auch für wiederkehrende Aufträge.",
      },
    ],
  },
  {
    key: "entsorgung",
    name: "Entsorgung",
    title: "Entsorgung",
    intro:
      "Finden Sie passende Anbieter für Räumungen, Sperrgut, Wohnungsauflösungen und fachgerechte Entsorgungen.",
    benefits: [
      "Ideal für Sperrgut und Wohnungsauflösungen",
      "Anbieter für private und gewerbliche Entsorgung",
      "Schnelle Anfrage statt mühsame Einzelsuche",
      "Auch mit Räumung oder Transport kombinierbar",
    ],
    faqs: [
      {
        question: "Kann ich auch eine komplette Wohnungsräumung anfragen?",
        answer:
          "Ja, viele Anfragen betreffen komplette Räumungen, Kellerleerungen oder Wohnungsauflösungen.",
      },
      {
        question: "Eignet sich Auftrago auch für kleinere Entsorgungen?",
        answer:
          "Ja, auch kleinere Entsorgungen wie einzelne Möbel oder Haushaltsgeräte können angefragt werden.",
      },
    ],
  },
  {
    key: "hauswartung",
    name: "Hauswartung",
    title: "Hauswartung",
    intro:
      "Erhalten Sie Offerten für laufende Hauswartung, Kontrollgänge, Unterhalt und Betreuung von Liegenschaften.",
    benefits: [
      "Für Verwaltungen, Eigentümer und Firmen",
      "Regelmässige Betreuung von Immobilien",
      "Hauswartung und Unterhalt aus einer Anfrage",
      "Regionale Dienstleister vergleichen",
    ],
    faqs: [
      {
        question: "Eignet sich Auftrago für Mehrfamilienhäuser?",
        answer:
          "Ja, Hauswartung für Mehrfamilienhäuser, Gewerbeobjekte und Liegenschaften ist eine der passenden Kernleistungen.",
      },
      {
        question: "Kann ich wiederkehrende Hauswartung anfragen?",
        answer:
          "Ja, wiederkehrende Betreuungen und regelmässige Einsätze können direkt angefragt werden.",
      },
    ],
  },
];

export const cities: CityItem[] = [
  {
    key: "zuerich",
    name: "Zürich",
    canton: "Zürich",
    regionLabel: "Zürich und Umgebung",
  },
  {
    key: "bern",
    name: "Bern",
    canton: "Bern",
    regionLabel: "Bern und Umgebung",
  },
  {
    key: "basel",
    name: "Basel",
    canton: "Basel-Stadt",
    regionLabel: "Basel und Umgebung",
  },
  {
    key: "winterthur",
    name: "Winterthur",
    canton: "Zürich",
    regionLabel: "Winterthur und Umgebung",
  },
  {
    key: "luzern",
    name: "Luzern",
    canton: "Luzern",
    regionLabel: "Luzern und Umgebung",
  },
  {
    key: "st-gallen",
    name: "St. Gallen",
    canton: "St. Gallen",
    regionLabel: "St. Gallen und Umgebung",
  },
  {
    key: "aarau",
    name: "Aarau",
    canton: "Aargau",
    regionLabel: "Aarau und Umgebung",
  },
  {
    key: "baden",
    name: "Baden",
    canton: "Aargau",
    regionLabel: "Baden und Umgebung",
  },
  {
    key: "zug",
    name: "Zug",
    canton: "Zug",
    regionLabel: "Zug und Umgebung",
  },
  {
    key: "thun",
    name: "Thun",
    canton: "Bern",
    regionLabel: "Thun und Umgebung",
  },
  {
    key: "schaffhausen",
    name: "Schaffhausen",
    canton: "Schaffhausen",
    regionLabel: "Schaffhausen und Umgebung",
  },
  {
    key: "solothurn",
    name: "Solothurn",
    canton: "Solothurn",
    regionLabel: "Solothurn und Umgebung",
  },
  {
    key: "bietigheim",
    name: "Bietigheim",
    canton: "Aargau",
    regionLabel: "Bietigheim und Umgebung",
  },
];

export function getServiceByKey(key: string) {
  return services.find((item) => item.key === key) ?? null;
}

export function getCityByKey(key: string) {
  return cities.find((item) => item.key === key) ?? null;
}

export function getAllSeoSlugs() {
  const slugs: string[] = [];

  for (const service of services) {
    for (const city of cities) {
      slugs.push(`${service.key}-${city.key}`);
    }
  }

  return slugs;
}