export type CityProfile = {
  slug: string;
  name: string;
  canton: string;
  regionName: string;
  nearby: string[];
  introVariant: string;
};

export const cityProfiles: CityProfile[] = [
  {
    slug: "zuerich",
    name: "Zürich",
    canton: "ZH",
    regionName: "Kanton Zürich",
    nearby: ["winterthur", "uster", "duebendorf", "dietikon", "wallisellen"],
    introVariant:
      "In Zürich treffen private Haushalte, Verwaltungen und Gewerbebetriebe auf eine hohe Nachfrage nach flexibel verfügbaren Dienstleistern.",
  },
  {
    slug: "aarau",
    name: "Aarau",
    canton: "AG",
    regionName: "Kanton Aargau",
    nearby: ["baden", "lenzburg", "brugg", "zofingen", "olten"],
    introVariant:
      "In Aarau werden sowohl private Aufträge als auch wiederkehrende Arbeiten für Verwaltungen und Unternehmen vergeben.",
  },
  {
    slug: "baden",
    name: "Baden",
    canton: "AG",
    regionName: "Kanton Aargau",
    nearby: ["wettingen", "brugg", "dietikon", "lenzburg", "aarau"],
    introVariant:
      "Baden und die umliegenden Gemeinden bieten eine breite Nachfrage nach regionalen Dienstleistern für Wohnen, Gewerbe und Liegenschaften.",
  },
  {
    slug: "basel",
    name: "Basel",
    canton: "BS",
    regionName: "Basel-Stadt",
    nearby: ["allschwil", "muttenz", "pratteln", "liestal", "reinach-bl"],
    introVariant:
      "In Basel werden Dienstleistungen für Stadtwohnungen, Gewerbeflächen und grössere Liegenschaften regelmässig gesucht.",
  },
  {
    slug: "bern",
    name: "Bern",
    canton: "BE",
    regionName: "Kanton Bern",
    nearby: ["koeniz", "ostermundigen", "worb", "thun", "burgdorf"],
    introVariant:
      "Bern verbindet private, öffentliche und gewerbliche Nachfrage nach zuverlässigen regionalen Dienstleistern.",
  },
  {
    slug: "luzern",
    name: "Luzern",
    canton: "LU",
    regionName: "Kanton Luzern",
    nearby: ["kriens", "emmen", "horw", "zug", "sursee"],
    introVariant:
      "In Luzern und der Agglomeration werden Dienstleister für Haushalte, Unternehmen und Liegenschaften gesucht.",
  },
  {
    slug: "zug",
    name: "Zug",
    canton: "ZG",
    regionName: "Kanton Zug",
    nearby: ["baar", "cham", "rotkreuz", "luzern", "waedenswil"],
    introVariant:
      "Zug weist eine starke Nachfrage nach professionellen Dienstleistungen für private und geschäftliche Auftraggeber auf.",
  },
  {
    slug: "winterthur",
    name: "Winterthur",
    canton: "ZH",
    regionName: "Kanton Zürich",
    nearby: ["zuerich", "frauenfeld", "buelach", "uster", "wil-sg"],
    introVariant:
      "Winterthur bietet eine vielseitige Nachfrage nach einmaligen und wiederkehrenden Dienstleistungen.",
  },
];

export function getCityProfile(slug: string) {
  return cityProfiles.find((city) => city.slug === slug);
}
