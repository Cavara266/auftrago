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
  "dachdecker",
  "fensterreinigung",
  "baureinigung",
  "end-reinigung",
  "gebaeudereinigung",
  "winterdienst",
  "kellerraeumung",
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
  };
}