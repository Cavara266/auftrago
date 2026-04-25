import Link from "next/link"
import { services,cities } from "@/lib/seo-data"

export function generateStaticParams(){
return cities.map(city=>({city:city.slug}))
}

export default function Page({params}:{params:{city:string}}){

const city=cities.find(c=>c.slug===params.city)
if(!city)return null

return(

<main className="container-app section-space">

<h1 className="text-4xl font-bold text-white mb-6">
Dienstleister in {city.name}
</h1>

<div className="grid grid-cols-2 md:grid-cols-4 gap-4">

{services.map(service=>(

<Link
key={service.slug}
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