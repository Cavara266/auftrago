const settingsModules = [
  {
    title: "Lead-Benachrichtigungen",
    text: "Erhalte Meldungen nur für passende Regionen und Dienstleistungen.",
  },
  {
    title: "Kaufpräferenzen",
    text: "Definiere Budget, Kategorien und Priorität für neue Leads.",
  },
  {
    title: "Sicherheit & Konto",
    text: "Verwalte Passwort, Login-Schutz und Zugriff auf dein Firmenkonto.",
  },
];

export default function PortalEinstellungenPage() {
  return (
    <main className="page">
      <section className="hero" style={{ paddingBottom: "14px" }}>
        <div className="container">
          <span className="kicker">Einstellungen</span>
          <h1 style={{ maxWidth: "11ch" }}>Steuere dein Portal so, wie es Leads verkauft.</h1>
          <p className="lead" style={{ maxWidth: "72ch" }}>
            Gute Einstellungen helfen Firmen, relevanter einzukaufen, schneller zu
            reagieren und keine Chancen zu verlieren.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="settings-grid-live">
            <div className="panel form-card">
              <div className="form-head">
                <div>
                  <div className="form-kicker">Konto</div>
                  <h2>Portal-Einstellungen</h2>
                </div>
                <span className="form-badge">Aktiv</span>
              </div>

              <form className="form-fields">
                <div className="field">
                  <label>E-Mail für Benachrichtigungen</label>
                  <input type="email" defaultValue="info@cavara-hauswartung.ch" />
                </div>

                <div className="two-cols">
                  <div className="field">
                    <label>SMS / WhatsApp Alerts</label>
                    <select defaultValue="Aktiv">
                      <option>Aktiv</option>
                      <option>Inaktiv</option>
                    </select>
                  </div>
                  <div className="field">
                    <label>Sofortbenachrichtigung</label>
                    <select defaultValue="Ja">
                      <option>Ja</option>
                      <option>Nein</option>
                    </select>
                  </div>
                </div>

                <div className="two-cols">
                  <div className="field">
                    <label>Bevorzugte Region</label>
                    <select defaultValue="Zürich">
                      <option>Zürich</option>
                      <option>Aargau</option>
                      <option>Winterthur</option>
                      <option>Baden</option>
                    </select>
                  </div>
                  <div className="field">
                    <label>Lead-Budget pro Kauf</label>
                    <select defaultValue="Bis CHF 40">
                      <option>Bis CHF 25</option>
                      <option>Bis CHF 40</option>
                      <option>Bis CHF 60</option>
                      <option>Ohne Limit</option>
                    </select>
                  </div>
                </div>

                <div className="field">
                  <label>Bevorzugte Dienstleistungen</label>
                  <textarea defaultValue="Reinigung, Umzugsreinigung, Unterhaltsreinigung, Hauswartung" />
                </div>

                <div className="two-cols">
                  <div className="field">
                    <label>Automatische Kauf-Freigabe</label>
                    <select defaultValue="Nein">
                      <option>Nein</option>
                      <option>Ja</option>
                    </select>
                  </div>
                  <div className="field">
                    <label>Monatslimit</label>
                    <input type="text" placeholder="z. B. CHF 1'500" />
                  </div>
                </div>

                <div className="field">
                  <label>Neues Passwort</label>
                  <input type="password" placeholder="Passwort aktualisieren" />
                </div>

                <button type="submit" className="btn btn-primary btn-block">
                  Einstellungen speichern
                </button>
              </form>
            </div>

            <div style={{ display: "grid", gap: "22px" }}>
              <div className="panel pad-lg">
                <div className="section-head" style={{ marginBottom: "12px" }}>
                  <span className="section-kicker">Warum wichtig?</span>
                  <h2 style={{ fontSize: "2rem" }}>Mehr Relevanz, weniger Verlust</h2>
                </div>

                <div className="benefits" style={{ marginTop: 0 }}>
                  {settingsModules.map((item) => (
                    <div key={item.title} className="panel benefit-card" style={{ padding: "18px" }}>
                      <h3 style={{ fontSize: "1.1rem" }}>{item.title}</h3>
                      <p>{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="panel pad-lg">
                <div className="section-head" style={{ marginBottom: "10px" }}>
                  <span className="section-kicker">Empfehlung</span>
                  <h2 style={{ fontSize: "2rem" }}>Setup für hohe Conversion</h2>
                </div>

                <div className="tag-list" style={{ marginTop: 0 }}>
                  <span className="tag">Alerts aktivieren</span>
                  <span className="tag">Regionen fokussieren</span>
                  <span className="tag">Budget definieren</span>
                  <span className="tag">Antwortzeit verkürzen</span>
                </div>

                <p style={{ marginTop: "18px", color: "rgba(245,248,255,0.76)", lineHeight: 1.8 }}>
                  Ein klares Setup sorgt dafür, dass nur relevante Leads im Blickfeld
                  bleiben. Das macht den Einkauf effizienter und die Abschlussquote stärker.
                </p>

                <div style={{ marginTop: "18px", display: "grid", gap: "12px" }}>
                  <a href="/portal/leads" className="btn btn-primary btn-block">
                    Leads öffnen
                  </a>
                  <a href="/portal/guthaben" className="btn btn-secondary btn-block">
                    Guthaben verwalten
                  </a>
                </div>
              </div>

              <div className="panel pad-lg">
                <div className="section-head" style={{ marginBottom: "10px" }}>
                  <span className="section-kicker">Sicherheit</span>
                  <h2 style={{ fontSize: "2rem" }}>Kontoschutz</h2>
                </div>

                <div className="benefits" style={{ marginTop: 0 }}>
                  <div className="panel benefit-card" style={{ padding: "16px" }}>
                    <h3 style={{ fontSize: "1rem" }}>Passwort regelmässig ändern</h3>
                    <p>Schützt dein Firmenkonto und sensible Lead-Daten.</p>
                  </div>
                  <div className="panel benefit-card" style={{ padding: "16px" }}>
                    <h3 style={{ fontSize: "1rem" }}>Zugriffe zentral verwalten</h3>
                    <p>Nur berechtigte Mitarbeitende sollen auf Leads zugreifen können.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="footer-space" />

      <style>{`
        .settings-grid-live {
          display: grid;
          grid-template-columns: 1.05fr 0.95fr;
          gap: 22px;
        }

        @media (max-width: 1100px) {
          .settings-grid-live {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </main>
  );
}