import Link from "next/link";
import { redirect } from "next/navigation";

import { searchAdzunaJobs } from "@/lib/adzuna/client";
import { prisma } from "@/lib/prisma";
import { requireCandidate } from "@/lib/candidate-auth";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{
    q?: string;
    location?: string;
    page?: string;
    error?: string;
  }>;
};
function formatSalary(min: number | null, max: number | null) {
  if (!min && !max) {
    return null;
  }

  const formatter = new Intl.NumberFormat("de-CH", {
    style: "currency",
    currency: "CHF",
    maximumFractionDigits: 0,
  });

  if (min && max) {
    return `${formatter.format(min)} – ${formatter.format(max)}`;
  }

  if (min) {
    return `ab ${formatter.format(min)}`;
  }

  if (max) {
    return `bis ${formatter.format(max)}`;
  }

  return null;
}

function getErrorMessage(error?: string) {
  switch (error) {
    case "subscription-required":
      return "Für das Öffnen von Stellen ist ein aktives Talent-Abo erforderlich.";
    case "missing-job":
      return "Die Stelle konnte nicht eindeutig erkannt werden.";
    case "invalid-url":
      return "Der externe Stellenlink ist ungültig.";
    case "server":
      return "Die Stelle konnte gerade nicht freigeschaltet werden. Bitte versuche es erneut.";
    default:
      return null;
  }
}

export default async function CandidateJobsPage({ searchParams }: PageProps) {
  let user;

  try {
    user = await requireCandidate();
  } catch {
    redirect("/arbeit-suchen/login");
  }

  const params = (await searchParams) ?? {};

  const q = params.q?.trim() ?? "";
  const location = params.location?.trim() ?? "";
  const pageRaw = Number.parseInt(params.page ?? "1", 10);
  const currentPage = Number.isFinite(pageRaw) && pageRaw > 0 ? pageRaw : 1;

  const account = await prisma.candidateAccount.findUnique({
    where: {
      id: user.id,
    },
    select: {
      subscriptionExempt: true,
      subscriptionStatus: true,
      jobUnlocks: {
        select: {
          externalJobId: true,
          redirectUrl: true,
        },
      },
    },
  });

  if (!account) {
    redirect("/arbeit-suchen/login");
  }

  const talentDevBypass =
    process.env.NODE_ENV !== "production" &&
    process.env.TALENT_DEV_BYPASS === "true";

  const subscriptionStatus =
    account.subscriptionStatus?.toUpperCase() || "INACTIVE";

  const hasActiveSubscription =
    talentDevBypass ||
    account.subscriptionExempt ||
    ["ACTIVE", "TRIALING"].includes(subscriptionStatus);

  const unlockedJobs = new Map(
    account.jobUnlocks.map((unlock) => [
      unlock.externalJobId,
      unlock.redirectUrl,
    ]),
  );

  let jobs: Awaited<ReturnType<typeof searchAdzunaJobs>>["jobs"] = [];
  let count = 0;
  let loadError = "";

  try {
    const result = await searchAdzunaJobs({
      page: currentPage,
      query: q,
      location,
      resultsPerPage: 20,
    });

    jobs = result.jobs;
    count = result.count;
  } catch (error) {
    console.error("Candidate jobs failed:", error);
    loadError = "Die Stellenangebote konnten momentan nicht geladen werden.";
  }

  const totalPages = Math.max(1, Math.ceil(count / 20));
  const errorMessage = getErrorMessage(params.error);

  const createPageHref = (page: number) => {
    const query = new URLSearchParams();

    if (q) query.set("q", q);
    if (location) query.set("location", location);

    query.set("page", String(page));

    return `/arbeit-suchen/stellen?${query.toString()}`;
  };

  return (
    <main className="min-h-screen bg-[#07101f] px-4 py-8 text-white sm:px-6 sm:py-10">
      <div className="mx-auto max-w-[1500px]">
        <section className="relative overflow-hidden rounded-[30px] border border-white/[0.08] bg-[#0a1427] p-5 sm:p-8 lg:p-10">
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at 8% 0%, rgba(45,145,255,.14), transparent 30%), radial-gradient(circle at 94% 85%, rgba(180,61,255,.14), transparent 30%)",
            }}
          />

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/15 bg-emerald-400/[0.06] px-3 py-2 text-[11px] font-black uppercase tracking-[0.16em] text-emerald-300">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Auftrago Jobs
              </div>

              <h1 className="mt-5 text-3xl font-black tracking-[-0.045em] sm:text-4xl lg:text-5xl">
                Stellen finden
              </h1>

              <p className="mt-4 max-w-[760px] text-sm font-medium leading-7 text-slate-400 sm:text-base">
                Finde aktuelle Stellenangebote aus der ganzen Schweiz. Eine
                Stelle wird nur einmal freigeschaltet und bleibt danach für dein
                Konto geöffnet.
              </p>
            </div>

            <div className="rounded-2xl border border-emerald-400/15 bg-emerald-400/[0.06] px-5 py-4">
              <span className="block text-[10px] font-black uppercase tracking-[0.14em] text-emerald-300">
                Talent Mitgliedschaft
              </span>

              <strong className="mt-1 block text-xl font-black text-white">
                {hasActiveSubscription ? "Abo aktiv" : "Kein aktives Abo"}
              </strong>
            </div>
          </div>
        </section>

        {errorMessage && (
          <div className="mt-5 rounded-2xl border border-red-400/20 bg-red-400/[0.06] p-4 text-sm font-bold text-red-300">
            {errorMessage}
          </div>
        )}

        {loadError && (
          <div className="mt-5 rounded-2xl border border-red-400/20 bg-red-400/[0.06] p-4 text-sm font-bold text-red-300">
            {loadError}
          </div>
        )}

        <section className="mt-6 rounded-[24px] border border-white/[0.08] bg-[#0a1427] p-4 sm:p-5">
          <form
            method="GET"
            className="grid gap-3 md:grid-cols-[1fr_300px_160px]"
          >
            <input
              type="search"
              name="q"
              defaultValue={q}
              placeholder="Beruf, Tätigkeit oder Stichwort suchen ..."
              className="min-h-[52px] rounded-2xl border border-white/[0.08] bg-white/[0.04] px-4 text-sm font-semibold text-white outline-none placeholder:text-slate-600 focus:border-sky-400/40"
            />

            <input
              type="search"
              name="location"
              defaultValue={location}
              placeholder="Ort oder Kanton"
              className="min-h-[52px] rounded-2xl border border-white/[0.08] bg-white/[0.04] px-4 text-sm font-semibold text-white outline-none placeholder:text-slate-600 focus:border-sky-400/40"
            />

            <button
              type="submit"
              className="min-h-[52px] rounded-2xl bg-gradient-to-r from-sky-400 via-blue-500 to-violet-500 px-5 text-sm font-black text-white transition hover:-translate-y-0.5"
            >
              Suchen
            </button>
          </form>
        </section>

        <section className="mt-6 grid gap-4">
          {jobs.length === 0 && !loadError ? (
            <div className="rounded-[24px] border border-white/[0.08] bg-[#0a1427] p-8 text-center">
              <h2 className="text-xl font-black">
                Keine passenden Stellen gefunden
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Passe deine Suche an und versuche es erneut.
              </p>
            </div>
          ) : (
            jobs.map((job) => {
              const unlockedUrl = unlockedJobs.get(job.id);
              const salary = formatSalary(job.salaryMin, job.salaryMax);

              return (
                <article
                  key={job.id}
                  className="rounded-[24px] border border-white/[0.08] bg-[#0a1427] p-5 transition hover:border-sky-400/20 sm:p-6"
                >
                  <div className="grid gap-5 lg:grid-cols-[1fr_250px] lg:items-center">
                    <div>
                      <div className="flex flex-wrap gap-2">
                        <span className="rounded-full border border-sky-400/15 bg-sky-400/[0.06] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-sky-300">
                          {job.category}
                        </span>

                        {unlockedUrl && (
                          <span className="rounded-full border border-emerald-400/15 bg-emerald-400/[0.06] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-emerald-300">
                            Freigeschaltet
                          </span>
                        )}
                      </div>

                      <h2 className="mt-4 text-xl font-black tracking-[-0.025em] text-white sm:text-2xl">
                        {job.title}
                      </h2>

                      <p className="mt-2 text-sm font-semibold text-slate-400">
                        {job.company}
                      </p>

                      <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-xs font-semibold text-slate-500">
                        <span>📍 {job.location}</span>

                        {salary && (
                          <span className="text-emerald-300">💰 {salary}</span>
                        )}
                      </div>

                      {job.description && (
                        <p className="mt-4 line-clamp-3 max-w-[950px] text-sm leading-6 text-slate-500">
                          {job.description.replace(/<[^>]*>/g, " ")}
                        </p>
                      )}
                    </div>

                    <div>
                      {unlockedUrl ? (
                        <a
                          href={unlockedUrl}
                          target="_blank"
                          rel="noopener noreferrer sponsored"
                          className="inline-flex min-h-[52px] w-full items-center justify-center rounded-2xl bg-emerald-400 px-5 text-sm font-black text-[#07101f] transition hover:-translate-y-0.5"
                        >
                          Stelle öffnen ↗
                        </a>
                      ) : hasActiveSubscription ? (
                        <form
                          method="POST"
                          action="/api/candidates/jobs/unlock"
                        >
                          <input
                            type="hidden"
                            name="externalJobId"
                            value={job.id}
                          />

                          <input
                            type="hidden"
                            name="redirectUrl"
                            value={job.redirectUrl}
                          />

                          <button
                            type="submit"
                            className="inline-flex min-h-[52px] w-full items-center justify-center rounded-2xl bg-gradient-to-r from-sky-400 via-blue-500 to-violet-500 px-5 text-sm font-black text-white transition hover:-translate-y-0.5"
                          >
                            Stelle öffnen ↗
                          </button>

                          <p className="mt-2 text-center text-[11px] font-semibold text-emerald-300/80">
                            In deinem Talent-Abo enthalten
                          </p>
                        </form>
                      ) : (
                        <div>
                          <Link
                            href="/arbeit-suchen/abo"
                            className="inline-flex min-h-[52px] w-full items-center justify-center rounded-2xl bg-gradient-to-r from-sky-400 via-blue-500 to-violet-500 px-5 text-sm font-black text-white transition hover:-translate-y-0.5"
                          >
                            Talent-Abo abschliessen
                          </Link>

                          <p className="mt-2 text-center text-[11px] font-semibold text-slate-600">
                            CHF 99.– pro Monat
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </section>

        {totalPages > 1 && (
          <nav className="mt-7 flex items-center justify-between gap-3 rounded-[24px] border border-white/[0.08] bg-[#0a1427] p-4">
            {currentPage > 1 ? (
              <Link
                href={createPageHref(currentPage - 1)}
                className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.035] px-5 text-sm font-bold text-white"
              >
                ← Zurück
              </Link>
            ) : (
              <span className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-white/[0.05] px-5 text-sm font-bold text-slate-700">
                ← Zurück
              </span>
            )}

            <span className="text-sm font-semibold text-slate-500">
              Seite <strong className="text-white">{currentPage}</strong> /{" "}
              {totalPages.toLocaleString("de-CH")}
            </span>

            {currentPage < totalPages ? (
              <Link
                href={createPageHref(currentPage + 1)}
                className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.035] px-5 text-sm font-bold text-white"
              >
                Weiter →
              </Link>
            ) : (
              <span className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-white/[0.05] px-5 text-sm font-bold text-slate-700">
                Weiter →
              </span>
            )}
          </nav>
        )}
      </div>
    </main>
  );
}
