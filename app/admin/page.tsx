import { prisma } from "@/lib/db"

export default async function Page(){

const leads = await prisma.lead.findMany()

return(

<main className="container-app section-space">

<h1 className="text-3xl text-white mb-10">
Admin Leads
</h1>

<table className="w-full text-left">

<thead>
<tr>
<th className="text-white/60">Kategorie</th>
<th className="text-white/60">Stadt</th>
<th className="text-white/60">Kontakt</th>
</tr>
</thead>

<tbody>

{leads.map(lead=>(
<tr key={lead.id}>

<td>{lead.category}</td>
<td>{lead.city}</td>
<td>{lead.contactName}</td>

</tr>
))}

</tbody>

</table>

</main>

)

}