import Link from "next/link"
import { services,cities } from "@/lib/seo-data"

export function generateStaticParams(){
return services.map(service=>({service:service.slug}))
}

export default function Page({params}:{params:{service:string}}){

const service=services.find(s=>s.slug===params.service)
if(!service)return null

return(

<main className="container-app section-space">

<h1 className="text-4xl font-bold text-white mb-6">
{service.name} Anbieter
</h1>

<div className="grid grid-cols-2 md:grid-cols-4 gap-4">

{cities.map(city=>(

<Link
key={city.slug}
href={`/${service.slug}/${city.slug}`}
className="card p-4 text-white/80"
>

{service.name} {city.name}

</Link>

))}

</div>

</main>

)
}