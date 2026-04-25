import {services,cities} from "@/lib/seo-data"
import {generateSeoText} from "@/lib/seo-text"
import Hero from "@/components/hero"
import Trust from "@/components/trust"
import ProviderGrid from "@/components/provider-grid"
import Container from "@/components/container"

export async function generateStaticParams(){

const params:any[]=[]

services.forEach(s=>{
cities.forEach(c=>{

params.push({
service:s.slug,
city:c.slug
})

})
})

return params

}

export default function Page({params}:any){

const service=services.find(s=>s.slug===params.service)
const city=cities.find(c=>c.slug===params.city)

if(!service||!city)return null

const text=generateSeoText(service.name,city.name)

return(

<main>

<Hero
title={`${service.name} in ${city.name}`}
subtitle={`Vergleiche Anbieter für ${service.name}`}
 />

<Trust/>

<ProviderGrid/>

<Container>

<div className="py-20 max-w-3xl text-white/80">

{text.split("\n").map((p,i)=>(
<p key={i} className="mb-4">{p}</p>
))}

</div>

</Container>

</main>

)

}