import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Alle Dienstleistungen Schweiz | Auftrago",
  description:
    "Entdecke Dienstleistungen für Reinigung, Handwerk, Umzug, Versicherungen, Immobilien, Finanzen, IT und mehr.",
  alternates: {
    canonical: "https://www.auftrago.ch/leistungen",
  },
};

const groups = [
  {
    title: "Haus & Reinigung",
    text: "Reinigung, Unterhalt und Betreuung für Wohnungen, Firmen und Immobilien.",
    items: [
      ["Reinigung", "🧹", "/leistungen/reinigung"],
      ["Umzugsreinigung", "🏠", "/leistungen/umzugsreinigung"],
      ["Fensterreinigung", "🪟", "/leistungen/fensterreinigung"],
      ["Büroreinigung", "🏢", "/leistungen/bueroreinigung"],
      ["Hauswartung", "🔑", "/leistungen/hauswartung"],
      ["Gartenpflege", "🌿", "/leistungen/gartenpflege"],
      ["Winterdienst", "❄️", "/leistungen/winterdienst"],
    ],
  },
  {
    title: "Handwerk & Bau",
    text: "Regionale Fachbetriebe für Reparaturen, Installationen, Umbauten und Neubauten.",
    items: [
      ["Maler", "🎨", "/leistungen/maler"],
      ["Elektriker", "⚡", "/leistungen/elektriker"],
      ["Sanitär", "🚿", "/leistungen/sanitaer"],
      ["Schreiner", "🪵", "/leistungen/schreiner"],
      ["Gipser", "🧱", "/leistungen/gipser"],
      ["Bodenleger", "🪚", "/leistungen/bodenleger"],
      ["Plattenleger", "◻️", "/leistungen/plattenleger"],
      ["Dachdecker", "🏚️", "/leistungen/dachdecker"],
      ["Renovation", "🏗️", "/leistungen/renovation"],
      ["Küchenbau", "🍳", "/leistungen/kuechenbau"],
      ["Badumbau", "🛁", "/leistungen/badumbau"],
      ["Solar", "☀️", "/leistungen/solaranlagen"],
      ["Wärmepumpen", "🔥", "/leistungen/waermepumpen"],
      ["Klima", "🌬️", "/leistungen/klimaanlagen"],
    ],
  },
  {
    title: "Umzug & Transport",
    text: "Komplette Lösungen für Umzug, Transport, Räumung und Entsorgung.",
    items: [
      ["Umzug", "🚚", "/leistungen/umzug"],
      ["Kleintransport", "📦", "/leistungen/kleintransport"],
      ["Firmenumzug", "🏭", "/leistungen/firmenumzug"],
      ["Möbellift", "🏗️", "/leistungen/moebellift"],
      ["Entsorgung", "♻️", "/leistungen/entsorgung"],
      ["Räumung", "🧹", "/leistungen/raeumung"],
    ],
  },
  {
    title: "Versicherungen",
    text: "Kostenlose Beratung und Vergleich für private und geschäftliche Versicherungen.",
    featured: true,
    items: [
      ["Krankenkasse", "🏥", "/versicherungen?art=krankenkasse"],
      ["Autoversicherung", "🚗", "/versicherungen?art=auto"],
      ["Hausrat", "🏡", "/versicherungen?art=hausrat"],
      ["Haftpflicht", "🛡️", "/versicherungen?art=haftpflicht"],
      ["Rechtsschutz", "⚖️", "/versicherungen?art=rechtsschutz"],
      ["Vorsorge", "💼", "/versicherungen?art=vorsorge"],
      ["Lebensversicherung", "❤️", "/versicherungen?art=leben"],
      ["Firmenversicherung", "🏢", "/versicherungen?art=firma"],
    ],
  },
  {
    title: "Immobilien & Finanzen",
    text: "Makler, Bewertungen, Finanzierung, Treuhand und Steuerberatung.",
    items: [
      ["Immobilienmakler", "🏡", "/leistungen/immobilienmakler"],
      ["Immobilienbewertung", "📊", "/leistungen/immobilienbewertung"],
      ["Verwaltung", "🏢", "/leistungen/immobilienverwaltung"],
      ["Hypotheken", "🏦", "/leistungen/hypotheken"],
      ["Kredite", "💳", "/leistungen/kredite"],
      ["Treuhand", "📚", "/leistungen/treuhand"],
      ["Steuerberatung", "🧾", "/leistungen/steuerberatung"],
    ],
  },
  {
    title: "IT & Digital",
    text: "Digitale Lösungen für Unternehmen, Selbstständige und Privatpersonen.",
    items: [
      ["Webseiten", "🌐", "/leistungen/webseiten"],
      ["SEO", "📈", "/leistungen/seo"],
      ["Google Ads", "🎯", "/leistungen/google-ads"],
      ["Software", "💻", "/leistungen/softwareentwicklung"],
      ["IT-Support", "🖥️", "/leistungen/it-support"],
      ["Netzwerke", "📡", "/leistungen/netzwerke"],
    ],
  },
];

export default function LeistungenPage() {
  return (
    <main className="provider-page">
      <section className="anbieter-hero">
        <div className="container">
          <span className="anbieter-pill">40+ Kategorien</span>
          <h1>
            Wähle deine
            <br />
            passende Dienstleistung.
          </h1>
          <p style={{ maxWidth: "760px" }}>
            Von Reinigung und Handwerk über Versicherungen und Immobilien bis
            zu Finanzen und IT. Eine Anfrage genügt.
          </p>

          <div className="anbieter-actions">
            <Link href="/auftrag-erstellen" className="btn btn-primary">
              Auftrag starten
            </Link>
            <Link href="/anbieter" className="btn btn-secondary">
              Anbieter ansehen
            </Link>
          </div>
        </div>
      </section>

      {groups.map((group, index) => (
        <section
          key={group.title}
          className={`anbieter-section ${index % 2 ? "anbieter-dark" : ""}`}
        >
          <div className="container">
            <div className="anbieter-section-head">
              <span className="anbieter-pill">
                {group.featured ? "Neu · Premium" : "Kategorie"}
              </span>
              <h2>{group.title}</h2>
              <p>{group.text}</p>
            </div>

            <div className="anbieter-category-grid">
              {group.items.map(([title, icon, href]) => (
                <Link
                  key={title}
                  href={href}
                  className={`anbieter-category-card ${
                    group.featured ? "featured-category" : ""
                  }`}
                >
                  <div>
                    <div style={{ fontSize: "36px", marginBottom: "20px" }}>
                      {icon}
                    </div>
                    <span>{group.featured ? "VERSICHERUNG" : "DIENSTLEISTUNG"}</span>
                    <h3>{title}</h3>
                    <p>
                      Passende regionale Anbieter finden und kostenlos eine
                      unverbindliche Anfrage starten.
                    </p>
                  </div>
                  <strong>Anfrage starten →</strong>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ))}

      <section className="anbieter-final-cta">
        <div className="container">
          <span className="anbieter-pill">Nichts gefunden?</span>
          <h2>Beschreibe einfach, was du brauchst.</h2>
          <p>Wir ordnen deine Anfrage automatisch der passenden Kategorie zu.</p>
          <div className="anbieter-actions center">
            <Link href="/auftrag-erstellen" className="btn btn-primary">
              Freie Anfrage starten
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}