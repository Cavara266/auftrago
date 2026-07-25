import Link from "next/link";
import AdminAutoRefresh from "@/components/admin/admin-auto-refresh";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

function startOfDay(date: Date) {
  const value = new Date(date);
  value.setHours(0, 0, 0, 0);
  return value;
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function addDays(date: Date, days: number) {
  const value = new Date(date);
  value.setDate(value.getDate() + days);
  return value;
}

function formatMoney(amountInRappen: number, currency = "CHF") {
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

function scoreColor(score: number) {
  if (score >= 80) return "#4ade80";
  if (score >= 60) return "#facc15";
  return "#fb7185";
}

export default async function AdminCeoPage() {
  const now = new Date();
  const today = startOfDay(now);
  const monthStart = startOfMonth(now);
  const sevenDaysAgo = addDays(today, -6);
  const fourteenDaysAgo = addDays(today, -13);
  const thirtyDaysAgo = addDays(today, -29);

  const [
    providerCount,
    approvedProviderCount,
    pendingProviderCount,
    providerCountLast7,
    providerCountPrevious7,
    leadCount,
    leadCountToday,
    leadCountLast7,
    leadCountPrevious7,
    leadPurchaseCount,
    leadPurchaseCountToday,
    leadPurchaseCountLast7,
    leadPurchaseCountPrevious7,
    wonCount,
    contactedCount,
    offerSentCount,
    paidCreditTotal,
    paidCreditToday,
    paidCreditMonth,
    paidCreditLast7,
    paidCreditPrevious7,
    paidCreditsLast30,
    fixedOrderCount,
    fixedOrderOpen,
    fixedOrderSold,
    fixedOrderCompleted,
    fixedOrderRevenueTotal,
    fixedOrderRevenueToday,
    fixedOrderRevenueMonth,
    fixedOrderRevenueLast30,
    leadCreditsSpent,
    latestPayments,
    latestLeadPurchases,
    topProvidersRaw,
  ] = await Promise.all([
    prisma.provider.count(),
    prisma.provider.count({ where: { status: "APPROVED" } }),
    prisma.provider.count({ where: { status: "PENDING" } }),
    prisma.provider.count({
      where: { createdAt: { gte: sevenDaysAgo } },
    }),
    prisma.provider.count({
      where: { createdAt: { gte: fourteenDaysAgo, lt: sevenDaysAgo } },
    }),

    prisma.lead.count(),
    prisma.lead.count({ where: { createdAt: { gte: today } } }),
    prisma.lead.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
    prisma.lead.count({
      where: { createdAt: { gte: fourteenDaysAgo, lt: sevenDaysAgo } },
    }),

    prisma.leadPurchase.count(),
    prisma.leadPurchase.count({ where: { createdAt: { gte: today } } }),
    prisma.leadPurchase.count({
      where: { createdAt: { gte: sevenDaysAgo } },
    }),
    prisma.leadPurchase.count({
      where: { createdAt: { gte: fourteenDaysAgo, lt: sevenDaysAgo } },
    }),

    prisma.leadPurchase.count({ where: { status: "WON" } }),
    prisma.leadPurchase.count({
      where: {
        status: {
          in: ["CONTACTED", "APPOINTMENT_SET", "OFFER_SENT", "WON"],
        },
      },
    }),
    prisma.leadPurchase.count({
      where: { status: { in: ["OFFER_SENT", "WON"] } },
    }),

    prisma.creditPurchase.aggregate({
      where: { status: "paid" },
      _sum: { amount: true, credits: true },
      _count: { id: true },
    }),
    prisma.creditPurchase.aggregate({
      where: { status: "paid", createdAt: { gte: today } },
      _sum: { amount: true },
    }),
    prisma.creditPurchase.aggregate({
      where: { status: "paid", createdAt: { gte: monthStart } },
      _sum: { amount: true },
    }),
    prisma.creditPurchase.aggregate({
      where: { status: "paid", createdAt: { gte: sevenDaysAgo } },
      _sum: { amount: true },
    }),
    prisma.creditPurchase.aggregate({
      where: {
        status: "paid",
        createdAt: { gte: fourteenDaysAgo, lt: sevenDaysAgo },
      },
      _sum: { amount: true },
    }),
    prisma.creditPurchase.findMany({
      where: { status: "paid", createdAt: { gte: thirtyDaysAgo } },
      select: { amount: true, createdAt: true },
      orderBy: { createdAt: "asc" },
    }),

    prisma.fixedOrder.count(),
    prisma.fixedOrder.count({ where: { status: "OPEN" } }),
    prisma.fixedOrder.count({ where: { status: "SOLD" } }),
    prisma.fixedOrder.count({ where: { status: "COMPLETED" } }),
    prisma.fixedOrder.aggregate({
      where: { status: { in: ["SOLD", "COMPLETED"] } },
      _sum: { commissionAmountCents: true },
    }),
    prisma.fixedOrder.aggregate({
      where: {
        status: { in: ["SOLD", "COMPLETED"] },
        soldAt: { gte: today },
      },
      _sum: { commissionAmountCents: true },
    }),
    prisma.fixedOrder.aggregate({
      where: {
        status: { in: ["SOLD", "COMPLETED"] },
        soldAt: { gte: monthStart },
      },
      _sum: { commissionAmountCents: true },
    }),
    prisma.fixedOrder.findMany({
      where: {
        status: { in: ["SOLD", "COMPLETED"] },
        soldAt: { gte: thirtyDaysAgo },
      },
      select: { commissionAmountCents: true, soldAt: true },
    }),

    prisma.leadPurchase.aggregate({
      _sum: { price: true },
    }),

    prisma.creditPurchase.findMany({
      where: { status: "paid" },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        provider: { select: { companyName: true } },
      },
    }),

    prisma.leadPurchase.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        provider: { select: { companyName: true } },
        lead: { select: { title: true } },
      },
    }),

    prisma.leadPurchase.groupBy({
      by: ["providerId"],
      _count: { _all: true },
      _sum: { price: true },
      orderBy: { _count: { providerId: "desc" } },
      take: 5,
    }),
  ]);

  const topProviderIds = topProvidersRaw.map((item) => item.providerId);
  const topProviderDetails =
    topProviderIds.length > 0
      ? await prisma.provider.findMany({
          where: { id: { in: topProviderIds } },
          select: {
            id: true,
            companyName: true,
            region: true,
            status: true,
          },
        })
      : [];

  const providerMap = new Map(
    topProviderDetails.map((provider) => [provider.id, provider]),
  );

  const stripeRevenueTotal = paidCreditTotal._sum.amount ?? 0;
  const stripeRevenueToday = paidCreditToday._sum.amount ?? 0;
  const stripeRevenueMonth = paidCreditMonth._sum.amount ?? 0;
  const stripeRevenueLast7 = paidCreditLast7._sum.amount ?? 0;
  const stripeRevenuePrevious7 = paidCreditPrevious7._sum.amount ?? 0;

  const fixedRevenueTotal =
    fixedOrderRevenueTotal._sum.commissionAmountCents ?? 0;
  const fixedRevenueToday =
    fixedOrderRevenueToday._sum.commissionAmountCents ?? 0;
  const fixedRevenueMonth =
    fixedOrderRevenueMonth._sum.commissionAmountCents ?? 0;

  const totalRevenue = stripeRevenueTotal + fixedRevenueTotal;
  const revenueToday = stripeRevenueToday + fixedRevenueToday;
  const revenueMonth = stripeRevenueMonth + fixedRevenueMonth;

  const soldLeadRate = percentage(leadPurchaseCount, leadCount);
  const contactRate = percentage(contactedCount, leadPurchaseCount);
  const offerRate = percentage(offerSentCount, leadPurchaseCount);
  const winRate = percentage(wonCount, leadPurchaseCount);
  const approvalRate = percentage(approvedProviderCount, providerCount);

  const revenueGrowth = growth(
    stripeRevenueLast7,
    stripeRevenuePrevious7,
  );
  const leadGrowth = growth(leadCountLast7, leadCountPrevious7);
  const providerGrowth = growth(
    providerCountLast7,
    providerCountPrevious7,
  );
  const purchaseGrowth = growth(
    leadPurchaseCountLast7,
    leadPurchaseCountPrevious7,
  );

  const revenueByWeek = Array.from({ length: 4 }, (_, index) => {
    const start = addDays(today, -27 + index * 7);
    const end = addDays(start, 7);

    const stripe = paidCreditsLast30
      .filter(
        (purchase) =>
          purchase.createdAt >= start && purchase.createdAt < end,
      )
      .reduce((sum, purchase) => sum + purchase.amount, 0);

    const fixed = fixedOrderRevenueLast30
      .filter(
        (order) =>
          order.soldAt &&
          order.soldAt >= start &&
          order.soldAt < end,
      )
      .reduce((sum, order) => sum + order.commissionAmountCents, 0);

    return {
      label: `W${index + 1}`,
      value: stripe + fixed,
    };
  });

  const maxWeekRevenue = Math.max(
    ...revenueByWeek.map((item) => item.value),
    1,
  );

  const activityScore = Math.min(
    100,
    Math.round(
      Math.min(leadCountLast7 * 3, 30) +
        Math.min(providerCountLast7 * 5, 25) +
        Math.min(leadPurchaseCountLast7 * 4, 30) +
        Math.min(winRate / 2, 15),
    ),
  );

  const businessScore = Math.round(
    (Math.min(approvalRate, 100) +
      Math.min(soldLeadRate * 2, 100) +
      Math.min(contactRate, 100) +
      activityScore) /
      4,
  );

  const projectedRevenue30 =
    paidCreditsLast30.reduce((sum, item) => sum + item.amount, 0) +
    fixedOrderRevenueLast30.reduce(
      (sum, item) => sum + item.commissionAmountCents,
      0,
    );

  const insights = [
    {
      title:
        revenueGrowth >= 0
          ? "Umsatztrend positiv"
          : "Umsatztrend rückläufig",
      text: `Der Credit-Umsatz der letzten 7 Tage liegt ${
        revenueGrowth >= 0 ? `${revenueGrowth}% höher` : `${Math.abs(revenueGrowth)}% tiefer`
      } als in der Vorperiode.`,
      tone: revenueGrowth >= 0 ? "good" : "warn",
    },
    {
      title: "Anbieter-Pipeline",
      text:
        pendingProviderCount > 0
          ? `${pendingProviderCount} Anbieter warten aktuell auf Freigabe.`
          : "Aktuell warten keine Anbieter auf Freigabe.",
      tone: pendingProviderCount > 0 ? "warn" : "good",
    },
    {
      title: "Vertriebsleistung",
      text: `${winRate}% der gekauften Leads stehen auf WON. Die Kontaktquote liegt bei ${contactRate}%.`,
      tone: winRate >= 20 ? "good" : "info",
    },
  ];

  return (
    <main className="ceo-page">
      <div className="ceo-glow ceo-glow-one" />
      <div className="ceo-glow ceo-glow-two" />

      <div className="ceo-shell">
        <header className="ceo-header">
          <div>
            <span className="ceo-eyebrow">
              <i />
              Auftrago Executive Intelligence
            </span>
            <h1>CEO Command Center.</h1>
            <p>
              Umsatz, Wachstum, Sales, Fixaufträge und Anbieterleistung in
              einer zentralen Unternehmensansicht.
            </p>
          </div>

          <div className="ceo-actions">
            <AdminAutoRefresh intervalSeconds={15} />
            <Link href="/admin" className="ceo-button ceo-button-dark">
              ← Admin
            </Link>
            <Link
              href="/admin/analytics"
              className="ceo-button ceo-button-dark"
            >
              Analytics
            </Link>
            <Link
              href="/admin/fixed-orders"
              className="ceo-button ceo-button-primary"
            >
              Fixaufträge
            </Link>
          </div>
        </header>

        <section className="ceo-hero-grid">
          <article className="ceo-revenue-card">
            <span>Gesamtumsatz Plattform</span>
            <strong>{formatMoney(totalRevenue)}</strong>
            <div className="ceo-revenue-meta">
              <div>
                <small>Heute</small>
                <b>{formatMoney(revenueToday)}</b>
              </div>
              <div>
                <small>Dieser Monat</small>
                <b>{formatMoney(revenueMonth)}</b>
              </div>
              <div>
                <small>30-Tage-Prognose</small>
                <b>{formatMoney(projectedRevenue30)}</b>
              </div>
            </div>
          </article>

          <article className="ceo-score-card">
            <div
              className="ceo-score-ring"
              style={{
                background: `conic-gradient(${scoreColor(
                  businessScore,
                )} ${businessScore * 3.6}deg, rgba(255,255,255,0.08) 0deg)`,
              }}
            >
              <div>
                <strong>{businessScore}</strong>
                <span>/ 100</span>
              </div>
            </div>
            <div>
              <span>Business Score</span>
              <h2>
                {businessScore >= 80
                  ? "Sehr stark"
                  : businessScore >= 60
                    ? "Solide"
                    : "Ausbaufähig"}
              </h2>
              <p>
                Berechnet aus Anbieterquote, Lead-Verkäufen, CRM-Aktivität und
                aktuellem Plattformwachstum.
              </p>
            </div>
          </article>
        </section>

        <section className="ceo-kpi-grid">
          {[
            {
              label: "Leads",
              value: formatNumber(leadCount),
              detail: `+${leadCountToday} heute`,
              trend: leadGrowth,
            },
            {
              label: "Anbieter",
              value: formatNumber(providerCount),
              detail: `${approvedProviderCount} genehmigt`,
              trend: providerGrowth,
            },
            {
              label: "Lead-Verkäufe",
              value: formatNumber(leadPurchaseCount),
              detail: `+${leadPurchaseCountToday} heute`,
              trend: purchaseGrowth,
            },
            {
              label: "Fixaufträge",
              value: formatNumber(fixedOrderCount),
              detail: `${fixedOrderOpen} offen`,
              trend: null,
            },
            {
              label: "Credits verkauft",
              value: formatNumber(paidCreditTotal._sum.credits ?? 0),
              detail: `${formatNumber(paidCreditTotal._count.id)} Zahlungen`,
              trend: revenueGrowth,
            },
            {
              label: "Credits eingesetzt",
              value: formatNumber(leadCreditsSpent._sum.price ?? 0),
              detail: "Lead-Freischaltungen",
              trend: null,
            },
          ].map((item) => (
            <article className="ceo-kpi" key={item.label}>
              <span>{item.label}</span>
              <strong>{item.value}</strong>
              <small>{item.detail}</small>
              {typeof item.trend === "number" ? (
                <b
                  className={
                    item.trend >= 0 ? "ceo-trend-up" : "ceo-trend-down"
                  }
                >
                  {item.trend >= 0 ? "▲" : "▼"} {Math.abs(item.trend)}%
                </b>
              ) : null}
            </article>
          ))}
        </section>

        <section className="ceo-main-grid">
          <article className="ceo-panel">
            <div className="ceo-panel-head">
              <div>
                <span>Cashflow</span>
                <h2>Umsatz letzte 4 Wochen</h2>
              </div>
              <strong>{formatMoney(projectedRevenue30)}</strong>
            </div>

            <div className="ceo-chart">
              {revenueByWeek.map((item) => (
                <div className="ceo-chart-column" key={item.label}>
                  <small>
                    {item.value > 0 ? formatMoney(item.value) : "–"}
                  </small>
                  <div className="ceo-chart-track">
                    <i
                      style={{
                        height: `${Math.max(
                          (item.value / maxWeekRevenue) * 100,
                          5,
                        )}%`,
                      }}
                    />
                  </div>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>

            <div className="ceo-split-stats">
              <div>
                <span>Credit-Umsatz gesamt</span>
                <strong>{formatMoney(stripeRevenueTotal)}</strong>
              </div>
              <div>
                <span>Fixauftrag-Provision gesamt</span>
                <strong>{formatMoney(fixedRevenueTotal)}</strong>
              </div>
            </div>
          </article>

          <article className="ceo-panel">
            <div className="ceo-panel-head">
              <div>
                <span>Sales Engine</span>
                <h2>Conversion Funnel</h2>
              </div>
            </div>

            <div className="ceo-funnel">
              {[
                ["Leads", leadCount, 100],
                ["Gekauft", leadPurchaseCount, soldLeadRate],
                ["Kontaktiert", contactedCount, contactRate],
                ["Offerten", offerSentCount, offerRate],
                ["Gewonnen", wonCount, winRate],
              ].map(([label, value, rate]) => (
                <div key={String(label)}>
                  <div>
                    <span>{label}</span>
                    <strong>{formatNumber(Number(value))}</strong>
                  </div>
                  <div className="ceo-funnel-track">
                    <i
                      style={{
                        width: `${Math.max(Number(rate), Number(value) ? 4 : 0)}%`,
                      }}
                    />
                  </div>
                  <small>{rate}%</small>
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="ceo-triple-grid">
          <article className="ceo-panel">
            <div className="ceo-panel-head">
              <div>
                <span>Business Intelligence</span>
                <h2>Automatische Hinweise</h2>
              </div>
            </div>

            <div className="ceo-insights">
              {insights.map((item) => (
                <div className={`ceo-insight ceo-${item.tone}`} key={item.title}>
                  <i />
                  <div>
                    <strong>{item.title}</strong>
                    <span>{item.text}</span>
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="ceo-panel">
            <div className="ceo-panel-head">
              <div>
                <span>Fixaufträge</span>
                <h2>Provision & Bestand</h2>
              </div>
              <Link href="/admin/fixed-orders">Öffnen →</Link>
            </div>

            <div className="ceo-order-stats">
              <div>
                <span>Offen</span>
                <strong>{fixedOrderOpen}</strong>
              </div>
              <div>
                <span>Verkauft</span>
                <strong>{fixedOrderSold}</strong>
              </div>
              <div>
                <span>Erledigt</span>
                <strong>{fixedOrderCompleted}</strong>
              </div>
              <div>
                <span>Monatsprovision</span>
                <strong>{formatMoney(fixedRevenueMonth)}</strong>
              </div>
            </div>
          </article>

          <article className="ceo-panel">
            <div className="ceo-panel-head">
              <div>
                <span>Anbieter</span>
                <h2>Top Performer</h2>
              </div>
              <Link href="/admin/providers">Alle →</Link>
            </div>

            <div className="ceo-provider-list">
              {topProvidersRaw.length === 0 ? (
                <p className="ceo-empty">Noch keine Leadkäufe vorhanden.</p>
              ) : (
                topProvidersRaw.map((item, index) => {
                  const provider = providerMap.get(item.providerId);
                  return (
                    <div key={item.providerId}>
                      <b>{index + 1}</b>
                      <div>
                        <strong>
                          {provider?.companyName || "Unbekannter Anbieter"}
                        </strong>
                        <span>{provider?.region || "Keine Region"}</span>
                      </div>
                      <small>{item._count._all} Käufe</small>
                    </div>
                  );
                })
              )}
            </div>
          </article>
        </section>

        <section className="ceo-double-grid">
          <article className="ceo-panel">
            <div className="ceo-panel-head">
              <div>
                <span>Live</span>
                <h2>Neueste Zahlungen</h2>
              </div>
            </div>

            <div className="ceo-feed">
              {latestPayments.map((payment) => (
                <div key={payment.id}>
                  <span>CHF</span>
                  <div>
                    <strong>{payment.provider.companyName}</strong>
                    <small>{payment.credits} Credits gekauft</small>
                  </div>
                  <b>{formatMoney(payment.amount, payment.currency)}</b>
                </div>
              ))}
            </div>
          </article>

          <article className="ceo-panel">
            <div className="ceo-panel-head">
              <div>
                <span>Live</span>
                <h2>Neueste Lead-Verkäufe</h2>
              </div>
            </div>

            <div className="ceo-feed">
              {latestLeadPurchases.map((purchase) => (
                <div key={purchase.id}>
                  <span>Lead</span>
                  <div>
                    <strong>{purchase.provider.companyName}</strong>
                    <small>{purchase.lead.title}</small>
                  </div>
                  <b>{purchase.price} Credits</b>
                </div>
              ))}
            </div>
          </article>
        </section>
      </div>

      <style suppressHydrationWarning>{`
        .ceo-page {
          position: relative;
          min-height: 100vh;
          overflow: hidden;
          padding: 40px 20px 80px;
          color: #f8fafc;
          background:
            linear-gradient(180deg, #050b16 0%, #081426 48%, #07101d 100%);
        }

        .ceo-glow {
          position: absolute;
          width: 560px;
          height: 560px;
          border-radius: 999px;
          filter: blur(120px);
          pointer-events: none;
          opacity: 0.18;
        }

        .ceo-glow-one {
          top: -220px;
          right: -120px;
          background: #4f46e5;
        }

        .ceo-glow-two {
          bottom: 80px;
          left: -250px;
          background: #0891b2;
        }

        .ceo-shell {
          position: relative;
          z-index: 1;
          width: min(1500px, 100%);
          margin: 0 auto;
        }

        .ceo-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 24px;
          flex-wrap: wrap;
        }

        .ceo-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          font-size: 12px;
          font-weight: 900;
          letter-spacing: .08em;
          text-transform: uppercase;
          color: #a5b4fc;
        }

        .ceo-eyebrow i {
          width: 8px;
          height: 8px;
          border-radius: 999px;
          background: #22c55e;
          box-shadow: 0 0 18px #22c55e;
        }

        .ceo-header h1 {
          margin: 14px 0 0;
          font-size: clamp(38px, 5vw, 70px);
          line-height: .95;
          letter-spacing: -.05em;
        }

        .ceo-header p {
          max-width: 760px;
          margin: 18px 0 0;
          color: rgba(226,232,240,.62);
          font-size: 16px;
        }

        .ceo-actions {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .ceo-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 44px;
          padding: 0 16px;
          border-radius: 14px;
          text-decoration: none;
          font-size: 13px;
          font-weight: 850;
          border: 1px solid rgba(255,255,255,.10);
        }

        .ceo-button-dark {
          color: #f8fafc;
          background: rgba(255,255,255,.04);
        }

        .ceo-button-primary {
          color: white;
          background: linear-gradient(135deg, #6366f1, #2563eb);
          box-shadow: 0 14px 35px rgba(37,99,235,.25);
        }

        .ceo-hero-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.45fr) minmax(340px, .75fr);
          gap: 18px;
          margin-top: 34px;
        }

        .ceo-revenue-card,
        .ceo-score-card,
        .ceo-panel,
        .ceo-kpi {
          border: 1px solid rgba(255,255,255,.09);
          box-shadow: 0 26px 80px rgba(0,0,0,.25);
        }

        .ceo-revenue-card {
          padding: 34px;
          border-radius: 32px;
          background:
            radial-gradient(circle at 90% 0%, rgba(56,189,248,.17), transparent 30%),
            linear-gradient(145deg, rgba(15,37,62,.97), rgba(24,30,76,.94));
        }

        .ceo-revenue-card > span {
          color: rgba(226,232,240,.56);
          font-weight: 850;
          text-transform: uppercase;
          letter-spacing: .07em;
          font-size: 12px;
        }

        .ceo-revenue-card > strong {
          display: block;
          margin-top: 18px;
          font-size: clamp(42px, 6vw, 82px);
          line-height: .95;
          letter-spacing: -.06em;
        }

        .ceo-revenue-meta {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 12px;
          margin-top: 34px;
        }

        .ceo-revenue-meta > div {
          padding: 16px;
          border-radius: 18px;
          background: rgba(255,255,255,.05);
          border: 1px solid rgba(255,255,255,.06);
        }

        .ceo-revenue-meta small,
        .ceo-revenue-meta b {
          display: block;
        }

        .ceo-revenue-meta small {
          color: rgba(226,232,240,.48);
        }

        .ceo-revenue-meta b {
          margin-top: 7px;
          font-size: 18px;
        }

        .ceo-score-card {
          padding: 28px;
          border-radius: 32px;
          display: flex;
          align-items: center;
          gap: 24px;
          background: rgba(8,20,39,.88);
        }

        .ceo-score-ring {
          width: 142px;
          height: 142px;
          flex: 0 0 142px;
          border-radius: 999px;
          display: grid;
          place-items: center;
        }

        .ceo-score-ring > div {
          width: 112px;
          height: 112px;
          border-radius: 999px;
          display: grid;
          place-content: center;
          text-align: center;
          background: #091425;
        }

        .ceo-score-ring strong {
          font-size: 38px;
          line-height: 1;
        }

        .ceo-score-ring span {
          margin-top: 4px;
          color: rgba(226,232,240,.45);
          font-size: 12px;
        }

        .ceo-score-card > div:last-child > span {
          color: #a5b4fc;
          font-size: 12px;
          font-weight: 900;
          letter-spacing: .08em;
          text-transform: uppercase;
        }

        .ceo-score-card h2 {
          margin: 8px 0 0;
          font-size: 28px;
        }

        .ceo-score-card p {
          margin: 9px 0 0;
          color: rgba(226,232,240,.55);
          line-height: 1.55;
          font-size: 13px;
        }

        .ceo-kpi-grid {
          display: grid;
          grid-template-columns: repeat(6, minmax(0, 1fr));
          gap: 12px;
          margin-top: 18px;
        }

        .ceo-kpi {
          position: relative;
          min-height: 150px;
          padding: 20px;
          border-radius: 24px;
          background: rgba(8,20,39,.82);
        }

        .ceo-kpi > span,
        .ceo-kpi > strong,
        .ceo-kpi > small {
          display: block;
        }

        .ceo-kpi > span {
          color: rgba(226,232,240,.48);
          font-size: 11px;
          font-weight: 900;
          letter-spacing: .06em;
          text-transform: uppercase;
        }

        .ceo-kpi > strong {
          margin-top: 24px;
          font-size: 30px;
        }

        .ceo-kpi > small {
          margin-top: 8px;
          color: rgba(226,232,240,.45);
        }

        .ceo-kpi > b {
          position: absolute;
          top: 16px;
          right: 16px;
          font-size: 11px;
        }

        .ceo-trend-up { color: #86efac; }
        .ceo-trend-down { color: #fda4af; }

        .ceo-main-grid,
        .ceo-double-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 18px;
          margin-top: 18px;
        }

        .ceo-triple-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 18px;
          margin-top: 18px;
        }

        .ceo-panel {
          padding: 26px;
          border-radius: 28px;
          background: rgba(8,20,39,.84);
        }

        .ceo-panel-head {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
        }

        .ceo-panel-head span {
          color: #a5b4fc;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: .08em;
          text-transform: uppercase;
        }

        .ceo-panel-head h2 {
          margin: 7px 0 0;
          font-size: 24px;
        }

        .ceo-panel-head > strong {
          font-size: 20px;
        }

        .ceo-panel-head a {
          color: #7dd3fc;
          font-size: 12px;
          font-weight: 800;
          text-decoration: none;
        }

        .ceo-chart {
          height: 270px;
          margin-top: 28px;
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 18px;
          align-items: end;
        }

        .ceo-chart-column {
          height: 100%;
          display: grid;
          grid-template-rows: auto 1fr auto;
          gap: 9px;
          text-align: center;
        }

        .ceo-chart-column small {
          color: rgba(226,232,240,.52);
          font-size: 10px;
        }

        .ceo-chart-track {
          display: flex;
          align-items: flex-end;
          justify-content: center;
          overflow: hidden;
          border-radius: 14px;
          background: rgba(255,255,255,.035);
        }

        .ceo-chart-track i {
          width: 62%;
          min-height: 5%;
          border-radius: 12px 12px 3px 3px;
          background: linear-gradient(180deg, #22d3ee, #4f46e5);
          box-shadow: 0 0 24px rgba(34,211,238,.18);
        }

        .ceo-chart-column > span {
          color: rgba(226,232,240,.48);
          font-size: 12px;
          font-weight: 800;
        }

        .ceo-split-stats {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
          margin-top: 18px;
        }

        .ceo-split-stats > div,
        .ceo-order-stats > div {
          padding: 15px;
          border-radius: 17px;
          background: rgba(255,255,255,.045);
        }

        .ceo-split-stats span,
        .ceo-split-stats strong,
        .ceo-order-stats span,
        .ceo-order-stats strong {
          display: block;
        }

        .ceo-split-stats span,
        .ceo-order-stats span {
          color: rgba(226,232,240,.47);
          font-size: 11px;
        }

        .ceo-split-stats strong,
        .ceo-order-stats strong {
          margin-top: 7px;
          font-size: 18px;
        }

        .ceo-funnel {
          display: grid;
          gap: 18px;
          margin-top: 28px;
        }

        .ceo-funnel > div > div:first-child {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 7px;
        }

        .ceo-funnel > div > div:first-child span {
          color: rgba(226,232,240,.62);
        }

        .ceo-funnel-track {
          height: 10px;
          overflow: hidden;
          border-radius: 999px;
          background: rgba(255,255,255,.06);
        }

        .ceo-funnel-track i {
          display: block;
          height: 100%;
          border-radius: 999px;
          background: linear-gradient(90deg, #8b5cf6, #38bdf8);
        }

        .ceo-funnel small {
          display: block;
          margin-top: 5px;
          color: rgba(226,232,240,.38);
        }

        .ceo-insights {
          display: grid;
          gap: 11px;
          margin-top: 22px;
        }

        .ceo-insight {
          display: grid;
          grid-template-columns: 8px 1fr;
          gap: 12px;
          padding: 14px;
          border-radius: 16px;
          background: rgba(255,255,255,.035);
        }

        .ceo-insight > i {
          width: 7px;
          height: 7px;
          margin-top: 5px;
          border-radius: 999px;
        }

        .ceo-good > i { background: #4ade80; }
        .ceo-warn > i { background: #facc15; }
        .ceo-info > i { background: #38bdf8; }

        .ceo-insight strong,
        .ceo-insight span {
          display: block;
        }

        .ceo-insight span {
          margin-top: 4px;
          color: rgba(226,232,240,.48);
          font-size: 12px;
          line-height: 1.45;
        }

        .ceo-order-stats {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
          margin-top: 22px;
        }

        .ceo-provider-list,
        .ceo-feed {
          display: grid;
          gap: 8px;
          margin-top: 20px;
        }

        .ceo-provider-list > div,
        .ceo-feed > div {
          display: grid;
          align-items: center;
          gap: 12px;
          padding: 12px 0;
          border-bottom: 1px solid rgba(255,255,255,.06);
        }

        .ceo-provider-list > div {
          grid-template-columns: 30px 1fr auto;
        }

        .ceo-provider-list > div > b {
          width: 28px;
          height: 28px;
          display: grid;
          place-items: center;
          border-radius: 10px;
          background: rgba(99,102,241,.14);
          color: #c4b5fd;
        }

        .ceo-provider-list strong,
        .ceo-provider-list span,
        .ceo-feed strong,
        .ceo-feed small {
          display: block;
        }

        .ceo-provider-list span,
        .ceo-provider-list small,
        .ceo-feed small {
          margin-top: 3px;
          color: rgba(226,232,240,.43);
          font-size: 11px;
        }

        .ceo-feed > div {
          grid-template-columns: 48px 1fr auto;
        }

        .ceo-feed > div > span {
          width: 44px;
          height: 36px;
          display: grid;
          place-items: center;
          border-radius: 12px;
          background: rgba(56,189,248,.10);
          color: #7dd3fc;
          font-size: 10px;
          font-weight: 900;
        }

        .ceo-feed > div > b {
          text-align: right;
          font-size: 12px;
        }

        .ceo-empty {
          color: rgba(226,232,240,.45);
        }

        @media (max-width: 1200px) {
          .ceo-kpi-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }

          .ceo-triple-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 900px) {
          .ceo-hero-grid,
          .ceo-main-grid,
          .ceo-double-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 680px) {
          .ceo-page {
            padding-inline: 12px;
          }

          .ceo-kpi-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .ceo-revenue-meta,
          .ceo-split-stats {
            grid-template-columns: 1fr;
          }

          .ceo-score-card {
            align-items: flex-start;
            flex-direction: column;
          }
        }
      `}</style>
    </main>
  );
}