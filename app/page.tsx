import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import HomeLeadForm from "@/components/home-lead-form";
import LiveLeadFeed from "@/components/live-lead-feed";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title:
    "Auftrago – Offertenplattform Schweiz für Reinigung, Hauswartung, Umzug & Gartenpflege",
  description:
    "Kostenlose Offerte anfragen für Reinigung, Hauswartung, Umzug, Gartenpflege, Entsorgung, Fensterreinigung, Sanitär, Elektriker und regionale Dienstleistungen in der Schweiz.",
  alternates: {
    canonical: "https://www.auftrago.ch",
  },
  openGraph: {
    title: "Auftrago – Offertenplattform Schweiz",
    description:
      "Kostenlose Offerten für Reinigung, Hauswartung, Umzug, Gartenpflege, Entsorgung und weitere Dienstleistungen in der Schweiz vergleichen.",
    url: "https://www.auftrago.ch",
    siteName: "Auftrago",
    type: "website",
  },
};

const services = [
  {
    icon: "🧹",
    title: "Reinigung",
    text: "Wohnungsreinigung, Büroreinigung, Unterhaltsreinigung, Baureinigung, Endreinigung und Spezialreinigung.",
    href: "/reinigung-zuerich",
  },
  {
    icon: "🏠",
    title: "Umzugsreinigung",
    text: "Endreinigung, Wohnungsabgabe, Küche, Bad, Fenster und Reinigung mit Abgabegarantie.",
    href: "/umzugsreinigung-zuerich",
  },
  {
    icon: "🏢",
    title: "Hauswartung",
    text: "Liegenschaftsunterhalt, Treppenhausreinigung, Kontrollgänge, Umgebungspflege und Winterdienst.",
    href: "/hauswartung-zuerich",
  },
  {
    icon: "🌿",
    title: "Gartenpflege",
    text: "Rasenmähen, Heckenschnitt, Laubarbeiten, Saisonpflege und Gartenunterhalt.",
    href: "/gartenpflege-zuerich",
  },
  {
    icon: "📦",
    title: "Umzug & Transport",
    text: "Privatumzug, Firmenumzug, Möbeltransport, Kleintransport und Transporthilfe.",
    href: "/umzug-zuerich",
  },
  {
    icon: "♻️",
    title: "Entsorgung",
    text: "Entrümpelung, Sperrgut, Keller räumen, Estrich räumen, Räumung und fachgerechte Entsorgung.",
    href: "/entsorgung-zuerich",
  },
  {
    icon: "🪟",
    title: "Fensterreinigung",
    text: "Fenster, Glasfassaden, Wintergärten, Rahmen, Storen und gründliche Glasreinigung.",
    href: "/fensterreinigung-zuerich",
  },
  {
    icon: "🎨",
    title: "Malerarbeiten",
    text: "Innenanstrich, Fassaden, Renovationen, Ausbesserungen und frische Räume.",
    href: "/maler-zuerich",
  },
  {
    icon: "⚡",
    title: "Elektriker",
    text: "Installationen, Reparaturen, Beleuchtung, Sicherheit und kleinere Elektroarbeiten.",
    href: "/elektriker-zuerich",
  },
];

const regions = [
  "Zürich",
  "Aargau",
  "Aarau",
  "Baden",
  "Winterthur",
  "Basel",
  "Bern",
  "Luzern",
  "Zug",
  "St. Gallen",
  "Solothurn",
  "Schweiz",
];

const popularLinks = [
  ["Reinigung Zürich", "/reinigung-zuerich"],
  ["Reinigung Aargau", "/reinigung-aargau"],
  ["Reinigung Basel", "/reinigung-basel"],
  ["Reinigung Bern", "/reinigung-bern"],
  ["Umzugsreinigung Zürich", "/umzugsreinigung-zuerich"],
  ["Umzugsreinigung Aargau", "/umzugsreinigung-aargau"],
  ["Hauswartung Zürich", "/hauswartung-zuerich"],
  ["Hauswartung Aargau", "/hauswartung-aargau"],
  ["Gartenpflege Zürich", "/gartenpflege-zuerich"],
  ["Fensterreinigung Zürich", "/fensterreinigung-zuerich"],
  ["Entsorgung Zürich", "/entsorgung-zuerich"],
  ["Umzug Zürich", "/umzug-zuerich"],
];

const faqs = [
  {
    question: "Ist Auftrago kostenlos?",
    answer:
      "Ja. Kunden können kostenlos und unverbindlich eine Anfrage erstellen.",
  },
  {
    question: "Welche Dienstleistungen kann ich anfragen?",
    answer:
      "Du kannst Offerten für Reinigung, Umzugsreinigung, Hauswartung, Gartenpflege, Umzug, Transport, Entsorgung, Fensterreinigung, Malerarbeiten, Elektriker, Sanitär und weitere Dienstleistungen anfragen.",
  },
  {
    question: "Wie schnell erhalte ich Rückmeldungen?",
    answer:
      "Das hängt von Region, Auftrag und Verfügbarkeit der Anbieter ab. Eine genaue Beschreibung erhöht die Chance auf schnelle Rückmeldungen.",
  },
  {
    question: "Muss ich ein Angebot annehmen?",
    answer:
      "Nein. Die Anfrage ist unverbindlich. Du entscheidest selbst, ob ein Angebot zu deinem Auftrag passt.",
  },
];

export default async function HomePage() {
  const latestLeads = await prisma.lead.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 6,
    select: {
      id: true,
      title: true,
      region: true,
      category: true,
      price: true,
      createdAt: true,
    },
  });

  const displayTotalCount = 487;
  const displayWeekCount = 63;
  const displayTodayCount = 12;

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Auftrago",
    url: "https://www.auftrago.ch",
    description:
      "Schweizer Offertenplattform für Reinigung, Hauswartung, Umzug, Gartenpflege, Entsorgung und weitere regionale Dienstleistungen.",
  };

  return (
    <main className="home-page premium-home">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />

      <section className="premium-hero">
        <div className="container premium-hero-grid">
          <div className="premium-hero-copy">
            <span className="eyebrow">Offertenplattform Schweiz</span>

            <h1>In 60 Sekunden zur passenden Offerte.</h1>

            <p>
              Auftrago hilft dir, regionale Anbieter für Reinigung, Hauswartung,
              Umzug, Gartenpflege, Entsorgung, Fensterreinigung, Malerarbeiten,
              Sanitär, Elektriker und weitere Dienstleistungen zu vergleichen.
            </p>

            <p>
              Statt viele Firmen einzeln anzurufen, beschreibst du deinen Auftrag
              einmal. Deine Anfrage wird strukturiert erfasst und passende
              Anbieter aus deiner Region können darauf reagieren.
            </p>

            <div className="actions">
              <a href="#anfrage" className="btn btn-primary">
                Kostenlose Offerte anfragen
              </a>

              <Link href="/anbieter" className="btn btn-secondary">
                Anbieter finden
              </Link>
            </div>
          </div>

          <div id="anfrage" className="premium-form-shell">
            <div className="form-badge">Kostenlos & unverbindlich</div>
            <HomeLeadForm />
          </div>
        </div>
      </section>

      <LiveLeadFeed
        leads={latestLeads}
        todayCount={displayTodayCount}
        weekCount={displayWeekCount}
        totalCount={displayTotalCount}
      />

      <section className="premium-section">
        <div className="container premium-intro-card">
          <div>
            <span className="eyebrow">Warum Auftrago?</span>
            <h2>Eine Anfrage reicht.</h2>
          </div>

          <div className="premium-text">
            <p>
              Wer eine zuverlässige Firma sucht, verliert oft viel Zeit mit
              Google-Suche, Telefonaten, Rückfragen und unübersichtlichen
              Offerten. Auftrago vereinfacht diesen Prozess: Du beschreibst
              deinen Auftrag einmal und erhältst eine bessere Grundlage für den
              Vergleich.
            </p>

            <p>
              Besonders bei Umzugsreinigung, Wohnungsreinigung,
              Treppenhausreinigung, Hauswartung, Gartenpflege, Fensterreinigung,
              Transport, Räumung oder Entsorgung ist es wichtig, dass Anbieter
              von Anfang an die richtigen Informationen erhalten.
            </p>

            <p>
              Auftrago sorgt für klare Angaben, bessere Vergleichbarkeit, weniger
              Rückfragen und schnellere Entscheidungen. So findest du einfacher
              eine passende Firma in Zürich, Aargau, Aarau, Baden, Winterthur,
              Basel, Bern, Luzern, Zug oder in deiner Region.
            </p>
          </div>
        </div>
      </section>

      <section className="premium-section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Leistungen</span>

            <h2>Finde Anbieter für viele Dienstleistungen.</h2>

            <p>
              Auftrago bündelt Kundenanfragen aus Bereichen, in denen Menschen
              schnell eine zuverlässige Firma benötigen. Dazu gehören Reinigung,
              Umzugsreinigung, Hauswartung, Gartenpflege, Fensterreinigung,
              Entsorgung, Transport, Malerarbeiten, Sanitär und Elektroarbeiten.
            </p>
          </div>

          <div className="premium-service-grid">
            {services.map((service) => (
              <Link
                href={service.href}
                className="premium-service-card"
                key={service.title}
              >
                <div className="premium-service-icon">{service.icon}</div>
                <h3>{service.title}</h3>
                <p>{service.text}</p>
                <strong>Mehr erfahren →</strong>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="premium-section">
        <div className="container premium-region-card">
          <div>
            <span className="eyebrow">Regionen</span>

            <h2>Stark in Zürich, Aargau und der ganzen Schweiz.</h2>

            <p>
              Lokale Dienstleistungen brauchen Nähe. Deshalb setzt Auftrago auf
              regionale Anfragen und passende Anbieter aus der Umgebung. Ob
              Zürich, Aargau, Aarau, Baden, Winterthur, Basel, Bern, Luzern,
              Zug, Solothurn oder St. Gallen – regionale Firmen sollen schneller
              mit passenden Kunden zusammenfinden.
            </p>
          </div>

          <div className="premium-region-list">
            {regions.map((region) => (
              <span key={region}>{region}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="premium-section">
        <div className="container premium-provider-card">
          <span className="eyebrow">Beliebte Suchanfragen</span>

          <h2>Direkt zu häufig gesuchten Offerten.</h2>

          <p>
            Viele Kunden suchen täglich nach Begriffen wie Reinigungsfirma
            Zürich, Reinigungsfirma Aargau, Umzugsreinigung Zürich,
            Hauswartung Zürich, Gartenpflege Zürich, Fensterreinigung Zürich,
            Entsorgung Zürich oder Umzug Zürich.
          </p>

          <div className="seo-link-grid">
            {popularLinks.map(([label, href]) => (
              <Link key={href} href={href}>
                {label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="premium-section">
        <div className="container premium-provider-card">
          <span className="eyebrow">Für Anbieter</span>

          <h2>Mehr relevante Leads. Weniger Streuverlust.</h2>

          <p>
            Auftrago ist für Dienstleister gemacht, die nicht einfach nur
            Sichtbarkeit kaufen möchten, sondern konkrete Kundenanfragen erhalten
            wollen. Anbieter können passende Leads prüfen, Credits aufladen und
            interessante Kontakte gezielt freischalten.
          </p>

          <p>
            Besonders für Reinigungsfirmen, Hauswartungen, Gartenbauer,
            Umzugsfirmen, Entsorgungsbetriebe, Fensterreiniger, Maler,
            Sanitärbetriebe und Elektriker bietet Auftrago eine direkte
            Möglichkeit, neue Aufträge in der eigenen Region zu gewinnen.
          </p>

          <div className="actions">
            <Link href="/anbieter-registrieren" className="btn btn-primary">
              Als Anbieter registrieren
            </Link>

            <Link href="/anbieter" className="btn btn-secondary">
              Anbieter ansehen
            </Link>
          </div>
        </div>
      </section>

      <section className="premium-section">
        <div className="container premium-faq">
          <span className="eyebrow">FAQ</span>
          <h2>Häufige Fragen zu Auftrago</h2>

          <div className="quote-faq">
            {faqs.map((faq) => (
              <details key={faq.question}>
                <summary>{faq.question}</summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="premium-final">
        <div className="container premium-final-card">
          <span className="eyebrow">Jetzt starten</span>

          <h2>Beschreibe deinen Auftrag einmal. Erhalte passende Offerten.</h2>

          <p>
            Kostenlos, unverbindlich und regional. Starte deine Anfrage in
            weniger als einer Minute und finde passende Anbieter für Reinigung,
            Hauswartung, Umzug, Gartenpflege, Fensterreinigung, Entsorgung,
            Transport, Malerarbeiten, Sanitär oder Elektroarbeiten.
          </p>

          <div className="actions center">
            <a href="#anfrage" className="btn btn-primary">
              Kostenlose Offerte anfragen
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}