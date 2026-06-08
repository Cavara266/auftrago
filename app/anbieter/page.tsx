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

const regions = [
  "Zürich",
  "Aargau",
  "Basel",
  "Bern",
  "Luzern",
  "Zug",
  "St. Gallen",
  "Schaffhausen",
  "Thurgau",
];

const stats = [
  { value: "100%", label: "kostenlose Anfrage" },
  { value: "24h", label: "schnelle Rückmeldungen möglich" },
  { value: "CH", label: "regionale Anbieter" },
];

const steps = [
  {
    number: "01",
    title: "Auftrag erfassen",
    text: "Beschreibe deine Dienstleistung, Ort, Termin und wichtige Details.",
  },
  {
    number: "02",
    title: "Regionale Firmen erreichen",
    text: "Passende Anbieter aus deiner Umgebung können deine Anfrage prüfen.",
  },
  {
    number: "03",
    title: "Offerten vergleichen",
    text: "Du vergleichst Leistungen, Preise und Verfügbarkeit in Ruhe.",
  },
];

const benefits = [
  "Keine lange Suche nach einzelnen Firmen",
  "Regionale Anbieter aus deiner Umgebung",
  "Geeignet für Privatkunden, Firmen und Verwaltungen",
  "Kostenlos und unverbindlich starten",
  "Mehr Übersicht bei Preisen und Leistungen",
  "Schneller passende Dienstleister finden",
];

const faqs = [
  {
    question: "Ist die Anfrage über Auftrago kostenlos?",
    answer:
      "Ja. Kunden können kostenlos und unverbindlich eine Anfrage senden.",
  },
  {
    question: "Welche Anbieter finde ich auf Auftrago?",
    answer:
      "Auftrago hilft bei der Suche nach regionalen Dienstleistern für Reinigung, Hauswartung, Umzug, Gartenpflege, Entsorgung und weitere Arbeiten.",
  },
  {
    question: "Bin ich nach der Anfrage verpflichtet?",
    answer:
      "Nein. Du entscheidest selbst, ob du ein Angebot annehmen möchtest.",
  },
  {
    question: "Können sich Firmen registrieren?",
    answer:
      "Ja. Dienstleister können sich als Anbieter registrieren und passende Kundenanfragen erhalten.",
  },
];

export default function AnbieterPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Anbieter finden auf Auftrago",
    url: "https://www.auftrago.ch/anbieter",
    description:
      "Regionale Anbieter für Reinigung, Hauswartung, Umzug, Gartenpflege und weitere Dienstleistungen vergleichen.",
  };

  return (
    <main className="provider-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <section className="anbieter-hero">
        <div className="container anbieter-hero-grid">
          <div>
            <span className="anbieter-pill">Anbieter finden</span>

            <h1>
              Regionale Firmen
              <br />
              schneller vergleichen.
            </h1>

            <p>
              Finde passende Dienstleister für Reinigung, Hauswartung, Umzug,
              Gartenpflege, Entsorgung und weitere Aufträge. Sende eine Anfrage
              und vergleiche regionale Anbieter ohne Verpflichtung.
            </p>

            <div className="anbieter-actions">
              <Link href="/offerte-anfragen" className="btn btn-primary">
                Kostenlose Anfrage senden
              </Link>

              <Link href="/anbieter-registrieren" className="btn btn-secondary">
                Als Anbieter registrieren
              </Link>
            </div>

            <div className="anbieter-trust">
              <span>✓ Kostenlos</span>
              <span>✓ Regional</span>
              <span>✓ Unverbindlich</span>
              <span>✓ Für Privat & Firmen</span>
            </div>
          </div>

          <aside className="anbieter-search-card">
            <span>Direkt starten</span>
            <h2>Was suchst du?</h2>

            <div className="anbieter-search-box">
              <strong>Reinigung, Umzug, Hauswartung...</strong>
              <small>Auftrag beschreiben und Anbieter finden</small>
            </div>

            <Link href="/offerte-anfragen" className="anbieter-big-button">
              Anfrage erstellen →
            </Link>
          </aside>
        </div>
      </section>

      <section className="anbieter-stats">
        <div className="container anbieter-stats-grid">
          {stats.map((item) => (
            <div key={item.label}>
              <strong>{item.value}</strong>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="anbieter-section">
        <div className="container">
          <div className="anbieter-section-head">
            <span className="anbieter-pill">Kategorien</span>
            <h2>Beliebte Anbieter-Kategorien</h2>
            <p>
              Wähle eine Dienstleistung und finde passende Anbieter aus deiner
              Umgebung.
            </p>
          </div>

          <div className="anbieter-category-grid">
            {providerCategories.map((category) => (
              <Link
                key={category.title}
                href={category.href}
                className="anbieter-category-card"
              >
                <div>
                  <span>Anbieter</span>
                  <h3>{category.title}</h3>
                  <p>{category.description}</p>
                </div>

                <div className="anbieter-tags">
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

      <section className="anbieter-section anbieter-dark">
        <div className="container anbieter-steps-grid">
          <div className="anbieter-section-head">
            <span className="anbieter-pill">Ablauf</span>
            <h2>In 3 Schritten zur passenden Firma</h2>
            <p>
              Auftrago macht die Suche nach regionalen Dienstleistern einfacher,
              schneller und übersichtlicher.
            </p>
          </div>

          <div className="anbieter-step-list">
            {steps.map((step) => (
              <div key={step.number} className="anbieter-step-card">
                <span>{step.number}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="anbieter-section">
        <div className="container anbieter-split">
          <div>
            <span className="anbieter-pill">Vorteile</span>
            <h2>Warum Anbieter über Auftrago vergleichen?</h2>
            <p>
              Statt einzelne Firmen zu suchen, mehrere Webseiten zu öffnen und
              jede Firma separat zu kontaktieren, kannst du über Auftrago eine
              strukturierte Anfrage senden. So sparst du Zeit und erhältst eine
              bessere Grundlage für den Vergleich.
            </p>
          </div>

          <div className="anbieter-benefit-grid">
            {benefits.map((benefit) => (
              <div key={benefit}>
                <span>✓</span>
                <strong>{benefit}</strong>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="anbieter-section anbieter-dark">
        <div className="container">
          <div className="anbieter-section-head">
            <span className="anbieter-pill">Regionen</span>
            <h2>Anbieter in deiner Region finden</h2>
            <p>
              Starte mit deiner Region und finde passende Dienstleister für
              deinen Auftrag.
            </p>
          </div>

          <div className="anbieter-region-grid">
            {regions.map((region) => (
              <Link key={region} href="/offerte-anfragen">
                {region}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="anbieter-section">
        <div className="container anbieter-faq-grid">
          <div>
            <span className="anbieter-pill">FAQ</span>
            <h2>Häufige Fragen</h2>
          </div>

          <div className="anbieter-faq">
            {faqs.map((faq) => (
              <details key={faq.question}>
                <summary>{faq.question}</summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="anbieter-final-cta">
        <div className="container">
          <span className="anbieter-pill">Jetzt starten</span>
          <h2>Passende Anbieter finden</h2>
          <p>
            Beschreibe deinen Auftrag und finde regionale Firmen für deine
            Dienstleistung.
          </p>

          <div className="anbieter-actions center">
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