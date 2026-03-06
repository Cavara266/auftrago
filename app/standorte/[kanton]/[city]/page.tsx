import Link from "next/link";
import type { Metadata } from "next";
import { locations } from "@/lib/locations";

type PageProps = {
  params: { kanton: string; city: string };
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const loc = locations.find(
    (l) => l.kanton === params.kanton && l.city === params.city
  );

  const label = loc?.label ?? `${params.city}`;
  return {
    title: `Hauswartung in ${label} – Cavara Hauswartung`,
    description: `Hauswartung, Reinigung und Unterhalt in ${label}. Gratis Anfrage erstellen und Offerte erhalten.`,
  };
}

export default function StandortPage({ params }: PageProps) {
  const loc = locations.find(
    (l) => l.kanton === params.kanton && l.city === params.city
  );

  const label = loc?.label ?? params.city;

  if (!loc) {
    return <main className="p-10">Nicht gefunden</main>;
  }

  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-12">
      <p className="text-sm opacity-70">
        <Link href="/" className="underline">Start</Link> / Standorte / {label}
      </p>

      <h1 className="mt-4 text-4xl font-black">Hauswartung in {label}</h1>
      <p className="mt-4 text-lg opacity-80">
        Zuverlässiger Unterhalt für Liegenschaften in {label}. Schnell, sauber und planbar.
      </p>

      <div className="mt-10 rounded-2xl border p-6">
        <h2 className="text-xl font-bold">Gratis Anfrage</h2>
        <p className="mt-2 opacity-80">
          Beschreibe kurz dein Objekt – wir melden uns schnellstmöglich.
        </p>

        <Link
          href="/anfrage"
          className="mt-5 inline-block rounded-xl bg-black px-6 py-3 text-white font-semibold"
        >
          Anfrage starten
        </Link>
      </div>
    </main>
  );
}