import Link from "next/link";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  cities,
  getAllSeoSlugs,
  getCityByKey,
  getServiceByKey,
  services,
} from "@/lib/seo-data";

type PageProps = {
  params: {
    slug: string;
  };
};

function getBaseUrl() {
  return process.env.NEXT_PUBLIC_APP_URL?.replace(/\/+$/, "") || "https://auftrago.ch";
}

function parseSlug(slug: string) {
  const parts = slug.split("-");
  if (parts.length < 2) return null;

  for (const service of services) {
    if (slug.startsWith(`${service.key}-`)) {
      const cityKey = slug.slice(service.key.length + 1);
      return {
        serviceKey: service.key,
        cityKey,
      };
    }
  }

  return null;
}

export async function generateStaticParams() {
  return getAllSeoSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const parsed = parseSlug(params.slug);

  if (!parsed) {
    return {
      title: "Auftrago",
    };
  }

  const service = getServiceByKey(parsed.serviceKey);
  const city = getCityByKey(parsed.cityKey);

  if (!service || !city) {
    return {
      title: "Auftrago",
    };
  }

  const title = `${service.title} in ${city.name} – Offerten vergleichen | Auftrago`;
  const description = `Erhalten Sie kostenlose Offerten für ${service.name.toLowerCase()} in ${city.name}. Auftrago verbindet Sie mit passenden Anbietern in ${city.regionLabel}.`;

  return {
    title,
    description,
    alternates: {
      canonical: `${getBaseUrl()}/${params.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `${getBaseUrl()}/${params.slug}`,
      siteName: "Auftrago",
      type: "website",
    },
  };
}

export default function SeoLandingPage({ params }: PageProps) {
  const parsed = parseSlug(params.slug);

  if (!parsed) {
    notFound();
  }

  const service = getServiceByKey(parsed.serviceKey);
  const city = getCityByKey(parsed.cityKey);

  if (!service || !city) {
    notFound();
  }

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: service.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Startseite",
        item: `${getBaseUrl()}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: `${service.title} ${city.name}`,
        item: `${getBaseUrl()}/${params.slug}`,
      },
    ],
  };

  const relatedCities = cities
    .filter((item) => item.key !== city.key)
    .slice(0, 6);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#030816] text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-10%] top-[-10%] h-[420px] w-[420px] rounded-full bg-cyan-400/12 blur-3xl" />
        <div className="absolute right-[-10%] top-[10%] h-[460px] w-[460px] rounded-full bg-sky-400/10 blur-3xl" />
        <div className="absolute bottom-[-10%] left-[20%] h-[380px] w-[380px] rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(126,200,255,0.08),transparent_35%),linear-gradient(to_bottom,rgba(255,255,255,0.02),transparent)]" />
      </div>

      <section className="relative border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 pb-12 pt-6 sm:px-6 sm:pb-16 sm:pt-8">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Link
              href="/"
              className="inline-flex w-fit items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-3 backdrop-blur sm:px-5"
            >
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#7EC8FF]" />
              <span className="text-sm font-semibold uppercase tracking-[0.24em] text-white/80">
                AUFTRAGO
              </span>
            </Link>

            <div className="flex flex-wrap gap-3">
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
              <Link
                href="/partner"
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white/80 transition hover:bg-white/10"
              >
                Anbieter werden
              </Link>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
            <div>
              <div className="inline-flex flex-wrap items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[11px] uppercase tracking-[0.24em] text-white/60 backdrop-blur sm:text-xs">
                <span className="inline-block h-2 w-2 rounded-full bg-[#7EC8FF]" />
                {service.title} in {city.name}
              </div>

              <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-[1.04] sm:text-5xl lg:text-6xl xl:text-7xl">
                {service.title} in{" "}
                <span className="bg-gradient-to-r from-white via-[#d7f0ff] to-[#7EC8FF] bg-clip-text text-transparent">
                  {city.name}
                </span>{" "}
                einfach vergleichen und passende Offerten erhalten.
              </h1>

              <p className="mt-5 max-w-3xl text-base leading-8 text-white/72 sm:text-lg md:text-xl">
                {service.intro} Mit <strong className="text-white">Auftrago</strong>{" "}
                senden Sie Ihre Anfrage in wenigen Minuten und erhalten passende
                Rückmeldungen für {service.name.toLowerCase()} in {city.regionLabel}.
              </p>

              <p className="mt-4 max-w-3xl text-sm leading-7 text-white/58 sm:text-base sm:leading-8">
                Egal ob Privatperson, Verwaltung oder Unternehmen: Auftrago hilft
                Ihnen dabei, Angebote für {service.name.toLowerCase()} in {city.name} zu
                vergleichen, Anbieter schneller zu finden und Zeit bei der Suche
                nach der passenden Lösung zu sparen.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Link
                  href="/anfrage"
                  className="inline-flex min-h-[54px] items-center justify-center rounded-2xl bg-[#7EC8FF] px-7 py-4 text-base font-semibold text-[#04101d] shadow-[0_20px_80px_rgba(126,200,255,0.28)] transition hover:bg-[#91d2ff]"
                >
                  Jetzt kostenlose Anfrage senden
                </Link>

                <Link
                  href="/partner"
                  className="inline-flex min-h-[54px] items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-7 py-4 text-base font-semibold text-white/90 backdrop-blur transition hover:bg-white/10"
                >
                  Als Anbieter registrieren
                </Link>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                  <div className="text-3xl font-semibold text-white">24h</div>
                  <div className="mt-2 text-sm leading-6 text-white/60">
                    Schnelle Rückmeldungen auf strukturierte Anfragen.
                  </div>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                  <div className="text-3xl font-semibold text-white">100%</div>
                  <div className="mt-2 text-sm leading-6 text-white/60">
                    Kostenlos für Kunden und unverbindlich anfragen.
                  </div>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                  <div className="text-3xl font-semibold text-white">CH</div>
                  <div className="mt-2 text-sm leading-6 text-white/60">
                    Fokus auf regionale Anbieter in der Schweiz.
                  </div>
                </div>
              </div>
            </div>

            <div className="relative rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.10),rgba(255,255,255,0.04))] p-5 shadow-[0_25px_120px_rgba(0,0,0,0.35)] backdrop-blur-2xl sm:p-6 md:p-7">
              <div className="absolute inset-0 rounded-[30px] bg-[radial-gradient(circle_at_top,rgba(126,200,255,0.12),transparent_45%)]" />

              <div className="relative">
                <div className="inline-flex rounded-full border border-[#7EC8FF]/25 bg-[#7EC8FF]/10 px-4 py-2 text-[11px] font-medium uppercase tracking-[0.22em] text-[#c7ebff] sm:text-xs">
                  Kostenlose Anfrage
                </div>

                <h2 className="mt-4 text-2xl font-semibold leading-tight sm:text-3xl">
                  {service.title} in {city.name} professionell anfragen
                </h2>

                <p className="mt-3 text-sm leading-7 text-white/62 sm:text-base">
                  Je klarer die Angaben zu Ort, Umfang und gewünschter Leistung,
                  desto besser die passenden Offerten. Für {service.name.toLowerCase()} in{" "}
                  {city.name} lohnt sich eine strukturierte Anfrage besonders.
                </p>

                <div className="mt-6 space-y-3">
                  {service.benefits.map((benefit) => (
                    <div
                      key={benefit}
                      className="rounded-2xl border border-white/10 bg-[#0b1328]/70 px-4 py-3 text-sm text-white/80"
                    >
                      {benefit}
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex flex-col gap-3">
                  <Link
                    href="/anfrage"
                    className="inline-flex min-h-[54px] items-center justify-center rounded-[22px] bg-[#7EC8FF] px-5 py-4 text-lg font-semibold text-[#04101d] shadow-[0_20px_80px_rgba(126,200,255,0.30)] transition hover:bg-[#91d2ff]"
                  >
                    Anfrage für {service.title} senden
                  </Link>

                  <p className="text-center text-xs leading-6 text-white/42">
                    Kostenlos für Kunden. Lokal. Schnell. Unverbindlich.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="max-w-3xl">
          <div className="text-sm uppercase tracking-[0.24em] text-white/45">
            {service.title} in {city.name}
          </div>
          <h2 className="mt-4 text-3xl font-semibold md:text-5xl">
            Warum sich eine Anfrage über Auftrago in {city.regionLabel} lohnt
          </h2>
          <p className="mt-5 text-base leading-8 text-white/68 sm:text-lg">
            Viele Menschen suchen nach {service.name.toLowerCase()} in {city.name},
            möchten aber nicht einzelne Anbieter manuell vergleichen. Genau hier
            setzt Auftrago an: Sie beschreiben Ihren Auftrag einmal und erhalten
            passende Rückmeldungen von Dienstleistern, die in {city.regionLabel} aktiv
            sind.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {[
            {
              title: "Mehr Übersicht",
              text: `Statt viele Firmen einzeln anzuschreiben, senden Sie eine strukturierte Anfrage für ${service.name.toLowerCase()} in ${city.name}.`,
            },
            {
              title: "Mehr Qualität",
              text: "Je besser Ihre Beschreibung, desto besser und präziser die Rückmeldungen von passenden Anbietern.",
            },
            {
              title: "Mehr Geschwindigkeit",
              text: `Gerade in ${city.regionLabel} ist schnelle Reaktion wichtig – mit Auftrago sparen Sie Zeit.`,
            },
            {
              title: "Mehr Vertrauen",
              text: "Ein modernes, klares Anfrage-System sorgt für professionellere Leads und bessere Angebote.",
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
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
          <div className="max-w-3xl">
            <div className="text-sm uppercase tracking-[0.24em] text-white/45">
              Ablauf
            </div>
            <h2 className="mt-4 text-3xl font-semibold md:text-5xl">
              In 3 klaren Schritten zur passenden Offerte in {city.name}
            </h2>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Anfrage erfassen",
                text: `Beschreiben Sie Ihren Auftrag für ${service.name.toLowerCase()} in ${city.name} so präzise wie möglich.`,
              },
              {
                step: "02",
                title: "Passende Anbieter erreichen",
                text: `Ihre Anfrage wird für passende Firmen in ${city.regionLabel} sichtbar und kann freigeschaltet werden.`,
              },
              {
                step: "03",
                title: "Offerten vergleichen",
                text: "Sie erhalten Rückmeldungen und können Angebote, Preis und Geschwindigkeit vergleichen.",
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
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <div className="text-sm uppercase tracking-[0.24em] text-white/45">
              Häufige Fragen
            </div>
            <h2 className="mt-4 text-3xl font-semibold md:text-5xl">
              Fragen zu {service.title} in {city.name}
            </h2>

            <div className="mt-8 space-y-4">
              {service.faqs.map((faq) => (
                <div
                  key={faq.question}
                  className="rounded-[24px] border border-white/10 bg-white/5 p-6"
                >
                  <h3 className="text-lg font-semibold">{faq.question}</h3>
                  <p className="mt-3 text-sm leading-7 text-white/65 sm:text-base">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[32px] border border-white/10 bg-[linear-gradient(135deg,rgba(126,200,255,0.18),rgba(255,255,255,0.04))] p-6 sm:p-8 md:p-10">
            <div className="text-sm uppercase tracking-[0.24em] text-white/50">
              Weitere Städte
            </div>
            <h2 className="mt-4 text-3xl font-semibold">
              {service.title} in weiteren Regionen
            </h2>
            <p className="mt-4 text-base leading-8 text-white/68">
              Auftrago ist nicht nur in {city.name} stark, sondern in vielen
              weiteren Städten und Regionen der Schweiz.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              {relatedCities.map((relatedCity) => (
                <Link
                  key={relatedCity.key}
                  href={`/${service.key}-${relatedCity.key}`}
                  className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-white/85 transition hover:bg-white/15"
                >
                  {service.title} {relatedCity.name}
                </Link>
              ))}
            </div>

            <div className="mt-8 rounded-3xl border border-white/10 bg-[#081122]/75 p-6">
              <h3 className="text-xl font-semibold">
                Anbieter für {service.title} gesucht?
              </h3>
              <p className="mt-3 text-sm leading-7 text-white/62 sm:text-base">
                Firmen können sich auf Auftrago registrieren, Credits kaufen und
                passende Leads freischalten. Gerade für {service.name.toLowerCase()}{" "}
                in {city.regionLabel} bietet die Plattform grosses Potenzial.
              </p>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/partner"
                  className="inline-flex min-h-[52px] items-center justify-center rounded-2xl bg-[#7EC8FF] px-6 py-4 text-base font-semibold text-black transition hover:bg-[#6BBEFF]"
                >
                  Anbieter werden
                </Link>
                <Link
                  href="/register"
                  className="inline-flex min-h-[52px] items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-base font-semibold text-white transition hover:bg-white/10"
                >
                  Jetzt registrieren
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 sm:pb-24">
        <div className="rounded-[34px] border border-white/10 bg-white/5 p-8 text-center backdrop-blur md:p-12">
          <div className="text-sm uppercase tracking-[0.24em] text-white/45">
            Jetzt starten
          </div>
          <h2 className="mt-4 text-3xl font-semibold md:text-5xl">
            Jetzt {service.title} in {city.name} anfragen
          </h2>
          <p className="mx-auto mt-5 max-w-3xl text-base leading-8 text-white/66 sm:text-lg">
            Nutzen Sie Auftrago, um kostenlos eine Anfrage zu senden und passende
            Anbieter für {service.name.toLowerCase()} in {city.regionLabel} zu
            finden. Je besser Ihre Anfrage, desto besser die passenden Offerten.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/anfrage"
              className="inline-flex min-h-[54px] items-center justify-center rounded-2xl bg-[#7EC8FF] px-7 py-4 text-base font-semibold text-[#04101d] shadow-[0_20px_80px_rgba(126,200,255,0.28)] transition hover:bg-[#91d2ff]"
            >
              Anfrage jetzt starten
            </Link>

            <Link
              href="/partner"
              className="inline-flex min-h-[54px] items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-7 py-4 text-base font-semibold text-white/90 transition hover:bg-white/10"
            >
              Für Anbieter
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}