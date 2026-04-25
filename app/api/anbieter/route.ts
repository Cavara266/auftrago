import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.MAIL_FROM,
      to: process.env.MAIL_TO,
      subject: "Neue Anbieter Anfrage",
      html: `
        <h2>Neue Anbieter Anfrage</h2>
        <p><b>Firma:</b> ${body.company}</p>
        <p><b>Name:</b> ${body.contact}</p>
        <p><b>Email:</b> ${body.email}</p>
        <p><b>Telefon:</b> ${body.phone}</p>
        <p><b>Website:</b> ${body.website}</p>
        <p><b>Region:</b> ${body.region}</p>
        <p><b>Dienstleistungen:</b> ${body.services}</p>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ ok: false });
  }
}