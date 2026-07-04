import Link from "next/link";
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
              <Link href="/admin/providers" className="btn btn-primary">
                Anbieter verwalten
              </Link>

              <Link href="/admin/leads" className="btn btn-primary">
                Leads verwalten
              </Link>

              <Link href="/portal" className="btn btn-secondary">
                Portal öffnen
              </Link>

              <Link href="/admin-logout" className="btn btn-secondary">
                Admin abmelden
              </Link>
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
                        <p>
                          {lead.region} · {lead.category}
                        </p>
                        <small>{lead.email}</small>
                      </div>

                      <div className="admin-pill">{lead.price} Credits</div>
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
                        <p>Käufer: {purchase.provider.companyName}</p>
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
    </main>
  );
}