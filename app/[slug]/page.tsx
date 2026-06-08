import Link from "next/link";
import { Metadata } from "next";
import {
  cities,
  cityContent,
  formatText,
  generateSlugs,
  getSeoData,
  serviceContent,
  serviceFaqs,
  services,
} from "@/lib/seo-data";

type Props = {
  params: {
    slug: string;
  };
};

export async function generateStaticParams() {
  return generateSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { serviceLabel, cityLabel } = getSeoData(params.slug);

  return {
    title: `${serviceLabel} in ${cityLabel} | Kostenlose Offerten vergleichen`,
    description: `Finde regionale Anbieter für ${serviceLabel} in ${cityLabel}. Kostenlos Anfrage senden, Offerten erhalten und passende Firmen vergleichen.`,
    alternates: {
      canonical: `https://www.auftrago.ch/${params.slug}`,
    },
    openGraph: {
      title: `${serviceLabel} in ${cityLabel} vergleichen`,
      description: `Kostenlose Anfrage für ${serviceLabel} in ${cityLabel} senden und regionale Anbieter vergleichen.`,
      url: `https://www.auftrago.ch/${params.slug}`,
      siteName: "Auftrago",
      type: "website",
    },
  };
}

export default function SeoLandingPage({ params }: Props) {
  const { service, city, serviceLabel, cityLabel, keywords } = getSeoData(
    params.slug
  );

  const relatedCities = cities.filter((item) => item !== city).slice(0, 18);
  const relatedServices = services
    .filter((item) => item !== service)
    .slice(0, 18);

  const cityText =
    cityContent[city] ||
    `${cityLabel} ist ein wichtiger regionaler Standort. Über Auftrago findest du passende Anbieter aus der Umgebung und kannst kostenlos Offerten vergleichen.`;

  const serviceText =
    serviceContent[service] ||
    `${serviceLabel} ist eine gefragte Dienstleistung. Über Auftrago kannst du passende regionale Anbieter vergleichen.`;

  const faqs =
    serviceFaqs?.[service] || [
      {
        question: "Ist die Anfrage über Auftrago kostenlos?",
        answer:
          "Ja. Du kannst deine Anfrage kostenlos und unverbindlich über Auftrago senden.",
      },
      {
        question: "Kann ich mehrere Offerten vergleichen?",
        answer:
          "Ja. Auftrago hilft dir, passende regionale Anbieter einfacher zu vergleichen.",
      },
      {
        question: "Bin ich nach der Anfrage verpflichtet?",
        answer:
          "Nein. Die Anfrage ist unverbindlich. Du entscheidest selbst, ob du ein Angebot annehmen möchtest.",
      },
    ];

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `${serviceLabel} in ${cityLabel}`,
    areaServed: cityLabel,
    provider: {
      "@type": "Organization",
      name: "Auftrago",
      url: "https://www.auftrago.ch",
    },
  };

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
        name: serviceLabel,
        item: `https://www.auftrago.ch/${service}-${city}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: cityLabel,
        item: `https://www.auftrago.ch/${params.slug}`,
      },
    ],
  };

  return (
    <main className="seo-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <section className="seo-new-hero">
        <div className="container seo-new-hero-grid">
          <div>
            <span className="seo-pill">Regionale Offerten</span>

            <h1>
              {serviceLabel} in {cityLabel}
              <br />
              Offerten vergleichen.
            </h1>

            <p>
              Finde passende Anbieter für {serviceLabel} in {cityLabel}. Erstelle
              kostenlos eine Anfrage und vergleiche regionale Firmen ohne
              Verpflichtung.
            </p>

            <div className="seo-hero-actions">
              <Link href="/offerte-anfragen" className="btn btn-primary">
                Kostenlose Offerte anfragen
              </Link>

              <Link href="/anbieter" className="btn btn-secondary">
                Anbieter werden
              </Link>
            </div>

            <div className="seo-trust-row">
              <span>✓ Kostenlos</span>
              <span>✓ Unverbindlich</span>
              <span>✓ Regionale Firmen</span>
              <span>✓ Schnelle Rückmeldungen</span>
            </div>
          </div>

          <aside className="seo-request-card">
            <span>So funktioniert es</span>
            <h2>In 3 Schritten zur Offerte</h2>

            <div>
              <strong>1. Anfrage senden</strong>
              <p>Beschreibe kurz deinen Auftrag in {cityLabel}.</p>
            </div>

            <div>
              <strong>2. Anbieter erhalten</strong>
              <p>Regionale Firmen prüfen deine Anfrage.</p>
            </div>

            <div>
              <strong>3. Offerten vergleichen</strong>
              <p>Du wählst selbst, welches Angebot passt.</p>
            </div>
          </aside>
        </div>
      </section>

      <section className="seo-new-section">
        <div className="container seo-new-grid">
          <article className="seo-main-content">
            <h2>{serviceLabel} in {cityLabel}: passende Anbieter finden</h2>

            <div className="seo-info-box">
              <p>{cityText}</p>
            </div>

            <div className="seo-info-box">
              <p>{serviceText}</p>
            </div>

            <p>
              Eine zuverlässige Firma für {serviceLabel} in {cityLabel} zu
              finden, ist oft zeitaufwendig. Viele Kunden vergleichen mehrere
              Webseiten, kontaktieren verschiedene Anbieter einzeln und warten
              anschliessend auf Rückmeldungen. Auftrago vereinfacht diesen
              Prozess: Du erstellst eine Anfrage und passende regionale Firmen
              können sich bei dir melden.
            </p>

            <p>
              Gerade bei lokalen Dienstleistungen zählt Nähe. Anbieter aus{" "}
              {cityLabel} kennen die Region, können Termine oft flexibler planen
              und reagieren bei Rückfragen schneller. Das ist besonders hilfreich
              bei kurzfristigen Einsätzen, wiederkehrenden Arbeiten oder
              Aufträgen mit klaren Terminen.
            </p>

            <div className="seo-highlight-box">
              <h3>Warum Auftrago?</h3>
              <ul>
                <li>Keine lange Suche nach einzelnen Firmen</li>
                <li>Mehrere Offerten einfacher vergleichen</li>
                <li>Regionale Anbieter aus der Umgebung</li>
                <li>Geeignet für Privatkunden und Unternehmen</li>
              </ul>
            </div>

            <h2>Typische Leistungen bei {serviceLabel}</h2>

            <div className="seo-service-grid">
              {keywords.map((keyword) => (
                <div key={keyword}>
                  <span>✓</span>
                  <strong>{keyword}</strong>
                </div>
              ))}
            </div>

            <p>
              Je genauer du deinen Auftrag beschreibst, desto besser können
              Anbieter den Aufwand einschätzen. Wichtige Angaben sind zum
              Beispiel Ort, gewünschter Termin, Objektgrösse, Umfang der Arbeiten
              und besondere Anforderungen.
            </p>

            <h2>Warum regionale Anbieter in {cityLabel} sinnvoll sind</h2>

            <p>
              Regionale Anbieter haben kurze Wege, kennen typische Anforderungen
              vor Ort und können Termine oft einfacher abstimmen. Besonders bei
              Aufträgen mit fixem Datum, wiederkehrenden Einsätzen oder
              dringenden Arbeiten ist ein Anbieter aus der Umgebung ein grosser
              Vorteil.
            </p>

            <p>
              Über Auftrago kannst du deine Anfrage einmal erfassen und passende
              Anbieter aus der Region erreichen. Dadurch sparst du Zeit und
              erhältst eine bessere Grundlage, um Preise, Leistungen und
              Verfügbarkeit zu vergleichen.
            </p>

            <h2>Für wen eignet sich Auftrago?</h2>

            <p>
              Auftrago eignet sich für Privatpersonen, Verwaltungen, Firmen und
              Eigentümer, die einen passenden Dienstleister in {cityLabel}
              suchen. Ob einmaliger Auftrag, regelmässige Arbeit oder dringende
              Anfrage: Mit einer strukturierten Anfrage erhöhst du die Chance auf
              passende Rückmeldungen.
            </p>

            <div className="seo-two-boxes">
              <div>
                <h3>Privatkunden</h3>
                <p>
                  Ideal für Wohnungen, Häuser, Umzüge, Reinigungen,
                  Gartenarbeiten oder kleinere Handwerkeraufträge.
                </p>
              </div>

              <div>
                <h3>Firmen & Verwaltungen</h3>
                <p>
                  Geeignet für wiederkehrende Einsätze, Unterhalt, Betreuung von
                  Liegenschaften und regionale Dienstleistungsaufträge.
                </p>
              </div>
            </div>

            <h2>Häufige Fragen zu {serviceLabel} in {cityLabel}</h2>

            <div className="seo-faq">
              {faqs.map((faq) => (
                <details key={faq.question}>
                  <summary>{faq.question}</summary>
                  <p>{faq.answer}</p>
                </details>
              ))}
            </div>
          </article>

          <aside className="seo-sidebar">
            <div className="seo-sidebar-card">
              <span>Kostenlos starten</span>
              <h3>Offerte für {serviceLabel} anfragen</h3>
              <p>
                Beschreibe deinen Auftrag in {cityLabel} und erhalte passende
                Rückmeldungen von regionalen Anbietern.
              </p>
              <Link href="/offerte-anfragen" className="btn btn-primary">
                Anfrage starten
              </Link>
            </div>

            <div className="seo-sidebar-card">
              <span>Beliebt</span>
              <h3>Weitere Orte</h3>
              <div className="seo-small-links">
                {relatedCities.slice(0, 10).map((relatedCity) => (
                  <Link key={relatedCity} href={`/${service}-${relatedCity}`}>
                    {formatText(relatedCity)}
                  </Link>
                ))}
              </div>
            </div>

            <div className="seo-sidebar-card">
              <span>Dienstleistungen</span>
              <h3>Ähnliche Services</h3>
              <div className="seo-small-links">
                {relatedServices.slice(0, 10).map((relatedService) => (
                  <Link key={relatedService} href={`/${relatedService}-${city}`}>
                    {formatText(relatedService)}
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="seo-links">
        <div className="container">
          <h2>Weitere beliebte Kombinationen</h2>

          <div className="seo-link-grid">
            {relatedCities.map((relatedCity) => (
              <Link key={relatedCity} href={`/${service}-${relatedCity}`}>
                {serviceLabel} in {formatText(relatedCity)}
              </Link>
            ))}

            {relatedServices.map((relatedService) => (
              <Link key={relatedService} href={`/${relatedService}-${city}`}>
                {formatText(relatedService)} in {cityLabel}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}