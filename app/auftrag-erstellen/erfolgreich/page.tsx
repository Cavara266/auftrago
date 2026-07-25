import Link from "next/link";
import styles from "./success.module.css";

type SuccessPageProps = {
  searchParams?: {
    lead?: string;
  };
};

export const metadata = {
  title: "Anfrage erfolgreich gesendet | Auftrago",
  description:
    "Deine Anfrage wurde erfolgreich übermittelt.",
};

export default function SuccessPage({
  searchParams,
}: SuccessPageProps) {
  const leadId = searchParams?.lead?.trim();

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
              <small>
                Für jeden Auftrag der passende Anbieter
              </small>
            </span>
          </Link>

          <Link
            href="/login"
            className={styles.loginLink}
          >
            Anbieter-Login
          </Link>
        </header>

        <section className={styles.successSection}>
          <div className={styles.successIcon}>
            <span>✓</span>
          </div>

          <div className={styles.statusBadge}>
            ANFRAGE ERFOLGREICH ÜBERMITTELT
          </div>

          <h1>
            Vielen Dank für
            <br />
            deine Anfrage.
          </h1>

          <p className={styles.intro}>
            Deine Angaben wurden erfolgreich gespeichert.
            Passende Anbieter aus deiner Region können deine
            Anfrage nun prüfen und dich direkt kontaktieren.
          </p>

          <div className={styles.timeline}>
            <div className={styles.timelineItem}>
              <span className={styles.timelineNumber}>
                1
              </span>

              <div>
                <strong>
                  Anbieter werden informiert
                </strong>

                <p>
                  Passende Dienstleister erhalten die
                  Möglichkeit, deine Anfrage einzusehen.
                </p>
              </div>
            </div>

            <div className={styles.timelineLine} />

            <div className={styles.timelineItem}>
              <span className={styles.timelineNumber}>
                2
              </span>

              <div>
                <strong>
                  Du erhältst Rückmeldungen
                </strong>

                <p>
                  Interessierte Anbieter können dich per
                  Telefon oder E-Mail kontaktieren.
                </p>
              </div>
            </div>

            <div className={styles.timelineLine} />

            <div className={styles.timelineItem}>
              <span className={styles.timelineNumber}>
                3
              </span>

              <div>
                <strong>
                  Angebote vergleichen
                </strong>

                <p>
                  Vergleiche Leistungen, Preise und Termine
                  und entscheide dich in Ruhe.
                </p>
              </div>
            </div>
          </div>

          {leadId ? (
            <div className={styles.referenceBox}>
              <span>REFERENZNUMMER</span>
              <strong>{leadId}</strong>
              <small>
                Bewahre diese Nummer für Rückfragen auf.
              </small>
            </div>
          ) : null}

          <div className={styles.actions}>
            <Link
              href="/auftrag-erstellen"
              className={styles.primaryButton}
            >
              Weiteren Auftrag erstellen
              <b>→</b>
            </Link>

            <Link
              href="/"
              className={styles.secondaryButton}
            >
              Zur Startseite
            </Link>
          </div>

          <div className={styles.infoGrid}>
            <article>
              <span>🔒</span>
              <strong>Datenschutz</strong>
              <p>
                Deine Kontaktdaten werden nur im
                Zusammenhang mit deiner Anfrage verwendet.
              </p>
            </article>

            <article>
              <span>💬</span>
              <strong>Direkter Kontakt</strong>
              <p>
                Anbieter können sich direkt bei dir melden
                und ein persönliches Angebot erstellen.
              </p>
            </article>

            <article>
              <span>✓</span>
              <strong>Unverbindlich</strong>
              <p>
                Du entscheidest selbst, ob und welches
                Angebot du annehmen möchtest.
              </p>
            </article>
          </div>
        </section>

        <section className={styles.providerBanner}>
          <div>
            <span>SELBST DIENSTLEISTER?</span>
            <h2>Erhalte neue Kundenanfragen.</h2>
            <p>
              Registriere dein Unternehmen und finde
              passende Aufträge in deinen Regionen und
              Dienstleistungen.
            </p>
          </div>

          <Link href="/register">
            Anbieter werden
            <b>→</b>
          </Link>
        </section>

        <footer className={styles.footer}>
          <span>
            © {new Date().getFullYear()} Auftrago.ch
          </span>

          <nav>
            <Link href="/impressum">
              Impressum
            </Link>

            <Link href="/datenschutz">
              Datenschutz
            </Link>

            <Link href="/agb">
              AGB
            </Link>
          </nav>
        </footer>
      </div>
    </main>
  );
}