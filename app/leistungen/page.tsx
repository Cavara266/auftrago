import Link from "next/link";

const services = [
  {
    icon: "🧼",
    title: "Reinigung",
    text: "Büroreinigung, Unterhaltsreinigung, Treppenhausreinigung und Spezialreinigung.",
  },
  {
    icon: "🏢",
    title: "Hauswartung",
    text: "Liegenschaftsunterhalt, Kontrollgänge, Umgebungspflege und Winterdienst.",
  },
  {
    icon: "📦",
    title: "Umzug",
    text: "Privatumzüge, Firmenumzüge, Möbeltransport und Umzugshilfe.",
  },
  {
    icon: "✨",
    title: "Umzugsreinigung",
    text: "Endreinigung für Wohnungen, Häuser und Gewerbeflächen.",
  },
  {
    icon: "🌿",
    title: "Gartenpflege",
    text: "Rasen, Hecken, Laub, Saisonarbeiten und gepflegte Aussenbereiche.",
  },
  {
    icon: "♻️",
    title: "Entsorgung",
    text: "Räumungen, Sperrgut, Keller, Estrich und fachgerechte Entsorgung.",
  },
];

const locations = [
  "Zürich",
  "Winterthur",
  "Baden",
  "Aarau",
  "Lenzburg",
  "Dietikon",
  "Schlieren",
  "Bülach",
  "Basel",
  "Bern",
  "Luzern",
  "Zug",
];

const combos = [
  "Reinigung Zürich",
  "Hauswartung Aargau",
  "Umzugsreinigung Baden",
  "Treppenhausreinigung Winterthur",
  "Gartenpflege Aarau",
  "Entsorgung Luzern",
];

export default function LeistungenPage() {
  return (
    <main>
      <section className="services-page-hero">
        <div className="container services-page-grid">
          <div>
            <span className="eyebrow">Dienstleistungen Schweiz</span>

            <h1>
              Finde passende
              <br />
              Anbieter für lokale
              <br />
              Services.
            </h1>

            <p>
              Vergleiche Offerten von regionalen Dienstleistern für Reinigung,
              Hauswartung, Umzug, Gartenpflege und Entsorgung.
            </p>

            <div className="hero-actions">
              <Link href="/auftrag-erstellen" className="btn btn-primary">
                Offerte anfragen
              </Link>

              <Link href="/anbieter" className="btn btn-secondary">
                Anbieter werden
              </Link>
            </div>
          </div>

          <div className="services-flow-card">
            <div className="flow-box dark">
              <span>👤</span>
              <strong>Kunde</strong>
              <p>Ort, Kategorie und Auftrag erfassen</p>
            </div>

            <div className="flow-arrow">→</div>

            <div className="flow-box center">
              <span>⚡</span>
              <strong>Auftrago</strong>
              <p>filtert nach Region und Bedarf</p>
            </div>

            <div className="flow-arrow">→</div>

            <div className="flow-box light">
              <span>💼</span>
              <strong>Anbieter</strong>
              <p>erhalten passende Anfragen</p>
            </div>
          </div>
        </div>
      </section>

      <section className="services-stats">
        <div className="container services-stats-grid">
          <article>
            <span>⚡</span>
            <strong>60 Sek.</strong>
            <p>Anfrage starten</p>
          </article>

          <article>
            <span>📍</span>
            <strong>Regional</strong>
            <p>Anbieter aus deiner Nähe</p>
          </article>

          <article>
            <span>✅</span>
            <strong>Klar</strong>
            <p>Strukturierte Offerten</p>
          </article>

          <article>
            <span>🎯</span>
            <strong>Passend</strong>
            <p>Nach Kategorie und Bedarf</p>
          </article>
        </div>
      </section>

      <section className="section services-premium-section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Beliebte Dienstleistungen</span>

            <h2>
              Services, bei denen
              <br />
              Vertrauen zählt.
            </h2>

            <p>
              Auftrago ist für lokale Dienstleistungen gebaut, bei denen Kunden
              schnell passende Anbieter und klare Offerten brauchen.
            </p>
          </div>

          <div className="services-premium-grid">
            {services.map((service) => (
              <article key={service.title}>
                <span>{service.icon}</span>
                <h3>{service.title}</h3>
                <p>{service.text}</p>
                <Link href="/auftrag-erstellen">Anfrage erstellen →</Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section services-location-section">
        <div className="container services-location-grid">
          <div>
            <span className="eyebrow">Standorte</span>

            <h2>
              Dienstleistungen in
              <br />
              deiner Region.
            </h2>

            <p>
              Lokale Anbieter sind schneller verfügbar, kennen die Region und
              können besser auf deinen Auftrag reagieren.
            </p>
          </div>

          <div className="services-location-tags">
            {locations.map((location) => (
              <Link href="/auftrag-erstellen" key={location}>
                📍 {location}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section services-combo-section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Beliebte Kombinationen</span>

            <h2>
              Häufig gesuchte
              <br />
              Anfragen.
            </h2>
          </div>

          <div className="services-combo-grid">
            {combos.map((combo) => (
              <Link href="/auftrag-erstellen" key={combo}>
                <span>🔎</span>
                <strong>{combo}</strong>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="final">
        <div className="container final-card">
          <span className="eyebrow dark">Jetzt starten</span>

          <h2>
            Anfrage senden.
            <br />
            Anbieter erhalten.
          </h2>

          <p>
            Starte kostenlos und unverbindlich. Auftrago bringt deine Anfrage zu
            passenden regionalen Dienstleistern.
          </p>

          <div className="final-actions">
            <Link href="/auftrag-erstellen" className="btn final-primary">
              Offerte anfragen
            </Link>

            <Link href="/anbieter" className="btn final-secondary">
              Anbieter werden
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}