import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import "./portal-dashboard.css";

export const dynamic = "force-dynamic";

const quickActions = [
  {
    title: "Neue Leads",
    text: "Passende Kundenanfragen entdecken",
    href: "/portal/leads",
    cta: "Ansehen",
  },
  {
    title: "Meine Leads",
    text: "Gekaufte Kontakte verwalten",
    href: "/portal/meine-leads",
    cta: "Öffnen",
  },
  {
    title: "Credits",
    text: "Guthaben aufladen und sparen",
    href: "/portal/guthaben",
    cta: "Aufladen",
  },
  {
    title: "Firmenprofil",
    text: "Regionen und Leistungen bearbeiten",
    href: "/portal/profil",
    cta: "Bearbeiten",
  },
];

function getCreditStatus(credits: number) {
  if (credits <= 10) {
    return {
      label: "Fast aufgebraucht",
      message: "Dein Guthaben reicht voraussichtlich nur noch für einen günstigen Lead.",
      tone: "danger",
    };
  }

  if (credits <= 35) {
    return {
      label: "Guthaben wird knapp",
      message: "Lade rechtzeitig Credits auf, damit du keine passende Anfrage verpasst.",
      tone: "warning",
    };
  }

  return {
    label: "Bereit für neue Aufträge",
    message: "Dein Guthaben ist bereit für passende Kundenanfragen.",
    tone: "success",
  };
}

function getLeadFit(
  leadRegion: string | null,
  providerRegion: string | null,
) {
  if (
    providerRegion &&
    leadRegion &&
    leadRegion.toLowerCase().includes(providerRegion.toLowerCase())
  ) {
    return "Sehr passend";
  }

  return "Neue Chance";
}

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

  const purchasedLeadIds = provider.purchases.map((purchase) => purchase.lead.id);

  const [latestLeads, totalLeads] = await Promise.all([
    prisma.lead.findMany({
      where:
        purchasedLeadIds.length > 0
          ? {
              id: {
                notIn: purchasedLeadIds,
              },
            }
          : undefined,
      take: 6,
      orderBy: { createdAt: "desc" },
    }),
    prisma.lead.count(),
  ]);

  const creditStatus = getCreditStatus(provider.credits);
  const purchasedCount = provider.purchases.length;
  const estimatedLeadCapacity =
    latestLeads.length > 0
      ? Math.max(
          0,
          Math.floor(
            provider.credits /
              Math.max(
                1,
                Math.round(
                  latestLeads.reduce((sum, lead) => sum + lead.price, 0) /
                    latestLeads.length,
                ),
              ),
          ),
        )
      : 0;

  return (
    <main className="provider-dashboard">
      <div className="provider-dashboard__glow provider-dashboard__glow--one" />
      <div className="provider-dashboard__glow provider-dashboard__glow--two" />

      <div className="provider-dashboard__container">
        <section className="provider-hero">
          <div className="provider-hero__content">
            <div className="provider-hero__badge">
              <span className="provider-hero__badge-dot" />
              Auftrago Firmenportal
            </div>

            <h1>
              Willkommen zurück,
              <span>{provider.companyName}</span>
            </h1>

            <p>
              Entdecke neue Kundenanfragen, sichere dir passende Aufträge und
              verwalte dein Geschäft zentral an einem Ort.
            </p>

            <div className="provider-hero__actions">
              <Link href="/portal/leads" className="provider-button provider-button--primary">
                Passende Leads entdecken
                <span aria-hidden="true">→</span>
              </Link>

              <Link
                href="/portal/guthaben"
                className="provider-button provider-button--secondary"
              >
                Credits aufladen
              </Link>
            </div>
          </div>

          <div className="provider-hero__spotlight">
            <span className="provider-hero__spotlight-label">
              Heute für dich verfügbar
            </span>

            <strong>{latestLeads.length}</strong>
            <p>neue Kundenanfragen warten auf eine schnelle Reaktion.</p>

            <Link href="/portal/leads">
              Jetzt Chancen ansehen
              <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </section>

        <section className="provider-kpis" aria-label="Portal Kennzahlen">
          <article className="provider-kpi">
            <div className="provider-kpi__top">
              <span>Verfügbare Credits</span>
              <span className={`provider-status provider-status--${creditStatus.tone}`}>
                {creditStatus.label}
              </span>
            </div>
            <strong>{provider.credits}</strong>
            <p>Reicht aktuell für ungefähr {estimatedLeadCapacity} Leads.</p>
          </article>

          <article className="provider-kpi">
            <div className="provider-kpi__top">
              <span>Aktive Leads</span>
              <span className="provider-kpi__trend">Live</span>
            </div>
            <strong>{totalLeads}</strong>
            <p>Aktuelle Kundenanfragen auf der Plattform.</p>
          </article>

          <article className="provider-kpi">
            <div className="provider-kpi__top">
              <span>Freigeschaltet</span>
              <span className="provider-kpi__trend">Gesamt</span>
            </div>
            <strong>{purchasedCount}</strong>
            <p>Leads wurden von deinem Unternehmen gekauft.</p>
          </article>

          <article className="provider-kpi">
            <div className="provider-kpi__top">
              <span>Deine Region</span>
              <span className="provider-kpi__trend">Profil</span>
            </div>
            <strong className="provider-kpi__region">
              {provider.region || "Schweiz"}
            </strong>
            <p>Hier werden bevorzugt passende Chancen angezeigt.</p>
          </article>
        </section>

        <div className="provider-dashboard__grid">
          <section className="provider-leads">
            <div className="provider-section-heading">
              <div>
                <span>Neue Chancen</span>
                <h2>Aktuelle Kundenanfragen</h2>
                <p>
                  Neue Leads werden laufend ergänzt. Frühes Reagieren erhöht
                  deine Chance auf den Auftrag.
                </p>
              </div>

              <Link href="/portal/leads" className="provider-text-link">
                Alle Leads ansehen
                <span aria-hidden="true">→</span>
              </Link>
            </div>

            <div className="provider-leads__list">
              {latestLeads.length > 0 ? (
                latestLeads.map((lead, index) => {
                  const fit = getLeadFit(lead.region, provider.region);

                  return (
                    <article className="provider-lead-card" key={lead.id}>
                      <div className="provider-lead-card__number">
                        {String(index + 1).padStart(2, "0")}
                      </div>

                      <div className="provider-lead-card__content">
                        <div className="provider-lead-card__badges">
                          <span className="provider-lead-card__new">Neu</span>
                          <span>{fit}</span>
                          <span>{lead.region || "Schweiz"}</span>
                        </div>

                        <h3>{lead.title || lead.category}</h3>

                        <div className="provider-lead-card__meta">
                          <span>
                            <small>Leistung</small>
                            {lead.category}
                          </span>
                          <span>
                            <small>Region</small>
                            {lead.region || "Schweiz"}
                          </span>
                          <span>
                            <small>Kontakt</small>
                            Nach Kauf sichtbar
                          </span>
                        </div>
                      </div>

                      <div className="provider-lead-card__purchase">
                        <span>Leadpreis</span>
                        <strong>{lead.price}</strong>
                        <small>Credits</small>

                        <Link
                          href={`/portal/leads`}
                          className="provider-button provider-button--compact"
                        >
                          Freischalten
                        </Link>
                      </div>
                    </article>
                  );
                })
              ) : (
                <div className="provider-empty">
                  <span>✓</span>
                  <h3>Du bist auf dem neusten Stand</h3>
                  <p>
                    Aktuell sind keine neuen Leads vorhanden. Sobald eine neue
                    Anfrage eingeht, erscheint sie hier.
                  </p>
                </div>
              )}
            </div>
          </section>

          <aside className="provider-sidebar">
            <section className={`provider-credit provider-credit--${creditStatus.tone}`}>
              <div className="provider-credit__head">
                <span>Dein Guthaben</span>
                <span className="provider-credit__icon">C</span>
              </div>

              <strong>{provider.credits}</strong>
              <small>Credits verfügbar</small>

              <p>{creditStatus.message}</p>

              <div className="provider-credit__bar">
                <span
                  style={{
                    width: `${Math.min(100, Math.max(8, provider.credits))}%`,
                  }}
                />
              </div>

              <Link
                href="/portal/guthaben"
                className="provider-button provider-button--primary provider-button--full"
              >
                Credits kaufen
                <span aria-hidden="true">→</span>
              </Link>
            </section>

            <section className="provider-side-card">
              <div className="provider-side-card__heading">
                <span>Schnellzugriff</span>
                <h2>Wichtige Aktionen</h2>
              </div>

              <div className="provider-actions">
                {quickActions.map((item) => (
                  <Link href={item.href} key={item.title}>
                    <div>
                      <strong>{item.title}</strong>
                      <span>{item.text}</span>
                    </div>
                    <small>{item.cta} →</small>
                  </Link>
                ))}
              </div>
            </section>

            <section className="provider-side-card">
              <div className="provider-side-card__heading">
                <span>Letzte Aktivität</span>
                <h2>Freigeschaltete Leads</h2>
              </div>

              <div className="provider-purchases">
                {provider.purchases.length > 0 ? (
                  provider.purchases.slice(0, 4).map((purchase) => (
                    <div key={purchase.id}>
                      <span className="provider-purchases__dot" />
                      <div>
                        <strong>{purchase.lead.title}</strong>
                        <small>{purchase.lead.region || "Schweiz"}</small>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="provider-purchases__empty">
                    Noch keine Leads gekauft.
                  </div>
                )}
              </div>

              <Link
                href="/portal/meine-leads"
                className="provider-text-link provider-text-link--full"
              >
                Meine Leads öffnen
                <span aria-hidden="true">→</span>
              </Link>
            </section>
          </aside>
        </div>

        <section className="provider-value">
          <div>
            <span>Mehr Aufträge. Weniger Leerlauf.</span>
            <h2>Ein gewonnener Auftrag kann viele Leadkäufe finanzieren.</h2>
            <p>
              Nutze Credits gezielt für passende Regionen und Leistungen. So
              konzentrierst du dein Budget auf Anfragen mit echtem Potenzial.
            </p>
          </div>

          <Link href="/portal/guthaben" className="provider-button provider-button--light">
            Credit-Pakete ansehen
            <span aria-hidden="true">→</span>
          </Link>
        </section>
      </div>
    </main>
  );
}
