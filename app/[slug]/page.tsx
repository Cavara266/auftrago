import Link from "next/link";
import { Metadata } from "next";
import {
  cities,
  formatText,
  generateSlugs,
  getSeoData,
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
    title: `${serviceLabel} ${cityLabel} | Offerten vergleichen | Auftrago`,
    description: `Finde passende Anbieter für ${serviceLabel} in ${cityLabel}. Kostenlos Anfrage senden und regionale Offerten vergleichen.`,
    alternates: {
      canonical: `https://auftrago.ch/${params.slug}`,
    },
  };
}

export default function SeoLandingPage({ params }: Props) {
  const { service, city, serviceLabel, cityLabel, keywords } = getSeoData(
    params.slug
  );

  const relatedCities = cities.filter((item) => item !== city).slice(0, 10);
  const relatedServices = services.filter((item) => item !== service).slice(0, 10);

  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `${serviceLabel} in ${cityLabel}`,
    areaServed: cityLabel,
    provider: {
      "@type": "Organization",
      name: "Auftrago",
      url: "https://auftrago.ch",
    },
  };

  return (
    <main className="seo-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <section className="seo-hero">
        <div className="container seo-hero-grid">
          <div>
            <span className="eyebrow">Regionale Offerten</span>

            <h1>
              {serviceLabel} in {cityLabel}
              <br />
              einfach vergleichen.
            </h1>

            <p>
              Du suchst zuverlässige Anbieter für {serviceLabel} in {cityLabel}?
              Auftrago hilft dir, passende regionale Dienstleister zu finden,
              Offerten zu vergleichen und schneller eine gute Entscheidung zu
              treffen.
            </p>

            <div className="seo-actions">
              <Link href="/offerte-anfragen" className="btn btn-primary">
                Kostenlose Offerte anfragen
              </Link>

              <Link href="/leistungen" className="btn btn-secondary">
                Alle Leistungen ansehen
              </Link>
            </div>
          </div>

          <aside className="seo-card">
            <strong>Deine Vorteile</strong>
            <ul>
              <li>✓ Kostenlos & unverbindlich</li>
              <li>✓ Regionale Anbieter</li>
              <li>✓ Für Privatkunden & Firmen</li>
              <li>✓ Schnelle Rückmeldung</li>
            </ul>
          </aside>
        </div>
      </section>

      <section className="seo-content">
        <div className="container seo-content-grid">
          <article>
            <h2>{serviceLabel} in {cityLabel}: passende Anbieter finden</h2>

            <p>
              Eine gute Firma für {serviceLabel} in {cityLabel} zu finden, kostet
              oft Zeit. Man muss Anbieter suchen, Webseiten vergleichen, mehrere
              Firmen kontaktieren und warten, bis Rückmeldungen kommen. Auftrago
              macht diesen Prozess einfacher: Du beschreibst deinen Auftrag einmal
              und kannst danach passende regionale Offerten vergleichen.
            </p>

            <p>
              Besonders bei lokalen Dienstleistungen zählt Nähe. Anbieter aus der
              Region kennen die Umgebung, können schneller reagieren und verstehen
              typische Anforderungen in {cityLabel}. Egal ob einmaliger Auftrag,
              regelmässiger Einsatz oder kurzfristige Anfrage — mit Auftrago
              startest du strukturiert und unkompliziert.
            </p>
          </article>

          <article>
            <h2>Typische Leistungen</h2>

            <div className="seo-keyword-grid">
              {keywords.map((keyword) => (
                <div key={keyword}>
                  <span>✓</span>
                  <strong>{keyword}</strong>
                </div>
              ))}
            </div>

            <p>
              Je genauer du deine Anfrage beschreibst, desto besser können
              Anbieter einschätzen, ob sie zu deinem Auftrag passen. So erhältst
              du relevantere Rückmeldungen und sparst Zeit beim Vergleichen.
            </p>
          </article>

          <article>
            <h2>So funktioniert Auftrago</h2>

            <div className="seo-steps">
              <div>
                <span>01</span>
                <strong>Anfrage senden</strong>
                <p>Beschreibe kurz deinen Auftrag, Ort und Wunschzeitpunkt.</p>
              </div>

              <div>
                <span>02</span>
                <strong>Anbieter erhalten</strong>
                <p>Regionale Dienstleister prüfen deine Anfrage.</p>
              </div>

              <div>
                <span>03</span>
                <strong>Offerten vergleichen</strong>
                <p>Du entscheidest selbst, welches Angebot am besten passt.</p>
              </div>
            </div>
          </article>

          <article>
            <h2>Warum regionale Anbieter wichtig sind</h2>

            <p>
              Bei {serviceLabel} in {cityLabel} ist ein regionaler Anbieter oft
              die bessere Wahl. Kurze Wege, bessere Erreichbarkeit und ein
              direkter Bezug zur Umgebung machen viele Aufträge einfacher.
              Besonders bei Reinigung, Hauswartung, Umzug, Gartenpflege,
              Transport oder Entsorgung kann die regionale Nähe entscheidend sein.
            </p>

            <ul className="seo-list">
              <li>Weniger Aufwand bei der Suche</li>
              <li>Schnellere Rückmeldungen aus deiner Region</li>
              <li>Bessere Vergleichbarkeit der Angebote</li>
              <li>Geeignet für private, gewerbliche und wiederkehrende Aufträge</li>
            </ul>
          </article>

          <article>
            <h2>Häufige Fragen zu {serviceLabel} in {cityLabel}</h2>

            <div className="seo-faq">
              <details>
                <summary>Ist die Anfrage kostenlos?</summary>
                <p>
                  Ja. Deine Anfrage über Auftrago ist kostenlos und unverbindlich.
                </p>
              </details>

              <details>
                <summary>Wie schnell bekomme ich eine Rückmeldung?</summary>
                <p>
                  Das hängt von Region, Auftrag und Verfügbarkeit ab. Eine klare
                  Anfrage erhöht die Chance auf schnelle und passende Antworten.
                </p>
              </details>

              <details>
                <summary>Kann ich mehrere Offerten vergleichen?</summary>
                <p>
                  Ja. Ziel von Auftrago ist, dir den Vergleich von regionalen
                  Anbietern einfacher zu machen.
                </p>
              </details>
            </div>
          </article>
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