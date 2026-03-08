import Link from "next/link";

const pricingPoints = [
  {
    title: "Pay-per-Contact",
    description:
      "Du zahlst nur für freigeschaltete Kontakte. Keine unnötigen Fixkosten, keine unklaren Reichweiten-Versprechen und keine laufenden Gebühren für Sichtbarkeit ohne Ergebnis.",
  },
  {
    title: "Credits",
    description:
      "Jeder Lead hat einen klaren Credit-Preis. Je nach Kategorie, Region und Auftragsgrösse können Leads günstiger oder wertiger eingestuft werden – so bleibt das Modell fair und nachvollziehbar.",
  },
  {
    title: "Flexible Nutzung",
    description:
      "Du lädst Credits nur dann auf, wenn du sie brauchst. Damit eignet sich Auftrago sowohl für kleine lokale Anbieter als auch für Firmen, die regelmässig neue Aufträge gewinnen möchten.",
  },
];

const nextSteps = [
  "Als Anbieter registrieren und Unternehmensdaten hinterlegen",
  "Credits aufladen und erste Leads prüfen",
  "Passende Kontakte freischalten und direkt reagieren",
  "Dashboard, Transaktionen und Freischaltungen zentral verwalten",
];

const packages = [
  {
    name: "Starter",
    credits: "10 Credits",
    price: "CHF 29",
    description:
      "Ideal für den Einstieg, erste Tests und Anbieter, die das System in ihrer Region ausprobieren möchten.",
  },
  {
    name: "Growth",
    credits: "25 Credits",
    price: "CHF 59",
    description:
      "Stark für Firmen, die regelmässig passende Anfragen freischalten und konstant neue Aufträge gewinnen wollen.",
    featured: true,
  },
  {
    name: "Pro",
    credits: "60 Credits",
    price: "CHF 119",
    description:
      "Für Unternehmen mit klarer Wachstumsstrategie, mehreren Regionen oder dauerhaftem Bedarf an neuen Leads.",
  },
];

export default function PreisePage() {
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
                href="/partner"
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white/80 transition hover:bg-white/10"
              >
                Partner
              </Link>
              <Link
                href="/credits"
                className="rounded-2xl border border-[#7EC8FF]/30 bg-[#7EC8FF]/15 px-4 py-3 text-sm font-semibold text-[#bfe7ff] transition hover:bg-[#7EC8FF]/20"
              >
                Credits kaufen
              </Link>
            </div>
          </div>

          <div className="max-w-4xl">
            <div className="inline-flex max-w-full items-start gap-3 rounded-[24px] border border-white/10 bg-white/5 px-4 py-3 text-left backdrop-blur sm:items-center sm:gap-2 sm:rounded-full sm:px-4 sm:py-2.5">
              <span className="mt-1 inline-block h-2.5 w-2.5 shrink-0 rounded-full bg-[#7EC8FF] sm:mt-0 sm:h-2 sm:w-2" />
              <span className="text-[11px] uppercase leading-relaxed tracking-[0.16em] text-white/60 sm:text-xs sm:tracking-[0.22em]">
                Credits, Lead-Freischaltung und transparente Preislogik
              </span>
            </div>

            <h1 className="mt-5 text-3xl font-semibold leading-[1.02] sm:mt-6 sm:text-4xl md:text-5xl xl:text-6xl">
              Credits &{" "}
              <span className="bg-gradient-to-r from-white via-[#d7f0ff] to-[#7EC8FF] bg-clip-text text-transparent">
                Preise
              </span>{" "}
              für Anbieter
            </h1>

            <p className="mt-5 max-w-3xl text-base leading-7 text-white/72 sm:mt-6 sm:text-lg sm:leading-8">
              Du kannst dich gratis registrieren und dein Profil aufbauen –
              bezahlt wird erst dann, wenn du einen Lead wirklich freischalten
              möchtest. Genau dadurch bleibt das Modell fair, flexibel und
              deutlich transparenter als klassische Werbe- oder Abo-Modelle.
            </p>

            <p className="mt-4 max-w-3xl text-sm leading-7 text-white/55 sm:text-base sm:leading-8">
              Statt pauschal für Sichtbarkeit zu zahlen, investierst du gezielt
              in Kontakte, die für dein Unternehmen relevant sind. Das macht
              Auftrago besonders interessant für lokale Anbieter, die sauber,
              planbar und performance-orientiert wachsen möchten.
            </p>
          </div>
        </div>
      </section>

      <section className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="max-w-3xl">
          <div className="text-xs uppercase tracking-[0.18em] text-white/45 sm:text-sm sm:tracking-[0.24em]">
            Modell
          </div>
          <h2 className="mt-4 text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl">
            Einfach, nachvollziehbar und auf Ergebnisse gebaut
          </h2>
          <p className="mt-5 text-base leading-7 text-white/68 sm:text-lg sm:leading-8">
            Auftrago ist kein unübersichtliches Inserate-System. Es ist ein
            klarer Lead-Marktplatz: Kunden senden Anfragen, Anbieter sehen
            strukturierte Leads und zahlen nur dann, wenn sie den Kontakt
            wirklich freischalten möchten.
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:mt-10 md:grid-cols-3">
          {pricingPoints.map((item) => (
            <div
              key={item.title}
              className="rounded-[24px] border border-white/10 bg-white/5 p-5 backdrop-blur sm:rounded-[28px] sm:p-6"
            >
              <h3 className="text-xl font-semibold">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-white/62 sm:text-base sm:leading-8">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-[28px] border border-white/10 bg-[#081122]/85 p-5 sm:p-6 md:p-8">
          <h3 className="text-2xl font-semibold">Warum das für Firmen interessant ist</h3>
          <div className="mt-4 space-y-3 text-sm leading-7 text-white/65 sm:text-base sm:leading-8">
            <p>
              Viele Plattformen verlangen laufende Gebühren, ohne dass klar ist,
              ob daraus wirklich gute Anfragen entstehen. Auftrago dreht dieses
              Modell um: Du bezahlst nicht für Hoffnung, sondern für konkrete
              Leads.
            </p>
            <p>
              Das ist besonders stark für Anbieter, die regional arbeiten, ihre
              Marge im Blick behalten und lieber gezielt auf konkrete Aufträge
              reagieren, statt blind Reichweite einzukaufen.
            </p>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-white/[0.03]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <div className="max-w-3xl">
            <div className="text-xs uppercase tracking-[0.18em] text-white/45 sm:text-sm sm:tracking-[0.24em]">
              Beispielpakete
            </div>
            <h2 className="mt-4 text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl">
              Klare Pakete für den Einstieg und Wachstum
            </h2>
            <p className="mt-5 text-base leading-7 text-white/66 sm:text-lg sm:leading-8">
              Diese Pakete sind ein sinnvoller Start für deine Plattform. Sie
              geben Anbietern Orientierung, sind einfach zu verstehen und machen
              die Preisstruktur deutlich greifbarer.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:mt-10 md:grid-cols-3">
            {packages.map((pkg) => (
              <div
                key={pkg.name}
                className={`rounded-[24px] border p-5 sm:rounded-[30px] sm:p-7 ${
                  pkg.featured
                    ? "border-[#7EC8FF]/30 bg-[linear-gradient(180deg,rgba(126,200,255,0.14),rgba(255,255,255,0.05))] shadow-[0_20px_80px_rgba(126,200,255,0.12)]"
                    : "border-white/10 bg-white/5"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm uppercase tracking-[0.18em] text-white/45">
                      Paket
                    </div>
                    <h3 className="mt-2 text-2xl font-semibold">{pkg.name}</h3>
                  </div>

                  {pkg.featured ? (
                    <span className="rounded-full border border-[#7EC8FF]/30 bg-[#7EC8FF]/15 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-[#cdeeff]">
                      Beliebt
                    </span>
                  ) : null}
                </div>

                <div className="mt-6 text-3xl font-semibold text-white sm:text-4xl">
                  {pkg.price}
                </div>
                <div className="mt-2 text-base text-[#aee1ff]">{pkg.credits}</div>

                <p className="mt-5 text-sm leading-7 text-white/62 sm:text-base sm:leading-8">
                  {pkg.description}
                </p>

                <Link
                  href="/credits"
                  className={`mt-6 inline-flex min-h-[50px] w-full items-center justify-center rounded-2xl px-5 py-3 text-base font-semibold transition ${
                    pkg.featured
                      ? "bg-[#7EC8FF] text-[#04101d] hover:bg-[#91d2ff]"
                      : "border border-white/10 bg-white/5 text-white hover:bg-white/10"
                  }`}
                >
                  Credits wählen
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="rounded-[28px] border border-white/10 bg-white/5 p-5 backdrop-blur sm:rounded-[34px] sm:p-8 md:p-10">
          <div className="max-w-3xl">
            <div className="text-xs uppercase tracking-[0.18em] text-white/45 sm:text-sm sm:tracking-[0.24em]">
              Nächste Schritte
            </div>
            <h2 className="mt-4 text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl">
              So startest du als Anbieter
            </h2>
            <p className="mt-5 text-base leading-7 text-white/66 sm:text-lg sm:leading-8">
              Der Einstieg ist bewusst einfach gehalten, damit neue Anbieter
              schnell loslegen können und sofort verstehen, wie das System
              genutzt wird.
            </p>
          </div>

          <div className="mt-8 rounded-[24px] border border-white/10 bg-[#081122]/85 p-5 sm:mt-10 sm:rounded-[28px] sm:p-7">
            <ol className="space-y-3 pl-5 text-sm leading-7 text-white/75 sm:text-base sm:leading-8">
              {nextSteps.map((step) => (
                <li key={step} className="list-decimal">
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 sm:pb-24 lg:px-8">
        <div className="rounded-[28px] border border-white/10 bg-[linear-gradient(135deg,rgba(126,200,255,0.18),rgba(255,255,255,0.04))] p-5 text-center sm:rounded-[34px] sm:p-8 md:p-12">
          <div className="text-xs uppercase tracking-[0.18em] text-white/45 sm:text-sm sm:tracking-[0.24em]">
            Jetzt starten
          </div>

          <h2 className="mt-4 text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl">
            Lade Credits auf und schalte passende Leads frei
          </h2>

          <p className="mx-auto mt-5 max-w-3xl text-base leading-7 text-white/66 sm:text-lg sm:leading-8">
            Das Modell ist einfach: Du kaufst Credits, prüfst interessante
            Anfragen und investierst nur dann, wenn du einen Lead wirklich
            freischalten möchtest. So bleibt dein Einsatz transparent und
            nachvollziehbar.
          </p>

          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:mt-8 sm:flex-row sm:flex-wrap sm:gap-4">
            <Link
              href="/credits"
              className="inline-flex min-h-[54px] w-full items-center justify-center rounded-2xl bg-[#7EC8FF] px-6 py-4 text-base font-semibold text-[#04101d] shadow-[0_20px_80px_rgba(126,200,255,0.28)] transition hover:bg-[#91d2ff] sm:w-auto sm:px-7"
            >
              Credits kaufen
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