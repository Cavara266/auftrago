export type Provider = {
  id: string;
  name: string;
  city: string;
  region: string;
  categories: string[];
  description: string;
  rating: number;
};

export const providers: Provider[] = [
  {
    id: "demo-hauswartung-aargau",
    name: "Auftrago Partnerbetrieb",
    city: "Aargau",
    region: "Aargau",
    categories: ["Hauswartung", "Reinigung", "Gartenpflege"],
    description:
      "Regionaler Dienstleister für Hauswartung, Reinigung und Umgebungspflege.",
    rating: 4.8,
  },
  {
    id: "demo-reinigung-zuerich",
    name: "Premium Reinigungsservice",
    city: "Zürich",
    region: "Zürich",
    categories: ["Reinigung", "Büroreinigung", "Treppenhausreinigung"],
    description:
      "Spezialisiert auf regelmässige Reinigung für Privatkunden, Firmen und Verwaltungen.",
    rating: 4.9,
  },
  {
    id: "demo-umzug-aargau",
    name: "Schweiz Umzug & Transport",
    city: "Baden",
    region: "Aargau",
    categories: ["Umzug", "Transport", "Entsorgung"],
    description:
      "Unterstützung für Umzug, Transport, Räumung und fachgerechte Entsorgung.",
    rating: 4.7,
  },
];

export function getProvidersByService(service: string) {
  const normalizedService = service.toLowerCase();

  return providers.filter((provider) =>
    provider.categories.some((category) =>
      category.toLowerCase().includes(normalizedService)
    )
  );
}