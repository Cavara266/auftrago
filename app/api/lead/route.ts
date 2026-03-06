// app/api/lead/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const title = String(body.title || "").trim();
    const category = String(body.category || "").trim();
    const city = String(body.city || "").trim();
    const description = String(body.description || "").trim();

    const contactName = String(body.contactName || "").trim();
    const contactPhone = String(body.contactPhone || "").trim();
    const contactEmail = String(body.contactEmail || "").trim();

    const priceCredits = Number(body.priceCredits ?? 5);

    if (!title || !category || !city || !description) {
      return new NextResponse("Bitte alle Pflichtfelder ausfüllen.", { status: 400 });
    }
    if (!contactName || !contactPhone || !contactEmail) {
      return new NextResponse("Kontaktfelder fehlen.", { status: 400 });
    }
    if (!Number.isFinite(priceCredits) || priceCredits < 1) {
      return new NextResponse("priceCredits ungültig.", { status: 400 });
    }

    const lead = await prisma.lead.create({
      data: {
        title,
        category,
        city,
        description,
        contactName,
        contactPhone,
        contactEmail,
        priceCredits,
      },
      select: { id: true },
    });

    return NextResponse.json(lead);
  } catch (e) {
    console.error(e);
    return new NextResponse("Serverfehler.", { status: 500 });
  }
}