import Link from "next/link";
import { Metadata } from "next";
import { providers } from "@/lib/provider-seo-data";

export const metadata: Metadata = {
  title: "Anbieter finden | Auftrago",
  description:
    "Finde regionale Anbieter für Reinigung, Hauswartung, Umzug, Gartenpflege und weitere Dienstleistungen in der Schweiz.",
  alternates: {
    canonical: "https://www.auftrago.ch/anbieter",
  },
};

export default function AnbieterPage() {
  return (
    <main className="seo-page">
      <section className="seo-new-hero">
        <div className="container">
          <span className="seo-pill">Anbieter</span>

          <h1>
            Regionale Anbieter
            <br />
            auf Auftrago finden.
          </h1>

          <p>
            Vergleiche Dienstleister aus deiner Region und finde passende Firmen
            für Reinigung, Hauswartung, Umzug, Gartenpflege und weitere
            Aufträge.
          </p>

          <div className="seo-hero-actions">
            <Link href="/offerte-anfragen" className="btn btn-primary">
              Offerte anfragen
            </Link>

            <Link href="/anbieter-registrieren" className="btn btn-secondary">
              Anbieter werden
            </Link>
          </div>
        </div>
      </section>

      <section className="seo-new-section">
        <div className="container">
          <div className="seo-link-grid">
            {providers.map((provider) => (
              <Link key={provider.slug} href={`/anbieter/${provider.slug}`}>
                {provider.name} · {provider.region}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}