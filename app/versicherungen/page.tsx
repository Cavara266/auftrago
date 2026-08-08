import type { Metadata } from "next";
import Link from "next/link";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Versicherungen vergleichen Schweiz | Auftrago",
  description:
    "Versicherungen in der Schweiz einfach vergleichen. Krankenversicherung, Auto, Hausrat, Haftpflicht, Rechtsschutz und weitere Lösungen unverbindlich anfragen.",
};

const insuranceTypes = [
  {
    icon: "✚",
    title: "Krankenkasse",
    text: "Grund- und Zusatzversicherungen passend zu deiner persönlichen Situation vergleichen.",
    query: "Krankenkasse",
    accent: "blue",
  },
  {
    icon: "◆",
    title: "Autoversicherung",
    text: "Haftpflicht, Teilkasko oder Vollkasko für dein Fahrzeug vergleichen.",
    query: "Autoversicherung",
    accent: "violet",
  },
  {
    icon: "⌂",
    title: "Hausrat",
    text: "Dein Zuhause und dein Eigentum sinnvoll gegen Schäden absichern.",
    query: "Hausratversicherung",
    accent: "cyan",
  },
  {
    icon: "◎",
    title: "Privathaftpflicht",
    text: "Schutz vor finanziellen Folgen, wenn anderen unbeabsichtigt ein Schaden entsteht.",
    query: "Privathaftpflicht",
    accent: "orange",
  },
  {
    icon: "§",
    title: "Rechtsschutz",
    text: "Unterstützung bei privaten, beruflichen oder verkehrsbezogenen Rechtsfragen.",
    query: "Rechtsschutzversicherung",
    accent: "emerald",
  },
  {
    icon: "↗",
    title: "Vorsorge & Leben",
    text: "Vorsorge, Lebensversicherung und langfristige Absicherung strukturiert vergleichen.",
    query: "Vorsorge Versicherung",
    accent: "pink",
  },
  {
    icon: "▦",
    title: "Firmenversicherung",
    text: "Versicherungslösungen für KMU, Selbstständige und Unternehmen.",
    query: "Firmenversicherung",
    accent: "indigo",
  },
  {
    icon: "✦",
    title: "Andere Versicherung",
    text: "Du suchst etwas Spezielleres? Beschreibe deinen Bedarf und erhalte passende Möglichkeiten.",
    query: "Versicherungsberatung",
    accent: "gold",
  },
];

const benefits = [
  ["01", "Bedarf angeben", "Sag uns kurz, welche Versicherung du suchst und was dir wichtig ist."],
  ["02", "Optionen erhalten", "Passende Anbieter können deine Anfrage prüfen und darauf reagieren."],
  ["03", "In Ruhe vergleichen", "Vergleiche Leistungen, Konditionen und Anbieter ohne unnötigen Aufwand."],
];

const highlights = [
  "Kostenlose Anfrage",
  "Unverbindlich vergleichen",
  "Schweizer Anbieter",
  "Mehrere Versicherungssparten",
];

export default function VersicherungenPage() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroGlowOne} />
        <div className={styles.heroGlowTwo} />

        <div className={styles.heroInner}>
          <div className={styles.heroCopy}>
            <div className={styles.eyebrow}>
              <span className={styles.eyebrowDot}>✦</span>
              Versicherungen neu gedacht
            </div>

            <h1>
              Versicherung finden.
              <span> Einfach vergleichen.</span>
            </h1>

            <p className={styles.heroLead}>
              Finde passende Versicherungslösungen für Privatpersonen und
              Unternehmen – übersichtlich, unverbindlich und ohne komplizierte
              Suche.
            </p>

            <div className={styles.heroActions}>
              <a href="#versicherung-waehlen" className={styles.primaryCta}>
                <span>Versicherung auswählen</span>
                <span className={styles.ctaArrow}>→</span>
              </a>

              <Link
                href="/auftrag-erstellen?query=Versicherungsberatung"
                className={styles.secondaryCta}
              >
                Beratung anfragen
              </Link>
            </div>

            <div className={styles.highlightRow}>
              {highlights.map((item) => (
                <span key={item}>
                  <b>✓</b>
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className={styles.heroVisual}>
            <div className={styles.visualHalo} />

            <div className={styles.mainCard}>
              <div className={styles.mainCardTop}>
                <div className={styles.shield}>✦</div>
                <span>Auftrago Insurance</span>
              </div>

              <div className={styles.mainCardBody}>
                <small>DEIN VERGLEICH</small>
                <strong>Einfach zur passenden Lösung.</strong>
                <p>
                  Eine Anfrage. Verschiedene Möglichkeiten. Du entscheidest.
                </p>
              </div>

              <div className={styles.miniStats}>
                <div>
                  <span>01</span>
                  <p>Anfrage</p>
                </div>
                <div>
                  <span>02</span>
                  <p>Vergleichen</p>
                </div>
                <div>
                  <span>03</span>
                  <p>Entscheiden</p>
                </div>
              </div>
            </div>

            <div className={`${styles.floatCard} ${styles.floatCardOne}`}>
              <span>✓</span>
              <div>
                <small>FLEXIBEL</small>
                <strong>Mehr Auswahl</strong>
              </div>
            </div>

            <div className={`${styles.floatCard} ${styles.floatCardTwo}`}>
              <span>↗</span>
              <div>
                <small>SCHNELL</small>
                <strong>Direkte Anfrage</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="versicherung-waehlen"
        className={styles.insuranceSection}
      >
        <div className={styles.sectionHeading}>
          <div>
            <span className={styles.sectionEyebrow}>VERSICHERUNGEN</span>
            <h2>Was möchtest du vergleichen?</h2>
          </div>

          <p>
            Wähle den passenden Bereich und starte direkt mit deiner
            unverbindlichen Anfrage.
          </p>
        </div>

        <div className={styles.insuranceGrid}>
          {insuranceTypes.map((insurance) => (
            <Link
              key={insurance.title}
              href={`/auftrag-erstellen?query=${encodeURIComponent(
                insurance.query
              )}`}
              className={styles.insuranceCard}
              data-accent={insurance.accent}
            >
              <div className={styles.cardTop}>
                <span className={styles.insuranceIcon}>{insurance.icon}</span>
                <span className={styles.cardArrow}>↗</span>
              </div>

              <div>
                <h3>{insurance.title}</h3>
                <p>{insurance.text}</p>
              </div>

              <span className={styles.cardLink}>Jetzt vergleichen</span>
            </Link>
          ))}
        </div>
      </section>

      <section className={styles.processSection}>
        <div className={styles.processHeader}>
          <span className={styles.sectionEyebrow}>SO FUNKTIONIERT ES</span>
          <h2>
            Drei Schritte.
            <br />
            Eine bessere Übersicht.
          </h2>
          <p>
            Kein komplizierter Versicherungsdschungel. Starte mit deinem Bedarf
            und vergleiche passende Möglichkeiten.
          </p>
        </div>

        <div className={styles.processGrid}>
          {benefits.map(([number, title, text]) => (
            <article key={number} className={styles.processCard}>
              <div className={styles.processNumber}>{number}</div>
              <div className={styles.processLine} />
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.featureSection}>
        <div className={styles.featurePanel}>
          <div className={styles.featureCopy}>
            <span className={styles.sectionEyebrow}>FÜR PRIVAT & UNTERNEHMEN</span>
            <h2>Versicherung soll zu deinem Leben passen.</h2>
            <p>
              Unterschiedliche Lebenssituationen brauchen unterschiedliche
              Lösungen. Auftrago bringt deine Anfrage strukturiert zu passenden
              Anbietern.
            </p>

            <ul>
              <li>
                <span>✓</span>
                Bedarf einfach beschreiben
              </li>
              <li>
                <span>✓</span>
                Angebote und Leistungen vergleichen
              </li>
              <li>
                <span>✓</span>
                Selbst entscheiden, was zu dir passt
              </li>
            </ul>

            <Link
              href="/auftrag-erstellen?query=Versicherung"
              className={styles.darkCta}
            >
              Vergleich starten
              <span>→</span>
            </Link>
          </div>

          <div className={styles.featureVisual}>
            <div className={styles.ringOne} />
            <div className={styles.ringTwo} />

            <div className={styles.featureCenter}>
              <span>AUFTRAGO</span>
              <strong>Versicherung</strong>
              <small>Vergleichen statt suchen</small>
            </div>

            <div className={`${styles.orbitTag} ${styles.orbitOne}`}>
              Krankenkasse
            </div>
            <div className={`${styles.orbitTag} ${styles.orbitTwo}`}>
              Auto
            </div>
            <div className={`${styles.orbitTag} ${styles.orbitThree}`}>
              Hausrat
            </div>
            <div className={`${styles.orbitTag} ${styles.orbitFour}`}>
              Unternehmen
            </div>
          </div>
        </div>
      </section>

      <section className={styles.finalCtaSection}>
        <div className={styles.finalGlow} />

        <div className={styles.finalCta}>
          <span className={styles.sectionEyebrow}>BEREIT?</span>

          <h2>
            Finde die Versicherung,
            <br />
            die wirklich zu dir passt.
          </h2>

          <p>
            Anfrage erstellen, Möglichkeiten vergleichen und in Ruhe
            entscheiden.
          </p>

          <Link
            href="/auftrag-erstellen?query=Versicherung"
            className={styles.finalButton}
          >
            Kostenlos vergleichen
            <span>→</span>
          </Link>

          <small>Unverbindliche Anfrage über Auftrago</small>
        </div>
      </section>
    </main>
  );
}
