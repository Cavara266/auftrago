import Link from "next/link"
import { getTopServices } from "@/lib/seo-data"

export default function ServicesGrid(){

const services = getTopServices(8)

return(

<section className="mb-32">

<h2 className="text-3xl font-semibold text-white mb-10">
Beliebte Dienstleistungen
</h2>

<div className="grid md:grid-cols-4 gap-6">

{services.map(service=>(

<Link
key={service.slug}
href={`/leistungen/${service.slug}`}
className="card p-6 hover:bg-white/10"
>

<h3 className="text-lg text-white mb-2">
{service.name}
</h3>

<p className="text-sm text-white/60">
Anbieter vergleichen
</p>

</Link>

))}

</div>

</section>

)

}