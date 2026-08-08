import type { Metadata } from "next";
import Link from "next/link";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Versicherungen vergleichen Schweiz | Auftrago",
  description:
    "Versicherungen in der Schweiz vergleichen: Krankenkasse, Auto, Hausrat, Haftpflicht, Rechtsschutz, Vorsorge und Firmenversicherungen.",
};

const products = [
  {
    icon: "✚",
    title: "Krankenkasse",
    text: "Grundversicherung und Zusatzversicherungen passend vergleichen.",
    query: "Krankenkasse",
  },
  {
    icon: "◆",
    title: "Autoversicherung",
    text: "Haftpflicht, Teilkasko und Vollkasko für dein Fahrzeug.",
    query: "Autoversicherung",
  },
  {
    icon: "⌂",
    title: "Hausrat",
    text: "Dein Zuhause und dein Eigentum sinnvoll absichern.",
    query: "Hausratversicherung",
  },
  {
    icon: "◎",
    title: "Privathaftpflicht",
    text: "Schutz vor hohen Kosten bei Schäden gegenüber Dritten.",
    query: "Privathaftpflicht",
  },
  {
    icon: "§",
    title: "Rechtsschutz",
    text: "Unterstützung bei rechtlichen Konflikten und Streitfällen.",
    query: "Rechtsschutzversicherung",
  },
  {
    icon: "↗",
    title: "Vorsorge & Leben",
    text: "Langfristige Vorsorge und finanzielle Absicherung planen.",
    query: "Vorsorgeversicherung",
  },
  {
    icon: "▦",
    title: "Firmenversicherung",
    text: "Versicherungslösungen für KMU und Selbstständige.",
    query: "Firmenversicherung",
  },
  {
    icon: "✦",
    title: "Andere Versicherung",
    text: "Dein Anliegen ist nicht dabei? Anfrage direkt beschreiben.",
    query: "Versicherungsberatung",
  },
];

export default function VersicherungenPage() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroAmbientOne} />
        <div className={styles.heroAmbientTwo} />

        <div className={styles.heroInner}>
          <div className={styles.heroCopy}>
            <div className={styles.badge}>
              <span>✦</span>
              Versicherungen auf eine neue Art vergleichen
            </div>

            <h1>
              Mehr Klarheit.
              <br />
              <span>Besser versichert.</span>
            </h1>

            <p className={styles.heroText}>
              Beschreibe kurz, welche Versicherung du suchst. Vergleiche
              passende Möglichkeiten und entscheide selbst, welches Angebot
              zu dir passt.
            </p>

            <div className={styles.actions}>
              <a href="#vergleich" className={styles.mainButton}>
                Versicherung wählen
                <span>→</span>
              </a>

              <Link
                href="/auftrag-erstellen?query=Versicherungsberatung"
                className={styles.secondaryButton}
              >
                Persönliche Anfrage
              </Link>
            </div>

            <div className={styles.trust}>
              <div>
                <strong>100%</strong>
                <span>unverbindliche Anfrage</span>
              </div>

              <div>
                <strong>CH</strong>
                <span>Schweizer Markt</span>
              </div>

              <div>
                <strong>8+</strong>
                <span>Versicherungsbereiche</span>
              </div>
            </div>
          </div>

          <div className={styles.heroStage}>
            <div className={styles.stageGlow} />

            <div className={styles.compareCard}>
              <div className={styles.compareHeader}>
                <div className={styles.brandIcon}>A</div>

                <div>
                  <small>AUFTRAGO</small>
                  <strong>Versicherungsvergleich</strong>
                </div>

                <span className={styles.livePill}>
                  <b />
                  Bereit
                </span>
              </div>

              <div className={styles.question}>
                <small>WAS SUCHST DU?</small>
                <h2>Welche Versicherung möchtest du vergleichen?</h2>
              </div>

              <div className={styles.quickGrid}>
                <div>
                  <span>✚</span>
                  Krankenkasse
                </div>

                <div>
                  <span>◆</span>
                  Auto
                </div>

                <div>
                  <span>⌂</span>
                  Hausrat
                </div>

                <div>
                  <span>▦</span>
                  Firma
                </div>
              </div>

              <div className={styles.compareFooter}>
                <div>
                  <small>SCHRITT</small>
                  <strong>01 / 03</strong>
                </div>

                <Link href="/auftrag-erstellen?query=Versicherung">
                  Vergleich starten
                  <span>→</span>
                </Link>
              </div>
            </div>

            <div className={`${styles.floatingCard} ${styles.floatingOne}`}>
              <span>✓</span>
              <div>
                <small>UNVERBINDLICH</small>
                <strong>Du entscheidest</strong>
              </div>
            </div>

            <div className={`${styles.floatingCard} ${styles.floatingTwo}`}>
              <span>⚡</span>
              <div>
                <small>SCHNELL</small>
                <strong>Eine Anfrage</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="vergleich" className={styles.products}>
        <div className={styles.sectionTop}>
          <div>
            <span className={styles.sectionLabel}>VERSICHERUNGEN</span>
            <h2>
              Was möchtest du
              <br />
              vergleichen?
            </h2>
          </div>

          <p>
            Wähle einen Bereich. Danach kannst du deinen Bedarf in wenigen
            Schritten beschreiben und eine unverbindliche Anfrage starten.
          </p>
        </div>

        <div className={styles.productGrid}>
          {products.map((product, index) => (
            <Link
              key={product.title}
              href={`/auftrag-erstellen?query=${encodeURIComponent(
                product.query
              )}`}
              className={styles.productCard}
            >
              <div className={styles.productTop}>
                <span className={styles.productNumber}>
                  {String(index + 1).padStart(2, "0")}
                </span>

                <span className={styles.productIcon}>{product.icon}</span>

                <span className={styles.productArrow}>↗</span>
              </div>

              <div>
                <h3>{product.title}</h3>
                <p>{product.text}</p>
              </div>

              <span className={styles.productLink}>Jetzt vergleichen →</span>
            </Link>
          ))}
        </div>
      </section>

      <section className={styles.experience}>
        <div className={styles.experienceInner}>
          <div className={styles.experienceIntro}>
            <span className={styles.sectionLabel}>EINFACHER ABLAUF</span>

            <h2>
              Nicht suchen.
              <br />
              <span>Vergleichen.</span>
            </h2>

            <p>
              Statt zahlreiche Websites einzeln zu durchsuchen, beschreibst du
              deinen Bedarf einmal und kannst passende Lösungen vergleichen.
            </p>
          </div>

          <div className={styles.steps}>
            <article>
              <span>01</span>
              <div>
                <h3>Bedarf auswählen</h3>
                <p>
                  Versicherung wählen und die wichtigsten Angaben ergänzen.
                </p>
              </div>
            </article>

            <article>
              <span>02</span>
              <div>
                <h3>Anfrage absenden</h3>
                <p>
                  Deine Anfrage wird strukturiert und übersichtlich erfasst.
                </p>
              </div>
            </article>

            <article>
              <span>03</span>
              <div>
                <h3>Vergleichen & entscheiden</h3>
                <p>
                  Du vergleichst passende Möglichkeiten und entscheidest selbst.
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className={styles.business}>
        <div className={styles.businessCard}>
          <div className={styles.businessCopy}>
            <span className={styles.sectionLabel}>AUCH FÜR UNTERNEHMEN</span>

            <h2>
              Firmen richtig
              <br />
              absichern.
            </h2>

            <p>
              Betriebshaftpflicht, Sachversicherung, Fahrzeuge, Rechtsschutz
              und weitere Lösungen für Unternehmen und Selbstständige.
            </p>

            <Link
              href="/auftrag-erstellen?query=Firmenversicherung"
              className={styles.businessButton}
            >
              Firmenversicherung anfragen
              <span>→</span>
            </Link>
          </div>

          <div className={styles.businessVisual}>
            <div className={styles.businessOrbitLarge} />
            <div className={styles.businessOrbitSmall} />

            <div className={styles.businessCenter}>
              <small>BUSINESS</small>
              <strong>Auftrago</strong>
              <span>Insurance</span>
            </div>

            <span className={`${styles.orbitTag} ${styles.tagOne}`}>
              Betriebshaftpflicht
            </span>

            <span className={`${styles.orbitTag} ${styles.tagTwo}`}>
              Fahrzeuge
            </span>

            <span className={`${styles.orbitTag} ${styles.tagThree}`}>
              Rechtsschutz
            </span>
          </div>
        </div>
      </section>

      <section className={styles.bottomCta}>
        <div>
          <span className={styles.sectionLabel}>JETZT STARTEN</span>

          <h2>
            Versicherung vergleichen,
            <br />
            ohne komplizierten Umweg.
          </h2>

          <Link href="/auftrag-erstellen?query=Versicherung">
            Vergleich starten
            <span>→</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
