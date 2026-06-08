import Link from "next/link";
import { Metadata } from "next";
import { regions, getRegion } from "@/lib/region-data";
import { services, formatText } from "@/lib/seo-data";

type Props = {
  params: {
    slug: string;
  };
};

export async function generateStaticParams() {
  return regions.map((region) => ({
    slug: region.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const region = getRegion(params.slug);

  if (!region) {
    return {
      title: "Region nicht gefunden | Auftrago",
    };
  }

  return {
    title: `Anbieter in ${region.name} finden | Auftrago`,
    description: `Finde regionale Anbieter für Reinigung, Hauswartung, Umzug, Gartenpflege, Entsorgung und weitere Dienstleistungen in ${region.name}.`,
    alternates: {
      canonical: `https://www.auftrago.ch/region/${region.slug}`,
    },
    openGraph: {
      title: `Anbieter in ${region.name}`,
      description: `Regionale Firmen und Dienstleister in ${region.name} vergleichen.`,
      url: `https://www.auftrago.ch/region/${region.slug}`,
      siteName: "Auftrago",
      type: "website",
    },
  };
}

export default function RegionPage({ params }: Props) {
  const region = getRegion(params.slug);

  if (!region) {
    return (
      <main className="seo-page">
        <section className="container page-section-space">
          <h1>Region nicht gefunden</h1>
        </section>
      </main>
    );
  }

  const topServices = services.slice(0, 12);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `Welche Anbieter gibt es in ${region.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Über Auftrago findest du regionale Anbieter für Reinigung, Hauswartung, Umzug, Gartenpflege und weitere Dienstleistungen in ${region.name}.`,
        },
      },
      {
        "@type": "Question",
        name: "Ist die Anfrage kostenlos?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Ja. Die Anfrage ist kostenlos und unverbindlich.",
        },
      },
      {
        "@type": "Question",
        name: "Kann ich mehrere Offerten vergleichen?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Ja. Du kannst mehrere Anbieter vergleichen und selbst entscheiden.",
        },
      },
    ],
  };

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
        name: "Regionen",
        item: "https://www.auftrago.ch/region",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: region.name,
        item: `https://www.auftrago.ch/region/${region.slug}`,
      },
    ],
  };

  return (
    <main className="seo-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <section className="provider-hero">
        <div className="container provider-hero-grid">
          <div>
            <span className="seo-pill">Region {region.name}</span>

            <h1>
              Anbieter in {region.name}
              <br />
              einfach finden.
            </h1>

            <p>{region.description}</p>

            <div className="seo-hero-actions">
              <Link href="/offerte-anfragen" className="btn btn-primary">
                Kostenlose Anfrage senden
              </Link>

              <Link href="/anbieter" className="btn btn-secondary">
                Anbieter ansehen
              </Link>
            </div>
          </div>

          <aside className="provider-hero-card">
            <span>Regionale Orte</span>
            <h2>Beliebte Orte</h2>

            <div className="seo-small-links">
              {region.cities.slice(0, 8).map((city) => (
                <Link key={city} href="/offerte-anfragen">
                  {city}
                </Link>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <section className="provider-section">
        <div className="container">
          <div className="provider-section-head">
            <span className="seo-pill">Dienstleistungen</span>

            <h2>Beliebte Dienstleistungen in {region.name}</h2>

            <p>
              Finde passende Anbieter aus deiner Region und vergleiche
              verschiedene Offerten für Reinigung, Hauswartung, Umzug,
              Gartenpflege, Entsorgung und weitere Dienstleistungen.
            </p>
          </div>

          <div className="provider-category-grid">
            {topServices.map((service) => {
              const serviceLabel = formatText(service);

              return (
                <Link
                  key={service}
                  href={`/${service}-${region.slug}`}
                  className="provider-category-card"
                >
                  <div>
                    <span>Dienstleistung</span>
                    <h3>{serviceLabel}</h3>

                    <p>
                      Anbieter für {serviceLabel} in {region.name} vergleichen.
                    </p>
                  </div>

                  <strong>Mehr anzeigen →</strong>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="provider-section provider-dark">
        <div className="container provider-split">
          <div>
            <span className="seo-pill">Vergleich</span>

            <h2>Warum Anbieter in {region.name} vergleichen?</h2>

            <p>
              Auftrago hilft Privatpersonen, Verwaltungen und Unternehmen dabei,
              passende regionale Anbieter schneller zu finden.
            </p>

            <p>
              Statt verschiedene Firmen einzeln anzufragen, kannst du deinen
              Auftrag einmal erfassen und verschiedene Angebote vergleichen.
            </p>

            <p>
              Besonders bei Reinigung, Hauswartung, Umzug, Fensterreinigung,
              Gartenpflege oder Entsorgung spart das Zeit und erleichtert den
              Vergleich.
            </p>
          </div>

          <div className="provider-benefits">
            <div>
              <strong>Regionale Nähe</strong>
              <p>Anbieter aus {region.name} kennen die Umgebung.</p>
            </div>

            <div>
              <strong>Mehr Vergleich</strong>
              <p>Leistungen und Offerten einfacher gegenüberstellen.</p>
            </div>

            <div>
              <strong>Unverbindlich</strong>
              <p>Du entscheidest selbst, ob ein Angebot passt.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="provider-section">
        <div className="container">
          <h2>Häufige Fragen</h2>

          <div className="quote-faq">
            <details>
              <summary>Welche Anbieter finde ich in {region.name}?</summary>
              <p>
                Regionale Firmen für Reinigung, Hauswartung, Gartenpflege,
                Umzug, Entsorgung und weitere Dienstleistungen.
              </p>
            </details>

            <details>
              <summary>Ist die Anfrage kostenlos?</summary>
              <p>
                Ja. Die Anfrage über Auftrago ist kostenlos und unverbindlich.
              </p>
            </details>

            <details>
              <summary>Kann ich mehrere Offerten erhalten?</summary>
              <p>Ja. Mehrere Anbieter können auf deine Anfrage reagieren.</p>
            </details>
          </div>
        </div>
      </section>
    </main>
  );
}