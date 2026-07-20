import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type Props = {
  params: {
    slug: string;
  };
};

const SITE_URL =
  process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ||
  "https://www.auftrago.ch";

function formatMemberSince(date: Date): string {
  return new Intl.DateTimeFormat("de-CH", {
    month: "long",
    year: "numeric",
  }).format(date);
}

function getInitials(companyName: string): string {
  const words = companyName
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (words.length === 0) {
    return "AP";
  }

  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }

  return `${words[0][0]}${words[1][0]}`.toUpperCase();
}

function calculateProfileStrength(provider: {
  companyName: string;
  contactName: string;
  phone: string | null;
  logoUrl: string | null;
  website: string | null;
  description: string | null;
  address: string | null;
  postalCode: string | null;
  city: string | null;
  serviceCategories: string[];
  serviceRegions: string[];
}): number {
  const checks = [
    provider.companyName,
    provider.contactName,
    provider.phone,
    provider.logoUrl,
    provider.website,
    provider.description,
    provider.address,
    provider.postalCode,
    provider.city,
    provider.serviceCategories.length > 0 ? "yes" : "",
    provider.serviceRegions.length > 0 ? "yes" : "",
  ];

  const completed = checks.filter((value) =>
    Boolean(value && value.toString().trim().length > 0)
  ).length;

  return Math.round((completed / checks.length) * 100);
}

async function getProviderBySlug(slug: string) {
  return prisma.provider.findFirst({
    where: {
      slug,
      status: "APPROVED",
    },

    select: {
      id: true,
      slug: true,
      companyName: true,
      contactName: true,
      phone: true,
      logoUrl: true,
      website: true,
      description: true,
      address: true,
      postalCode: true,
      city: true,
      region: true,
      category: true,
      serviceCategories: true,
      serviceRegions: true,
      serviceCities: true,
      servicePostalCodes: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const provider = await getProviderBySlug(params.slug);

  if (!provider || !provider.slug) {
    return {
      title: "Anbieter nicht gefunden | Auftrago",
      description:
        "Der gesuchte Anbieter konnte auf Auftrago nicht gefunden werden.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const location =
    provider.city ||
    provider.region ||
    provider.serviceRegions[0] ||
    "Schweiz";

  const description =
    provider.description?.slice(0, 155) ||
    `${provider.companyName} bietet professionelle Dienstleistungen in ${location} an. Jetzt Anbieterprofil auf Auftrago ansehen.`;

  const canonicalUrl = `${SITE_URL}/anbieter/${provider.slug}`;

  return {
    title: `${provider.companyName} in ${location} | Auftrago`,
    description,

    alternates: {
      canonical: canonicalUrl,
    },

    openGraph: {
      title: `${provider.companyName} | Auftrago`,
      description,
      url: canonicalUrl,
      siteName: "Auftrago",
      type: "website",

      images: provider.logoUrl
        ? [
            {
              url: provider.logoUrl,
              alt: `Firmenlogo von ${provider.companyName}`,
            },
          ]
        : undefined,
    },

    twitter: {
      card: "summary_large_image",
      title: `${provider.companyName} | Auftrago`,
      description,
      images: provider.logoUrl
        ? [provider.logoUrl]
        : undefined,
    },
  };
}

export default async function AnbieterDetailPage({
  params,
}: Props) {
  const provider = await getProviderBySlug(params.slug);

  if (!provider || !provider.slug) {
    notFound();
  }

  const initials = getInitials(provider.companyName);

  const memberSince = formatMemberSince(
    provider.createdAt
  );

  const profileStrength =
    calculateProfileStrength(provider);

  const location = [
    provider.postalCode,
    provider.city,
  ]
    .filter(Boolean)
    .join(" ");

  const completeAddress = [
    provider.address,
    location,
  ]
    .filter(Boolean)
    .join(", ");

  const categories = Array.from(
    new Set(
      [
        provider.category,
        ...provider.serviceCategories,
      ].filter(
        (value): value is string =>
          Boolean(value?.trim())
      )
    )
  );

  const regions = Array.from(
    new Set(
      [
        provider.region,
        ...provider.serviceRegions,
        ...provider.serviceCities,
      ].filter(
        (value): value is string =>
          Boolean(value?.trim())
      )
    )
  );

  const canonicalUrl =
    `${SITE_URL}/anbieter/${provider.slug}`;

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": canonicalUrl,
    name: provider.companyName,
    description:
      provider.description ||
      `${provider.companyName} ist ein geprüfter Anbieter auf Auftrago.`,
    url: canonicalUrl,
    telephone: provider.phone || undefined,
    image: provider.logoUrl || undefined,
    areaServed: regions.length > 0
      ? regions
      : undefined,
    address:
      provider.address ||
      provider.postalCode ||
      provider.city
        ? {
            "@type": "PostalAddress",
            streetAddress:
              provider.address || undefined,
            postalCode:
              provider.postalCode || undefined,
            addressLocality:
              provider.city || undefined,
            addressRegion:
              provider.region || undefined,
            addressCountry: "CH",
          }
        : undefined,
  };

  return (
    <main className="min-h-screen bg-[#030816] text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            localBusinessSchema
          ).replace(/</g, "\\u003c"),
        }}
      />

      <section className="relative overflow-hidden border-b border-white/10">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[-10%] top-[-30%] h-[500px] w-[500px] rounded-full bg-emerald-400/10 blur-3xl" />

          <div className="absolute right-[-10%] top-[-20%] h-[500px] w-[500px] rounded-full bg-sky-400/10 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
          <Link
            href="/anbieter"
            className="inline-flex items-center gap-2 text-sm font-bold text-emerald-200/75 transition hover:text-emerald-100"
          >
            ← Zur Anbieterübersicht
          </Link>

          <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
            <div>
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                <div className="flex h-32 w-32 shrink-0 items-center justify-center overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-emerald-400 to-sky-500 shadow-2xl">
                  {provider.logoUrl ? (
                    <img
                      src={provider.logoUrl}
                      alt={`Firmenlogo von ${provider.companyName}`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-4xl font-black">
                      {initials}
                    </span>
                  )}
                </div>

                <div>
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-emerald-200">
                      ✓ Geprüfter Anbieter
                    </span>

                    {profileStrength >= 80 ? (
                      <span className="inline-flex items-center rounded-full border border-sky-400/20 bg-sky-400/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-sky-200">
                        Starkes Profil
                      </span>
                    ) : null}
                  </div>

                  <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">
                    {provider.companyName}
                  </h1>

                  <p className="mt-3 text-base text-white/50">
                    {provider.city ||
                      provider.region ||
                      "Schweiz"}
                  </p>
                </div>
              </div>

              <p className="mt-8 max-w-3xl whitespace-pre-line text-lg leading-8 text-white/60">
                {provider.description ||
                  `${provider.companyName} bietet professionelle Dienstleistungen für Privatpersonen, Unternehmen und Verwaltungen an.`}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/offerte-anfragen"
                  className="inline-flex min-h-[52px] items-center justify-center rounded-2xl bg-gradient-to-r from-emerald-400 to-sky-500 px-6 py-3 text-sm font-black text-[#03111a] transition hover:-translate-y-0.5"
                >
                  Offerte anfragen
                </Link>

                {provider.website ? (
                  <a
                    href={provider.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[52px] items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] px-6 py-3 text-sm font-bold text-white transition hover:bg-white/10"
                  >
                    Webseite besuchen ↗
                  </a>
                ) : null}
              </div>
            </div>

            <aside className="rounded-[30px] border border-white/10 bg-white/[0.045] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.25)]">
              <div className="text-xs font-bold uppercase tracking-[0.15em] text-emerald-200/70">
                Anbieterprofil
              </div>

              <h2 className="mt-2 text-2xl font-semibold">
                Kontakt & Details
              </h2>

              <div className="mt-6 space-y-3">
                {provider.contactName ? (
                  <div className="rounded-2xl bg-white/[0.045] p-4">
                    <div className="text-xs font-bold uppercase tracking-[0.12em] text-white/30">
                      Ansprechpartner
                    </div>

                    <div className="mt-1 font-semibold text-white/80">
                      {provider.contactName}
                    </div>
                  </div>
                ) : null}

                {provider.phone ? (
                  <a
                    href={`tel:${provider.phone}`}
                    className="block rounded-2xl bg-white/[0.045] p-4 transition hover:bg-white/[0.075]"
                  >
                    <div className="text-xs font-bold uppercase tracking-[0.12em] text-white/30">
                      Telefonnummer
                    </div>

                    <div className="mt-1 font-semibold text-emerald-200">
                      {provider.phone}
                    </div>
                  </a>
                ) : null}

                {completeAddress ? (
                  <div className="rounded-2xl bg-white/[0.045] p-4">
                    <div className="text-xs font-bold uppercase tracking-[0.12em] text-white/30">
                      Standort
                    </div>

                    <div className="mt-1 text-white/70">
                      {completeAddress}
                    </div>
                  </div>
                ) : null}

                <div className="rounded-2xl bg-white/[0.045] p-4">
                  <div className="text-xs font-bold uppercase tracking-[0.12em] text-white/30">
                    Mitglied seit
                  </div>

                  <div className="mt-1 text-white/70">
                    {memberSince}
                  </div>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-white/10 bg-black/10 p-4">
                <div className="flex items-center justify-between gap-4 text-xs">
                  <span className="font-bold uppercase tracking-[0.12em] text-white/35">
                    Profil vollständig
                  </span>

                  <span className="font-black text-emerald-200">
                    {profileStrength}%
                  </span>
                </div>

                <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-300 to-sky-400"
                    style={{
                      width: `${Math.max(
                        4,
                        profileStrength
                      )}%`,
                    }}
                  />
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-8">
            <article className="rounded-[30px] border border-white/10 bg-[#0a1325] p-6 sm:p-8">
              <div className="text-xs font-bold uppercase tracking-[0.15em] text-sky-200/70">
                Leistungen
              </div>

              <h2 className="mt-2 text-3xl font-semibold">
                Dienstleistungen
              </h2>

              {categories.length > 0 ? (
                <div className="mt-7 grid gap-3 sm:grid-cols-2">
                  {categories.map((service) => (
                    <div
                      key={service}
                      className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4"
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-400/10 text-emerald-200">
                        ✓
                      </span>

                      <strong className="text-white/80">
                        {service}
                      </strong>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-5 leading-7 text-white/50">
                  Dieser Anbieter hat seine Leistungen noch nicht vollständig hinterlegt.
                </p>
              )}
            </article>

            <article className="rounded-[30px] border border-white/10 bg-[#0a1325] p-6 sm:p-8">
              <div className="text-xs font-bold uppercase tracking-[0.15em] text-indigo-200/70">
                Unternehmen
              </div>

              <h2 className="mt-2 text-3xl font-semibold">
                Über {provider.companyName}
              </h2>

              <p className="mt-6 whitespace-pre-line text-base leading-8 text-white/55">
                {provider.description ||
                  `${provider.companyName} unterstützt Kundinnen und Kunden mit professionellen Dienstleistungen. Über Auftrago können passende Aufträge und regionale Fachbetriebe unkompliziert zusammenfinden.`}
              </p>
            </article>

            <article className="rounded-[30px] border border-white/10 bg-[#0a1325] p-6 sm:p-8">
              <div className="text-xs font-bold uppercase tracking-[0.15em] text-emerald-200/70">
                Einsatzgebiet
              </div>

              <h2 className="mt-2 text-3xl font-semibold">
                Regionen und Orte
              </h2>

              {regions.length > 0 ? (
                <div className="mt-6 flex flex-wrap gap-3">
                  {regions.map((region) => (
                    <span
                      key={region}
                      className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-sm font-bold text-white/65"
                    >
                      📍 {region}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="mt-5 leading-7 text-white/50">
                  Das genaue Einsatzgebiet wurde noch nicht hinterlegt.
                </p>
              )}
            </article>
          </div>

          <aside className="lg:sticky lg:top-8 lg:self-start">
            <div className="rounded-[30px] border border-emerald-400/20 bg-gradient-to-br from-emerald-400/15 to-sky-400/10 p-6">
              <div className="text-xs font-bold uppercase tracking-[0.15em] text-emerald-200">
                Anfrage starten
              </div>

              <h2 className="mt-3 text-2xl font-semibold">
                Passende Offerte erhalten
              </h2>

              <p className="mt-3 leading-7 text-white/55">
                Beschreibe deinen Auftrag und erhalte Rückmeldungen von passenden Anbietern aus deiner Region.
              </p>

              <Link
                href="/offerte-anfragen"
                className="mt-6 flex min-h-[52px] w-full items-center justify-center rounded-2xl bg-white px-5 py-3 text-sm font-black text-[#04101d] transition hover:bg-emerald-100"
              >
                Anfrage kostenlos senden
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}