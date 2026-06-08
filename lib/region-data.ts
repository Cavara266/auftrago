export type Region = {
  slug: string;
  name: string;
  description: string;
  cities: string[];
};

export const regions: Region[] = [
  {
    slug: "zuerich",
    name: "Zürich",
    description:
      "Zürich ist einer der wichtigsten Standorte für regionale Dienstleistungen in der Schweiz. Über Auftrago findest du Anbieter für Reinigung, Hauswartung, Umzug, Gartenpflege, Entsorgung und weitere Arbeiten.",
    cities: [
      "Zürich",
      "Winterthur",
      "Uster",
      "Dietikon",
      "Wetzikon",
      "Bülach",
      "Horgen",
      "Meilen",
      "Schlieren",
      "Dübendorf",
      "Wallisellen",
      "Opfikon",
      "Kloten",
      "Regensdorf",
      "Adliswil",
      "Thalwil",
      "Wädenswil",
    ],
  },
  {
    slug: "aargau",
    name: "Aargau",
    description:
      "Im Aargau suchen viele Privatkunden, Verwaltungen und Firmen regionale Anbieter für Reinigung, Hauswartung, Gartenpflege, Umzug und Entsorgung.",
    cities: [
      "Aarau",
      "Baden",
      "Brugg",
      "Lenzburg",
      "Wohlen",
      "Zofingen",
      "Rheinfelden",
      "Wettingen",
      "Spreitenbach",
      "Mellingen",
      "Neuenhof",
      "Windisch",
    ],
  },
  {
    slug: "basel",
    name: "Basel",
    description:
      "Basel und die Umgebung sind wichtige Regionen für Reinigung, Umzug, Hauswartung, Entsorgung, Gartenpflege und gewerbliche Dienstleistungen.",
    cities: [
      "Basel",
      "Riehen",
      "Binningen",
      "Birsfelden",
      "Münchenstein",
      "Allschwil",
    ],
  },
  {
    slug: "bern",
    name: "Bern",
    description:
      "In Bern können Kunden über Auftrago regionale Firmen für Reinigung, Umzug, Hauswartung, Gartenpflege und weitere Dienstleistungen vergleichen.",
    cities: [
      "Bern",
      "Köniz",
      "Ostermundigen",
      "Muri bei Bern",
      "Thun",
      "Biel",
    ],
  },
  {
    slug: "luzern",
    name: "Luzern",
    description:
      "Luzern bietet viele lokale Dienstleister für Reinigung, Hauswartung, Umzug, Gartenpflege, Entsorgung und weitere Aufträge.",
    cities: ["Luzern", "Emmen", "Kriens", "Horw", "Ebikon"],
  },
  {
    slug: "zug",
    name: "Zug",
    description:
      "In Zug finden Privatkunden und Firmen regionale Anbieter für Reinigung, Hauswartung, Gartenpflege, Umzug und Entsorgung.",
    cities: ["Zug", "Baar", "Cham", "Rotkreuz", "Steinhausen"],
  },
  {
    slug: "st-gallen",
    name: "St. Gallen",
    description:
      "St. Gallen ist eine wichtige Region für lokale Dienstleistungen rund um Reinigung, Hauswartung, Umzug, Gartenpflege und Entsorgung.",
    cities: ["St. Gallen", "Gossau", "Rorschach", "Wil", "Uzwil"],
  },
  {
    slug: "schaffhausen",
    name: "Schaffhausen",
    description:
      "In Schaffhausen findest du über Auftrago regionale Anbieter für Reinigung, Hauswartung, Umzug, Gartenpflege und weitere Dienstleistungen.",
    cities: ["Schaffhausen", "Neuhausen", "Beringen", "Thayngen"],
  },
];

export function getRegion(slug: string) {
  return regions.find((region) => region.slug === slug);
}