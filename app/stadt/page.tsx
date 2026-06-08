import Link from "next/link";
import { Metadata } from "next";
import { citiesSeo } from "@/lib/city-data";

export const metadata: Metadata = {
  title: "Städte | Anbieter in deiner Stadt finden | Auftrago",
  description:
    "Finde regionale Anbieter für Reinigung, Hauswartung, Umzug, Gartenpflege, Entsorgung und weitere Dienstleistungen in Schweizer Städten.",
  alternates: {
    canonical: "https://www.auftrago.ch/stadt",
  },
  openGraph: {
    title: "Städte | Anbieter finden | Auftrago",
    description:
      "Vergleiche regionale Dienstleister in Zürich, Uster, Bülach, Aarau, Baden, Basel, Bern, Luzern, Zug und weiteren Städten.",
    url: "https://www.auftrago.ch/stadt",
    siteName: "Auftrago",
    type: "website",
  },
};

export default function StadtOverviewPage() {
  return (
    <main className="seo-page">
      <section className="provider-hero">
        <div className="container provider-hero-grid">
          <div>
            <span className="seo-pill">Städte Schweiz</span>

            <h1>
              Anbieter in deiner
              <br />
              Stadt finden.
            </h1>

            <p>
              Vergleiche regionale Firmen für Reinigung, Hauswartung, Umzug,
              Gartenpflege, Entsorgung, Fensterreinigung und weitere
              Dienstleistungen direkt in deiner Stadt.
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

          <aside className="provider-hero-card">
            <span>Auftrago</span>
            <h2>Lokale Offerten</h2>
            <p>
              Wähle deine Stadt und finde passende Anbieter aus deiner Umgebung.
            </p>
          </aside>
        </div>
      </section>

      <section className="provider-section">
        <div className="container">
          <div className="provider-section-head">
            <span className="seo-pill">Alle Städte</span>
            <h2>Beliebte Städte auf Auftrago</h2>
            <p>
              Jede Stadtseite verlinkt auf passende Dienstleistungen und stärkt
              die lokalen SEO-Cluster.
            </p>
          </div>

          <div className="provider-category-grid">
            {citiesSeo.map((city) => (
              <Link
                key={city.slug}
                href={`/stadt/${city.slug}`}
                className="provider-category-card"
              >
                <div>
                  <span>{city.region}</span>
                  <h3>{city.name}</h3>
                  <p>{city.description}</p>
                </div>

                <div className="provider-tags">
                  {city.services.slice(0, 4).map((service) => (
                    <small key={service}>{service}</small>
                  ))}
                </div>

                <strong>Stadt ansehen →</strong>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}