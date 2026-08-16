"use client";

import { useEffect, useState } from "react";
import {
  defaultLocale,
  normalizeLocale,
  type Locale,
} from "@/lib/i18n/config";

const STORAGE_KEY = "auftrago-language";
const COOKIE_KEY = "auftrago_locale";

function readCookieLocale(): Locale | null {
  if (typeof document === "undefined") return null;

  const match = document.cookie.match(
    new RegExp("(?:^|; )" + COOKIE_KEY + "=([^;]*)")
  );

  return match ? normalizeLocale(decodeURIComponent(match[1])) : null;
}

function readStoredLocale(): Locale {
  if (typeof window === "undefined") return defaultLocale;

  const pathnameLocale = normalizeLocale(
    window.location.pathname.split("/").filter(Boolean)[0]
  );

  const stored = normalizeLocale(
    window.localStorage.getItem(STORAGE_KEY)
  );

  const cookie = readCookieLocale();

  /*
   * LanguageSwitcher schreibt localStorage + Cookie.
   * Diese Werte haben deshalb Priorität.
   * Falls noch nichts gespeichert wurde, verwenden wir /it, /fr usw.
   */
  return stored || cookie || pathnameLocale || defaultLocale;
}

export function useAuftragLocale() {
  const [locale, setLocale] = useState<Locale>(defaultLocale);

  useEffect(() => {
    const syncLocale = () => {
      setLocale(readStoredLocale());
    };

    syncLocale();

    window.addEventListener("storage", syncLocale);
    window.addEventListener("auftrago:locale-change", syncLocale);
    window.addEventListener("auftrago-language-change", syncLocale);

    return () => {
      window.removeEventListener("storage", syncLocale);
      window.removeEventListener("auftrago:locale-change", syncLocale);
      window.removeEventListener("auftrago-language-change", syncLocale);
    };
  }, []);

  return { locale };
}
