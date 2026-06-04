import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  if (body.password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json(
      { ok: false },
      { status: 401 }
    );
  }

  const res = NextResponse.json({ ok: true });

  res.cookies.set("auftrago_admin", process.env.ADMIN_SECRET || "", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  });

  return res;
}