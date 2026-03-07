import Link from "next/link";

const locations = [
  { label: "Zürich", href: "/standorte/zuerich" },
  { label: "Aargau", href: "/standorte/aargau" },
  { label: "Basel", href: "/standorte/basel" },
  { label: "Bern", href: "/standorte/bern" },
  { label: "Luzern", href: "/standorte/luzern" },
  { label: "Zug", href: "/standorte/zug" },
  { label: "Winterthur", href: "/standorte/winterthur" },
  { label: "Aarau", href: "/standorte/aarau" },
  { label: "Baden", href: "/standorte/baden" },
  { label: "Schweiz", href: "/standorte" },
];

export default function CampaignsSection() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 pb-10 sm:px-6 md:pb-14 lg:px-8">
      <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-4 shadow-[0_0_80px_rgba(59,130,246,0.08)] backdrop-blur-sm sm:rounded-[32px] sm:p-6 md:rounded-[40px] md:p-8">
        <div className="rounded-[26px] border border-white/10 bg-white/[0.03] px-4 py-4 sm:px-5 sm:py-5 md:rounded-full md:px-8 md:py-6">
          <div className="mb-3 h-3 w-3 rounded-full bg-sky-300 sm:h-3.5 sm:w-3.5" />
          <p className="max-w-4xl text-[11px] font-medium uppercase leading-relaxed tracking-[0.18em] text-white/70 sm:text-xs sm:tracking-[0.22em] md:text-sm md:tracking-[0.28em]">
            Premium Vermittlung für Reinigung, Umzug, Transport & Services
          </p>
        </div>

        <div className="mt-8 sm:mt-10">
          <h2 className="text-3xl font-semibold leading-tight text-white sm:text-4xl md:text-5xl">
            Kampagnen.
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/60 sm:text-base">
            Lokale Anfragen, regionale Sichtbarkeit und moderne Kampagnen für
            Dienstleistungen in der Schweiz.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap gap-3 sm:mt-10 sm:gap-4">
          {locations.map((location) => (
            <Link
              key={location.label}
              href={location.href}
              className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-white/10 bg-white/[0.05] px-5 py-3 text-base font-medium text-white transition duration-200 hover:bg-white/[0.10] hover:border-white/20 sm:min-h-[52px] sm:px-6 sm:text-lg"
            >
              {location.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}