export default function DecisionDiagram() {
  const steps = [
    {
      number: "01",
      label: "Input",
      title: "Auftrag erfassen",
      text: "Der Nutzer beschreibt Auftrag, Region und gewünschte Leistung in unter 60 Sekunden.",
    },
    {
      number: "02",
      label: "Matching",
      title: "Passende Anbieter filtern",
      text: "Das System ordnet nur relevante Firmen zu und reduziert unnötige Streuverluste.",
    },
    {
      number: "03",
      label: "Vergleich",
      title: "Angebote vergleichen",
      text: "Preise, Leistungen und Rückmeldezeiten werden klar und verständlich gegenübergestellt.",
    },
    {
      number: "04",
      label: "Conversion",
      title: "Beste Entscheidung treffen",
      text: "Der Nutzer wählt schnell den passenden Anbieter und konvertiert mit mehr Vertrauen.",
    },
  ];

  return (
    <section className="diagram-section">
      <div className="container">
        <div className="diagram-shell">
          <div className="diagram-header">
            <span className="section-chip">Diagramm</span>
            <h2 className="diagram-title">
              So bewegt Auftrago Nutzer
              <br />
              schneller zur Entscheidung
            </h2>
            <p className="diagram-copy">
              Dieses Diagramm macht den eigentlichen Produktvorteil sichtbar:
              weniger Reibung, klarere Auswahl und bessere Conversion.
            </p>
          </div>

          <div className="diagram-timeline">
            <div className="diagram-line" />

            {steps.map((step) => (
              <div key={step.number} className="diagram-item">
                <div className="diagram-node">
                  <span>{step.number}</span>
                </div>

                <div className="diagram-card">
                  <div className="diagram-label">{step.label}</div>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="diagram-result">
            <div className="diagram-result-box">
              <span className="diagram-result-kicker">Ergebnis</span>
              <h3>Mehr Vertrauen. Mehr Klarheit. Mehr Abschlussstärke.</h3>

              <div className="diagram-result-grid">
                <div className="diagram-result-item">
                  <strong>+ Vertrauen</strong>
                  <p>durch klare Struktur und hochwertige Darstellung</p>
                </div>
                <div className="diagram-result-item">
                  <strong>+ Relevanz</strong>
                  <p>durch regionales Matching statt unübersichtlicher Listen</p>
                </div>
                <div className="diagram-result-item">
                  <strong>+ Conversion</strong>
                  <p>durch schnelle Entscheidungen mit weniger Unsicherheit</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}