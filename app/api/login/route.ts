import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");

    if (!email || !password) {
      return NextResponse.json(
        { ok: false, error: "E-Mail und Passwort erforderlich." },
        { status: 400 }
      );
    }

    const provider = await prisma.provider.findUnique({
      where: {
        email,
      },
    });

    if (!provider) {
      return NextResponse.json(
        { ok: false, error: "Login fehlgeschlagen." },
        { status: 401 }
      );
    }

    const passwordIsValid = await bcrypt.compare(
      password,
      provider.password
    );

    if (!passwordIsValid) {
      return NextResponse.json(
        { ok: false, error: "Login fehlgeschlagen." },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      ok: true,
      provider: {
        id: provider.id,
        email: provider.email,
        companyName: provider.companyName,
        contactName: provider.contactName,
        credits: provider.credits,
      },
    });

    response.cookies.set("auftrago_session", provider.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error("LOGIN ERROR:", error);

    return NextResponse.json(
      { ok: false, error: "Serverfehler." },
      { status: 500 }
    );
  }
}