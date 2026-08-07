import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  getServiceProfile,
  serviceProfiles,
} from "@/data/seo/service-profiles";

import {
  getSwissCity,
  swissCities,
} from "@/data/seo-scale/swiss-cities";

type PageProps = {
  params: Promise<{
    service: string;
    city: string;
    intent: string;
    audience: string;
    modifier: string;
  }>;
};

const intents = [
  "kosten",
  "preise",
  "offerte",
  "anbieter",
  "firma",
  "vergleich",
  "guenstig",
  "schnell",
  "professionell",
  "regional",
  "kurzfristig",
  "beratung",
] as const;

const audiences = [
  "privat",
  "gewerbe",
  "verwaltung",
  "firma",
  "eigentuemer",
  "mieter",
  "buero",
  "immobilien",
] as const;

const modifiers = [
  "finden",
  "guenstig",
  "vergleichen",
  "anfragen",
  "buchen",
  "kosten",
  "preise",
  "offerte",
  "service",
  "experten",
  "anbieter",
] as const;

type Intent = (typeof intents)[number];
type Audience = (typeof audiences)[number];
type Modifier = (typeof modifiers)[number];

const intentLabels: Record<Intent, string> = {
  kosten: "Kosten",
  preise: "Preise",
  offerte: "Offerte",
  anbieter: "Anbieter",
  firma: "Firma",
  vergleich: "Vergleich",
  guenstig: "günstig",
  schnell: "schnell",
  professionell: "professionell",
  regional: "regional",
  kurzfristig: "kurzfristig",
  beratung: "Beratung",
};

const audienceLabels: Record<Audience, string> = {
  privat: "Privatkunden",
  gewerbe: "Gewerbe",
  verwaltung: "Verwaltungen",
  firma: "Unternehmen",
  eigentuemer: "Eigentümer",
  mieter: "Mieter",
  buero: "Büros",
  immobilien: "Immobilien",
};

const modifierLabels: Record<Modifier, string> = {
  finden: "finden",
  guenstig: "günstig",
  vergleichen: "vergleichen",
  anfragen: "anfragen",
  buchen: "buchen",
  kosten: "Kosten",
  preise: "Preise",
  offerte: "Offerte",
  service: "Service",
  experten: "Experten",
  anbieter: "Anbieter",
};

function isIntent(value: string): value is Intent {
  return intents.includes(value as Intent);
}

function isAudience(value: string): value is Audience {
  return audiences.includes(value as Audience);
}

function isModifier(value: string): value is Modifier {
  return modifiers.includes(value as Modifier);
}

export const dynamic = "force-static";
export const revalidate = 86400;
export const dynamicParams = true;

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const {
    service: serviceSlug,
    city: citySlug,
    intent,
    audience,
    modifier,
  } = await params;

  const service = getServiceProfile(serviceSlug);
  const city = getSwissCity(citySlug);

  if (
    !service ||
    !city ||
    !isIntent(intent) ||
    !isAudience(audience) ||
    !isModifier(modifier)
  ) {
    return {
      title: "Seite nicht gefunden | Auftrago",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const canonical =
    `/seo/${serviceSlug}/${citySlug}/${intent}/${audience}/${modifier}`;

  const title =
    `${service.name} ${city.name} – ${intentLabels[intent]} für ${audienceLabels[audience]}`;

  const description =
    `${service.name} in ${city.name}: ${intentLabels[intent]}, regionale Anbieter und passende Angebote für ${audienceLabels[audience]}. Kostenlos und unverbindlich vergleichen.`;

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: canonical,
    },
  };
}

export default async function SeoLandingPage({
  params,
}: PageProps) {
  const {
    service: serviceSlug,
    city: citySlug,
    intent,
    audience,
    modifier,
  } = await params;

  const service = getServiceProfile(serviceSlug);
  const city = getSwissCity(citySlug);

  if (
    !service ||
    !city ||
    !isIntent(intent) ||
    !isAudience(audience) ||
    !isModifier(modifier)
  ) {
    notFound();
  }

  const requestUrl =
    `/offerte-anfragen?service=${encodeURIComponent(service.slug)}`;

  const directServiceUrl =
    `/dienstleistung/${service.slug}/${city.slug}`;


  const relatedCities = swissCities
    .filter((item) => item && item.slug && item.slug !== city.slug)
    .slice(0, 8);

  const relatedServices = serviceProfiles
    .filter((item) => item && item.slug && item.slug !== service.slug)
    .slice(0, 6);

  const canonical =
    `https://www.auftrago.ch/seo/${serviceSlug}/${citySlug}/${intent}/${audience}/${modifier}`;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Startseite",
        item: "https://www.auftrago.ch",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Dienstleistungen",
        item: "https://www.auftrago.ch/dienstleistung",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: service.name,
        item: `https://www.auftrago.ch/leistungen/${service.slug}`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: city.name,
        item: `https://www.auftrago.ch/dienstleistung/${service.slug}/${city.slug}`,
      },
      {
        "@type": "ListItem",
        position: 5,
        name: `${intentLabels[intent]} für ${audienceLabels[audience]}`,
        item: canonical,
      },
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `${service.name} in ${city.name}`,
    serviceType: service.name,
    areaServed: {
      "@type": "City",
      name: city.name,
    },
    provider: {
      "@type": "Organization",
      name: "Auftrago",
      url: "https://www.auftrago.ch",
    },
    url: canonical,
    description: `${service.name} in ${city.name}: ${intentLabels[intent]} für ${audienceLabels[audience]}. Regionale Anbieter vergleichen und kostenlos anfragen.`,
  };

  const seoFaqs = [
    {
      question: `Was kostet ${service.name} in ${city.name}?`,
      answer: `Die Kosten für ${service.name} in ${city.name} hängen von Umfang, Objektgrösse, Termin und gewünschtem Leistungsumfang ab. Über Auftrago kannst du passende regionale Anbieter vergleichen.`,
    },
    {
      question: `Wie finde ich Anbieter für ${service.name} in ${city.name}?`,
      answer: `Du kannst eine kostenlose Anfrage erstellen und passende Anbieter aus ${city.name} und Umgebung vergleichen.`,
    },
    {
      question: `Ist die Anfrage für ${service.name} unverbindlich?`,
      answer: `Ja. Die Anfrage ist kostenlos und unverbindlich. Du entscheidest selbst, ob und welches Angebot du annehmen möchtest.`,
    },
    {
      question: `Warum regionale Anbieter in ${city.name} vergleichen?`,
      answer: `Regionale Anbieter kennen die Umgebung, haben häufig kürzere Anfahrtswege und können Termine oft flexibler planen.`,
    },
    {
      question: `Welche Angaben helfen bei einer Anfrage?`,
      answer: `Beschreibe den Auftrag möglichst genau und ergänze Informationen zu Objekt, Umfang, gewünschtem Termin und besonderen Anforderungen.`,
    },
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: seoFaqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Weitere passende Dienstleistungen in ${city.name}`,
    itemListElement: relatedServices.map((relatedService, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: `${relatedService.name} ${city.name}`,
      url: `https://www.auftrago.ch/seo/${relatedService.slug}/${city.slug}/${intent}/${audience}/${modifier}`,
    })),
  };

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `${service.name} ${city.name} – ${intentLabels[intent]} für ${audienceLabels[audience]}`,
    url: canonical,
    description: `${service.name} in ${city.name}: ${intentLabels[intent]} für ${audienceLabels[audience]}.`,
    isPartOf: {
      "@type": "WebSite",
      name: "Auftrago",
      url: "https://www.auftrago.ch",
    },
  };


  const relatedIntents = intents
    .filter((item) => item !== intent)
    .slice(0, 6);

  /* SEO_INTERNAL_LINKS_FAST */

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, #07111f 0%, #102b4c 50%, #07111f 100%)",
        color: "#fff",
      }}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(serviceSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(webPageSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(itemListSchema),
        }}
      />
      <section
        style={{
          maxWidth: 1180,
          margin: "0 auto",
          padding: "80px 24px 40px",
        }}
      >
        <div
          style={{
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 28,
            padding: "48px",
            background:
              "linear-gradient(135deg, rgba(28,91,137,.75), rgba(3,11,27,.95))",
            boxShadow: "0 30px 80px rgba(0,0,0,.25)",
          }}
        >
          <div
            style={{
              display: "inline-block",
              marginBottom: 18,
              padding: "8px 14px",
              borderRadius: 999,
              border: "1px solid rgba(86,196,255,.35)",
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: 1.4,
              textTransform: "uppercase",
            }}
          >
            {service.name} · {city.canton}
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: "clamp(42px, 6vw, 72px)",
              lineHeight: 1.03,
              letterSpacing: "-0.04em",
            }}
          >
            {service.name} in {city.name} für {audienceLabels[audience]}
          </h1>

          <p
            style={{
              maxWidth: 850,
              marginTop: 24,
              fontSize: 20,
              lineHeight: 1.7,
              color: "rgba(255,255,255,.78)",
            }}
          >
            Du suchst {service.name} in {city.name}? Vergleiche regionale
            Anbieter, {modifierLabels[modifier]} passende Angebote und erhalte
            eine unverbindliche Übersicht zu {intentLabels[intent]} für{" "}
            {audienceLabels[audience]}.
          </p>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 14,
              marginTop: 32,
            }}
          >
            <Link
              href={requestUrl}
              style={{
                padding: "16px 24px",
                borderRadius: 14,
                background:
                  "linear-gradient(90deg, #39bdf8 0%, #6366f1 100%)",
                color: "#fff",
                fontWeight: 800,
                textDecoration: "none",
              }}
            >
              Kostenlose Anfrage erstellen
            </Link>

            <Link
              href={directServiceUrl}
              style={{
                padding: "16px 24px",
                borderRadius: 14,
                border: "1px solid rgba(255,255,255,.18)",
                color: "#fff",
                fontWeight: 700,
                textDecoration: "none",
                background: "rgba(255,255,255,.05)",
              }}
            >
              Mehr über {service.name}
            </Link>
          </div>
        </div>
      </section>

      <section
        style={{
          maxWidth: 1180,
          margin: "0 auto",
          padding: "40px 24px 80px",
          display: "grid",
          gap: 20,
          gridTemplateColumns:
            "repeat(auto-fit, minmax(240px, 1fr))",
        }}
      >
        <article
          style={{
            padding: 28,
            borderRadius: 22,
            border: "1px solid rgba(255,255,255,.1)",
            background: "rgba(255,255,255,.04)",
          }}
        >
          <h2>{intentLabels[intent]}</h2>
          <p style={{ color: "rgba(255,255,255,.7)", lineHeight: 1.7 }}>
            Informiere dich über {intentLabels[intent]} für {service.name} in{" "}
            {city.name} und vergleiche passende regionale Anbieter.
          </p>
        </article>

        <article
          style={{
            padding: 28,
            borderRadius: 22,
            border: "1px solid rgba(255,255,255,.1)",
            background: "rgba(255,255,255,.04)",
          }}
        >
          <h2>{audienceLabels[audience]}</h2>
          <p style={{ color: "rgba(255,255,255,.7)", lineHeight: 1.7 }}>
            Angebote können je nach Objekt, Umfang, Termin und Anforderungen
            unterschiedlich ausfallen.
          </p>
        </article>

        <article
          style={{
            padding: 28,
            borderRadius: 22,
            border: "1px solid rgba(255,255,255,.1)",
            background: "rgba(255,255,255,.04)",
          }}
        >
          <h2>Region {city.region}</h2>
          <p style={{ color: "rgba(255,255,255,.7)", lineHeight: 1.7 }}>
            Regionale Anbieter aus {city.name} und Umgebung können kurze
            Anfahrtswege und flexible Termine ermöglichen.
          </p>
        </article>
      </section>
      <section
        aria-label="Häufige Fragen"
        style={{
          maxWidth: 1180,
          margin: "0 auto",
          padding: "40px 24px 20px",
        }}
      >
        <h2 style={{ marginBottom: 24 }}>
          Häufige Fragen zu {service.name} in {city.name}
        </h2>

        <div
          style={{
            display: "grid",
            gap: 14,
          }}
        >
          {seoFaqs.map((faq) => (
            <details
              key={faq.question}
              style={{
                padding: "18px 20px",
                borderRadius: 16,
                border: "1px solid rgba(255,255,255,.12)",
                background: "rgba(255,255,255,.04)",
              }}
            >
              <summary
                style={{
                  cursor: "pointer",
                  fontWeight: 700,
                }}
              >
                {faq.question}
              </summary>

              <p
                style={{
                  marginTop: 12,
                  marginBottom: 0,
                  lineHeight: 1.7,
                  color: "rgba(255,255,255,.72)",
                }}
              >
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </section>

      <section
        aria-label="Weitere passende Seiten"
        style={{
          maxWidth: 1180,
          margin: "0 auto",
          padding: "40px 24px 80px",
        }}
      >
        <h2 style={{ marginBottom: 20 }}>
          Weitere passende Angebote
        </h2>

        <div style={{ marginBottom: 32 }}>
          <h3>{service.name} in weiteren Städten</h3>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 12,
              marginTop: 14,
            }}
          >
            {relatedCities.map((relatedCity) => (
              <Link
                key={relatedCity.slug}
                href={`/seo/${service.slug}/${relatedCity.slug}/${intent}/${audience}/${modifier}`}
                style={{
                  padding: "10px 14px",
                  border: "1px solid rgba(255,255,255,.14)",
                  borderRadius: 12,
                  color: "#fff",
                  textDecoration: "none",
                }}
              >
                {service.name} {relatedCity.name}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3>Weitere Dienstleistungen in {city.name}</h3>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 12,
              marginTop: 14,
            }}
          >
            {relatedServices.map((relatedService) => (
              <Link
                key={relatedService.slug}
                href={`/seo/${relatedService.slug}/${city.slug}/${intent}/${audience}/${modifier}`}
                style={{
                  padding: "10px 14px",
                  border: "1px solid rgba(255,255,255,.14)",
                  borderRadius: 12,
                  color: "#fff",
                  textDecoration: "none",
                }}
              >
                {relatedService.name} {city.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

    
      <section
        data-seo-internal-links="true"
        style={{
          maxWidth: 1180,
          margin: "0 auto",
          padding: "40px 24px 80px",
        }}
      >
        <h2>Weitere passende Angebote</h2>

        <div
          style={{
            display: "grid",
            gap: 24,
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          }}
        >
          <div>
            <h3>Weitere Orte</h3>
            <ul>
              {relatedCities.map((item) => (
                <li key={item.slug}>
                  <Link
                    href={`/seo/${service.slug}/${item.slug}/${intent}/${audience}/${modifier}`}
                  >
                    {service.name} {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3>Weitere Dienstleistungen</h3>
            <ul>
              {relatedServices.map((item) => (
                <li key={item.slug}>
                  <Link
                    href={`/seo/${item.slug}/${city.slug}/${intent}/${audience}/${modifier}`}
                  >
                    {item.name} {city.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3>Weitere Suchthemen</h3>
            <ul>
              {relatedIntents.map((item) => (
                <li key={item}>
                  <Link
                    href={`/seo/${service.slug}/${city.slug}/${item}/${audience}/${modifier}`}
                  >
                    {service.name} {city.name} {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
</main>
  );
}

export async function generateStaticParams() {
  return [];
}

function getSeoCombinationCount() {
  return (
    serviceProfiles.length *
    swissCities.length *
    intents.length *
    audiences.length *
    modifiers.length
  );
}
