import Link from "next/link";
import AdminAutoRefresh from "@/components/admin/admin-auto-refresh";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

type NotificationPriority = "info" | "warning" | "critical" | "success";
type NotificationType =
  | "lead"
  | "provider"
  | "payment"
  | "purchase"
  | "fixed-order"
  | "system";

type NotificationItem = {
  id: string;
  type: NotificationType;
  priority: NotificationPriority;
  title: string;
  description: string;
  detail: string;
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

function formatMoney(amountInRappen: number, currency = "CHF") {
  return new Intl.NumberFormat("de-CH", {
    style: "currency",
    currency: currency.toUpperCase(),
    minimumFractionDigits: 2,
  }).format(amountInRappen / 100);
}

function addDays(date: Date, days: number) {
  const value = new Date(date);
  value.setDate(value.getDate() + days);
  return value;
}

function notificationIcon(type: NotificationType) {
  if (type === "lead") return "L";
  if (type === "provider") return "P";
  if (type === "payment") return "CHF";
  if (type === "purchase") return "K";
  if (type === "fixed-order") return "F";
  return "!";
}

function priorityLabel(priority: NotificationPriority) {
  if (priority === "critical") return "Kritisch";
  if (priority === "warning") return "Warnung";
  if (priority === "success") return "Erfolg";
  return "Info";
}

function typeLabel(type: NotificationType) {
  if (type === "lead") return "Leads";
  if (type === "provider") return "Anbieter";
  if (type === "payment") return "Zahlungen";
  if (type === "purchase") return "Lead-Käufe";
  if (type === "fixed-order") return "Fixaufträge";
  return "System";
}

export default async function AdminNotificationsPage({
  searchParams,
}: {
  searchParams?: Promise<{
    type?: string;
    priority?: string;
    period?: string;
  }>;
}) {
  const params = (await searchParams) ?? {};
  const selectedType = params.type ?? "all";
  const selectedPriority = params.priority ?? "all";
  const selectedPeriod = params.period ?? "7";

  const periodDays = ["1", "7", "30"].includes(selectedPeriod)
    ? Number(selectedPeriod)
    : 7;

  const now = new Date();
  const periodStart = addDays(now, -periodDays);
  const next24Hours = addDays(now, 1);

  const [
    recentLeads,
    expiringLeads,
    recentProviders,
    pendingProviders,
    recentPayments,
    recentLeadPurchases,
    recentFixedOrders,
  ] = await Promise.all([
    prisma.lead.findMany({
      where: {
        createdAt: {
          gte: periodStart,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 20,
      select: {
        id: true,
        title: true,
        region: true,
        category: true,
        createdAt: true,
      },
    }),

    prisma.lead.findMany({
      where: {
        expiresAt: {
          gte: now,
          lte: next24Hours,
        },
      },
      orderBy: {
        expiresAt: "asc",
      },
      take: 20,
      select: {
        id: true,
        title: true,
        region: true,
        expiresAt: true,
      },
    }),

    prisma.provider.findMany({
      where: {
        createdAt: {
          gte: periodStart,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 20,
      select: {
        id: true,
        companyName: true,
        region: true,
        status: true,
        createdAt: true,
      },
    }),

    prisma.provider.findMany({
      where: {
        status: "PENDING",
      },
      orderBy: {
        createdAt: "asc",
      },
      take: 20,
      select: {
        id: true,
        companyName: true,
        region: true,
        createdAt: true,
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
      take: 20,
      include: {
        provider: {
          select: {
            companyName: true,
          },
        },
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
      take: 20,
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

    prisma.fixedOrder.findMany({
      where: {
        createdAt: {
          gte: periodStart,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 20,
      select: {
        id: true,
        title: true,
        city: true,
        postalCode: true,
        status: true,
        commissionAmountCents: true,
        createdAt: true,
        soldAt: true,
      },
    }),
  ]);

  const notifications: NotificationItem[] = [
    ...expiringLeads.map((lead) => ({
      id: `expiring-lead-${lead.id}`,
      type: "lead" as const,
      priority: "warning" as const,
      title: "Lead läuft bald ab",
      description: lead.title,
      detail: `${lead.region} · Ablauf ${formatDate(lead.expiresAt)}`,
      href: `/admin/leads/${lead.id}`,
      date: lead.expiresAt,
    })),

    ...pendingProviders.map((provider) => ({
      id: `pending-provider-${provider.id}`,
      type: "provider" as const,
      priority: "critical" as const,
      title: "Anbieter wartet auf Freigabe",
      description: provider.companyName,
      detail: `${provider.region || "Keine Region"} · seit ${formatDate(
        provider.createdAt,
      )}`,
      href: "/admin/providers",
      date: provider.createdAt,
    })),

    ...recentLeads.map((lead) => ({
      id: `lead-${lead.id}`,
      type: "lead" as const,
      priority: "info" as const,
      title: "Neuer Lead eingegangen",
      description: lead.title,
      detail: `${lead.region} · ${lead.category}`,
      href: `/admin/leads/${lead.id}`,
      date: lead.createdAt,
    })),

    ...recentProviders.map((provider) => ({
      id: `provider-${provider.id}`,
      type: "provider" as const,
      priority:
        provider.status === "PENDING"
          ? ("warning" as const)
          : ("info" as const),
      title:
        provider.status === "PENDING"
          ? "Neue Anbieterregistrierung"
          : "Anbieterprofil erstellt",
      description: provider.companyName,
      detail: `${provider.region || "Keine Region"} · ${provider.status}`,
      href: "/admin/providers",
      date: provider.createdAt,
    })),

    ...recentPayments.map((payment) => ({
      id: `payment-${payment.id}`,
      type: "payment" as const,
      priority: "success" as const,
      title: "Zahlung erfolgreich",
      description: payment.provider.companyName,
      detail: `${formatMoney(payment.amount, payment.currency)} · ${
        payment.credits
      } Credits`,
      href: "/admin/providers",
      date: payment.createdAt,
    })),

    ...recentLeadPurchases.map((purchase) => ({
      id: `purchase-${purchase.id}`,
      type: "purchase" as const,
      priority: "success" as const,
      title: "Lead gekauft",
      description: purchase.provider.companyName,
      detail: `${purchase.lead.title} · ${purchase.price} Credits`,
      href: `/admin/leads/${purchase.leadId}`,
      date: purchase.createdAt,
    })),

    ...recentFixedOrders.map((order) => ({
      id: `fixed-order-${order.id}`,
      type: "fixed-order" as const,
      priority:
        order.status === "SOLD" || order.status === "COMPLETED"
          ? ("success" as const)
          : ("info" as const),
      title:
        order.status === "SOLD" || order.status === "COMPLETED"
          ? "Fixauftrag verkauft"
          : "Neuer Fixauftrag",
      description: order.title,
      detail: `${order.postalCode} ${order.city} · ${formatMoney(
        order.commissionAmountCents,
      )}`,
      href: `/admin/fixed-orders/${order.id}`,
      date: order.soldAt || order.createdAt,
    })),
  ]
    .filter((item) =>
      selectedType === "all" ? true : item.type === selectedType,
    )
    .filter((item) =>
      selectedPriority === "all"
        ? true
        : item.priority === selectedPriority,
    )
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 80);

  const totalNotifications = notifications.length;
  const criticalCount = notifications.filter(
    (item) => item.priority === "critical",
  ).length;
  const warningCount = notifications.filter(
    (item) => item.priority === "warning",
  ).length;
  const successCount = notifications.filter(
    (item) => item.priority === "success",
  ).length;

  const typeFilters = [
    { value: "all", label: "Alle" },
    { value: "lead", label: "Leads" },
    { value: "provider", label: "Anbieter" },
    { value: "payment", label: "Zahlungen" },
    { value: "purchase", label: "Lead-Käufe" },
    { value: "fixed-order", label: "Fixaufträge" },
  ];

  const priorityFilters = [
    { value: "all", label: "Alle Prioritäten" },
    { value: "critical", label: "Kritisch" },
    { value: "warning", label: "Warnungen" },
    { value: "success", label: "Erfolge" },
    { value: "info", label: "Informationen" },
  ];

  function filterHref(next: {
    type?: string;
    priority?: string;
    period?: string;
  }) {
    const query = new URLSearchParams({
      type: next.type ?? selectedType,
      priority: next.priority ?? selectedPriority,
      period: next.period ?? selectedPeriod,
    });

    return `/admin/notifications?${query.toString()}`;
  }

  return (
    <main className="notifications-page">
      <div className="notifications-glow notifications-glow-one" />
      <div className="notifications-glow notifications-glow-two" />

      <div className="notifications-shell">
        <header className="notifications-header">
          <div>
            <span className="notifications-eyebrow">
              AUFTRAGO OPERATIONS CENTER
            </span>
            <h1>Notification Center</h1>
            <p>
              Neue Leads, Anbieter, Zahlungen, Verkäufe und Warnungen in einer
              zentralen Live-Ansicht.
            </p>
          </div>

          <div className="notifications-actions">
            <AdminAutoRefresh intervalSeconds={15} />

            <Link
              href="/admin"
              className="notification-btn notification-btn-secondary"
            >
              ← Dashboard
            </Link>

            <Link
              href="/admin/system"
              className="notification-btn notification-btn-secondary"
            >
              System
            </Link>

            <Link
              href="/admin/leads"
              className="notification-btn notification-btn-primary"
            >
              Leads verwalten
            </Link>
          </div>
        </header>

        <section className="notification-summary-grid">
          {[
            {
              label: "Benachrichtigungen",
              value: totalNotifications,
              detail: `Letzte ${periodDays} Tage`,
              tone: "blue",
            },
            {
              label: "Kritisch",
              value: criticalCount,
              detail: "Sofort prüfen",
              tone: "red",
            },
            {
              label: "Warnungen",
              value: warningCount,
              detail: "Zeitnah bearbeiten",
              tone: "amber",
            },
            {
              label: "Erfolge",
              value: successCount,
              detail: "Positive Aktivitäten",
              tone: "green",
            },
          ].map((item) => (
            <article
              className={`notification-summary-card notification-summary-${item.tone}`}
              key={item.label}
            >
              <span>{item.label}</span>
              <strong>{item.value}</strong>
              <small>{item.detail}</small>
            </article>
          ))}
        </section>

        <section className="notification-filter-panel">
          <div className="notification-filter-group">
            <span>Typ</span>

            <div>
              {typeFilters.map((filter) => (
                <Link
                  key={filter.value}
                  href={filterHref({ type: filter.value })}
                  className={
                    selectedType === filter.value
                      ? "notification-filter-active"
                      : ""
                  }
                >
                  {filter.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="notification-filter-group">
            <span>Priorität</span>

            <div>
              {priorityFilters.map((filter) => (
                <Link
                  key={filter.value}
                  href={filterHref({ priority: filter.value })}
                  className={
                    selectedPriority === filter.value
                      ? "notification-filter-active"
                      : ""
                  }
                >
                  {filter.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="notification-filter-group">
            <span>Zeitraum</span>

            <div>
              {[
                { value: "1", label: "24 Stunden" },
                { value: "7", label: "7 Tage" },
                { value: "30", label: "30 Tage" },
              ].map((filter) => (
                <Link
                  key={filter.value}
                  href={filterHref({ period: filter.value })}
                  className={
                    selectedPeriod === filter.value
                      ? "notification-filter-active"
                      : ""
                  }
                >
                  {filter.label}
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="notification-content-grid">
          <article className="notification-list-panel">
            <div className="notification-panel-head">
              <div>
                <span>LIVE FEED</span>
                <h2>Aktuelle Meldungen</h2>
              </div>

              <small>{totalNotifications} Treffer</small>
            </div>

            <div className="notification-list">
              {notifications.length === 0 ? (
                <div className="notification-empty">
                  <span>✓</span>
                  <h3>Keine Meldungen gefunden</h3>
                  <p>
                    Für die gewählten Filter sind aktuell keine
                    Benachrichtigungen vorhanden.
                  </p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <Link
                    href={notification.href}
                    key={notification.id}
                    className={`notification-row notification-${notification.priority}`}
                  >
                    <div className="notification-icon">
                      {notificationIcon(notification.type)}
                    </div>

                    <div className="notification-copy">
                      <div className="notification-row-top">
                        <span>{typeLabel(notification.type)}</span>
                        <b>
                          {priorityLabel(notification.priority)}
                        </b>
                      </div>

                      <strong>{notification.title}</strong>
                      <p>{notification.description}</p>
                      <small>{notification.detail}</small>
                    </div>

                    <time>{formatDate(notification.date)}</time>
                  </Link>
                ))
              )}
            </div>
          </article>

          <aside className="notification-side-column">
            <article className="notification-side-card notification-alert-card">
              <span>HANDLUNGSBEDARF</span>
              <h2>
                {criticalCount > 0
                  ? `${criticalCount} kritische Meldungen`
                  : warningCount > 0
                    ? `${warningCount} Warnungen offen`
                    : "Alles unter Kontrolle"}
              </h2>

              <p>
                {criticalCount > 0
                  ? "Prüfe zuerst ausstehende Anbieter und weitere kritische Hinweise."
                  : warningCount > 0
                    ? "Einige Meldungen sollten zeitnah bearbeitet werden."
                    : "Aktuell sind keine kritischen Aufgaben offen."}
              </p>

              <Link href="/admin/providers">Anbieter prüfen →</Link>
            </article>

            <article className="notification-side-card">
              <span>SCHNELLZUGRIFF</span>
              <h2>Operations</h2>

              <div className="notification-quick-links">
                <Link href="/admin/leads">
                  <b>Leads</b>
                  <small>Neue und auslaufende Leads prüfen</small>
                </Link>

                <Link href="/admin/providers">
                  <b>Anbieter</b>
                  <small>Registrierungen und Freigaben verwalten</small>
                </Link>

                <Link href="/admin/fixed-orders">
                  <b>Fixaufträge</b>
                  <small>Status und Verkäufe kontrollieren</small>
                </Link>

                <Link href="/admin/system">
                  <b>System Center</b>
                  <small>Technischen Plattformstatus öffnen</small>
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

        .notifications-page {
          position: relative;
          min-height: 100vh;
          overflow: hidden;
          padding: 42px 22px 70px;
          color: #ffffff;
          background:
            radial-gradient(circle at 8% 3%, rgba(37,99,235,0.13), transparent 28%),
            radial-gradient(circle at 92% 14%, rgba(124,58,237,0.13), transparent 26%),
            #050914;
        }

        .notifications-glow {
          position: fixed;
          width: 420px;
          height: 420px;
          border-radius: 999px;
          filter: blur(120px);
          opacity: 0.14;
          pointer-events: none;
        }

        .notifications-glow-one {
          top: -180px;
          left: -160px;
          background: #2563eb;
        }

        .notifications-glow-two {
          top: 280px;
          right: -180px;
          background: #7c3aed;
        }

        .notifications-shell {
          position: relative;
          z-index: 1;
          max-width: 1480px;
          margin: 0 auto;
        }

        .notifications-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 24px;
          flex-wrap: wrap;
        }

        .notifications-eyebrow,
        .notification-panel-head span,
        .notification-side-card > span {
          color: #93c5fd;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.13em;
        }

        .notifications-header h1 {
          margin: 11px 0 0;
          font-size: clamp(38px, 6vw, 70px);
          line-height: 0.98;
          letter-spacing: -0.055em;
        }

        .notifications-header p {
          max-width: 760px;
          margin: 18px 0 0;
          color: #94a3b8;
          line-height: 1.7;
        }

        .notifications-actions {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .notification-btn {
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

        .notification-btn:hover {
          transform: translateY(-2px);
        }

        .notification-btn-secondary {
          color: #dbeafe;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.045);
        }

        .notification-btn-primary {
          color: #ffffff;
          border: 1px solid rgba(96,165,250,0.28);
          background: linear-gradient(135deg, #2563eb, #7c3aed);
          box-shadow: 0 14px 36px rgba(37,99,235,0.2);
        }

        .notification-summary-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 14px;
          margin-top: 28px;
        }

        .notification-summary-card {
          padding: 21px;
          border-radius: 22px;
          border: 1px solid rgba(255,255,255,0.085);
          background:
            linear-gradient(145deg, rgba(255,255,255,0.045), rgba(7,12,24,0.96));
          box-shadow: 0 24px 70px rgba(0,0,0,0.16);
        }

        .notification-summary-card > span {
          display: block;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.09em;
          text-transform: uppercase;
        }

        .notification-summary-card strong {
          display: block;
          margin-top: 12px;
          font-size: 32px;
        }

        .notification-summary-card small {
          display: block;
          margin-top: 8px;
          color: #64748b;
        }

        .notification-summary-blue > span {
          color: #93c5fd;
        }

        .notification-summary-red > span {
          color: #fca5a5;
        }

        .notification-summary-amber > span {
          color: #fcd34d;
        }

        .notification-summary-green > span {
          color: #86efac;
        }

        .notification-filter-panel {
          display: grid;
          gap: 16px;
          margin-top: 18px;
          padding: 19px;
          border-radius: 23px;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(7,12,24,0.82);
        }

        .notification-filter-group {
          display: grid;
          grid-template-columns: 110px 1fr;
          align-items: center;
          gap: 14px;
        }

        .notification-filter-group > span {
          color: #64748b;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.09em;
          text-transform: uppercase;
        }

        .notification-filter-group > div {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .notification-filter-group a {
          padding: 8px 11px;
          border-radius: 10px;
          color: #94a3b8;
          text-decoration: none;
          font-size: 11px;
          font-weight: 800;
          border: 1px solid rgba(255,255,255,0.065);
          background: rgba(255,255,255,0.03);
        }

        .notification-filter-group a:hover,
        .notification-filter-group .notification-filter-active {
          color: #ffffff;
          border-color: rgba(96,165,250,0.25);
          background: rgba(37,99,235,0.16);
        }

        .notification-content-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.55fr) minmax(300px, 0.65fr);
          gap: 18px;
          margin-top: 18px;
        }

        .notification-list-panel,
        .notification-side-card {
          border: 1px solid rgba(255,255,255,0.085);
          background:
            linear-gradient(145deg, rgba(255,255,255,0.04), rgba(7,12,24,0.96));
          box-shadow: 0 24px 80px rgba(0,0,0,0.18);
        }

        .notification-list-panel {
          padding: 24px;
          border-radius: 27px;
        }

        .notification-panel-head {
          display: flex;
          justify-content: space-between;
          gap: 16px;
          align-items: flex-start;
        }

        .notification-panel-head h2 {
          margin: 7px 0 0;
        }

        .notification-panel-head > small {
          color: #64748b;
        }

        .notification-list {
          display: grid;
          gap: 10px;
          margin-top: 20px;
        }

        .notification-row {
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
          transition: transform 150ms ease, border-color 150ms ease;
        }

        .notification-row:hover {
          transform: translateY(-2px);
          border-color: rgba(96,165,250,0.28);
        }

        .notification-icon {
          width: 48px;
          height: 48px;
          display: grid;
          place-items: center;
          border-radius: 15px;
          font-size: 12px;
          font-weight: 950;
          background: rgba(59,130,246,0.12);
          color: #93c5fd;
        }

        .notification-warning .notification-icon {
          background: rgba(245,158,11,0.12);
          color: #fcd34d;
        }

        .notification-critical .notification-icon {
          background: rgba(239,68,68,0.12);
          color: #fca5a5;
        }

        .notification-success .notification-icon {
          background: rgba(34,197,94,0.12);
          color: #86efac;
        }

        .notification-row-top {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 6px;
        }

        .notification-row-top span,
        .notification-row-top b {
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .notification-row-top span {
          color: #64748b;
        }

        .notification-row-top b {
          padding: 4px 7px;
          border-radius: 999px;
          color: #93c5fd;
          background: rgba(59,130,246,0.1);
        }

        .notification-warning .notification-row-top b {
          color: #fcd34d;
          background: rgba(245,158,11,0.1);
        }

        .notification-critical .notification-row-top b {
          color: #fca5a5;
          background: rgba(239,68,68,0.1);
        }

        .notification-success .notification-row-top b {
          color: #86efac;
          background: rgba(34,197,94,0.1);
        }

        .notification-copy > strong {
          display: block;
          font-size: 14px;
        }

        .notification-copy p {
          margin: 5px 0 0;
          color: #cbd5e1;
          font-size: 12px;
        }

        .notification-copy > small {
          display: block;
          margin-top: 6px;
          color: #64748b;
          font-size: 10px;
        }

        .notification-row time {
          color: #64748b;
          font-size: 10px;
          white-space: nowrap;
        }

        .notification-empty {
          padding: 54px 22px;
          text-align: center;
          border-radius: 20px;
          background: rgba(255,255,255,0.025);
        }

        .notification-empty > span {
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

        .notification-empty h3 {
          margin: 15px 0 0;
        }

        .notification-empty p {
          max-width: 440px;
          margin: 9px auto 0;
          color: #64748b;
          line-height: 1.6;
        }

        .notification-side-column {
          display: grid;
          align-content: start;
          gap: 18px;
        }

        .notification-side-card {
          padding: 23px;
          border-radius: 25px;
        }

        .notification-alert-card {
          background:
            radial-gradient(circle at 90% 10%, rgba(239,68,68,0.14), transparent 34%),
            linear-gradient(145deg, rgba(42,17,30,0.88), rgba(7,12,24,0.96));
        }

        .notification-side-card h2 {
          margin: 9px 0 0;
          font-size: 25px;
          line-height: 1.2;
        }

        .notification-side-card p {
          margin: 11px 0 0;
          color: #94a3b8;
          font-size: 13px;
          line-height: 1.7;
        }

        .notification-side-card > a {
          display: inline-flex;
          margin-top: 18px;
          color: #ffffff;
          text-decoration: none;
          font-size: 12px;
          font-weight: 850;
        }

        .notification-quick-links {
          display: grid;
          gap: 9px;
          margin-top: 17px;
        }

        .notification-quick-links a {
          display: block;
          padding: 14px;
          border-radius: 15px;
          color: #ffffff;
          text-decoration: none;
          border: 1px solid rgba(255,255,255,0.065);
          background: rgba(255,255,255,0.035);
        }

        .notification-quick-links b {
          display: block;
          font-size: 13px;
        }

        .notification-quick-links small {
          display: block;
          margin-top: 5px;
          color: #64748b;
          line-height: 1.45;
        }

        @media (max-width: 1080px) {
          .notification-summary-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .notification-content-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 720px) {
          .notifications-page {
            padding: 28px 14px 48px;
          }

          .notifications-actions {
            width: 100%;
          }

          .notification-btn {
            flex: 1 1 150px;
          }

          .notification-summary-grid {
            grid-template-columns: 1fr;
          }

          .notification-filter-group {
            grid-template-columns: 1fr;
          }

          .notification-row {
            grid-template-columns: 44px minmax(0, 1fr);
          }

          .notification-row time {
            grid-column: 2;
          }
        }
      `}</style>
    </main>
  );
}