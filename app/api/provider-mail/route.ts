import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function clean(value: unknown) {
  return String(value || "").trim();
}

function fallback(value: string, fallbackText = "Nicht angegeben") {
  return value || fallbackText;
}

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const companyName = clean(data.companyName);
    const contactName = clean(data.contactName);
    const phone = clean(data.phone);
    const email = clean(data.email);
    const website = clean(data.website);
    const region = clean(data.region);
    const services = clean(data.services);
    const message = clean(data.message);

    if (!companyName || !contactName || !phone || !email || !region || !services) {
      return NextResponse.json(
        { ok: false, error: "Bitte alle Pflichtfelder ausfüllen." },
        { status: 400 }
      );
    }

    const mailHost = process.env.MAIL_HOST || process.env.SMTP_HOST;
    const mailPort = Number(process.env.MAIL_PORT || process.env.SMTP_PORT || 587);
    const mailUser = process.env.MAIL_USER || process.env.SMTP_USER;
    const mailPass = process.env.MAIL_PASS || process.env.SMTP_PASS;
    const mailTo = process.env.MAIL_TO;
    const mailFrom = process.env.MAIL_FROM || mailUser;

    if (!mailHost || !mailUser || !mailPass || !mailTo || !mailFrom) {
      throw new Error("Mail-Konfiguration fehlt.");
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

    await transporter.sendMail({
      from: mailFrom,
      to: mailTo,
      replyTo: email || mailFrom,
      subject: `Neue Anbieter-Registrierung: ${companyName}`,
      text: `
Neue Anbieter-Registrierung über Auftrago

FIRMA
Firmenname: ${fallback(companyName)}
Kontaktperson: ${fallback(contactName)}
Telefon: ${fallback(phone)}
E-Mail: ${fallback(email)}
Website: ${fallback(website)}

EINSATZGEBIET
Ort / Region: ${fallback(region)}

DIENSTLEISTUNGEN
${fallback(services)}

NACHRICHT
${fallback(message)}
      `.trim(),
    });

    return NextResponse.json({
      ok: true,
      mailSent: true,
    });
  } catch (error) {
    console.error("PROVIDER MAIL ERROR:", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Anbieter-Mail konnte nicht gesendet werden.",
      },
      { status: 500 }
    );
  }
}