import Link from "next/link"
import { getTopCities, getTopServices } from "../../lib/seo-data"

type Props = {
  title?: string
  mode?: "mixed" | "city" | "service"
  limit?: number
}

export default function SeoClusterLinks({
  title = "Beliebte Kombinationen",
  mode = "mixed",
  limit = 12,
}: Props) {

  const cities = getTopCities(limit)
  const services = getTopServices(limit)

  const links: { name: string; href: string }[] = []

  if (mode === "mixed") {
    cities.slice(0, 6).forEach((city) => {
      services.slice(0, 2).forEach((service) => {
        links.push({
          name: `${service.name} ${city.name}`,
          href: `/leistungen/${service.slug}/${city.slug}`,
        })
      })
    })
  }

  if (mode === "city") {
    cities.forEach((city) => {
      links.push({
        name: city.name,
        href: `/standorte/${city.slug}`,
      })
    })
  }

  if (mode === "service") {
    services.forEach((service) => {
      links.push({
        name: service.name,
        href: `/leistungen/${service.slug}`,
      })
    })
  }

  return (
    <section className="mt-16">

      <h3 className="mb-6 text-xl font-semibold text-white">
        {title}
      </h3>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">

        {links.slice(0, limit).map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="card px-4 py-3 text-sm text-white/80 hover:bg-white/10"
          >
            {link.name}
          </Link>
        ))}

      </div>

    </section>
  )
}