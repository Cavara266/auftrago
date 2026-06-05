import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const adminPassword = process.env.ADMIN_PASSWORD;
  const adminSecret = process.env.ADMIN_SECRET;

  if (!adminPassword || !adminSecret) {
    return NextResponse.json(
      { ok: false, error: "Admin Login ist nicht konfiguriert." },
      { status: 500 }
    );
  }

  const body = await req.json();
  const password = String(body.password || "");

  if (password !== adminPassword) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });

  response.cookies.set("auftrago_admin", adminSecret, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  });

  return response;
}