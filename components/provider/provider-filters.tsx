import Link from "next/link";

type ProviderFiltersProps = {
  query: string;
  selectedService: string;
  selectedRegion: string;
  serviceOptions: string[];
  regionOptions: string[];
};

export default function ProviderFilters({
  query,
  selectedService,
  selectedRegion,
  serviceOptions,
  regionOptions,
}: ProviderFiltersProps) {
  const hasFilters = Boolean(
    query || selectedService || selectedRegion
  );

  return (
    <form
      action="/anbieter-finden"
      method="GET"
      className="rounded-[30px] border border-white/10 bg-[#0a1325]/90 p-5 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-7"
    >
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.5fr)_minmax(210px,1fr)_minmax(210px,1fr)_auto]">
        <label className="block">
          <span className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-white/35">
            Suche
          </span>

          <input
            type="search"
            name="q"
            defaultValue={query}
            placeholder="Firma, Ort oder Dienstleistung"
            className="min-h-[56px] w-full rounded-2xl border border-white/10 bg-white/[0.055] px-4 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-sky-300/40 focus:ring-4 focus:ring-sky-400/10"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-white/35">
            Dienstleistung
          </span>

          <select
            name="service"
            defaultValue={selectedService}
            className="min-h-[56px] w-full rounded-2xl border border-white/10 bg-[#101a2d] px-4 text-sm text-white outline-none transition focus:border-sky-300/40 focus:ring-4 focus:ring-sky-400/10"
          >
            <option value="">Alle Dienstleistungen</option>

            {serviceOptions.map((service) => (
              <option key={service} value={service}>
                {service}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-white/35">
            Region
          </span>

          <select
            name="region"
            defaultValue={selectedRegion}
            className="min-h-[56px] w-full rounded-2xl border border-white/10 bg-[#101a2d] px-4 text-sm text-white outline-none transition focus:border-sky-300/40 focus:ring-4 focus:ring-sky-400/10"
          >
            <option value="">Alle Regionen</option>

            {regionOptions.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
        </label>

        <button
          type="submit"
          className="min-h-[56px] self-end rounded-2xl bg-gradient-to-r from-sky-400 to-indigo-500 px-7 text-sm font-black text-white transition hover:brightness-110"
        >
          Anbieter suchen
        </button>
      </div>

      {hasFilters ? (
        <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-white/10 pt-5">
          <span className="text-xs font-bold uppercase tracking-[0.12em] text-white/30">
            Aktive Filter
          </span>

          {query ? (
            <span className="rounded-full bg-white/[0.07] px-3 py-1.5 text-xs text-white/70">
              Suche: {query}
            </span>
          ) : null}

          {selectedService ? (
            <span className="rounded-full bg-sky-400/10 px-3 py-1.5 text-xs text-sky-100">
              {selectedService}
            </span>
          ) : null}

          {selectedRegion ? (
            <span className="rounded-full bg-emerald-400/10 px-3 py-1.5 text-xs text-emerald-100">
              📍 {selectedRegion}
            </span>
          ) : null}

          <Link
            href="/anbieter-finden"
            className="ml-auto text-xs font-bold text-red-200 transition hover:text-red-100"
          >
            Filter löschen
          </Link>
        </div>
      ) : null}
    </form>
  );
}