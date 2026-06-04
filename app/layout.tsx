import "./globals.css";
import type { Metadata } from "next";
import SiteHeader from "../components/site-header";

export const metadata: Metadata = {
  title: "Auftrago – Offertenplattform Schweiz",
  description:
    "Kostenlose Offerten für Reinigung, Hauswartung, Umzug, Gartenpflege und Entsorgung.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
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