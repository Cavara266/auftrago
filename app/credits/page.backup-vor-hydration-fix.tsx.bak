"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  Check,
  ChevronRight,
  CreditCard,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  WalletCards,
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
  eyebrow: string;
  description: string;
  features: string[];
  featured: boolean;
  accent: "blue" | "violet" | "amber";
};

const plans: CreditPlan[] = [
  {
    id: "starter",
    name: "Starter",
    credits: 20,
    price: 29,
    badge: null,
    eyebrow: "Zum Testen",
    description:
      "Ideal für den Einstieg und die ersten Freischaltungen ohne langfristige Verpflichtung.",
    features: [
      "20 Credits sofort verfügbar",
      "Ideal für erste Freischaltungen",
      "Kein Abo und keine Fixkosten",
      "Credits verfallen nicht",
    ],
    featured: false,
    accent: "blue",
  },
  {
    id: "pro",
    name: "Pro",
    credits: 50,
    price: 69,
    badge: "Meistgekauft",
    eyebrow: "Beste Wahl",
    description:
      "Für aktive Anbieter, die regelmässig neue Kundenanfragen freischalten und wachsen möchten.",
    features: [
      "50 Credits sofort verfügbar",
      "CHF 1.38 pro Credit",
      "Ideal für aktive Anbieter",
      "Kein Abo und keine Fixkosten",
    ],
    featured: true,
    accent: "violet",
  },
  {
    id: "business",
    name: "Business",
    credits: 100,
    price: 129,
    badge: "Spare CHF 16",
    eyebrow: "Für Wachstum",
    description:
      "Für Unternehmen mit konstantem Leadbedarf und mehreren Einsatzgebieten.",
    features: [
      "100 Credits sofort verfügbar",
      "CHF 1.29 pro Credit",
      "Besserer Preis pro Credit",
      "Ideal für regelmässige Freischaltungen",
    ],
    featured: false,
    accent: "blue",
  },
  {
    id: "agency",
    name: "Agency",
    credits: 250,
    price: 299,
    badge: "Starke Ersparnis",
    eyebrow: "Für Teams",
    description:
      "Für Anbieter mit mehreren Regionen, mehreren Teams oder hohem Leadvolumen.",
    features: [
      "250 Credits sofort verfügbar",
      "Nur rund CHF 1.20 pro Credit",
      "Ideal für mehrere Regionen",
      "Für Wachstum und Skalierung",
    ],
    featured: false,
    accent: "amber",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    credits: 500,
    price: 549,
    badge: "Bester Preis",
    eyebrow: "Maximale Reichweite",
    description:
      "Das grösste Paket für professionelle Anbieter mit dauerhaft hohem Bedarf.",
    features: [
      "500 Credits sofort verfügbar",
      "Nur rund CHF 1.10 pro Credit",
      "Bester Preis pro Credit",
      "Ideal für professionelle Anbieter",
    ],
    featured: false,
    accent: "amber",
  },
];

const faqs = [
  {
    question: "Wie funktionieren Credits?",
    answer:
      "Mit Credits kannst du passende Kundenanfragen freischalten. Vor dem Kauf siehst du Kategorie, Region und die wichtigsten Eckdaten.",
  },
  {
    question: "Gibt es ein Abonnement?",
    answer:
      "Nein. Alle Credit-Pakete sind einmalige Käufe. Es gibt keine monatlichen Gebühren und keine automatische Verlängerung.",
  },
  {
    question: "Wann werden die Credits gutgeschrieben?",
    answer:
      "Nach erfolgreicher Stripe-Zahlung werden die Credits automatisch deinem Anbieterkonto gutgeschrieben.",
  },
  {
    question: "Verfallen meine Credits?",
    answer:
      "Nein. Deine gekauften Credits bleiben verfügbar, bis du sie für passende Kundenanfragen einsetzt.",
  },
];

function formatPrice(value: number) {
  return new Intl.NumberFormat("de-CH", {
    style: "currency",
    currency: "CHF",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatCreditPrice(price: number, credits: number) {
  return (price / credits).toFixed(2);
}

function savingsComparedWithStarter(plan: CreditPlan) {
  const starterPricePerCredit = plans[0].price / plans[0].credits;
  return Math.max(0, Math.round(starterPricePerCredit * plan.credits - plan.price));
}

export default function CreditsPage() {
  const [loading, setLoading] = useState<PlanId | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlanId, setSelectedPlanId] = useState<PlanId>("pro");
  const [jobValue, setJobValue] = useState(1200);

  const selectedPlan = useMemo(
    () => plans.find((plan) => plan.id === selectedPlanId) ?? plans[1],
    [selectedPlanId]
  );

  const estimatedMultiple = Math.max(1, Math.round(jobValue / selectedPlan.price));

  async function buy(planId: PlanId) {
    setLoading(planId);
    setError(null);

    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ planId }),
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
    <main className="relative min-h-screen overflow-hidden bg-[#040816] text-white">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-[-10%] top-[-10%] h-[520px] w-[520px] rounded-full bg-cyan-400/10 blur-[120px]" />
        <div className="absolute right-[-10%] top-[10%] h-[560px] w-[560px] rounded-full bg-violet-500/10 blur-[130px]" />
        <div className="absolute bottom-[-18%] left-[35%] h-[500px] w-[500px] rounded-full bg-blue-500/10 blur-[130px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.05),transparent_38%)]" />
      </div>

      <header className="relative border-b border-white/10 bg-[#040816]/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
          <Link href="/dashboard" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-300/10">
              <Sparkles className="h-5 w-5 text-cyan-200" />
            </span>
            <div>
              <div className="text-sm font-black uppercase tracking-[0.22em]">
                Auftrago
              </div>
              <div className="text-xs text-white/40">Credit Center</div>
            </div>
          </Link>

          <Link
            href="/dashboard"
            className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-4 text-sm font-semibold text-white/70 transition hover:bg-white/10 hover:text-white"
          >
            Zum Dashboard
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </header>

      <section className="relative border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 pb-16 pt-14 sm:px-6 sm:pb-20 sm:pt-20 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-cyan-100">
                <Zap className="h-4 w-4" />
                Credits kaufen. Leads freischalten. Aufträge gewinnen.
              </div>

              <h1 className="mt-7 max-w-4xl text-5xl font-semibold leading-[0.98] tracking-[-0.04em] sm:text-6xl lg:text-7xl">
                Mehr Aufträge.
                <span className="block bg-gradient-to-r from-white via-cyan-100 to-violet-300 bg-clip-text text-transparent">
                  Weniger Leerlauf.
                </span>
              </h1>

              <p className="mt-7 max-w-2xl text-base leading-8 text-white/60 sm:text-lg">
                Wähle dein Credit-Paket und schalte passende Kundenanfragen aus
                deiner Region frei. Kein Abo, keine Provision und volle Kontrolle.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#pakete"
                  className="inline-flex min-h-[54px] items-center justify-center gap-2 rounded-2xl bg-white px-6 py-3 text-sm font-black text-[#07111f] transition hover:bg-cyan-100"
                >
                  Pakete ansehen
                  <ArrowRight className="h-4 w-4" />
                </a>

                <Link
                  href="/leads"
                  className="inline-flex min-h-[54px] items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] px-6 py-3 text-sm font-bold text-white transition hover:bg-white/10"
                >
                  Aktuelle Leads ansehen
                </Link>
              </div>

              <div className="mt-8 flex flex-wrap gap-3 text-sm text-white/65">
                {["Keine Abonnemente", "Sichere Stripe-Zahlung", "Credits verfallen nicht"].map(
                  (item) => (
                    <span
                      key={item}
                      className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2"
                    >
                      <Check className="h-4 w-4 text-emerald-300" />
                      {item}
                    </span>
                  )
                )}
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-6 rounded-[36px] bg-cyan-400/10 blur-3xl" />
              <div className="relative overflow-hidden rounded-[34px] border border-white/10 bg-[linear-gradient(145deg,rgba(255,255,255,0.09),rgba(255,255,255,0.035))] p-6 shadow-[0_40px_120px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:p-8">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-[0.18em] text-white/40">
                      Empfohlenes Paket
                    </div>
                    <div className="mt-2 text-3xl font-semibold">{selectedPlan.name}</div>
                  </div>
                  <div className="rounded-2xl border border-violet-300/20 bg-violet-300/10 px-4 py-3 text-right">
                    <div className="text-2xl font-black text-violet-100">
                      {selectedPlan.credits}
                    </div>
                    <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-violet-100/60">
                      Credits
                    </div>
                  </div>
                </div>

                <div className="mt-7 rounded-[26px] border border-white/10 bg-black/10 p-5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/50">Paketpreis</span>
                    <strong className="text-xl">{formatPrice(selectedPlan.price)}</strong>
                  </div>
                  <div className="mt-4 flex items-center justify-between text-sm">
                    <span className="text-white/50">Preis pro Credit</span>
                    <strong>CHF {formatCreditPrice(selectedPlan.price, selectedPlan.credits)}</strong>
                  </div>
                  <div className="mt-4 flex items-center justify-between text-sm">
                    <span className="text-white/50">Gutschrift</span>
                    <strong className="text-emerald-300">Sofort</strong>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => buy(selectedPlan.id)}
                  disabled={loading !== null}
                  className="mt-6 inline-flex min-h-[56px] w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-300 to-violet-300 px-6 text-base font-black text-[#07111f] shadow-[0_20px_70px_rgba(126,200,255,0.22)] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading === selectedPlan.id ? "Weiterleitung..." : "Jetzt Credits kaufen"}
                  {loading !== selectedPlan.id ? <ArrowRight className="h-5 w-5" /> : null}
                </button>

                <p className="mt-4 text-center text-xs leading-5 text-white/40">
                  Einmaliger Kauf. Keine automatische Verlängerung.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              icon: WalletCards,
              eyebrow: "Flexibel",
              title: "Ohne Abo",
              text: "Kaufe Credits nur dann, wenn du sie wirklich brauchst.",
            },
            {
              icon: Zap,
              eyebrow: "Direkt",
              title: "Sofort verfügbar",
              text: "Nach erfolgreicher Zahlung stehen die Credits direkt bereit.",
            },
            {
              icon: ShieldCheck,
              eyebrow: "Transparent",
              title: "Volle Kontrolle",
              text: "Du entscheidest selbst, welche Kundenanfrage du freischaltest.",
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <article
                key={item.title}
                className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6 backdrop-blur"
              >
                <Icon className="h-6 w-6 text-cyan-200" />
                <div className="mt-5 text-xs font-bold uppercase tracking-[0.16em] text-white/35">
                  {item.eyebrow}
                </div>
                <h2 className="mt-2 text-2xl font-semibold">{item.title}</h2>
                <p className="mt-3 text-sm leading-7 text-white/55">{item.text}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="relative mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="grid gap-6 rounded-[34px] border border-white/10 bg-[linear-gradient(135deg,rgba(126,200,255,0.10),rgba(139,92,246,0.08),rgba(255,255,255,0.03))] p-6 shadow-[0_30px_100px_rgba(0,0,0,0.25)] sm:p-8 lg:grid-cols-[0.9fr_1.1fr] lg:p-10">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-white/65">
              <TrendingUp className="h-4 w-4 text-emerald-300" />
              Beispielrechnung
            </div>
            <h2 className="mt-5 text-3xl font-semibold sm:text-4xl">
              Was kann sich ein gewonnener Auftrag leisten?
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-white/55 sm:text-base">
              Stelle einen typischen Auftragswert ein. Die Berechnung ist nur ein
              Beispiel und keine Umsatzgarantie.
            </p>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-black/15 p-5 sm:p-6">
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm font-semibold text-white/60">Typischer Auftragswert</span>
              <strong className="text-2xl">{formatPrice(jobValue)}</strong>
            </div>

            <input
              type="range"
              min="300"
              max="5000"
              step="100"
              value={jobValue}
              onChange={(event) => setJobValue(Number(event.target.value))}
              className="mt-6 w-full accent-cyan-300"
              aria-label="Typischer Auftragswert"
            />

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <div className="text-xs uppercase tracking-[0.14em] text-white/35">Gewähltes Paket</div>
                <div className="mt-2 text-xl font-semibold">{selectedPlan.name}</div>
                <div className="mt-1 text-sm text-white/45">{formatPrice(selectedPlan.price)}</div>
              </div>
              <div className="rounded-2xl border border-emerald-300/15 bg-emerald-300/[0.06] p-4">
                <div className="text-xs uppercase tracking-[0.14em] text-emerald-100/45">Beispiel-Verhältnis</div>
                <div className="mt-2 text-xl font-semibold text-emerald-200">ca. {estimatedMultiple}×</div>
                <div className="mt-1 text-sm text-emerald-100/50">Auftragswert zum Paketpreis</div>
              </div>
            </div>

            <p className="mt-5 text-xs leading-6 text-white/35">
              Die tatsächliche Abschlussquote und der Auftragswert hängen von deinem Angebot,
              deiner Reaktionszeit und dem jeweiligen Kunden ab.
            </p>
          </div>
        </div>
      </section>

      {error ? (
        <div className="relative mx-auto max-w-7xl px-4 pb-6 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-red-400/20 bg-red-400/10 px-5 py-4 text-sm text-red-100">
            {error}
          </div>
        </div>
      ) : null}

      <section id="pakete" className="relative mx-auto max-w-7xl scroll-mt-24 px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-3xl">
          <div className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-200/70">Credit-Pakete</div>
          <h2 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
            Wähle das Paket, das zu deinem Wachstum passt.
          </h2>
          <p className="mt-4 text-base leading-8 text-white/55">
            Je grösser das Paket, desto günstiger wird der Preis pro Credit.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {plans.map((plan) => {
            const creditPrice = formatCreditPrice(plan.price, plan.credits);
            const saving = savingsComparedWithStarter(plan);
            const isSelected = selectedPlanId === plan.id;

            return (
              <article
                key={plan.id}
                onMouseEnter={() => setSelectedPlanId(plan.id)}
                onFocus={() => setSelectedPlanId(plan.id)}
                className={[
                  "group relative flex min-h-full flex-col overflow-hidden rounded-[32px] border p-6 transition duration-300",
                  plan.featured
                    ? "border-violet-300/35 bg-[linear-gradient(180deg,rgba(139,92,246,0.18),rgba(126,200,255,0.08),rgba(255,255,255,0.04))] shadow-[0_30px_100px_rgba(139,92,246,0.14)] xl:-translate-y-3"
                    : isSelected
                    ? "border-cyan-300/25 bg-white/[0.065]"
                    : "border-white/10 bg-white/[0.04] hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.06]",
                ].join(" ")}
              >
                {plan.badge ? (
                  <div className="absolute right-5 top-5 rounded-full border border-white/10 bg-white/[0.08] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-white/80">
                    {plan.badge}
                  </div>
                ) : null}

                <div className="flex-1">
                  <div className="text-xs font-bold uppercase tracking-[0.16em] text-white/35">{plan.eyebrow}</div>
                  <h3 className="mt-2 pr-24 text-3xl font-semibold">{plan.name}</h3>

                  <div className="mt-7 flex items-end gap-2">
                    <div className="text-5xl font-semibold leading-none">{plan.credits}</div>
                    <div className="pb-1 text-sm font-bold uppercase tracking-[0.14em] text-cyan-200/70">Credits</div>
                  </div>

                  <div className="mt-6 flex flex-wrap items-center gap-3">
                    <div className="text-3xl font-black">{formatPrice(plan.price)}</div>
                    {saving > 0 ? (
                      <span className="rounded-full border border-emerald-300/15 bg-emerald-300/[0.07] px-3 py-1 text-xs font-bold text-emerald-200">
                        bis CHF {saving} günstiger
                      </span>
                    ) : null}
                  </div>

                  <div className="mt-2 text-sm text-white/40">CHF {creditPrice} pro Credit</div>
                  <p className="mt-5 text-sm leading-7 text-white/58">{plan.description}</p>

                  <div className="mt-6 space-y-3">
                    {plan.features.map((feature) => (
                      <div key={feature} className="flex items-start gap-3">
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cyan-300/10 text-cyan-100">
                          <Check className="h-3 w-3" />
                        </span>
                        <span className="text-sm leading-6 text-white/68">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => buy(plan.id)}
                  disabled={loading !== null}
                  className={[
                    "mt-8 inline-flex min-h-[56px] w-full items-center justify-center gap-2 rounded-2xl px-5 text-base font-black transition disabled:cursor-not-allowed disabled:opacity-60",
                    plan.featured
                      ? "bg-gradient-to-r from-cyan-300 to-violet-300 text-[#07111f] shadow-[0_18px_60px_rgba(139,92,246,0.18)] hover:brightness-105"
                      : "border border-white/10 bg-white/[0.06] text-white hover:bg-white/10",
                  ].join(" ")}
                >
                  {loading === plan.id ? "Weiterleitung..." : `${plan.name} kaufen`}
                  {loading !== plan.id ? <ArrowRight className="h-5 w-5" /> : null}
                </button>
              </article>
            );
          })}
        </div>
      </section>

      <section className="relative mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="rounded-[34px] border border-white/10 bg-white/[0.04] p-6 sm:p-8 lg:p-10">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/15 bg-emerald-300/[0.07] px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-emerald-200">
                <BadgeCheck className="h-4 w-4" />
                Sicher entscheiden
              </div>
              <h2 className="mt-5 text-3xl font-semibold sm:text-4xl">Einfach, flexibel und transparent.</h2>
              <p className="mt-4 text-sm leading-7 text-white/55 sm:text-base">
                Du kaufst einmalig Credits und entscheidest danach selbst, welche Anfrage zu deinem Unternehmen passt.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                "Keine monatliche Verpflichtung",
                "Kontaktdaten sofort nach Freischaltung",
                "Nur passende Leads auswählen",
                "Credits bleiben dauerhaft im Konto",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-black/10 p-4">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-emerald-300" />
                  <span className="text-sm leading-6 text-white/65">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-2">
          {faqs.map((faq) => (
            <article key={faq.question} className="rounded-[26px] border border-white/10 bg-[#081122]/80 p-6">
              <h3 className="text-lg font-semibold">{faq.question}</h3>
              <p className="mt-3 text-sm leading-7 text-white/55">{faq.answer}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="relative mx-auto max-w-7xl px-4 pb-28 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[36px] border border-cyan-300/20 bg-[linear-gradient(135deg,rgba(126,200,255,0.16),rgba(139,92,246,0.13),rgba(255,255,255,0.04))] p-7 text-center shadow-[0_30px_100px_rgba(126,200,255,0.10)] sm:p-12">
          <CreditCard className="mx-auto h-10 w-10 text-cyan-200" />
          <h2 className="mt-5 text-3xl font-semibold sm:text-5xl">Bereit für neue Aufträge?</h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-white/60">
            Starte mit dem Pro-Paket oder wähle das Paket, das zu deinem aktuellen Leadbedarf passt.
          </p>
          <button
            type="button"
            onClick={() => buy("pro")}
            disabled={loading !== null}
            className="mt-8 inline-flex min-h-[56px] items-center justify-center gap-2 rounded-2xl bg-white px-7 text-base font-black text-[#07111f] transition hover:bg-cyan-100 disabled:opacity-60"
          >
            {loading === "pro" ? "Weiterleitung..." : "Pro-Paket kaufen"}
            {loading !== "pro" ? <ArrowRight className="h-5 w-5" /> : null}
          </button>
        </div>
      </section>

      <div className="fixed inset-x-3 bottom-3 z-50 rounded-[24px] border border-white/10 bg-[#091225]/95 p-3 shadow-[0_20px_70px_rgba(0,0,0,0.45)] backdrop-blur-xl md:hidden">
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-semibold">{selectedPlan.name} · {selectedPlan.credits} Credits</div>
            <div className="text-xs text-white/45">{formatPrice(selectedPlan.price)} einmalig</div>
          </div>
          <button
            type="button"
            onClick={() => buy(selectedPlan.id)}
            disabled={loading !== null}
            className="inline-flex min-h-[46px] items-center justify-center rounded-xl bg-gradient-to-r from-cyan-300 to-violet-300 px-4 text-sm font-black text-[#07111f] disabled:opacity-60"
          >
            {loading === selectedPlan.id ? "Lädt..." : "Kaufen"}
          </button>
        </div>
      </div>
    </main>
  );
}