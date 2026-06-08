export type PrioritySeoPage = {
  slug: string;
  service: string;
  serviceLabel: string;
  city: string;
  cityLabel: string;
  title: string;
  description: string;
  keywords: string[];
};

export const prioritySeoPages: PrioritySeoPage[] = [
  {
    slug: "hauswartung-uster",
    service: "hauswartung",
    serviceLabel: "Hauswartung",
    city: "uster",
    cityLabel: "Uster",
    title: "Hauswartung in Uster",
    description:
      "Finde regionale Anbieter für Hauswartung in Uster. Kostenlos Anfrage senden und passende Offerten vergleichen.",
    keywords: [
      "Hauswartfirma Uster",
      "Hauswartservice Uster",
      "Hauswartarbeiten Uster",
      "Liegenschaftsunterhalt Uster",
    ],
  },
  {
    slug: "reinigung-uster",
    service: "reinigung",
    serviceLabel: "Reinigung",
    city: "uster",
    cityLabel: "Uster",
    title: "Reinigung in Uster",
    description:
      "Finde Reinigungsfirmen in Uster für Wohnungsreinigung, Büroreinigung und Unterhaltsreinigung.",
    keywords: [
      "Reinigungsfirma Uster",
      "Wohnungsreinigung Uster",
      "Unterhaltsreinigung Uster",
      "Büroreinigung Uster",
    ],
  },
  {
    slug: "endreinigung-buelach",
    service: "end-reinigung",
    serviceLabel: "Endreinigung",
    city: "buelach",
    cityLabel: "Bülach",
    title: "Endreinigung in Bülach",
    description:
      "Finde Anbieter für Endreinigung und Wohnungsabgabe in Bülach. Kostenlos Offerten vergleichen.",
    keywords: [
      "Endreinigung Bülach",
      "Umzugsreinigung Bülach",
      "Wohnungsabgabe Bülach",
      "Abgabereinigung Bülach",
    ],
  },
  {
    slug: "bueroreinigung-buelach",
    service: "bueroreinigung",
    serviceLabel: "Büroreinigung",
    city: "buelach",
    cityLabel: "Bülach",
    title: "Büroreinigung in Bülach",
    description:
      "Finde regionale Anbieter für Büroreinigung in Bülach. Kostenlos Anfrage senden und Offerten vergleichen.",
    keywords: [
      "Büroreinigung Bülach",
      "Reinigungsfirma Bülach",
      "Gewerbereinigung Bülach",
      "Praxisreinigung Bülach",
    ],
  },
  {
    slug: "umzug-lenzburg",
    service: "umzug",
    serviceLabel: "Umzug",
    city: "lenzburg",
    cityLabel: "Lenzburg",
    title: "Umzug in Lenzburg",
    description:
      "Finde Umzugsfirmen in Lenzburg für Privatumzug, Firmenumzug und Transport. Kostenlos Offerten vergleichen.",
    keywords: [
      "Umzug Lenzburg",
      "Umzugsfirma Lenzburg",
      "Möbeltransport Lenzburg",
      "Privatumzug Lenzburg",
    ],
  },
  {
    slug: "fensterreinigung-solothurn",
    service: "fensterreinigung",
    serviceLabel: "Fensterreinigung",
    city: "solothurn",
    cityLabel: "Solothurn",
    title: "Fensterreinigung in Solothurn",
    description:
      "Finde Anbieter für Fensterreinigung in Solothurn. Glasreinigung, Storen und Fenster professionell reinigen lassen.",
    keywords: [
      "Fensterreinigung Solothurn",
      "Fenster putzen Solothurn",
      "Glasreinigung Solothurn",
      "Storenreinigung Solothurn",
    ],
  },
];

export function getPrioritySeoPage(slug: string) {
  return prioritySeoPages.find((page) => page.slug === slug);
}