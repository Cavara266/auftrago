import Link from "next/link";
import type { Metadata } from "next";
import AnbieterRegistrierenForm from "@/components/anbieter-registrieren-form";

export const metadata: Metadata = {
  title: "Anbieter werden | Kundenanfragen erhalten | Auftrago",
  description:
    "Registriere deine Firma auf Auftrago und erhalte regionale Kundenanfragen für Reinigung, Hauswartung, Umzug, Gartenpflege, Entsorgung, Fensterreinigung, Malerarbeiten und weitere Dienstleistungen.",
  alternates: {
    canonical: "https://www.auftrago.ch/anbieter-registrieren",
  },
  openGraph: {
    title: "Anbieter werden | Neue Kundenanfragen erhalten | Auftrago",
    description:
      "Erhalte passende regionale Kundenanfragen für deine Dienstleistung in der Schweiz.",
    url: "https://www.auftrago.ch/anbieter-registrieren",
    siteName: "Auftrago",
    type: "website",
  },
};

const providerTypes = [
  "Reinigungsfirmen",
  "Hauswartungen",
  "Umzugsfirmen",
  "Gartenpflege",
  "Entsorgung",
  "Fensterreinigung",
  "Malerarbeiten",
  "Elektriker",
  "Sanitär",
  "Transportfirmen",
  "Bodenleger",
  "Winterdienst",
];

const benefits = [
  {
    title: "Regionale Kundenanfragen",
    text: "Erhalte Anfragen aus Regionen, in denen deine Firma wirklich tätig ist.",
  },
  {
    title: "Weniger Streuverlust",
    text: "Auftrago sammelt strukturierte Angaben zu Dienstleistung, Ort und Auftrag.",
  },
  {
    title: "Mehr Sichtbarkeit",
    text: "Deine Firma kann auf einer Plattform sichtbar werden, die für lokale Dienstleistungen optimiert ist.",
  },
  {
    title: "Passende Kategorien",
    text: "Reinigung, Hauswartung, Umzug, Gartenpflege, Entsorgung und viele weitere Bereiche.",
  },
];

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
  "Solothurn",
  "Graubünden",
  "Genf",
];

const faqs = [
  {
    question: "Für welche Firmen ist Auftrago geeignet?",
    answer:
      "Auftrago eignet sich für Reinigungsfirmen, Hauswartungen, Umzugsfirmen, Gartenbauer, Entsorgungsbetriebe, Fensterreiniger, Maler, Elektriker, Sanitärbetriebe und weitere regionale Dienstleister.",
  },
  {
    question: "Wie funktioniert die Anbieter-Registrierung?",
    answer:
      "Du sendest deine Firmendaten über das Formular. Auftrago prüft die Angaben und meldet sich persönlich bei dir.",
  },
  {
    question: "Erhalte ich direkt Kundenanfragen?",
    answer:
      "Nach der Prüfung kannst du passende regionale Kundenanfragen erhalten, sofern sie zu deinen Dienstleistungen und Regionen passen.",
  },
  {
    question: "Welche Angaben sollte ich eintragen?",
    answer:
      "Wichtig sind Firmenname, Kontaktperson, Telefonnummer, E-Mail, Region, Website und deine wichtigsten Dienstleistungen.",
  },
  {
    question: "Ist Auftrago für lokale Anbieter geeignet?",
    answer:
      "Ja. Auftrago ist besonders für regionale Anbieter gedacht, die Kundenanfragen in bestimmten Städten, Kantonen oder Einsatzgebieten erhalten möchten.",
  },
];

export default function AnbieterRegistrierenPage() {
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

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Anbieter werden auf Auftrago",
    url: "https://www.auftrago.ch/anbieter-registrieren",
    description:
      "Firmen können sich auf Auftrago registrieren, um regionale Kundenanfragen für Dienstleistungen in der Schweiz zu erhalten.",
  };

  return (
    <main className="seo-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(webPageSchema),
        }}
      />

      <section className="provider-hero">
        <div className="container provider-hero-grid">
          <div>
            <span className="seo-pill">Anbieter werden</span>

            <h1>
              Neue Kundenanfragen
              <br />
              für deine Firma.
            </h1>

            <p>
              Registriere deine Firma auf Auftrago und erhalte passende
              Kundenanfragen aus deiner Region. Ideal für Reinigung,
              Hauswartung, Umzug, Gartenpflege, Entsorgung, Fensterreinigung,
              Malerarbeiten, Elektriker, Sanitär und weitere Dienstleistungen.
            </p>

            <div className="seo-hero-actions">
              <a href="#anbieter-formular" className="btn btn-primary">
                Firma kostenlos eintragen
              </a>

              <Link href="/anbieter" className="btn btn-secondary">
                Anbieter ansehen
              </Link>
            </div>

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
              Viele Firmen investieren Zeit und Geld in Werbung, erhalten aber
              unpassende oder unvollständige Anfragen. Auftrago ist darauf
              ausgelegt, Kundenanfragen strukturierter zu erfassen und regional
              passenden Anbietern zuzuordnen.
            </p>

            <p>
              Besonders für lokale Dienstleister ist Nähe entscheidend. Kunden
              suchen häufig Firmen in ihrer Umgebung, die schnell reagieren,
              klare Angebote machen und zuverlässig arbeiten.
            </p>

            <p>
              Wenn deine Firma regelmässig neue Aufträge sucht, kann Auftrago ein
              zusätzlicher Kanal für regionale Kundenanfragen werden.
            </p>
          </div>

          <div className="provider-benefits">
            {benefits.map((benefit) => (
              <div key={benefit.title}>
                <strong>{benefit.title}</strong>
                <p>{benefit.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="provider-section provider-dark">
        <div className="container">
          <div className="provider-section-head">
            <span className="seo-pill">Geeignet für</span>
            <h2>Dienstleister aus vielen Branchen</h2>
            <p>
              Auftrago richtet sich an regionale Firmen, die neue Kundenanfragen
              für Dienstleistungen in der Schweiz erhalten möchten.
            </p>
          </div>

          <div className="provider-category-grid">
            {providerTypes.map((item) => (
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

      <section className="provider-section">
        <div className="container provider-split">
          <div>
            <span className="seo-pill">Regionen</span>

            <h2>Kundenanfragen aus deiner Region</h2>

            <p>
              Auftrago ist für regionale Dienstleister in der Schweiz aufgebaut.
              Du kannst deine gewünschten Einsatzgebiete angeben, damit Anfragen
              besser zu deiner Firma passen.
            </p>
          </div>

          <div className="anbieter-region-grid">
            {regions.map((region) => (
              <Link key={region} href="/anbieter-registrieren">
                {region}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="provider-section" id="anbieter-formular">
        <div className="container">
          <div className="provider-section-head">
            <span className="seo-pill">Registrierung</span>

            <h2>Firma kostenlos eintragen</h2>

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
          <div className="provider-section-head">
            <span className="seo-pill">FAQ</span>

            <h2>Häufige Fragen für Anbieter</h2>
          </div>

          <div className="quote-faq">
            {faqs.map((faq) => (
              <details key={faq.question}>
                <summary>{faq.question}</summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="provider-section">
        <div className="container provider-cta">
          <span className="seo-pill">Jetzt starten</span>

          <h2>Neue Kundenanfragen erhalten</h2>

          <p>
            Trage deine Firma ein und werde Teil von Auftrago. Wir prüfen deine
            Anfrage und melden uns persönlich bei dir.
          </p>

          <div className="seo-hero-actions">
            <a href="#anbieter-formular" className="btn btn-primary">
              Firma eintragen
            </a>

            <Link href="/offerte-anfragen" className="btn btn-secondary">
              Kundenformular ansehen
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}