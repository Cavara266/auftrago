import Link from "next/link";

const packages = [
  {
    badge: "Starter",
    price: "CHF 29",
    credits: "10 Credits",
    text: "Ideal zum Testen. Perfekt, wenn du Auftrago zuerst in deiner Region ausprobieren möchtest.",
    features: ["Gratis registrieren", "Leads vorher prüfen", "Credits flexibel nutzen"],
  },
  {
    badge: "Beliebt",
    price: "CHF 59",
    credits: "25 Credits",
    text: "Für Firmen, die regelmässig passende Anfragen erhalten und mehr Aufträge gewinnen möchten.",
    features: ["Mehr Reichweite", "Passende regionale Leads", "Ideal für aktive Anbieter"],
    active: true,
  },
  {
    badge: "Pro",
    price: "CHF 119",
    credits: "60 Credits",
    text: "Für Anbieter mit mehreren Regionen, mehreren Kategorien oder dauerhaftem Lead-Bedarf.",
    features: ["Hoher Lead-Bedarf", "Mehrere Einsatzgebiete", "Stark für Wachstum"],
  },
];

export default function PreisePage() {
  return (
    <main className="page prices-page">
      <section className="prices-hero">
        <div className="container prices-hero-grid">
          <div>
            <span className="eyebrow">Credits & Preise</span>

            <h1>
              Faire Preise.
              <br />
              Volle Kontrolle.
            </h1>

            <p>
              Bei Auftrago bezahlst du nicht für Sichtbarkeit, Klicks oder Werbung.
              Du bezahlst nur dann, wenn du einen passenden Lead wirklich freischalten
              möchtest.
            </p>

            <div className="actions">
              <Link href="/anbieter-registrieren" className="btn btn-primary">
                Anbieter werden
              </Link>
              <a href="#pakete" className="btn btn-secondary">
                Pakete ansehen
              </a>
            </div>
          </div>

          <div className="price-model-card">
            <span>Pay-per-Contact</span>
            <h2>Keine Fixkosten. Keine Abos. Keine Überraschungen.</h2>

            <div className="price-checks">
              <div>✓ Gratis registrieren</div>
              <div>✓ Leads vorher prüfen</div>
              <div>✓ Nur passende Kontakte freischalten</div>
              <div>✓ Credits flexibel nutzen</div>
            </div>
          </div>
        </div>
      </section>

      <section id="pakete" className="prices-section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Pakete</span>
            <h2>Klare Pakete für Einstieg und Wachstum.</h2>
            <p>
              Wähle ein Paket, das zu deinem aktuellen Bedarf passt. Du kannst
              klein starten und später jederzeit mehr Credits nutzen.
            </p>
          </div>

          <div className="pricing-grid">
            {packages.map((item) => (
              <article
                className={`pricing-card ${item.active ? "active" : ""}`}
                key={item.badge}
              >
                <div className="pricing-badge">{item.badge}</div>

                <h3>{item.price}</h3>
                <strong>{item.credits}</strong>
                <p>{item.text}</p>

                <ul>
                  {item.features.map((feature) => (
                    <li key={feature}>✓ {feature}</li>
                  ))}
                </ul>

                <Link href="/anbieter-registrieren">
                  Credits wählen →
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="prices-section">
        <div className="container price-info-card">
          <div>
            <span className="eyebrow">So funktioniert es</span>
            <h2>Du entscheidest vor dem Kauf.</h2>
          </div>

          <div className="price-info-list">
            <article>
              <span>01</span>
              <h3>Lead ansehen</h3>
              <p>
                Du siehst zuerst die wichtigsten Angaben zur Anfrage: Region,
                Kategorie, Datum, Objekt und Bedarf.
              </p>
            </article>

            <article>
              <span>02</span>
              <h3>Entscheiden</h3>
              <p>
                Wenn der Lead zu deiner Firma passt, kannst du den Kontakt
                freischalten. Wenn nicht, lässt du ihn einfach aus.
              </p>
            </article>

            <article>
              <span>03</span>
              <h3>Kontakt aufnehmen</h3>
              <p>
                Nach der Freischaltung erhältst du die Kontaktdaten und kannst
                direkt ein Angebot erstellen.
              </p>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}