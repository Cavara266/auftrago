import Link from "next/link";
import { Metadata } from "next";
import { regions } from "@/lib/region-data";

export const metadata: Metadata = {
  title: "Regionen | Anbieter in der Schweiz finden | Auftrago",
  description:
    "Finde regionale Anbieter für Reinigung, Hauswartung, Umzug, Gartenpflege, Entsorgung und weitere Dienstleistungen in Zürich, Aargau, Basel, Bern, Luzern, Zug und weiteren Regionen.",
  alternates: {
    canonical: "https://www.auftrago.ch/region",
  },
};

export default function RegionOverviewPage() {
  return (
    <main className="seo-page">
      <section className="provider-hero">
        <div className="container provider-hero-grid">
          <div>
            <span className="seo-pill">Regionen Schweiz</span>

            <h1>
              Anbieter in deiner
              <br />
              Region finden.
            </h1>

            <p>
              Vergleiche regionale Firmen für Reinigung, Hauswartung, Umzug,
              Gartenpflege, Entsorgung, Fensterreinigung und weitere
              Dienstleistungen in der Schweiz.
            </p>

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
            <span>Auftrago</span>
            <h2>Regionale Offerten</h2>
            <p>
              Wähle deine Region und finde passende Anbieter aus deiner
              Umgebung.
            </p>
          </aside>
        </div>
      </section>

      <section className="provider-section">
        <div className="container">
          <div className="provider-section-head">
            <span className="seo-pill">Alle Regionen</span>
            <h2>Beliebte Regionen auf Auftrago</h2>
            <p>
              Jede Region verlinkt auf passende Dienstleistungen und stärkt die
              internen SEO-Cluster.
            </p>
          </div>

          <div className="provider-category-grid">
            {regions.map((region) => (
              <Link
                key={region.slug}
                href={`/region/${region.slug}`}
                className="provider-category-card"
              >
                <div>
                  <span>Region</span>
                  <h3>{region.name}</h3>
                  <p>{region.description}</p>
                </div>

                <div className="provider-tags">
                  {region.cities.slice(0, 4).map((city) => (
                    <small key={city}>{city}</small>
                  ))}
                </div>

                <strong>Region ansehen →</strong>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}