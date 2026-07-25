import Link from "next/link";
import AdminAutoRefresh from "@/components/admin/admin-auto-refresh";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

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

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function getRecommendationTone(value: number) {
  if (value >= 70) return "positive";
  if (value >= 40) return "warning";
  return "critical";
}

export default async function AdminAiPage() {
  const now = new Date();
  const monthStart = startOfMonth(now);
  const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const previous7DaysStart = new Date(
    now.getTime() - 14 * 24 * 60 * 60 * 1000
  );
  const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [
    providerCount,
    approvedProviderCount,
    pendingProviderCount,
    blockedProviderCount,
    providersLast7,
    providersPrevious7,
    leadCount,
    leadsLast7,
    leadsPrevious7,
    leadPurchaseCount,
    leadPurchasesLast7,
    leadPurchasesPrevious7,
    wonCount,
    contactedCount,
    offerSentCount,
    paidCreditAggregate,
    revenueMonthAggregate,
    revenueLast7Aggregate,
    revenuePrevious7Aggregate,
    topRegions,
    topCategories,
    lowActivityProviders,
    fixedOrderCount,
    soldFixedOrderCount,
    completedFixedOrderCount,
    fixedOrderRevenueMonthAggregate,
  ] = await Promise.all([
    prisma.provider.count(),
    prisma.provider.count({ where: { status: "APPROVED" } }),
    prisma.provider.count({ where: { status: "PENDING" } }),
    prisma.provider.count({ where: { status: "BLOCKED" } }),
    prisma.provider.count({
      where: {
        createdAt: {
          gte: last7Days,
        },
      },
    }),
    prisma.provider.count({
      where: {
        createdAt: {
          gte: previous7DaysStart,
          lt: last7Days,
        },
      },
    }),

    prisma.lead.count(),
    prisma.lead.count({
      where: {
        createdAt: {
          gte: last7Days,
        },
      },
    }),
    prisma.lead.count({
      where: {
        createdAt: {
          gte: previous7DaysStart,
          lt: last7Days,
        },
      },
    }),

    prisma.leadPurchase.count(),
    prisma.leadPurchase.count({
      where: {
        createdAt: {
          gte: last7Days,
        },
      },
    }),
    prisma.leadPurchase.count({
      where: {
        createdAt: {
          gte: previous7DaysStart,
          lt: last7Days,
        },
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

    prisma.creditPurchase.aggregate({
      where: {
        status: "paid",
      },
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
      take: 6,
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
      take: 6,
    }),

    prisma.provider.findMany({
      where: {
        status: "APPROVED",
      },
      orderBy: {
        createdAt: "asc",
      },
      take: 8,
      select: {
        id: true,
        companyName: true,
        region: true,
        credits: true,
        createdAt: true,
        _count: {
          select: {
            purchases: true,
          },
        },
      },
    }),

    prisma.fixedOrder.count(),
    prisma.fixedOrder.count({
      where: {
        status: "SOLD",
      },
    }),
    prisma.fixedOrder.count({
      where: {
        status: "COMPLETED",
      },
    }),
    prisma.fixedOrder.aggregate({
      where: {
        status: {
          in: ["SOLD", "COMPLETED"],
        },
        soldAt: {
          gte: monthStart,
        },
      },
      _sum: {
        commissionAmountCents: true,
      },
    }),
  ]);

  const totalRevenue = paidCreditAggregate._sum.amount ?? 0;
  const revenueMonth = revenueMonthAggregate._sum.amount ?? 0;
  const revenueLast7 = revenueLast7Aggregate._sum.amount ?? 0;
  const revenuePrevious7 = revenuePrevious7Aggregate._sum.amount ?? 0;
  const totalCreditsSold = paidCreditAggregate._sum.credits ?? 0;
  const totalPayments = paidCreditAggregate._count.id;

  const providerGrowth = growth(providersLast7, providersPrevious7);
  const leadGrowth = growth(leadsLast7, leadsPrevious7);
  const purchaseGrowth = growth(
    leadPurchasesLast7,
    leadPurchasesPrevious7
  );
  const revenueGrowth = growth(revenueLast7, revenuePrevious7);

  const purchaseRate = percentage(leadPurchaseCount, leadCount);
  const contactRate = percentage(contactedCount, leadPurchaseCount);
  const offerRate = percentage(offerSentCount, leadPurchaseCount);
  const wonRate = percentage(wonCount, leadPurchaseCount);
  const approvalRate = percentage(approvedProviderCount, providerCount);
  const fixedOrderSellThrough = percentage(
    soldFixedOrderCount + completedFixedOrderCount,
    fixedOrderCount
  );

  const averageRevenuePerPayment =
    totalPayments > 0 ? Math.round(totalRevenue / totalPayments) : 0;

  const monthlyForecast =
    now.getDate() > 0
      ? Math.round((revenueMonth / now.getDate()) * 30)
      : revenueMonth;

  const annualForecast = monthlyForecast * 12;

  const businessScore = Math.round(
    Math.min(
      100,
      Math.max(
        0,
        approvalRate * 0.2 +
          purchaseRate * 0.25 +
          wonRate * 0.25 +
          Math.min(Math.max(revenueGrowth + 50, 0), 100) * 0.15 +
          Math.min(Math.max(leadGrowth + 50, 0), 100) * 0.15
      )
    )
  );

  const recommendations = [
    pendingProviderCount > 0
      ? {
          tone: "critical",
          title: `${pendingProviderCount} Anbieter warten auf Freigabe`,
          text: "Eine schnelle Prüfung erhöht die Zahl aktiver Anbieter und verbessert die regionale Abdeckung.",
          href: "/admin/providers",
          cta: "Anbieter prüfen",
        }
      : {
          tone: "positive",
          title: "Keine offenen Anbieterfreigaben",
          text: "Die Anbieterprüfung ist aktuell. Der Fokus kann auf Aktivierung und Verkäufe gelegt werden.",
          href: "/admin/providers",
          cta: "Anbieter ansehen",
        },

    purchaseRate < 25
      ? {
          tone: "warning",
          title: "Lead-Kaufquote ist ausbaufähig",
          text: `Aktuell werden ${purchaseRate}% aller Leads gekauft. Prüfe Preise, Leadqualität und regionale Relevanz.`,
          href: "/admin/analytics",
          cta: "Conversion prüfen",
        }
      : {
          tone: "positive",
          title: "Lead-Kaufquote entwickelt sich stabil",
          text: `${purchaseRate}% aller Leads wurden mindestens einmal gekauft.`,
          href: "/admin/leads",
          cta: "Leads ansehen",
        },

    revenueGrowth < 0
      ? {
          tone: "critical",
          title: "Umsatz der letzten 7 Tage ist gesunken",
          text: `Der Umsatz liegt ${Math.abs(
            revenueGrowth
          )}% unter der Vorperiode. Prüfe Zahlungen, Lead-Verkäufe und Anbieteraktivität.`,
          href: "/admin/analytics",
          cta: "Umsatz analysieren",
        }
      : {
          tone: "positive",
          title: "Umsatztrend ist positiv",
          text: `Der Umsatz liegt ${revenueGrowth}% über der Vorperiode.`,
          href: "/admin/analytics",
          cta: "Wachstum ansehen",
        },

    wonRate < 15
      ? {
          tone: "warning",
          title: "Gewinnquote im CRM ist niedrig",
          text: `Nur ${wonRate}% der gekauften Leads sind als gewonnen markiert. Anbieter sollten ihre CRM-Status konsequenter pflegen.`,
          href: "/admin/activity",
          cta: "Aktivitäten prüfen",
        }
      : {
          tone: "positive",
          title: "CRM-Ergebnisse sind solide",
          text: `${wonRate}% der Lead-Käufe sind als gewonnen markiert.`,
          href: "/admin/activity",
          cta: "CRM ansehen",
        },

    fixedOrderSellThrough < 30
      ? {
          tone: "warning",
          title: "Fixaufträge schneller verkaufen",
          text: `Die Sell-through-Rate liegt bei ${fixedOrderSellThrough}%. Prüfe Provision, Auftragsqualität und Anbieter-Zielgruppe.`,
          href: "/admin/fixed-orders",
          cta: "Fixaufträge prüfen",
        }
      : {
          tone: "positive",
          title: "Fixaufträge verkaufen sich gut",
          text: `${fixedOrderSellThrough}% der Fixaufträge wurden verkauft oder abgeschlossen.`,
          href: "/admin/fixed-orders/analytics",
          cta: "Fixauftrag-Analytics",
        },
  ];

  const scoreTone = getRecommendationTone(businessScore);

  return (
    <main className="ai-page">
      <div className="ai-glow ai-glow-one" />
      <div className="ai-glow ai-glow-two" />

      <div className="ai-shell">
        <header className="ai-header">
          <div>
            <span className="ai-eyebrow">AUFTRAGO BUSINESS INTELLIGENCE</span>
            <h1>AI Center</h1>
            <p>
              Automatische Geschäftsanalysen, Warnungen, Prognosen und
              Handlungsempfehlungen auf Basis deiner aktuellen Plattformdaten.
            </p>
          </div>

          <div className="ai-actions">
            <AdminAutoRefresh intervalSeconds={15} />

            <Link href="/admin" className="ai-btn ai-btn-secondary">
              ← Dashboard
            </Link>

            <Link href="/admin/notifications" className="ai-btn ai-btn-secondary">
              Notifications
            </Link>

            <Link href="/admin/analytics" className="ai-btn ai-btn-primary">
              Analytics öffnen
            </Link>
          </div>
        </header>

        <section className={`ai-score-card ai-score-${scoreTone}`}>
          <div>
            <span>GESAMTBEWERTUNG</span>
            <strong>{businessScore}</strong>
            <small>von 100 Punkten</small>
          </div>

          <div className="ai-score-copy">
            <h2>
              {businessScore >= 70
                ? "Die Plattform entwickelt sich stark."
                : businessScore >= 40
                ? "Die Plattform ist stabil, hat aber klares Potenzial."
                : "Mehrere Bereiche benötigen Aufmerksamkeit."}
            </h2>

            <p>
              Der Score berücksichtigt Anbieteraktivität, Lead-Verkäufe,
              Conversion, Umsatzentwicklung und CRM-Ergebnisse.
            </p>

            <div className="ai-score-track">
              <i style={{ width: `${businessScore}%` }} />
            </div>
          </div>
        </section>

        <section className="ai-kpi-grid">
          {[
            {
              label: "Umsatzprognose Monat",
              value: formatMoney(monthlyForecast),
              detail: `${revenueGrowth >= 0 ? "+" : ""}${revenueGrowth}% zur Vorperiode`,
              tone: "emerald",
            },
            {
              label: "ARR-Prognose",
              value: formatMoney(annualForecast),
              detail: "Hochrechnung auf 12 Monate",
              tone: "blue",
            },
            {
              label: "Lead-Kaufquote",
              value: `${purchaseRate}%`,
              detail: `${formatNumber(leadPurchaseCount)} Käufe`,
              tone: "violet",
            },
            {
              label: "Gewinnquote",
              value: `${wonRate}%`,
              detail: `${formatNumber(wonCount)} gewonnen`,
              tone: "amber",
            },
            {
              label: "Ø Zahlung",
              value: formatMoney(averageRevenuePerPayment),
              detail: `${formatNumber(totalPayments)} Zahlungen`,
              tone: "pink",
            },
          ].map((item) => (
            <article className={`ai-kpi ai-kpi-${item.tone}`} key={item.label}>
              <span>{item.label}</span>
              <strong>{item.value}</strong>
              <small>{item.detail}</small>
            </article>
          ))}
        </section>

        <section className="ai-main-grid">
          <article className="ai-panel">
            <div className="ai-panel-head">
              <div>
                <span>AI EMPFEHLUNGEN</span>
                <h2>Priorisierte Massnahmen</h2>
              </div>

              <small>Live aus deinen Daten</small>
            </div>

            <div className="ai-recommendation-list">
              {recommendations.map((item) => (
                <div
                  className={`ai-recommendation ai-recommendation-${item.tone}`}
                  key={item.title}
                >
                  <div className="ai-recommendation-icon">
                    {item.tone === "positive"
                      ? "✓"
                      : item.tone === "critical"
                      ? "!"
                      : "↗"}
                  </div>

                  <div>
                    <strong>{item.title}</strong>
                    <p>{item.text}</p>
                    <Link href={item.href}>{item.cta} →</Link>
                  </div>
                </div>
              ))}
            </div>
          </article>

          <aside className="ai-side-column">
            <article className="ai-panel">
              <div className="ai-panel-head">
                <div>
                  <span>WACHSTUM</span>
                  <h2>7-Tage-Trends</h2>
                </div>
              </div>

              <div className="ai-trend-list">
                {[
                  {
                    label: "Umsatz",
                    value: revenueGrowth,
                  },
                  {
                    label: "Leads",
                    value: leadGrowth,
                  },
                  {
                    label: "Anbieter",
                    value: providerGrowth,
                  },
                  {
                    label: "Lead-Käufe",
                    value: purchaseGrowth,
                  },
                ].map((item) => (
                  <div className="ai-trend-row" key={item.label}>
                    <span>{item.label}</span>
                    <strong className={item.value >= 0 ? "trend-up" : "trend-down"}>
                      {item.value >= 0 ? "+" : ""}
                      {item.value}%
                    </strong>
                  </div>
                ))}
              </div>
            </article>

            <article className="ai-panel">
              <div className="ai-panel-head">
                <div>
                  <span>PLATTFORM</span>
                  <h2>Status</h2>
                </div>
              </div>

              <div className="ai-status-list">
                <div>
                  <span>Genehmigte Anbieter</span>
                  <strong>{approvedProviderCount}</strong>
                </div>
                <div>
                  <span>Ausstehende Anbieter</span>
                  <strong>{pendingProviderCount}</strong>
                </div>
                <div>
                  <span>Gesperrte Anbieter</span>
                  <strong>{blockedProviderCount}</strong>
                </div>
                <div>
                  <span>Credits verkauft</span>
                  <strong>{formatNumber(totalCreditsSold)}</strong>
                </div>
              </div>
            </article>
          </aside>
        </section>

        <section className="ai-insight-grid">
          <article className="ai-panel">
            <div className="ai-panel-head">
              <div>
                <span>REGIONEN</span>
                <h2>Stärkste Märkte</h2>
              </div>
            </div>

            <div className="ai-ranking-list">
              {topRegions.length === 0 ? (
                <p className="ai-empty">Noch keine Daten vorhanden.</p>
              ) : (
                topRegions.map((item, index) => (
                  <div className="ai-ranking-row" key={item.region}>
                    <b>{index + 1}</b>
                    <span>{item.region || "Ohne Region"}</span>
                    <strong>{item._count._all}</strong>
                  </div>
                ))
              )}
            </div>
          </article>

          <article className="ai-panel">
            <div className="ai-panel-head">
              <div>
                <span>KATEGORIEN</span>
                <h2>Stärkste Leistungen</h2>
              </div>
            </div>

            <div className="ai-ranking-list">
              {topCategories.length === 0 ? (
                <p className="ai-empty">Noch keine Daten vorhanden.</p>
              ) : (
                topCategories.map((item, index) => (
                  <div className="ai-ranking-row" key={item.category}>
                    <b>{index + 1}</b>
                    <span>{item.category || "Ohne Kategorie"}</span>
                    <strong>{item._count._all}</strong>
                  </div>
                ))
              )}
            </div>
          </article>

          <article className="ai-panel">
            <div className="ai-panel-head">
              <div>
                <span>ANBIETERAKTIVITÄT</span>
                <h2>Potenzial zur Aktivierung</h2>
              </div>
            </div>

            <div className="ai-provider-list">
              {lowActivityProviders.length === 0 ? (
                <p className="ai-empty">Keine Anbieter gefunden.</p>
              ) : (
                lowActivityProviders.map((provider) => (
                  <Link
                    href="/admin/providers"
                    className="ai-provider-row"
                    key={provider.id}
                  >
                    <div>
                      <strong>{provider.companyName}</strong>
                      <span>{provider.region || "Keine Region"}</span>
                    </div>

                    <div>
                      <strong>{provider._count.purchases}</strong>
                      <span>Käufe</span>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </article>
        </section>

        <section className="ai-conversion-panel">
          <div className="ai-panel-head">
            <div>
              <span>CONVERSION ENGINE</span>
              <h2>Lead-Verkaufsprozess</h2>
            </div>
          </div>

          <div className="ai-conversion-grid">
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
                percent: contactRate,
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
              <div className="ai-conversion-card" key={item.label}>
                <span>{item.label}</span>
                <strong>{formatNumber(item.value)}</strong>

                <div className="ai-conversion-track">
                  <i style={{ width: `${Math.max(item.percent, 3)}%` }} />
                </div>

                <small>{item.percent}%</small>
              </div>
            ))}
          </div>
        </section>

        <section className="ai-footer-grid">
          <article className="ai-footer-card">
            <span>Fixaufträge</span>
            <strong>{formatNumber(fixedOrderCount)}</strong>
            <small>{fixedOrderSellThrough}% Sell-through</small>
          </article>

          <article className="ai-footer-card">
            <span>Fixauftrag-Provision Monat</span>
            <strong>
              {formatMoney(
                fixedOrderRevenueMonthAggregate._sum.commissionAmountCents ?? 0
              )}
            </strong>
            <small>Verkauft und abgeschlossen</small>
          </article>

          <article className="ai-footer-card">
            <span>Freigabequote Anbieter</span>
            <strong>{approvalRate}%</strong>
            <small>{approvedProviderCount} genehmigt</small>
          </article>

          <article className="ai-footer-card">
            <span>Gesamtumsatz</span>
            <strong>{formatMoney(totalRevenue)}</strong>
            <small>Bezahlte Credit-Pakete</small>
          </article>
        </section>
      </div>

      <style>{`
        * {
          box-sizing: border-box;
        }

        .ai-page {
          position: relative;
          min-height: 100vh;
          overflow: hidden;
          padding: 42px 22px 72px;
          color: #ffffff;
          background:
            radial-gradient(circle at 8% 4%, rgba(37,99,235,0.14), transparent 28%),
            radial-gradient(circle at 92% 12%, rgba(124,58,237,0.15), transparent 28%),
            #050914;
        }

        .ai-glow {
          position: fixed;
          width: 430px;
          height: 430px;
          border-radius: 999px;
          filter: blur(125px);
          opacity: 0.16;
          pointer-events: none;
        }

        .ai-glow-one {
          top: -180px;
          left: -160px;
          background: #2563eb;
        }

        .ai-glow-two {
          top: 260px;
          right: -180px;
          background: #7c3aed;
        }

        .ai-shell {
          position: relative;
          z-index: 1;
          max-width: 1480px;
          margin: 0 auto;
        }

        .ai-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 24px;
          flex-wrap: wrap;
        }

        .ai-eyebrow,
        .ai-panel-head span,
        .ai-score-card > div:first-child > span {
          color: #93c5fd;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.12em;
        }

        .ai-header h1 {
          margin: 10px 0 0;
          font-size: clamp(42px, 7vw, 78px);
          line-height: 0.95;
          letter-spacing: -0.06em;
        }

        .ai-header p {
          max-width: 760px;
          margin: 18px 0 0;
          color: #94a3b8;
          line-height: 1.7;
        }

        .ai-actions {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .ai-btn {
          min-height: 44px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0 16px;
          border-radius: 14px;
          text-decoration: none;
          font-size: 13px;
          font-weight: 850;
          transition: transform 160ms ease;
        }

        .ai-btn:hover {
          transform: translateY(-2px);
        }

        .ai-btn-secondary {
          color: #dbeafe;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.045);
        }

        .ai-btn-primary {
          color: #ffffff;
          border: 1px solid rgba(96,165,250,0.28);
          background: linear-gradient(135deg, #2563eb, #7c3aed);
          box-shadow: 0 14px 36px rgba(37,99,235,0.2);
        }

        .ai-score-card {
          display: grid;
          grid-template-columns: 220px 1fr;
          gap: 28px;
          align-items: center;
          margin-top: 28px;
          padding: 28px;
          border-radius: 28px;
          border: 1px solid rgba(255,255,255,0.09);
          background:
            radial-gradient(circle at 85% 15%, rgba(59,130,246,0.16), transparent 34%),
            linear-gradient(145deg, rgba(255,255,255,0.045), rgba(7,12,24,0.97));
        }

        .ai-score-card > div:first-child {
          padding: 24px;
          border-radius: 22px;
          text-align: center;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
        }

        .ai-score-card > div:first-child strong {
          display: block;
          margin-top: 10px;
          font-size: 64px;
          line-height: 1;
        }

        .ai-score-card > div:first-child small {
          display: block;
          margin-top: 7px;
          color: #64748b;
        }

        .ai-score-positive > div:first-child strong {
          color: #86efac;
        }

        .ai-score-warning > div:first-child strong {
          color: #fcd34d;
        }

        .ai-score-critical > div:first-child strong {
          color: #fca5a5;
        }

        .ai-score-copy h2 {
          margin: 0;
          font-size: clamp(24px, 3vw, 36px);
          line-height: 1.2;
        }

        .ai-score-copy p {
          max-width: 760px;
          margin: 11px 0 0;
          color: #94a3b8;
          line-height: 1.7;
        }

        .ai-score-track {
          height: 10px;
          margin-top: 20px;
          overflow: hidden;
          border-radius: 999px;
          background: rgba(255,255,255,0.06);
        }

        .ai-score-track i {
          display: block;
          height: 100%;
          border-radius: inherit;
          background: linear-gradient(90deg, #2563eb, #7c3aed, #22c55e);
        }

        .ai-kpi-grid {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 14px;
          margin-top: 18px;
        }

        .ai-kpi {
          padding: 21px;
          border-radius: 22px;
          border: 1px solid rgba(255,255,255,0.085);
          background:
            linear-gradient(145deg, rgba(255,255,255,0.04), rgba(7,12,24,0.96));
        }

        .ai-kpi span {
          display: block;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .ai-kpi strong {
          display: block;
          margin-top: 12px;
          font-size: 27px;
        }

        .ai-kpi small {
          display: block;
          margin-top: 8px;
          color: #64748b;
        }

        .ai-kpi-emerald span {
          color: #86efac;
        }

        .ai-kpi-blue span {
          color: #93c5fd;
        }

        .ai-kpi-violet span {
          color: #c4b5fd;
        }

        .ai-kpi-amber span {
          color: #fcd34d;
        }

        .ai-kpi-pink span {
          color: #f9a8d4;
        }

        .ai-main-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.45fr) minmax(300px, 0.55fr);
          gap: 18px;
          margin-top: 18px;
        }

        .ai-side-column {
          display: grid;
          align-content: start;
          gap: 18px;
        }

        .ai-panel,
        .ai-conversion-panel,
        .ai-footer-card {
          border: 1px solid rgba(255,255,255,0.085);
          background:
            linear-gradient(145deg, rgba(255,255,255,0.04), rgba(7,12,24,0.96));
          box-shadow: 0 24px 80px rgba(0,0,0,0.18);
        }

        .ai-panel,
        .ai-conversion-panel {
          padding: 24px;
          border-radius: 27px;
        }

        .ai-panel-head {
          display: flex;
          justify-content: space-between;
          gap: 14px;
          align-items: flex-start;
        }

        .ai-panel-head h2 {
          margin: 7px 0 0;
        }

        .ai-panel-head small {
          color: #64748b;
        }

        .ai-recommendation-list {
          display: grid;
          gap: 11px;
          margin-top: 20px;
        }

        .ai-recommendation {
          display: grid;
          grid-template-columns: 46px 1fr;
          gap: 14px;
          padding: 17px;
          border-radius: 18px;
          border: 1px solid rgba(255,255,255,0.065);
          background: rgba(255,255,255,0.025);
        }

        .ai-recommendation-icon {
          width: 46px;
          height: 46px;
          display: grid;
          place-items: center;
          border-radius: 14px;
          font-weight: 950;
          color: #93c5fd;
          background: rgba(59,130,246,0.12);
        }

        .ai-recommendation-positive .ai-recommendation-icon {
          color: #86efac;
          background: rgba(34,197,94,0.12);
        }

        .ai-recommendation-warning .ai-recommendation-icon {
          color: #fcd34d;
          background: rgba(245,158,11,0.12);
        }

        .ai-recommendation-critical .ai-recommendation-icon {
          color: #fca5a5;
          background: rgba(239,68,68,0.12);
        }

        .ai-recommendation strong {
          display: block;
          font-size: 14px;
        }

        .ai-recommendation p {
          margin: 7px 0 0;
          color: #94a3b8;
          font-size: 12px;
          line-height: 1.65;
        }

        .ai-recommendation a {
          display: inline-flex;
          margin-top: 10px;
          color: #93c5fd;
          text-decoration: none;
          font-size: 11px;
          font-weight: 850;
        }

        .ai-trend-list,
        .ai-status-list {
          display: grid;
          gap: 10px;
          margin-top: 18px;
        }

        .ai-trend-row,
        .ai-status-list > div {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 13px 14px;
          border-radius: 14px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.055);
        }

        .ai-trend-row span,
        .ai-status-list span {
          color: #94a3b8;
          font-size: 12px;
        }

        .trend-up {
          color: #86efac;
        }

        .trend-down {
          color: #fca5a5;
        }

        .ai-insight-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 18px;
          margin-top: 18px;
        }

        .ai-ranking-list,
        .ai-provider-list {
          display: grid;
          gap: 9px;
          margin-top: 18px;
        }

        .ai-ranking-row,
        .ai-provider-row {
          display: grid;
          align-items: center;
          gap: 12px;
          padding: 13px 14px;
          border-radius: 14px;
          border: 1px solid rgba(255,255,255,0.055);
          background: rgba(255,255,255,0.03);
        }

        .ai-ranking-row {
          grid-template-columns: 28px 1fr auto;
        }

        .ai-ranking-row b {
          color: #93c5fd;
        }

        .ai-ranking-row span {
          color: #cbd5e1;
          font-size: 12px;
        }

        .ai-provider-row {
          grid-template-columns: 1fr auto;
          color: #ffffff;
          text-decoration: none;
        }

        .ai-provider-row > div:last-child {
          text-align: right;
        }

        .ai-provider-row strong {
          display: block;
          font-size: 12px;
        }

        .ai-provider-row span {
          display: block;
          margin-top: 4px;
          color: #64748b;
          font-size: 10px;
        }

        .ai-conversion-panel {
          margin-top: 18px;
        }

        .ai-conversion-grid {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 12px;
          margin-top: 20px;
        }

        .ai-conversion-card {
          padding: 17px;
          border-radius: 17px;
          border: 1px solid rgba(255,255,255,0.06);
          background: rgba(255,255,255,0.03);
        }

        .ai-conversion-card > span {
          color: #94a3b8;
          font-size: 11px;
        }

        .ai-conversion-card > strong {
          display: block;
          margin-top: 9px;
          font-size: 24px;
        }

        .ai-conversion-track {
          height: 7px;
          margin-top: 13px;
          overflow: hidden;
          border-radius: 999px;
          background: rgba(255,255,255,0.06);
        }

        .ai-conversion-track i {
          display: block;
          height: 100%;
          border-radius: inherit;
          background: linear-gradient(90deg, #2563eb, #7c3aed);
        }

        .ai-conversion-card small {
          display: block;
          margin-top: 8px;
          color: #64748b;
        }

        .ai-footer-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 14px;
          margin-top: 18px;
        }

        .ai-footer-card {
          padding: 20px;
          border-radius: 21px;
        }

        .ai-footer-card span {
          display: block;
          color: #94a3b8;
          font-size: 11px;
        }

        .ai-footer-card strong {
          display: block;
          margin-top: 10px;
          font-size: 25px;
        }

        .ai-footer-card small {
          display: block;
          margin-top: 7px;
          color: #64748b;
        }

        .ai-empty {
          margin: 18px 0 0;
          color: #64748b;
        }

        @media (max-width: 1180px) {
          .ai-kpi-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .ai-main-grid {
            grid-template-columns: 1fr;
          }

          .ai-insight-grid {
            grid-template-columns: 1fr;
          }

          .ai-conversion-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .ai-footer-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 760px) {
          .ai-page {
            padding: 28px 14px 48px;
          }

          .ai-actions {
            width: 100%;
          }

          .ai-btn {
            flex: 1 1 150px;
          }

          .ai-score-card {
            grid-template-columns: 1fr;
          }

          .ai-kpi-grid,
          .ai-conversion-grid,
          .ai-footer-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </main>
  );
}