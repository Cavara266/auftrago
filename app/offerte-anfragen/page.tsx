import type { Metadata } from "next";
import Link from "next/link";

import OfferteAnfrageForm from "@/components/offerte-anfrage-form";
import LiveLeadsSection from "@/components/live-leads-section";

export const metadata: Metadata = {
  title: "Kostenlos Offerten anfragen | Auftrago Schweiz",
  description:
    "Beschreibe deinen Auftrag kostenlos und unverbindlich. Erhalte passende Rückmeldungen von regionalen Anbietern für Reinigung, Umzug, Hauswartung, Gartenpflege, Handwerk und mehr.",
  alternates: {
    canonical: "https://www.auftrago.ch/offerte-anfragen",
  },
  openGraph: {
    title: "Kostenlos passende Offerten anfragen | Auftrago",
    description:
      "Erfasse deinen Auftrag in wenigen Schritten und erreiche passende Anbieter aus deiner Region.",
    url: "https://www.auftrago.ch/offerte-anfragen",
    siteName: "Auftrago",
    type: "website",
  },
};

const popularServices = [
  {
    icon: "🧹",
    title: "Reinigung",
    text: "Wohnungsreinigung, Büroreinigung, Unterhaltsreinigung und Spezialreinigung.",
    href: "/leistungen/reinigung",
    accent: "from-sky-400/25 via-blue-500/8 to-transparent",
  },
  {
    icon: "🏠",
    title: "Umzugsreinigung",
    text: "Endreinigung, Wohnungsabgabe, Küche, Bad, Fenster und Abgabereinigung.",
    href: "/leistungen/umzugsreinigung",
    accent: "from-indigo-400/25 via-violet-500/8 to-transparent",
  },
  {
    icon: "🏢",
    title: "Hauswartung",
    text: "Liegenschaftsunterhalt, Treppenhausreinigung, Kontrolle und Betreuung.",
    href: "/leistungen/hauswartung",
    accent: "from-cyan-400/25 via-sky-500/8 to-transparent",
  },
  {
    icon: "🌿",
    title: "Gartenpflege",
    text: "Rasenpflege, Heckenschnitt, Laubarbeiten und saisonaler Gartenunterhalt.",
    href: "/leistungen/gartenpflege",
    accent: "from-emerald-400/25 via-teal-500/8 to-transparent",
  },
  {
    icon: "🚚",
    title: "Umzug & Transport",
    text: "Privatumzug, Möbeltransport, Kleintransport und Transporthilfe.",
    href: "/leistungen/umzug",
    accent: "from-violet-400/25 via-purple-500/8 to-transparent",
  },
  {
    icon: "♻️",
    title: "Entsorgung",
    text: "Räumung, Sperrgut, Keller, Estrich und fachgerechte Entsorgung.",
    href: "/leistungen/entsorgung",
    accent: "from-green-400/25 via-emerald-500/8 to-transparent",
  },
];

const steps = [
  {
    number: "01",
    icon: "✍️",
    title: "Auftrag beschreiben",
    text: "Wähle die Dienstleistung und beschreibe kurz, was erledigt werden soll.",
  },
  {
    number: "02",
    icon: "📍",
    title: "Ort und Termin angeben",
    text: "Teile uns mit, wo der Auftrag stattfindet und wann du ihn ausführen lassen möchtest.",
  },
  {
    number: "03",
    icon: "📡",
    title: "Anbieter erreichen",
    text: "Passende regionale Dienstleister können deine Anfrage prüfen und sich bei dir melden.",
  },
  {
    number: "04",
    icon: "🏆",
    title: "Offerten vergleichen",
    text: "Du vergleichst Rückmeldungen und entscheidest selbst, welcher Anbieter am besten passt.",
  },
];

const regions = [
  "Zürich",
  "Aargau",
  "Bern",
  "Basel",
  "Luzern",
  "Zug",
  "St. Gallen",
  "Schaffhausen",
  "Solothurn",
  "Thurgau",
  "Graubünden",
  "Tessin",
];

const faqs = [
  {
    question: "Ist die Anfrage über Auftrago kostenlos?",
    answer:
      "Ja. Du kannst deine Anfrage kostenlos und unverbindlich erfassen. Du entscheidest selbst, ob eine Rückmeldung oder Offerte zu deinem Auftrag passt.",
  },
  {
    question: "Wie viele Offerten erhalte ich?",
    answer:
      "Die Anzahl der Rückmeldungen hängt von der Dienstleistung, Region, Verfügbarkeit und den Angaben in deiner Anfrage ab. Je genauer du den Auftrag beschreibst, desto besser können Anbieter einschätzen, ob sie passen.",
  },
  {
    question: "Welche Dienstleistungen kann ich anfragen?",
    answer:
      "Auftrago deckt zahlreiche Bereiche ab, darunter Reinigung, Umzug, Hauswartung, Gartenpflege, Entsorgung, Transport, Malerarbeiten, Elektriker, Sanitär und weitere Dienstleistungen.",
  },
  {
    question: "Wie schnell bekomme ich eine Rückmeldung?",
    answer:
      "Das hängt von Region, Termin und Verfügbarkeit der Anbieter ab. Vollständige Angaben, klare Beschreibungen und passende Fotos können die Reaktionszeit verbessern.",
  },
  {
    question: "Muss ich ein Angebot annehmen?",
    answer:
      "Nein. Deine Anfrage ist unverbindlich. Du kannst Rückmeldungen vergleichen und frei entscheiden, ob du einen Anbieter beauftragen möchtest.",
  },
];

export default function OfferteAnfragenPage() {
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

  return (
    <main
      id="top"
      className="overflow-hidden bg-[#020611] text-white"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />

      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes quoteFloat {
              0%, 100% {
                transform: translate3d(0, 0, 0);
              }

              50% {
                transform: translate3d(0, -12px, 0);
              }
            }

            @keyframes quotePulse {
              0%, 100% {
                opacity: .45;
                transform: scale(1);
              }

              50% {
                opacity: 1;
                transform: scale(1.16);
              }
            }

            @keyframes quoteRotate {
              from {
                transform: rotate(0deg);
              }

              to {
                transform: rotate(360deg);
              }
            }

            @keyframes quoteMarquee {
              from {
                transform: translateX(0);
              }

              to {
                transform: translateX(-50%);
              }
            }

            .quote-grid {
              background-image:
                linear-gradient(
                  rgba(255,255,255,.035) 1px,
                  transparent 1px
                ),
                linear-gradient(
                  90deg,
                  rgba(255,255,255,.035) 1px,
                  transparent 1px
                );

              background-size:
                72px 72px;
            }

            .quote-dots {
              background-image:
                radial-gradient(
                  rgba(255,255,255,.12) 1px,
                  transparent 1px
                );

              background-size:
                24px 24px;
            }

            .quote-gradient-text {
              background:
                linear-gradient(
                  110deg,
                  #ffffff 0%,
                  #ffffff 24%,
                  #67d8ff 48%,
                  #7180ff 70%,
                  #d451ff 92%
                );

              -webkit-background-clip:
                text;

              background-clip:
                text;

              color:
                transparent;
            }

            .quote-glass {
              background:
                linear-gradient(
                  145deg,
                  rgba(255,255,255,.085),
                  rgba(255,255,255,.018)
                );

              backdrop-filter:
                blur(24px);

              box-shadow:
                inset 0 1px 0 rgba(255,255,255,.08),
                0 42px 130px rgba(0,0,0,.42);
            }

            .quote-float {
              animation:
                quoteFloat 7s ease-in-out infinite;
            }

            .quote-float-delayed {
              animation:
                quoteFloat 9s ease-in-out infinite 1.4s;
            }

            .quote-pulse {
              animation:
                quotePulse 2.3s ease-in-out infinite;
            }

            .quote-rotate {
              animation:
                quoteRotate 36s linear infinite;
            }

            .quote-marquee {
              animation:
                quoteMarquee 29s linear infinite;
            }

            .quote-shine::before {
              content: "";
              position:
                absolute;
              inset:
                -60% auto -60% -45%;
              width:
                26%;
              transform:
                rotate(15deg);
              background:
                linear-gradient(
                  90deg,
                  transparent,
                  rgba(255,255,255,.1),
                  transparent
                );
              transition:
                left .9s ease;
              pointer-events:
                none;
            }

            .quote-shine:hover::before {
              left:
                125%;
            }

            .quote-faq summary::-webkit-details-marker {
              display:
                none;
            }

            #quote-form input,
            #quote-form textarea,
            #quote-form select {
              background:
                rgba(1, 5, 19, .84) !important;

              border:
                1px solid rgba(255,255,255,.11) !important;

              border-radius:
                18px !important;

              color:
                white !important;

              transition:
                border-color .25s ease,
                box-shadow .25s ease,
                background .25s ease !important;
            }

            #quote-form input:focus,
            #quote-form textarea:focus,
            #quote-form select:focus {
              border-color:
                rgba(96,165,250,.7) !important;

              box-shadow:
                0 0 0 4px rgba(59,130,246,.11),
                0 20px 50px rgba(0,0,0,.24) !important;

              background:
                rgba(4, 10, 30, .98) !important;

              outline:
                none !important;
            }

            #quote-form input::placeholder,
            #quote-form textarea::placeholder {
              color:
                rgba(148,163,184,.72) !important;
            }

            #quote-form button[type="submit"] {
              min-height:
                64px !important;

              border:
                0 !important;

              border-radius:
                18px !important;

              background:
                linear-gradient(
                  90deg,
                  #38bdf8,
                  #4f6df5,
                  #a855f7
                ) !important;

              color:
                white !important;

              font-weight:
                900 !important;

              box-shadow:
                0 24px 75px rgba(79,70,229,.38) !important;

              transition:
                transform .25s ease,
                box-shadow .25s ease !important;
            }

            #quote-form button[type="submit"]:hover {
              transform:
                translateY(-3px) !important;

              box-shadow:
                0 34px 100px rgba(79,70,229,.55) !important;
            }

            @media (prefers-reduced-motion: reduce) {
              .quote-float,
              .quote-float-delayed,
              .quote-pulse,
              .quote-rotate,
              .quote-marquee {
                animation:
                  none !important;
              }
            }
          `,
        }}
      />

      {/* HERO + FORMULAR */}
      <section className="relative min-h-[1020px] overflow-hidden border-b border-white/[0.08]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_20%,rgba(14,165,233,0.25),transparent_35%),radial-gradient(circle_at_88%_18%,rgba(99,102,241,0.28),transparent_35%),radial-gradient(circle_at_55%_92%,rgba(168,85,247,0.12),transparent_38%),linear-gradient(180deg,#070b1c_0%,#020611_100%)]" />

        <div className="quote-grid absolute inset-0 opacity-45 [mask-image:linear-gradient(to_bottom,black,transparent_96%)]" />
        <div className="quote-dots absolute inset-0 opacity-[0.04]" />

        <div className="absolute -left-48 top-24 h-[600px] w-[600px] rounded-full bg-sky-500/15 blur-[125px]" />
        <div className="absolute -right-52 top-12 h-[660px] w-[660px] rounded-full bg-violet-500/18 blur-[135px]" />

        <div className="quote-rotate absolute left-[76%] top-[44%] hidden h-[850px] w-[850px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-white/[0.05] xl:block" />

        <div className="relative mx-auto grid max-w-[1500px] gap-14 px-5 pb-24 pt-20 sm:px-8 lg:grid-cols-[.9fr_1.1fr] lg:items-start lg:px-12 lg:pb-32 lg:pt-28">
          <div className="relative z-10 pt-5 lg:sticky lg:top-28 lg:pt-16">
            <div className="inline-flex items-center gap-3 rounded-full border border-sky-300/20 bg-sky-400/[0.07] px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-sky-200">
              <span className="relative flex h-2.5 w-2.5">
                <span className="quote-pulse absolute inline-flex h-full w-full rounded-full bg-emerald-400" />

                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
              </span>

              Kostenlos & unverbindlich
            </div>

            <h1 className="mt-8 max-w-[820px] text-[3.5rem] font-black leading-[0.89] tracking-[-0.078em] sm:text-[5.2rem] lg:text-[6.1rem] xl:text-[6.8rem]">
              Ein Auftrag.
              <span className="quote-gradient-text mt-2 block">
                Passende Offerten.
              </span>
            </h1>

            <p className="mt-8 max-w-[690px] text-lg font-medium leading-8 text-slate-300 sm:text-xl sm:leading-9">
              Beschreibe dein Projekt einmal und erreiche passende regionale
              Anbieter. Kostenlos, unverbindlich und ohne mühsame Einzelsuche.
            </p>

            <div className="mt-9 grid gap-3 sm:grid-cols-2">
              {[
                "100 % kostenlos",
                "Keine Annahmepflicht",
                "Regionale Anbieter",
                "In wenigen Schritten",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.035] p-4 backdrop-blur-xl"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-400/10 text-sm font-black text-emerald-300">
                    ✓
                  </span>

                  <span className="text-sm font-black text-slate-300">
                    {item}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-8 overflow-hidden rounded-[30px] border border-white/[0.1] bg-white/[0.035] p-6 quote-glass">
              <div className="flex items-start gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-sky-300/20 bg-sky-400/10 text-xl">
                  ⚡
                </span>

                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-sky-300">
                    Warum jetzt anfragen?
                  </p>

                  <h2 className="mt-2 text-xl font-black tracking-[-0.03em]">
                    Anbieter können deinen Auftrag direkt prüfen.
                  </h2>

                  <p className="mt-3 text-sm font-medium leading-7 text-slate-400">
                    Je vollständiger deine Angaben sind, desto einfacher können
                    passende Firmen Preis, Aufwand und Verfügbarkeit
                    einschätzen.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-3">
              {[
                ["01", "Auftrag erfassen"],
                ["02", "Anbieter erreichen"],
                ["03", "Offerten vergleichen"],
              ].map(([number, label]) => (
                <div
                  key={number}
                  className="rounded-[22px] border border-white/[0.08] bg-black/20 p-4"
                >
                  <span className="text-xs font-black tracking-[0.18em] text-sky-300">
                    {number}
                  </span>

                  <p className="mt-3 text-xs font-black leading-5 text-slate-300 sm:text-sm">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div
            id="quote-form"
            className="relative scroll-mt-24"
          >
            <div className="absolute -inset-4 rounded-[52px] bg-gradient-to-br from-sky-500/20 via-indigo-500/12 to-fuchsia-500/20 blur-3xl" />

            <div className="relative overflow-hidden rounded-[44px] border border-white/[0.11] bg-[#081020] p-5 shadow-[0_48px_150px_rgba(0,0,0,.55)] sm:p-8 lg:p-10">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(56,189,248,0.18),transparent_34%),radial-gradient(circle_at_100%_100%,rgba(168,85,247,0.16),transparent_35%)]" />

              <div className="quote-grid absolute inset-0 opacity-15" />

              <div className="relative">
                <div className="mb-8 border-b border-white/[0.08] pb-7">
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.2em] text-sky-300">
                        Jetzt starten
                      </p>

                      <h2 className="mt-3 text-3xl font-black tracking-[-0.05em] sm:text-4xl">
                        Kostenlose Offerten anfragen
                      </h2>

                      <p className="mt-3 max-w-xl text-sm font-medium leading-7 text-slate-400">
                        Gib uns die wichtigsten Angaben. Passende Anbieter
                        können sich danach direkt bei dir melden.
                      </p>
                    </div>

                    <span className="flex w-fit items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-400/10 px-3 py-2 text-xs font-black text-emerald-300">
                      <span className="h-2 w-2 rounded-full bg-emerald-400" />

                      Sicher
                    </span>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {[
                      "✓ Kostenlos",
                      "✓ Unverbindlich",
                      "✓ Regionale Anbieter",
                    ].map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-white/[0.08] bg-white/[0.045] px-3 py-2 text-xs font-black uppercase tracking-[0.13em] text-sky-200"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <OfferteAnfrageForm />

                <div className="mt-7 grid gap-3 border-t border-white/[0.08] pt-7 sm:grid-cols-3">
                  {[
                    ["🔒", "Sichere Übermittlung"],
                    ["🇨🇭", "Schweizer Plattform"],
                    ["✓", "Keine Annahmepflicht"],
                  ].map(([icon, label]) => (
                    <div
                      key={label}
                      className="flex items-center justify-center gap-2 rounded-2xl border border-white/[0.07] bg-black/20 px-3 py-3 text-center text-xs font-bold text-slate-400"
                    >
                      <span>{icon}</span>
                      <span>{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="quote-float absolute -right-7 top-20 hidden w-[220px] rounded-[25px] border border-white/10 p-4 quote-glass xl:block">
              <p className="text-xs font-black uppercase tracking-[0.17em] text-emerald-300">
                ● Anfrage aktiv
              </p>

              <p className="mt-2 font-black">
                Anbieter können reagieren
              </p>
            </div>

            <div className="quote-float-delayed absolute -left-10 bottom-24 hidden w-[220px] rounded-[25px] border border-white/10 p-4 quote-glass xl:block">
              <p className="text-xs font-black uppercase tracking-[0.17em] text-violet-300">
                Dein Vorteil
              </p>

              <p className="mt-2 font-black">
                Eine Anfrage statt vieler Telefonate
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <section className="overflow-hidden border-b border-white/[0.08] bg-[#030816] py-7">
        <div className="quote-marquee flex w-max items-center">
          {[
            "REINIGUNG",
            "UMZUG",
            "HAUSWARTUNG",
            "GARTENPFLEGE",
            "ENTsORGUNG",
            "MALER",
            "ELEKTRIKER",
            "SANITÄR",
            "TRANSPORT",
            "REINIGUNG",
            "UMZUG",
            "HAUSWARTUNG",
            "GARTENPFLEGE",
            "ENTSORGUNG",
            "MALER",
            "ELEKTRIKER",
            "SANITÄR",
            "TRANSPORT",
          ].map((item, index) => (
            <div
              key={`${item}-${index}`}
              className="flex items-center"
            >
              <span className="mx-7 whitespace-nowrap text-xs font-black tracking-[0.32em] text-slate-500">
                {item}
              </span>

              <span className="text-sky-400/50">
                ✦
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* LIVE ANFRAGEN */}
      <section className="relative">
        <LiveLeadsSection />
      </section>

      {/* SERVICES */}
      <section className="relative px-5 py-28 sm:px-8 lg:px-12 lg:py-40">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_10%,rgba(99,102,241,0.11),transparent_34%),radial-gradient(circle_at_5%_75%,rgba(14,165,233,0.09),transparent_32%)]" />

        <div className="quote-grid absolute inset-0 opacity-15 [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)]" />

        <div className="relative mx-auto max-w-[1500px]">
          <div className="grid items-end gap-10 lg:grid-cols-[1fr_440px]">
            <div>
              <span className="inline-flex rounded-full border border-sky-300/20 bg-sky-400/[0.06] px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-sky-200">
                Dienstleistungen
              </span>

              <h2 className="mt-7 max-w-[1050px] text-[3.3rem] font-black leading-[0.92] tracking-[-0.07em] sm:text-[5rem] lg:text-[6rem]">
                Was auch ansteht.
                <span className="quote-gradient-text block">
                  Starte deine Anfrage.
                </span>
              </h2>
            </div>

            <p className="text-lg font-medium leading-8 text-slate-400">
              Von einmaligen Arbeiten bis zu wiederkehrenden Aufträgen:
              Beschreibe deinen Bedarf und erreiche passende Anbieter.
            </p>
          </div>

          <div className="mt-16 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {popularServices.map((service, index) => (
              <Link
                key={service.title}
                href={service.href}
                className="quote-shine group relative min-h-[340px] overflow-hidden rounded-[35px] border border-white/[0.09] bg-[#080e20] p-7 transition duration-500 hover:-translate-y-3 hover:border-white/[0.18] hover:bg-[#0b1329] hover:shadow-[0_42px_115px_rgba(0,0,0,.48)] sm:p-8"
              >
                <div
                  className={[
                    "absolute inset-0 bg-gradient-to-br opacity-75 transition duration-500 group-hover:opacity-100",
                    service.accent,
                  ].join(" ")}
                />

                <div className="relative flex h-full flex-col">
                  <div className="flex items-start justify-between">
                    <span className="flex h-[66px] w-[66px] items-center justify-center rounded-[22px] border border-white/10 bg-black/20 text-3xl transition duration-500 group-hover:rotate-5 group-hover:scale-110">
                      {service.icon}
                    </span>

                    <span className="text-xs font-black tracking-[0.2em] text-white/20">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <div className="mt-auto pt-14">
                    <h3 className="text-3xl font-black tracking-[-0.045em]">
                      {service.title}
                    </h3>

                    <p className="mt-4 text-sm font-medium leading-7 text-slate-400">
                      {service.text}
                    </p>

                    <div className="mt-7 flex items-center justify-between border-t border-white/[0.08] pt-6">
                      <span className="text-sm font-black">
                        Mehr erfahren
                      </span>

                      <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-sky-300 transition group-hover:translate-x-1 group-hover:border-sky-300/25">
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

      {/* ABLAUF */}
      <section className="relative border-y border-white/[0.08] bg-[#040817] px-5 py-28 sm:px-8 lg:px-12 lg:py-40">
        <div className="quote-grid absolute inset-0 opacity-15" />

        <div className="relative mx-auto max-w-[1500px]">
          <div className="mx-auto max-w-[1000px] text-center">
            <span className="inline-flex rounded-full border border-violet-300/20 bg-violet-400/[0.06] px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-violet-200">
              So funktioniert deine Anfrage
            </span>

            <h2 className="mt-7 text-[3.3rem] font-black leading-[0.92] tracking-[-0.07em] sm:text-[5rem] lg:text-[6rem]">
              Einfach starten.
              <span className="quote-gradient-text block">
                Selbst entscheiden.
              </span>
            </h2>
          </div>

          <div className="relative mt-20 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            <div className="absolute left-[10%] right-[10%] top-[69px] hidden h-px bg-gradient-to-r from-transparent via-sky-400/40 to-transparent xl:block" />

            {steps.map((step, index) => (
              <div
                key={step.number}
                className="group relative min-h-[370px] overflow-hidden rounded-[34px] border border-white/[0.09] bg-[#080e20] p-7 transition duration-500 hover:-translate-y-3 hover:border-sky-300/20 hover:bg-[#0a132b] sm:p-8"
              >
                <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-sky-400/[0.06] blur-3xl transition group-hover:bg-sky-400/12" />

                <div className="relative">
                  <div className="flex items-start justify-between">
                    <span className="flex h-[66px] w-[66px] items-center justify-center rounded-[23px] border border-white/10 bg-white/[0.04] text-3xl transition duration-500 group-hover:scale-110 group-hover:border-sky-300/30 group-hover:bg-sky-400/10">
                      {step.icon}
                    </span>

                    <span className="text-6xl font-black tracking-[-0.08em] text-white/[0.045]">
                      {step.number}
                    </span>
                  </div>

                  <h3 className="mt-10 text-2xl font-black leading-tight tracking-[-0.04em]">
                    {step.title}
                  </h3>

                  <p className="mt-5 text-sm font-medium leading-7 text-slate-400">
                    {step.text}
                  </p>
                </div>

                {index < steps.length - 1 && (
                  <span className="absolute -right-3 top-[56px] z-20 hidden h-7 w-7 items-center justify-center rounded-full border border-sky-300/20 bg-[#091329] text-xs text-sky-300 xl:flex">
                    →
                  </span>
                )}
              </div>
            ))}
          </div>

          <div className="mt-12 flex justify-center">
            <a
              href="#top"
              className="inline-flex min-h-[62px] items-center justify-center rounded-2xl bg-gradient-to-r from-sky-400 via-indigo-500 to-fuchsia-500 px-9 font-black shadow-[0_25px_85px_rgba(79,70,229,.4)] transition hover:-translate-y-1"
            >
              Anfrage jetzt erfassen
            </a>
          </div>
        </div>
      </section>

      {/* REGIONS */}
      <section className="relative px-5 py-28 sm:px-8 lg:px-12 lg:py-40">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(56,189,248,0.1),transparent_35%)]" />

        <div className="relative mx-auto max-w-[1500px]">
          <div className="mx-auto max-w-[1000px] text-center">
            <span className="inline-flex rounded-full border border-sky-300/20 bg-sky-400/[0.06] px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-sky-200">
              Regionen
            </span>

            <h2 className="mt-7 text-[3.3rem] font-black leading-[0.92] tracking-[-0.07em] sm:text-[5rem] lg:text-[6rem]">
              Offerten dort anfragen,
              <span className="quote-gradient-text block">
                wo dein Auftrag ist.
              </span>
            </h2>

            <p className="mx-auto mt-7 max-w-[720px] text-lg font-medium leading-8 text-slate-400">
              Starte deine Anfrage schweizweit und erreiche Anbieter aus deiner
              Region.
            </p>
          </div>

          <div className="mt-16 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {regions.map((region, index) => (
              <a
                key={region}
                href="#top"
                className="group flex min-h-[112px] items-center justify-between rounded-[26px] border border-white/[0.08] bg-[#080d1d] p-5 transition duration-300 hover:-translate-y-1 hover:border-sky-300/20 hover:bg-sky-400/[0.055]"
              >
                <div>
                  <span className="text-[10px] font-black tracking-[0.18em] text-slate-600">
                    REGION {String(index + 1).padStart(2, "0")}
                  </span>

                  <p className="mt-2 text-lg font-black">
                    Offerten in {region}
                  </p>
                </div>

                <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-sky-300 transition group-hover:translate-x-1">
                  →
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="relative border-y border-white/[0.08] bg-[#040817] px-5 py-28 sm:px-8 lg:px-12 lg:py-40">
        <div className="quote-grid absolute inset-0 opacity-15" />

        <div className="relative mx-auto grid max-w-[1500px] gap-14 lg:grid-cols-[.7fr_1.3fr]">
          <div>
            <span className="inline-flex rounded-full border border-sky-300/20 bg-sky-400/[0.06] px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-sky-200">
              Fragen & Antworten
            </span>

            <h2 className="mt-7 text-[3.3rem] font-black leading-[0.92] tracking-[-0.07em] sm:text-[4.8rem]">
              Noch Fragen?
              <span className="quote-gradient-text block">
                Alles erklärt.
              </span>
            </h2>

            <a
              href="#top"
              className="mt-9 inline-flex min-h-[58px] items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] px-7 font-black transition hover:-translate-y-1 hover:border-sky-300/25"
            >
              Anfrage direkt starten
            </a>
          </div>

          <div className="quote-faq space-y-3">
            {faqs.map((faq, index) => (
              <details
                key={faq.question}
                className="group overflow-hidden rounded-[26px] border border-white/[0.085] bg-white/[0.025] transition open:border-sky-300/20 open:bg-white/[0.045]"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-5 px-5 py-5 sm:px-7 sm:py-6">
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-black tracking-[0.12em] text-sky-300">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <span className="text-base font-black sm:text-lg">
                      {faq.question}
                    </span>
                  </div>

                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-xl transition duration-300 group-open:rotate-45 group-open:border-sky-300/20 group-open:bg-sky-400/10">
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
      <section className="relative px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
        <div className="relative mx-auto max-w-[1500px] overflow-hidden rounded-[50px] border border-white/10 bg-[#080e21] px-6 py-24 text-center shadow-[0_55px_170px_rgba(0,0,0,.55)] sm:px-12 lg:py-36">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_10%,rgba(56,189,248,0.25),transparent_35%),radial-gradient(circle_at_90%_90%,rgba(192,55,255,0.24),transparent_35%)]" />

          <div className="quote-grid absolute inset-0 opacity-25" />

          <div className="quote-rotate absolute left-1/2 top-1/2 h-[820px] w-[820px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-white/[0.045]" />

          <div className="relative mx-auto max-w-[1100px]">
            <span className="inline-flex items-center gap-3 rounded-full border border-emerald-300/20 bg-emerald-400/[0.07] px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-emerald-200">
              <span className="relative flex h-2 w-2">
                <span className="quote-pulse absolute inline-flex h-full w-full rounded-full bg-emerald-400" />

                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>

              Jetzt kostenlos starten
            </span>

            <h2 className="mt-8 text-[3.5rem] font-black leading-[0.88] tracking-[-0.075em] sm:text-[5.7rem] lg:text-[7.2rem]">
              Eine Anfrage.
              <span className="quote-gradient-text block">
                Mehr Möglichkeiten.
              </span>
            </h2>

            <p className="mx-auto mt-8 max-w-[790px] text-lg font-medium leading-8 text-slate-300 sm:text-xl">
              Beschreibe deine Aufgabe einmal und spare dir die Suche nach
              einzelnen Firmen.
            </p>

            <a
              href="#top"
              className="group mt-11 inline-flex min-h-[66px] items-center justify-center rounded-2xl bg-gradient-to-r from-sky-400 via-indigo-500 to-fuchsia-500 px-9 text-base font-black shadow-[0_27px_90px_rgba(82,73,255,.48)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_38px_110px_rgba(82,73,255,.65)]"
            >
              Kostenlose Offerten anfragen

              <span className="ml-3 text-xl transition group-hover:translate-x-1">
                →
              </span>
            </a>

            <div className="mt-9 flex flex-wrap justify-center gap-x-8 gap-y-3 text-xs font-bold text-slate-500 sm:text-sm">
              <span>✓ Kostenlos</span>
              <span>✓ Unverbindlich</span>
              <span>✓ Regionale Anbieter</span>
              <span>✓ Keine Annahmepflicht</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
