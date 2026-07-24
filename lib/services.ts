export type ServiceQuestionType =
  | "text"
  | "textarea"
  | "number"
  | "date"
  | "select"
  | "boolean";

export type ServiceQuestion = {
  key: string;
  label: string;
  type: ServiceQuestionType;
  required?: boolean;
  placeholder?: string;
  options?: string[];
};

export type ServiceCategory =
  | "Reinigung & Haushalt"
  | "Hauswartung & Immobilien"
  | "Umzug & Transport"
  | "Entsorgung & Räumung"
  | "Garten & Umgebung"
  | "Handwerk & Renovation"
  | "Elektro & Technik"
  | "Sanitär & Heizung"
  | "Fahrzeuge"
  | "Digital & Marketing"
  | "Business & Beratung"
  | "Events & Medien"
  | "Private Dienstleistungen"
  | "Gesundheit & Fitness";

export type Service = {
  slug: string;
  title: string;
  short: string;
  description: string;
  bullets: string[];
  tags: string[];
  icon: string;
  category: ServiceCategory;
  leadPrice: number;
  popular: boolean;
  seo: boolean;
  keywords: string[];
  questions: ServiceQuestion[];
};

const dateQuestion: ServiceQuestion = {
  key: "start",
  label: "Gewünschter Termin",
  type: "date",
};

const budgetQuestion: ServiceQuestion = {
  key: "budget",
  label: "Budget oder Preisvorstellung",
  type: "text",
  placeholder: "z. B. CHF 500–800",
};

const messageQuestion: ServiceQuestion = {
  key: "message",
  label: "Beschreibe deinen Auftrag",
  type: "textarea",
  required: true,
  placeholder: "Was soll erledigt werden? Gibt es Besonderheiten?",
};

const objectQuestion: ServiceQuestion = {
  key: "objectType",
  label: "Um welches Objekt handelt es sich?",
  type: "select",
  required: true,
  options: [
    "Wohnung",
    "Einfamilienhaus",
    "Mehrfamilienhaus",
    "Büro",
    "Gewerbe",
    "Praxis",
    "Restaurant",
    "Andere",
  ],
};

const areaQuestion: ServiceQuestion = {
  key: "area",
  label: "Ungefähre Fläche",
  type: "text",
  placeholder: "z. B. 85 m²",
};

const roomsQuestion: ServiceQuestion = {
  key: "rooms",
  label: "Anzahl Zimmer",
  type: "select",
  options: [
    "1–1.5 Zimmer",
    "2–2.5 Zimmer",
    "3–3.5 Zimmer",
    "4–4.5 Zimmer",
    "5–5.5 Zimmer",
    "6 oder mehr Zimmer",
  ],
};

const commonQuestions: ServiceQuestion[] = [
  dateQuestion,
  budgetQuestion,
  messageQuestion,
];

const cleaningQuestions: ServiceQuestion[] = [
  objectQuestion,
  roomsQuestion,
  areaQuestion,
  ...commonQuestions,
];

const movingCleaningQuestions: ServiceQuestion[] = [
  objectQuestion,
  roomsQuestion,
  areaQuestion,
  {
    key: "handoverGuarantee",
    label: "Abgabegarantie gewünscht?",
    type: "select",
    required: true,
    options: ["Ja", "Nein", "Noch unsicher"],
  },
  {
    key: "balcony",
    label: "Balkon oder Terrasse vorhanden?",
    type: "select",
    options: ["Ja", "Nein"],
  },
  {
    key: "cellar",
    label: "Keller vorhanden?",
    type: "select",
    options: ["Ja", "Nein"],
  },
  ...commonQuestions,
];

const windowQuestions: ServiceQuestion[] = [
  objectQuestion,
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
    options: ["Eher klein", "Normal", "Eher gross", "Bodentief", "Gemischt"],
  },
  {
    key: "blinds",
    label: "Lamellenstoren vorhanden?",
    type: "select",
    options: ["Ja", "Nein", "Teilweise"],
  },
  {
    key: "shutters",
    label: "Fensterläden vorhanden?",
    type: "select",
    options: ["Ja", "Nein", "Teilweise"],
  },
  ...commonQuestions,
];

const movingQuestions: ServiceQuestion[] = [
  {
    key: "propertyType",
    label: "Art des Auftrags",
    type: "select",
    required: true,
    options: ["Privatumzug", "Firmenumzug", "Kleintransport", "Möbeltransport"],
  },
  roomsQuestion,
  {
    key: "floor",
    label: "Etage",
    type: "text",
    placeholder: "z. B. 3. Stock",
  },
  {
    key: "elevator",
    label: "Lift vorhanden?",
    type: "select",
    options: ["Ja", "Nein", "Unbekannt"],
  },
  {
    key: "parking",
    label: "Parkmöglichkeit vorhanden?",
    type: "select",
    options: ["Ja", "Nein", "Unklar"],
  },
  ...commonQuestions,
];

const gardenQuestions: ServiceQuestion[] = [
  {
    key: "propertyType",
    label: "Art der Fläche",
    type: "select",
    required: true,
    options: ["Privatgarten", "Mehrfamilienhaus", "Gewerbe", "Andere"],
  },
  areaQuestion,
  {
    key: "offersWanted",
    label: "Einmalig oder regelmässig?",
    type: "select",
    options: ["Einmalig", "Wöchentlich", "Alle 2 Wochen", "Monatlich", "Saisonal"],
  },
  ...commonQuestions,
];

const handymanQuestions: ServiceQuestion[] = [
  objectQuestion,
  {
    key: "propertyType",
    label: "Art der Arbeiten",
    type: "select",
    required: true,
    options: ["Reparatur", "Montage", "Renovation", "Neubau", "Kontrolle", "Andere"],
  },
  areaQuestion,
  ...commonQuestions,
];

const digitalQuestions: ServiceQuestion[] = [
  {
    key: "propertyType",
    label: "Projektart",
    type: "select",
    required: true,
    options: ["Neues Projekt", "Überarbeitung", "Laufende Betreuung", "Beratung", "Fehlerbehebung"],
  },
  ...commonQuestions,
];

const businessQuestions: ServiceQuestion[] = [
  {
    key: "propertyType",
    label: "Privat oder Unternehmen?",
    type: "select",
    required: true,
    options: ["Privat", "Einzelfirma", "GmbH", "AG", "Verein", "Andere"],
  },
  ...commonQuestions,
];

const eventQuestions: ServiceQuestion[] = [
  {
    key: "propertyType",
    label: "Art des Events",
    type: "select",
    required: true,
    options: ["Hochzeit", "Geburtstag", "Firmenanlass", "Privatanlass", "Konzert", "Andere"],
  },
  {
    key: "offersWanted",
    label: "Anzahl Gäste",
    type: "text",
    placeholder: "z. B. 80",
  },
  ...commonQuestions,
];

function service(data: Service): Service {
  return data;
}

export const services: Service[] = [
  service({ slug: "hauswartung", title: "Hauswartung", short: "Zuverlässige Betreuung von Liegenschaften.", description: "Professionelle Hauswartung für Mehrfamilienhäuser, Gewerbe und private Liegenschaften.", bullets: ["Kontrollgänge & Unterhalt", "Koordination & Kleinreparaturen", "Regelmässige Betreuung"], tags: ["Liegenschaft", "Kontrollgänge", "Unterhalt"], icon: "🏢", category: "Hauswartung & Immobilien", leadPrice: 35, popular: true, seo: true, keywords: ["Hauswartung", "Hauswart", "Hausmeister", "Liegenschaftsbetreuung"], questions: [objectQuestion, areaQuestion, { key: "offersWanted", label: "Gewünschter Turnus", type: "select", options: ["Einmalig", "Wöchentlich", "Alle 2 Wochen", "Monatlich", "Nach Bedarf"] }, ...commonQuestions] }),
  service({ slug: "reinigung", title: "Reinigung", short: "Professionelle Reinigung für Wohnungen, Büros und Liegenschaften.", description: "Gründliche Reinigungsleistungen für Privatpersonen, Verwaltungen und Unternehmen.", bullets: ["Privat & Gewerbe", "Einmalig oder regelmässig", "Flexible Termine"], tags: ["Reinigung", "Wohnung", "Büro"], icon: "🧹", category: "Reinigung & Haushalt", leadPrice: 20, popular: true, seo: true, keywords: ["Reinigung", "Putzfirma", "Reinigungsfirma", "Putzhilfe"], questions: cleaningQuestions }),
  service({ slug: "umzugsreinigung", title: "Umzugsreinigung", short: "Endreinigung mit optionaler Abgabegarantie.", description: "Professionelle Umzugsreinigung für Wohnung oder Haus.", bullets: ["Mit Abgabegarantie", "Wohnung & Haus", "Übergabebereit"], tags: ["Endreinigung", "Abgabe", "Umzug"], icon: "🏠", category: "Reinigung & Haushalt", leadPrice: 35, popular: true, seo: true, keywords: ["Umzugsreinigung", "Endreinigung", "Wohnungsabgabe", "Abgabegarantie"], questions: movingCleaningQuestions }),
  service({ slug: "wohnungsreinigung", title: "Wohnungsreinigung", short: "Gründliche Reinigung für Wohnungen.", description: "Professionelle Reinigung für Wohnungen jeder Grösse.", bullets: ["Einmalig oder regelmässig", "Gründlich & zuverlässig", "Flexible Einsätze"], tags: ["Wohnung", "Putzen", "Haushalt"], icon: "🧽", category: "Reinigung & Haushalt", leadPrice: 20, popular: true, seo: true, keywords: ["Wohnungsreinigung", "Wohnung putzen", "Putzhilfe"], questions: cleaningQuestions }),
  service({ slug: "bueroreinigung", title: "Büroreinigung", short: "Saubere Arbeitsplätze für Büros und Gewerbe.", description: "Regelmässige oder einmalige Büroreinigung.", bullets: ["Büro & Praxis", "Regelmässige Einsätze", "Diskret & zuverlässig"], tags: ["Büro", "Gewerbe", "Unterhalt"], icon: "🧼", category: "Reinigung & Haushalt", leadPrice: 20, popular: true, seo: true, keywords: ["Büroreinigung", "Büro reinigen", "Praxisreinigung"], questions: cleaningQuestions }),
  service({ slug: "unterhaltsreinigung", title: "Unterhaltsreinigung", short: "Regelmässige Reinigung für konstant gepflegte Räume.", description: "Planbare Unterhaltsreinigung für Privat und Gewerbe.", bullets: ["Regelmässiger Turnus", "Privat & Gewerbe", "Konstante Qualität"], tags: ["Unterhalt", "Turnus", "Sauberkeit"], icon: "🫧", category: "Reinigung & Haushalt", leadPrice: 20, popular: true, seo: true, keywords: ["Unterhaltsreinigung", "regelmässige Reinigung", "Reinigungsabo"], questions: cleaningQuestions }),
  service({ slug: "grundreinigung", title: "Grundreinigung", short: "Intensive Reinigung für stark beanspruchte Räume.", description: "Tiefenreinigung von Böden, Küche, Bad und Details.", bullets: ["Intensive Reinigung", "Küche & Bad", "Böden & Details"], tags: ["Grundreinigung", "Tiefenreinigung", "Intensivreinigung"], icon: "✨", category: "Reinigung & Haushalt", leadPrice: 20, popular: true, seo: true, keywords: ["Grundreinigung", "Intensivreinigung", "Tiefenreinigung"], questions: cleaningQuestions }),
  service({ slug: "fensterreinigung", title: "Fensterreinigung", short: "Fenster, Rahmen und Storen professionell reinigen.", description: "Streifenfreie Fensterreinigung für Privat und Gewerbe.", bullets: ["Fenster & Rahmen", "Storen & Fensterläden", "Privat & Gewerbe"], tags: ["Fenster", "Glas", "Storen"], icon: "🪟", category: "Reinigung & Haushalt", leadPrice: 20, popular: true, seo: true, keywords: ["Fensterreinigung", "Fenster putzen", "Glasreinigung"], questions: windowQuestions }),
  service({ slug: "baureinigung", title: "Baureinigung", short: "Grob- und Feinreinigung nach Bau oder Renovation.", description: "Professionelle Bauendreinigung für Neubauten und Umbauten.", bullets: ["Grob- & Feinreinigung", "Vor Übergabe", "Neubau & Umbau"], tags: ["Bau", "Übergabe", "Feinreinigung"], icon: "🏗️", category: "Reinigung & Haushalt", leadPrice: 25, popular: false, seo: true, keywords: ["Baureinigung", "Bauendreinigung", "Feinreinigung"], questions: cleaningQuestions }),
  service({ slug: "teppichreinigung", title: "Teppichreinigung", short: "Professionelle Reinigung für Teppiche und textile Böden.", description: "Tiefenreinigung von Teppichen und Auslegeware.", bullets: ["Fleckentfernung", "Textile Böden", "Privat & Gewerbe"], tags: ["Teppich", "Textil", "Flecken"], icon: "🧶", category: "Reinigung & Haushalt", leadPrice: 20, popular: false, seo: true, keywords: ["Teppichreinigung", "Teppich reinigen", "Fleckentfernung"], questions: cleaningQuestions }),
  service({ slug: "umzug", title: "Umzug", short: "Privat- und Firmenumzüge zuverlässig organisieren.", description: "Professioneller Umzugsservice inklusive Planung und Transport.", bullets: ["Privat & Gewerbe", "Planung & Transport", "Optional mit Montage"], tags: ["Umzug", "Transport", "Zügeln"], icon: "🚚", category: "Umzug & Transport", leadPrice: 35, popular: true, seo: true, keywords: ["Umzug", "Umzugsfirma", "Zügeln", "Möbeltransport"], questions: movingQuestions }),
  service({ slug: "firmenumzug", title: "Firmenumzug", short: "Strukturierter Umzug für Büros und Unternehmen.", description: "Planung und Durchführung von Firmenumzügen.", bullets: ["Büro & Gewerbe", "Planbare Abläufe", "Transport & Montage"], tags: ["Firmenumzug", "Büroumzug", "Gewerbe"], icon: "🏭", category: "Umzug & Transport", leadPrice: 35, popular: false, seo: true, keywords: ["Firmenumzug", "Büroumzug", "Geschäftsumzug"], questions: movingQuestions }),
  service({ slug: "kleintransport", title: "Kleintransport", short: "Schneller Transport einzelner Möbel und kleiner Ladungen.", description: "Ideal für Möbelkäufe und kleinere Transporte.", bullets: ["Einzelmöbel", "Kleine Ladungen", "Kurzfristig möglich"], tags: ["Transport", "Möbel", "Lieferung"], icon: "📦", category: "Umzug & Transport", leadPrice: 25, popular: true, seo: true, keywords: ["Kleintransport", "Möbeltransport", "Lieferung"], questions: movingQuestions }),
  service({ slug: "moebelmontage", title: "Möbelmontage", short: "Möbel fachgerecht aufbauen und abbauen.", description: "Montage von Schränken, Betten, Regalen und Tischen.", bullets: ["Auf- & Abbau", "Schränke & Regale", "Saubere Montage"], tags: ["Montage", "Möbel", "Aufbau"], icon: "🪑", category: "Umzug & Transport", leadPrice: 25, popular: true, seo: true, keywords: ["Möbelmontage", "Schrank aufbauen", "Möbel aufbauen"], questions: handymanQuestions }),
  service({ slug: "entsorgung", title: "Entsorgung", short: "Fachgerechte Entsorgung von Sperrgut und Möbeln.", description: "Abholung, Sortierung und fachgerechte Entsorgung.", bullets: ["Sperrgut & Möbel", "Abholung inklusive", "Fachgerechte Entsorgung"], tags: ["Entsorgung", "Sperrgut", "Recycling"], icon: "♻️", category: "Entsorgung & Räumung", leadPrice: 25, popular: true, seo: true, keywords: ["Entsorgung", "Sperrgut", "Möbel entsorgen"], questions: [objectQuestion, areaQuestion, ...commonQuestions] }),
  service({ slug: "entruempelung", title: "Entrümpelung", short: "Wohnung, Keller oder Büro komplett räumen.", description: "Räumung inklusive Abtransport und Entsorgung.", bullets: ["Wohnung & Keller", "Abtransport inklusive", "Optional mit Reinigung"], tags: ["Entrümpelung", "Räumung", "Abtransport"], icon: "🗑️", category: "Entsorgung & Räumung", leadPrice: 25, popular: true, seo: true, keywords: ["Entrümpelung", "Wohnungsräumung", "Keller räumen"], questions: [objectQuestion, roomsQuestion, areaQuestion, ...commonQuestions] }),
  service({ slug: "haushaltsaufloesung", title: "Haushaltsauflösung", short: "Komplette Haushalte diskret auflösen.", description: "Räumung, Sortierung, Abtransport und Entsorgung kompletter Haushalte.", bullets: ["Komplette Räumung", "Diskret & zuverlässig", "Optional mit Reinigung"], tags: ["Haushalt", "Räumung", "Entsorgung"], icon: "🏚️", category: "Entsorgung & Räumung", leadPrice: 35, popular: false, seo: true, keywords: ["Haushaltsauflösung", "Wohnung auflösen", "Nachlassräumung"], questions: [objectQuestion, roomsQuestion, areaQuestion, ...commonQuestions] }),
  service({ slug: "gartenpflege", title: "Gartenpflege", short: "Rasen, Hecken und Grünanlagen professionell pflegen.", description: "Einmalige oder regelmässige Gartenpflege.", bullets: ["Rasen & Hecken", "Einmalig oder regelmässig", "Privat & Gewerbe"], tags: ["Garten", "Pflege", "Unterhalt"], icon: "🌿", category: "Garten & Umgebung", leadPrice: 20, popular: true, seo: true, keywords: ["Gartenpflege", "Gärtner", "Gartenunterhalt"], questions: gardenQuestions }),
  service({ slug: "heckenschnitt", title: "Heckenschnitt", short: "Hecken professionell schneiden und pflegen.", description: "Pflegeschnitt, Rückschnitt und Entsorgung des Schnittguts.", bullets: ["Pflege- & Rückschnitt", "Schnittgut entsorgen", "Privat & Gewerbe"], tags: ["Hecke", "Schnitt", "Garten"], icon: "🌳", category: "Garten & Umgebung", leadPrice: 20, popular: true, seo: true, keywords: ["Heckenschnitt", "Hecke schneiden", "Gärtner"], questions: gardenQuestions }),
  service({ slug: "rasenpflege", title: "Rasenpflege", short: "Rasen mähen und professionell pflegen.", description: "Regelmässige oder einmalige Rasenpflege.", bullets: ["Rasen mähen", "Vertikutieren", "Regelmässige Pflege"], tags: ["Rasen", "Mähen", "Garten"], icon: "🌱", category: "Garten & Umgebung", leadPrice: 20, popular: false, seo: true, keywords: ["Rasenpflege", "Rasen mähen", "Vertikutieren"], questions: gardenQuestions }),
  service({ slug: "winterdienst", title: "Winterdienst", short: "Schnee räumen und Flächen sicher streuen.", description: "Winterdienst für Gehwege, Zufahrten und Parkplätze.", bullets: ["Schnee räumen", "Streudienst", "Pikett & Turnus"], tags: ["Winter", "Schnee", "Sicherheit"], icon: "❄️", category: "Garten & Umgebung", leadPrice: 35, popular: true, seo: true, keywords: ["Winterdienst", "Schnee räumen", "Streudienst"], questions: gardenQuestions }),
  service({ slug: "malerarbeiten", title: "Malerarbeiten", short: "Innen- und Aussenanstriche professionell ausführen.", description: "Malerarbeiten für Wohnungen, Häuser und Fassaden.", bullets: ["Innen & Aussen", "Wohnung & Gewerbe", "Ausbesserung & Neuanstrich"], tags: ["Maler", "Anstrich", "Renovation"], icon: "🎨", category: "Handwerk & Renovation", leadPrice: 35, popular: true, seo: true, keywords: ["Maler", "Malerarbeiten", "Wohnung streichen"], questions: handymanQuestions }),
  service({ slug: "gipserarbeiten", title: "Gipserarbeiten", short: "Wände, Decken und Verputz fachgerecht bearbeiten.", description: "Gipserarbeiten für Neubau, Umbau und Renovation.", bullets: ["Wände & Decken", "Verputz", "Renovation"], tags: ["Gipser", "Verputz", "Wände"], icon: "🧱", category: "Handwerk & Renovation", leadPrice: 35, popular: false, seo: true, keywords: ["Gipser", "Gipserarbeiten", "Verputz"], questions: handymanQuestions }),
  service({ slug: "bodenleger", title: "Bodenleger", short: "Parkett, Laminat und Vinyl professionell verlegen.", description: "Verlegung und Reparatur von Bodenbelägen.", bullets: ["Parkett & Laminat", "Vinyl & Teppich", "Reparatur & Neuverlegung"], tags: ["Boden", "Parkett", "Laminat"], icon: "🪵", category: "Handwerk & Renovation", leadPrice: 35, popular: true, seo: true, keywords: ["Bodenleger", "Parkett verlegen", "Laminat verlegen"], questions: handymanQuestions }),
  service({ slug: "plattenleger", title: "Plattenleger", short: "Keramik- und Bodenplatten professionell verlegen.", description: "Plattenarbeiten für Bad, Küche und Terrasse.", bullets: ["Bad & Küche", "Boden & Wand", "Innen & Aussen"], tags: ["Platten", "Fliesen", "Keramik"], icon: "⬜", category: "Handwerk & Renovation", leadPrice: 35, popular: false, seo: true, keywords: ["Plattenleger", "Fliesenleger", "Keramikplatten"], questions: handymanQuestions }),
  service({ slug: "schreiner", title: "Schreiner", short: "Individuelle Holzarbeiten und Reparaturen.", description: "Schreinerarbeiten für Möbel, Türen und Einbauten.", bullets: ["Möbel & Einbauten", "Türen & Holzarbeiten", "Reparaturen"], tags: ["Schreiner", "Holz", "Möbel"], icon: "🪚", category: "Handwerk & Renovation", leadPrice: 35, popular: true, seo: true, keywords: ["Schreiner", "Holzarbeiten", "Möbel nach Mass"], questions: handymanQuestions }),
  service({ slug: "kleinreparaturen", title: "Kleinreparaturen", short: "Kleine Reparaturen schnell erledigen.", description: "Montage-, Reparatur- und Unterhaltsarbeiten.", bullets: ["Schnelle Erledigung", "Montage & Reparatur", "Privat & Gewerbe"], tags: ["Reparatur", "Handwerker", "Montage"], icon: "🔧", category: "Handwerk & Renovation", leadPrice: 25, popular: true, seo: true, keywords: ["Kleinreparaturen", "Handwerker", "Hausmeisterservice"], questions: handymanQuestions }),
  service({ slug: "elektriker", title: "Elektriker", short: "Elektroinstallationen und Reparaturen.", description: "Elektriker für Installationen, Beleuchtung und Reparaturen.", bullets: ["Installationen", "Reparaturen", "Beleuchtung & Sicherheit"], tags: ["Elektrik", "Strom", "Installation"], icon: "⚡", category: "Elektro & Technik", leadPrice: 25, popular: true, seo: true, keywords: ["Elektriker", "Elektroinstallation", "Strom"], questions: handymanQuestions }),
  service({ slug: "photovoltaik", title: "Photovoltaik", short: "Solaranlagen planen und installieren.", description: "Beratung und Umsetzung von Photovoltaikanlagen.", bullets: ["Beratung & Planung", "Montage & Anschluss", "Speicher & Optimierung"], tags: ["Solar", "Photovoltaik", "Energie"], icon: "☀️", category: "Elektro & Technik", leadPrice: 35, popular: true, seo: true, keywords: ["Photovoltaik", "Solaranlage", "Solarstrom"], questions: handymanQuestions }),
  service({ slug: "smart-home", title: "Smart Home", short: "Licht, Heizung und Sicherheit intelligent steuern.", description: "Planung und Installation moderner Smart-Home-Lösungen.", bullets: ["Licht & Heizung", "Sicherheit", "Automatisierung"], tags: ["Smart Home", "Automatisierung", "Technik"], icon: "🏠", category: "Elektro & Technik", leadPrice: 25, popular: false, seo: true, keywords: ["Smart Home", "Hausautomation", "intelligentes Zuhause"], questions: handymanQuestions }),
  service({ slug: "sanitaer", title: "Sanitär", short: "Installationen und Reparaturen für Bad und Küche.", description: "Sanitärarbeiten für Leitungen, Armaturen, WC und Dusche.", bullets: ["Bad & Küche", "Reparaturen", "Installationen"], tags: ["Sanitär", "Wasser", "Bad"], icon: "🚿", category: "Sanitär & Heizung", leadPrice: 25, popular: true, seo: true, keywords: ["Sanitär", "Sanitärinstallateur", "Wasserleitung"], questions: handymanQuestions }),
  service({ slug: "heizung", title: "Heizung", short: "Heizungen warten, reparieren und erneuern.", description: "Heizungsservice für Wartung, Reparatur und Austausch.", bullets: ["Wartung & Reparatur", "Austausch", "Energieoptimierung"], tags: ["Heizung", "Wärme", "Service"], icon: "🔥", category: "Sanitär & Heizung", leadPrice: 25, popular: true, seo: true, keywords: ["Heizung", "Heizungsservice", "Heizung reparieren"], questions: handymanQuestions }),
  service({ slug: "waermepumpe", title: "Wärmepumpe", short: "Wärmepumpen planen und installieren.", description: "Beratung und Umsetzung moderner Wärmepumpenlösungen.", bullets: ["Beratung & Planung", "Installation", "Wartung"], tags: ["Wärmepumpe", "Heizung", "Energie"], icon: "♨️", category: "Sanitär & Heizung", leadPrice: 35, popular: true, seo: true, keywords: ["Wärmepumpe", "Heizung erneuern", "Luft Wasser Wärmepumpe"], questions: handymanQuestions }),
  service({ slug: "autogarage", title: "Autogarage", short: "Service, Reparatur und Wartung für Fahrzeuge.", description: "Garagenleistungen für Service, Reparaturen und Diagnose.", bullets: ["Service & Wartung", "Reparaturen", "Diagnose"], tags: ["Auto", "Garage", "Service"], icon: "🚗", category: "Fahrzeuge", leadPrice: 25, popular: true, seo: true, keywords: ["Autogarage", "Autoservice", "Auto reparieren"], questions: [{ key: "propertyType", label: "Fahrzeug", type: "text", required: true, placeholder: "Marke, Modell und Jahrgang" }, ...commonQuestions] }),
  service({ slug: "reifenwechsel", title: "Reifenwechsel", short: "Sommer- und Winterreifen wechseln lassen.", description: "Reifenwechsel, Auswuchten und optional Einlagerung.", bullets: ["Reifenwechsel", "Auswuchten", "Optional Einlagerung"], tags: ["Reifen", "Auto", "Werkstatt"], icon: "🛞", category: "Fahrzeuge", leadPrice: 20, popular: true, seo: true, keywords: ["Reifenwechsel", "Winterreifen", "Sommerreifen"], questions: [{ key: "propertyType", label: "Fahrzeug", type: "text", required: true, placeholder: "Marke und Modell" }, dateQuestion, messageQuestion] }),
  service({ slug: "autoaufbereitung", title: "Autoaufbereitung", short: "Innen- und Aussenreinigung für Fahrzeuge.", description: "Professionelle Fahrzeugaufbereitung inklusive Politur.", bullets: ["Innenreinigung", "Aussenpflege", "Politur"], tags: ["Auto", "Reinigung", "Aufbereitung"], icon: "✨", category: "Fahrzeuge", leadPrice: 20, popular: true, seo: true, keywords: ["Autoaufbereitung", "Autoreinigung", "Innenreinigung Auto"], questions: [{ key: "propertyType", label: "Fahrzeug", type: "text", required: true, placeholder: "Marke und Modell" }, ...commonQuestions] }),
  service({ slug: "webdesign", title: "Webdesign", short: "Moderne Websites für Unternehmen.", description: "Konzeption, Design und Entwicklung professioneller Websites.", bullets: ["Websites & Landingpages", "Mobiloptimiert", "SEO-freundlich"], tags: ["Website", "Design", "Digital"], icon: "🌐", category: "Digital & Marketing", leadPrice: 35, popular: true, seo: true, keywords: ["Webdesign", "Website erstellen", "Homepage"], questions: digitalQuestions }),
  service({ slug: "seo", title: "SEO", short: "Mehr Sichtbarkeit bei Google.", description: "Technische, inhaltliche und lokale Suchmaschinenoptimierung.", bullets: ["Technisches SEO", "Local SEO", "Content & Rankings"], tags: ["SEO", "Google", "Marketing"], icon: "🔎", category: "Digital & Marketing", leadPrice: 35, popular: true, seo: true, keywords: ["SEO", "Suchmaschinenoptimierung", "Google Ranking"], questions: digitalQuestions }),
  service({ slug: "google-ads", title: "Google Ads", short: "Gezielte Werbung für mehr Kundenanfragen.", description: "Aufbau und Optimierung von Google-Ads-Kampagnen.", bullets: ["Kampagnenaufbau", "Conversion Tracking", "Optimierung"], tags: ["Google Ads", "Werbung", "Leads"], icon: "📣", category: "Digital & Marketing", leadPrice: 35, popular: true, seo: true, keywords: ["Google Ads", "Google Werbung", "SEA"], questions: digitalQuestions }),
  service({ slug: "social-media", title: "Social Media", short: "Social-Media-Auftritte professionell betreuen.", description: "Content, Strategie und Betreuung für soziale Netzwerke.", bullets: ["Content & Strategie", "Instagram & TikTok", "Laufende Betreuung"], tags: ["Social Media", "Content", "Marketing"], icon: "📱", category: "Digital & Marketing", leadPrice: 35, popular: true, seo: true, keywords: ["Social Media", "Instagram Betreuung", "TikTok Marketing"], questions: digitalQuestions }),
  service({ slug: "softwareentwicklung", title: "Softwareentwicklung", short: "Individuelle Web- und Softwarelösungen.", description: "Entwicklung von Webanwendungen, Portalen und Automationen.", bullets: ["Webanwendungen", "Portale & Tools", "Automatisierung"], tags: ["Software", "Entwicklung", "Web App"], icon: "💻", category: "Digital & Marketing", leadPrice: 35, popular: true, seo: true, keywords: ["Softwareentwicklung", "Web App", "Programmierung"], questions: digitalQuestions }),
  service({ slug: "ki-beratung", title: "KI-Beratung", short: "Prozesse mit künstlicher Intelligenz automatisieren.", description: "Beratung und Umsetzung von KI-Lösungen.", bullets: ["KI-Automatisierung", "Prozessanalyse", "Individuelle Lösungen"], tags: ["KI", "Automatisierung", "Beratung"], icon: "🤖", category: "Digital & Marketing", leadPrice: 35, popular: true, seo: true, keywords: ["KI Beratung", "AI Automation", "Chatbot"], questions: digitalQuestions }),
  service({ slug: "treuhand", title: "Treuhand", short: "Buchhaltung, Steuern und Administration.", description: "Treuhanddienstleistungen für Privatpersonen und Unternehmen.", bullets: ["Buchhaltung", "Steuern", "Jahresabschluss"], tags: ["Treuhand", "Buchhaltung", "Steuern"], icon: "📊", category: "Business & Beratung", leadPrice: 35, popular: true, seo: true, keywords: ["Treuhand", "Treuhänder", "Buchhaltung"], questions: businessQuestions }),
  service({ slug: "steuerberatung", title: "Steuerberatung", short: "Steuererklärungen und Steuerfragen professionell lösen.", description: "Unterstützung bei Steuererklärung und Steuerplanung.", bullets: ["Steuererklärung", "Steuerplanung", "Privat & Unternehmen"], tags: ["Steuern", "Beratung", "Finanzen"], icon: "🧾", category: "Business & Beratung", leadPrice: 35, popular: true, seo: true, keywords: ["Steuerberatung", "Steuererklärung", "Steuerberater Schweiz"], questions: businessQuestions }),
  service({ slug: "rechtsberatung", title: "Rechtsberatung", short: "Rechtliche Fragen kompetent beurteilen lassen.", description: "Rechtsberatung für Privatpersonen und Unternehmen.", bullets: ["Privat & Unternehmen", "Verträge & Streitfälle", "Ersteinschätzung"], tags: ["Recht", "Anwalt", "Beratung"], icon: "⚖️", category: "Business & Beratung", leadPrice: 35, popular: true, seo: true, keywords: ["Rechtsberatung", "Anwalt", "Jurist"], questions: businessQuestions }),
  service({ slug: "fotograf", title: "Fotograf", short: "Professionelle Fotos für Events und Unternehmen.", description: "Fotografie für Hochzeiten, Firmenanlässe und Porträts.", bullets: ["Events & Hochzeiten", "Porträts & Business", "Produkte & Immobilien"], tags: ["Fotografie", "Event", "Business"], icon: "📸", category: "Events & Medien", leadPrice: 25, popular: true, seo: true, keywords: ["Fotograf", "Hochzeitsfotograf", "Business Fotograf"], questions: eventQuestions }),
  service({ slug: "videograf", title: "Videograf", short: "Professionelle Videos für Events und Werbung.", description: "Videoproduktion für Hochzeiten, Firmen und Social Media.", bullets: ["Eventvideo", "Werbevideo", "Social Media Content"], tags: ["Video", "Film", "Content"], icon: "🎥", category: "Events & Medien", leadPrice: 35, popular: true, seo: true, keywords: ["Videograf", "Videoproduktion", "Eventvideo"], questions: eventQuestions }),
  service({ slug: "dj", title: "DJ", short: "Musik und Stimmung für Events.", description: "Professionelle DJs für Hochzeiten, Partys und Firmenanlässe.", bullets: ["Hochzeiten & Partys", "Firmenanlässe", "Musik & Technik"], tags: ["DJ", "Musik", "Event"], icon: "🎧", category: "Events & Medien", leadPrice: 25, popular: true, seo: true, keywords: ["DJ", "Hochzeits DJ", "Party DJ"], questions: eventQuestions }),
  service({ slug: "eventplanung", title: "Eventplanung", short: "Events professionell planen und koordinieren.", description: "Unterstützung bei Planung und Durchführung von Veranstaltungen.", bullets: ["Planung & Koordination", "Privat & Business", "Komplette Organisation"], tags: ["Event", "Planung", "Organisation"], icon: "🎉", category: "Events & Medien", leadPrice: 35, popular: false, seo: true, keywords: ["Eventplanung", "Eventagentur", "Hochzeitsplanung"], questions: eventQuestions }),
  service({ slug: "nachhilfe", title: "Nachhilfe", short: "Individuelle Unterstützung für Schule und Studium.", description: "Nachhilfe für verschiedene Fächer und Schulstufen.", bullets: ["Verschiedene Fächer", "Einzelunterricht", "Prüfungsvorbereitung"], tags: ["Nachhilfe", "Schule", "Lernen"], icon: "📚", category: "Private Dienstleistungen", leadPrice: 20, popular: true, seo: true, keywords: ["Nachhilfe", "Mathe Nachhilfe", "Prüfungsvorbereitung"], questions: [{ key: "propertyType", label: "Schulstufe", type: "select", required: true, options: ["Primarschule", "Sekundarschule", "Gymnasium", "Berufsschule", "Studium", "Andere"] }, ...commonQuestions] }),
  service({ slug: "hundesitter", title: "Hundesitter", short: "Zuverlässige Betreuung für Hunde.", description: "Betreuung, Spaziergänge und Ferienbetreuung für Hunde.", bullets: ["Spaziergänge", "Tagesbetreuung", "Ferienbetreuung"], tags: ["Hund", "Betreuung", "Tier"], icon: "🐕", category: "Private Dienstleistungen", leadPrice: 20, popular: true, seo: true, keywords: ["Hundesitter", "Hundebetreuung", "Dogwalker"], questions: [{ key: "propertyType", label: "Art der Betreuung", type: "select", required: true, options: ["Spaziergang", "Tagesbetreuung", "Ferienbetreuung", "Übernachtung", "Andere"] }, ...commonQuestions] }),
  service({ slug: "babysitter", title: "Babysitter", short: "Vertrauensvolle Kinderbetreuung.", description: "Flexible Kinderbetreuung für einzelne oder regelmässige Einsätze.", bullets: ["Einmalig oder regelmässig", "Flexible Zeiten", "Vertrauensvolle Betreuung"], tags: ["Kinder", "Betreuung", "Familie"], icon: "👶", category: "Private Dienstleistungen", leadPrice: 20, popular: true, seo: true, keywords: ["Babysitter", "Kinderbetreuung", "Nanny"], questions: [{ key: "offersWanted", label: "Anzahl Kinder", type: "text", required: true }, ...commonQuestions] }),
  service({ slug: "personal-training", title: "Personal Training", short: "Individuelles Training für Fitness und Gesundheit.", description: "Persönliche Trainingsplanung für unterschiedliche Ziele.", bullets: ["Individueller Plan", "Kraft & Ausdauer", "Persönliche Betreuung"], tags: ["Fitness", "Training", "Coach"], icon: "🏋️", category: "Gesundheit & Fitness", leadPrice: 25, popular: true, seo: true, keywords: ["Personal Trainer", "Personal Training", "Fitness Coach"], questions: [{ key: "propertyType", label: "Trainingsziel", type: "select", required: true, options: ["Abnehmen", "Muskelaufbau", "Fitness", "Ausdauer", "Rehabilitation", "Andere"] }, ...commonQuestions] }),
  service({ slug: "ernaehrungsberatung", title: "Ernährungsberatung", short: "Individuelle Ernährung passend zu deinen Zielen.", description: "Ernährungsberatung für Alltag, Sport und Gesundheit.", bullets: ["Individuelle Beratung", "Alltag & Sport", "Nachhaltige Umsetzung"], tags: ["Ernährung", "Beratung", "Gesundheit"], icon: "🥗", category: "Gesundheit & Fitness", leadPrice: 25, popular: true, seo: true, keywords: ["Ernährungsberatung", "Ernährungsplan", "Abnehmen"], questions: [{ key: "propertyType", label: "Ziel", type: "select", required: true, options: ["Abnehmen", "Muskelaufbau", "Gesünder essen", "Sport", "Andere"] }, ...commonQuestions] }),
  service({ slug: "massage", title: "Massage", short: "Entspannung, Regeneration und Wohlbefinden.", description: "Massageangebote für Entspannung und Sport.", bullets: ["Entspannung", "Sport & Regeneration", "Flexible Termine"], tags: ["Massage", "Wellness", "Regeneration"], icon: "💆", category: "Gesundheit & Fitness", leadPrice: 20, popular: true, seo: true, keywords: ["Massage", "Sportmassage", "Entspannungsmassage"], questions: [{ key: "propertyType", label: "Art der Massage", type: "select", required: true, options: ["Entspannungsmassage", "Sportmassage", "Klassische Massage", "Noch offen"] }, ...commonQuestions] }),
];

export const serviceCategories: ServiceCategory[] = [
  "Reinigung & Haushalt",
  "Hauswartung & Immobilien",
  "Umzug & Transport",
  "Entsorgung & Räumung",
  "Garten & Umgebung",
  "Handwerk & Renovation",
  "Elektro & Technik",
  "Sanitär & Heizung",
  "Fahrzeuge",
  "Digital & Marketing",
  "Business & Beratung",
  "Events & Medien",
  "Private Dienstleistungen",
  "Gesundheit & Fitness",
];

export function getServiceBySlug(slug: string) {
  return services.find((item) => item.slug === slug);
}

export function getServiceByTitle(title: string) {
  const value = title.trim().toLowerCase();
  return services.find((item) => item.title.trim().toLowerCase() === value);
}

export function getPopularServices(limit?: number) {
  const result = services.filter((item) => item.popular);
  return typeof limit === "number" ? result.slice(0, limit) : result;
}

export function getServicesByCategory(category: ServiceCategory) {
  return services.filter((item) => item.category === category);
}

export function searchServices(query: string) {
  const value = query.trim().toLowerCase();
  if (!value) return services;

  return services.filter((item) =>
    [item.title, item.short, item.category, ...item.tags, ...item.keywords]
      .join(" ")
      .toLowerCase()
      .includes(value)
  );
}

export function getLeadPriceForService(serviceTitleOrSlug: string) {
  const value = serviceTitleOrSlug.trim().toLowerCase();
  const found = services.find(
    (item) => item.slug.toLowerCase() === value || item.title.toLowerCase() === value
  );
  return found?.leadPrice ?? 20;
}