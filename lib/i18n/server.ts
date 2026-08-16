import { headers } from "next/headers";

import {
  defaultLocale,
  normalizeLocale,
  type Locale,
} from "./config";

export async function getServerLocale(): Promise<Locale> {
  try {
    const headerStore = await headers();

    const locale =
      headerStore.get("x-auftrago-locale");

    if (locale) {
      return normalizeLocale(locale);
    }

    return defaultLocale;
  } catch {
    return defaultLocale;
  }
}
