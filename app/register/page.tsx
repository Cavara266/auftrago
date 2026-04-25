import Link from "next/link";
import RegisterForm from "./register-form";

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
                  Anbieter Registrierung für Leads, Credits und neue Aufträge
                </span>
              </div>

              <h1 className="auth-title">
                Dein Zugang zu <span>echten Anfragen</span>.
              </h1>

              <p className="auth-lead">
                Registriere deine Firma und erhalte Zugriff auf einen
                Anbieterbereich, in dem du Leads prüfen, Credits kaufen und neue
                Aufträge gezielt in deiner Region gewinnen kannst.
              </p>

              <p className="auth-text">
                Auftrago ist für Firmen gemacht, die nicht nur sichtbar sein
                möchten, sondern konkrete Anfragen erhalten wollen. Mit einem
                professionellen Anbieterprofil legst du die Basis für passende
                Lead-Zuweisungen und eine stärkere Abschlussquote.
              </p>

              <p className="auth-text">
                Nach der Registrierung kannst du dein Profil vervollständigen,
                Kategorien und Regionen definieren, Guthaben aufladen und direkt
                auf passende Leads reagieren. So entsteht ein klarer
                Verkaufsprozess statt Streuverlust.
              </p>

              <div className="auth-feature-grid">
                <div className="auth-feature-card">
                  <strong>Profil</strong>
                  <span>Firma, Regionen und Leistungen sauber anlegen.</span>
                </div>

                <div className="auth-feature-card">
                  <strong>Matching</strong>
                  <span>Nur Leads sehen, die wirklich zu deinem Betrieb passen.</span>
                </div>

                <div className="auth-feature-card">
                  <strong>Wachstum</strong>
                  <span>Mehr Anfragen, mehr Chancen, mehr planbare Akquise.</span>
                </div>
              </div>

              <div className="auth-info-card">
                <h2>Warum sich die Registrierung lohnt</h2>
                <p>
                  Als registrierter Anbieter erhältst du Zugriff auf relevante
                  Anfragen in deinen Einsatzgebieten. Du entscheidest selbst,
                  welche Leads du kaufst und wann du reagieren möchtest.
                </p>
                <p>
                  Dadurch wird Auftrago für deine Firma zu einem echten
                  Vertriebskanal: klar strukturiert, messbar und direkt auf neue
                  Aufträge ausgerichtet.
                </p>
              </div>

              <div className="auth-chip-row">
                {[
                  "Firma registrieren",
                  "Regionen festlegen",
                  "Leistungen definieren",
                  "Leads kaufen",
                ].map((item) => (
                  <span key={item} className="auth-chip">
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="auth-panel">
              <div className="auth-panel-badge">Anbieter Registrierung</div>

              <h2 className="auth-panel-title">Firma jetzt registrieren</h2>

              <p className="auth-panel-text">
                Erstelle dein Firmenkonto und bereite dein Profil für passende
                Leads und neue Auftragschancen vor.
              </p>

              <div className="auth-form-wrap">
                <RegisterForm />
              </div>

              <div className="auth-info-box">
                <div className="auth-info-box-title">Bereits registriert?</div>
                <p>
                  Wenn dein Firmenkonto bereits besteht, kannst du dich direkt
                  einloggen und deine Leads, Credits und Aktivitäten verwalten.
                </p>
              </div>

              <p className="auth-bottom-link">
                Bereits ein Konto?{" "}
                <Link href="/login">Jetzt einloggen</Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}