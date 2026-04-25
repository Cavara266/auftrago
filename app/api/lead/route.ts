import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"

export async function POST(req:Request){

const body = await req.json()

const lead = await prisma.lead.create({

data:{
category:body.category,
city:body.city,
description:body.description,

contactName:body.name,
contactPhone:body.phone,
contactEmail:body.email
}

})

return NextResponse.json(lead)

}