import Link from "next/link";
import HomeLeadForm from "@/components/home-lead-form";

const services = [
  {
    icon: "🧹",
    title: "Reinigung",
    text: "Wohnungsreinigung, Büroreinigung, Baureinigung, Unterhaltsreinigung und Spezialreinigungen für private und gewerbliche Kunden.",
  },
  {
    icon: "📦",
    title: "Umzug & Transport",
    text: "Privatumzug, Firmenumzug, Möbeltransport, Entsorgung und Unterstützung rund um den gesamten Umzug.",
  },
  {
    icon: "🏢",
    title: "Hauswartung",
    text: "Unterhalt, Kontrolle, Reinigung, Umgebungspflege, Winterdienst und technische Betreuung für Liegenschaften.",
  },
  {
    icon: "🌿",
    title: "Gartenpflege",
    text: "Rasenmähen, Heckenschnitt, Laubarbeiten, Saisonpflege und regelmässige Pflege von Aussenbereichen.",
  },
  {
    icon: "🎨",
    title: "Malerarbeiten",
    text: "Innenanstriche, Fassaden, Renovationen, Ausbesserungen und saubere Arbeiten für Wohnungen und Häuser.",
  },
  {
    icon: "⚡",
    title: "Elektriker",
    text: "Installationen, Reparaturen, Sicherheit, Beleuchtung und kleinere Elektroarbeiten durch passende Fachbetriebe.",
  },
  {
    icon: "🚿",
    title: "Sanitär",
    text: "Reparaturen, Installationen, Badarbeiten, Armaturen, Leitungen und schnelle Hilfe bei Sanitärproblemen.",
  },
  {
    icon: "♻️",
    title: "Entsorgung",
    text: "Entrümpelung, Sperrgut, Keller, Estrich, Räumungen und fachgerechte Entsorgung inklusive Transport.",
  },
  {
    icon: "🪟",
    title: "Fensterreinigung",
    text: "Fenster, Glasfassaden, Wintergärten, Storen und Glasflächen für private und gewerbliche Objekte.",
  },
];

const regions = [
  "Zürich",
  "Aargau",
  "Aarau",
  "Baden",
  "Winterthur",
  "Basel",
  "Bern",
  "Luzern",
  "Zug",
  "Schweiz",
];

export default function HomePage() {
  return (
    <main className="home-page premium-home">
      <section className="premium-hero">
        <div className="container premium-hero-grid">
          <div className="premium-hero-copy">
            <span className="eyebrow">Premium Offertenplattform Schweiz</span>

            <h1>
              In 60 Sekunden zur passenden Offerte.
            </h1>

            <p>
              Auftrago hilft dir, schnell und unkompliziert passende Anbieter für
              Reinigung, Hauswartung, Umzug, Gartenpflege, Entsorgung und weitere
              Dienstleistungen zu finden.
            </p>

            <p>
              Statt viele Firmen einzeln anzurufen, beschreibst du deinen Auftrag
              einmal. Deine Anfrage wird klar strukturiert, damit regionale Anbieter
              direkt verstehen, was du brauchst.
            </p>

            <div className="actions">
              <a href="#anfrage" className="btn btn-primary">
                Kostenlose Offerte anfragen
              </a>
              <Link href="/anbieter" className="btn btn-secondary">
                Anbieter werden
              </Link>
            </div>
          </div>

          <div id="anfrage" className="premium-form-shell">
            <div className="form-badge">Beliebte Anfrage</div>
            <HomeLeadForm />
          </div>
        </div>
      </section>

      <section className="premium-section">
        <div className="container premium-intro-card">
          <div>
            <span className="eyebrow">Warum Auftrago?</span>
            <h2>Eine Anfrage reicht.</h2>
          </div>

          <div className="premium-text">
            <p>
              Kein stundenlanges Suchen, Vergleichen und Anrufen. Du beschreibst
              deinen Auftrag, gibst die Region an und erhältst passende Rückmeldungen
              von regionalen Dienstleistern.
            </p>

            <p>
              Besonders bei Umzugsreinigung, Treppenhausreinigung, Hauswartung,
              Gartenpflege oder Räumungen ist es wichtig, dass Anbieter von Anfang
              an die richtigen Informationen erhalten.
            </p>

            <p>
              Auftrago macht genau das: klare Angaben, bessere Offerten, weniger
              Rückfragen und schnellere Entscheidungen.
            </p>
          </div>
        </div>
      </section>

      <section className="premium-section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Leistungen</span>
            <h2>Für starke lokale Dienstleister.</h2>
            <p>
              Auftrago bündelt Anfragen aus Bereichen, in denen Kunden oft schnell
              eine zuverlässige Firma benötigen. Dadurch entstehen bessere Anfragen,
              bessere Offerten und bessere Entscheidungen.
            </p>
          </div>

          <div className="premium-service-grid">
            {services.map((service) => (
              <article className="premium-service-card" key={service.title}>
                <div className="premium-service-icon">{service.icon}</div>
                <h3>{service.title}</h3>
                <p>{service.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="premium-section">
        <div className="container premium-provider-card">
          <span className="eyebrow">Für Anbieter</span>

          <h2>Mehr relevante Leads. Weniger Streuverlust.</h2>

          <p>
            Für Anbieter ist Auftrago eine Möglichkeit, Anfragen von Kunden zu
            erhalten, die bereits konkret nach einer Dienstleistung suchen.
            Statt teure Werbung ohne klare Absicht zu schalten, bekommen Anbieter
            strukturierte Anfragen mit Region, Kategorie und Bedarf.
          </p>

          <p>
            Anbieter werden nicht automatisch freigeschaltet. Jede Anmeldung wird
            geprüft, damit die Plattform sauber, regional und hochwertig bleibt.
          </p>

          <div className="actions">
            <Link href="/anbieter" className="btn btn-primary">
              Anbieter werden
            </Link>
            <Link href="/preise" className="btn btn-secondary">
              Preise ansehen
            </Link>
          </div>
        </div>
      </section>

      <section className="premium-section">
        <div className="container premium-region-card">
          <div>
            <span className="eyebrow">Regionen</span>
            <h2>Stark in Zürich, Aargau und der ganzen Schweiz.</h2>
            <p>
              Lokale Dienstleistungen brauchen Nähe. Deshalb setzt Auftrago auf
              regionale Anfragen und passende Anbieter aus der Umgebung.
            </p>
          </div>

          <div className="premium-region-list">
            {regions.map((region) => (
              <span key={region}>{region}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="premium-final">
        <div className="container premium-final-card">
          <span className="eyebrow">Jetzt starten</span>
          <h2>Beschreibe deinen Auftrag einmal. Erhalte passende Offerten.</h2>
          <p>
            Kostenlos, unverbindlich und regional. Starte deine Anfrage in weniger
            als einer Minute und finde passende Anbieter ohne unnötigen Aufwand.
          </p>

          <div className="actions center">
            <a href="#anfrage" className="btn btn-primary">
              Kostenlose Offerte anfragen
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}