"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

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
    href: "/settings/leads",
    label: "Regionen & Kategorien",
    icon: "📍",
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
  {
    href: "/leistungen",
    label: "Leistungen",
  },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  function isActive(href: string) {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname.startsWith(href);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#020617]/95 shadow-[0_12px_45px_rgba(0,0,0,0.28)] backdrop-blur-xl">
      <div className="mx-auto flex min-h-[88px] max-w-[1500px] items-center justify-between gap-5 px-5 sm:px-7 lg:px-10">
        <Link
          href="/"
          onClick={() => setMobileMenuOpen(false)}
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

        <nav className="hidden items-center gap-1 xl:flex">
          {navigation.map((item) => {
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  "relative inline-flex min-h-[46px] items-center justify-center gap-2 whitespace-nowrap rounded-xl px-4 text-[15px] font-bold transition duration-200",
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
        </nav>

        <div className="hidden shrink-0 items-center gap-3 lg:flex">
          <Link
            href="/credits"
            className={[
              "group inline-flex min-h-[48px] items-center justify-center gap-2 whitespace-nowrap rounded-2xl border px-5 text-[15px] font-black transition duration-200",
              pathname.startsWith("/credits")
                ? "border-yellow-300/60 bg-gradient-to-r from-yellow-300 to-amber-400 text-[#171006] shadow-[0_12px_38px_rgba(250,204,21,0.28)]"
                : "border-yellow-300/30 bg-yellow-300/10 text-yellow-200 shadow-[0_12px_38px_rgba(250,204,21,0.10)] hover:-translate-y-0.5 hover:bg-gradient-to-r hover:from-yellow-300 hover:to-amber-400 hover:text-[#171006]",
            ].join(" ")}
          >
            <span className="text-base transition group-hover:scale-110">
              🪙
            </span>

            <span>Credits kaufen</span>
          </Link>

          <Link
            href="/anbieter-registrieren"
            className="inline-flex min-h-[48px] items-center justify-center whitespace-nowrap rounded-2xl px-4 text-[15px] font-bold text-slate-300 transition hover:bg-white/[0.06] hover:text-white"
          >
            Anbieter werden
          </Link>

          <Link
            href="/offerte-anfragen"
            className="inline-flex min-h-[52px] items-center justify-center whitespace-nowrap rounded-2xl bg-white px-6 text-[15px] font-black text-[#050816] shadow-[0_16px_45px_rgba(255,255,255,0.13)] transition duration-200 hover:-translate-y-0.5 hover:bg-sky-100 hover:shadow-[0_18px_50px_rgba(125,211,252,0.20)]"
          >
            Anfrage senden
          </Link>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <Link
            href="/credits"
            aria-label="Credits kaufen"
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-yellow-300/30 bg-yellow-300/10 text-lg shadow-[0_8px_28px_rgba(250,204,21,0.10)]"
          >
            🪙
          </Link>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((current) => !current)}
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

      {mobileMenuOpen ? (
        <div className="border-t border-white/10 bg-[#030816]/98 px-4 pb-6 pt-4 backdrop-blur-xl lg:hidden">
          <nav className="mx-auto grid max-w-3xl gap-2">
            {navigation.map((item) => {
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
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

            <Link
              href="/credits"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-2 flex min-h-[52px] items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-yellow-300 to-amber-400 px-5 text-[15px] font-black text-[#171006] shadow-[0_12px_38px_rgba(250,204,21,0.20)]"
            >
              <span>🪙</span>
              <span>Credits kaufen</span>
            </Link>

            <Link
              href="/anbieter-registrieren"
              onClick={() => setMobileMenuOpen(false)}
              className="flex min-h-[50px] items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] px-5 text-[15px] font-bold text-white"
            >
              Anbieter werden
            </Link>

            <Link
              href="/offerte-anfragen"
              onClick={() => setMobileMenuOpen(false)}
              className="flex min-h-[52px] items-center justify-center rounded-2xl bg-white px-5 text-[15px] font-black text-[#050816]"
            >
              Anfrage senden
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}