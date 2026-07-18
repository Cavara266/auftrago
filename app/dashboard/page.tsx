import Link from "next/link";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { filterMatchingLeads } from "@/lib/provider-lead-matching";

import ProviderPageTracker from "@/components/provider-page-tracker";
import ProviderNotificationBell from "@/components/provider-notification-bell";
import OpenLeadButton from "./open-lead-button";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

function getGreeting() {
  const hour = new Date().getHours();

  if (hour < 11) {
    return "Guten Morgen";
  }

  if (hour < 17) {
    return "Guten Tag";
  }

  return "Guten Abend";
}

function getCategoryIcon(category: string) {
  const value = category.toLowerCase();

  if (value.includes("reinigung")) {
    return "🧹";
  }

  if (
    value.includes("umzug") ||
    value.includes("transport")
  ) {
    return "🚚";
  }

  if (
    value.includes("garten") ||
    value.includes("rasen") ||
    value.includes("hecke")
  ) {
    return "🌿";
  }

  if (
    value.includes("fenster") ||
    value.includes("storen")
  ) {
    return "🪟";
  }

  if (value.includes("maler")) {
    return "🎨";
  }

  if (
    value.includes("entsorgung") ||
    value.includes("räumung")
  ) {
    return "♻️";
  }

  if (value.includes("hauswartung")) {
    return "🏢";
  }

  return "🛠️";
}

function getCreditStatus(credits: number) {
  if (credits <= 0) {
    return {
      label: "Keine Credits",
      text:
        "Lade Credits auf, um neue Kundenanfragen freizuschalten.",
      className:
        "border-red-400/20 bg-red-400/10 text-red-100",
    };
  }

  if (credits <= 20) {
    return {
      label: "Guthaben wird knapp",
      text:
        "Dein Guthaben reicht nur noch für wenige Kundenanfragen.",
      className:
        "border-amber-400/20 bg-amber-400/10 text-amber-100",
    };
  }

  return {
    label: "Bereit für neue Aufträge",
    text:
      "Du kannst passende Kundenanfragen sofort freischalten.",
    className:
      "border-emerald-400/20 bg-emerald-400/10 text-emerald-100",
  };
}

function formatRelativeTime(date: Date) {
  const diffMinutes = Math.max(
    0,
    Math.floor(
      (Date.now() - date.getTime()) / 60000
    )
  );

  if (diffMinutes < 1) {
    return "Gerade eingetroffen";
  }

  if (diffMinutes < 60) {
    return `Vor ${diffMinutes} Min.`;
  }

  const diffHours = Math.floor(
    diffMinutes / 60
  );

  if (diffHours < 24) {
    return `Vor ${diffHours} Std.`;
  }

  const diffDays = Math.floor(
    diffHours / 24
  );

  if (diffDays === 1) {
    return "Gestern";
  }

  return `Vor ${diffDays} Tagen`;
}

function getProviderLevel(
  purchaseCount: number
) {
  if (purchaseCount >= 100) {
    return {
      name: "Platin Partner",
      icon: "💎",
      nextTarget: 150,
    };
  }

  if (purchaseCount >= 50) {
    return {
      name: "Gold Partner",
      icon: "🏆",
      nextTarget: 100,
    };
  }

  if (purchaseCount >= 20) {
    return {
      name: "Silber Partner",
      icon: "🥈",
      nextTarget: 50,
    };
  }

  return {
    name: "Starter Partner",
    icon: "🚀",
    nextTarget: 20,
  };
}

export default async function DashboardPage() {
  const user = await requireUser();

  if (!user) {
    redirect("/login");
  }

  const provider =
    await prisma.provider.findUnique({
      where: {
        id: user.id,
      },

      select: {
        region: true,
        category: true,

        serviceRegions: true,
        serviceCategories: true,
        serviceCities: true,
        servicePostalCodes: true,

        receiveAllLeadEmails: true,
      },
    });

  if (!provider) {
    redirect("/login");
  }

  const startOfMonth = new Date();

  startOfMonth.setDate(1);
  startOfMonth.setHours(
    0,
    0,
    0,
    0
  );

  const purchases =
    await prisma.leadPurchase.findMany({
      where: {
        providerId: user.id,
      },

      include: {
        lead: true,
      },

      orderBy: {
        createdAt: "desc",
      },
    });

  const purchasedLeadIds =
    purchases.map(
      (purchase) =>
        purchase.leadId
    );

  const [
    candidateLeads,
    totalLeads,
    monthlyPurchases,
  ] = await Promise.all([
    prisma.lead.findMany({
      where:
        purchasedLeadIds.length > 0
          ? {
              id: {
                notIn:
                  purchasedLeadIds,
              },
            }
          : undefined,

      take: 150,

      orderBy: {
        createdAt: "desc",
      },
    }),

    prisma.lead.count(),

    prisma.leadPurchase.count({
      where: {
        providerId: user.id,

        createdAt: {
          gte: startOfMonth,
        },
      },
    }),
  ]);

  const matchingLeadResults =
    filterMatchingLeads(
      provider,
      candidateLeads
    );

  const latestLeads =
    matchingLeadResults
      .slice(0, 8)
      .map(({ lead }) => lead);

  const totalMatchingLeads =
    matchingLeadResults.length;

  const recommendedLeads =
    matchingLeadResults
      .slice(0, 3)
      .map(({ lead, match }) => ({
        ...lead,
        recommendationScore:
          match.score,
        recommendationReasons:
          match.reasons,
      }));

  const creditStatus =
    getCreditStatus(
      user.credits
    );

  const providerLevel =
    getProviderLevel(
      purchases.length
    );

  const levelProgress =
    Math.min(
      100,
      Math.round(
        (purchases.length /
          providerLevel.nextTarget) *
          100
      )
    );

  const monthlyTarget = 20;

  const monthlyProgress =
    Math.min(
      100,
      Math.round(
        (monthlyPurchases /
          monthlyTarget) *
          100
      )
    );

  const initialNotificationLeads =
    latestLeads.map((lead) => ({
      id: lead.id,
      title: lead.title,
      region: lead.region,
      category: lead.category,
      price: lead.price,

      createdAt:
        lead.createdAt.toISOString(),
    }));

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#030816] text-white">
      <ProviderPageTracker
        event="DASHBOARD_VIEWED"
        page="/dashboard"
        description="Anbieter hat das Dashboard geöffnet"
        metadata={{
          credits: user.credits,
          unlockedLeads:
            purchases.length,
          availableLeads:
            totalMatchingLeads,
          allAvailableLeads:
            totalLeads,
          monthlyPurchases,
        }}
      />

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-12%] top-[-10%] h-[480px] w-[480px] rounded-full bg-sky-400/10 blur-3xl" />

        <div className="absolute right-[-10%] top-[10%] h-[520px] w-[520px] rounded-full bg-indigo-500/10 blur-3xl" />

        <div className="absolute bottom-[-20%] left-[30%] h-[460px] w-[460px] rounded-full bg-cyan-400/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <section className="overflow-visible rounded-[34px] border border-white/10 bg-[linear-gradient(135deg,rgba(14,29,55,0.98),rgba(5,12,29,0.96))] shadow-[0_35px_120px_rgba(0,0,0,0.38)]">
          <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:p-10">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/20 bg-sky-400/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-sky-200">
                <span className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_18px_rgba(110,231,183,0.9)]" />

                Anbieterportal live
              </div>

              <h1 className="mt-6 max-w-4xl text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                {getGreeting()},{" "}

                <span className="bg-gradient-to-r from-white via-sky-100 to-sky-300 bg-clip-text text-transparent">
                  {user.companyName}
                </span>
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-8 text-white/60 sm:text-lg">
                Aktuell warten{" "}
                {totalMatchingLeads} passende
                Kundenchancen auf dich. Prüfe
                die neuen Anfragen und reagiere
                frühzeitig.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/leads"
                  className="inline-flex min-h-[54px] items-center justify-center rounded-2xl bg-gradient-to-r from-sky-400 to-indigo-500 px-6 py-3 text-sm font-black text-white shadow-[0_18px_50px_rgba(59,130,246,0.28)] transition hover:-translate-y-0.5"
                >
                  🔥 Passende Leads ansehen
                </Link>

                <Link
                  href="/credits"
                  className="inline-flex min-h-[54px] items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] px-6 py-3 text-sm font-bold text-white transition hover:bg-white/10"
                >
                  🪙 Credits kaufen
                </Link>
              </div>
            </div>

            <aside className="relative rounded-[28px] border border-white/10 bg-black/20 p-6 backdrop-blur-xl">
              <div className="mb-5 flex justify-end">
                <ProviderNotificationBell
                  initialLeads={
                    initialNotificationLeads
                  }
                />
              </div>

              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-bold uppercase tracking-[0.15em] text-white/35">
                    Anbieterstatus
                  </div>

                  <div className="mt-3 text-2xl font-semibold">
                    {providerLevel.icon}{" "}
                    {providerLevel.name}
                  </div>
                </div>

                <div className="rounded-2xl border border-yellow-400/20 bg-yellow-400/10 px-4 py-3 text-right">
                  <div className="text-2xl font-black text-yellow-200">
                    {user.credits}
                  </div>

                  <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-yellow-100/55">
                    Credits
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <div className="flex items-center justify-between text-xs text-white/45">
                  <span>
                    Level-Fortschritt
                  </span>

                  <span>
                    {purchases.length}/
                    {providerLevel.nextTarget}
                  </span>
                </div>

                <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-sky-300 to-indigo-400"
                    style={{
                      width: `${levelProgress}%`,
                    }}
                  />
                </div>
              </div>

              <div
                className={`mt-6 rounded-2xl border p-4 ${creditStatus.className}`}
              >
                <div className="text-sm font-bold">
                  {creditStatus.label}
                </div>

                <div className="mt-1 text-xs leading-5 opacity-75">
                  {creditStatus.text}
                </div>
              </div>
            </aside>
          </div>
        </section>

        <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            {
              label: "Neue Chancen",
              value: latestLeads.length,
              icon: "🔥",
              text:
                "Neueste passende Anfragen",
            },

            {
              label: "Passende Leads",
              value:
                totalMatchingLeads,
              icon: "🎯",
              text:
                "Für deine Einstellungen",
            },

            {
              label:
                "Freigeschaltet",
              value:
                purchases.length,
              icon: "🔓",
              text:
                "Gesamte Kundenkontakte",
            },

            {
              label: "Diesen Monat",
              value:
                monthlyPurchases,
              icon: "📈",
              text: `Ziel: ${monthlyTarget} Kontakte`,
            },
          ].map((item) => (
            <article
              key={item.label}
              className="rounded-[26px] border border-white/10 bg-white/[0.045] p-5 transition hover:-translate-y-0.5 hover:border-sky-300/20 hover:bg-white/[0.065]"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-white/55">
                  {item.label}
                </span>

                <span className="text-xl">
                  {item.icon}
                </span>
              </div>

              <div className="mt-5 text-4xl font-black tracking-tight">
                {item.value}
              </div>

              <p className="mt-2 text-sm text-white/40">
                {item.text}
              </p>
            </article>
          ))}
        </section>

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <section className="rounded-[30px] border border-white/10 bg-[#0a1325]/95 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.22)] sm:p-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <div className="text-xs font-bold uppercase tracking-[0.15em] text-sky-200/70">
                  Für dich empfohlen
                </div>

                <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">
                  Passende Kundenchancen
                </h2>

                <p className="mt-2 text-sm leading-6 text-white/45">
                  Die Reihenfolge berücksichtigt
                  deine gewählten Kategorien,
                  Regionen, Städte und
                  Postleitzahlen.
                </p>
              </div>

              <Link
                href="/leads"
                className="text-sm font-bold text-sky-200 hover:text-sky-100"
              >
                Alle passenden Leads →
              </Link>
            </div>

            <div className="mt-7 grid gap-4 xl:grid-cols-3">
              {recommendedLeads.length >
              0 ? (
                recommendedLeads.map(
                  (lead) => (
                    <article
                      key={lead.id}
                      className="group flex min-h-[330px] flex-col justify-between rounded-[24px] border border-white/10 bg-white/[0.035] p-5 transition hover:-translate-y-1 hover:border-sky-300/25 hover:bg-white/[0.06]"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] text-2xl">
                            {getCategoryIcon(
                              lead.category
                            )}
                          </div>

                          <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-bold text-emerald-200">
                            {
                              lead.recommendationScore
                            }
                            % Match
                          </div>
                        </div>

                        <div className="mt-5 text-xs font-bold uppercase tracking-[0.13em] text-sky-200/70">
                          {formatRelativeTime(
                            lead.createdAt
                          )}
                        </div>

                        <h3 className="mt-3 text-xl font-semibold leading-snug">
                          {lead.title}
                        </h3>

                        <div className="mt-5 flex flex-wrap gap-2">
                          <span className="rounded-full bg-white/[0.06] px-3 py-2 text-xs text-white/60">
                            📍 {lead.region}
                          </span>

                          <span className="rounded-full bg-white/[0.06] px-3 py-2 text-xs text-white/60">
                            🏷️{" "}
                            {lead.category}
                          </span>

                          {lead.city ? (
                            <span className="rounded-full bg-white/[0.06] px-3 py-2 text-xs text-white/60">
                              🏙️ {lead.city}
                            </span>
                          ) : null}

                          {lead.postalCode ? (
                            <span className="rounded-full bg-white/[0.06] px-3 py-2 text-xs text-white/60">
                              📮{" "}
                              {lead.postalCode}
                            </span>
                          ) : null}
                        </div>
                      </div>

                      <div className="mt-6 flex items-end justify-between gap-4">
                        <div>
                          <div className="text-2xl font-black text-yellow-200">
                            {lead.price}
                          </div>

                          <div className="text-[10px] font-bold uppercase tracking-[0.13em] text-yellow-100/45">
                            Credits
                          </div>
                        </div>

                        <Link
                          href={`/leads/${lead.id}`}
                          className="inline-flex min-h-[46px] items-center justify-center rounded-xl bg-white px-4 py-2 text-sm font-black text-[#04101d] transition group-hover:bg-sky-100"
                        >
                          Öffnen →
                        </Link>
                      </div>
                    </article>
                  )
                )
              ) : (
                <div className="rounded-[24px] border border-dashed border-white/10 bg-white/[0.025] p-10 text-center xl:col-span-3">
                  <div className="text-4xl">
                    ✅
                  </div>

                  <h3 className="mt-4 text-xl font-semibold">
                    Keine neuen passenden Leads
                  </h3>

                  <p className="mt-2 text-sm text-white/45">
                    Neue passende
                    Kundenanfragen erscheinen
                    automatisch hier.
                  </p>

                  <Link
                    href="/settings/leads"
                    className="mt-5 inline-flex min-h-[46px] items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10"
                  >
                    Einstellungen prüfen
                  </Link>
                </div>
              )}
            </div>
          </section>

          <aside className="space-y-6">
            <section className="rounded-[30px] border border-white/10 bg-white/[0.045] p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold uppercase tracking-[0.14em] text-white/35">
                    Live-Feed
                  </div>

                  <h2 className="mt-2 text-xl font-semibold">
                    Passende neue Leads
                  </h2>
                </div>

                <span className="flex items-center gap-2 rounded-full border border-red-400/20 bg-red-400/10 px-3 py-1 text-xs font-bold text-red-200">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-red-300" />

                  LIVE
                </span>
              </div>

              <div className="mt-6 space-y-4">
                {latestLeads.length > 0 ? (
                  latestLeads
                    .slice(0, 5)
                    .map((lead) => (
                      <Link
                        key={lead.id}
                        href={`/leads/${lead.id}`}
                        className="flex items-start gap-3 rounded-2xl border border-white/5 bg-black/10 p-3 transition hover:border-sky-300/20 hover:bg-white/[0.04]"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.06] text-lg">
                          {getCategoryIcon(
                            lead.category
                          )}
                        </div>

                        <div className="min-w-0">
                          <div className="truncate text-sm font-semibold">
                            {lead.title}
                          </div>

                          <div className="mt-1 text-xs text-white/40">
                            {lead.region} ·{" "}
                            {formatRelativeTime(
                              lead.createdAt
                            )}
                          </div>
                        </div>
                      </Link>
                    ))
                ) : (
                  <div className="rounded-2xl border border-dashed border-white/10 p-5 text-center text-sm text-white/45">
                    Aktuell keine passenden
                    neuen Anfragen.
                  </div>
                )}
              </div>
            </section>

            <section className="rounded-[30px] border border-white/10 bg-white/[0.045] p-6">
              <div className="text-xs font-bold uppercase tracking-[0.14em] text-white/35">
                Monatsziel
              </div>

              <div className="mt-3 flex items-end justify-between gap-3">
                <div className="text-3xl font-black">
                  {monthlyPurchases}/
                  {monthlyTarget}
                </div>

                <div className="text-sm text-white/45">
                  Kontakte
                </div>
              </div>

              <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-300 to-indigo-400"
                  style={{
                    width: `${Math.max(
                      4,
                      monthlyProgress
                    )}%`,
                  }}
                />
              </div>

              <p className="mt-4 text-sm leading-6 text-white/45">
                Bleib aktiv und prüfe täglich
                neue Anfragen in deinen
                gewählten Einsatzgebieten.
              </p>
            </section>

            <Link
              href="/credits"
              className="flex min-h-[58px] w-full items-center justify-center rounded-2xl bg-gradient-to-r from-yellow-300 to-amber-400 px-6 py-3 text-sm font-black text-[#171006] shadow-[0_16px_45px_rgba(250,204,21,0.16)] transition hover:-translate-y-0.5"
            >
              🪙 Credits kaufen
            </Link>
          </aside>
        </div>

        <section className="mt-6 rounded-[30px] border border-white/10 bg-[#0a1325]/95 p-6 sm:p-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.15em] text-emerald-200/70">
                Deine Kontakte
              </div>

              <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">
                Zuletzt freigeschaltet
              </h2>
            </div>

            <Link
              href="/leads"
              className="text-sm font-bold text-sky-200 hover:text-sky-100"
            >
              Weitere Leads entdecken →
            </Link>
          </div>

          {purchases.length === 0 ? (
            <div className="mt-7 rounded-[24px] border border-dashed border-white/10 bg-white/[0.025] p-10 text-center">
              <div className="text-4xl">
                🔎
              </div>

              <h3 className="mt-4 text-xl font-semibold">
                Noch keine Leads
                freigeschaltet
              </h3>

              <p className="mt-2 text-sm text-white/45">
                Öffne die passenden
                Kundenanfragen und sichere dir
                interessante Kontakte.
              </p>

              <Link
                href="/leads"
                className="mt-5 inline-flex min-h-[48px] items-center justify-center rounded-xl bg-sky-300 px-5 py-3 text-sm font-black text-[#04101d]"
              >
                Leads ansehen
              </Link>
            </div>
          ) : (
            <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {purchases
                .slice(0, 6)
                .map((purchase) => (
                  <article
                    key={purchase.id}
                    className="rounded-[24px] border border-emerald-400/15 bg-emerald-400/[0.055] p-5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="text-2xl">
                        {getCategoryIcon(
                          purchase.lead
                            .category
                        )}
                      </div>

                      <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-bold text-emerald-200">
                        Freigeschaltet
                      </span>
                    </div>

                    <h3 className="mt-4 text-lg font-semibold">
                      {
                        purchase.lead
                          .title
                      }
                    </h3>

                    <div className="mt-3 text-sm text-white/45">
                      📍{" "}
                      {
                        purchase.lead
                          .region
                      }
                    </div>

                    <div className="mt-5 flex gap-2">
                      <a
                        href={`tel:${purchase.lead.phone}`}
                        className="inline-flex min-h-[44px] flex-1 items-center justify-center rounded-xl bg-white px-3 py-2 text-sm font-black text-[#04101d]"
                      >
                        📞 Anrufen
                      </a>

                      <OpenLeadButton
                        leadId={
                          purchase.lead.id
                        }
                      />
                    </div>
                  </article>
                ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}