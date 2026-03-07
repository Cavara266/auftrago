import Link from "next/link";
import {
  ArrowRight,
  Briefcase,
  Building2,
  Flower2,
  Hammer,
  Home,
  Package,
  Recycle,
  Snowflake,
  Sparkles,
  Truck,
  Warehouse,
} from "lucide-react";

const services = [
  {
    title: "Hauswartung",
    text: "Zuverlässige Betreuung von Liegenschaften – sauber, gepflegt und professionell organisiert.",
    tags: ["Kontrollgänge", "Unterhalt", "Kleinreparaturen"],
    href: "/anfrage?category=Hauswartung",
    icon: Building2,
  },
  {
    title: "Reinigung",
    text: "Gründliche Reinigung für Wohnungen, Büros und Liegenschaften – flexibel, professionell und zuverlässig.",
    tags: ["Unterhalt", "Büro & Privat", "Sauberer Eindruck"],
    href: "/anfrage?category=Reinigung",
    icon: Sparkles,
  },
  {
    title: "Wohnungsreinigung",
    text: "Perfekt für Mietwechsel, Endreinigung oder intensive Reinigung von Wohnungen und Häusern.",
    tags: ["Gründlich", "Abnahme möglich", "Zuverlässig"],
    href: "/anfrage?category=Wohnungsreinigung",
    icon: Home,
  },
  {
    title: "Fensterreinigung",
    text: "Streifenfreier Glanz für Wohnungen, Häuser und Gewerbe – inklusive Rahmen und Details.",
    tags: ["Streifenfrei", "Rahmen & Details", "Privat & Gewerbe"],
    href: "/anfrage?category=Fensterreinigung",
    icon: Briefcase,
  },
  {
    title: "Baureinigung",
    text: "Sauberer Abschluss nach Bau oder Renovation – bereit für Übergabe, Verkauf oder Einzug.",
    tags: ["Grob & Fein", "Vor Übergabe", "Planbar"],
    href: "/anfrage?category=Baureinigung",
    icon: Hammer,
  },
  {
    title: "Winterdienst",
    text: "Räumen, Streuen und Sicherheit im Winter für Liegenschaften, Firmen und Wohnanlagen.",
    tags: ["Räumen", "Streuen", "Planbar"],
    href: "/anfrage?category=Winterdienst",
    icon: Snowflake,
  },
  {
    title: "Gartenpflege",
    text: "Gartenpflege und Unterhalt für einen gepflegten Eindruck rund ums Haus – saisonal oder ganzjährig.",
    tags: ["Schnitt", "Unterhalt", "Ganzjährig"],
    href: "/anfrage?category=Gartenpflege",
    icon: Flower2,
  },
  {
    title: "Umzug",
    text: "Stressfrei umziehen mit Planung, Transport und sorgfältigem Umgang mit deinem Inventar.",
    tags: ["Transport", "Planung", "Effizient"],
    href: "/anfrage?category=Umzug",
    icon: Truck,
  },
  {
    title: "Entsorgung",
    text: "Fachgerechte Entsorgung von Sperrgut, Möbeln, Altgeräten und Abfällen – schnell und sauber.",
    tags: ["Sperrgut", "Altgeräte", "Sauber"],
    href: "/anfrage?category=Entsorgung",
    icon: Recycle,
  },
  {
    title: "Entrümpelung",
    text: "Wohnung, Keller oder Büro komplett räumen, abtransportieren und fachgerecht entsorgen.",
    tags: ["Wohnung", "Keller", "Diskret"],
    href: "/anfrage?category=Entruempelung",
    icon: Warehouse,
  },
  {
    title: "Transport",
    text: "Flexible Transporte für Möbel, Material, Einzelstücke oder kurzfristige Lieferungen in der Schweiz.",
    tags: ["Flexibel", "Schnell", "Regional"],
    href: "/anfrage?category=Transport",
    icon: Package,
  },
  {
    title: "Büroreinigung",
    text: "Saubere Arbeitsplätze, gepflegte Empfangsbereiche und zuverlässige Reinigung für Unternehmen.",
    tags: ["Regelmässig", "Sauber", "Professionell"],
    href: "/anfrage?category=Bueroreinigung",
    icon: Briefcase,
  },
];

export default function LeistungenPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#030816] text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-20%] top-[-10%] h-[260px] w-[260px] rounded-full bg-cyan-400/12 blur-3xl sm:left-[-10%] sm:h-[380px] sm:w-[380px]" />
        <div className="absolute right-[-20%] top-[10%] h-[280px] w-[280px] rounded-full bg-sky-400/10 blur-3xl sm:right-[-10%] sm:h-[420px] sm:w-[420px]" />
        <div className="absolute bottom-[-10%] left-[10%] h-[240px] w-[240px] rounded-full bg-blue-500/10 blur-3xl sm:left-[20%] sm:h-[340px] sm:w-[340px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(126,200,255,0.08),transparent_35%),linear-gradient(to_bottom,rgba(255,255,255,0.02),transparent)]" />
      </div>

      <section className="relative border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 pb-10 pt-6 sm:px-6 sm:pb-14 sm:pt-8 lg:px-8">
          <div className="inline-flex max-w-full items-start gap-3 rounded-[24px] border border-white/10 bg-white/5 px-4 py-3 text-left backdrop-blur sm:items-center sm:gap-2 sm:rounded-full sm:px-4 sm:py-2.5">
            <span className="mt-1 inline-block h-2.5 w-2.5 shrink-0 rounded-full bg-[#7EC8FF] sm:mt-0 sm:h-2 sm:w-2" />
            <span className="text-[11px] uppercase leading-relaxed tracking-[0.16em] text-white/60 sm:text-xs sm:tracking-[0.22em]">
              Reinigung, Hauswartung, Umzug, Transport und Services
            </span>
          </div>

          <div className="mt-6 max-w-4xl">
            <h1 className="text-3xl font-semibold leading-[1.02] sm:text-4xl md:text-5xl xl:text-6xl">
              Unsere{" "}
              <span className="bg-gradient-to-r from-white via-[#d7f0ff] to-[#7EC8FF] bg-clip-text text-transparent">
                Leistungen
              </span>
            </h1>

            <p className="mt-5 max-w-3xl text-base leading-7 text-white/68 sm:text-lg sm:leading-8">
              Wähle die passende Leistung und starte in Sekunden deine Anfrage.
              Modern, lokal und auf echte Offerten-Anfragen optimiert.
            </p>
          </div>
        </div>
      </section>

      <section className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="grid gap-4 sm:gap-5 lg:grid-cols-2 xl:grid-cols-3">
          {services.map((service) => {
            const Icon = service.icon;

            return (
              <Link
                key={service.title}
                href={service.href}
                className="group relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-[#7EC8FF]/20 hover:bg-white/[0.06] hover:shadow-[0_20px_80px_rgba(126,200,255,0.10)] sm:p-6"
              >
                <div className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100">
                  <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[#7EC8FF]/10 blur-2xl" />
                  <div className="absolute bottom-0 left-0 h-24 w-24 rounded-full bg-indigo-400/10 blur-2xl" />
                </div>

                <div className="relative">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-[#9fd8ff] transition duration-300 group-hover:border-[#7EC8FF]/20 group-hover:bg-[#7EC8FF]/10 group-hover:text-[#cdeeff]">
                      <Icon size={22} />
                    </div>

                    <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-white/45">
                      Service
                    </span>
                  </div>

                  <h2 className="mt-5 text-2xl font-semibold leading-tight text-white sm:text-[28px]">
                    {service.title}
                  </h2>

                  <p className="mt-3 text-sm leading-7 text-white/62 sm:text-base sm:leading-8">
                    {service.text}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {service.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/70"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="mt-6 inline-flex min-h-[48px] items-center gap-2 rounded-2xl bg-[#7EC8FF] px-5 py-3 text-sm font-semibold text-[#04101d] shadow-[0_12px_40px_rgba(126,200,255,0.18)] transition group-hover:bg-[#91d2ff]">
                    Anfrage starten
                    <ArrowRight
                      size={16}
                      className="transition duration-300 group-hover:translate-x-0.5"
                    />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 sm:pb-24 lg:px-8">
        <div className="rounded-[28px] border border-white/10 bg-[linear-gradient(135deg,rgba(126,200,255,0.18),rgba(255,255,255,0.04))] p-5 text-center sm:rounded-[34px] sm:p-8 md:p-12">
          <div className="text-xs uppercase tracking-[0.18em] text-white/45 sm:text-sm sm:tracking-[0.24em]">
            Jetzt starten
          </div>

          <h2 className="mt-4 text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl">
            Starte jetzt deine Anfrage in wenigen Sekunden
          </h2>

          <p className="mx-auto mt-5 max-w-3xl text-base leading-7 text-white/66 sm:text-lg sm:leading-8">
            Beschreibe kurz deinen Auftrag und finde passende Anbieter für
            Reinigung, Hauswartung, Umzug, Transport und weitere Services in
            deiner Region.
          </p>

          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:mt-8 sm:flex-row sm:flex-wrap sm:gap-4">
            <Link
              href="/anfrage"
              className="inline-flex min-h-[54px] w-full items-center justify-center rounded-2xl bg-[#7EC8FF] px-6 py-4 text-base font-semibold text-[#04101d] shadow-[0_20px_80px_rgba(126,200,255,0.28)] transition hover:bg-[#91d2ff] sm:w-auto sm:px-7"
            >
              Kostenlos Anfrage senden
            </Link>

            <Link
              href="/"
              className="inline-flex min-h-[54px] w-full items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-base font-semibold text-white/90 transition hover:bg-white/10 sm:w-auto sm:px-7"
            >
              Zur Startseite
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}