import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
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

function getMailConfiguration() {
  const host = process.env.MAIL_HOST || process.env.SMTP_HOST;
  const port = Number(
    process.env.MAIL_PORT || process.env.SMTP_PORT || 587
  );
  const user = process.env.MAIL_USER || process.env.SMTP_USER;
  const pass = process.env.MAIL_PASS || process.env.SMTP_PASS;
  const from = process.env.MAIL_FROM || user;
  const adminTo = process.env.MAIL_TO;

  if (!host || !user || !pass || !from || !adminTo) {
    return null;
  }

  return {
    host,
    port,
    user,
    pass,
    from,
    adminTo,
  };
}

async function sendRegistrationEmails(data: {
  companyName: string;
  contactName: string;
  phone: string;
  email: string;
  website: string;
  region: string;
  services: string;
  message: string;
}) {
  const mailConfiguration = getMailConfiguration();

  if (!mailConfiguration) {
    console.warn(
      "Provider wurde gespeichert, aber die Mail-Konfiguration fehlt."
    );
    return;
  }

  const transporter = nodemailer.createTransport({
    host: mailConfiguration.host,
    port: mailConfiguration.port,
    secure: mailConfiguration.port === 465,
    auth: {
      user: mailConfiguration.user,
      pass: mailConfiguration.pass,
    },
  });

  await transporter.sendMail({
    from: mailConfiguration.from,
    to: mailConfiguration.adminTo,
    replyTo: data.email,
    subject: `Neue Anbieter-Registrierung: ${data.companyName}`,
    text: `
Neue Anbieter-Registrierung über Auftrago

STATUS
Ausstehend – persönliche Prüfung erforderlich

FIRMA
Firmenname: ${fallback(data.companyName)}
Kontaktperson: ${fallback(data.contactName)}
Telefon: ${fallback(data.phone)}
E-Mail: ${fallback(data.email)}
Website: ${fallback(data.website)}

EINSATZGEBIET
Ort / Region: ${fallback(data.region)}

DIENSTLEISTUNGEN
${fallback(data.services)}

NACHRICHT
${fallback(data.message)}

ADMINBEREICH
https://auftrago.ch/admin/providers
    `.trim(),
  });

  await transporter.sendMail({
    from: mailConfiguration.from,
    to: data.email,
    replyTo: mailConfiguration.adminTo,
    subject: "Deine Registrierung bei Auftrago",
    text: `
Guten Tag ${data.contactName}

Vielen Dank für die Registrierung deiner Firma ${data.companyName} bei Auftrago.

Wir prüfen jede Anbieteranmeldung persönlich. Dein Konto befindet sich momentan im Status „Ausstehend“.

Sobald deine Firma freigegeben wurde, erhältst du von uns eine weitere E-Mail. Danach kannst du dich anmelden, Credits kaufen und passende Kundenanfragen freischalten.

Du musst dich aktuell um nichts Weiteres kümmern.

Freundliche Grüsse

Auftrago
Die Schweizer Plattform für regionale Dienstleistungen
https://auftrago.ch
    `.trim(),
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const companyName = clean(body.companyName);
    const contactName = clean(body.contactName);
    const email = clean(body.email).toLowerCase();
    const phone = clean(body.phone);
    const password = String(body.password || "");
    const website = clean(body.website);
    const region = clean(body.region);
    const category = clean(body.services || body.category);
    const description = clean(body.message);

    if (
      !companyName ||
      !contactName ||
      !phone ||
      !email ||
      !password ||
      !region ||
      !category
    ) {
      return NextResponse.json(
        {
          ok: false,
          error: "Bitte alle Pflichtfelder ausfüllen.",
        },
        {
          status: 400,
        }
      );
    }

    if (!email.includes("@")) {
      return NextResponse.json(
        {
          ok: false,
          error: "Bitte eine gültige E-Mail-Adresse eingeben.",
        },
        {
          status: 400,
        }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        {
          ok: false,
          error: "Das Passwort muss mindestens 8 Zeichen lang sein.",
        },
        {
          status: 400,
        }
      );
    }

    const existingProvider = await prisma.provider.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        status: true,
      },
    });

    if (existingProvider) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Für diese E-Mail-Adresse besteht bereits ein Anbieterkonto. Bitte verwende den Login oder kontaktiere Auftrago.",
        },
        {
          status: 409,
        }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const provider = await prisma.provider.create({
      data: {
        email,
        password: passwordHash,
        companyName,
        contactName,
        phone,
        website: website || null,
        region,
        category,
        description: description || null,
        credits: 0,
        status: "PENDING",
      },
      select: {
        id: true,
        email: true,
        companyName: true,
        contactName: true,
        status: true,
      },
    });

    try {
      await sendRegistrationEmails({
        companyName,
        contactName,
        phone,
        email,
        website,
        region,
        services: category,
        message: description,
      });
    } catch (mailError) {
      console.error("PROVIDER REGISTRATION MAIL ERROR:", mailError);
    }

    return NextResponse.json(
      {
        ok: true,
        providerId: provider.id,
        status: provider.status,
        message:
          "Dein Anbieterkonto wurde erstellt und wird von Auftrago geprüft.",
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("PROVIDER CREATE ERROR:", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Das Anbieterkonto konnte nicht erstellt werden.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    {
      ok: false,
      error: "Nicht erlaubt.",
    },
    {
      status: 405,
    }
  );
}