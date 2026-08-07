export type SwissCity = {
  slug: string;
  name: string;
  canton: string;
  region: string;
  bfsNumber: number;
  districtNumber?: number;
  population?: number;
};

export const swissCities: SwissCity[] = [
  {
    slug: "zuerich",
    name: "Zürich",
    bfsNumber: 261,
    canton: "ZH",
    region: "Kanton Zürich",
  },

];

const cityBySlug = new Map(
  swissCities.map((city) => [city.slug, city]),
);

export function getSwissCity(slug: string) {
  return cityBySlug.get(slug);
}

export function getSwissCitiesByCanton(canton: string) {
  return swissCities.filter((city) => city.canton === canton);
}
