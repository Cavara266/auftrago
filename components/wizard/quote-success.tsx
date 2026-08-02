"use client";

import styles from "./quote-success.module.css";

type QuoteSuccessProps = {
  name: string;
  service: string;
  postalCode: string;
  city: string;
  appointment: string;
};

export default function QuoteSuccess({
  name,
  service,
  postalCode,
  city,
  appointment,
}: QuoteSuccessProps) {
  const firstName =
    name.trim().split(/\s+/)[0] || "Vielen Dank";

  return (
    <section className={styles.success}>
      <div className={styles.ambientOne} />
      <div className={styles.ambientTwo} />

      <div className={styles.content}>
        <div className={styles.statusBadge}>
          <span />
          Anfrage erfolgreich übermittelt
        </div>

        <div className={styles.successIcon}>
          <div className={styles.successIconInner}>✓</div>
        </div>

        <p className={styles.eyebrow}>Auftrag erfolgreich erfasst</p>

        <h2 className={styles.title}>
          Vielen Dank,
          <span> {firstName}.</span>
        </h2>

        <p className={styles.description}>
          Deine Anfrage wurde sicher gespeichert. Passende regionale
          Anbieter können deinen Auftrag jetzt prüfen und sich direkt
          bei dir melden.
        </p>

        <div className={styles.process}>
          <article className={styles.processItem}>
            <div className={styles.processIcon}>✓</div>

            <div>
              <span className={styles.processLabel}>Schritt 01</span>
              <strong>Anfrage gespeichert</strong>
              <p>Alle Angaben wurden erfolgreich übernommen.</p>
            </div>

            <span className={styles.completed}>Erledigt</span>
          </article>

          <div className={styles.processLine} />

          <article className={styles.processItem}>
            <div className={styles.processIcon}>✓</div>

            <div>
              <span className={styles.processLabel}>Schritt 02</span>
              <strong>Region zugeordnet</strong>
              <p>
                {postalCode} {city}
              </p>
            </div>

            <span className={styles.completed}>Erledigt</span>
          </article>

          <div className={styles.processLine} />

          <article className={`${styles.processItem} ${styles.activeItem}`}>
            <div className={`${styles.processIcon} ${styles.activeIcon}`}>
              <span />
            </div>

            <div>
              <span className={styles.processLabel}>Schritt 03</span>
              <strong>Passende Anbieter werden informiert</strong>
              <p>Unternehmen können deine Anfrage jetzt prüfen.</p>
            </div>

            <span className={styles.inProgress}>Läuft</span>
          </article>
        </div>

        <div className={styles.summary}>
          <article>
            <span>Dienstleistung</span>
            <strong>{service}</strong>
          </article>

          <article>
            <span>Ausführungsort</span>
            <strong>
              {postalCode} {city}
            </strong>
          </article>

          <article>
            <span>Gewünschter Termin</span>
            <strong>{appointment || "Nach Absprache"}</strong>
          </article>
        </div>

        <div className={styles.notice}>
          <span className={styles.noticeIcon}>i</span>

          <div>
            <strong>Wie geht es jetzt weiter?</strong>
            <p>
              Anbieter melden sich direkt über deine hinterlegten
              Kontaktdaten. Du entscheidest selbst, welches Angebot
              zu deinem Auftrag passt.
            </p>
          </div>
        </div>

        <div className={styles.trust}>
          <span>🔒 Sichere Übermittlung</span>
          <span>🇨🇭 Schweizer Plattform</span>
          <span>✓ Keine Annahmepflicht</span>
        </div>
      </div>
    </section>
  );
}
