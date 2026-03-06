"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
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
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
        body: JSON.stringify(form),
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
        <div className="absolute left-[-10%] top-[-10%] h-[420px] w-[420px] rounded-full bg-cyan-400/12 blur-3xl" />
        <div className="absolute right-[-10%] top-[10%] h-[460px] w-[460px] rounded-full bg-sky-400/10 blur-3xl" />
        <div className="absolute bottom-[-10%] left-[20%] h-[380px] w-[380px] rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(126,200,255,0.08),transparent_35%),linear-gradient(to_bottom,rgba(255,255,255,0.02),transparent)]" />
      </div>

      <section className="relative border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 pb-12 pt-8">
          <div className="mb-8 flex items-center justify-between">
            <Link
              href="/"
              className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-5 py-3 backdrop-blur"
            >
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#7EC8FF]" />
              <span className="text-sm font-semibold uppercase tracking-[0.28em] text-white/80">
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
                href="/anfrage"
                className="rounded-2xl border border-[#7EC8FF]/30 bg-[#7EC8FF]/15 px-4 py-3 text-sm font-semibold text-[#bfe7ff] transition hover:bg-[#7EC8FF]/20"
              >
                Anfrage senden
              </Link>
            </div>
          </div>

          <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div>
              <div className="inline-flex flex-wrap items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.22em] text-white/60 backdrop-blur">
                <span className="inline-block h-2 w-2 rounded-full bg-[#7EC8FF]" />
                Premium Vermittlung für Reinigung, Umzug, Transport & Services
              </div>

              <h1 className="mt-6 max-w-4xl text-4xl font-semibold leading-[1.02] md:text-6xl xl:text-7xl">
                Die schönste Art,{" "}
                <span className="bg-gradient-to-r from-white via-[#d7f0ff] to-[#7EC8FF] bg-clip-text text-transparent">
                  Offerten für Reinigung, Hauswartung, Umzug, Transport und Entsorgung
                </span>{" "}
                in der Schweiz anzufragen.
              </h1>

              <p className="mt-6 max-w-3xl text-lg leading-8 text-white/72 md:text-xl">
                Mit <strong className="font-semibold text-white">Auftrago</strong>{" "}
                senden Privatpersonen, Verwaltungen und Unternehmen ihre Anfrage
                in wenigen Sekunden. Passende Anbieter sehen qualifizierte Leads,
                schalten Kontakte frei und übernehmen den Auftrag direkt. Schnell,
                modern und auf Conversion gebaut.
              </p>

              <p className="mt-4 max-w-3xl text-base leading-8 text-white/55 md:text-lg">
                Egal ob Büroreinigung in Zürich, Hauswartung in Aargau, Umzug in
                Basel, Transport in Bern oder Entsorgung in Zug – Auftrago
                verbindet Nachfrage und Angebot in einem klaren, professionellen
                System.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href="#anfrage-formular"
                  className="rounded-2xl bg-[#7EC8FF] px-7 py-4 text-base font-semibold text-[#04101d] shadow-[0_20px_80px_rgba(126,200,255,0.28)] transition hover:scale-[1.01] hover:bg-[#91d2ff]"
                >
                  Jetzt kostenlos Offerte anfragen
                </a>

                <Link
                  href="/anfrage"
                  className="rounded-2xl border border-white/10 bg-white/5 px-7 py-4 text-base font-semibold text-white/90 backdrop-blur transition hover:bg-white/10"
                >
                  Zum Anfrageformular
                </Link>
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                  <div className="text-3xl font-semibold text-white">24h</div>
                  <div className="mt-2 text-sm leading-6 text-white/60">
                    Schnell Anfragen senden und passende Anbieter erreichen.
                  </div>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                  <div className="text-3xl font-semibold text-white">100%</div>
                  <div className="mt-2 text-sm leading-6 text-white/60">
                    Kostenlos für Kunden, einfach und ohne komplizierten Prozess.
                  </div>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                  <div className="text-3xl font-semibold text-white">CH</div>
                  <div className="mt-2 text-sm leading-6 text-white/60">
                    Fokus auf lokale Anbieter in Zürich, Aargau und der Schweiz.
                  </div>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-3 text-sm text-white/55">
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
                    className="rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div
              id="anfrage-formular"
              className="relative rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.10),rgba(255,255,255,0.04))] p-6 shadow-[0_25px_120px_rgba(0,0,0,0.35)] backdrop-blur-2xl md:p-7"
            >
              <div className="absolute inset-0 rounded-[32px] bg-[radial-gradient(circle_at_top,rgba(126,200,255,0.12),transparent_45%)]" />

              <div className="relative">
                <div className="inline-flex rounded-full border border-[#7EC8FF]/25 bg-[#7EC8FF]/10 px-4 py-2 text-xs font-medium uppercase tracking-[0.22em] text-[#c7ebff]">
                  Kostenlose Anfrage
                </div>

                <h2 className="mt-4 text-3xl font-semibold leading-tight">
                  In 1 Minute eine professionelle Anfrage senden
                </h2>

                <p className="mt-3 text-sm leading-7 text-white/62 md:text-base">
                  Je klarer deine Anfrage, desto besser die passende Offerte.
                  Beschreibe kurz den Auftrag, den Ort und die gewünschte
                  Leistung.
                </p>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
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
                      className="min-h-[140px] w-full rounded-2xl border border-white/10 bg-[#0b1328]/80 px-4 py-3.5 text-white outline-none placeholder:text-white/25 focus:border-[#7EC8FF]/50"
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
                    className="w-full rounded-[22px] bg-[#7EC8FF] px-5 py-4 text-lg font-semibold text-[#04101d] shadow-[0_20px_80px_rgba(126,200,255,0.30)] transition hover:bg-[#91d2ff] disabled:cursor-not-allowed disabled:opacity-60"
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

      <section className="relative mx-auto max-w-7xl px-6 py-20">
        <div className="max-w-3xl">
          <div className="text-sm uppercase tracking-[0.24em] text-white/45">
            Warum Auftrago
          </div>
          <h2 className="mt-4 text-3xl font-semibold md:text-5xl">
            Ein Lead-Marktplatz, der nicht billig wirkt – sondern stark verkauft.
          </h2>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-white/68">
            Auftrago ist nicht einfach nur ein Formular. Es ist eine moderne
            Vermittlungsplattform für lokale Dienstleistungen. Kunden stellen
            Anfragen schnell und unkompliziert. Anbieter sehen strukturierte,
            hochwertige Leads und können Kontakte gezielt freischalten.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
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
              className="rounded-[28px] border border-white/10 bg-white/5 p-6 backdrop-blur"
            >
              <h3 className="text-xl font-semibold">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-white/62">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-white/10 bg-white/[0.03]">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="max-w-3xl">
            <div className="text-sm uppercase tracking-[0.24em] text-white/45">
              Leistungen
            </div>
            <h2 className="mt-4 text-3xl font-semibold md:text-5xl">
              Für Reinigung, Hauswartung, Umzug, Transport und Entsorgung gebaut
            </h2>
            <p className="mt-5 text-lg leading-8 text-white/66">
              Auftrago eignet sich perfekt für wiederkehrende Dienstleistungen,
              Objektbetreuung, Umzüge, Transporte und Offerten-Anfragen im
              Immobilien- und Servicebereich.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
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
                className="rounded-[28px] border border-white/10 bg-[#081122]/85 p-7"
              >
                <div className="mb-4 inline-flex rounded-full border border-[#7EC8FF]/20 bg-[#7EC8FF]/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.22em] text-[#cdeeff]">
                  Service
                </div>
                <h3 className="text-2xl font-semibold">{item.title}</h3>
                <p className="mt-4 text-base leading-8 text-white/62">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="max-w-3xl">
          <div className="text-sm uppercase tracking-[0.24em] text-white/45">
            So funktioniert es
          </div>
          <h2 className="mt-4 text-3xl font-semibold md:text-5xl">
            In 3 klaren Schritten zur passenden Offerte
          </h2>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
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
              className="rounded-[30px] border border-white/10 bg-white/5 p-7 backdrop-blur"
            >
              <div className="text-sm font-medium tracking-[0.18em] text-[#9fd8ff]">
                {item.step}
              </div>
              <h3 className="mt-3 text-2xl font-semibold">{item.title}</h3>
              <p className="mt-4 text-base leading-8 text-white/62">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="rounded-[34px] border border-white/10 bg-[linear-gradient(135deg,rgba(126,200,255,0.18),rgba(255,255,255,0.04))] p-8 md:p-10">
          <div className="max-w-3xl">
            <div className="text-sm uppercase tracking-[0.24em] text-white/50">
              Regionen
            </div>
            <h2 className="mt-4 text-3xl font-semibold md:text-5xl">
              Stark für Zürich, Aargau und die ganze Schweiz
            </h2>
            <p className="mt-5 text-lg leading-8 text-white/68">
              Auftrago ist ideal für lokale Lead-Generierung in Regionen mit
              hoher Nachfrage. Das System eignet sich hervorragend für
              SEO-Landingpages, Städte-Kombinationen und regionale Kampagnen.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
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
                className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-white/85"
              >
                {city}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="rounded-[34px] border border-white/10 bg-white/5 p-8 text-center backdrop-blur md:p-12">
          <div className="text-sm uppercase tracking-[0.24em] text-white/45">
            Jetzt starten
          </div>
          <h2 className="mt-4 text-3xl font-semibold md:text-5xl">
            Kostenlos Anfrage senden und passende Anbieter finden
          </h2>
          <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-white/66">
            Schnell, elegant und professionell. Genau so sollte ein moderner
            Offerten-Marktplatz wirken. Mit Auftrago baust du nicht nur eine
            Website – du baust ein System, das Nachfrage erzeugt und Leads sauber
            vermittelt.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href="#anfrage-formular"
              className="rounded-2xl bg-[#7EC8FF] px-7 py-4 text-base font-semibold text-[#04101d] shadow-[0_20px_80px_rgba(126,200,255,0.28)] transition hover:bg-[#91d2ff]"
            >
              Anfrage jetzt starten
            </a>

            <Link
              href="/anfrage"
              className="rounded-2xl border border-white/10 bg-white/5 px-7 py-4 text-base font-semibold text-white/90 transition hover:bg-white/10"
            >
              Zur Anfrage-Seite
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}