import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import HomeLeadForm from "@/components/home-lead-form";
import { regions as regionData } from "@/lib/region-data";
import { citiesSeo } from "@/lib/city-data";
import { services as seoServices, formatText } from "@/lib/seo-data";
import TrustReviewsSection from "@/components/trust-reviews-section";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title:
    "Auftrago – Offertenplattform Schweiz für Reinigung, Hauswartung, Umzug & Gartenpflege",
  description:
    "Kostenlose Offerten für Reinigung, Hauswartung, Umzug, Gartenpflege, Entsorgung, Fensterreinigung, Sanitär, Elektriker und regionale Dienstleistungen in der Schweiz vergleichen.",
  alternates: {
    canonical: "https://www.auftrago.ch",
  },
  openGraph: {
    title: "Auftrago – Offertenplattform Schweiz",
    description:
      "Finde regionale Anbieter für Reinigung, Hauswartung, Umzug, Gartenpflege, Entsorgung und weitere Dienstleistungen in der Schweiz.",
    url: "https://www.auftrago.ch",
    siteName: "Auftrago",
    type: "website",
  },
};

const mainServices = [
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

const priorityLinks = [
  ["Hauswartfirma Uster", "/hauswartung-uster"],
  ["Hauswartservice Uster", "/hauswartung-uster"],
  ["Hauswartarbeiten Uster", "/hauswartung-uster"],
  ["Reinigung Uster", "/reinigung-uster"],
  ["Endreinigung Bülach", "/end-reinigung-buelach"],
  ["Büroreinigung Bülach", "/bueroreinigung-buelach"],
  ["Umzug Lenzburg", "/umzug-lenzburg"],
  ["Fensterreinigung Solothurn", "/fensterreinigung-solothurn"],
  ["Winterdienst Aargau", "/winterdienst-aargau"],
  ["Maler Dübendorf", "/maler-duebendorf"],
  ["Elektriker Bern", "/elektriker-bern"],
  ["Umzug Baden", "/umzug-baden"],
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
  {
    question: "Für welche Regionen ist Auftrago geeignet?",
    answer:
      "Auftrago eignet sich für Zürich, Aargau, Basel, Bern, Luzern, Zug, St. Gallen, Solothurn, Schaffhausen und weitere Regionen in der Schweiz.",
  },
  {
    question: "Kann ich mehrere Anbieter vergleichen?",
    answer:
      "Ja. Auftrago ist darauf ausgelegt, dass du regionale Anbieter und Offerten einfacher vergleichen kannst.",
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

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Auftrago",
    url: "https://www.auftrago.ch",
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Auftrago",
    url: "https://www.auftrago.ch",
    description:
      "Schweizer Offertenplattform für Reinigung, Hauswartung, Umzug, Gartenpflege, Entsorgung und regionale Dienstleistungen.",
  };

  return (
    <main className="home-page premium-home">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
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
              einmal. Passende Anbieter aus deiner Region können deine Anfrage
              prüfen und sich bei dir melden.
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

      <TrustReviewsSection />

      <section className="premium-section">
  <div className="container">
    <div className="live-activity-card">
      <div className="live-activity-head">
        <span className="eyebrow">Live Aktivität</span>
        <h2>Aktuelle Anfragen auf Auftrago</h2>
      </div>

      <div className="live-activity-grid">
        <div className="live-request-card">
          <span>🔥</span>
          <strong>Umzugsreinigung</strong>
          <p>Zürich · vor 3 Minuten</p>
        </div>

        <div className="live-request-card">
          <span>🔥</span>
          <strong>Fensterreinigung</strong>
          <p>Baden · vor 7 Minuten</p>
        </div>

        <div className="live-request-card">
          <span>🔥</span>
          <strong>Hauswartung</strong>
          <p>Aarau · vor 12 Minuten</p>
        </div>

        <div className="live-request-card">
          <span>🔥</span>
          <strong>Gartenpflege</strong>
          <p>Lenzburg · vor 18 Minuten</p>
        </div>

        <div className="live-request-card">
          <span>🔥</span>
          <strong>Wohnungsreinigung</strong>
          <p>Winterthur · vor 24 Minuten</p>
        </div>

        <div className="live-request-card">
          <span>🔥</span>
          <strong>Entsorgung</strong>
          <p>Zürich · vor 31 Minuten</p>
        </div>
      </div>
    </div>
  </div>
</section>

      <section className="premium-section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">So funktioniert es</span>
            <h2>In 4 Schritten zur passenden Offerte</h2>
          </div>

          <div className="how-grid">
            <div className="how-card">
              <strong>1</strong>
              <h3>Auftrag beschreiben</h3>
              <p>Beschreibe kurz dein Projekt und die gewünschte Dienstleistung.</p>
            </div>

            <div className="how-card">
              <strong>2</strong>
              <h3>Anfrage senden</h3>
              <p>Deine Anfrage ist kostenlos und unverbindlich.</p>
            </div>

            <div className="how-card">
              <strong>3</strong>
              <h3>Offerten erhalten</h3>
              <p>Passende regionale Anbieter können sich bei dir melden.</p>
            </div>

            <div className="how-card">
              <strong>4</strong>
              <h3>Vergleichen</h3>
              <p>Vergleiche Preis, Qualität, Service und Verfügbarkeit.</p>
            </div>
          </div>
        </div>
      </section>

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
              Offerten. Auftrago vereinfacht diesen Prozess.
            </p>

            <p>
              Besonders bei Umzugsreinigung, Wohnungsreinigung,
              Treppenhausreinigung, Hauswartung, Gartenpflege, Fensterreinigung,
              Transport, Räumung oder Entsorgung ist es wichtig, dass Anbieter
              von Anfang an die richtigen Informationen erhalten.
            </p>

            <p>
              Auftrago sorgt für klare Angaben, bessere Vergleichbarkeit, weniger
              Rückfragen und schnellere Entscheidungen. Dadurch können Kunden
              schneller passende regionale Firmen finden und Anbieter erhalten
              relevantere Anfragen aus ihrer Umgebung.
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
              Von Reinigung über Hauswartung bis Umzug: Auftrago verbindet
              Kunden mit passenden regionalen Anbietern.
            </p>
          </div>

          <div className="premium-service-grid">
            {mainServices.map((service) => (
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
        <div className="container premium-provider-card">
          <span className="eyebrow">SEO Fokus</span>
          <h2>Häufig gesuchte Dienstleistungen</h2>
          <p>
            Diese Seiten helfen Google, Auftrago als Plattform für regionale
            Dienstleistungen in der Schweiz besser einzuordnen.
          </p>

          <div className="seo-link-grid">
            {seoServices.slice(0, 20).map((service) => (
              <Link key={service} href={`/leistungen/${service}`}>
                {formatText(service)}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="premium-section">
        <div className="container premium-provider-card">
          <span className="eyebrow">Regionen</span>
          <h2>Regionale Anbieter in der Schweiz finden</h2>
          <p>
            Wähle deine Region und finde passende Anbieter für Reinigung,
            Hauswartung, Umzug, Gartenpflege, Fensterreinigung, Entsorgung und
            weitere Dienstleistungen.
          </p>

          <div className="seo-link-grid">
            {regionData.map((region) => (
              <Link key={region.slug} href={`/region/${region.slug}`}>
                Anbieter in {region.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="premium-section">
        <div className="container premium-provider-card">
          <span className="eyebrow">Städte</span>
          <h2>Anbieter in deiner Stadt finden</h2>
          <p>
            Lokale Suchanfragen bringen oft die besten Kunden. Deshalb verlinkt
            Auftrago wichtige Stadtseiten direkt von der Startseite.
          </p>

          <div className="seo-link-grid">
            {citiesSeo.map((city) => (
              <Link key={city.slug} href={`/stadt/${city.slug}`}>
                Anbieter in {city.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="premium-section">
        <div className="container premium-provider-card">
          <span className="eyebrow">Priorität</span>
          <h2>Starke Seiten für aktuelle Suchanfragen</h2>
          <p>
            Diese Suchbegriffe zeigen bereits Interesse in Google. Deshalb
            werden sie besonders stark intern verlinkt.
          </p>

          <div className="seo-link-grid">
            {priorityLinks.map(([label, href]) => (
              <Link key={href + label} href={href}>
                {label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="premium-section">
        <div className="container premium-provider-card">
          <span className="eyebrow">Beliebte Offerten</span>

          <h2>Direkt zu häufig gesuchten Kombinationen.</h2>

          <p>
            Viele Kunden suchen täglich nach Reinigungsfirma Zürich,
            Umzugsreinigung Zürich, Hauswartung Uster, Umzug Lenzburg,
            Büroreinigung Bülach oder Fensterreinigung Solothurn.
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
            Auftrago ist für Dienstleister gemacht, die nicht nur Sichtbarkeit
            möchten, sondern konkrete Kundenanfragen erhalten wollen.
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
            weniger als einer Minute.
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