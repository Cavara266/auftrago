export type ServiceProfile = {
  slug: string;
  name: string;
  category: string;
  singular: string;
  description: string;
  shortBenefits: string[];
  priceLabel?: string;
  priceFrom?: number;
  priceTo?: number;
  unit?: string;
  suitableFor: string[];
  related: string[];
  requestTips: string[];
};

export const serviceProfiles: ServiceProfile[] = [
  {
    slug: "reinigung",
    name: "Reinigung",
    category: "Reinigung",
    singular: "Reinigungsfirma",
    description:
      "Professionelle Reinigung für Wohnungen, Häuser, Büros und Gewerbeflächen.",
    shortBenefits: [
      "Zeit sparen",
      "klare Leistungsabgrenzung",
      "regionale Anbieter vergleichen",
    ],
    priceLabel: "Orientierung",
    priceFrom: 120,
    priceTo: 1200,
    unit: "pro Auftrag",
    suitableFor: ["Privathaushalte", "Büros", "Verwaltungen", "Gewerbe"],
    related: [
      "umzugsreinigung",
      "fensterreinigung",
      "unterhaltsreinigung",
      "hauswartung",
    ],
    requestTips: [
      "Fläche und Anzahl Räume angeben",
      "Fotos von stark verschmutzten Bereichen ergänzen",
      "Fenster, Storen und Zusatzleistungen separat nennen",
      "gewünschten Termin und Zeitfenster angeben",
    ],
  },
  {
    slug: "umzugsreinigung",
    name: "Umzugsreinigung",
    category: "Reinigung",
    singular: "Reinigungsfirma",
    description:
      "Gründliche Endreinigung für die Wohnungsabgabe, auf Wunsch mit Abgabegarantie.",
    shortBenefits: [
      "weniger Stress vor der Übergabe",
      "Leistungsumfang klar vergleichen",
      "Abgabegarantie anfragen",
    ],
    priceLabel: "Orientierung",
    priceFrom: 450,
    priceTo: 2200,
    unit: "pro Wohnung",
    suitableFor: ["Wohnungen", "Einfamilienhäuser", "Mietobjekte"],
    related: ["reinigung", "fensterreinigung", "umzug", "entsorgung"],
    requestTips: [
      "Zimmerzahl und Wohnfläche angeben",
      "Anzahl Fenster und Storen nennen",
      "Abgabegarantie ausdrücklich erwähnen",
      "Übergabetermin und Zugangssituation angeben",
    ],
  },
  {
    slug: "umzug",
    name: "Umzug",
    category: "Transport",
    singular: "Umzugsfirma",
    description:
      "Privat- und Firmenumzüge inklusive Transport, Tragehilfe und optionaler Montage.",
    shortBenefits: [
      "Aufwand realistisch einschätzen",
      "Fahrzeug und Personal vergleichen",
      "Zusatzleistungen kombinieren",
    ],
    priceLabel: "Orientierung",
    priceFrom: 600,
    priceTo: 5000,
    unit: "pro Umzug",
    suitableFor: ["Privatumzüge", "Firmenumzüge", "Kleintransporte"],
    related: ["transport", "entsorgung", "umzugsreinigung", "moebelmontage"],
    requestTips: [
      "Start- und Zieladresse angeben",
      "Etagen und Lift nennen",
      "Menge der Möbel möglichst genau beschreiben",
      "Halteverbote und Parkplatzsituation erwähnen",
    ],
  },
  {
    slug: "hauswartung",
    name: "Hauswartung",
    category: "Gebäudeservice",
    singular: "Hauswartungsfirma",
    description:
      "Liegenschaftsunterhalt, Kontrollgänge, Treppenhausreinigung und Umgebungspflege.",
    shortBenefits: [
      "wiederkehrende Aufgaben bündeln",
      "klare Zuständigkeiten",
      "regionalen Service vergleichen",
    ],
    priceLabel: "Orientierung",
    priceFrom: 250,
    priceTo: 2500,
    unit: "pro Monat",
    suitableFor: ["Mehrfamilienhäuser", "Verwaltungen", "Gewerbeobjekte"],
    related: ["reinigung", "gartenpflege", "winterdienst", "unterhaltsreinigung"],
    requestTips: [
      "Objektgrösse und Anzahl Einheiten angeben",
      "gewünschte Frequenz nennen",
      "Aussenflächen und technische Kontrollen beschreiben",
      "Winterdienst und Pikett separat aufführen",
    ],
  },
  {
    slug: "gartenpflege",
    name: "Gartenpflege",
    category: "Garten",
    singular: "Gartenbauunternehmen",
    description:
      "Pflege von Rasen, Hecken, Beeten und Aussenflächen für Privat- und Gewerbeobjekte.",
    shortBenefits: [
      "saisonale Arbeiten planen",
      "einmalige oder regelmässige Pflege",
      "Leistungsumfang vergleichen",
    ],
    priceLabel: "Orientierung",
    priceFrom: 150,
    priceTo: 1800,
    unit: "pro Einsatz",
    suitableFor: ["Privatgärten", "Wohnanlagen", "Gewerbeareale"],
    related: ["hauswartung", "winterdienst", "entsorgung", "reinigung"],
    requestTips: [
      "Fläche und gewünschte Arbeiten nennen",
      "Fotos der Gartenbereiche ergänzen",
      "Entsorgung des Grünguts klären",
      "einmaligen oder regelmässigen Einsatz angeben",
    ],
  },
  {
    slug: "fensterreinigung",
    name: "Fensterreinigung",
    category: "Reinigung",
    singular: "Fensterreinigungsfirma",
    description:
      "Reinigung von Fenstern, Rahmen, Storen, Wintergärten und Glasflächen.",
    shortBenefits: [
      "klare Stückzahl",
      "Rahmen und Storen separat definieren",
      "Zugänglichkeit berücksichtigen",
    ],
    priceLabel: "Orientierung",
    priceFrom: 180,
    priceTo: 1600,
    unit: "pro Auftrag",
    suitableFor: ["Wohnungen", "Häuser", "Büros", "Glasfassaden"],
    related: ["reinigung", "umzugsreinigung", "unterhaltsreinigung"],
    requestTips: [
      "Anzahl und Grösse der Fenster nennen",
      "Storen und Rahmen separat angeben",
      "schwer zugängliche Fenster erwähnen",
      "Wintergarten oder Glasdach separat aufführen",
    ],
  },
  {
    slug: "entsorgung",
    name: "Entsorgung",
    category: "Räumung",
    singular: "Entsorgungsfirma",
    description:
      "Räumung, Abtransport und fachgerechte Entsorgung von Möbeln, Sperrgut und Hausrat.",
    shortBenefits: [
      "Arbeits- und Entsorgungskosten trennen",
      "Menge besser einschätzen",
      "Transportwege berücksichtigen",
    ],
    priceLabel: "Orientierung",
    priceFrom: 250,
    priceTo: 4500,
    unit: "pro Auftrag",
    suitableFor: ["Wohnungen", "Keller", "Estriche", "Gewerberäume"],
    related: ["umzug", "transport", "reinigung", "gartenpflege"],
    requestTips: [
      "Fotos aller Gegenstände hochladen",
      "Etagen und Lift angeben",
      "Park- und Zufahrtssituation beschreiben",
      "Sonderabfälle separat erwähnen",
    ],
  },
];

export function getServiceProfile(slug: string) {
  return serviceProfiles.find((service) => service.slug === slug);
}
