export const services = [
  "reinigung",
  "umzugsreinigung",
  "hauswartung",
  "treppenhausreinigung",
  "bueroreinigung",
  "gartenpflege",
  "umzug",
  "transport",
  "entsorgung",
  "maler",
  "bodenleger",
  "elektriker",
  "sanitaer",
  "fensterreinigung",
  "baureinigung",
  "end-reinigung",
  "gebaeudereinigung",
  "winterdienst",
  "kellerraeumung",
  "moebeltransport",
  "wohnungsreinigung",
  "unterhaltsreinigung",
  "praxisreinigung",
  "fassadenreinigung",
  "heckenschnitt",
  "rasenpflege",
  "liegenschaftsunterhalt",
  "hausmeisterservice",
  "raeumung",
  "estrichraeumung",
  "hauswartfirma",
  "hauswartservice",
  "hauswartarbeiten",
  "gartenunterhalt",
  "baumschnitt",
  "entruempelung",
  "haushaltsaufloesung",
  "glasreinigung",
  "storenreinigung",
  "wintergartenreinigung",
  "kleintransport",
  "firmenumzug",
  "privatumzug",
  "dachreinigung",
  "dachwartung",
  "sanitaerservice",
  "heizungsservice",
  "elektroinstallationen",
  "elektroservice",
  "parkettlegen",
  "laminat-verlegen",
  "objektbetreuung",
  "bueroumzug",
  "lagerraeumung",
  "schneeraeumung",
  "salzdienst",
];

export const cities = [
  "zuerich",
  "winterthur",
  "uster",
  "dietikon",
  "wetzikon",
  "buelach",
  "horgen",
  "meilen",
  "schlieren",
  "duebendorf",
  "wallisellen",
  "opfikon",
  "kloten",
  "regensdorf",
  "adliswil",
  "kilchberg",
  "dietlikon",
  "volketswil",
  "maennedorf",
  "kuesnacht",
  "affoltern-am-albis",
  "aargau",
  "aarau",
  "baden",
  "brugg",
  "lenzburg",
  "wohlen",
  "zofingen",
  "rheinfelden",
  "wettingen",
  "spreitenbach",
  "muri",
  "suhr",
  "oftringen",
  "frick",
  "rohrdorferberg",
  "basel",
  "allschwil",
  "muttenz",
  "pratteln",
  "liestal",
  "reinach-bl",
  "bern",
  "thun",
  "biel",
  "langenthal",
  "burgdorf",
  "interlaken",
  "luzern",
  "emmen",
  "kriens",
  "horw",
  "sursee",
  "zug",
  "baar",
  "cham",
  "st-gallen",
  "wil",
  "gossau",
  "uzwil",
  "rapperswil",
  "chur",
  "domat-ems",
  "solothurn",
  "olten",
  "schaffhausen",
  "frauenfeld",
  "kreuzlingen",
  "arbon",
  "lausanne",
  "genf",
  "sion",
];

const labelMap: Record<string, string> = {
  zuerich: "Zürich",
  bueroreinigung: "Büroreinigung",
  sanitaer: "Sanitär",
  sanitaerservice: "Sanitärservice",
  duebendorf: "Dübendorf",
  buelach: "Bülach",
  gebaeudereinigung: "Gebäudereinigung",
  kellerraeumung: "Kellerräumung",
  moebeltransport: "Möbeltransport",
  wohnungsreinigung: "Wohnungsreinigung",
  unterhaltsreinigung: "Unterhaltsreinigung",
  praxisreinigung: "Praxisreinigung",
  fassadenreinigung: "Fassadenreinigung",
  heckenschnitt: "Heckenschnitt",
  rasenpflege: "Rasenpflege",
  liegenschaftsunterhalt: "Liegenschaftsunterhalt",
  hausmeisterservice: "Hausmeisterservice",
  raeumung: "Räumung",
  estrichraeumung: "Estrichräumung",
  hauswartfirma: "Hauswartfirma",
  hauswartservice: "Hauswartservice",
  hauswartarbeiten: "Hauswartarbeiten",
  gartenunterhalt: "Gartenunterhalt",
  baumschnitt: "Baumschnitt",
  entruempelung: "Entrümpelung",
  haushaltsaufloesung: "Haushaltsauflösung",
  glasreinigung: "Glasreinigung",
  storenreinigung: "Storenreinigung",
  wintergartenreinigung: "Wintergartenreinigung",
  kleintransport: "Kleintransport",
  firmenumzug: "Firmenumzug",
  privatumzug: "Privatumzug",
  dachreinigung: "Dachreinigung",
  dachwartung: "Dachwartung",
  heizungsservice: "Heizungsservice",
  elektroinstallationen: "Elektroinstallationen",
  elektroservice: "Elektroservice",
  parkettlegen: "Parkettlegen",
  "laminat-verlegen": "Laminat verlegen",
  objektbetreuung: "Objektbetreuung",
  bueroumzug: "Büroumzug",
  lagerraeumung: "Lagerräumung",
  schneeraeumung: "Schneeräumung",
  salzdienst: "Salzdienst",
  "st-gallen": "St. Gallen",
  "end-reinigung": "Endreinigung",
  "reinach-bl": "Reinach BL",
  "domat-ems": "Domat/Ems",
  "affoltern-am-albis": "Affoltern am Albis",
};

function capitalizeWord(word: string) {
  return word.charAt(0).toLocaleUpperCase("de-CH") + word.slice(1);
}

export function formatText(value: string) {
  if (labelMap[value]) return labelMap[value];

  return value
    .split("-")
    .map((part) => labelMap[part] || capitalizeWord(part))
    .join(" ");
}

export const serviceKeywords: Record<string, string[]> = {
  reinigung: ["Reinigungsfirma", "Wohnungsreinigung", "Unterhaltsreinigung", "Putzfirma", "Reinigungsservice"],
  umzugsreinigung: ["Endreinigung", "Wohnungsabgabe", "Abgabereinigung", "Umzugsreinigung mit Abnahmegarantie"],
  hauswartung: ["Hauswartfirma", "Hauswartservice", "Hauswartarbeiten", "Liegenschaftsunterhalt", "Gebäudeunterhalt", "Hauswart"],
  treppenhausreinigung: ["Treppenhausreinigung", "Treppenhaus", "Eingangsbereich", "Gemeinschaftsflächen"],
  bueroreinigung: ["Büroreinigung", "Praxisreinigung", "Gewerbereinigung", "Unterhaltsreinigung Büro"],
  gartenpflege: ["Gartenunterhalt", "Rasenpflege", "Hecken schneiden", "Gartenservice", "Gärtner"],
  umzug: ["Umzugsfirma", "Privatumzug", "Firmenumzug", "Zügelunternehmen", "Umzugshilfe"],
  transport: ["Kleintransport", "Möbeltransport", "Lieferung", "Transportservice"],
  entsorgung: ["Räumung", "Sperrgut", "Entrümpelung", "Haushaltsauflösung"],
  maler: ["Malerarbeiten", "Streichen", "Renovation", "Malerfirma"],
  bodenleger: ["Boden verlegen", "Parkett", "Vinylboden", "Laminat"],
  elektriker: ["Elektriker", "Elektroarbeiten", "Installation", "Reparatur"],
  sanitaer: ["Sanitär", "Sanitärservice", "Badumbau", "Wasserinstallation"],
  fensterreinigung: ["Fensterreinigung", "Fenster putzen", "Glasreinigung", "Storenreinigung"],
  baureinigung: ["Baustellenreinigung", "Bauschlussreinigung", "Baureinigung"],
  "end-reinigung": ["Endreinigung", "Übergabereinigung", "Wohnungsabgabe"],
  gebaeudereinigung: ["Gebäudereinigung", "Objektreinigung", "Unterhaltsreinigung"],
  winterdienst: ["Winterdienst", "Schneeräumung", "Salzen"],
  kellerraeumung: ["Kellerräumung", "Estrichräumung", "Entrümpelung"],
  moebeltransport: ["Möbeltransport", "Transporthilfe", "Zügeltransport"],
  wohnungsreinigung: ["Wohnungsreinigung", "Reinigungsfirma", "Putzfirma"],
  unterhaltsreinigung: ["Unterhaltsreinigung", "Regelmässige Reinigung", "Gebäudereinigung"],
  praxisreinigung: ["Praxisreinigung", "Medizinische Reinigung", "Hygienereinigung"],
  fassadenreinigung: ["Fassadenreinigung", "Aussenreinigung", "Gebäudereinigung"],
  heckenschnitt: ["Heckenschnitt", "Hecken schneiden", "Gartenpflege"],
  rasenpflege: ["Rasenpflege", "Rasen mähen", "Gartenunterhalt"],
  liegenschaftsunterhalt: ["Liegenschaftsunterhalt", "Hauswartung", "Gebäudeunterhalt"],
  hausmeisterservice: ["Hausmeisterservice", "Hauswartservice", "Objektbetreuung"],
  raeumung: ["Räumung", "Entrümpelung", "Entsorgung"],
  estrichraeumung: ["Estrichräumung", "Kellerräumung", "Entrümpelung"],
  hauswartfirma: ["Hauswartfirma", "Hauswartung", "Liegenschaftsunterhalt"],
  hauswartservice: ["Hauswartservice", "Hauswartung", "Gebäudeunterhalt"],
  hauswartarbeiten: ["Hauswartarbeiten", "Kontrollgänge", "Unterhaltsarbeiten"],
  gartenunterhalt: ["Gartenunterhalt", "Gartenpflege", "Rasenpflege"],
  baumschnitt: ["Baumschnitt", "Baumpflege", "Gartenpflege"],
  entruempelung: ["Entrümpelung", "Räumung", "Entsorgung"],
  haushaltsaufloesung: ["Haushaltsauflösung", "Räumung", "Entrümpelung"],
  glasreinigung: ["Glasreinigung", "Fensterreinigung", "Schaufensterreinigung"],
  storenreinigung: ["Storenreinigung", "Fensterreinigung", "Glasreinigung"],
  wintergartenreinigung: ["Wintergartenreinigung", "Glasreinigung", "Fensterreinigung"],
  kleintransport: ["Kleintransport", "Transportservice", "Lieferung"],
  firmenumzug: ["Firmenumzug", "Umzugsfirma", "Büroumzug"],
  privatumzug: ["Privatumzug", "Umzugsfirma", "Umzugshilfe"],
  dachreinigung: ["Dachreinigung", "Aussenreinigung", "Gebäudereinigung"],
  dachwartung: ["Dachwartung", "Dachunterhalt", "Kontrolle"],
  sanitaerservice: ["Sanitärservice", "Sanitär", "Reparatur"],
  heizungsservice: ["Heizungsservice", "Heizung", "Wartung"],
  elektroinstallationen: ["Elektroinstallationen", "Elektriker", "Elektroarbeiten"],
  elektroservice: ["Elektroservice", "Elektriker", "Reparatur"],
  parkettlegen: ["Parkett legen", "Bodenleger", "Parkett"],
  "laminat-verlegen": ["Laminat verlegen", "Bodenleger", "Boden verlegen"],
  objektbetreuung: ["Objektbetreuung", "Hauswartung", "Liegenschaftsservice"],
  bueroumzug: ["Büroumzug", "Firmenumzug", "Umzugsfirma"],
  lagerraeumung: ["Lagerräumung", "Räumung", "Entsorgung"],
  schneeraeumung: ["Schneeräumung", "Winterdienst", "Salzen"],
  salzdienst: ["Salzdienst", "Winterdienst", "Schneeräumung"],
};

export const cityContent: Record<string, string> = {
  zuerich: "Zürich ist der grösste Wirtschaftsstandort der Schweiz. Besonders gefragt sind Dienstleistungen für Wohnungen, Büros, Geschäftsräume, Verwaltungen und Liegenschaften.",
  winterthur: "Winterthur ist ein wichtiger Standort im Kanton Zürich mit vielen Privathaushalten, Unternehmen und Verwaltungen.",
  uster: "Uster gehört zu den grösseren Städten im Zürcher Oberland. Viele Kunden suchen hier regionale Anbieter für private und gewerbliche Aufträge.",
  dietikon: "Dietikon liegt zentral im Limmattal und ist stark mit Zürich und dem Aargau verbunden.",
  wetzikon: "Wetzikon ist ein wichtiger Ort im Zürcher Oberland. Lokale Anbieter sind besonders gefragt.",
  buelach: "Bülach ist ein regionales Zentrum im Zürcher Unterland. Viele Kunden suchen hier Anbieter für Wohnungen, Häuser und Gewerbeobjekte.",
  horgen: "Horgen am Zürichsee verbindet Wohnlagen, Unternehmen und Liegenschaften.",
  meilen: "Meilen liegt direkt am Zürichsee und hat eine starke Nachfrage nach Dienstleistungen für Privathaushalte und Liegenschaften.",
  schlieren: "Schlieren ist ein wachsender Standort im Limmattal mit vielen Wohnungen, Firmen und Neubauten.",
  duebendorf: "Dübendorf wächst seit Jahren stark. In der Region werden häufig Anbieter für Wohnungen, Häuser und Gewerberäume gesucht.",
  aargau: "Der Kanton Aargau verbindet viele Städte, Gemeinden und Wirtschaftsstandorte.",
  aarau: "Aarau ist ein wichtiger Standort im Aargau. Viele Kunden suchen hier Unterstützung für private und gewerbliche Aufträge.",
  baden: "Baden zählt zu den wichtigsten Wirtschaftsregionen im Aargau.",
  brugg: "Brugg ist ein regional bedeutender Standort im Aargau.",
  lenzburg: "Lenzburg liegt zentral im Aargau und ist für viele Dienstleistungsaufträge gut erreichbar.",
  wohlen: "Wohlen ist ein wichtiger Ort im Freiamt.",
  zofingen: "Zofingen ist ein wichtiger Standort für regionale Dienstleistungen im Aargau.",
  rheinfelden: "Rheinfelden ist eine wichtige Stadt am Rhein mit vielen privaten und gewerblichen Anfragen.",
  wettingen: "Wettingen gehört zu den grösseren Gemeinden im Aargau.",
  spreitenbach: "Spreitenbach liegt im Limmattal und hat viele Wohn- und Gewerbeflächen.",
  basel: "Basel ist ein bedeutender Wirtschaftsstandort mit hoher Nachfrage nach Dienstleistungen für Wohnungen und Firmen.",
  bern: "Bern ist als Hauptstadt und Wirtschaftsstandort ein wichtiger Markt für regionale Dienstleistungen.",
  luzern: "Luzern verbindet Wohngebiete, Tourismus und Gewerbe.",
  zug: "Zug ist ein starker Wirtschaftsstandort mit hoher Nachfrage nach Dienstleistungen für Firmen und Wohnungen.",
  "st-gallen": "St. Gallen ist ein wichtiges Zentrum in der Ostschweiz.",
  chur: "Chur ist das Zentrum Graubündens.",
  solothurn: "Solothurn ist ein regionaler Standort mit vielen privaten und gewerblichen Dienstleistungsanfragen.",
  schaffhausen: "Schaffhausen hat eine starke regionale Struktur.",
  thun: "Thun ist ein wichtiger Standort im Berner Oberland.",
  biel: "Biel ist ein zweisprachiger Wirtschaftsstandort mit vielen Dienstleistungsanfragen.",
  lausanne: "Lausanne ist ein wichtiger Standort in der Westschweiz.",
  genf: "Genf ist ein internationaler Standort mit vielen privaten und gewerblichen Dienstleistungsanfragen.",
  sion: "Sion ist ein wichtiger Standort im Wallis.",
  frauenfeld: "Frauenfeld ist ein wichtiger Standort im Thurgau.",
  kreuzlingen: "Kreuzlingen liegt direkt am Bodensee und ist ein wichtiger regionaler Standort.",
};

export const serviceContent: Record<string, string> = Object.fromEntries(
  services.map((service) => [
    service,
    `${formatText(service)} ist eine gefragte Dienstleistung in der Schweiz. Über Auftrago kannst du passende regionale Anbieter finden, kostenlos eine Anfrage senden und verschiedene Offerten vergleichen.`,
  ])
);

export function generateSlugs() {
  return services.flatMap((service) =>
    cities.map((city) => `${service}-${city}`)
  );
}

export function getSeoData(slug: string) {
  const matchedCity = cities.find((city) => slug.endsWith(`-${city}`));

  if (!matchedCity) {
    const fallbackService = "reinigung";
    const fallbackCity = "zuerich";

    return {
      service: fallbackService,
      city: fallbackCity,
      serviceLabel: formatText(fallbackService),
      cityLabel: formatText(fallbackCity),
      keywords: serviceKeywords[fallbackService],
    };
  }

  const service = slug.replace(`-${matchedCity}`, "");
  const city = matchedCity;

  return {
    service,
    city,
    serviceLabel: formatText(service),
    cityLabel: formatText(city),
    keywords: serviceKeywords[service] || [formatText(service)],
  };
}

export const serviceFaqs: Record<
  string,
  {
    question: string;
    answer: string;
  }[]
> = Object.fromEntries(
  services.map((service) => {
    const label = formatText(service);

    return [
      service,
      [
        {
          question: `Was kostet ${label}?`,
          answer:
            "Die Kosten hängen von Region, Umfang, Objektgrösse, Aufwand und gewünschtem Termin ab.",
        },
        {
          question: `Wie finde ich Anbieter für ${label}?`,
          answer:
            "Über Auftrago kannst du kostenlos eine Anfrage senden und passende regionale Anbieter vergleichen.",
        },
        {
          question: "Ist die Anfrage kostenlos?",
          answer:
            "Ja. Die Anfrage über Auftrago ist kostenlos und unverbindlich.",
        },
      ],
    ];
  })
);