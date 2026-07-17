import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

type DailyPoint = {
  key: string;
  label: string;
  leads: number;
  registrations: number;
  leadPurchases: number;
  creditRevenue: number;
};

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

function safeWidth(value: number, max: number) {
  if (max <= 0) return 0;
  return Math.max(6, Math.round((value / max) * 100));
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
        provider: {
          select: { companyName: true },
        },
        lead: {
          select: { title: true, region: true, category: true },
        },
      },
    }),
    prisma.creditPurchase.findMany({
      where: { status: "paid" },
      orderBy: { createdAt: "desc" },
      take: 6,
      include: {
        provider: {
          select: { companyName: true },
        },
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
  const leadConversionRate = percent(
    new Set(leadPurchasesForRanking.map((item) => item.leadId)).size,
    leadCount,
  );
  const averageLeadPrice =
    leadPurchaseCount > 0
      ? Math.round(
          leadPurchasesForChart.reduce((sum, item) => sum + item.price, 0) /
            Math.max(leadPurchasesForChart.length, 1),
        )
      : 0;

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
  const maxDailyActivity = Math.max(
    ...dailyPoints.map(
      (point) => point.leads + point.registrations + point.leadPurchases,
    ),
    1,
  );
  const maxDailyRevenue = Math.max(
    ...dailyPoints.map((point) => point.creditRevenue),
    1,
  );

  const regionMap = new Map<string, number>();
  const categoryMap = new Map<string, number>();

  leadsForRanking.forEach((lead) => {
    const region = lead.region || "Unbekannt";
    const category = lead.category || "Unbekannt";
    regionMap.set(region, (regionMap.get(region) ?? 0) + 1);
    categoryMap.set(category, (categoryMap.get(category) ?? 0) + 1);
  });

  const topRegions = Array.from(regionMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);
  const topCategories = Array.from(categoryMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

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

  const topProviders = Array.from(providerStats.values())
    .sort((a, b) => b.purchases - a.purchases)
    .slice(0, 6);

  const liveFeed = [
    ...recentLeadPurchases.map((purchase) => ({
      id: `lead-purchase-${purchase.id}`,
      date: purchase.createdAt,
      icon: "⚡",
      title: "Lead gekauft",
      description: `${purchase.provider.companyName} · ${purchase.lead.title}`,
      detail: `${purchase.price} Credits`,
    })),
    ...recentCreditPurchases.map((purchase) => ({
      id: `credit-purchase-${purchase.id}`,
      date: purchase.createdAt,
      icon: "💳",
      title: "Credits gekauft",
      description: purchase.provider.companyName,
      detail: formatMoney(purchase.amount, purchase.currency),
    })),
    ...recentProviders.map((provider) => ({
      id: `provider-${provider.id}`,
      date: provider.createdAt,
      icon: "👥",
      title: "Neuer Anbieter",
      description: provider.companyName,
      detail: provider.region || provider.status,
    })),
    ...recentLeads.map((lead) => ({
      id: `lead-${lead.id}`,
      date: lead.createdAt,
      icon: "📋",
      title: "Neuer Lead",
      description: lead.title,
      detail: `${lead.region} · ${lead.category}`,
    })),
  ]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 10);

  const maxRegion = Math.max(...topRegions.map(([, value]) => value), 1);
  const maxCategory = Math.max(...topCategories.map(([, value]) => value), 1);
  const maxProviderPurchases = Math.max(
    ...topProviders.map((provider) => provider.purchases),
    1,
  );

  const creditRevenueLast7 = creditRevenueLast7Days._sum.amount ?? 0;
  const creditRevenuePrevious7 = creditRevenuePrevious7Days._sum.amount ?? 0;

  return (
    <main className="page">
      <section className="admin-dashboard">
        <div className="container">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              gap: 24,
              flexWrap: "wrap",
            }}
          >
            <div>
              <span className="eyebrow">🟢 Auftrago Business Intelligence</span>
              <h1 style={{ marginTop: 14 }}>Analytics-Zentrale.</h1>
              <p style={{ maxWidth: 780, marginTop: 14 }}>
                Umsatz, Nachfrage, Anbieter und Verkäufe auf einen Blick – mit
                echten Daten aus deiner Plattform.
              </p>
            </div>

            <div
              className="admin-actions"
              style={{ display: "flex", gap: 12, flexWrap: "wrap" }}
            >
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
          </div>

          <div
            style={{
              marginTop: 34,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: 14,
            }}
          >
            {[
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
                trend: growth(
                  leadPurchasesLast7Days,
                  leadPurchasesPrevious7Days,
                ),
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
            ].map((card) => (
              <div
                key={card.label}
                style={{
                  position: "relative",
                  overflow: "hidden",
                  minHeight: 156,
                  padding: 22,
                  borderRadius: 26,
                  border: "1px solid rgba(255,255,255,0.10)",
                  background:
                    "radial-gradient(circle at 100% 100%, rgba(99,102,241,0.18), transparent 34%), linear-gradient(145deg, rgba(16,39,61,0.96), rgba(30,38,83,0.92))",
                  boxShadow: "0 22px 60px rgba(0,0,0,0.22)",
                }}
              >
                <small
                  style={{
                    opacity: 0.62,
                    fontWeight: 900,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}
                >
                  {card.label}
                </small>
                <strong
                  style={{
                    display: "block",
                    marginTop: 24,
                    fontSize: 34,
                    lineHeight: 1,
                  }}
                >
                  {card.value}
                </strong>
                <span
                  style={{
                    display: "block",
                    marginTop: 12,
                    fontSize: 13,
                    opacity: 0.6,
                  }}
                >
                  {card.sub}
                </span>
                {typeof card.trend === "number" ? (
                  <span
                    style={{
                      position: "absolute",
                      top: 18,
                      right: 18,
                      padding: "6px 9px",
                      borderRadius: 999,
                      background:
                        card.trend >= 0
                          ? "rgba(34,197,94,0.12)"
                          : "rgba(239,68,68,0.12)",
                      color: card.trend >= 0 ? "#86efac" : "#fca5a5",
                      fontSize: 12,
                      fontWeight: 900,
                    }}
                  >
                    {card.trend >= 0 ? "▲" : "▼"} {Math.abs(card.trend)}%
                  </span>
                ) : null}
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: 26,
              display: "grid",
              gridTemplateColumns: "minmax(0, 1.55fr) minmax(320px, 0.85fr)",
              gap: 18,
            }}
          >
            <section
              style={{
                padding: 26,
                borderRadius: 30,
                border: "1px solid rgba(255,255,255,0.10)",
                background: "rgba(8,20,39,0.84)",
                boxShadow: "0 28px 80px rgba(0,0,0,0.28)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 18,
                  flexWrap: "wrap",
                }}
              >
                <div>
                  <small style={{ color: "#c4b5fd", fontWeight: 900 }}>
                    LETZTE 7 TAGE
                  </small>
                  <h2 style={{ marginTop: 6 }}>Plattform-Aktivität</h2>
                </div>
                <span style={{ opacity: 0.55, fontSize: 13 }}>
                  Leads · Anbieter · Leadkäufe
                </span>
              </div>

              <div
                style={{
                  marginTop: 28,
                  height: 280,
                  display: "grid",
                  gridTemplateColumns: "repeat(7, minmax(38px, 1fr))",
                  gap: 12,
                  alignItems: "end",
                }}
              >
                {dailyPoints.map((point) => {
                  const activity =
                    point.leads + point.registrations + point.leadPurchases;
                  return (
                    <div
                      key={point.key}
                      style={{
                        height: "100%",
                        display: "grid",
                        gridTemplateRows: "1fr auto",
                        gap: 10,
                        alignItems: "end",
                      }}
                    >
                      <div
                        title={`${point.leads} Leads, ${point.registrations} Anbieter, ${point.leadPurchases} Käufe`}
                        style={{
                          width: "100%",
                          height: `${safeWidth(activity, maxDailyActivity)}%`,
                          minHeight: 10,
                          borderRadius: "14px 14px 5px 5px",
                          background:
                            "linear-gradient(180deg, #38bdf8, #6366f1)",
                          boxShadow: "0 10px 28px rgba(56,189,248,0.20)",
                        }}
                      />
                      <div style={{ textAlign: "center" }}>
                        <strong style={{ display: "block", fontSize: 13 }}>
                          {activity}
                        </strong>
                        <small style={{ opacity: 0.5, fontSize: 11 }}>
                          {point.label}
                        </small>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            <section
              style={{
                padding: 26,
                borderRadius: 30,
                border: "1px solid rgba(255,255,255,0.10)",
                background: "rgba(8,20,39,0.84)",
                boxShadow: "0 28px 80px rgba(0,0,0,0.28)",
              }}
            >
              <small style={{ color: "#c4b5fd", fontWeight: 900 }}>
                PERFORMANCE
              </small>
              <h2 style={{ marginTop: 6 }}>Conversion-Funnel</h2>

              <div style={{ display: "grid", gap: 18, marginTop: 28 }}>
                {[
                  ["Registrierte Anbieter", providerCount, providerCount],
                  ["Credits gekauft", totalStripePayments, providerCount],
                  ["Lead gekauft", topProviders.length, providerCount],
                  ["Lead-Verkäufe", leadPurchaseCount, Math.max(leadCount, 1)],
                ].map(([label, value, base]) => {
                  const ratio = percent(Number(value), Number(base));
                  return (
                    <div key={String(label)}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          gap: 12,
                          marginBottom: 8,
                        }}
                      >
                        <span style={{ opacity: 0.7 }}>{label}</span>
                        <strong>{value}</strong>
                      </div>
                      <div
                        style={{
                          height: 10,
                          borderRadius: 999,
                          background: "rgba(255,255,255,0.07)",
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            width: `${Math.max(ratio, value ? 5 : 0)}%`,
                            height: "100%",
                            borderRadius: 999,
                            background:
                              "linear-gradient(90deg, #9333ea, #38bdf8)",
                          }}
                        />
                      </div>
                      <small
                        style={{ display: "block", marginTop: 6, opacity: 0.4 }}
                      >
                        {ratio}%
                      </small>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>

          <div
            style={{
              marginTop: 18,
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: 18,
            }}
          >
            <section
              style={{
                padding: 26,
                borderRadius: 30,
                border: "1px solid rgba(255,255,255,0.10)",
                background: "rgba(8,20,39,0.84)",
              }}
            >
              <small style={{ color: "#67e8f9", fontWeight: 900 }}>
                UMSATZ
              </small>
              <h2 style={{ marginTop: 6 }}>Credit-Umsatz nach Tag</h2>
              <div style={{ display: "grid", gap: 14, marginTop: 24 }}>
                {dailyPoints.map((point) => (
                  <div
                    key={point.key}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "80px 1fr 100px",
                      gap: 12,
                      alignItems: "center",
                    }}
                  >
                    <span style={{ opacity: 0.58, fontSize: 13 }}>
                      {point.label}
                    </span>
                    <div
                      style={{
                        height: 10,
                        borderRadius: 999,
                        background: "rgba(255,255,255,0.07)",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: `${safeWidth(
                            point.creditRevenue,
                            maxDailyRevenue,
                          )}%`,
                          height: "100%",
                          borderRadius: 999,
                          background:
                            "linear-gradient(90deg, #22c55e, #38bdf8)",
                        }}
                      />
                    </div>
                    <strong style={{ textAlign: "right", fontSize: 13 }}>
                      {formatMoney(point.creditRevenue)}
                    </strong>
                  </div>
                ))}
              </div>
            </section>

            <section
              style={{
                padding: 26,
                borderRadius: 30,
                border: "1px solid rgba(255,255,255,0.10)",
                background: "rgba(8,20,39,0.84)",
              }}
            >
              <small style={{ color: "#c4b5fd", fontWeight: 900 }}>LIVE</small>
              <h2 style={{ marginTop: 6 }}>Neueste Aktivitäten</h2>
              <div style={{ display: "grid", gap: 6, marginTop: 18 }}>
                {liveFeed.length === 0 ? (
                  <p style={{ opacity: 0.55 }}>
                    Noch keine Aktivitäten vorhanden.
                  </p>
                ) : (
                  liveFeed.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "44px 1fr auto",
                        gap: 12,
                        alignItems: "center",
                        padding: "13px 0",
                        borderBottom: "1px solid rgba(255,255,255,0.07)",
                      }}
                    >
                      <div
                        style={{
                          width: 40,
                          height: 40,
                          display: "grid",
                          placeItems: "center",
                          borderRadius: 14,
                          background: "rgba(56,189,248,0.11)",
                        }}
                      >
                        {item.icon}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <strong style={{ display: "block", fontSize: 14 }}>
                          {item.title}
                        </strong>
                        <span
                          style={{
                            display: "block",
                            marginTop: 3,
                            opacity: 0.58,
                            fontSize: 12,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {item.description}
                        </span>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <strong style={{ display: "block", fontSize: 12 }}>
                          {item.detail}
                        </strong>
                        <small style={{ opacity: 0.4, fontSize: 10 }}>
                          {formatDate(item.date)}
                        </small>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>

          <div
            style={{
              marginTop: 18,
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              gap: 18,
            }}
          >
            {[
              {
                eyebrow: "🌍 NACHFRAGE",
                title: "Top-Regionen",
                rows: topRegions,
                max: maxRegion,
              },
              {
                eyebrow: "🧹 KATEGORIEN",
                title: "Top-Kategorien",
                rows: topCategories,
                max: maxCategory,
              },
            ].map((section) => (
              <section
                key={section.title}
                style={{
                  padding: 24,
                  borderRadius: 28,
                  border: "1px solid rgba(255,255,255,0.10)",
                  background: "rgba(8,20,39,0.84)",
                }}
              >
                <small style={{ color: "#c4b5fd", fontWeight: 900 }}>
                  {section.eyebrow}
                </small>
                <h2 style={{ marginTop: 6 }}>{section.title}</h2>
                <div style={{ display: "grid", gap: 15, marginTop: 22 }}>
                  {section.rows.length === 0 ? (
                    <p style={{ opacity: 0.55 }}>Noch keine Daten vorhanden.</p>
                  ) : (
                    section.rows.map(([label, value], index) => (
                      <div key={label}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            gap: 12,
                            marginBottom: 7,
                          }}
                        >
                          <span style={{ fontWeight: 750 }}>
                            {index < 3 ? ["🥇", "🥈", "🥉"][index] : "•"}{" "}
                            {label}
                          </span>
                          <strong>{value}</strong>
                        </div>
                        <div
                          style={{
                            height: 8,
                            borderRadius: 999,
                            background: "rgba(255,255,255,0.07)",
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              width: `${safeWidth(value, section.max)}%`,
                              height: "100%",
                              borderRadius: 999,
                              background:
                                "linear-gradient(90deg, #6366f1, #38bdf8)",
                            }}
                          />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </section>
            ))}

            <section
              style={{
                padding: 24,
                borderRadius: 28,
                border: "1px solid rgba(255,255,255,0.10)",
                background: "rgba(8,20,39,0.84)",
              }}
            >
              <small style={{ color: "#fde68a", fontWeight: 900 }}>
                🏆 ANBIETER
              </small>
              <h2 style={{ marginTop: 6 }}>Top-Anbieter</h2>
              <div style={{ display: "grid", gap: 15, marginTop: 22 }}>
                {topProviders.length === 0 ? (
                  <p style={{ opacity: 0.55 }}>
                    Noch keine Leadkäufe vorhanden.
                  </p>
                ) : (
                  topProviders.map((provider, index) => (
                    <div key={provider.companyName}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          gap: 12,
                          marginBottom: 7,
                        }}
                      >
                        <span style={{ fontWeight: 750 }}>
                          {index < 3 ? ["🥇", "🥈", "🥉"][index] : "•"}{" "}
                          {provider.companyName}
                        </span>
                        <strong>{provider.purchases}</strong>
                      </div>
                      <div
                        style={{
                          height: 8,
                          borderRadius: 999,
                          background: "rgba(255,255,255,0.07)",
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            width: `${safeWidth(
                              provider.purchases,
                              maxProviderPurchases,
                            )}%`,
                            height: "100%",
                            borderRadius: 999,
                            background:
                              "linear-gradient(90deg, #eab308, #38bdf8)",
                          }}
                        />
                      </div>
                      <small
                        style={{
                          display: "block",
                          marginTop: 5,
                          opacity: 0.45,
                        }}
                      >
                        {provider.creditsSpent} Credits eingesetzt
                      </small>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>

          <style>{`
            @media (max-width: 1050px) {
              .analytics-two-column {
                grid-template-columns: 1fr !important;
              }
            }
            @media (max-width: 900px) {
              section[style*="grid-template-columns: repeat(3"] {
                grid-template-columns: 1fr !important;
              }
              section[style*="grid-template-columns: repeat(2"] {
                grid-template-columns: 1fr !important;
              }
            }
          `}</style>
        </div>
      </section>
    </main>
  );
}