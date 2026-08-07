export type ServiceKnowledge = {
  duration: string;
  seasonality: string[];
  targetGroups: string[];
  commonProblems: string[];
  qualityFactors: string[];
  materials: string[];
  tools: string[];
  legalNotes: string[];
  advantages: string[];
  keywords: string[];
  processSteps: string[];
  commonMistakes: string[];
  customerQuestions: string[];
};

export const serviceKnowledge: Record<string, ServiceKnowledge> = {
  reinigung: {
    duration:
      "Die Dauer hängt von Fläche, Verschmutzung, Leistungsumfang und Anzahl der eingesetzten Reinigungskräfte ab.",

    seasonality: [
      "ganzjährig",
      "Frühlingsreinigung",
      "Herbstreinigung",
      "Reinigung vor oder nach besonderen Anlässen",
    ],

    targetGroups: [
      "Privathaushalte",
      "Mieterinnen und Mieter",
      "Eigentümer",
      "Verwaltungen",
      "Büros",
      "Gewerbebetriebe",
    ],

    commonProblems: [
      "starke Verschmutzungen",
      "Kalkablagerungen",
      "Fett und Küchenrückstände",
      "Staub in schwer erreichbaren Bereichen",
      "verschmutzte Sanitärbereiche",
      "unterschiedliche Oberflächen und Materialien",
    ],

    qualityFactors: [
      "klar definierter Leistungsumfang",
      "geeignete Reinigungsmittel für die jeweilige Oberfläche",
      "saubere Kanten und schwer erreichbare Bereiche",
      "streifenfreie Glas- und Spiegelflächen",
      "systematische Qualitätskontrolle",
    ],

    materials: [
      "Neutralreiniger",
      "Sanitärreiniger",
      "Glasreiniger",
      "Entkalker",
      "Mikrofasertücher",
      "geeignete materialschonende Spezialreiniger",
    ],

    tools: [
      "Staubsauger",
      "Mopp-System",
      "Mikrofasertücher",
      "Fensterwischer",
      "Eimer",
      "Reinigungsbürsten",
    ],

    legalNotes: [
      "Bei empfindlichen Materialien sollten Pflege- und Herstellerhinweise berücksichtigt werden.",
      "Leistungsumfang und allfällige Zusatzarbeiten sollten vor Auftragserteilung eindeutig vereinbart werden.",
    ],

    advantages: [
      "Zeitersparnis",
      "professionelle Arbeitsmittel",
      "klar planbarer Leistungsumfang",
      "regelmässige Reinigung möglich",
      "regionale Anbieter können verglichen werden",
    ],

    keywords: [
      "Reinigungsfirma",
      "Reinigungsservice",
      "Wohnungsreinigung",
      "Büroreinigung",
      "Gebäudereinigung",
      "professionelle Reinigung",
    ],

    processSteps: [
      "Objekt und gewünschte Arbeiten beschreiben",
      "Fläche und relevante Räume angeben",
      "Zusatzleistungen definieren",
      "Offerten vergleichen",
      "Termin und Zugang klären",
      "Arbeiten durchführen und Ergebnis kontrollieren",
    ],

    commonMistakes: [
      "Leistungsumfang zu ungenau beschreiben",
      "Fenster oder Storen nicht separat erwähnen",
      "starke Verschmutzungen nicht angeben",
      "Zugangssituation erst am Einsatztag klären",
    ],

    customerQuestions: [
      "Welche Räume sollen gereinigt werden?",
      "Wie gross ist die zu reinigende Fläche?",
      "Sind Fenster oder Storen Bestandteil des Auftrags?",
      "Gibt es besonders stark verschmutzte Bereiche?",
    ],
  },

  umzugsreinigung: {
    duration:
      "Eine Umzugsreinigung dauert je nach Wohnungsgrösse, Zustand und Umfang häufig mehrere Stunden bis einen ganzen Arbeitstag.",

    seasonality: [
      "ganzjährig",
      "besonders häufig rund um Monats- und Quartalswechsel",
      "starke Nachfrage zu klassischen Umzugsterminen",
    ],

    targetGroups: [
      "Mieterinnen und Mieter",
      "Wohnungseigentümer",
      "Verwaltungen",
      "Immobiliengesellschaften",
      "Privathaushalte",
    ],

    commonProblems: [
      "Kalk in Bad und Küche",
      "verschmutzte Backöfen",
      "Fettablagerungen",
      "Fenster und Rahmen",
      "Lamellenstoren",
      "verschmutzte Schränke",
      "schwer erreichbare Bereiche",
      "Beanstandungen bei der Wohnungsabgabe",
    ],

    qualityFactors: [
      "vollständige Reinigung aller vereinbarten Bereiche",
      "saubere Küche inklusive Geräte",
      "gründliche Sanitärreinigung",
      "Fenster, Rahmen und Storen gemäss Auftrag",
      "Kontrolle vor der Wohnungsübergabe",
      "klar geregelte Abgabegarantie, falls angeboten",
    ],

    materials: [
      "Entkalker",
      "Fettlöser",
      "Glasreiniger",
      "Neutralreiniger",
      "Sanitärreiniger",
      "materialgerechte Spezialreiniger",
    ],

    tools: [
      "Staubsauger",
      "Mopp-System",
      "Fensterwischer",
      "Reinigungsschaber für geeignete Oberflächen",
      "Bürsten",
      "Mikrofasertücher",
    ],

    legalNotes: [
      "Eine Abgabegarantie sollte in der Offerte klar beschrieben sein.",
      "Die Anforderungen der Verwaltung oder Vermieterschaft sollten vor der Reinigung berücksichtigt werden.",
      "Normale Gebrauchsspuren sind von reinigungsbedingten Mängeln zu unterscheiden.",
    ],

    advantages: [
      "weniger Aufwand vor der Wohnungsübergabe",
      "professionelle Endreinigung",
      "bessere Vorbereitung auf die Abnahme",
      "optionale Abgabegarantie",
      "klar kalkulierbarer Auftrag",
    ],

    keywords: [
      "Umzugsreinigung",
      "Endreinigung",
      "Wohnungsreinigung mit Abgabegarantie",
      "Abgabereinigung",
      "Wohnungsabgabe Reinigung",
      "Endreinigung Wohnung",
    ],

    processSteps: [
      "Zimmerzahl und Wohnfläche angeben",
      "Fenster und Storen erfassen",
      "besondere Verschmutzungen nennen",
      "Übergabetermin mitteilen",
      "Abgabegarantie bei Bedarf anfragen",
      "Offerten vergleichen",
      "Reinigung durchführen",
      "Wohnung kontrollieren",
    ],

    commonMistakes: [
      "Balkon, Keller oder Nebenräume vergessen",
      "Storen nicht im Leistungsumfang erwähnen",
      "Übergabetermin zu knapp planen",
      "Abgabegarantie voraussetzen, ohne sie zu vereinbaren",
      "starke Kalk- oder Fettablagerungen nicht melden",
    ],

    customerQuestions: [
      "Wie viele Zimmer hat die Wohnung?",
      "Wie gross ist die Wohnfläche?",
      "Wie viele Fenster und Storen gibt es?",
      "Wird eine Abgabegarantie benötigt?",
      "Wann findet die Wohnungsübergabe statt?",
    ],
  },

  fensterreinigung: {
    duration:
      "Die Dauer richtet sich vor allem nach Anzahl, Grösse und Zugänglichkeit der Fenster sowie nach Rahmen, Storen und weiteren Glasflächen.",

    seasonality: [
      "ganzjährig",
      "besonders gefragt im Frühling",
      "häufig vor oder nach der Wintersaison",
    ],

    targetGroups: [
      "Privathaushalte",
      "Eigentümer",
      "Büros",
      "Verwaltungen",
      "Gewerbebetriebe",
      "Liegenschaften",
    ],

    commonProblems: [
      "Streifen auf Glasflächen",
      "verschmutzte Rahmen",
      "Insektenrückstände",
      "schwer erreichbare Fenster",
      "Lamellenstoren",
      "Wintergärten",
      "grössere Glasfassaden",
    ],

    qualityFactors: [
      "streifenfreie Glasflächen",
      "saubere Rahmen",
      "geeignete Reinigung der Storen",
      "sichere Erreichbarkeit",
      "passende Technik für Glasart und Verschmutzung",
    ],

    materials: [
      "Glasreiniger",
      "Wasser",
      "geeignete Rahmenreiniger",
      "Mikrofasertücher",
      "materialgerechte Spezialreiniger",
    ],

    tools: [
      "Fensterwischer",
      "Einwascher",
      "Mikrofasertücher",
      "Teleskopstange",
      "Leiter bei geeigneten Bedingungen",
      "professionelle Glasreinigungsgeräte",
    ],

    legalNotes: [
      "Bei Arbeiten in grosser Höhe müssen geeignete Sicherheitsmassnahmen eingeplant werden.",
      "Bei empfindlichem oder beschichtetem Glas sollten Herstellerhinweise berücksichtigt werden.",
    ],

    advantages: [
      "streifenfreie Fenster",
      "Zeitersparnis",
      "professionelle Ausrüstung",
      "Rahmen und Storen kombinierbar",
      "schwer erreichbare Fenster können professionell beurteilt werden",
    ],

    keywords: [
      "Fensterreinigung",
      "Fenster putzen lassen",
      "Glasreinigung",
      "Fensterreinigungsfirma",
      "Storenreinigung",
      "Wintergarten Reinigung",
    ],

    processSteps: [
      "Anzahl und Grösse der Fenster erfassen",
      "Rahmen und Storen definieren",
      "Zugänglichkeit beschreiben",
      "besondere Glasflächen nennen",
      "Offerten vergleichen",
      "Termin vereinbaren",
    ],

    commonMistakes: [
      "nur Fensterzahl statt Fenstergrösse angeben",
      "Rahmen und Storen nicht erwähnen",
      "schwer erreichbare Fenster verschweigen",
      "Wintergarten oder Glasdach nicht separat aufführen",
    ],

    customerQuestions: [
      "Wie viele Fenster sollen gereinigt werden?",
      "Sollen Rahmen ebenfalls gereinigt werden?",
      "Sind Storen vorhanden?",
      "Gibt es schwer erreichbare Fenster oder Glasdächer?",
    ],
  },

  hauswartung: {
    duration:
      "Hauswartung ist typischerweise eine wiederkehrende Dienstleistung. Umfang und Einsatzhäufigkeit richten sich nach Grösse und Nutzung der Liegenschaft.",

    seasonality: [
      "ganzjährig",
      "Winterdienst in der kalten Jahreszeit",
      "Garten- und Umgebungspflege im Frühling und Sommer",
    ],

    targetGroups: [
      "Liegenschaftsverwaltungen",
      "Stockwerkeigentümergemeinschaften",
      "Eigentümer",
      "Mehrfamilienhäuser",
      "Gewerbeliegenschaften",
      "Unternehmen",
    ],

    commonProblems: [
      "unregelmässige Kontrollen",
      "verschmutzte Allgemeinflächen",
      "kleine technische Defekte",
      "unklare Zuständigkeiten",
      "Pflege der Umgebung",
      "Winterdienst",
      "Meldung von Schäden",
    ],

    qualityFactors: [
      "klare Kontrollintervalle",
      "definierter Leistungskatalog",
      "verlässliche Erreichbarkeit",
      "Dokumentation von Feststellungen",
      "rasche Meldung von Schäden",
      "saubere Allgemeinflächen",
    ],

    materials: [
      "Reinigungsmittel für Allgemeinflächen",
      "Verbrauchsmaterial",
      "Streumittel je nach Auftrag",
      "Pflegematerial für Aussenbereiche",
    ],

    tools: [
      "Reinigungsgeräte",
      "Kontroll- und Dokumentationsmittel",
      "Werkzeuge für kleinere Arbeiten",
      "Geräte für Umgebungspflege",
      "Winterdienstgeräte",
    ],

    legalNotes: [
      "Verantwortlichkeiten für technische Arbeiten und sicherheitsrelevante Aufgaben sollten klar definiert sein.",
      "Spezialisierte Facharbeiten sollten durch entsprechend qualifizierte Betriebe ausgeführt werden.",
    ],

    advantages: [
      "zentraler Ansprechpartner für die Liegenschaft",
      "regelmässige Kontrollen",
      "gepflegte Allgemeinflächen",
      "frühzeitige Erkennung von Problemen",
      "planbare wiederkehrende Leistungen",
    ],

    keywords: [
      "Hauswartung",
      "Hauswartungsfirma",
      "Hauswartungsservice",
      "Liegenschaftsunterhalt",
      "Hauswart",
      "Facility Service",
    ],

    processSteps: [
      "Liegenschaft und Einheiten erfassen",
      "Leistungskatalog definieren",
      "Kontrollintervalle festlegen",
      "Aussenbereiche und Winterdienst klären",
      "Offerten vergleichen",
      "Zuständigkeiten dokumentieren",
    ],

    commonMistakes: [
      "Leistungsumfang nur pauschal beschreiben",
      "Winterdienst nicht separat regeln",
      "Pikettdienst voraussetzen",
      "Kontrollintervalle nicht festlegen",
      "Material- und Entsorgungskosten nicht klären",
    ],

    customerQuestions: [
      "Wie gross ist die Liegenschaft?",
      "Wie viele Einheiten gibt es?",
      "Welche wiederkehrenden Arbeiten werden benötigt?",
      "Ist Winterdienst Bestandteil des Auftrags?",
      "Wird ein Pikettdienst benötigt?",
    ],
  },

  gartenpflege: {
    duration:
      "Die Einsatzdauer hängt von Grundstücksgrösse, Bepflanzung, Saison und den gewünschten Gartenarbeiten ab.",

    seasonality: [
      "Frühling",
      "Sommer",
      "Herbst",
      "Winterschnitt je nach Pflanzenart",
    ],

    targetGroups: [
      "Privathaushalte",
      "Eigentümer",
      "Verwaltungen",
      "Wohnanlagen",
      "Gewerbeliegenschaften",
    ],

    commonProblems: [
      "überwachsene Hecken",
      "ungepflegte Rasenflächen",
      "Unkraut",
      "Laub",
      "verwilderte Beete",
      "Grüngutentsorgung",
    ],

    qualityFactors: [
      "fachgerechter Schnitt",
      "saisonale Planung",
      "saubere Arbeitsbereiche",
      "geeignete Pflege der Pflanzen",
      "klare Regelung der Grüngutentsorgung",
    ],

    materials: [
      "Dünger bei Bedarf",
      "Erde und Substrate",
      "Mulch",
      "Saatgut",
      "Pflanzenmaterial",
    ],

    tools: [
      "Rasenmäher",
      "Heckenschere",
      "Freischneider",
      "Laubbläser oder Rechen",
      "Gartenschere",
      "Handwerkzeuge",
    ],

    legalNotes: [
      "Bei starken Rückschnitten und Arbeiten an geschützten Pflanzen können lokale Vorgaben relevant sein.",
      "Pflanzenschutzmittel sollten nur fachgerecht und gemäss geltenden Vorgaben eingesetzt werden.",
    ],

    advantages: [
      "gepflegte Aussenflächen",
      "regelmässige saisonale Pflege",
      "professionelle Geräte",
      "Grüngutentsorgung kombinierbar",
      "Werterhalt der Umgebung",
    ],

    keywords: [
      "Gartenpflege",
      "Gartenunterhalt",
      "Gärtner",
      "Rasenpflege",
      "Heckenschnitt",
      "Gartenservice",
    ],

    processSteps: [
      "Fläche beschreiben",
      "gewünschte Gartenarbeiten definieren",
      "Fotos bereitstellen",
      "Entsorgung des Grünguts klären",
      "einmalige oder regelmässige Pflege festlegen",
      "Offerten vergleichen",
    ],

    commonMistakes: [
      "Fläche nicht angeben",
      "Pflanzen und Hecken nicht beschreiben",
      "Grüngutentsorgung nicht klären",
      "regelmässige Pflege mit einmaligem Einsatz verwechseln",
    ],

    customerQuestions: [
      "Wie gross ist die Gartenfläche?",
      "Welche Arbeiten sollen ausgeführt werden?",
      "Wie lang und hoch sind vorhandene Hecken?",
      "Soll Grüngut entsorgt werden?",
      "Ist ein einmaliger oder regelmässiger Einsatz gewünscht?",
    ],
  },

  umzug: {
    duration:
      "Die Dauer eines Umzugs richtet sich nach Menge des Umzugsguts, Distanz, Etagen, Lift, Zufahrt und Anzahl der eingesetzten Personen.",

    seasonality: [
      "ganzjährig",
      "erhöhte Nachfrage an Monatsenden",
      "erhöhte Nachfrage während klassischer Umzugsperioden",
    ],

    targetGroups: [
      "Privathaushalte",
      "Familien",
      "Unternehmen",
      "Büros",
      "Seniorinnen und Senioren",
    ],

    commonProblems: [
      "zu wenig Personal",
      "fehlende Haltezone",
      "kein Lift",
      "schwere Möbel",
      "unzureichende Verpackung",
      "Demontage und Montage",
      "lange Transportwege",
    ],

    qualityFactors: [
      "realistische Aufwandsschätzung",
      "geeignetes Fahrzeug",
      "ausreichend Personal",
      "sorgfältiger Möbeltransport",
      "klare Regelung von Montagearbeiten",
      "transparente Zusatzkosten",
    ],

    materials: [
      "Umzugskartons",
      "Schutzdecken",
      "Stretchfolie",
      "Klebeband",
      "Kantenschutz",
    ],

    tools: [
      "Transportfahrzeug",
      "Sackkarre",
      "Rollwagen",
      "Tragegurte",
      "Montagewerkzeug",
    ],

    legalNotes: [
      "Halteverbots- oder Parkplatzregelungen sollten rechtzeitig geprüft werden.",
      "Versicherungsumfang und Haftung sollten vor Auftragserteilung geklärt werden.",
    ],

    advantages: [
      "weniger körperliche Belastung",
      "professioneller Transport",
      "Montageleistungen kombinierbar",
      "bessere Terminplanung",
      "geeignete Transportmittel",
    ],

    keywords: [
      "Umzugsfirma",
      "Umzug",
      "Umzugsunternehmen",
      "Privatumzug",
      "Firmenumzug",
      "Möbeltransport",
    ],

    processSteps: [
      "Start- und Zieladresse angeben",
      "Umzugsgut beschreiben",
      "Etagen und Lift erfassen",
      "Park- und Zufahrtssituation klären",
      "Montagearbeiten definieren",
      "Offerten vergleichen",
      "Umzugstermin bestätigen",
    ],

    commonMistakes: [
      "Menge des Umzugsguts unterschätzen",
      "Etagen oder fehlenden Lift nicht erwähnen",
      "lange Laufwege nicht angeben",
      "Montagearbeiten nicht separat definieren",
      "Parkplatzsituation zu spät klären",
    ],

    customerQuestions: [
      "Von wo nach wo findet der Umzug statt?",
      "Wie gross ist der Haushalt?",
      "Gibt es an beiden Adressen einen Lift?",
      "Müssen Möbel demontiert oder montiert werden?",
      "Gibt es schwere oder besonders empfindliche Gegenstände?",
    ],
  },

  entsorgung: {
    duration:
      "Die Dauer hängt von Menge, Materialart, Zugänglichkeit, Transportweg und Entsorgungsstelle ab.",

    seasonality: [
      "ganzjährig",
      "häufig bei Umzügen",
      "häufig bei Räumungen und Renovationen",
    ],

    targetGroups: [
      "Privathaushalte",
      "Mieter",
      "Eigentümer",
      "Verwaltungen",
      "Unternehmen",
    ],

    commonProblems: [
      "grosse Mengen Sperrgut",
      "schwere Gegenstände",
      "fehlender Lift",
      "lange Transportwege",
      "Sonderabfälle",
      "Trennung verschiedener Materialarten",
    ],

    qualityFactors: [
      "korrekte Materialtrennung",
      "saubere Räumung",
      "transparente Entsorgungskosten",
      "geeignete Fahrzeuge",
      "korrekter Umgang mit Sonderabfällen",
    ],

    materials: [
      "Schutzmaterial",
      "Abfallsäcke",
      "Behälter je nach Material",
      "Verpackungsmaterial",
    ],

    tools: [
      "Transportfahrzeug",
      "Rollwagen",
      "Sackkarre",
      "Tragehilfen",
      "Werkzeug für Demontage",
    ],

    legalNotes: [
      "Sonderabfälle dürfen nicht wie gewöhnlicher Hausrat entsorgt werden.",
      "Entsorgung muss gemäss den jeweils geltenden lokalen und kantonalen Vorgaben erfolgen.",
    ],

    advantages: [
      "Zeitersparnis",
      "fachgerechter Abtransport",
      "Materialtrennung",
      "Transport und Entsorgung aus einer Hand",
      "Räumung mit weiteren Dienstleistungen kombinierbar",
    ],

    keywords: [
      "Entsorgung",
      "Räumung",
      "Sperrgut entsorgen",
      "Wohnungsräumung",
      "Entrümpelung",
      "Abtransport",
    ],

    processSteps: [
      "Gegenstände fotografieren oder beschreiben",
      "ungefähre Menge angeben",
      "Etagen und Lift nennen",
      "Zufahrtssituation beschreiben",
      "Sonderabfälle separat aufführen",
      "Offerten vergleichen",
    ],

    commonMistakes: [
      "Entsorgungskosten nicht getrennt berücksichtigen",
      "Sonderabfälle nicht erwähnen",
      "Etagen und fehlenden Lift nicht angeben",
      "Menge zu knapp schätzen",
    ],

    customerQuestions: [
      "Welche Gegenstände müssen entsorgt werden?",
      "Wie gross ist die ungefähre Menge?",
      "Auf welcher Etage befinden sich die Gegenstände?",
      "Ist ein Lift vorhanden?",
      "Sind Sonderabfälle enthalten?",
    ],
  },
};

export function getServiceKnowledge(
  slug: string,
): ServiceKnowledge | undefined {
  return serviceKnowledge[slug];
}
