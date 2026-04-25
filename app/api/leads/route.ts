import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const lead = await prisma.lead.create({
      data: {
        name: String(body.name ?? "").trim(),
        email: String(body.email ?? "").trim().toLowerCase(),
        phone: String(body.phone ?? "").trim(),
        city: String(body.city ?? "").trim(),
        category: String(body.service ?? body.category ?? "").trim(),
        description: String(body.description ?? "").trim(),
      },
    });

    return NextResponse.json({
      ok: true,
      lead,
    });
  } catch (error) {
    console.error("LEAD CREATE ERROR:", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Lead konnte nicht gespeichert werden.",
      },
      { status: 500 }
    );
  }
}