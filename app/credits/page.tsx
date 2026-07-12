"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  Check,
  CreditCard,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";

type PlanId =
  | "starter"
  | "pro"
  | "business"
  | "agency"
  | "enterprise";

type CreditPlan = {
  id: PlanId;
  name: string;
  credits: number;
  price: number;
  badge: string | null;
  description: string;
  features: string[];
  featured: boolean;
};

const plans: CreditPlan[] = [
  {
    id: "starter",
    name: "Starter",
    credits: 20,
    price: 29,
    badge: null,
    description:
      "Ideal für den Einstieg und erste Freischaltungen. Perfekt, um Auftrago kennenzulernen und erste passende Kundenanfragen zu prüfen.",
    features: [
      "20 Credits sofort verfügbar",
      "Ideal für erste Freischaltungen",
      "Kein Abo und keine Fixkosten",
      "Credits verfallen nicht",
    ],
    featured: false,
  },
  {
    id: "pro",
    name: "Pro",
    credits: 50,
    price: 69,
    badge: "Beliebteste Wahl",
    description:
      "Das passende Paket für aktive Anbieter, die regelmässig neue Kundenanfragen freischalten und ihr Auftragsvolumen steigern möchten.",
    features: [
      "50 Credits sofort verfügbar",
      "CHF 1.38 pro Credit",
      "Ideal für aktive Anbieter",
      "Kein Abo und keine Fixkosten",
    ],
    featured: true,
  },
  {
    id: "business",
    name: "Business",
    credits: 100,
    price: 129,
    badge: "Spare CHF 16",
    description:
      "Für Unternehmen mit konstantem Leadbedarf, mehreren Einsatzgebieten und einem klaren Fokus auf nachhaltige Neukundengewinnung.",
    features: [
      "100 Credits sofort verfügbar",
      "CHF 1.29 pro Credit",
      "Ideal für regelmässige Freischaltungen",
      "Besserer Preis pro Credit",
    ],
    featured: false,
  },
  {
    id: "agency",
    name: "Agency",
    credits: 250,
    price: 299,
    badge: "Starke Ersparnis",
    description:
      "Für wachsende Unternehmen und Anbieter, die mehrere Regionen oder verschiedene Dienstleistungen gleichzeitig bedienen.",
    features: [
      "250 Credits sofort verfügbar",
      "Nur rund CHF 1.20 pro Credit",
      "Ideal für hohes Leadvolumen",
      "Für Wachstum und Skalierung",
    ],
    featured: false,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    credits: 500,
    price: 549,
    badge: "Bester Preis",
    description:
      "Das grösste Paket für professionelle Anbieter mit hohem Bedarf an qualifizierten und regionalen Kundenanfragen.",
    features: [
      "500 Credits sofort verfügbar",
      "Nur rund CHF 1.10 pro Credit",
      "Bester Preis pro Credit",
      "Ideal für professionelle Anbieter",
    ],
    featured: false,
  },
];

const comparisonRows = [
  {
    label: "Credits",
    values: ["20", "50", "100", "250", "500"],
  },
  {
    label: "Paketpreis",
    values: ["CHF 29", "CHF 69", "CHF 129", "CHF 299", "CHF 549"],
  },
  {
    label: "Preis pro Credit",
    values: ["CHF 1.45", "CHF 1.38", "CHF 1.29", "CHF 1.20", "CHF 1.10"],
  },
  {
    label: "Abonnement",
    values: ["Nein", "Nein", "Nein", "Nein", "Nein"],
  },
  {
    label: "Sofort verfügbar",
    values: ["Ja", "Ja", "Ja", "Ja", "Ja"],
  },
];

const faqs = [
  {
    question: "Wie funktionieren Credits?",
    answer:
      "Mit Credits kannst du passende Kundenanfragen freischalten. Vor dem Kauf siehst du die Kategorie, die Region und wichtige Eckdaten des Auftrags.",
  },
  {
    question: "Gibt es ein Abonnement?",
    answer:
      "Nein. Alle Credit-Pakete sind einmalige Käufe. Es gibt keine monatlichen Gebühren und keine automatische Verlängerung.",
  },
  {
    question: "Wann werden die Credits gutgeschrieben?",
    answer:
      "Nach erfolgreicher Zahlung werden die gekauften Credits automatisch deinem Anbieterkonto gutgeschrieben.",
  },
  {
    question: "Verfallen meine Credits?",
    answer:
      "Nein. Deine gekauften Credits bleiben in deinem Anbieterkonto verfügbar, bis du sie für passende Kundenanfragen einsetzt.",
  },
];

function formatCreditPrice(price: number, credits: number) {
  return (price / credits).toFixed(2);
}

export default function CreditsPage() {
  const [loading, setLoading] = useState<PlanId | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function buy(planId: PlanId) {
    setLoading(planId);
    setError(null);

    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          planId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || "Der Checkout konnte nicht gestartet werden."
        );
      }

      if (!data?.url) {
        throw new Error("Stripe hat keine Checkout-URL zurückgegeben.");
      }

      window.location.href = data.url;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Der Checkout konnte nicht gestartet werden.";

      setError(message);
      setLoading(null);
    }
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
        <div className="mx-auto max-w-7xl px-4 pb-12 pt-8 sm:px-6 sm:pb-16 sm:pt-12 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2.5 backdrop-blur transition hover:bg-white/10 sm:px-5 sm:py-3"
          >
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#7EC8FF]" />

            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-white/80 sm:text-sm sm:tracking-[0.28em]">
              AUFTRAGO
            </span>
          </Link>

          <div className="mt-10 max-w-4xl">
            <div className="inline-flex max-w-full items-start gap-3 rounded-[24px] border border-white/10 bg-white/5 px-4 py-3 text-left backdrop-blur sm:items-center sm:gap-2 sm:rounded-full sm:px-4 sm:py-2.5">
              <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-[#7EC8FF] sm:mt-0" />

              <span className="text-[11px] uppercase leading-relaxed tracking-[0.16em] text-white/60 sm:text-xs sm:tracking-[0.22em]">
                Credits kaufen und Kundenanfragen direkt freischalten
              </span>
            </div>

            <h1 className="mt-6 text-4xl font-semibold leading-[1.02] sm:text-5xl md:text-6xl xl:text-7xl">
              Das passende Paket für deine{" "}
              <span className="bg-gradient-to-r from-white via-[#d7f0ff] to-[#7EC8FF] bg-clip-text text-transparent">
                Neukundengewinnung
              </span>
            </h1>

            <p className="mt-6 max-w-3xl text-base leading-7 text-white/68 sm:text-lg sm:leading-8">
              Kaufe Credits, schalte passende Kundenanfragen frei und
              kontaktiere potenzielle Auftraggeber direkt. Du bezahlst nur für
              Anfragen, die für dein Unternehmen wirklich interessant sind.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/70">
                ✓ Keine Abonnemente
              </div>

              <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/70">
                ✓ Sichere Stripe-Zahlung
              </div>

              <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/70">
                ✓ Credits verfallen nicht
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mb-10 grid gap-4 sm:grid-cols-3">
          <div className="rounded-[24px] border border-white/10 bg-white/5 p-5 backdrop-blur">
            <CreditCard className="h-6 w-6 text-[#7EC8FF]" />

            <div className="mt-4 text-xs uppercase tracking-[0.16em] text-white/45">
              Flexibel
            </div>

            <div className="mt-2 text-2xl font-semibold text-white sm:text-3xl">
              Ohne Abo
            </div>

            <div className="mt-2 text-sm leading-6 text-white/55">
              Kaufe Credits nur dann, wenn du sie wirklich brauchst.
            </div>
          </div>

          <div className="rounded-[24px] border border-white/10 bg-white/5 p-5 backdrop-blur">
            <Zap className="h-6 w-6 text-[#7EC8FF]" />

            <div className="mt-4 text-xs uppercase tracking-[0.16em] text-white/45">
              Direkt
            </div>

            <div className="mt-2 text-2xl font-semibold text-white sm:text-3xl">
              Sofort verfügbar
            </div>

            <div className="mt-2 text-sm leading-6 text-white/55">
              Nach erfolgreicher Zahlung stehen die Credits im Konto bereit.
            </div>
          </div>

          <div className="rounded-[24px] border border-white/10 bg-white/5 p-5 backdrop-blur">
            <ShieldCheck className="h-6 w-6 text-[#7EC8FF]" />

            <div className="mt-4 text-xs uppercase tracking-[0.16em] text-white/45">
              Transparent
            </div>

            <div className="mt-2 text-2xl font-semibold text-white sm:text-3xl">
              Volle Kontrolle
            </div>

            <div className="mt-2 text-sm leading-6 text-white/55">
              Du entscheidest selbst, welche Kundenanfrage du freischaltest.
            </div>
          </div>
        </div>

        {error ? (
          <div className="mb-8 rounded-2xl border border-red-400/20 bg-red-400/10 px-5 py-4 text-sm leading-6 text-red-100">
            {error}
          </div>
        ) : null}

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {plans.map((plan) => {
            const creditPrice = formatCreditPrice(
              plan.price,
              plan.credits
            );

            return (
              <article
                key={plan.id}
                className={[
                  "relative flex min-h-full flex-col justify-between overflow-hidden rounded-[30px] border p-5 backdrop-blur transition duration-300 sm:p-6",
                  plan.featured
                    ? "border-[#7EC8FF]/40 bg-[linear-gradient(180deg,rgba(126,200,255,0.18),rgba(255,255,255,0.05))] shadow-[0_24px_90px_rgba(126,200,255,0.14)] xl:-translate-y-2"
                    : "border-white/10 bg-white/[0.04] hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.06]",
                ].join(" ")}
              >
                {plan.featured ? (
                  <div className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-[#7EC8FF]/25 bg-[#7EC8FF]/12 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#d8f3ff]">
                    <Zap size={12} />
                    Beliebt
                  </div>
                ) : null}

                <div>
                  <div className="text-xs uppercase tracking-[0.16em] text-white/45">
                    Credit-Paket
                  </div>

                  <h2 className="mt-2 pr-20 text-2xl font-semibold text-white sm:text-3xl">
                    {plan.name}
                  </h2>

                  <div className="mt-6 flex items-end gap-2">
                    <div className="text-5xl font-semibold leading-none text-white">
                      {plan.credits}
                    </div>

                    <div className="pb-1 text-sm uppercase tracking-[0.14em] text-[#9fd8ff]">
                      Credits
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap items-center gap-3">
                    <div className="text-3xl font-bold text-white">
                      CHF {plan.price}
                    </div>

                    {plan.badge ? (
                      <div className="inline-flex rounded-full border border-[#7EC8FF]/20 bg-[#7EC8FF]/10 px-3 py-1 text-xs font-medium text-[#bfe7ff]">
                        {plan.badge}
                      </div>
                    ) : null}
                  </div>

                  <div className="mt-2 text-sm text-white/45">
                    CHF {creditPrice} pro Credit
                  </div>

                  <p className="mt-5 text-sm leading-7 text-white/62 sm:text-base sm:leading-8">
                    {plan.description}
                  </p>

                  <div className="mt-6 space-y-3">
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
                  type="button"
                  onClick={() => buy(plan.id)}
                  disabled={loading !== null}
                  className={[
                    "mt-8 inline-flex min-h-[54px] w-full items-center justify-center gap-2 rounded-2xl px-5 py-3 text-base font-semibold transition disabled:cursor-not-allowed disabled:opacity-60",
                    plan.featured
                      ? "bg-[#7EC8FF] text-[#04101d] shadow-[0_20px_60px_rgba(126,200,255,0.20)] hover:bg-[#91d2ff]"
                      : "border border-white/10 bg-white/5 text-white hover:bg-white/10",
                  ].join(" ")}
                >
                  {loading === plan.id ? (
                    "Weiterleitung..."
                  ) : (
                    <>
                      Credits kaufen
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </article>
            );
          })}
        </div>
      </section>

      <section className="relative mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="rounded-[30px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur sm:p-8">
          <div className="max-w-3xl">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9fd8ff]">
              Paketvergleich
            </div>

            <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">
              Welches Paket passt zu deinem Unternehmen?
            </h2>

            <p className="mt-4 text-sm leading-7 text-white/55 sm:text-base">
              Je grösser das Paket, desto günstiger wird der Preis pro Credit.
            </p>
          </div>

          <div className="mt-8 overflow-x-auto">
            <table className="min-w-[850px] w-full border-separate border-spacing-0">
              <thead>
                <tr>
                  <th className="border-b border-white/10 px-4 py-4 text-left text-sm text-white/45">
                    Vergleich
                  </th>

                  {plans.map((plan) => (
                    <th
                      key={plan.id}
                      className="border-b border-white/10 px-4 py-4 text-left text-sm font-semibold text-white"
                    >
                      {plan.name}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {comparisonRows.map((row) => (
                  <tr key={row.label}>
                    <td className="border-b border-white/[0.06] px-4 py-4 text-sm font-semibold text-white/60">
                      {row.label}
                    </td>

                    {row.values.map((value, index) => (
                      <td
                        key={`${row.label}-${plans[index].id}`}
                        className="border-b border-white/[0.06] px-4 py-4 text-sm text-white/75"
                      >
                        {value}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="relative mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="rounded-[30px] border border-white/10 bg-[#081122]/85 p-5 sm:p-8">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9fd8ff]">
            Häufige Fragen
          </div>

          <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">
            Alles Wichtige zum Credit-System
          </h2>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {faqs.map((faq) => (
              <article
                key={faq.question}
                className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5 sm:p-6"
              >
                <h3 className="text-lg font-semibold text-white">
                  {faq.question}
                </h3>

                <p className="mt-3 text-sm leading-7 text-white/55">
                  {faq.answer}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative mx-auto max-w-7xl px-4 pb-20 sm:px-6 sm:pb-28 lg:px-8">
        <div className="overflow-hidden rounded-[34px] border border-[#7EC8FF]/20 bg-[linear-gradient(135deg,rgba(126,200,255,0.15),rgba(255,255,255,0.04))] p-6 text-center shadow-[0_24px_90px_rgba(126,200,255,0.10)] sm:p-10 md:p-14">
          <ShieldCheck className="mx-auto h-9 w-9 text-[#7EC8FF]" />

          <h2 className="mt-5 text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl">
            Sicher bezahlen. Sofort starten.
          </h2>

          <p className="mx-auto mt-5 max-w-3xl text-base leading-7 text-white/60 sm:text-lg sm:leading-8">
            Alle Zahlungen werden sicher über Stripe abgewickelt. Nach
            erfolgreicher Zahlung werden deine Credits automatisch deinem
            Anbieterkonto gutgeschrieben.
          </p>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-3 text-sm font-semibold text-white/65">
            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">
              🔒 Sichere Zahlung
            </span>

            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">
              ⚡ Sofortige Gutschrift
            </span>

            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">
              ✓ Keine Laufzeit
            </span>
          </div>
        </div>
      </section>
    </main>
  );
}