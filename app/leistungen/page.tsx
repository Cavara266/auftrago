import Link from "next/link";
import { services } from "@/lib/services";

export const metadata = {
  title: "Leistungen – Auftrago",
  description: "Alle Leistungen im Premium Offerten-Portal.",
};

export default function LeistungenPage() {
  return (
    <div className="premium-wrap">
      <div className="premium-card p-8 md:p-10">
        <h1 className="text-3xl md:text-5xl font-black tracking-tight">
          Unsere <span className="premium-gold">Leistungen</span>
        </h1>
        <p className="mt-4 opacity-80 max-w-2xl">
          Wähle eine Leistung und starte in Sekunden deine Anfrage.
        </p>

        <div className="mt-8 grid md:grid-cols-2 gap-4">
          {services.map((s) => (
            <Link
              key={s.slug}
              href={`/leistungen/${s.slug}`}
              className="premium-card p-6 hover:brightness-110 transition block"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-xl font-bold">{s.title}</div>
                  <div className="mt-2 opacity-75">{s.short}</div>
                </div>
                <div className="text-xs premium-gold font-semibold tracking-wider">DETAILS</div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {s.bullets.slice(0, 3).map((b) => (
                  <span
                    key={b}
                    className="text-sm rounded-full border border-white/10 bg-white/5 px-3 py-1"
                  >
                    {b}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-10 flex gap-3">
          <Link
            href="/anfrage"
            className="rounded-2xl px-6 py-4 font-semibold text-black"
            style={{ background: "linear-gradient(135deg, var(--gold2), var(--gold3))" }}
          >
            Gratis Anfrage starten →
          </Link>
          <Link href="/" className="rounded-2xl px-6 py-4 premium-card hover:brightness-110 transition">
            Zur Startseite
          </Link>
        </div>
      </div>
    </div>
  );
}