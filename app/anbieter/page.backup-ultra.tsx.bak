import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Anbieter finden Schweiz | Dienstleistungen & Versicherungen | Auftrago",
  description:
    "Finde regionale Anbieter für Reinigung, Handwerk, Umzug, Versicherungen, Immobilien, Finanzen und digitale Dienstleistungen in der Schweiz.",
  alternates: {
    canonical: "https://www.auftrago.ch/anbieter",
  },
  openGraph: {
    title: "Anbieter finden | Auftrago",
    description:
      "Vergleiche regionale Firmen, Makler und Dienstleister in der ganzen Schweiz.",
    url: "https://www.auftrago.ch/anbieter",
    siteName: "Auftrago",
    type: "website",
  },
};

const categories = [
  {
    icon: "🧹",
    title: "Reinigung",
    description:
      "Wohnungsreinigung, Büroreinigung, Unterhalt, Baureinigung und Spezialreinigung.",
    services: ["Wohnung", "Büro", "Unterhalt"],
    href: "/leistungen/reinigung",
  },
  {
    icon: "🏠",
    title: "Umzugsreinigung",
    description:
      "Endreinigung, Abgabereinigung, Fenster, Küche und Bad mit Abgabegarantie.",
    services: ["Endreinigung", "Abgabe", "Garantie"],
    href: "/leistungen/umzugsreinigung",
  },
  {
    icon: "🏢",
    title: "Hauswartung",
    description:
      "Liegenschaftsunterhalt, Kontrollgänge, Treppenhaus und Umgebungspflege.",
    services: ["Unterhalt", "Kontrolle", "Objekte"],
    href: "/leistungen/hauswartung",
  },
  {
    icon: "🌿",
    title: "Gartenpflege",
    description:
      "Rasen, Hecken, Laub, Saisonpflege und laufender Gartenunterhalt.",
    services: ["Rasen", "Hecken", "Garten"],
    href: "/leistungen/gartenpflege",
  },
  {
    icon: "🚚",
    title: "Umzug & Transport",
    description:
      "Privatumzug, Firmenumzug, Möbeltransport, Kleintransport und Möbellift.",
    services: ["Umzug", "Transport", "Möbel"],
    href: "/leistungen/umzug",
  },
  {
    icon: "♻️",
    title: "Entsorgung & Räumung",
    description:
      "Entrümpelung, Sperrgut, Keller, Estrich und Haushaltsauflösung.",
    services: ["Räumung", "Sperrgut", "Keller"],
    href: "/leistungen/entsorgung",
  },
  {
    icon: "🎨",
    title: "Maler & Gipser",
    description:
      "Innenanstrich, Fassaden, Verputz, Trockenbau und Renovationen.",
    services: ["Maler", "Gipser", "Fassade"],
    href: "/leistungen/maler",
  },
  {
    icon: "⚡",
    title: "Elektriker",
    description:
      "Installationen, Reparaturen, Beleuchtung, Sicherheit und Notfälle.",
    services: ["Strom", "Licht", "Installation"],
    href: "/leistungen/elektriker",
  },
  {
    icon: "🚿",
    title: "Sanitär",
    description:
      "Bad, Küche, Leitungen, Armaturen, Reparaturen und Installationen.",
    services: ["Bad", "Leitung", "Armaturen"],
    href: "/leistungen/sanitaer",
  },
  {
    icon: "🪵",
    title: "Schreiner",
    description:
      "Möbel, Türen, Schränke, Küchen, Reparaturen und individuelle Arbeiten.",
    services: ["Möbel", "Türen", "Küche"],
    href: "/leistungen/schreiner",
  },
  {
    icon: "🧱",
    title: "Boden & Platten",
    description:
      "Parkett, Laminat, Vinyl, Teppich, Platten und Bodenaufbereitung.",
    services: ["Parkett", "Platten", "Vinyl"],
    href: "/leistungen/bodenleger",
  },
  {
    icon: "🏗️",
    title: "Renovation & Umbau",
    description:
      "Umbauten, Rückbau, Koordination, Montage und komplette Renovationen.",
    services: ["Umbau", "Rückbau", "Renovation"],
    href: "/leistungen/renovation",
  },
  {
    icon: "☀️",
    title: "Solar & Energie",
    description:
      "Solaranlagen, Speicher, Wärmepumpen, Energieberatung und Montage.",
    services: ["Solar", "Speicher", "Wärmepumpe"],
    href: "/leistungen/solaranlagen",
  },
  {
    icon: "🛡️",
    title: "Versicherungen",
    description:
      "Krankenkasse, Auto, Hausrat, Rechtsschutz, Vorsorge und Firmenlösungen.",
    services: ["Krankenkasse", "Auto", "Vorsorge"],
    href: "/versicherungen",
    featured: true,
  },
  {
    icon: "🏡",
    title: "Immobilien",
    description:
      "Verkauf, Vermietung, Bewertung, Verwaltung und Maklerberatung.",
    services: ["Verkauf", "Bewertung", "Verwaltung"],
    href: "/leistungen/immobilien",
  },
  {
    icon: "💰",
    title: "Finanzen & Treuhand",
    description:
      "Hypotheken, Kredite, Steuern, Buchhaltung und Treuhandberatung.",
    services: ["Hypothek", "Steuern", "Treuhand"],
    href: "/leistungen/finanzen",
  },
  {
    icon: "💻",
    title: "IT & Digital",
    description:
      "Webseiten, SEO, Werbung, Software, IT-Support und Netzwerke.",
    services: ["Webseite", "SEO", "IT"],
    href: "/leistungen/it-digital",
  },
  {
    icon: "📸",
    title: "Weitere Dienstleistungen",
    description:
      "Fotografie, Events, Beratung, Recht, Gesundheit und vieles mehr.",
    services: ["Event", "Beratung", "Weitere"],
    href: "/leistungen",
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
  "Solothurn",
  "Thurgau",
  "Graubünden",
  "Tessin",
];

const faqs = [
  {
    question: "Ist die Anfrage kostenlos?",
    answer:
      "Ja. Kunden können kostenlos und unverbindlich eine Anfrage erstellen.",
  },
  {
    question: "Welche Anbieter finde ich?",
    answer:
      "Auftrago vermittelt regionale Firmen, Handwerker, Makler, Berater und weitere Dienstleister.",
  },
  {
    question: "Kann ich Versicherungsberater vergleichen?",
    answer:
      "Ja. Du kannst Anfragen für Krankenkasse, Auto, Hausrat, Rechtsschutz, Vorsorge und Firmenversicherungen stellen.",
  },
  {
    question: "Können sich Makler registrieren?",
    answer:
      "Ja. Versicherungsmakler und Versicherer können sich registrieren und passende Leads kaufen.",
  },
];

export default function AnbieterPage() {
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <section className="anbieter-hero">
        <div className="container anbieter-hero-grid">
          <div>
            <span className="anbieter-pill">Die Schweizer Plattform</span>
            <h1>
              Finde Anbieter.
              <br />
              Für praktisch alles.
            </h1>
            <p>
              Reinigung, Handwerk, Umzug, Versicherungen, Immobilien, Finanzen
              und digitale Dienstleistungen – kostenlos und unverbindlich.
            </p>

            <div className="anbieter-actions">
              <Link href="/auftrag-erstellen" className="btn btn-primary">
                Anfrage starten
              </Link>
              <Link href="/anbieter-registrieren" className="btn btn-secondary">
                Als Anbieter registrieren
              </Link>
            </div>

            <div className="anbieter-trust">
              <span>✓ Kostenlos</span>
              <span>✓ Ganze Schweiz</span>
              <span>✓ Für Privat & Firmen</span>
              <span>✓ Neue Versicherungsleads</span>
            </div>
          </div>

          <aside className="anbieter-search-card">
            <span>AI Matching</span>
            <h2>Was brauchst du?</h2>
            <div className="anbieter-search-box">
              <strong>Beschreibe deinen Auftrag</strong>
              <small>Auftrago findet passende Anbieter</small>
            </div>
            <Link href="/auftrag-erstellen" className="anbieter-big-button">
              Kostenlos starten →
            </Link>
          </aside>
        </div>
      </section>

      <section className="anbieter-stats">
        <div className="container anbieter-stats-grid">
          <div><strong>40+</strong><span>Dienstleistungen</span></div>
          <div><strong>26</strong><span>Kantone</span></div>
          <div><strong>100%</strong><span>kostenlose Anfrage</span></div>
          <div><strong>24/7</strong><span>online verfügbar</span></div>
        </div>
      </section>

      <section className="anbieter-section">
        <div className="container">
          <div className="anbieter-section-head">
            <span className="anbieter-pill">Alle Kategorien</span>
            <h2>Eine Plattform. Alle Dienstleistungen.</h2>
            <p>
              Wähle eine Kategorie und starte direkt eine passende Anfrage.
            </p>
          </div>

          <div className="anbieter-category-grid">
            {categories.map((category) => (
              <Link
                key={category.title}
                href={category.href}
                className={`anbieter-category-card ${
                  category.featured ? "featured-category" : ""
                }`}
              >
                <div>
                  <div style={{ fontSize: "34px", marginBottom: "18px" }}>
                    {category.icon}
                  </div>
                  <span>{category.featured ? "NEU · PREMIUM" : "ANBIETER"}</span>
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
        <div className="container anbieter-split">
          <div>
            <span className="anbieter-pill">Versicherungen</span>
            <h2>Qualifizierte Versicherungsanfragen.</h2>
            <p>
              Kunden können kostenlos Anfragen für Krankenkasse, Auto, Hausrat,
              Rechtsschutz, Vorsorge und Firmenversicherungen stellen.
            </p>
            <p>
              Makler und Versicherer erhalten Zugriff auf passende Leads nach
              Versicherungsart und Region.
            </p>
            <div className="anbieter-actions">
              <Link href="/versicherungen" className="btn btn-primary">
                Versicherungen vergleichen
              </Link>
              <Link href="/anbieter-registrieren" className="btn btn-secondary">
                Als Makler registrieren
              </Link>
            </div>
          </div>

          <div className="anbieter-benefit-grid">
            {[
              "Krankenkassen-Leads",
              "Autoversicherungs-Leads",
              "Vorsorge & Leben",
              "Firmenversicherungen",
              "Regionale Zuordnung",
              "Kontrollierter Lead-Zugriff",
            ].map((item) => (
              <div key={item}>
                <span>✓</span>
                <strong>{item}</strong>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="anbieter-section">
        <div className="container">
          <div className="anbieter-section-head">
            <span className="anbieter-pill">Regionen</span>
            <h2>Anbieter in der ganzen Schweiz</h2>
          </div>

          <div className="anbieter-region-grid">
            {regions.map((region) => (
              <Link
                key={region}
                href={`/region/${region
                  .toLowerCase()
                  .replaceAll(" ", "-")
                  .replace("ü", "ue")
                  .replace("ä", "ae")
                  .replace("ö", "oe")}`}
              >
                Anbieter in {region}
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
          <h2>Finde den passenden Anbieter.</h2>
          <p>Kostenlos, unverbindlich und in weniger als einer Minute.</p>
          <div className="anbieter-actions center">
            <Link href="/auftrag-erstellen" className="btn btn-primary">
              Anfrage starten
            </Link>
            <Link href="/leistungen" className="btn btn-secondary">
              Alle Leistungen
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}