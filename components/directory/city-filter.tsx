"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import type { City, Service } from "@/lib/seo-data"

type CityFilterProps = {
  cities: City[]
  topServices: Service[]
}

export default function CityFilter({ cities, topServices }: CityFilterProps) {
  const [query, setQuery] = useState("")
  const [canton, setCanton] = useState("Alle")

  const cantons = useMemo(() => {
    return ["Alle", ...Array.from(new Set(cities.map(city => city.canton))).sort()]
  }, [cities])

  const filteredCities = useMemo(() => {
    const normalized = query.trim().toLowerCase()

    return cities.filter(city => {
      const matchesQuery =
        !normalized ||
        city.name.toLowerCase().includes(normalized) ||
        city.slug.toLowerCase().includes(normalized) ||
        city.canton.toLowerCase().includes(normalized)

      const matchesCanton = canton === "Alle" || city.canton === canton
      return matchesQuery && matchesCanton
    })
  }, [cities, query, canton])

  return (
    <section className="mb-12">
      <div className="card mb-6 p-5 sm:p-6">
        <h2 className="mb-2 text-2xl font-semibold text-white">Standorte suchen</h2>

        <div className="grid gap-3 md:grid-cols-[1fr_220px]">
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Stadt suchen..."
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none"
          />

          <select
            value={canton}
            onChange={e => setCanton(e.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none"
          >
            {cantons.map(item => (
              <option key={item} value={item} className="bg-neutral-900 text-white">
                {item}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredCities.map(city => (
          <article key={city.slug} className="card p-6">
            <h3 className="mb-2 text-xl font-semibold text-white">{city.name}</h3>
            <p className="mb-4 text-sm leading-6 text-white/70">Kanton {city.canton}</p>

            <div className="mb-5 grid grid-cols-2 gap-2">
              {topServices.slice(0, 4).map(service => (
                <Link
                  key={`${service.slug}-${city.slug}`}
                  href={`/${service.slug}-${city.slug}`}
                  className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-white/80 hover:bg-white/10"
                >
                  {service.name} {city.name}
                </Link>
              ))}
            </div>

            <Link href={`/standorte/${city.slug}`} className="btn btn-primary">
              {city.name} ansehen
            </Link>
          </article>
        ))}
      </div>
    </section>
  )
}