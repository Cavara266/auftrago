export default function WhyAuftragoSection() {
  return (
    <section className="premium-section">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">Warum Auftrago?</span>
          <h2>Der einfachste Weg zur passenden Offerte</h2>
          <p>
            Spare Zeit und vergleiche mehrere regionale Anbieter mit nur einer
            Anfrage.
          </p>
        </div>

        <div className="comparison-grid">
          <div className="comparison-card comparison-good">
            <h3>✅ Mit Auftrago</h3>

            <ul>
              <li>Mehrere Offerten mit einer Anfrage</li>
              <li>Kostenlos & unverbindlich</li>
              <li>Regionale Anbieter vergleichen</li>
              <li>Preise transparent gegenüberstellen</li>
              <li>Anfrage in weniger als 2 Minuten</li>
            </ul>
          </div>

          <div className="comparison-card">
            <h3>❌ Klassische Google-Suche</h3>

            <ul>
              <li>Jede Firma einzeln kontaktieren</li>
              <li>Viel Zeitaufwand</li>
              <li>Wenig Preisübersicht</li>
              <li>Keine direkten Vergleiche</li>
              <li>Oft mehrere Telefonate nötig</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}