"use client"

import Link from "next/link"
import { getTopCities, getTopServices } from "@/lib/seo-data"

export default function ServiceFilter() {

const topCities = getTopCities(8)
const topServices = getTopServices(6)

return (

<div className="space-y-10">

{/* SERVICES */}

<div>

<h3 className="text-sm text-white/50 mb-4 uppercase tracking-wider">
Beliebte Dienstleistungen
</h3>

<div className="flex flex-wrap gap-3">

{topServices.map(service => (

<Link
key={service.slug}
href={`/leistungen/${service.slug}`}
className="pill"
>

{service.name}

</Link>

))}

</div>

</div>


{/* CITIES */}

<div>

<h3 className="text-sm text-white/50 mb-4 uppercase tracking-wider">
Beliebte Standorte
</h3>

<div className="grid grid-cols-2 gap-2">

{topCities.map(city => (

<Link
key={city.slug}
href={`/standorte/${city.slug}`}
className="pill text-center"
>

{city.name}

</Link>

))}

</div>

</div>

</div>

)

}