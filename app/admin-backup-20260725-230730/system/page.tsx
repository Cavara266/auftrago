import Link from "next/link";
import AdminAutoRefresh from "@/components/admin/admin-auto-refresh";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

function formatDate(date: Date | null | undefined) {
  if (!date) return "Keine Daten";

  return new Intl.DateTimeFormat("de-CH", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Zurich",
  }).format(date);
}

function formatDuration(milliseconds: number) {
  if (milliseconds < 1000) return `${milliseconds} ms`;
  return `${(milliseconds / 1000).toFixed(2)} s`;
}

function statusTone(status: "healthy" | "warning" | "critical") {
  if (status === "healthy") return "system-healthy";
  if (status === "warning") return "system-warning";
  return "system-critical";
}

export default async function AdminSystemPage() {
  const startedAt = Date.now();
  const now = new Date();
  const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  let databaseHealthy = true;
  let databaseLatency = 0;
  let databaseError = "";

  try {
    const databaseStartedAt = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    databaseLatency = Date.now() - databaseStartedAt;
  } catch (error) {
    databaseHealthy = false;
    databaseError =
      error instanceof Error ? error.message : "Unbekannter Datenbankfehler";
  }

  const [
    providerCount,
    pendingProviderCount,
    leadCount,
    leadPurchaseCount,
    paidPaymentCount,
    paymentsLast24Hours,
    leadsLast24Hours,
    providersLast24Hours,
    purchasesLast24Hours,
    latestLead,
    latestProvider,
    latestPayment,
    latestPurchase,
    fixedOrderCount,
    openFixedOrderCount,
    fixedOrdersLast7Days,
  ] = databaseHealthy
    ? await Promise.all([
        prisma.provider.count(),
        prisma.provider.count({ where: { status: "PENDING" } }),
        prisma.lead.count(),
        prisma.leadPurchase.count(),
        prisma.creditPurchase.count({ where: { status: "paid" } }),
        prisma.creditPurchase.count({
          where: {
            status: "paid",
            createdAt: { gte: last24Hours },
          },
        }),
        prisma.lead.count({
          where: { createdAt: { gte: last24Hours } },
        }),
        prisma.provider.count({
          where: { createdAt: { gte: last24Hours } },
        }),
        prisma.leadPurchase.count({
          where: { createdAt: { gte: last24Hours } },
        }),
        prisma.lead.findFirst({
          orderBy: { createdAt: "desc" },
          select: { createdAt: true, title: true },
        }),
        prisma.provider.findFirst({
          orderBy: { createdAt: "desc" },
          select: { createdAt: true, companyName: true },
        }),
        prisma.creditPurchase.findFirst({
          where: { status: "paid" },
          orderBy: { createdAt: "desc" },
          select: { createdAt: true, amount: true, currency: true },
        }),
        prisma.leadPurchase.findFirst({
          orderBy: { createdAt: "desc" },
          select: { createdAt: true, price: true },
        }),
        prisma.fixedOrder.count(),
        prisma.fixedOrder.count({ where: { status: "OPEN" } }),
        prisma.fixedOrder.count({
          where: { createdAt: { gte: last7Days } },
        }),
      ])
    : [
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        null,
        null,
        null,
        null,
        0,
        0,
        0,
      ];

  const requestDuration = Date.now() - startedAt;

  const stripeConfigured = Boolean(
    process.env.STRIPE_SECRET_KEY || process.env.STRIPE_API_KEY
  );
  const stripeWebhookConfigured = Boolean(
    process.env.STRIPE_WEBHOOK_SECRET
  );
  const databaseConfigured = Boolean(process.env.DATABASE_URL);
  const emailConfigured = Boolean(
    process.env.RESEND_API_KEY ||
      process.env.SMTP_HOST ||
      process.env.EMAIL_SERVER
  );
  const appUrlConfigured = Boolean(
    process.env.NEXT_PUBLIC_APP_URL ||
      process.env.NEXTAUTH_URL ||
      process.env.VERCEL_URL
  );
  const cronConfigured = Boolean(
    process.env.CRON_SECRET || process.env.VERCEL_CRON_SECRET
  );
  const authConfigured = Boolean(
    process.env.NEXTAUTH_SECRET ||
      process.env.AUTH_SECRET ||
      process.env.ADMIN_PASSWORD
  );

  const services = [
    {
      label: "Datenbank",
      description: databaseHealthy
        ? `Prisma-Verbindung aktiv · ${databaseLatency} ms`
        : databaseError,
      status: databaseHealthy ? ("healthy" as const) : ("critical" as const),
      value: databaseHealthy ? "Verbunden" : "Fehler",
    },
    {
      label: "Stripe",
      description: stripeConfigured
        ? stripeWebhookConfigured
          ? "API-Key und Webhook-Secret vorhanden"
          : "API-Key vorhanden, Webhook-Secret fehlt"
        : "Stripe-Umgebungsvariablen fehlen",
      status: stripeConfigured
        ? stripeWebhookConfigured
          ? ("healthy" as const)
          : ("warning" as const)
        : ("critical" as const),
      value: stripeConfigured ? "Konfiguriert" : "Nicht bereit",
    },
    {
      label: "E-Mail",
      description: emailConfigured
        ? "E-Mail-Provider ist konfiguriert"
        : "Kein Resend-, SMTP- oder Mailserver-Key gefunden",
      status: emailConfigured ? ("healthy" as const) : ("warning" as const),
      value: emailConfigured ? "Bereit" : "Prüfen",
    },
    {
      label: "Authentifizierung",
      description: authConfigured
        ? "Authentifizierungs-Secret vorhanden"
        : "Kein bekanntes Auth-Secret gefunden",
      status: authConfigured ? ("healthy" as const) : ("warning" as const),
      value: authConfigured ? "Geschützt" : "Prüfen",
    },
    {
      label: "App-URL",
      description: appUrlConfigured
        ? "Öffentliche Plattform-URL ist gesetzt"
        : "NEXT_PUBLIC_APP_URL, NEXTAUTH_URL oder VERCEL_URL fehlt",
      status: appUrlConfigured ? ("healthy" as const) : ("warning" as const),
      value: appUrlConfigured ? "Gesetzt" : "Fehlt",
    },
    {
      label: "Cronjobs",
      description: cronConfigured
        ? "Cron-Secret ist vorhanden"
        : "Kein Cron-Secret erkannt",
      status: cronConfigured ? ("healthy" as const) : ("warning" as const),
      value: cronConfigured ? "Bereit" : "Nicht erkannt",
    },
  ];

  const healthyServices = services.filter(
    (service) => service.status === "healthy"
  ).length;
  const warningServices = services.filter(
    (service) => service.status === "warning"
  ).length;
  const criticalServices = services.filter(
    (service) => service.status === "critical"
  ).length;

  const overallStatus =
    criticalServices > 0
      ? {
          label: "Handlungsbedarf",
          className: "system-critical",
          text: `${criticalServices} kritische Systemprüfung`,
        }
      : warningServices > 0
        ? {
            label: "System stabil",
            className: "system-warning",
            text: `${warningServices} Konfigurationen prüfen`,
          }
        : {
            label: "Alle Systeme aktiv",
            className: "system-healthy",
            text: "Keine Probleme erkannt",
          };

  const recentActivity = [
    {
      label: "Letzter Lead",
      value: latestLead?.title || "Noch kein Lead",
      date: latestLead?.createdAt,
    },
    {
      label: "Letzter Anbieter",
      value: latestProvider?.companyName || "Noch kein Anbieter",
      date: latestProvider?.createdAt,
    },
    {
      label: "Letzte Zahlung",
      value: latestPayment
        ? `${(latestPayment.amount / 100).toFixed(2)} ${latestPayment.currency.toUpperCase()}`
        : "Noch keine Zahlung",
      date: latestPayment?.createdAt,
    },
    {
      label: "Letzter Lead-Kauf",
      value: latestPurchase
        ? `${latestPurchase.price} Credits`
        : "Noch kein Lead-Kauf",
      date: latestPurchase?.createdAt,
    },
  ];

  return (
    <main className="system-page">
      <div className="system-glow system-glow-one" />
      <div className="system-glow system-glow-two" />

      <div className="system-shell">
        <header className="system-header">
          <div>
            <span className="system-eyebrow">AUFTRAGO OPERATIONS CENTER</span>
            <h1>System Center</h1>
            <p>
              Technischer Plattformstatus, Konfigurationen und aktuelle
              Systemaktivität in einer zentralen Ansicht.
            </p>
          </div>

          <div className="system-actions">
            <AdminAutoRefresh intervalSeconds={15} />
            <Link href="/admin" className="system-btn system-btn-secondary">
              ← Dashboard
            </Link>
            <Link
              href="/admin/analytics"
              className="system-btn system-btn-secondary"
            >
              Analytics
            </Link>
            <Link href="/admin/leads" className="system-btn system-btn-primary">
              Leads verwalten
            </Link>
          </div>
        </header>

        <section className={`system-overview ${overallStatus.className}`}>
          <div className="system-overview-copy">
            <span className="system-status-dot" />
            <div>
              <small>PLATTFORMSTATUS</small>
              <h2>{overallStatus.label}</h2>
              <p>{overallStatus.text}</p>
            </div>
          </div>

          <div className="system-overview-stats">
            <div>
              <span>Aktiv</span>
              <strong>{healthyServices}</strong>
            </div>
            <div>
              <span>Warnungen</span>
              <strong>{warningServices}</strong>
            </div>
            <div>
              <span>Kritisch</span>
              <strong>{criticalServices}</strong>
            </div>
            <div>
              <span>Antwortzeit</span>
              <strong>{formatDuration(requestDuration)}</strong>
            </div>
          </div>
        </section>

        <section className="system-service-grid">
          {services.map((service) => (
            <article
              key={service.label}
              className={`system-card ${statusTone(service.status)}`}
            >
              <div className="system-card-head">
                <span className="system-status-dot" />
                <small>{service.value}</small>
              </div>

              <h2>{service.label}</h2>
              <p>{service.description}</p>
            </article>
          ))}
        </section>

        <section className="system-main-grid">
          <article className="system-panel">
            <div className="system-panel-head">
              <div>
                <span>PLATTFORMDATEN</span>
                <h2>Datenbankübersicht</h2>
              </div>
              <small>Live aus Prisma</small>
            </div>

            <div className="system-metric-grid">
              {[
                {
                  label: "Anbieter",
                  value: providerCount,
                  detail: `${pendingProviderCount} ausstehend`,
                },
                {
                  label: "Leads",
                  value: leadCount,
                  detail: `${leadsLast24Hours} in 24 Stunden`,
                },
                {
                  label: "Lead-Käufe",
                  value: leadPurchaseCount,
                  detail: `${purchasesLast24Hours} in 24 Stunden`,
                },
                {
                  label: "Zahlungen",
                  value: paidPaymentCount,
                  detail: `${paymentsLast24Hours} in 24 Stunden`,
                },
                {
                  label: "Fixaufträge",
                  value: fixedOrderCount,
                  detail: `${openFixedOrderCount} offen`,
                },
                {
                  label: "Neue Fixaufträge",
                  value: fixedOrdersLast7Days,
                  detail: "Letzte 7 Tage",
                },
              ].map((metric) => (
                <div key={metric.label}>
                  <span>{metric.label}</span>
                  <strong>{metric.value}</strong>
                  <small>{metric.detail}</small>
                </div>
              ))}
            </div>
          </article>

          <article className="system-panel">
            <div className="system-panel-head">
              <div>
                <span>LETZTE AKTIVITÄT</span>
                <h2>Systemereignisse</h2>
              </div>
              <small>Neueste Datensätze</small>
            </div>

            <div className="system-activity-list">
              {recentActivity.map((item) => (
                <div key={item.label}>
                  <span className="system-activity-icon">•</span>
                  <section>
                    <small>{item.label}</small>
                    <strong>{item.value}</strong>
                    <time>{formatDate(item.date)}</time>
                  </section>
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="system-info-grid">
          <article className="system-panel">
            <div className="system-panel-head">
              <div>
                <span>RUNTIME</span>
                <h2>Serverinformationen</h2>
              </div>
            </div>

            <div className="system-info-list">
              <div>
                <span>Node.js</span>
                <strong>{process.version}</strong>
              </div>
              <div>
                <span>Umgebung</span>
                <strong>{process.env.NODE_ENV || "Unbekannt"}</strong>
              </div>
              <div>
                <span>Vercel Environment</span>
                <strong>{process.env.VERCEL_ENV || "Lokal / unbekannt"}</strong>
              </div>
              <div>
                <span>Vercel Region</span>
                <strong>{process.env.VERCEL_REGION || "Nicht verfügbar"}</strong>
              </div>
              <div>
                <span>Deployment</span>
                <strong>
                  {process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 8) ||
                    "Nicht verfügbar"}
                </strong>
              </div>
              <div>
                <span>Systemzeit</span>
                <strong>{formatDate(now)}</strong>
              </div>
            </div>
          </article>

          <article className="system-panel system-recommendation">
            <div>
              <span>OPERATIONS INSIGHT</span>
              <h2>
                {criticalServices > 0
                  ? "Kritische Konfiguration prüfen"
                  : warningServices > 0
                    ? "System ist stabil – Konfiguration vervollständigen"
                    : "Plattform ist vollständig betriebsbereit"}
              </h2>
              <p>
                {criticalServices > 0
                  ? "Mindestens ein Kerndienst ist nicht einsatzbereit. Prüfe zuerst die Datenbank- und Zahlungsumgebung."
                  : warningServices > 0
                    ? "Die Kernsysteme funktionieren. Fehlende optionale Secrets oder URLs sollten vor dem vollständigen Livebetrieb ergänzt werden."
                    : "Alle erkannten Dienste sind aktiv konfiguriert. Behalte Antwortzeiten und neue Aktivitäten weiterhin im Blick."}
              </p>
            </div>

            <div className="system-recommendation-actions">
              <Link href="/admin/providers">Anbieter prüfen</Link>
              <Link href="/admin/analytics">Analytics öffnen</Link>
            </div>
          </article>
        </section>
      </div>

      <style>{`
        * {
          box-sizing: border-box;
        }

        .system-page {
          position: relative;
          min-height: 100vh;
          overflow: hidden;
          background:
            radial-gradient(circle at 12% 5%, rgba(59,130,246,0.12), transparent 28%),
            radial-gradient(circle at 90% 16%, rgba(139,92,246,0.12), transparent 26%),
            #050914;
          color: #ffffff;
          padding: 42px 22px 70px;
        }

        .system-glow {
          position: fixed;
          width: 420px;
          height: 420px;
          border-radius: 999px;
          filter: blur(120px);
          opacity: 0.16;
          pointer-events: none;
        }

        .system-glow-one {
          top: -180px;
          left: -150px;
          background: #2563eb;
        }

        .system-glow-two {
          right: -180px;
          top: 260px;
          background: #7c3aed;
        }

        .system-shell {
          position: relative;
          z-index: 1;
          max-width: 1480px;
          margin: 0 auto;
        }

        .system-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 26px;
          flex-wrap: wrap;
          margin-bottom: 26px;
        }

        .system-eyebrow,
        .system-panel-head span,
        .system-recommendation > div > span {
          color: #93c5fd;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.13em;
        }

        .system-header h1 {
          margin: 11px 0 0;
          font-size: clamp(38px, 6vw, 70px);
          letter-spacing: -0.055em;
          line-height: 0.98;
        }

        .system-header p {
          max-width: 760px;
          margin: 18px 0 0;
          color: #94a3b8;
          line-height: 1.7;
        }

        .system-actions {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .system-btn {
          min-height: 44px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0 16px;
          border-radius: 14px;
          text-decoration: none;
          font-size: 13px;
          font-weight: 800;
          transition: transform 160ms ease, border-color 160ms ease;
        }

        .system-btn:hover {
          transform: translateY(-2px);
        }

        .system-btn-secondary {
          color: #dbeafe;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.045);
        }

        .system-btn-primary {
          color: #ffffff;
          border: 1px solid rgba(96,165,250,0.28);
          background: linear-gradient(135deg, #2563eb, #7c3aed);
          box-shadow: 0 14px 36px rgba(37,99,235,0.2);
        }

        .system-overview {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          flex-wrap: wrap;
          padding: 25px;
          border-radius: 28px;
          border: 1px solid rgba(255,255,255,0.1);
          background:
            linear-gradient(135deg, rgba(11,20,38,0.96), rgba(13,18,35,0.92));
        }

        .system-overview-copy {
          display: flex;
          align-items: flex-start;
          gap: 14px;
        }

        .system-status-dot {
          flex: 0 0 auto;
          width: 10px;
          height: 10px;
          margin-top: 7px;
          border-radius: 999px;
          background: currentColor;
          box-shadow: 0 0 18px currentColor;
        }

        .system-overview-copy small {
          color: #94a3b8;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.12em;
        }

        .system-overview-copy h2 {
          margin: 7px 0 0;
          font-size: 27px;
        }

        .system-overview-copy p {
          margin: 8px 0 0;
          color: #94a3b8;
        }

        .system-overview-stats {
          display: grid;
          grid-template-columns: repeat(4, minmax(110px, 1fr));
          gap: 10px;
        }

        .system-overview-stats > div {
          padding: 14px 16px;
          border-radius: 16px;
          background: rgba(255,255,255,0.045);
        }

        .system-overview-stats span,
        .system-metric-grid span,
        .system-info-list span {
          display: block;
          color: #94a3b8;
          font-size: 10px;
          font-weight: 850;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .system-overview-stats strong {
          display: block;
          margin-top: 7px;
          font-size: 18px;
        }

        .system-healthy {
          color: #6ee7b7;
        }

        .system-warning {
          color: #fcd34d;
        }

        .system-critical {
          color: #fca5a5;
        }

        .system-service-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 15px;
          margin-top: 18px;
        }

        .system-card,
        .system-panel {
          border: 1px solid rgba(255,255,255,0.085);
          background:
            linear-gradient(145deg, rgba(255,255,255,0.045), rgba(7,12,24,0.95));
          box-shadow: 0 24px 80px rgba(0,0,0,0.18);
        }

        .system-card {
          min-height: 190px;
          padding: 21px;
          border-radius: 23px;
        }

        .system-card-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }

        .system-card-head .system-status-dot {
          margin-top: 0;
        }

        .system-card-head small {
          color: currentColor;
          font-weight: 850;
        }

        .system-card h2 {
          margin: 30px 0 0;
          color: #ffffff;
          font-size: 21px;
        }

        .system-card p {
          margin: 10px 0 0;
          color: #94a3b8;
          font-size: 13px;
          line-height: 1.6;
        }

        .system-main-grid,
        .system-info-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 18px;
          margin-top: 18px;
        }

        .system-panel {
          padding: 24px;
          border-radius: 27px;
        }

        .system-panel-head {
          display: flex;
          justify-content: space-between;
          gap: 16px;
          align-items: flex-start;
        }

        .system-panel-head h2 {
          margin: 7px 0 0;
        }

        .system-panel-head > small {
          color: #64748b;
        }

        .system-metric-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 11px;
          margin-top: 22px;
        }

        .system-metric-grid > div {
          padding: 17px;
          border-radius: 17px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.06);
        }

        .system-metric-grid strong {
          display: block;
          margin-top: 9px;
          font-size: 25px;
        }

        .system-metric-grid small {
          display: block;
          margin-top: 7px;
          color: #64748b;
          line-height: 1.4;
        }

        .system-activity-list {
          display: grid;
          gap: 11px;
          margin-top: 20px;
        }

        .system-activity-list > div {
          display: grid;
          grid-template-columns: 34px 1fr;
          gap: 12px;
          padding: 13px;
          border-radius: 16px;
          background: rgba(255,255,255,0.035);
        }

        .system-activity-icon {
          width: 34px;
          height: 34px;
          display: grid;
          place-items: center;
          border-radius: 11px;
          color: #93c5fd;
          background: rgba(59,130,246,0.12);
          font-size: 21px;
        }

        .system-activity-list section small {
          display: block;
          color: #64748b;
          font-size: 10px;
          font-weight: 850;
          text-transform: uppercase;
          letter-spacing: 0.07em;
        }

        .system-activity-list section strong {
          display: block;
          margin-top: 4px;
          font-size: 13px;
        }

        .system-activity-list time {
          display: block;
          margin-top: 6px;
          color: #64748b;
          font-size: 10px;
        }

        .system-info-list {
          display: grid;
          gap: 0;
          margin-top: 19px;
        }

        .system-info-list > div {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 14px 0;
          border-bottom: 1px solid rgba(255,255,255,0.065);
        }

        .system-info-list > div:last-child {
          border-bottom: 0;
        }

        .system-info-list strong {
          text-align: right;
          font-size: 13px;
        }

        .system-recommendation {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          background:
            radial-gradient(circle at 90% 15%, rgba(124,58,237,0.18), transparent 34%),
            linear-gradient(145deg, rgba(18,21,52,0.95), rgba(7,12,24,0.95));
        }

        .system-recommendation h2 {
          margin: 10px 0 0;
          font-size: clamp(23px, 3vw, 34px);
          line-height: 1.18;
        }

        .system-recommendation p {
          margin: 13px 0 0;
          max-width: 680px;
          color: #94a3b8;
          line-height: 1.7;
        }

        .system-recommendation-actions {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          margin-top: 28px;
        }

        .system-recommendation-actions a {
          display: inline-flex;
          padding: 11px 14px;
          border-radius: 12px;
          color: #ffffff;
          text-decoration: none;
          font-size: 12px;
          font-weight: 850;
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.09);
        }

        @media (max-width: 1080px) {
          .system-service-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .system-main-grid,
          .system-info-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 760px) {
          .system-page {
            padding: 28px 14px 48px;
          }

          .system-overview-stats,
          .system-service-grid,
          .system-metric-grid {
            grid-template-columns: 1fr;
            width: 100%;
          }

          .system-actions {
            width: 100%;
          }

          .system-btn {
            flex: 1 1 150px;
          }

          .system-info-list > div {
            align-items: flex-start;
            flex-direction: column;
          }

          .system-info-list strong {
            text-align: left;
          }
        }
      `}</style>
    </main>
  );
}