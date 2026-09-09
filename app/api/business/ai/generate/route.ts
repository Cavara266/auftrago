import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Nicht angemeldet." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const prompt = String(body.prompt || "").trim();

    if (!prompt) {
      return NextResponse.json(
        { error: "Beschreibung fehlt." },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            "OPENAI_API_KEY fehlt. Die AI-Seite funktioniert, aber der AI-Schlüssel muss noch hinterlegt werden.",
        },
        { status: 500 }
      );
    }

    const aiResponse = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          temperature: 0.3,
          response_format: {
            type: "json_object",
          },
          messages: [
            {
              role: "system",
              content:
                "Du bist Auftrago Business AI für Schweizer Dienstleistungsunternehmen. Erstelle aus der Benutzerbeschreibung eine professionelle Offertengrundlage. Antworte ausschließlich als JSON mit: title string, customerName string, description string, price number, positions Array mit description string, quantity number, unit string, price number. Preise sind CHF inklusive sinnvollem marktnahem Vorschlag. Keine Markdown-Ausgabe.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
        }),
      }
    );

    const data = await aiResponse.json();

    if (!aiResponse.ok) {
      console.error("OPENAI ERROR", data);

      return NextResponse.json(
        {
          error:
            data?.error?.message ||
            "AI-Anfrage fehlgeschlagen.",
        },
        { status: 500 }
      );
    }

    const content =
      data?.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error(
        "AI hat keine Antwort geliefert."
      );
    }

    const result = JSON.parse(content);

    return NextResponse.json({
      ok: true,
      result,
    });
  } catch (error) {
    console.error("BUSINESS AI ERROR", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "AI konnte nicht ausgeführt werden.",
      },
      { status: 500 }
    );
  }
}
