import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [providers, leads, purchases] = await Promise.all([
    prisma.provider.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.lead.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.leadPurchase.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        provider: true,
        lead: true,
      },
      take: 5,
    }),
  ]);

  const [providerCount, leadCount, purchaseCount] = await Promise.all([
    prisma.provider.count(),
    prisma.lead.count(),
    prisma.leadPurchase.count(),
  ]);

  const revenue = purchases.reduce((sum, item) => sum + item.price, 0);

  return (
    <main className="page">
      <section className="admin-dashboard">
        <div className="container">
          <span className="eyebrow">Admin</span>

          <div className="admin-head">
            <div>
              <h1>Auftrago Admin.</h1>
              <p>
                Übersicht über Anbieter, Leads, Käufe und Plattform-Aktivität.
              </p>
            </div>

            <div className="admin-actions">
              <a href="/admin/leads" className="btn btn-primary">
                Leads verwalten
              </a>
              <a href="/portal" className="btn btn-secondary">
                Portal öffnen
              </a>
            </div>
          </div>

          <div className="admin-stats">
            <div className="admin-stat-card">
              <strong>{providerCount}</strong>
              <span>Anbieter</span>
            </div>

            <div className="admin-stat-card">
              <strong>{leadCount}</strong>
              <span>Leads</span>
            </div>

            <div className="admin-stat-card">
              <strong>{purchaseCount}</strong>
              <span>Käufe</span>
            </div>

            <div className="admin-stat-card">
              <strong>{revenue}</strong>
              <span>Credits Umsatz</span>
            </div>
          </div>

          <div className="admin-grid">
            <section className="admin-card">
              <div className="admin-card-head">
                <span>Neueste Anbieter</span>
                <h2>Anbieter</h2>
              </div>

              <div className="admin-list">
                {providers.length === 0 ? (
                  <p className="admin-empty">Noch keine Anbieter vorhanden.</p>
                ) : (
                  providers.map((provider) => (
                    <article key={provider.id} className="admin-list-item">
                      <div>
                        <h3>{provider.companyName}</h3>
                        <p>{provider.contactName}</p>
                        <small>{provider.email}</small>
                      </div>

                      <div className="admin-pill">
                        {provider.credits} Credits
                      </div>
                    </article>
                  ))
                )}
              </div>
            </section>

            <section className="admin-card">
              <div className="admin-card-head">
                <span>Neue Leads</span>
                <h2>Leads</h2>
              </div>

              <div className="admin-list">
                {leads.length === 0 ? (
                  <p className="admin-empty">Noch keine Leads vorhanden.</p>
                ) : (
                  leads.map((lead) => (
                    <article key={lead.id} className="admin-list-item">
                      <div>
                        <h3>{lead.title}</h3>
                        <p>{lead.region} · {lead.category}</p>
                        <small>{lead.email}</small>
                      </div>

                      <div className="admin-pill">
                        {lead.price} Credits
                      </div>
                    </article>
                  ))
                )}
              </div>
            </section>

            <section className="admin-card admin-card-wide">
              <div className="admin-card-head">
                <span>Letzte Verkäufe</span>
                <h2>Lead-Käufe</h2>
              </div>

              <div className="admin-list">
                {purchases.length === 0 ? (
                  <p className="admin-empty">Noch keine Käufe vorhanden.</p>
                ) : (
                  purchases.map((purchase) => (
                    <article key={purchase.id} className="admin-list-item">
                      <div>
                        <h3>{purchase.lead.title}</h3>
                        <p>
                          Käufer: {purchase.provider.companyName}
                        </p>
                        <small>
                          {new Intl.DateTimeFormat("de-CH").format(
                            purchase.createdAt
                          )}
                        </small>
                      </div>

                      <div className="admin-pill">
                        {purchase.price} Credits
                      </div>
                    </article>
                  ))
                )}
              </div>
            </section>
          </div>
        </div>
      </section>

      <style>{`
        .admin-dashboard {
          padding: 72px 0 90px;
        }

        .admin-head {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 24px;
          margin-top: 18px;
          margin-bottom: 30px;
        }

        .admin-head h1 {
          color: white;
          font-size: clamp(3.2rem, 8vw, 7rem);
          line-height: 0.92;
          letter-spacing: -0.07em;
        }

        .admin-head p {
          max-width: 720px;
          margin-top: 20px;
          color: rgba(245,248,255,0.68);
          font-size: 1.15rem;
          line-height: 1.65;
        }

        .admin-actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .admin-stats {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 14px;
          margin-bottom: 24px;
        }

        .admin-stat-card,
        .admin-card,
        .admin-list-item {
          border: 1px solid rgba(255,255,255,0.1);
          background:
            linear-gradient(135deg, rgba(45,88,125,0.22), rgba(15,18,35,0.94)),
            rgba(255,255,255,0.04);
          box-shadow: 0 30px 80px rgba(0,0,0,0.28);
        }

        .admin-stat-card {
          border-radius: 24px;
          padding: 24px;
          min-height: 120px;
        }

        .admin-stat-card strong {
          display: block;
          color: white;
          font-size: 2.3rem;
          line-height: 1;
          letter-spacing: -0.05em;
        }

        .admin-stat-card span {
          display: block;
          margin-top: 12px;
          color: rgba(245,248,255,0.62);
          font-weight: 800;
        }

        .admin-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }

        .admin-card {
          border-radius: 34px;
          padding: 30px;
        }

        .admin-card-wide {
          grid-column: 1 / -1;
        }

        .admin-card-head {
          margin-bottom: 22px;
        }

        .admin-card-head span {
          display: block;
          color: rgba(245,248,255,0.52);
          font-weight: 900;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          font-size: 0.78rem;
        }

        .admin-card-head h2 {
          margin-top: 8px;
          color: white;
          font-size: clamp(2rem, 4vw, 3.8rem);
          line-height: 1;
          letter-spacing: -0.06em;
        }

        .admin-list {
          display: grid;
          gap: 14px;
        }

        .admin-list-item {
          border-radius: 24px;
          padding: 20px;
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 18px;
          align-items: center;
        }

        .admin-list-item h3 {
          color: white;
          font-size: 1.25rem;
          letter-spacing: -0.03em;
        }

        .admin-list-item p {
          margin-top: 6px;
          color: rgba(245,248,255,0.62);
        }

        .admin-list-item small {
          display: block;
          margin-top: 6px;
          color: rgba(245,248,255,0.42);
          word-break: break-word;
        }

        .admin-pill {
          border-radius: 999px;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.1);
          color: white;
          padding: 10px 14px;
          font-weight: 900;
          white-space: nowrap;
        }

        .admin-empty {
          color: rgba(245,248,255,0.55);
          line-height: 1.6;
        }

        @media (max-width: 1000px) {
          .admin-head {
            flex-direction: column;
            align-items: flex-start;
          }

          .admin-stats,
          .admin-grid {
            grid-template-columns: 1fr;
          }

          .admin-card-wide {
            grid-column: auto;
          }
        }

        @media (max-width: 640px) {
          .admin-dashboard {
            padding: 46px 0 70px;
          }

          .admin-card,
          .admin-stat-card {
            padding: 22px;
            border-radius: 26px;
          }

          .admin-list-item {
            grid-template-columns: 1fr;
          }

          .admin-pill {
            width: fit-content;
          }
        }
      `}</style>
    </main>
  );
}