import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Auftrago",
  description: "Leads Portal",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body className="bg-app text-white">{children}</body>
    </html>
  );
}