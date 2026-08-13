import type { Metadata } from "next";
import Link from "next/link";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Versicherungen vergleichen Schweiz | Auftrago",
  description:
    "Versicherungen in der Schweiz vergleichen und passende Anbieter finden. Krankenkasse, Auto, Hausrat, Haftpflicht, Rechtsschutz, Vorsorge, Firmenversicherung und mehr.",
  keywords: [
    "Versicherungen Schweiz",
    "Versicherungen vergleichen",
    "Versicherungsvergleich Schweiz",
    "Krankenkasse vergleichen",
    "Autoversicherung Schweiz",
    "Hausratversicherung",
    "Privathaftpflicht",
    "Rechtsschutzversicherung",
    "Firmenversicherung Schweiz",
  ],
};

const insuranceTypes = [
  {
    number: "01",
    icon: "✚",
    title: "Krankenkasse",
    query: "Krankenkasse",
    intro:
      "Grundversicherung und Zusatzversicherungen gehören zu den wichtigsten laufenden Versicherungskosten vieler Haushalte.",
    text:
      "Mit einer strukturierten Anfrage kannst du deinen Bedarf beschreiben und passende Möglichkeiten prüfen. Dabei können unter anderem Franchise, Versicherungsmodell, Zusatzleistungen und persönliche Anforderungen eine Rolle spielen.",
    points: [
      "Grundversicherung",
      "Zusatzversicherung",
      "Spitalzusatz",
      "Zahnversicherung",
    ],
  },
  {
    number: "02",
    icon: "◆",
    title: "Autoversicherung",
    query: "Autoversicherung",
    intro:
      "Für jedes Fahrzeug und jede Nutzung kann eine andere Versicherungsstruktur sinnvoll sein.",
    text:
      "Vergleiche Optionen rund um Haftpflicht, Teilkasko und Vollkasko. Faktoren wie Fahrzeugwert, Alter, Nutzung, Selbstbehalt und gewünschte Zusatzdeckungen können die passende Lösung beeinflussen.",
    points: ["Haftpflicht", "Teilkasko", "Vollkasko", "Zusatzdeckungen"],
  },
  {
    number: "03",
    icon: "⌂",
    title: "Hausratversicherung",
    query: "Hausratversicherung",
    intro:
      "Hausrat schützt persönliche Gegenstände im Haushalt gegen definierte Risiken.",
    text:
      "Ob Wohnung, Einfamilienhaus oder Wohngemeinschaft: Versicherungssumme, Wohnsituation und gewünschte Deckungen sollten zur tatsächlichen Situation passen.",
    points: ["Hausrat", "Diebstahl", "Elementarschäden", "Zusatzdeckungen"],
  },
  {
    number: "04",
    icon: "◎",
    title: "Privathaftpflicht",
    query: "Privathaftpflicht",
    intro:
      "Eine Haftpflichtversicherung kann bei Schadenersatzforderungen gegenüber Dritten relevant sein.",
    text:
      "Sie gehört für viele Haushalte zu den grundlegenden Absicherungen. Unterschiede können unter anderem bei Deckungssummen, Selbstbehalt und Zusatzleistungen bestehen.",
    points: ["Personenschäden", "Sachschäden", "Mietsachschäden", "Familienlösungen"],
  },
  {
    number: "05",
    icon: "§",
    title: "Rechtsschutz",
    query: "Rechtsschutzversicherung",
    intro:
      "Rechtliche Konflikte können zeitaufwendig und kostenintensiv werden.",
    text:
      "Je nach Versicherung können unterschiedliche Bereiche abgedeckt werden – etwa Privat-, Verkehrs-, Miet- oder Arbeitsrechtsschutz.",
    points: ["Privatrecht", "Verkehr", "Miete", "Arbeitsrecht"],
  },
  {
    number: "06",
    icon: "↗",
    title: "Vorsorge & Leben",
    query: "Vorsorge Lebensversicherung",
    intro:
      "Langfristige Absicherung betrifft Familie, Einkommen und persönliche Zukunftsplanung.",
    text:
      "Lösungen können sich stark unterscheiden. Deshalb ist es sinnvoll, Leistungen, Kosten, Laufzeiten und Bedingungen genau zu prüfen.",
    points: ["Lebensversicherung", "Erwerbsausfall", "Vorsorge", "Familienabsicherung"],
  },
  {
    number: "07",
    icon: "▦",
    title: "Firmenversicherung",
    query: "Firmenversicherung",
    intro:
      "Unternehmen benötigen je nach Branche, Grösse und Tätigkeit unterschiedliche Versicherungen.",
    text:
      "Von Betriebshaftpflicht über Sach- und Fahrzeugversicherungen bis hin zu Rechtsschutz und weiteren Lösungen können verschiedene Bereiche kombiniert werden.",
    points: ["Betriebshaftpflicht", "Sachversicherung", "Fahrzeuge", "Rechtsschutz"],
  },
  {
    number: "08",
    icon: "✦",
    title: "Individuelle Beratung",
    query: "Versicherungsberatung",
    intro:
      "Nicht jede Versicherung lässt sich einer Standardkategorie zuordnen.",
    text:
      "Beschreibe dein Anliegen individuell. Dadurch können Anbieter besser verstehen, welche Art von Lösung du suchst.",
    points: ["Individuelle Anfrage", "Speziallösungen", "Beratung", "Vergleich"],
  },
];

const faq = [
  {
    question: "Wie funktioniert der Versicherungsvergleich über Auftrago?",
    answer:
      "Du wählst den gewünschten Versicherungsbereich und beschreibst deinen Bedarf. Anschliessend kann deine Anfrage von passenden Anbietern geprüft werden. Du entscheidest selbst, welche Rückmeldungen oder Angebote du weiterverfolgen möchtest.",
  },
  {
    question: "Ist eine Anfrage über Auftrago verbindlich?",
    answer:
      "Eine Anfrage dient zunächst dazu, passende Möglichkeiten und Anbieter zu finden. Ob und zu welchen Bedingungen ein Versicherungsvertrag zustande kommt, entscheidest du anschliessend direkt mit dem jeweiligen Anbieter.",
  },
  {
    question: "Welche Versicherungen kann ich vergleichen?",
    answer:
      "Unter anderem Krankenkasse, Autoversicherung, Hausrat, Privathaftpflicht, Rechtsschutz, Vorsorge- und Lebenslösungen sowie Versicherungen für Unternehmen.",
  },
  {
    question: "Kann ich auch als Unternehmen eine Anfrage stellen?",
    answer:
      "Ja. Unternehmen und Selbstständige können ihren Versicherungsbedarf ebenfalls beschreiben und beispielsweise Lösungen rund um Betriebshaftpflicht, Sachwerte, Fahrzeuge oder Rechtsschutz anfragen.",
  },
  {
    question: "Was sollte ich vor einem Versicherungswechsel prüfen?",
    answer:
      "Prüfe insbesondere Deckungsumfang, Ausschlüsse, Selbstbehalt, Vertragslaufzeit, Kündigungsfristen, Prämien sowie die für dich relevanten Zusatzleistungen. Bei wichtigen oder komplexen Entscheidungen kann eine qualifizierte Beratung sinnvoll sein.",
  },
  {
    question: "Ist die günstigste Versicherung automatisch die beste?",
    answer:
      "Nicht unbedingt. Neben dem Preis sind insbesondere Leistungen, Bedingungen, Deckungssummen, Ausschlüsse und Service entscheidend. Ein Vergleich sollte deshalb nicht ausschliesslich über die Prämie erfolgen.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faq.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
};

export default function VersicherungenPage() {
  return (
    <main className={styles.page}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.glowA} />
        <div className={styles.glowB} />

        <div className={styles.heroInner}>
          <div className={styles.heroCopy}>
            <div className={styles.badge}>
              <span>✦</span>
              Versicherungen vergleichen in der Schweiz
            </div>

            <h1>
              Deine Versicherung.
              <br />
              <span>Besser verglichen.</span>
            </h1>

            <p className={styles.heroLead}>
              Versicherungen sind komplex. Der Vergleich muss es nicht sein.
              Beschreibe deinen Bedarf einmal und finde passende Möglichkeiten
              für Privatpersonen, Familien, Selbstständige und Unternehmen.
            </p>

            <div className={styles.heroActions}>
              <a href="#versicherungen" className={styles.primary}>
                Versicherung auswählen
                <span>→</span>
              </a>

              <Link
                href="/auftrag-erstellen?query=Versicherungsberatung"
                className={styles.secondary}
              >
                Beratung anfragen
              </Link>
            </div>

            <div className={styles.heroFacts}>
              <div>
                <strong>8+</strong>
                <span>Versicherungsbereiche</span>
              </div>

              <div>
                <strong>CH</strong>
                <span>Schweizer Markt</span>
              </div>

              <div>
                <strong>1</strong>
                <span>Anfrage statt langer Suche</span>
              </div>
            </div>
          </div>

          <div className={styles.heroVisual}>
            <div className={styles.visualGlow} />

            <div className={styles.platformCard}>
              <div className={styles.platformTop}>
                <div className={styles.platformLogo}>A</div>

                <div>
                  <small>AUFTRAGO</small>
                  <strong>Versicherungen</strong>
                </div>

                <div className={styles.status}>
                  <b />
                  Vergleich
                </div>
              </div>

              <div className={styles.platformQuestion}>
                <small>DEIN BEDARF</small>
                <h2>Was möchtest du versichern?</h2>
                <p>
                  Wähle einen Bereich und starte deine Anfrage.
                </p>
              </div>

              <div className={styles.platformOptions}>
                <div><span>✚</span>Krankenkasse</div>
                <div><span>◆</span>Auto</div>
                <div><span>⌂</span>Hausrat</div>
                <div><span>▦</span>Firma</div>
              </div>

              <div className={styles.platformBottom}>
                <span>Schritt 1 von 3</span>
                <Link href="/auftrag-erstellen?query=Versicherung">
                  Starten →
                </Link>
              </div>
            </div>

            <div className={`${styles.floatBox} ${styles.floatOne}`}>
              <b>✓</b>
              <div>
                <small>TRANSPARENT</small>
                <strong>Optionen vergleichen</strong>
              </div>
            </div>

            <div className={`${styles.floatBox} ${styles.floatTwo}`}>
              <b>⚡</b>
              <div>
                <small>EINFACH</small>
                <strong>Eine Anfrage</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section className={styles.intro}>
        <span className={styles.label}>VERSICHERUNGEN IN DER SCHWEIZ</span>

        <div className={styles.introGrid}>
          <h2>
            Versicherungen gehören zum Alltag.
            <span> Der Überblick oft nicht.</span>
          </h2>

          <div>
            <p>
              Ob Krankenkasse, Fahrzeug, Wohnung, Rechtsschutz oder
              Unternehmensversicherung: Die Zahl möglicher Produkte,
              Leistungen und Tarifvarianten ist gross.
            </p>

            <p>
              Gleichzeitig unterscheiden sich persönliche Bedürfnisse erheblich.
              Eine Versicherung, die für eine Person sinnvoll ist, muss nicht
              automatisch zu einer anderen Situation passen.
            </p>

            <p>
              Genau deshalb ist ein strukturierter Vergleich wichtig.
              Auftrago soll dir helfen, den ersten Schritt einfacher zu machen:
              Bedarf beschreiben, passende Möglichkeiten finden und danach
              fundiert entscheiden.
            </p>
          </div>
        </div>
      </section>

      {/* INSURANCE TYPES */}
      <section id="versicherungen" className={styles.insurances}>
        <div className={styles.sectionHeader}>
          <div>
            <span className={styles.label}>VERSICHERUNGSBEREICHE</span>
            <h2>Was möchtest du versichern?</h2>
          </div>

          <p>
            Wähle den passenden Bereich und erfahre mehr über typische
            Leistungen, Unterschiede und mögliche Vergleichskriterien.
          </p>
        </div>

        <div className={styles.insuranceGrid}>
          {insuranceTypes.map((item) => (
            <article key={item.title} className={styles.insuranceCard}>
              <div className={styles.cardHeader}>
                <span className={styles.cardNumber}>{item.number}</span>
                <span className={styles.cardIcon}>{item.icon}</span>
              </div>

              <h3>{item.title}</h3>

              <strong className={styles.cardIntro}>{item.intro}</strong>

              <p>{item.text}</p>

              <ul>
                {item.points.map((point) => (
                  <li key={point}>
                    <span>✓</span>
                    {point}
                  </li>
                ))}
              </ul>

              <Link
                href={`/auftrag-erstellen?query=${encodeURIComponent(item.query)}`}
              >
                {item.title} vergleichen
                <span>→</span>
              </Link>
            </article>
          ))}
        </div>
      </section>

      {/* WHY COMPARE */}
      <section className={styles.why}>
        <div className={styles.whyInner}>
          <div className={styles.whyCopy}>
            <span className={styles.label}>WARUM VERGLEICHEN?</span>

            <h2>
              Preis ist wichtig.
              <br />
              <span>Leistung ist wichtiger.</span>
            </h2>

            <p>
              Versicherungen sollten nicht nur anhand einer einzelnen Prämie
              beurteilt werden. Entscheidend ist, was tatsächlich versichert
              ist – und unter welchen Bedingungen.
            </p>

            <p>
              Je nach Produkt können sich Deckungsumfang, Selbstbehalt,
              Versicherungssumme, Ausschlüsse, Zusatzleistungen und
              Vertragsbedingungen deutlich unterscheiden.
            </p>

            <Link
              href="/auftrag-erstellen?query=Versicherungsvergleich"
              className={styles.whyButton}
            >
              Vergleich starten
              <span>→</span>
            </Link>
          </div>

          <div className={styles.whyList}>
            <article>
              <span>01</span>
              <div>
                <h3>Leistungen vergleichen</h3>
                <p>
                  Prüfe, welche Leistungen enthalten sind und welche Bedingungen
                  für die Deckung gelten.
                </p>
              </div>
            </article>

            <article>
              <span>02</span>
              <div>
                <h3>Selbstbehalt berücksichtigen</h3>
                <p>
                  Ein tieferer Preis kann mit einem höheren Selbstbehalt oder
                  anderen Einschränkungen verbunden sein.
                </p>
              </div>
            </article>

            <article>
              <span>03</span>
              <div>
                <h3>Vertragsbedingungen prüfen</h3>
                <p>
                  Laufzeiten, Kündigungsfristen und Ausschlüsse gehören zu jedem
                  seriösen Vergleich.
                </p>
              </div>
            </article>

            <article>
              <span>04</span>
              <div>
                <h3>Gesamtpaket beurteilen</h3>
                <p>
                  Preis, Leistung und persönliche Anforderungen sollten
                  gemeinsam betrachtet werden.
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className={styles.process}>
        <div className={styles.centerHeader}>
          <span className={styles.label}>SO FUNKTIONIERT AUFTRAGO</span>
          <h2>Von der Frage zur passenden Lösung.</h2>
          <p>
            Der Einstieg soll einfach sein. Du beschreibst, was du suchst –
            und kannst danach passende Möglichkeiten prüfen.
          </p>
        </div>

        <div className={styles.processGrid}>
          <article>
            <span className={styles.step}>01</span>
            <div className={styles.stepIcon}>◎</div>
            <h3>Versicherung wählen</h3>
            <p>
              Wähle den Bereich, der zu deinem Anliegen passt – beispielsweise
              Krankenkasse, Auto, Hausrat oder Firmenversicherung.
            </p>
          </article>

          <article>
            <span className={styles.step}>02</span>
            <div className={styles.stepIcon}>≡</div>
            <h3>Bedarf beschreiben</h3>
            <p>
              Ergänze die wichtigsten Angaben, damit Anbieter verstehen,
              welche Art von Versicherung du suchst.
            </p>
          </article>

          <article>
            <span className={styles.step}>03</span>
            <div className={styles.stepIcon}>⇄</div>
            <h3>Möglichkeiten prüfen</h3>
            <p>
              Vergleiche Rückmeldungen und Angebote nach deinen persönlichen
              Kriterien.
            </p>
          </article>

          <article>
            <span className={styles.step}>04</span>
            <div className={styles.stepIcon}>✓</div>
            <h3>Selbst entscheiden</h3>
            <p>
              Du entscheidest selbst, ob und mit welchem Anbieter du
              weiterarbeiten möchtest.
            </p>
          </article>
        </div>
      </section>

      {/* PRIVATE */}
      <section className={styles.privateSection}>
        <div className={styles.bigPanel}>
          <div className={styles.panelCopy}>
            <span className={styles.label}>FÜR PRIVATPERSONEN</span>

            <h2>
              Absicherung für
              <br />
              Alltag und Zukunft.
            </h2>

            <p>
              Versicherungen begleiten viele Lebensbereiche. Wohnung, Fahrzeug,
              Gesundheit, Familie, Recht und Vorsorge können jeweils eigene
              Anforderungen mit sich bringen.
            </p>

            <p>
              Deshalb lohnt es sich, bestehende Versicherungen regelmässig zu
              überprüfen und Veränderungen der persönlichen Situation zu
              berücksichtigen.
            </p>

            <div className={styles.checks}>
              <span>✓ Umzug oder neue Wohnung</span>
              <span>✓ Neues Fahrzeug</span>
              <span>✓ Familiengründung</span>
              <span>✓ Berufliche Veränderung</span>
              <span>✓ Neue finanzielle Situation</span>
              <span>✓ Bestehende Verträge überprüfen</span>
            </div>

            <Link href="/auftrag-erstellen?query=Private Versicherung">
              Private Versicherung vergleichen →
            </Link>
          </div>

          <div className={styles.panelVisual}>
            <div className={styles.ringOuter} />
            <div className={styles.ringInner} />

            <div className={styles.centerCircle}>
              <small>PRIVAT</small>
              <strong>Dein Leben</strong>
              <span>Deine Absicherung</span>
            </div>

            <span className={`${styles.orbit} ${styles.orbitA}`}>Gesundheit</span>
            <span className={`${styles.orbit} ${styles.orbitB}`}>Wohnen</span>
            <span className={`${styles.orbit} ${styles.orbitC}`}>Mobilität</span>
            <span className={`${styles.orbit} ${styles.orbitD}`}>Vorsorge</span>
          </div>
        </div>
      </section>

      {/* BUSINESS */}
      <section className={styles.businessSection}>
        <div className={styles.businessContent}>
          <span className={styles.label}>FÜR UNTERNEHMEN</span>

          <h2>
            Unternehmen haben andere Risiken.
            <span> Und brauchen andere Lösungen.</span>
          </h2>

          <div className={styles.businessColumns}>
            <div>
              <p>
                Vom Einzelunternehmen bis zum grösseren KMU unterscheiden sich
                Versicherungsbedürfnisse nach Branche, Umsatz, Mitarbeitenden,
                Infrastruktur und Tätigkeit.
              </p>

              <p>
                Eine Firma kann beispielsweise Risiken rund um Haftpflicht,
                Inventar, Fahrzeuge, Rechtsschutz oder Betriebsunterbruch
                absichern wollen.
              </p>
            </div>

            <div>
              <p>
                Entscheidend ist, dass Versicherungen zur tatsächlichen
                Geschäftstätigkeit passen. Unter- oder Überversicherung kann
                langfristig unnötige Risiken oder Kosten verursachen.
              </p>

              <p>
                Über Auftrago können Unternehmen ihren Bedarf beschreiben und
                passende Versicherungsanbieter oder Beratungen anfragen.
              </p>
            </div>
          </div>

          <div className={styles.businessCards}>
            <div>
              <span>01</span>
              <h3>Betriebshaftpflicht</h3>
              <p>Schutz vor Haftungsrisiken aus der Geschäftstätigkeit.</p>
            </div>

            <div>
              <span>02</span>
              <h3>Sachversicherung</h3>
              <p>Absicherung von Inventar, Einrichtungen und Betriebsmitteln.</p>
            </div>

            <div>
              <span>03</span>
              <h3>Fahrzeuge</h3>
              <p>Versicherung für Geschäftsfahrzeuge und Flotten.</p>
            </div>

            <div>
              <span>04</span>
              <h3>Rechtsschutz</h3>
              <p>Unterstützung bei geschäftlichen Rechtsfragen.</p>
            </div>
          </div>

          <Link
            href="/auftrag-erstellen?query=Firmenversicherung"
            className={styles.businessCta}
          >
            Firmenversicherung anfragen
            <span>→</span>
          </Link>
        </div>
      </section>

      {/* CONTENT */}
      <section className={styles.contentSection}>
        <div className={styles.contentTitle}>
          <span className={styles.label}>VERSICHERUNGEN VERSTEHEN</span>
          <h2>Was bei einem Vergleich wichtig ist.</h2>
        </div>

        <div className={styles.contentGrid}>
          <article>
            <h3>Deckungsumfang</h3>
            <p>
              Der Deckungsumfang beschreibt, welche Risiken und Leistungen
              tatsächlich versichert sind. Zwei Produkte mit ähnlichem Namen
              können unterschiedliche Leistungen beinhalten.
            </p>
          </article>

          <article>
            <h3>Versicherungssumme</h3>
            <p>
              Je nach Versicherung kann eine Versicherungssumme oder maximale
              Leistung definiert sein. Diese sollte zum tatsächlichen Risiko
              passen.
            </p>
          </article>

          <article>
            <h3>Selbstbehalt</h3>
            <p>
              Der Selbstbehalt bezeichnet den Anteil, den Versicherte im
              Schadenfall selbst tragen. Ein höherer Selbstbehalt kann
              Auswirkungen auf die Prämie haben.
            </p>
          </article>

          <article>
            <h3>Ausschlüsse</h3>
            <p>
              Nicht jedes Ereignis ist automatisch versichert. Die
              Versicherungsbedingungen können bestimmte Situationen oder Risiken
              ausdrücklich ausschliessen.
            </p>
          </article>

          <article>
            <h3>Vertragslaufzeit</h3>
            <p>
              Prüfe Laufzeit, Verlängerung und Kündigungsfristen. Diese können
              beeinflussen, wann ein Wechsel möglich ist.
            </p>
          </article>

          <article>
            <h3>Zusatzleistungen</h3>
            <p>
              Assistance, Beratung, Ersatzleistungen oder weitere Services
              können je nach Produkt unterschiedlich ausgestaltet sein.
            </p>
          </article>
        </div>
      </section>

      {/* CTA STRIP */}
      <section className={styles.ctaStrip}>
        <div>
          <div>
            <span className={styles.label}>DEIN NÄCHSTER SCHRITT</span>
            <h2>Jetzt Versicherungsbedarf beschreiben.</h2>
            <p>
              Starte mit einer unverbindlichen Anfrage und prüfe passende
              Möglichkeiten.
            </p>
          </div>

          <Link href="/auftrag-erstellen?query=Versicherung">
            Vergleich starten
            <span>→</span>
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section className={styles.faq}>
        <div className={styles.faqIntro}>
          <span className={styles.label}>HÄUFIGE FRAGEN</span>

          <h2>
            Fragen zum
            <br />
            Versicherungsvergleich.
          </h2>

          <p>
            Die wichtigsten Punkte rund um Anfragen, Vergleiche und
            Versicherungen über Auftrago.
          </p>
        </div>

        <div className={styles.faqList}>
          {faq.map((item, index) => (
            <details key={item.question}>
              <summary>
                <span>{String(index + 1).padStart(2, "0")}</span>
                {item.question}
                <b>+</b>
              </summary>

              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </section>

      {/* FINAL */}
      <section className={styles.final}>
        <div className={styles.finalGlow} />

        <div className={styles.finalInner}>
          <span className={styles.label}>AUFTRAGO VERSICHERUNGEN</span>

          <h2>
            Weniger suchen.
            <br />
            <span>Besser vergleichen.</span>
          </h2>

          <p>
            Beschreibe deine Situation und finde passende Möglichkeiten für
            deine Versicherung.
          </p>

          <Link href="/auftrag-erstellen?query=Versicherung">
            Versicherung vergleichen
            <span>→</span>
          </Link>

          <small>
            Informationen auf dieser Seite dienen der allgemeinen Orientierung
            und stellen keine individuelle Versicherungs- oder Finanzberatung dar.
          </small>
        </div>
      </section>
    </main>
  );
}
