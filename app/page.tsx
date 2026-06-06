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
};

const services = [
  {
    icon: "🧹",
    title: "Reinigung",
    text: "Wohnungsreinigung, Büroreinigung, Baureinigung, Unterhaltsreinigung, Endreinigung, Umzugsreinigung mit Abgabegarantie und Spezialreinigungen für private und gewerbliche Kunden.",
  },
  {
    icon: "📦",
    title: "Umzug & Transport",
    text: "Privatumzug, Firmenumzug, Möbeltransport, Kleintransport, Entsorgung, Räumung, Verpackung und Unterstützung rund um den gesamten Umzug.",
  },
  {
    icon: "🏢",
    title: "Hauswartung",
    text: "Hauswartung, Liegenschaftsunterhalt, Treppenhausreinigung, technische Kontrolle, Umgebungspflege, Winterdienst und regelmässige Objektbetreuung.",
  },
  {
    icon: "🌿",
    title: "Gartenpflege",
    text: "Rasenmähen, Heckenschnitt, Sträucher schneiden, Laubarbeiten, Saisonpflege, Gartenunterhalt und Pflege von Aussenbereichen.",
  },
  {
    icon: "🎨",
    title: "Malerarbeiten",
    text: "Innenanstriche, Fassadenarbeiten, Renovationen, Ausbesserungen, Decken, Wände und saubere Malerarbeiten für Wohnungen und Häuser.",
  },
  {
    icon: "⚡",
    title: "Elektriker",
    text: "Elektroinstallationen, Reparaturen, Beleuchtung, Steckdosen, Sicherheit, kleinere Elektroarbeiten und Unterstützung durch regionale Fachbetriebe.",
  },
  {
    icon: "🚿",
    title: "Sanitär",
    text: "Sanitärreparaturen, Installationen, Armaturen, Leitungen, Badezimmerarbeiten, Verstopfungen und schnelle Hilfe bei Sanitärproblemen.",
  },
  {
    icon: "♻️",
    title: "Entsorgung",
    text: "Entrümpelung, Sperrgut, Keller räumen, Estrich räumen, Wohnungsräumung, Haushaltsauflösung und fachgerechte Entsorgung inklusive Transport.",
  },
  {
    icon: "🪟",
    title: "Fensterreinigung",
    text: "Fensterreinigung, Storenreinigung, Lamellenstoren, Glasfassaden, Wintergärten, Rahmen, Fensterläden und Glasflächen für Privat und Gewerbe.",
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

  return (
    <main className="home-page premium-home">
      <section className="premium-hero">
        <div className="container premium-hero-grid">
          <div className="premium-hero-copy">
            <span className="eyebrow">Premium Offertenplattform Schweiz</span>

            <h1>In 60 Sekunden zur passenden Offerte.</h1>

            <p>
              Auftrago ist die Schweizer Offertenplattform für Reinigung,
              Hauswartung, Umzug, Gartenpflege, Entsorgung, Fensterreinigung,
              Malerarbeiten, Sanitär, Elektriker und weitere regionale
              Dienstleistungen.
            </p>

            <p>
              Statt viele Firmen einzeln anzurufen, beschreibst du deinen
              Auftrag einmal. Deine Anfrage wird strukturiert erfasst und kann
              passenden Anbietern aus deiner Region zugänglich gemacht werden.
            </p>

            <p>
              Ob Wohnungsreinigung, Umzugsreinigung mit Abgabegarantie,
              Treppenhausreinigung, Gartenunterhalt, Räumung, Transport oder
              Fensterreinigung: Auftrago hilft dir, schneller passende Offerten
              von lokalen Dienstleistern zu erhalten.
            </p>

            <div className="actions">
              <a href="#anfrage" className="btn btn-primary">
                Kostenlose Offerte anfragen
              </a>

              <Link href="/anbieter" className="btn btn-secondary">
                Anbieter werden
              </Link>
            </div>
          </div>

          <div id="anfrage" className="premium-form-shell">
            <div className="form-badge">Beliebte Anfrage</div>
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
              deinen Auftrag einmal und erhältst passende Rückmeldungen von
              regionalen Dienstleistern.
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

            <h2>Für starke lokale Dienstleister.</h2>

            <p>
              Auftrago bündelt Kundenanfragen aus Bereichen, in denen Menschen
              schnell eine zuverlässige Firma benötigen. Dazu gehören Reinigung,
              Umzugsreinigung, Hauswartung, Gartenpflege, Fensterreinigung,
              Entsorgung, Transport, Malerarbeiten, Sanitär und Elektroarbeiten.
            </p>

            <p>
              Für Kunden bedeutet das: weniger Aufwand und bessere Übersicht.
              Für Anbieter bedeutet das: mehr relevante Leads, regionale
              Sichtbarkeit und gezielte Auftragschancen statt Streuverlust.
            </p>
          </div>

          <div className="premium-service-grid">
            {services.map((service) => (
              <article className="premium-service-card" key={service.title}>
                <div className="premium-service-icon">{service.icon}</div>
                <h3>{service.title}</h3>
                <p>{service.text}</p>
              </article>
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
            Sichtbarkeit kaufen möchten, sondern konkrete Kundenanfragen
            erhalten wollen. Anbieter können passende Leads prüfen, Credits
            aufladen und interessante Kontakte gezielt freischalten.
          </p>

          <p>
            Besonders für Reinigungsfirmen, Hauswartungen, Gartenbauer,
            Umzugsfirmen, Entsorgungsbetriebe, Fensterreiniger, Maler,
            Sanitärbetriebe und Elektriker bietet Auftrago eine direkte
            Möglichkeit, neue Aufträge in der eigenen Region zu gewinnen.
          </p>

          <p>
            Jede Anfrage enthält wichtige Informationen wie Region, Kategorie,
            Beschreibung und Preis in Credits. So können Anbieter schnell
            entscheiden, ob ein Lead zum eigenen Betrieb passt.
          </p>

          <div className="actions">
            <Link href="/anbieter" className="btn btn-primary">
              Anbieter werden
            </Link>

            <Link href="/preise" className="btn btn-secondary">
              Preise ansehen
            </Link>
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

            <p>
              Für Kunden ist das einfacher. Für Anbieter ist es effizienter.
              Genau daraus entsteht ein moderner Marktplatz für Schweizer
              Dienstleistungen.
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

          <h2>Auftrago hilft bei häufig gesuchten Dienstleistungen.</h2>

          <p>
            Viele Kunden suchen täglich nach Begriffen wie Reinigungsfirma
            Zürich, Reinigungsfirma Aargau, Umzugsreinigung Zürich,
            Umzugsreinigung Aargau, Hauswartung Zürich, Hauswartung Aargau,
            Gartenpflege Zürich, Gartenunterhalt Aargau, Fensterreinigung
            Zürich, Fensterreinigung Aargau, Entsorgung Zürich, Räumung Aargau,
            Transport Zürich oder Malerarbeiten in der Nähe.
          </p>

          <p>
            Genau für solche Anfragen wurde Auftrago aufgebaut. Die Plattform
            soll Kunden schneller zu passenden Offerten führen und Anbietern
            helfen, relevante regionale Aufträge zu erhalten.
          </p>
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