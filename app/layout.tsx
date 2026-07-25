import "./globals.css";
import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import Script from "next/script";

import SiteHeader from "@/components/site-header";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.auftrago.ch"),

  title: {
    default:
      "Auftrago – Schweizer Plattform für Dienstleistungen, Handwerk & Versicherungen",
    template: "%s | Auftrago",
  },

  description:
    "Vergleiche kostenlos regionale Anbieter für Reinigung, Hauswartung, Umzug, Handwerk, Versicherungen, Immobilien, Finanzen und digitale Dienstleistungen in der Schweiz.",

  applicationName: "Auftrago",
  authors: [{ name: "Auftrago" }],
  creator: "Auftrago",
  publisher: "Auftrago",
  category: "Dienstleistungen",

  keywords: [
    "Offerten Schweiz",
    "Dienstleister Schweiz",
    "Anbieter vergleichen",
    "regionale Anbieter",
    "Reinigung Schweiz",
    "Umzugsreinigung Schweiz",
    "Hauswartung Schweiz",
    "Umzug Schweiz",
    "Gartenpflege Schweiz",
    "Fensterreinigung Schweiz",
    "Entsorgung Schweiz",
    "Elektriker Schweiz",
    "Sanitär Schweiz",
    "Maler Schweiz",
    "Handwerker Schweiz",
    "Versicherungen vergleichen",
    "Krankenkasse vergleichen",
    "Immobilienmakler Schweiz",
    "Treuhänder Schweiz",
    "SEO Agentur Schweiz",
  ],

  alternates: {
    canonical: "https://www.auftrago.ch",
  },

  openGraph: {
    title:
      "Auftrago – Schweizer Plattform für Dienstleistungen & Versicherungen",
    description:
      "Finde regionale Anbieter für Reinigung, Handwerk, Umzug, Versicherungen, Immobilien, Finanzen und digitale Dienstleistungen.",
    url: "https://www.auftrago.ch",
    siteName: "Auftrago",
    locale: "de_CH",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Auftrago – Schweizer Dienstleistungsplattform",
    description:
      "Kostenlos regionale Anbieter und Dienstleistungen in der Schweiz vergleichen.",
  },

  robots: {
    index: true,
    follow: true,

    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#020617",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Auftrago",
    url: "https://www.auftrago.ch",
    logo: "https://www.auftrago.ch/favicon.ico",
    description:
      "Schweizer Vermittlungs- und Offertenplattform für regionale Dienstleistungen, Handwerker, Versicherungen, Immobilien, Finanzen und digitale Lösungen.",
    areaServed: {
      "@type": "Country",
      name: "Schweiz",
    },
    knowsAbout: [
      "Reinigung",
      "Hauswartung",
      "Umzug",
      "Transport",
      "Entsorgung",
      "Gartenpflege",
      "Handwerker",
      "Versicherungen",
      "Immobilien",
      "Finanzen",
      "IT-Dienstleistungen",
    ],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Auftrago",
    url: "https://www.auftrago.ch",
    inLanguage: "de-CH",
    publisher: {
      "@type": "Organization",
      name: "Auftrago",
      url: "https://www.auftrago.ch",
    },
    potentialAction: {
      "@type": "SearchAction",
      target:
        "https://www.auftrago.ch/leistungen?suche={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Regionale Anbieter und Offerten vergleichen",
    description:
      "Auftrago vermittelt regionale Anbieter für private und geschäftliche Dienstleistungen in der Schweiz.",
    url: "https://www.auftrago.ch",
    provider: {
      "@type": "Organization",
      name: "Auftrago",
      url: "https://www.auftrago.ch",
    },
    areaServed: {
      "@type": "Country",
      name: "Schweiz",
    },
    audience: [
      {
        "@type": "Audience",
        audienceType: "Privatkunden",
      },
      {
        "@type": "Audience",
        audienceType: "Unternehmen",
      },
      {
        "@type": "Audience",
        audienceType: "Immobilienverwaltungen",
      },
    ],
    serviceType: [
      "Reinigung",
      "Umzugsreinigung",
      "Fensterreinigung",
      "Büroreinigung",
      "Hauswartung",
      "Gartenpflege",
      "Winterdienst",
      "Umzug",
      "Transport",
      "Entsorgung",
      "Räumung",
      "Malerarbeiten",
      "Elektriker",
      "Sanitär",
      "Schreiner",
      "Bodenleger",
      "Renovation",
      "Solaranlagen",
      "Wärmepumpen",
      "Versicherungen",
      "Krankenkassenberatung",
      "Autoversicherung",
      "Vorsorgeberatung",
      "Immobilienmakler",
      "Immobilienbewertung",
      "Hypothekenberatung",
      "Treuhand",
      "Steuerberatung",
      "Webdesign",
      "SEO",
      "IT-Support",
    ],
  };

  return (
    <html lang="de-CH">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(serviceSchema),
          }}
        />

        <SiteHeader />

        {children}

        <Footer />

        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-7YJE35KZCX"
          strategy="afterInteractive"
        />

        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];

            function gtag() {
              window.dataLayer.push(arguments);
            }

            gtag("js", new Date());
            gtag("config", "G-7YJE35KZCX");
          `}
        </Script>
      </body>
    </html>
  );
}