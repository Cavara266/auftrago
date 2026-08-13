import fs from "node:fs/promises";
import translateModule from "google-translate-api-x";

const translate =
  translateModule?.default ??
  translateModule;

const PAGE = "app/versicherungen/page.tsx";
const OUT = "lib/i18n/insurance-generated.ts";

const source = await fs.readFile(PAGE, "utf8");

const texts = new Set();

function clean(value) {
  return value
    .replace(/\s+/g, " ")
    .trim();
}

function add(value) {
  const text = clean(value);

  if (!text) return;
  if (text.length < 2) return;

  // Muss sichtbaren Sprachtext enthalten.
  if (!/[A-Za-zÄÖÜäöüß]/.test(text)) {
    return;
  }

  // Technische Inhalte ausschliessen.
  if (
    text.startsWith("/") ||
    text.startsWith("./") ||
    text.startsWith("../") ||
    text.startsWith("@/") ||
    text.includes("schema.org") ||
    text.includes("application/ld+json") ||
    text.includes("className") ||
    text.includes("styles.") ||
    text.includes("item.") ||
    text.includes("faq.") ||
    text.includes("translateInsuranceText") ||
    text.includes("translateReactNode") ||
    text.includes("encodeURIComponent") ||
    text.includes("next/link")
  ) {
    return;
  }

  const ignoreExact = new Set([
    "A",
    "CH",
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
  ]);

  if (ignoreExact.has(text)) {
    return;
  }

  texts.add(text);
}

/*
 * ---------------------------------------------------------
 * 1. Datenobjekte:
 *    title / intro / text / question / answer
 * ---------------------------------------------------------
 */
for (const pattern of [
  /\btitle:\s*"([^"]+)"/g,
  /\bintro:\s*"([^"]+)"/g,
  /\btext:\s*"([^"]+)"/g,
  /\bquestion:\s*"([^"]+)"/g,
  /\banswer:\s*"([^"]+)"/g,
]) {
  for (const match of source.matchAll(pattern)) {
    add(match[1]);
  }
}

/*
 * ---------------------------------------------------------
 * 2. points: [...]
 * ---------------------------------------------------------
 */
for (const block of source.matchAll(
  /\bpoints:\s*\[(.*?)\]/gs
)) {
  for (const match of block[1].matchAll(/"([^"]+)"/g)) {
    add(match[1]);
  }
}

/*
 * ---------------------------------------------------------
 * 3. Sichtbarer JSX-Text
 * ---------------------------------------------------------
 */
for (const match of source.matchAll(
  />([^<>{}]+)</gs
)) {
  add(match[1]);
}

const sourceTexts = [...texts].sort((a, b) =>
  a.localeCompare(b, "de")
);

console.log();
console.log("========================================");
console.log(" AUFTRAGO INSURANCE TRANSLATION BUILD");
console.log("========================================");
console.log("Echte Seitentexte:", sourceTexts.length);
console.log();

/*
 * Alle unterstützten Zielsprachen.
 */
const languages = {
  fr: "fr",
  en: "en",
  it: "it",
  sq: "sq",
  tr: "tr",
  pt: "pt",
  es: "es",
};

const dictionaries = {};

const sleep = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms));

/*
 * Klein genug für stabile Batch-Requests.
 */
const BATCH_SIZE = 20;
const MAX_RETRIES = 6;

async function translateBatch(batch, to) {
  let lastError;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt += 1) {
    try {
      const response = await translate(batch, {
        from: "de",
        to,
        forceBatch: true,
      });

      if (!Array.isArray(response)) {
        throw new Error(
          "Google Translate hat keine Batch-Antwort geliefert."
        );
      }

      if (response.length !== batch.length) {
        throw new Error(
          `Batch-Laenge falsch: erwartet ${batch.length}, erhalten ${response.length}`
        );
      }

      const translated = response.map((item, index) => {
        const value = item?.text?.trim();

        if (!value) {
          throw new Error(
            `Leere Uebersetzung bei Batch-Eintrag ${index + 1}`
          );
        }

        return value;
      });

      return translated;
    } catch (error) {
      lastError = error;

      const waitMs =
        attempt * attempt * 5000;

      console.error(
        `Versuch ${attempt}/${MAX_RETRIES} fehlgeschlagen:`,
        error?.message ?? error
      );

      if (attempt < MAX_RETRIES) {
        console.log(
          `Warte ${Math.round(waitMs / 1000)} Sekunden...`
        );

        await sleep(waitMs);
      }
    }
  }

  throw lastError;
}

for (const [locale, to] of Object.entries(languages)) {
  console.log();
  console.log(`===== ${locale.toUpperCase()} =====`);

  dictionaries[locale] = {};

  for (
    let start = 0;
    start < sourceTexts.length;
    start += BATCH_SIZE
  ) {
    const batch = sourceTexts.slice(
      start,
      start + BATCH_SIZE
    );

    console.log(
      `${start + 1}-${start + batch.length} / ${sourceTexts.length}`
    );

    const translated =
      await translateBatch(batch, to);

    for (let index = 0; index < batch.length; index += 1) {
      const original = batch[index];
      const value = translated[index];

      /*
       * Kritische Sicherheitsprüfung:
       * Niemals stillschweigend einen deutschen Fallback speichern.
       *
       * Identische Werte sind bei Eigennamen/Marken teilweise legitim,
       * deshalb warnen wir hier nur.
       */
      if (value === original) {
        console.warn(
          `WARNUNG ${locale}: unveraendert -> ${original}`
        );
      }

      dictionaries[locale][original] = value;
    }

    /*
     * Kleine Pause zwischen Batch-Requests.
     */
    await sleep(1500);
  }
}

/*
 * Nur schreiben, wenn wirklich ALLE Sprachen und Texte
 * vollständig vorhanden sind.
 */
for (const locale of Object.keys(languages)) {
  const count =
    Object.keys(dictionaries[locale]).length;

  if (count !== sourceTexts.length) {
    throw new Error(
      `${locale}: nur ${count}/${sourceTexts.length} Texte vorhanden. Datei wird NICHT geschrieben.`
    );
  }
}

const output = `/*
 * AUTO-GENERATED
 * Versicherungen-Seite
 *
 * Nicht manuell bearbeiten.
 * Generiert mit:
 * node scripts/build-insurance-translations.mjs
 */

export type InsuranceGeneratedLocale =
  | "fr"
  | "en"
  | "it"
  | "sq"
  | "tr"
  | "pt"
  | "es";

export type InsuranceGeneratedDictionary =
  Record<string, string>;

export const insuranceGeneratedDictionaries:
Record<
  InsuranceGeneratedLocale,
  InsuranceGeneratedDictionary
> =
${JSON.stringify(dictionaries, null, 2)};
`;

await fs.writeFile(
  OUT,
  output,
  "utf8"
);

console.log();
console.log("========================================");
console.log(" GENERIERUNG ERFOLGREICH");
console.log("========================================");
console.log("Texte pro Sprache:", sourceTexts.length);
console.log("Sprachen:", Object.keys(languages).length);
console.log("Datei:", OUT);
console.log("========================================");
