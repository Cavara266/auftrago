import Link from "next/link";
import { Metadata } from "next";
import {
  cities,
  cityContent,
  formatText,
  generateSlugs,
  getSeoData,
  serviceContent,
  services,
} from "@/lib/seo-data";

type Props = {
  params: {
    slug: string;
  };
};

export async function generateStaticParams() {
  return generateSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { serviceLabel, cityLabel } = getSeoData(params.slug);

  return {
    title: `${serviceLabel} in ${cityLabel} | Kostenlose Offerten vergleichen`,
    description: `Finde regionale Anbieter für ${serviceLabel} in ${cityLabel}. Kostenlos Anfrage senden, Offerten erhalten und passende Firmen vergleichen.`,
    alternates: {
      canonical: `https://www.auftrago.ch/${params.slug}`,
    },
    openGraph: {
      title: `${serviceLabel} in ${cityLabel} vergleichen`,
      description: `Kostenlose Anfrage für ${serviceLabel} in ${cityLabel} senden und regionale Anbieter vergleichen.`,
      url: `https://www.auftrago.ch/${params.slug}`,
      siteName: "Auftrago",
      type: "website",
    },
  };
}

export default function SeoLandingPage({ params }: Props) {
  const { service, city, serviceLabel, cityLabel, keywords } = getSeoData(
    params.slug
  );

  const relatedCities = cities.filter((item) => item !== city).slice(0, 12);
  const relatedServices = services
    .filter((item) => item !== service)
    .slice(0, 12);

  const cityText =
    cityContent[city] ||
    `${cityLabel} ist ein wichtiger regionaler Standort. Über Auftrago findest du passende Anbieter aus der Umgebung und kannst kostenlos Offerten vergleichen.`;

  const serviceText =
    serviceContent[service] ||
    `${serviceLabel} ist eine gefragte Dienstleistung. Über Auftrago kannst du passende regionale Anbieter vergleichen.`;

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `${serviceLabel} in ${cityLabel}`,
    areaServed: cityLabel,
    provider: {
      "@type": "Organization",
      name: "Auftrago",
      url: "https://www.auftrago.ch",
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `Ist die Anfrage für ${serviceLabel} in ${cityLabel} kostenlos?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: "Ja. Die Anfrage über Auftrago ist kostenlos und unverbindlich.",
        },
      },
      {
        "@type": "Question",
        name: "Wie schnell erhalte ich Rückmeldungen?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Das hängt von Region, Auftrag und Verfügbarkeit der Anbieter ab. Eine genaue Beschreibung erhöht die Chance auf schnelle Rückmeldungen.",
        },
      },
      {
        "@type": "Question",
        name: "Kann ich mehrere Offerten vergleichen?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Ja. Auftrago hilft dir, mehrere regionale Anbieter und Offerten einfacher zu vergleichen.",
        },
      },
      {
        "@type": "Question",
        name: "Bin ich nach der Anfrage verpflichtet?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Nein. Die Anfrage ist unverbindlich. Du entscheidest selbst, ob du ein Angebot annehmen möchtest.",
        },
      },
    ],
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Startseite",
        item: "https://www.auftrago.ch",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: serviceLabel,
        item: `https://www.auftrago.ch/${service}-${city}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: cityLabel,
        item: `https://www.auftrago.ch/${params.slug}`,
      },
    ],
  };

  return (
    <main className="seo-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Rest deines JSX bleibt unverändert */}
    </main>
  );
}