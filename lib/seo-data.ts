export const services = [
  { name: "Reinigung", slug: "reinigung" },
  { name: "Umzug", slug: "umzug" },
  { name: "Hauswartung", slug: "hauswartung" },
  { name: "Transport", slug: "transport" },
  { name: "Entsorgung", slug: "entsorgung" },
]

export const cities = [
  { name: "Zürich", slug: "zuerich" },
  { name: "Winterthur", slug: "winterthur" },
  { name: "Baden", slug: "baden" },
  { name: "Aarau", slug: "aarau" },
  { name: "Lenzburg", slug: "lenzburg" },
  { name: "Dietikon", slug: "dietikon" },
  { name: "Schlieren", slug: "schlieren" },
  { name: "Bülach", slug: "buelach" },
]

export function getTopCities(limit: number) {
  return cities.slice(0, limit)
}

export function getTopServices(limit: number) {
  return services.slice(0, limit)
}