import Link from "next/link";

const services = [
  ["🧹", "Reinigung", "Wohnungsreinigung, Büroreinigung, Baureinigung, Unterhaltsreinigung und Spezialreinigung."],
  ["📦", "Umzug & Transport", "Privatumzug, Firmenumzug, Möbeltransport, Kleintransport und Entsorgung beim Umzug."],
  ["🏢", "Hauswartung", "Unterhalt, Kontrolle, technische Betreuung, Umgebungspflege und Winterdienst."],
  ["🌿", "Gartenpflege", "Rasenmähen, Heckenschnitt, Laubarbeiten, Saisonpflege und gepflegte Aussenbereiche."],
  ["🎨", "Malerarbeiten", "Innenanstrich, Fassaden, Renovationen, Ausbesserungen und frische Räume."],
  ["⚡", "Elektriker", "Installationen, Reparaturen, Sicherheit, Beleuchtung und technische Arbeiten."],
  ["🚿", "Sanitär", "Reparaturen, Installationen, Badarbeiten, Armaturen und kleinere Sanitäraufträge."],
  ["♻️", "Entsorgung", "Entrümpelung, Sperrgut, Keller, Estrich, Räumung und fachgerechte Entsorgung."],
  ["🪟", "Fensterreinigung", "Fenster, Glasfassaden, Wintergärten, Storen und gründliche Glasreinigung."],
];

export default function LeistungenPage() {
  return (
    <main className="page">
      <section className="leistungen-hero">
        <div className="container">
          <span className="eyebrow">Über 500+ Leistungen</span>

          <h1>
            Alle Leistungen.
            <br />
            Alles einfach vergleichen.
          </h1>

          <p>
            Auftrago hilft dir, für fast jeden Auftrag passende Anbieter in deiner Region zu finden.
            Du beschreibst einmal, was du brauchst – wir strukturieren deine Anfrage und verbinden dich
            mit Dienstleistern, die wirklich zu deinem Auftrag passen.
          </p>

          <div className="actions">
            <Link href="/offerte-anfragen" className="btn btn-primary">
              Kostenlose Offerte anfragen
            </Link>
            <Link href="/anbieter" className="btn btn-secondary">
              Anbieter werden
            </Link>
          </div>
        </div>
      </section>

      <section className="section leistungen-section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Kategorien</span>
            <h2>Wähle deine passende Dienstleistung.</h2>
            <p>
              Ob Reinigung, Hauswartung, Umzug, Gartenpflege oder Entsorgung: Jede Kategorie ist so aufgebaut,
              dass Anbieter schnell verstehen, was du brauchst. Dadurch erhältst du bessere Rückmeldungen,
              klarere Preise und weniger unnötige Rückfragen.
            </p>
          </div>

          <div className="premium-service-grid">
            {services.map(([icon, title, text]) => (
              <article className="premium-service-card" key={title}>
                <div className="premium-service-icon">{icon}</div>
                <h3>{title}</h3>
                <p>{text}</p>
                <Link href="/offerte-anfragen">Offerte anfragen →</Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container leistungen-info-card">
          <div>
            <span className="eyebrow">So funktioniert es</span>
            <h2>Eine Anfrage. Mehrere Möglichkeiten.</h2>
          </div>

          <div className="leistungen-info-text">
            <p>
              Statt verschiedene Firmen einzeln anzurufen, sendest du deine Anfrage einmal über Auftrago.
              Wichtig sind Angaben wie Ort, gewünschte Dienstleistung, Objektart, Termin und kurze Beschreibung.
            </p>
            <p>
              Danach können passende Anbieter deine Anfrage prüfen und dir ein Angebot machen. Das spart Zeit,
              macht den Vergleich einfacher und hilft dir, schneller eine gute Entscheidung zu treffen.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}