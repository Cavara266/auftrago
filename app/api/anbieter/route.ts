import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const companyName = String(body.company || "").trim();
    const contactName = String(body.contact || "").trim();
    const email = String(body.email || "").trim();
    const phone = String(body.phone || "").trim();
    const website = String(body.website || "").trim();
    const region = String(body.region || "").trim();
    const services = String(body.services || "").trim();

    if (!companyName || !contactName || !email || !region || !services) {
      return NextResponse.json(
        { ok: false, error: "Bitte alle Pflichtfelder ausfüllen." },
        { status: 400 }
      );
    }

    await prisma.provider.upsert({
      where: { email },
      update: {
        companyName,
        contactName,
        phone,
        region,
        category: services,
      },
      create: {
        email,
        password: "pending",
        companyName,
        contactName,
        phone,
        region,
        category: services,
        credits: 0,
      },
    });

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === "true",
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
        <p><b>Firma:</b> ${companyName}</p>
        <p><b>Name:</b> ${contactName}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Telefon:</b> ${phone}</p>
        <p><b>Website:</b> ${website}</p>
        <p><b>Region:</b> ${region}</p>
        <p><b>Dienstleistungen:</b> ${services}</p>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { ok: false, error: "Serverfehler" },
      { status: 500 }
    );
  }
}