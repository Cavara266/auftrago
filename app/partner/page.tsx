import Link from "next/link";

const benefits = [
  {
    title: "Qualifizierte Leads",
    text: "Erhalte strukturierte Anfragen von Kunden, die aktiv nach Reinigung, Hauswartung, Umzug, Transport oder Entsorgung suchen.",
  },
  {
    title: "Nur bezahlen bei Interesse",
    text: "Du zahlst nicht für Klicks oder Sichtbarkeit, sondern nur dann, wenn du einen Lead wirklich freischalten möchtest.",
  },
  {
    title: "Schnell & lokal",
    text: "Finde passende Aufträge in deiner Region und reagiere direkt auf neue Anfragen – schnell, fokussiert und effizient.",
  },
  {
    title: "Modernes System",
    text: "Auftrago verbindet klare Lead-Struktur, Credits, Dashboard und regionale Nachfrage in einer sauberen Plattform.",
  },
];

const steps = [
  {
    step: "01",
    title: "Als Anbieter registrieren",
    text: "Erstelle dein Konto und richte dein Profil für deine Dienstleistungen und Regionen ein.",
  },
  {
    step: "02",
    title: "Credits aufladen",
    text: "Lade Credits auf und entscheide flexibel, welche Leads für dich interessant sind.",
  },
  {
    step: "03",
    title: "Kontakte freischalten",
    text: "Sobald ein Lead zu deinem Angebot passt, kannst du die Kontaktdaten freischalten und direkt reagieren.",
  },
];

const categories = [
  "Hauswartung",
  "Reinigung",
  "Büroreinigung",
  "Treppenhausreinigung",
  "Umzugsreinigung",
  "Gartenpflege",
  "Umzug",
  "Transport",
  "Entsorgung",
];

const regions = [
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
];

export default function PartnerPage() {
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
                href="/preise"
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white/80 transition hover:bg-white/10"
              >
                Preise
              </Link>
              <Link
                href="/register"
                className="rounded-2xl border border-[#7EC8FF]/30 bg-[#7EC8FF]/15 px-4 py-3 text-sm font-semibold text-[#bfe7ff] transition hover:bg-[#7EC8FF]/20"
              >
                Jetzt registrieren
              </Link>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-10">
            <div>
              <div className="inline-flex max-w-full items-start gap-3 rounded-[24px] border border-white/10 bg-white/5 px-4 py-3 text-left backdrop-blur sm:items-center sm:gap-2 sm:rounded-full sm:px-4 sm:py-2.5">
                <span className="mt-1 inline-block h-2.5 w-2.5 shrink-0 rounded-full bg-[#7EC8FF] sm:mt-0 sm:h-2 sm:w-2" />
                <span className="text-[11px] uppercase leading-relaxed tracking-[0.16em] text-white/60 sm:text-xs sm:tracking-[0.22em]">
                  Für Anbieter in Reinigung, Hauswartung, Umzug, Transport &
                  Services
                </span>
              </div>

              <h1 className="mt-5 max-w-4xl text-3xl font-semibold leading-[1.02] sm:mt-6 sm:text-4xl md:text-6xl xl:text-7xl">
                Neue Aufträge für dein{" "}
                <span className="bg-gradient-to-r from-white via-[#d7f0ff] to-[#7EC8FF] bg-clip-text text-transparent">
                  Unternehmen
                </span>{" "}
                – lokal, schnell und planbar.
              </h1>

              <p className="mt-5 max-w-3xl text-base leading-7 text-white/72 sm:mt-6 sm:text-lg sm:leading-8 md:text-xl">
                Auftrago bringt qualifizierte Kundenanfragen direkt zu passenden
                Anbietern. Du entscheidest selbst, welche Leads für dich
                interessant sind, und zahlst nur dann, wenn du Kontaktdaten
                freischalten möchtest.
              </p>

              <p className="mt-4 max-w-3xl text-sm leading-7 text-white/55 sm:text-base sm:leading-8 md:text-lg">
                Ideal für Firmen aus Zürich, Aargau, Basel, Bern und der ganzen
                Schweiz, die neue Aufträge für Reinigung, Umzug, Hauswartung,
                Transport oder Entsorgung gewinnen möchten.
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap sm:gap-4">
                <Link
                  href="/register"
                  className="inline-flex min-h-[54px] w-full items-center justify-center rounded-2xl bg-[#7EC8FF] px-6 py-4 text-center text-base font-semibold text-[#04101d] shadow-[0_20px_80px_rgba(126,200,255,0.28)] transition hover:scale-[1.01] hover:bg-[#91d2ff] sm:w-auto sm:px-7"
                >
                  Jetzt als Anbieter registrieren
                </Link>

                <Link
                  href="/preise"
                  className="inline-flex min-h-[54px] w-full items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-center text-base font-semibold text-white/90 backdrop-blur transition hover:bg-white/10 sm:w-auto sm:px-7"
                >
                  Credits & Preise ansehen
                </Link>
              </div>

              <div className="mt-8 grid gap-4 sm:mt-10 sm:grid-cols-3">
                <div className="rounded-[26px] border border-white/10 bg-white/5 p-5 backdrop-blur">
                  <div className="text-2xl font-semibold text-white sm:text-3xl">
                    Lokal
                  </div>
                  <div className="mt-2 text-sm leading-6 text-white/60">
                    Passende Anfragen aus deiner Region und deinen Zielgebieten.
                  </div>
                </div>

                <div className="rounded-[26px] border border-white/10 bg-white/5 p-5 backdrop-blur">
                  <div className="text-2xl font-semibold text-white sm:text-3xl">
                    Flexibel
                  </div>
                  <div className="mt-2 text-sm leading-6 text-white/60">
                    Du entscheidest selbst, welche Leads du freischaltest.
                  </div>
                </div>

                <div className="rounded-[26px] border border-white/10 bg-white/5 p-5 backdrop-blur">
                  <div className="text-2xl font-semibold text-white sm:text-3xl">
                    Direkt
                  </div>
                  <div className="mt-2 text-sm leading-6 text-white/60">
                    Nach Freischaltung kannst du Kunden sofort kontaktieren.
                  </div>
                </div>
              </div>

              <div className="mt-7 flex flex-wrap gap-2.5 text-sm text-white/55 sm:mt-8 sm:gap-3">
                {categories.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-white/10 bg-white/5 px-3.5 py-2 backdrop-blur sm:px-4"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="relative rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.10),rgba(255,255,255,0.04))] p-4 shadow-[0_25px_120px_rgba(0,0,0,0.35)] backdrop-blur-2xl sm:rounded-[32px] sm:p-6 md:p-7">
              <div className="absolute inset-0 rounded-[28px] bg-[radial-gradient(circle_at_top,rgba(126,200,255,0.12),transparent_45%)] sm:rounded-[32px]" />

              <div className="relative">
                <div className="inline-flex rounded-full border border-[#7EC8FF]/25 bg-[#7EC8FF]/10 px-4 py-2 text-[11px] font-medium uppercase tracking-[0.18em] text-[#c7ebff] sm:text-xs sm:tracking-[0.22em]">
                  Warum Anbieter Auftrago nutzen
                </div>

                <h2 className="mt-4 text-2xl font-semibold leading-tight sm:text-3xl">
                  Eine moderne Plattform für echte Kundenanfragen
                </h2>

                <p className="mt-3 text-sm leading-7 text-white/62 md:text-base">
                  Kein unübersichtliches Inserate-System, sondern ein klarer
                  Lead-Marktplatz mit Fokus auf Qualität, Regionen und direkte
                  Kontaktfreischaltung.
                </p>

                <div className="mt-6 space-y-4">
                  {benefits.map((item) => (
                    <div
                      key={item.title}
                      className="rounded-[22px] border border-white/10 bg-[#0b1328]/70 p-4 sm:p-5"
                    >
                      <div className="text-base font-semibold text-white sm:text-lg">
                        {item.title}
                      </div>
                      <p className="mt-2 text-sm leading-7 text-white/62 sm:text-base sm:leading-8">
                        {item.text}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href="/register"
                    className="inline-flex min-h-[52px] w-full items-center justify-center rounded-2xl bg-[#7EC8FF] px-5 py-3 text-base font-semibold text-[#04101d] transition hover:bg-[#91d2ff]"
                  >
                    Kostenlos registrieren
                  </Link>

                  <Link
                    href="/login"
                    className="inline-flex min-h-[52px] w-full items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-base font-semibold text-white transition hover:bg-white/10"
                  >
                    Bereits Konto? Login
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="max-w-3xl">
          <div className="text-xs uppercase tracking-[0.18em] text-white/45 sm:text-sm sm:tracking-[0.24em]">
            Vorteile
          </div>
          <h2 className="mt-4 text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl">
            Warum dieses Modell für Anbieter stark funktioniert
          </h2>
          <p className="mt-5 max-w-3xl text-base leading-7 text-white/68 sm:text-lg sm:leading-8">
            Du musst nicht auf gut Glück Werbung schalten. Stattdessen bekommst
            du strukturierte Anfragen von Kunden, die bereits ein konkretes
            Bedürfnis haben.
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:mt-10 md:grid-cols-2 xl:grid-cols-4">
          {[
            {
              title: "Mehr Fokus",
              text: "Nur interessante Leads freischalten statt Zeit mit irrelevanten Kontakten zu verlieren.",
            },
            {
              title: "Mehr Kontrolle",
              text: "Du bestimmst selbst, wann du Credits einsetzt und bei welchen Aufträgen du aktiv wirst.",
            },
            {
              title: "Mehr Übersicht",
              text: "Leads, Freischaltungen und Credits lassen sich zentral über dein Dashboard verwalten.",
            },
            {
              title: "Mehr Wachstum",
              text: "Perfekte Basis für konstante Neukunden-Gewinnung in deiner Region und Kategorie.",
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
              So funktioniert es
            </div>
            <h2 className="mt-4 text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl">
              In 3 Schritten zu neuen Aufträgen
            </h2>
          </div>

          <div className="mt-8 grid gap-4 sm:mt-10 md:grid-cols-3">
            {steps.map((item) => (
              <div
                key={item.step}
                className="rounded-[24px] border border-white/10 bg-[#081122]/85 p-5 sm:rounded-[30px] sm:p-7"
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
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="rounded-[28px] border border-white/10 bg-[linear-gradient(135deg,rgba(126,200,255,0.18),rgba(255,255,255,0.04))] p-5 sm:rounded-[34px] sm:p-8 md:p-10">
          <div className="max-w-3xl">
            <div className="text-xs uppercase tracking-[0.18em] text-white/50 sm:text-sm sm:tracking-[0.24em]">
              Regionen
            </div>
            <h2 className="mt-4 text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl">
              Finde passende Leads in deiner Region
            </h2>
            <p className="mt-5 text-base leading-7 text-white/68 sm:text-lg sm:leading-8">
              Auftrago ist ideal für regionale Lead-Generierung. Starte in einer
              Stadt oder decke gleich mehrere Gebiete in der Schweiz ab.
            </p>
          </div>

          <div className="mt-7 flex flex-wrap gap-2.5 sm:mt-8 sm:gap-3">
            {regions.map((city) => (
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
            Werde Anbieter auf Auftrago und sichere dir neue Anfragen
          </h2>
          <p className="mx-auto mt-5 max-w-3xl text-base leading-7 text-white/66 sm:text-lg sm:leading-8">
            Registriere dich, lade Credits auf und entscheide selbst, welche
            Leads du freischalten willst. Einfach, modern und auf echte
            Auftragschancen ausgerichtet.
          </p>

          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:mt-8 sm:flex-row sm:flex-wrap sm:gap-4">
            <Link
              href="/register"
              className="inline-flex min-h-[54px] w-full items-center justify-center rounded-2xl bg-[#7EC8FF] px-6 py-4 text-base font-semibold text-[#04101d] shadow-[0_20px_80px_rgba(126,200,255,0.28)] transition hover:bg-[#91d2ff] sm:w-auto sm:px-7"
            >
              Jetzt registrieren
            </Link>

            <Link
              href="/preise"
              className="inline-flex min-h-[54px] w-full items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-base font-semibold text-white/90 transition hover:bg-white/10 sm:w-auto sm:px-7"
            >
              Preise ansehen
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}