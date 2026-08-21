import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams?: Promise<{
    q?: string;
    canton?: string;
    category?: string;
  }>;
};

export default async function MitarbeiterPage({
  searchParams,
}: PageProps) {
  const user = await requireUser();

  if (!user) {
    return null;
  }

  const params = (await searchParams) ?? {};

  const q = (params.q ?? "").trim();
  const canton = (params.canton ?? "").trim();
  const category = (params.category ?? "").trim();

  const candidates = await prisma.candidateProfile.findMany({
    where: {
      status: "ACTIVE",
      isVisible: true,
      contactConsent: true,

      ...(canton
        ? {
            canton,
          }
        : {}),

      ...(category
        ? {
            category,
          }
        : {}),

      ...(q
        ? {
            OR: [
              {
                title: {
                  contains: q,
                  mode: "insensitive",
                },
              },
              {
                category: {
                  contains: q,
                  mode: "insensitive",
                },
              },
              {
                city: {
                  contains: q,
                  mode: "insensitive",
                },
              },
            ],
          }
        : {}),
    },

    orderBy: {
      createdAt: "desc",
    },

    take: 100,
  });

  const cantons = Array.from(
    new Set(
      candidates
        .map((candidate) => candidate.canton)
        .filter(Boolean)
    )
  ).sort();

  const categories = Array.from(
    new Set(
      candidates
        .map((candidate) => candidate.category)
        .filter(Boolean)
    )
  ).sort();

  return (
    <main className="min-h-screen bg-[#07101f] text-white">
      <div className="mx-auto w-full max-w-[1500px] px-4 py-8 sm:px-6 lg:px-8">
        <section className="rounded-[30px] border border-white/[0.08] bg-[#0a1427] p-6 sm:p-8 lg:p-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/15 bg-emerald-400/[0.06] px-3 py-2 text-[11px] font-black uppercase tracking-[0.16em] text-emerald-300">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Auftrago Talent Center
          </div>

          <h1 className="mt-5 text-3xl font-black tracking-[-0.045em] sm:text-4xl lg:text-5xl">
            Mitarbeiter finden
          </h1>

          <p className="mt-4 max-w-[760px] text-sm leading-7 text-slate-400 sm:text-base">
            Finde Personen, die aktiv eine neue Stelle suchen.
          </p>

          <div className="mt-6">
            <strong className="text-2xl font-black">
              {candidates.length}
            </strong>

            <span className="ml-2 text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
              Kandidaten
            </span>
          </div>
        </section>

        <section className="mt-6 rounded-[24px] border border-white/[0.08] bg-[#0a1427] p-4">
          <form className="grid gap-3 lg:grid-cols-[1fr_230px_260px_150px]">
            <input
              type="search"
              name="q"
              defaultValue={q}
              placeholder="Beruf, Tätigkeit oder Ort ..."
              className="min-h-[52px] rounded-2xl border border-white/[0.08] bg-white/[0.04] px-4 text-sm text-white outline-none"
            />

            <select
              name="canton"
              defaultValue={canton}
              className="min-h-[52px] rounded-2xl border border-white/[0.08] bg-[#0d172b] px-4 text-sm font-bold text-slate-300"
            >
              <option value="">
                Alle Kantone
              </option>

              {cantons.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <select
              name="category"
              defaultValue={category}
              className="min-h-[52px] rounded-2xl border border-white/[0.08] bg-[#0d172b] px-4 text-sm font-bold text-slate-300"
            >
              <option value="">
                Alle Bereiche
              </option>

              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <button
              type="submit"
              className="min-h-[52px] rounded-2xl bg-gradient-to-r from-sky-400 via-blue-500 to-violet-500 px-5 text-sm font-black"
            >
              Suchen
            </button>
          </form>
        </section>

        <section className="mt-6 grid gap-4">
          {candidates.length === 0 ? (
            <div className="rounded-[24px] border border-white/[0.08] bg-[#0a1427] p-8 text-center">
              <h2 className="text-lg font-black">
                Noch keine passenden Kandidaten
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Sobald sich Arbeitssuchende registrieren, erscheinen sie hier.
              </p>
            </div>
          ) : (
            candidates.map((candidate) => (
              <article
                key={candidate.id}
                className="rounded-[24px] border border-white/[0.08] bg-[#0a1427] p-5 sm:p-6"
              >
                <div className="grid gap-5 lg:grid-cols-[1fr_230px] lg:items-center">
                  <div>
                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-full border border-sky-400/15 bg-sky-400/[0.06] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-sky-300">
                        {candidate.category}
                      </span>

                      <span className="rounded-full border border-emerald-400/15 bg-emerald-400/[0.06] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-emerald-300">
                        ● verfügbar
                      </span>
                    </div>

                    <h2 className="mt-4 text-xl font-black sm:text-2xl">
                      {candidate.title}
                    </h2>

                    <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-400">
                      <span>
                        📍 {candidate.city || candidate.canton}
                      </span>

                      {candidate.employmentPercent && (
                        <span>
                          🕒 {candidate.employmentPercent}
                        </span>
                      )}

                      {candidate.experienceYears !== null && (
                        <span>
                          ⭐ {candidate.experienceYears} Jahre Erfahrung
                        </span>
                      )}

                      {candidate.drivingLicense && (
                        <span>
                          🚗 Führerschein
                        </span>
                      )}
                    </div>

                    {candidate.languages.length > 0 && (
                      <p className="mt-3 text-sm text-slate-500">
                        Sprachen: {candidate.languages.join(", ")}
                      </p>
                    )}

                    {candidate.description && (
                      <p className="mt-4 max-w-[900px] text-sm leading-6 text-slate-500">
                        {candidate.description}
                      </p>
                    )}
                  </div>

                  <aside className="rounded-2xl border border-violet-400/15 bg-violet-400/[0.05] p-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.14em] text-violet-300">
                      Kontakt
                    </p>

                    <p className="mt-2 font-black">
                      🔒 Anbieter-Abo erforderlich
                    </p>

                    <p className="mt-2 text-xs leading-5 text-slate-500">
                      Kontaktdaten bleiben geschützt.
                    </p>

                    <button
                      type="button"
                      className="mt-4 min-h-[46px] w-full rounded-xl bg-gradient-to-r from-sky-400 via-blue-500 to-violet-500 px-4 text-sm font-black"
                    >
                      Kontakt freischalten
                    </button>
                  </aside>
                </div>
              </article>
            ))
          )}
        </section>
      </div>
    </main>
  );
}
