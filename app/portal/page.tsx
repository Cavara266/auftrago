import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const DEMO_PROVIDER_EMAIL =
  process.env.DEMO_PROVIDER_EMAIL?.trim().toLowerCase() ||
  "info@cavara-hauswartung.ch";

const quickActions = [
  {
    title: "Neue Leads ansehen",
    text: "Öffne die Lead-Liste und finde passende Aufträge in deiner Region.",
    href: "/portal/leads",
    cta: "Zu den Leads",
  },
  {
    title: "Meine Leads",
    text: "Sieh alle freigeschalteten Kontakte und gekauften Leads.",
    href: "/portal/meine-leads",
    cta: "Meine Leads öffnen",
  },
  {
    title: "Guthaben aufladen",
    text: "Lade Credits auf und schalte interessante Kontakte frei.",
    href: "/portal/guthaben",
    cta: "Guthaben verwalten",
  },
  {
    title: "Firmenprofil bearbeiten",
    text: "Aktualisiere Regionen, Kategorien und Firmendaten.",
    href: "/portal/profil",
    cta: "Profil öffnen",
  },
];

export default async function PortalDashboardPage() {
  const provider = await prisma.provider.findUnique({
    where: {
      email: DEMO_PROVIDER_EMAIL,
    },
    include: {
      purchases: true,
    },
  });

  const leads = await prisma.lead.findMany({
    take: 3,
    orderBy: {
      createdAt: "desc",
    },
  });

  const totalLeads = await prisma.lead.count();
  const purchasedCount = provider?.purchases.length ?? 0;

  const stats = [
    { value: String(totalLeads), label: "Aktive Leads" },
    { value: String(purchasedCount), label: "Gekaufte Leads" },
    { value: String(provider?.credits ?? 0), label: "Credits" },
    { value: provider?.region || "—", label: "Region" },
  ];

  return (
    <main className="page">
      <section className="portal-hero">
        <div className="container portal-shell">
          <div className="portal-hero-top">
            <div>
              <span className="eyebrow">Firmen-Portal</span>
              <h1>Dein Anbieter-Dashboard.</h1>
              <p>
                Willkommen {provider?.companyName || "im Anbieter-Portal"}.
                Verwalte Leads, Guthaben, Käufe und dein Firmenprofil an einem
                Ort.
              </p>
            </div>

            <div className="portal-actions">
              <a href="/portal/leads" className="btn btn-primary">
                Neue Leads
              </a>
              <a href="/portal/meine-leads" className="btn btn-secondary">
                Meine Leads
              </a>
            </div>
          </div>

          <div className="portal-stats">
            {stats.map((item) => (
              <div key={item.label} className="portal-stat-card">
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="portal-section">
        <div className="container portal-layout">
          <div className="portal-main-card">
            <div className="portal-card-head">
              <span>Lead-Überblick</span>
              <h2>Neue passende Leads</h2>
              <p>
                Die neuesten Anfragen aus deiner Datenbank. Öffne die Leadbörse,
                um Kontakte freizuschalten.
              </p>
            </div>

            <div className="portal-lead-list">
              {leads.length === 0 ? (
                <div className="portal-empty">
                  <strong>Noch keine Leads vorhanden</strong>
                  <p>
                    Erstelle neue Leads im Admin-Bereich. Danach erscheinen sie
                    automatisch hier.
                  </p>
                </div>
              ) : (
                leads.map((lead) => (
                  <article key={lead.id} className="portal-lead-card">
                    <div className="portal-lead-info">
                      <div className="portal-badges">
                        <span>Neu</span>
                        <span>{lead.category}</span>
                        <span>{lead.region}</span>
                      </div>

                      <h3>{lead.title}</h3>
                      <p>{lead.description}</p>
                    </div>

                    <div className="portal-price">
                      <span>Leadpreis</span>
                      <strong>{lead.price} Credits</strong>
                    </div>
                  </article>
                ))
              )}
            </div>

            <a href="/portal/leads" className="btn btn-primary portal-full-btn">
              Alle Leads öffnen
            </a>
          </div>

          <aside className="portal-sidebar">
            <div className="portal-side-card">
              <span className="portal-side-kicker">Schnellzugriff</span>
              <h2>Aktionen</h2>

              <div className="portal-action-list">
                {quickActions.map((item) => (
                  <a
                    key={item.title}
                    href={item.href}
                    className="portal-action-card"
                  >
                    <div>
                      <h3>{item.title}</h3>
                      <p>{item.text}</p>
                    </div>
                    <span>{item.cta}</span>
                  </a>
                ))}
              </div>
            </div>

            <div className="portal-side-card">
              <span className="portal-side-kicker">Konto</span>
              <h2>Firmenstatus</h2>

              <div className="portal-tags">
                <span>{provider ? "Profil aktiv" : "Profil fehlt"}</span>
                <span>{provider?.credits ?? 0} Credits</span>
                <span>{provider?.region || "Region fehlt"}</span>
                <span>{provider?.category || "Kategorie fehlt"}</span>
              </div>

              <p>
                {provider
                  ? "Dein Profil ist aktiv. Du kannst Leads prüfen, Kontakte freischalten und dein Guthaben verwalten."
                  : "Es wurde noch kein Anbieter-Profil gefunden. Bitte registriere zuerst deine Firma."}
              </p>
            </div>
          </aside>
        </div>
      </section>

      <style>{`
        .portal-hero {
          padding: 72px 0 28px;
        }

        .portal-shell {
          display: grid;
          gap: 32px;
        }

        .portal-hero-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 24px;
        }

        .portal-hero-top h1 {
          max-width: 760px;
          margin-top: 16px;
          font-size: clamp(3.2rem, 8vw, 7rem);
          line-height: 0.92;
          letter-spacing: -0.07em;
          color: white;
        }

        .portal-hero-top p {
          max-width: 720px;
          margin-top: 22px;
          color: rgba(245, 248, 255, 0.68);
          font-size: 1.2rem;
          line-height: 1.65;
        }

        .portal-actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .portal-stats {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 14px;
        }

        .portal-stat-card,
        .portal-main-card,
        .portal-side-card,
        .portal-lead-card,
        .portal-action-card,
        .portal-empty {
          border: 1px solid rgba(255, 255, 255, 0.1);
          background:
            linear-gradient(135deg, rgba(45, 88, 125, 0.22), rgba(15, 18, 35, 0.92)),
            rgba(255, 255, 255, 0.04);
          box-shadow: 0 24px 70px rgba(0, 0, 0, 0.28);
        }

        .portal-stat-card {
          border-radius: 24px;
          padding: 24px;
          min-height: 120px;
        }

        .portal-stat-card strong {
          display: block;
          font-size: 2rem;
          line-height: 1.1;
          color: white;
          letter-spacing: -0.04em;
          word-break: break-word;
        }

        .portal-stat-card span {
          display: block;
          margin-top: 12px;
          color: rgba(245, 248, 255, 0.62);
          font-weight: 700;
        }

        .portal-section {
          padding: 34px 0 90px;
        }

        .portal-layout {
          display: grid;
          grid-template-columns: minmax(0, 1.35fr) minmax(360px, 0.65fr);
          gap: 24px;
          align-items: start;
        }

        .portal-main-card,
        .portal-side-card {
          border-radius: 34px;
          padding: 30px;
        }

        .portal-card-head span,
        .portal-side-kicker {
          color: rgba(245, 248, 255, 0.58);
          font-weight: 800;
        }

        .portal-card-head h2,
        .portal-side-card h2 {
          margin-top: 10px;
          color: white;
          font-size: clamp(2.1rem, 4vw, 4.2rem);
          line-height: 0.98;
          letter-spacing: -0.06em;
        }

        .portal-card-head p {
          margin-top: 14px;
          color: rgba(245, 248, 255, 0.62);
          font-size: 1.05rem;
          line-height: 1.6;
        }

        .portal-lead-list {
          display: grid;
          gap: 14px;
          margin-top: 24px;
        }

        .portal-lead-card {
          border-radius: 26px;
          padding: 22px;
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 18px;
          align-items: center;
        }

        .portal-badges {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          margin-bottom: 14px;
        }

        .portal-badges span,
        .portal-tags span {
          border: 1px solid rgba(255, 255, 255, 0.12);
          background: rgba(255, 255, 255, 0.08);
          color: rgba(245, 248, 255, 0.86);
          border-radius: 999px;
          padding: 7px 11px;
          font-size: 0.82rem;
          font-weight: 800;
        }

        .portal-lead-card h3 {
          color: white;
          font-size: 1.5rem;
          letter-spacing: -0.04em;
        }

        .portal-lead-card p {
          margin-top: 8px;
          color: rgba(245, 248, 255, 0.58);
          line-height: 1.5;
        }

        .portal-price {
          text-align: right;
          min-width: 140px;
        }

        .portal-price span {
          color: rgba(245, 248, 255, 0.48);
          font-weight: 700;
        }

        .portal-price strong {
          display: block;
          margin-top: 6px;
          color: white;
          font-size: 1.5rem;
          letter-spacing: -0.05em;
        }

        .portal-empty {
          border-radius: 26px;
          padding: 24px;
        }

        .portal-empty strong {
          color: white;
          font-size: 1.3rem;
        }

        .portal-empty p {
          margin-top: 8px;
          color: rgba(245, 248, 255, 0.62);
        }

        .portal-full-btn {
          margin-top: 22px;
        }

        .portal-sidebar {
          display: grid;
          gap: 24px;
        }

        .portal-side-card h2 {
          font-size: 2.4rem;
        }

        .portal-action-list {
          display: grid;
          gap: 12px;
          margin-top: 22px;
        }

        .portal-action-card {
          display: grid;
          gap: 16px;
          border-radius: 24px;
          padding: 22px;
          text-decoration: none;
          transition: transform 0.2s ease, border-color 0.2s ease;
        }

        .portal-action-card:hover {
          transform: translateY(-2px);
          border-color: rgba(91, 144, 255, 0.55);
        }

        .portal-action-card h3 {
          color: white;
          font-size: 1.25rem;
          letter-spacing: -0.03em;
        }

        .portal-action-card p {
          margin-top: 8px;
          color: rgba(245, 248, 255, 0.58);
          line-height: 1.5;
        }

        .portal-action-card > span {
          width: fit-content;
          border-radius: 999px;
          padding: 11px 14px;
          background: rgba(255, 255, 255, 0.1);
          color: white;
          font-weight: 900;
        }

        .portal-tags {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          margin-top: 18px;
        }

        .portal-side-card > p {
          margin-top: 18px;
          color: rgba(245, 248, 255, 0.66);
          line-height: 1.7;
        }

        @media (max-width: 1100px) {
          .portal-hero-top {
            align-items: flex-start;
            flex-direction: column;
          }

          .portal-stats,
          .portal-layout {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 640px) {
          .portal-hero {
            padding-top: 44px;
          }

          .portal-stats {
            grid-template-columns: 1fr 1fr;
          }

          .portal-main-card,
          .portal-side-card {
            padding: 22px;
            border-radius: 26px;
          }

          .portal-lead-card {
            grid-template-columns: 1fr;
          }

          .portal-price {
            text-align: left;
          }
        }
      `}</style>
    </main>
  );
}