"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./LanguageSwitcher.module.css";

type Locale = "de" | "fr" | "it" | "en";

const languages: {
  code: Locale;
  label: string;
  name: string;
  flag: string;
}[] = [
  {
    code: "de",
    label: "DE",
    name: "Deutsch",
    flag: "🇨🇭",
  },
  {
    code: "fr",
    label: "FR",
    name: "Français",
    flag: "🇫🇷",
  },
  {
    code: "it",
    label: "IT",
    name: "Italiano",
    flag: "🇮🇹",
  },
  {
    code: "en",
    label: "EN",
    name: "English",
    flag: "🇬🇧",
  },
];

const STORAGE_KEY = "auftrago-language";
const COOKIE_KEY = "auftrago_locale";

function isLocale(value: string | null): value is Locale {
  return (
    value === "de" ||
    value === "fr" ||
    value === "it" ||
    value === "en"
  );
}

export default function LanguageSwitcher() {
  const [locale, setLocale] = useState<Locale>("de");
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);

    if (isLocale(saved)) {
      setLocale(saved);
      document.documentElement.lang = saved;
    } else {
      document.documentElement.lang = "de";
    }
  }, []);

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  function changeLanguage(nextLocale: Locale) {
    setLocale(nextLocale);
    setOpen(false);

    window.localStorage.setItem(STORAGE_KEY, nextLocale);

    document.cookie =
      `${COOKIE_KEY}=${nextLocale}; Path=/; Max-Age=31536000; SameSite=Lax`;

    document.documentElement.lang = nextLocale;
    window.dispatchEvent(
      new CustomEvent("auftrago:locale-change", {
        detail: nextLocale,
      })
    );


    window.dispatchEvent(
      new CustomEvent("auftrago-language-change", {
        detail: {
          locale: nextLocale,
        },
      }),
    );
  }

  const active =
    languages.find((language) => language.code === locale) ??
    languages[0];

  return (
    <div
      ref={wrapperRef}
      className={styles.wrapper}
    >
      <button
        type="button"
        className={styles.trigger}
        aria-label="Sprache auswählen"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        <span className={styles.globe}>◎</span>

        <span className={styles.activeLanguage}>
          {active.label}
        </span>

        <span
          className={`${styles.chevron} ${
            open ? styles.chevronOpen : ""
          }`}
        >
          ▾
        </span>
      </button>

      {open && (
        <div
          className={styles.menu}
          role="menu"
        >
          <div className={styles.menuHeader}>
            <span>SPRACHE</span>
            <strong>Language</strong>
          </div>

          <div className={styles.languageList}>
            {languages.map((language) => {
              const selected = language.code === locale;

              return (
                <button
                  key={language.code}
                  type="button"
                  role="menuitem"
                  className={`${styles.languageItem} ${
                    selected ? styles.selected : ""
                  }`}
                  onClick={() =>
                    changeLanguage(language.code)
                  }
                >
                  <span className={styles.flag}>
                    {language.flag}
                  </span>

                  <span className={styles.languageName}>
                    <strong>{language.name}</strong>
                    <small>{language.label}</small>
                  </span>

                  <span className={styles.check}>
                    {selected ? "✓" : ""}
                  </span>
                </button>
              );
            })}
          </div>

          <div className={styles.menuFooter}>
            Auftrago · Schweiz
          </div>
        </div>
      )}
    </div>
  );
}
