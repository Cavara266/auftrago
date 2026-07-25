export type ServiceQuestionType =
  | "text"
  | "number"
  | "date"
  | "email"
  | "tel"
  | "select";

export type ServiceQuestion = {
  key: string;
  label: string;
  type: ServiceQuestionType;
  required?: boolean;
  placeholder?: string;
  options?: string[];
};

export type Service = {
  slug: string;
  title: string;
  short: string;
  category: string;
  icon: string;
  description: string;
  longDescription: string;
  keywords: string[];
  leadPrice: number;
  questions: ServiceQuestion[];
  featured?: boolean;
};

const yesNoOptions = ["Ja", "Nein", "Noch unklar"];
const timingOptions = [
  "So schnell wie möglich",
  "Innerhalb von 7 Tagen",
  "Innerhalb von 30 Tagen",
  "Nach Absprache",
];

const commonQuestions: ServiceQuestion[] = [
  {
    key: "start",
    label: "Gewünschter Termin",
    type: "date",
    required: false,
  },
  {
    key: "budget",
    label: "Budget",
    type: "text",
    required: false,
    placeholder: "z. B. CHF 1'000",
  },
  {
    key: "offersWanted",
    label: "Gewünschte Anzahl Offerten",
    type: "select",
    required: false,
    options: ["1 Angebot", "Bis zu 2 Angebote", "Bis zu 4 Angebote"],
  },
];

function withCommonQuestions(
  questions: ServiceQuestion[]
): ServiceQuestion[] {
  return [...questions, ...commonQuestions];
}

export const services: Service[] = [
  {
    slug: "reinigung",
    title: "Reinigung",
    short: "Wohnung, Büro und Unterhalt",
    category: "Haus & Reinigung",
    icon: "🧹",
    description: "Wohnungs-, Büro- und Unterhaltsreinigung.",
    longDescription:
      "Finde regionale Reinigungsfirmen für Wohnungen, Büros, Gewerbeobjekte und regelmässige Unterhaltsreinigungen.",
    keywords: ["Wohnungsreinigung", "Büroreinigung", "Unterhaltsreinigung"],
    leadPrice: 20,
    questions: withCommonQuestions([
      {
        key: "propertyType",
        label: "Objektart",
        type: "select",
        required: true,
        options: ["Wohnung", "Einfamilienhaus", "Büro", "Gewerbe", "Andere"],
      },
      {
        key: "area",
        label: "Fläche in m²",
        type: "number",
        required: false,
        placeholder: "z. B. 120",
      },
      {
        key: "rooms",
        label: "Anzahl Zimmer",
        type: "text",
        required: false,
        placeholder: "z. B. 4.5",
      },
      {
        key: "frequency",
        label: "Häufigkeit",
        type: "select",
        required: true,
        options: ["Einmalig", "Wöchentlich", "Alle 2 Wochen", "Monatlich"],
      },
    ]),
  },
  {
    slug: "umzugsreinigung",
    title: "Umzugsreinigung",
    short: "Endreinigung mit Abgabegarantie",
    category: "Haus & Reinigung",
    icon: "🏠",
    description: "Endreinigung mit Abgabegarantie.",
    longDescription:
      "Vergleiche Anbieter für professionelle Umzugs- und Endreinigungen inklusive Fenster, Küche, Bad und Abgabegarantie.",
    keywords: ["Endreinigung", "Abgabereinigung", "Wohnungsabgabe"],
    leadPrice: 35,
    questions: withCommonQuestions([
      {
        key: "propertyType",
        label: "Objektart",
        type: "select",
        required: true,
        options: ["Wohnung", "Einfamilienhaus", "Gewerbe", "Andere"],
      },
      {
        key: "rooms",
        label: "Anzahl Zimmer",
        type: "text",
        required: true,
        placeholder: "z. B. 3.5",
      },
      {
        key: "area",
        label: "Fläche in m²",
        type: "number",
        required: false,
        placeholder: "z. B. 85",
      },
      {
        key: "handoverGuarantee",
        label: "Abgabegarantie gewünscht?",
        type: "select",
        required: true,
        options: yesNoOptions,
      },
      {
        key: "balcony",
        label: "Balkon oder Terrasse vorhanden?",
        type: "select",
        required: false,
        options: yesNoOptions,
      },
      {
        key: "cellar",
        label: "Kellerreinigung gewünscht?",
        type: "select",
        required: false,
        options: yesNoOptions,
      },
    ]),
    featured: true,
  },
  {
    slug: "fensterreinigung",
    title: "Fensterreinigung",
    short: "Fenster, Rahmen und Storen",
    category: "Haus & Reinigung",
    icon: "🪟",
    description: "Fenster, Rahmen, Storen und Glasflächen.",
    longDescription:
      "Finde Anbieter für Fensterreinigung bei Wohnungen, Einfamilienhäusern, Büros und Gewerbeobjekten.",
    keywords: ["Fenster putzen", "Storenreinigung", "Glasreinigung"],
    leadPrice: 20,
    questions: withCommonQuestions([
      {
        key: "windows",
        label: "Anzahl Fenster",
        type: "select",
        required: true,
        options: ["1–5", "6–10", "11–15", "16–20", "Mehr als 20"],
      },
      {
        key: "windowSize",
        label: "Fenstergrösse",
        type: "select",
        required: false,
        options: ["Eher klein", "Normal", "Eher gross", "Bodentief"],
      },
      {
        key: "blinds",
        label: "Lamellenstoren vorhanden?",
        type: "select",
        required: false,
        options: yesNoOptions,
      },
      {
        key: "shutters",
        label: "Fensterläden vorhanden?",
        type: "select",
        required: false,
        options: yesNoOptions,
      },
    ]),
  },
  {
    slug: "hauswartung",
    title: "Hauswartung",
    short: "Liegenschaftsbetreuung und Unterhalt",
    category: "Haus & Reinigung",
    icon: "🔑",
    description: "Professionelle Liegenschaftsbetreuung.",
    longDescription:
      "Finde Hauswartungsfirmen für Kontrollgänge, Treppenhäuser, Umgebungspflege, Winterdienst und laufenden Unterhalt.",
    keywords: ["Hauswart", "Liegenschaftsservice", "Gebäudeunterhalt"],
    leadPrice: 35,
    questions: withCommonQuestions([
      {
        key: "objectType",
        label: "Objektart",
        type: "select",
        required: true,
        options: [
          "Mehrfamilienhaus",
          "Wohnüberbauung",
          "Gewerbeliegenschaft",
          "Einfamilienhaus",
          "Andere",
        ],
      },
      {
        key: "area",
        label: "Ungefähre Fläche in m²",
        type: "number",
        required: false,
      },
      {
        key: "frequency",
        label: "Gewünschte Betreuung",
        type: "select",
        required: true,
        options: ["Wöchentlich", "Alle 2 Wochen", "Monatlich", "Nach Absprache"],
      },
    ]),
  },
  {
    slug: "gartenpflege",
    title: "Gartenpflege",
    short: "Rasen, Hecken und Umgebung",
    category: "Haus & Reinigung",
    icon: "🌿",
    description: "Rasen, Hecken und Umgebungspflege.",
    longDescription:
      "Vergleiche Gartenbaufirmen für Rasenpflege, Heckenschnitt, Laubarbeiten und saisonalen Gartenunterhalt.",
    keywords: ["Gärtner", "Heckenschnitt", "Rasenpflege"],
    leadPrice: 20,
    questions: withCommonQuestions([
      {
        key: "area",
        label: "Gartenfläche in m²",
        type: "number",
        required: false,
      },
      {
        key: "workType",
        label: "Gewünschte Arbeiten",
        type: "select",
        required: true,
        options: [
          "Rasenpflege",
          "Heckenschnitt",
          "Baumschnitt",
          "Laubarbeiten",
          "Komplettpflege",
          "Andere",
        ],
      },
      {
        key: "frequency",
        label: "Häufigkeit",
        type: "select",
        required: false,
        options: ["Einmalig", "Regelmässig", "Saisonal", "Nach Absprache"],
      },
    ]),
  },
  {
    slug: "winterdienst",
    title: "Winterdienst",
    short: "Schneeräumung und Glatteis",
    category: "Haus & Reinigung",
    icon: "❄️",
    description: "Schneeräumung und Glatteisbekämpfung.",
    longDescription:
      "Finde zuverlässige Anbieter für Schneeräumung, Salzen und Winterpikett bei privaten und gewerblichen Objekten.",
    keywords: ["Schneeräumung", "Salzen", "Winterpikett"],
    leadPrice: 20,
    questions: withCommonQuestions([
      {
        key: "objectType",
        label: "Objektart",
        type: "select",
        required: true,
        options: ["Privatliegenschaft", "Mehrfamilienhaus", "Gewerbe", "Andere"],
      },
      {
        key: "area",
        label: "Zu räumende Fläche in m²",
        type: "number",
        required: false,
      },
      {
        key: "serviceScope",
        label: "Leistungsumfang",
        type: "select",
        required: true,
        options: ["Schneeräumung", "Salzen", "Komplettservice", "Winterpikett"],
      },
    ]),
  },
  {
    slug: "umzug",
    title: "Umzug",
    short: "Privat- und Firmenumzüge",
    category: "Umzug & Transport",
    icon: "🚚",
    description: "Privat- und Firmenumzüge.",
    longDescription:
      "Vergleiche Umzugsfirmen für private Umzüge, Firmenumzüge, Verpackung, Möbelmontage und Transporte.",
    keywords: ["Umzugsfirma", "Privatumzug", "Firmenumzug"],
    leadPrice: 35,
    questions: withCommonQuestions([
      {
        key: "objectType",
        label: "Umzugsart",
        type: "select",
        required: true,
        options: ["Privatumzug", "Firmenumzug", "Einzeltransport", "Andere"],
      },
      {
        key: "rooms",
        label: "Anzahl Zimmer",
        type: "text",
        required: false,
        placeholder: "z. B. 4.5",
      },
      {
        key: "floor",
        label: "Stockwerk",
        type: "text",
        required: false,
        placeholder: "z. B. 3. Stock",
      },
      {
        key: "elevator",
        label: "Lift vorhanden?",
        type: "select",
        required: false,
        options: yesNoOptions,
      },
      {
        key: "parking",
        label: "Parkmöglichkeit vorhanden?",
        type: "select",
        required: false,
        options: yesNoOptions,
      },
    ]),
    featured: true,
  },
  {
    slug: "transport",
    title: "Transport",
    short: "Möbel- und Kleintransporte",
    category: "Umzug & Transport",
    icon: "📦",
    description: "Möbel-, Klein- und Spezialtransporte.",
    longDescription:
      "Finde regionale Transportunternehmen für Möbel, Waren, Einzelstücke und kurzfristige Kleintransporte.",
    keywords: ["Kleintransport", "Möbeltransport", "Warentransport"],
    leadPrice: 25,
    questions: withCommonQuestions([
      {
        key: "transportType",
        label: "Transportart",
        type: "select",
        required: true,
        options: [
          "Möbeltransport",
          "Warentransport",
          "Einzelstück",
          "Spezialtransport",
          "Andere",
        ],
      },
      {
        key: "pickup",
        label: "Abholort",
        type: "text",
        required: true,
      },
      {
        key: "destination",
        label: "Zielort",
        type: "text",
        required: true,
      },
      {
        key: "elevator",
        label: "Lift vorhanden?",
        type: "select",
        required: false,
        options: yesNoOptions,
      },
    ]),
  },
  {
    slug: "entsorgung",
    title: "Entsorgung",
    short: "Räumung und fachgerechte Entsorgung",
    category: "Umzug & Transport",
    icon: "♻️",
    description: "Räumungen und fachgerechte Entsorgung.",
    longDescription:
      "Vergleiche Anbieter für Keller-, Estrich- und Wohnungsräumungen sowie fachgerechte Entsorgung.",
    keywords: ["Entrümpelung", "Räumung", "Sperrgut"],
    leadPrice: 25,
    questions: withCommonQuestions([
      {
        key: "objectType",
        label: "Was soll geräumt werden?",
        type: "select",
        required: true,
        options: ["Wohnung", "Haus", "Keller", "Estrich", "Gewerbe", "Andere"],
      },
      {
        key: "rooms",
        label: "Anzahl Räume",
        type: "text",
        required: false,
      },
      {
        key: "floor",
        label: "Stockwerk",
        type: "text",
        required: false,
      },
      {
        key: "elevator",
        label: "Lift vorhanden?",
        type: "select",
        required: false,
        options: yesNoOptions,
      },
    ]),
  },
  {
    slug: "maler",
    title: "Maler",
    short: "Innenanstrich und Fassade",
    category: "Handwerk",
    icon: "🎨",
    description: "Maler- und Fassadenarbeiten.",
    longDescription:
      "Finde Malerbetriebe für Innenanstriche, Fassaden, Renovationen, Ausbesserungen und Farbberatung.",
    keywords: ["Malerarbeiten", "Fassade", "Innenanstrich"],
    leadPrice: 35,
    questions: withCommonQuestions([
      {
        key: "workType",
        label: "Art der Malerarbeiten",
        type: "select",
        required: true,
        options: [
          "Innenräume",
          "Fassade",
          "Ausbesserungen",
          "Komplette Renovation",
          "Andere",
        ],
      },
      {
        key: "area",
        label: "Ungefähre Fläche in m²",
        type: "number",
        required: false,
      },
      {
        key: "propertyType",
        label: "Objektart",
        type: "select",
        required: false,
        options: ["Wohnung", "Haus", "Büro", "Gewerbe", "Andere"],
      },
    ]),
  },
  {
    slug: "elektriker",
    title: "Elektriker",
    short: "Installationen und Reparaturen",
    category: "Handwerk",
    icon: "⚡",
    description: "Installationen und Reparaturen.",
    longDescription:
      "Vergleiche Elektriker für Installationen, Reparaturen, Beleuchtung, Anschlüsse und Störungsbehebung.",
    keywords: ["Elektroinstallation", "Strom", "Beleuchtung"],
    leadPrice: 25,
    questions: withCommonQuestions([
      {
        key: "workType",
        label: "Gewünschte Elektroarbeiten",
        type: "select",
        required: true,
        options: [
          "Reparatur",
          "Neuinstallation",
          "Beleuchtung",
          "Anschluss",
          "Störung",
          "Andere",
        ],
      },
      {
        key: "urgency",
        label: "Dringlichkeit",
        type: "select",
        required: true,
        options: timingOptions,
      },
    ]),
  },
  {
    slug: "sanitaer",
    title: "Sanitär",
    short: "Bad, Küche und Leitungen",
    category: "Handwerk",
    icon: "🚿",
    description: "Bad, Küche und Leitungen.",
    longDescription:
      "Finde Sanitärbetriebe für Armaturen, Leitungen, Reparaturen, Badumbauten und Installationen.",
    keywords: ["Sanitärinstallateur", "Bad", "Wasserleitung"],
    leadPrice: 25,
    questions: withCommonQuestions([
      {
        key: "workType",
        label: "Gewünschte Sanitärarbeiten",
        type: "select",
        required: true,
        options: [
          "Reparatur",
          "Armaturen",
          "Leitungen",
          "Badumbau",
          "Neuinstallation",
          "Andere",
        ],
      },
      {
        key: "urgency",
        label: "Dringlichkeit",
        type: "select",
        required: true,
        options: timingOptions,
      },
    ]),
  },
  {
    slug: "schreiner",
    title: "Schreiner",
    short: "Möbel und Innenausbau",
    category: "Handwerk",
    icon: "🪵",
    description: "Möbel und Innenausbau.",
    longDescription:
      "Vergleiche Schreiner für Möbel, Türen, Schränke, Küchen, Reparaturen und individuellen Innenausbau.",
    keywords: ["Schreinerei", "Möbelbau", "Innenausbau"],
    leadPrice: 25,
    questions: withCommonQuestions([
      {
        key: "workType",
        label: "Gewünschte Schreinerarbeiten",
        type: "select",
        required: true,
        options: [
          "Möbel",
          "Schrank",
          "Türen",
          "Küche",
          "Reparatur",
          "Innenausbau",
          "Andere",
        ],
      },
    ]),
  },
  {
    slug: "bodenleger",
    title: "Bodenleger",
    short: "Parkett, Laminat und Vinyl",
    category: "Handwerk",
    icon: "🪚",
    description: "Parkett, Laminat, Vinyl und Teppich.",
    longDescription:
      "Finde Bodenleger für neue Böden, Reparaturen, Schleifen, Versiegeln und vollständige Bodensanierungen.",
    keywords: ["Parkett", "Laminat", "Vinyl"],
    leadPrice: 25,
    questions: withCommonQuestions([
      {
        key: "floorType",
        label: "Bodenart",
        type: "select",
        required: true,
        options: ["Parkett", "Laminat", "Vinyl", "Teppich", "Andere"],
      },
      {
        key: "area",
        label: "Fläche in m²",
        type: "number",
        required: true,
      },
      {
        key: "workType",
        label: "Gewünschte Arbeiten",
        type: "select",
        required: true,
        options: ["Neu verlegen", "Reparieren", "Schleifen", "Versiegeln"],
      },
    ]),
  },
  {
    slug: "renovation",
    title: "Renovation",
    short: "Umbau, Rückbau und Sanierung",
    category: "Handwerk",
    icon: "🏗️",
    description: "Umbau, Rückbau und Renovationen.",
    longDescription:
      "Vergleiche Fachbetriebe für Umbauten, Renovationen, Rückbau, Koordination und Komplettlösungen.",
    keywords: ["Umbau", "Renovierung", "Sanierung"],
    leadPrice: 35,
    questions: withCommonQuestions([
      {
        key: "workType",
        label: "Art des Projekts",
        type: "select",
        required: true,
        options: ["Renovation", "Umbau", "Sanierung", "Rückbau", "Andere"],
      },
      {
        key: "propertyType",
        label: "Objektart",
        type: "select",
        required: true,
        options: ["Wohnung", "Haus", "Büro", "Gewerbe", "Andere"],
      },
      {
        key: "area",
        label: "Fläche in m²",
        type: "number",
        required: false,
      },
    ]),
  },
  {
    slug: "solaranlagen",
    title: "Solaranlagen",
    short: "Photovoltaik und Batteriespeicher",
    category: "Energie",
    icon: "☀️",
    description: "Photovoltaik, Speicher und Beratung.",
    longDescription:
      "Finde Anbieter für Solaranlagen, Batteriespeicher, Planung, Montage und Energieberatung.",
    keywords: ["Photovoltaik", "Solarstrom", "Batteriespeicher"],
    leadPrice: 35,
    questions: withCommonQuestions([
      {
        key: "propertyType",
        label: "Gebäudeart",
        type: "select",
        required: true,
        options: ["Einfamilienhaus", "Mehrfamilienhaus", "Gewerbe", "Andere"],
      },
      {
        key: "workType",
        label: "Gewünschte Leistung",
        type: "select",
        required: true,
        options: ["Beratung", "Solaranlage", "Batteriespeicher", "Komplettlösung"],
      },
      {
        key: "roofArea",
        label: "Ungefähre Dachfläche in m²",
        type: "number",
        required: false,
      },
    ]),
  },
  {
    slug: "waermepumpen",
    title: "Wärmepumpen",
    short: "Planung, Einbau und Service",
    category: "Energie",
    icon: "🔥",
    description: "Planung, Einbau und Service.",
    longDescription:
      "Vergleiche Fachfirmen für Wärmepumpen, Heizungsersatz, Beratung, Installation und Wartung.",
    keywords: ["Heizungsersatz", "Wärmepumpe", "Energieberatung"],
    leadPrice: 35,
    questions: withCommonQuestions([
      {
        key: "propertyType",
        label: "Gebäudeart",
        type: "select",
        required: true,
        options: ["Einfamilienhaus", "Mehrfamilienhaus", "Gewerbe", "Andere"],
      },
      {
        key: "workType",
        label: "Gewünschte Leistung",
        type: "select",
        required: true,
        options: ["Beratung", "Heizungsersatz", "Installation", "Service"],
      },
      {
        key: "currentHeating",
        label: "Aktuelle Heizung",
        type: "select",
        required: false,
        options: ["Öl", "Gas", "Elektro", "Holz", "Andere", "Unbekannt"],
      },
    ]),
  },
  {
    slug: "versicherungen",
    title: "Versicherungen",
    short: "Krankenkasse, Auto und Vorsorge",
    category: "Versicherungen",
    icon: "🛡️",
    description: "Krankenkasse, Auto, Hausrat und Vorsorge.",
    longDescription:
      "Vergleiche Versicherungsberater und Makler für Krankenkasse, Auto, Hausrat, Rechtsschutz, Vorsorge und Firmenlösungen.",
    keywords: ["Versicherungsvergleich", "Versicherungsmakler", "Vorsorge"],
    leadPrice: 35,
    questions: withCommonQuestions([
      {
        key: "insuranceType",
        label: "Versicherungsart",
        type: "select",
        required: true,
        options: [
          "Krankenkasse",
          "Autoversicherung",
          "Hausrat",
          "Rechtsschutz",
          "Vorsorge",
          "Firmenversicherung",
          "Andere",
        ],
      },
      {
        key: "consultationType",
        label: "Gewünschte Beratung",
        type: "select",
        required: false,
        options: ["Telefonisch", "Online", "Vor Ort", "Nach Absprache"],
      },
    ]),
    featured: true,
  },
  {
    slug: "immobilienmakler",
    title: "Immobilienmakler",
    short: "Verkauf, Vermietung und Bewertung",
    category: "Immobilien",
    icon: "🏡",
    description: "Verkauf, Vermietung und Bewertung.",
    longDescription:
      "Finde Immobilienmakler für Verkauf, Vermietung, Marktanalyse, Bewertung und professionelle Vermarktung.",
    keywords: ["Makler", "Immobilienverkauf", "Immobilienbewertung"],
    leadPrice: 35,
    questions: withCommonQuestions([
      {
        key: "workType",
        label: "Gewünschte Leistung",
        type: "select",
        required: true,
        options: ["Verkauf", "Vermietung", "Bewertung", "Beratung"],
      },
      {
        key: "propertyType",
        label: "Immobilienart",
        type: "select",
        required: true,
        options: ["Wohnung", "Haus", "Grundstück", "Gewerbe", "Andere"],
      },
      {
        key: "rooms",
        label: "Anzahl Zimmer",
        type: "text",
        required: false,
      },
    ]),
  },
  {
    slug: "treuhand",
    title: "Treuhand",
    short: "Buchhaltung, Steuern und Administration",
    category: "Finanzen",
    icon: "📚",
    description: "Buchhaltung, Steuern und Administration.",
    longDescription:
      "Vergleiche Treuhänder für Buchhaltung, Lohnwesen, Jahresabschlüsse, Steuern und Unternehmensberatung.",
    keywords: ["Treuhänder", "Buchhaltung", "Steuerberatung"],
    leadPrice: 35,
    questions: withCommonQuestions([
      {
        key: "workType",
        label: "Gewünschte Leistung",
        type: "select",
        required: true,
        options: [
          "Buchhaltung",
          "Steuererklärung",
          "Lohnwesen",
          "Jahresabschluss",
          "Unternehmensberatung",
          "Andere",
        ],
      },
      {
        key: "customerType",
        label: "Kundentyp",
        type: "select",
        required: true,
        options: ["Privatperson", "Einzelfirma", "GmbH/AG", "Verein", "Andere"],
      },
    ]),
  },
  {
    slug: "hypotheken",
    title: "Hypotheken",
    short: "Finanzierung und Vergleich",
    category: "Finanzen",
    icon: "🏦",
    description: "Finanzierung und Hypothekenvergleich.",
    longDescription:
      "Finde Berater für Hypotheken, Refinanzierungen, Immobilienfinanzierung und individuelle Finanzierungslösungen.",
    keywords: ["Hypothekenvergleich", "Immobilienfinanzierung", "Zinsen"],
    leadPrice: 35,
    questions: withCommonQuestions([
      {
        key: "workType",
        label: "Gewünschte Beratung",
        type: "select",
        required: true,
        options: [
          "Neue Hypothek",
          "Ablösung",
          "Verlängerung",
          "Refinanzierung",
          "Allgemeine Beratung",
        ],
      },
      {
        key: "propertyValue",
        label: "Ungefährer Immobilienwert",
        type: "text",
        required: false,
        placeholder: "z. B. CHF 900'000",
      },
    ]),
  },
  {
    slug: "webseiten",
    title: "Webseiten",
    short: "Webdesign und Entwicklung",
    category: "IT & Digital",
    icon: "🌐",
    description: "Webdesign und Entwicklung.",
    longDescription:
      "Vergleiche Agenturen und Entwickler für Firmenwebseiten, Onlineshops, Landingpages und Webanwendungen.",
    keywords: ["Webdesign", "Website erstellen", "Webentwicklung"],
    leadPrice: 35,
    questions: withCommonQuestions([
      {
        key: "workType",
        label: "Projektart",
        type: "select",
        required: true,
        options: [
          "Firmenwebseite",
          "Onlineshop",
          "Landingpage",
          "Webanwendung",
          "Redesign",
          "Andere",
        ],
      },
      {
        key: "existingWebsite",
        label: "Besteht bereits eine Webseite?",
        type: "select",
        required: false,
        options: yesNoOptions,
      },
    ]),
  },
  {
    slug: "seo",
    title: "SEO",
    short: "Mehr Sichtbarkeit bei Google",
    category: "IT & Digital",
    icon: "📈",
    description: "Mehr Sichtbarkeit bei Google.",
    longDescription:
      "Finde SEO-Agenturen für technische Optimierung, Inhalte, lokale Sichtbarkeit und nachhaltige Google-Rankings.",
    keywords: ["Suchmaschinenoptimierung", "Google Ranking", "Local SEO"],
    leadPrice: 35,
    questions: withCommonQuestions([
      {
        key: "workType",
        label: "Gewünschte SEO-Leistung",
        type: "select",
        required: true,
        options: [
          "SEO-Audit",
          "Local SEO",
          "Technisches SEO",
          "Content SEO",
          "Komplettbetreuung",
        ],
      },
      {
        key: "website",
        label: "Webseite",
        type: "text",
        required: false,
        placeholder: "z. B. www.firma.ch",
      },
    ]),
  },
  {
    slug: "it-support",
    title: "IT-Support",
    short: "Support, Netzwerke und Sicherheit",
    category: "IT & Digital",
    icon: "💻",
    description: "Support, Netzwerke und Sicherheit.",
    longDescription:
      "Vergleiche IT-Dienstleister für Support, Netzwerke, Cloud, Geräte, Datensicherung und IT-Sicherheit.",
    keywords: ["IT-Service", "Computerhilfe", "Netzwerk"],
    leadPrice: 25,
    questions: withCommonQuestions([
      {
        key: "workType",
        label: "Gewünschte IT-Leistung",
        type: "select",
        required: true,
        options: [
          "Computerhilfe",
          "Netzwerk",
          "Cloud",
          "Datensicherung",
          "IT-Sicherheit",
          "Supportvertrag",
          "Andere",
        ],
      },
      {
        key: "urgency",
        label: "Dringlichkeit",
        type: "select",
        required: true,
        options: timingOptions,
      },
    ]),
  },
];

export function getServiceBySlug(slug: string): Service | undefined {
  const normalizedSlug = slug.trim().toLowerCase();

  return services.find(
    (service) => service.slug.toLowerCase() === normalizedSlug
  );
}

export function getServiceByTitle(title: string): Service | undefined {
  const normalizedTitle = title.trim().toLowerCase();

  return services.find(
    (service) => service.title.trim().toLowerCase() === normalizedTitle
  );
}

export function searchServices(query: string): Service[] {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return services;
  }

  return services.filter((service) => {
    const searchableContent = [
      service.slug,
      service.title,
      service.short,
      service.category,
      service.description,
      service.longDescription,
      ...service.keywords,
    ]
      .join(" ")
      .toLowerCase();

    return searchableContent.includes(normalizedQuery);
  });
}

export function getPopularServices(limit = 8): Service[] {
  const safeLimit = Math.max(0, Math.floor(limit));

  const featuredServices = services.filter((service) => service.featured);
  const remainingServices = services.filter((service) => !service.featured);

  return [...featuredServices, ...remainingServices].slice(0, safeLimit);
}