// app/api/me/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET() {
  const user = await auth();
  return NextResponse.json({ user });
}