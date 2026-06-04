import Link from "next/link";

const benefits = [
  ["📍", "Regionale Kunden", "Anfragen nur aus deinem Einsatzgebiet."],
  ["⚡", "Schneller Kontakt", "Kunden suchen aktiv und brauchen jetzt eine Firma."],
  ["🎯", "Passende Leads", "Gefiltert nach Leistung, Ort und Bedarf."],
  ["✅", "Volle Kontrolle", "Du entscheidest selbst, welche Anfrage interessant ist."],
];

export default function AnbieterPage() {
  return (
    <main className="page provider-page">
      <section className="provider-hero">
        <div className="container provider-hero-stack">
          <div className="provider-hero-copy">
            <span className="eyebrow">Für Anbieter</span>

            <h1>
              Mehr Aufträge.
              <br />
              Weniger Werbung.
              <br />
              Bessere Leads.
            </h1>

            <p>
              Auftrago verbindet regionale Dienstleister mit Kunden, die konkret
              eine Reinigung, Hauswartung, Umzugsreinigung, Gartenpflege oder
              Entsorgung suchen. Du erhältst keine zufälligen Kontakte, sondern
              strukturierte Anfragen mit klaren Angaben zu Ort, Kategorie, Objekt,
              Termin und Bedarf.
            </p>

            <div className="actions">
              <Link href="/anbieter-registrieren" className="btn btn-primary">
                Anbieter-Anfrage senden
              </Link>
              <Link href="/preise" className="btn btn-secondary">
                Preise ansehen
              </Link>
            </div>

            <div className="trust-row">
              <span>Nur echte Anfragen</span>
              <span>Regionale Kunden</span>
              <span>Keine Kaltakquise</span>
              <span>Volle Kontrolle</span>
            </div>
          </div>

          <div className="giga-system">
            <div className="giga-top">
              <span>Lead-System</span>
              <strong>Live Matching</strong>
            </div>

            <div className="giga-main">
              <div>
                <h2>
                  Aus Anfrage
                  <br />
                  wird Auftrag.
                </h2>
                <p>
                  Jede Anfrage wird sauber vorqualifiziert. Region, Kategorie,
                  Termin und Objekt werden geprüft, bevor ein Lead an passende
                  Anbieter weitergegeben wird.
                </p>
              </div>

              <div className="giga-orbit">
                <div className="giga-ring one"></div>
                <div className="giga-ring two"></div>
                <div className="giga-core">
                  <strong>Auftrago</strong>
                  <span>Matching</span>
                </div>
                <div className="giga-node n1">
                  <b>01</b>
                  <span>Region passt</span>
                </div>
                <div className="giga-node n2">
                  <b>02</b>
                  <span>Kategorie passt</span>
                </div>
                <div className="giga-node n3">
                  <b>03</b>
                  <span>Bedarf ist konkret</span>
                </div>
              </div>
            </div>

            <div className="giga-result">
              <span>Ergebnis</span>
              <strong>Nur passende Leads landen bei dir.</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <span className="eyebrow">Warum mitmachen?</span>
          <h2>Gebaut für lokale Dienstleister.</h2>
          <p className="wide-text">
            Viele Firmen verlieren Zeit mit Werbung, Rückrufen und unklaren
            Anfragen. Auftrago macht den Prozess einfacher: Kunden beschreiben
            ihren Auftrag einmal, du erhältst die wichtigsten Informationen
            sauber zusammengefasst und kannst direkt entscheiden.
          </p>

          <div className="grid-4">
            {benefits.map(([icon, title, text]) => (
              <article className="service-card" key={title}>
                <div className="card-icon">{icon}</div>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="final container">
        <div className="final-card">
          <span className="eyebrow">Jetzt starten</span>
          <h2>Registriere deine Firma und erhalte passende Anfragen.</h2>
          <p>
            Kostenlos anfragen, persönlich prüfen lassen und später selbst
            entscheiden, welche Leads du freischalten möchtest.
          </p>

          <div className="actions center">
            <Link href="/anbieter-registrieren" className="btn btn-primary">
              Firma eintragen
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}