import type { Metadata } from "next";
import Link from "next/link";
import { services } from "@/lib/services";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const s = services.find((x) => x.slug === slug);

  if (!s) return { title: "Nicht gefunden" };

  return {
    title: `${s.title} – Auftrago`,
    description: s.short,
  };
}

export default async function ServiceDetail({ params }: PageProps) {
  const { slug } = await params;
  const s = services.find((x) => x.slug === slug);

  if (!s) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-20">
        <h1 className="text-4xl font-bold">Nicht gefunden</h1>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-20">
      <div className="grid lg:grid-cols-[1.2fr_.8fr] gap-16 items-start">

        {/* ================= LEFT SIDE ================= */}
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-sm text-white/70">
            <span className="h-2 w-2 rounded-full bg-cyan-400" />
            Leistung
          </div>

          <h1 className="mt-6 text-6xl font-black leading-[1.05] tracking-tight">
            {s.title}{" "}
            <span className="text-cyan-400">professionell.</span>
          </h1>

          <p className="mt-6 text-xl text-white/75 max-w-2xl">
            {s.short}
          </p>

          {/* Description */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-4">
              Beschreibung
            </h2>

            <div className="space-y-4 text-white/75 leading-relaxed whitespace-pre-line">
              {s.description}
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              {s.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-white/15 bg-white/5 px-4 py-1 text-sm text-white/70"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ================= RIGHT SIDE CTA ================= */}
        <div className="lg:sticky lg:top-24">
          <div className="glass rounded-3xl p-8">

            <h3 className="text-2xl font-bold">
              Schnell zur Offerte
            </h3>

            <p className="mt-3 text-white/70">
              Sag uns kurz, was du brauchst — wir melden uns zeitnah mit Rückfragen oder einer passenden Offerte.
            </p>

            {/* Contact */}
            <div className="mt-6 space-y-4">

              <div className="glass-soft rounded-2xl p-4">
                <div className="text-xs text-white/50">Telefon</div>
                <div className="mt-1 font-semibold">
                  +41 56 511 27 77
                </div>
              </div>

              <div className="glass-soft rounded-2xl p-4">
                <div className="text-xs text-white/50">WhatsApp</div>
                <div className="mt-1 font-semibold">
                  076 804 95 74
                </div>
              </div>

            </div>

            {/* Buttons */}
            <div className="mt-8 space-y-4">

              <Link
                href="/anfrage"
                className="block w-full rounded-2xl py-4 text-center font-semibold text-black"
                style={{
                  background:
                    "linear-gradient(90deg, #2aa8ff, #66d3ff)",
                  boxShadow:
                    "0 20px 50px rgba(42,168,255,0.35)",
                }}
              >
                Anfrage starten
              </Link>

              <Link
                href="/leistungen"
                className="block w-full rounded-2xl border border-white/15 bg-white/5 py-4 text-center font-semibold text-white"
              >
                Zurück zu Leistungen →
              </Link>

            </div>

            <p className="mt-6 text-xs text-white/55">
              Tipp: Schreib kurz Adresse + Objekt (MFH/EFH) + Zeitraum + gewünschte Leistung.
            </p>

          </div>
        </div>

      </div>
    </main>
  );
}