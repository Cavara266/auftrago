const recentRequests = [
  "Umzugsreinigung in Zürich",
  "Fensterreinigung in Baden",
  "Gartenpflege in Aarau",
  "Hauswartung in Lenzburg",
  "Wohnungsreinigung in Winterthur",
];

export default function HowItWorksSection() {
  return (
    <section className="how-section">
      <div className="how-inner">
        <div className="how-head">
          <span>So einfach funktioniert Auftrago</span>
          <h2>In wenigen Minuten zur passenden Offerte</h2>
        </div>

        <div className="how-grid">
          <div className="how-card">
            <b>1</b>
            <h3>Auftrag beschreiben</h3>
            <p>Wähle die Dienstleistung und beschreibe kurz, was gemacht werden soll.</p>
          </div>

          <div className="how-card">
            <b>2</b>
            <h3>Offerten erhalten</h3>
            <p>Passende regionale Anbieter können sich direkt bei dir melden.</p>
          </div>

          <div className="how-card">
            <b>3</b>
            <h3>Anbieter vergleichen</h3>
            <p>Vergleiche Preise, Leistungen und entscheide unverbindlich.</p>
          </div>
        </div>

        <div className="recent-box">
          <div>
            <span>Live-Aktivität</span>
            <h3>Zuletzt angefragt</h3>
          </div>

          <div className="recent-list">
            {recentRequests.map((item, index) => (
              <p key={item}>
                <strong>Vor {index * 8 + 6} Min.</strong>
                {item}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}