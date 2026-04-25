import Link from "next/link"
import Container from "./container"

export default function Hero({
title,
subtitle
}:{title:string,subtitle:string}){

return(

<section className="py-24 bg-gradient-to-br from-indigo-600/20 via-purple-600/10 to-transparent">

<Container>

<h1 className="text-5xl font-bold text-white mb-6">
{title}
</h1>

<p className="text-white/70 mb-8 max-w-xl">
{subtitle}
</p>

<Link
href="/offerte-anfragen"
className="px-6 py-3 bg-indigo-500 hover:bg-indigo-600 rounded-xl text-white font-medium"
>
Offerte anfragen
</Link>

</Container>

</section>

)

}