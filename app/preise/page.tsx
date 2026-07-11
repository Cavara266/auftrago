import Link from "next/link";

const packages = [
  {
    badge: "Starter",
    price: "CHF 29",
    credits: "10 Credits",
    pricePerCredit: "CHF 2.90 pro Credit",
    description:
      "Ideal, um Auftrago unverbindlich zu testen und erste Kundenanfragen in deiner Region freizuschalten.",
    features: [
      "Keine Vertragsbindung",
      "Anfragen vor dem Kauf prüfen",
      "Credits flexibel einsetzen",
      "Ideal für den Einstieg",
    ],
    button: "Starter-Paket wählen",
    highlighted: false,
  },
  {
    badge: "Am beliebtesten",
    price: "CHF 59",
    credits: "25 Credits",
    pricePerCredit: "CHF 2.36 pro Credit",
    description:
      "Für aktive Firmen, die regelmässig neue Kundenanfragen erhalten und zusätzliche Aufträge gewinnen möchten.",
    features: [
      "Besserer Preis pro Credit",
      "Für mehrere Kundenanfragen",
      "Ideal für regionale Anbieter",
      "Keine monatlichen Fixkosten",
    ],
    button: "Wachstumspaket wählen",
    highlighted: true,
  },
  {
    badge: "Pro",
    price: "CHF 119",
    credits: "60 Credits",
    pricePerCredit: "CHF 1.98 pro Credit",
    description:
      "Für wachsende Unternehmen mit mehreren Dienstleistungen, Einsatzgebieten oder höherem Lead-Bedarf.",
    features: [
      "Bester Preis pro Credit",
      "Für mehrere Regionen geeignet",
      "Ideal für wachsende Firmen",
      "Maximale Flexibilität",
    ],
    button: "Pro-Paket wählen",
    highlighted: false,
  },
];

const exampleLeads = [
  {
    category: "Umzugsreinigung",
    location: "Zürich",
    title: "4.5-Zimmer-Wohnung reinigen",
    details: ["120 m²", "2 Nasszellen", "Abgabegarantie"],
    credits: "12 Credits",
  },
  {
    category: "Fensterreinigung",
    location: "Baden",
    title: "Fenster und Storen reinigen",
    details: ["11–15 Fenster", "Lamellenstoren", "Privathaushalt"],
    credits: "7 Credits",
  },
  {
    category: "Unterhaltsreinigung",
    location: "Aarau",
    title: "Wöchentliche Hausreinigung",
    details: ["Privathaushalt", "Ca. 4 Stunden", "Wiederkehrend"],
    credits: "9 Credits",
  },
];

const services = [
  "Umzugsreinigung",
  "Unterhaltsreinigung",
  "Fensterreinigung",
  "Hauswartung",
  "Umzug",
  "Gartenpflege",
  "Entsorgung",
  "Malerarbeiten",
];

const faqs = [
  {
    question: "Muss ich ein monatliches Abo abschliessen?",
    answer:
      "Nein. Bei Auftrago gibt es keine monatlichen Fixkosten und keine automatische Verlängerung. Du kaufst Credits nur dann, wenn du sie benötigst.",
  },
  {
    question: "Kann ich eine Anfrage vor dem Kauf prüfen?",
    answer:
      "Ja. Vor der Freischaltung siehst du wichtige Angaben wie Region, Dienstleistung, Termin, Objekt und Auftragsumfang.",
  },
  {
    question: "Wann erhalte ich die Kontaktdaten?",
    answer:
      "Nach erfolgreicher Freischaltung werden dir die verfügbaren Kontaktdaten des Kunden direkt angezeigt.",
  },
  {
    question: "Ist ein Auftrag garantiert?",
    answer:
      "Nein. Auftrago vermittelt konkrete Kundenanfragen. Ob daraus ein Auftrag entsteht, hängt unter anderem von deinem Angebot, deiner Reaktionszeit und deiner Kommunikation ab.",
  },
  {
    question: "Kann ich selbst entscheiden, welche Leads ich kaufe?",
    answer:
      "Ja. Du entscheidest bei jeder Anfrage selbst, ob sie zu deiner Firma, deiner Region und deinen Kapazitäten passt.",
  },
  {
    question: "Kann ich mehrere Regionen und Dienstleistungen anbieten?",
    answer:
      "Ja. Du kannst dein Anbieterprofil auf mehrere Einsatzgebiete und verschiedene Dienstleistungen ausrichten.",
  },
];

export default function PreisePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#050816] text-white">
      {/* Hero */}
      <section className="relative border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_25%,rgba(14,165,233,0.18),transparent_32%),radial-gradient(circle_at_85%_15%,rgba(99,102,241,0.16),transparent_28%)]" />

        <div className="relative mx-auto grid max-w-7xl gap-14 px-6 py-20 lg:grid-cols-[1.12fr_0.88fr] lg:px-8 lg:py-28">
          <div className="max-w-3xl">
            <div className="mb-7 inline-flex items-center rounded-full border border-sky-400/30 bg-sky-400/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-sky-300">
              Neue Kundenanfragen aus deiner Region
            </div>

            <h1 className="max-w-4xl text-5xl font-black leading-[0.94] tracking-[-0.055em] sm:text-6xl lg:text-7xl">
              Gewinne neue Aufträge.
              <span className="mt-2 block bg-gradient-to-r from-sky-300 via-cyan-300 to-indigo-400 bg-clip-text text-transparent">
                Ohne Abo. Ohne Werberisiko.
              </span>
            </h1>

            <p className="mt-8 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
              Erhalte konkrete Kundenanfragen für Reinigung, Umzug,
              Hauswartung, Gartenpflege und weitere Dienstleistungen. Du
              entscheidest selbst, welche Kontakte du freischaltest.
            </p>

            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/anbieter-registrieren"
                className="inline-flex min-h-14 items-center justify-center rounded-2xl bg-gradient-to-r from-sky-400 to-indigo-500 px-7 py-4 text-base font-black text-white shadow-[0_18px_50px_rgba(14,165,233,0.24)] transition hover:-translate-y-0.5 hover:shadow-[0_22px_60px_rgba(14,165,233,0.35)]"
              >
                Jetzt kostenlos Anbieter werden
              </Link>

              <Link
                href="/leads"
                className="inline-flex min-h-14 items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-7 py-4 text-base font-bold text-white transition hover:border-sky-300/40 hover:bg-white/10"
              >
                Aktuelle Anfragen ansehen
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              {[
                "Keine Fixkosten",
                "Anfragen vorher prüfen",
                "Nur passende Leads wählen",
                "Für Schweizer Firmen",
              ].map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-white/10 bg-white/[0.055] px-4 py-2 text-sm font-semibold text-slate-200"
                >
                  ✓ {item}
                </span>
              ))}
            </div>
          </div>

          <div className="relative self-center">
            <div className="absolute -inset-8 rounded-[40px] bg-gradient-to-br from-sky-400/15 to-indigo-500/10 blur-3xl" />

            <div className="relative rounded-[32px] border border-white/15 bg-[#0b1226]/90 p-7 shadow-2xl backdrop-blur-xl sm:p-9">
              <div className="flex items-start justify-between gap-5">
                <div>
                  <div className="text-sm font-bold uppercase tracking-[0.18em] text-sky-300">
                    Pay-per-Contact
                  </div>
                  <h2 className="mt-4 text-3xl font-black leading-tight tracking-tight sm:text-4xl">
                    Bezahle nur für Kontakte, die dich interessieren.
                  </h2>
                </div>

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sky-400/15 text-2xl">
                  ⚡
                </div>
              </div>

              <div className="mt-8 space-y-4">
                {[
                  "Kostenlose Firmenregistrierung",
                  "Lead-Daten vor dem Kauf prüfen",
                  "Keine monatliche Verpflichtung",
                  "Kontaktdaten direkt nach Freischaltung",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-4"
                  >
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-400/15 text-sm font-black text-emerald-300">
                      ✓
                    </span>
                    <span className="font-semibold text-slate-100">{item}</span>
                  </div>
                ))}
              </div>

              <div className="mt-7 rounded-2xl border border-sky-400/20 bg-sky-400/[0.07] p-5">
                <div className="text-sm font-bold text-sky-300">
                  Volle Kostenkontrolle
                </div>
                <p className="mt-2 leading-7 text-slate-300">
                  Vor jeder Freischaltung siehst du, wie viele Credits die
                  Anfrage kostet.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="border-b border-white/10 bg-white/[0.025]">
        <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
          <p className="text-center text-sm font-bold uppercase tracking-[0.2em] text-slate-400">
            Für lokale Dienstleister in der ganzen Schweiz
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {services.map((service) => (
              <span
                key={service}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-slate-200"
              >
                {service}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Example leads */}
      <section className="px-6 py-20 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <span className="text-sm font-black uppercase tracking-[0.2em] text-sky-300">
              Echte Verkaufschancen
            </span>

            <h2 className="mt-5 text-4xl font-black tracking-[-0.04em] sm:text-5xl">
              Sieh zuerst, worum es beim Auftrag geht.
            </h2>

            <p className="mt-6 text-lg leading-8 text-slate-300">
              Du erhältst bereits vor dem Kauf wichtige Informationen. Erst wenn
              eine Anfrage zu deiner Firma passt, schaltest du den Kontakt frei.
            </p>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {exampleLeads.map((lead) => (
              <article
                key={`${lead.category}-${lead.location}`}
                className="group rounded-[28px] border border-white/10 bg-[#0b1226] p-6 transition hover:-translate-y-1 hover:border-sky-400/40"
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="rounded-full bg-sky-400/10 px-3 py-1.5 text-xs font-black uppercase tracking-wider text-sky-300">
                    {lead.category}
                  </span>

                  <span className="text-sm font-bold text-slate-400">
                    📍 {lead.location}
                  </span>
                </div>

                <h3 className="mt-6 text-2xl font-black tracking-tight">
                  {lead.title}
                </h3>

                <div className="mt-5 flex flex-wrap gap-2">
                  {lead.details.map((detail) => (
                    <span
                      key={detail}
                      className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-300"
                    >
                      {detail}
                    </span>
                  ))}
                </div>

                <div className="mt-7 flex items-center justify-between border-t border-white/10 pt-5">
                  <span className="font-bold text-sky-300">{lead.credits}</span>
                  <span className="text-sm font-bold text-white">
                    Kontakt freischalten →
                  </span>
                </div>
              </article>
            ))}
          </div>

          <p className="mt-5 text-sm text-slate-500">
            Beispielanfragen zur Veranschaulichung. Verfügbarkeit und
            Credit-Preise können je nach Anfrage variieren.
          </p>
        </div>
      </section>

      {/* Comparison */}
      <section className="border-y border-white/10 bg-[#080d1e] px-6 py-20 lg:px-8 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="text-sm font-black uppercase tracking-[0.2em] text-sky-300">
              Weniger Streuverlust
            </span>

            <h2 className="mt-5 text-4xl font-black tracking-[-0.04em] sm:text-5xl">
              Du kaufst keine Klicks.
              <span className="block text-slate-400">
                Du kaufst eine konkrete Verkaufschance.
              </span>
            </h2>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
              Bei klassischer Werbung bezahlst du häufig bereits für den Klick.
              Bei Auftrago prüfst du zuerst die Anfrage und entscheidest danach.
            </p>
          </div>

          <div className="overflow-hidden rounded-[28px] border border-white/10 bg-[#0b1226]">
            <div className="grid grid-cols-2 border-b border-white/10">
              <div className="p-5 text-center font-black text-slate-400">
                Klassische Werbung
              </div>
              <div className="border-l border-white/10 bg-sky-400/[0.07] p-5 text-center font-black text-sky-300">
                Auftrago
              </div>
            </div>

            {[
              ["Kosten pro Klick", "Kosten erst bei Freischaltung"],
              ["Unklare Kaufabsicht", "Konkrete Kundenanfrage"],
              ["Laufendes Werbebudget", "Keine monatlichen Fixkosten"],
              ["Viele Streuverluste", "Region und Leistung sichtbar"],
            ].map(([classic, auftrago]) => (
              <div
                key={classic}
                className="grid grid-cols-2 border-b border-white/10 last:border-b-0"
              >
                <div className="p-5 text-slate-400">{classic}</div>
                <div className="border-l border-white/10 bg-sky-400/[0.035] p-5 font-semibold text-white">
                  ✓ {auftrago}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="px-6 py-20 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <span className="text-sm font-black uppercase tracking-[0.2em] text-sky-300">
              So funktioniert Auftrago
            </span>

            <h2 className="mx-auto mt-5 max-w-4xl text-4xl font-black tracking-[-0.04em] sm:text-5xl">
              Vom Anbieterprofil bis zum neuen Kunden.
            </h2>
          </div>

          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-5">
            {[
              {
                number: "01",
                title: "Firma registrieren",
                text: "Unternehmensdaten, Dienstleistungen und Regionen erfassen.",
              },
              {
                number: "02",
                title: "Prüfung",
                text: "Auftrago prüft deine Angaben und schaltet dein Profil frei.",
              },
              {
                number: "03",
                title: "Leads ansehen",
                text: "Passende Kundenanfragen aus deinen Regionen prüfen.",
              },
              {
                number: "04",
                title: "Kontakt kaufen",
                text: "Nur interessante Kontakte mit Credits freischalten.",
              },
              {
                number: "05",
                title: "Auftrag gewinnen",
                text: "Kunden kontaktieren, Angebot senden und überzeugen.",
              },
            ].map((step) => (
              <article
                key={step.number}
                className="rounded-[24px] border border-white/10 bg-white/[0.035] p-6"
              >
                <span className="text-sm font-black text-sky-300">
                  {step.number}
                </span>
                <h3 className="mt-5 text-xl font-black">{step.title}</h3>
                <p className="mt-3 leading-7 text-slate-400">{step.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section
        id="pakete"
        className="border-y border-white/10 bg-[#080d1e] px-6 py-20 lg:px-8 lg:py-28"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-sm font-black uppercase tracking-[0.2em] text-sky-300">
              Credit-Pakete
            </span>

            <h2 className="mt-5 text-4xl font-black tracking-[-0.04em] sm:text-5xl">
              Starte klein. Wachse flexibel.
            </h2>

            <p className="mt-6 text-lg leading-8 text-slate-300">
              Keine Abos und keine monatlichen Fixkosten. Wähle das Paket, das
              zu deinem aktuellen Bedarf passt.
            </p>
          </div>

          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {packages.map((item) => (
              <article
                key={item.badge}
                className={`relative flex flex-col rounded-[30px] border p-7 sm:p-8 ${
                  item.highlighted
                    ? "border-sky-400 bg-gradient-to-b from-sky-400/[0.12] to-[#0b1226] shadow-[0_24px_80px_rgba(14,165,233,0.18)]"
                    : "border-white/10 bg-[#0b1226]"
                }`}
              >
                {item.highlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-sky-400 to-indigo-500 px-5 py-2 text-xs font-black uppercase tracking-wider text-white">
                    Beste Wahl
                  </div>
                )}

                <div className="text-sm font-black uppercase tracking-[0.18em] text-sky-300">
                  {item.badge}
                </div>

                <div className="mt-7 text-5xl font-black tracking-tight">
                  {item.price}
                </div>

                <div className="mt-2 text-xl font-black text-white">
                  {item.credits}
                </div>

                <div className="mt-1 text-sm text-slate-500">
                  {item.pricePerCredit}
                </div>

                <p className="mt-6 min-h-24 leading-7 text-slate-300">
                  {item.description}
                </p>

                <ul className="mt-7 space-y-4">
                  {item.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-3 font-semibold text-slate-200"
                    >
                      <span className="text-emerald-300">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link
                  href="/anbieter-registrieren"
                  className={`mt-9 inline-flex min-h-14 items-center justify-center rounded-2xl px-5 py-4 text-center font-black transition hover:-translate-y-0.5 ${
                    item.highlighted
                      ? "bg-gradient-to-r from-sky-400 to-indigo-500 text-white shadow-lg"
                      : "bg-white text-[#050816] hover:bg-slate-100"
                  }`}
                >
                  {item.button}
                </Link>
              </article>
            ))}
          </div>

          <div className="mx-auto mt-8 max-w-4xl rounded-2xl border border-white/10 bg-white/[0.035] p-5 text-center text-sm leading-6 text-slate-400">
            Die benötigte Anzahl Credits richtet sich nach Art, Umfang und Wert
            der Kundenanfrage. Den genauen Credit-Preis siehst du immer vor der
            Freischaltung.
          </div>
        </div>
      </section>

      {/* Example calculation */}
      <section className="px-6 py-20 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="overflow-hidden rounded-[32px] border border-sky-400/20 bg-gradient-to-br from-sky-400/[0.12] via-[#0b1226] to-indigo-500/[0.1] p-7 sm:p-10 lg:p-12">
            <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
              <div>
                <span className="text-sm font-black uppercase tracking-[0.2em] text-sky-300">
                  Beispielrechnung
                </span>

                <h2 className="mt-5 text-4xl font-black tracking-[-0.04em]">
                  Ein einziger Auftrag kann sich bereits lohnen.
                </h2>

                <p className="mt-5 leading-8 text-slate-300">
                  Du entscheidest selbst, welche Verkaufschancen wirtschaftlich
                  interessant für deine Firma sind.
                </p>
              </div>

              <div className="rounded-[26px] border border-white/10 bg-black/20 p-6 sm:p-8">
                <div className="space-y-5">
                  <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-5">
                    <span className="text-slate-400">
                      Möglicher Auftragswert
                    </span>
                    <strong className="text-2xl">CHF 950.–</strong>
                  </div>

                  <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-5">
                    <span className="text-slate-400">
                      Beispielhafte Lead-Kosten
                    </span>
                    <strong className="text-2xl text-sky-300">
                      CHF 20.– bis 35.–
                    </strong>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <span className="font-bold text-white">
                      Mögliche Verkaufschance
                    </span>
                    <strong className="text-emerald-300">
                      Hohes Ertragspotenzial
                    </strong>
                  </div>
                </div>

                <p className="mt-6 text-xs leading-5 text-slate-500">
                  Reines Rechenbeispiel ohne Erfolgs- oder Auftragsgarantie.
                  Tatsächliche Werte hängen von Anfrage, Angebot und Abschluss
                  ab.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-white/10 bg-[#080d1e] px-6 py-20 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <span className="text-sm font-black uppercase tracking-[0.2em] text-sky-300">
              Häufige Fragen
            </span>

            <h2 className="mt-5 text-4xl font-black tracking-[-0.04em] sm:text-5xl">
              Klarheit vor der Registrierung.
            </h2>
          </div>

          <div className="mt-12 space-y-4">
            {faqs.map((faq) => (
              <details
                key={faq.question}
                className="group rounded-2xl border border-white/10 bg-[#0b1226] p-6"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-5 text-lg font-black">
                  {faq.question}
                  <span className="text-2xl text-sky-300 transition group-open:rotate-45">
                    +
                  </span>
                </summary>

                <p className="mt-5 max-w-4xl border-t border-white/10 pt-5 leading-7 text-slate-300">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-6 py-20 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-6xl rounded-[36px] border border-sky-400/25 bg-gradient-to-br from-sky-400/20 via-indigo-500/10 to-[#0b1226] px-7 py-14 text-center shadow-[0_30px_100px_rgba(14,165,233,0.15)] sm:px-12">
          <span className="text-sm font-black uppercase tracking-[0.2em] text-sky-300">
            Bereit für neue Kunden?
          </span>

          <h2 className="mx-auto mt-5 max-w-4xl text-4xl font-black tracking-[-0.04em] sm:text-6xl">
            Registriere deine Firma kostenlos und entscheide selbst.
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            Erhalte passende Kundenanfragen und schalte nur diejenigen Kontakte
            frei, die wirklich zu deinem Unternehmen passen.
          </p>

          <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/anbieter-registrieren"
              className="inline-flex min-h-14 items-center justify-center rounded-2xl bg-white px-8 py-4 font-black text-[#050816] transition hover:-translate-y-0.5 hover:bg-slate-100"
            >
              Jetzt kostenlos Anbieter werden
            </Link>

            <Link
              href="/leads"
              className="inline-flex min-h-14 items-center justify-center rounded-2xl border border-white/20 bg-white/5 px-8 py-4 font-black text-white transition hover:-translate-y-0.5 hover:bg-white/10"
            >
              Aktuelle Anfragen ansehen
            </Link>
          </div>

          <p className="mt-6 text-sm text-slate-400">
            Keine Kreditkarte für die Registrierung erforderlich.
          </p>
        </div>
      </section>
    </main>
  );
}