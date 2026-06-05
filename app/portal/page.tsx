import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

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
    title: "Transaktionen",
    text: "Alle Credit-Aufladungen und Lead-Käufe ansehen.",
    href: "/portal/transaktionen",
    cta: "Historie öffnen",
  },
  {
    title: "Firmenprofil",
    text: "Bearbeite Firmendaten, Regionen und Kategorien.",
    href: "/portal/profil",
    cta: "Profil öffnen",
  },
];

export default async function PortalDashboardPage() {
  const cookieStore = await cookies();
  const providerId = cookieStore.get("auftrago_session")?.value;

  if (!providerId) {
    redirect("/login");
  }

  const provider = await prisma.provider.findUnique({
    where: {
      id: providerId,
    },
    include: {
      purchases: {
        include: {
          lead: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!provider) {
    redirect("/login");
  }

  const [leads, totalLeads] = await Promise.all([
    prisma.lead.findMany({
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
    }),
    prisma.lead.count(),
  ]);

  const stats = [
    {
      value: String(provider.credits),
      label: "Credits",
    },
    {
      value: String(provider.purchases.length),
      label: "Gekaufte Leads",
    },
    {
      value: String(totalLeads),
      label: "Aktive Leads",
    },
    {
      value: provider.region || "—",
      label: "Region",
    },
  ];

  return (
    <main className="page">
      <section className="portal-hero">
        <div className="container portal-shell">
          <div className="portal-hero-top">
            <div>
              <span className="eyebrow">Firmen-Portal</span>

              <h1>Willkommen {provider.companyName}.</h1>

              <p>
                Verwalte Leads, Guthaben, Käufe und dein Firmenprofil zentral an
                einem Ort.
              </p>
            </div>

            <div className="portal-actions">
              <Link href="/portal/leads" className="btn btn-primary">
                Neue Leads
              </Link>

              <Link href="/portal/guthaben" className="btn btn-secondary">
                Credits kaufen
              </Link>

              <Link href="/logout" className="btn btn-secondary">
                Abmelden
              </Link>
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
              <span>Neue Leads</span>

              <h2>Aktuelle Anfragen</h2>

              <p>Die neuesten Anfragen auf der Plattform.</p>
            </div>

            <div className="portal-lead-list">
              {leads.length > 0 ? (
                leads.map((lead) => (
                  <article key={lead.id} className="portal-lead-card">
                    <div>
                      <div className="portal-badges">
                        <span>{lead.category}</span>
                        <span>{lead.region}</span>
                      </div>

                      <h3>{lead.title}</h3>
                      <p>{lead.description}</p>
                    </div>

                    <div className="portal-price">
                      <span>Preis</span>
                      <strong>{lead.price}</strong>
                      <small>Credits</small>
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

            <Link href="/portal/leads" className="btn btn-primary portal-full-btn">
              Alle Leads ansehen
            </Link>
          </div>

          <aside className="portal-sidebar">
            <div className="portal-side-card">
              <span className="portal-side-kicker">Schnellzugriff</span>

              <h2>Aktionen</h2>

              <div className="portal-action-list">
                {quickActions.map((item) => (
                  <Link
                    key={item.title}
                    href={item.href}
                    className="portal-action-card"
                  >
                    <div>
                      <h3>{item.title}</h3>
                      <p>{item.text}</p>
                    </div>

                    <span>{item.cta}</span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="portal-side-card">
              <span className="portal-side-kicker">Letzte Käufe</span>

              <h2>Freigeschaltete Leads</h2>

              <div className="portal-tags">
                {provider.purchases.length > 0 ? (
                  provider.purchases.slice(0, 5).map((purchase) => (
                    <span key={purchase.id}>{purchase.lead.title}</span>
                  ))
                ) : (
                  <p>Noch keine Leads freigeschaltet.</p>
                )}
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}