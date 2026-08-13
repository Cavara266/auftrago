export const locales = ["de", "fr", "it", "en"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "de";

export function normalizeLocale(
  value?: string | null
): Locale {
  if (
    value === "fr" ||
    value === "it" ||
    value === "en" ||
    value === "de"
  ) {
    return value;
  }

  return defaultLocale;
}
