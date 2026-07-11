import { NextResponse } from "next/server";
import { clearSession } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  try {
    await clearSession();

    return NextResponse.json({
      ok: true,
    });
  } catch (error) {
    console.error("LOGOUT ERROR:", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Abmeldung fehlgeschlagen.",
      },
      {
        status: 500,
      }
    );
  }
}