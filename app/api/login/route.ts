import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { setSessionUser } from "@/lib/auth";
import bcrypt from "bcryptjs";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);

    const email = String(body?.email ?? "")
      .trim()
      .toLowerCase();

    const password = String(body?.password ?? "");

    if (!email || !password) {
      return NextResponse.json(
        { ok: false, error: "Bitte E-Mail und Passwort eingeben." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        passwordHash: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { ok: false, error: "Login fehlgeschlagen." },
        { status: 401 }
      );
    }

    const ok = await bcrypt.compare(password, user.passwordHash);

    if (!ok) {
      return NextResponse.json(
        { ok: false, error: "Login fehlgeschlagen." },
        { status: 401 }
      );
    }

    await setSessionUser(user.id);

    return NextResponse.json({
      ok: true,
      redirectTo: "/dashboard",
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);

    return NextResponse.json(
      { ok: false, error: "Serverfehler." },
      { status: 500 }
    );
  }
}