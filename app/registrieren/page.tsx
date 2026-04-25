const benefits = [
  {
    title: "Neue Aufträge aus deiner Region",
    text: "Erhalte passende Leads für deine Dienstleistungen in Aargau, Zürich und weiteren Regionen.",
  },
  {
    title: "Nur relevante Anfragen",
    text: "Leads werden nach Kategorie, Region und Bedarf gefiltert, damit du weniger Streuverlust hast.",
  },
  {
    title: "Mehr Kontrolle über deine Akquise",
    text: "Kaufe nur die Leads, die wirklich zu deinem Angebot, Budget und Einsatzgebiet passen.",
  },
];

const categories = [
  "Reinigung",
  "Umzug",
  "Hauswartung",
  "Transport",
  "Entsorgung",
  "Gartenbau",
];

const regions = [
  "Zürich",
  "Winterthur",
  "Baden",
  "Aarau",
  "Lenzburg",
  "Dietikon",
  "Schlieren",
  "Bülach",
];

export default function RegistrierenPage() {
  return (
    <main className="page">
      <section className="hero">
        <div className="container form-grid">
          <div>
            <span className="kicker">Für Anbieter</span>

            <h1>
              Registriere deine Firma.
              <br />
              Kaufe passende Leads.
            </h1>

            <p className="lead">
              Werde Teil des Auftrago-Netzwerks und erhalte neue Anfragen von
              Kunden, die aktiv nach regionalen Dienstleistern suchen.
            </p>

            <div className="steps-grid">
              <div className="step-card">
                <div className="step-label">Schritt 01</div>
                <p style={{ fontWeight: 700, fontSize: "1.1rem", marginTop: "10px" }}>
                  Firma anlegen
                </p>
                <p>Registriere dein Unternehmen mit Regionen und Kategorien.</p>
              </div>

              <div className="step-card">
                <div className="step-label">Schritt 02</div>
                <p style={{ fontWeight: 700, fontSize: "1.1rem", marginTop: "10px" }}>
                  Profil freischalten
                </p>
                <p>Nach Prüfung kannst du neue Leads direkt im Portal sehen.</p>
              </div>

              <div className="step-card">
                <div className="step-label">Schritt 03</div>
                <p style={{ fontWeight: 700, fontSize: "1.1rem", marginTop: "10px" }}>
                  Leads kaufen
                </p>
                <p>Kaufe nur die Anfragen, die wirklich zu deinem Betrieb passen.</p>
              </div>
            </div>

            <div className="benefits">
              {benefits.map((item) => (
                <div key={item.title} className="panel benefit-card">
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="panel form-card">
            <div className="form-head">
              <div>
                <div className="form-kicker">Registrierung</div>
                <h2>Als Anbieter registrieren</h2>
              </div>
              <span className="form-badge">MVP</span>
            </div>

            <form className="form-fields">
              <div className="two-cols">
                <div className="field">
                  <label>Firmenname</label>
                  <input type="text" placeholder="z. B. Cavara Reinigung GmbH" />
                </div>

                <div className="field">
                  <label>Ansprechpartner</label>
                  <input type="text" placeholder="Vorname / Name" />
                </div>
              </div>

              <div className="two-cols">
                <div className="field">
                  <label>E-Mail</label>
                  <input type="email" placeholder="firma@email.ch" />
                </div>

                <div className="field">
                  <label>Telefon</label>
                  <input type="tel" placeholder="+41 ..." />
                </div>
              </div>

              <div className="two-cols">
                <div className="field">
                  <label>Passwort</label>
                  <input type="password" placeholder="Passwort erstellen" />
                </div>

                <div className="field">
                  <label>Website</label>
                  <input type="text" placeholder="https://deinefirma.ch" />
                </div>
              </div>

              <div className="two-cols">
                <div className="field">
                  <label>Hauptregion</label>
                  <select defaultValue="">
                    <option value="" disabled>
                      Region wählen
                    </option>
                    {regions.map((region) => (
                      <option key={region} value={region}>
                        {region}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="field">
                  <label>Hauptkategorie</label>
                  <select defaultValue="">
                    <option value="" disabled>
                      Dienstleistung wählen
                    </option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="field">
                <label>Weitere Dienstleistungen / Regionen</label>
                <textarea placeholder="z. B. Reinigung in Zürich, Baden und Aarau. Zusätzlich Umzug und Endreinigung." />
              </div>

              <label
                style={{
                  display: "flex",
                  gap: "12px",
                  alignItems: "flex-start",
                  color: "rgba(245,248,255,0.72)",
                  fontSize: "0.95rem",
                  lineHeight: 1.6,
                }}
              >
                <input
                  type="checkbox"
                  style={{
                    width: "18px",
                    height: "18px",
                    minWidth: "18px",
                    marginTop: "3px",
                    accentColor: "#ffffff",
                  }}
                />
                <span>
                  Ich akzeptiere die AGB und Datenschutzhinweise und möchte mein
                  Anbieterprofil für das Lead-Portal registrieren.
                </span>
              </label>

              <button type="submit" className="btn btn-primary btn-block">
                Jetzt als Anbieter registrieren
              </button>

              <div className="helper">
                Bereits registriert? <a href="/portal" style={{ color: "#fff" }}>Zum Portal</a>
              </div>
            </form>
          </div>
        </div>
      </section>

      <div className="footer-space" />
    </main>
  );
}