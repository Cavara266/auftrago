"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const categories = [
  "Hauswartung",
  "Reinigung",
  "Büroreinigung",
  "Wohnungsreinigung",
  "Fensterreinigung",
  "Baureinigung",
  "Treppenhausreinigung",
  "Umzugsreinigung",
  "Gartenpflege",
  "Winterdienst",
  "Umzug",
  "Transport",
  "Entsorgung",
  "Entruempelung",
];

const categoryDescriptions: Record<string, string> = {
  Hauswartung:
    "Ideal für laufende Betreuung von Liegenschaften, Kontrollgänge, Unterhalt, Kleinreparaturen und wiederkehrende Objektservices.",
  Reinigung:
    "Perfekt für private und gewerbliche Reinigungen – schnell, gründlich und passend für deinen genauen Bedarf.",
  Büroreinigung:
    "Für Unternehmen, Praxen, Studios und Büroflächen, die saubere und professionelle Arbeitsumgebungen wollen.",
  Wohnungsreinigung:
    "Passend für intensive Reinigung, Alltag, Mieterwechsel oder gründliche Pflege von Wohnungen und Häusern.",
  Fensterreinigung:
    "Für streifenfreie Fenster, Glasflächen, Rahmen und saubere Eindrücke bei Privat- und Geschäftskunden.",
  Baureinigung:
    "Optimal nach Umbau, Renovation oder Bauprojekt – für Grob- und Feinreinigung vor Übergabe oder Bezug.",
  Treppenhausreinigung:
    "Besonders geeignet für Mehrfamilienhäuser, Verwaltungen und gepflegte Eingangs- und Treppenbereiche.",
  Umzugsreinigung:
    "Wenn du eine saubere Abgabe, eine professionelle Endreinigung oder eine Übergabe mit gutem Eindruck brauchst.",
  Gartenpflege:
    "Für gepflegte Aussenbereiche, Hecken, Rabatten, saisonale Arbeiten und regelmässigen Gartenunterhalt.",
  Winterdienst:
    "Für Räumung, Streuung und planbare Wintereinsätze bei Liegenschaften, Unternehmen und Wohnanlagen.",
  Umzug:
    "Wenn du Unterstützung bei Planung, Tragen, Transport oder einem kompletten Umzugsservice brauchst.",
  Transport:
    "Für flexible Transporte, Möbeltransporte, Materialfahrten oder schnelle regionale und überregionale Transporte.",
  Entsorgung:
    "Ideal für Sperrgut, Möbel, Altgeräte, gemischte Materialien und fachgerechte Entsorgungsaufträge.",
  Entruempelung:
    "Für Wohnungen, Keller, Estriche, Büros oder Räumungen mit sauberem Abtransport und Entsorgung.",
};

export default function AnfrageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialCategory = useMemo(() => {
    const category = searchParams.get("category") || "Hauswartung";
    return categories.includes(category) ? category : "Hauswartung";
  }, [searchParams]);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [category, setCategory] = useState(initialCategory);
  const [description, setDescription] = useState("");

  const [website, setWebsite] = useState("");
  const [formStartedAt, setFormStartedAt] = useState<number>(0);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFormStartedAt(Date.now());
  }, []);

  useEffect(() => {
    setCategory(initialCategory);
  }, [initialCategory]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/anfrage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          phone,
          email,
          city,
          category,
          description,
          website,
          formStartedAt,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.error || "Serverfehler.");
        setLoading(false);
        return;
      }

      router.push("/danke");
    } catch {
      setError("Serverfehler. Bitte später nochmals versuchen.");
      setLoading(false);
    }
  }

  const currentCategoryText =
    categoryDescriptions[category] ||
    "Beschreibe deinen Auftrag möglichst klar, damit passende Anbieter schnell reagieren können.";

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#030816] text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-20%] top-[-10%] h-[260px] w-[260px] rounded-full bg-cyan-400/12 blur-3xl sm:left-[-10%] sm:h-[380px] sm:w-[380px]" />
        <div className="absolute right-[-20%] top-[10%] h-[280px] w-[280px] rounded-full bg-sky-400/10 blur-3xl sm:right-[-10%] sm:h-[420px] sm:w-[420px]" />
        <div className="absolute bottom-[-10%] left-[10%] h-[240px] w-[240px] rounded-full bg-blue-500/10 blur-3xl sm:left-[20%] sm:h-[340px] sm:w-[340px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(126,200,255,0.08),transparent_35%),linear-gradient(to_bottom,rgba(255,255,255,0.02),transparent)]" />
      </div>

      <section className="relative border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 pb-10 pt-5 sm:px-6 sm:pb-12 sm:pt-8 lg:px-8">
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
                href="/"
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white/80 transition hover:bg-white/10"
              >
                Startseite
              </Link>
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
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start lg:gap-10">
            <div>
              <div className="inline-flex max-w-full items-start gap-3 rounded-[24px] border border-white/10 bg-white/5 px-4 py-3 text-left backdrop-blur sm:items-center sm:gap-2 sm:rounded-full sm:px-4 sm:py-2.5">
                <span className="mt-1 inline-block h-2.5 w-2.5 shrink-0 rounded-full bg-[#7EC8FF] sm:mt-0 sm:h-2 sm:w-2" />
                <span className="text-[11px] uppercase leading-relaxed tracking-[0.16em] text-white/60 sm:text-xs sm:tracking-[0.22em]">
                  Kostenlose Offerten-Anfrage für Reinigung, Hauswartung, Umzug,
                  Transport & Services
                </span>
              </div>

              <h1 className="mt-5 text-3xl font-semibold leading-[1.02] sm:mt-6 sm:text-4xl md:text-5xl xl:text-6xl">
                Sende deine Anfrage in{" "}
                <span className="bg-gradient-to-r from-white via-[#d7f0ff] to-[#7EC8FF] bg-clip-text text-transparent">
                  1 Minute
                </span>{" "}
                und finde passende Anbieter.
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-7 text-white/72 sm:mt-6 sm:text-lg sm:leading-8">
                Mit Auftrago erreichst du schnell passende Anbieter für
                Reinigung, Hauswartung, Umzug, Transport, Entsorgung und weitere
                Dienstleistungen. Du beschreibst deinen Auftrag einmal sauber,
                und relevante Firmen können deine Anfrage sehen und dir direkt
                eine Offerte machen.
              </p>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/55 sm:text-base sm:leading-8">
                Je klarer deine Angaben, desto besser die Qualität der
                Rückmeldungen. Beschreibe deshalb kurz den Auftrag, den Ort, die
                gewünschte Leistung und – wenn möglich – den Rahmen oder das
                Ziel. So können Anbieter schneller einschätzen, ob sie zu deiner
                Anfrage passen.
              </p>

              <div className="mt-8">
                <div className="text-xs uppercase tracking-[0.16em] text-white/45">
                  Beliebte Kategorien
                </div>

                <div className="mt-3 flex flex-wrap gap-2.5">
                  {categories.map((item) => {
                    const active = category === item;

                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setCategory(item)}
                        className={[
                          "rounded-full border px-3.5 py-2 text-sm transition",
                          active
                            ? "border-[#7EC8FF]/30 bg-[#7EC8FF]/15 text-[#d9f3ff]"
                            : "border-white/10 bg-white/5 text-white/65 hover:bg-white/10",
                        ].join(" ")}
                      >
                        {item}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-4 rounded-[22px] border border-white/10 bg-white/5 p-4">
                  <div className="text-sm font-semibold text-white">
                    Ausgewählte Kategorie: {category}
                  </div>
                  <p className="mt-2 text-sm leading-7 text-white/62 sm:text-base sm:leading-8">
                    {currentCategoryText}
                  </p>
                </div>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <div className="rounded-[26px] border border-white/10 bg-white/5 p-5 backdrop-blur">
                  <div className="text-2xl font-semibold text-white sm:text-3xl">
                    Kostenlos
                  </div>
                  <div className="mt-2 text-sm leading-6 text-white/60">
                    Für Kunden ist die Anfrage komplett kostenlos und
                    unverbindlich.
                  </div>
                </div>

                <div className="rounded-[26px] border border-white/10 bg-white/5 p-5 backdrop-blur">
                  <div className="text-2xl font-semibold text-white sm:text-3xl">
                    Schnell
                  </div>
                  <div className="mt-2 text-sm leading-6 text-white/60">
                    Mit wenigen Angaben startest du eine professionelle Anfrage.
                  </div>
                </div>

                <div className="rounded-[26px] border border-white/10 bg-white/5 p-5 backdrop-blur">
                  <div className="text-2xl font-semibold text-white sm:text-3xl">
                    Lokal
                  </div>
                  <div className="mt-2 text-sm leading-6 text-white/60">
                    Passende Anbieter aus deiner Region können direkt reagieren.
                  </div>
                </div>
              </div>

              <div className="mt-8 rounded-[26px] border border-white/10 bg-[#081122]/80 p-5 sm:p-6">
                <h2 className="text-xl font-semibold sm:text-2xl">
                  So bekommst du bessere Offerten
                </h2>

                <div className="mt-4 space-y-3 text-sm leading-7 text-white/65 sm:text-base sm:leading-8">
                  <p>
                    Nenne möglichst klar, was gemacht werden soll, wo der Auftrag
                    stattfindet und was dir wichtig ist. Bei Umzügen helfen zum
                    Beispiel Angaben zu Start- und Zielort, Stockwerk, Lift und
                    Umfang. Bei Reinigungen sind Objektart, Zustand und
                    gewünschter Termin hilfreich.
                  </p>
                  <p>
                    Wenn du Sonderwünsche hast – etwa eine Abnahmegarantie, eine
                    schnelle Ausführung, regelmässige Einsätze oder eine
                    bestimmte Region – dann erwähne das direkt im Beschreibungstext.
                    Das spart Rückfragen und erhöht die Chance auf passende
                    Offerten.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.10),rgba(255,255,255,0.04))] p-4 shadow-[0_25px_120px_rgba(0,0,0,0.35)] backdrop-blur-2xl sm:rounded-[32px] sm:p-6 md:p-7">
              <div className="absolute inset-0 rounded-[28px] bg-[radial-gradient(circle_at_top,rgba(126,200,255,0.12),transparent_45%)] sm:rounded-[32px]" />

              <div className="relative">
                <div className="inline-flex rounded-full border border-[#7EC8FF]/25 bg-[#7EC8FF]/10 px-4 py-2 text-[11px] font-medium uppercase tracking-[0.18em] text-[#c7ebff] sm:text-xs sm:tracking-[0.22em]">
                  Anfrageformular
                </div>

                <h2 className="mt-4 text-2xl font-semibold leading-tight sm:text-3xl">
                  Kostenlos Anfrage senden
                </h2>

                <p className="mt-3 text-sm leading-7 text-white/62 md:text-base">
                  Je genauer deine Angaben, desto besser können Anbieter deinen
                  Bedarf einschätzen und dir eine passende Offerte senden.
                </p>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  <div>
                    <label className="mb-2 block text-sm text-white/70">
                      Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
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
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
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
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
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
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full rounded-2xl border border-white/10 bg-[#0b1328]/80 px-4 py-3.5 text-white outline-none focus:border-[#7EC8FF]/50"
                        required
                      >
                        {categories.map((item) => (
                          <option key={item} value={item}>
                            {item}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm text-white/70">
                      Beschreibung
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="min-h-[180px] w-full rounded-2xl border border-white/10 bg-[#0b1328]/80 px-4 py-3.5 text-white outline-none placeholder:text-white/25 focus:border-[#7EC8FF]/50 sm:min-h-[220px]"
                      placeholder="Beschreibe kurz deinen Auftrag, den Ort, besondere Wünsche, gewünschte Termine und alles, was für eine gute Offerte wichtig ist."
                      required
                    />
                  </div>

                  <div className="hidden" aria-hidden="true">
                    <label htmlFor="website">Website</label>
                    <input
                      id="website"
                      name="website"
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                    />
                  </div>

                  {error ? (
                    <div className="rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                      {error}
                    </div>
                  ) : null}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-[22px] bg-sky-300 px-6 py-4 text-base font-semibold text-black shadow-[0_20px_80px_rgba(126,200,255,0.28)] transition hover:bg-sky-200 disabled:opacity-60 sm:text-lg"
                  >
                    {loading ? "Wird gesendet ..." : "Kostenlos Anfrage senden"}
                  </button>

                  <p className="text-center text-xs leading-6 text-white/42">
                    Kostenlos. Unverbindlich. Schnell. Lokal.
                  </p>
                </form>

                <div className="mt-6 rounded-[22px] border border-white/10 bg-[#081122]/80 p-4 sm:p-5">
                  <div className="text-sm font-semibold text-white">
                    Was passiert nach dem Absenden?
                  </div>
                  <div className="mt-3 space-y-2 text-sm leading-7 text-white/62 sm:text-base sm:leading-8">
                    <p>
                      Deine Anfrage wird gespeichert und passenden Anbietern
                      angezeigt. Relevante Firmen können die Anfrage prüfen und
                      bei Interesse die Kontaktdaten freischalten.
                    </p>
                    <p>
                      Dadurch erhältst du gezieltere Rückmeldungen und musst
                      deinen Auftrag nicht mehrfach auf verschiedenen Plattformen
                      erfassen.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="max-w-3xl">
          <div className="text-xs uppercase tracking-[0.18em] text-white/45 sm:text-sm sm:tracking-[0.24em]">
            So funktioniert es
          </div>
          <h2 className="mt-4 text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl">
            In 3 Schritten zur passenden Offerte
          </h2>
        </div>

        <div className="mt-8 grid gap-4 sm:mt-10 md:grid-cols-3">
          {[
            {
              step: "01",
              title: "Anfrage ausfüllen",
              text: "Du beschreibst kurz deinen Auftrag, die Region, die gewünschte Leistung und besondere Anforderungen.",
            },
            {
              step: "02",
              title: "Anbieter erreichen",
              text: "Passende Firmen sehen deine Anfrage und können den Kontakt freischalten, wenn sie zu deinem Auftrag passen.",
            },
            {
              step: "03",
              title: "Offerte erhalten",
              text: "Du wirst direkt kontaktiert und erhältst passende Rückmeldungen oder konkrete Offerten für deinen Auftrag.",
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

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 sm:pb-24 lg:px-8">
        <div className="rounded-[28px] border border-white/10 bg-white/5 p-5 text-center backdrop-blur sm:rounded-[34px] sm:p-8 md:p-12">
          <div className="text-xs uppercase tracking-[0.18em] text-white/45 sm:text-sm sm:tracking-[0.24em]">
            Hinweis
          </div>

          <h2 className="mt-4 text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl">
            Je besser die Beschreibung, desto stärker die Offerte
          </h2>

          <p className="mx-auto mt-5 max-w-3xl text-base leading-7 text-white/66 sm:text-lg sm:leading-8">
            Gute Anfragen erzeugen bessere Rückmeldungen. Nenne deshalb immer
            möglichst klar, worum es geht, wo der Auftrag stattfindet und was
            dir bei der Ausführung wichtig ist.
          </p>

          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:mt-8 sm:flex-row sm:flex-wrap sm:gap-4">
            <Link
              href="/leistungen"
              className="inline-flex min-h-[54px] w-full items-center justify-center rounded-2xl bg-[#7EC8FF] px-6 py-4 text-base font-semibold text-[#04101d] shadow-[0_20px_80px_rgba(126,200,255,0.28)] transition hover:bg-[#91d2ff] sm:w-auto sm:px-7"
            >
              Leistungen ansehen
            </Link>

            <Link
              href="/partner"
              className="inline-flex min-h-[54px] w-full items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-base font-semibold text-white/90 transition hover:bg-white/10 sm:w-auto sm:px-7"
            >
              Anbieter werden
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}