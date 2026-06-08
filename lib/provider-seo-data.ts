export type ProviderProfile = {
  slug: string;
  name: string;
  city: string;
  region: string;
  phone: string;
  website: string;
  services: string[];
  description: string;
};

export const providers: ProviderProfile[] = [
  {
    slug: "cavara-hauswartung",
    name: "Cavara Hauswartung",
    city: "Aargau",
    region: "Aargau und Zürich",
    phone: "079 599 29 67",
    website: "https://www.auftrago.ch",
    services: [
      "Hauswartung",
      "Reinigung",
      "Umzugsreinigung",
      "Fensterreinigung",
      "Gartenpflege",
    ],
    description:
      "Cavara Hauswartung ist Anbieter für Hauswartung, Reinigung, Umzugsreinigung, Fensterreinigung und Gartenpflege in der Region Aargau und Zürich.",
  },
];

export function getProvider(slug: string) {
  return providers.find((provider) => provider.slug === slug);
}