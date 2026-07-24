import Link from "next/link";
import LoginForm from "./login-form";
import styles from "./login.module.css";

const liveLeads = [
  {
    category: "Umzugsreinigung",
    location: "Zürich",
    value: "CHF 1’450",
    time: "vor 2 Min.",
  },
  {
    category: "Hauswartung",
    location: "Baden",
    value: "CHF 2’800",
    time: "vor 7 Min.",
  },
  {
    category: "Fensterreinigung",
    location: "Luzern",
    value: "CHF 780",
    time: "vor 11 Min.",
  },
];

const stats = [
  {
    value: "Direkt",
    label: "Kundenkontakt",
  },
  {
    value: "Regional",
    label: "passende Leads",
  },
  {
    value: "Flexibel",
    label: "freie Auswahl",
  },
];

export default function LoginPage() {
  return (
    <main className={styles.page}>
      <div className={styles.grid} />
      <div className={styles.glowOne} />
      <div className={styles.glowTwo} />

      <div className={styles.shell}>
        <header className={styles.header}>
          <Link href="/" className={styles.brand}>
            <span className={styles.brandIcon}>
              <i />
              <i />
              <i />
            </span>

            <span className={styles.brandText}>
              <strong>auftrago</strong>
              <small>Aufträge. Einfach. Gewinnen.</small>
            </span>
          </Link>

          <div className={styles.headerActions}>
            <span className={styles.onlineBadge}>
              <i />
              Plattform online
            </span>

            <Link
              href="/register"
              className={styles.headerRegister}
            >
              Anbieter werden
            </Link>
          </div>
        </header>

        <section className={styles.layout}>
          <div className={styles.hero}>
            <div className={styles.kicker}>
              <span>
                <i />
                LIVE
              </span>

              Schweizer Auftragsplattform für Dienstleister
            </div>

            <h1>
              Mehr Aufträge.
              <br />
              Mehr Kunden.
              <br />
              <em>Mehr Wachstum.</em>
            </h1>

            <p className={styles.heroText}>
              Entdecke qualifizierte Kundenanfragen, die
              wirklich zu deiner Region und deinen
              Dienstleistungen passen. Du entscheidest
              selbst, welche Chancen du nutzen möchtest.
            </p>

            <div className={styles.stats}>
              {stats.map((stat) => (
                <div key={stat.label}>
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                </div>
              ))}
            </div>

            <section className={styles.market}>
              <div className={styles.marketHeader}>
                <div>
                  <span>LIVE-MARKTPLATZ</span>
                  <h2>Neue Auftragschancen</h2>
                </div>

                <small>
                  <i />
                  Laufend aktualisiert
                </small>
              </div>

              <div className={styles.leadList}>
                {liveLeads.map((lead, index) => (
                  <article
                    className={styles.leadCard}
                    key={lead.category}
                  >
                    <div className={styles.leadNumber}>
                      {String(index + 1).padStart(2, "0")}
                    </div>

                    <div className={styles.leadMain}>
                      <strong>{lead.category}</strong>
                      <span>{lead.location}</span>
                    </div>

                    <div className={styles.leadMeta}>
                      <strong>{lead.value}</strong>
                      <span>{lead.time}</span>
                    </div>

                    <div className={styles.leadArrow}>
                      ↗
                    </div>
                  </article>
                ))}
              </div>

              <div className={styles.marketFooter}>
                <span>
                  🔒 Kundendaten erst nach Freischaltung
                </span>

                <strong>
                  Nur passende Leads auswählen
                </strong>
              </div>
            </section>
          </div>

          <div className={styles.loginColumn}>
            <section className={styles.loginCard}>
              <div className={styles.cardTop}>
                <div className={styles.cardLogo}>
                  <i />
                  <i />
                  <i />
                </div>

                <span className={styles.secureBadge}>
                  <i />
                  Sicherer Zugang
                </span>
              </div>

              <div className={styles.cardHeading}>
                <span>ANBIETER-LOGIN</span>

                <h2>Willkommen zurück.</h2>

                <p>
                  Melde dich an und verwalte Leads,
                  Credits und deine Auftragschancen zentral.
                </p>
              </div>

              <LoginForm />

              <div className={styles.divider}>
                <span />
                <small>NOCH KEIN KONTO?</small>
                <span />
              </div>

              <Link
                href="/register"
                className={styles.registerCard}
              >
                <span className={styles.registerIcon}>
                  +
                </span>

                <span className={styles.registerCopy}>
                  <strong>
                    Kostenlos registrieren
                  </strong>

                  <small>
                    Neue Aufträge als Anbieter entdecken
                  </small>
                </span>

                <b>→</b>
              </Link>

              <div className={styles.trust}>
                <span>🔒 Sichere Anmeldung</span>
                <span>🇨🇭 Schweizer Plattform</span>
              </div>
            </section>
          </div>
        </section>

        <footer className={styles.footer}>
          <span>
            © {new Date().getFullYear()} Auftrago.ch
          </span>

          <nav>
            <Link href="/impressum">Impressum</Link>
            <Link href="/datenschutz">
              Datenschutz
            </Link>
            <Link href="/agb">AGB</Link>
          </nav>
        </footer>
      </div>
    </main>
  );
}