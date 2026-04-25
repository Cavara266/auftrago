import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Offerte anfragen",
  description:
    "Beschreibe deinen Auftrag und erhalte kostenlose Offerten von regionalen Dienstleistern in der Schweiz.",
}

const services = [
  "Reinigung",
  "Umzug",
  "Hauswartung",
  "Transport",
  "Entsorgung",
]

const trustPoints = [
  {
    title: "Kostenlos & unverbindlich",
    text: "Du sendest deine Anfrage gratis und entscheidest danach selbst, ob du eine Offerte annehmen möchtest.",
  },
  {
    title: "Passende regionale Anbieter",
    text: "Deine Anfrage wird an passende Firmen in deiner Region weitergeleitet.",
  },
  {
    title: "Schnellere Entscheidungen",
    text: "Vergleiche Angebote, Leistungen und Reaktionszeiten an einem Ort.",
  },
]

const stats = [
  {
    value: "Kostenlos",
    label: "Anfrage ohne Verpflichtung",
  },
  {
    value: "24h",
    label: "oft erste Rückmeldungen",
  },
  {
    value: "Regional",
    label: "passende Anbieter aus deiner Nähe",
  },
]

export default function RequestQuotePage() {
  return (
    <main className="relative overflow-hidden">
      <section className="section-space pt-10 sm:pt-14 lg:pt-20">
        <div className="container-app">
          <div className="grid gap-10 xl:grid-cols-[0.95fr_1.05fr] xl:items-start">
            <div>
              <div className="badge mb-7">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Kostenlos Offerte anfragen
              </div>

              <h1 className="hero-title max-w-4xl text-white">
                Erhalte passende Offerten von regionalen Anbietern.
              </h1>

              <p className="hero-text mt-7 max-w-2xl">
                Beschreibe deinen Auftrag in wenigen Sekunden und finde schneller
                die richtige Firma für Reinigung, Umzug, Hauswartung, Transport
                oder Entsorgung.
              </p>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {stats.map((item) => (
                  <div key={item.value} className="kpi-card">
                    <div className="text-2xl font-bold text-white">{item.value}</div>
                    <div className="mt-2 text-sm text-white/58">{item.label}</div>
                  </div>
                ))}
              </div>

              <div className="mt-10 grid gap-4">
                {trustPoints.map((item) => (
                  <div key={item.title} className="glass-soft p-6">
                    <h2 className="text-xl font-semibold text-white">
                      {item.title}
                    </h2>
                    <p className="mt-3 text-sm leading-7 text-white/66">
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card p-6 sm:p-8">
              <div className="mb-5 flex items-center justify-between rounded-[22px] bg-white/6 px-5 py-4 shadow-lg backdrop-blur-xl">
                <div>
                  <div className="text-xs uppercase tracking-[0.18em] text-white/40">
                    Schnellformular
                  </div>
                  <div className="mt-1 text-base font-semibold text-white">
                    Anfrage in 60 Sekunden erstellen
                  </div>
                </div>

                <span className="rounded-full bg-emerald-400/15 px-3 py-2 text-xs font-semibold text-emerald-300">
                  Gratis
                </span>
              </div>

              <form className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <input className="input" placeholder="Vorname / Name" />
                  <input className="input" placeholder="E-Mail" />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <input className="input" placeholder="Telefon" />
                  <input className="input" placeholder="Ort / Region" />
                </div>

                <select className="input" defaultValue="">
                  <option value="" disabled>
                    Dienstleistung wählen
                  </option>
                  {services.map((service) => (
                    <option key={service} value={service.toLowerCase()}>
                      {service}
                    </option>
                  ))}
                </select>

                <textarea
                  className="input"
                  placeholder="Beschreibe kurz deinen Auftrag"
                />

                <button type="submit" className="btn btn-primary w-full">
                  Kostenlos Anfrage senden
                </button>

                <p className="text-center text-xs text-white/46">
                  Unverbindlich • Schnell • Regional • Kostenlos
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      <section className="section-space pt-0">
        <div className="container-app">
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                number: "01",
                title: "Auftrag beschreiben",
                text: "Beschreibe kurz, was du brauchst und in welcher Region der Auftrag stattfindet.",
              },
              {
                number: "02",
                title: "Anfrage absenden",
                text: "Sende deine Anfrage in wenigen Sekunden kostenlos über die Plattform.",
              },
              {
                number: "03",
                title: "Offerten erhalten",
                text: "Passende Dienstleister melden sich mit Angeboten bei dir zurück.",
              },
            ].map((item) => (
              <div key={item.number} className="glass-soft p-8">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-lg font-bold text-white">
                  {item.number}
                </div>
                <h2 className="text-xl font-semibold text-white">{item.title}</h2>
                <p className="mt-3 text-sm leading-7 text-white/65">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-space pt-0">
        <div className="container-app">
          <div className="glass-card p-8 text-center sm:p-12 lg:p-16">
            <p className="text-sm uppercase tracking-[0.18em] text-white/40">
              Jetzt loslegen
            </p>

            <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
              Starte jetzt deine Anfrage und spare Zeit bei der Suche.
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-white/65 sm:text-lg">
              Kostenlos, unverbindlich und in wenigen Sekunden erstellt.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <Link href="/anbieter" className="btn btn-secondary">
                Anbieter ansehen
              </Link>

              <Link href="/" className="btn btn-primary">
                Zur Startseite
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}