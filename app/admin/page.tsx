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

function providerStatus(status: string) {
  if (status === "APPROVED") {
    return {
      label: "Genehmigt",
      color: "#86efac",
      background: "rgba(34,197,94,.12)",
      border: "rgba(34,197,94,.26)",
    };
  }

  if (status === "BLOCKED") {
    return {
      label: "Gesperrt",
      color: "#fca5a5",
      background: "rgba(239,68,68,.12)",
      border: "rgba(239,68,68,.26)",
    };
  }

  return {
    label: "Ausstehend",
    color: "#fde68a",
    background: "rgba(250,204,21,.10)",
    border: "rgba(250,204,21,.26)",
  };
}

function initials(value: string) {
  return value
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export default async function AdminDashboardPage() {
  const now = new Date();
  const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);
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
    providersLast24Hours,
    leadCount,
    leadsLast24Hours,
    leadPurchaseCount,
    leadPurchasesLast24Hours,
    creditPurchasesLast24Hours,
    leadCreditsAggregate,
    paidCreditAggregate,
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
        email: true,
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
        _count: { select: { purchases: true } },
      },
    }),

    prisma.leadPurchase.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
      include: {
        provider: {
          select: { id: true, companyName: true, email: true },
        },
        lead: {
          select: {
            id: true,
            title: true,
            region: true,
            category: true,
          },
        },
      },
    }),

    prisma.creditPurchase.findMany({
      where: { status: "paid" },
      orderBy: { createdAt: "desc" },
      take: 6,
      include: {
        provider: {
          select: { id: true, companyName: true, email: true },
        },
      },
    }),

    prisma.provider.count(),
    prisma.provider.count({ where: { status: "PENDING" } }),
    prisma.provider.count({ where: { status: "APPROVED" } }),
    prisma.provider.count({ where: { status: "BLOCKED" } }),
    prisma.provider.count({ where: { createdAt: { gte: last24Hours } } }),

    prisma.lead.count(),
    prisma.lead.count({ where: { createdAt: { gte: last24Hours } } }),
    prisma.leadPurchase.count(),
    prisma.leadPurchase.count({ where: { createdAt: { gte: last24Hours } } }),
    prisma.creditPurchase.count({
      where: { status: "paid", createdAt: { gte: last24Hours } },
    }),

    prisma.leadPurchase.aggregate({ _sum: { price: true } }),
    prisma.creditPurchase.aggregate({
      where: { status: "paid" },
      _sum: { amount: true, credits: true },
      _count: { id: true },
    }),

    prisma.lead.groupBy({
      by: ["region"],
      where: { createdAt: { gte: last30Days } },
      _count: { _all: true },
      orderBy: { _count: { region: "desc" } },
      take: 5,
    }),

    prisma.lead.groupBy({
      by: ["category"],
      where: { createdAt: { gte: last30Days } },
      _count: { _all: true },
      orderBy: { _count: { category: "desc" } },
      take: 5,
    }),

    prisma.leadPurchase.groupBy({
      by: ["providerId"],
      _count: { _all: true },
      _sum: { price: true },
      orderBy: { _count: { providerId: "desc" } },
      take: 5,
    }),
  ]);

  const topProviderIds = topProviders.map((item) => item.providerId);
  const topProviderDetails = topProviderIds.length
    ? await prisma.provider.findMany({
        where: { id: { in: topProviderIds } },
        select: { id: true, companyName: true, region: true },
      })
    : [];

  const providerMap = new Map(
    topProviderDetails.map((provider) => [provider.id, provider]),
  );

  const totalLeadCreditsSpent = leadCreditsAggregate._sum.price ?? 0;
  const totalStripeRevenue = paidCreditAggregate._sum.amount ?? 0;
  const totalCreditsSold = paidCreditAggregate._sum.credits ?? 0;
  const totalStripePayments = paidCreditAggregate._count.id;
  const approvalRate = percentage(approvedProviderCount, providerCount);
  const leadConversion = percentage(leadPurchaseCount, leadCount);
  const maxRegionCount = Math.max(
    ...topRegions.map((item) => item._count._all),
    1,
  );
  const maxCategoryCount = Math.max(
    ...topCategories.map((item) => item._count._all),
    1,
  );

  const activityFeed = [
    ...latestProviders.map((provider) => ({
      id: `provider-${provider.id}`,
      date: provider.createdAt,
      icon: "P",
      title: "Neue Anbieterregistrierung",
      text: `${provider.companyName} · ${provider.region || "Keine Region"}`,
      href: "/admin/providers",
      tone: "violet",
    })),
    ...latestLeads.map((lead) => ({
      id: `lead-${lead.id}`,
      date: lead.createdAt,
      icon: "L",
      title: "Neuer Lead",
      text: `${lead.title} · ${lead.region}`,
      href: "/admin/leads",
      tone: "blue",
    })),
    ...latestLeadPurchases.map((purchase) => ({
      id: `lead-purchase-${purchase.id}`,
      date: purchase.createdAt,
      icon: "K",
      title: "Lead gekauft",
      text: `${purchase.provider.companyName} · ${purchase.lead.title}`,
      href: `/portal/leads/${purchase.lead.id}`,
      tone: "green",
    })),
    ...latestCreditPurchases.map((purchase) => ({
      id: `credit-purchase-${purchase.id}`,
      date: purchase.createdAt,
      icon: "CHF",
      title: "Credit-Zahlung eingegangen",
      text: `${purchase.provider.companyName} · ${formatMoney(
        purchase.amount,
        purchase.currency,
      )}`,
      href: "/portal/transaktionen",
      tone: "gold",
    })),
  ]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 8);

  return (
    <main className="page">
      <section className="premium-admin">
        <div className="container">
          <header className="dashboard-hero">
            <div>
              <div className="hero-kicker">
                <span className="live-dot" /> Auftrago Administration
              </div>
              <h1>Willkommen zurück, Dejan.</h1>
              <p>
                Alle wichtigen Zahlen, Verkäufe und Aktivitäten deiner
                Plattform auf einen Blick.
              </p>
            </div>

            <div className="hero-actions">
              <Link href="/admin/leads" className="btn btn-primary">
                + Neuer Lead
              </Link>
              <Link href="/admin/providers" className="btn btn-secondary">
                Anbieter prüfen
              </Link>
              <Link href="/portal" className="btn btn-secondary">
                Portal öffnen
              </Link>
              <Link href="/admin-logout" className="btn btn-secondary">
                Abmelden
              </Link>
            </div>
          </header>

          {pendingProviderCount > 0 ? (
            <Link href="/admin/providers" className="review-banner">
              <div>
                <span>Handlungsbedarf</span>
                <strong>
                  {pendingProviderCount} neue
                  {pendingProviderCount === 1 ? " Anbieter wartet" : " Anbieter warten"}{" "}
                  auf Freigabe
                </strong>
              </div>
              <b>Jetzt prüfen →</b>
            </Link>
          ) : null}

          <section className="kpi-grid">
            <article className="kpi-card kpi-purple">
              <div className="kpi-top"><span>Anbieter</span><b>👥</b></div>
              <strong>{formatNumber(providerCount)}</strong>
              <small>+{providersLast24Hours} in den letzten 24 Stunden</small>
            </article>

            <article className="kpi-card kpi-blue">
              <div className="kpi-top"><span>Leads</span><b>📋</b></div>
              <strong>{formatNumber(leadCount)}</strong>
              <small>+{leadsLast24Hours} neue Leads in 24 Stunden</small>
            </article>

            <article className="kpi-card kpi-green">
              <div className="kpi-top"><span>Stripe-Umsatz</span><b>💳</b></div>
              <strong>{formatMoney(totalStripeRevenue)}</strong>
              <small>{creditPurchasesLast24Hours} Zahlungen in 24 Stunden</small>
            </article>

            <article className="kpi-card kpi-gold">
              <div className="kpi-top"><span>Credits verkauft</span><b>🪙</b></div>
              <strong>{formatNumber(totalCreditsSold)}</strong>
              <small>{formatNumber(totalStripePayments)} bezahlte Pakete</small>
            </article>

            <article className="kpi-card">
              <div className="kpi-top"><span>Lead-Verkäufe</span><b>⚡</b></div>
              <strong>{formatNumber(leadPurchaseCount)}</strong>
              <small>{leadPurchasesLast24Hours} Käufe in 24 Stunden</small>
            </article>

            <article className="kpi-card">
              <div className="kpi-top"><span>Credits eingesetzt</span><b>↗</b></div>
              <strong>{formatNumber(totalLeadCreditsSpent)}</strong>
              <small>Für freigeschaltete Leads</small>
            </article>
          </section>

          <section className="main-grid">
            <article className="panel activity-panel">
              <div className="panel-head">
                <div><span>Live</span><h2>Aktivitäten</h2></div>
                <small>Automatisch aktualisiert</small>
              </div>

              <div className="activity-list">
                {activityFeed.length === 0 ? (
                  <p className="empty-state">Noch keine Aktivitäten vorhanden.</p>
                ) : (
                  activityFeed.map((item) => (
                    <Link href={item.href} key={item.id} className="activity-row">
                      <div className={`activity-icon tone-${item.tone}`}>{item.icon}</div>
                      <div className="activity-copy">
                        <strong>{item.title}</strong>
                        <span>{item.text}</span>
                      </div>
                      <time>{formatDate(item.date)}</time>
                    </Link>
                  ))
                )}
              </div>
            </article>

            <article className="panel funnel-panel">
              <div className="panel-head">
                <div><span>Performance</span><h2>Conversion-Funnel</h2></div>
              </div>

              <div className="funnel-list">
                <div className="funnel-row">
                  <div><span>Registriert</span><strong>{providerCount}</strong></div>
                  <div className="funnel-track"><i style={{ width: "100%" }} /></div>
                  <small>100%</small>
                </div>
                <div className="funnel-row">
                  <div><span>Genehmigt</span><strong>{approvedProviderCount}</strong></div>
                  <div className="funnel-track"><i style={{ width: `${approvalRate}%` }} /></div>
                  <small>{approvalRate}%</small>
                </div>
                <div className="funnel-row">
                  <div><span>Lead-Verkäufe</span><strong>{leadPurchaseCount}</strong></div>
                  <div className="funnel-track"><i style={{ width: `${Math.min(100, leadConversion)}%` }} /></div>
                  <small>{leadConversion}%</small>
                </div>
              </div>

              <div className="status-grid">
                <div><span>Ausstehend</span><strong>{pendingProviderCount}</strong></div>
                <div><span>Gesperrt</span><strong>{blockedProviderCount}</strong></div>
                <div><span>Freigabequote</span><strong>{approvalRate}%</strong></div>
              </div>
            </article>
          </section>

          <section className="triple-grid">
            <article className="panel">
              <div className="panel-head"><div><span>Letzte 30 Tage</span><h2>Top-Regionen</h2></div></div>
              <div className="ranking-list">
                {topRegions.length === 0 ? <p className="empty-state">Noch keine Daten.</p> : topRegions.map((item, index) => (
                  <div className="ranking-row" key={`${item.region}-${index}`}>
                    <div className="ranking-label"><b>{index + 1}</b><span>{item.region || "Ohne Region"}</span></div>
                    <div className="ranking-bar"><i style={{ width: `${Math.round((item._count._all / maxRegionCount) * 100)}%` }} /></div>
                    <strong>{item._count._all}</strong>
                  </div>
                ))}
              </div>
            </article>

            <article className="panel">
              <div className="panel-head"><div><span>Letzte 30 Tage</span><h2>Top-Kategorien</h2></div></div>
              <div className="ranking-list">
                {topCategories.length === 0 ? <p className="empty-state">Noch keine Daten.</p> : topCategories.map((item, index) => (
                  <div className="ranking-row" key={`${item.category}-${index}`}>
                    <div className="ranking-label"><b>{index + 1}</b><span>{item.category || "Ohne Kategorie"}</span></div>
                    <div className="ranking-bar"><i style={{ width: `${Math.round((item._count._all / maxCategoryCount) * 100)}%` }} /></div>
                    <strong>{item._count._all}</strong>
                  </div>
                ))}
              </div>
            </article>

            <article className="panel">
              <div className="panel-head"><div><span>Nach Käufen</span><h2>Top-Anbieter</h2></div></div>
              <div className="provider-ranking">
                {topProviders.length === 0 ? <p className="empty-state">Noch keine Käufe.</p> : topProviders.map((item, index) => {
                  const provider = providerMap.get(item.providerId);
                  const name = provider?.companyName || "Unbekannter Anbieter";
                  return (
                    <div className="provider-rank-row" key={item.providerId}>
                      <div className="avatar">{initials(name)}</div>
                      <div><strong>{name}</strong><span>{provider?.region || "Keine Region"}</span></div>
                      <div className="rank-number"><strong>{item._count._all}</strong><span>Käufe</span></div>
                    </div>
                  );
                })}
              </div>
            </article>
          </section>

          <section className="double-grid">
            <article className="panel">
              <div className="panel-head">
                <div><span>Neueste</span><h2>Anbieter</h2></div>
                <Link href="/admin/providers">Alle anzeigen →</Link>
              </div>
              <div className="compact-list">
                {latestProviders.map((provider) => {
                  const status = providerStatus(provider.status);
                  return (
                    <div className="compact-row" key={provider.id}>
                      <div className="avatar">{initials(provider.companyName)}</div>
                      <div className="compact-main"><strong>{provider.companyName}</strong><span>{provider.contactName} · {provider.region || "Keine Region"}</span></div>
                      <span className="status-badge" style={{ color: status.color, background: status.background, borderColor: status.border }}>{status.label}</span>
                    </div>
                  );
                })}
              </div>
            </article>

            <article className="panel">
              <div className="panel-head">
                <div><span>Neueste</span><h2>Leads</h2></div>
                <Link href="/admin/leads">Alle anzeigen →</Link>
              </div>
              <div className="compact-list">
                {latestLeads.map((lead) => (
                  <div className="compact-row" key={lead.id}>
                    <div className="lead-price">{lead.price}</div>
                    <div className="compact-main"><strong>{lead.title}</strong><span>{lead.region} · {lead.category}</span></div>
                    <div className="sales-count"><strong>{lead._count.purchases}</strong><span>Verkäufe</span></div>
                  </div>
                ))}
              </div>
            </article>
          </section>

          <section className="quick-actions">
            <Link href="/admin/leads"><span>＋</span><strong>Neuen Lead erstellen</strong><small>Kundenanfrage erfassen</small></Link>
            <Link href="/admin/providers"><span>✓</span><strong>Anbieter freigeben</strong><small>Profile prüfen und verwalten</small></Link>
            <Link href="/portal/transaktionen"><span>↗</span><strong>Transaktionen</strong><small>Zahlungen und Credits prüfen</small></Link>
            <Link href="/portal"><span>⌂</span><strong>Portal öffnen</strong><small>Anbieteransicht kontrollieren</small></Link>
          </section>
        </div>
      </section>
    </main>
  );
}
