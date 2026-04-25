export default function HighTechDiagram() {
  const steps = [
    {
      number: "01",
      label: "Input",
      title: "Anfrage erfassen",
      text: "Der Kunde beschreibt Auftrag, Region und Ziel in unter 60 Sekunden. Klare Daten schaffen sofort bessere Ausgangslage für sauberes Matching.",
      stat: "60 Sek.",
    },
    {
      number: "02",
      label: "Matching",
      title: "Passende Anbieter filtern",
      text: "Das System reduziert Komplexität und zeigt nur relevante Anbieter, statt Nutzer mit zu vielen unklaren Optionen zu überladen.",
      stat: "Regional",
    },
    {
      number: "03",
      label: "Vergleich",
      title: "Offerten vergleichen",
      text: "Preis, Leistung, Reaktionszeit und Qualität werden verständlicher. Genau dadurch sinkt Unsicherheit und die Entscheidung wird schneller.",
      stat: "Transparent",
    },
    {
      number: "04",
      label: "Conversion",
      title: "Beste Entscheidung treffen",
      text: "Am Ende entsteht genau das, was zählt: eine schnelle, sichere Entscheidung mit höherem Vertrauen und besserer Abschlusswahrscheinlichkeit.",
      stat: "High Intent",
    },
  ];

  return (
    <section className="diagram-section">
      <div className="container">
        <div className="diagram-shell diagram-shell-tech">
          <div className="diagram-tech-bg" aria-hidden="true">
            <div className="diagram-grid-lines" />
            <div className="diagram-blur diagram-blur-1" />
            <div className="diagram-blur diagram-blur-2" />
          </div>

          <div className="diagram-header">
            <span className="section-chip">Systemlogik</span>

            <h2 className="diagram-title diagram-title-tech">
              So macht Auftrago aus
              <br />
              Interesse eine Entscheidung.
            </h2>

            <p className="diagram-copy diagram-copy-tech">
              Dieses Diagramm zeigt nicht einfach nur einen Ablauf. Es zeigt den
              eigentlichen Mechanismus hinter Vertrauen, Relevanz und
              Conversion. Jeder Schritt reduziert Reibung, erhöht Klarheit und
              bringt Nutzer näher zur Handlung.
            </p>
          </div>

          <div className="diagram-tech-layout">
            <div className="diagram-tech-rail">
              {steps.map((step, index) => (
                <div key={step.number} className="diagram-tech-step">
                  <div className="diagram-tech-node">
                    <span>{step.number}</span>
                  </div>

                  {index < steps.length - 1 ? (
                    <div className="diagram-tech-line" />
                  ) : null}

                  <div className="diagram-tech-side">
                    <small>{step.label}</small>
                    <strong>{step.stat}</strong>
                  </div>
                </div>
              ))}
            </div>

            <div className="diagram-tech-cards">
              {steps.map((step) => (
                <article key={step.number} className="diagram-tech-card">
                  <div className="diagram-tech-card-top">
                    <div className="diagram-tech-kicker">{step.label}</div>
                    <div className="diagram-tech-badge">{step.stat}</div>
                  </div>

                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="diagram-result diagram-result-tech">
            <div className="diagram-result-box">
              <span className="diagram-result-kicker">Ergebnis</span>

              <h3>
                Mehr Vertrauen.
                <br />
                Mehr Relevanz.
                <br />
                Mehr Abschlussstärke.
              </h3>

              <div className="diagram-result-grid">
                <div className="diagram-result-item">
                  <strong>+ Vertrauen</strong>
                  <p>durch hochwertige Wahrnehmung und klare Benutzerführung</p>
                </div>

                <div className="diagram-result-item">
                  <strong>+ Relevanz</strong>
                  <p>durch gezieltes Matching statt unübersichtlicher Auswahl</p>
                </div>

                <div className="diagram-result-item">
                  <strong>+ Conversion</strong>
                  <p>durch schnellere Entscheidungen mit weniger Unsicherheit</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}