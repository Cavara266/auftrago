import Link from "next/link"

export default function ProviderCard({provider}:any){

return(

<div className="bg-white/5 border border-white/10 rounded-2xl p-6">

<Link href={`/anbieter/${provider.slug}`}>

<h3 className="text-white font-semibold mb-2 hover:text-indigo-400">
{provider.name}
</h3>

</Link>

<p className="text-white/60 text-sm mb-2">
{provider.city}
</p>

<p className="text-yellow-400 text-sm mb-4">
⭐ {provider.rating} ({provider.reviews})
</p>

<Link
href="/offerte-anfragen"
className="block text-center py-2 bg-indigo-500 rounded-lg text-white"
>
Offerte anfragen
</Link>

</div>

)

}