"use client";

import { useEffect, useState } from "react";
import {
  defaultLocale,
  normalizeLocale,
  translations,
  type AuftragoLocale,
} from "./i18n";

const COOKIE_KEY = "auftrago_locale";
const EVENT_NAME = "auftrago:locale-change";

function readLocale(): AuftragoLocale {
  if (typeof document === "undefined") {
    return defaultLocale;
  }

  const cookie = document.cookie
    .split("; ")
    .find((entry) => entry.startsWith(`${COOKIE_KEY}=`));

  return normalizeLocale(cookie?.split("=")[1]);
}

export function useAuftragoLocale() {
  const [locale, setLocale] =
    useState<AuftragoLocale>(defaultLocale);

  useEffect(() => {
    const current = readLocale();

    setLocale(current);
    document.documentElement.lang = current;

    const handleLocaleChange = (event: Event) => {
      const customEvent =
        event as CustomEvent<AuftragoLocale>;

      const nextLocale = normalizeLocale(
        customEvent.detail
      );

      setLocale(nextLocale);
      document.documentElement.lang = nextLocale;
    };

    window.addEventListener(
      EVENT_NAME,
      handleLocaleChange
    );

    return () => {
      window.removeEventListener(
        EVENT_NAME,
        handleLocaleChange
      );
    };
  }, []);

  return {
    locale,
    t: translations[locale],
  };
}
