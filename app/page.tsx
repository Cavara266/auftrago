"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    city: "",
    category: "Hauswartung",
    description: "",
    website: "",
  });

  const [formStartedAt, setFormStartedAt] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setFormStartedAt(Date.now());
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/anfrage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          formStartedAt,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.error || "Anfrage konnte nicht gesendet werden.");
        return;
      }

      router.push("/danke");
    } catch {
      setError("Serverfehler. Bitte später nochmals versuchen.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#030816] text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-20%] top-[-10%] h-[280px] w-[280px] rounded-full bg-cyan-400/12 blur-3xl sm:left-[-10%] sm:h-[420px] sm:w-[420px]" />
        <div className="absolute right-[-20%] top-[8%] h-[300px] w-[300px] rounded-full bg-sky-400/10 blur-3xl sm:right-[-10%] sm:h-[460px] sm:w-[460px]" />
        <div className="absolute bottom-[-10%] left-[10%] h-[260px] w-[260px] rounded-full bg-blue-500/10 blur-3xl sm:left-[20%] sm:h-[380px] sm:w-[380px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(126,200,255,0.08),transparent_35%),linear-gradient(to_bottom,rgba(255,255,255,0.02),transparent)]" />
      </div>

      <section className="relative border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 pb-10 pt-5 sm:px-6 sm:pb-12 sm:pt-8 lg:px-8">
          <div className="mb-6 sm:mb-10">
            <div className="flex items-center justify-between gap-3">
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
                  href="/leistungen"
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white/80 transition hover:bg-white/10"
                >
                  Leistungen
                </Link>
                <Link
                  href="/partner"
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white/80 transition hover:bg-white/10"
                >
                  Anbieter werden
                </Link>
                <Link
                  href="/anfrage"
                  className="rounded-2xl border border-[#7EC8FF]/30 bg-[#7EC8FF]/15 px-4 py-3 text-sm font-semibold text-[#bfe7ff] transition hover:bg-[#7EC8FF]/20"
                >
                  Anfrage senden
                </Link>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 md:hidden">
              <Link
                href="/anfrage"
                className="inline-flex min-h-[48px] items-center justify-center rounded-2xl border border-[#7EC8FF]/30 bg-[#7EC8FF]/15 px-4 py-3 text-center text-sm font-semibold text-[#d8f3ff] transition hover:bg-[#7EC8FF]/20"
              >
                Anfrage senden
              </Link>

              <Link
                href="/partner"
                className="inline-flex min-h-[48px] items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-center text-sm font-semibold text-white/90 transition hover:bg-white/10"
              >
                Anbieter werden
              </Link>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-10">
            <div>
              <div className="inline-flex max-w-full items-start gap-3 rounded-[24px] border border-white/10 bg-white/5 px-4 py-3 text-left backdrop-blur sm:items-center sm:gap-2 sm:rounded-full sm:px-4 sm:py-2.5">
                <span className="mt-1 inline-block h-2.5 w-2.5 shrink-0 rounded-full bg-[#7EC8FF] sm:mt-0 sm:h-2 sm:w-2" />
                <span className="text-[11px] uppercase leading-relaxed tracking-[0.16em] text-white/60 sm:text-xs sm:tracking-[0.22em]">
                  Premium Vermittlung für Reinigung, Umzug, Transport & Services
                </span>
              </div>

              <h1 className="mt-5 max-w-4xl text-3xl font-semibold leading-[1.02] sm:mt-6 sm:text-4xl md:text-6xl xl:text-7xl">
                Die schönste Art,{" "}
                <span className="bg-gradient-to-r from-white via-[#d7f0ff] to-[#7EC8FF] bg-clip-text text-transparent">
                  Offerten für Reinigung, Hauswartung, Umzug, Transport und
                  Entsorgung
                </span>{" "}
                in der Schweiz anzufragen.
              </h1>

              <p className="mt-5 max-w-3xl text-base leading-7 text-white/72 sm:mt-6 sm:text-lg sm:leading-8 md:text-xl">
                Mit <strong className="font-semibold text-white">Auftrago</strong>{" "}
                senden Privatpersonen, Verwaltungen und Unternehmen ihre Anfrage
                in wenigen Sekunden. Passende Anbieter sehen qualifizierte Leads,
                schalten Kontakte frei und übernehmen den Auftrag direkt. Schnell,
                modern und auf Conversion gebaut.
              </p>

              <p className="mt-4 max-w-3xl text-sm leading-7 text-white/55 sm:text-base sm:leading-8 md:text-lg">
                Egal ob Büroreinigung in Zürich, Hauswartung in Aargau, Umzug in
                Basel, Transport in Bern oder Entsorgung in Zug – Auftrago
                verbindet Nachfrage und Angebot in einem klaren, professionellen
                System.
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap sm:gap-4">
                <a
                  href="#anfrage-formular"
                  className="inline-flex min-h-[54px] w-full items-center justify-center rounded-2xl bg-[#7EC8FF] px-6 py-4 text-center text-base font-semibold text-[#04101d] shadow-[0_20px_80px_rgba(126,200,255,0.28)] transition hover:scale-[1.01] hover:bg-[#91d2ff] sm:w-auto sm:px-7"
                >
                  Jetzt kostenlos Offerte anfragen
                </a>

                <Link
                  href="/partner"
                  className="inline-flex min-h-[54px] w-full items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-center text-base font-semibold text-white/90 backdrop-blur transition hover:bg-white/10 sm:w-auto sm:px-7"
                >
                  Anbieter werden
                </Link>

                <Link
                  href="/register"
                  className="inline-flex min-h-[54px] w-full items-center justify-center rounded-2xl border border-[#7EC8FF]/30 bg-[#7EC8FF]/10 px-6 py-4 text-center text-base font-semibold text-[#cbeeff] backdrop-blur transition hover:bg-[#7EC8FF]/15 sm:w-auto sm:px-7"
                >
                  Firma registrieren
                </Link>
              </div>

              <div className="mt-8 grid gap-4 sm:mt-10 sm:grid-cols-3">
                <div className="rounded-[26px] border border-white/10 bg-white/5 p-5 backdrop-blur">
                  <div className="text-2xl font-semibold text-white sm:text-3xl">
                    24h
                  </div>
                  <div className="mt-2 text-sm leading-6 text-white/60">
                    Schnell Anfragen senden und passende Anbieter erreichen.
                  </div>
                </div>

                <div className="rounded-[26px] border border-white/10 bg-white/5 p-5 backdrop-blur">
                  <div className="text-2xl font-semibold text-white sm:text-3xl">
                    100%
                  </div>
                  <div className="mt-2 text-sm leading-6 text-white/60">
                    Kostenlos für Kunden, einfach und ohne komplizierten Prozess.
                  </div>
                </div>

                <div className="rounded-[26px] border border-white/10 bg-white/5 p-5 backdrop-blur">
                  <div className="text-2xl font-semibold text-white sm:text-3xl">
                    Firmen
                  </div>
                  <div className="mt-2 text-sm leading-6 text-white/60">
                    Anbieter können sich registrieren und neue Leads gewinnen.
                  </div>
                </div>
              </div>

              <div className="mt-7 flex flex-wrap gap-2.5 text-sm text-white/55 sm:mt-8 sm:gap-3">
                {[
                  "Hauswartung",
                  "Büroreinigung",
                  "Treppenhausreinigung",
                  "Umzugsreinigung",
                  "Gartenpflege",
                  "Umzug",
                  "Transport",
                  "Entsorgung",
                ].map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-white/10 bg-white/5 px-3.5 py-2 backdrop-blur sm:px-4"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div
              id="anfrage-formular"
              className="relative rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.10),rgba(255,255,255,0.04))] p-4 shadow-[0_25px_120px_rgba(0,0,0,0.35)] backdrop-blur-2xl sm:rounded-[32px] sm:p-6 md:p-7"
            >
              <div className="absolute inset-0 rounded-[28px] bg-[radial-gradient(circle_at_top,rgba(126,200,255,0.12),transparent_45%)] sm:rounded-[32px]" />

              <div className="relative">
                <div className="inline-flex rounded-full border border-[#7EC8FF]/25 bg-[#7EC8FF]/10 px-4 py-2 text-[11px] font-medium uppercase tracking-[0.18em] text-[#c7ebff] sm:text-xs sm:tracking-[0.22em]">
                  Kostenlose Anfrage
                </div>

                <h2 className="mt-4 text-2xl font-semibold leading-tight sm:text-3xl">
                  In 1 Minute eine professionelle Anfrage senden
                </h2>

                <p className="mt-3 text-sm leading-7 text-white/62 md:text-base">
                  Je klarer deine Anfrage, desto besser die passende Offerte.
                  Beschreibe kurz den Auftrag, den Ort und die gewünschte
                  Leistung.
                </p>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  <div className="hidden" aria-hidden="true">
                    <label htmlFor="website">Website</label>
                    <input
                      id="website"
                      name="website"
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      value={form.website}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          website: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm text-white/70">
                      Name
                    </label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, name: e.target.value }))
                      }
                      className="w-full rounded-2xl border border-white/10 bg-[#0b1328]/80 px-4 py-3.5 text-white outline-none placeholder:text-white/25 focus:border-[#7EC8FF]/50"
                      placeholder="Max Muster"
                      required
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm text-white/70">
                        Telefon
                      </label>
                      <input
                        type="text"
                        value={form.phone}
                        onChange={(e) =>
                          setForm((prev) => ({ ...prev, phone: e.target.value }))
                        }
                        className="w-full rounded-2xl border border-white/10 bg-[#0b1328]/80 px-4 py-3.5 text-white outline-none placeholder:text-white/25 focus:border-[#7EC8FF]/50"
                        placeholder="079 123 45 67"
                        required
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm text-white/70">
                        E-Mail
                      </label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) =>
                          setForm((prev) => ({ ...prev, email: e.target.value }))
                        }
                        className="w-full rounded-2xl border border-white/10 bg-[#0b1328]/80 px-4 py-3.5 text-white outline-none placeholder:text-white/25 focus:border-[#7EC8FF]/50"
                        placeholder="name@email.ch"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm text-white/70">
                        Stadt / Region
                      </label>
                      <input
                        type="text"
                        value={form.city}
                        onChange={(e) =>
                          setForm((prev) => ({ ...prev, city: e.target.value }))
                        }
                        className="w-full rounded-2xl border border-white/10 bg-[#0b1328]/80 px-4 py-3.5 text-white outline-none placeholder:text-white/25 focus:border-[#7EC8FF]/50"
                        placeholder="Zürich"
                        required
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm text-white/70">
                        Kategorie
                      </label>
                      <select
                        value={form.category}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            category: e.target.value,
                          }))
                        }
                        className="w-full rounded-2xl border border-white/10 bg-[#0b1328]/80 px-4 py-3.5 text-white outline-none focus:border-[#7EC8FF]/50"
                      >
                        <option value="Hauswartung">Hauswartung</option>
                        <option value="Reinigung">Reinigung</option>
                        <option value="Büroreinigung">Büroreinigung</option>
                        <option value="Treppenhausreinigung">
                          Treppenhausreinigung
                        </option>
                        <option value="Umzugsreinigung">Umzugsreinigung</option>
                        <option value="Gartenpflege">Gartenpflege</option>
                        <option value="Umzug">Umzug</option>
                        <option value="Transport">Transport</option>
                        <option value="Entsorgung">Entsorgung</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm text-white/70">
                      Beschreibung
                    </label>
                    <textarea
                      value={form.description}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      className="min-h-[140px] w-full rounded-2xl border border-white/10 bg-[#0b1328]/80 px-4 py-3.5 text-white outline-none placeholder:text-white/25 focus:border-[#7EC8FF]/50 sm:min-h-[160px]"
                      placeholder="Zum Beispiel: Wir suchen einen zuverlässigen Umzug inkl. Transport von Aarau nach Zürich oder eine schnelle Entsorgung von Möbeln und Sperrgut."
                      required
                    />
                  </div>

                  {error ? (
                    <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                      {error}
                    </div>
                  ) : null}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-[22px] bg-[#7EC8FF] px-5 py-4 text-base font-semibold text-[#04101d] shadow-[0_20px_80px_rgba(126,200,255,0.30)] transition hover:bg-[#91d2ff] disabled:cursor-not-allowed disabled:opacity-60 sm:text-lg"
                  >
                    {loading ? "Wird gesendet..." : "Kostenlos Anfrage senden"}
                  </button>

                  <p className="text-center text-xs leading-6 text-white/42">
                    Kostenlos für Kunden. Unverbindlich. Schnell. Lokal.
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="max-w-3xl">
          <div className="text-xs uppercase tracking-[0.18em] text-white/45 sm:text-sm sm:tracking-[0.24em]">
            Warum Auftrago
          </div>
          <h2 className="mt-4 text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl">
            Ein Lead-Marktplatz, der nicht billig wirkt – sondern stark verkauft.
          </h2>
          <p className="mt-5 max-w-3xl text-base leading-7 text-white/68 sm:text-lg sm:leading-8">
            Auftrago ist nicht einfach nur ein Formular. Es ist eine moderne
            Vermittlungsplattform für lokale Dienstleistungen. Kunden stellen
            Anfragen schnell und unkompliziert. Anbieter sehen strukturierte,
            hochwertige Leads und können Kontakte gezielt freischalten.
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:mt-10 md:grid-cols-2 xl:grid-cols-4">
          {[
            {
              title: "Mehr Vertrauen",
              text: "Klares Premium-Design, saubere Struktur und ein deutlich professioneller Auftritt für Kunden und Firmen.",
            },
            {
              title: "Mehr Anfragen",
              text: "Ein starkes Formular mit gutem Text erhöht die Conversion und reduziert unnötige Absprünge.",
            },
            {
              title: "Mehr Qualität",
              text: "Leads werden sauber beschrieben und wirken wertiger für Anbieter, die Credits einsetzen.",
            },
            {
              title: "Mehr Wachstum",
              text: "Perfekte Basis für SEO-Landingpages, Google Ads, Städte-Seiten und spätere Automatisierungen.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-[24px] border border-white/10 bg-white/5 p-5 backdrop-blur sm:rounded-[28px] sm:p-6"
            >
              <h3 className="text-xl font-semibold">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-white/62">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-white/10 bg-white/[0.03]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <div className="max-w-3xl">
            <div className="text-xs uppercase tracking-[0.18em] text-white/45 sm:text-sm sm:tracking-[0.24em]">
              Für Anbieter
            </div>
            <h2 className="mt-4 text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl">
              Firmen können sich registrieren und neue Leads gewinnen
            </h2>
            <p className="mt-5 text-base leading-7 text-white/66 sm:text-lg sm:leading-8">
              Auftrago ist nicht nur für Kunden gedacht. Dienstleister und
              Unternehmen können sich als Anbieter registrieren, Credits kaufen,
              Leads einsehen und passende Kontakte direkt freischalten.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:mt-10 md:grid-cols-3">
            {[
              {
                title: "Registrieren",
                text: "Firmen erstellen ein Konto und richten ihr Profil für ihre Region und Dienstleistungen ein.",
              },
              {
                title: "Credits aufladen",
                text: "Anbieter laden Credits auf und entscheiden flexibel, welche Leads für sie interessant sind.",
              },
              {
                title: "Aufträge gewinnen",
                text: "Nach der Freischaltung sehen Anbieter die Kontaktdaten und können direkt reagieren.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-[24px] border border-white/10 bg-[#081122]/85 p-5 sm:rounded-[28px] sm:p-6"
              >
                <h3 className="text-xl font-semibold">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-white/62 sm:text-base sm:leading-8">
                  {item.text}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link
              href="/partner"
              className="inline-flex min-h-[54px] items-center justify-center rounded-2xl bg-[#7EC8FF] px-6 py-4 text-base font-semibold text-[#04101d] shadow-[0_20px_80px_rgba(126,200,255,0.28)] transition hover:bg-[#91d2ff]"
            >
              Anbieter werden
            </Link>

            <Link
              href="/register"
              className="inline-flex min-h-[54px] items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-base font-semibold text-white/90 transition hover:bg-white/10"
            >
              Firma registrieren
            </Link>

            <Link
              href="/preise"
              className="inline-flex min-h-[54px] items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-base font-semibold text-white/90 transition hover:bg-white/10"
            >
              Credits & Preise
            </Link>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-white/[0.03]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <div className="max-w-3xl">
            <div className="text-xs uppercase tracking-[0.18em] text-white/45 sm:text-sm sm:tracking-[0.24em]">
              Leistungen
            </div>
            <h2 className="mt-4 text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl">
              Für Reinigung, Hauswartung, Umzug, Transport und Entsorgung gebaut
            </h2>
            <p className="mt-5 text-base leading-7 text-white/66 sm:text-lg sm:leading-8">
              Auftrago eignet sich perfekt für wiederkehrende Dienstleistungen,
              Objektbetreuung, Umzüge, Transporte und Offerten-Anfragen im
              Immobilien- und Servicebereich.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:mt-10 md:grid-cols-2 xl:grid-cols-3">
            {[
              {
                title: "Hauswartung",
                text: "Regelmässige Betreuung von Liegenschaften, Kontrollgänge, technische Checks und Unterhaltsarbeiten.",
              },
              {
                title: "Büroreinigung",
                text: "Saubere Arbeitsplätze, gepflegte Kundenbereiche und flexible Reinigungsintervalle für Büros und Praxen.",
              },
              {
                title: "Treppenhausreinigung",
                text: "Ideal für Mehrfamilienhäuser, Verwaltungen und gemeinschaftliche Eingangs- und Treppenbereiche.",
              },
              {
                title: "Umzugsreinigung",
                text: "Schnelle und klar beschriebene Leads für Endreinigung, Übergabe und professionelle Wohnungsabgabe.",
              },
              {
                title: "Gartenpflege",
                text: "Aussenbereiche, Hecken, Rabatten, Grünflächen und saisonale Pflegearbeiten für private und gewerbliche Objekte.",
              },
              {
                title: "Umzug",
                text: "Leads für Privatumzüge, Firmenumzüge, Ein- und Auszüge sowie komplette Umzugsservices in der ganzen Schweiz.",
              },
              {
                title: "Transport",
                text: "Passend für Kleintransporte, Möbeltransporte, Kurierfahrten und flexible Transporte von A nach B.",
              },
              {
                title: "Entsorgung",
                text: "Ideal für Sperrgut, Räumungen, Wohnungsauflösungen, Kellerleerungen und fachgerechte Entsorgungsaufträge.",
              },
              {
                title: "Spezialaufträge",
                text: "Individuelle Anfragen für Sonderreinigungen, Objektservices, Einsätze auf Abruf und wiederkehrende Aufgaben.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-[24px] border border-white/10 bg-[#081122]/85 p-5 sm:rounded-[28px] sm:p-7"
              >
                <div className="mb-4 inline-flex rounded-full border border-[#7EC8FF]/20 bg-[#7EC8FF]/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-[#cdeeff] sm:text-xs sm:tracking-[0.22em]">
                  Service
                </div>
                <h3 className="text-xl font-semibold sm:text-2xl">{item.title}</h3>
                <p className="mt-4 text-sm leading-7 text-white/62 sm:text-base sm:leading-8">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="max-w-3xl">
          <div className="text-xs uppercase tracking-[0.18em] text-white/45 sm:text-sm sm:tracking-[0.24em]">
            So funktioniert es
          </div>
          <h2 className="mt-4 text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl">
            In 3 klaren Schritten zur passenden Offerte
          </h2>
        </div>

        <div className="mt-8 grid gap-4 sm:mt-10 md:grid-cols-3">
          {[
            {
              step: "01",
              title: "Anfrage senden",
              text: "Kunden beschreiben ihren Auftrag, den Ort und die gewünschte Leistung. Je klarer die Anfrage, desto besser die spätere Offerte.",
            },
            {
              step: "02",
              title: "Passende Anbieter finden",
              text: "Die Anfrage landet im System und kann von relevanten Firmen eingesehen und freigeschaltet werden.",
            },
            {
              step: "03",
              title: "Kontakt & Offerte",
              text: "Nach der Freischaltung sieht der Anbieter die Kontaktdaten und kann direkt ein Angebot abgeben oder Rückfragen stellen.",
            },
          ].map((item) => (
            <div
              key={item.step}
              className="rounded-[24px] border border-white/10 bg-white/5 p-5 backdrop-blur sm:rounded-[30px] sm:p-7"
            >
              <div className="text-sm font-medium tracking-[0.16em] text-[#9fd8ff] sm:tracking-[0.18em]">
                {item.step}
              </div>
              <h3 className="mt-3 text-xl font-semibold sm:text-2xl">
                {item.title}
              </h3>
              <p className="mt-4 text-sm leading-7 text-white/62 sm:text-base sm:leading-8">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="rounded-[28px] border border-white/10 bg-[linear-gradient(135deg,rgba(126,200,255,0.18),rgba(255,255,255,0.04))] p-5 sm:rounded-[34px] sm:p-8 md:p-10">
          <div className="max-w-3xl">
            <div className="text-xs uppercase tracking-[0.18em] text-white/50 sm:text-sm sm:tracking-[0.24em]">
              Regionen
            </div>
            <h2 className="mt-4 text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl">
              Stark für Zürich, Aargau und die ganze Schweiz
            </h2>
            <p className="mt-5 text-base leading-7 text-white/68 sm:text-lg sm:leading-8">
              Auftrago ist ideal für lokale Lead-Generierung in Regionen mit
              hoher Nachfrage. Das System eignet sich hervorragend für
              SEO-Landingpages, Städte-Kombinationen und regionale Kampagnen.
            </p>
          </div>

          <div className="mt-7 flex flex-wrap gap-2.5 sm:mt-8 sm:gap-3">
            {[
              "Zürich",
              "Aargau",
              "Basel",
              "Bern",
              "Luzern",
              "Zug",
              "Winterthur",
              "Aarau",
              "Baden",
              "Schweiz",
            ].map((city) => (
              <span
                key={city}
                className="rounded-full border border-white/10 bg-white/10 px-3.5 py-2 text-sm text-white/85 sm:px-4"
              >
                {city}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 sm:pb-24 lg:px-8">
        <div className="rounded-[28px] border border-white/10 bg-white/5 p-5 text-center backdrop-blur sm:rounded-[34px] sm:p-8 md:p-12">
          <div className="text-xs uppercase tracking-[0.18em] text-white/45 sm:text-sm sm:tracking-[0.24em]">
            Jetzt starten
          </div>
          <h2 className="mt-4 text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl">
            Kostenlos Anfrage senden oder als Firma neue Leads erhalten
          </h2>
          <p className="mx-auto mt-5 max-w-3xl text-base leading-7 text-white/66 sm:text-lg sm:leading-8">
            Kunden können kostenlos eine Anfrage senden. Firmen können sich
            registrieren, Credits nutzen und neue Aufträge direkt über die
            Plattform gewinnen.
          </p>

          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:mt-8 sm:flex-row sm:flex-wrap sm:gap-4">
            <a
              href="#anfrage-formular"
              className="inline-flex min-h-[54px] w-full items-center justify-center rounded-2xl bg-[#7EC8FF] px-6 py-4 text-base font-semibold text-[#04101d] shadow-[0_20px_80px_rgba(126,200,255,0.28)] transition hover:bg-[#91d2ff] sm:w-auto sm:px-7"
            >
              Anfrage jetzt starten
            </a>

            <Link
              href="/partner"
              className="inline-flex min-h-[54px] w-full items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-base font-semibold text-white/90 transition hover:bg-white/10 sm:w-auto sm:px-7"
            >
              Anbieter werden
            </Link>

            <Link
              href="/register"
              className="inline-flex min-h-[54px] w-full items-center justify-center rounded-2xl border border-[#7EC8FF]/30 bg-[#7EC8FF]/10 px-6 py-4 text-base font-semibold text-[#cbeeff] transition hover:bg-[#7EC8FF]/15 sm:w-auto sm:px-7"
            >
              Firma registrieren
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}