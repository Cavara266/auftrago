import Link from "next/link";
import { notFound } from "next/navigation";
import { getTenderDetails } from "@/lib/simap/client";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    publicationId?: string;
  }>;
};

type UnknownRecord = Record<string, any>;

function text(value: unknown): string {
  if (typeof value === "string") {
    return value.trim();
  }

  if (value && typeof value === "object") {
    const record = value as UnknownRecord;

    for (const language of ["de", "fr", "it", "en"]) {
      const result = record[language];

      if (typeof result === "string" && result.trim()) {
        return result.trim();
      }
    }
  }

  return "";
}

function stripHtml(value: string): string {
  return value
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<\/li>/gi, "\n")
    .replace(/<li[^>]*>/gi, "• ")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function formatDate(value: unknown): string {
  if (typeof value !== "string" || !value) return "Keine Angabe";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("de-CH", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

export default async function AusschreibungDetailPage({
  params,
  searchParams,
}: PageProps) {
  const { id } = await params;
  const { publicationId } = await searchParams;

  if (!id || !publicationId) {
    notFound();
  }

  const details = (await getTenderDetails(
    id,
    publicationId
  )) as UnknownRecord | null;

  if (!details) {
    notFound();
  }

  const procurement =
    (details.procurement as UnknownRecord | undefined) ?? {};

  const projectInfo =
    (details["project-info"] as UnknownRecord | undefined) ??
    (details.projectInfo as UnknownRecord | undefined) ??
    {};

  const dates =
    (details.dates as UnknownRecord | undefined) ?? {};

  const address =
    (projectInfo.procOfficeAddress as UnknownRecord | undefined) ??
    (details.procurementRecipientAddress as UnknownRecord | undefined) ??
    {};

  const city =
    text(address.city) ||
    text((details.orderAddress as UnknownRecord | undefined)?.city) ||
    "Schweiz";

  const canton =
    text(address.cantonId) ||
    text((details.orderAddress as UnknownRecord | undefined)?.cantonId);

  const authority =
    text(projectInfo.procOfficeName) ||
    text(address.name) ||
    "Öffentliche Auftraggeberin";

  const title =
    text(details.title) ||
    text((details.base as UnknownRecord | undefined)?.title) ||
    text(projectInfo.title) ||
    "Öffentliche Ausschreibung";

  const descriptionRaw =
    text(procurement.orderDescription) ||
    text(projectInfo.description) ||
    text(details.description);

  const description = descriptionRaw
    ? stripHtml(descriptionRaw)
    : "Für diese Ausschreibung liegt derzeit keine ausführliche Beschreibung vor.";

  const publicationDate =
    dates.publicationDate ??
    (details.base as UnknownRecord | undefined)?.publicationDate;

  const deadline =
    dates.offerDeadline ??
    dates.offerValidityDeadline ??
    null;

  const projectNumber =
    text(details.projectNumber) ||
    text((details.base as UnknownRecord | undefined)?.projectNumber);

  const category =
    text(procurement.constructionCategory?.label) ||
    text(procurement.constructionCategory) ||
    text(procurement.projectType) ||
    text(details.projectType) ||
    "Öffentliche Ausschreibung";

  const phone =
    typeof address.phone === "string" ? address.phone : "";

  const email =
    typeof address.email === "string" ? address.email : "";

  const url =
    text(address.url) ||
    text(projectInfo.url);

  return (
    <main className="min-h-screen bg-[#07101f] text-white">
      <div className="mx-auto w-full max-w-[1250px] px-4 py-8 sm:px-6 lg:px-8 lg:py-12">

        <Link
          href="/portal/ausschreibungen"
          className="inline-flex items-center gap-2 text-sm font-bold text-sky-300 transition hover:text-sky-200"
        >
          ← Zurück zu den Ausschreibungen
        </Link>

        <section className="relative mt-6 overflow-hidden rounded-[30px] border border-white/[0.08] bg-[#0a1427] p-6 shadow-2xl sm:p-8 lg:p-10">
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at 90% 5%, rgba(108,92,255,.16), transparent 34%), radial-gradient(circle at 5% 90%, rgba(45,145,255,.10), transparent 30%)",
            }}
          />

          <div className="relative">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-sky-400/20 bg-sky-400/[0.07] px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.16em] text-sky-300">
                {category}
              </span>

              <span className="rounded-full border border-emerald-400/20 bg-emerald-400/[0.07] px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.16em] text-emerald-300">
                ● Offen
              </span>
            </div>

            <h1 className="mt-6 max-w-[950px] text-3xl font-black leading-tight tracking-[-0.045em] sm:text-4xl lg:text-5xl">
              {title}
            </h1>

            <p className="mt-5 max-w-[850px] text-base font-medium leading-7 text-slate-400">
              {authority}
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.035] p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">
                  Ort
                </p>
                <p className="mt-2 font-bold text-white">
                  {city}{canton ? `, ${canton}` : ""}
                </p>
              </div>

              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.035] p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">
                  Publiziert
                </p>
                <p className="mt-2 font-bold text-white">
                  {formatDate(publicationDate)}
                </p>
              </div>

              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.035] p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">
                  Eingabefrist
                </p>
                <p className="mt-2 font-bold text-amber-300">
                  {formatDate(deadline)}
                </p>
              </div>

              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.035] p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">
                  Projektnummer
                </p>
                <p className="mt-2 font-bold text-white">
                  {projectNumber || "Keine Angabe"}
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px]">
          <section className="rounded-[26px] border border-white/[0.08] bg-[#0a1427] p-6 sm:p-8">
            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-sky-300">
              Ausschreibungsdetails
            </p>

            <h2 className="mt-3 text-2xl font-black">
              Beschreibung
            </h2>

            <div className="mt-5 whitespace-pre-line text-sm font-medium leading-7 text-slate-300 sm:text-base">
              {description}
            </div>
          </section>

          <aside className="space-y-5">
            <div className="rounded-[26px] border border-white/[0.08] bg-[#0a1427] p-6">
              <p className="text-[11px] font-black uppercase tracking-[0.18em] text-violet-300">
                Auftraggeber
              </p>

              <h3 className="mt-3 text-xl font-black">
                {authority}
              </h3>

              <div className="mt-5 space-y-3 text-sm text-slate-400">
                <p>
                  📍 {city}{canton ? `, ${canton}` : ""}
                </p>

                {phone && <p>☎ {phone}</p>}
                {email && <p>✉ {email}</p>}
              </div>

              {url && (
                <a
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-6 inline-flex min-h-[48px] w-full items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.04] px-5 text-sm font-black transition hover:bg-white/[0.07]"
                >
                  Offizielle Stelle öffnen ↗
                </a>
              )}
            </div>

            <div className="rounded-[26px] border border-violet-400/15 bg-gradient-to-br from-blue-500/[0.09] to-fuchsia-500/[0.09] p-6">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-violet-300">
                AuftragO Ausschreibungs-Center
              </p>

              <p className="mt-3 font-black text-white">
                Interessiert an diesem Auftrag?
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Prüfe die Ausschreibung und entscheide, ob sie zu deinem Unternehmen passt.
              </p>

              <Link
                href="/portal/einstellungen"
                className="mt-5 inline-flex min-h-[48px] w-full items-center justify-center rounded-2xl bg-gradient-to-r from-sky-400 via-blue-500 to-violet-500 px-5 text-sm font-black text-white transition hover:-translate-y-0.5"
              >
                Matching einstellen →
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
