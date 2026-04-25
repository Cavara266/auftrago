export default function HighTechDiagram() {
  const services = [
    ["Hauswartung", "Büroreinigung"],
    ["Treppenhausreinigung", "Umzugsreinigung"],
    ["Gartenpflege", "Umzug"],
    ["Transport", "Entsorgung"],
  ];

  return (
    <section className="diagram-section">
      <div className="container">
        <div className="diagram-shell diagram-shell-tech diagram-shell-showcase">
          <div className="diagram-tech-bg" aria-hidden="true">
            <div className="diagram-grid-lines" />
            <div className="diagram-blur diagram-blur-1" />
            <div className="diagram-blur diagram-blur-2" />
            <div className="diagram-blur diagram-blur-3" />
          </div>

          <div className="diagram-showcase-top">
            <span className="diagram-showcase-chip">
              Für Kunden und Anbieter gleichzeitig optimiert
            </span>

            <h2 className="diagram-showcase-title">
              Eine Plattform, die
              <br />
              Vertrauen, Klarheit und
              <br />
              Conversion in einen
              <br />
              einzigen Ablauf bringt.
            </h2>

            <div className="diagram-showcase-copy">
              <p>
                Kunden erhalten einen klaren, schnellen Weg zur Anfrage.
                Anbieter erhalten strukturierte Leads, weniger Streuverlust und
                mehr Kontrolle darüber, welche Aufträge wirklich zu ihrem
                Angebot passen.
              </p>

              <p>
                Das Ergebnis ist nicht nur ein schönes Design, sondern ein
                System, das besser verkauft, besser filtert und stärker
                konvertiert.
              </p>
            </div>
          </div>

          <div className="diagram-showcase-stage">
            <div className="diagram-showcase-centerline" />

            <div className="diagram-orbit orbit-1">
              <div className="diagram-orbit-core">
                <span>01</span>
                <strong>Input</strong>
              </div>
              <div className="diagram-orbit-card">
                <small>Anfrage</small>
                <h3>Auftrag erfassen</h3>
                <p>
                  Nutzer beschreibt Bedarf, Region und Ziel in wenigen Sekunden.
                </p>
              </div>
            </div>

            <div className="diagram-orbit orbit-2">
              <div className="diagram-orbit-core">
                <span>02</span>
                <strong>Matching</strong>
              </div>
              <div className="diagram-orbit-card">
                <small>Filter</small>
                <h3>Relevanz erhöhen</h3>
                <p>
                  Das System reduziert Komplexität und zeigt passende Anbieter.
                </p>
              </div>
            </div>

            <div className="diagram-orbit orbit-3">
              <div className="diagram-orbit-core">
                <span>03</span>
                <strong>Vergleich</strong>
              </div>
              <div className="diagram-orbit-card">
                <small>Übersicht</small>
                <h3>Klarheit schaffen</h3>
                <p>
                  Preise, Leistung und Reaktionszeit werden verständlicher.
                </p>
              </div>
            </div>

            <div className="diagram-orbit orbit-4">
              <div className="diagram-orbit-core">
                <span>04</span>
                <strong>Conversion</strong>
              </div>
              <div className="diagram-orbit-card">
                <small>Resultat</small>
                <h3>Entscheidung stärken</h3>
                <p>
                  Weniger Unsicherheit, mehr Vertrauen und bessere Abschlüsse.
                </p>
              </div>
            </div>
          </div>

          <div className="diagram-service-grid">
            {services.map((row, rowIndex) =>
              row.map((item) => (
                <div key={`${rowIndex}-${item}`} className="diagram-service-pill">
                  {item}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}