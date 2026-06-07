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
    "Kostenlose Offerten für Reinigung, Hauswartung, Umzug, Gartenpflege, Entsorgung und weitere Dienstleistungen in der Schweiz.",

  alternates: {
    canonical: "https://www.auftrago.ch",
  },

  openGraph: {
    title: "Auftrago – Offertenplattform Schweiz",
    description:
      "Kostenlose Offerten für Reinigung, Hauswartung, Umzug, Gartenpflege, Entsorgung und weitere Dienstleistungen in der Schweiz.",
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
  return (
    <html lang="de">
      <body>
        <SiteHeader />
        {children}
        <Footer />
      </body>
    </html>
  );
}