import Link from "next/link";
import ServiceSelector from "./service-selector";
import styles from "./auftrag-erstellen.module.css";

export const metadata = {
  title: "Auftrag erstellen | Auftrago",
  description:
    "Beschreibe deinen Auftrag und finde passende Anbieter aus deiner Region.",
};

export default function AuftragErstellenPage() {
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
              <small>Für jeden Auftrag der passende Anbieter.</small>
            </span>
          </Link>

          <div className={styles.headerActions}>
            <span className={styles.secure}>
              <i />
              Kostenlos & unverbindlich
            </span>

            <Link href="/login" className={styles.loginLink}>
              Anbieter-Login
            </Link>
          </div>
        </header>

        <section className={styles.hero}>
          <div className={styles.kicker}>
            <span>
              <i />
              SCHWEIZWEIT
            </span>

            Anbieter für nahezu jede Dienstleistung
          </div>

          <h1>
            Was möchtest du
            <br />
            <em>erledigen lassen?</em>
          </h1>

          <p>
            Wähle eine Dienstleistung aus und beschreibe deinen
            Auftrag. Auftrago bringt dich direkt mit passenden
            Anbietern aus deiner Region zusammen.
          </p>

          <div className={styles.benefits}>
            <span>✓ Passende Anbieter</span>
            <span>✓ Mehrere Angebote</span>
            <span>✓ Kostenlos anfragen</span>
          </div>
        </section>

        <ServiceSelector />

        <section className={styles.providerBanner}>
          <div>
            <span>DU BIST DIENSTLEISTER?</span>

            <h2>Erhalte passende Kundenanfragen.</h2>

            <p>
              Registriere dein Unternehmen, wähle deine
              Dienstleistungen und Regionen und entscheide selbst,
              welche Aufträge du übernehmen möchtest.
            </p>
          </div>

          <Link href="/register">
            Kostenlos Anbieter werden
            <b>→</b>
          </Link>
        </section>

        <footer className={styles.footer}>
          <span>
            © {new Date().getFullYear()} Auftrago.ch
          </span>

          <nav>
            <Link href="/impressum">Impressum</Link>
            <Link href="/datenschutz">Datenschutz</Link>
            <Link href="/agb">AGB</Link>
          </nav>
        </footer>
      </div>
    </main>
  );
}