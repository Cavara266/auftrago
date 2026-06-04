import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const companyName = String(body.companyName ?? body.company ?? "").trim();
    const contactName = String(body.contactName ?? body.contact ?? "").trim();
    const email = String(body.email ?? "").trim().toLowerCase();
    const phone = String(body.phone ?? body.telefon ?? "").trim();
    const region = String(body.region ?? body.ort ?? "").trim();
    const category = String(body.services ?? body.leistungen ?? body.category ?? "").trim();

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
        region,
        category,
      },
      create: {
        email,
        password: "pending",
        companyName,
        contactName,
        phone,
        region,
        category,
        credits: 0,
      },
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