import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);

    if (!body) {
      return NextResponse.json(
        { ok: false, error: "Ungültige Anfrage." },
        { status: 400 }
      );
    }

    const name = String(body.name ?? "").trim();
    const phone = String(body.phone ?? "").trim();
    const email = String(body.email ?? "").trim().toLowerCase();
    const city = String(body.city ?? "").trim();
    const category = String(body.category ?? "").trim();
    const description = String(body.description ?? "").trim();

    if (!name || !phone || !email || !city || !category || !description) {
      return NextResponse.json(
        { ok: false, error: "Bitte alle Felder ausfüllen." },
        { status: 400 }
      );
    }

    const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!emailIsValid) {
      return NextResponse.json(
        { ok: false, error: "Bitte eine gültige E-Mail eingeben." },
        { status: 400 }
      );
    }

    const title = `${category} in ${city}`;

    const lead = await prisma.lead.create({
      data: {
        title,
        category,
        city,
        description,
        contactName: name,
        contactPhone: phone,
        contactEmail: email,
        priceCredits: 4,
      },
      select: {
        id: true,
      },
    });

    return NextResponse.json({
      ok: true,
      leadId: lead.id,
    });
  } catch (error) {
    console.error("ANFRAGE ERROR:", error);

    return NextResponse.json(
      {
        ok: false,
        error:
          process.env.NODE_ENV === "development" && error instanceof Error
            ? error.message
            : "Serverfehler.",
      },
      { status: 500 }
    );
  }
}