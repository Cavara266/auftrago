import Link from "next/link";

import AnbieterRegistrierenForm from "@/components/anbieter-registrieren-form";
import AnimatedProviderShowcase from "@/components/anbieter/animated-provider-showcase";

import styles from "./anbieter.module.css";
import ProviderPageAutoTranslate from "@/components/i18n/ProviderPageAutoTranslate";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const platformStats = [
  {
    value: "38’000+",
    label: "vermittelte Aufträge",
    detail: "über die Plattform",
  },
  {
    value: "6’500+",
    label: "registrierte Anbieter",
    detail: "aus der ganzen Schweiz",
  },
  {
    value: "420+",
    label: "Dienstleistungen",
    detail: "für Unternehmen jeder Grösse",
  },
  {
    value: "26",
    label: "Kantone",
    detail: "regionale Auftragschancen",
  },
];

const benefits = [
  {
    number: "01",
    icon: "↗",
    title: "Neue Kundenchancen",
    text: "Entdecke neue Leads aus deinen Regionen und Dienstleistungen.",
  },
  {
    number: "02",
    icon: "⚡",
    title: "Bestätigte Fixaufträge",
    text: "Übernimm ausgewählte Aufträge mit bestätigtem Kundeninteresse.",
  },
  {
    number: "03",
    icon: "◎",
    title: "Integriertes CRM",
    text: "Verwalte Kontakte, Offerten und Aktivitäten zentral im Portal.",
  },
  {
    number: "04",
    icon: "▤",
    title: "Volle Übersicht",
    text: "Behalte Credits, Rechnungen und Transaktionen jederzeit im Blick.",
  },
];

const faq = [
  {
    question: "Was kostet die Mitgliedschaft?",
    answer:
      "Die ersten 14 Tage sind kostenlos. Danach kostet die Anbieter-Mitgliedschaft CHF 69.– pro Monat.",
  },
  {
    question: "Werden während der Testphase Kosten belastet?",
    answer:
      "Während der 14-tägigen Testphase wird keine Monatsgebühr belastet. Die Zahlungsmethode wird für die spätere automatische Verlängerung hinterlegt.",
  },
  {
    question: "Sind Lead-Credits im Abo enthalten?",
    answer:
      "Nein. Die Mitgliedschaft bezahlt den Plattformzugang. Credits für einzelne Kundenkontakte werden separat gekauft.",
  },
  {
    question: "Kann ich mein Abo verwalten oder kündigen?",
    answer:
      "Ja. Zahlungsmethode, Rechnungen und Mitgliedschaft können über das sichere Stripe-Kundenportal verwaltet werden.",
  },
];

export default function AnbieterRegistrierenPage() {
  return (
    <main className={styles.page}>
      <ProviderPageAutoTranslate />
      <div className={styles.noise} />
      <div className={styles.orbOne} />
      <div className={styles.orbTwo} />

      <header className={styles.header}>
        <Link href="/" className={styles.logo}>
          <span>🔥</span>
          <strong>Auftrago</strong>
        </Link>

        <nav>
          <a href="#vorteile">Vorteile</a>
          <a href="#ablauf">So funktioniert es</a>
          <a href="#faq">FAQ</a>
        </nav>

        <div className={styles.headerActions}>
          <Link href="/login">Einloggen</Link>

          <a href="#registrieren">
            Kostenlos starten
          </a>
        </div>
      </header>

      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.eyebrow}>
            <i />
            Die Schweizer Plattform für Anbieter
          </div>

          <h1>
            Aufträge finden
            <span>jetzt deine Firma.</span>
          </h1>

          <p>
            Erhalte qualifizierte Kundenanfragen aus deiner Region,
            übernimm bestätigte Fixaufträge und verwalte Leads,
            Offerten und Kontakte zentral im Auftrago Firmenportal.
          </p>

          <div className={styles.heroTrust}>
            <span>
              <b>✓</b>
              14 Tage kostenlos
            </span>

            <span>
              <b>✓</b>
              CHF 69.– danach
            </span>

            <span>
              <b>✓</b>
              Sicher über Stripe
            </span>
          </div>

          <div className={styles.heroButtons}>
            <a href="#registrieren" className={styles.mainButton}>
              Jetzt 14 Tage kostenlos starten
              <span>→</span>
            </a>

            <a href="#plattform" className={styles.ghostButton}>
              Live-Demo entdecken
            </a>
          </div>

          <div className={styles.microProof}>
            <div>
              <span>CH</span>
              <span>AG</span>
              <span>ZH</span>
              <span>LU</span>
            </div>

            <p>
              <strong>Für Schweizer Dienstleistungsfirmen</strong>
              Neue Kundenchancen ohne aufwendige Eigenakquise.
            </p>
          </div>
        </div>

        <AnimatedProviderShowcase />
      </section>

      <section className={styles.scrollingBar}>
        <div>
          <span>NEUE KUNDENANFRAGEN</span>
          <i>◆</i>
          <span>BESTÄTIGTE FIXAUFTRÄGE</span>
          <i>◆</i>
          <span>CRM INKLUSIVE</span>
          <i>◆</i>
          <span>REGIONALES MATCHING</span>
          <i>◆</i>
          <span>14 TAGE KOSTENLOS</span>
          <i>◆</i>
          <span>NEUE KUNDENANFRAGEN</span>
          <i>◆</i>
          <span>BESTÄTIGTE FIXAUFTRÄGE</span>
        </div>
      </section>

      <section className={styles.stats}>
        {platformStats.map((stat) => (
          <article key={stat.label}>
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
            <small>{stat.detail}</small>
          </article>
        ))}
      </section>

      <section id="plattform" className={styles.platformSection}>
        <div className={styles.sectionCopy}>
          <span>Ein Portal. Alle Chancen.</span>

          <h2>
            Dein Unternehmen verdient
            <em> eine bessere Akquise.</em>
          </h2>

          <p>
            Statt Kunden mühsam über verschiedene Kanäle zu suchen,
            bündelt Auftrago Leads, Fixaufträge und deine
            Kundenverwaltung an einem Ort.
          </p>
        </div>

        <div className={styles.platformVisual}>
          <div className={styles.visualGlow} />

          <div className={styles.visualColumn}>
            <article>
              <span>Neue Leads</span>
              <strong>Passende Kundenanfragen</strong>
              <small>Region und Dienstleistung auswählen</small>
            </article>

            <article>
              <span>Mein CRM</span>
              <strong>Kontakte zentral verwalten</strong>
              <small>Status, Notizen und Aktivitäten</small>
            </article>
          </div>

          <div className={styles.centralFlow}>
            <span>AUFTRAGO</span>
            <strong>Dein Firmenportal</strong>
            <i />
          </div>

          <div className={styles.visualColumn}>
            <article>
              <span>Fixaufträge</span>
              <strong>Bestätigte Aufträge prüfen</strong>
              <small>Auftragswert direkt sichtbar</small>
            </article>

            <article>
              <span>Übersicht</span>
              <strong>Alles unter Kontrolle</strong>
              <small>Credits, Zahlungen und Rechnungen</small>
            </article>
          </div>
        </div>
      </section>

      <section id="vorteile" className={styles.benefitSection}>
        <div className={styles.sectionHeading}>
          <span>Warum Auftrago?</span>

          <h2>
            Weniger suchen.
            <em> Schneller handeln.</em>
          </h2>
        </div>

        <div className={styles.benefitGrid}>
          {benefits.map((benefit) => (
            <article key={benefit.number}>
              <span>{benefit.number}</span>

              <div>{benefit.icon}</div>

              <h3>{benefit.title}</h3>

              <p>{benefit.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.roiSection}>
        <div className={styles.roiCopy}>
          <span>Klare Investition</span>

          <h2>
            Ein zusätzlicher Auftrag kann die Mitgliedschaft
            mehrfach finanzieren.
          </h2>

          <p>
            Du entscheidest selbst, welche Kundenanfragen für dein
            Unternehmen interessant sind. Die Mitgliedschaft kostet
            nach der Testphase CHF 69.– pro Monat.
          </p>
        </div>

        <div className={styles.roiCalculation}>
          <article>
            <span>Mitgliedschaft</span>
            <strong>CHF 69.–</strong>
            <small>pro Monat</small>
          </article>

          <div className={styles.roiArrow}>→</div>

          <article>
            <span>Neue Chance</span>
            <strong>1 Auftrag</strong>
            <small>kann bereits entscheidend sein</small>
          </article>
        </div>
      </section>

      <section id="ablauf" className={styles.processSection}>
        <div className={styles.sectionHeading}>
          <span>Einfacher Einstieg</span>

          <h2>
            In wenigen Schritten
            <em> zu neuen Kunden.</em>
          </h2>
        </div>

        <div className={styles.processTrack}>
          <article>
            <span>01</span>
            <h3>Firma registrieren</h3>
            <p>Erstelle dein Anbieterprofil in wenigen Minuten.</p>
          </article>

          <i />

          <article>
            <span>02</span>
            <h3>Testphase starten</h3>
            <p>Zahlungsmethode sicher über Stripe hinterlegen.</p>
          </article>

          <i />

          <article>
            <span>03</span>
            <h3>Portal nutzen</h3>
            <p>Leads, Fixaufträge und CRM sofort entdecken.</p>
          </article>

          <i />

          <article>
            <span>04</span>
            <h3>Kunden gewinnen</h3>
            <p>Schnell reagieren und neue Aufträge sichern.</p>
          </article>
        </div>
      </section>

      <section id="registrieren" className={styles.registration}>
        <div className={styles.registrationCopy}>
          <div className={styles.registrationBadge}>
            14 Tage kostenlos testen
          </div>

          <h2>
            Bereit für deinen
            <em> nächsten Auftrag?</em>
          </h2>

          <p>
            Registriere deine Firma und erhalte Zugang zum
            vollständigen Anbieterportal.
          </p>

          <div className={styles.priceSummary}>
            <span>Heute</span>
            <strong>CHF 0.–</strong>

            <span>Nach 14 Tagen</span>
            <strong>CHF 69.– / Monat</strong>
          </div>

          <ul>
            <li>Keine Einrichtungsgebühr</li>
            <li>Sichere Stripe-Abrechnung</li>
            <li>Mitgliedschaft online verwaltbar</li>
            <li>Credits separat erhältlich</li>
          </ul>
        </div>

        <div className={styles.formCard}>
          <div className={styles.formTop}>
            <div>
              <span>Anbieterprofil</span>
              <h3>Firma registrieren</h3>
            </div>

            <small>ca. 2 Minuten</small>
          </div>

          <AnbieterRegistrierenForm />
        </div>
      </section>

      <section id="faq" className={styles.faqSection}>
        <div className={styles.sectionHeading}>
          <span>Häufige Fragen</span>

          <h2>
            Transparent.
            <em> Ohne Überraschungen.</em>
          </h2>
        </div>

        <div className={styles.faqList}>
          {faq.map((item) => (
            <details key={item.question}>
              <summary>
                {item.question}
                <span>+</span>
              </summary>

              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className={styles.finalCta}>
        <div>
          <span>Dein Wachstum beginnt hier</span>
          <h2>Starte jetzt 14 Tage kostenlos.</h2>
        </div>

        <a href="#registrieren">
          Anbieterprofil erstellen
          <span>→</span>
        </a>
      </section>

      <footer className={styles.footer}>
        <strong>Auftrago</strong>

        <p>
          Schweizer Plattform für regionale Dienstleistungen.
        </p>

        <div>
          <Link href="/agb">AGB</Link>
          <Link href="/datenschutz">Datenschutz</Link>
          <Link href="/impressum">Impressum</Link>
        </div>
      </footer>
    </main>
  );
}
