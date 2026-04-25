"use client"

import {useState} from "react"
import {services,cities} from "@/lib/seo-data"

export default function RequestForm(){

const[done,setDone]=useState(false)

function submit(e:any){
e.preventDefault()
setDone(true)
}

if(done){

return(
<div className="bg-green-500/20 border border-green-500/40 p-6 rounded-xl text-white">
Anfrage gesendet.
</div>
)

}

return(

<form onSubmit={submit} className="space-y-6">

<select required className="w-full p-3 rounded-lg bg-white/10 text-white">

{services.map(s=>(
<option key={s.slug}>{s.name}</option>
))}

</select>

<select required className="w-full p-3 rounded-lg bg-white/10 text-white">

{cities.map(c=>(
<option key={c.slug}>{c.name}</option>
))}

</select>

<textarea
required
placeholder="Beschreibe deinen Auftrag"
className="w-full p-3 rounded-lg bg-white/10 text-white"
/>

<input
required
type="email"
placeholder="E-Mail"
className="w-full p-3 rounded-lg bg-white/10 text-white"
/>

<button className="w-full py-3 bg-indigo-500 rounded-xl text-white">
Offerte anfragen
</button>

</form>

)

}