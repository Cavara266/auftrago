import "./globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import SiteHeader from "../components/site-header";

export const metadata: Metadata = {
  title: "Auftrago – Offertenplattform Schweiz",
  description:
    "Kostenlose Offerten für Reinigung, Hauswartung, Umzug, Gartenpflege und weitere Dienstleistungen in der Schweiz.",
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
      </body>
    </html>
  );
}