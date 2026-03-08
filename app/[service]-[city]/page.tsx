import { notFound } from "next/navigation"

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
  "stgallen",
  "aarau",
  "baden",
  "zug",
  "schaffhausen"
]

export async function generateStaticParams() {
  const paths = []

  for (const service of services) {
    for (const city of cities) {
      paths.push({
        slug: `${service}-${city}`
      })
    }
  }

  return paths
}

export default function Page({ params }: { params: { slug: string } }) {

  const [service, city] = params.slug.split("-")

  if (!services.includes(service) || !cities.includes(city)) {
    return notFound()
  }

  return (
    <main className="max-w-5xl mx-auto py-20">

      <h1 className="text-4xl font-bold mb-6">
        {service} Offerten in {city}
      </h1>

      <p className="mb-8 text-lg">
        Vergleichen Sie Angebote für {service} in {city}.
        Erhalten Sie kostenlos mehrere Offerten von geprüften Anbietern.
      </p>

      {/* Anfrage Formular */}
      <div className="border p-6 rounded-xl">
        <h2 className="text-2xl mb-4">
          Kostenlose Anfrage senden
        </h2>

        <form className="space-y-4">
          <input
            type="text"
            placeholder="Name"
            className="w-full border p-3 rounded"
          />

          <input
            type="email"
            placeholder="Email"
            className="w-full border p-3 rounded"
          />

          <button className="bg-blue-600 text-white px-6 py-3 rounded">
            Anfrage senden
          </button>
        </form>
      </div>

    </main>
  )
}