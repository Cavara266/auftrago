import type { Metadata } from "next";
import Link from "next/link";

import AnbieterRegistrierenForm from "@/components/anbieter-registrieren-form";

export const metadata: Metadata = {
  title:
    "Anbieter werden | Regionale Kundenanfragen erhalten | Auftrago",
  description:
    "Registriere deine Firma kostenlos auf Auftrago und entdecke regionale Kundenanfragen für Reinigung, Handwerk, Umzug, Gartenpflege, Hauswartung und weitere Dienstleistungen.",
  alternates: {
    canonical:
      "https://www.auftrago.ch/anbieter-registrieren",
  },
  openGraph: {
    title:
      "Neue Kundenanfragen für deine Firma | Auftrago",
    description:
      "Werde Anbieter auf Auftrago und erhalte Zugang zu passenden regionalen Kundenanfragen.",
    url:
      "https://www.auftrago.ch/anbieter-registrieren",
    siteName: "Auftrago",
    type: "website",
  },
};

const exampleLeads = [
  {
    icon: "🧹",
    title: "Umzugsreinigung",
    region: "Aargau",
    detail: "3.5 Zimmer",
    status: "Neu",
    accent:
      "from-sky-400/20 via-cyan-400/5 to-transparent",
  },
  {
    icon: "🎨",
    title: "Malerarbeiten",
    region: "Zürich",
    detail: "Wohnung renovieren",
    status: "Aktiv",
    accent:
      "from-orange-400/20 via-amber-400/5 to-transparent",
  },
  {
    icon: "🚚",
    title: "Privatumzug",
    region: "Luzern",
    detail: "Mit Möbelmontage",
    status: "Top Auftrag",
    accent:
      "from-violet-400/20 via-indigo-400/5 to-transparent",
  },
];

const steps = [
  {
    number: "01",
    icon: "🏢",
    title: "Firma registrieren",
    text:
      "Trage deine Firmendaten, Dienstleistungen und Einsatzregionen ein.",
  },
  {
    number: "02",
    icon: "✓",
    title: "Profil wird geprüft",
    text:
      "Auftrago prüft deine Angaben und schaltet dein Anbieterprofil frei.",
  },
  {
    number: "03",
    icon: "📡",
    title: "Anfragen entdecken",
    text:
      "Du siehst passende Kundenanfragen aus deinen Kategorien und Regionen.",
  },
  {
    number: "04",
    icon: "🚀",
    title: "Neue Aufträge gewinnen",
    text:
      "Schalte interessante Anfragen frei und nimm direkt Kontakt auf.",
  },
];

const benefits = [
  {
    number: "01",
    icon: "📍",
    title: "Regionale Anfragen",
    text:
      "Konzentriere dich auf Kantone, Städte und Einsatzgebiete, in denen dein Betrieb tatsächlich tätig ist.",
  },
  {
    number: "02",
    icon: "🎯",
    title: "Passende Kategorien",
    text:
      "Du erhältst Zugang zu Anfragen, die zu deinen gewählten Dienstleistungen passen.",
  },
  {
    number: "03",
    icon: "⚡",
    title: "Schneller Kundenkontakt",
    text:
      "Nach der Freischaltung einer Anfrage erhältst du die vollständigen Kontaktdaten.",
  },
  {
    number: "04",
    icon: "💰",
    title: "Volle Kostenkontrolle",
    text:
      "Du entscheidest selbst, welche Kundenanfragen für deinen Betrieb interessant sind.",
  },
  {
    number: "05",
    icon: "📈",
    title: "Mehr Sichtbarkeit",
    text:
      "Präsentiere deinen Betrieb auf einer Schweizer Plattform für regionale Dienstleistungen.",
  },
  {
    number: "06",
    icon: "🤝",
    title: "Keine Kaltakquise",
    text:
      "Du kontaktierst Personen, die bereits eine konkrete Dienstleistung suchen.",
  },
];

const providerTypes = [
  ["🧹", "Reinigungsfirmen"],
  ["🏢", "Hauswartungen"],
  ["🚚", "Umzugsfirmen"],
  ["🌿", "Gartenpflege"],
  ["♻️", "Entsorgungsbetriebe"],
  ["🪟", "Fensterreinigung"],
  ["🎨", "Malerbetriebe"],
  ["⚡", "Elektriker"],
  ["🚿", "Sanitärfirmen"],
  ["📦", "Transportfirmen"],
  ["🪵", "Schreiner"],
  ["🏗️", "Renovationsfirmen"],
];

const regions = [
  "Zürich",
  "Aargau",
  "Bern",
  "Basel",
  "Luzern",
  "Zug",
  "St. Gallen",
  "Solothurn",
  "Schaffhausen",
  "Thurgau",
  "Graubünden",
  "Waadt",
];

const trustStats = [
  {
    value: "420+",
    label: "Dienstleistungen",
  },
  {
    value: "26",
    label: "Kantone",
  },
  {
    value: "Täglich",
    label: "Neue Anfragen",
  },
  {
    value: "Direkt",
    label: "Zum Kundenkontakt",
  },
];

const faqs = [
  {
    question:
      "Für welche Firmen ist Auftrago geeignet?",
    answer:
      "Auftrago eignet sich für regionale Dienstleister wie Reinigungsfirmen, Hauswartungen, Umzugsunternehmen, Gartenbauer, Entsorgungsbetriebe, Handwerker, Elektriker, Sanitärfirmen, Maler und viele weitere Schweizer Betriebe.",
  },
  {
    question:
      "Ist die Registrierung als Anbieter kostenlos?",
    answer:
      "Die Firma kann kostenlos registriert werden. Nach der Prüfung erhältst du Zugang zum Anbieterbereich und kannst entscheiden, welche Kundenanfragen du freischalten möchtest.",
  },
  {
    question:
      "Erhalte ich automatisch jede Kundenanfrage?",
    answer:
      "Auftrago richtet die sichtbaren Anfragen nach deinen Kategorien und Regionen aus. Welche konkreten Anfragen verfügbar sind, hängt vom aktuellen Auftragseingang ab.",
  },
  {
    question:
      "Wie erhalte ich die Kontaktdaten des Kunden?",
    answer:
      "Bei einer passenden Anfrage kannst du den Auftrag im Anbieterportal freischalten. Danach werden die vollständigen Details und Kontaktdaten sichtbar.",
  },
  {
    question:
      "Kann ich meine Regionen selbst bestimmen?",
    answer:
      "Ja. Du kannst angeben, in welchen Städten, Kantonen und Einsatzgebieten dein Unternehmen tätig ist.",
  },
  {
    question:
      "Muss ich jede Anfrage bearbeiten?",
    answer:
      "Nein. Du entscheidest selbst, welche Anfragen zu deinen Kapazitäten, Leistungen und Einsatzgebieten passen.",
  },
];

export default function AnbieterRegistrierenPage() {
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

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name:
      "Anbieter werden auf Auftrago",
    url:
      "https://www.auftrago.ch/anbieter-registrieren",
    description:
      "Schweizer Dienstleister können sich auf Auftrago registrieren und regionale Kundenanfragen entdecken.",
  };

  return (
    <main className="overflow-hidden bg-[#020611] text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            faqSchema
          ),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            webPageSchema
          ),
        }}
      />

      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes providerFloat {
              0%, 100% {
                transform: translate3d(0, 0, 0);
              }

              50% {
                transform: translate3d(0, -14px, 0);
              }
            }

            @keyframes providerPulse {
              0%, 100% {
                opacity: .45;
                transform: scale(1);
              }

              50% {
                opacity: 1;
                transform: scale(1.18);
              }
            }

            @keyframes providerRotate {
              from {
                transform: rotate(0deg);
              }

              to {
                transform: rotate(360deg);
              }
            }

            @keyframes providerMarquee {
              from {
                transform: translateX(0);
              }

              to {
                transform: translateX(-50%);
              }
            }

            .provider-page-grid {
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

            .provider-dot-grid {
              background-image:
                radial-gradient(
                  rgba(255,255,255,.12) 1px,
                  transparent 1px
                );

              background-size:
                23px 23px;
            }

            .provider-gradient-text {
              background:
                linear-gradient(
                  110deg,
                  #ffffff 0%,
                  #ffffff 24%,
                  #63d8ff 48%,
                  #7182ff 70%,
                  #d35aff 92%
                );

              -webkit-background-clip:
                text;

              background-clip:
                text;

              color:
                transparent;
            }

            .provider-glass {
              background:
                linear-gradient(
                  145deg,
                  rgba(255,255,255,.085),
                  rgba(255,255,255,.02)
                );

              backdrop-filter:
                blur(24px);

              box-shadow:
                inset 0 1px 0 rgba(255,255,255,.08),
                0 38px 120px rgba(0,0,0,.38);
            }

            .provider-float {
              animation:
                providerFloat 7s ease-in-out infinite;
            }

            .provider-float-delayed {
              animation:
                providerFloat 8.5s ease-in-out infinite 1.2s;
            }

            .provider-pulse {
              animation:
                providerPulse 2.2s ease-in-out infinite;
            }

            .provider-rotate {
              animation:
                providerRotate 34s linear infinite;
            }

            .provider-marquee {
              animation:
                providerMarquee 28s linear infinite;
            }

            .provider-shine::before {
              content: "";
              position:
                absolute;
              top:
                -60%;
              bottom:
                -60%;
              left:
                -45%;
              width:
                25%;
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
                left .85s ease;
              pointer-events:
                none;
            }

            .provider-shine:hover::before {
              left:
                125%;
            }

            .provider-faq summary::-webkit-details-marker {
              display:
                none;
            }

            #anbieter-formular input,
            #anbieter-formular textarea,
            #anbieter-formular select {
              background:
                rgba(1, 5, 19, .76) !important;

              border:
                1px solid rgba(255,255,255,.1) !important;

              border-radius:
                18px !important;

              color:
                white !important;

              transition:
                border-color .25s ease,
                box-shadow .25s ease,
                background .25s ease !important;
            }

            #anbieter-formular input:focus,
            #anbieter-formular textarea:focus,
            #anbieter-formular select:focus {
              border-color:
                rgba(96,165,250,.65) !important;

              box-shadow:
                0 0 0 4px rgba(59,130,246,.11),
                0 18px 45px rgba(0,0,0,.2) !important;

              background:
                rgba(4, 10, 30, .94) !important;

              outline:
                none !important;
            }

            #anbieter-formular input::placeholder,
            #anbieter-formular textarea::placeholder {
              color:
                rgba(148,163,184,.76) !important;
            }

            #anbieter-formular button[type="submit"] {
              min-height:
                62px !important;

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
                0 22px 70px rgba(79,70,229,.34) !important;

              transition:
                transform .25s ease,
                box-shadow .25s ease !important;
            }

            #anbieter-formular button[type="submit"]:hover {
              transform:
                translateY(-3px) !important;

              box-shadow:
                0 30px 90px rgba(79,70,229,.48) !important;
            }

            @media (prefers-reduced-motion: reduce) {
              .provider-float,
              .provider-float-delayed,
              .provider-pulse,
              .provider-rotate,
              .provider-marquee {
                animation:
                  none !important;
              }
            }
          `,
        }}
      />

      {/* HERO */}
      <section className="relative min-h-[900px] overflow-hidden border-b border-white/[0.08]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(14,165,233,0.22),transparent_34%),radial-gradient(circle_at_85%_20%,rgba(99,102,241,0.24),transparent_34%),radial-gradient(circle_at_50%_85%,rgba(168,85,247,0.1),transparent_38%),linear-gradient(180deg,#070b1c_0%,#020611_100%)]" />

        <div className="provider-page-grid absolute inset-0 opacity-45 [mask-image:linear-gradient(to_bottom,black,transparent_92%)]" />

        <div className="provider-dot-grid absolute inset-0 opacity-[0.045]" />

        <div className="absolute -left-40 top-28 h-[520px] w-[520px] rounded-full bg-sky-500/15 blur-[110px]" />

        <div className="absolute -right-44 top-16 h-[600px] w-[600px] rounded-full bg-violet-500/18 blur-[125px]" />

        <div className="provider-rotate absolute left-[71%] top-[48%] hidden h-[730px] w-[730px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-white/[0.055] xl:block" />

        <div className="relative mx-auto grid min-h-[900px] max-w-[1500px] items-center gap-16 px-5 pb-24 pt-20 sm:px-8 lg:grid-cols-[1.04fr_.96fr] lg:px-12 lg:pb-28 lg:pt-24">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-3 rounded-full border border-sky-300/20 bg-sky-400/[0.07] px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-sky-200">
              <span className="relative flex h-2.5 w-2.5">
                <span className="provider-pulse absolute inline-flex h-full w-full rounded-full bg-emerald-400" />

                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
              </span>

              Auftrago Partner-Netzwerk
            </div>

            <h1 className="mt-8 max-w-[850px] text-[3.5rem] font-black leading-[0.9] tracking-[-0.075em] sm:text-[5.2rem] lg:text-[6.2rem] xl:text-[7rem]">
              Neue Kunden.
              <span className="provider-gradient-text mt-2 block">
                Direkt in deiner Region.
              </span>
            </h1>

            <p className="mt-8 max-w-[720px] text-lg font-medium leading-8 text-slate-300 sm:text-xl sm:leading-9">
              Registriere deinen Betrieb auf Auftrago und entdecke konkrete Kundenanfragen aus deinen Kategorien und Einsatzgebieten.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <a
                href="#anbieter-formular"
                className="group relative inline-flex min-h-[64px] items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-r from-sky-400 via-indigo-500 to-fuchsia-500 px-9 text-base font-black shadow-[0_25px_85px_rgba(79,70,229,0.44)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_35px_105px_rgba(79,70,229,0.6)]"
              >
                <span className="relative flex items-center gap-3">
                  Firma kostenlos registrieren

                  <span className="text-xl transition group-hover:translate-x-1">
                    →
                  </span>
                </span>
              </a>

              <Link
                href="/login"
                className="inline-flex min-h-[64px] items-center justify-center rounded-2xl border border-white/15 bg-white/[0.05] px-8 text-base font-black backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-sky-300/25 hover:bg-white/[0.08]"
              >
                Anbieter-Login
              </Link>
            </div>

            <div className="mt-9 flex flex-wrap gap-x-7 gap-y-3 text-sm font-bold text-slate-400">
              <span className="flex items-center gap-2">
                <span className="text-emerald-400">
                  ✓
                </span>

                Registrierung kostenlos
              </span>

              <span className="flex items-center gap-2">
                <span className="text-emerald-400">
                  ✓
                </span>

                Regionen selbst wählen
              </span>

              <span className="flex items-center gap-2">
                <span className="text-emerald-400">
                  ✓
                </span>

                Keine Kaltakquise
              </span>
            </div>
          </div>

          <div className="relative mx-auto hidden min-h-[690px] w-full max-w-[680px] lg:block">
            <div className="absolute left-1/2 top-1/2 w-[475px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[42px] border border-white/10 p-7 provider-glass">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(56,189,248,0.18),transparent_35%),radial-gradient(circle_at_90%_90%,rgba(168,85,247,0.18),transparent_38%)]" />

              <div className="relative">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-sky-300">
                      Anbieter Dashboard
                    </p>

                    <h2 className="mt-2 text-3xl font-black tracking-[-0.05em]">
                      Neue Anfragen
                    </h2>
                  </div>

                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 to-violet-500 text-2xl shadow-[0_18px_55px_rgba(79,70,229,.4)]">
                    🚀
                  </span>
                </div>

                <div className="mt-8 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-white/[0.08] bg-black/20 p-4">
                    <p className="text-xs font-bold text-slate-500">
                      Deine Region
                    </p>

                    <p className="mt-2 text-lg font-black">
                      Aargau
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/[0.08] bg-black/20 p-4">
                    <p className="text-xs font-bold text-slate-500">
                      Neue Leads
                    </p>

                    <p className="mt-2 text-lg font-black text-emerald-300">
                      12 verfügbar
                    </p>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  {exampleLeads.map(
                    (lead) => (
                      <div
                        key={lead.title}
                        className="group relative overflow-hidden rounded-[24px] border border-white/[0.08] bg-black/20 p-4 transition hover:border-white/[0.16]"
                      >
                        <div
                          className={[
                            "absolute inset-0 bg-gradient-to-r opacity-60",
                            lead.accent,
                          ].join(" ")}
                        />

                        <div className="relative flex items-center gap-4">
                          <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-black/30 text-xl">
                            {lead.icon}
                          </span>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-3">
                              <p className="truncate font-black">
                                {lead.title}
                              </p>

                              <span className="rounded-full bg-emerald-400/10 px-2.5 py-1 text-[10px] font-black text-emerald-300">
                                {lead.status}
                              </span>
                            </div>

                            <p className="mt-1 text-xs font-bold text-slate-500">
                              📍 {lead.region} · {lead.detail}
                            </p>
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>

                <div className="mt-5 rounded-[24px] bg-gradient-to-r from-sky-500 via-indigo-500 to-fuchsia-500 p-[1px]">
                  <div className="flex items-center justify-between rounded-[23px] bg-[#091126] px-5 py-4">
                    <div>
                      <p className="text-xs font-bold text-slate-400">
                        Neue Möglichkeiten
                      </p>

                      <p className="mt-1 font-black">
                        Passende Aufträge ansehen
                      </p>
                    </div>

                    <span className="text-2xl">
                      →
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="provider-float absolute left-[0%] top-[7%] w-[240px] rounded-[28px] border border-white/10 p-5 provider-glass">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-300">
                ● Neue Anfrage
              </p>

              <p className="mt-3 text-xl font-black">
                Kunde sucht Anbieter
              </p>

              <p className="mt-2 text-sm text-slate-400">
                In deiner Region
              </p>
            </div>

            <div className="provider-float-delayed absolute right-[-1%] top-[18%] w-[225px] rounded-[28px] border border-white/10 p-5 provider-glass">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-violet-300">
                Matching
              </p>

              <p className="mt-3 text-3xl font-black tracking-[-0.05em]">
                94 %
              </p>

              <p className="mt-2 text-sm text-slate-400">
                Passt zu deinem Profil
              </p>
            </div>

            <div className="provider-float absolute bottom-[5%] left-[4%] w-[245px] rounded-[28px] border border-white/10 p-5 provider-glass">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-sky-300">
                Region aktiv
              </p>

              <p className="mt-3 font-black">
                Zürich · Aargau · Zug
              </p>

              <div className="mt-4 flex gap-1">
                {[1, 2, 3, 4, 5].map(
                  (item) => (
                    <span
                      key={item}
                      className="h-2 flex-1 rounded-full bg-gradient-to-r from-sky-400 to-violet-500"
                    />
                  )
                )}
              </div>
            </div>

            <div className="provider-float-delayed absolute bottom-[8%] right-[2%] w-[220px] rounded-[28px] border border-white/10 p-5 provider-glass">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-yellow-300">
                ⭐ Sichtbarkeit
              </p>

              <p className="mt-3 text-xl font-black">
                Profil vollständig
              </p>

              <p className="mt-2 text-sm text-slate-400">
                Bereit für Anfragen
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="border-b border-white/[0.08] bg-[#030816]">
        <div className="mx-auto grid max-w-[1500px] grid-cols-2 gap-px bg-white/[0.08] lg:grid-cols-4">
          {trustStats.map(
            (stat) => (
              <div
                key={stat.label}
                className="bg-[#030816] px-5 py-8 text-center transition hover:bg-white/[0.035] sm:py-10"
              >
                <strong className="block text-2xl font-black tracking-[-0.05em] sm:text-3xl">
                  {stat.value}
                </strong>

                <span className="mt-1 block text-xs font-bold text-slate-500 sm:text-sm">
                  {stat.label}
                </span>
              </div>
            )
          )}
        </div>
      </section>

      {/* PROCESS */}
      <section className="relative px-5 py-28 sm:px-8 lg:px-12 lg:py-40">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_30%,rgba(14,165,233,0.1),transparent_32%),radial-gradient(circle_at_90%_70%,rgba(139,92,246,0.1),transparent_32%)]" />

        <div className="provider-page-grid absolute inset-0 opacity-15 [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)]" />

        <div className="relative mx-auto max-w-[1500px]">
          <div className="mx-auto max-w-[1000px] text-center">
            <span className="inline-flex rounded-full border border-violet-300/20 bg-violet-400/[0.06] px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-violet-200">
              So funktioniert Auftrago
            </span>

            <h2 className="mt-7 text-[3.3rem] font-black leading-[0.92] tracking-[-0.07em] sm:text-[5rem] lg:text-[6rem]">
              Registrieren.
              <span className="provider-gradient-text block">
                Aufträge entdecken.
              </span>
            </h2>

            <p className="mx-auto mt-7 max-w-[720px] text-lg font-medium leading-8 text-slate-400">
              In wenigen Schritten wird dein Unternehmen Teil des Auftrago Anbieter-Netzwerks.
            </p>
          </div>

          <div className="relative mt-20 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            <div className="absolute left-[10%] right-[10%] top-[69px] hidden h-px bg-gradient-to-r from-transparent via-sky-400/40 to-transparent xl:block" />

            {steps.map(
              (step, index) => (
                <div
                  key={step.number}
                  className="group relative min-h-[365px] overflow-hidden rounded-[34px] border border-white/[0.09] bg-[#080e20]/90 p-7 transition duration-500 hover:-translate-y-3 hover:border-sky-300/20 hover:bg-[#0a132b] sm:p-8"
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
              )
            )}
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="relative border-y border-white/[0.08] bg-[#040817] px-5 py-28 sm:px-8 lg:px-12 lg:py-40">
        <div className="provider-page-grid absolute inset-0 opacity-15" />

        <div className="relative mx-auto max-w-[1500px]">
          <div className="grid items-end gap-10 lg:grid-cols-[1fr_450px]">
            <div>
              <span className="inline-flex rounded-full border border-emerald-300/20 bg-emerald-400/[0.06] px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-emerald-200">
                Warum Auftrago?
              </span>

              <h2 className="mt-7 max-w-[950px] text-[3.3rem] font-black leading-[0.92] tracking-[-0.07em] sm:text-[5rem] lg:text-[6rem]">
                Weniger Streuverlust.
                <span className="provider-gradient-text block">
                  Mehr echte Chancen.
                </span>
              </h2>
            </div>

            <p className="text-lg font-medium leading-8 text-slate-400">
              Erreiche Menschen, die bereits aktiv nach einer passenden Firma für ihr Projekt suchen.
            </p>
          </div>

          <div className="mt-16 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {benefits.map(
              (benefit) => (
                <div
                  key={benefit.title}
                  className="provider-shine group relative min-h-[315px] overflow-hidden rounded-[34px] border border-white/[0.09] bg-[#080e20] p-7 transition duration-500 hover:-translate-y-3 hover:border-white/[0.18] hover:bg-[#0a1328] hover:shadow-[0_38px_100px_rgba(0,0,0,.45)] sm:p-8"
                >
                  <div className="absolute right-4 top-2 text-7xl font-black tracking-[-0.08em] text-white/[0.025]">
                    {benefit.number}
                  </div>

                  <div className="relative flex h-full flex-col">
                    <span className="flex h-16 w-16 items-center justify-center rounded-[22px] border border-white/10 bg-white/[0.045] text-3xl transition duration-500 group-hover:scale-110 group-hover:border-sky-300/25 group-hover:bg-sky-400/10">
                      {benefit.icon}
                    </span>

                    <div className="mt-auto pt-14">
                      <h3 className="text-2xl font-black tracking-[-0.04em]">
                        {benefit.title}
                      </h3>

                      <p className="mt-4 text-sm font-medium leading-7 text-slate-400">
                        {benefit.text}
                      </p>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* PROVIDER TYPES */}
      <section className="relative px-5 py-28 sm:px-8 lg:px-12 lg:py-40">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(99,102,241,0.1),transparent_35%)]" />

        <div className="relative mx-auto max-w-[1500px]">
          <div className="mx-auto max-w-[1000px] text-center">
            <span className="inline-flex rounded-full border border-indigo-300/20 bg-indigo-400/[0.06] px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-indigo-200">
              Für Schweizer Dienstleister
            </span>

            <h2 className="mt-7 text-[3.3rem] font-black leading-[0.92] tracking-[-0.07em] sm:text-[5rem] lg:text-[6rem]">
              Deine Branche.
              <span className="provider-gradient-text block">
                Deine Kundenanfragen.
              </span>
            </h2>

            <p className="mx-auto mt-7 max-w-[760px] text-lg font-medium leading-8 text-slate-400">
              Auftrago verbindet Unternehmen aus zahlreichen Dienstleistungsbereichen mit neuen Auftraggebern.
            </p>
          </div>

          <div className="mt-16 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {providerTypes.map(
              ([icon, title], index) => (
                <a
                  key={title}
                  href="#anbieter-formular"
                  className="group relative min-h-[175px] overflow-hidden rounded-[28px] border border-white/[0.08] bg-[#080d1d] p-5 transition duration-400 hover:-translate-y-2 hover:border-sky-300/25 hover:bg-[#0b1429] hover:shadow-[0_28px_75px_rgba(0,0,0,.35)]"
                >
                  <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-sky-400/[0.05] blur-2xl transition group-hover:bg-sky-400/12" />

                  <div className="relative flex h-full flex-col justify-between">
                    <div className="flex items-start justify-between">
                      <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/[0.09] bg-black/20 text-xl transition duration-300 group-hover:scale-110">
                        {icon}
                      </span>

                      <span className="text-[10px] font-black tracking-[0.17em] text-white/[0.1]">
                        {String(index + 1).padStart(
                          2,
                          "0"
                        )}
                      </span>
                    </div>

                    <div className="mt-8 flex items-center justify-between gap-4">
                      <h3 className="font-black tracking-[-0.02em]">
                        {title}
                      </h3>

                      <span className="text-sky-300 transition group-hover:translate-x-1">
                        →
                      </span>
                    </div>
                  </div>
                </a>
              )
            )}
          </div>
        </div>
      </section>

      {/* REGIONS */}
      <section className="relative border-y border-white/[0.08] bg-[#040817] px-5 py-28 sm:px-8 lg:px-12 lg:py-36">
        <div className="provider-page-grid absolute inset-0 opacity-15" />

        <div className="relative mx-auto grid max-w-[1500px] gap-14 lg:grid-cols-[.78fr_1.22fr] lg:items-center">
          <div>
            <span className="inline-flex rounded-full border border-sky-300/20 bg-sky-400/[0.06] px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-sky-200">
              Deine Einsatzgebiete
            </span>

            <h2 className="mt-7 text-[3.3rem] font-black leading-[0.93] tracking-[-0.07em] sm:text-[4.8rem]">
              Dort sichtbar,
              <span className="provider-gradient-text block">
                wo du arbeitest.
              </span>
            </h2>

            <p className="mt-7 max-w-[580px] text-lg font-medium leading-8 text-slate-400">
              Wähle deine Regionen und konzentriere dich auf Kundenanfragen, die geografisch zu deinem Betrieb passen.
            </p>

            <a
              href="#anbieter-formular"
              className="mt-9 inline-flex min-h-[58px] items-center justify-center rounded-2xl bg-white px-7 font-black text-[#050917] transition hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(255,255,255,.15)]"
            >
              Regionen jetzt festlegen
            </a>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {regions.map(
              (region, index) => (
                <a
                  key={region}
                  href="#anbieter-formular"
                  className="group flex min-h-[105px] items-center justify-between rounded-[24px] border border-white/[0.08] bg-white/[0.025] p-5 transition duration-300 hover:-translate-y-1 hover:border-sky-300/20 hover:bg-sky-400/[0.06]"
                >
                  <div>
                    <span className="text-[10px] font-black tracking-[0.18em] text-slate-600">
                      REGION
                    </span>

                    <p className="mt-2 font-black">
                      {region}
                    </p>
                  </div>

                  <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-sky-300 transition group-hover:translate-x-1">
                    →
                  </span>

                  <span className="absolute hidden">
                    {index}
                  </span>
                </a>
              )
            )}
          </div>
        </div>
      </section>

      {/* REGISTRATION FORM */}
      <section
        id="anbieter-formular"
        className="relative scroll-mt-24 px-5 py-28 sm:px-8 lg:px-12 lg:py-40"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(14,165,233,0.12),transparent_34%),radial-gradient(circle_at_90%_85%,rgba(168,85,247,0.12),transparent_34%)]" />

        <div className="relative mx-auto max-w-[1500px]">
          <div className="grid gap-12 lg:grid-cols-[.72fr_1.28fr] lg:items-start">
            <div className="lg:sticky lg:top-28">
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-400/[0.06] px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-emerald-200">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />

                Kostenlose Registrierung
              </span>

              <h2 className="mt-7 text-[3.4rem] font-black leading-[0.91] tracking-[-0.075em] sm:text-[5rem]">
                Bereit für
                <span className="provider-gradient-text block">
                  neue Aufträge?
                </span>
              </h2>

              <p className="mt-7 max-w-[580px] text-lg font-medium leading-8 text-slate-400">
                Trage deine Firma ein. Nach der Prüfung erhältst du Zugang zum Anbieterportal und kannst passende Kundenanfragen entdecken.
              </p>

              <div className="mt-10 space-y-3">
                {[
                  "Firmendaten eintragen",
                  "Dienstleistungen auswählen",
                  "Einsatzgebiete festlegen",
                  "Anbieterprofil prüfen lassen",
                ].map(
                  (item, index) => (
                    <div
                      key={item}
                      className="flex items-center gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-sky-300/20 bg-sky-400/10 text-xs font-black text-sky-300">
                        {String(index + 1).padStart(
                          2,
                          "0"
                        )}
                      </span>

                      <span className="text-sm font-black text-slate-300">
                        {item}
                      </span>
                    </div>
                  )
                )}
              </div>

              <div className="mt-8 rounded-[26px] border border-violet-300/15 bg-gradient-to-br from-violet-400/[0.09] to-sky-400/[0.05] p-5">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-violet-300">
                  Persönliche Prüfung
                </p>

                <p className="mt-3 text-sm font-medium leading-7 text-slate-400">
                  Dein Anbieterprofil wird vor der Freischaltung geprüft. Dadurch bleibt das Auftrago Netzwerk professionell und vertrauenswürdig.
                </p>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[42px] border border-white/[0.1] bg-[#081020] p-5 shadow-[0_45px_140px_rgba(0,0,0,.5)] sm:p-8 lg:p-10">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(56,189,248,0.16),transparent_32%),radial-gradient(circle_at_100%_100%,rgba(168,85,247,0.14),transparent_34%)]" />

              <div className="provider-page-grid absolute inset-0 opacity-15" />

              <div className="relative">
                <div className="mb-8 flex flex-col gap-5 border-b border-white/[0.08] pb-7 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-sky-300">
                      Anbieterprofil
                    </p>

                    <h3 className="mt-2 text-3xl font-black tracking-[-0.045em]">
                      Firma eintragen
                    </h3>
                  </div>

                  <div className="flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-400/10 px-3 py-2 text-xs font-black text-emerald-300">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />

                    Sicheres Formular
                  </div>
                </div>

                <AnbieterRegistrierenForm />

                <div className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 border-t border-white/[0.08] pt-6 text-xs font-bold text-slate-500">
                  <span>
                    🔒 Sichere Übermittlung
                  </span>

                  <span>
                    ✓ Kostenlose Registrierung
                  </span>

                  <span>
                    🇨🇭 Schweizer Plattform
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="relative border-y border-white/[0.08] bg-[#040817] px-5 py-28 sm:px-8 lg:px-12 lg:py-40">
        <div className="provider-page-grid absolute inset-0 opacity-15" />

        <div className="relative mx-auto grid max-w-[1500px] gap-14 lg:grid-cols-[.7fr_1.3fr]">
          <div>
            <span className="inline-flex rounded-full border border-sky-300/20 bg-sky-400/[0.06] px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-sky-200">
              Anbieter FAQ
            </span>

            <h2 className="mt-7 text-[3.3rem] font-black leading-[0.92] tracking-[-0.07em] sm:text-[4.8rem]">
              Noch Fragen?
              <span className="provider-gradient-text block">
                Hier sind Antworten.
              </span>
            </h2>

            <p className="mt-7 max-w-md text-lg font-medium leading-8 text-slate-400">
              Die wichtigsten Informationen rund um Registrierung, Freischaltung und Kundenanfragen.
            </p>

            <a
              href="#anbieter-formular"
              className="mt-9 inline-flex min-h-[58px] items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] px-7 font-black transition hover:-translate-y-1 hover:border-sky-300/25"
            >
              Firma jetzt eintragen
            </a>
          </div>

          <div className="provider-faq space-y-3">
            {faqs.map(
              (faq, index) => (
                <details
                  key={faq.question}
                  className="group overflow-hidden rounded-[26px] border border-white/[0.085] bg-white/[0.025] transition open:border-sky-300/20 open:bg-white/[0.045]"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-5 px-5 py-5 sm:px-7 sm:py-6">
                    <div className="flex items-center gap-4">
                      <span className="text-xs font-black tracking-[0.12em] text-sky-300">
                        {String(index + 1).padStart(
                          2,
                          "0"
                        )}
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
              )
            )}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
        <div className="relative mx-auto max-w-[1500px] overflow-hidden rounded-[50px] border border-white/10 bg-[#080e21] px-6 py-24 text-center shadow-[0_55px_170px_rgba(0,0,0,.55)] sm:px-12 lg:py-36">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_10%,rgba(56,189,248,0.25),transparent_35%),radial-gradient(circle_at_90%_90%,rgba(192,55,255,0.24),transparent_35%)]" />

          <div className="provider-page-grid absolute inset-0 opacity-25" />

          <div className="provider-rotate absolute left-1/2 top-1/2 h-[820px] w-[820px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-white/[0.045]" />

          <div className="relative mx-auto max-w-[1100px]">
            <span className="inline-flex items-center gap-3 rounded-full border border-emerald-300/20 bg-emerald-400/[0.07] px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-emerald-200">
              <span className="relative flex h-2 w-2">
                <span className="provider-pulse absolute inline-flex h-full w-full rounded-full bg-emerald-400" />

                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>

              Jetzt Anbieter werden
            </span>

            <h2 className="mt-8 text-[3.5rem] font-black leading-[0.88] tracking-[-0.075em] sm:text-[5.7rem] lg:text-[7.2rem]">
              Kunden suchen.
              <span className="provider-gradient-text block">
                Dein Betrieb liefert.
              </span>
            </h2>

            <p className="mx-auto mt-8 max-w-[790px] text-lg font-medium leading-8 text-slate-300 sm:text-xl">
              Registriere deine Firma kostenlos und werde Teil des Schweizer Auftrago Anbieter-Netzwerks.
            </p>

            <div className="mt-11 flex flex-col justify-center gap-4 sm:flex-row">
              <a
                href="#anbieter-formular"
                className="group inline-flex min-h-[66px] items-center justify-center rounded-2xl bg-gradient-to-r from-sky-400 via-indigo-500 to-fuchsia-500 px-9 text-base font-black shadow-[0_27px_90px_rgba(82,73,255,.48)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_38px_110px_rgba(82,73,255,.65)]"
              >
                Firma kostenlos registrieren

                <span className="ml-3 text-xl transition group-hover:translate-x-1">
                  →
                </span>
              </a>

              <Link
                href="/login"
                className="inline-flex min-h-[66px] items-center justify-center rounded-2xl border border-white/15 bg-white/[0.055] px-9 text-base font-black backdrop-blur-xl transition hover:-translate-y-1 hover:border-white/25 hover:bg-white/[0.085]"
              >
                Zum Anbieter-Login
              </Link>
            </div>

            <div className="mt-9 flex flex-wrap justify-center gap-x-8 gap-y-3 text-xs font-bold text-slate-500 sm:text-sm">
              <span>
                ✓ Kostenlos registrieren
              </span>

              <span>
                ✓ Regionen selbst wählen
              </span>

              <span>
                ✓ Passende Anfragen
              </span>

              <span>
                ✓ Schweizer Plattform
              </span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
