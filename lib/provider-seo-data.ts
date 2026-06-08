export type Provider = {
  slug: string;
  name: string;
  category: string;
  city: string;
  region: string;
  phone: string;
  description: string;
  services: string[];
};

export const providers: Provider[] = [];

export function getProvider(slug: string) {
  return providers.find((provider) => provider.slug === slug);
}

export type ProviderCategory = {
  title: string;
  description: string;
  href: string;
  services: string[];
};

export const providerCategories: ProviderCategory[] = [
  {
    title: "Reinigungsfirmen",
    description:
      "Finde Anbieter für Wohnungsreinigung, Unterhaltsreinigung, Büroreinigung und Spezialreinigungen.",
    href: "/reinigung-zuerich",
    services: ["Wohnungsreinigung", "Unterhaltsreinigung", "Büroreinigung"],
  },
  {
    title: "Umzugsreinigung",
    description:
      "Vergleiche Firmen für Endreinigung, Wohnungsabgabe und Reinigung mit Abgabegarantie.",
    href: "/umzugsreinigung-zuerich",
    services: ["Endreinigung", "Abgabereinigung", "Fensterreinigung"],
  },
  {
    title: "Hauswartung",
    description:
      "Anbieter für Liegenschaftsunterhalt, Treppenhausreinigung und regelmässige Betreuung.",
    href: "/hauswartung-zuerich",
    services: ["Gebäudeunterhalt", "Kontrollgänge", "Treppenhaus"],
  },
  {
    title: "Gartenpflege",
    description:
      "Regionale Dienstleister für Gartenunterhalt, Rasenpflege, Heckenschnitt und saisonale Arbeiten.",
    href: "/gartenpflege-zuerich",
    services: ["Rasenpflege", "Hecken schneiden", "Gartenunterhalt"],
  },
  {
    title: "Umzug & Transport",
    description:
      "Firmen für Privatumzug, Möbeltransport, Kleintransport und Transporthilfe vergleichen.",
    href: "/umzug-zuerich",
    services: ["Privatumzug", "Möbeltransport", "Kleintransport"],
  },
  {
    title: "Entsorgung",
    description:
      "Anbieter für Räumungen, Sperrgut, Keller, Estrich und fachgerechte Entsorgung finden.",
    href: "/entsorgung-zuerich",
    services: ["Räumung", "Sperrgut", "Entrümpelung"],
  },
];