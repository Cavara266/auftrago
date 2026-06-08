import Link from "next/link";
import { Metadata } from "next";
import { getProvider, providers } from "@/lib/provider-seo-data";

type Props = {
  params: {
    slug: string;
  };
};

export async function generateStaticParams() {
  return providers.map((provider) => ({
    slug: provider.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const provider = getProvider(params.slug);

  if (!provider) {
    return {
      title: "Anbieter nicht gefunden | Auftrago",
    };
  }

  return {
    title: `${provider.name} | Anbieter auf Auftrago`,
    description: provider.description,
    alternates: {
      canonical: `https://www.auftrago.ch/anbieter/${provider.slug}`,
    },
    openGraph: {
      title: provider.name,
      description: provider.description,
      url: `https://www.auftrago.ch/anbieter/${provider.slug}`,
      siteName: "Auftrago",
      type: "website",
    },
  };
}

export default function AnbieterDetailPage({ params }: Props) {
  const provider = getProvider(params.slug);

  if (!provider) {
    return (
      <main className="seo-page">
        <section className="container page-section-space">
          <h1>Anbieter nicht gefunden</h1>
          <Link href="/anbieter" className="btn btn-primary">
            Zur Anbieterübersicht
          </Link>
        </section>
      </main>
    );
  }

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: provider.name,
    description: provider.description,
    telephone: provider.phone,
    url: `https://www.auftrago.ch/anbieter/${provider.slug}`,
    areaServed: provider.region,
    address: {
      "@type": "PostalAddress",
      addressCountry: "CH",
      addressRegion: provider.region,
    },
  };

  return (
    <main className="seo-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessSchema),
        }}
      />

      <section className="seo-new-hero">
        <div className="container seo-new-hero-grid">
          <div>
            <span className="seo-pill">Geprüfter Anbieter</span>

            <h1>{provider.name}</h1>

            <p>{provider.description}</p>

            <div className="seo-hero-actions">
              <Link href="/offerte-anfragen" className="btn btn-primary">
                Offerte anfragen
              </Link>

              <Link href="/anbieter" className="btn btn-secondary">
                Alle Anbieter ansehen
              </Link>
            </div>
          </div>

          <aside className="seo-request-card">
            <span>Kontakt</span>
            <h2>{provider.region}</h2>
            <p>{provider.phone}</p>
          </aside>
        </div>
      </section>

      <section className="seo-new-section">
        <div className="container seo-new-grid">
          <article className="seo-main-content">
            <h2>Dienstleistungen</h2>

            <div className="seo-service-grid">
              {provider.services.map((service) => (
                <div key={service}>
                  <span>✓</span>
                  <strong>{service}</strong>
                </div>
              ))}
            </div>

            <h2>Über {provider.name}</h2>

            <p>
              {provider.name} unterstützt Kunden in der Region {provider.region}
              bei verschiedenen Dienstleistungen rund um Reinigung, Hauswartung
              und Unterhalt. Über Auftrago können Kunden passende Anfragen
              erstellen und Anbieter einfacher vergleichen.
            </p>
          </article>

          <aside className="seo-sidebar">
            <div className="seo-sidebar-card">
              <span>Anfrage starten</span>
              <h3>Passende Offerte erhalten</h3>
              <p>
                Beschreibe deinen Auftrag und erhalte Rückmeldungen von
                regionalen Anbietern.
              </p>
              <Link href="/offerte-anfragen" className="btn btn-primary">
                Anfrage senden
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}