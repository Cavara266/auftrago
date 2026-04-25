import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
}

export async function POST(req: Request) {

  const body = await req.json()

  const provider = await prisma.provider.create({
    data: {
      name: body.name,
      city: body.city,
      description: body.description,
      slug: slugify(body.name)
    }
  })

  return NextResponse.json(provider)
}