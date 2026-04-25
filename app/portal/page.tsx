const stats = [
  { value: "12", label: "Neue Leads heute" },
  { value: "38", label: "Leads diese Woche" },
  { value: "CHF 240", label: "Verfügbares Guthaben" },
  { value: "21%", label: "Abschlussquote" },
];

const recentLeads = [
  {
    title: "Umzugsreinigung 4.5 Zimmer",
    region: "Zürich",
    category: "Reinigung",
    price: "CHF 28",
    status: "Neu",
  },
  {
    title: "Privatumzug 3.5 Zimmer",
    region: "Baden",
    category: "Umzug",
    price: "CHF 35",
    status: "Neu",
  },
  {
    title: "Hauswartung Mehrfamilienhaus",
    region: "Winterthur",
    category: "Hauswartung",
    price: "CHF 42",
    status: "Neu",
  },
];

const quickActions = [
  {
    title: "Neue Leads ansehen",
    text: "Öffne direkt die Lead-Liste und filtere nach Region oder Kategorie.",
    href: "/portal/leads",
    cta: "Zu den Leads",
  },
  {
    title: "Guthaben aufladen",
    text: "Lade Credits auf, damit du neue Leads ohne Unterbruch kaufen kannst.",
    href: "/portal/guthaben",
    cta: "Guthaben verwalten",
  },
  {
    title: "Firmenprofil bearbeiten",
    text: "Halte Regionen, Dienstleistungen und Firmendaten immer aktuell.",
    href: "/portal/profil",
    cta: "Profil öffnen",
  },
];

export default function PortalDashboardPage() {
  return (
    <main className="page">
      <section className="hero" style={{ paddingBottom: "18px" }}>
        <div className="container">
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "12px",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: "28px",
            }}
          >
            <div>
              <span className="kicker">Firmen-Portal</span>
              <h1 style={{ maxWidth: "14ch" }}>
                Leads. Guthaben. Übersicht.
              </h1>
              <p className="lead" style={{ maxWidth: "74ch" }}>
                Willkommen im Anbieter-Portal. Hier verwaltest du neue Anfragen,
                Käufe, Credits und dein Firmenprofil an einem Ort.
              </p>
            </div>

            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <a href="/portal/leads" className="btn btn-primary">
                Neue Leads
              </a>
              <a href="/registrieren" className="btn btn-secondary">
                Neue Firma registrieren
              </a>
            </div>
          </div>

          <div className="stats-grid">
            {stats.map((item) => (
              <div key={item.label} className="stat-card">
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.2fr 0.8fr",
              gap: "22px",
            }}
            className="portal-grid-main"
          >
            <div className="panel pad-lg">
              <div className="section-head" style={{ marginBottom: "20px" }}>
                <span className="section-kicker">Lead-Überblick</span>
                <h2>Neu eingegangene Leads</h2>
                <p>
                  Die wichtigsten neuen Anfragen direkt auf einen Blick. Öffne die
                  Lead-Liste für alle Details.
                </p>
              </div>

              <div className="providers">
                {recentLeads.map((lead) => (
                  <div key={lead.title} className="panel provider-card" style={{ padding: "22px" }}>
                    <div className="provider-top">
                      <span className="badge white">{lead.status}</span>
                      <span className="badge soft">{lead.category}</span>
                      <span className="badge soft">{lead.region}</span>
                    </div>

                    <div
                      style={{
                        marginTop: "16px",
                        display: "grid",
                        gridTemplateColumns: "1fr auto",
                        gap: "16px",
                        alignItems: "center",
                      }}
                    >
                      <div>
                        <h3 style={{ fontSize: "1.45rem" }}>{lead.title}</h3>
                        <p>Passender regionaler Lead mit vollständigen Basisdaten.</p>
                      </div>

                      <div
                        style={{
                          minWidth: "130px",
                          textAlign: "right",
                        }}
                      >
                        <div style={{ color: "rgba(245,248,255,0.56)", fontSize: "0.9rem" }}>
                          Leadpreis
                        </div>
                        <div
                          style={{
                            marginTop: "6px",
                            fontSize: "1.6rem",
                            fontWeight: 800,
                            letterSpacing: "-0.03em",
                          }}
                        >
                          {lead.price}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: "18px" }}>
                <a href="/portal/leads" className="btn btn-primary">
                  Alle Leads öffnen
                </a>
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gap: "22px",
              }}
            >
              <div className="panel pad-lg">
                <div className="section-head" style={{ marginBottom: "18px" }}>
                  <span className="section-kicker">Navigation</span>
                  <h2 style={{ fontSize: "2rem" }}>Schnellzugriff</h2>
                </div>

                <div className="benefits" style={{ marginTop: 0 }}>
                  {quickActions.map((item) => (
                    <div key={item.title} className="panel benefit-card" style={{ padding: "20px" }}>
                      <h3 style={{ fontSize: "1.3rem" }}>{item.title}</h3>
                      <p>{item.text}</p>
                      <div style={{ marginTop: "14px" }}>
                        <a href={item.href} className="btn btn-secondary">
                          {item.cta}
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="panel pad-lg">
                <div className="section-head" style={{ marginBottom: "12px" }}>
                  <span className="section-kicker">Konto</span>
                  <h2 style={{ fontSize: "2rem" }}>Firmenstatus</h2>
                </div>

                <div className="tag-list" style={{ marginTop: "8px" }}>
                  <span className="tag">Profil aktiv</span>
                  <span className="tag">Zahlung freigegeben</span>
                  <span className="tag">Region Zürich</span>
                  <span className="tag">Reinigung / Umzug</span>
                </div>

                <p style={{ marginTop: "18px", color: "rgba(245,248,255,0.76)", lineHeight: 1.8 }}>
                  Dein Profil ist aktiv. Du kannst neue Leads kaufen, deine
                  Kategorien bearbeiten und weitere Regionen hinzufügen.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="footer-space" />

      <style>{`
        @media (max-width: 1100px) {
          .portal-grid-main {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </main>
  );
}