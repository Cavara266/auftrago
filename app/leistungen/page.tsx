import Link from "next/link";
import { Metadata } from "next";
import { services as seoServices, formatText } from "@/lib/seo-data";

export const metadata: Metadata = {
  title: "Leistungen | Reinigung, Umzug, Hauswartung & mehr | Auftrago",
  description:
    "Alle Dienstleistungen auf Auftrago: Reinigung, Umzug, Hauswartung, Gartenpflege, Entsorgung, Maler, Elektriker, Sanitär, Fensterreinigung und mehr vergleichen.",
  alternates: {
    canonical: "https://www.auftrago.ch/leistungen",
  },
  openGraph: {
    title: "Leistungen | Auftrago",
    description:
      "Finde regionale Anbieter für Reinigung, Hauswartung, Umzug, Gartenpflege, Entsorgung und weitere Dienstleistungen.",
    url: "https://www.auftrago.ch/leistungen",
    siteName: "Auftrago",
    type: "website",
  },
};

const mainServices = [
  {
    icon: "🧹",
    title: "Reinigung",
    text: "Wohnungsreinigung, Büroreinigung, Unterhaltsreinigung, Baureinigung und Spezialreinigung.",
    href: "/reinigung-zuerich",
    tags: ["Wohnung", "Büro", "Unterhalt"],
  },
  {
    icon: "🏠",
    title: "Umzugsreinigung",
    text: "Endreinigung, Abgabereinigung, Fenster, Küche, Bad und Reinigung mit Abgabegarantie.",
    href: "/umzugsreinigung-zuerich",
    tags: ["Abgabe", "Endreinigung", "Garantie"],
  },
  {
    icon: "🏢",
    title: "Hauswartung",
    text: "Liegenschaftsunterhalt, Kontrollgänge, Treppenhaus, technische Betreuung und Umgebungspflege.",
    href: "/hauswartung-zuerich",
    tags: ["Unterhalt", "Kontrolle", "Objekte"],
  },
  {
    icon: "📦",
    title: "Umzug & Transport",
    text: "Privatumzug, Firmenumzug, Möbeltransport, Kleintransport und Transporthilfe.",
    href: "/umzug-zuerich",
    tags: ["Umzug", "Transport", "Möbel"],
  },
  {
    icon: "🌿",
    title: "Gartenpflege",
    text: "Rasenmähen, Heckenschnitt, Laubarbeiten, Saisonpflege und gepflegte Aussenbereiche.",
    href: "/gartenpflege-zuerich",
    tags: ["Rasen", "Hecken", "Garten"],
  },
  {
    icon: "♻️",
    title: "Entsorgung",
    text: "Entrümpelung, Sperrgut, Keller, Estrich, Räumung und fachgerechte Entsorgung.",
    href: "/entsorgung-zuerich",
    tags: ["Räumung", "Sperrgut", "Keller"],
  },
  {
    icon: "🪟",
    title: "Fensterreinigung",
    text: "Fenster, Glasfassaden, Wintergärten, Rahmen, Storen und gründliche Glasreinigung.",
    href: "/fensterreinigung-zuerich",
    tags: ["Fenster", "Glas", "Storen"],
  },
  {
    icon: "🎨",
    title: "Malerarbeiten",
    text: "Innenanstrich, Fassaden, Renovationen, Ausbesserungen und frische Räume.",
    href: "/maler-zuerich",
    tags: ["Streichen", "Fassade", "Renovation"],
  },
  {
    icon: "⚡",
    title: "Elektriker",
    text: "Installationen, Reparaturen, Sicherheit, Beleuchtung und technische Arbeiten.",
    href: "/elektriker-zuerich",
    tags: ["Strom", "Licht", "Installation"],
  },
  {
    icon: "🚿",
    title: "Sanitär",
    text: "Reparaturen, Installationen, Badarbeiten, Armaturen und kleinere Sanitäraufträge.",
    href: "/sanitaer-zuerich",
    tags: ["Bad", "Wasser", "Reparatur"],
  },
  {
    icon: "❄️",
    title: "Winterdienst",
    text: "Schneeräumung, Salzen, sichere Zugänge, Einfahrten und Liegenschaftswege.",
    href: "/winterdienst-aargau",
    tags: ["Schnee", "Salzen", "Sicherheit"],
  },
  {
    icon: "🏗️",
    title: "Baureinigung",
    text: "Baustellenreinigung, Bauschlussreinigung, Grobreinigung und Feinreinigung.",
    href: "/baureinigung-zuerich",
    tags: ["Bau", "Feinreinigung", "Übergabe"],
  },
];

const steps = [
  {
    number: "01",
    title: "Dienstleistung wählen",
    text: "Wähle aus, welche Arbeit erledigt werden soll.",
  },
  {
    number: "02",
    title: "Auftrag beschreiben",
    text: "Ort, Termin, Objekt und wichtige Details eintragen.",
  },
  {
    number: "03",
    title: "Anfrage senden",
    text: "Deine Anfrage ist kostenlos und unverbindlich.",
  },
  {
    number: "04",
    title: "Anbieter vergleichen",
    text: "Regionale Firmen können deine Anfrage prüfen.",
  },
];

const popularLinks = [
  { label: "Reinigung Zürich", href: "/reinigung-zuerich" },
  { label: "Hauswartung Uster", href: "/hauswartung-uster" },
  { label: "Hauswartfirma Uster", href: "/hauswartfirma-uster" },
  { label: "Umzug Lenzburg", href: "/umzug-lenzburg" },
  { label: "Endreinigung Bülach", href: "/end-reinigung-buelach" },
  { label: "Büroreinigung Bülach", href: "/bueroreinigung-buelach" },
  { label: "Fensterreinigung Solothurn", href: "/fensterreinigung-solothurn" },
  { label: "Winterdienst Aargau", href: "/winterdienst-aargau" },
  { label: "Maler Dübendorf", href: "/maler-duebendorf" },
  { label: "Elektriker Bern", href: "/elektriker-bern" },
  { label: "Umzug Baden", href: "/umzug-baden" },
  { label: "Gebäudereinigung Horgen", href: "/gebaeudereinigung-horgen" },
];

const regionLinks = [
  { label: "Zürich", href: "/region/zuerich" },
  { label: "Aargau", href: "/region/aargau" },
  { label: "Basel", href: "/region/basel" },
  { label: "Bern", href: "/region/bern" },
  { label: "Luzern", href: "/region/luzern" },
  { label: "Zug", href: "/region/zug" },
  { label: "St. Gallen", href: "/region/st-gallen" },
  { label: "Schaffhausen", href: "/region/schaffhausen" },
];

const faqs = [
  {
    q: "Ist die Anfrage kostenlos?",
    a: "Ja. Deine Anfrage über Auftrago ist kostenlos und unverbindlich.",
  },
  {
    q: "Welche Dienstleistungen kann ich anfragen?",
    a: "Du kannst Reinigung, Umzug, Hauswartung, Gartenpflege, Entsorgung, Malerarbeiten, Elektriker, Sanitär, Fensterreinigung, Winterdienst und viele weitere Arbeiten anfragen.",
  },
  {
    q: "Muss ich ein Angebot annehmen?",
    a: "Nein. Du entscheidest selbst, ob ein Anbieter und eine Offerte für dich passen.",
  },
  {
    q: "Kann ich mehrere Anbieter vergleichen?",
    a: "Ja. Auftrago hilft dir, regionale Anbieter und Offerten einfacher zu vergleichen.",
  },
];

export default function LeistungenPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Leistungen auf Auftrago",
    url: "https://www.auftrago.ch/leistungen",
    description:
      "Übersicht aller Dienstleistungen auf Auftrago für regionale Offerten in der Schweiz.",
  };

  return (
    <main className="leistungen-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(collectionSchema),
        }}
      />

      <section className="leistungen-new-hero">
        <div className="container leistungen-hero-grid">
          <div>
            <span className="anbieter-pill">Leistungen</span>

            <h1>
              Alle Dienstleistungen
              <br />
              einfach vergleichen.
            </h1>

            <p>
              Finde regionale Anbieter für Reinigung, Hauswartung, Umzug,
              Gartenpflege, Entsorgung, Fensterreinigung, Malerarbeiten,
              Elektriker, Sanitär und viele weitere Dienstleistungen. Eine
              Anfrage genügt.
            </p>

            <div className="anbieter-actions">
              <Link href="/offerte-anfragen" className="btn btn-primary">
                Kostenlose Offerte anfragen
              </Link>

              <Link href="/anbieter" className="btn btn-secondary">
                Anbieter ansehen
              </Link>
            </div>

            <div className="anbieter-trust">
              <span>✓ Kostenlos</span>
              <span>✓ Schnell</span>
              <span>✓ Regional</span>
              <span>✓ Unverbindlich</span>
            </div>
          </div>

          <aside className="leistungen-hero-card">
            <span>Beliebt</span>
            <h2>Top Kategorien</h2>
            <Link href="/reinigung-zuerich">Reinigung</Link>
            <Link href="/umzugsreinigung-zuerich">Umzugsreinigung</Link>
            <Link href="/hauswartung-zuerich">Hauswartung</Link>
            <Link href="/gartenpflege-zuerich">Gartenpflege</Link>
            <Link href="/fensterreinigung-zuerich">Fensterreinigung</Link>
          </aside>
        </div>
      </section>

      <section className="leistungen-section-new">
        <div className="container">
          <div className="anbieter-section-head">
            <span className="anbieter-pill">Kategorien</span>
            <h2>Wähle deine passende Dienstleistung</h2>
            <p>
              Jede Kategorie ist so aufgebaut, dass Anbieter schnell verstehen,
              was du brauchst. Dadurch erhältst du bessere Rückmeldungen und
              klarere Offerten.
            </p>
          </div>

          <div className="leistungen-service-grid-new">
            {mainServices.map((service) => (
              <Link
                key={service.title}
                href={service.href}
                className="leistungen-service-card-new"
              >
                <div className="leistungen-icon">{service.icon}</div>
                <h3>{service.title}</h3>
                <p>{service.text}</p>

                <div className="anbieter-tags">
                  {service.tags.map((tag) => (
                    <small key={tag}>{tag}</small>
                  ))}
                </div>

                <strong>Mehr erfahren →</strong>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="leistungen-section-new leistungen-dark">
        <div className="container leistungen-steps-grid">
          <div>
            <span className="anbieter-pill">Ablauf</span>
            <h2>Eine Anfrage. Mehrere Möglichkeiten.</h2>
            <p>
              Statt einzelne Firmen zu suchen und jede separat zu kontaktieren,
              sendest du deine Anfrage einmal über Auftrago. Passende Anbieter
              können deine Anfrage prüfen und sich bei dir melden.
            </p>
          </div>

          <div className="anbieter-step-list">
            {steps.map((step) => (
              <div key={step.number} className="anbieter-step-card">
                <span>{step.number}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="leistungen-section-new">
        <div className="container leistungen-split">
          <div>
            <span className="anbieter-pill">Vorteile</span>

            <h2>Warum Auftrago für Dienstleistungen?</h2>

            <p>
              Auftrago macht Dienstleistungsaufträge einfacher. Du beschreibst
              deinen Auftrag, regionale Anbieter können reagieren und du
              vergleichst in Ruhe.
            </p>

            <p>
              Besonders bei Reinigung, Hauswartung, Umzug, Gartenpflege,
              Entsorgung, Fensterreinigung oder Handwerkerarbeiten lohnt sich ein
              strukturierter Vergleich. So erkennst du schneller, welcher
              Anbieter zu deinem Auftrag passt.
            </p>
          </div>

          <div className="anbieter-benefit-grid">
            <div>
              <span>✓</span>
              <strong>Regionale Anbieter finden</strong>
            </div>
            <div>
              <span>✓</span>
              <strong>Zeit bei der Suche sparen</strong>
            </div>
            <div>
              <span>✓</span>
              <strong>Offerten besser vergleichen</strong>
            </div>
            <div>
              <span>✓</span>
              <strong>Für Privatkunden und Firmen</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="leistungen-section-new leistungen-dark">
        <div className="container">
          <div className="anbieter-section-head">
            <span className="anbieter-pill">Beliebte Suchanfragen</span>
            <h2>Häufig gesuchte Dienstleistungen</h2>
            <p>
              Diese Seiten werden besonders stark verlinkt, weil sie für lokale
              Kundenanfragen wichtig sind.
            </p>
          </div>

          <div className="anbieter-region-grid">
            {popularLinks.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="leistungen-section-new">
        <div className="container">
          <div className="anbieter-section-head">
            <span className="anbieter-pill">Alle Leistungen</span>
            <h2>Dienstleistungs-Hubs auf Auftrago</h2>
            <p>
              Diese Übersicht hilft dir, passende Kategorien zu finden und gibt
              Google eine klare interne Struktur über alle Leistungen.
            </p>
          </div>

          <div className="anbieter-region-grid">
            {seoServices.map((service) => (
              <Link key={service} href={`/leistungen/${service}`}>
                {formatText(service)}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="leistungen-section-new leistungen-dark">
        <div className="container">
          <div className="anbieter-section-head">
            <span className="anbieter-pill">Regionen</span>
            <h2>Dienstleister nach Region finden</h2>
            <p>
              Starte mit deiner Region und finde passende Anbieter für deine
              Dienstleistung.
            </p>
          </div>

          <div className="anbieter-region-grid">
            {regionLinks.map((region) => (
              <Link key={region.href} href={region.href}>
                {region.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="leistungen-section-new">
        <div className="container leistungen-faq-grid">
          <div>
            <span className="anbieter-pill">FAQ</span>
            <h2>Häufige Fragen</h2>
          </div>

          <div className="anbieter-faq">
            {faqs.map((faq) => (
              <details key={faq.q}>
                <summary>{faq.q}</summary>
                <p>{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="leistungen-final-cta">
        <div className="container">
          <span className="anbieter-pill">Jetzt starten</span>
          <h2>Passende Offerte erhalten</h2>
          <p>
            Beschreibe deinen Auftrag und finde regionale Anbieter für deine
            Dienstleistung.
          </p>

          <div className="anbieter-actions center">
            <Link href="/offerte-anfragen" className="btn btn-primary">
              Anfrage senden
            </Link>

            <Link href="/anbieter-registrieren" className="btn btn-secondary">
              Anbieter werden
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}