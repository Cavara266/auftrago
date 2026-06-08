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
    title: `Anbieter in ${region.name} finden | Regionale Offerten vergleichen`,
    description: `Finde regionale Anbieter für Reinigung, Hauswartung, Umzug, Gartenpflege, Entsorgung und weitere Dienstleistungen in ${region.name}. Kostenlos Anfrage senden.`,
    alternates: {
      canonical: `https://www.auftrago.ch/region/${region.slug}`,
    },
    openGraph: {
      title: `Anbieter in ${region.name} finden`,
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
          <Link href="/region" className="btn btn-primary">
            Alle Regionen ansehen
          </Link>
        </section>
      </main>
    );
  }

  const topServices = services.slice(0, 14);

  const faqs = [
    {
      question: `Welche Anbieter finde ich in ${region.name}?`,
      answer: `Über Auftrago findest du regionale Anbieter für Reinigung, Hauswartung, Umzug, Gartenpflege, Fensterreinigung, Entsorgung und weitere Dienstleistungen in ${region.name}.`,
    },
    {
      question: `Ist die Anfrage in ${region.name} kostenlos?`,
      answer:
        "Ja. Die Anfrage über Auftrago ist kostenlos und unverbindlich.",
    },
    {
      question: "Kann ich mehrere Offerten vergleichen?",
      answer:
        "Ja. Du kannst Rückmeldungen und Offerten verschiedener Anbieter vergleichen und selbst entscheiden.",
    },
    {
      question: "Für wen eignet sich Auftrago?",
      answer:
        "Auftrago eignet sich für Privatkunden, Firmen, Verwaltungen und Eigentümer, die regionale Dienstleister suchen.",
    },
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
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
              einfach vergleichen.
            </h1>

            <p>{region.longDescription}</p>

            <div className="seo-hero-actions">
              <Link href="/offerte-anfragen" className="btn btn-primary">
                Kostenlose Anfrage senden
              </Link>

              <Link href="/anbieter" className="btn btn-secondary">
                Anbieter ansehen
              </Link>
            </div>

            <div className="seo-trust-row">
              <span>✓ Kostenlos</span>
              <span>✓ Regional</span>
              <span>✓ Unverbindlich</span>
              <span>✓ Für Privat & Firmen</span>
            </div>
          </div>

          <aside className="provider-hero-card">
            <span>Beliebte Orte</span>
            <h2>{region.name}</h2>

            <div className="seo-small-links">
              {region.cities.slice(0, 10).map((city) => (
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
              Finde passende Anbieter aus deiner Region und vergleiche Offerten
              für häufig gesuchte Dienstleistungen.
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
                      Anbieter für {serviceLabel} in {region.name} vergleichen
                      und passende Offerten erhalten.
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
            <span className="seo-pill">Regionale Nähe</span>

            <h2>Warum Anbieter in {region.name} vergleichen?</h2>

            <p>
              Regionale Anbieter kennen die Umgebung, können Termine oft
              flexibler planen und reagieren bei Rückfragen schneller. Gerade
              bei lokalen Dienstleistungen ist Nähe ein grosser Vorteil.
            </p>

            <p>
              In {region.name} werden regelmässig Firmen für Reinigung,
              Hauswartung, Umzug, Gartenpflege, Fensterreinigung, Transport und
              Entsorgung gesucht. Mit Auftrago kannst du deine Anfrage einmal
              erfassen und passende Anbieter einfacher vergleichen.
            </p>

            <p>
              Das spart Zeit, reduziert Rückfragen und hilft dir, eine bessere
              Entscheidung zu treffen.
            </p>
          </div>

          <div className="provider-benefits">
            <div>
              <strong>Kurze Wege</strong>
              <p>Anbieter aus {region.name} sind oft schneller verfügbar.</p>
            </div>

            <div>
              <strong>Mehr Übersicht</strong>
              <p>Leistungen, Preise und Verfügbarkeit einfacher vergleichen.</p>
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
          <div className="provider-section-head">
            <span className="seo-pill">Orte</span>

            <h2>Beliebte Orte in {region.name}</h2>

            <p>
              Auftrago hilft dir, Anbieter in der gesamten Region zu finden.
            </p>
          </div>

          <div className="provider-category-grid">
            {region.cities.map((city) => (
              <div key={city} className="provider-category-card">
                <div>
                  <span>Ort</span>
                  <h3>{city}</h3>
                  <p>
                    Anbieter für Reinigung, Hauswartung, Umzug, Gartenpflege,
                    Entsorgung und weitere Dienstleistungen in {city}.
                  </p>
                </div>

                <Link href="/offerte-anfragen">Anfrage starten →</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="provider-section provider-dark">
        <div className="container provider-split">
          <div>
            <span className="seo-pill">Für Kunden</span>

            <h2>Offerten in {region.name} einfacher vergleichen</h2>

            <p>
              Statt einzelne Firmen zu suchen und jede separat zu kontaktieren,
              kannst du über Auftrago eine strukturierte Anfrage senden. Das ist
              besonders praktisch, wenn du wenig Zeit hast oder mehrere Angebote
              vergleichen möchtest.
            </p>

            <p>
              Eine gute Anfrage enthält Angaben zu Ort, gewünschter
              Dienstleistung, Termin, Objektgrösse und besonderen Anforderungen.
              Je genauer die Angaben sind, desto besser können Anbieter den
              Auftrag einschätzen.
            </p>
          </div>

          <div className="provider-benefits">
            {region.popularServices.map((service) => (
              <div key={service}>
                <strong>{service}</strong>
                <p>
                  Offerten für {service} in {region.name} vergleichen.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="provider-section">
        <div className="container">
          <h2>Häufige Fragen zu Anbietern in {region.name}</h2>

          <div className="quote-faq">
            {faqs.map((faq) => (
              <details key={faq.question}>
                <summary>{faq.question}</summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="provider-section provider-dark">
        <div className="container provider-cta">
          <span className="seo-pill">Jetzt starten</span>

          <h2>Passende Anbieter in {region.name} finden</h2>

          <p>
            Beschreibe deinen Auftrag und finde regionale Firmen für deine
            Dienstleistung.
          </p>

          <div className="seo-hero-actions">
            <Link href="/offerte-anfragen" className="btn btn-primary">
              Kostenlose Anfrage senden
            </Link>

            <Link href="/region" className="btn btn-secondary">
              Alle Regionen ansehen
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}