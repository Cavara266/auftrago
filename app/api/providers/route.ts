import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const companyName = String(body.companyName ?? "").trim();
    const contactName = String(body.contactName ?? "").trim();
    const email = String(body.email ?? "").trim().toLowerCase();
    const phone = String(body.phone ?? "").trim();
    const website = String(body.website ?? "").trim();
    const region = String(body.region ?? "").trim();
    const category = String(body.services ?? body.category ?? "").trim();
    const description = String(body.message ?? "").trim();

    if (!companyName || !contactName || !email || !region || !category) {
      return NextResponse.json(
        { ok: false, error: "Bitte alle Pflichtfelder ausfüllen." },
        { status: 400 }
      );
    }

    const provider = await prisma.provider.upsert({
      where: { email },
      update: {
        companyName,
        contactName,
        phone,
        website,
        region,
        category,
        description,
      },
      create: {
        email,
        password: "pending",
        companyName,
        contactName,
        phone,
        website,
        region,
        category,
        description,
        credits: 0,
      },
    });

    return NextResponse.json({
      ok: true,
      providerId: provider.id,
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
  try {
    const providers = await prisma.provider.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    return NextResponse.json({
      ok: true,
      providers,
    });
  } catch (error) {
    console.error("PROVIDER GET ERROR:", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Anbieter konnten nicht geladen werden.",
      },
      { status: 500 }
    );
  }
}