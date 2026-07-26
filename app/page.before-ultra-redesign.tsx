import type { Metadata } from "next";
import Link from "next/link";

import LiveLeadsSection from "@/components/live-leads-section";
import { citiesSeo } from "@/lib/city-data";
import { regions as regionData } from "@/lib/region-data";
import { formatText, services as seoServices } from "@/lib/seo-data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title:
    "Auftrago – Schweizer Plattform für regionale Dienstleistungen",
  description:
    "Beschreibe deinen Auftrag kostenlos und erhalte Rückmeldungen von passenden regionalen Dienstleistern in der Schweiz.",
  alternates: {
    canonical: "https://www.auftrago.ch",
  },
  openGraph: {
    title: "Auftrago – Dein Auftrag. Die passenden Profis.",
    description:
      "Reinigung, Umzug, Handwerk, Garten, Hauswartung und viele weitere Dienstleistungen schweizweit anfragen.",
    url: "https://www.auftrago.ch",
    siteName: "Auftrago",
    type: "website",
  },
};

const trustItems = [
  {
    icon: "⚡",
    value: "In 60 Sek.",
    label: "Anfrage erfassen",
  },
  {
    icon: "🇨🇭",
    value: "Schweizweit",
    label: "Regionale Anbieter",
  },
  {
    icon: "✓",
    value: "Kostenlos",
    label: "Für Auftraggeber",
  },
  {
    icon: "🤝",
    value: "Unverbindlich",
    label: "Offerten vergleichen",
  },
];

const categories = [
  {
    number: "01",
    icon: "🧹",
    title: "Reinigung",
    text: "Wohnungen, Büros, Fenster, Umzugsreinigung und Spezialreinigung.",
    href: "/leistungen/reinigung",
    glow:
      "from-sky-400/25 via-blue-500/10 to-transparent",
    iconStyle:
      "border-sky-300/20 bg-sky-400/10 shadow-[0_0_45px_rgba(56,189,248,0.14)]",
  },
  {
    number: "02",
    icon: "🚚",
    title: "Umzug & Transport",
    text: "Privatumzug, Firmenumzug, Möbeltransport, Räumung und Entsorgung.",
    href: "/leistungen/umzug",
    glow:
      "from-violet-400/25 via-indigo-500/10 to-transparent",
    iconStyle:
      "border-violet-300/20 bg-violet-400/10 shadow-[0_0_45px_rgba(167,139,250,0.14)]",
  },
  {
    number: "03",
    icon: "🛠️",
    title: "Handwerk",
    text: "Elektriker, Sanitär, Maler, Bodenleger, Schreiner und Montage.",
    href: "/dienstleistungen",
    glow:
      "from-orange-400/25 via-amber-500/10 to-transparent",
    iconStyle:
      "border-orange-300/20 bg-orange-400/10 shadow-[0_0_45px_rgba(251,146,60,0.14)]",
  },
  {
    number: "04",
    icon: "🌿",
    title: "Garten & Umgebung",
    text: "Gartenpflege, Heckenschnitt, Rasen, Winterdienst und Umgebungspflege.",
    href: "/leistungen/gartenpflege",
    glow:
      "from-emerald-400/25 via-teal-500/10 to-transparent",
    iconStyle:
      "border-emerald-300/20 bg-emerald-400/10 shadow-[0_0_45px_rgba(52,211,153,0.14)]",
  },
  {
    number: "05",
    icon: "🏢",
    title: "Hauswartung",
    text: "Liegenschaftsbetreuung, Kontrollgänge, Unterhalt und Reinigung.",
    href: "/leistungen/hauswartung",
    glow:
      "from-cyan-400/25 via-sky-500/10 to-transparent",
    iconStyle:
      "border-cyan-300/20 bg-cyan-400/10 shadow-[0_0_45px_rgba(34,211,238,0.14)]",
  },
  {
    number: "06",
    icon: "✨",
    title: "Weitere Services",
    text: "Versicherungen, IT, Renovationen und zahlreiche weitere Leistungen.",
    href: "/dienstleistungen",
    glow:
      "from-fuchsia-400/25 via-purple-500/10 to-transparent",
    iconStyle:
      "border-fuchsia-300/20 bg-fuchsia-400/10 shadow-[0_0_45px_rgba(232,121,249,0.14)]",
  },
];

const steps = [
  {
    number: "01",
    icon: "✍️",
    title: "Auftrag beschreiben",
    text: "Beantworte wenige Fragen zu deinem Projekt, dem gewünschten Termin und deinem Standort.",
  },
  {
    number: "02",
    icon: "📡",
    title: "Anbieter erreichen",
    text: "Deine Anfrage wird passenden regionalen Dienstleistern zugänglich gemacht.",
  },
  {
    number: "03",
    icon: "💬",
    title: "Rückmeldungen erhalten",
    text: "Interessierte Anbieter können dir eine persönliche Offerte oder Rückmeldung senden.",
  },
  {
    number: "04",
    icon: "🏆",
    title: "Besten Anbieter wählen",
    text: "Du vergleichst Preis, Leistung, Auftreten und Verfügbarkeit und entscheidest selbst.",
  },
];

const benefits = [
  "Eine Anfrage statt unzählige Telefonate",
  "Regionale Anbieter aus deiner Umgebung",
  "Kostenlos und ohne Annahmepflicht",
  "Direkte Rückmeldungen von Fachbetrieben",
  "Für kleine Aufgaben und grosse Projekte",
  "Schweizweit für Privat- und Geschäftskunden",
];

const services = [
  ["🧹", "Reinigung", "/leistungen/reinigung"],
  ["🏠", "Umzugsreinigung", "/leistungen/umzugsreinigung"],
  ["🏢", "Hauswartung", "/leistungen/hauswartung"],
  ["🌿", "Gartenpflege", "/leistungen/gartenpflege"],
  ["🚚", "Umzug", "/leistungen/umzug"],
  ["📦", "Transport", "/leistungen/transport"],
  ["♻️", "Entsorgung", "/leistungen/entsorgung"],
  ["🪟", "Fensterreinigung", "/leistungen/fensterreinigung"],
  ["🎨", "Maler", "/leistungen/maler"],
  ["⚡", "Elektriker", "/leistungen/elektriker"],
  ["🚿", "Sanitär", "/leistungen/sanitaer"],
  ["🪵", "Schreiner", "/dienstleistungen"],
  ["🧱", "Gipser", "/dienstleistungen"],
  ["🪚", "Bodenleger", "/dienstleistungen"],
  ["🏗️", "Renovation", "/dienstleistungen"],
  ["❄️", "Winterdienst", "/leistungen/winterdienst"],
];

const faqs = [
  {
    question: "Ist eine Anfrage auf Auftrago kostenlos?",
    answer:
      "Ja. Auftraggeber können ihre Anfrage kostenlos und unverbindlich erfassen. Du entscheidest selbst, ob eine Rückmeldung oder Offerte zu deinem Auftrag passt.",
  },
  {
    question: "Welche Dienstleistungen kann ich anfragen?",
    answer:
      "Auftrago deckt Reinigung, Hauswartung, Umzug, Transport, Entsorgung, Gartenpflege, Malerarbeiten, Elektriker, Sanitär, Renovationen und viele weitere Dienstleistungen ab.",
  },
  {
    question: "Wie schnell melden sich Anbieter?",
    answer:
      "Die Reaktionszeit hängt von der Region, der Dienstleistung, dem Termin und der Verfügbarkeit der Anbieter ab. Vollständige Angaben und gute Fotos können die Rückmeldungen beschleunigen.",
  },
  {
    question: "Muss ich eine Offerte annehmen?",
    answer:
      "Nein. Deine Anfrage ist unverbindlich. Du kannst Rückmeldungen vergleichen und frei entscheiden, ob und welchen Anbieter du beauftragen möchtest.",
  },
  {
    question: "Ist Auftrago in der ganzen Schweiz verfügbar?",
    answer:
      "Ja. Über Auftrago können Anfragen aus verschiedenen Kantonen und Regionen der Schweiz erfasst werden. Die Verfügbarkeit hängt von den registrierten Anbietern in deiner Umgebung ab.",
  },
  {
    question: "Wie funktioniert Auftrago für Dienstleister?",
    answer:
      "Registrierte Anbieter sehen passende Kundenanfragen und können relevante Aufträge freischalten. Dadurch konzentrieren sie sich gezielt auf Regionen und Leistungen, die zu ihrem Betrieb passen.",
  },
];

export default async function HomePage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Auftrago",
    url: "https://www.auftrago.ch",
    potentialAction: {
      "@type": "SearchAction",
      target:
        "https://www.auftrago.ch/offerte-anfragen?query={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Auftrago",
    url: "https://www.auftrago.ch",
    description:
      "Schweizer Plattform zur Vermittlung regionaler Dienstleistungen.",
  };

  return (
    <main className="overflow-hidden bg-[#020611] text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />

      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes auftragoFloat {
              0%, 100% { transform: translate3d(0, 0, 0); }
              50% { transform: translate3d(0, -18px, 0); }
            }

            @keyframes auftragoPulse {
              0%, 100% { opacity: .35; transform: scale(1); }
              50% { opacity: .7; transform: scale(1.08); }
            }

            @keyframes auftragoMove {
              from { transform: translateX(-40%); }
              to { transform: translateX(40%); }
            }

            @keyframes auftragoSpin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }

            @keyframes auftragoMarquee {
              from { transform: translateX(0); }
              to { transform: translateX(-50%); }
            }

            .auftrago-float {
              animation: auftragoFloat 7s ease-in-out infinite;
            }

            .auftrago-float-delayed {
              animation: auftragoFloat 9s ease-in-out infinite 1.5s;
            }

            .auftrago-pulse {
              animation: auftragoPulse 6s ease-in-out infinite;
            }

            .auftrago-beam {
              animation: auftragoMove 7s ease-in-out infinite alternate;
            }

            .auftrago-spin {
              animation: auftragoSpin 22s linear infinite;
            }

            .auftrago-marquee {
              animation: auftragoMarquee 28s linear infinite;
            }

            .auftrago-grid {
              background-image:
                linear-gradient(rgba(255,255,255,.035) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,.035) 1px, transparent 1px);
              background-size: 72px 72px;
              mask-image: linear-gradient(to bottom, black, transparent 90%);
            }

            .auftrago-noise {
              background-image:
                radial-gradient(circle at 20% 20%, rgba(255,255,255,.04) 0 1px, transparent 1.4px),
                radial-gradient(circle at 80% 60%, rgba(255,255,255,.025) 0 1px, transparent 1.4px);
              background-size: 18px 18px, 23px 23px;
            }

            .auftrago-text-gradient {
              background:
                linear-gradient(
                  110deg,
                  #ffffff 0%,
                  #ffffff 28%,
                  #7dd3fc 53%,
                  #818cf8 74%,
                  #ffffff 100%
                );
              -webkit-background-clip: text;
              background-clip: text;
              color: transparent;
            }

            .auftrago-glass {
              background:
                linear-gradient(
                  145deg,
                  rgba(255,255,255,.09),
                  rgba(255,255,255,.025)
                );
              box-shadow:
                inset 0 1px 0 rgba(255,255,255,.08),
                0 30px 100px rgba(0,0,0,.28);
              backdrop-filter: blur(22px);
            }

            .auftrago-card-shine::before {
              content: "";
              position: absolute;
              inset: 0;
              background:
                linear-gradient(
                  120deg,
                  transparent 25%,
                  rgba(255,255,255,.08) 45%,
                  transparent 65%
                );
              transform: translateX(-130%);
              transition: transform .8s ease;
            }

            .auftrago-card-shine:hover::before {
              transform: translateX(130%);
            }

            .auftrago-faq summary::-webkit-details-marker {
              display: none;
            }

            @media (prefers-reduced-motion: reduce) {
              .auftrago-float,
              .auftrago-float-delayed,
              .auftrago-pulse,
              .auftrago-beam,
              .auftrago-spin,
              .auftrago-marquee {
                animation: none !important;
              }
            }
          `,
        }}
      />

      {/* HERO */}
      <section className="relative min-h-[880px] overflow-hidden border-b border-white/10 lg:min-h-[930px]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(14,165,233,0.22),transparent_32%),radial-gradient(circle_at_80%_20%,rgba(99,102,241,0.25),transparent_32%),radial-gradient(circle_at_50%_80%,rgba(6,182,212,0.12),transparent_38%),linear-gradient(180deg,#050a19_0%,#020611_100%)]" />

        <div className="auftrago-grid absolute inset-0 opacity-70" />
        <div className="auftrago-noise absolute inset-0 opacity-25" />

        <div className="auftrago-pulse absolute -left-40 top-32 h-[520px] w-[520px] rounded-full bg-sky-500/15 blur-[100px]" />
        <div className="auftrago-pulse absolute -right-52 top-20 h-[600px] w-[600px] rounded-full bg-indigo-500/20 blur-[120px]" />

        <div className="auftrago-spin absolute left-1/2 top-[48%] hidden h-[760px] w-[760px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-white/[0.06] xl:block" />
        <div className="absolute left-1/2 top-[48%] hidden h-[570px] w-[570px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.05] xl:block" />

        <div className="relative mx-auto grid min-h-[880px] max-w-[1500px] items-center gap-16 px-5 pb-24 pt-20 sm:px-8 lg:grid-cols-[1.08fr_.92fr] lg:px-12 lg:pb-28 lg:pt-24">
          <div className="relative z-10 max-w-[820px]">
            <div className="inline-flex items-center gap-3 rounded-full border border-sky-300/20 bg-sky-400/[0.07] px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-sky-200 shadow-[0_0_45px_rgba(56,189,248,0.08)]">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
              </span>
              Schweizer Dienstleistungsplattform
            </div>

            <h1 className="mt-8 max-w-[820px] text-[3.35rem] font-black leading-[0.93] tracking-[-0.065em] sm:text-[4.9rem] lg:text-[5.8rem] xl:text-[6.6rem]">
              Dein Auftrag.
              <span className="auftrago-text-gradient mt-2 block">
                Die richtigen Profis.
              </span>
            </h1>

            <p className="mt-8 max-w-[690px] text-lg font-medium leading-8 text-slate-300 sm:text-xl sm:leading-9">
              Beschreibe dein Projekt einmal und erreiche passende
              Dienstleister aus deiner Region. Kostenlos, unverbindlich und
              ohne stundenlange Suche.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/offerte-anfragen"
                className="group relative inline-flex min-h-[62px] items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-500 px-8 text-base font-black text-white shadow-[0_22px_70px_rgba(37,99,235,0.35)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_30px_90px_rgba(37,99,235,0.5)]"
              >
                <span className="auftrago-beam absolute inset-y-0 w-32 rotate-12 bg-white/20 blur-2xl" />
                <span className="relative flex items-center gap-3">
                  Kostenlose Anfrage starten
                  <span className="text-xl transition group-hover:translate-x-1">
                    →
                  </span>
                </span>
              </Link>

              <Link
                href="/dienstleistungen"
                className="inline-flex min-h-[62px] items-center justify-center rounded-2xl border border-white/15 bg-white/[0.045] px-8 text-base font-black text-white backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-sky-300/30 hover:bg-white/[0.08]"
              >
                Dienstleistungen entdecken
              </Link>
            </div>

            <div className="mt-9 flex flex-wrap gap-x-7 gap-y-3 text-sm font-bold text-slate-400">
              <span className="flex items-center gap-2">
                <span className="text-emerald-400">✓</span>
                Kostenlos
              </span>
              <span className="flex items-center gap-2">
                <span className="text-emerald-400">✓</span>
                Keine Annahmepflicht
              </span>
              <span className="flex items-center gap-2">
                <span className="text-emerald-400">✓</span>
                Regionale Anbieter
              </span>
            </div>
          </div>

          <div className="relative mx-auto hidden min-h-[650px] w-full max-w-[650px] lg:block">
            <div className="auftrago-float absolute left-[6%] top-[5%] z-20 w-[260px] rounded-[28px] border border-white/10 p-5 auftrago-glass">
              <div className="flex items-center justify-between">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-sky-300/20 bg-sky-400/10 text-2xl">
                  🧹
                </span>
                <span className="rounded-full border border-emerald-300/20 bg-emerald-400/10 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-emerald-300">
                  Neu
                </span>
              </div>
              <p className="mt-5 text-xs font-black uppercase tracking-[0.18em] text-slate-500">
                Aktuelle Anfrage
              </p>
              <h3 className="mt-2 text-xl font-black tracking-[-0.03em]">
                Umzugsreinigung
              </h3>
              <div className="mt-4 flex gap-2 text-xs font-bold text-slate-300">
                <span className="rounded-full bg-white/[0.07] px-3 py-1.5">
                  📍 Zürich
                </span>
                <span className="rounded-full bg-white/[0.07] px-3 py-1.5">
                  3.5 Zimmer
                </span>
              </div>
            </div>

            <div className="auftrago-float-delayed absolute right-[2%] top-[20%] z-30 w-[245px] rounded-[28px] border border-white/10 p-5 auftrago-glass">
              <div className="flex items-center gap-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-violet-300/20 bg-violet-400/10 text-2xl">
                  🚚
                </span>
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-violet-300">
                    Passender Anbieter
                  </p>
                  <p className="mt-1 font-black">Region Aargau</p>
                </div>
              </div>
              <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/[0.06]">
                <div className="h-full w-[86%] rounded-full bg-gradient-to-r from-violet-400 to-indigo-400" />
              </div>
              <p className="mt-2 text-right text-xs font-bold text-slate-400">
                86 % Übereinstimmung
              </p>
            </div>

            <div className="absolute left-1/2 top-1/2 z-10 w-[440px] -translate-x-1/2 -translate-y-1/2 rounded-[42px] border border-white/10 p-7 auftrago-glass">
              <div className="absolute inset-0 rounded-[42px] bg-[radial-gradient(circle_at_30%_10%,rgba(56,189,248,0.15),transparent_40%),radial-gradient(circle_at_80%_80%,rgba(99,102,241,0.15),transparent_42%)]" />

              <div className="relative">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-sky-300">
                      Auftrago Match
                    </p>
                    <h2 className="mt-2 text-3xl font-black tracking-[-0.05em]">
                      Auftrag erfassen
                    </h2>
                  </div>
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 to-indigo-500 text-2xl shadow-[0_16px_40px_rgba(59,130,246,0.3)]">
                    ⚡
                  </div>
                </div>

                <div className="mt-8 space-y-3">
                  {[
                    ["Dienstleistung", "Umzug & Reinigung"],
                    ["Region", "Zürich"],
                    ["Wunschtermin", "Flexibel"],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="flex items-center justify-between rounded-2xl border border-white/[0.08] bg-black/20 px-4 py-4"
                    >
                      <span className="text-sm font-bold text-slate-500">
                        {label}
                      </span>
                      <span className="text-sm font-black text-white">
                        {value}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-5 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-500 p-[1px]">
                  <div className="rounded-[15px] bg-[#071020] px-5 py-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-slate-300">
                        Anfrage bereit
                      </span>
                      <span className="text-sm font-black text-emerald-300">
                        100 %
                      </span>
                    </div>
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                      <div className="h-full w-full rounded-full bg-gradient-to-r from-sky-400 via-blue-400 to-indigo-400" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="auftrago-float absolute bottom-[9%] left-[2%] z-30 w-[250px] rounded-[28px] border border-white/10 p-5 auftrago-glass">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-300">
                ✓ Anfrage gesendet
              </p>
              <p className="mt-3 text-lg font-black">
                Anbieter können reagieren
              </p>
              <div className="mt-4 flex -space-x-3">
                {["🧑‍🔧", "👷", "🧑‍💼", "👨‍🔧"].map(
                  (avatar, index) => (
                    <span
                      key={`${avatar}-${index}`}
                      className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#0b1223] bg-slate-800 text-lg"
                    >
                      {avatar}
                    </span>
                  )
                )}
                <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#0b1223] bg-sky-500 text-xs font-black">
                  +12
                </span>
              </div>
            </div>

            <div className="auftrago-float-delayed absolute bottom-[5%] right-[5%] z-30 w-[210px] rounded-[28px] border border-white/10 p-5 auftrago-glass">
              <span className="text-3xl">⭐</span>
              <p className="mt-3 text-2xl font-black tracking-[-0.04em]">
                Einfach vergleichen
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Preis, Leistung und Verfügbarkeit.
              </p>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-sky-400/60 to-transparent" />
      </section>

      {/* TRUST STRIP */}
      <section className="relative border-b border-white/10 bg-[#030816]">
        <div className="mx-auto grid max-w-[1500px] grid-cols-2 gap-px bg-white/10 lg:grid-cols-4">
          {trustItems.map((item) => (
            <div
              key={item.label}
              className="group bg-[#030816] px-4 py-8 text-center transition hover:bg-white/[0.035] sm:px-8 sm:py-10"
            >
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.045] text-xl transition duration-300 group-hover:-translate-y-1 group-hover:border-sky-300/25 group-hover:bg-sky-400/10">
                {item.icon}
              </span>
              <strong className="mt-4 block text-lg font-black tracking-[-0.03em] sm:text-2xl">
                {item.value}
              </strong>
              <span className="mt-1 block text-xs font-bold text-slate-500 sm:text-sm">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* CATEGORY SHOWCASE */}
      <section className="relative px-5 py-28 sm:px-8 lg:px-12 lg:py-40">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(59,130,246,0.10),transparent_34%),radial-gradient(circle_at_10%_70%,rgba(14,165,233,0.08),transparent_30%)]" />

        <div className="relative mx-auto max-w-[1450px]">
          <div className="grid items-end gap-8 lg:grid-cols-[1fr_460px]">
            <div>
              <span className="inline-flex rounded-full border border-sky-300/20 bg-sky-400/[0.06] px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-sky-200">
                Dienstleistungen
              </span>
              <h2 className="mt-6 max-w-[900px] text-5xl font-black leading-[0.98] tracking-[-0.06em] sm:text-6xl lg:text-7xl">
                Was auch ansteht.
                <span className="auftrago-text-gradient block">
                  Wir bringen es ins Rollen.
                </span>
              </h2>
            </div>

            <p className="text-lg font-medium leading-8 text-slate-400">
              Von der kleinen Reparatur bis zum kompletten Umzug: Erfasse
              deinen Auftrag und erreiche passende Fachbetriebe aus deiner
              Region.
            </p>
          </div>

          <div className="mt-16 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {categories.map((category) => (
              <Link
                key={category.title}
                href={category.href}
                className="auftrago-card-shine group relative min-h-[330px] overflow-hidden rounded-[34px] border border-white/10 bg-white/[0.025] p-7 transition duration-500 hover:-translate-y-2 hover:border-white/20 hover:bg-white/[0.045] hover:shadow-[0_35px_100px_rgba(0,0,0,0.4)] sm:p-8"
              >
                <div
                  className={[
                    "absolute inset-0 bg-gradient-to-br opacity-70 transition duration-500 group-hover:opacity-100",
                    category.glow,
                  ].join(" ")}
                />

                <div className="relative flex h-full flex-col">
                  <div className="flex items-start justify-between">
                    <span
                      className={[
                        "flex h-16 w-16 items-center justify-center rounded-[22px] border text-3xl transition duration-500 group-hover:rotate-3 group-hover:scale-110",
                        category.iconStyle,
                      ].join(" ")}
                    >
                      {category.icon}
                    </span>

                    <span className="text-xs font-black tracking-[0.2em] text-white/25">
                      {category.number}
                    </span>
                  </div>

                  <div className="mt-auto pt-16">
                    <h3 className="text-2xl font-black tracking-[-0.04em] sm:text-3xl">
                      {category.title}
                    </h3>
                    <p className="mt-3 max-w-md text-sm font-medium leading-7 text-slate-400">
                      {category.text}
                    </p>

                    <div className="mt-7 flex items-center justify-between">
                      <span className="text-sm font-black text-white">
                        Kategorie entdecken
                      </span>
                      <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-lg text-sky-300 transition duration-300 group-hover:translate-x-1 group-hover:border-sky-300/30 group-hover:bg-sky-400/10">
                        →
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="relative border-y border-white/10 bg-[#040a18] px-5 py-28 sm:px-8 lg:px-12 lg:py-40">
        <div className="auftrago-grid absolute inset-0 opacity-25" />

        <div className="relative mx-auto max-w-[1450px]">
          <div className="mx-auto max-w-[900px] text-center">
            <span className="inline-flex rounded-full border border-violet-300/20 bg-violet-400/[0.07] px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-violet-200">
              So funktioniert Auftrago
            </span>
            <h2 className="mt-6 text-5xl font-black leading-[0.98] tracking-[-0.06em] sm:text-6xl lg:text-7xl">
              Vom Auftrag zur Offerte.
              <span className="auftrago-text-gradient block">
                Ohne Umwege.
              </span>
            </h2>
            <p className="mx-auto mt-7 max-w-[720px] text-lg font-medium leading-8 text-slate-400">
              Vier klare Schritte. Keine komplizierten Prozesse. Du behältst
              jederzeit die Kontrolle.
            </p>
          </div>

          <div className="relative mt-20 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            <div className="absolute left-[12%] right-[12%] top-[65px] hidden h-px bg-gradient-to-r from-transparent via-sky-400/40 to-transparent xl:block" />

            {steps.map((step, index) => (
              <div
                key={step.number}
                className="group relative rounded-[32px] border border-white/10 bg-[#081021]/80 p-7 transition duration-500 hover:-translate-y-2 hover:border-sky-300/20 hover:bg-[#0a1428] sm:p-8"
              >
                <div className="relative z-10 flex items-center justify-between">
                  <span className="flex h-16 w-16 items-center justify-center rounded-[22px] border border-white/10 bg-white/[0.045] text-3xl transition duration-500 group-hover:scale-110 group-hover:border-sky-300/25 group-hover:bg-sky-400/10">
                    {step.icon}
                  </span>
                  <span className="text-5xl font-black tracking-[-0.07em] text-white/[0.06] transition group-hover:text-sky-300/10">
                    {step.number}
                  </span>
                </div>

                <h3 className="mt-10 text-2xl font-black tracking-[-0.04em]">
                  {step.title}
                </h3>
                <p className="mt-4 text-sm font-medium leading-7 text-slate-400">
                  {step.text}
                </p>

                {index < steps.length - 1 && (
                  <span className="absolute -right-3 top-[52px] z-20 hidden h-7 w-7 items-center justify-center rounded-full border border-sky-300/20 bg-[#091329] text-xs text-sky-300 xl:flex">
                    →
                  </span>
                )}
              </div>
            ))}
          </div>

          <div className="mt-12 flex justify-center">
            <Link
              href="/offerte-anfragen"
              className="group inline-flex min-h-[60px] items-center justify-center rounded-2xl bg-white px-8 text-base font-black text-[#050917] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(255,255,255,0.16)]"
            >
              Auftrag jetzt beschreiben
              <span className="ml-3 text-xl transition group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* LIVE LEADS */}
      <section className="relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(37,99,235,0.12),transparent_38%)]" />
        <div className="relative">
          <LiveLeadsSection />
        </div>
      </section>

      {/* PLATFORM BENEFITS */}
      <section className="relative px-5 py-28 sm:px-8 lg:px-12 lg:py-40">
        <div className="mx-auto grid max-w-[1450px] gap-16 lg:grid-cols-[.95fr_1.05fr] lg:items-center">
          <div className="relative min-h-[570px]">
            <div className="absolute inset-0 rounded-[46px] bg-gradient-to-br from-sky-500/20 via-indigo-500/10 to-transparent blur-3xl" />

            <div className="relative h-full min-h-[570px] overflow-hidden rounded-[46px] border border-white/10 bg-[#071020] p-6 shadow-[0_40px_120px_rgba(0,0,0,0.45)] sm:p-9">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(56,189,248,0.18),transparent_35%),radial-gradient(circle_at_90%_90%,rgba(99,102,241,0.18),transparent_35%)]" />
              <div className="auftrago-grid absolute inset-0 opacity-30" />

              <div className="relative">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-sky-300">
                      Dein Auftrago Dashboard
                    </p>
                    <h3 className="mt-2 text-3xl font-black tracking-[-0.05em] sm:text-4xl">
                      Alles im Blick.
                    </h3>
                  </div>
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 to-indigo-500 text-2xl shadow-[0_18px_50px_rgba(59,130,246,0.35)]">
                    🔥
                  </span>
                </div>

                <div className="mt-8 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-white/[0.08] bg-black/20 p-5">
                    <p className="text-xs font-bold text-slate-500">
                      Status
                    </p>
                    <p className="mt-2 text-xl font-black text-emerald-300">
                      Anfrage aktiv
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/[0.08] bg-black/20 p-5">
                    <p className="text-xs font-bold text-slate-500">
                      Region
                    </p>
                    <p className="mt-2 text-xl font-black">
                      Zürich
                    </p>
                  </div>
                </div>

                <div className="mt-4 rounded-[28px] border border-white/[0.08] bg-white/[0.035] p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-400/10 text-2xl">
                        🧹
                      </span>
                      <div>
                        <p className="font-black">
                          Umzugsreinigung 3.5 Zimmer
                        </p>
                        <p className="mt-1 text-xs font-bold text-slate-500">
                          Anfrage vor wenigen Minuten erfasst
                        </p>
                      </div>
                    </div>
                    <span className="rounded-full bg-emerald-400/10 px-3 py-1.5 text-xs font-black text-emerald-300">
                      Live
                    </span>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  {[
                    ["Anbieter A", "Verfügbar", "92 %"],
                    ["Anbieter B", "Interesse", "87 %"],
                    ["Anbieter C", "Prüft Anfrage", "81 %"],
                  ].map(([name, status, match], index) => (
                    <div
                      key={name}
                      className="flex items-center gap-4 rounded-[22px] border border-white/[0.07] bg-black/20 p-4"
                    >
                      <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-slate-800 text-lg">
                        {["🧑‍🔧", "👷", "🧑‍💼"][index]}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-3">
                          <span className="font-black">{name}</span>
                          <span className="text-xs font-black text-sky-300">
                            {match}
                          </span>
                        </div>
                        <p className="mt-1 text-xs font-bold text-slate-500">
                          {status}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div>
            <span className="inline-flex rounded-full border border-emerald-300/20 bg-emerald-400/[0.06] px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-emerald-200">
              Warum Auftrago?
            </span>

            <h2 className="mt-6 text-5xl font-black leading-[0.98] tracking-[-0.06em] sm:text-6xl lg:text-7xl">
              Weniger suchen.
              <span className="auftrago-text-gradient block">
                Schneller entscheiden.
              </span>
            </h2>

            <p className="mt-7 max-w-[660px] text-lg font-medium leading-8 text-slate-400">
              Du musst nicht mehr dutzende Firmen einzeln suchen und
              kontaktieren. Eine strukturierte Anfrage bringt dein Projekt
              direkt auf den Weg.
            </p>

            <div className="mt-10 grid gap-3 sm:grid-cols-2">
              {benefits.map((benefit) => (
                <div
                  key={benefit}
                  className="flex items-start gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-400/10 text-sm font-black text-emerald-300">
                    ✓
                  </span>
                  <span className="text-sm font-bold leading-6 text-slate-300">
                    {benefit}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/offerte-anfragen"
                className="inline-flex min-h-[58px] items-center justify-center rounded-2xl bg-gradient-to-r from-sky-400 to-indigo-500 px-7 font-black shadow-[0_18px_55px_rgba(37,99,235,0.3)] transition hover:-translate-y-1"
              >
                Kostenlose Anfrage starten
              </Link>
              <Link
                href="/anbieter"
                className="inline-flex min-h-[58px] items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] px-7 font-black transition hover:-translate-y-1 hover:border-white/20"
              >
                Anbieter entdecken
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICE MARQUEE */}
      <section className="overflow-hidden border-y border-white/10 bg-[#050a16] py-7">
        <div className="auftrago-marquee flex w-max items-center">
          {[...services, ...services].map(
            ([icon, label], index) => (
              <div
                key={`${label}-${index}`}
                className="mx-3 flex items-center gap-3 rounded-full border border-white/[0.08] bg-white/[0.035] px-5 py-3"
              >
                <span>{icon}</span>
                <span className="whitespace-nowrap text-sm font-black text-slate-300">
                  {label}
                </span>
              </div>
            )
          )}
        </div>
      </section>

      {/* SERVICES */}
      <section className="relative px-5 py-28 sm:px-8 lg:px-12 lg:py-40">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(79,70,229,0.10),transparent_32%)]" />

        <div className="relative mx-auto max-w-[1450px]">
          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <div>
              <span className="inline-flex rounded-full border border-indigo-300/20 bg-indigo-400/[0.06] px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-indigo-200">
                Beliebte Leistungen
              </span>
              <h2 className="mt-6 max-w-[850px] text-5xl font-black leading-[0.98] tracking-[-0.06em] sm:text-6xl lg:text-7xl">
                Eine Plattform.
                <span className="auftrago-text-gradient block">
                  Fast jede Aufgabe.
                </span>
              </h2>
            </div>

            <Link
              href="/dienstleistungen"
              className="group inline-flex items-center gap-3 text-sm font-black text-sky-300"
            >
              Alle Dienstleistungen
              <span className="transition group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>

          <div className="mt-16 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {services.map(([icon, label, href], index) => (
              <Link
                key={`${label}-${href}`}
                href={href}
                className="group relative overflow-hidden rounded-[24px] border border-white/[0.08] bg-white/[0.025] p-5 transition duration-300 hover:-translate-y-1 hover:border-sky-300/20 hover:bg-white/[0.05]"
              >
                <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-sky-400/[0.05] blur-2xl transition group-hover:bg-sky-400/10" />
                <div className="relative flex items-center gap-4">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/[0.08] bg-black/20 text-xl transition group-hover:scale-110">
                    {icon}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-black tracking-[-0.02em]">
                      {label}
                    </h3>
                    <p className="mt-1 text-xs font-bold text-slate-500">
                      Anbieter finden
                    </p>
                  </div>
                  <span className="text-sky-300 transition group-hover:translate-x-1">
                    →
                  </span>
                </div>
                <span className="absolute right-4 top-3 text-[10px] font-black text-white/[0.04]">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SPLIT CTA */}
      <section className="px-5 pb-28 sm:px-8 lg:px-12 lg:pb-40">
        <div className="mx-auto grid max-w-[1450px] gap-5 lg:grid-cols-2">
          <div className="relative overflow-hidden rounded-[42px] border border-sky-300/15 bg-gradient-to-br from-sky-500/15 via-blue-500/5 to-transparent p-8 sm:p-12 lg:p-14">
            <div className="absolute -right-16 -top-16 h-72 w-72 rounded-full bg-sky-400/15 blur-[80px]" />
            <div className="relative">
              <span className="flex h-16 w-16 items-center justify-center rounded-[22px] border border-sky-300/20 bg-sky-400/10 text-3xl">
                🏠
              </span>
              <p className="mt-10 text-xs font-black uppercase tracking-[0.2em] text-sky-300">
                Für Auftraggeber
              </p>
              <h2 className="mt-4 text-4xl font-black leading-[1.02] tracking-[-0.055em] sm:text-5xl">
                Aufgabe einstellen.
                <span className="block text-sky-300">
                  Angebote erhalten.
                </span>
              </h2>
              <p className="mt-5 max-w-xl text-base font-medium leading-8 text-slate-400">
                Beschreibe deinen Auftrag kostenlos und erreiche passende
                regionale Anbieter.
              </p>
              <Link
                href="/offerte-anfragen"
                className="mt-9 inline-flex min-h-[58px] items-center justify-center rounded-2xl bg-white px-7 font-black text-[#06101e] transition hover:-translate-y-1"
              >
                Anfrage starten
                <span className="ml-3">→</span>
              </Link>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[42px] border border-violet-300/15 bg-gradient-to-br from-violet-500/15 via-indigo-500/5 to-transparent p-8 sm:p-12 lg:p-14">
            <div className="absolute -right-16 -top-16 h-72 w-72 rounded-full bg-violet-400/15 blur-[80px]" />
            <div className="relative">
              <span className="flex h-16 w-16 items-center justify-center rounded-[22px] border border-violet-300/20 bg-violet-400/10 text-3xl">
                🚀
              </span>
              <p className="mt-10 text-xs font-black uppercase tracking-[0.2em] text-violet-300">
                Für Dienstleister
              </p>
              <h2 className="mt-4 text-4xl font-black leading-[1.02] tracking-[-0.055em] sm:text-5xl">
                Neue Kunden.
                <span className="block text-violet-300">
                  Weniger Streuverlust.
                </span>
              </h2>
              <p className="mt-5 max-w-xl text-base font-medium leading-8 text-slate-400">
                Entdecke konkrete Kundenanfragen aus deinen Regionen und
                Fachgebieten.
              </p>
              <Link
                href="/anbieter-registrieren"
                className="mt-9 inline-flex min-h-[58px] items-center justify-center rounded-2xl bg-gradient-to-r from-violet-400 to-indigo-500 px-7 font-black transition hover:-translate-y-1"
              >
                Anbieter werden
                <span className="ml-3">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* REGIONS & SEO */}
      <section className="relative border-y border-white/10 bg-[#040914] px-5 py-28 sm:px-8 lg:px-12 lg:py-36">
        <div className="mx-auto grid max-w-[1450px] gap-8 lg:grid-cols-2">
          <div className="rounded-[36px] border border-white/[0.08] bg-white/[0.025] p-7 sm:p-9">
            <span className="text-xs font-black uppercase tracking-[0.2em] text-sky-300">
              Regionen
            </span>
            <h2 className="mt-4 text-3xl font-black tracking-[-0.045em] sm:text-4xl">
              Anbieter in deiner Region
            </h2>
            <p className="mt-4 leading-7 text-slate-400">
              Entdecke Dienstleister und Anfragen in verschiedenen Regionen
              der Schweiz.
            </p>

            <div className="mt-8 grid gap-2 sm:grid-cols-2">
              {regionData.slice(0, 12).map((region) => (
                <Link
                  key={region.slug}
                  href={`/region/${region.slug}`}
                  className="group flex items-center justify-between rounded-2xl border border-white/[0.07] bg-black/20 px-4 py-3.5 text-sm font-bold text-slate-300 transition hover:border-sky-300/20 hover:bg-sky-400/[0.06] hover:text-white"
                >
                  <span>Anbieter in {region.name}</span>
                  <span className="text-sky-300 transition group-hover:translate-x-1">
                    →
                  </span>
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-[36px] border border-white/[0.08] bg-white/[0.025] p-7 sm:p-9">
            <span className="text-xs font-black uppercase tracking-[0.2em] text-violet-300">
              Städte
            </span>
            <h2 className="mt-4 text-3xl font-black tracking-[-0.045em] sm:text-4xl">
              Lokal. Direkt. In deiner Nähe.
            </h2>
            <p className="mt-4 leading-7 text-slate-400">
              Finde passende regionale Anbieter direkt in deiner Stadt und
              Umgebung.
            </p>

            <div className="mt-8 grid gap-2 sm:grid-cols-2">
              {citiesSeo.slice(0, 12).map((city) => (
                <Link
                  key={city.slug}
                  href={`/stadt/${city.slug}`}
                  className="group flex items-center justify-between rounded-2xl border border-white/[0.07] bg-black/20 px-4 py-3.5 text-sm font-bold text-slate-300 transition hover:border-violet-300/20 hover:bg-violet-400/[0.06] hover:text-white"
                >
                  <span>Anbieter in {city.name}</span>
                  <span className="text-violet-300 transition group-hover:translate-x-1">
                    →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mx-auto mt-8 max-w-[1450px] rounded-[36px] border border-white/[0.08] bg-white/[0.025] p-7 sm:p-9">
          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
            <div>
              <span className="text-xs font-black uppercase tracking-[0.2em] text-emerald-300">
                Häufig gesucht
              </span>
              <h2 className="mt-4 text-3xl font-black tracking-[-0.045em] sm:text-4xl">
                Beliebte Dienstleistungen
              </h2>
            </div>

            <Link
              href="/dienstleistungen"
              className="text-sm font-black text-sky-300"
            >
              Alle anzeigen →
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap gap-2">
            {seoServices.slice(0, 24).map((service) => (
              <Link
                key={service}
                href={`/leistungen/${service}`}
                className="rounded-full border border-white/[0.08] bg-black/20 px-4 py-2.5 text-sm font-bold text-slate-400 transition hover:border-emerald-300/20 hover:bg-emerald-400/[0.06] hover:text-white"
              >
                {formatText(service)}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="relative px-5 py-28 sm:px-8 lg:px-12 lg:py-40">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(14,165,233,0.08),transparent_30%),radial-gradient(circle_at_85%_80%,rgba(99,102,241,0.08),transparent_30%)]" />

        <div className="relative mx-auto grid max-w-[1450px] gap-14 lg:grid-cols-[.72fr_1.28fr]">
          <div>
            <span className="inline-flex rounded-full border border-sky-300/20 bg-sky-400/[0.06] px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-sky-200">
              Fragen & Antworten
            </span>
            <h2 className="mt-6 text-5xl font-black leading-[0.98] tracking-[-0.06em] sm:text-6xl">
              Alles klar?
              <span className="auftrago-text-gradient block">
                Fast alles.
              </span>
            </h2>
            <p className="mt-6 max-w-md text-lg font-medium leading-8 text-slate-400">
              Die wichtigsten Antworten rund um Anfragen, Anbieter und die
              Nutzung von Auftrago.
            </p>

            <Link
              href="/offerte-anfragen"
              className="mt-9 inline-flex min-h-[56px] items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] px-6 font-black transition hover:-translate-y-1 hover:border-sky-300/25"
            >
              Direkt Anfrage starten
            </Link>
          </div>

          <div className="auftrago-faq space-y-3">
            {faqs.map((faq, index) => (
              <details
                key={faq.question}
                className="group overflow-hidden rounded-[24px] border border-white/[0.08] bg-white/[0.025] transition open:border-sky-300/20 open:bg-white/[0.045]"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-5 px-5 py-5 sm:px-7 sm:py-6">
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-black text-sky-300">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="text-base font-black sm:text-lg">
                      {faq.question}
                    </span>
                  </div>
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-lg transition duration-300 group-open:rotate-45 group-open:border-sky-300/20 group-open:bg-sky-400/10">
                    +
                  </span>
                </summary>
                <div className="border-t border-white/[0.06] px-5 py-5 sm:px-7 sm:py-6">
                  <p className="max-w-3xl text-sm font-medium leading-7 text-slate-400 sm:text-base sm:leading-8">
                    {faq.answer}
                  </p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative px-5 pb-12 sm:px-8 lg:px-12 lg:pb-16">
        <div className="relative mx-auto max-w-[1450px] overflow-hidden rounded-[44px] border border-white/10 bg-[#071020] px-6 py-20 text-center shadow-[0_50px_150px_rgba(0,0,0,0.5)] sm:px-10 sm:py-24 lg:py-32">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(56,189,248,0.2),transparent_35%),radial-gradient(circle_at_80%_90%,rgba(99,102,241,0.22),transparent_35%),linear-gradient(135deg,rgba(255,255,255,0.025),transparent)]" />
          <div className="auftrago-grid absolute inset-0 opacity-30" />
          <div className="auftrago-noise absolute inset-0 opacity-20" />

          <div className="relative mx-auto max-w-[1050px]">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-400/[0.07] px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-emerald-200">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Bereit für deinen Auftrag
            </span>

            <h2 className="mt-7 text-5xl font-black leading-[0.94] tracking-[-0.065em] sm:text-6xl lg:text-8xl">
              Eine Anfrage.
              <span className="auftrago-text-gradient block">
                Der Anfang von allem.
              </span>
            </h2>

            <p className="mx-auto mt-7 max-w-[760px] text-lg font-medium leading-8 text-slate-300 sm:text-xl">
              Kostenlos erfassen, passende Anbieter erreichen und selbst
              entscheiden, wer dein Projekt umsetzen darf.
            </p>

            <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                href="/offerte-anfragen"
                className="group inline-flex min-h-[64px] items-center justify-center rounded-2xl bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-500 px-9 text-base font-black shadow-[0_24px_75px_rgba(37,99,235,0.4)] transition hover:-translate-y-1 hover:shadow-[0_32px_90px_rgba(37,99,235,0.55)]"
              >
                Kostenlose Anfrage starten
                <span className="ml-3 text-xl transition group-hover:translate-x-1">
                  →
                </span>
              </Link>

              <Link
                href="/anbieter-registrieren"
                className="inline-flex min-h-[64px] items-center justify-center rounded-2xl border border-white/15 bg-white/[0.05] px-9 text-base font-black backdrop-blur-xl transition hover:-translate-y-1 hover:border-white/25 hover:bg-white/[0.08]"
              >
                Als Anbieter registrieren
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-x-7 gap-y-3 text-xs font-bold text-slate-500 sm:text-sm">
              <span>✓ Kostenlos</span>
              <span>✓ Unverbindlich</span>
              <span>✓ Schweizweit</span>
              <span>✓ In wenigen Schritten</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
