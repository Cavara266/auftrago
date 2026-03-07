"use client";

import Link from "next/link";
import { useState } from "react";
import { Check, Zap } from "lucide-react";

const plans = [
  {
    id: "starter",
    name: "Starter",
    credits: 20,
    price: 28,
    discount: null,
    description: "Ideal für den Einstieg und erste Freischaltungen.",
    features: [
      "20 Credits sofort verfügbar",
      "Perfekt für erste Leads",
      "Keine laufenden Fixkosten",
    ],
    featured: false,
  },
  {
    id: "pro",
    name: "Pro",
    credits: 50,
    price: 63,
    discount: "10% Rabatt",
    description: "Das beste Paket für regelmässige Lead-Freischaltungen.",
    features: [
      "50 Credits für mehr Reichweite",
      "Besserer Preis pro Lead",
      "Ideal für aktive Anbieter",
    ],
    featured: true,
  },
  {
    id: "business",
    name: "Business",
    credits: 100,
    price: 112,
    discount: "20% Rabatt",
    description: "Für Unternehmen, die konstant neue Aufträge gewinnen möchten.",
    features: [
      "100 Credits mit starkem Preis",
      "Ideal für laufende Kampagnen",
      "Für Wachstum und Skalierung",
    ],
    featured: false,
  },
];

export default function CreditsPage() {
  const [loading, setLoading] = useState<string | null>(null);

  async function buy(planId: string) {
    setLoading(planId);

    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ planId }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data?.error || "Fehler beim Checkout");
        setLoading(null);
        return;
      }

      if (data.url) {
        window.location.href = data.url;
        return;
      }

      alert("Keine Stripe URL erhalten.");
    } catch {
      alert("Fehler beim Checkout");
    }

    setLoading(null);
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#030816] text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-20%] top-[-10%] h-[260px] w-[260px] rounded-full bg-cyan-400/12 blur-3xl sm:left-[-10%] sm:h-[380px] sm:w-[380px]" />
        <div className="absolute right-[-20%] top-[10%] h-[280px] w-[280px] rounded-full bg-sky-400/10 blur-3xl sm:right-[-10%] sm:h-[420px] sm:w-[420px]" />
        <div className="absolute bottom-[-10%] left-[10%] h-[240px] w-[240px] rounded-full bg-blue-500/10 blur-3xl sm:left-[20%] sm:h-[340px] sm:w-[340px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(126,200,255,0.08),transparent_35%),linear-gradient(to_bottom,rgba(255,255,255,0.02),transparent)]" />
      </div>

      <section className="relative border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 pb-10 pt-5 sm:px-6 sm:pb-14 sm:pt-8 lg:px-8">
          <div className="mb-8 flex items-center justify-between gap-3 sm:mb-10">
            <Link
              href="/"
              className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2.5 backdrop-blur sm:px-5 sm:py-3"
            >
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#7EC8FF]" />
              <span className="text-xs font-semibold uppercase tracking-[0.22em] text-white/80 sm:text-sm sm:tracking-[0.28em]">
                AUFTRAGO
              </span>
            </Link>

            <div className="hidden items-center gap-3 md:flex">
              <Link
                href="/preise"
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white/80 transition hover:bg-white/10"
              >
                Preise
              </Link>
              <Link
                href="/dashboard"
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white/80 transition hover:bg-white/10"
              >
                Dashboard
              </Link>
            </div>
          </div>

          <div className="max-w-4xl">
            <div className="inline-flex max-w-full items-start gap-3 rounded-[24px] border border-white/10 bg-white/5 px-4 py-3 text-left backdrop-blur sm:items-center sm:gap-2 sm:rounded-full sm:px-4 sm:py-2.5">
              <span className="mt-1 inline-block h-2.5 w-2.5 shrink-0 rounded-full bg-[#7EC8FF] sm:mt-0 sm:h-2 sm:w-2" />
              <span className="text-[11px] uppercase leading-relaxed tracking-[0.16em] text-white/60 sm:text-xs sm:tracking-[0.22em]">
                Credits kaufen und Leads direkt freischalten
              </span>
            </div>

            <h1 className="mt-5 text-3xl font-semibold leading-[1.02] sm:mt-6 sm:text-4xl md:text-5xl xl:text-6xl">
              Credits für neue{" "}
              <span className="bg-gradient-to-r from-white via-[#d7f0ff] to-[#7EC8FF] bg-clip-text text-transparent">
                Kundenanfragen
              </span>
            </h1>

            <p className="mt-5 max-w-3xl text-base leading-7 text-white/68 sm:text-lg sm:leading-8">
              Kaufe Credits, schalte passende Leads frei und kontaktiere Kunden
              direkt. Du zahlst nur dann, wenn du einen Lead wirklich nutzen
              möchtest.
            </p>
          </div>
        </div>
      </section>

      <section className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-[24px] border border-white/10 bg-white/5 p-4 sm:p-5">
            <div className="text-xs uppercase tracking-[0.16em] text-white/45">
              Flexibel
            </div>
            <div className="mt-2 text-2xl font-semibold text-white sm:text-3xl">
              Ohne Abo
            </div>
            <div className="mt-1 text-sm text-white/55">
              Nur Credits kaufen, wenn du sie brauchst.
            </div>
          </div>

          <div className="rounded-[24px] border border-white/10 bg-white/5 p-4 sm:p-5">
            <div className="text-xs uppercase tracking-[0.16em] text-white/45">
              Direkt
            </div>
            <div className="mt-2 text-2xl font-semibold text-white sm:text-3xl">
              Sofort aktiv
            </div>
            <div className="mt-1 text-sm text-white/55">
              Nach erfolgreicher Zahlung direkt verfügbar.
            </div>
          </div>

          <div className="rounded-[24px] border border-white/10 bg-white/5 p-4 sm:p-5">
            <div className="text-xs uppercase tracking-[0.16em] text-white/45">
              Fair
            </div>
            <div className="mt-2 text-2xl font-semibold text-white sm:text-3xl">
              Pay-per-Lead
            </div>
            <div className="mt-1 text-sm text-white/55">
              Nur zahlen, wenn ein Kontakt interessant ist.
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:gap-5 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={[
                "relative flex flex-col justify-between overflow-hidden rounded-[28px] border p-5 backdrop-blur transition duration-300 sm:p-6",
                plan.featured
                  ? "border-[#7EC8FF]/25 bg-[linear-gradient(180deg,rgba(126,200,255,0.14),rgba(255,255,255,0.05))] shadow-[0_20px_80px_rgba(126,200,255,0.10)]"
                  : "border-white/10 bg-white/[0.04] hover:bg-white/[0.06]",
              ].join(" ")}
            >
              {plan.featured ? (
                <div className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full border border-[#7EC8FF]/25 bg-[#7EC8FF]/12 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-[#d8f3ff]">
                  <Zap size={12} />
                  Beliebt
                </div>
              ) : null}

              <div>
                <div className="text-xs uppercase tracking-[0.16em] text-white/45">
                  Paket
                </div>

                <h2 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">
                  {plan.name}
                </h2>

                <div className="mt-5 text-4xl font-semibold text-white sm:text-5xl">
                  {plan.credits}
                </div>

                <div className="mt-1 text-sm uppercase tracking-[0.16em] text-[#9fd8ff]">
                  Credits
                </div>

                <div className="mt-5 text-3xl font-bold text-white">
                  CHF {plan.price}
                </div>

                <div className="mt-2 min-h-[24px]">
                  {plan.discount ? (
                    <div className="inline-flex rounded-full border border-[#7EC8FF]/20 bg-[#7EC8FF]/10 px-3 py-1 text-xs font-medium text-[#bfe7ff]">
                      {plan.discount}
                    </div>
                  ) : (
                    <div className="text-sm text-white/35"> </div>
                  )}
                </div>

                <p className="mt-5 text-sm leading-7 text-white/62 sm:text-base sm:leading-8">
                  {plan.description}
                </p>

                <div className="mt-5 space-y-3">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-3">
                      <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#7EC8FF]/12 text-[#bfe7ff]">
                        <Check size={12} />
                      </div>
                      <div className="text-sm leading-6 text-white/72">
                        {feature}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => buy(plan.id)}
                disabled={loading === plan.id}
                className={[
                  "mt-8 inline-flex min-h-[54px] w-full items-center justify-center rounded-2xl px-5 py-3 text-base font-semibold transition disabled:cursor-not-allowed disabled:opacity-60",
                  plan.featured
                    ? "bg-[#7EC8FF] text-[#04101d] hover:bg-[#91d2ff]"
                    : "border border-white/10 bg-white/5 text-white hover:bg-white/10",
                ].join(" ")}
              >
                {loading === plan.id ? "Weiterleitung..." : "Credits kaufen"}
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 sm:pb-24 lg:px-8">
        <div className="rounded-[28px] border border-white/10 bg-white/5 p-5 text-center backdrop-blur sm:rounded-[34px] sm:p-8 md:p-12">
          <div className="text-xs uppercase tracking-[0.18em] text-white/45 sm:text-sm sm:tracking-[0.24em]">
            Hinweis
          </div>

          <h2 className="mt-4 text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl">
            Credits werden für die Freischaltung von Leads verwendet
          </h2>

          <p className="mx-auto mt-5 max-w-3xl text-base leading-7 text-white/66 sm:text-lg sm:leading-8">
            Je nach Lead kostet die Freischaltung unterschiedlich viele Credits.
            So bleibt das Modell fair, flexibel und direkt an den tatsächlichen
            Anfragen orientiert.
          </p>

          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:mt-8 sm:flex-row sm:flex-wrap sm:gap-4">
            <Link
              href="/leads"
              className="inline-flex min-h-[54px] w-full items-center justify-center rounded-2xl bg-[#7EC8FF] px-6 py-4 text-base font-semibold text-[#04101d] shadow-[0_20px_80px_rgba(126,200,255,0.28)] transition hover:bg-[#91d2ff] sm:w-auto sm:px-7"
            >
              Leads ansehen
            </Link>

            <Link
              href="/preise"
              className="inline-flex min-h-[54px] w-full items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-base font-semibold text-white/90 transition hover:bg-white/10 sm:w-auto sm:px-7"
            >
              Preisdetails
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}