import Link from "next/link";
import HomeLeadForm from "@/components/home-lead-form";

const services = [
  ["Hauswartung", "Unterhalt, Reinigung, Kontrollen, Umgebungspflege und Winterdienst für Liegenschaften."],
  ["Büroreinigung", "Regelmässige Reinigung für Büros, Praxen, Ladenflächen und Gewerbeobjekte."],
  ["Treppenhausreinigung", "Saubere Eingänge, Treppenhäuser, Kellerbereiche und Gemeinschaftsflächen."],
  ["Umzugsreinigung", "Endreinigung, Wohnungsabgabe und Reinigung mit klarer Offertenanfrage."],
  ["Gartenpflege", "Rasen, Hecken, Laub, Saisonarbeiten und gepflegte Aussenbereiche."],
  ["Entsorgung", "Räumung, Sperrgut, Keller, Estrich, Transport und fachgerechte Entsorgung."],
];

const regions = ["Zürich", "Aargau", "Aarau", "Baden", "Winterthur", "Basel", "Bern", "Luzern", "Zug", "Schweiz"];

export default function HomePage() {
  return (
    <main>
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">Premium Offertenplattform Schweiz</span>

            <h1>
              In 60 Sekunden
              <br />
              zur passenden
              <br />
              Offerte.
            </h1>

            <p>
              Beschreibe deinen Auftrag einmal. Auftrago verbindet dich mit
              passenden regionalen Anbietern für Reinigung, Hauswartung, Umzug,
              Gartenpflege und Entsorgung.
            </p>

            <div className="hero-actions">
              <a href="#anfrage" className="btn btn-primary">
                Kostenlose Offerte anfragen
              </a>
              <Link href="/anbieter" className="btn btn-secondary">
                Anbieter werden
              </Link>
            </div>

            <div className="trust-row">
              <span>✓ Kostenlos & unverbindlich</span>
              <span>✓ Regionale Anbieter</span>
              <span>✓ Antwort in kurzer Zeit</span>
            </div>
          </div>

          <div id="anfrage" className="form-panel">
            <div className="form-badge">Beliebte Anfrage</div>
            <HomeLeadForm />
          </div>
        </div>
      </section>

    <section className="conversion-strip">
  <div className="container conversion-grid">
    <div className="conversion-card">
      <span className="conversion-icon">⚡</span>
      <div>
        <strong>60 Sek.</strong>
        <p>Anfrage starten</p>
      </div>
    </div>

    <div className="conversion-card">
      <span className="conversion-icon">📍</span>
      <div>
        <strong>CH</strong>
        <p>Regionale Anbieter</p>
      </div>
    </div>

    <div className="conversion-card">
      <span className="conversion-icon">🎁</span>
      <div>
        <strong>Gratis</strong>
        <p>Unverbindlich</p>
      </div>
    </div>

    <div className="conversion-card">
      <span className="conversion-icon">🕒</span>
      <div>
        <strong>24h</strong>
        <p>Schnelle Rückmeldung</p>
      </div>
    </div>
  </div>
</section>

      <section className="section">
        <div className="container intro-panel">
          <div>
            <span className="eyebrow dark">Warum Auftrago</span>
            <h2>Eine Anfrage reicht.</h2>
          </div>
          <div>
            <p>
              Wer eine Hauswartung, Reinigung oder Umzugsfirma sucht, will nicht
              stundenlang Webseiten vergleichen. Auftrago macht den Prozess
              klar: Auftrag beschreiben, Region angeben und passende Offerten erhalten.
            </p>
            <p>
              Anbieter erhalten strukturierte Leads mit den wichtigsten Angaben.
              Dadurch entstehen weniger Rückfragen und bessere Entscheidungen.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Leistungen</span>
            <h2>Für Services mit echter Nachfrage.</h2>
          </div>

          <div className="service-grid">
            {services.map(([title, text]) => (
              <article className="service-card" key={title}>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section premium-region">
        <div className="container premium-region-grid">
          <div className="premium-region-left">
            <span className="eyebrow">Regionen</span>
            <h2>
              Stark in Zürich,
              <br />
              Aargau und der
              <br />
              ganzen Schweiz.
            </h2>
            <p>
              Lokale Dienstleistungen brauchen Nähe. Deshalb setzt Auftrago auf
              klare Kategorien, regionale Anfragen und passende Anbieter.
            </p>
          </div>

          <div className="premium-region-right">
            {regions.map((region) => (
              <div className="region-pill" key={region}>
                {region}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="final">
        <div className="container final-card">
          <span className="eyebrow dark">Jetzt starten</span>
          <h2>
            Jetzt Anfrage senden.
            <br />
            Passende Anbieter erhalten.
          </h2>
          <p>
            Kostenlos, unverbindlich und regional. Starte deine Anfrage in weniger
            als einer Minute.
          </p>

          <div className="final-actions">
            <a href="#anfrage" className="btn final-primary">
              Kostenlose Offerte anfragen
            </a>
            <Link href="/anbieter" className="btn final-secondary">
              Anbieter werden
            </Link>
          </div>
        </div>
      </section>

      <div className="sticky-conversion-bar">
        <span>✓ Kostenlos</span>
        <span>✓ Regional</span>
        <span>✓ 60 Sekunden</span>
        <a href="#anfrage">Offerte anfragen</a>
      </div>
    </main>
  );
}