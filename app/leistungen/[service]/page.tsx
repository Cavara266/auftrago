import Link from "next/link";
import { Metadata } from "next";
import {
  cities,
  formatText,
  services,
  serviceContent,
  serviceFaqs,
  serviceKeywords,
} from "@/lib/seo-data";

type Props = {
  params: {
    service: string;
  };
};

export async function generateStaticParams() {
  return services.map((service) => ({
    service,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const serviceLabel = formatText(params.service);

  return {
    title: `${serviceLabel} Schweiz | Anbieter vergleichen | Auftrago`,
    description: `Finde regionale Anbieter für ${serviceLabel} in der Schweiz. Kostenlos Anfrage senden und passende Offerten vergleichen.`,
    alternates: {
      canonical: `https://www.auftrago.ch/leistungen/${params.service}`,
    },
  };
}

export default function ServiceHubPage({ params }: Props) {
  const service = params.service;
  const serviceLabel = formatText(service);

  const serviceText =
    serviceContent[service] ||
    `${serviceLabel} ist eine gefragte Dienstleistung. Über Auftrago kannst du passende regionale Anbieter vergleichen.`;

  const keywords = serviceKeywords[service] || [serviceLabel];
  const faqs =
    serviceFaqs[service] || [
      {
        question: `Was kostet ${serviceLabel}?`,
        answer:
          "Die Kosten hängen von Region, Umfang, Objektgrösse und Termin ab.",
      },
      {
        question: "Ist die Anfrage kostenlos?",
        answer: "Ja. Die Anfrage über Auftrago ist kostenlos und unverbindlich.",
      },
      {
        question: "Kann ich mehrere Offerten vergleichen?",
        answer: "Ja. Du kannst regionale Anbieter einfacher vergleichen.",
      },
    ];

  const topCities = cities.slice(0, 30);

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

  return (
    <main className="seo-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <section className="provider-hero">
        <div className="container provider-hero-grid">
          <div>
            <span className="seo-pill">Dienstleistung Schweiz</span>

            <h1>
              {serviceLabel}
              <br />
              Anbieter vergleichen.
            </h1>

            <p>
              Finde regionale Anbieter für {serviceLabel} in der Schweiz.
              Erstelle kostenlos eine Anfrage und vergleiche passende Offerten.
            </p>

            <div className="seo-hero-actions">
              <Link href="/offerte-anfragen" className="btn btn-primary">
                Kostenlose Anfrage senden
              </Link>

              <Link href="/leistungen" className="btn btn-secondary">
                Alle Leistungen ansehen
              </Link>
            </div>
          </div>

          <aside className="provider-hero-card">
            <span>Beliebte Orte</span>
            <h2>{serviceLabel} nach Region</h2>

            <div className="seo-small-links">
              {topCities.slice(0, 10).map((city) => (
                <Link key={city} href={`/${service}-${city}`}>
                  {formatText(city)}
                </Link>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <section className="provider-section">
        <div className="container provider-split">
          <div>
            <span className="seo-pill">Übersicht</span>

            <h2>{serviceLabel} in der Schweiz finden</h2>

            <p>{serviceText}</p>

            <p>
              Über Auftrago kannst du deinen Auftrag einmal erfassen und
              passende Anbieter aus deiner Region erreichen. Das spart Zeit und
              macht den Vergleich einfacher.
            </p>
          </div>

          <div className="provider-benefits">
            {keywords.map((keyword) => (
              <div key={keyword}>
                <strong>{keyword}</strong>
                <p>
                  Anbieter für {keyword} finden und passende Offerten
                  vergleichen.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="provider-section provider-dark">
        <div className="container">
          <div className="provider-section-head">
            <span className="seo-pill">Städte</span>

            <h2>{serviceLabel} in beliebten Städten</h2>

            <p>
              Wähle deine Stadt und finde passende Anbieter für {serviceLabel}.
            </p>
          </div>

          <div className="provider-category-grid">
            {topCities.map((city) => (
              <Link
                key={city}
                href={`/${service}-${city}`}
                className="provider-category-card"
              >
                <div>
                  <span>Stadt</span>
                  <h3>{formatText(city)}</h3>
                  <p>
                    Anbieter für {serviceLabel} in {formatText(city)}
                    vergleichen.
                  </p>
                </div>

                <strong>Mehr anzeigen →</strong>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="provider-section">
        <div className="container">
          <h2>Häufige Fragen zu {serviceLabel}</h2>

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

          <h2>Offerte für {serviceLabel} anfragen</h2>

          <p>
            Beschreibe deinen Auftrag und finde passende Anbieter in deiner
            Region.
          </p>

          <div className="seo-hero-actions">
            <Link href="/offerte-anfragen" className="btn btn-primary">
              Kostenlose Anfrage senden
            </Link>

            <Link href="/leistungen" className="btn btn-secondary">
              Weitere Leistungen ansehen
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}