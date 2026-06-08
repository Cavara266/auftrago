import "./globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";

import SiteHeader from "@/components/site-header";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.auftrago.ch"),
  title: {
    default: "Auftrago – Offertenplattform Schweiz",
    template: "%s | Auftrago",
  },
  description:
    "Kostenlose Offerten für Reinigung, Hauswartung, Umzug, Gartenpflege, Entsorgung und weitere regionale Dienstleistungen in der Schweiz.",
  alternates: {
    canonical: "https://www.auftrago.ch",
  },
  openGraph: {
    title: "Auftrago – Offertenplattform Schweiz",
    description:
      "Finde regionale Anbieter für Reinigung, Hauswartung, Umzug, Gartenpflege und Entsorgung.",
    url: "https://www.auftrago.ch",
    siteName: "Auftrago",
    locale: "de_CH",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
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
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Auftrago",
    url: "https://www.auftrago.ch",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://www.auftrago.ch/?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
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

        <SiteHeader />
        {children}
        <Footer />
      </body>
    </html>
  );
}