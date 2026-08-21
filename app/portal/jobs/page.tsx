import Link from "next/link";
import { searchAdzunaJobs } from "@/lib/adzuna/client";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams?: Promise<{
    q?: string;
    location?: string;
    category?: string;
    page?: string;
  }>;
};

const categories = [
  {
    label: "Alle Bereiche",
    value: "",
  },
  {
    label: "Reinigung",
    value: "Reinigung",
  },
  {
    label: "Hauswartung / Facility",
    value: "Hauswartung Facility",
  },
  {
    label: "Umzug",
    value: "Umzug",
  },
  {
    label: "Transport",
    value: "Transport Logistik",
  },
  {
    label: "Gartenbau",
    value: "Garten Landschaft",
  },
  {
    label: "Sanitär",
    value: "Sanitär",
  },
  {
    label: "Heizung",
    value: "Heizung",
  },
  {
    label: "Elektro",
    value: "Elektriker Elektro",
  },
  {
    label: "Maler",
    value: "Maler",
  },
  {
    label: "Bau",
    value: "Bau Bauarbeiter",
  },
  {
    label: "Handwerk",
    value: "Handwerker",
  },
];

const locations = [
  "",
  "Zürich",
  "Aargau",
  "Bern",
  "Luzern",
  "Basel",
  "St. Gallen",
  "Thurgau",
  "Solothurn",
  "Zug",
  "Schwyz",
  "Graubünden",
  "Tessin",
  "Waadt",
  "Genf",
  "Freiburg",
  "Wallis",
  "Neuenburg",
  "Jura",
  "Glarus",
  "Schaffhausen",
  "Appenzell",
];

function formatDate(value: string) {
  if (!value) return "Neu";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Neu";
  }

  return new Intl.DateTimeFormat("de-CH", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function formatSalary(min: number | null, max: number | null) {
  if (!min && !max) return null;

  const formatter = new Intl.NumberFormat("de-CH", {
    maximumFractionDigits: 0,
  });

  if (min && max) {
    return `CHF ${formatter.format(min)} – ${formatter.format(max)}`;
  }

  if (min) {
    return `ab CHF ${formatter.format(min)}`;
  }

  if (max) {
    return `bis CHF ${formatter.format(max)}`;
  }

  return null;
}

function createPageHref({
  page,
  q,
  location,
  category,
}: {
  page: number;
  q: string;
  location: string;
  category: string;
}) {
  const params = new URLSearchParams();

  if (q) params.set("q", q);
  if (location) params.set("location", location);
  if (category) params.set("category", category);

  params.set("page", String(page));

  return `/portal/jobs?${params.toString()}`;
}

export default async function JobsPage({ searchParams }: PageProps) {
  const params = (await searchParams) ?? {};

  const q = (params.q ?? "").trim();
  const location = (params.location ?? "").trim();
  const category = (params.category ?? "").trim();

  const requestedPage = Number.parseInt(params.page ?? "1", 10);
  const currentPage =
    Number.isFinite(requestedPage) && requestedPage > 0
      ? requestedPage
      : 1;

  const combinedQuery = [q, category].filter(Boolean).join(" ");

  let jobs: Awaited<ReturnType<typeof searchAdzunaJobs>>["jobs"] = [];
  let count = 0;
  let errorMessage = "";

  try {
    const result = await searchAdzunaJobs({
      page: currentPage,
      query: combinedQuery,
      location,
      resultsPerPage: 20,
    });

    jobs = result.jobs;
    count = result.count;
  } catch (error) {
    console.error("Adzuna jobs failed:", error);
    errorMessage =
      "Die Live-Stellen konnten momentan nicht geladen werden.";
  }

  const totalPages = Math.max(1, Math.ceil(count / 20));

  return (
    <main className="min-h-screen bg-[#07101f] text-white">
      <div className="mx-auto w-full max-w-[1500px] px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <section className="relative overflow-hidden rounded-[30px] border border-white/[0.08] bg-[#0a1427] p-6 sm:p-8 lg:p-10">
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at 8% 0%, rgba(45,145,255,.14), transparent 30%), radial-gradient(circle at 94% 85%, rgba(180,61,255,.14), transparent 30%)",
            }}
          />

          <div className="relative flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/15 bg-emerald-400/[0.06] px-3 py-2 text-[11px] font-black uppercase tracking-[0.16em] text-emerald-300">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Live Job-Center
              </div>

              <h1 className="mt-5 text-3xl font-black tracking-[-0.045em] sm:text-4xl lg:text-5xl">
                Mitarbeiter finden
              </h1>

              <p className="mt-4 max-w-[760px] text-sm font-medium leading-7 text-slate-400 sm:text-base">
                Finde aktuelle Stellenangebote aus der ganzen Schweiz für
                Reinigung, Hauswartung, Umzug, Handwerk und weitere
                Dienstleistungen.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.035] px-5 py-3">
                <strong className="block text-xl font-black">
                  {count.toLocaleString("de-CH")}
                </strong>
                <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                  Stellen gefunden
                </span>
              </div>

              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.035] px-5 py-3">
                <strong className="block text-xl font-black">CH</strong>
                <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                  Schweizweit
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-[24px] border border-white/[0.08] bg-[#0a1427] p-4 sm:p-5">
          <form
            method="GET"
            className="grid gap-3 lg:grid-cols-[1fr_230px_260px_150px]"
          >
            <input
              type="search"
              name="q"
              defaultValue={q}
              placeholder="Beruf, Tätigkeit oder Stichwort suchen ..."
              className="min-h-[52px] rounded-2xl border border-white/[0.08] bg-white/[0.04] px-4 text-sm font-semibold text-white outline-none placeholder:text-slate-600 focus:border-sky-400/40"
            />

            <select
              name="location"
              defaultValue={location}
              className="min-h-[52px] rounded-2xl border border-white/[0.08] bg-[#0d172b] px-4 text-sm font-bold text-slate-300 outline-none"
            >
              <option value="">Ganze Schweiz</option>

              {locations
                .filter(Boolean)
                .map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
            </select>

            <select
              name="category"
              defaultValue={category}
              className="min-h-[52px] rounded-2xl border border-white/[0.08] bg-[#0d172b] px-4 text-sm font-bold text-slate-300 outline-none"
            >
              {categories.map((item) => (
                <option key={item.label} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>

            <button
              type="submit"
              className="min-h-[52px] rounded-2xl bg-gradient-to-r from-sky-400 via-blue-500 to-violet-500 px-5 text-sm font-black text-white transition hover:-translate-y-0.5"
            >
              Suchen
            </button>
          </form>
        </section>

        <div className="mt-7 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-white">
              Aktuelle Stellenangebote
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Sortiert nach Aktualität
            </p>
          </div>

          {(q || location || category) && (
            <Link
              href="/portal/jobs"
              className="rounded-full border border-white/[0.08] bg-white/[0.035] px-4 py-2 text-xs font-bold text-slate-400 hover:text-white"
            >
              Filter löschen
            </Link>
          )}
        </div>

        {errorMessage ? (
          <div className="mt-5 rounded-[24px] border border-red-400/20 bg-red-400/[0.05] p-6">
            <p className="font-bold text-red-300">{errorMessage}</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="mt-5 rounded-[24px] border border-white/[0.08] bg-[#0a1427] p-8 text-center">
            <p className="text-lg font-black">
              Keine passenden Stellen gefunden
            </p>

            <p className="mt-2 text-sm text-slate-500">
              Ändere den Suchbegriff oder entferne einen Filter.
            </p>
          </div>
        ) : (
          <section className="mt-5 grid gap-4">
            {jobs.map((job) => {
              const salary = formatSalary(job.salaryMin, job.salaryMax);

              return (
                <article
                  key={job.id}
                  className="group rounded-[24px] border border-white/[0.08] bg-[#0a1427] p-5 transition duration-200 hover:border-sky-400/20 sm:p-6"
                >
                  <div className="grid gap-5 lg:grid-cols-[1fr_210px] lg:items-center">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full border border-sky-400/15 bg-sky-400/[0.06] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-sky-300">
                          {job.category}
                        </span>

                        <span className="rounded-full border border-emerald-400/15 bg-emerald-400/[0.06] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-emerald-300">
                          ● Live
                        </span>
                      </div>

                      <h2 className="mt-4 text-xl font-black tracking-[-0.025em] text-white sm:text-2xl">
                        {job.title}
                      </h2>

                      <p className="mt-2 text-sm font-medium text-slate-500">
                        {job.company}
                      </p>

                      <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-xs font-semibold text-slate-500">
                        <span>📍 {job.location}</span>
                        <span>Publiziert: {formatDate(job.created)}</span>

                        {salary && (
                          <span className="text-emerald-300">
                            {salary}
                          </span>
                        )}
                      </div>

                      {job.description && (
                        <p className="mt-4 line-clamp-2 max-w-[950px] text-sm leading-6 text-slate-500">
                          {job.description.replace(/<[^>]*>/g, " ")}
                        </p>
                      )}
                    </div>

                    <div>
                      {job.redirectUrl ? (
                        <a
                          href={job.redirectUrl}
                          target="_blank"
                          rel="noopener noreferrer sponsored"
                          className="inline-flex min-h-[50px] w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sky-400 via-blue-500 to-violet-500 px-5 text-sm font-black text-white transition hover:-translate-y-0.5"
                        >
                          Stelle ansehen
                          <span>→</span>
                        </a>
                      ) : (
                        <span className="inline-flex min-h-[50px] w-full items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.03] px-5 text-sm font-bold text-slate-600">
                          Kein externer Link
                        </span>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </section>
        )}

        {totalPages > 1 && (
          <nav className="mt-7 flex flex-col items-center justify-between gap-3 rounded-[24px] border border-white/[0.08] bg-[#0a1427] p-4 sm:flex-row">
            <div className="text-sm font-semibold text-slate-500">
              Seite{" "}
              <span className="text-white">{currentPage}</span>
              {" / "}
              <span className="text-white">
                {totalPages.toLocaleString("de-CH")}
              </span>
            </div>

            <div className="flex gap-2">
              {currentPage > 1 ? (
                <Link
                  href={createPageHref({
                    page: currentPage - 1,
                    q,
                    location,
                    category,
                  })}
                  className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.035] px-5 text-sm font-bold text-slate-300 hover:text-white"
                >
                  ← Zurück
                </Link>
              ) : (
                <span className="inline-flex min-h-[44px] cursor-not-allowed items-center justify-center rounded-xl border border-white/[0.05] px-5 text-sm font-bold text-slate-700">
                  ← Zurück
                </span>
              )}

              {currentPage < totalPages && (
                <Link
                  href={createPageHref({
                    page: currentPage + 1,
                    q,
                    location,
                    category,
                  })}
                  className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-gradient-to-r from-sky-400 via-blue-500 to-violet-500 px-5 text-sm font-black text-white"
                >
                  Weiter →
                </Link>
              )}
            </div>
          </nav>
        )}

        <p className="mt-5 text-center text-[11px] text-slate-600">
          Stellenangebote werden über externe Jobdaten bereitgestellt.
        </p>
      </div>
    </main>
  );
}
