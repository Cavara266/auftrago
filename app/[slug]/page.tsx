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
  return generateSlugs().map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { serviceLabel, cityLabel } = getSeoData(params.slug);

  return {
    title: `${serviceLabel} ${cityLabel} | Offerten vergleichen | Auftrago`,
    description: `Finde passende Anbieter für ${serviceLabel} in ${cityLabel}. Kostenlos, unverbindlich und regional Offerten vergleichen.`,
    alternates: {
      canonical: `https://auftrago.ch/${params.slug}`,
    },
  };
}

export default function SeoLandingPage({ params }: Props) {
  const { service, city, serviceLabel, cityLabel } = getSeoData(params.slug);

  const relatedCities = cities.filter((item) => item !== city).slice(0, 8);
  const relatedServices = services.filter((item) => item !== service).slice(0, 8);

  return (
    <main className="seo-page">
      <section className="seo-hero">
        <div className="container seo-hero-grid">
          <div>
            <span className="eyebrow">Regionale Offerten</span>

            <h1>
              {serviceLabel} in {cityLabel}
              <br />
              schnell vergleichen.
            </h1>

            <p>
              Du suchst zuverlässige Anbieter für {serviceLabel} in {cityLabel}?
              Auftrago verbindet dich mit passenden regionalen Dienstleistern.
              Kostenlos, unverbindlich und in wenigen Minuten.
            </p>

            <div className="seo-actions">
              <Link href="/anfrage" className="btn btn-primary">
                Kostenlose Offerte anfragen
              </Link>

              <Link href="/leistungen" className="btn btn-secondary">
                Leistungen ansehen
              </Link>
            </div>
          </div>

          <div className="seo-card">
            <strong>Warum Auftrago?</strong>

            <ul>
              <li>✓ Kostenlos & unverbindlich</li>
              <li>✓ Regionale Anbieter</li>
              <li>✓ Für Privatkunden & Firmen</li>
              <li>✓ Schnelle Rückmeldung</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="seo-content">
        <div className="container seo-content-grid">
          <article>
            <h2>{serviceLabel} in {cityLabel}: passende Anbieter finden</h2>

            <p>
              Wer eine passende Firma für {serviceLabel} in {cityLabel} sucht,
              möchte nicht stundenlang vergleichen. Mit Auftrago stellst du eine
              einzige Anfrage und erhältst passende Rückmeldungen von regionalen
              Dienstleistern.
            </p>

            <p>
              Ob für private Haushalte, Verwaltungen, Gewerbeobjekte oder
              Unternehmen: Auftrago hilft dir, den passenden Anbieter schneller
              zu finden und Angebote einfacher zu vergleichen.
            </p>
          </article>

          <article>
            <h2>So funktioniert es</h2>

            <div className="seo-steps">
              <div>
                <span>01</span>
                <strong>Anfrage senden</strong>
                <p>Beschreibe kurz deinen Auftrag und deine Region.</p>
              </div>

              <div>
                <span>02</span>
                <strong>Anbieter erhalten</strong>
                <p>Passende regionale Dienstleister melden sich bei dir.</p>
              </div>

              <div>
                <span>03</span>
                <strong>Offerte vergleichen</strong>
                <p>Du entscheidest selbst, welches Angebot passt.</p>
              </div>
            </div>
          </article>

          <article>
            <h2>Vorteile für {serviceLabel} in {cityLabel}</h2>

            <ul className="seo-list">
              <li>Regionale Anbieter statt lange Suche</li>
              <li>Klare Anfrage mit allen wichtigen Angaben</li>
              <li>Geeignet für private und gewerbliche Aufträge</li>
              <li>Unverbindlich starten und Angebote vergleichen</li>
            </ul>
          </article>

          <article>
            <h2>Häufige Fragen</h2>

            <div className="seo-faq">
              <details>
                <summary>Ist die Anfrage kostenlos?</summary>
                <p>Ja, deine Anfrage über Auftrago ist kostenlos und unverbindlich.</p>
              </details>

              <details>
                <summary>Wie schnell bekomme ich eine Antwort?</summary>
                <p>
                  Je nach Region und Auftrag erhältst du in der Regel zeitnah
                  Rückmeldungen von passenden Anbietern.
                </p>
              </details>

              <details>
                <summary>Für welche Aufträge ist Auftrago geeignet?</summary>
                <p>
                  Auftrago eignet sich für Reinigung, Hauswartung, Umzug,
                  Gartenpflege, Transport, Entsorgung und weitere lokale Services.
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