import Link from "next/link";
import LoginForm from "./login-form";

export default function Page() {
  return (
    <main className="auth-page">
      <section className="auth-section">
        <div className="container auth-shell">
          <div className="auth-grid">
            <div className="auth-copy">
              <div className="auth-kicker-wrap">
                <span className="auth-kicker-dot" />
                <span className="auth-kicker-text">
                  Anbieter Login für Leads, Credits und Auftragschancen
                </span>
              </div>

              <h1 className="auth-title">
                Leads, die sich <span>lohnen</span>.
              </h1>

              <p className="auth-lead">
                Logge dich ein, um Leads anzusehen, Kontakte freizuschalten,
                Credits zu prüfen und neue Aufträge gezielt in deiner Region zu
                gewinnen.
              </p>

              <p className="auth-text">
                Auftrago ist für Anbieter gemacht, die nicht einfach nur
                Sichtbarkeit kaufen möchten, sondern gezielt auf echte Anfragen
                reagieren wollen. Nach dem Login siehst du verfügbare Leads,
                deinen Credit-Stand und alle wichtigen Aktivitäten zentral an
                einem Ort.
              </p>

              <p className="auth-text">
                So entsteht ein klarer Workflow: einloggen, interessante Leads
                prüfen, Kontakte freischalten und direkt reagieren. Das spart
                Zeit, schafft Übersicht und macht die Plattform deutlich
                effizienter als klassische Verzeichnisse oder Inserate-Modelle.
              </p>

              <div className="auth-feature-grid">
                <div className="auth-feature-card">
                  <strong>Leads</strong>
                  <span>Neue Anfragen in deinen passenden Kategorien und Regionen.</span>
                </div>

                <div className="auth-feature-card">
                  <strong>Credits</strong>
                  <span>Freischaltung nur dann, wenn ein Lead wirklich interessant ist.</span>
                </div>

                <div className="auth-feature-card">
                  <strong>Übersicht</strong>
                  <span>Alles zentral im Dashboard prüfen und verwalten.</span>
                </div>
              </div>

              <div className="auth-info-card">
                <h2>Was dich nach dem Login erwartet</h2>
                <p>
                  Nach dem Login erhältst du Zugriff auf deinen Anbieterbereich.
                  Dort kannst du aktive Leads ansehen, bereits freigeschaltete
                  Kontakte prüfen, Credits verwalten und deine Transaktionen
                  nachvollziehen.
                </p>
                <p>
                  Dadurch wird aus dem Login nicht einfach nur ein Zugang,
                  sondern der Einstieg in dein operatives Lead-System. Genau das
                  ist für den Livebetrieb wichtig: klare Struktur, schnelle
                  Orientierung und direkte Handlungsoptionen.
                </p>
              </div>

              <div className="auth-chip-row">
                {[
                  "Leads ansehen",
                  "Kontakte freischalten",
                  "Credits prüfen",
                  "Transaktionen",
                ].map((item) => (
                  <span key={item} className="auth-chip">
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="auth-panel">
              <div className="auth-panel-badge">Anbieter Login</div>

              <h2 className="auth-panel-title">In dein Konto einloggen</h2>

              <p className="auth-panel-text">
                Melde dich an, um Leads, Credits und deine Aktivitäten zentral
                zu verwalten.
              </p>

              <div className="auth-form-wrap">
                <LoginForm />
              </div>

              <div className="auth-demo-box">
                <span>Demo Zugang:</span> demo@auftrago.local / demo1234
              </div>

              <div className="auth-info-box">
                <div className="auth-info-box-title">Noch kein Konto?</div>
                <p>
                  Wenn du als Anbieter neu auf Auftrago bist, kannst du dich in
                  wenigen Minuten registrieren und dein Firmenkonto aufbauen.
                </p>
                <p>
                  Danach kannst du Credits kaufen, Leads prüfen und gezielt auf
                  passende Anfragen reagieren.
                </p>
              </div>

              <p className="auth-bottom-link">
                Noch kein Konto?{" "}
                <Link href="/register">Jetzt registrieren</Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}