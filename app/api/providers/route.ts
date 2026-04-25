import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const provider = await prisma.provider.create({
      data: {
        companyName: String(body.companyName ?? body.name ?? "").trim(),
        contactName: String(body.contactName ?? body.name ?? "").trim(),
        email: String(body.email ?? "").trim().toLowerCase(),
        phone: String(body.phone ?? "").trim(),
        website: String(body.website ?? "").trim(),
        region: String(body.region ?? body.city ?? "").trim(),
        services: String(body.services ?? body.description ?? "").trim(),
        status: "pending",
      } as any,
    });

    return NextResponse.json({
      ok: true,
      provider,
    });
  } catch (error) {
    console.error("PROVIDER CREATE ERROR:", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Anbieter konnte nicht gespeichert werden.",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    message: "Provider API läuft.",
  });
}