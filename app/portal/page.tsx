import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const quickActions = [
  {
    title: "Neue Leads ansehen",
    text: "Öffne den Lead-Marktplatz und sichere dir passende Aufträge.",
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
    text: "Lade Credits auf und schalte interessante Kundenkontakte frei.",
    href: "/portal/guthaben",
    cta: "Credits kaufen",
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

const activityFeed = [
  "Vor 2 Min. · Fensterreinigung in Zürich eingegangen",
  "Vor 7 Min. · Umzugsreinigung in Baden erstellt",
  "Vor 12 Min. · Hauswartung in Aarau verfügbar",
  "Vor 18 Min. · Gartenpflege in Winterthur angefragt",
  "Vor 26 Min. · Entsorgung in Zug veröffentlicht",
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

  const [latestLeads, totalLeads] = await Promise.all([
    prisma.lead.findMany({
      take: 6,
      orderBy: {
        createdAt: "desc",
      },
    }),
    prisma.lead.count(),
  ]);

  const platformStats = [
    {
      value: "34",
      label: "Neue Anfragen heute",
      icon: "🔥",
    },
    {
      value: "187",
      label: "Anfragen diese Woche",
      icon: "📈",
    },
    {
      value: "83",
      label: "Aktive Anbieter",
      icon: "🏢",
    },
    {
      value: "521",
      label: "Freigeschaltete Kontakte",
      icon: "📞",
    },
  ];

  const accountStats = [
    {
      value: String(provider.credits),
      label: "Credits verfügbar",
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
      value: provider.region || "Schweiz",
      label: "Deine Region",
    },
  ];

  return (
    <main className="page">
      <section className="provider-command-hero">
        <div className="container provider-command-shell">
          <div className="provider-command-top">
            <div>
              <span className="eyebrow">Firmen-Portal</span>

              <h1>
                Willkommen <br />
                {provider.companyName}.
              </h1>

              <p>
                Dein Auftrago Cockpit für neue Aufträge, Credits,
                freigeschaltete Kontakte und regionale Kundenanfragen.
              </p>
            </div>

            <div className="provider-command-actions">
              <Link href="/portal/leads" className="btn btn-primary">
                Neue Leads ansehen
              </Link>

              <Link href="/portal/guthaben" className="btn btn-secondary">
                Credits kaufen
              </Link>

              <Link href="/logout" className="btn btn-secondary">
                Abmelden
              </Link>
            </div>
          </div>

          {provider.credits <= 0 ? (
            <div className="provider-credit-alert">
              <div>
                <span>⚠️ Guthaben leer</span>
                <h2>Du kannst aktuell keine Kontakte freischalten.</h2>
                <p>
                  Lade Credits auf, damit du neue Leads sofort kaufen und
                  Kunden direkt kontaktieren kannst.
                </p>
              </div>

              <Link href="/portal/guthaben" className="btn btn-primary">
                Jetzt Credits aufladen
              </Link>
            </div>
          ) : null}

          <div className="provider-platform-grid">
            {platformStats.map((item) => (
              <div key={item.label} className="provider-platform-card">
                <span>{item.icon}</span>
                <strong>{item.value}</strong>
                <small>{item.label}</small>
              </div>
            ))}
          </div>

          <div className="provider-account-grid">
            {accountStats.map((item) => (
              <div key={item.label} className="provider-account-card">
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="provider-command-section">
        <div className="container provider-command-layout">
          <div className="provider-main-column">
            <div className="provider-card provider-live-card">
              <div className="provider-card-head">
                <span>Live Aktivität</span>
                <h2>Auftrago läuft.</h2>
                <p>
                  Neue Kundenanfragen kommen laufend rein. Prüfe passende Leads
                  und sichere dir frühzeitig interessante Aufträge.
                </p>
              </div>

              <div className="provider-live-list">
                {activityFeed.map((item) => (
                  <div key={item} className="provider-live-item">
                    <span />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="provider-card">
              <div className="provider-card-head">
                <span>Neue Leads</span>
                <h2>Aktuelle Anfragen</h2>
                <p>
                  Die neuesten Kundenanfragen auf der Plattform. Kontaktdaten
                  werden erst nach dem Kauf freigeschaltet.
                </p>
              </div>

              <div className="provider-lead-grid">
                {latestLeads.length > 0 ? (
                  latestLeads.map((lead) => (
                    <article
                      key={lead.id}
                      className="provider-lead-preview provider-lead-compact"
                    >
                      <div className="provider-lead-tags">
                        <span>Neu</span>
                        <span>{lead.category}</span>
                        <span>{lead.region}</span>
                      </div>

                      <h3>{lead.category}</h3>

                      <div className="provider-lead-info">
                        <span>📍 {lead.region}</span>
                        <span>🔒 Kontakt gesperrt</span>
                        <span>💳 {lead.price} Credits</span>
                      </div>

                      <div className="provider-lead-footer">
                        <div>
                          <strong>{lead.price} Credits</strong>
                          <small>Details nach Freischaltung</small>
                        </div>

                        <Link href="/portal/leads" className="btn btn-primary">
                          Kontakt freischalten
                        </Link>
                      </div>
                    </article>
                  ))
                ) : (
                  <div className="provider-empty">
                    <h3>Noch keine Leads vorhanden</h3>
                    <p>
                      Sobald neue Kundenanfragen eingehen, erscheinen sie hier.
                    </p>
                  </div>
                )}
              </div>

              <Link href="/portal/leads" className="btn btn-primary portal-full-btn">
                Alle Leads ansehen
              </Link>
            </div>
          </div>

          <aside className="provider-side-column">
            <div className="provider-card provider-profit-card">
              <span>📈 Lead-Rechner</span>

              <h2>Warum sich ein Lead lohnt.</h2>

              <div className="provider-profit-row">
                <small>Leadpreis</small>
                <strong>20 Credits</strong>
              </div>

              <div className="provider-profit-row">
                <small>Ø Auftragswert</small>
                <strong>CHF 900</strong>
              </div>

              <div className="provider-profit-row">
                <small>Möglicher Gewinn</small>
                <strong>CHF 450</strong>
              </div>

              <p>
                Schon ein gewonnener Auftrag kann viele weitere Leads
                finanzieren.
              </p>

              <Link href="/portal/guthaben" className="btn btn-primary">
                Credits kaufen
              </Link>
            </div>

            <div className="provider-card">
              <div className="provider-card-head">
                <span>Schnellzugriff</span>
                <h2>Aktionen</h2>
              </div>

              <div className="provider-action-list">
                {quickActions.map((item) => (
                  <Link
                    key={item.title}
                    href={item.href}
                    className="provider-action-card"
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

            <div className="provider-card">
              <div className="provider-card-head">
                <span>Letzte Käufe</span>
                <h2>Freigeschaltete Leads</h2>
              </div>

              <div className="provider-tags">
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