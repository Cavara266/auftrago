import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const firma = String(body.firma || "").trim();
    const kontaktperson = String(body.kontaktperson || "").trim();
    const telefon = String(body.telefon || "").trim();
    const email = String(body.email || "").trim();
    const website = String(body.website || "").trim();
    const ort = String(body.ort || "").trim();
    const leistungen = String(body.leistungen || "").trim();
    const nachricht = String(body.nachricht || "").trim();

    if (!firma || !kontaktperson || !telefon || !email || !ort || !leistungen) {
      return NextResponse.json(
        { ok: false, error: "Bitte alle Pflichtfelder ausfüllen." },
        { status: 400 }
      );
    }

    console.log("NEUE ANBIETER-ANFRAGE:", {
      firma,
      kontaktperson,
      telefon,
      email,
      website,
      ort,
      leistungen,
      nachricht,
    });

    return NextResponse.json({
      ok: true,
      message: "Anbieter-Anfrage erfolgreich empfangen.",
    });
  } catch (error) {
    console.error("ANBIETER ANFRAGE ERROR:", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Anbieter-Anfrage konnte nicht verarbeitet werden.",
      },
      { status: 500 }
    );
  }
}