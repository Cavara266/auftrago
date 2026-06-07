import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const quickActions = [
  { title: "Neue Leads", href: "/portal/leads", cta: "Alle ansehen" },
  { title: "Meine Leads", href: "/portal/meine-leads", cta: "Öffnen" },
  { title: "Credits", href: "/portal/guthaben", cta: "Aufladen" },
  { title: "Profil", href: "/portal/profil", cta: "Bearbeiten" },
];

export default async function PortalDashboardPage() {
  const cookieStore = await cookies();
  const providerId = cookieStore.get("auftrago_session")?.value;

  if (!providerId) redirect("/login");

  const provider = await prisma.provider.findUnique({
    where: { id: providerId },
    include: {
      purchases: {
        include: { lead: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!provider) redirect("/login");

  const [latestLeads, totalLeads] = await Promise.all([
    prisma.lead.findMany({
      take: 4,
      orderBy: { createdAt: "desc" },
    }),
    prisma.lead.count(),
  ]);

  return (
    <main className="page">
      <section className="portal-clean">
        <div className="container portal-clean-grid">
          <div className="portal-clean-main">
            <div className="portal-welcome">
              <span className="eyebrow">Auftrago Firmenportal</span>
              <h1>Neue Aufträge sichern.</h1>
              <p>
                Willkommen {provider.companyName}. Hier findest du die neusten
                Kundenanfragen, kaufst passende Leads und verwaltest dein Konto.
              </p>
            </div>

            <div className="portal-stats-row">
              <div>
                <strong>{provider.credits}</strong>
                <span>Credits</span>
              </div>

              <div>
                <strong>{totalLeads}</strong>
                <span>Aktive Leads</span>
              </div>

              <div>
                <strong>{provider.purchases.length}</strong>
                <span>Gekauft</span>
              </div>

              <div>
                <strong>{provider.region || "Schweiz"}</strong>
                <span>Region</span>
              </div>
            </div>

            <div className="portal-leads-panel">
              <div className="portal-section-head">
                <div>
                  <span>Neue Leads</span>
                  <h2>Aktuelle Anfragen</h2>
                  <p>Die besten Chancen zuerst. Kontakt nach Kauf sichtbar.</p>
                </div>

                <Link href="/portal/leads" className="btn btn-secondary">
                  Alle Leads
                </Link>
              </div>

              <div className="portal-leads-stack">
                {latestLeads.length > 0 ? (
                  latestLeads.map((lead) => (
                    <article key={lead.id} className="portal-lead-card">
                      <div className="portal-lead-left">
                        <div className="portal-lead-tags">
                          <span>Neu</span>
                          <span>{lead.category}</span>
                          <span>{lead.region}</span>
                        </div>

                        <h3>{lead.category}</h3>

                        <div className="portal-lead-meta">
                          <span>📍 {lead.region}</span>
                          <span>🔒 Kontakt gesperrt</span>
                          <span>💳 {lead.price} Credits</span>
                        </div>
                      </div>

                      <div className="portal-lead-right">
                        <div>
                          <strong>{lead.price}</strong>
                          <span>Credits</span>
                        </div>

                        <Link href="/portal/leads" className="btn btn-primary">
                          Freischalten
                        </Link>
                      </div>
                    </article>
                  ))
                ) : (
                  <div className="portal-empty">
                    <h3>Noch keine Leads vorhanden</h3>
                    <p>Sobald neue Anfragen eingehen, erscheinen sie hier.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <aside className="portal-clean-sidebar">
            <div className="portal-side-card portal-credit-card">
              <span>Guthaben</span>
              <h2>{provider.credits} Credits</h2>
              <p>Lade Credits auf, damit du neue Leads sofort kaufen kannst.</p>
              <Link href="/portal/guthaben" className="btn btn-primary">
                Credits kaufen
              </Link>
            </div>

            <div className="portal-side-card">
              <span>Schnellzugriff</span>
              <h2>Aktionen</h2>

              <div className="portal-action-list">
                {quickActions.map((item) => (
                  <Link key={item.title} href={item.href}>
                    <strong>{item.title}</strong>
                    <span>{item.cta}</span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="portal-side-card">
              <span>Letzte Käufe</span>
              <h2>Freigeschaltet</h2>

              <div className="portal-last-list">
                {provider.purchases.length > 0 ? (
                  provider.purchases.slice(0, 4).map((purchase) => (
                    <span key={purchase.id}>{purchase.lead.title}</span>
                  ))
                ) : (
                  <p>Noch keine Leads gekauft.</p>
                )}
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}