const profileStats = [
  { value: "Aktiv", label: "Profilstatus" },
  { value: "Zürich + Aargau", label: "Servicegebiete" },
  { value: "2 Std.", label: "Ø Antwortzeit" },
  { value: "4.8★", label: "Anbieterbewertung" },
];

const serviceTags = [
  "Unterhaltsreinigung",
  "Umzugsreinigung",
  "Büroreinigung",
  "Hauswartung",
  "Privat & Gewerbe",
  "Abnahmegarantie",
];

const trustModules = [
  {
    title: "Firmenprofil vollständig",
    text: "Vollständige Profile wirken seriöser und steigern die Kaufwahrscheinlichkeit bei Kunden.",
  },
  {
    title: "Regionen sauber gepflegt",
    text: "Nur passende Leads erhöhen Relevanz, Reaktionsgeschwindigkeit und Abschlussquote.",
  },
  {
    title: "Klares Leistungsprofil",
    text: "Je besser die Leistungen definiert sind, desto besser wird das Matching für neue Leads.",
  },
];

export default function PortalProfilPage() {
  return (
    <main className="page">
      <section className="hero" style={{ paddingBottom: "14px" }}>
        <div className="container">
          <span className="kicker">Firmenprofil</span>
          <h1 style={{ maxWidth: "11ch" }}>Dein Anbieterprofil professionell pflegen.</h1>
          <p className="lead" style={{ maxWidth: "72ch" }}>
            Ein starkes Profil erhöht Vertrauen, verbessert das Matching und sorgt
            dafür, dass deine Firma relevantere Leads erhält.
          </p>

          <div className="stats-grid" style={{ marginTop: "22px" }}>
            {profileStats.map((item) => (
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
          <div className="portal-profile-grid">
            <div className="panel form-card">
              <div className="form-head">
                <div>
                  <div className="form-kicker">Profil bearbeiten</div>
                  <h2>Firmenangaben</h2>
                </div>
                <span className="form-badge">Live</span>
              </div>

              <form className="form-fields">
                <div className="two-cols">
                  <div className="field">
                    <label>Firmenname</label>
                    <input type="text" defaultValue="Cavara Reinigung GmbH" />
                  </div>
                  <div className="field">
                    <label>Ansprechpartner</label>
                    <input type="text" defaultValue="Dejan Cavara" />
                  </div>
                </div>

                <div className="two-cols">
                  <div className="field">
                    <label>E-Mail</label>
                    <input type="email" defaultValue="info@cavara-hauswartung.ch" />
                  </div>
                  <div className="field">
                    <label>Telefon</label>
                    <input type="tel" defaultValue="079 599 29 67" />
                  </div>
                </div>

                <div className="two-cols">
                  <div className="field">
                    <label>Website</label>
                    <input type="text" defaultValue="https://cavara-hauswartung.ch" />
                  </div>
                  <div className="field">
                    <label>Gründungsjahr</label>
                    <input type="text" placeholder="z. B. 2019" />
                  </div>
                </div>

                <div className="field">
                  <label>Kurzbeschreibung</label>
                  <textarea defaultValue="Professioneller Dienstleister für Reinigung, Hauswartung und regionale Services in Zürich und Aargau. Schnell, zuverlässig und sauber organisiert." />
                </div>

                <div className="two-cols">
                  <div className="field">
                    <label>Hauptregion</label>
                    <select defaultValue="Zürich">
                      <option>Zürich</option>
                      <option>Aargau</option>
                      <option>Winterthur</option>
                      <option>Baden</option>
                    </select>
                  </div>
                  <div className="field">
                    <label>Hauptkategorie</label>
                    <select defaultValue="Reinigung">
                      <option>Reinigung</option>
                      <option>Umzug</option>
                      <option>Hauswartung</option>
                      <option>Transport</option>
                    </select>
                  </div>
                </div>

                <div className="field">
                  <label>Leistungen / Regionen</label>
                  <textarea defaultValue="Reinigung in Zürich, Baden, Aarau und Umgebung. Zusätzlich Umzugsreinigung, Unterhaltsreinigung und Hauswartung für Privat- und Geschäftskunden." />
                </div>

                <button type="submit" className="btn btn-primary btn-block">
                  Profil speichern
                </button>
              </form>
            </div>

            <div style={{ display: "grid", gap: "22px" }}>
              <div className="panel pad-lg">
                <div className="section-head" style={{ marginBottom: "14px" }}>
                  <span className="section-kicker">Profilvorschau</span>
                  <h2 style={{ fontSize: "2rem" }}>So wirkt deine Firma</h2>
                </div>

                <div className="panel provider-card" style={{ padding: "22px" }}>
                  <div className="provider-top">
                    <span className="badge white">Verifiziert</span>
                    <span className="badge soft">Reinigung</span>
                    <span className="badge soft">Zürich</span>
                  </div>

                  <div style={{ marginTop: "18px" }}>
                    <h3 style={{ fontSize: "1.6rem" }}>Cavara Reinigung GmbH</h3>
                    <p>
                      Professioneller Dienstleister für Reinigung, Hauswartung und
                      regionale Services. Schnelle Reaktion, klare Kommunikation und
                      saubere Ausführung.
                    </p>
                  </div>

                  <div className="tag-list">
                    {serviceTags.map((tag) => (
                      <span key={tag} className="tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="panel pad-lg">
                <div className="section-head" style={{ marginBottom: "14px" }}>
                  <span className="section-kicker">Vertrauen</span>
                  <h2 style={{ fontSize: "2rem" }}>Warum Profilqualität wichtig ist</h2>
                </div>

                <div className="benefits" style={{ marginTop: 0 }}>
                  {trustModules.map((item) => (
                    <div key={item.title} className="panel benefit-card" style={{ padding: "18px" }}>
                      <h3 style={{ fontSize: "1.12rem" }}>{item.title}</h3>
                      <p>{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="panel pad-lg">
                <div className="section-head" style={{ marginBottom: "10px" }}>
                  <span className="section-kicker">Performance</span>
                  <h2 style={{ fontSize: "2rem" }}>Matching verbessern</h2>
                </div>

                <div className="tag-list" style={{ marginTop: 0 }}>
                  <span className="tag">Mehr Regionen hinzufügen</span>
                  <span className="tag">Leistungen genauer definieren</span>
                  <span className="tag">Antwortzeit verkürzen</span>
                  <span className="tag">Profiltext konkretisieren</span>
                </div>

                <div style={{ marginTop: "18px" }}>
                  <a href="/portal/leads" className="btn btn-secondary btn-block">
                    Neue Leads ansehen
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="footer-space" />

      <style>{`
        .portal-profile-grid {
          display: grid;
          grid-template-columns: 1.08fr 0.92fr;
          gap: 22px;
        }

        @media (max-width: 1100px) {
          .portal-profile-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </main>
  );
}