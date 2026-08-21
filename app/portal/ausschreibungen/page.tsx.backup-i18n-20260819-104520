import Link from "next/link";
import { getSimapTenders } from "@/lib/simap/client";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { matchLeadToProvider } from "@/lib/provider-lead-matching";

export const dynamic = "force-dynamic";


export default async function AusschreibungenPage({
  searchParams,
}: {
  searchParams?: Promise<{
    page?: string;
    q?: string;
    canton?: string;
    category?: string;
  }>;
}) {
  const params = (await searchParams) ?? {};

  const tenders = await getSimapTenders();

  const user = await requireUser();

  const provider = user
    ? await prisma.provider.findUnique({
        where: {
          id: user.id,
        },
      })
    : null;

  const scoredTenders = tenders
    .map((tender) => {
      if (!provider) {
        return {
          tender,
          match: null,
          matchScore: 0,
        };
      }

      const match = matchLeadToProvider(
        {
          ...provider,

          // Für die Ausschreibungs-Sortierung wollen wir auch dann
          // einen echten Score berechnen, wenn der Anbieter alle Leads erhält.
          receiveAllLeadEmails: false,
        },
        {
          category: tender.category,
          region: tender.canton,
          city: tender.location || null,
          postalCode: null,
        }
      );

      return {
        tender,
        match,
        matchScore: match.score,
      };
    })
    .sort((a, b) => b.matchScore - a.matchScore);

  const sortedTenders = scoredTenders.map((entry) => entry.tender);

  const matchScoreById = new Map(
    scoredTenders.map((entry) => [
      entry.tender.id,
      entry.matchScore,
    ])
  );

  // Suche und Filter auf die bereits nach Matching sortierten Ausschreibungen
  const searchQuery = (params.q ?? "").trim().toLocaleLowerCase("de-CH");

  const selectedQuery = (params.q ?? "").trim();

  const selectedCanton = (params.canton ?? "")
    .trim()
    .toUpperCase();

  const selectedCategory = (params.category ?? "").trim();

  const normalizeFilterValue = (
    value: string | null | undefined
  ): string =>
    (value ?? "")
      .trim()
      .toLocaleLowerCase("de-CH")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

  const filterCantons = [
    ["AG", "Aargau"],
    ["AI", "Appenzell Innerrhoden"],
    ["BL", "Basel-Landschaft"],
    ["BS", "Basel-Stadt"],
    ["BE", "Bern"],
    ["FR", "Freiburg"],
    ["GE", "Genf"],
    ["GL", "Glarus"],
    ["GR", "Graubünden"],
    ["LU", "Luzern"],
    ["NE", "Neuenburg"],
    ["OW", "Obwalden"],
    ["SZ", "Schwyz"],
    ["SG", "St. Gallen"],
    ["TI", "Tessin"],
    ["TG", "Thurgau"],
    ["VD", "Waadt"],
    ["VS", "Wallis"],
    ["ZH", "Zürich"],
  ] as const;

  const cantonNames: Record<string, string> = {
    AG: "Aargau",
    AI: "Appenzell Innerrhoden",
    AR: "Appenzell Ausserrhoden",
    BE: "Bern",
    BL: "Basel-Landschaft",
    BS: "Basel-Stadt",
    FR: "Freiburg",
    GE: "Genf",
    GL: "Glarus",
    GR: "Graubünden",
    JU: "Jura",
    LU: "Luzern",
    NE: "Neuenburg",
    NW: "Nidwalden",
    OW: "Obwalden",
    SG: "St. Gallen",
    SH: "Schaffhausen",
    SO: "Solothurn",
    SZ: "Schwyz",
    TG: "Thurgau",
    TI: "Tessin",
    UR: "Uri",
    VD: "Waadt",
    VS: "Wallis",
    ZG: "Zug",
    ZH: "Zürich",
  };

  const availableCantons = Array.from(
    new Set(
      sortedTenders
        .map((tender) => (tender.canton ?? "").trim().toUpperCase())
        .filter(Boolean)
    )
  ).sort((a, b) =>
    (cantonNames[a] ?? a).localeCompare(
      cantonNames[b] ?? b,
      "de-CH"
    )
  );

  const filterCategories = [
    "Reinigung",
    "Hauswartung",
    "Unterhaltsreinigung",
    "Gebäudereinigung",
    "Fensterreinigung",
    "Endreinigung",
    "Umzugsreinigung",
    "Baureinigung",
    "Spezialreinigung",
    "Garten & Umgebung",
    "Gartenpflege",
    "Grünpflege",
    "Winterdienst",
    "Sanitär",
    "Heizung",
    "Lüftung",
    "Klima",
    "Elektro",
    "Maler",
    "Schreiner",
    "Bodenbeläge",
    "Handwerk",
    "Umzug",
    "Transport",
    "Entsorgung",
    "Weitere",
  ] as const;

  const availableCategories = Array.from(
    new Set(
      sortedTenders
        .map((tender) => (tender.category ?? "").trim())
        .filter(Boolean)
    )
  ).sort((a, b) => a.localeCompare(b, "de-CH"));

  const filteredTenders = sortedTenders.filter((tender) => {
    const searchableText = normalizeFilterValue(
      [
        tender.title,
        tender.authority,
        tender.location,
        tender.canton,
        tender.category,
      ]
        .filter(Boolean)
        .join(" ")
    );

    const matchesSearch =
      !selectedQuery ||
      searchableText.includes(
        normalizeFilterValue(selectedQuery)
      );

    const matchesCanton =
      !selectedCanton ||
      (tender.canton ?? "").trim().toUpperCase() ===
        selectedCanton.trim().toUpperCase();

    const matchesCategory =
      !selectedCategory ||
      normalizeFilterValue(tender.category) ===
        normalizeFilterValue(selectedCategory);

    return matchesSearch && matchesCanton && matchesCategory;
  });

  const cantonCount = new Set(
    filteredTenders
      .map((tender) => tender.canton)
      .filter(Boolean)
  ).size;

  const ITEMS_PER_PAGE = 20;

  const requestedPage = Number.parseInt(params.page ?? "1", 10);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredTenders.length / ITEMS_PER_PAGE)
  );

  const currentPage = Number.isFinite(requestedPage)
    ? Math.min(Math.max(requestedPage, 1), totalPages)
    : 1;

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

  const paginatedTenders = filteredTenders.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const createPageHref = (page: number) => {
    const query = new URLSearchParams();

    if (params.q) query.set("q", params.q);
    if (params.canton) query.set("canton", params.canton);
    if (params.category) query.set("category", params.category);

    query.set("page", String(page));

    return `/portal/ausschreibungen?${query.toString()}`;
  };

  return (
    <main className="min-h-screen bg-[#07101f] text-white">
      <div className="mx-auto w-full max-w-[1500px] px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <section className="relative overflow-hidden rounded-[30px] border border-white/[0.08] bg-[#0a1427] p-6 sm:p-8 lg:p-10">
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at 8% 0%, rgba(45,145,255,.13), transparent 28%), radial-gradient(circle at 94% 85%, rgba(180,61,255,.12), transparent 30%)",
            }}
          />

          <div className="relative flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/15 bg-emerald-400/[0.06] px-3 py-2 text-[11px] font-black uppercase tracking-[0.16em] text-emerald-300">
                <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,.8)]" />
                Live Ausschreibungs-Center
              </div>

              <h1 className="mt-5 text-3xl font-black tracking-[-0.045em] sm:text-4xl lg:text-5xl">
                Öffentliche Ausschreibungen
              </h1>

              <p className="mt-4 max-w-[760px] text-sm font-medium leading-7 text-slate-400 sm:text-base">
                Finde öffentliche Aufträge aus der ganzen Schweiz, passend zu
                deiner Branche und Region. Neue Ausschreibungen werden hier
                laufend ergänzt.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.035] px-5 py-3">
                <strong className="block text-xl font-black">{sortedTenders.length}</strong>
                <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                  Aktuell offen
                </span>
              </div>

              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.035] px-5 py-3">
                <strong className="block text-xl font-black">{cantonCount}</strong>
                <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                  Kantone
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-[24px] border border-white/[0.08] bg-[#0a1427] p-4 sm:p-5">
          <form method="GET" className="grid gap-3 lg:grid-cols-[1fr_190px_210px_150px]">
            <input
              type="search"
              name="q"
              defaultValue={params.q ?? ""}
              placeholder="Ausschreibung, Auftraggeber oder Ort suchen ..."
              className="min-h-[52px] rounded-2xl border border-white/[0.08] bg-white/[0.04] px-4 text-sm font-semibold text-white outline-none placeholder:text-slate-600 focus:border-sky-400/40"
            />

            <select
              name="canton"
                defaultValue={params.canton ?? ""}
                className="min-h-[52px] rounded-2xl border border-white/[0.08] bg-[#0d172b] px-4 text-sm font-bold text-slate-300 outline-none"
              >
              <option value="">Alle Kantone</option>

              {filterCantons.map(([code, name]) => (
              <option key={code} value={code}>
                {name}
              </option>
            ))}
            </select>

            <select
                name="category"
                defaultValue={params.category ?? ""}
                className="min-h-[52px] rounded-2xl border border-white/[0.08] bg-[#0d172b] px-4 text-sm font-bold text-slate-300 outline-none"
              >
              <option value="">Alle Kategorien</option>

              {filterCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
            </select>

            <button
              type="submit"
              className="min-h-[52px] rounded-2xl bg-gradient-to-r from-sky-400 via-blue-500 to-violet-500 px-5 text-sm font-black text-white shadow-[0_16px_40px_rgba(67,97,255,.22)] transition hover:-translate-y-0.5"
            >
              Suchen
            </button>
          </form>
        </section>

        <div className="mt-7 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-white">
              Passende Ausschreibungen
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Sortiert nach Aktualität
            </p>
          </div>

          <span className="rounded-full border border-white/[0.08] bg-white/[0.035] px-4 py-2 text-xs font-bold text-slate-400">
            Schweizweit
          </span>
        </div>

        <section className="mt-4 grid gap-4">
          {paginatedTenders.map((tender) => (
            <article
              key={tender.id}
              className="group relative overflow-hidden rounded-[24px] border border-white/[0.08] bg-[#0a1427] p-5 transition duration-200 hover:border-sky-400/20 hover:bg-[#0c172d] sm:p-6"
            >
              <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-sky-400/15 bg-sky-400/[0.06] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.15em] text-sky-300">
                      {tender.category}
                    </span>

                    {(() => {
                      const score = matchScoreById.get(tender.id) ?? 0;

                      if (score >= 80) {
                        return (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/[0.08] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.13em] text-emerald-300">
                            ★ Top Match · {score}%
                          </span>
                        );
                      }

                      if (score >= 50) {
                        return (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-400/20 bg-sky-400/[0.08] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.13em] text-sky-300">
                            ✓ Passend · {score}%
                          </span>
                        );
                      }

                      return null;
                    })()}

                    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/15 bg-emerald-400/[0.06] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.13em] text-emerald-300">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      {tender.status}
                    </span>
                  </div>

                  <h2 className="mt-4 text-xl font-black tracking-[-0.025em] text-white sm:text-2xl">
                    {tender.title}
                  </h2>

                  <p className="mt-2 text-sm font-medium text-slate-500">
                    {tender.authority}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3 text-xs font-semibold text-slate-500">
                    <span>
                      📍{" "}
                      <strong className="text-slate-300">
                        {tender.location}, {tender.canton}
                      </strong>
                    </span>

                    <span>
                      Publiziert:{" "}
                      <strong className="text-slate-300">
                        {tender.published}
                      </strong>
                    </span>

                    <span>
                      Eingabefrist:{" "}
                      <strong className="text-amber-300">
                        {tender.deadline ?? "Keine Frist angegeben"}
                      </strong>
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-2 lg:min-w-[210px]">
                  <Link
                    href={`/portal/ausschreibungen/${tender.id}?publicationId=${encodeURIComponent(tender.publicationId)}`}
                    className="inline-flex min-h-[50px] items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sky-400 via-blue-500 to-violet-500 px-5 text-sm font-black text-white transition hover:-translate-y-0.5"
                  >
                    Ausschreibung ansehen
                    <span>→</span>
                  </Link>

                  <button
                    type="button"
                    className="min-h-[46px] rounded-2xl border border-white/[0.08] bg-white/[0.035] px-5 text-xs font-bold text-slate-400 transition hover:bg-white/[0.06] hover:text-white"
                  >
                    ☆ Merken
                  </button>
                </div>
              </div>
            </article>
          ))}
        </section>

        {totalPages > 1 && (
          <nav
            aria-label="Seitennavigation Ausschreibungen"
            className="mt-7 flex flex-col items-center justify-between gap-4 rounded-[24px] border border-white/[0.08] bg-[#0a1427] p-4 sm:flex-row sm:p-5"
          >
            <div className="text-sm font-semibold text-slate-400">
              Seite{" "}
              <span className="text-white">{currentPage}</span>
              {" "}von{" "}
              <span className="text-white">{totalPages}</span>
              <span className="ml-2 text-slate-500">
                · {filteredTenders.length} Ausschreibungen
              </span>
            </div>

            <div className="flex items-center gap-2">
              {currentPage > 1 ? (
                <Link
                  href={createPageHref(currentPage - 1)}
                  className="inline-flex min-h-[46px] items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.035] px-4 text-sm font-bold text-slate-300 transition hover:border-sky-400/30 hover:bg-white/[0.06] hover:text-white"
                >
                  ← Zurück
                </Link>
              ) : (
                <span className="inline-flex min-h-[46px] cursor-not-allowed items-center justify-center rounded-xl border border-white/[0.05] bg-white/[0.02] px-4 text-sm font-bold text-slate-600">
                  ← Zurück
                </span>
              )}

              <div className="hidden items-center gap-2 sm:flex">
                {Array.from(
                  { length: Math.min(totalPages, 5) },
                  (_, index) => {
                    let pageNumber: number;

                    if (totalPages <= 5) {
                      pageNumber = index + 1;
                    } else if (currentPage <= 3) {
                      pageNumber = index + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNumber = totalPages - 4 + index;
                    } else {
                      pageNumber = currentPage - 2 + index;
                    }

                    const active = pageNumber === currentPage;

                    return (
                      <Link
                        key={pageNumber}
                        href={createPageHref(pageNumber)}
                        aria-current={active ? "page" : undefined}
                        className={
                          active
                            ? "inline-flex h-[46px] min-w-[46px] items-center justify-center rounded-xl bg-gradient-to-r from-sky-400 via-blue-500 to-violet-500 px-3 text-sm font-black text-white shadow-[0_12px_32px_rgba(59,130,246,.22)]"
                            : "inline-flex h-[46px] min-w-[46px] items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.035] px-3 text-sm font-bold text-slate-400 transition hover:border-sky-400/30 hover:bg-white/[0.06] hover:text-white"
                        }
                      >
                        {pageNumber}
                      </Link>
                    );
                  }
                )}
              </div>

              {currentPage < totalPages ? (
                <Link
                  href={createPageHref(currentPage + 1)}
                  className="inline-flex min-h-[46px] items-center justify-center rounded-xl bg-gradient-to-r from-sky-400 via-blue-500 to-violet-500 px-5 text-sm font-black text-white shadow-[0_12px_32px_rgba(59,130,246,.22)] transition hover:-translate-y-0.5"
                >
                  Weiter →
                </Link>
              ) : (
                <span className="inline-flex min-h-[46px] cursor-not-allowed items-center justify-center rounded-xl border border-white/[0.05] bg-white/[0.02] px-5 text-sm font-bold text-slate-600">
                  Weiter →
                </span>
              )}
            </div>
          </nav>
        )}

        <section className="mt-7 rounded-[24px] border border-violet-400/15 bg-gradient-to-r from-blue-500/[0.07] to-fuchsia-500/[0.07] p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-violet-300">
                Auftrago Ausschreibungs-Center
              </p>
              <p className="mt-2 text-base font-black text-white">
                Öffentliche Aufträge passend zu deinem Unternehmen.
              </p>
              <p className="mt-1 text-sm text-slate-500">
                In der nächsten Ausbaustufe werden Ausschreibungen automatisch
                anhand deiner Kategorien und Regionen priorisiert.
              </p>
            </div>

            <Link
              href="/portal/einstellungen"
              className="shrink-0 text-sm font-black text-sky-300 hover:text-sky-200"
            >
              Matching einstellen →
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
