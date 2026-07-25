export type ServiceQuestionType =
  | "text"
  | "textarea"
  | "number"
  | "date"
  | "select"
  | "multi-select"
  | "boolean";

export type ServiceQuestionOption = {
  label: string;
  value: string;
};

export type ServiceQuestion = {
  id: string;
  label: string;
  type: ServiceQuestionType;
  required?: boolean;
  placeholder?: string;
  options?: ServiceQuestionOption[];
};

export type ServiceItem = {
  slug: string;
  name: string;
  description: string;
  icon: string;
  leadPrice: number;
  questions?: ServiceQuestion[];
};

export type ServiceCategory = {
  slug: string;
  name: string;
  description: string;
  icon: string;
  services: ServiceItem[];
};

const commonQuestions: ServiceQuestion[] = [
  {
    id: "description",
    label: "Beschreibe deinen Auftrag",
    type: "textarea",
    required: true,
    placeholder:
      "Beschreibe möglichst genau, welche Arbeiten ausgeführt werden sollen.",
  },
];

export const serviceCategories: ServiceCategory[] = [
  {
    slug: "reinigung-hauswartung",
    name: "Reinigung & Hauswartung",
    description:
      "Reinigung, Unterhalt und Betreuung für private und gewerbliche Immobilien.",
    icon: "🧹",
    services: [
      {
        slug: "umzugsreinigung",
        name: "Umzugsreinigung",
        description:
          "Professionelle Endreinigung mit oder ohne Abgabegarantie.",
        icon: "✨",
        leadPrice: 35,
        questions: [
          {
            id: "propertyType",
            label: "Art des Objekts",
            type: "select",
            required: true,
            options: [
              { label: "Wohnung", value: "apartment" },
              { label: "Haus", value: "house" },
              { label: "Gewerbeobjekt", value: "commercial" },
            ],
          },
          {
            id: "rooms",
            label: "Anzahl Zimmer",
            type: "select",
            required: true,
            options: [
              { label: "1–1.5 Zimmer", value: "1-1.5" },
              { label: "2–2.5 Zimmer", value: "2-2.5" },
              { label: "3–3.5 Zimmer", value: "3-3.5" },
              { label: "4–4.5 Zimmer", value: "4-4.5" },
              { label: "5 oder mehr Zimmer", value: "5-plus" },
            ],
          },
          {
            id: "area",
            label: "Fläche in m²",
            type: "number",
            placeholder: "Zum Beispiel 85",
          },
          {
            id: "handoverGuarantee",
            label: "Abgabegarantie gewünscht?",
            type: "boolean",
          },
          {
            id: "balcony",
            label: "Balkon oder Terrasse vorhanden?",
            type: "boolean",
          },
          {
            id: "blinds",
            label: "Storen oder Fensterläden vorhanden?",
            type: "boolean",
          },
          ...commonQuestions,
        ],
      },
      {
        slug: "unterhaltsreinigung",
        name: "Unterhaltsreinigung",
        description:
          "Regelmässige Reinigung von Wohnungen, Büros und Liegenschaften.",
        icon: "🧽",
        leadPrice: 20,
        questions: [
          {
            id: "frequency",
            label: "Gewünschte Häufigkeit",
            type: "select",
            required: true,
            options: [
              { label: "Einmalig", value: "once" },
              { label: "Wöchentlich", value: "weekly" },
              { label: "Alle zwei Wochen", value: "biweekly" },
              { label: "Monatlich", value: "monthly" },
            ],
          },
          {
            id: "area",
            label: "Fläche in m²",
            type: "number",
          },
          ...commonQuestions,
        ],
      },
      {
        slug: "fensterreinigung",
        name: "Fensterreinigung",
        description:
          "Fenster, Rahmen, Storen und Glasflächen professionell reinigen.",
        icon: "🪟",
        leadPrice: 20,
        questions: [
          {
            id: "windowCount",
            label: "Ungefähre Anzahl Fenster",
            type: "select",
            required: true,
            options: [
              { label: "1–5 Fenster", value: "1-5" },
              { label: "6–10 Fenster", value: "6-10" },
              { label: "11–15 Fenster", value: "11-15" },
              { label: "16–20 Fenster", value: "16-20" },
              { label: "Mehr als 20 Fenster", value: "20-plus" },
            ],
          },
          {
            id: "blinds",
            label: "Storen oder Fensterläden reinigen?",
            type: "boolean",
          },
          ...commonQuestions,
        ],
      },
      {
        slug: "hauswartung",
        name: "Hauswartung",
        description:
          "Komplette Betreuung und Pflege von Wohn- und Gewerbeliegenschaften.",
        icon: "🏢",
        leadPrice: 35,
        questions: [
          {
            id: "propertyCount",
            label: "Anzahl Liegenschaften",
            type: "number",
          },
          {
            id: "services",
            label: "Gewünschte Leistungen",
            type: "multi-select",
            required: true,
            options: [
              { label: "Treppenhausreinigung", value: "stairwell" },
              { label: "Umgebungspflege", value: "outdoor" },
              { label: "Technische Kontrollen", value: "technical" },
              { label: "Winterdienst", value: "winter" },
              { label: "Abfallmanagement", value: "waste" },
            ],
          },
          ...commonQuestions,
        ],
      },
    ],
  },

  {
    slug: "bau-handwerk",
    name: "Bau & Handwerk",
    description:
      "Fachbetriebe für Renovationen, Reparaturen und Bauarbeiten.",
    icon: "🛠️",
    services: [
      {
        slug: "maler",
        name: "Malerarbeiten",
        description:
          "Innen- und Aussenanstriche, Renovationen und Lackierarbeiten.",
        icon: "🎨",
        leadPrice: 35,
        questions: commonQuestions,
      },
      {
        slug: "elektriker",
        name: "Elektriker",
        description:
          "Elektroinstallationen, Reparaturen und technische Kontrollen.",
        icon: "⚡",
        leadPrice: 25,
        questions: commonQuestions,
      },
      {
        slug: "sanitaer",
        name: "Sanitär",
        description:
          "Sanitärinstallationen, Reparaturen und Badezimmerumbauten.",
        icon: "🚿",
        leadPrice: 25,
        questions: commonQuestions,
      },
      {
        slug: "schreiner",
        name: "Schreiner",
        description:
          "Möbel, Türen, Einbauten und individuelle Holzarbeiten.",
        icon: "🪚",
        leadPrice: 30,
        questions: commonQuestions,
      },
      {
        slug: "bodenleger",
        name: "Bodenleger",
        description:
          "Parkett, Laminat, Vinyl, Teppich und weitere Bodenbeläge.",
        icon: "🧱",
        leadPrice: 30,
        questions: commonQuestions,
      },
      {
        slug: "renovation",
        name: "Renovation",
        description:
          "Komplette Renovationen und Modernisierungen von Immobilien.",
        icon: "🏗️",
        leadPrice: 40,
        questions: commonQuestions,
      },
      {
        slug: "heizung-klima",
        name: "Heizung & Klima",
        description:
          "Heizungen, Klimaanlagen, Wärmepumpen und Lüftungssysteme.",
        icon: "🌡️",
        leadPrice: 35,
        questions: commonQuestions,
      },
      {
        slug: "dachdecker",
        name: "Dachdecker",
        description:
          "Dachsanierungen, Reparaturen, Isolationen und Dachfenster.",
        icon: "🏠",
        leadPrice: 35,
        questions: commonQuestions,
      },
    ],
  },

  {
    slug: "umzug-transport",
    name: "Umzug & Transport",
    description:
      "Umzüge, Transporte, Entsorgung und Logistikdienstleistungen.",
    icon: "🚚",
    services: [
      {
        slug: "umzug",
        name: "Umzug",
        description:
          "Private und geschäftliche Umzüge innerhalb der Schweiz.",
        icon: "📦",
        leadPrice: 35,
        questions: [
          {
            id: "moveFrom",
            label: "Umzug von",
            type: "text",
            required: true,
            placeholder: "PLZ und Ort",
          },
          {
            id: "moveTo",
            label: "Umzug nach",
            type: "text",
            required: true,
            placeholder: "PLZ und Ort",
          },
          {
            id: "rooms",
            label: "Anzahl Zimmer",
            type: "number",
          },
          {
            id: "liftAvailable",
            label: "Ist ein Lift vorhanden?",
            type: "boolean",
          },
          ...commonQuestions,
        ],
      },
      {
        slug: "transport",
        name: "Transport",
        description:
          "Möbel-, Waren- und Spezialtransporte.",
        icon: "🚛",
        leadPrice: 25,
        questions: commonQuestions,
      },
      {
        slug: "entsorgung",
        name: "Entsorgung & Räumung",
        description:
          "Wohnungsräumungen, Entsorgungen und Haushaltsauflösungen.",
        icon: "♻️",
        leadPrice: 25,
        questions: commonQuestions,
      },
      {
        slug: "kurierdienst",
        name: "Kurierdienst",
        description:
          "Schnelle Direktlieferungen und Expresskurierdienste.",
        icon: "📨",
        leadPrice: 20,
        questions: commonQuestions,
      },
      {
        slug: "lagerung",
        name: "Lagerung",
        description:
          "Kurz- und langfristige Einlagerung von Möbeln und Waren.",
        icon: "🏬",
        leadPrice: 20,
        questions: commonQuestions,
      },
    ],
  },

  {
    slug: "garten-aussenbereich",
    name: "Garten & Aussenbereich",
    description:
      "Gartenpflege, Landschaftsbau und Arbeiten rund um Aussenanlagen.",
    icon: "🌿",
    services: [
      {
        slug: "gartenpflege",
        name: "Gartenpflege",
        description:
          "Rasen, Hecken, Bäume und regelmässige Umgebungspflege.",
        icon: "🌱",
        leadPrice: 20,
        questions: commonQuestions,
      },
      {
        slug: "gartenbau",
        name: "Gartenbau",
        description:
          "Neugestaltung und Umbau von Gärten und Aussenanlagen.",
        icon: "🌳",
        leadPrice: 35,
        questions: commonQuestions,
      },
      {
        slug: "baumpflege",
        name: "Baumpflege",
        description:
          "Baumschnitt, Fällungen und professionelle Baumpflege.",
        icon: "🪵",
        leadPrice: 25,
        questions: commonQuestions,
      },
      {
        slug: "winterdienst",
        name: "Winterdienst",
        description:
          "Schneeräumung und Glatteisbekämpfung.",
        icon: "❄️",
        leadPrice: 25,
        questions: commonQuestions,
      },
    ],
  },

  {
    slug: "business-marketing",
    name: "Business & Marketing",
    description:
      "Dienstleistungen für Unternehmen, Selbstständige und Organisationen.",
    icon: "💼",
    services: [
      {
        slug: "webdesign",
        name: "Webdesign",
        description:
          "Moderne Webseiten, Onlineshops und Landingpages.",
        icon: "💻",
        leadPrice: 30,
        questions: commonQuestions,
      },
      {
        slug: "online-marketing",
        name: "Online-Marketing",
        description:
          "Google Ads, Social Ads, SEO und digitale Kundengewinnung.",
        icon: "📈",
        leadPrice: 30,
        questions: commonQuestions,
      },
      {
        slug: "social-media",
        name: "Social Media",
        description:
          "Content, Betreuung und Wachstum für Social-Media-Kanäle.",
        icon: "📱",
        leadPrice: 25,
        questions: commonQuestions,
      },
      {
        slug: "grafikdesign",
        name: "Grafikdesign",
        description:
          "Logos, Werbemittel, Branding und visuelle Kommunikation.",
        icon: "🖌️",
        leadPrice: 20,
        questions: commonQuestions,
      },
      {
        slug: "softwareentwicklung",
        name: "Softwareentwicklung",
        description:
          "Apps, Plattformen, Automatisierungen und individuelle Software.",
        icon: "⌨️",
        leadPrice: 35,
        questions: commonQuestions,
      },
      {
        slug: "treuhand",
        name: "Treuhand & Buchhaltung",
        description:
          "Buchhaltung, Jahresabschlüsse, Löhne und Unternehmensberatung.",
        icon: "🧾",
        leadPrice: 30,
        questions: commonQuestions,
      },
      {
        slug: "steuerberatung",
        name: "Steuerberatung",
        description:
          "Steuererklärungen und steuerliche Beratung für Privatpersonen und Firmen.",
        icon: "📊",
        leadPrice: 25,
        questions: commonQuestions,
      },
      {
        slug: "personalvermittlung",
        name: "Personalvermittlung",
        description:
          "Rekrutierung, Temporärpersonal und Personalsuche.",
        icon: "🤝",
        leadPrice: 35,
        questions: commonQuestions,
      },
    ],
  },

  {
    slug: "it-technik",
    name: "IT & Technik",
    description:
      "Technische Hilfe, IT-Support und digitale Lösungen.",
    icon: "🖥️",
    services: [
      {
        slug: "it-support",
        name: "IT-Support",
        description:
          "Hilfe bei Computern, Netzwerken, Software und Geräten.",
        icon: "🛠️",
        leadPrice: 20,
        questions: commonQuestions,
      },
      {
        slug: "computer-reparatur",
        name: "Computer-Reparatur",
        description:
          "Reparatur, Aufrüstung und Fehlerdiagnose.",
        icon: "🔧",
        leadPrice: 20,
        questions: commonQuestions,
      },
      {
        slug: "smartphone-reparatur",
        name: "Smartphone-Reparatur",
        description:
          "Display, Akku und weitere Reparaturen für Mobilgeräte.",
        icon: "📲",
        leadPrice: 15,
        questions: commonQuestions,
      },
      {
        slug: "cybersicherheit",
        name: "Cybersicherheit",
        description:
          "Schutz, Sicherheitsprüfungen und Beratung für IT-Systeme.",
        icon: "🔐",
        leadPrice: 35,
        questions: commonQuestions,
      },
      {
        slug: "ki-automatisierung",
        name: "KI & Automatisierung",
        description:
          "KI-Lösungen, Prozessautomatisierung und digitale Assistenten.",
        icon: "🤖",
        leadPrice: 35,
        questions: commonQuestions,
      },
    ],
  },

  {
    slug: "events-medien",
    name: "Events & Medien",
    description:
      "Dienstleister für Veranstaltungen, Hochzeiten und Medienproduktionen.",
    icon: "🎉",
    services: [
      {
        slug: "eventplanung",
        name: "Eventplanung",
        description:
          "Planung und Organisation privater und geschäftlicher Anlässe.",
        icon: "🎟️",
        leadPrice: 30,
        questions: commonQuestions,
      },
      {
        slug: "fotografie",
        name: "Fotografie",
        description:
          "Hochzeiten, Events, Unternehmen, Produkte und Portraits.",
        icon: "📷",
        leadPrice: 25,
        questions: commonQuestions,
      },
      {
        slug: "videoproduktion",
        name: "Videoproduktion",
        description:
          "Werbevideos, Eventvideos und Social-Media-Produktionen.",
        icon: "🎥",
        leadPrice: 30,
        questions: commonQuestions,
      },
      {
        slug: "dj-musik",
        name: "DJ & Musik",
        description:
          "DJs, Musiker und Unterhaltung für Events.",
        icon: "🎧",
        leadPrice: 25,
        questions: commonQuestions,
      },
      {
        slug: "catering",
        name: "Catering",
        description:
          "Verpflegung und Catering für private und geschäftliche Anlässe.",
        icon: "🍽️",
        leadPrice: 25,
        questions: commonQuestions,
      },
      {
        slug: "dekoration",
        name: "Dekoration",
        description:
          "Event-, Hochzeits- und Raumdekoration.",
        icon: "🎈",
        leadPrice: 20,
        questions: commonQuestions,
      },
    ],
  },

  {
    slug: "gesundheit-beauty",
    name: "Gesundheit, Fitness & Beauty",
    description:
      "Persönliche Betreuung rund um Fitness, Wohlbefinden und Schönheit.",
    icon: "💪",
    services: [
      {
        slug: "personal-training",
        name: "Personal Training",
        description:
          "Individuelles Fitness- und Leistungstraining.",
        icon: "🏋️",
        leadPrice: 20,
        questions: commonQuestions,
      },
      {
        slug: "ernaehrungsberatung",
        name: "Ernährungsberatung",
        description:
          "Persönliche Ernährungspläne und professionelle Beratung.",
        icon: "🥗",
        leadPrice: 20,
        questions: commonQuestions,
      },
      {
        slug: "massage",
        name: "Massage",
        description:
          "Entspannungs-, Sport- und therapeutische Massagen.",
        icon: "💆",
        leadPrice: 15,
        questions: commonQuestions,
      },
      {
        slug: "coiffeur",
        name: "Coiffeur",
        description:
          "Haarschnitte, Styling und mobile Coiffeur-Dienstleistungen.",
        icon: "✂️",
        leadPrice: 15,
        questions: commonQuestions,
      },
      {
        slug: "kosmetik",
        name: "Kosmetik",
        description:
          "Gesichtsbehandlungen, Pflege und Beauty-Dienstleistungen.",
        icon: "💄",
        leadPrice: 15,
        questions: commonQuestions,
      },
      {
        slug: "coaching",
        name: "Coaching",
        description:
          "Persönliches, berufliches und mentales Coaching.",
        icon: "🧠",
        leadPrice: 20,
        questions: commonQuestions,
      },
    ],
  },

  {
    slug: "bildung-beratung",
    name: "Bildung & Beratung",
    description:
      "Unterricht, Nachhilfe und professionelle Beratungsleistungen.",
    icon: "🎓",
    services: [
      {
        slug: "nachhilfe",
        name: "Nachhilfe",
        description:
          "Unterstützung für Schule, Ausbildung und Studium.",
        icon: "📚",
        leadPrice: 15,
        questions: commonQuestions,
      },
      {
        slug: "sprachunterricht",
        name: "Sprachunterricht",
        description:
          "Privater und geschäftlicher Sprachunterricht.",
        icon: "🗣️",
        leadPrice: 15,
        questions: commonQuestions,
      },
      {
        slug: "musikunterricht",
        name: "Musikunterricht",
        description:
          "Instrumental- und Gesangsunterricht.",
        icon: "🎸",
        leadPrice: 15,
        questions: commonQuestions,
      },
      {
        slug: "unternehmensberatung",
        name: "Unternehmensberatung",
        description:
          "Strategie, Wachstum, Prozesse und Unternehmensentwicklung.",
        icon: "📋",
        leadPrice: 30,
        questions: commonQuestions,
      },
      {
        slug: "rechtsberatung",
        name: "Rechtsberatung",
        description:
          "Juristische Beratung für Privatpersonen und Unternehmen.",
        icon: "⚖️",
        leadPrice: 30,
        questions: commonQuestions,
      },
      {
        slug: "versicherungsberatung",
        name: "Versicherungsberatung",
        description:
          "Beratung und Vergleich für private und geschäftliche Versicherungen.",
        icon: "🛡️",
        leadPrice: 25,
        questions: commonQuestions,
      },
    ],
  },

  {
    slug: "familie-betreuung",
    name: "Familie & Betreuung",
    description:
      "Unterstützung im Alltag für Familien, Kinder und Senioren.",
    icon: "👨‍👩‍👧‍👦",
    services: [
      {
        slug: "kinderbetreuung",
        name: "Kinderbetreuung",
        description:
          "Babysitting und flexible Betreuung von Kindern.",
        icon: "🧸",
        leadPrice: 15,
        questions: commonQuestions,
      },
      {
        slug: "seniorenbetreuung",
        name: "Seniorenbetreuung",
        description:
          "Alltagsunterstützung und Begleitung von Seniorinnen und Senioren.",
        icon: "🤲",
        leadPrice: 20,
        questions: commonQuestions,
      },
      {
        slug: "haushaltshilfe",
        name: "Haushaltshilfe",
        description:
          "Unterstützung bei Haushalt, Einkauf und täglichen Aufgaben.",
        icon: "🏡",
        leadPrice: 15,
        questions: commonQuestions,
      },
      {
        slug: "administrative-hilfe",
        name: "Administrative Hilfe",
        description:
          "Unterstützung bei Formularen, Briefen und Organisation.",
        icon: "🗂️",
        leadPrice: 15,
        questions: commonQuestions,
      },
    ],
  },

  {
    slug: "tiere",
    name: "Tiere",
    description:
      "Betreuung, Pflege und Dienstleistungen für Haustiere.",
    icon: "🐾",
    services: [
      {
        slug: "hundebetreuung",
        name: "Hundebetreuung",
        description:
          "Spaziergänge, Tagesbetreuung und Ferienbetreuung.",
        icon: "🐕",
        leadPrice: 15,
        questions: commonQuestions,
      },
      {
        slug: "tierbetreuung",
        name: "Tierbetreuung",
        description:
          "Betreuung von Katzen und weiteren Haustieren.",
        icon: "🐈",
        leadPrice: 15,
        questions: commonQuestions,
      },
      {
        slug: "hundetraining",
        name: "Hundetraining",
        description:
          "Erziehung, Verhaltenstraining und Hundeschule.",
        icon: "🦮",
        leadPrice: 20,
        questions: commonQuestions,
      },
      {
        slug: "tiertransport",
        name: "Tiertransport",
        description:
          "Sicherer Transport von Haustieren.",
        icon: "🚐",
        leadPrice: 15,
        questions: commonQuestions,
      },
    ],
  },

  {
    slug: "fahrzeuge",
    name: "Fahrzeuge",
    description:
      "Reinigung, Wartung und Dienstleistungen rund um Fahrzeuge.",
    icon: "🚗",
    services: [
      {
        slug: "fahrzeugaufbereitung",
        name: "Fahrzeugaufbereitung",
        description:
          "Innen- und Aussenreinigung sowie professionelle Fahrzeugpflege.",
        icon: "✨",
        leadPrice: 20,
        questions: commonQuestions,
      },
      {
        slug: "autowerkstatt",
        name: "Autowerkstatt",
        description:
          "Reparaturen, Service und Wartung von Fahrzeugen.",
        icon: "🔩",
        leadPrice: 25,
        questions: commonQuestions,
      },
      {
        slug: "reifenservice",
        name: "Reifenservice",
        description:
          "Reifenwechsel, Einlagerung und Reifenmontage.",
        icon: "🛞",
        leadPrice: 15,
        questions: commonQuestions,
      },
      {
        slug: "abschleppdienst",
        name: "Abschleppdienst",
        description:
          "Pannenhilfe und Fahrzeugtransporte.",
        icon: "🚨",
        leadPrice: 20,
        questions: commonQuestions,
      },
    ],
  },

  {
    slug: "sonstiges",
    name: "Weitere Dienstleistungen",
    description:
      "Für alle Aufträge, die keiner bestehenden Kategorie entsprechen.",
    icon: "➕",
    services: [
      {
        slug: "individuelle-anfrage",
        name: "Individuelle Anfrage",
        description:
          "Beschreibe deine gewünschte Dienstleistung und finde passende Anbieter.",
        icon: "💬",
        leadPrice: 20,
        questions: commonQuestions,
      },
    ],
  },
];

export function getServiceCategory(
  categorySlug: string
): ServiceCategory | undefined {
  return serviceCategories.find(
    (category) => category.slug === categorySlug
  );
}

export function getService(
  serviceSlug: string
): ServiceItem | undefined {
  for (const category of serviceCategories) {
    const service = category.services.find(
      (item) => item.slug === serviceSlug
    );

    if (service) {
      return service;
    }
  }

  return undefined;
}

export function getCategoryByService(
  serviceSlug: string
): ServiceCategory | undefined {
  return serviceCategories.find((category) =>
    category.services.some(
      (service) => service.slug === serviceSlug
    )
  );
}

export function getAllServices(): ServiceItem[] {
  return serviceCategories.flatMap(
    (category) => category.services
  );
}

export function searchServices(
  searchTerm: string
): Array<{
  category: ServiceCategory;
  service: ServiceItem;
}> {
  const normalizedSearch = searchTerm
    .trim()
    .toLowerCase();

  if (!normalizedSearch) {
    return [];
  }

  return serviceCategories.flatMap((category) =>
    category.services
      .filter((service) => {
        const searchableText = [
          category.name,
          category.description,
          service.name,
          service.description,
        ]
          .join(" ")
          .toLowerCase();

        return searchableText.includes(
          normalizedSearch
        );
      })
      .map((service) => ({
        category,
        service,
      }))
  );
}