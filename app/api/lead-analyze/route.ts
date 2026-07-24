import { NextResponse } from "next/server";

import { parseLead } from "@/lib/lead-ai";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const text = String(body?.text ?? "").trim();

    if (text.length < 5) {
      return NextResponse.json(
        {
          success: false,
          error: "Bitte beschreibe den Auftrag etwas genauer.",
        },
        { status: 400 }
      );
    }

    const parsed = parseLead(text);

    return NextResponse.json({
      success: true,
      parsed,
    });
  } catch (error) {
    console.error("Lead analysis failed:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Die Anfrage konnte nicht analysiert werden.",
      },
      { status: 500 }
    );
  }
}