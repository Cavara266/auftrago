"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { services } from "@/lib/services";
import styles from "./SiteHeader/SiteHeader.module.css";

import LanguageSwitcher from "./LanguageSwitcher/LanguageSwitcher";
import { useAuftragLocale } from "@/lib/use-auftrag-locale";
import { translateHomeText } from "@/lib/i18n/home-translator";
import { useAuftragoLocale } from "@/lib/use-auftrago-locale";
const regionLinks = [
  { label: "Zürich", href: "/region/zuerich" },
  { label: "Aargau", href: "/region/aargau" },
  { label: "Basel", href: "/region/basel" },
  { label: "Bern", href: "/region/bern" },
  { label: "Luzern", href: "/region/luzern" },
  { label: "Zug", href: "/region/zug" },
];


// ===== REGION LANGUAGE FINAL START =====
function providerRegionLabel(locale: string, region: string) {
  const prefix: Record<string, string> = {
    de: "Anbieter in",
    en: "Providers in",
    fr: "Prestataires à",
    it: "Fornitori in",
    sq: "Ofrues në",
    tr: "Hizmet sağlayıcılar:",
    pt: "Prestadores em",
    es: "Proveedores en",
  };

  return `${prefix[locale] ?? prefix.de} ${region}`;
}

function allRegionsLabel(locale: string) {
  const labels: Record<string, string> = {
    de: "Alle Regionen",
    en: "All regions",
    fr: "Toutes les régions",
    it: "Tutte le regioni",
    sq: "Të gjitha rajonet",
    tr: "Tüm bölgeler",
    pt: "Todas as regiões",
    es: "Todas las regiones",
  };

  return labels[locale] ?? labels.de;
}
// ===== REGION LANGUAGE FINAL END =====

const categoryOrder = [
  "Haus & Reinigung",
  "Handwerk",
  "Trasloco e trasporto",
  "Energie",
  "Assicurazioni",
  "Immobilien",
  "Finanzen",
  "IT & Digital",
];

export default function SiteHeader() {
  const { locale } = useAuftragLocale();
  const tr = (value: string) => translateHomeText(locale, value);

  const { t } = useAuftragoLocale();
  const pathname = usePathname();
  const router = useRouter();

  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [regionsOpen, setRegionsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

  const groupedServices = useMemo(() => {
    return categoryOrder
      .map((category) => ({
        category,
        items: services.filter((service) => service.category === category),
      }))
      .filter((group) => group.items.length > 0);
  }, []);

  const results = useMemo(() => {
    const value = query.trim().toLowerCase();

    if (!value) {
      return services.slice(0, 8);
    }

    return services
      .filter((service) => {
        return (
          service.title.toLowerCase().includes(value) ||
          service.category.toLowerCase().includes(value) ||
          service.keywords.some((keyword) =>
            keyword.toLowerCase().includes(value)
          )
        );
      })
      .slice(0, 10);
  }, [query]);

  function closeAll() {
    setMenuOpen(false);
    setServicesOpen(false);
    setRegionsOpen(false);
    setSearchOpen(false);
  }

  function handleSearchSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const firstResult = results[0];

    if (firstResult) {
      closeAll();
      router.push(`/leistungen/${firstResult.slug}`);
      return;
    }

    closeAll();
    router.push(`/auftrag-erstellen?query=${encodeURIComponent(query)}`);
  }

  return (
    <>
      <header className={styles.header}>
        <div className={styles.shell}>
          <Link href="/" className={styles.logo} onClick={closeAll}>
            Auftrago<span>.</span>
          </Link>

          <nav className={styles.desktopNav}>
            <button
              type="button"
              className={styles.navButton}
              onClick={() => {
                setServicesOpen((value) => !value);
                setRegionsOpen(false);
              }}
            >
              Dienstleistungen
              <span>{servicesOpen ? "−" : "+"}</span>
            </button>

            <Link
              href="/anbieter"
              className={pathname === "/anbieter" ? styles.active : ""}
            >
              Anbieter
            </Link>

            <button
              type="button"
              className={styles.navButton}
              onClick={() => {
                setRegionsOpen((value) => !value);
                setServicesOpen(false);
              }}
            >
              Regionen
              <span>{regionsOpen ? "−" : "+"}</span>
            </button>

            <Link href="/versicherungen" className={styles.premiumLink}>
              Versicherungen
              <small>NEU</small>
            </Link>

            <Link href="/anbieter-registrieren">{tr("Für Anbieter")}</Link>
          </nav>

          <div className={styles.actions}>
            
          <LanguageSwitcher />

          <button
              type="button"
              className={styles.searchButton}
              onClick={() => setSearchOpen(true)}
              aria-label={tr("Suche öffnen")}
            >
              Suche
            </button>

            <Link href="/auftrag-erstellen" className={styles.primaryButton}>
              Auftrag starten
            </Link>

            <button
              type="button"
              className={styles.mobileButton}
              onClick={() => setMenuOpen((value) => !value)}
              aria-label={tr("Menü öffnen")}
            >
              {menuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {servicesOpen && (
          <div className={styles.megaMenu}>
            <div className={styles.megaMenuInner}>
              <div className={styles.megaIntro}>
                <span>{tr("Alle Dienstleistungen")}</span>
                <h2>{tr("Finde genau den richtigen Anbieter.")}</h2>
                <p>
                  Reinigung, Handwerk, Umzug, Versicherungen, Immobilien,
                  Finanzen und digitale Lösungen.
                </p>

                <Link href="/leistungen" onClick={closeAll}>
                  Alle Leistungen ansehen →
                </Link>
              </div>

              <div className={styles.megaGrid}>
                {groupedServices.map((group) => (
                  <div key={group.category} className={styles.megaGroup}>
                    <strong>{tr(group.category)}</strong>

                    {group.items.slice(0, 5).map((service) => (
                      <Link
                        key={service.slug}
                        href={`/leistungen/${service.slug}`}
                        onClick={closeAll}
                      >
                        <span>{service.icon}</span>
                        {tr(service.title)}
                      </Link>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {regionsOpen && (
          <div className={styles.regionMenu}>
            <div className={styles.regionGrid}>
              {regionLinks.map((region) => (
                <Link key={region.href} href={region.href} onClick={closeAll}>
                  {providerRegionLabel(locale, region.label)}
                  <span>→</span>
                </Link>
              ))}

              <Link href="/region" onClick={closeAll}>
                {allRegionsLabel(locale)}
                <span>→</span>
              </Link>
            </div>
          </div>
        )}

        {
menuOpen && (
<nav className={styles.mobileMenu}>
  <Link href="/anbieter" onClick={closeAll}>{tr("Anbieter")}</Link>
  <Link href="/preisrechner" onClick={closeAll}>💰 Preisrechner</Link>
  <Link href="/auftrag-erstellen" onClick={closeAll}>{tr("Auftrag starten")}</Link>
</nav>
)
}
      </header>

      {searchOpen && (
        <div className={styles.searchOverlay} role="dialog" aria-modal="true">
          <button
            type="button"
            className={styles.closeSearch}
            onClick={() => setSearchOpen(false)}
            aria-label={tr("Suche schliessen")}
          >
            ✕
          </button>

          <div className={styles.searchPanel}>
            <span className={styles.searchEyebrow}>{tr("Auftrag Suche")}</span>
            <h2>{tr("Wonach suchst du?")}</h2>

            <form onSubmit={handleSearchSubmit}>
              <input
                autoFocus
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={tr("Zum Beispiel Reinigung, Elektriker oder Krankenkasse")}
              />
              <button type="submit">{tr("Suchen")}</button>
            </form>

            <div className={styles.searchResults}>
              {results.map((service) => (
                <Link
                  key={service.slug}
                  href={`/leistungen/${service.slug}`}
                  onClick={closeAll}
                >
                  <span>{service.icon}</span>

                  <div>
                    <strong>{tr(service.title)}</strong>
                    <small>{tr(service.category)}</small>
                  </div>

                  <b>→</b>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}