import Link from "next/link";
import { notFound } from "next/navigation";
import AdminAutoRefresh from "@/components/admin/admin-auto-refresh";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

type PageProps = {
  params: {
    id: string;
  };
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

function formatNumber(value: number) {
  return new Intl.NumberFormat("de-CH").format(value);
}

function percent(value: number, total: number) {
  if (total <= 0) return 0;
  return Math.round((value / total) * 100);
}

function initials(value: string) {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function providerStatus(status: string) {
  if (status === "APPROVED") {
    return {
      label: "Genehmigt",
      className: "crm-status-approved",
    };
  }

  if (status === "BLOCKED") {
    return {
      label: "Gesperrt",
      className: "crm-status-blocked",
    };
  }

  return {
    label: "Ausstehend",
    className: "crm-status-pending",
  };
}

function leadStatus(status: string) {
  const labels: Record<string, string> = {
    OPEN: "Offen",
    CONTACTED: "Kontaktiert",
    APPOINTMENT_SET: "Termin",
    OFFER_SENT: "Offerte",
    WON: "Gewonnen",
    LOST: "Verloren",
    NO_OFFER: "Keine Offerte",
  };

  return labels[status] ?? status;
}

function activityLabel(event: string) {
  const labels: Record<string, string> = {
    login: "Login",
    logout: "Logout",
    lead_view: "Lead angesehen",
    lead_unlock: "Lead gekauft",
    lead_purchase: "Lead gekauft",
    credit_purchase: "Credits gekauft",
    page_view: "Seite besucht",
    provider_approved: "Anbieter freigegeben",
    provider_blocked: "Anbieter gesperrt",
    profile_update: "Profil aktualisiert",
  };

  return labels[event] ?? event.replaceAll("_", " ");
}

export default async function AdminProviderDetailPage({ params }: PageProps) {
  const provider = await prisma.provider.findUnique({
    where: {
      id: params.id,
    },
    include: {
      purchases: {
        orderBy: {
          createdAt: "desc",
        },
        take: 12,
        include: {
          lead: {
            select: {
              id: true,
              title: true,
              region: true,
              category: true,
              city: true,
              postalCode: true,
              price: true,
            },
          },
          notes: {
            orderBy: {
              createdAt: "desc",
            },
            take: 3,
          },
          offers: {
            orderBy: {
              createdAt: "desc",
            },
            take: 3,
          },
        },
      },
      creditPurchases: {
        where: {
          status: "paid",
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 12,
      },
      activities: {
        orderBy: {
          createdAt: "desc",
        },
        take: 30,
      },
      fixedOrders: {
        orderBy: {
          createdAt: "desc",
        },
        take: 10,
      },
      invoices: {
        orderBy: {
          createdAt: "desc",
        },
        take: 10,
        include: {
          fixedOrder: {
            select: {
              id: true,
              title: true,
              city: true,
              postalCode: true,
              status: true,
            },
          },
        },
      },
      _count: {
        select: {
          purchases: true,
          creditPurchases: true,
          activities: true,
          fixedOrders: true,
          invoices: true,
        },
      },
    },
  });

  if (!provider) {
    notFound();
  }

  const [
    creditAggregate,
    leadPurchaseAggregate,
    wonCount,
    contactedCount,
    offerCount,
    totalProviderCount,
    providerRankData,
  ] = await Promise.all([
    prisma.creditPurchase.aggregate({
      where: {
        providerId: provider.id,
        status: "paid",
      },
      _sum: {
        amount: true,
        credits: true,
      },
      _count: {
        id: true,
      },
    }),
    prisma.leadPurchase.aggregate({
      where: {
        providerId: provider.id,
      },
      _sum: {
        price: true,
      },
      _count: {
        id: true,
      },
    }),
    prisma.leadPurchase.count({
      where: {
        providerId: provider.id,
        status: "WON",
      },
    }),
    prisma.leadPurchase.count({
      where: {
        providerId: provider.id,
        status: {
          in: ["CONTACTED", "APPOINTMENT_SET", "OFFER_SENT", "WON"],
        },
      },
    }),
    prisma.leadPurchase.count({
      where: {
        providerId: provider.id,
        status: {
          in: ["OFFER_SENT", "WON"],
        },
      },
    }),
    prisma.provider.count(),
    prisma.leadPurchase.groupBy({
      by: ["providerId"],
      _count: {
        _all: true,
      },
      orderBy: {
        _count: {
          providerId: "desc",
        },
      },
    }),
  ]);

  const status = providerStatus(provider.status);
  const totalLeadPurchases = leadPurchaseAggregate._count.id;
  const totalCreditsSpent = leadPurchaseAggregate._sum.price ?? 0;
  const totalCreditRevenue = creditAggregate._sum.amount ?? 0;
  const totalCreditsBought = creditAggregate._sum.credits ?? 0;
  const winRate = percent(wonCount, totalLeadPurchases);
  const contactRate = percent(contactedCount, totalLeadPurchases);
  const offerRate = percent(offerCount, totalLeadPurchases);

  const providerRankIndex = providerRankData.findIndex(
    (entry) => entry.providerId === provider.id,
  );
  const providerRank =
    providerRankIndex >= 0 ? providerRankIndex + 1 : totalProviderCount;

  const engagementScore = Math.min(
    100,
    Math.round(
      Math.min(totalLeadPurchases * 4, 35) +
        Math.min(contactRate * 0.25, 25) +
        Math.min(winRate * 0.25, 25) +
        Math.min(provider._count.activities / 2, 15),
    ),
  );

  const timeline = [
    ...provider.activities.map((activity) => ({
      id: `activity-${activity.id}`,
      date: activity.createdAt,
      icon: "↗",
      title: activityLabel(activity.event),
      description:
        activity.description ||
        activity.page ||
        "Aktivität auf der Plattform",
      detail: activity.page || null,
    })),
    ...provider.creditPurchases.map((purchase) => ({
      id: `payment-${purchase.id}`,
      date: purchase.createdAt,
      icon: "CHF",
      title: "Credits gekauft",
      description: `${purchase.credits} Credits`,
      detail: formatMoney(purchase.amount, purchase.currency),
    })),
    ...provider.purchases.map((purchase) => ({
      id: `purchase-${purchase.id}`,
      date: purchase.createdAt,
      icon: "L",
      title: "Lead gekauft",
      description: purchase.lead.title,
      detail: `${purchase.price} Credits`,
    })),
    ...provider.fixedOrders.map((order) => ({
      id: `order-${order.id}`,
      date: order.createdAt,
      icon: "F",
      title: "Fixauftrag",
      description: order.title,
      detail: order.status,
    })),
  ]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 25);

  const location = [
    provider.address,
    [provider.postalCode, provider.city].filter(Boolean).join(" "),
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <main className="provider-crm-page">
      <div className="provider-crm-glow provider-crm-glow-one" />
      <div className="provider-crm-glow provider-crm-glow-two" />

      <div className="provider-crm-shell">
        <header className="provider-crm-header">
          <div>
            <Link href="/admin/providers" className="provider-crm-back">
              ← Zurück zu Anbieter
            </Link>

            <div className="provider-crm-title-row">
              <div className="provider-crm-avatar">
                {provider.logoUrl ? (
                  <img src={provider.logoUrl} alt="" />
                ) : (
                  initials(provider.companyName)
                )}
              </div>

              <div>
                <div className="provider-crm-title-meta">
                  <span className={`provider-crm-status ${status.className}`}>
                    {status.label}
                  </span>
                  <span>#{providerRank} von {totalProviderCount}</span>
                </div>

                <h1>{provider.companyName}</h1>
                <p>
                  {provider.contactName}
                  {provider.region ? ` · ${provider.region}` : ""}
                  {provider.category ? ` · ${provider.category}` : ""}
                </p>
              </div>
            </div>
          </div>

          <div className="provider-crm-actions">
            <AdminAutoRefresh intervalSeconds={15} />

            {provider.email ? (
              <a
                href={`mailto:${provider.email}`}
                className="provider-crm-button provider-crm-button-dark"
              >
                E-Mail
              </a>
            ) : null}

            {provider.phone ? (
              <a
                href={`tel:${provider.phone}`}
                className="provider-crm-button provider-crm-button-dark"
              >
                Anrufen
              </a>
            ) : null}

            <Link
              href="/admin/providers"
              className="provider-crm-button provider-crm-button-primary"
            >
              Anbieter verwalten
            </Link>
          </div>
        </header>

        <section className="provider-crm-hero-grid">
          <article className="provider-crm-score-card">
            <div
              className="provider-crm-score-ring"
              style={{
                background: `conic-gradient(#38bdf8 ${
                  engagementScore * 3.6
                }deg, rgba(255,255,255,.08) 0deg)`,
              }}
            >
              <div>
                <strong>{engagementScore}</strong>
                <span>/ 100</span>
              </div>
            </div>

            <div>
              <small>ANBIETER SCORE</small>
              <h2>
                {engagementScore >= 80
                  ? "Top-Partner"
                  : engagementScore >= 60
                    ? "Aktiver Partner"
                    : engagementScore >= 35
                      ? "Entwicklungspotenzial"
                      : "Noch wenig Aktivität"}
              </h2>
              <p>
                Berechnet aus Leadkäufen, Kontaktquote, Erfolgsquote und
                Plattformaktivitäten.
              </p>
            </div>
          </article>

          <article className="provider-crm-credit-card">
            <span>Aktuelles Guthaben</span>
            <strong>{formatNumber(provider.credits)} Credits</strong>

            <div>
              <span>
                <small>Gekauft</small>
                <b>{formatNumber(totalCreditsBought)}</b>
              </span>
              <span>
                <small>Eingesetzt</small>
                <b>{formatNumber(totalCreditsSpent)}</b>
              </span>
              <span>
                <small>Credit-Umsatz</small>
                <b>{formatMoney(totalCreditRevenue)}</b>
              </span>
            </div>
          </article>
        </section>

        <section className="provider-crm-kpi-grid">
          {[
            {
              label: "Leadkäufe",
              value: totalLeadPurchases,
              detail: `${totalCreditsSpent} Credits eingesetzt`,
            },
            {
              label: "Gewonnen",
              value: wonCount,
              detail: `${winRate}% Erfolgsquote`,
            },
            {
              label: "Kontaktiert",
              value: contactedCount,
              detail: `${contactRate}% Kontaktquote`,
            },
            {
              label: "Offerten",
              value: offerCount,
              detail: `${offerRate}% Offertquote`,
            },
            {
              label: "Fixaufträge",
              value: provider._count.fixedOrders,
              detail: `${provider._count.invoices} Rechnungen`,
            },
            {
              label: "Aktivitäten",
              value: provider._count.activities,
              detail: "Plattform-Ereignisse",
            },
          ].map((item) => (
            <article className="provider-crm-kpi" key={item.label}>
              <span>{item.label}</span>
              <strong>{formatNumber(item.value)}</strong>
              <small>{item.detail}</small>
            </article>
          ))}
        </section>

        <section className="provider-crm-main-grid">
          <article className="provider-crm-panel">
            <div className="provider-crm-panel-head">
              <div>
                <span>CRM</span>
                <h2>Unternehmensprofil</h2>
              </div>
            </div>

            <div className="provider-crm-profile-grid">
              <div>
                <small>Kontaktperson</small>
                <strong>{provider.contactName}</strong>
              </div>
              <div>
                <small>E-Mail</small>
                <strong>{provider.email}</strong>
              </div>
              <div>
                <small>Telefon</small>
                <strong>{provider.phone || "Nicht angegeben"}</strong>
              </div>
              <div>
                <small>Standort</small>
                <strong>{location || provider.region || "Nicht angegeben"}</strong>
              </div>
              <div>
                <small>Webseite</small>
                <strong>{provider.website || "Nicht angegeben"}</strong>
              </div>
              <div>
                <small>Registriert</small>
                <strong>{formatDate(provider.createdAt)}</strong>
              </div>
            </div>

            {provider.description ? (
              <div className="provider-crm-description">
                <small>Firmenbeschreibung</small>
                <p>{provider.description}</p>
              </div>
            ) : null}

            <div className="provider-crm-tags-block">
              <small>Dienstleistungen</small>
              <div>
                {(provider.serviceCategories.length > 0
                  ? provider.serviceCategories
                  : provider.category
                    ? [provider.category]
                    : ["Keine Kategorien"]
                ).map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </div>

            <div className="provider-crm-tags-block">
              <small>Einsatzgebiete</small>
              <div>
                {(provider.serviceRegions.length > 0
                  ? provider.serviceRegions
                  : provider.region
                    ? [provider.region]
                    : ["Keine Regionen"]
                ).map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </div>

            <div className="provider-crm-settings">
              <div>
                <span>Lead-E-Mails</span>
                <strong>{provider.receiveLeadEmails ? "Aktiv" : "Deaktiviert"}</strong>
              </div>
              <div>
                <span>Alle Lead-E-Mails</span>
                <strong>
                  {provider.receiveAllLeadEmails ? "Aktiv" : "Deaktiviert"}
                </strong>
              </div>
            </div>
          </article>

          <article className="provider-crm-panel">
            <div className="provider-crm-panel-head">
              <div>
                <span>Sales Performance</span>
                <h2>Conversion-Funnel</h2>
              </div>
            </div>

            <div className="provider-crm-funnel">
              {[
                ["Leadkäufe", totalLeadPurchases, 100],
                ["Kontaktiert", contactedCount, contactRate],
                ["Offerten", offerCount, offerRate],
                ["Gewonnen", wonCount, winRate],
              ].map(([label, value, rate]) => (
                <div key={String(label)}>
                  <div>
                    <span>{label}</span>
                    <strong>{formatNumber(Number(value))}</strong>
                  </div>

                  <div className="provider-crm-funnel-track">
                    <i
                      style={{
                        width: `${Math.max(
                          Number(rate),
                          Number(value) ? 4 : 0,
                        )}%`,
                      }}
                    />
                  </div>

                  <small>{rate}%</small>
                </div>
              ))}
            </div>

            <div className="provider-crm-intelligence">
              <small>AUTOMATISCHE BEWERTUNG</small>

              <div>
                <strong>
                  {winRate >= 30
                    ? "Sehr gute Abschlussleistung"
                    : winRate >= 15
                      ? "Solide Abschlussleistung"
                      : "Abschlussquote kann verbessert werden"}
                </strong>
                <p>
                  {contactRate < 60
                    ? "Nicht alle gekauften Leads werden konsequent bearbeitet. Eine höhere Kontaktquote dürfte die Resultate verbessern."
                    : "Die gekauften Leads werden überwiegend bearbeitet. Der Anbieter zeigt eine gute operative Aktivität."}
                </p>
              </div>
            </div>
          </article>
        </section>

        <section className="provider-crm-double-grid">
          <article className="provider-crm-panel">
            <div className="provider-crm-panel-head">
              <div>
                <span>Lead CRM</span>
                <h2>Gekaufte Leads</h2>
              </div>
              <strong>{totalLeadPurchases}</strong>
            </div>

            <div className="provider-crm-list">
              {provider.purchases.length === 0 ? (
                <p className="provider-crm-empty">
                  Noch keine Leads gekauft.
                </p>
              ) : (
                provider.purchases.map((purchase) => (
                  <div className="provider-crm-lead-row" key={purchase.id}>
                    <div className="provider-crm-list-icon">L</div>

                    <div className="provider-crm-list-main">
                      <strong>{purchase.lead.title}</strong>
                      <span>
                        {purchase.lead.postalCode
                          ? `${purchase.lead.postalCode} `
                          : ""}
                        {purchase.lead.city || purchase.lead.region} ·{" "}
                        {purchase.lead.category}
                      </span>
                    </div>

                    <div className="provider-crm-list-side">
                      <strong>{leadStatus(purchase.status)}</strong>
                      <span>{purchase.price} Credits</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </article>

          <article className="provider-crm-panel">
            <div className="provider-crm-panel-head">
              <div>
                <span>Finanzen</span>
                <h2>Credit-Zahlungen</h2>
              </div>
              <strong>{creditAggregate._count.id}</strong>
            </div>

            <div className="provider-crm-list">
              {provider.creditPurchases.length === 0 ? (
                <p className="provider-crm-empty">
                  Noch keine bezahlten Creditpakete.
                </p>
              ) : (
                provider.creditPurchases.map((purchase) => (
                  <div className="provider-crm-payment-row" key={purchase.id}>
                    <div className="provider-crm-list-icon">CHF</div>

                    <div className="provider-crm-list-main">
                      <strong>{purchase.credits} Credits</strong>
                      <span>{formatDate(purchase.createdAt)}</span>
                    </div>

                    <div className="provider-crm-list-side">
                      <strong>
                        {formatMoney(purchase.amount, purchase.currency)}
                      </strong>
                      <span>{purchase.status}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </article>
        </section>

        <section className="provider-crm-double-grid">
          <article className="provider-crm-panel">
            <div className="provider-crm-panel-head">
              <div>
                <span>Auftragsgeschäft</span>
                <h2>Fixaufträge</h2>
              </div>
              <strong>{provider._count.fixedOrders}</strong>
            </div>

            <div className="provider-crm-list">
              {provider.fixedOrders.length === 0 ? (
                <p className="provider-crm-empty">
                  Noch keine Fixaufträge gekauft.
                </p>
              ) : (
                provider.fixedOrders.map((order) => (
                  <div className="provider-crm-order-row" key={order.id}>
                    <div className="provider-crm-list-icon">F</div>

                    <div className="provider-crm-list-main">
                      <strong>{order.title}</strong>
                      <span>
                        {order.postalCode} {order.city} · {order.category}
                      </span>
                    </div>

                    <div className="provider-crm-list-side">
                      <strong>{order.status}</strong>
                      <span>{formatMoney(order.orderValueCents)}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </article>

          <article className="provider-crm-panel">
            <div className="provider-crm-panel-head">
              <div>
                <span>Buchhaltung</span>
                <h2>Rechnungen</h2>
              </div>
              <strong>{provider._count.invoices}</strong>
            </div>

            <div className="provider-crm-list">
              {provider.invoices.length === 0 ? (
                <p className="provider-crm-empty">
                  Noch keine Rechnungen vorhanden.
                </p>
              ) : (
                provider.invoices.map((invoice) => (
                  <div className="provider-crm-invoice-row" key={invoice.id}>
                    <div className="provider-crm-list-icon">R</div>

                    <div className="provider-crm-list-main">
                      <strong>{invoice.invoiceNumber}</strong>
                      <span>{invoice.fixedOrder.title}</span>
                    </div>

                    <div className="provider-crm-list-side">
                      <strong>{formatMoney(invoice.amountCents)}</strong>
                      <span>{invoice.status}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </article>
        </section>

        <section className="provider-crm-panel provider-crm-timeline-panel">
          <div className="provider-crm-panel-head">
            <div>
              <span>Timeline</span>
              <h2>Neueste Aktivitäten</h2>
            </div>
            <strong>{provider._count.activities}</strong>
          </div>

          <div className="provider-crm-timeline">
            {timeline.length === 0 ? (
              <p className="provider-crm-empty">
                Noch keine Aktivitäten vorhanden.
              </p>
            ) : (
              timeline.map((item) => (
                <div key={item.id}>
                  <div className="provider-crm-timeline-icon">
                    {item.icon}
                  </div>

                  <div>
                    <strong>{item.title}</strong>
                    <span>{item.description}</span>
                  </div>

                  <div>
                    {item.detail ? <strong>{item.detail}</strong> : null}
                    <small>{formatDate(item.date)}</small>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      <style>{`
        .provider-crm-page {
          position: relative;
          min-height: 100vh;
          overflow: hidden;
          padding: 38px 20px 80px;
          color: #f8fafc;
          background:
            linear-gradient(180deg, #050b16 0%, #081426 46%, #07101d 100%);
        }

        .provider-crm-glow {
          position: absolute;
          width: 580px;
          height: 580px;
          border-radius: 999px;
          filter: blur(130px);
          opacity: .16;
          pointer-events: none;
        }

        .provider-crm-glow-one {
          top: -260px;
          right: -160px;
          background: #4f46e5;
        }

        .provider-crm-glow-two {
          bottom: -220px;
          left: -250px;
          background: #0891b2;
        }

        .provider-crm-shell {
          position: relative;
          z-index: 1;
          width: min(1500px, 100%);
          margin: 0 auto;
        }

        .provider-crm-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 24px;
          flex-wrap: wrap;
        }

        .provider-crm-back {
          display: inline-block;
          margin-bottom: 20px;
          color: rgba(226,232,240,.58);
          text-decoration: none;
          font-size: 13px;
          font-weight: 800;
        }

        .provider-crm-title-row {
          display: flex;
          align-items: center;
          gap: 18px;
        }

        .provider-crm-avatar {
          width: 76px;
          height: 76px;
          flex: 0 0 76px;
          overflow: hidden;
          display: grid;
          place-items: center;
          border-radius: 24px;
          background:
            linear-gradient(145deg, rgba(99,102,241,.34), rgba(56,189,248,.18));
          border: 1px solid rgba(255,255,255,.12);
          font-size: 24px;
          font-weight: 950;
        }

        .provider-crm-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .provider-crm-title-meta {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .provider-crm-title-meta > span:last-child {
          color: rgba(226,232,240,.42);
          font-size: 12px;
          font-weight: 800;
        }

        .provider-crm-status {
          display: inline-flex;
          padding: 6px 10px;
          border-radius: 999px;
          font-size: 10px;
          font-weight: 950;
          letter-spacing: .06em;
          text-transform: uppercase;
        }

        .crm-status-approved {
          color: #86efac;
          background: rgba(34,197,94,.12);
        }

        .crm-status-pending {
          color: #fde68a;
          background: rgba(234,179,8,.12);
        }

        .crm-status-blocked {
          color: #fda4af;
          background: rgba(244,63,94,.12);
        }

        .provider-crm-title-row h1 {
          margin: 10px 0 0;
          font-size: clamp(32px, 4vw, 54px);
          line-height: 1;
          letter-spacing: -.04em;
        }

        .provider-crm-title-row p {
          margin: 9px 0 0;
          color: rgba(226,232,240,.55);
        }

        .provider-crm-actions {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .provider-crm-button {
          min-height: 44px;
          padding: 0 16px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 14px;
          border: 1px solid rgba(255,255,255,.10);
          text-decoration: none;
          font-size: 13px;
          font-weight: 850;
        }

        .provider-crm-button-dark {
          color: #f8fafc;
          background: rgba(255,255,255,.04);
        }

        .provider-crm-button-primary {
          color: white;
          background: linear-gradient(135deg, #6366f1, #2563eb);
          box-shadow: 0 14px 35px rgba(37,99,235,.25);
        }

        .provider-crm-hero-grid {
          display: grid;
          grid-template-columns: minmax(0, .85fr) minmax(0, 1.15fr);
          gap: 18px;
          margin-top: 34px;
        }

        .provider-crm-score-card,
        .provider-crm-credit-card,
        .provider-crm-kpi,
        .provider-crm-panel {
          border: 1px solid rgba(255,255,255,.09);
          box-shadow: 0 26px 80px rgba(0,0,0,.22);
        }

        .provider-crm-score-card {
          padding: 28px;
          border-radius: 30px;
          display: flex;
          align-items: center;
          gap: 24px;
          background: rgba(8,20,39,.86);
        }

        .provider-crm-score-ring {
          width: 132px;
          height: 132px;
          flex: 0 0 132px;
          display: grid;
          place-items: center;
          border-radius: 999px;
        }

        .provider-crm-score-ring > div {
          width: 104px;
          height: 104px;
          display: grid;
          place-content: center;
          text-align: center;
          border-radius: 999px;
          background: #091425;
        }

        .provider-crm-score-ring strong {
          font-size: 35px;
          line-height: 1;
        }

        .provider-crm-score-ring span {
          margin-top: 4px;
          color: rgba(226,232,240,.42);
          font-size: 11px;
        }

        .provider-crm-score-card small,
        .provider-crm-credit-card > span {
          color: #a5b4fc;
          font-size: 11px;
          font-weight: 950;
          letter-spacing: .08em;
          text-transform: uppercase;
        }

        .provider-crm-score-card h2 {
          margin: 8px 0 0;
          font-size: 27px;
        }

        .provider-crm-score-card p {
          margin: 9px 0 0;
          color: rgba(226,232,240,.52);
          font-size: 13px;
          line-height: 1.55;
        }

        .provider-crm-credit-card {
          padding: 30px;
          border-radius: 30px;
          background:
            radial-gradient(circle at 90% 0%, rgba(56,189,248,.18), transparent 30%),
            linear-gradient(145deg, rgba(15,37,62,.97), rgba(24,30,76,.94));
        }

        .provider-crm-credit-card > strong {
          display: block;
          margin-top: 18px;
          font-size: clamp(38px, 5vw, 64px);
          line-height: 1;
          letter-spacing: -.05em;
        }

        .provider-crm-credit-card > div {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 10px;
          margin-top: 28px;
        }

        .provider-crm-credit-card > div > span {
          padding: 14px;
          border-radius: 17px;
          background: rgba(255,255,255,.05);
          border: 1px solid rgba(255,255,255,.06);
        }

        .provider-crm-credit-card small,
        .provider-crm-credit-card b {
          display: block;
        }

        .provider-crm-credit-card small {
          color: rgba(226,232,240,.45);
        }

        .provider-crm-credit-card b {
          margin-top: 7px;
          font-size: 17px;
        }

        .provider-crm-kpi-grid {
          display: grid;
          grid-template-columns: repeat(6, minmax(0, 1fr));
          gap: 12px;
          margin-top: 18px;
        }

        .provider-crm-kpi {
          min-height: 142px;
          padding: 20px;
          border-radius: 23px;
          background: rgba(8,20,39,.82);
        }

        .provider-crm-kpi span,
        .provider-crm-kpi strong,
        .provider-crm-kpi small {
          display: block;
        }

        .provider-crm-kpi span {
          color: rgba(226,232,240,.47);
          font-size: 11px;
          font-weight: 900;
          letter-spacing: .06em;
          text-transform: uppercase;
        }

        .provider-crm-kpi strong {
          margin-top: 23px;
          font-size: 30px;
        }

        .provider-crm-kpi small {
          margin-top: 7px;
          color: rgba(226,232,240,.42);
        }

        .provider-crm-main-grid,
        .provider-crm-double-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 18px;
          margin-top: 18px;
        }

        .provider-crm-panel {
          padding: 26px;
          border-radius: 28px;
          background: rgba(8,20,39,.84);
        }

        .provider-crm-panel-head {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 16px;
        }

        .provider-crm-panel-head span {
          color: #a5b4fc;
          font-size: 11px;
          font-weight: 950;
          letter-spacing: .08em;
          text-transform: uppercase;
        }

        .provider-crm-panel-head h2 {
          margin: 7px 0 0;
          font-size: 24px;
        }

        .provider-crm-profile-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
          margin-top: 22px;
        }

        .provider-crm-profile-grid > div,
        .provider-crm-settings > div {
          padding: 15px;
          border-radius: 17px;
          background: rgba(255,255,255,.04);
        }

        .provider-crm-profile-grid small,
        .provider-crm-profile-grid strong {
          display: block;
        }

        .provider-crm-profile-grid small {
          color: rgba(226,232,240,.42);
        }

        .provider-crm-profile-grid strong {
          margin-top: 6px;
          overflow-wrap: anywhere;
        }

        .provider-crm-description,
        .provider-crm-tags-block {
          margin-top: 18px;
        }

        .provider-crm-description > small,
        .provider-crm-tags-block > small {
          color: rgba(226,232,240,.42);
          font-weight: 850;
        }

        .provider-crm-description p {
          margin: 8px 0 0;
          color: rgba(226,232,240,.62);
          line-height: 1.6;
        }

        .provider-crm-tags-block > div {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 9px;
        }

        .provider-crm-tags-block span {
          padding: 7px 10px;
          border-radius: 999px;
          background: rgba(99,102,241,.12);
          color: #c4b5fd;
          font-size: 11px;
          font-weight: 800;
        }

        .provider-crm-settings {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
          margin-top: 18px;
        }

        .provider-crm-settings span,
        .provider-crm-settings strong {
          display: block;
        }

        .provider-crm-settings span {
          color: rgba(226,232,240,.42);
          font-size: 11px;
        }

        .provider-crm-settings strong {
          margin-top: 6px;
        }

        .provider-crm-funnel {
          display: grid;
          gap: 18px;
          margin-top: 25px;
        }

        .provider-crm-funnel > div > div:first-child {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 7px;
        }

        .provider-crm-funnel > div > div:first-child span {
          color: rgba(226,232,240,.62);
        }

        .provider-crm-funnel-track {
          height: 10px;
          overflow: hidden;
          border-radius: 999px;
          background: rgba(255,255,255,.06);
        }

        .provider-crm-funnel-track i {
          display: block;
          height: 100%;
          border-radius: 999px;
          background: linear-gradient(90deg, #8b5cf6, #38bdf8);
        }

        .provider-crm-funnel small {
          display: block;
          margin-top: 5px;
          color: rgba(226,232,240,.38);
        }

        .provider-crm-intelligence {
          margin-top: 25px;
          padding: 18px;
          border-radius: 20px;
          background:
            linear-gradient(145deg, rgba(99,102,241,.12), rgba(56,189,248,.06));
          border: 1px solid rgba(129,140,248,.14);
        }

        .provider-crm-intelligence > small {
          color: #a5b4fc;
          font-size: 10px;
          font-weight: 950;
          letter-spacing: .08em;
        }

        .provider-crm-intelligence strong {
          display: block;
          margin-top: 12px;
        }

        .provider-crm-intelligence p {
          margin: 7px 0 0;
          color: rgba(226,232,240,.50);
          font-size: 12px;
          line-height: 1.55;
        }

        .provider-crm-list {
          display: grid;
          gap: 2px;
          margin-top: 20px;
        }

        .provider-crm-lead-row,
        .provider-crm-payment-row,
        .provider-crm-order-row,
        .provider-crm-invoice-row {
          display: grid;
          grid-template-columns: 46px 1fr auto;
          gap: 12px;
          align-items: center;
          padding: 13px 0;
          border-bottom: 1px solid rgba(255,255,255,.06);
        }

        .provider-crm-list-icon {
          width: 42px;
          height: 42px;
          display: grid;
          place-items: center;
          border-radius: 14px;
          background: rgba(56,189,248,.10);
          color: #7dd3fc;
          font-size: 11px;
          font-weight: 950;
        }

        .provider-crm-list-main strong,
        .provider-crm-list-main span,
        .provider-crm-list-side strong,
        .provider-crm-list-side span {
          display: block;
        }

        .provider-crm-list-main span,
        .provider-crm-list-side span {
          margin-top: 4px;
          color: rgba(226,232,240,.42);
          font-size: 11px;
        }

        .provider-crm-list-side {
          text-align: right;
        }

        .provider-crm-list-side strong {
          font-size: 12px;
        }

        .provider-crm-timeline-panel {
          margin-top: 18px;
        }

        .provider-crm-timeline {
          display: grid;
          margin-top: 22px;
        }

        .provider-crm-timeline > div {
          display: grid;
          grid-template-columns: 44px 1fr auto;
          gap: 13px;
          align-items: center;
          padding: 13px 0;
          border-bottom: 1px solid rgba(255,255,255,.06);
        }

        .provider-crm-timeline-icon {
          width: 40px;
          height: 40px;
          display: grid;
          place-items: center;
          border-radius: 14px;
          background: rgba(99,102,241,.12);
          color: #c4b5fd;
          font-size: 10px;
          font-weight: 950;
        }

        .provider-crm-timeline > div > div:nth-child(2) strong,
        .provider-crm-timeline > div > div:nth-child(2) span,
        .provider-crm-timeline > div > div:last-child strong,
        .provider-crm-timeline > div > div:last-child small {
          display: block;
        }

        .provider-crm-timeline > div > div:nth-child(2) span {
          margin-top: 4px;
          color: rgba(226,232,240,.44);
          font-size: 12px;
        }

        .provider-crm-timeline > div > div:last-child {
          text-align: right;
        }

        .provider-crm-timeline > div > div:last-child strong {
          font-size: 11px;
        }

        .provider-crm-timeline > div > div:last-child small {
          margin-top: 4px;
          color: rgba(226,232,240,.38);
          font-size: 10px;
        }

        .provider-crm-empty {
          color: rgba(226,232,240,.42);
        }

        @media (max-width: 1200px) {
          .provider-crm-kpi-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }

        @media (max-width: 900px) {
          .provider-crm-hero-grid,
          .provider-crm-main-grid,
          .provider-crm-double-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 680px) {
          .provider-crm-page {
            padding-inline: 12px;
          }

          .provider-crm-title-row {
            align-items: flex-start;
          }

          .provider-crm-avatar {
            width: 58px;
            height: 58px;
            flex-basis: 58px;
            border-radius: 19px;
            font-size: 18px;
          }

          .provider-crm-score-card {
            align-items: flex-start;
            flex-direction: column;
          }

          .provider-crm-credit-card > div,
          .provider-crm-profile-grid,
          .provider-crm-settings {
            grid-template-columns: 1fr;
          }

          .provider-crm-kpi-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .provider-crm-timeline > div {
            grid-template-columns: 40px 1fr;
          }

          .provider-crm-timeline > div > div:last-child {
            grid-column: 2;
            text-align: left;
          }
        }
      `}</style>
    </main>
  );
}