export type City = {
  slug: string;
  name: string;
  region: string;
  description: string;
  services: string[];
};

export const citiesSeo: City[] = [
  {
    slug: "zuerich",
    name: "Zürich",
    region: "Zürich",
    description:
      "Zürich ist einer der wichtigsten Standorte für regionale Dienstleistungen in der Schweiz. Besonders häufig gesucht werden Anbieter für Reinigung, Hauswartung, Umzug, Gartenpflege, Fensterreinigung und Entsorgung.",
    services: [
      "reinigung",
      "hauswartung",
      "umzugsreinigung",
      "fensterreinigung",
      "gartenpflege",
      "umzug",
      "transport",
      "entsorgung",
    ],
  },
  {
    slug: "uster",
    name: "Uster",
    region: "Zürich",
    description:
      "In Uster suchen viele Privatkunden, Verwaltungen und Firmen regionale Anbieter für Hauswartung, Reinigung, Gartenpflege, Umzug und Entsorgung.",
    services: [
      "hauswartung",
      "reinigung",
      "treppenhausreinigung",
      "gartenpflege",
      "umzug",
      "entsorgung",
    ],
  },
  {
    slug: "buelach",
    name: "Bülach",
    region: "Zürich",
    description:
      "Bülach ist eine wichtige Stadt im Zürcher Unterland. Über Auftrago findest du Anbieter für Reinigung, Endreinigung, Hauswartung, Fensterreinigung und weitere Dienstleistungen.",
    services: [
      "reinigung",
      "umzugsreinigung",
      "hauswartung",
      "fensterreinigung",
      "gartenpflege",
      "entsorgung",
    ],
  },
  {
    slug: "winterthur",
    name: "Winterthur",
    region: "Zürich",
    description:
      "Winterthur bietet viele regionale Dienstleister für Reinigung, Umzug, Hauswartung, Gartenpflege, Entsorgung und Transport.",
    services: [
      "reinigung",
      "hauswartung",
      "umzug",
      "gartenpflege",
      "fensterreinigung",
      "entsorgung",
      "transport",
    ],
  },
  {
    slug: "dietikon",
    name: "Dietikon",
    region: "Zürich",
    description:
      "In Dietikon werden regionale Anbieter für Reinigung, Hauswartung, Umzug, Gartenpflege und Entsorgung gesucht.",
    services: [
      "reinigung",
      "hauswartung",
      "umzug",
      "gartenpflege",
      "entsorgung",
    ],
  },
  {
    slug: "wetzikon",
    name: "Wetzikon",
    region: "Zürich",
    description:
      "Wetzikon ist ein wichtiger Standort im Zürcher Oberland. Auftrago hilft beim Vergleich regionaler Anbieter.",
    services: [
      "reinigung",
      "hauswartung",
      "gartenpflege",
      "umzug",
      "entsorgung",
    ],
  },
  {
    slug: "aarau",
    name: "Aarau",
    region: "Aargau",
    description:
      "In Aarau finden Privatkunden und Firmen regionale Anbieter für Reinigung, Hauswartung, Umzug, Gartenpflege und Entsorgung.",
    services: [
      "reinigung",
      "hauswartung",
      "umzug",
      "gartenpflege",
      "fensterreinigung",
      "entsorgung",
    ],
  },
  {
    slug: "baden",
    name: "Baden",
    region: "Aargau",
    description:
      "Baden ist ein wichtiger Standort im Aargau. Besonders gefragt sind Reinigung, Hauswartung, Umzug, Gartenpflege und Entsorgung.",
    services: [
      "reinigung",
      "hauswartung",
      "umzugsreinigung",
      "gartenpflege",
      "fensterreinigung",
      "entsorgung",
    ],
  },
  {
    slug: "lenzburg",
    name: "Lenzburg",
    region: "Aargau",
    description:
      "In Lenzburg suchen viele Kunden Anbieter für Umzug, Reinigung, Hauswartung, Gartenpflege und Entsorgung.",
    services: [
      "umzug",
      "reinigung",
      "hauswartung",
      "gartenpflege",
      "transport",
      "entsorgung",
    ],
  },
  {
    slug: "wohlen",
    name: "Wohlen",
    region: "Aargau",
    description:
      "Wohlen bietet viele regionale Dienstleister für Reinigung, Hauswartung, Umzug und Gartenpflege.",
    services: [
      "reinigung",
      "hauswartung",
      "umzug",
      "gartenpflege",
      "entsorgung",
    ],
  },
  {
    slug: "basel",
    name: "Basel",
    region: "Basel",
    description:
      "Basel ist ein grosser Wirtschaftsstandort mit vielen Anfragen für Reinigung, Hauswartung, Umzug, Büroreinigung und Entsorgung.",
    services: [
      "reinigung",
      "bueroreinigung",
      "hauswartung",
      "umzug",
      "fensterreinigung",
      "entsorgung",
    ],
  },
  {
    slug: "bern",
    name: "Bern",
    region: "Bern",
    description:
      "In Bern können Kunden regionale Anbieter für Reinigung, Umzug, Hauswartung, Gartenpflege und weitere Dienstleistungen vergleichen.",
    services: [
      "reinigung",
      "hauswartung",
      "umzug",
      "gartenpflege",
      "fensterreinigung",
      "entsorgung",
    ],
  },
  {
    slug: "luzern",
    name: "Luzern",
    region: "Luzern",
    description:
      "Luzern bietet viele lokale Anbieter für Reinigung, Hauswartung, Umzug, Gartenpflege und Entsorgung.",
    services: [
      "reinigung",
      "hauswartung",
      "umzug",
      "gartenpflege",
      "fensterreinigung",
      "entsorgung",
    ],
  },
  {
    slug: "zug",
    name: "Zug",
    region: "Zug",
    description:
      "Zug ist ein starker Standort für Firmen und Privatkunden. Gefragt sind Reinigung, Hauswartung, Büroreinigung, Umzug und Entsorgung.",
    services: [
      "reinigung",
      "bueroreinigung",
      "hauswartung",
      "umzug",
      "fensterreinigung",
      "entsorgung",
    ],
  },
  {
    slug: "schaffhausen",
    name: "Schaffhausen",
    region: "Schaffhausen",
    description:
      "In Schaffhausen findest du Anbieter für Reinigung, Hauswartung, Umzug, Gartenpflege, Transport und Entsorgung.",
    services: [
      "reinigung",
      "hauswartung",
      "umzug",
      "gartenpflege",
      "transport",
      "entsorgung",
    ],
  },
  {
    slug: "solothurn",
    name: "Solothurn",
    region: "Solothurn",
    description:
      "Solothurn bietet regionale Anbieter für Reinigung, Hauswartung, Fensterreinigung, Umzug und Entsorgung.",
    services: [
      "reinigung",
      "hauswartung",
      "fensterreinigung",
      "umzug",
      "gartenpflege",
      "entsorgung",
    ],
  },
];

export function getCity(slug: string) {
  return citiesSeo.find((city) => city.slug === slug);
}