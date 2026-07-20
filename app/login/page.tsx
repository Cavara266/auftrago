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

              <div className="auth-feature-grid">
                <div className="auth-feature-card">
                  <strong>Leads</strong>

                  <span>
                    Neue Anfragen in deinen passenden Kategorien und Regionen.
                  </span>
                </div>

                <div className="auth-feature-card">
                  <strong>Credits</strong>

                  <span>
                    Kontakte nur dann freischalten, wenn ein Lead wirklich
                    interessant ist.
                  </span>
                </div>

                <div className="auth-feature-card">
                  <strong>Übersicht</strong>

                  <span>
                    Alles zentral im Dashboard prüfen und verwalten.
                  </span>
                </div>
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

                <div className="forgot-password-wrap">
                  <Link
                    href="/passwort-vergessen"
                    className="forgot-password-link"
                  >
                    Passwort vergessen?
                  </Link>
                </div>
              </div>

              <div className="auth-info-box">
                <div className="auth-info-box-title">
                  Noch kein Anbieterkonto?
                </div>

                <p>
                  Registriere deine Firma und erhalte Zugriff auf neue
                  Kundenanfragen, Credits und dein persönliches
                  Anbieter-Dashboard.
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

      <style>{`
        .forgot-password-wrap {
          display: flex;
          justify-content: flex-end;
          margin-top: 14px;
        }

        .forgot-password-link {
          color: #8bbcff;
          font-size: 14px;
          font-weight: 750;
          text-decoration: none;
          transition:
            color 160ms ease,
            opacity 160ms ease;
        }

        .forgot-password-link:hover {
          color: #ffffff;
          text-decoration: underline;
          text-underline-offset: 4px;
        }

        .forgot-password-link:focus-visible {
          border-radius: 6px;
          outline: 2px solid #60a5fa;
          outline-offset: 4px;
        }
      `}</style>
    </main>
  );
}