import Link from "next/link";
import AdminAutoRefresh from "@/components/admin/admin-auto-refresh";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

type AuditType =
  | "provider"
  | "lead"
  | "purchase"
  | "payment"
  | "fixed-order";

type AuditTone = "info" | "success" | "warning" | "critical";

type AuditItem = {
  id: string;
  type: AuditType;
  tone: AuditTone;
  title: string;
  description: string;
  meta: string;
  href: string;
  date: Date;
};

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

function typeLabel(type: AuditType) {
  if (type === "provider") return "Anbieter";
  if (type === "lead") return "Lead";
  if (type === "purchase") return "Lead-Kauf";
  if (type === "payment") return "Zahlung";
  return "Fixauftrag";
}

function typeIcon(type: AuditType) {
  if (type === "provider") return "P";
  if (type === "lead") return "L";
  if (type === "purchase") return "K";
  if (type === "payment") return "CHF";
  return "F";
}

function toneLabel(tone: AuditTone) {
  if (tone === "success") return "Erfolg";
  if (tone === "warning") return "Prüfen";
  if (tone === "critical") return "Kritisch";
  return "Info";
}

export default async function AdminAuditPage({
  searchParams,
}: {
  searchParams?: Promise<{
    type?: string;
    period?: string;
  }>;
}) {
  const params = (await searchParams) ?? {};
  const selectedType = params.type ?? "all";
  const selectedPeriod = params.period ?? "30";

  const periodDays = ["1", "7", "30", "90"].includes(selectedPeriod)
    ? Number(selectedPeriod)
    : 30;

  const now = new Date();
  const periodStart = new Date(
    now.getTime() - periodDays * 24 * 60 * 60 * 1000
  );

  const [
    providers,
    leads,
    purchases,
    payments,
    fixedOrders,
    providerCount,
    leadCount,
    purchaseCount,
    paymentAggregate,
    fixedOrderCount,
  ] = await Promise.all([
    prisma.provider.findMany({
      where: {
        createdAt: {
          gte: periodStart,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 80,
      select: {
        id: true,
        companyName: true,
        contactName: true,
        region: true,
        status: true,
        createdAt: true,
      },
    }),

    prisma.lead.findMany({
      where: {
        createdAt: {
          gte: periodStart,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 80,
      select: {
        id: true,
        title: true,
        category: true,
        region: true,
        price: true,
        createdAt: true,
      },
    }),

    prisma.leadPurchase.findMany({
      where: {
        createdAt: {
          gte: periodStart,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 80,
      include: {
        provider: {
          select: {
            companyName: true,
          },
        },
        lead: {
          select: {
            title: true,
            region: true,
          },
        },
      },
    }),

    prisma.creditPurchase.findMany({
      where: {
        status: "paid",
        createdAt: {
          gte: periodStart,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 80,
      include: {
        provider: {
          select: {
            companyName: true,
          },
        },
      },
    }),

    prisma.fixedOrder.findMany({
      where: {
        createdAt: {
          gte: periodStart,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 80,
      select: {
        id: true,
        title: true,
        category: true,
        postalCode: true,
        city: true,
        status: true,
        orderValueCents: true,
        commissionAmountCents: true,
        createdAt: true,
        soldAt: true,
      },
    }),

    prisma.provider.count({
      where: {
        createdAt: {
          gte: periodStart,
        },
      },
    }),

    prisma.lead.count({
      where: {
        createdAt: {
          gte: periodStart,
        },
      },
    }),

    prisma.leadPurchase.count({
      where: {
        createdAt: {
          gte: periodStart,
        },
      },
    }),

    prisma.creditPurchase.aggregate({
      where: {
        status: "paid",
        createdAt: {
          gte: periodStart,
        },
      },
      _sum: {
        amount: true,
      },
      _count: {
        id: true,
      },
    }),

    prisma.fixedOrder.count({
      where: {
        createdAt: {
          gte: periodStart,
        },
      },
    }),
  ]);

  const auditItems: AuditItem[] = [
    ...providers.map((provider) => ({
      id: `provider-${provider.id}`,
      type: "provider" as const,
      tone:
        provider.status === "PENDING"
          ? ("warning" as const)
          : provider.status === "BLOCKED"
            ? ("critical" as const)
            : ("success" as const),
      title:
        provider.status === "PENDING"
          ? "Neue Anbieterregistrierung"
          : provider.status === "BLOCKED"
            ? "Gesperrter Anbieter erfasst"
            : "Anbieterprofil erstellt",
      description: provider.companyName,
      meta: `${provider.contactName} · ${provider.region || "Keine Region"} · ${
        provider.status
      }`,
      href: "/admin/providers",
      date: provider.createdAt,
    })),

    ...leads.map((lead) => ({
      id: `lead-${lead.id}`,
      type: "lead" as const,
      tone: "info" as const,
      title: "Lead erstellt",
      description: lead.title,
      meta: `${lead.category} · ${lead.region} · ${lead.price} Credits`,
      href: `/admin/leads/${lead.id}`,
      date: lead.createdAt,
    })),

    ...purchases.map((purchase) => ({
      id: `purchase-${purchase.id}`,
      type: "purchase" as const,
      tone:
        purchase.status === "WON"
          ? ("success" as const)
          : purchase.status === "LOST"
            ? ("critical" as const)
            : ("info" as const),
      title:
        purchase.status === "WON"
          ? "Lead als gewonnen markiert"
          : purchase.status === "LOST"
            ? "Lead als verloren markiert"
            : "Lead gekauft",
      description: purchase.provider.companyName,
      meta: `${purchase.lead.title} · ${purchase.lead.region} · ${
        purchase.price
      } Credits · ${purchase.status}`,
      href: `/leads/${purchase.leadId}`,
      date: purchase.createdAt,
    })),

    ...payments.map((payment) => ({
      id: `payment-${payment.id}`,
      type: "payment" as const,
      tone: "success" as const,
      title: "Credit-Zahlung eingegangen",
      description: payment.provider.companyName,
      meta: `${formatMoney(payment.amount, payment.currency)} · ${
        payment.credits
      } Credits`,
      href: "/admin/payments",
      date: payment.createdAt,
    })),

    ...fixedOrders.map((order) => ({
      id: `fixed-order-${order.id}`,
      type: "fixed-order" as const,
      tone:
        order.status === "SOLD" || order.status === "COMPLETED"
          ? ("success" as const)
          : order.status === "CANCELLED"
            ? ("critical" as const)
            : order.status === "RESERVED"
              ? ("warning" as const)
              : ("info" as const),
      title:
        order.status === "SOLD"
          ? "Fixauftrag verkauft"
          : order.status === "COMPLETED"
            ? "Fixauftrag abgeschlossen"
            : order.status === "RESERVED"
              ? "Fixauftrag reserviert"
              : order.status === "CANCELLED"
                ? "Fixauftrag storniert"
                : "Fixauftrag erstellt",
      description: order.title,
      meta: `${order.category} · ${order.postalCode} ${order.city} · ${formatMoney(
        order.orderValueCents
      )} Auftragswert · ${formatMoney(
        order.commissionAmountCents
      )} Provision`,
      href: `/admin/fixed-orders/${order.id}`,
      date: order.soldAt || order.createdAt,
    })),
  ]
    .filter((item) =>
      selectedType === "all" ? true : item.type === selectedType
    )
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 200);

  const totalRevenue = paymentAggregate._sum.amount ?? 0;
  const totalEvents =
    providerCount +
    leadCount +
    purchaseCount +
    paymentAggregate._count.id +
    fixedOrderCount;

  const criticalCount = auditItems.filter(
    (item) => item.tone === "critical"
  ).length;

  const successCount = auditItems.filter(
    (item) => item.tone === "success"
  ).length;

  function filterHref(next: { type?: string; period?: string }) {
    const query = new URLSearchParams({
      type: next.type ?? selectedType,
      period: next.period ?? selectedPeriod,
    });

    return `/admin/audit?${query.toString()}`;
  }

  const typeFilters = [
    { value: "all", label: "Alle Ereignisse" },
    { value: "provider", label: "Anbieter" },
    { value: "lead", label: "Leads" },
    { value: "purchase", label: "Lead-Käufe" },
    { value: "payment", label: "Zahlungen" },
    { value: "fixed-order", label: "Fixaufträge" },
  ];

  return (
    <main className="audit-page">
      <div className="audit-glow audit-glow-one" />
      <div className="audit-glow audit-glow-two" />

      <div className="audit-shell">
        <header className="audit-header">
          <div>
            <span className="audit-eyebrow">
              AUFTRAGO EVENT MONITORING
            </span>

            <h1>Audit Log</h1>

            <p>
              Chronologische Übersicht über Anbieter, Leads, Käufe,
              Zahlungen und Fixaufträge.
            </p>
          </div>

          <div className="audit-actions">
            <AdminAutoRefresh intervalSeconds={15} />

            <Link
              href="/admin"
              className="audit-btn audit-btn-secondary"
            >
              ← Dashboard
            </Link>

            <Link
              href="/admin/notifications"
              className="audit-btn audit-btn-secondary"
            >
              Notifications
            </Link>

            <Link
              href="/admin/system"
              className="audit-btn audit-btn-primary"
            >
              System öffnen
            </Link>
          </div>
        </header>

        <section className="audit-kpi-grid">
          <article className="audit-kpi audit-kpi-blue">
            <span>Ereignisse</span>
            <strong>{formatNumber(totalEvents)}</strong>
            <small>Letzte {periodDays} Tage</small>
          </article>

          <article className="audit-kpi audit-kpi-green">
            <span>Erfolgreich</span>
            <strong>{formatNumber(successCount)}</strong>
            <small>Positive Ereignisse</small>
          </article>

          <article className="audit-kpi audit-kpi-red">
            <span>Kritisch</span>
            <strong>{formatNumber(criticalCount)}</strong>
            <small>Prüfung empfohlen</small>
          </article>

          <article className="audit-kpi audit-kpi-violet">
            <span>Zahlungsvolumen</span>
            <strong>{formatMoney(totalRevenue)}</strong>
            <small>{paymentAggregate._count.id} Zahlungen</small>
          </article>
        </section>

        <section className="audit-filter-panel">
          <div className="audit-filter-group">
            <span>Ereignistyp</span>

            <div>
              {typeFilters.map((filter) => (
                <Link
                  href={filterHref({ type: filter.value })}
                  className={
                    selectedType === filter.value
                      ? "audit-filter-active"
                      : ""
                  }
                  key={filter.value}
                >
                  {filter.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="audit-filter-group">
            <span>Zeitraum</span>

            <div>
              {[
                { value: "1", label: "24 Stunden" },
                { value: "7", label: "7 Tage" },
                { value: "30", label: "30 Tage" },
                { value: "90", label: "90 Tage" },
              ].map((filter) => (
                <Link
                  href={filterHref({ period: filter.value })}
                  className={
                    selectedPeriod === filter.value
                      ? "audit-filter-active"
                      : ""
                  }
                  key={filter.value}
                >
                  {filter.label}
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="audit-main-grid">
          <article className="audit-panel">
            <div className="audit-panel-head">
              <div>
                <span>EVENT STREAM</span>
                <h2>Chronologischer Verlauf</h2>
              </div>

              <small>{auditItems.length} Einträge</small>
            </div>

            <div className="audit-list">
              {auditItems.length === 0 ? (
                <div className="audit-empty">
                  <span>✓</span>
                  <h3>Keine Ereignisse gefunden</h3>
                  <p>
                    Für die gewählten Filter sind aktuell keine Einträge
                    vorhanden.
                  </p>
                </div>
              ) : (
                auditItems.map((item) => (
                  <Link
                    href={item.href}
                    className={`audit-row audit-row-${item.tone}`}
                    key={item.id}
                  >
                    <div className="audit-icon">
                      {typeIcon(item.type)}
                    </div>

                    <div className="audit-copy">
                      <div className="audit-row-top">
                        <span>{typeLabel(item.type)}</span>
                        <b>{toneLabel(item.tone)}</b>
                      </div>

                      <strong>{item.title}</strong>
                      <p>{item.description}</p>
                      <small>{item.meta}</small>
                    </div>

                    <time>{formatDate(item.date)}</time>
                  </Link>
                ))
              )}
            </div>
          </article>

          <aside className="audit-side-column">
            <article className="audit-panel">
              <div className="audit-panel-head">
                <div>
                  <span>ZUSAMMENFASSUNG</span>
                  <h2>Aktivitäten</h2>
                </div>
              </div>

              <div className="audit-summary-list">
                <div>
                  <span>Neue Anbieter</span>
                  <strong>{formatNumber(providerCount)}</strong>
                </div>

                <div>
                  <span>Neue Leads</span>
                  <strong>{formatNumber(leadCount)}</strong>
                </div>

                <div>
                  <span>Lead-Käufe</span>
                  <strong>{formatNumber(purchaseCount)}</strong>
                </div>

                <div>
                  <span>Zahlungen</span>
                  <strong>
                    {formatNumber(paymentAggregate._count.id)}
                  </strong>
                </div>

                <div>
                  <span>Fixaufträge</span>
                  <strong>{formatNumber(fixedOrderCount)}</strong>
                </div>
              </div>
            </article>

            <article className="audit-panel audit-info-panel">
              <div className="audit-panel-head">
                <div>
                  <span>HINWEIS</span>
                  <h2>Event-basierter Verlauf</h2>
                </div>
              </div>

              <p>
                Diese Ansicht wird aus den bestehenden Plattformdaten
                erzeugt. Sie zeigt Geschäftsereignisse wie Registrierungen,
                Käufe und Zahlungen. Für ein manipulationssicheres
                Benutzer-Audit mit IP-Adresse, Admin-ID und Vorher-Nachher-
                Werten wäre ein eigenes AuditLog-Datenmodell nötig.
              </p>

              <Link href="/admin/system">
                System Center öffnen →
              </Link>
            </article>

            <article className="audit-panel">
              <div className="audit-panel-head">
                <div>
                  <span>SCHNELLZUGRIFF</span>
                  <h2>Admin-Bereiche</h2>
                </div>
              </div>

              <div className="audit-quick-links">
                <Link href="/admin/providers">
                  <strong>Anbieter</strong>
                  <span>Registrierungen und Freigaben</span>
                </Link>

                <Link href="/admin/leads">
                  <strong>Leads</strong>
                  <span>Anfragen und Verkäufe</span>
                </Link>

                <Link href="/admin/payments">
                  <strong>Zahlungen</strong>
                  <span>Credit-Käufe kontrollieren</span>
                </Link>

                <Link href="/admin/fixed-orders">
                  <strong>Fixaufträge</strong>
                  <span>Aufträge und Provisionen</span>
                </Link>
              </div>
            </article>
          </aside>
        </section>
      </div>

      <style>{`
        * {
          box-sizing: border-box;
        }

        .audit-page {
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

        .audit-glow {
          position: fixed;
          width: 430px;
          height: 430px;
          border-radius: 999px;
          filter: blur(125px);
          opacity: 0.16;
          pointer-events: none;
        }

        .audit-glow-one {
          top: -180px;
          left: -160px;
          background: #2563eb;
        }

        .audit-glow-two {
          top: 260px;
          right: -180px;
          background: #7c3aed;
        }

        .audit-shell {
          position: relative;
          z-index: 1;
          max-width: 1480px;
          margin: 0 auto;
        }

        .audit-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 24px;
          flex-wrap: wrap;
        }

        .audit-eyebrow,
        .audit-panel-head span {
          color: #93c5fd;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.12em;
        }

        .audit-header h1 {
          margin: 10px 0 0;
          font-size: clamp(42px, 7vw, 78px);
          line-height: 0.95;
          letter-spacing: -0.06em;
        }

        .audit-header p {
          max-width: 760px;
          margin: 18px 0 0;
          color: #94a3b8;
          line-height: 1.7;
        }

        .audit-actions {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .audit-btn {
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

        .audit-btn:hover {
          transform: translateY(-2px);
        }

        .audit-btn-secondary {
          color: #dbeafe;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.045);
        }

        .audit-btn-primary {
          color: #ffffff;
          border: 1px solid rgba(96,165,250,0.28);
          background: linear-gradient(135deg, #2563eb, #7c3aed);
          box-shadow: 0 14px 36px rgba(37,99,235,0.2);
        }

        .audit-kpi-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 14px;
          margin-top: 28px;
        }

        .audit-kpi,
        .audit-panel,
        .audit-filter-panel {
          border: 1px solid rgba(255,255,255,0.085);
          background:
            linear-gradient(145deg, rgba(255,255,255,0.04), rgba(7,12,24,0.96));
          box-shadow: 0 24px 80px rgba(0,0,0,0.18);
        }

        .audit-kpi {
          padding: 21px;
          border-radius: 22px;
        }

        .audit-kpi span {
          display: block;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .audit-kpi strong {
          display: block;
          margin-top: 12px;
          font-size: 31px;
        }

        .audit-kpi small {
          display: block;
          margin-top: 8px;
          color: #64748b;
        }

        .audit-kpi-blue span {
          color: #93c5fd;
        }

        .audit-kpi-green span {
          color: #86efac;
        }

        .audit-kpi-red span {
          color: #fca5a5;
        }

        .audit-kpi-violet span {
          color: #c4b5fd;
        }

        .audit-filter-panel {
          display: grid;
          gap: 15px;
          margin-top: 18px;
          padding: 19px;
          border-radius: 22px;
        }

        .audit-filter-group {
          display: grid;
          grid-template-columns: 110px 1fr;
          gap: 14px;
          align-items: center;
        }

        .audit-filter-group > span {
          color: #64748b;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .audit-filter-group > div {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .audit-filter-group a {
          padding: 8px 11px;
          border-radius: 10px;
          color: #94a3b8;
          text-decoration: none;
          font-size: 11px;
          font-weight: 800;
          border: 1px solid rgba(255,255,255,0.065);
          background: rgba(255,255,255,0.03);
        }

        .audit-filter-group a:hover,
        .audit-filter-group .audit-filter-active {
          color: #ffffff;
          border-color: rgba(96,165,250,0.25);
          background: rgba(37,99,235,0.16);
        }

        .audit-main-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.5fr) minmax(300px, 0.5fr);
          gap: 18px;
          margin-top: 18px;
        }

        .audit-panel {
          padding: 24px;
          border-radius: 27px;
        }

        .audit-panel-head {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 14px;
        }

        .audit-panel-head h2 {
          margin: 7px 0 0;
        }

        .audit-panel-head small {
          color: #64748b;
        }

        .audit-list {
          display: grid;
          gap: 10px;
          margin-top: 20px;
        }

        .audit-row {
          display: grid;
          grid-template-columns: 48px minmax(0, 1fr) auto;
          gap: 14px;
          align-items: center;
          padding: 16px;
          border-radius: 18px;
          color: #ffffff;
          text-decoration: none;
          border: 1px solid rgba(255,255,255,0.065);
          background: rgba(255,255,255,0.03);
          transition:
            transform 150ms ease,
            border-color 150ms ease;
        }

        .audit-row:hover {
          transform: translateY(-2px);
          border-color: rgba(96,165,250,0.28);
        }

        .audit-icon {
          width: 48px;
          height: 48px;
          display: grid;
          place-items: center;
          border-radius: 15px;
          color: #93c5fd;
          background: rgba(59,130,246,0.12);
          font-size: 11px;
          font-weight: 950;
        }

        .audit-row-success .audit-icon {
          color: #86efac;
          background: rgba(34,197,94,0.12);
        }

        .audit-row-warning .audit-icon {
          color: #fcd34d;
          background: rgba(245,158,11,0.12);
        }

        .audit-row-critical .audit-icon {
          color: #fca5a5;
          background: rgba(239,68,68,0.12);
        }

        .audit-row-top {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 6px;
        }

        .audit-row-top span,
        .audit-row-top b {
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .audit-row-top span {
          color: #64748b;
        }

        .audit-row-top b {
          padding: 4px 7px;
          border-radius: 999px;
          color: #93c5fd;
          background: rgba(59,130,246,0.1);
        }

        .audit-row-success .audit-row-top b {
          color: #86efac;
          background: rgba(34,197,94,0.1);
        }

        .audit-row-warning .audit-row-top b {
          color: #fcd34d;
          background: rgba(245,158,11,0.1);
        }

        .audit-row-critical .audit-row-top b {
          color: #fca5a5;
          background: rgba(239,68,68,0.1);
        }

        .audit-copy > strong {
          display: block;
          font-size: 14px;
        }

        .audit-copy p {
          margin: 5px 0 0;
          color: #cbd5e1;
          font-size: 12px;
        }

        .audit-copy > small {
          display: block;
          margin-top: 6px;
          color: #64748b;
          font-size: 10px;
          line-height: 1.5;
        }

        .audit-row time {
          color: #64748b;
          font-size: 10px;
          white-space: nowrap;
        }

        .audit-side-column {
          display: grid;
          align-content: start;
          gap: 18px;
        }

        .audit-summary-list,
        .audit-quick-links {
          display: grid;
          gap: 10px;
          margin-top: 18px;
        }

        .audit-summary-list > div {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 14px;
          border-radius: 14px;
          border: 1px solid rgba(255,255,255,0.055);
          background: rgba(255,255,255,0.03);
        }

        .audit-summary-list span {
          color: #94a3b8;
          font-size: 12px;
        }

        .audit-info-panel {
          background:
            radial-gradient(circle at 90% 10%, rgba(59,130,246,0.14), transparent 34%),
            linear-gradient(145deg, rgba(13,29,54,0.9), rgba(7,12,24,0.96));
        }

        .audit-info-panel p {
          margin: 15px 0 0;
          color: #94a3b8;
          font-size: 12px;
          line-height: 1.75;
        }

        .audit-info-panel > a {
          display: inline-flex;
          margin-top: 15px;
          color: #93c5fd;
          text-decoration: none;
          font-size: 11px;
          font-weight: 850;
        }

        .audit-quick-links a {
          display: block;
          padding: 14px;
          border-radius: 14px;
          color: #ffffff;
          text-decoration: none;
          border: 1px solid rgba(255,255,255,0.055);
          background: rgba(255,255,255,0.03);
        }

        .audit-quick-links strong {
          display: block;
          font-size: 12px;
        }

        .audit-quick-links span {
          display: block;
          margin-top: 5px;
          color: #64748b;
          font-size: 10px;
        }

        .audit-empty {
          padding: 54px 22px;
          text-align: center;
          border-radius: 20px;
          background: rgba(255,255,255,0.025);
        }

        .audit-empty > span {
          width: 48px;
          height: 48px;
          display: grid;
          place-items: center;
          margin: 0 auto;
          border-radius: 15px;
          color: #86efac;
          background: rgba(34,197,94,0.1);
          font-size: 20px;
        }

        .audit-empty h3 {
          margin: 15px 0 0;
        }

        .audit-empty p {
          max-width: 440px;
          margin: 9px auto 0;
          color: #64748b;
          line-height: 1.6;
        }

        @media (max-width: 1100px) {
          .audit-kpi-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .audit-main-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 760px) {
          .audit-page {
            padding: 28px 14px 48px;
          }

          .audit-actions {
            width: 100%;
          }

          .audit-btn {
            flex: 1 1 150px;
          }

          .audit-kpi-grid {
            grid-template-columns: 1fr;
          }

          .audit-filter-group {
            grid-template-columns: 1fr;
          }

          .audit-row {
            grid-template-columns: 44px minmax(0, 1fr);
          }

          .audit-row time {
            grid-column: 2;
          }
        }
      `}</style>
    </main>
  );
}