import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const name = String(data.name || "").trim();
    const phone = String(data.phone || "").trim();
    const region = String(data.region || "").trim();
    const email = String(data.email || "").trim();
    const service = String(data.service || "").trim();
    const start = String(data.start || "").trim();
    const message = String(data.message || "").trim();

    if (!name || !phone || !region || !email || !service || !start || !message) {
      return NextResponse.json(
        { ok: false, error: "Bitte alle Pflichtfelder ausfüllen." },
        { status: 400 }
      );
    }

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

      return NextResponse.json(
        { ok: false, error: "Mail-Konfiguration fehlt." },
        { status: 500 }
      );
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

Name: ${name}
Telefon: ${phone}
E-Mail: ${email}
Ort / Region: ${region}
Dienstleistung: ${service}
Start: ${start}

Beschreibung:
${message}
      `.trim(),
    });

    console.log("ANFRAGE MAIL SENT", {
      to: mailTo,
      service,
      region,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("ANFRAGE MAIL ERROR:", error);

    return NextResponse.json(
      { ok: false, error: "Anfrage konnte nicht gesendet werden." },
      { status: 500 }
    );
  }
}