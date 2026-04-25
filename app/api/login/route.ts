import { NextResponse } from "next/server";
import { setSessionUser } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const email = String(body.email ?? "info@cavara-hauswartung.ch");

    const session = await setSessionUser({
      id: "demo-user",
      email,
      name: "Auftrago Admin",
      role: "admin",
      credits: 999, // ✅ DAS HAT GEFEHLT
    });

    return NextResponse.json({
      ok: true,
      session,
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);

    return NextResponse.json(
      { ok: false, error: "Login fehlgeschlagen" },
      { status: 500 }
    );
  }
}