import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import FaqSection from "@/components/seo/FaqSection";
import PriceGuidance from "@/components/seo/PriceGuidance";
import RequestTips from "@/components/seo/RequestTips";
import SeoLayout from "@/components/seo/SeoLayout";
import {
  cityProfiles,
  getCityProfile,
} from "@/data/seo/city-profiles";
import {
  getServiceProfile,
  serviceProfiles,
} from "@/data/seo/service-profiles";
import {
  breadcrumbSchema,
  serviceSchema,
  webPageSchema,
} from "@/lib/schema";
import {
  createSeoMetadata,
  serviceCityDescription,
  serviceCityTitle,
} from "@/lib/seo";
import {
  buildFaqs,
  buildSeoContent,
} from "@/lib/seo-engine/content";
import {
  getNearbyCityLinks,
  getRelatedServiceLinks,
} from "@/lib/seo-engine/internal-links";

export const revalidate = 86400;
export const dynamicParams = true;

type PageProps = {
  params: Promise<{
    service: string;
    city: string;
  }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { service: serviceSlug, city: citySlug } = await params;
  const service = getServiceProfile(serviceSlug);
  const city = getCityProfile(citySlug);

  if (!service || !city) {
    return createSeoMetadata({
      title: "Seite nicht gefunden",
      description: "Die gewünschte Dienstleistungsseite ist nicht verfügbar.",
      path: `/dienstleistung/${serviceSlug}/${citySlug}`,
      noindex: true,
      nofollow: true,
    });
  }

  return createSeoMetadata({
    title: serviceCityTitle(service.name, city.name),
    description: serviceCityDescription(service.name, city.name),
    path: `/dienstleistung/${service.slug}/${city.slug}`,
    type: "service",
    keywords: [
      `${service.name} ${city.name}`,
      `${service.name} in ${city.name}`,
      `${service.name} Offerte ${city.name}`,
      `${service.name} Anbieter ${city.name}`,
      `${service.singular} ${city.name}`,
    ],
  });
}

export async function generateStaticParams() {
  return serviceProfiles.flatMap((service) =>
    cityProfiles.map((city) => ({
      service: service.slug,
      city: city.slug,
    }))
  );
}

export default async function ServiceCityPage({ params }: PageProps) {
  const { service: serviceSlug, city: citySlug } = await params;
  const service = getServiceProfile(serviceSlug);
  const city = getCityProfile(citySlug);

  if (!service || !city) notFound();

  const content = buildSeoContent(service, city);
  const faqs = buildFaqs(service, city);
  const path = `/dienstleistung/${service.slug}/${city.slug}`;

  const breadcrumbs = [
    { label: "Startseite", href: "/" },
    { label: "Dienstleistungen", href: "/dienstleistungen" },
    { label: service.name, href: `/leistungen/${service.slug}` },
    { label: city.name, href: path },
  ];

  const schema = [
    webPageSchema({
      name: serviceCityTitle(service.name, city.name),
      description: serviceCityDescription(service.name, city.name),
      path,
    }),
    serviceSchema({
      name: `${service.name} in ${city.name}`,
      description: serviceCityDescription(service.name, city.name),
      path,
      areaServed: [city.name, city.regionName, "Schweiz"],
      category: service.category,
    }),
    breadcrumbSchema(
      breadcrumbs.map((item) => ({
        name: item.label,
        path: item.href,
      }))
    ),
  ];

  const relatedServices = getRelatedServiceLinks(
    service.slug,
    city.slug
  );
  const nearbyCities = getNearbyCityLinks(city.slug, service.slug);

  return (
    <SeoLayout breadcrumbs={breadcrumbs} schema={schema}>
      <section className="premium-section pt-4">
        <div className="container">
          <div className="relative overflow-hidden rounded-[34px] border border-white/10 bg-gradient-to-br from-sky-400/15 via-[#07101f] to-[#030816] px-6 py-12 sm:px-10 lg:px-14 lg:py-16">
            <span className="eyebrow">
              {service.category} · {city.regionName}
            </span>

            <h1 className="mt-5 max-w-5xl text-4xl font-black tracking-[-0.045em] text-white sm:text-5xl lg:text-6xl">
              {content.heroTitle}
            </h1>

            <p className="mt-6 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
              {content.heroDescription}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/offerte-anfragen" className="btn btn-primary">
                Kostenlose Anfrage erstellen
              </Link>
              <Link
                href={`/leistungen/${service.slug}`}
                className="btn btn-secondary"
              >
                Mehr über {service.name}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="premium-section">
        <div className="container grid gap-5 md:grid-cols-3">
          {service.shortBenefits.map((benefit) => (
            <article
              key={benefit}
              className="rounded-[26px] border border-white/10 bg-white/[0.035] p-6"
            >
              <h2 className="text-xl font-black text-white">{benefit}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-400">
                Passende Anbieter vergleichen und den Auftrag klar,
                nachvollziehbar und unverbindlich vorbereiten.
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="premium-section">
        <div className="container grid gap-8 lg:grid-cols-[1.25fr_0.75fr]">
          <article className="premium-provider-card">
            <span className="eyebrow">Regionaler Überblick</span>
            <h2>
              {service.name} in {city.name} sinnvoll vergleichen
            </h2>

            <p>{content.localIntro}</p>
            <p className="mt-5">{content.comparisonText}</p>

            <h3 className="mt-8 text-2xl font-black text-white">
              Geeignet für
            </h3>

            <div className="mt-5 flex flex-wrap gap-2">
              {service.suitableFor.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-sm font-semibold text-slate-300"
                >
                  {item}
                </span>
              ))}
            </div>
          </article>

          <aside className="premium-provider-card">
            <span className="eyebrow">Ablauf</span>
            <h2>In vier Schritten starten</h2>

            <div className="mt-6 space-y-5">
              {[
                "Leistung und Ort auswählen",
                "Auftrag vollständig beschreiben",
                "Termin und Kontaktdaten ergänzen",
                "Rückmeldungen vergleichen",
              ].map((step, index) => (
                <div key={step} className="flex gap-4">
                  <strong className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sky-400/15 text-sky-300">
                    {index + 1}
                  </strong>
                  <p className="pt-1 text-sm leading-6 text-slate-300">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <PriceGuidance
        title={`Was kostet ${service.name} in ${city.name}?`}
        text={content.priceIntro}
        from={service.priceFrom}
        to={service.priceTo}
        unit={service.unit}
      />

      <RequestTips
        title={`So wird deine Anfrage für ${service.name} genauer`}
        tips={service.requestTips}
      />

      <FaqSection
        items={faqs}
        title={`Häufige Fragen zu ${service.name} in ${city.name}`}
      />

      <section className="premium-section">
        <div className="container premium-provider-card">
          <span className="eyebrow">Ähnliche Leistungen</span>
          <h2>Weitere Dienstleistungen in {city.name}</h2>

          <div className="seo-link-grid">
            {relatedServices.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label} in {city.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="premium-section">
        <div className="container premium-provider-card">
          <span className="eyebrow">In der Umgebung</span>
          <h2>{service.name} in weiteren Städten</h2>

          <div className="seo-link-grid">
            {nearbyCities.map((item) => (
              <Link key={item.href} href={item.href}>
                {service.name} in {item.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="premium-final">
        <div className="container premium-final-card">
          <span className="eyebrow">Jetzt starten</span>
          <h2>{content.ctaTitle}</h2>
          <p>{content.ctaText}</p>

          <div className="actions center">
            <Link href="/offerte-anfragen" className="btn btn-primary">
              Kostenlose Offerte anfragen
            </Link>
          </div>
        </div>
      </section>
    </SeoLayout>
  );
}
