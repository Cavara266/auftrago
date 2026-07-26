import OpenAI from "openai";
import fs from "node:fs";

function loadEnvFile(path) {
  if (!fs.existsSync(path)) {
    return;
  }

  const content = fs.readFileSync(path, "utf8");

  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const index = trimmed.indexOf("=");

    if (index === -1) {
      continue;
    }

    const key = trimmed.slice(0, index).trim();
    let value = trimmed.slice(index + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

loadEnvFile(".env.local");

const apiKey = process.env.OPENAI_API_KEY?.trim();
const model =
  process.env.OPENAI_MODEL?.trim() || "gpt-5-mini";

if (!apiKey) {
  console.error(
    "FEHLER: OPENAI_API_KEY fehlt in .env.local"
  );
  process.exit(1);
}

console.log("OpenAI API-Key gefunden.");
console.log(`Verwendetes Modell: ${model}`);
console.log("API-Verbindung wird getestet...");

try {
  const client = new OpenAI({
    apiKey,
  });

  const response = await client.responses.create({
    model,
    instructions:
      'Antworte exakt mit dem Wort "VERBUNDEN".',
    input:
      'Teste die Verbindung und antworte nur mit "VERBUNDEN".',
    reasoning: {
      effort: "minimal",
    },
    text: {
      verbosity: "low",
    },
    max_output_tokens: 200,
  });

  console.log("");
  console.log("Response-Status:", response.status);
  console.log(
    "Unvollständig:",
    response.incomplete_details ?? "nein"
  );

  const result = response.output_text?.trim();

  if (!result) {
    console.log(
      "Komplette Output-Struktur:",
      JSON.stringify(response.output, null, 2)
    );

    throw new Error(
      "Die API-Verbindung funktioniert, aber es wurde kein sichtbarer Text zurückgegeben."
    );
  }

  console.log(`API-Antwort: ${result}`);
  console.log(
    "ERFOLG: OpenAI ist korrekt verbunden."
  );
} catch (error) {
  console.error("");
  console.error("OPENAI-TEST FEHLGESCHLAGEN");

  if (error?.status === 401) {
    console.error(
      "Der API-Key ist ungültig oder wurde nicht korrekt gespeichert."
    );
  } else if (error?.status === 429) {
    console.error(
      "Das API-Guthaben oder Nutzungslimit reicht nicht aus."
    );
  } else if (error?.status === 404) {
    console.error(
      `Das Modell "${model}" ist für dieses Projekt nicht verfügbar.`
    );
  } else {
    console.error(
      error?.message || error
    );
  }

  process.exit(1);
}
