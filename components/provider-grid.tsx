import Container from "./container"
import ProviderCard from "./provider-card"
import {providers} from "@/lib/providers"

export default function ProviderGrid(){

return(

<section className="py-20">

<Container>

<h2 className="text-3xl font-bold text-white mb-10">
Top Anbieter
</h2>

<div className="grid md:grid-cols-3 gap-6">

{providers.map((p,i)=>(
<ProviderCard key={i} provider={p}/>
))}

</div>

</Container>

</section>

)

}