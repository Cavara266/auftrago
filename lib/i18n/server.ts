import { cookies } from "next/headers";

import {
  defaultLocale,
  normalizeLocale,
  type Locale,
} from "./config";

export async function getServerLocale(): Promise<Locale> {
  try {
    const cookieStore = await cookies();

    const saved =
      cookieStore.get("auftrago_locale")?.value;

    return normalizeLocale(saved);
  } catch {
    return defaultLocale;
  }
}
