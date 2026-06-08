export type Region = {
  slug: string;
  name: string;
  description: string;
  longDescription: string;
  cities: string[];
  popularServices: string[];
};

export const regions: Region[] = [
  {
    slug: "zuerich",
    name: "Zürich",
    description:
      "Zürich ist einer der wichtigsten Standorte für regionale Dienstleistungen in der Schweiz.",
    longDescription:
      "Zürich ist die grösste Wirtschaftsregion der Schweiz und bietet eine sehr hohe Nachfrage nach regionalen Dienstleistungen. Besonders häufig gesucht werden Reinigungsfirmen, Hauswartungen, Umzugsfirmen, Gartenpflege, Fensterreinigung, Entsorgung und Transport. Über Auftrago können Privatpersonen, Verwaltungen und Unternehmen passende Anbieter in Zürich und Umgebung finden und Offerten vergleichen.",
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
      "Volketswil",
      "Küsnacht",
      "Männedorf",
      "Affoltern am Albis",
    ],
    popularServices: [
      "Reinigung",
      "Umzugsreinigung",
      "Hauswartung",
      "Fensterreinigung",
      "Gartenpflege",
      "Umzug",
      "Transport",
      "Entsorgung",
    ],
  },
  {
    slug: "aargau",
    name: "Aargau",
    description:
      "Im Aargau suchen viele Privatkunden, Verwaltungen und Firmen regionale Anbieter.",
    longDescription:
      "Der Kanton Aargau verbindet viele Städte, Gemeinden und Wirtschaftsstandorte. In Aarau, Baden, Brugg, Lenzburg, Wohlen, Wettingen und Umgebung werden regelmässig Anbieter für Reinigung, Hauswartung, Umzug, Gartenpflege, Fensterreinigung und Entsorgung gesucht. Auftrago hilft dabei, regionale Firmen schneller zu finden und Offerten einfacher zu vergleichen.",
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
      "Suhr",
      "Oftringen",
      "Frick",
      "Muri",
      "Oberentfelden",
      "Unterentfelden",
    ],
    popularServices: [
      "Reinigung",
      "Hauswartung",
      "Umzugsreinigung",
      "Gartenpflege",
      "Fensterreinigung",
      "Entsorgung",
      "Transport",
    ],
  },
  {
    slug: "basel",
    name: "Basel",
    description:
      "Basel und Umgebung sind wichtige Regionen für private und gewerbliche Dienstleistungen.",
    longDescription:
      "Basel ist ein bedeutender Wirtschaftsstandort mit vielen Wohnungen, Firmen, Praxen, Büros und Liegenschaften. Entsprechend hoch ist die Nachfrage nach Reinigung, Büroreinigung, Hauswartung, Umzug, Entsorgung und Gartenpflege. Auftrago unterstützt Kunden dabei, regionale Anbieter in Basel und Umgebung zu vergleichen.",
    cities: [
      "Basel",
      "Riehen",
      "Binningen",
      "Birsfelden",
      "Münchenstein",
      "Allschwil",
      "Muttenz",
      "Pratteln",
      "Liestal",
      "Reinach BL",
    ],
    popularServices: [
      "Reinigung",
      "Büroreinigung",
      "Hauswartung",
      "Umzug",
      "Entsorgung",
      "Fensterreinigung",
    ],
  },
  {
    slug: "bern",
    name: "Bern",
    description:
      "In Bern können Kunden regionale Firmen für viele Dienstleistungen vergleichen.",
    longDescription:
      "Bern ist ein wichtiger Standort für Privatkunden, Verwaltungen und Unternehmen. Häufig gesucht werden Anbieter für Reinigung, Umzugsreinigung, Hauswartung, Gartenpflege, Entsorgung, Transport und Fensterreinigung. Auftrago hilft dabei, passende Firmen in Bern und Umgebung schneller zu finden.",
    cities: [
      "Bern",
      "Köniz",
      "Ostermundigen",
      "Muri bei Bern",
      "Thun",
      "Biel",
      "Burgdorf",
      "Langenthal",
      "Interlaken",
    ],
    popularServices: [
      "Reinigung",
      "Umzugsreinigung",
      "Hauswartung",
      "Gartenpflege",
      "Umzug",
      "Transport",
      "Entsorgung",
    ],
  },
  {
    slug: "luzern",
    name: "Luzern",
    description:
      "Luzern bietet viele lokale Dienstleister für private und gewerbliche Aufträge.",
    longDescription:
      "Luzern verbindet Wohngebiete, Gewerbe und Tourismus. Dadurch entstehen viele Anfragen für Reinigung, Hauswartung, Gartenpflege, Umzug, Transport, Fensterreinigung und Entsorgung. Über Auftrago können Kunden regionale Anbieter in Luzern und Umgebung einfacher vergleichen.",
    cities: ["Luzern", "Emmen", "Kriens", "Horw", "Ebikon", "Sursee"],
    popularServices: [
      "Reinigung",
      "Hauswartung",
      "Umzug",
      "Gartenpflege",
      "Fensterreinigung",
      "Entsorgung",
    ],
  },
  {
    slug: "zug",
    name: "Zug",
    description:
      "In Zug finden Privatkunden und Firmen regionale Anbieter für viele Dienstleistungen.",
    longDescription:
      "Zug ist ein starker Wirtschaftsstandort mit vielen Firmen, Wohnungen und Liegenschaften. Besonders gefragt sind Anbieter für Reinigung, Büroreinigung, Hauswartung, Fensterreinigung, Umzug, Gartenpflege und Entsorgung. Auftrago erleichtert den Vergleich regionaler Firmen in Zug.",
    cities: ["Zug", "Baar", "Cham", "Rotkreuz", "Steinhausen"],
    popularServices: [
      "Reinigung",
      "Büroreinigung",
      "Hauswartung",
      "Fensterreinigung",
      "Umzug",
      "Entsorgung",
    ],
  },
  {
    slug: "st-gallen",
    name: "St. Gallen",
    description:
      "St. Gallen ist eine wichtige Region für lokale Dienstleistungen in der Ostschweiz.",
    longDescription:
      "St. Gallen und die Ostschweiz bieten viele regionale Dienstleister für Reinigung, Hauswartung, Umzug, Gartenpflege, Entsorgung und Transport. Über Auftrago können Kunden passende Anbieter aus der Region finden und Offerten vergleichen.",
    cities: ["St. Gallen", "Gossau", "Rorschach", "Wil", "Uzwil", "Rapperswil"],
    popularServices: [
      "Reinigung",
      "Hauswartung",
      "Umzug",
      "Transport",
      "Gartenpflege",
      "Entsorgung",
    ],
  },
  {
    slug: "schaffhausen",
    name: "Schaffhausen",
    description:
      "In Schaffhausen findest du regionale Anbieter für Reinigung, Hauswartung und weitere Dienstleistungen.",
    longDescription:
      "Schaffhausen hat eine starke regionale Struktur. Viele Kunden suchen Dienstleister aus der Nähe, die flexibel reagieren können. Besonders häufig gefragt sind Reinigung, Hauswartung, Gartenpflege, Umzug, Transport und Entsorgung.",
    cities: ["Schaffhausen", "Neuhausen", "Beringen", "Thayngen"],
    popularServices: [
      "Reinigung",
      "Hauswartung",
      "Gartenpflege",
      "Umzug",
      "Transport",
      "Entsorgung",
    ],
  },
  {
    slug: "thurgau",
    name: "Thurgau",
    description:
      "Im Thurgau werden regionale Anbieter für private und gewerbliche Aufträge gesucht.",
    longDescription:
      "Der Thurgau bietet viele regionale Anbieter für Reinigung, Hauswartung, Gartenpflege, Umzug, Entsorgung und Transport. Besonders in Frauenfeld, Kreuzlingen und Arbon entstehen regelmässig private und gewerbliche Dienstleistungsanfragen.",
    cities: ["Frauenfeld", "Kreuzlingen", "Arbon", "Weinfelden", "Romanshorn"],
    popularServices: [
      "Reinigung",
      "Hauswartung",
      "Gartenpflege",
      "Umzug",
      "Entsorgung",
      "Transport",
    ],
  },
  {
    slug: "solothurn",
    name: "Solothurn",
    description:
      "Solothurn ist ein regionaler Standort mit vielen Dienstleistungsanfragen.",
    longDescription:
      "In Solothurn und Umgebung suchen Privatkunden, Verwaltungen und Unternehmen Anbieter für Reinigung, Hauswartung, Umzug, Gartenpflege, Entsorgung und Fensterreinigung. Auftrago hilft, regionale Firmen einfacher zu vergleichen.",
    cities: ["Solothurn", "Olten", "Grenchen", "Zuchwil"],
    popularServices: [
      "Reinigung",
      "Hauswartung",
      "Umzug",
      "Fensterreinigung",
      "Gartenpflege",
      "Entsorgung",
    ],
  },
];

export function getRegion(slug: string) {
  return regions.find((region) => region.slug === slug);
}
