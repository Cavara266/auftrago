import Link from "next/link";

import { prisma } from "@/lib/prisma";
import "./admin-dashboard.css";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("de-CH", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function formatMoney(amountInRappen: number, currency = "chf") {
  return new Intl.NumberFormat("de-CH", {
    style: "currency",
    currency: currency.toUpperCase(),
    minimumFractionDigits: 2,
  }).format(amountInRappen / 100);
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("de-CH").format(value);
}

function percentage(value: number, total: number) {
  if (total <= 0) return 0;
  return Math.round((value / total) * 100);
}

function growth(current: number, previous: number) {
  if (previous <= 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
}

function startOfDay(date: Date) {
  const value = new Date(date);
  value.setHours(0, 0, 0, 0);
  return value;
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function initials(value: string) {
  return value
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function providerStatus(status: string) {
  if (status === "APPROVED") {
    return {
      label: "Genehmigt",
      className: "status-approved",
    };
  }

  if (status === "BLOCKED") {
    return {
      label: "Gesperrt",
      className: "status-blocked",
    };
  }

  return {
    label: "Ausstehend",
    className: "status-pending",
  };
}

function activityIcon(type: string) {
  if (type === "provider") return "P";
  if (type === "lead") return "L";
  if (type === "purchase") return "K";
  if (type === "payment") return "CHF";
  return "•";
}

export default async function AdminDashboardPage() {
  const now = new Date();
  const today = startOfDay(now);
  const monthStart = startOfMonth(now);
  const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const previous7DaysStart = new Date(
    now.getTime() - 14 * 24 * 60 * 60 * 1000
  );
  const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [
    latestProviders,
    latestLeads,
    latestLeadPurchases,
    latestCreditPurchases,
    providerCount,
    pendingProviderCount,
    approvedProviderCount,
    blockedProviderCount,
    providersToday,
    providersLast7,
    providersPrevious7,
    leadCount,
    leadsToday,
    leadsLast7,
    leadsPrevious7,
    leadPurchaseCount,
    leadPurchasesToday,
    leadPurchasesLast7,
    leadPurchasesPrevious7,
    paidCreditAggregate,
    revenueTodayAggregate,
    revenueMonthAggregate,
    revenueLast7Aggregate,
    revenuePrevious7Aggregate,
    leadCreditsAggregate,
    wonCount,
    contactedCount,
    offerSentCount,
    topRegions,
    topCategories,
    topProviders,
  ] = await Promise.all([
    prisma.provider.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
      select: {
        id: true,
        companyName: true,
        contactName: true,
        region: true,
        credits: true,
        status: true,
        createdAt: true,
      },
    }),

    prisma.lead.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
      select: {
        id: true,
        title: true,
        region: true,
        category: true,
        price: true,
        createdAt: true,
        _count: {
          select: {
            purchases: true,
          },
        },
      },
    }),

    prisma.leadPurchase.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
      include: {
        provider: {
          select: {
            id: true,
            companyName: true,
          },
        },
        lead: {
          select: {
            id: true,
            title: true,
            region: true,
          },
        },
      },
    }),

    prisma.creditPurchase.findMany({
      where: {
        status: "paid",
      },
      orderBy: { createdAt: "desc" },
      take: 8,
      include: {
        provider: {
          select: {
            id: true,
            companyName: true,
          },
        },
      },
    }),

    prisma.provider.count(),
    prisma.provider.count({ where: { status: "PENDING" } }),
    prisma.provider.count({ where: { status: "APPROVED" } }),
    prisma.provider.count({ where: { status: "BLOCKED" } }),
    prisma.provider.count({ where: { createdAt: { gte: today } } }),
    prisma.provider.count({ where: { createdAt: { gte: last7Days } } }),
    prisma.provider.count({
      where: {
        createdAt: {
          gte: previous7DaysStart,
          lt: last7Days,
        },
      },
    }),

    prisma.lead.count(),
    prisma.lead.count({ where: { createdAt: { gte: today } } }),
    prisma.lead.count({ where: { createdAt: { gte: last7Days } } }),
    prisma.lead.count({
      where: {
        createdAt: {
          gte: previous7DaysStart,
          lt: last7Days,
        },
      },
    }),

    prisma.leadPurchase.count(),
    prisma.leadPurchase.count({ where: { createdAt: { gte: today } } }),
    prisma.leadPurchase.count({ where: { createdAt: { gte: last7Days } } }),
    prisma.leadPurchase.count({
      where: {
        createdAt: {
          gte: previous7DaysStart,
          lt: last7Days,
        },
      },
    }),

    prisma.creditPurchase.aggregate({
      where: { status: "paid" },
      _sum: {
        amount: true,
        credits: true,
      },
      _count: {
        id: true,
      },
    }),

    prisma.creditPurchase.aggregate({
      where: {
        status: "paid",
        createdAt: {
          gte: today,
        },
      },
      _sum: {
        amount: true,
      },
    }),

    prisma.creditPurchase.aggregate({
      where: {
        status: "paid",
        createdAt: {
          gte: monthStart,
        },
      },
      _sum: {
        amount: true,
      },
    }),

    prisma.creditPurchase.aggregate({
      where: {
        status: "paid",
        createdAt: {
          gte: last7Days,
        },
      },
      _sum: {
        amount: true,
      },
    }),

    prisma.creditPurchase.aggregate({
      where: {
        status: "paid",
        createdAt: {
          gte: previous7DaysStart,
          lt: last7Days,
        },
      },
      _sum: {
        amount: true,
      },
    }),

    prisma.leadPurchase.aggregate({
      _sum: {
        price: true,
      },
    }),

    prisma.leadPurchase.count({
      where: {
        status: "WON",
      },
    }),

    prisma.leadPurchase.count({
      where: {
        status: {
          in: ["CONTACTED", "APPOINTMENT_SET", "OFFER_SENT", "WON"],
        },
      },
    }),

    prisma.leadPurchase.count({
      where: {
        status: {
          in: ["OFFER_SENT", "WON"],
        },
      },
    }),

    prisma.lead.groupBy({
      by: ["region"],
      where: {
        createdAt: {
          gte: last30Days,
        },
      },
      _count: {
        _all: true,
      },
      orderBy: {
        _count: {
          region: "desc",
        },
      },
      take: 5,
    }),

    prisma.lead.groupBy({
      by: ["category"],
      where: {
        createdAt: {
          gte: last30Days,
        },
      },
      _count: {
        _all: true,
      },
      orderBy: {
        _count: {
          category: "desc",
        },
      },
      take: 5,
    }),

    prisma.leadPurchase.groupBy({
      by: ["providerId"],
      _count: {
        _all: true,
      },
      _sum: {
        price: true,
      },
      orderBy: {
        _count: {
          providerId: "desc",
        },
      },
      take: 5,
    }),
  ]);

  const topProviderIds = topProviders.map((item) => item.providerId);

  const topProviderDetails =
    topProviderIds.length > 0
      ? await prisma.provider.findMany({
          where: {
            id: {
              in: topProviderIds,
            },
          },
          select: {
            id: true,
            companyName: true,
            region: true,
          },
        })
      : [];

  const providerMap = new Map(
    topProviderDetails.map((provider) => [provider.id, provider])
  );

  const totalRevenue = paidCreditAggregate._sum.amount ?? 0;
  const revenueToday = revenueTodayAggregate._sum.amount ?? 0;
  const revenueMonth = revenueMonthAggregate._sum.amount ?? 0;
  const revenueLast7 = revenueLast7Aggregate._sum.amount ?? 0;
  const revenuePrevious7 = revenuePrevious7Aggregate._sum.amount ?? 0;
  const revenueGrowth = growth(revenueLast7, revenuePrevious7);

  const totalCreditsSold = paidCreditAggregate._sum.credits ?? 0;
  const totalPayments = paidCreditAggregate._count.id;
  const totalLeadCreditsSpent = leadCreditsAggregate._sum.price ?? 0;

  const approvalRate = percentage(approvedProviderCount, providerCount);
  const purchaseRate = percentage(leadPurchaseCount, leadCount);
  const contactedRate = percentage(contactedCount, leadPurchaseCount);
  const offerRate = percentage(offerSentCount, leadPurchaseCount);
  const wonRate = percentage(wonCount, leadPurchaseCount);

  const maxRegionCount = Math.max(
    ...topRegions.map((item) => item._count._all),
    1
  );

  const maxCategoryCount = Math.max(
    ...topCategories.map((item) => item._count._all),
    1
  );

  const activityFeed = [
    ...latestProviders.map((provider) => ({
      id: `provider-${provider.id}`,
      type: "provider",
      date: provider.createdAt,
      title: "Neue Anbieterregistrierung",
      text: `${provider.companyName} · ${provider.region || "Keine Region"}`,
      href: "/admin/providers",
    })),
    ...latestLeads.map((lead) => ({
      id: `lead-${lead.id}`,
      type: "lead",
      date: lead.createdAt,
      title: "Neuer Lead",
      text: `${lead.title} · ${lead.region}`,
      href: "/admin/leads",
    })),
    ...latestLeadPurchases.map((purchase) => ({
      id: `purchase-${purchase.id}`,
      type: "purchase",
      date: purchase.createdAt,
      title: "Lead gekauft",
      text: `${purchase.provider.companyName} · ${purchase.lead.title}`,
      href: `/leads/${purchase.lead.id}`,
    })),
    ...latestCreditPurchases.map((purchase) => ({
      id: `payment-${purchase.id}`,
      type: "payment",
      date: purchase.createdAt,
      title: "Credit-Zahlung eingegangen",
      text: `${purchase.provider.companyName} · ${formatMoney(
        purchase.amount,
        purchase.currency
      )}`,
      href: "/admin/providers",
    })),
  ]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 10);

  const kpis = [
    {
      label: "Umsatz heute",
      value: formatMoney(revenueToday),
      detail: `${revenueGrowth >= 0 ? "+" : ""}${revenueGrowth}% letzte 7 Tage`,
      icon: "CHF",
      tone: "emerald",
    },
    {
      label: "Umsatz diesen Monat",
      value: formatMoney(revenueMonth),
      detail: `${formatMoney(totalRevenue)} Gesamtumsatz`,
      icon: "↗",
      tone: "blue",
    },
    {
      label: "Anbieter",
      value: formatNumber(providerCount),
      detail: `+${providersToday} heute · ${pendingProviderCount} offen`,
      icon: "P",
      tone: "violet",
    },
    {
      label: "Lead-Verkäufe",
      value: formatNumber(leadPurchaseCount),
      detail: `+${leadPurchasesToday} heute`,
      icon: "K",
      tone: "amber",
    },
  ];

  return (
    <main className="admin-page">
      <div className="admin-backdrop" />

      <div className="admin-shell">
        <header className="admin-hero">
          <div>
            <div className="admin-kicker">
              <span className="admin-live-dot" />
              Auftrago Administration
            </div>

            <h1>Willkommen zurück, Dejan.</h1>

            <p>
              Umsatz, Anbieter, Leads und Verkäufe in einer zentralen
              Unternehmensansicht.
            </p>
          </div>

          <div className="admin-actions">
            <Link href="/admin/leads" className="admin-btn admin-btn-primary">
              + Neuer Lead
            </Link>

            <Link
              href="/admin/providers"
              className="admin-btn admin-btn-secondary"
            >
              Anbieter verwalten
            </Link>

            <Link href="/dashboard" className="admin-btn admin-btn-secondary">
              Anbieterportal
            </Link>

            <Link href="/admin-logout" className="admin-btn admin-btn-ghost">
              Abmelden
            </Link>
          </div>
        </header>

        {pendingProviderCount > 0 ? (
          <Link href="/admin/providers" className="admin-alert">
            <div>
              <span>Handlungsbedarf</span>
              <strong>
                {pendingProviderCount}{" "}
                {pendingProviderCount === 1
                  ? "Anbieter wartet"
                  : "Anbieter warten"}{" "}
                auf Freigabe
              </strong>
            </div>

            <b>Jetzt prüfen →</b>
          </Link>
        ) : null}

        <section className="admin-kpi-grid">
          {kpis.map((item) => (
            <article
              className={`admin-kpi admin-kpi-${item.tone}`}
              key={item.label}
            >
              <div className="admin-kpi-head">
                <span>{item.label}</span>
                <b>{item.icon}</b>
              </div>

              <strong>{item.value}</strong>
              <small>{item.detail}</small>
            </article>
          ))}
        </section>

        <section className="admin-main-grid">
          <article className="admin-panel admin-live-panel">
            <div className="admin-panel-head">
              <div>
                <span>Live Feed</span>
                <h2>Was gerade passiert</h2>
              </div>

              <small>Automatisch aktualisiert</small>
            </div>

            <div className="admin-activity-list">
              {activityFeed.length === 0 ? (
                <p className="admin-empty">Noch keine Aktivitäten vorhanden.</p>
              ) : (
                activityFeed.map((item) => (
                  <Link
                    href={item.href}
                    key={item.id}
                    className="admin-activity-row"
                  >
                    <div
                      className={`admin-activity-icon activity-${item.type}`}
                    >
                      {activityIcon(item.type)}
                    </div>

                    <div className="admin-activity-copy">
                      <strong>{item.title}</strong>
                      <span>{item.text}</span>
                    </div>

                    <time>{formatDate(item.date)}</time>
                  </Link>
                ))
              )}
            </div>
          </article>

          <article className="admin-panel admin-funnel-panel">
            <div className="admin-panel-head">
              <div>
                <span>Conversion</span>
                <h2>Verkaufs-Funnel</h2>
              </div>
            </div>

            <div className="admin-funnel">
              {[
                {
                  label: "Leads",
                  value: leadCount,
                  percent: 100,
                },
                {
                  label: "Gekauft",
                  value: leadPurchaseCount,
                  percent: purchaseRate,
                },
                {
                  label: "Kontaktiert",
                  value: contactedCount,
                  percent: contactedRate,
                },
                {
                  label: "Offerte",
                  value: offerSentCount,
                  percent: offerRate,
                },
                {
                  label: "Gewonnen",
                  value: wonCount,
                  percent: wonRate,
                },
              ].map((item) => (
                <div className="admin-funnel-row" key={item.label}>
                  <div className="admin-funnel-title">
                    <span>{item.label}</span>
                    <strong>{formatNumber(item.value)}</strong>
                  </div>

                  <div className="admin-funnel-track">
                    <i style={{ width: `${Math.max(item.percent, 3)}%` }} />
                  </div>

                  <small>{item.percent}%</small>
                </div>
              ))}
            </div>

            <div className="admin-mini-stats">
              <div>
                <span>Genehmigt</span>
                <strong>{approvedProviderCount}</strong>
              </div>

              <div>
                <span>Ausstehend</span>
                <strong>{pendingProviderCount}</strong>
              </div>

              <div>
                <span>Freigabequote</span>
                <strong>{approvalRate}%</strong>
              </div>
            </div>
          </article>
        </section>

        <section className="admin-metric-grid">
          <article className="admin-panel admin-number-panel">
            <span>Credits verkauft</span>
            <strong>{formatNumber(totalCreditsSold)}</strong>
            <small>{formatNumber(totalPayments)} bezahlte Pakete</small>
          </article>

          <article className="admin-panel admin-number-panel">
            <span>Credits eingesetzt</span>
            <strong>{formatNumber(totalLeadCreditsSpent)}</strong>
            <small>Für freigeschaltete Leads</small>
          </article>

          <article className="admin-panel admin-number-panel">
            <span>Neue Leads heute</span>
            <strong>{formatNumber(leadsToday)}</strong>
            <small>{formatNumber(leadCount)} Leads insgesamt</small>
          </article>

          <article className="admin-panel admin-number-panel">
            <span>Neue Anbieter heute</span>
            <strong>{formatNumber(providersToday)}</strong>
            <small>{formatNumber(blockedProviderCount)} gesperrt</small>
          </article>
        </section>

        <section className="admin-ranking-grid">
          <article className="admin-panel">
            <div className="admin-panel-head">
              <div>
                <span>Letzte 30 Tage</span>
                <h2>Top-Regionen</h2>
              </div>
            </div>

            <div className="admin-ranking-list">
              {topRegions.length === 0 ? (
                <p className="admin-empty">Noch keine Daten.</p>
              ) : (
                topRegions.map((item, index) => (
                  <div className="admin-ranking-row" key={item.region}>
                    <div className="admin-ranking-label">
                      <b>{index + 1}</b>
                      <span>{item.region || "Ohne Region"}</span>
                    </div>

                    <div className="admin-ranking-bar">
                      <i
                        style={{
                          width: `${Math.round(
                            (item._count._all / maxRegionCount) * 100
                          )}%`,
                        }}
                      />
                    </div>

                    <strong>{item._count._all}</strong>
                  </div>
                ))
              )}
            </div>
          </article>

          <article className="admin-panel">
            <div className="admin-panel-head">
              <div>
                <span>Letzte 30 Tage</span>
                <h2>Top-Kategorien</h2>
              </div>
            </div>

            <div className="admin-ranking-list">
              {topCategories.length === 0 ? (
                <p className="admin-empty">Noch keine Daten.</p>
              ) : (
                topCategories.map((item, index) => (
                  <div className="admin-ranking-row" key={item.category}>
                    <div className="admin-ranking-label">
                      <b>{index + 1}</b>
                      <span>{item.category || "Ohne Kategorie"}</span>
                    </div>

                    <div className="admin-ranking-bar">
                      <i
                        style={{
                          width: `${Math.round(
                            (item._count._all / maxCategoryCount) * 100
                          )}%`,
                        }}
                      />
                    </div>

                    <strong>{item._count._all}</strong>
                  </div>
                ))
              )}
            </div>
          </article>

          <article className="admin-panel">
            <div className="admin-panel-head">
              <div>
                <span>Nach Käufen</span>
                <h2>Top-Anbieter</h2>
              </div>
            </div>

            <div className="admin-provider-ranking">
              {topProviders.length === 0 ? (
                <p className="admin-empty">Noch keine Käufe.</p>
              ) : (
                topProviders.map((item, index) => {
                  const provider = providerMap.get(item.providerId);
                  const name =
                    provider?.companyName || "Unbekannter Anbieter";

                  return (
                    <div
                      className="admin-provider-rank-row"
                      key={item.providerId}
                    >
                      <div className="admin-rank-position">{index + 1}</div>
                      <div className="admin-avatar">{initials(name)}</div>

                      <div className="admin-provider-copy">
                        <strong>{name}</strong>
                        <span>{provider?.region || "Keine Region"}</span>
                      </div>

                      <div className="admin-rank-value">
                        <strong>{item._count._all}</strong>
                        <span>Käufe</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </article>
        </section>

        <section className="admin-double-grid">
          <article className="admin-panel">
            <div className="admin-panel-head">
              <div>
                <span>Neueste</span>
                <h2>Anbieter</h2>
              </div>

              <Link href="/admin/providers">Alle anzeigen →</Link>
            </div>

            <div className="admin-compact-list">
              {latestProviders.map((provider) => {
                const status = providerStatus(provider.status);

                return (
                  <div className="admin-compact-row" key={provider.id}>
                    <div className="admin-avatar">
                      {initials(provider.companyName)}
                    </div>

                    <div className="admin-compact-main">
                      <strong>{provider.companyName}</strong>
                      <span>
                        {provider.contactName} ·{" "}
                        {provider.region || "Keine Region"}
                      </span>
                    </div>

                    <span
                      className={`admin-status ${status.className}`}
                    >
                      {status.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </article>

          <article className="admin-panel">
            <div className="admin-panel-head">
              <div>
                <span>Neueste</span>
                <h2>Leads</h2>
              </div>

              <Link href="/admin/leads">Alle anzeigen →</Link>
            </div>

            <div className="admin-compact-list">
              {latestLeads.map((lead) => (
                <div className="admin-compact-row" key={lead.id}>
                  <div className="admin-lead-price">{lead.price}</div>

                  <div className="admin-compact-main">
                    <strong>{lead.title}</strong>
                    <span>
                      {lead.region} · {lead.category}
                    </span>
                  </div>

                  <div className="admin-sales-count">
                    <strong>{lead._count.purchases}</strong>
                    <span>Verkäufe</span>
                  </div>
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="admin-quick-actions">
          <Link href="/admin/leads">
            <span>＋</span>
            <strong>Neuen Lead erstellen</strong>
            <small>Kundenanfrage erfassen</small>
          </Link>

          <Link href="/admin/providers">
            <span>✓</span>
            <strong>Anbieter freigeben</strong>
            <small>Profile prüfen und verwalten</small>
          </Link>

          <Link href="/admin/activity">
            <span>↗</span>
            <strong>Aktivitäten prüfen</strong>
            <small>Logins und Nutzung analysieren</small>
          </Link>

          <Link href="/dashboard">
            <span>⌂</span>
            <strong>Anbieterportal öffnen</strong>
            <small>Live-Ansicht kontrollieren</small>
          </Link>
        </section>
      </div>
    </main>
  );
}