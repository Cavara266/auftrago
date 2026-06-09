import Link from "next/link";
import { Metadata } from "next";
import { providerCategories } from "@/lib/provider-seo-data";

export const metadata: Metadata = {
  title: "Anbieter finden | Regionale Firmen vergleichen | Auftrago",
  description:
    "Finde regionale Anbieter für Reinigung, Hauswartung, Umzug, Gartenpflege, Entsorgung, Fensterreinigung und weitere Dienstleistungen in der Schweiz.",
  alternates: {
    canonical: "https://www.auftrago.ch/anbieter",
  },
  openGraph: {
    title: "Anbieter finden | Auftrago",
    description:
      "Vergleiche regionale Dienstleister für Reinigung, Hauswartung, Umzug, Gartenpflege, Entsorgung und weitere Aufträge.",
    url: "https://www.auftrago.ch/anbieter",
    siteName: "Auftrago",
    type: "website",
  },
};

const regions = [
  { name: "Zürich", href: "/region/zuerich" },
  { name: "Aargau", href: "/region/aargau" },
  { name: "Basel", href: "/region/basel" },
  { name: "Bern", href: "/region/bern" },
  { name: "Luzern", href: "/region/luzern" },
  { name: "Zug", href: "/region/zug" },
  { name: "St. Gallen", href: "/region/st-gallen" },
  { name: "Schaffhausen", href: "/region/schaffhausen" },
];

const stats = [
  { value: "100%", label: "kostenlose Anfrage" },
  { value: "24h", label: "schnelle Rückmeldungen möglich" },
  { value: "2200+", label: "regionale Angebotsseiten" },
  { value: "CH", label: "Schweizer Regionen" },
];

const steps = [
  {
    number: "01",
    title: "Auftrag erfassen",
    text: "Beschreibe Dienstleistung, Ort, Termin, Objekt und wichtige Details.",
  },
  {
    number: "02",
    title: "Regionale Anbieter erreichen",
    text: "Passende Firmen aus deiner Umgebung können deine Anfrage prüfen.",
  },
  {
    number: "03",
    title: "Offerten vergleichen",
    text: "Du vergleichst Leistungen, Preise, Verfügbarkeit und Anbieterprofil.",
  },
  {
    number: "04",
    title: "Anbieter auswählen",
    text: "Du entscheidest selbst, ob ein Angebot zu deinem Auftrag passt.",
  },
];

const benefits = [
  "Keine lange Suche nach einzelnen Firmen",
  "Regionale Anbieter aus deiner Umgebung",
  "Geeignet für Privatkunden, Firmen und Verwaltungen",
  "Kostenlos und unverbindlich starten",
  "Mehr Übersicht bei Preisen und Leistungen",
  "Schneller passende Dienstleister finden",
  "Bessere Vergleichbarkeit der Offerten",
  "Eine Anfrage statt viele Telefonate",
];

const popularSearches = [
  { label: "Hauswartung Uster", href: "/hauswartung-uster" },
  { label: "Hauswartfirma Uster", href: "/hauswartfirma-uster" },
  { label: "Umzug Lenzburg", href: "/umzug-lenzburg" },
  { label: "Endreinigung Bülach", href: "/end-reinigung-buelach" },
  { label: "Büroreinigung Bülach", href: "/bueroreinigung-buelach" },
  { label: "Fensterreinigung Solothurn", href: "/fensterreinigung-solothurn" },
  { label: "Winterdienst Aargau", href: "/winterdienst-aargau" },
  { label: "Maler Dübendorf", href: "/maler-duebendorf" },
];

const serviceLinks = [
  { label: "Reinigung", href: "/reinigung-zuerich" },
  { label: "Umzugsreinigung", href: "/umzugsreinigung-zuerich" },
  { label: "Hauswartung", href: "/hauswartung-zuerich" },
  { label: "Gartenpflege", href: "/gartenpflege-zuerich" },
  { label: "Fensterreinigung", href: "/fensterreinigung-zuerich" },
  { label: "Entsorgung", href: "/entsorgung-zuerich" },
  { label: "Umzug", href: "/umzug-zuerich" },
  { label: "Transport", href: "/transport-zuerich" },
  { label: "Malerarbeiten", href: "/maler-zuerich" },
  { label: "Elektriker", href: "/elektriker-zuerich" },
  { label: "Sanitär", href: "/sanitaer-zuerich" },
  { label: "Winterdienst", href: "/winterdienst-aargau" },
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
      "Auftrago hilft bei der Suche nach regionalen Dienstleistern für Reinigung, Hauswartung, Umzug, Gartenpflege, Entsorgung, Fensterreinigung und weitere Arbeiten.",
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
  {
    question: "Für welche Regionen ist Auftrago geeignet?",
    answer:
      "Auftrago eignet sich für Zürich, Aargau, Basel, Bern, Luzern, Zug, St. Gallen, Schaffhausen und weitere Regionen in der Schweiz.",
  },
];

export default function AnbieterPage() {
  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Anbieter finden auf Auftrago",
    url: "https://www.auftrago.ch/anbieter",
    description:
      "Regionale Anbieter für Reinigung, Hauswartung, Umzug, Gartenpflege und weitere Dienstleistungen vergleichen.",
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

  return (
    <main className="provider-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
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
              Gartenpflege, Entsorgung, Fensterreinigung und weitere Aufträge.
              Sende eine Anfrage und vergleiche regionale Anbieter ohne
              Verpflichtung.
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
            <h2>In 4 Schritten zur passenden Firma</h2>
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

            <p>
              Besonders bei Dienstleistungen wie Reinigung, Umzug,
              Hauswartung, Gartenpflege, Fensterreinigung oder Entsorgung ist
              es wichtig, mehrere regionale Firmen vergleichen zu können.
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
            <span className="anbieter-pill">Beliebte Suchanfragen</span>

            <h2>Häufig gesuchte Anbieter</h2>

            <p>
              Diese Seiten werden besonders stark verlinkt, weil sie bereits
              Interesse in Google zeigen oder für lokale Anfragen wichtig sind.
            </p>
          </div>

          <div className="anbieter-region-grid">
            {popularSearches.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="anbieter-section">
        <div className="container">
          <div className="anbieter-section-head">
            <span className="anbieter-pill">Dienstleistungen</span>

            <h2>Anbieter nach Dienstleistung finden</h2>

            <p>
              Starte mit einer beliebten Dienstleistung und finde regionale
              Firmen für deinen Auftrag.
            </p>
          </div>

          <div className="anbieter-region-grid">
            {serviceLinks.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
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
              Reinigung, Hauswartung, Umzug, Gartenpflege und weitere Arbeiten.
            </p>
          </div>

          <div className="anbieter-region-grid">
            {regions.map((region) => (
              <Link key={region.name} href={region.href}>
                {region.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="anbieter-section">
        <div className="container anbieter-split">
          <div>
            <span className="anbieter-pill">Für Firmen</span>

            <h2>Du bist Anbieter und möchtest Kundenanfragen erhalten?</h2>

            <p>
              Auftrago ist nicht nur für Kunden gedacht. Auch Dienstleister
              können sich registrieren und passende regionale Anfragen erhalten.
              Besonders geeignet ist Auftrago für Reinigungsfirmen,
              Hauswartungen, Umzugsfirmen, Gartenpflege, Entsorgung,
              Fensterreinigung, Maler, Elektriker und Sanitärbetriebe.
            </p>

            <div className="anbieter-actions">
              <Link href="/anbieter-registrieren" className="btn btn-primary">
                Firma registrieren
              </Link>
            </div>
          </div>

          <div className="anbieter-benefit-grid">
            <div>
              <span>✓</span>
              <strong>Mehr regionale Sichtbarkeit</strong>
            </div>

            <div>
              <span>✓</span>
              <strong>Passende Kundenanfragen</strong>
            </div>

            <div>
              <span>✓</span>
              <strong>Geeignet für lokale Dienstleister</strong>
            </div>

            <div>
              <span>✓</span>
              <strong>Strukturierte Anfrage-Daten</strong>
            </div>
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