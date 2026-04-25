"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

type Service = {
  name: string
  slug: string
}

type Props = {
  services: Service[]
}

export default function ServiceFilter({ services }: Props) {
  const router = useRouter()

  const [query, setQuery] = useState("")

  const filtered = services.filter((service) =>
    service.name.toLowerCase().includes(query.toLowerCase())
  )

  function goToService(slug: string) {
    router.push(`/leistungen/${slug}`)
  }

  return (
    <div className="space-y-4">

      <input
        type="text"
        placeholder="Dienstleistung suchen..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="input w-full"
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">

        {filtered.map((service) => (
          <button
            key={service.slug}
            onClick={() => goToService(service.slug)}
            className="card px-4 py-3 text-sm text-white/85 hover:bg-white/10"
          >
            {service.name}
          </button>
        ))}

      </div>

    </div>
  )
}