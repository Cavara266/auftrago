export const locales = [
  "de",
  "fr",
  "it",
  "en",
  "sq",
  "tr",
  "pt",
  "es",
] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "de";

export function normalizeLocale(
  value?: string | null
): Locale {
  if (
    value === "de" ||
    value === "fr" ||
    value === "it" ||
    value === "en" ||
    value === "sq" ||
    value === "tr" ||
    value === "pt" ||
    value === "es"
  ) {
    return value;
  }

  return defaultLocale;
}
