import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {

  const body = await req.json()

  const lead = await prisma.lead.create({
    data: {
      name: body.name,
      email: body.email,
      phone: body.phone,
      service: body.service,
      city: body.city,
      description: body.description,
    },
  })

  return NextResponse.json(lead)
}