export default function sitemap() {

  const services = [
    "reinigung",
    "umzug",
    "transport",
    "hauswartung",
    "entsorgung"
  ]

  const cities = [
    "zuerich",
    "bern",
    "basel",
    "luzern",
    "winterthur",
    "stgallen"
  ]

  const urls = []

  for (const service of services) {
    for (const city of cities) {
      urls.push({
        url: `https://auftrago.ch/${service}-${city}`,
        lastModified: new Date()
      })
    }
  }

  return urls
}