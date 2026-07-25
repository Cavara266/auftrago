"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type CurrentUser = {
  id: string;
  email: string;
  name?: string | null;
  companyName?: string;
  contactName?: string;
  role: string;
  credits: number;
};

const nav = [
  { href: "/", label: "Start" },
  { href: "/preisrechner", label: "💰 Preisrechner" },
  { href: "/anfrage", label: "Anfrage eingeben" },
  { href: "/leads", label: "Auftrag suchen" },
  {
    href: "/credits",
    label: "🪙 Credits kaufen",
    highlight: true,
  },
  { href: "/dashboard", label: "Dashboard" },
];

export default function Header() {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadCurrentUser() {
      try {
        const response = await fetch("/api/me", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });

        if (!response.ok) {
          if (active) setUser(null);
          return;
        }

        const data = await response.json();

        if (active && data?.ok && data?.user) {
          setUser(data.user);
        } else if (active) {
          setUser(null);
        }
      } catch (error) {
        console.error("USER LOAD ERROR:", error);

        if (active) {
          setUser(null);
        }
      } finally {
        if (active) {
          setLoadingUser(false);
        }
      }
    }

    loadCurrentUser();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!mobileMenuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMobileMenuOpen(false);
      }
    }

    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [mobileMenuOpen]);

  const hasLowCredits =
    !loadingUser &&
    user !== null &&
    Number.isFinite(user.credits) &&
    user.credits <= 10;

  function closeMobileMenu() {
    setMobileMenuOpen(false);
  }

  function toggleMobileMenu() {
    setMobileMenuOpen((current) => !current);
  }

  return (
    <>
      {hasLowCredits ? (
        <div className="relative z-[70] border-b border-red-400/20 bg-[#2a0b12] px-4 py-2.5">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 text-center sm:flex-row sm:text-left">
            <div className="text-sm font-semibold text-red-100">
              🔴 Credits fast aufgebraucht: Du hast nur noch{" "}
              <span className="font-bold">{user.credits} Credits</span>.
            </div>

            <Link
              href="/credits"
              onClick={closeMobileMenu}
              className="inline-flex min-h-[38px] items-center justify-center rounded-full bg-red-500 px-5 py-2 text-sm font-bold text-white shadow-lg shadow-red-500/20 transition hover:bg-red-400"
            >
              Jetzt Credits kaufen
            </Link>
          </div>
        </div>
      ) : null}

      <header className="sticky top-0 z-[60] w-full border-b border-white/10 bg-[#030712]/95 shadow-[0_10px_40px_rgba(0,0,0,0.24)] backdrop-blur-xl supports-[backdrop-filter]:bg-[#030712]/80">
        <div
          className="mx-auto flex min-h-[72px] max-w-7xl items-center justify-between gap-3 px-4 sm:px-6"
          style={{
            paddingTop: "env(safe-area-inset-top)",
          }}
        >
          <Link
            href="/"
            className="flex min-w-0 shrink-0 items-center gap-3"
            onClick={closeMobileMenu}
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-orange-400/20 bg-orange-500/10 text-xl shadow-lg shadow-orange-500/10">
              🔥
            </div>

            <div className="min-w-0">
              <div className="truncate text-xl font-black tracking-tight text-white">
                Auftrago
              </div>

              <div className="hidden text-[9px] font-semibold uppercase tracking-[0.22em] text-white/40 min-[390px]:block">
                Premium Vermittlung
              </div>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 xl:flex">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={
                  item.highlight
                    ? "rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 px-5 py-2.5 text-sm font-bold text-[#171006] shadow-lg shadow-yellow-500/20 transition hover:scale-[1.03] hover:shadow-yellow-500/30"
                    : "rounded-full px-4 py-2.5 text-sm font-semibold text-white/70 transition hover:bg-white/10 hover:text-white"
                }
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex xl:hidden">
            <Link
              href="/credits"
              onClick={closeMobileMenu}
              className="rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 px-4 py-2.5 text-sm font-bold text-[#171006] shadow-lg shadow-yellow-500/20 transition hover:scale-[1.03]"
            >
              🪙 Credits kaufen
            </Link>

            <button
              type="button"
              onClick={toggleMobileMenu}
              aria-label={mobileMenuOpen ? "Menü schliessen" : "Menü öffnen"}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-xl text-white transition hover:bg-white/10"
            >
              {mobileMenuOpen ? "✕" : "☰"}
            </button>
          </div>

          <button
            type="button"
            onClick={toggleMobileMenu}
            aria-label={mobileMenuOpen ? "Menü schliessen" : "Menü öffnen"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-xl text-white transition hover:bg-white/10 md:hidden"
          >
            {mobileMenuOpen ? "✕" : "☰"}
          </button>
        </div>

        {mobileMenuOpen ? (
          <>
            <button
              type="button"
              aria-label="Menü schliessen"
              onClick={closeMobileMenu}
              className="fixed inset-0 top-[72px] z-[-1] cursor-default bg-black/65 backdrop-blur-sm xl:hidden"
            />

            <div
              id="mobile-navigation"
              className="absolute left-0 right-0 top-full max-h-[calc(100dvh-72px)] overflow-y-auto border-t border-white/10 bg-[#050914] px-4 py-4 shadow-2xl xl:hidden"
              style={{
                paddingBottom: "calc(16px + env(safe-area-inset-bottom))",
              }}
            >
              <nav className="mx-auto grid max-w-7xl gap-2">
                {nav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeMobileMenu}
                    className={
                      item.highlight
                        ? "flex min-h-[48px] items-center justify-center rounded-2xl bg-gradient-to-r from-yellow-400 to-amber-500 px-5 py-3 text-sm font-bold text-[#171006]"
                        : "flex min-h-[48px] items-center rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white/80 transition hover:bg-white/10"
                    }
                  >
                    {item.label}
                  </Link>
                ))}

                {user ? (
                  <div className="mt-2 flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
                    <div className="min-w-0">
                      <div className="text-xs uppercase tracking-[0.16em] text-white/40">
                        Creditstand
                      </div>

                      <div className="mt-1 truncate text-lg font-bold text-white">
                        {user.credits} Credits
                      </div>
                    </div>

                    <Link
                      href="/credits"
                      onClick={closeMobileMenu}
                      className="shrink-0 rounded-full border border-yellow-400/20 bg-yellow-400/10 px-4 py-2 text-sm font-bold text-yellow-200"
                    >
                      Aufladen
                    </Link>
                  </div>
                ) : null}
              </nav>
            </div>
          </>
        ) : null}
      </header>
    </>
  );
}