import type { Metadata } from "next";
import Link from "next/link";

import Hero from "@/components/home/Hero";
import InsuranceSpotlight from "@/components/home/InsuranceSpotlight";
import LiveLeadsSection from "@/components/live-leads-section";
import TrustReviewsSection from "@/components/trust-reviews-section";
import WhyAuftragoSection from "@/components/why-auftrago-section";
import { citiesSeo } from "@/lib/city-data";
import { prisma } from "@/lib/prisma";
import { regions as regionData } from "@/lib/region-data";
import { formatText, services as seoServices } from "@/lib/seo-data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title:
    "Auftrago – Schweizer Plattform für Dienstleistungen & Versicherungen",
  description:
    "Kostenlose Offerten für Reinigung, Hauswartung, Umzug, Gartenpflege, Handwerk und Versicherungen in der Schweiz vergleichen.",
  alternates: {
    canonical: "https://www.auftrago.ch",
  },
  openGraph: {
    title: "Auftrago – Offertenplattform Schweiz",
    description:
      "Finde regionale Anbieter für Reinigung, Hauswartung, Umzug, Handwerk und Versicherungsberatung in der Schweiz.",
    url: "https://www.auftrago.ch",
    siteName: "Auftrago",
    type: "website",
  },
};

const platformStats = [
  {
    value: "Schweizweit",
    label: "Regionale Anbieter",
    icon: "🇨🇭",
  },
  {
    value: "Kostenlos",
    label: "Anfrage erstellen",
    icon: "⚡",
  },
  {
    value: "Unverbindlich",
    label: "Offerten vergleichen",
    icon: "✓",
  },
  {
    value: "Direkt",
    label: "Kontakt zu Firmen",
    icon: "🤝",
  },
];

const featuredCategories = [
  {
    icon: "🧹",
    title: "Reinigung",
    text: "Wohnung, Büro, Fenster und Spezialreinigung.",
    href: "/leistungen/reinigung",
    accent: "from-sky-400/15 via-cyan-300/5 to-transparent",
  },
  {
    icon: "🚚",
    title: "Umzug & Transport",
    text: "Privatumzug, Firmenumzug, Transport und Räumung.",
    href: "/leistungen/umzug",
    accent: "from-violet-400/15 via-fuchsia-300/5 to-transparent",
  },
  {
    icon: "🛠️",
    title: "Handwerk",
    text: "Elektriker, Sanitär, Maler, Schreiner und Montage.",
    href: "/leistungen/elektriker",
    accent: "from-orange-400/15 via-amber-300/5 to-transparent",
  },
  {
    icon: "🌿",
    title: "Garten & Umgebung",
    text: "Gartenpflege, Heckenschnitt und saisonaler Unterhalt.",
    href: "/leistungen/gartenpflege",
    accent: "from-emerald-400/15 via-teal-300/5 to-transparent",
  },
  {
    icon: "🛡️",
    title: "Versicherungen",
    text: "Krankenkasse, Auto, Vorsorge und Firmenlösungen.",
    href: "/auftrag-erstellen?kategorie=Versicherungen",
    accent: "from-indigo-400/15 via-blue-300/5 to-transparent",
  },
  {
    icon: "💻",
    title: "IT & Digital",
    text: "Webseiten, SEO, Software und technischer Support.",
    href: "/leistungen/it-support",
    accent: "from-cyan-400/15 via-violet-300/5 to-transparent",
  },
];

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
    title: "Entsorgung & Räumung",
    text: "Entrümpelung, Sperrgut, Keller und Estrich räumen, Haushaltsauflösung und fachgerechte Entsorgung.",
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
  {
    icon: "🚿",
    title: "Sanitär",
    text: "Armaturen, Leitungen, Bad, Küche, Reparaturen, Installationen und dringende Sanitärarbeiten.",
    href: "/sanitaer-zuerich",
  },
  {
    icon: "🪵",
    title: "Schreiner",
    text: "Möbelmontage, Reparaturen, Türen, Schränke, Küchen und individuelle Holzarbeiten.",
    href: "/dienstleistungen",
  },
  {
    icon: "🧱",
    title: "Gipser & Trockenbau",
    text: "Wände, Decken, Verputz, Trockenbau, Renovationen und kleinere Ausbesserungsarbeiten.",
    href: "/dienstleistungen",
  },
  {
    icon: "🪚",
    title: "Bodenleger",
    text: "Parkett, Laminat, Vinyl, Teppich, Sockelleisten, Reparaturen und Bodenaufbereitung.",
    href: "/dienstleistungen",
  },
  {
    icon: "🏗️",
    title: "Renovation & Umbau",
    text: "Koordination von Renovationen, Umbauten, Rückbau, Montage und verschiedenen Bauarbeiten.",
    href: "/dienstleistungen",
  },
  {
    icon: "🔥",
    title: "Heizung & Klima",
    text: "Heizungsservice, Wartung, Reparaturen, Thermostate, Klimageräte und technische Kontrollen.",
    href: "/dienstleistungen",
  },
  {
    icon: "🔐",
    title: "Schlüssel & Sicherheit",
    text: "Schlosswechsel, Türöffnung, Zutrittssysteme, Sicherheitstechnik und kleinere Reparaturen.",
    href: "/dienstleistungen",
  },
  {
    icon: "🛠️",
    title: "Montage & Reparaturen",
    text: "Möbelaufbau, Wandmontage, kleinere Reparaturen, Installationen und allgemeine Handwerksarbeiten.",
    href: "/dienstleistungen",
  },
  {
    icon: "🛡️",
    title: "Versicherungen",
    text: "Krankenkasse, Auto, Hausrat, Haftpflicht, Rechtsschutz, Vorsorge und Firmenversicherungen vergleichen.",
    href: "/auftrag-erstellen?kategorie=Versicherungen",
  },
  {
    icon: "✨",
    title: "Weitere Dienstleistungen",
    text: "Du findest deine gewünschte Leistung nicht? Stelle deine Anfrage trotzdem – wir suchen passende Anbieter.",
    href: "/dienstleistungen",
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
      "Du kannst Offerten für Reinigung, Umzugsreinigung, Hauswartung, Gartenpflege, Umzug, Transport, Entsorgung, Fensterreinigung, Malerarbeiten, Elektriker, Sanitär, Versicherungen und weitere Dienstleistungen anfragen.",
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

function formatLeadTime(createdAt: Date) {
  const minutes = Math.max(
    1,
    Math.floor((Date.now() - createdAt.getTime()) / 60000)
  );

  if (minutes < 60) {
    return `vor ${minutes} Min.`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `vor ${hours} Std.`;
  }

  const days = Math.floor(hours / 24);
  return `vor ${days} Tag${days === 1 ? "" : "en"}`;
}

function formatLeadPrice(price: number | null) {
  if (!price || price <= 0) {
    return "Budget offen";
  }

  return `CHF ${new Intl.NumberFormat("de-CH", {
    maximumFractionDigits: 0,
  }).format(price)}`;
}

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
    potentialAction: {
      "@type": "SearchAction",
      target:
        "https://www.auftrago.ch/offerte-anfragen?query={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Auftrago",
    url: "https://www.auftrago.ch",
    description:
      "Schweizer Vermittlungsplattform für Dienstleistungen, Handwerk und Versicherungsanfragen.",
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

      <Hero />

      <section className="border-y border-white/10 bg-[#030816]">
        <div className="mx-auto grid max-w-[1450px] grid-cols-2 gap-px bg-white/10 sm:grid-cols-4">
          {platformStats.map((stat) => (
            <div
              key={stat.label}
              className="group bg-[#030816] px-5 py-7 text-center transition hover:bg-white/[0.035] sm:px-7"
            >
              <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-xl transition group-hover:-translate-y-1 group-hover:border-sky-300/20 group-hover:bg-sky-300/10">
                {stat.icon}
              </span>
              <strong className="mt-4 block text-xl font-black tracking-[-0.03em] text-white sm:text-2xl">
                {stat.value}
              </strong>
              <span className="mt-1 block text-xs font-semibold text-slate-500 sm:text-sm">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="premium-section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Beliebte Kategorien</span>
            <h2>Was möchtest du erledigen?</h2>
            <p>
              Wähle eine Kategorie und starte deine kostenlose Anfrage in wenigen
              Schritten.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {featuredCategories.map((category) => (
              <Link
                key={category.title}
                href={category.href}
                className={[
                  "group relative overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-br p-6 transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:shadow-[0_24px_70px_rgba(0,0,0,0.32)]",
                  category.accent,
                ].join(" ")}
              >
                <div className="flex items-start justify-between gap-5">
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-[#050b17]/75 text-2xl shadow-[0_16px_40px_rgba(0,0,0,0.18)] transition group-hover:scale-105">
                    {category.icon}
                  </span>
                  <span className="text-xl text-sky-300 transition group-hover:translate-x-1">
                    →
                  </span>
                </div>

                <h3 className="mt-7 text-xl font-black tracking-[-0.03em] text-white">
                  {category.title}
                </h3>
                <p className="mt-2 max-w-sm text-sm leading-6 text-slate-400">
                  {category.text}
                </p>

                <span className="mt-6 inline-flex text-sm font-black text-white">
                  Kategorie entdecken
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <InsuranceSpotlight />
      <TrustReviewsSection />
      <WhyAuftragoSection />

      <section className="premium-section">
        <div className="container">
          <div className="live-activity-card">
            <div className="live-activity-head">
              <div>
                <span className="eyebrow">Live Aktivität</span>
                <h2>Aktuelle Anfragen auf Auftrago</h2>
              </div>

              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-400/10 px-4 py-2 text-xs font-black text-emerald-300">
                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                Live
              </span>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {latestLeads.length > 0 ? (
                latestLeads.map((lead) => (
                  <article
                    key={lead.id}
                    className="group rounded-[24px] border border-white/10 bg-white/[0.035] p-5 transition duration-300 hover:-translate-y-1 hover:border-sky-300/20 hover:bg-white/[0.055]"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <span className="rounded-full border border-orange-300/20 bg-orange-400/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-orange-300">
                        Neu
                      </span>
                      <span className="text-xs font-semibold text-slate-500">
                        {formatLeadTime(lead.createdAt)}
                      </span>
                    </div>

                    <h3 className="mt-5 text-lg font-black tracking-[-0.02em] text-white">
                      {lead.title || lead.category}
                    </h3>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="rounded-full bg-white/[0.06] px-3 py-1.5 text-xs font-bold text-slate-300">
                        📍 {lead.region || "Schweiz"}
                      </span>
                      <span className="rounded-full bg-white/[0.06] px-3 py-1.5 text-xs font-bold text-slate-300">
                        {lead.category}
                      </span>
                    </div>

                    <div className="mt-6 flex items-end justify-between gap-4">
                      <div>
                        <span className="block text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">
                          Auftragswert
                        </span>
                        <strong className="mt-1 block text-base font-black text-white">
                          {formatLeadPrice(lead.price)}
                        </strong>
                      </div>

                      <Link
                        href="/anbieter"
                        className="text-sm font-black text-sky-300 transition group-hover:translate-x-1"
                      >
                        Ansehen →
                      </Link>
                    </div>
                  </article>
                ))
              ) : (
                <div className="col-span-full rounded-[24px] border border-white/10 bg-white/[0.035] p-8 text-center">
                  <strong className="text-lg font-black text-white">
                    Neue Anfragen werden gleich angezeigt.
                  </strong>
                  <p className="mt-2 text-sm text-slate-400">
                    Starte jetzt deine kostenlose Anfrage.
                  </p>
                </div>
              )}
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

      <LiveLeadsSection />

      <section className="premium-section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Leistungen</span>
            <h2>Eine Plattform für praktisch jede Dienstleistung.</h2>
            <p>
              Von Reinigung und Hauswartung über Handwerk, Umzug und Entsorgung
              bis zu Versicherungen, Renovation, Sanitär und Technik.
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

          <div className="actions center" style={{ marginTop: "34px" }}>
            <Link href="/dienstleistungen" className="btn btn-primary">
              Alle Dienstleistungen entdecken
            </Link>
          </div>
        </div>
      </section>

      <section className="premium-section">
        <div className="container premium-provider-card">
          <span className="eyebrow">Häufig gesucht</span>
          <h2>Beliebte Dienstleistungen</h2>
          <p>
            Entdecke häufig gesuchte Leistungen und finde passende regionale
            Anbieter.
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
            Hauswartung, Umzug, Gartenpflege und weitere Dienstleistungen.
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
            Finde lokale Dienstleister und Offerten direkt in deiner Umgebung.
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
            Direkte Einstiege zu häufig gesuchten Dienstleistungen und Regionen.
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
            Beliebte Dienstleistungen und Regionen für eine schnelle Anfrage.
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
            Auftrago ist für Dienstleister gemacht, die konkrete
            Kundenanfragen in ihrer Region erhalten möchten.
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
          <h2>Nur eine Anfrage. Mehrere passende Offerten.</h2>
          <p>
            Kostenlos, unverbindlich und regional. Starte deine Anfrage in
            weniger als einer Minute.
          </p>

          <div className="actions center">
            <Link href="/offerte-anfragen" className="btn btn-primary">
              Kostenlose Offerte anfragen
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