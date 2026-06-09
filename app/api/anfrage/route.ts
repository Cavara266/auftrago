import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { prisma } from "@/lib/prisma";

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

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const name = clean(data.name);
    const phone = clean(data.phone);
    const email = clean(data.email);

    const salutation = clean(data.salutation);
    const street = clean(data.street);
    const postalCode = clean(data.postalCode);
    const city = clean(data.city);
    const region = clean(data.region);

    const service = clean(data.service);
    const start = clean(data.start);
    const flexibleDate = clean(data.flexibleDate);
    const viewingWanted = clean(data.viewingWanted);
    const phoneAvailability = clean(data.phoneAvailability);

    const objectType = clean(data.objectType);
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
    const offersWanted = clean(data.offersWanted);
    const important = clean(data.important);
    const message = clean(data.message);

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

    if (
      !name ||
      !phone ||
      !email ||
      !salutation ||
      !street ||
      !postalCode ||
      !city ||
      !region ||
      !service ||
      !start ||
      !flexibleDate ||
      !viewingWanted ||
      !phoneAvailability ||
      !objectType ||
      !propertyType ||
      !message
    ) {
      return NextResponse.json(
        { ok: false, error: "Bitte alle Pflichtfelder ausfüllen." },
        { status: 400 }
      );
    }

    const title = `${service} ${region}`;
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
${service} in ${city}

AUFTRAG
Dienstleistung: ${service}
Region: ${region}
Ort: ${city}
PLZ: ${postalCode}
Adresse: ${street}
Gewünschter Start / Datum: ${start}
Flexibles Datum: ${flexibleDate}
Besichtigung erwünscht: ${viewingWanted}
Gewünschte Angebote: ${offersWanted || "Nicht angegeben"}
Wichtig für Kunde: ${important || "Nicht angegeben"}
Budget / Preisvorstellung: ${budget || "Nicht angegeben"}

OBJEKT
Objekt: ${objectType}
Objektart: ${propertyType}
Fläche: ${area || "Nicht angegeben"}
Zimmer: ${rooms || "Nicht angegeben"}
Etage: ${floor || "Nicht angegeben"}
Lift: ${elevator || "Nicht angegeben"}
Parkplatz: ${parking || "Nicht angegeben"}
Abgabegarantie: ${handoverGuarantee || "Nicht angegeben"}
Keller: ${cellar || "Nicht angegeben"}
Balkon: ${balcony || "Nicht angegeben"}

FENSTER / SPEZIALDETAILS
Anzahl Fenster: ${windows || "Nicht angegeben"}
Fenstergrösse: ${windowSize || "Nicht angegeben"}
Lamellenstoren: ${blinds || "Nicht angegeben"}
Fensterläden: ${shutters || "Nicht angegeben"}
Teppichreinigung: ${carpetCleaning || "Nicht angegeben"}

BESCHREIBUNG
${message}

${trackingText}
`.trim();

    await prisma.lead.create({
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

    const mailHost = process.env.MAIL_HOST;
    const mailPort = Number(process.env.MAIL_PORT || 587);
    const mailUser = process.env.MAIL_USER;
    const mailPass = process.env.MAIL_PASS;
    const mailTo = process.env.MAIL_TO;

    if (!mailHost || !mailUser || !mailPass || !mailTo) {
      console.error("ANFRAGE MAIL CONFIG MISSING", {
        hasMailHost: Boolean(mailHost),
        hasMailUser: Boolean(mailUser),
        hasMailPass: Boolean(mailPass),
        hasMailTo: Boolean(mailTo),
      });

      return NextResponse.json({
        ok: true,
        warning: "Lead gespeichert, aber Mail-Konfiguration fehlt.",
      });
    }

    const transporter = nodemailer.createTransport({
      host: mailHost,
      port: mailPort,
      secure: mailPort === 465,
      auth: {
        user: mailUser,
        pass: mailPass,
      },
    });

    await transporter.verify();

    await transporter.sendMail({
      from: `"Auftrago Anfrage" <${mailUser}>`,
      to: mailTo,
      replyTo: email,
      subject: `Neue Auftrago Anfrage: ${service} in ${region}`,
      text: `
Neue Anfrage über Auftrago

KONTAKT
Anrede: ${salutation}
Name: ${name}
Telefon: ${phone}
Erreichbarkeit: ${phoneAvailability}
E-Mail: ${email}

ADRESSE
Adresse: ${street}
PLZ / Ort: ${postalCode} ${city}
Region: ${region}

${description}

Leadpreis im Portal: ${price} Credits
      `.trim(),
    });

    console.log("ANFRAGE SAVED AND MAIL SENT", {
      to: mailTo,
      service,
      region,
      price,
      landingPage,
      utmSource,
      utmMedium,
      utmCampaign,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("ANFRAGE ERROR:", error);

    return NextResponse.json(
      { ok: false, error: "Anfrage konnte nicht gesendet werden." },
      { status: 500 }
    );
  }
}