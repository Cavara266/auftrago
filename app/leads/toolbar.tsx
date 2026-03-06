"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function cx(...a: Array<string | false | undefined>) {
  return a.filter(Boolean).join(" ");
}

export default function LeadsToolbar({
  q,
  service,
  location,
  sort,
  services,
  locations,
}: {
  q: string;
  service: string;
  location: string;
  sort: "new" | "old";
  services: string[];
  locations: string[];
}) {
  const router = useRouter();
  const sp = useSearchParams();

  const [sheetOpen, setSheetOpen] = useState(false);
  const [localQ, setLocalQ] = useState(q);

  const activeFiltersCount = useMemo(() => {
    let n = 0;
    if (service) n++;
    if (location) n++;
    if (sort && sort !== "new") n++;
    return n;
  }, [service, location, sort]);

  function setParam(key: string, val: string) {
    const params = new URLSearchParams(sp?.toString() ?? "");
    if (!val) params.delete(key);
    else params.set(key, val);
    router.push(`/leads?${params.toString()}`);
  }

  function applySearch() {
    setParam("q", localQ.trim());
  }

  function clearAll() {
    router.push("/leads");
    setSheetOpen(false);
  }

  return (
    <>
      {/* ✅ Sticky top bar (mobile first) */}
      <div className="sticky top-[60px] z-40 -mx-4 border-b border-white/10 bg-black/25 px-4 py-3 backdrop-blur md:top-[64px]">
        <div className="flex gap-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2 ring-1 ring-white/10">
              <span className="text-white/50">🔎</span>
              <input
                value={localQ}
                onChange={(e) => setLocalQ(e.target.value)}
                onKeyDown={(e) => (e.key === "Enter" ? applySearch() : null)}
                placeholder="Suchen: Reinigung, Zürich, ..."
                className="w-full bg-transparent text-sm outline-none placeholder:text-white/40"
              />
              <button
                onClick={applySearch}
                className="rounded-lg bg-white/10 px-3 py-1.5 text-xs hover:bg-white/15 transition"
              >
                Suchen
              </button>
            </div>
          </div>

          {/* Mobile Filter button */}
          <button
            onClick={() => setSheetOpen(true)}
            className="relative rounded-xl bg-white/5 px-4 py-2 text-sm ring-1 ring-white/10 hover:bg-white/10 transition md:hidden"
          >
            Filter
            {activeFiltersCount > 0 ? (
              <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-blue-600 text-[11px] font-semibold">
                {activeFiltersCount}
              </span>
            ) : null}
          </button>

          {/* Desktop inline controls */}
          <div className="hidden md:flex md:items-center md:gap-2">
            <select
              value={service}
              onChange={(e) => setParam("service", e.target.value)}
              className="rounded-xl bg-white/5 px-3 py-2 text-sm ring-1 ring-white/10 outline-none"
            >
              <option value="">Service (alle)</option>
              {services.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            <select
              value={location}
              onChange={(e) => setParam("location", e.target.value)}
              className="rounded-xl bg-white/5 px-3 py-2 text-sm ring-1 ring-white/10 outline-none"
            >
              <option value="">Ort (alle)</option>
              {locations.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>

            <select
              value={sort}
              onChange={(e) => setParam("sort", e.target.value)}
              className="rounded-xl bg-white/5 px-3 py-2 text-sm ring-1 ring-white/10 outline-none"
            >
              <option value="new">Neueste</option>
              <option value="old">Älteste</option>
            </select>

            <button
              onClick={clearAll}
              className="rounded-xl bg-white/10 px-4 py-2 text-sm hover:bg-white/15 transition"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Active filter chips (mobile + desktop) */}
        {(service || location || (sort && sort !== "new")) && (
          <div className="mt-3 flex flex-wrap gap-2">
            {service && (
              <Chip label={service} onX={() => setParam("service", "")} />
            )}
            {location && (
              <Chip label={location} onX={() => setParam("location", "")} />
            )}
            {sort !== "new" && (
              <Chip label="Älteste" onX={() => setParam("sort", "new")} />
            )}
          </div>
        )}
      </div>

      {/* ✅ Bottom sheet (mobile filters) */}
      {sheetOpen && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setSheetOpen(false)}
          />

          <div className="absolute bottom-0 left-0 right-0 rounded-t-3xl bg-[#0A0F1C] p-5 ring-1 ring-white/10">
            <div className="mb-3 flex items-center justify-between">
              <div className="text-lg font-semibold">Filter</div>
              <button
                onClick={() => setSheetOpen(false)}
                className="rounded-lg bg-white/10 px-3 py-1.5 text-sm hover:bg-white/15 transition"
              >
                Schließen
              </button>
            </div>

            <div className="grid gap-3">
              <label className="text-sm text-white/70">Service</label>
              <select
                value={service}
                onChange={(e) => setParam("service", e.target.value)}
                className="rounded-xl bg-white/5 px-3 py-3 text-sm ring-1 ring-white/10 outline-none"
              >
                <option value="">Alle</option>
                {services.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>

              <label className="text-sm text-white/70">Ort</label>
              <select
                value={location}
                onChange={(e) => setParam("location", e.target.value)}
                className="rounded-xl bg-white/5 px-3 py-3 text-sm ring-1 ring-white/10 outline-none"
              >
                <option value="">Alle</option>
                {locations.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>

              <label className="text-sm text-white/70">Sortierung</label>
              <select
                value={sort}
                onChange={(e) => setParam("sort", e.target.value)}
                className="rounded-xl bg-white/5 px-3 py-3 text-sm ring-1 ring-white/10 outline-none"
              >
                <option value="new">Neueste</option>
                <option value="old">Älteste</option>
              </select>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <button
                onClick={clearAll}
                className="rounded-xl bg-white/10 px-4 py-3 text-sm hover:bg-white/15 transition"
              >
                Reset
              </button>
              <button
                onClick={() => setSheetOpen(false)}
                className="rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold hover:bg-blue-500 transition"
              >
                Anwenden
              </button>
            </div>

            <div className="mt-3 text-center text-xs text-white/50">
              Mobile optimiert: große Buttons + Bottom-Sheet Filters
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Chip({ label, onX }: { label: string; onX: () => void }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs text-white/80 ring-1 ring-white/10">
      {label}
      <button
        onClick={onX}
        className="grid h-4 w-4 place-items-center rounded-full bg-white/10 text-[10px] hover:bg-white/20 transition"
        aria-label="remove"
      >
        ×
      </button>
    </span>
  );
}