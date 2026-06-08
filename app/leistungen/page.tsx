import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Leistungen | Reinigung, Umzug, Hauswartung & mehr | Auftrago",
  description:
    "Alle Dienstleistungen auf Auftrago: Reinigung, Umzug, Hauswartung, Gartenpflege, Entsorgung, Maler, Elektriker, Sanitär und mehr vergleichen.",
  alternates: {
    canonical: "https://www.auftrago.ch/leistungen",
  },
};

const services = [
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
];

const steps = [
  ["01", "Dienstleistung wählen", "Wähle aus, welche Arbeit erledigt werden soll."],
  ["02", "Auftrag beschreiben", "Ort, Termin, Objekt und wichtige Details eintragen."],
  ["03", "Anbieter vergleichen", "Regionale Firmen prüfen deine Anfrage."],
];

const faqs = [
  {
    q: "Ist die Anfrage kostenlos?",
    a: "Ja. Deine Anfrage über Auftrago ist kostenlos und unverbindlich.",
  },
  {
    q: "Welche Dienstleistungen kann ich anfragen?",
    a: "Du kannst Reinigung, Umzug, Hauswartung, Gartenpflege, Entsorgung, Malerarbeiten, Elektriker, Sanitär und viele weitere Arbeiten anfragen.",
  },
  {
    q: "Muss ich ein Angebot annehmen?",
    a: "Nein. Du entscheidest selbst, ob ein Anbieter und eine Offerte für dich passen.",
  },
];

export default function LeistungenPage() {
  return (
    <main className="leistungen-page">
      <section className="leistungen-new-hero">
        <div className="container leistungen-hero-grid">
          <div>
            <span className="anbieter-pill">Leistungen</span>

            <h1>
              Alles rund ums Zuhause
              <br />
              einfach vergleichen.
            </h1>

            <p>
              Finde regionale Anbieter für Reinigung, Hauswartung, Umzug,
              Gartenpflege, Entsorgung und weitere Dienstleistungen. Eine
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
          </aside>
        </div>
      </section>

      <section className="leistungen-section-new">
        <div className="container">
          <div className="anbieter-section-head">
            <span className="anbieter-pill">Kategorien</span>
            <h2>Wähle deine Dienstleistung</h2>
            <p>
              Jede Kategorie ist so aufgebaut, dass Anbieter schnell verstehen,
              was du brauchst. Dadurch erhältst du bessere Rückmeldungen und
              klarere Offerten.
            </p>
          </div>

          <div className="leistungen-service-grid-new">
            {services.map((service) => (
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
              sendest du deine Anfrage einmal über Auftrago.
            </p>
          </div>

          <div className="anbieter-step-list">
            {steps.map(([number, title, text]) => (
              <div key={number} className="anbieter-step-card">
                <span>{number}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="leistungen-section-new">
        <div className="container leistungen-split">
          <div>
            <span className="anbieter-pill">Vorteile</span>
            <h2>Warum Auftrago?</h2>
            <p>
              Auftrago macht Dienstleistungsaufträge einfacher. Du beschreibst
              deinen Auftrag, regionale Anbieter können reagieren und du
              vergleichst in Ruhe.
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