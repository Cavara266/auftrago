import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import nodemailer from "nodemailer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const name = String(body.name ?? "").trim();
    const phone = String(body.phone ?? "").trim();
    const email = String(body.email ?? "").trim().toLowerCase();
    const city = String(body.city ?? "").trim();
    const category = String(body.category ?? "").trim();
    const objectType = String(body.objectType ?? "").trim();
    const startDate = String(body.startDate ?? "").trim();
    const frequency = String(body.frequency ?? "").trim();
    const description = String(body.description ?? "").trim();
    const consent = Boolean(body.consent);

    if (!name || !phone || !city || !category || !description || !consent) {
      return NextResponse.json(
        { ok: false, error: "Bitte alle Pflichtfelder ausfüllen." },
        { status: 400 }
      );
    }

    try {
      await prisma.lead.create({
        data: {
          name,
          phone,
          email,
          city,
          category,
          description: [
            description,
            "",
            `Objekt: ${objectType || "-"}`,
            `Start: ${startDate || "-"}`,
            `Häufigkeit: ${frequency || "-"}`,
          ].join("\n"),
        },
      });
    } catch (dbError) {
      console.error("DB ERROR:", dbError);
    }

    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
      return NextResponse.json(
        { ok: false, error: "Mailserver ist nicht konfiguriert." },
        { status: 500 }
      );
    }

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
      from: process.env.MAIL_FROM || `"Auftrago" <${process.env.SMTP_USER}>`,
      to: process.env.MAIL_TO || process.env.SMTP_USER,
      replyTo: email || undefined,
      subject: `Neue ${category}-Anfrage aus ${city}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:640px;margin:auto;padding:24px;background:#f6f8fb;color:#101827">
          <div style="background:#07111f;color:white;padding:24px;border-radius:18px">
            <h1 style="margin:0 0 8px;font-size:26px">Neue Anfrage</h1>
            <p style="margin:0;color:#b8c7d9">Auftrago Lead Formular</p>
          </div>

          <div style="background:white;margin-top:18px;padding:24px;border-radius:18px">
            <h2 style="margin-top:0">Kontaktdaten</h2>
            <p><b>Name:</b> ${escapeHtml(name)}</p>
            <p><b>Telefon:</b> ${escapeHtml(phone)}</p>
            <p><b>E-Mail:</b> ${escapeHtml(email || "-")}</p>
            <p><b>Ort / Region:</b> ${escapeHtml(city)}</p>
          </div>

          <div style="background:white;margin-top:18px;padding:24px;border-radius:18px">
            <h2 style="margin-top:0">Auftrag</h2>
            <p><b>Dienstleistung:</b> ${escapeHtml(category)}</p>
            <p><b>Objekt:</b> ${escapeHtml(objectType || "-")}</p>
            <p><b>Gewünschter Start:</b> ${escapeHtml(startDate || "-")}</p>
            <p><b>Einsatzhäufigkeit:</b> ${escapeHtml(frequency || "-")}</p>
            <p><b>Beschreibung:</b></p>
            <p style="white-space:pre-line">${escapeHtml(description)}</p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("ANFRAGE API ERROR:", error);

    return NextResponse.json(
      { ok: false, error: "Anfrage konnte nicht gesendet werden." },
      { status: 500 }
    );
  }
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}