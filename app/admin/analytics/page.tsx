import Link from "next/link";
import AdminAutoRefresh from "@/components/admin/admin-auto-refresh";
import ActivityChart from "@/components/admin/analytics/ActivityChart";
import ConversionFunnel from "@/components/admin/analytics/ConversionFunnel";
import Forecast from "@/components/admin/analytics/Forecast";
import KPICards from "@/components/admin/analytics/KPICards";
import LiveFeed from "@/components/admin/analytics/LiveFeed";
import RevenueChart from "@/components/admin/analytics/RevenueChart";
import TopCategories from "@/components/admin/analytics/TopCategories";
import TopProviders from "@/components/admin/analytics/TopProviders";
import TopRegions from "@/components/admin/analytics/TopRegions";
import type {
  DailyPoint,
  ForecastData,
  LiveFeedItem,
  RankingItem,
} from "@/components/admin/analytics/types";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

function startOfDay(date: Date) {
  const value = new Date(date);
  value.setHours(0, 0, 0, 0);
  return value;
}

function addDays(date: Date, days: number) {
  const value = new Date(date);
  value.setDate(value.getDate() + days);
  return value;
}

function dateKey(date: Date) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

function formatDay(date: Date) {
  return new Intl.DateTimeFormat("de-CH", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
    timeZone: "Europe/Zurich",
  }).format(date);
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("de-CH", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Zurich",
  }).format(date);
}

function formatMoney(amountInRappen: number, currency = "CHF") {
  return new Intl.NumberFormat("de-CH", {
    style: "currency",
    currency: currency.toUpperCase(),
    minimumFractionDigits: 2,
  }).format(amountInRappen / 100);
}

function percent(value: number, total: number) {
  if (total <= 0) return 0;
  return Math.round((value / total) * 100);
}

function growth(current: number, previous: number) {
  if (previous <= 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
}

export default async function AdminAnalyticsPage() {
  const now = new Date();
  const today = startOfDay(now);
  const tomorrow = addDays(today, 1);
  const sevenDaysAgo = addDays(today, -6);
  const fourteenDaysAgo = addDays(today, -13);
  const thirtyDaysAgo = addDays(today, -29);

  const [
    providerCount,
    leadCount,
    leadPurchaseCount,
    paidCreditAggregate,
    providersLast7Days,
    providersPrevious7Days,
    leadsLast7Days,
    leadsPrevious7Days,
    leadPurchasesLast7Days,
    leadPurchasesPrevious7Days,
    creditRevenueLast7Days,
    creditRevenuePrevious7Days,
    leadsForChart,
    providersForChart,
    leadPurchasesForChart,
    creditPurchasesForChart,
    recentLeadPurchases,
    recentCreditPurchases,
    recentProviders,
    recentLeads,
    leadsForRanking,
    leadPurchasesForRanking,
  ] = await Promise.all([
    prisma.provider.count(),
    prisma.lead.count(),
    prisma.leadPurchase.count(),
    prisma.creditPurchase.aggregate({
      where: { status: "paid" },
      _sum: { amount: true, credits: true },
      _count: { id: true },
    }),
    prisma.provider.count({
      where: { createdAt: { gte: sevenDaysAgo, lt: tomorrow } },
    }),
    prisma.provider.count({
      where: { createdAt: { gte: fourteenDaysAgo, lt: sevenDaysAgo } },
    }),
    prisma.lead.count({
      where: { createdAt: { gte: sevenDaysAgo, lt: tomorrow } },
    }),
    prisma.lead.count({
      where: { createdAt: { gte: fourteenDaysAgo, lt: sevenDaysAgo } },
    }),
    prisma.leadPurchase.count({
      where: { createdAt: { gte: sevenDaysAgo, lt: tomorrow } },
    }),
    prisma.leadPurchase.count({
      where: { createdAt: { gte: fourteenDaysAgo, lt: sevenDaysAgo } },
    }),
    prisma.creditPurchase.aggregate({
      where: {
        status: "paid",
        createdAt: { gte: sevenDaysAgo, lt: tomorrow },
      },
      _sum: { amount: true },
    }),
    prisma.creditPurchase.aggregate({
      where: {
        status: "paid",
        createdAt: { gte: fourteenDaysAgo, lt: sevenDaysAgo },
      },
      _sum: { amount: true },
    }),
    prisma.lead.findMany({
      where: { createdAt: { gte: thirtyDaysAgo, lt: tomorrow } },
      select: { id: true, createdAt: true },
    }),
    prisma.provider.findMany({
      where: { createdAt: { gte: thirtyDaysAgo, lt: tomorrow } },
      select: { id: true, createdAt: true },
    }),
    prisma.leadPurchase.findMany({
      where: { createdAt: { gte: thirtyDaysAgo, lt: tomorrow } },
      select: { id: true, createdAt: true, price: true },
    }),
    prisma.creditPurchase.findMany({
      where: {
        status: "paid",
        createdAt: { gte: thirtyDaysAgo, lt: tomorrow },
      },
      select: { id: true, createdAt: true, amount: true },
    }),
    prisma.leadPurchase.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
      include: {
        provider: { select: { companyName: true } },
        lead: { select: { title: true, region: true, category: true } },
      },
    }),
    prisma.creditPurchase.findMany({
      where: { status: "paid" },
      orderBy: { createdAt: "desc" },
      take: 6,
      include: {
        provider: { select: { companyName: true } },
      },
    }),
    prisma.provider.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        companyName: true,
        region: true,
        status: true,
        createdAt: true,
      },
    }),
    prisma.lead.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        title: true,
        region: true,
        category: true,
        createdAt: true,
      },
    }),
    prisma.lead.findMany({
      select: {
        id: true,
        region: true,
        category: true,
      },
    }),
    prisma.leadPurchase.findMany({
      include: {
        provider: {
          select: {
            id: true,
            companyName: true,
          },
        },
      },
    }),
  ]);

  const totalStripeRevenue = paidCreditAggregate._sum.amount ?? 0;
  const totalCreditsSold = paidCreditAggregate._sum.credits ?? 0;
  const totalStripePayments = paidCreditAggregate._count.id;
  const soldLeadCount = new Set(
    leadPurchasesForRanking.map((item) => item.leadId),
  ).size;
  const leadConversionRate = percent(soldLeadCount, leadCount);

  const averageLeadPrice =
    leadPurchasesForRanking.length > 0
      ? Math.round(
          leadPurchasesForRanking.reduce(
            (sum, purchase) => sum + purchase.price,
            0,
          ) / leadPurchasesForRanking.length,
        )
      : 0;


  const activeProviderCount = new Set(
    leadPurchasesForRanking.map((purchase) => purchase.provider.id),
  ).size;

  const activeProviderRate = percent(
    activeProviderCount,
    providerCount,
  );

  const averageRevenuePerPayment =
    totalStripePayments > 0
      ? Math.round(totalStripeRevenue / totalStripePayments)
      : 0;

  const averagePurchasesPerSoldLead =
    soldLeadCount > 0
      ? Number(
          (leadPurchaseCount / soldLeadCount).toFixed(1),
        )
      : 0;

  const expiringLeadCount = await prisma.lead.count({
    where: {
      expiresAt: {
        gte: now,
        lte: addDays(now, 1),
      },
    },
  });

  const dailyMap = new Map<string, DailyPoint>();

  for (let index = 0; index < 7; index += 1) {
    const date = addDays(sevenDaysAgo, index);
    dailyMap.set(dateKey(date), {
      key: dateKey(date),
      label: formatDay(date),
      leads: 0,
      registrations: 0,
      leadPurchases: 0,
      creditRevenue: 0,
    });
  }

  leadsForChart.forEach((lead) => {
    const point = dailyMap.get(dateKey(lead.createdAt));
    if (point) point.leads += 1;
  });

  providersForChart.forEach((provider) => {
    const point = dailyMap.get(dateKey(provider.createdAt));
    if (point) point.registrations += 1;
  });

  leadPurchasesForChart.forEach((purchase) => {
    const point = dailyMap.get(dateKey(purchase.createdAt));
    if (point) point.leadPurchases += 1;
  });

  creditPurchasesForChart.forEach((purchase) => {
    const point = dailyMap.get(dateKey(purchase.createdAt));
    if (point) point.creditRevenue += purchase.amount;
  });

  const dailyPoints = Array.from(dailyMap.values());

  const regionMap = new Map<string, number>();
  const categoryMap = new Map<string, number>();

  leadsForRanking.forEach((lead) => {
    const region = lead.region || "Unbekannt";
    const category = lead.category || "Unbekannt";

    regionMap.set(region, (regionMap.get(region) ?? 0) + 1);
    categoryMap.set(category, (categoryMap.get(category) ?? 0) + 1);
  });

  const topRegions: RankingItem[] = Array.from(regionMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([label, value]) => ({ label, value }));

  const topCategories: RankingItem[] = Array.from(categoryMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([label, value]) => ({ label, value }));

  const providerStats = new Map<
    string,
    { companyName: string; purchases: number; creditsSpent: number }
  >();

  leadPurchasesForRanking.forEach((purchase) => {
    const existing = providerStats.get(purchase.provider.id) ?? {
      companyName: purchase.provider.companyName,
      purchases: 0,
      creditsSpent: 0,
    };

    existing.purchases += 1;
    existing.creditsSpent += purchase.price;
    providerStats.set(purchase.provider.id, existing);
  });

  const topProviders: RankingItem[] = Array.from(providerStats.values())
    .sort((a, b) => b.purchases - a.purchases)
    .slice(0, 6)
    .map((provider) => ({
      label: provider.companyName,
      value: provider.purchases,
      detail: `${provider.creditsSpent} Credits eingesetzt`,
    }));

  const liveFeed: LiveFeedItem[] = [
    ...recentLeadPurchases.map((purchase) => ({
      id: `lead-purchase-${purchase.id}`,
      date: purchase.createdAt,
      dateLabel: formatDate(purchase.createdAt),
      icon: "⚡",
      title: "Lead gekauft",
      description: `${purchase.provider.companyName} · ${purchase.lead.title}`,
      detail: `${purchase.price} Credits`,
    })),
    ...recentCreditPurchases.map((purchase) => ({
      id: `credit-purchase-${purchase.id}`,
      date: purchase.createdAt,
      dateLabel: formatDate(purchase.createdAt),
      icon: "💳",
      title: "Credits gekauft",
      description: purchase.provider.companyName,
      detail: formatMoney(purchase.amount, purchase.currency),
    })),
    ...recentProviders.map((provider) => ({
      id: `provider-${provider.id}`,
      date: provider.createdAt,
      dateLabel: formatDate(provider.createdAt),
      icon: "👥",
      title: "Neuer Anbieter",
      description: provider.companyName,
      detail: provider.region || provider.status,
    })),
    ...recentLeads.map((lead) => ({
      id: `lead-${lead.id}`,
      date: lead.createdAt,
      dateLabel: formatDate(lead.createdAt),
      icon: "📋",
      title: "Neuer Lead",
      description: lead.title,
      detail: `${lead.region} · ${lead.category}`,
    })),
  ]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 10)
    .map(({ date: _date, ...item }) => item);

  const creditRevenueLast7 = creditRevenueLast7Days._sum.amount ?? 0;
  const creditRevenuePrevious7 = creditRevenuePrevious7Days._sum.amount ?? 0;

  const forecast: ForecastData = {
    projectedRevenue: totalStripeRevenue > 0
      ? Math.round(
          creditPurchasesForChart.reduce(
            (sum, purchase) => sum + purchase.amount,
            0,
          ),
        )
      : 0,
    projectedLeads: leadsForChart.length,
    projectedProviders: providersForChart.length,
    confidence:
      leadsForChart.length + providersForChart.length + creditPurchasesForChart.length >= 20
        ? 82
        : leadsForChart.length + providersForChart.length >= 8
          ? 68
          : 52,
  };

  const strongestRegion = topRegions[0]?.label ?? "Keine Daten";
  const strongestCategory = topCategories[0]?.label ?? "Keine Daten";
  const strongestProvider = topProviders[0]?.label ?? "Keine Daten";

  const businessInsights = [
    {
      icon: "📍",
      title: "Stärkste Region",
      text:
        topRegions.length > 0
          ? `${strongestRegion} führt aktuell das Nachfrage-Ranking mit ${topRegions[0].value} Leads an.`
          : "Noch keine ausreichenden Regionaldaten vorhanden.",
    },
    {
      icon: "🏆",
      title: "Top-Kategorie",
      text:
        topCategories.length > 0
          ? `${strongestCategory} ist aktuell die stärkste Kategorie mit ${topCategories[0].value} Leads.`
          : "Noch keine ausreichenden Kategoriedaten vorhanden.",
    },
    {
      icon: "⚡",
      title: "Aktive Anbieterquote",
      text: `${activeProviderRate}% der registrierten Anbieter haben bereits mindestens einen Lead gekauft.`,
    },
    {
      icon: expiringLeadCount > 0 ? "⏳" : "✅",
      title: "Ablaufkontrolle",
      text:
        expiringLeadCount > 0
          ? `${expiringLeadCount} Leads laufen innerhalb der nächsten 24 Stunden ab.`
          : "Aktuell laufen keine Leads innerhalb der nächsten 24 Stunden ab.",
    },
    {
      icon: "💡",
      title: "Nächste Wachstumschance",
      text:
        leadConversionRate < 30
          ? "Die Lead-Conversion ist noch ausbaufähig. Prüfe Leadpreise, Anbieter-Matching und Nachfassprozesse."
          : leadConversionRate < 60
            ? "Die Conversion entwickelt sich solide. Mehr aktive Anbieter könnten das Wachstum beschleunigen."
            : "Die Lead-Conversion ist stark. Fokus jetzt auf Skalierung und Wiederkäufe.",
    },
    {
      icon: "🥇",
      title: "Top-Anbieter",
      text:
        topProviders.length > 0
          ? `${strongestProvider} führt aktuell das Anbieter-Ranking an.`
          : "Noch keine Anbieter-Rangliste verfügbar.",
    },
  ];

  const executiveMetrics = [
    {
      label: "Umsatz 7 Tage",
      value: formatMoney(creditRevenueLast7),
      trend: growth(creditRevenueLast7, creditRevenuePrevious7),
    },
    {
      label: "Leads 7 Tage",
      value: leadsLast7Days,
      trend: growth(leadsLast7Days, leadsPrevious7Days),
    },
    {
      label: "Verkäufe 7 Tage",
      value: leadPurchasesLast7Days,
      trend: growth(
        leadPurchasesLast7Days,
        leadPurchasesPrevious7Days,
      ),
    },
    {
      label: "Aktive Anbieter",
      value: `${activeProviderRate}%`,
      trend: null,
    },
    {
      label: "Ø Umsatz/Zahlung",
      value: formatMoney(averageRevenuePerPayment),
      trend: null,
    },
  ];

  const kpis = [
    {
      label: "Stripe-Umsatz",
      value: formatMoney(totalStripeRevenue),
      sub: `${totalStripePayments} bezahlte Pakete`,
      trend: growth(creditRevenueLast7, creditRevenuePrevious7),
    },
    {
      label: "Leads",
      value: leadCount,
      sub: `+${leadsLast7Days} in 7 Tagen`,
      trend: growth(leadsLast7Days, leadsPrevious7Days),
    },
    {
      label: "Anbieter",
      value: providerCount,
      sub: `+${providersLast7Days} in 7 Tagen`,
      trend: growth(providersLast7Days, providersPrevious7Days),
    },
    {
      label: "Lead-Verkäufe",
      value: leadPurchaseCount,
      sub: `+${leadPurchasesLast7Days} in 7 Tagen`,
      trend: growth(leadPurchasesLast7Days, leadPurchasesPrevious7Days),
    },
    {
      label: "Credits verkauft",
      value: totalCreditsSold,
      sub: "Bezahlte Creditpakete",
      trend: null,
    },
    {
      label: "Lead-Conversion",
      value: `${leadConversionRate}%`,
      sub: `${soldLeadCount} Leads mit Verkauf`,
      trend: null,
    },
    {
      label: "Ø Leadpreis",
      value: averageLeadPrice,
      sub: "Credits pro Kauf",
      trend: null,
    },
  ];

  return (
    <main className="page">
      <section className="admin-dashboard">
        <div className="container">
          <header className="analytics-header">
            <div>
              <span className="eyebrow">🟢 Auftrago Business Intelligence</span>
              <h1>Analytics-Zentrale.</h1>
              <p>
                Umsatz, Nachfrage, Anbieter und Verkäufe auf einen Blick – mit
                echten Daten aus deiner Plattform.
              </p>
            </div>

            <div className="admin-actions analytics-actions">
              <AdminAutoRefresh intervalSeconds={15} />
              <Link href="/admin" className="btn btn-secondary">
                ← Dashboard
              </Link>
              <Link href="/admin/providers" className="btn btn-secondary">
                Anbieter
              </Link>
              <Link href="/admin/leads" className="btn btn-primary">
                Leads verwalten
              </Link>
            </div>
          </header>

          <section className="executive-summary">
            <div className="executive-summary-head">
              <div>
                <span>EXECUTIVE SUMMARY</span>
                <h2>Business Performance</h2>
              </div>

              <strong>Live aus der Plattform</strong>
            </div>

            <div className="executive-summary-grid">
              {executiveMetrics.map((metric) => (
                <article key={metric.label}>
                  <span>{metric.label}</span>
                  <strong>{metric.value}</strong>
                  {metric.trend !== null ? (
                    <small
                      className={
                        metric.trend >= 0
                          ? "trend-positive"
                          : "trend-negative"
                      }
                    >
                      {metric.trend >= 0 ? "↗" : "↘"}{" "}
                      {Math.abs(metric.trend)}% zur Vorwoche
                    </small>
                  ) : (
                    <small>Aktueller Plattformwert</small>
                  )}
                </article>
              ))}
            </div>
          </section>

          <KPICards cards={kpis} />

          <section className="business-intelligence-panel">
            <div className="business-intelligence-head">
              <div>
                <span>🧠 AI BUSINESS INSIGHTS</span>
                <h2>Was gerade wichtig ist</h2>
              </div>

              <div className="business-intelligence-score">
                <span>Lead-Conversion</span>
                <strong>{leadConversionRate}%</strong>
              </div>
            </div>

            <div className="business-insights-grid">
              {businessInsights.map((insight) => (
                <article key={insight.title}>
                  <div>{insight.icon}</div>
                  <section>
                    <strong>{insight.title}</strong>
                    <p>{insight.text}</p>
                  </section>
                </article>
              ))}
            </div>

            <div className="performance-strip">
              <div>
                <span>Aktive Anbieter</span>
                <strong>{activeProviderCount}</strong>
              </div>
              <div>
                <span>Ø Käufe pro verkauftem Lead</span>
                <strong>{averagePurchasesPerSoldLead}</strong>
              </div>
              <div>
                <span>Leads mit Verkauf</span>
                <strong>{soldLeadCount}</strong>
              </div>
              <div>
                <span>Ablauf in 24h</span>
                <strong>{expiringLeadCount}</strong>
              </div>
            </div>
          </section>

          <div className="analytics-main-grid">
            <ActivityChart points={dailyPoints} />
            <ConversionFunnel
              items={[
                {
                  label: "Registrierte Anbieter",
                  value: providerCount,
                  base: providerCount,
                },
                {
                  label: "Credit-Käufer",
                  value: Math.min(totalStripePayments, providerCount),
                  base: Math.max(providerCount, 1),
                },
                {
                  label: "Aktive Käufer",
                  value: topProviders.length,
                  base: Math.max(providerCount, 1),
                },
                {
                  label: "Verkaufte Leads",
                  value: soldLeadCount,
                  base: Math.max(leadCount, 1),
                },
              ]}
            />
          </div>

          <div className="analytics-double-grid">
            <RevenueChart points={dailyPoints} formatMoney={formatMoney} />
            <LiveFeed items={liveFeed} />
          </div>

          <div className="analytics-ranking-grid">
            <TopRegions items={topRegions} />
            <TopCategories items={topCategories} />
            <TopProviders items={topProviders} />
          </div>

          <Forecast data={forecast} formatMoney={formatMoney} />

          <style suppressHydrationWarning>{`
            .executive-summary {
              margin-top: 28px;
              padding: 24px;
              border-radius: 30px;
              border: 1px solid rgba(255,255,255,0.10);
              background:
                radial-gradient(circle at 90% 10%, rgba(56,189,248,0.14), transparent 30%),
                linear-gradient(145deg, rgba(8,20,39,0.96), rgba(29,38,78,0.88));
              box-shadow: 0 28px 80px rgba(0,0,0,0.24);
            }

            .executive-summary-head,
            .business-intelligence-head {
              display: flex;
              align-items: center;
              justify-content: space-between;
              gap: 18px;
              flex-wrap: wrap;
            }

            .executive-summary-head span,
            .business-intelligence-head span {
              color: #93c5fd;
              font-size: 11px;
              font-weight: 900;
              letter-spacing: 0.12em;
            }

            .executive-summary-head h2,
            .business-intelligence-head h2 {
              margin: 7px 0 0;
            }

            .executive-summary-head > strong {
              color: #86efac;
              font-size: 12px;
            }

            .executive-summary-grid {
              display: grid;
              grid-template-columns: repeat(5, minmax(0, 1fr));
              gap: 12px;
              margin-top: 20px;
            }

            .executive-summary-grid article {
              min-width: 0;
              padding: 17px;
              border-radius: 18px;
              background: rgba(255,255,255,0.045);
              border: 1px solid rgba(255,255,255,0.07);
            }

            .executive-summary-grid article > span,
            .performance-strip span {
              display: block;
              color: #94a3b8;
              font-size: 10px;
              font-weight: 900;
              letter-spacing: 0.08em;
              text-transform: uppercase;
            }

            .executive-summary-grid article > strong {
              display: block;
              margin-top: 9px;
              font-size: 24px;
            }

            .executive-summary-grid small {
              display: block;
              margin-top: 8px;
              color: #64748b;
              font-size: 10px;
            }

            .trend-positive {
              color: #86efac !important;
            }

            .trend-negative {
              color: #fca5a5 !important;
            }

            .business-intelligence-panel {
              margin-top: 18px;
              padding: 26px;
              border-radius: 30px;
              border: 1px solid rgba(167,139,250,0.18);
              background:
                radial-gradient(circle at 88% 16%, rgba(139,92,246,0.16), transparent 30%),
                rgba(8,20,39,0.9);
            }

            .business-intelligence-score {
              min-width: 150px;
              padding: 14px 16px;
              border-radius: 18px;
              background: rgba(255,255,255,0.05);
              text-align: right;
            }

            .business-intelligence-score span {
              display: block;
              color: #94a3b8;
              font-size: 10px;
            }

            .business-intelligence-score strong {
              display: block;
              margin-top: 6px;
              font-size: 26px;
            }

            .business-insights-grid {
              display: grid;
              grid-template-columns: repeat(3, minmax(0, 1fr));
              gap: 12px;
              margin-top: 20px;
            }

            .business-insights-grid article {
              display: grid;
              grid-template-columns: 42px 1fr;
              gap: 12px;
              padding: 16px;
              border-radius: 18px;
              background: rgba(255,255,255,0.04);
              border: 1px solid rgba(255,255,255,0.07);
            }

            .business-insights-grid article > div {
              width: 42px;
              height: 42px;
              display: grid;
              place-items: center;
              border-radius: 13px;
              background: rgba(99,102,241,0.14);
              font-size: 20px;
            }

            .business-insights-grid strong {
              font-size: 13px;
            }

            .business-insights-grid p {
              margin: 6px 0 0;
              color: #94a3b8;
              font-size: 11px;
              line-height: 1.55;
            }

            .performance-strip {
              display: grid;
              grid-template-columns: repeat(4, minmax(0, 1fr));
              gap: 10px;
              margin-top: 16px;
              padding-top: 16px;
              border-top: 1px solid rgba(255,255,255,0.08);
            }

            .performance-strip > div {
              padding: 13px;
              border-radius: 15px;
              background: rgba(255,255,255,0.035);
            }

            .performance-strip strong {
              display: block;
              margin-top: 7px;
              font-size: 20px;
            }

            .analytics-header {
              display: flex;
              justify-content: space-between;
              align-items: flex-end;
              gap: 24px;
              flex-wrap: wrap;
            }

            .analytics-header h1 {
              margin-top: 14px;
            }

            .analytics-header p {
              max-width: 780px;
              margin-top: 14px;
            }

            .analytics-actions {
              display: flex;
              gap: 12px;
              flex-wrap: wrap;
              align-items: center;
            }

            .analytics-main-grid {
              margin-top: 26px;
              display: grid;
              grid-template-columns: minmax(0, 1.55fr) minmax(320px, 0.85fr);
              gap: 18px;
            }

            .analytics-double-grid {
              margin-top: 18px;
              display: grid;
              grid-template-columns: repeat(2, minmax(0, 1fr));
              gap: 18px;
            }

            .analytics-ranking-grid {
              margin-top: 18px;
              display: grid;
              grid-template-columns: repeat(3, minmax(0, 1fr));
              gap: 18px;
            }

            .analytics-ranking-card {
              padding: 24px;
              border-radius: 28px;
              border: 1px solid rgba(255,255,255,0.10);
              background: rgba(8,20,39,0.84);
            }

            .analytics-ranking-card > small {
              color: #c4b5fd;
              font-weight: 900;
            }

            .analytics-ranking-card h2 {
              margin-top: 6px;
            }

            .analytics-ranking-list {
              display: grid;
              gap: 15px;
              margin-top: 22px;
            }

            .analytics-ranking-head {
              display: flex;
              justify-content: space-between;
              gap: 12px;
              margin-bottom: 7px;
            }

            .analytics-ranking-head span {
              font-weight: 750;
            }

            .analytics-ranking-track {
              height: 8px;
              border-radius: 999px;
              background: rgba(255,255,255,0.07);
              overflow: hidden;
            }

            .analytics-ranking-track i {
              display: block;
              height: 100%;
              border-radius: 999px;
              background: linear-gradient(90deg, #6366f1, #38bdf8);
            }

            .analytics-ranking-track-gold i {
              background: linear-gradient(90deg, #eab308, #38bdf8);
            }

            .analytics-ranking-detail {
              display: block;
              margin-top: 5px;
              opacity: 0.45;
            }

            .analytics-empty {
              opacity: 0.55;
            }

            .analytics-forecast {
              margin-top: 18px;
              padding: 28px;
              border-radius: 30px;
              border: 1px solid rgba(255,255,255,0.10);
              background:
                radial-gradient(circle at 90% 20%, rgba(34,197,94,0.14), transparent 28%),
                linear-gradient(145deg, rgba(8,20,39,0.94), rgba(25,37,73,0.92));
              display: grid;
              grid-template-columns: minmax(260px, 0.8fr) minmax(0, 1.2fr);
              gap: 26px;
              align-items: center;
            }

            .analytics-forecast small {
              color: #86efac;
              font-weight: 900;
            }

            .analytics-forecast h2 {
              margin-top: 8px;
            }

            .analytics-forecast p {
              margin-top: 10px;
              opacity: 0.58;
              max-width: 560px;
            }

            .analytics-forecast-grid {
              display: grid;
              grid-template-columns: repeat(4, minmax(120px, 1fr));
              gap: 12px;
            }

            .analytics-forecast-grid > div {
              padding: 18px;
              border-radius: 20px;
              background: rgba(255,255,255,0.05);
              border: 1px solid rgba(255,255,255,0.07);
            }

            .analytics-forecast-grid span {
              display: block;
              opacity: 0.52;
              font-size: 12px;
              text-transform: uppercase;
              letter-spacing: 0.06em;
              font-weight: 800;
            }

            .analytics-forecast-grid strong {
              display: block;
              margin-top: 10px;
              font-size: 24px;
            }

            @media (max-width: 1180px) {
              .executive-summary-grid {
                grid-template-columns: repeat(3, minmax(0, 1fr));
              }

              .business-insights-grid {
                grid-template-columns: repeat(2, minmax(0, 1fr));
              }
            }

            @media (max-width: 1050px) {
              .analytics-main-grid,
              .analytics-double-grid,
              .analytics-ranking-grid,
              .analytics-forecast {
                grid-template-columns: 1fr;
              }

              .analytics-forecast-grid {
                grid-template-columns: repeat(2, minmax(120px, 1fr));
              }
            }

            @media (max-width: 640px) {
              .analytics-forecast-grid,
              .executive-summary-grid,
              .business-insights-grid,
              .performance-strip {
                grid-template-columns: 1fr;
              }

              .business-intelligence-score {
                width: 100%;
                text-align: left;
              }
            }
          `}</style>
        </div>
      </section>
    </main>
  );
}