import fs from "node:fs/promises";
import translateModule from "google-translate-api-x";

const translate =
  translateModule?.default ??
  translateModule;

const SOURCES = [
  "app/page.tsx",
  "components/home/Hero.tsx",
];

const OUT = "lib/i18n/home-generated.ts";

const texts = new Set();

function clean(value) {
  return value
    .replace(/\s+/g, " ")
    .trim();
}

function add(value) {
  const text = clean(value);

  if (!text || text.length < 2) return;

  if (!/[A-Za-zÄÖÜäöüß]/.test(text)) {
    return;
  }

  /*
   * Technische Werte ausschliessen.
   */
  if (
    text.startsWith("/") ||
    text.startsWith("./") ||
    text.startsWith("../") ||
    text.startsWith("@/") ||
    text.startsWith("http://") ||
    text.startsWith("https://") ||
    text.includes("schema.org") ||
    text.includes("application/ld+json") ||
    text.includes("className") ||
    text.includes("styles.") ||
    text.includes("encodeURIComponent") ||
    text.includes("homeTranslations") ||
    text.includes("translateHomeText") ||
    text.includes("translateReactNode") ||
    text.includes("next/")
  ) {
    return;
  }

  /*
   * CSS-/Code-artige Werte ignorieren.
   */
  if (
    /^[a-zA-Z0-9_-]+$/.test(text) &&
    text === text.toLowerCase()
  ) {
    return;
  }

  texts.add(text);
}

for (const file of SOURCES) {
  const source = await fs.readFile(file, "utf8");

  /*
   * Häufige Objektwerte.
   */
  for (const pattern of [
    /\btitle:\s*"([^"]+)"/g,
    /\bintro:\s*"([^"]+)"/g,
    /\btext:\s*"([^"]+)"/g,
    /\blabel:\s*"([^"]+)"/g,
    /\bquestion:\s*"([^"]+)"/g,
    /\banswer:\s*"([^"]+)"/g,
    /\bdescription:\s*"([^"]+)"/g,
  ]) {
    for (const match of source.matchAll(pattern)) {
      add(match[1]);
    }
  }

  /*
   * Arrays wie points: [...]
   */
  for (const block of source.matchAll(
    /\bpoints:\s*\[(.*?)\]/gs
  )) {
    for (const match of block[1].matchAll(
      /"([^"]+)"/g
    )) {
      add(match[1]);
    }
  }

  /*
   * Sichtbarer JSX-Text.
   */
  for (const match of source.matchAll(
    />([^<>{}]+)</gs
  )) {
    add(match[1]);
  }
}

const sourceTexts = [...texts].sort((a, b) =>
  a.localeCompare(b, "de")
);

console.log();
console.log("========================================");
console.log(" AUFTRAGO HOME TRANSLATION BUILD");
console.log("========================================");
console.log("Echte Seitentexte:", sourceTexts.length);
console.log();

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

const BATCH_SIZE = 20;
const MAX_RETRIES = 6;

async function translateBatch(batch, to) {
  let lastError;

  for (
    let attempt = 1;
    attempt <= MAX_RETRIES;
    attempt += 1
  ) {
    try {
      const response = await translate(batch, {
        from: "de",
        to,
        forceBatch: true,
      });

      if (!Array.isArray(response)) {
        throw new Error(
          "Keine Batch-Antwort erhalten."
        );
      }

      if (response.length !== batch.length) {
        throw new Error(
          `Batch unvollstaendig: ${response.length}/${batch.length}`
        );
      }

      return response.map((item, index) => {
        const value = item?.text?.trim();

        if (!value) {
          throw new Error(
            `Leere Uebersetzung bei Eintrag ${index + 1}`
          );
        }

        return value;
      });
    } catch (error) {
      lastError = error;

      console.error(
        `Versuch ${attempt}/${MAX_RETRIES}:`,
        error?.message ?? error
      );

      if (attempt < MAX_RETRIES) {
        const waitMs =
          attempt * attempt * 5000;

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

    for (
      let index = 0;
      index < batch.length;
      index += 1
    ) {
      dictionaries[locale][batch[index]] =
        translated[index];
    }

    await sleep(1500);
  }
}

for (const locale of Object.keys(languages)) {
  const count =
    Object.keys(dictionaries[locale]).length;

  if (count !== sourceTexts.length) {
    throw new Error(
      `${locale}: ${count}/${sourceTexts.length}. Datei wird NICHT geschrieben.`
    );
  }
}

const output = `/*
 * AUTO-GENERATED
 * Auftrago Homepage
 *
 * Nicht manuell bearbeiten.
 *
 * Generiert mit:
 * node scripts/build-home-translations.mjs
 */

export type HomeGeneratedLocale =
  | "fr"
  | "en"
  | "it"
  | "sq"
  | "tr"
  | "pt"
  | "es";

export type HomeGeneratedDictionary =
  Record<string, string>;

export const homeGeneratedDictionaries:
Record<
  HomeGeneratedLocale,
  HomeGeneratedDictionary
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
console.log("Texte:", sourceTexts.length);
console.log("Sprachen:", Object.keys(languages).length);
console.log("Datei:", OUT);
