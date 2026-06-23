import "./globals.css";
import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import Script from "next/script";
import MobileBottomNav from "@/components/mobile-bottom-nav";

import SiteHeader from "@/components/site-header";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.auftrago.ch"),
  title: {
    default:
      "Auftrago – Offertenplattform Schweiz für Reinigung, Hauswartung & Umzug",
    template: "%s | Auftrago",
  },
  description:
    "Kostenlose Offerten für Reinigung, Hauswartung, Umzug, Gartenpflege, Entsorgung, Fensterreinigung, Transport, Sanitär, Elektriker und weitere regionale Dienstleistungen in der Schweiz vergleichen.",
  applicationName: "Auftrago",
  authors: [{ name: "Auftrago" }],
  creator: "Auftrago",
  publisher: "Auftrago",
  category: "Dienstleistungen",
  keywords: [
    "Offerten Schweiz",
    "Reinigung Schweiz",
    "Hauswartung Schweiz",
    "Umzug Schweiz",
    "Gartenpflege Schweiz",
    "Entsorgung Schweiz",
    "Fensterreinigung Schweiz",
    "regionale Anbieter",
    "Dienstleister vergleichen",
  ],
  alternates: {
    canonical: "https://www.auftrago.ch",
  },
  openGraph: {
    title: "Auftrago – Offertenplattform Schweiz",
    description:
      "Finde regionale Anbieter für Reinigung, Hauswartung, Umzug, Gartenpflege, Entsorgung und weitere Dienstleistungen.",
    url: "https://www.auftrago.ch",
    siteName: "Auftrago",
    locale: "de_CH",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Auftrago – Offertenplattform Schweiz",
    description:
      "Kostenlose Offerten für regionale Dienstleistungen in der Schweiz vergleichen.",
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
      "Schweizer Offertenplattform für Reinigung, Hauswartung, Umzug, Gartenpflege, Entsorgung und regionale Dienstleistungen.",
    areaServed: {
      "@type": "Country",
      name: "Schweiz",
    },
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Auftrago",
    url: "https://www.auftrago.ch",
    inLanguage: "de-CH",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://www.auftrago.ch/?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Regionale Offerten vergleichen",
    provider: {
      "@type": "Organization",
      name: "Auftrago",
      url: "https://www.auftrago.ch",
    },
    areaServed: {
      "@type": "Country",
      name: "Schweiz",
    },
    serviceType: [
      "Reinigung",
      "Hauswartung",
      "Umzug",
      "Gartenpflege",
      "Entsorgung",
      "Fensterreinigung",
      "Transport",
      "Malerarbeiten",
      "Sanitär",
      "Elektriker",
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

        <MobileBottomNav />

        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-7YJE35KZCX"
          strategy="afterInteractive"
        />

        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-7YJE35KZCX');
          `}
        </Script>
      </body>
    </html>
  );
}