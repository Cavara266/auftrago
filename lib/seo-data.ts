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
  "basel",
  "bern",
  "luzern",
  "zug",
  "st-gallen",
  "chur",
  "solothurn",
  "schaffhausen",
  "thun",
  "biel",
  "lausanne",
  "genf",
  "sion",
  "frauenfeld",
  "kreuzlingen",
];

export const serviceKeywords: Record<string, string[]> = {
  reinigung: ["Reinigungsfirma", "Wohnungsreinigung", "Unterhaltsreinigung"],
  umzugsreinigung: ["Endreinigung", "Wohnungsabgabe", "Abgabereinigung"],
  hauswartung: ["Liegenschaftsservice", "Gebäudeunterhalt", "Hauswart"],
  treppenhausreinigung: ["Treppenhaus", "Eingangsbereich", "Gemeinschaftsflächen"],
  bueroreinigung: ["Büroreinigung", "Praxisreinigung", "Gewerbereinigung"],
  gartenpflege: ["Gartenunterhalt", "Rasenpflege", "Hecken schneiden"],
  umzug: ["Umzugsfirma", "Privatumzug", "Firmenumzug"],
  transport: ["Kleintransport", "Möbeltransport", "Lieferung"],
  entsorgung: ["Räumung", "Sperrgut", "Entrümpelung"],
  maler: ["Malerarbeiten", "Streichen", "Renovation"],
  bodenleger: ["Boden verlegen", "Parkett", "Vinylboden"],
  elektriker: ["Elektroarbeiten", "Installation", "Reparatur"],
  sanitaer: ["Sanitär", "Bad", "Wasserinstallation"],
  fensterreinigung: ["Fenster putzen", "Glasreinigung", "Schaufensterreinigung"],
  baureinigung: ["Baustellenreinigung", "Bauschlussreinigung", "Grob- und Feinreinigung"],
  "end-reinigung": ["Endreinigung", "Wohnungsabgabe", "Übergabereinigung"],
  gebaeudereinigung: ["Gebäudereinigung", "Objektreinigung", "Unterhalt"],
  winterdienst: ["Schneeräumung", "Salzen", "Winterservice"],
  kellerraeumung: ["Keller räumen", "Estrich räumen", "Entrümpelung"],
  moebeltransport: ["Möbeltransport", "Zügeltransport", "Transporthilfe"],
};

export function generateSlugs() {
  return services.flatMap((service) =>
    cities.map((city) => `${service}-${city}`)
  );
}

export function formatText(value: string) {
  return value
    .replaceAll("-", " ")
    .replace("zuerich", "Zürich")
    .replace("bueroreinigung", "Büroreinigung")
    .replace("sanitaer", "Sanitär")
    .replace("duebendorf", "Dübendorf")
    .replace("buelach", "Bülach")
    .replace("gebaeudereinigung", "Gebäudereinigung")
    .replace("kellerraeumung", "Kellerräumung")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function getSeoData(slug: string) {
  const parts = slug.split("-");
  const city = parts[parts.length - 1];
  const service = parts.slice(0, -1).join("-");

  return {
    service,
    city,
    serviceLabel: formatText(service),
    cityLabel: formatText(city),
    keywords: serviceKeywords[service] || [formatText(service)],
  };
}