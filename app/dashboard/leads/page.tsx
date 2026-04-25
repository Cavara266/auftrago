import { prisma } from "@/lib/db"

export default async function Page(){

const leads = await prisma.lead.findMany({

orderBy:{createdAt:"desc"}

})

return(

<main className="container-app section-space">

<h1 className="text-3xl text-white mb-10">
Neue Leads
</h1>

<div className="grid md:grid-cols-2 gap-6">

{leads.map(lead=>(

<div key={lead.id} className="card p-6">

<h3 className="text-white text-lg mb-2">

{lead.category} in {lead.city}

</h3>

<p className="text-white/70 mb-4">

{lead.description}

</p>

<p className="text-white/50 text-sm">

Preis: {lead.priceCredits} Credits

</p>

</div>

))}

</div>

</main>

)

}