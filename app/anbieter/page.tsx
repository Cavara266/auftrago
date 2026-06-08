import Link from "next/link";
import { Metadata } from "next";
import { providerCategories } from "@/lib/provider-seo-data";

export const metadata: Metadata = {
  title: "Anbieter finden | Regionale Firmen vergleichen | Auftrago",
  description:
    "Finde regionale Anbieter für Reinigung, Hauswartung, Umzug, Gartenpflege, Entsorgung und weitere Dienstleistungen in der Schweiz.",
  alternates: {
    canonical: "https://www.auftrago.ch/anbieter",
  },
  openGraph: {
    title: "Anbieter finden | Auftrago",
    description:
      "Vergleiche regionale Dienstleister für Reinigung, Hauswartung, Umzug, Gartenpflege und weitere Aufträge.",
    url: "https://www.auftrago.ch/anbieter",
    siteName: "Auftrago",
    type: "website",
  },
};

export default function AnbieterPage() {
  return (
    <main className="seo-page">
      <section className="provider-hero">
        <div className="container provider-hero-grid">
          <div>
            <span className="seo-pill">Anbieter finden</span>

            <h1>
              Regionale Firmen
              <br />
              einfach vergleichen.
            </h1>

            <p>
              Finde passende Dienstleister für Reinigung, Hauswartung, Umzug,
              Gartenpflege, Entsorgung und weitere Aufträge. Kostenlos Anfrage
              senden und regionale Anbieter vergleichen.
            </p>

            <div className="seo-hero-actions">
              <Link href="/offerte-anfragen" className="btn btn-primary">
                Kostenlose Anfrage senden
              </Link>

              <Link href="/anbieter-registrieren" className="btn btn-secondary">
                Als Anbieter registrieren
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
            <span>Auftrago</span>
            <h2>So funktioniert der Vergleich</h2>

            <div>
              <strong>1. Auftrag beschreiben</strong>
              <p>Du erfasst deine Anfrage mit Ort, Termin und Details.</p>
            </div>

            <div>
              <strong>2. Anbieter vergleichen</strong>
              <p>Regionale Firmen können deine Anfrage prüfen.</p>
            </div>

            <div>
              <strong>3. Passende Offerte wählen</strong>
              <p>Du entscheidest selbst, welches Angebot passt.</p>
            </div>
          </aside>
        </div>
      </section>

      <section className="provider-section">
        <div className="container">
          <div className="provider-section-head">
            <span className="seo-pill">Kategorien</span>
            <h2>Beliebte Anbieter-Kategorien</h2>
            <p>
              Wähle eine Dienstleistung und finde regionale Anbieter aus deiner
              Umgebung.
            </p>
          </div>

          <div className="provider-category-grid">
            {providerCategories.map((category) => (
              <Link
                key={category.title}
                href={category.href}
                className="provider-category-card"
              >
                <div>
                  <span>Anbieter</span>
                  <h3>{category.title}</h3>
                  <p>{category.description}</p>
                </div>

                <div className="provider-tags">
                  {category.services.map((service) => (
                    <small key={service}>{service}</small>
                  ))}
                </div>

                <strong>Mehr anzeigen →</strong>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="provider-section provider-dark">
        <div className="container provider-split">
          <div>
            <span className="seo-pill">Für Kunden</span>
            <h2>Warum Anbieter über Auftrago vergleichen?</h2>
            <p>
              Statt einzelne Firmen zu suchen, mehrere Webseiten zu öffnen und
              jede Firma separat zu kontaktieren, kannst du über Auftrago eine
              strukturierte Anfrage senden. So sparst du Zeit und erhältst eine
              bessere Grundlage für den Vergleich.
            </p>
          </div>

          <div className="provider-benefits">
            <div>
              <strong>Regionale Nähe</strong>
              <p>Kurze Wege und Anbieter aus deiner Umgebung.</p>
            </div>

            <div>
              <strong>Bessere Vergleichbarkeit</strong>
              <p>Offerten und Leistungen einfacher gegenüberstellen.</p>
            </div>

            <div>
              <strong>Keine Verpflichtung</strong>
              <p>Du entscheidest selbst, ob du ein Angebot annimmst.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="provider-section">
        <div className="container provider-cta">
          <span className="seo-pill">Jetzt starten</span>
          <h2>Passende Anbieter finden</h2>
          <p>
            Beschreibe deinen Auftrag und finde regionale Firmen für deine
            Dienstleistung.
          </p>

          <div className="seo-hero-actions">
            <Link href="/offerte-anfragen" className="btn btn-primary">
              Anfrage senden
            </Link>

            <Link href="/leistungen" className="btn btn-secondary">
              Leistungen ansehen
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}