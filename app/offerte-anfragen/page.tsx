export default function OfferteAnfragenPage() {
  return (
    <main className="page">
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <span className="eyebrow">Kostenlos Offerte anfragen</span>
            <h1>Erhalte passende Offerten von regionalen Anbietern.</h1>
            <p>
              Beschreibe deinen Auftrag in wenigen Sekunden und finde schneller
              die richtige Firma für Reinigung, Umzug, Hauswartung, Transport
              oder Entsorgung.
            </p>
          </div>

          <form className="request-form">
            <div className="form-row">
              <input placeholder="Vorname / Name" />
              <input placeholder="E-Mail" />
            </div>

            <div className="form-row">
              <input placeholder="Telefon" />
              <input placeholder="Ort / Region" />
            </div>

            <select>
              <option>Dienstleistung wählen</option>
              <option>Hauswartung</option>
              <option>Reinigung</option>
              <option>Umzug</option>
              <option>Gartenpflege</option>
              <option>Entsorgung</option>
            </select>

            <textarea placeholder="Beschreibe kurz deinen Auftrag" />

            <button type="submit">Kostenlose Anfrage senden</button>
          </form>
        </div>
      </section>
    </main>
  );
}