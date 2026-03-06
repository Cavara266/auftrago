import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);

    const companyName = String(body?.companyName ?? "").trim();
    const phone = String(body?.phone ?? "").trim();
    const city = String(body?.city ?? "").trim();
    const email = String(body?.email ?? "")
      .trim()
      .toLowerCase();
    const password = String(body?.password ?? "").trim();

    if (!companyName || !phone || !city || !email || !password) {
      return NextResponse.json(
        { ok: false, error: "Bitte alle Felder ausfüllen." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { ok: false, error: "Das Passwort muss mindestens 6 Zeichen haben." },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existingUser) {
      return NextResponse.json(
        { ok: false, error: "Diese E-Mail ist bereits registriert." },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        companyName,
        phone,
        city,
        email,
        passwordHash,
        credits: 0,
      },
      select: {
        id: true,
        email: true,
        companyName: true,
        phone: true,
        city: true,
      },
    });

    return NextResponse.json({
      ok: true,
      user,
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);

    return NextResponse.json(
      { ok: false, error: "Serverfehler." },
      { status: 500 }
    );
  }
}