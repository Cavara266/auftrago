import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  CalendarDays,
  Check,
  Coins,
  Flame,
  LockKeyhole,
  MapPin,
  ShieldCheck,
  Sparkles,
  Star,
  TrendingUp,
  Zap,
} from "lucide-react";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import ProviderPageTracker from "@/components/provider-page-tracker";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("de-CH", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function formatRelativeDate(date: Date) {
  const now = new Date();
  const difference = now.getTime() - date.getTime();
  const hours = Math.floor(difference / (1000 * 60 * 60));
  const days = Math.floor(difference / (1000 * 60 * 60 * 24));

  if (hours < 1) return "Gerade eingegangen";
  if (hours < 24) return `Vor ${hours} Std.`;
  if (days === 1) return "Gestern";
  if (days < 7) return `Vor ${days} Tagen`;

  return formatDate(date);
}

function getCategoryIcon(category: string) {
  const normalizedCategory = category.toLowerCase();

  if (normalizedCategory.includes("fenster")) return "🪟";
  if (normalizedCategory.includes("reinigung")) return "🧹";
  if (
    normalizedCategory.includes("umzug") ||
    normalizedCategory.includes("transport")
  ) {
    return "🚚";
  }
  if (
    normalizedCategory.includes("garten") ||
    normalizedCategory.includes("hecke") ||
    normalizedCategory.includes("rasen")
  ) {
    return "🌿";
  }
  if (
    normalizedCategory.includes("entsorgung") ||
    normalizedCategory.includes("räumung")
  ) {
    return "♻️";
  }
  if (
    normalizedCategory.includes("hauswartung") ||
    normalizedCategory.includes("liegenschaft")
  ) {
    return "🏢";
  }
  if (normalizedCategory.includes("maler")) return "🎨";

  return "🛠️";
}

function getLeadQuality({
  title,
  description,
  region,
  category,
  createdAt,
}: {
  title: string;
  description: string;
  region: string;
  category: string;
  createdAt: Date;
}) {
  let score = 55;

  if (title.trim().length >= 12) score += 8;
  if (description.trim().length >= 120) score += 15;
  else if (description.trim().length >= 60) score += 8;
  if (region.trim().length >= 2) score += 7;
  if (category.trim().length >= 3) score += 7;

  const ageInHours =
    (Date.now() - createdAt.getTime()) / (1000 * 60 * 60);

  if (ageInHours <= 24) score += 8;
  else if (ageInHours <= 72) score += 4;

  return Math.min(score, 98);
}

function getQualityLabel(score: number) {
  if (score >= 88) return "Top-Anfrage";
  if (score >= 78) return "Sehr interessant";
  if (score >= 68) return "Gute Chance";
  return "Neue Anfrage";
}

function getQualityReason({
  description,
  region,
  createdAt,
}: {
  description: string;
  region: string;
  createdAt: Date;
}) {
  const reasons: string[] = [];
  const ageInHours =
    (Date.now() - createdAt.getTime()) / (1000 * 60 * 60);

  if (ageInHours <= 24) reasons.push("Neu eingegangen");
  if (description.trim().length >= 100) reasons.push("Ausführliche Angaben");
  if (region.trim().length >= 2) reasons.push("Region klar angegeben");

  return reasons.slice(0, 2);
}

export default async function LeadsPage() {
  const user = await requireUser();

  if (!user) {
    redirect("/login");
  }

  const [leads, purchases] = await Promise.all([
    prisma.lead.findMany({
      orderBy: {
        createdAt: "desc",
      },
    }),

    prisma.leadPurchase.findMany({
      where: {
        providerId: user.id,
      },
      select: {
        leadId: true,
      },
    }),
  ]);

  const purchasedLeadIds = new Set(
    purchases.map((purchase) => purchase.leadId)
  );

  const availableLeads = leads.filter(
    (lead) => !purchasedLeadIds.has(lead.id)
  );
  const newLeads = availableLeads.filter((lead) => {
    const hours =
      (Date.now() - lead.createdAt.getTime()) / (1000 * 60 * 60);
    return hours <= 48;
  });
  const premiumLeads = availableLeads.filter((lead) => {
    const quality = getLeadQuality(lead);
    return quality >= 88;
  });

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#030816] text-white">
      <ProviderPageTracker
        event="LEADS_VIEWED"
        page="/leads"
        description="Anbieter hat die Leadliste geöffnet"
        metadata={{
          availableLeads: leads.length,
          purchasedLeads: purchases.length,
          credits: user.credits,
        }}
      />

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-14%] top-[-8%] h-[460px] w-[460px] rounded-full bg-sky-400/10 blur-3xl" />
        <div className="absolute right-[-14%] top-[15%] h-[500px] w-[500px] rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute bottom-[-20%] left-[30%] h-[420px] w-[420px] rounded-full bg-cyan-400/5 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(126,200,255,0.06),transparent_34%)]" />
      </div>

      <section className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/dashboard"
            className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] px-5 py-2.5 text-sm font-semibold text-white/75 transition hover:bg-white/10 hover:text-white"
          >
            ← Zum Dashboard
          </Link>

          <Link
            href="/credits"
            className="inline-flex min-h-[48px] items-center gap-3 rounded-2xl border border-yellow-400/20 bg-yellow-400/10 px-5 py-3 transition hover:bg-yellow-400/15"
          >
            <Coins className="h-5 w-5 text-yellow-300" />
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-yellow-100/55">
                Dein Guthaben
              </div>
              <div className="text-base font-black text-yellow-200">
                {user.credits} Credits
              </div>
            </div>
          </Link>
        </div>

        <div className="mt-8 overflow-hidden rounded-[34px] border border-white/10 bg-[linear-gradient(145deg,rgba(11,20,39,0.98),rgba(7,17,34,0.94))] shadow-[0_30px_100px_rgba(0,0,0,0.35)]">
          <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:p-10">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/20 bg-sky-400/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-sky-200">
                <Sparkles className="h-4 w-4" />
                Deine neuen Kundenchancen
              </div>

              <h1 className="mt-6 max-w-4xl text-4xl font-semibold leading-[1.02] tracking-tight sm:text-5xl lg:text-6xl">
                Finde den nächsten Auftrag,
                <span className="block bg-gradient-to-r from-white via-sky-100 to-[#7EC8FF] bg-clip-text text-transparent">
                  bevor es jemand anderes tut.
                </span>
              </h1>

              <p className="mt-5 max-w-3xl text-base leading-8 text-white/60 sm:text-lg">
                Prüfe neue Anfragen, vergleiche Region und Auftragsdetails und
                schalte nur jene Kundenkontakte frei, die wirklich zu deinem
                Unternehmen passen.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-sm font-semibold text-white/70">
                  <Check className="h-4 w-4 text-emerald-300" />
                  Keine monatliche Verpflichtung
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-sm font-semibold text-white/70">
                  <ShieldCheck className="h-4 w-4 text-sky-300" />
                  Kontakt sofort nach Freischaltung
                </span>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
              <div className="rounded-[24px] border border-sky-400/20 bg-sky-400/10 p-5">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-xs font-bold uppercase tracking-[0.14em] text-sky-100/55">
                    Verfügbare Chancen
                  </div>
                  <BriefcaseBusiness className="h-5 w-5 text-sky-200" />
                </div>
                <div className="mt-3 text-4xl font-black text-white">
                  {availableLeads.length}
                </div>
              </div>

              <div className="rounded-[24px] border border-orange-400/20 bg-orange-400/10 p-5">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-xs font-bold uppercase tracking-[0.14em] text-orange-100/55">
                    Neu in 48 Stunden
                  </div>
                  <Flame className="h-5 w-5 text-orange-200" />
                </div>
                <div className="mt-3 text-4xl font-black text-white">
                  {newLeads.length}
                </div>
              </div>

              <div className="rounded-[24px] border border-violet-400/20 bg-violet-400/10 p-5">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-xs font-bold uppercase tracking-[0.14em] text-violet-100/55">
                    Top-Anfragen
                  </div>
                  <Star className="h-5 w-5 text-violet-200" />
                </div>
                <div className="mt-3 text-4xl font-black text-white">
                  {premiumLeads.length}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-4 rounded-[26px] border border-white/10 bg-white/[0.04] p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.14em] text-white/35">
              Aktuelle Übersicht
            </div>
            <h2 className="mt-2 text-2xl font-semibold">
              {availableLeads.length} offene Kundenanfragen
            </h2>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="rounded-full border border-sky-400/20 bg-sky-400/10 px-4 py-2 text-xs font-bold text-sky-200">
              Neueste zuerst
            </span>
            <span className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-xs font-bold text-white/55">
              {purchases.length} bereits freigeschaltet
            </span>
          </div>
        </div>

        {leads.length === 0 ? (
          <div className="mt-8 rounded-[30px] border border-dashed border-white/15 bg-white/[0.03] p-12 text-center">
            <div className="text-5xl">📭</div>
            <h2 className="mt-5 text-2xl font-semibold">
              Aktuell keine offenen Aufträge
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-white/50">
              Neue Kundenanfragen werden hier automatisch angezeigt. Schau bald
              wieder vorbei.
            </p>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {leads.map((lead) => {
              const purchased = purchasedLeadIds.has(lead.id);
              const categoryIcon = getCategoryIcon(lead.category);
              const qualityScore = getLeadQuality(lead);
              const qualityLabel = getQualityLabel(qualityScore);
              const qualityReasons = getQualityReason(lead);

              return (
                <article
                  key={lead.id}
                  className={[
                    "group relative flex min-h-[560px] flex-col overflow-hidden rounded-[30px] border p-6 transition duration-300",
                    purchased
                      ? "border-emerald-400/20 bg-[linear-gradient(160deg,rgba(16,185,129,0.12),rgba(11,20,39,0.96))]"
                      : "border-white/10 bg-[linear-gradient(160deg,rgba(14,27,51,0.98),rgba(8,16,32,0.98))] hover:-translate-y-1.5 hover:border-sky-300/25 hover:shadow-[0_30px_90px_rgba(56,189,248,0.10)]",
                  ].join(" ")}
                >
                  <div className="pointer-events-none absolute right-[-70px] top-[-70px] h-48 w-48 rounded-full bg-sky-400/5 blur-3xl transition group-hover:bg-sky-400/10" />

                  <div className="relative flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] text-3xl shadow-[0_12px_30px_rgba(0,0,0,0.18)]">
                        {categoryIcon}
                      </div>

                      <div
                        className={
                          purchased
                            ? "inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-2 text-xs font-bold text-emerald-200"
                            : "inline-flex items-center gap-2 rounded-full border border-orange-400/20 bg-orange-400/10 px-3 py-2 text-xs font-bold text-orange-100"
                        }
                      >
                        {purchased ? (
                          <BadgeCheck className="h-4 w-4" />
                        ) : (
                          <Zap className="h-4 w-4" />
                        )}
                        {purchased ? "Freigeschaltet" : formatRelativeDate(lead.createdAt)}
                      </div>
                    </div>

                    <div className="mt-6 rounded-[22px] border border-violet-400/15 bg-violet-400/[0.08] p-4">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <div className="text-[10px] font-black uppercase tracking-[0.16em] text-violet-100/50">
                            Qualitätsindikator
                          </div>
                          <div className="mt-1 text-sm font-bold text-violet-100">
                            {qualityLabel}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 rounded-full border border-violet-300/15 bg-violet-300/10 px-3 py-2 text-sm font-black text-violet-100">
                          <TrendingUp className="h-4 w-4" />
                          {qualityScore}/100
                        </div>
                      </div>
                    </div>

                    <h2 className="mt-6 text-2xl font-semibold leading-tight tracking-tight text-white sm:text-[28px]">
                      {lead.title}
                    </h2>

                    <p className="mt-4 line-clamp-5 text-sm leading-7 text-white/58">
                      {lead.description}
                    </p>

                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-white/35">
                          <MapPin className="h-4 w-4" />
                          Region
                        </div>
                        <div className="mt-2 font-semibold text-white/85">
                          {lead.region}
                        </div>
                      </div>

                      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-white/35">
                          <CalendarDays className="h-4 w-4" />
                          Eingegangen
                        </div>
                        <div className="mt-2 font-semibold text-white/85">
                          {formatDate(lead.createdAt)}
                        </div>
                      </div>
                    </div>

                    {qualityReasons.length > 0 ? (
                      <div className="mt-5 space-y-2">
                        {qualityReasons.map((reason) => (
                          <div
                            key={reason}
                            className="flex items-center gap-3 text-sm text-white/60"
                          >
                            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-400/10 text-emerald-300">
                              <Check className="h-3 w-3" />
                            </span>
                            {reason}
                          </div>
                        ))}
                      </div>
                    ) : null}

                    <div className="mt-5 rounded-[20px] border border-white/10 bg-black/15 p-4">
                      <div className="flex items-start gap-3">
                        {purchased ? (
                          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-300" />
                        ) : (
                          <LockKeyhole className="mt-0.5 h-5 w-5 shrink-0 text-sky-300" />
                        )}
                        <p className="text-sm leading-6 text-white/50">
                          {purchased
                            ? "Der Kundenkontakt wurde bereits freigeschaltet und ist in der Detailansicht sichtbar."
                            : "Telefonnummer, E-Mail und vollständige Kontaktdaten werden direkt nach der Freischaltung angezeigt."}
                        </p>
                      </div>
                    </div>

                    <div className="mt-auto pt-7">
                      <div className="mb-4 flex items-end justify-between gap-4">
                        <div>
                          <div className="text-xs font-bold uppercase tracking-[0.14em] text-yellow-100/45">
                            Freischaltung
                          </div>
                          <div className="mt-1 flex items-end gap-2">
                            <span className="text-4xl font-black leading-none text-yellow-300">
                              {lead.price}
                            </span>
                            <span className="pb-1 text-sm font-bold text-yellow-100/60">
                              Credits
                            </span>
                          </div>
                        </div>

                        <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-semibold text-white/45">
                          {lead.category}
                        </span>
                      </div>

                      <Link
                        href={`/leads/${lead.id}`}
                        className={[
                          "inline-flex min-h-[56px] w-full items-center justify-center gap-2 rounded-2xl px-5 py-3 text-base font-black transition",
                          purchased
                            ? "border border-emerald-400/20 bg-emerald-400/10 text-emerald-100 hover:bg-emerald-400/15"
                            : "bg-[#7EC8FF] text-[#04101d] shadow-[0_18px_50px_rgba(126,200,255,0.18)] hover:bg-[#91d2ff]",
                        ].join(" ")}
                      >
                        {purchased ? "Kundendaten ansehen" : "Diese Chance ansehen"}
                        <ArrowRight className="h-5 w-5 transition group-hover:translate-x-0.5" />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        <div className="mt-10 overflow-hidden rounded-[32px] border border-yellow-400/20 bg-[linear-gradient(135deg,rgba(250,204,21,0.12),rgba(255,255,255,0.04))] p-6 sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="text-xs font-black uppercase tracking-[0.16em] text-yellow-100/55">
                Keine passende Chance verpassen
              </div>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                Genügend Credits für den nächsten Auftrag?
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-white/55 sm:text-base">
                Credits stehen nach erfolgreicher Zahlung sofort zur Verfügung
                und verfallen nicht.
              </p>
            </div>

            <Link
              href="/credits"
              className="inline-flex min-h-[56px] shrink-0 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-yellow-300 to-amber-400 px-7 py-3 text-base font-black text-[#171006] shadow-[0_18px_50px_rgba(250,204,21,0.16)] transition hover:scale-[1.01]"
            >
              <Coins className="h-5 w-5" />
              Credits kaufen
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}