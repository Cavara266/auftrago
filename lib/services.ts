export type Service = {
  slug: string;
  title: string;
  short: string;
  description: string;
  bullets: string[];
  tags: string[];
};

export const services: Service[] = [
  {
    slug: "hauswartung",
    title: "Hauswartung",
    short: "Zuverlässige Betreuung von Liegenschaften – sauber, gepflegt, professionell.",
    description:
      "Wir übernehmen die laufende Betreuung Ihrer Liegenschaft: Kontrollgänge, kleinere Instandhaltungen, Koordination von Handwerkern sowie schnelle Reaktion bei Problemen.\n\nIdeal für Verwaltungen, Eigentümer und Gewerbe – mit klarer Kommunikation und sauberer Dokumentation.",
    bullets: ["Kontrollgänge & Unterhalt", "Koordination & Kleinreparaturen", "Zuverlässig & seriös"],
    tags: ["Liegenschaft", "Kontrollgänge", "Koordination"],
  },
  {
    slug: "reinigung",
    title: "Reinigung",
    short: "Gründliche Reinigung für Wohnungen, Büros & Liegenschaften – flexibel & zuverlässig.",
    description:
      "Sauberkeit, die man sieht. Von Unterhaltsreinigung bis intensive Einsätze – wir bringen Struktur, klare Abläufe und konstanten Qualitätsstandard.\n\nPerfekt für Verwaltungen, Büros, Privathaushalte und wiederkehrende Aufgaben.",
    bullets: ["Unterhalts- & Grundreinigung", "Büro & Privat", "Sauberer Eindruck"],
    tags: ["Unterhalt", "Grundreinigung", "Büro"],
  },
  {
    slug: "wohnungsreinigung",
    title: "Wohnungsreinigung",
    short: "Professionell, gründlich – ideal für Alltag, Mieterwechsel oder intensive Reinigung.",
    description:
      "Ob einmalig oder regelmässig: Wir reinigen strukturiert und effizient. Auf Wunsch mit Abnahme-Check / Übergabe-Vorbereitung.\n\nDu definierst den Umfang – wir kümmern uns um den Rest.",
    bullets: ["Gründlich & strukturiert", "Optional Abnahme-Check", "Zuverlässige Termine"],
    tags: ["Wohnung", "Übergabe", "Abnahme"],
  },
  {
    slug: "fensterreinigung",
    title: "Fensterreinigung",
    short: "Streifenfreier Glanz – Fensterreinigung für Wohnungen, Häuser und Gewerbe.",
    description:
      "Klarer Durchblick: Rahmen, Glas und Details – sauber bis in die Ecken.\n\nFür Privat und Gewerbe, einzeln oder als regelmässiger Turnus.",
    bullets: ["Streifenfrei", "Rahmen & Details", "Gewerbe & Privat"],
    tags: ["Glas", "Rahmen", "Turnus"],
  },
  {
    slug: "baureinigung",
    title: "Baureinigung",
    short: "Sauberer Abschluss nach Bau/Umzug – bereit für Übergabe oder Einzug.",
    description:
      "Bau- und Grobschmutz weg: Wir sorgen dafür, dass Flächen, Böden und Sanitär wieder vorzeigbar sind.\n\nIdeal vor Abnahmen, Übergaben und Eröffnungen.",
    bullets: ["Grob- & Feinreinigung", "Vor Übergabe", "Zügig & planbar"],
    tags: ["Bau", "Übergabe", "Finish"],
  },
  {
    slug: "winterdienst",
    title: "Winterdienst",
    short: "Sicherheit im Winter – Räumen, Streuen, planbare Einsätze.",
    description:
      "Schnee & Eis? Wir halten Wege, Zugänge und Parkflächen sicher. Planbar mit Pikett/Turnus – je nach Objekt und Bedarf.",
    bullets: ["Räumen & Streuen", "Planbar (Turnus/Pikett)", "Sicher & schnell"],
    tags: ["Schnee", "Eis", "Sicherheit"],
  },
  {
    slug: "gartenpflege",
    title: "Gartenpflege",
    short: "Gartenpflege & Unterhalt – gepflegter Eindruck rund ums Haus, das ganze Jahr.",
    description:
      "Rasen, Schnitt, Hecken, Beete: Wir halten Aussenanlagen sauber, ordentlich und attraktiv.\n\nIdeal für Verwaltungen, MFH/EFH und Gewerbeobjekte – als Turnus oder einmalig.",
    bullets: ["Schnitt & Pflege", "Turnus oder einmalig", "Sauberer Aussenauftritt"],
    tags: ["Aussenbereich", "Pflege", "Turnus"],
  },
  {
    slug: "umzug",
    title: "Umzug",
    short: "Stressfrei umziehen: Planung, Transport und sorgfältiger Umgang mit Inventar.",
    description:
      "Schnell, sauber, organisiert: Wir koordinieren den Ablauf, schützen Inventar und sorgen für reibungslose Übergänge.\n\nOptional mit Reinigung/Entsorgung kombinierbar.",
    bullets: ["Sorgfältig & effizient", "Planung & Transport", "Optional Reinigung/Entsorgung"],
    tags: ["Transport", "Planung", "Organisation"],
  },
  {
    slug: "entsorgung",
    title: "Entsorgung",
    short: "Fachgerechte Entsorgung von Sperrgut, Altgeräten und Abfällen – schnell & sauber.",
    description:
      "Wir holen ab, sortieren sauber und entsorgen korrekt. Transparent, zuverlässig und ohne Chaos.\n\nIdeal nach Umzug, Räumung oder Renovation.",
    bullets: ["Sperrgut & Altgeräte", "Sauber & korrekt", "Schnell organisiert"],
    tags: ["Sperrgut", "Altgeräte", "Abfall"],
  },
  {
    slug: "entruempelung",
    title: "Entrümpelung",
    short: "Wohnung, Keller, Büro – komplett räumen, abtransportieren, entsorgen.",
    description:
      "Von einzelnen Räumen bis komplette Objekte: Wir räumen strukturiert, zügig und diskret.\n\nAuf Wunsch inkl. Endreinigung.",
    bullets: ["Wohnung/Keller/Büro", "Diskret & zügig", "Optional Endreinigung"],
    tags: ["Räumung", "Diskret", "Komplett"],
  },
  {
    slug: "kleinreparaturen",
    title: "Kleinreparaturen",
    short: "Kleine Probleme schnell gelöst – sauber, zuverlässig, unkompliziert.",
    description:
      "Lockere Griffe, defekte Kleinteile, kleinere Arbeiten: Wir erledigen es sauber und dokumentiert.\n\nIdeal für Verwaltungen und laufenden Unterhalt.",
    bullets: ["Schnelle Erledigung", "Saubere Ausführung", "Dokumentiert"],
    tags: ["Unterhalt", "Fix", "Verwaltung"],
  },
];