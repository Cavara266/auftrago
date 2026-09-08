import type { Metadata } from "next";
import CompanySearch from "./company-search";

export const metadata: Metadata = {
  title: "Schweizer Firmen suchen | Handelsregister Firmensuche",
  description:
    "Schweizer Unternehmen nach Firmenname oder Ort suchen. Öffentliche Handelsregister-Kerndaten einfach über Auftrago finden.",
  alternates: {
    canonical: "https://www.auftrago.ch/firmen",
  },
};

export default function FirmenPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#020617] text-white">
      <section className="relative border-b border-white/5 px-5 py-20 sm:px-8 sm:py-28">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[-15%] top-[-20%] h-[600px] w-[600px] rounded-full bg-sky-500/10 blur-[140px]" />
          <div className="absolute right-[-10%] top-[10%] h-[550px] w-[550px] rounded-full bg-purple-600/15 blur-[150px]" />
        </div>

        <div className="relative mx-auto max-w-7xl">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-emerald-300">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_14px_rgba(52,211,153,0.8)]" />
              Schweizer Firmenverzeichnis
            </div>

            <h1 className="text-4xl font-black tracking-tight sm:text-6xl lg:text-7xl">
              Firmen finden.
              <br />
              <span className="bg-gradient-to-r from-sky-400 via-blue-400 to-purple-500 bg-clip-text text-transparent">
                Einfach Auftrago.
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-slate-400 sm:text-lg">
              Suche nach Schweizer Unternehmen und finde öffentlich verfügbare
              Handelsregister-Kerndaten schnell an einem Ort.
            </p>
          </div>

          <CompanySearch />

          <div className="mx-auto mt-16 grid max-w-5xl gap-4 md:grid-cols-3">
            {[
              ["01", "Schweizweit suchen", "Unternehmen aus der ganzen Schweiz finden."],
              ["02", "Öffentliche Registerdaten", "Firmenname, Rechtsform, Sitz und Adresse."],
              ["03", "Firma übernehmen", "Eigenes Firmenprofil mit Auftrago verbinden."],
            ].map(([number, title, text]) => (
              <div
                key={number}
                className="rounded-3xl border border-white/10 bg-white/[0.035] p-6"
              >
                <div className="text-xs font-black tracking-[0.25em] text-sky-400">
                  {number}
                </div>

                <h2 className="mt-5 text-lg font-bold">{title}</h2>

                <p className="mt-2 text-sm leading-6 text-slate-400">{text}</p>
              </div>
            ))}
          </div>

          <div className="mx-auto mt-12 max-w-5xl rounded-3xl border border-white/10 bg-white/[0.025] p-6 text-sm leading-7 text-slate-500">
            <strong className="text-slate-300">Hinweis:</strong> Auftrago ist
            kein offizielles Handelsregister. Die angezeigten Informationen
            stammen aus öffentlich verfügbaren Daten des Eidgenössischen Amtes
            für das Handelsregister. Für rechtsverbindliche Angaben sind die
            offiziellen Registerinformationen massgebend.
          </div>
        </div>
      </section>
    </main>
  );
}
