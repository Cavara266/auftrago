"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FormEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { services } from "@/lib/services";

const navigation = [
  {
    href: "/",
    label: "Startseite",
  },
  {
    href: "/anbieter",
    label: "Anbieter",
  },
  {
    href: "/preisrechner",
    label: "Preisrechner",
    icon: "💰",
    accent: "green",
  },
  {
    href: "/offerte-anfragen",
    label: "Offerte anfragen",
  },
];

const regionLinks = [
  { href: "/region/zuerich", label: "Zürich" },
  { href: "/region/aargau", label: "Aargau" },
  { href: "/region/basel", label: "Basel" },
  { href: "/region/bern", label: "Bern" },
  { href: "/region/luzern", label: "Luzern" },
  { href: "/region/zug", label: "Zug" },
];

const categoryOrder = [
  "Haus & Reinigung",
  "Handwerk",
  "Umzug & Transport",
  "Energie",
  "Versicherungen",
  "Immobilien",
  "Finanzen",
  "IT & Digital",
];

const categoryMeta: Record<
  string,
  { icon: string; description: string; accent: string }
> = {
  "Haus & Reinigung": {
    icon: "🧹",
    description: "Reinigung, Hauswartung, Garten und Winterdienst",
    accent: "from-sky-400/15 to-cyan-300/5",
  },
  Handwerk: {
    icon: "🛠️",
    description: "Elektriker, Sanitär, Maler, Schreiner und Renovation",
    accent: "from-orange-400/15 to-amber-300/5",
  },
  "Umzug & Transport": {
    icon: "🚚",
    description: "Umzug, Transport, Räumung und Entsorgung",
    accent: "from-violet-400/15 to-fuchsia-300/5",
  },
  Energie: {
    icon: "⚡",
    description: "Solaranlagen, Wärmepumpen und Energieberatung",
    accent: "from-yellow-300/15 to-emerald-300/5",
  },
  Versicherungen: {
    icon: "🛡️",
    description: "Krankenkasse, Vorsorge, Auto und Firmenlösungen",
    accent: "from-indigo-400/15 to-blue-300/5",
  },
  Immobilien: {
    icon: "🏡",
    description: "Makler, Bewertung, Verkauf und Vermietung",
    accent: "from-emerald-400/15 to-teal-300/5",
  },
  Finanzen: {
    icon: "📚",
    description: "Treuhand, Steuern, Hypotheken und Beratung",
    accent: "from-amber-400/15 to-yellow-300/5",
  },
  "IT & Digital": {
    icon: "💻",
    description: "Webseiten, SEO, Software und IT-Support",
    accent: "from-cyan-400/15 to-violet-300/5",
  },
};

export default function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const searchAreaRef = useRef<HTMLDivElement | null>(null);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesMenuOpen, setServicesMenuOpen] = useState(false);
  const [regionMenuOpen, setRegionMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileSection, setMobileSection] = useState<string | null>(
    "Haus & Reinigung"
  );

  const groupedServices = useMemo(() => {
    return categoryOrder
      .map((category) => ({
        category,
        items: services.filter((service) => service.category === category),
      }))
      .filter((group) => group.items.length > 0);
  }, []);

  const popularServices = useMemo(() => {
    const featured = services.filter((service) => service.featured);
    const rest = services.filter((service) => !service.featured);

    return [...featured, ...rest].slice(0, 8);
  }, []);

  const searchResults = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    if (!normalizedQuery) {
      return popularServices;
    }

    return services
      .filter((service) => {
        const searchableContent = [
          service.slug,
          service.title,
          service.short,
          service.category,
          service.description,
          service.longDescription,
          ...service.keywords,
        ]
          .join(" ")
          .toLowerCase();

        return searchableContent.includes(normalizedQuery);
      })
      .slice(0, 10);
  }, [popularServices, searchQuery]);

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (
        searchAreaRef.current &&
        !searchAreaRef.current.contains(event.target as Node)
      ) {
        setSearchFocused(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  function isActive(href: string) {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname.startsWith(href);
  }

  function closeMenus() {
    setMobileMenuOpen(false);
    setServicesMenuOpen(false);
    setRegionMenuOpen(false);
    setSearchFocused(false);
  }

  function openServicesMenu() {
    setServicesMenuOpen((current) => !current);
    setRegionMenuOpen(false);
    setSearchFocused(false);
  }

  function openRegionMenu() {
    setRegionMenuOpen((current) => !current);
    setServicesMenuOpen(false);
    setSearchFocused(false);
  }

  function openService(serviceSlug: string) {
    setSearchQuery("");
    setSearchFocused(false);
    setMobileSearchOpen(false);
    closeMenus();
    router.push(`/leistungen/${serviceSlug}`);
  }

  function handleSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const firstResult = searchResults[0];

    if (firstResult) {
      openService(firstResult.slug);
      return;
    }

    const query = searchQuery.trim();

    setSearchFocused(false);
    setMobileSearchOpen(false);

    router.push(
      query
        ? `/offerte-anfragen?query=${encodeURIComponent(query)}`
        : "/offerte-anfragen"
    );
  }

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#020617]/95 shadow-[0_12px_45px_rgba(0,0,0,0.28)] backdrop-blur-2xl">
        <div className="mx-auto flex min-h-[88px] max-w-[1580px] items-center justify-between gap-5 px-5 sm:px-7 lg:px-10">
          <Link
            href="/"
            onClick={closeMenus}
            className="group flex shrink-0 items-center gap-3"
          >
            <span className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-orange-400/15 bg-gradient-to-br from-orange-500/20 to-red-500/10 shadow-[0_0_35px_rgba(249,115,22,0.22)] transition duration-300 group-hover:scale-105 group-hover:shadow-[0_0_45px_rgba(249,115,22,0.34)]">
              <Image
                src="/logo-flame.svg"
                alt="Auftrago Logo"
                width={31}
                height={31}
                priority
                className="drop-shadow-[0_0_12px_rgba(249,115,22,0.65)]"
              />
            </span>

            <span className="text-[25px] font-black tracking-[-0.04em] text-white sm:text-[28px]">
              Auftrago
            </span>
          </Link>

          <nav className="hidden items-center gap-1 2xl:flex">
            {navigation.map((item) => {
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMenus}
                  className={[
                    "relative inline-flex min-h-[44px] items-center justify-center gap-2 whitespace-nowrap rounded-xl px-3.5 text-[14px] font-bold transition duration-200",
                    item.accent === "green"
                      ? active
                        ? "bg-emerald-400/15 text-emerald-300 shadow-[0_10px_35px_rgba(16,185,129,0.12)]"
                        : "text-emerald-400 hover:bg-emerald-400/10 hover:text-emerald-300"
                      : active
                        ? "bg-white/10 text-white"
                        : "text-slate-300 hover:bg-white/[0.06] hover:text-white",
                  ].join(" ")}
                >
                  {item.icon ? <span>{item.icon}</span> : null}
                  <span>{item.label}</span>

                  {active ? (
                    <span
                      className={[
                        "absolute bottom-1 left-1/2 h-[2px] w-5 -translate-x-1/2 rounded-full",
                        item.accent === "green"
                          ? "bg-emerald-400"
                          : "bg-sky-400",
                      ].join(" ")}
                    />
                  ) : null}
                </Link>
              );
            })}

            <button
              type="button"
              onClick={openServicesMenu}
              aria-expanded={servicesMenuOpen}
              className={[
                "relative inline-flex min-h-[44px] items-center justify-center gap-2 whitespace-nowrap rounded-xl px-3.5 text-[14px] font-bold transition duration-200",
                pathname.startsWith("/leistungen") || servicesMenuOpen
                  ? "bg-white/10 text-white"
                  : "text-slate-300 hover:bg-white/[0.06] hover:text-white",
              ].join(" ")}
            >
              <span>Leistungen</span>
              <span
                className={[
                  "text-xs transition duration-200",
                  servicesMenuOpen ? "rotate-180" : "",
                ].join(" ")}
              >
                ▾
              </span>
            </button>

            <button
              type="button"
              onClick={openRegionMenu}
              aria-expanded={regionMenuOpen}
              className={[
                "relative inline-flex min-h-[44px] items-center justify-center gap-2 whitespace-nowrap rounded-xl px-3.5 text-[14px] font-bold transition duration-200",
                pathname.startsWith("/region") || regionMenuOpen
                  ? "bg-white/10 text-white"
                  : "text-slate-300 hover:bg-white/[0.06] hover:text-white",
              ].join(" ")}
            >
              <span>Regionen</span>
              <span
                className={[
                  "text-xs transition duration-200",
                  regionMenuOpen ? "rotate-180" : "",
                ].join(" ")}
              >
                ▾
              </span>
            </button>
          </nav>

          <div className="hidden min-w-0 flex-1 items-center justify-end gap-3 lg:flex">
            <div
              ref={searchAreaRef}
              className="relative hidden w-full max-w-[390px] xl:block"
            >
              <form onSubmit={handleSearchSubmit}>
                <div
                  className={[
                    "flex min-h-[50px] items-center rounded-2xl border bg-white/[0.055] px-4 transition",
                    searchFocused
                      ? "border-sky-300/35 bg-white/[0.08] shadow-[0_16px_45px_rgba(56,189,248,0.12)]"
                      : "border-white/10",
                  ].join(" ")}
                >
                  <span className="mr-3 text-lg text-sky-300">⌕</span>

                  <input
                    value={searchQuery}
                    onFocus={() => {
                      setSearchFocused(true);
                      setServicesMenuOpen(false);
                      setRegionMenuOpen(false);
                    }}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Dienstleistung suchen"
                    className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-white outline-none placeholder:text-slate-500"
                  />

                  <kbd className="rounded-lg border border-white/10 bg-white/[0.04] px-2 py-1 text-[10px] font-bold text-slate-500">
                    ENTER
                  </kbd>
                </div>
              </form>

              {searchFocused ? (
                <div className="absolute left-0 right-0 top-[58px] overflow-hidden rounded-[24px] border border-white/10 bg-[#07101f]/[0.98] p-3 shadow-[0_30px_80px_rgba(0,0,0,0.55)] backdrop-blur-2xl">
                  <div className="flex items-center justify-between px-3 pb-3 pt-1">
                    <span className="text-[11px] font-black uppercase tracking-[0.16em] text-slate-500">
                      {searchQuery.trim()
                        ? "Suchergebnisse"
                        : "Beliebte Leistungen"}
                    </span>

                    <Link
                      href="/leistungen"
                      onClick={closeMenus}
                      className="text-xs font-black text-sky-300"
                    >
                      Alle ansehen →
                    </Link>
                  </div>

                  <div className="grid max-h-[440px] gap-1 overflow-y-auto">
                    {searchResults.length > 0 ? (
                      searchResults.map((service) => (
                        <button
                          key={service.slug}
                          type="button"
                          onClick={() => openService(service.slug)}
                          className="group grid min-h-[58px] grid-cols-[40px_1fr_auto] items-center gap-3 rounded-2xl px-3 text-left transition hover:bg-white/[0.07]"
                        >
                          <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.05] text-lg">
                            {service.icon}
                          </span>

                          <span className="min-w-0">
                            <strong className="block truncate text-sm font-black text-white">
                              {service.title}
                            </strong>
                            <small className="mt-1 block truncate text-[11px] font-medium text-slate-500">
                              {service.short}
                            </small>
                          </span>

                          <span className="text-sky-300 transition group-hover:translate-x-1">
                            →
                          </span>
                        </button>
                      ))
                    ) : (
                      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.035] p-5">
                        <strong className="text-sm text-white">
                          Keine direkte Leistung gefunden
                        </strong>
                        <p className="mt-2 text-xs leading-5 text-slate-400">
                          Sende eine freie Anfrage. Wir prüfen passende Anbieter.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ) : null}
            </div>

            
        {/* AUFTRAGO_DESKTOP_LINKS_START */}
        <nav className="hidden items-center gap-7 xl:flex">
          <Link
            href="/anbieter"
            className="whitespace-nowrap text-sm font-black text-slate-200 transition hover:text-white"
          >
            Anbieter
          </Link>

          <Link
            href="/preisrechner"
            className="flex whitespace-nowrap text-sm font-black text-emerald-300 transition hover:text-emerald-200"
          >
            <span className="mr-2">💰</span>
            Preisrechner
          </Link>

          <Link
            href="/offerte-anfragen"
            className="whitespace-nowrap text-sm font-black text-slate-200 transition hover:text-white"
          >
            Offerte anfragen
          </Link>
        </nav>
        {/* AUFTRAGO_DESKTOP_LINKS_END */}

        <Link
              href="/credits"
              onClick={closeMenus}
              className={[
                "group inline-flex min-h-[48px] items-center justify-center gap-2 whitespace-nowrap rounded-2xl border px-4 text-[14px] font-black transition duration-200",
                pathname.startsWith("/credits")
                  ? "border-yellow-300/60 bg-gradient-to-r from-yellow-300 to-amber-400 text-[#171006] shadow-[0_12px_38px_rgba(250,204,21,0.28)]"
                  : "border-yellow-300/30 bg-yellow-300/10 text-yellow-200 shadow-[0_12px_38px_rgba(250,204,21,0.10)] hover:-translate-y-0.5 hover:bg-gradient-to-r hover:from-yellow-300 hover:to-amber-400 hover:text-[#171006]",
              ].join(" ")}
            >
              <span className="text-base transition group-hover:scale-110">
                🪙
              </span>
              <span>Credits</span>
            </Link>

            <Link
              href="/anbieter-registrieren"
              onClick={closeMenus}
              className="hidden min-h-[48px] items-center justify-center whitespace-nowrap rounded-2xl px-3 text-[14px] font-bold text-slate-300 transition hover:bg-white/[0.06] hover:text-white xl:inline-flex"
            >
              Anbieter werden
            </Link>

            <Link
              href="/offerte-anfragen"
              onClick={closeMenus}
              className="inline-flex min-h-[52px] items-center justify-center whitespace-nowrap rounded-2xl bg-white px-5 text-[14px] font-black text-[#050816] shadow-[0_16px_45px_rgba(255,255,255,0.13)] transition duration-200 hover:-translate-y-0.5 hover:bg-sky-100 hover:shadow-[0_18px_50px_rgba(125,211,252,0.20)]"
            >
              Anfrage senden
            </Link>
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <button
              type="button"
              onClick={() => setMobileSearchOpen(true)}
              aria-label="Suche öffnen"
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] text-lg text-white transition hover:bg-white/10"
            >
              ⌕
            </button>

            <Link
              href="/credits"
              aria-label="Credits kaufen"
              onClick={closeMenus}
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-yellow-300/30 bg-yellow-300/10 text-lg shadow-[0_8px_28px_rgba(250,204,21,0.10)]"
            >
              🪙
            </Link>

            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen((current) => !current);
                setServicesMenuOpen(false);
                setRegionMenuOpen(false);
              }}
              aria-label={
                mobileMenuOpen
                  ? "Navigation schliessen"
                  : "Navigation öffnen"
              }
              aria-expanded={mobileMenuOpen}
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] text-xl font-bold text-white transition hover:bg-white/10"
            >
              {mobileMenuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {servicesMenuOpen ? (
          <div className="absolute left-0 right-0 top-full hidden border-b border-white/10 bg-[#030816]/[0.985] shadow-[0_35px_90px_rgba(0,0,0,0.6)] backdrop-blur-2xl 2xl:block">
            <div className="mx-auto max-w-[1580px] px-10 py-8">
              <div className="mb-6 flex items-end justify-between gap-8">
                <div>
                  <span className="text-xs font-black uppercase tracking-[0.18em] text-sky-300">
                    Dienstleistungen
                  </span>
                  <h2 className="mt-2 text-3xl font-black tracking-[-0.04em] text-white">
                    Alles für deinen nächsten Auftrag.
                  </h2>
                </div>

                <div className="flex items-center gap-3">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-right">
                    <strong className="block text-lg font-black text-white">
                      Schweizweit
                    </strong>
                    <span className="text-xs text-slate-500">
                      Regionale Anbieter
                    </span>
                  </div>

                  <Link
                    href="/leistungen"
                    onClick={closeMenus}
                    className="inline-flex min-h-[48px] items-center justify-center rounded-2xl bg-white px-5 text-sm font-black text-[#050816] transition hover:bg-sky-100"
                  >
                    Alle Leistungen →
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4">
                {groupedServices.map((group) => {
                  const meta = categoryMeta[group.category];

                  return (
                    <div
                      key={group.category}
                      className={[
                        "group rounded-[24px] border border-white/[0.08] bg-gradient-to-br p-5 transition duration-300 hover:-translate-y-1 hover:border-white/15 hover:shadow-[0_22px_65px_rgba(0,0,0,0.34)]",
                        meta?.accent ?? "from-white/[0.06] to-white/[0.02]",
                      ].join(" ")}
                    >
                      <div className="mb-4 flex items-start gap-3">
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-[#050b17]/70 text-xl">
                          {meta?.icon ?? "✨"}
                        </span>

                        <div>
                          <h3 className="text-sm font-black text-white">
                            {group.category}
                          </h3>
                          <p className="mt-1 text-[11px] leading-5 text-slate-500">
                            {meta?.description}
                          </p>
                        </div>
                      </div>

                      <div className="grid gap-1">
                        {group.items.slice(0, 5).map((service) => (
                          <Link
                            key={service.slug}
                            href={`/leistungen/${service.slug}`}
                            onClick={closeMenus}
                            className="flex min-h-[36px] items-center justify-between rounded-xl px-2.5 text-xs font-bold text-slate-300 transition hover:bg-white/[0.07] hover:text-white"
                          >
                            <span className="flex items-center gap-2">
                              <span>{service.icon}</span>
                              <span>{service.title}</span>
                            </span>
                            <span className="text-sky-300 opacity-0 transition group-hover:opacity-100">
                              →
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : null}

        {regionMenuOpen ? (
          <div className="absolute left-0 right-0 top-full hidden border-b border-white/10 bg-[#030816]/[0.985] shadow-[0_35px_90px_rgba(0,0,0,0.6)] backdrop-blur-2xl 2xl:block">
            <div className="mx-auto max-w-[1180px] px-10 py-9">
              <div className="mb-6 flex items-end justify-between gap-6">
                <div>
                  <span className="text-xs font-black uppercase tracking-[0.18em] text-sky-300">
                    Beliebteste Regionen
                  </span>
                  <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] text-white">
                    Anbieter in deiner Region finden
                  </h2>
                </div>

                <Link
                  href="/region"
                  onClick={closeMenus}
                  className="text-sm font-black text-sky-300 transition hover:text-white"
                >
                  Alle Regionen ansehen →
                </Link>
              </div>

              <div className="grid grid-cols-4 gap-3">
                {regionLinks.map((region) => (
                  <Link
                    key={region.href}
                    href={region.href}
                    onClick={closeMenus}
                    className="group flex min-h-[72px] items-center justify-between rounded-2xl border border-white/[0.08] bg-white/[0.04] px-5 text-sm font-black text-white transition hover:-translate-y-0.5 hover:border-sky-300/20 hover:bg-sky-300/10"
                  >
                    <span>
                      <small className="mb-1 block text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">
                        Region
                      </small>
                      Anbieter in {region.label}
                    </span>
                    <span className="text-sky-300 transition group-hover:translate-x-1">
                      →
                    </span>
                  </Link>
                ))}

                <Link
                  href="/stadt"
                  onClick={closeMenus}
                  className="group flex min-h-[72px] items-center justify-between rounded-2xl border border-violet-300/15 bg-violet-400/10 px-5 text-sm font-black text-white transition hover:-translate-y-0.5 hover:border-violet-300/30 hover:bg-violet-400/15"
                >
                  <span>
                    <small className="mb-1 block text-[10px] font-bold uppercase tracking-[0.12em] text-violet-300/60">
                      Städte
                    </small>
                    Alle Städte
                  </span>
                  <span className="text-violet-300 transition group-hover:translate-x-1">
                    →
                  </span>
                </Link>
              </div>
            </div>
          </div>
        ) : null}

        {mobileMenuOpen ? (
          <div className="max-h-[calc(100vh-88px)] overflow-y-auto border-t border-white/10 bg-[#030816]/[0.99] px-4 pb-7 pt-4 backdrop-blur-xl lg:hidden">
            <nav className="mx-auto grid max-w-3xl gap-2">
              {navigation.map((item) => {
                const active = isActive(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeMenus}
                    className={[
                      "flex min-h-[50px] items-center gap-3 rounded-2xl border px-5 text-[15px] font-bold transition",
                      active
                        ? "border-sky-300/20 bg-sky-300/10 text-white"
                        : "border-white/[0.08] bg-white/[0.04] text-slate-300 hover:bg-white/[0.08] hover:text-white",
                    ].join(" ")}
                  >
                    {item.icon ? <span>{item.icon}</span> : null}
                    <span>{item.label}</span>
                  </Link>
                );
              })}

              <div className="mt-2 overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.025]">
                <div className="border-b border-white/[0.06] px-4 py-4">
                  <span className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">
                    Dienstleistungen
                  </span>
                </div>

                <div className="grid">
                  {groupedServices.map((group) => {
                    const isOpen = mobileSection === group.category;
                    const meta = categoryMeta[group.category];

                    return (
                      <div
                        key={group.category}
                        className="border-b border-white/[0.06] last:border-b-0"
                      >
                        <button
                          type="button"
                          onClick={() =>
                            setMobileSection(
                              isOpen ? null : group.category
                            )
                          }
                          className="flex min-h-[56px] w-full items-center justify-between px-4 text-left"
                        >
                          <span className="flex items-center gap-3">
                            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.05]">
                              {meta?.icon ?? "✨"}
                            </span>
                            <span className="text-sm font-black text-white">
                              {group.category}
                            </span>
                          </span>

                          <span
                            className={[
                              "text-sm text-sky-300 transition",
                              isOpen ? "rotate-180" : "",
                            ].join(" ")}
                          >
                            ▾
                          </span>
                        </button>

                        {isOpen ? (
                          <div className="grid gap-1 px-3 pb-3">
                            {group.items.map((service) => (
                              <Link
                                key={service.slug}
                                href={`/leistungen/${service.slug}`}
                                onClick={closeMenus}
                                className="flex min-h-[44px] items-center justify-between rounded-xl px-3 text-sm font-bold text-slate-300 transition hover:bg-white/[0.06] hover:text-white"
                              >
                                <span className="flex items-center gap-3">
                                  <span>{service.icon}</span>
                                  <span>{service.title}</span>
                                </span>
                                <span>→</span>
                              </Link>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              </div>

              <Link
                href="/region"
                onClick={closeMenus}
                className="mt-2 flex min-h-[52px] items-center justify-between rounded-2xl border border-white/[0.08] bg-white/[0.04] px-5 text-[15px] font-bold text-slate-300"
              >
                <span>Regionen</span>
                <span>→</span>
              </Link>

              <Link
                href="/credits"
                onClick={closeMenus}
                className="mt-2 flex min-h-[52px] items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-yellow-300 to-amber-400 px-5 text-[15px] font-black text-[#171006] shadow-[0_12px_38px_rgba(250,204,21,0.20)]"
              >
                <span>🪙</span>
                <span>Credits kaufen</span>
              </Link>

              <Link
                href="/anbieter-registrieren"
                onClick={closeMenus}
                className="flex min-h-[50px] items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] px-5 text-[15px] font-bold text-white"
              >
                Anbieter werden
              </Link>

              <Link
                href="/offerte-anfragen"
                onClick={closeMenus}
                className="flex min-h-[52px] items-center justify-center rounded-2xl bg-white px-5 text-[15px] font-black text-[#050816]"
              >
                Anfrage senden
              </Link>
            </nav>
          </div>
        ) : null}
      </header>

      {mobileSearchOpen ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Dienstleistungen suchen"
          className="fixed inset-0 z-[100] overflow-y-auto bg-[#02040b]/95 px-5 py-24 backdrop-blur-2xl"
        >
          <button
            type="button"
            onClick={() => {
              setMobileSearchOpen(false);
              setSearchQuery("");
            }}
            aria-label="Suche schliessen"
            className="fixed right-5 top-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] text-xl font-bold text-white"
          >
            ✕
          </button>

          <div className="mx-auto max-w-4xl">
            <span className="text-xs font-black uppercase tracking-[0.2em] text-sky-300">
              Auftrago Suche
            </span>

            <h2 className="mt-4 text-4xl font-black tracking-[-0.05em] text-white sm:text-6xl">
              Welche Dienstleistung suchst du?
            </h2>

            <form
              onSubmit={handleSearchSubmit}
              className="mt-8 grid gap-3 sm:grid-cols-[1fr_auto]"
            >
              <input
                type="search"
                autoFocus
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Zum Beispiel Umzugsreinigung oder Elektriker"
                className="min-h-[64px] w-full rounded-2xl border border-white/10 bg-white/[0.06] px-5 text-base font-medium text-white outline-none placeholder:text-slate-500 focus:border-sky-300/40"
              />

              <button
                type="submit"
                className="min-h-[64px] rounded-2xl bg-gradient-to-r from-sky-400 to-violet-500 px-8 text-base font-black text-white"
              >
                Suchen
              </button>
            </form>

            <div className="mt-6 grid gap-2">
              {searchResults.length > 0 ? (
                searchResults.map((service) => (
                  <button
                    key={service.slug}
                    type="button"
                    onClick={() => openService(service.slug)}
                    className="group grid min-h-[70px] grid-cols-[48px_1fr_auto] items-center gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.035] px-4 text-left text-white transition hover:border-sky-300/20 hover:bg-white/[0.07]"
                  >
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.05] text-xl">
                      {service.icon}
                    </span>

                    <span>
                      <strong className="block text-[15px] font-black">
                        {service.title}
                      </strong>
                      <small className="mt-1 block text-xs font-medium text-slate-500">
                        {service.short}
                      </small>
                    </span>

                    <span className="text-sky-300 transition group-hover:translate-x-1">
                      →
                    </span>
                  </button>
                ))
              ) : (
                <div className="rounded-2xl border border-white/[0.08] bg-white/[0.035] p-6">
                  <strong className="text-white">
                    Keine direkte Leistung gefunden
                  </strong>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    Sende uns deine Anfrage. Wir prüfen passende Anbieter.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}