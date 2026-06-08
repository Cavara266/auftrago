import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kostenlose Offerte anfragen | Auftrago",
  description:
    "Kostenlos und unverbindlich Offerten für Reinigung, Umzug, Hauswartung, Gartenpflege, Entsorgung und weitere Dienstleistungen anfragen.",
  alternates: {
    canonical: "https://www.auftrago.ch/offerte-anfragen",
  },
};

const services = [
  "Reinigung",
  "Umzugsreinigung",
  "Hauswartung",
  "Fensterreinigung",
  "Gartenpflege",
  "Umzug",
  "Transport",
  "Entsorgung",
  "Malerarbeiten",
  "Elektriker",
  "Sanitär",
];

const steps = [
  ["01", "Auftrag beschreiben", "Dienstleistung, Ort, Termin und Details eintragen."],
  ["02", "Anfrage senden", "Deine Anfrage wird strukturiert erfasst."],
  ["03", "Offerten vergleichen", "Du entscheidest selbst, welches Angebot passt."],
];

export default function OfferteAnfragenPage() {
  return (
    <main className="request-page">
      <section className="request-hero">
        <div className="container request-hero-grid">
          <div>
            <span className="anbieter-pill">Kostenlos Offerte anfragen</span>

            <h1>
              Erhalte passende Offerten
              <br />
              von regionalen Anbietern.
            </h1>

            <p>
              Beschreibe deinen Auftrag in wenigen Minuten und finde schneller
              passende Firmen für Reinigung, Umzug, Hauswartung, Gartenpflege,
              Transport oder Entsorgung.
            </p>

            <div className="anbieter-trust">
              <span>✓ Kostenlos</span>
              <span>✓ Unverbindlich</span>
              <span>✓ Regionale Firmen</span>
              <span>✓ Schnell erledigt</span>
            </div>
          </div>

          <form className="request-premium-form">
            <div className="request-form-head">
              <span>Jetzt starten</span>
              <h2>Deine Anfrage</h2>
              <p>Fülle die wichtigsten Angaben aus.</p>
            </div>

            <div className="request-form-row">
              <input name="name" placeholder="Vorname / Name" required />
              <input name="email" type="email" placeholder="E-Mail" required />
            </div>

            <div className="request-form-row">
              <input name="phone" placeholder="Telefon" required />
              <input name="location" placeholder="Ort / Region" required />
            </div>

            <select name="service" required defaultValue="">
              <option value="" disabled>
                Dienstleistung wählen
              </option>
              {services.map((service) => (
                <option key={service} value={service}>
                  {service}
                </option>
              ))}
            </select>

            <textarea
              name="message"
              placeholder="Beschreibe kurz deinen Auftrag, z.B. Wohnungsgrösse, Termin, Besonderheiten..."
              required
            />

            <button type="submit">Kostenlose Anfrage senden</button>

            <small>
              Deine Anfrage ist kostenlos und unverbindlich.
            </small>
          </form>
        </div>
      </section>

      <section className="request-section">
        <div className="container request-steps-grid">
          <div>
            <span className="anbieter-pill">Ablauf</span>
            <h2>So einfach funktioniert Auftrago</h2>
            <p>
              Du musst nicht mehrere Firmen einzeln suchen. Eine Anfrage reicht,
              damit passende Anbieter deine Anfrage prüfen können.
            </p>
          </div>

          <div className="anbieter-step-list">
            {steps.map(([number, title, text]) => (
              <div key={number} className="anbieter-step-card">
                <span>{number}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="request-section request-dark">
        <div className="container request-service-box">
          <span className="anbieter-pill">Dienstleistungen</span>
          <h2>Für viele Aufträge geeignet</h2>

          <div className="request-service-grid">
            {services.map((service) => (
              <Link key={service} href="/leistungen">
                {service}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}