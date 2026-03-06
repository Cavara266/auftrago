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

    const website = String(body.website ?? "").trim();
    const formStartedAt = Number(body.formStartedAt ?? 0);

    if (website) {
      return NextResponse.json({ ok: true });
    }

    const submittedTooFast =
      Number.isFinite(formStartedAt) &&
      formStartedAt > 0 &&
      Date.now() - formStartedAt < 2500;

    if (submittedTooFast) {
      return NextResponse.json(
        { ok: false, error: "Anfrage konnte nicht verarbeitet werden." },
        { status: 400 }
      );
    }

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

    if (description.length < 10) {
      return NextResponse.json(
        { ok: false, error: "Bitte die Anfrage etwas genauer beschreiben." },
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
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
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
        error: error instanceof Error ? error.message : "Serverfehler.",
      },
      { status: 500 }
    );
  }
}