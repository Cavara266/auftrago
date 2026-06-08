import Link from "next/link";
import { Metadata } from "next";
import { citiesSeo, getCity } from "@/lib/city-data";
import { formatText } from "@/lib/seo-data";

type Props = {
  params: {
    city: string;
  };
};

export async function generateStaticParams() {
  return citiesSeo.map((city) => ({
    city: city.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const city = getCity(params.city);

  if (!city) {
    return {
      title: "Stadt nicht gefunden | Auftrago",
    };
  }

  return {
    title: `Anbieter in ${city.name} finden | Auftrago`,
    description: `Finde regionale Anbieter für Reinigung, Hauswartung, Umzug, Gartenpflege, Entsorgung und weitere Dienstleistungen in ${city.name}.`,
    alternates: {
      canonical: `https://www.auftrago.ch/stadt/${city.slug}`,
    },
    openGraph: {
      title: `Anbieter in ${city.name} finden`,
      description: `Regionale Firmen und Dienstleister in ${city.name} vergleichen.`,
      url: `https://www.auftrago.ch/stadt/${city.slug}`,
      siteName: "Auftrago",
      type: "website",
    },
  };
}

export default function CityPage({ params }: Props) {
  const city = getCity(params.city);

  if (!city) {
    return (
      <main className="seo-page">
        <section className="container page-section-space">
          <h1>Stadt nicht gefunden</h1>
          <Link href="/region" className="btn btn-primary">
            Regionen ansehen
          </Link>
        </section>
      </main>
    );
  }

  const faqs = [
    {
      question: `Welche Anbieter finde ich in ${city.name}?`,
      answer: `Über Auftrago findest du Anbieter für Reinigung, Hauswartung, Umzug, Gartenpflege, Entsorgung und weitere Dienstleistungen in ${city.name}.`,
    },
    {
      question: `Ist die Anfrage in ${city.name} kostenlos?`,
      answer: "Ja. Die Anfrage über Auftrago ist kostenlos und unverbindlich.",
    },
    {
      question: "Kann ich mehrere Offerten vergleichen?",
      answer:
        "Ja. Du kannst Rückmeldungen verschiedener Anbieter vergleichen und selbst entscheiden.",
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
        name: city.name,
        item: `https://www.auftrago.ch/stadt/${city.slug}`,
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
            <span className="seo-pill">Stadt {city.name}</span>

            <h1>
              Anbieter in {city.name}
              <br />
              einfach vergleichen.
            </h1>

            <p>{city.description}</p>

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
            <span>Region</span>
            <h2>{city.region}</h2>
            <p>
              Finde Anbieter aus {city.name} und Umgebung für verschiedene
              Dienstleistungen.
            </p>
          </aside>
        </div>
      </section>

      <section className="provider-section">
        <div className="container">
          <div className="provider-section-head">
            <span className="seo-pill">Dienstleistungen</span>

            <h2>Beliebte Dienstleistungen in {city.name}</h2>

            <p>
              Wähle eine Dienstleistung und finde passende Anbieter aus deiner
              Umgebung.
            </p>
          </div>

          <div className="provider-category-grid">
            {city.services.map((service) => {
              const serviceLabel = formatText(service);

              return (
                <Link
                  key={service}
                  href={`/${service}-${city.slug}`}
                  className="provider-category-card"
                >
                  <div>
                    <span>Dienstleistung</span>
                    <h3>{serviceLabel} in {city.name}</h3>

                    <p>
                      Anbieter für {serviceLabel} in {city.name} vergleichen und
                      kostenlos Offerten anfragen.
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
            <span className="seo-pill">Lokaler Vergleich</span>

            <h2>Warum Anbieter in {city.name} vergleichen?</h2>

            <p>
              Regionale Anbieter kennen die Umgebung, können Termine oft besser
              planen und reagieren bei Rückfragen schneller.
            </p>

            <p>
              Statt mehrere Firmen einzeln zu kontaktieren, kannst du über
              Auftrago eine Anfrage senden und passende Anbieter einfacher
              vergleichen.
            </p>
          </div>

          <div className="provider-benefits">
            <div>
              <strong>Regionale Nähe</strong>
              <p>Anbieter aus {city.name} und Umgebung vergleichen.</p>
            </div>

            <div>
              <strong>Zeit sparen</strong>
              <p>Eine Anfrage statt viele einzelne Kontaktaufnahmen.</p>
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
          <h2>Häufige Fragen zu Anbietern in {city.name}</h2>

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

          <h2>Passende Anbieter in {city.name} finden</h2>

          <p>
            Beschreibe deinen Auftrag und finde regionale Firmen für deine
            Dienstleistung.
          </p>

          <div className="seo-hero-actions">
            <Link href="/offerte-anfragen" className="btn btn-primary">
              Kostenlose Anfrage senden
            </Link>

            <Link href="/region" className="btn btn-secondary">
              Regionen ansehen
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}