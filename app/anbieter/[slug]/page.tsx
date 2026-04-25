import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

type Provider = {
  name: string
  slug: string
  city: string
  service: string
  rating: number
  reviews: number
  description: string
  longDescription: string
  tags: string[]
  benefits: string[]
  services: string[]
  responseTime: string
  region: string
}

const providers: Provider[] = [
  {
    name: "Cavara Reinigung Zürich",
    slug: "cavara-reinigung-zuerich",
    city: "Zürich",
    service: "Reinigung",
    rating: 4.9,
    reviews: 128,
    description:
      "Professionelle Reinigungsfirma für Unterhaltsreinigung, Endreinigung und Büroreinigung in Zürich.",
    longDescription:
      "Cavara Reinigung Zürich steht für hochwertige Reinigungslösungen mit klarem Fokus auf Zuverlässigkeit, Qualität und saubere Abläufe. Ob Privatwohnung, Büro, Umzugsreinigung oder regelmässige Unterhaltsreinigung: Kunden profitieren von schneller Reaktion, transparenten Offerten und einem professionellen Auftritt.",
    tags: ["Abnahmegarantie", "Privat & Gewerbe", "Schnelle Termine"],
    benefits: [
      "Schnelle Terminvergabe in Zürich und Umgebung",
      "Saubere Kommunikation und professionelle Ausführung",
      "Geeignet für Privatkunden, Verwaltungen und Firmen",
    ],
    services: [
      "Unterhaltsreinigung",
      "Umzugsreinigung",
      "Büroreinigung",
      "Fensterreinigung",
      "Endreinigung mit Abnahmegarantie",
    ],
    responseTime: "innerhalb von 24 Stunden",
    region: "Zürich und Umgebung",
  },
]

type PageProps = {
  params: {
    slug: string
  }
}

function getProvider(slug: string) {
  return providers.find((provider) => provider.slug === slug)
}

export function generateStaticParams() {
  return providers.map((provider) => ({
    slug: provider.slug,
  }))
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const provider = getProvider(params.slug)

  if (!provider) {
    return {
      title: "Anbieter nicht gefunden",
    }
  }

  return {
    title: provider.name,
    description: `${provider.name} in ${provider.city}: ${provider.description}`,
  }
}

export default function ProviderDetailPage({ params }: PageProps) {
  const provider = getProvider(params.slug)

  if (!provider) {
    notFound()
  }

  const stats = [
    { label: "Bewertung", value: `${provider.rating.toFixed(1)}★` },
    { label: "Bewertungen", value: `${provider.reviews}+` },
    { label: "Antwortzeit", value: provider.responseTime },
    { label: "Region", value: provider.region },
  ]

  return (
    <main className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[-120px] h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute right-[-80px] top-[160px] h-[320px] w-[320px] rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute left-[-40px] top-[760px] h-[260px] w-[260px] rounded-full bg-white/5 blur-3xl" />
      </div>

      <section className="container-app section-space pt-10 sm:pt-14 lg:pt-20 pb-14 lg:pb-20">
        <div className="mb-8 flex flex-wrap items-center gap-3">
          <Link
            href="/anbieter"
            className="inline-flex items-center rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white/80 shadow-lg backdrop-blur-xl transition hover:bg-white/15 hover:text-white"
          >
            ← Zurück zu den Anbietern
          </Link>

          <span className="rounded-full bg-emerald-400/15 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300 shadow-lg">
            Verifiziert
          </span>

          <span className="rounded-full bg-white/8 px-3 py-2 text-xs uppercase tracking-[0.18em] text-white/60 shadow-lg">
            {provider.service}
          </span>

          <span className="rounded-full bg-white/8 px-3 py-2 text-xs uppercase tracking-[0.18em] text-white/60 shadow-lg">
            {provider.city}
          </span>
        </div>

        <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr] xl:items-start">
          <div>
            <h1 className="max-w-4xl text-4xl font-bold leading-[1.05] text-white sm:text-5xl lg:text-6xl">
              {provider.name}
            </h1>

            <p className="mt-6 max-w-3xl text-base leading-8 text-white/72 sm:text-lg">
              {provider.longDescription}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              {provider.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-white/8 px-4 py-2 text-sm text-white/72 shadow-lg backdrop-blur-xl"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link href="/offerte-anfragen" className="btn btn-primary">
                Jetzt Offerte anfragen
              </Link>

              <Link href="/anbieter" className="btn btn-secondary">
                Weitere Anbieter ansehen
              </Link>
            </div>
          </div>

          <div className="glass-card p-6 sm:p-7">
            <div className="rounded-[24px] bg-gradient-to-br from-white/10 to-white/5 p-6 shadow-xl">
              <p className="text-xs uppercase tracking-[0.18em] text-white/40">
                Anbieter Score
              </p>

              <div className="mt-4 flex items-end justify-between gap-4">
                <div>
                  <p className="text-5xl font-bold text-white">
                    {provider.rating.toFixed(1)}★
                  </p>
                  <p className="mt-2 text-sm text-white/55">
                    basierend auf {provider.reviews} Bewertungen
                  </p>
                </div>

                <div className="rounded-full bg-emerald-400/15 px-3 py-2 text-xs font-semibold text-emerald-300">
                  Top bewertet
                </div>
              </div>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {stats.map((item) => (
                <div
                  key={item.label}
                  className="rounded-[22px] bg-black/20 p-5 shadow-lg"
                >
                  <p className="text-xs uppercase tracking-[0.18em] text-white/40">
                    {item.label}
                  </p>
                  <p className="mt-2 text-base font-semibold text-white">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container-app pb-14 lg:pb-20">
        <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <div className="glass-card p-7 sm:p-9">
            <p className="text-sm uppercase tracking-[0.18em] text-white/40">
              Über den Anbieter
            </p>

            <h2 className="mt-3 text-3xl font-semibold text-white">
              Warum {provider.name} überzeugt
            </h2>

            <p className="mt-5 text-sm leading-8 text-white/68 sm:text-base">
              {provider.description} Kunden profitieren von klaren Abläufen,
              professioneller Kommunikation und einem Service, der auf Vertrauen
              und Resultate ausgelegt ist.
            </p>

            <div className="mt-8 grid gap-4">
              {provider.benefits.map((benefit, index) => (
                <div
                  key={benefit}
                  className="flex items-start gap-4 rounded-[22px] bg-black/20 p-4 shadow-lg"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-sm font-bold text-white">
                    0{index + 1}
                  </div>
                  <p className="pt-2 text-sm leading-7 text-white/72">
                    {benefit}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-7 sm:p-9">
            <p className="text-sm uppercase tracking-[0.18em] text-white/40">
              Leistungen
            </p>

            <h2 className="mt-3 text-3xl font-semibold text-white">
              Typische Services
            </h2>

            <div className="mt-8 grid gap-4">
              {provider.services.map((service, index) => (
                <div
                  key={service}
                  className="flex items-center justify-between rounded-[22px] bg-black/20 p-4 shadow-lg transition hover:bg-white/10"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-sm font-bold text-white">
                      0{index + 1}
                    </div>
                    <p className="text-sm font-medium text-white/88">{service}</p>
                  </div>

                  <span className="text-white/30">→</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container-app pb-14 lg:pb-20">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="glass-soft p-6">
            <p className="text-sm uppercase tracking-[0.18em] text-white/40">
              Region
            </p>
            <h3 className="mt-3 text-xl font-semibold text-white">
              Aktiv in {provider.city}
            </h3>
            <p className="mt-3 text-sm leading-7 text-white/66">
              Der Anbieter ist in {provider.region} aktiv und für regionale
              Anfragen schnell erreichbar.
            </p>
          </div>

          <div className="glass-soft p-6">
            <p className="text-sm uppercase tracking-[0.18em] text-white/40">
              Vertrauen
            </p>
            <h3 className="mt-3 text-xl font-semibold text-white">
              Starkes Bewertungsprofil
            </h3>
            <p className="mt-3 text-sm leading-7 text-white/66">
              Mit {provider.rating.toFixed(1)} Sternen und {provider.reviews}{" "}
              Bewertungen wirkt das Profil hochwertig und glaubwürdig.
            </p>
          </div>

          <div className="glass-soft p-6">
            <p className="text-sm uppercase tracking-[0.18em] text-white/40">
              Geschwindigkeit
            </p>
            <h3 className="mt-3 text-xl font-semibold text-white">
              Schnelle Rückmeldung
            </h3>
            <p className="mt-3 text-sm leading-7 text-white/66">
              Kunden erhalten meist eine Rückmeldung {provider.responseTime}.
            </p>
          </div>
        </div>
      </section>

      <section className="container-app pb-20 lg:pb-28">
        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="glass-card p-7 sm:p-9 lg:p-10">
            <p className="text-sm uppercase tracking-[0.18em] text-white/40">
              Direkt starten
            </p>

            <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
              Anfrage an passenden Anbieter senden
            </h2>

            <p className="mt-5 text-base leading-8 text-white/66">
              Beschreibe deinen Auftrag und erhalte passende Offerten von
              regionalen Firmen — schnell, kostenlos und unverbindlich.
            </p>

            <div className="mt-8 flex flex-col gap-4">
              <Link href="/offerte-anfragen" className="btn btn-primary">
                Kostenlos Offerte anfragen
              </Link>

              <Link href="/anbieter" className="btn btn-secondary">
                Weitere Anbieter vergleichen
              </Link>
            </div>
          </div>

          <div className="glass-card p-7 sm:p-9 lg:p-10">
            <p className="text-sm uppercase tracking-[0.18em] text-white/40">
              Schnellformular
            </p>

            <h2 className="mt-3 text-2xl font-semibold text-white sm:text-3xl">
              In 60 Sekunden starten
            </h2>

            <form className="mt-8 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <input className="input" placeholder="Name" />
                <input className="input" placeholder="E-Mail" />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <input className="input" placeholder="Telefon" />
                <input className="input" placeholder="Ort / Region" />
              </div>

              <textarea
                className="input"
                placeholder={`Beschreibe kurz deinen Auftrag für ${provider.name}`}
              />

              <button type="submit" className="btn btn-primary w-full">
                Anfrage kostenlos senden
              </button>

              <p className="text-center text-xs text-white/45">
                Unverbindlich • Schnell • Regional • Kostenlos
              </p>
            </form>
          </div>
        </div>
      </section>
    </main>
  )
}