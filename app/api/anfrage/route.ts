import { NextResponse } from "next/server";
import { Resend } from "resend";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function clean(value: unknown) {
  return String(value || "").trim();
}

function fallback(value: string, fallbackText = "Nicht angegeben") {
  return value || fallbackText;
}

function calculateLeadPrice(service: string, budget: string) {
  const text = `${service} ${budget}`.toLowerCase();

  if (
    text.includes("umzug") ||
    text.includes("umzugsreinigung") ||
    text.includes("hauswartung") ||
    text.includes("maler")
  ) {
    return 35;
  }

  if (
    text.includes("sanitär") ||
    text.includes("elektriker") ||
    text.includes("transport") ||
    text.includes("entsorgung")
  ) {
    return 25;
  }

  if (
    text.includes("fenster") ||
    text.includes("reinigung") ||
    text.includes("garten")
  ) {
    return 20;
  }

  return 20;
}

function isProviderText(text: string) {
  const value = text.toLowerCase();

  const blockedWords = [
    "ich biete",
    "wir bieten",
    "meine dienstleistungen",
    "unsere dienstleistungen",
    "gerne erstelle ich ihnen eine offerte",
    "zuverlässig, sauber",
    "faire preise",
    "kurzfristige einsätze",
    "handwerks- und dienstleistungen",
  ];

  return blockedWords.some((word) => value.includes(word));
}

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const name = clean(data.name || data.firma);
    const phone = clean(data.phone || data.telefon);
    const email = clean(data.email);

    const salutation = clean(data.salutation);
    const street = clean(data.street);
    const postalCode = clean(data.postalCode);
    const city = clean(data.city || data.stadt);
    const region = clean(data.region || data.stadt);

    const service = clean(data.service || data.leistung);
    const start = clean(data.start);
    const flexibleDate = clean(data.flexibleDate);
    const viewingWanted = clean(data.viewingWanted);
    const phoneAvailability = clean(data.phoneAvailability);

    const objectType = clean(data.objectType || data.objekt);
    const propertyType = clean(data.propertyType);
    const floor = clean(data.floor);
    const elevator = clean(data.elevator);
    const parking = clean(data.parking);

    const rooms = clean(data.rooms);
    const area = clean(data.area);
    const windows = clean(data.windows);
    const windowSize = clean(data.windowSize);
    const blinds = clean(data.blinds);
    const shutters = clean(data.shutters);

    const handoverGuarantee = clean(data.handoverGuarantee);
    const cellar = clean(data.cellar);
    const balcony = clean(data.balcony);
    const carpetCleaning = clean(data.carpetCleaning);

    const budget = clean(data.budget);
    const offersWanted = clean(data.offersWanted || data.haeufigkeit);
    const important = clean(data.important);
    const message = clean(data.message || data.beschreibung);

    const referer = clean(req.headers.get("referer"));
    const userAgent = clean(req.headers.get("user-agent"));

    const landingPage = clean(data.landingPage) || referer;
    const currentPage = clean(data.currentPage);
    const utmSource = clean(data.utmSource);
    const utmMedium = clean(data.utmMedium);
    const utmCampaign = clean(data.utmCampaign);
    const utmTerm = clean(data.utmTerm);
    const utmContent = clean(data.utmContent);
    const gclid = clean(data.gclid);
    const fbclid = clean(data.fbclid);

    if (!name || !phone || !region || !service || !message) {
      return NextResponse.json(
        { ok: false, success: false, error: "Bitte alle Pflichtfelder ausfüllen." },
        { status: 400 }
      );
    }

    if (isProviderText(`${service} ${message} ${important}`)) {
      return NextResponse.json(
        {
          ok: false,
          success: false,
          error:
            "Anbieter-Anmeldungen bitte über die Anbieter-Registrierung senden.",
        },
        { status: 400 }
      );
    }

    const safeCity = city || region || "Schweiz";
    const title = `${service} in ${safeCity}`;
    const price = calculateLeadPrice(service, budget);

    const trackingText = `
TRACKING
Landingpage: ${fallback(landingPage)}
Aktuelle Seite: ${fallback(currentPage)}
Referer: ${fallback(referer)}
UTM Source: ${fallback(utmSource)}
UTM Medium: ${fallback(utmMedium)}
UTM Campaign: ${fallback(utmCampaign)}
UTM Term: ${fallback(utmTerm)}
UTM Content: ${fallback(utmContent)}
Google Click ID: ${fallback(gclid)}
Facebook Click ID: ${fallback(fbclid)}
User Agent: ${fallback(userAgent)}
`.trim();

    const description = `
${service} in ${safeCity}

AUFTRAG
Dienstleistung: ${fallback(service)}
Region: ${fallback(region)}
Ort: ${fallback(city)}
PLZ: ${fallback(postalCode)}
Adresse: ${fallback(street)}
Gewünschter Start / Datum: ${fallback(start)}
Flexibles Datum: ${fallback(flexibleDate)}
Besichtigung erwünscht: ${fallback(viewingWanted)}
Gewünschte Angebote / Häufigkeit: ${fallback(offersWanted)}
Wichtig für Kunde: ${fallback(important)}
Budget / Preisvorstellung: ${fallback(budget)}

OBJEKT
Objekt: ${fallback(objectType)}
Objektart: ${fallback(propertyType)}
Fläche: ${fallback(area)}
Zimmer: ${fallback(rooms)}
Etage: ${fallback(floor)}
Lift: ${fallback(elevator)}
Parkplatz: ${fallback(parking)}
Abgabegarantie: ${fallback(handoverGuarantee)}
Keller: ${fallback(cellar)}
Balkon: ${fallback(balcony)}

FENSTER / SPEZIALDETAILS
Anzahl Fenster: ${fallback(windows)}
Fenstergrösse: ${fallback(windowSize)}
Lamellenstoren: ${fallback(blinds)}
Fensterläden: ${fallback(shutters)}
Teppichreinigung: ${fallback(carpetCleaning)}

BESCHREIBUNG
${fallback(message)}

${trackingText}
`.trim();

    const lead = await prisma.lead.create({
      data: {
        title,
        description,
        name,
        email,
        phone,
        region,
        category: service,
        price,
      },
    });

    let mailSent = false;
    let mailError = "";

    try {
      const apiKey = process.env.RESEND_API_KEY;

      if (!apiKey) {
        throw new Error("RESEND_API_KEY fehlt.");
      }

      const resend = new Resend(apiKey);

      const mailTo = process.env.CONTACT_EMAIL || "info@auftrago.ch";
      const mailFrom =
        process.env.FROM_EMAIL || "Auftrago <info@auftrago.ch>";

      const info = await resend.emails.send({
        from: mailFrom,
        to: mailTo,
        replyTo: email || "info@auftrago.ch",
        subject: `Neue Auftrago Anfrage: ${service} in ${safeCity}`,
        text: `
Neue Anfrage über Auftrago

KONTAKT
Anrede: ${fallback(salutation)}
Name / Firma: ${fallback(name)}
Telefon: ${fallback(phone)}
Erreichbarkeit: ${fallback(phoneAvailability)}
E-Mail: ${fallback(email)}

ADRESSE
Adresse: ${fallback(street)}
PLZ / Ort: ${fallback(postalCode)} ${fallback(city)}
Region: ${fallback(region)}

${description}

Leadpreis im Portal: ${price} Credits
Lead-ID: ${lead.id}
        `.trim(),
      });

      console.log("ANFRAGE RESEND INFO:", info);
      mailSent = true;
    } catch (error) {
      mailError = error instanceof Error ? error.message : "Mailfehler";
      console.error("ANFRAGE RESEND ERROR:", error);
    }

    return NextResponse.json({
      ok: true,
      success: true,
      leadId: lead.id,
      mailSent,
      warning: mailSent
        ? null
        : `Lead gespeichert, aber Mail nicht gesendet: ${mailError}`,
    });
  } catch (error) {
    console.error("ANFRAGE ERROR:", error);

    return NextResponse.json(
      {
        ok: false,
        success: false,
        error: "Anfrage konnte nicht gespeichert werden.",
      },
      { status: 500 }
    );
  }
}