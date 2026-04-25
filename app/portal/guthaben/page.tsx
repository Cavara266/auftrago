const creditStats = [
  { value: "CHF 240", label: "Aktuelles Guthaben" },
  { value: "7", label: "Heute kaufbare Leads" },
  { value: "CHF 31", label: "Ø Leadpreis" },
  { value: "21%", label: "Abschlussquote" },
];

const packages = [
  {
    name: "Starter",
    price: "CHF 100",
    credits: "100 Credits",
    highlight: false,
    text: "Ideal für kleinere Betriebe, die erste Leads testen und neue Regionen erschliessen möchten.",
    perks: [
      "Sofort aktivierbar",
      "Für erste Lead-Käufe",
      "Einfacher Einstieg",
    ],
  },
  {
    name: "Growth",
    price: "CHF 250",
    credits: "270 Credits",
    highlight: true,
    text: "Die beste Wahl für Firmen, die regelmässig Leads kaufen und konstant neue Anfragen erhalten möchten.",
    perks: [
      "Mehr Credits zum besseren Preis",
      "Ideal für aktive Anbieter",
      "Stärker für laufende Akquise",
    ],
  },
  {
    name: "Pro",
    price: "CHF 500",
    credits: "575 Credits",
    highlight: false,
    text: "Für Unternehmen mit mehreren Regionen, höherem Volumen und klarer Wachstumsstrategie.",
    perks: [
      "Für intensiven Lead-Einkauf",
      "Sehr gutes Preis-Leistungs-Verhältnis",
      "Für skalierbare Akquise",
    ],
  },
];

const transactions = [
  {
    date: "12.03.2026",
    type: "Lead gekauft",
    info: "Umzugsreinigung nach Wohnungsabgabe",
    amount: "- CHF 28",
    status: "Abgeschlossen",
  },
  {
    date: "11.03.2026",
    type: "Guthaben aufgeladen",
    info: "Growth Paket",
    amount: "+ CHF 250",
    status: "Gutgeschrieben",
  },
  {
    date: "10.03.2026",
    type: "Lead gekauft",
    info: "Privatumzug innerhalb Baden",
    amount: "- CHF 35",
    status: "Abgeschlossen",
  },
  {
    date: "09.03.2026",
    type: "Lead gekauft",
    info: "Hauswartung Mehrfamilienhaus",
    amount: "- CHF 42",
    status: "Abgeschlossen",
  },
];

export default function PortalGuthabenPage() {
  return (
    <main className="page">
      <section className="hero" style={{ paddingBottom: "12px" }}>
        <div className="container">
          <span className="kicker">Credits & Guthaben</span>
          <h1 style={{ maxWidth: "12ch" }}>Lade Guthaben auf. Kaufe mehr Leads.</h1>
          <p className="lead" style={{ maxWidth: "70ch" }}>
            Ein klarer Guthabenbereich erhöht die Kaufbereitschaft. Firmen sollen
            sofort sehen, wie viel Budget verfügbar ist, welche Pakete Sinn machen
            und wie schnell sie neue Leads freischalten können.
          </p>

          <div className="hero-actions">
            <a href="/portal/leads" className="btn btn-secondary">
              Leads ansehen
            </a>
            <a href="#pakete" className="btn btn-primary">
              Guthaben aufladen
            </a>
          </div>

          <div className="stats-grid" style={{ marginTop: "22px" }}>
            {creditStats.map((item) => (
              <div key={item.label} className="stat-card">
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pakete" className="section">
        <div className="container">
          <div className="section-head">
            <span className="section-kicker">Pakete</span>
            <h2>Aufladepakete für aktive Anbieter</h2>
            <p>
              Diese Pakete sind so aufgebaut, dass Firmen schnell entscheiden und
              ohne Reibung Guthaben nachladen können.
            </p>
          </div>

          <div className="credit-pack-grid">
            {packages.map((pkg) => (
              <article
                key={pkg.name}
                className={`panel credit-pack-card ${pkg.highlight ? "credit-pack-featured" : ""}`}
              >
                <div className="provider-top">
                  <span className={`badge ${pkg.highlight ? "white" : "soft"}`}>
                    {pkg.highlight ? "Beliebtestes Paket" : "Lead-Paket"}
                  </span>
                </div>

                <div style={{ marginTop: "18px" }}>
                  <h3 style={{ margin: 0, fontSize: "2rem", letterSpacing: "-0.03em" }}>
                    {pkg.name}
                  </h3>
                  <div
                    style={{
                      marginTop: "10px",
                      fontSize: "2.2rem",
                      fontWeight: 800,
                      letterSpacing: "-0.05em",
                    }}
                  >
                    {pkg.price}
                  </div>
                  <div
                    style={{
                      marginTop: "6px",
                      color: "rgba(245,248,255,0.68)",
                      fontSize: "1rem",
                    }}
                  >
                    {pkg.credits}
                  </div>
                  <p style={{ marginTop: "16px" }}>{pkg.text}</p>
                </div>

                <div className="benefits" style={{ marginTop: "18px" }}>
                  {pkg.perks.map((perk) => (
                    <div key={perk} className="panel benefit-card" style={{ padding: "16px" }}>
                      <h3 style={{ fontSize: "1rem", margin: 0 }}>{perk}</h3>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: "18px" }}>
                  <button className="btn btn-primary btn-block">
                    {pkg.name} Paket kaufen
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="portal-finance-grid">
            <div className="panel pad-lg">
              <div className="section-head" style={{ marginBottom: "18px" }}>
                <span className="section-kicker">Kaufhistorie</span>
                <h2>Letzte Transaktionen</h2>
                <p>
                  Transparenz ist wichtig. Firmen sollen Käufe, Aufladungen und
                  Bewegungen sofort nachvollziehen können.
                </p>
              </div>

              <div className="transaction-list">
                {transactions.map((item) => (
                  <div key={`${item.date}-${item.info}`} className="transaction-row">
                    <div>
                      <div className="transaction-title">{item.type}</div>
                      <div className="transaction-info">{item.info}</div>
                    </div>

                    <div>
                      <div className="transaction-date">{item.date}</div>
                      <div className="transaction-status">{item.status}</div>
                    </div>

                    <div className="transaction-amount">{item.amount}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: "grid", gap: "22px" }}>
              <div className="panel pad-lg">
                <div className="section-head" style={{ marginBottom: "14px" }}>
                  <span className="section-kicker">Warum mehr Guthaben?</span>
                  <h2 style={{ fontSize: "2rem" }}>Mehr Budget = mehr Chancen</h2>
                </div>

                <div className="tag-list" style={{ marginTop: 0 }}>
                  <span className="tag">Mehr Leads sofort kaufbar</span>
                  <span className="tag">Schneller reagieren</span>
                  <span className="tag">Weniger Unterbrechungen</span>
                  <span className="tag">Bessere Akquiseplanung</span>
                </div>

                <p style={{ marginTop: "18px", color: "rgba(245,248,255,0.76)", lineHeight: 1.8 }}>
                  Firmen mit verfügbarem Guthaben reagieren schneller, kaufen öfter
                  relevante Leads und erhöhen damit ihre Abschlusschancen deutlich.
                </p>

                <div style={{ marginTop: "18px" }}>
                  <button className="btn btn-primary btn-block">Jetzt Guthaben aufladen</button>
                </div>
              </div>

              <div className="panel pad-lg">
                <div className="section-head" style={{ marginBottom: "12px" }}>
                  <span className="section-kicker">Zahlung</span>
                  <h2 style={{ fontSize: "2rem" }}>Sicher & einfach</h2>
                </div>

                <div className="benefits" style={{ marginTop: 0 }}>
                  <div className="panel benefit-card" style={{ padding: "16px" }}>
                    <h3 style={{ fontSize: "1rem" }}>Kartenzahlung</h3>
                    <p>Schnelle Freischaltung direkt nach erfolgreicher Zahlung.</p>
                  </div>
                  <div className="panel benefit-card" style={{ padding: "16px" }}>
                    <h3 style={{ fontSize: "1rem" }}>Rechnung / Bank</h3>
                    <p>Geeignet für Firmen mit internen Freigaben oder Buchhaltung.</p>
                  </div>
                  <div className="panel benefit-card" style={{ padding: "16px" }}>
                    <h3 style={{ fontSize: "1rem" }}>Volle Übersicht</h3>
                    <p>Alle Bewegungen klar im Portal dokumentiert und nachvollziehbar.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="footer-space" />

      <style>{`
        .credit-pack-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 22px;
        }

        .credit-pack-card {
          padding: 26px;
          position: relative;
          overflow: hidden;
        }

        .credit-pack-featured {
          border-color: rgba(255,255,255,0.2);
          box-shadow: 0 28px 60px rgba(0,0,0,0.28);
        }

        .credit-pack-featured::before {
          content: "";
          position: absolute;
          inset: -20% -20% auto auto;
          width: 220px;
          height: 220px;
          border-radius: 999px;
          background: radial-gradient(circle, rgba(95,173,255,0.16), transparent 70%);
          pointer-events: none;
        }

        .portal-finance-grid {
          display: grid;
          grid-template-columns: 1.15fr 0.85fr;
          gap: 22px;
        }

        .transaction-list {
          display: grid;
          gap: 14px;
        }

        .transaction-row {
          display: grid;
          grid-template-columns: 1fr auto auto;
          gap: 18px;
          align-items: center;
          padding: 18px 20px;
          border-radius: 22px;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.04);
        }

        .transaction-title {
          font-weight: 800;
          letter-spacing: -0.02em;
        }

        .transaction-info,
        .transaction-date,
        .transaction-status {
          margin-top: 4px;
          color: rgba(245,248,255,0.68);
          font-size: 0.95rem;
        }

        .transaction-amount {
          font-size: 1.1rem;
          font-weight: 800;
          letter-spacing: -0.02em;
          white-space: nowrap;
        }

        @media (max-width: 1100px) {
          .credit-pack-grid,
          .portal-finance-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .transaction-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </main>
  );
}