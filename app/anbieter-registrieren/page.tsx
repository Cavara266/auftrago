import type { Metadata } from "next";
import AnbieterRegistrierenForm from "@/components/anbieter-registrieren-form";

export const metadata: Metadata = {
  title: "Als Anbieter registrieren | Neue Kundenanfragen erhalten",
  description:
    "Registriere deine Firma auf Auftrago und erhalte passende Kundenanfragen für Reinigung, Hauswartung, Umzug, Gartenpflege, Entsorgung und weitere Dienstleistungen.",
  alternates: {
    canonical: "https://www.auftrago.ch/anbieter-registrieren",
  },
  openGraph: {
    title: "Als Anbieter registrieren | Auftrago",
    description:
      "Erhalte regionale Kundenanfragen für deine Dienstleistung in der Schweiz.",
    url: "https://www.auftrago.ch/anbieter-registrieren",
    siteName: "Auftrago",
    type: "website",
  },
};

export default function AnbieterRegistrierenPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Für welche Firmen ist Auftrago geeignet?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Auftrago eignet sich für Reinigungsfirmen, Hauswartungen, Umzugsfirmen, Gartenbauer, Entsorgungsbetriebe, Fensterreiniger, Maler, Sanitärbetriebe und weitere regionale Dienstleister.",
        },
      },
      {
        "@type": "Question",
        name: "Wie funktioniert die Anbieter-Registrierung?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Du sendest deine Firmendaten über das Formular. Auftrago prüft die Angaben und meldet sich persönlich bei dir.",
        },
      },
      {
        "@type": "Question",
        name: "Erhalte ich direkt Kundenanfragen?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Nach der Prüfung kannst du passende regionale Kundenanfragen erhalten, sofern sie zu deinen Dienstleistungen und Regionen passen.",
        },
      },
    ],
  };

  return (
    <main className="seo-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />

      <section className="provider-hero">
        <div className="container provider-hero-grid">
          <div>
            <span className="seo-pill">Für Anbieter</span>

            <h1>
              Neue Kundenanfragen
              <br />
              für deine Firma.
            </h1>

            <p>
              Registriere deine Firma auf Auftrago und erhalte passende
              Kundenanfragen aus deiner Region. Ideal für Reinigung,
              Hauswartung, Umzug, Gartenpflege, Entsorgung, Fensterreinigung und
              weitere Dienstleistungen.
            </p>

            <div className="seo-trust-row">
              <span>✓ Regionale Leads</span>
              <span>✓ Mehr Sichtbarkeit</span>
              <span>✓ Passende Anfragen</span>
              <span>✓ Für Schweizer Firmen</span>
            </div>
          </div>

          <aside className="provider-hero-card">
            <span>Auftrago</span>
            <h2>So funktioniert es</h2>

            <div>
              <strong>1. Firma eintragen</strong>
              <p>Du sendest deine Firmendaten und Dienstleistungen.</p>
            </div>

            <div>
              <strong>2. Prüfung durch Auftrago</strong>
              <p>Wir prüfen, ob deine Angaben vollständig sind.</p>
            </div>

            <div>
              <strong>3. Anfragen erhalten</strong>
              <p>Passende Kundenanfragen können an dich weitergeleitet werden.</p>
            </div>
          </aside>
        </div>
      </section>

      <section className="provider-section">
        <div className="container provider-split">
          <div>
            <span className="seo-pill">Warum Auftrago?</span>

            <h2>Mehr relevante Kunden statt Streuverlust.</h2>

            <p>
              Viele Firmen investieren Zeit in Werbung, erhalten aber unpassende
              Anfragen. Auftrago ist darauf ausgelegt, Kundenanfragen
              strukturierter zu erfassen und regional passenden Anbietern
              zuzuordnen.
            </p>

            <p>
              Besonders für lokale Dienstleister ist Nähe entscheidend. Kunden
              suchen häufig Firmen in ihrer Umgebung, die schnell reagieren,
              klare Angebote machen und zuverlässig arbeiten.
            </p>
          </div>

          <div className="provider-benefits">
            <div>
              <strong>Regionale Sichtbarkeit</strong>
              <p>Erreiche Kunden in deinen gewünschten Einsatzgebieten.</p>
            </div>

            <div>
              <strong>Passende Dienstleistungen</strong>
              <p>Leads werden nach Kategorie und Region strukturiert.</p>
            </div>

            <div>
              <strong>Weniger Aufwand</strong>
              <p>Kunden beschreiben ihren Auftrag bereits vorab.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="provider-section">
        <div className="container">
          <div className="provider-section-head">
            <span className="seo-pill">Registrierung</span>
            <h2>Firma kostenlos anfragen</h2>
            <p>
              Sende deine Firmendaten. Wir prüfen deine Anfrage und melden uns
              persönlich bei dir.
            </p>
          </div>

          <AnbieterRegistrierenForm />
        </div>
      </section>

      <section className="provider-section provider-dark">
        <div className="container">
          <h2>Geeignet für viele Dienstleister</h2>

          <div className="provider-category-grid">
            {[
              "Reinigungsfirmen",
              "Hauswartungen",
              "Umzugsfirmen",
              "Gartenpflege",
              "Entsorgung",
              "Fensterreinigung",
              "Malerarbeiten",
              "Elektriker",
              "Sanitär",
            ].map((item) => (
              <div key={item} className="provider-category-card">
                <span>Anbieter</span>
                <h3>{item}</h3>
                <p>
                  Erhalte regionale Kundenanfragen für {item} und baue deine
                  Sichtbarkeit auf Auftrago aus.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}