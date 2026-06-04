import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "").trim();

    if (!email || !password) {
      return NextResponse.json(
        { ok: false, error: "E-Mail und Passwort erforderlich." },
        { status: 400 }
      );
    }

    const provider = await prisma.provider.findUnique({
      where: { email },
    });

    if (!provider || provider.password !== password) {
      return NextResponse.json(
        { ok: false, error: "Login fehlgeschlagen." },
        { status: 401 }
      );
    }

    const res = NextResponse.json({
      ok: true,
      provider: {
        id: provider.id,
        email: provider.email,
        companyName: provider.companyName,
        contactName: provider.contactName,
        credits: provider.credits,
      },
    });

    res.cookies.set("auftrago_session", provider.id, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return res;
  } catch (error) {
    console.error("LOGIN ERROR:", error);

    return NextResponse.json(
      { ok: false, error: "Serverfehler." },
      { status: 500 }
    );
  }
}