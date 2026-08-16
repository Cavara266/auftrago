"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

type Locale =
  | "de"
  | "fr"
  | "it"
  | "en"
  | "sq"
  | "tr"
  | "pt"
  | "es";

const locales: Locale[] = [
  "de",
  "fr",
  "it",
  "en",
  "sq",
  "tr",
  "pt",
  "es",
];

function isLocale(value: string | null): value is Locale {
  return !!value && locales.includes(value as Locale);
}

export default function ProviderLocaleBridge() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const locale = searchParams.get("locale");

    if (!isLocale(locale)) {
      return;
    }

    localStorage.setItem(
      "auftrago-language",
      locale
    );

    document.cookie =
      `auftrag_locale=${locale}; Path=/; Max-Age=31536000; SameSite=Lax`;

    document.documentElement.lang = locale;

    window.dispatchEvent(
      new CustomEvent(
        "auftrago-language-change",
        {
          detail: locale,
        }
      )
    );

    window.dispatchEvent(
      new CustomEvent(
        "auftrago:locale-change",
        {
          detail: locale,
        }
      )
    );

    const url = new URL(window.location.href);
    url.searchParams.delete("locale");

    window.history.replaceState(
      {},
      "",
      url.pathname + url.search + url.hash
    );
  }, [searchParams]);

  return null;
}
