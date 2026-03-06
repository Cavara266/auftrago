import { NextResponse } from "next/server";
import { clearSessionUser } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST() {
  await clearSessionUser();

  return NextResponse.json({ ok: true });
}