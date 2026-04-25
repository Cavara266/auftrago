import { prisma } from "@/lib/db"
import bcrypt from "bcrypt"
import { NextResponse } from "next/server"

export async function POST(req:Request){

const data = await req.json()

const passwordHash = await bcrypt.hash(data.password,10)

const user = await prisma.user.create({

data:{
email:data.email,
passwordHash,
companyName:data.companyName,
phone:data.phone,
city:data.city
}

})

return NextResponse.json(user)

}