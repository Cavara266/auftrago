import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const email = String(data.email || "").trim().toLowerCase();
    const password = String(data.password || "");
    const companyName = String(data.companyName || "").trim();
    const contactName = String(data.contactName || "").trim();
    const phone = String(data.phone || "").trim();
    const region = String(data.region || "").trim();
    const category = String(data.category || "").trim();

    if (
      !email ||
      !password ||
      !companyName ||
      !contactName ||
      !region ||
      !category
    ) {
      return NextResponse.json(
        { ok: false, error: "Bitte alle Pflichtfelder ausfüllen." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { ok: false, error: "Das Passwort muss mindestens 6 Zeichen haben." },
        { status: 400 }
      );
    }

    const existingProvider = await prisma.provider.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
      },
    });

    if (existingProvider) {
      return NextResponse.json(
        { ok: false, error: "Diese E-Mail ist bereits registriert." },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const provider = await prisma.provider.create({
      data: {
        email,
        password: passwordHash,
        companyName,
        contactName,
        phone: phone || null,
        region,
        category,
        credits: 0,
      },
      select: {
        id: true,
        email: true,
        companyName: true,
        contactName: true,
        phone: true,
        region: true,
        category: true,
        credits: true,
      },
    });

    return NextResponse.json({
      ok: true,
      provider,
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);

    return NextResponse.json(
      { ok: false, error: "Registrierung fehlgeschlagen." },
      { status: 500 }
    );
  }
}