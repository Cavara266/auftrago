import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("de-CH", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function formatMoney(amountInRappen: number, currency = "chf") {
  return new Intl.NumberFormat("de-CH", {
    style: "currency",
    currency: currency.toUpperCase(),
    minimumFractionDigits: 2,
  }).format(amountInRappen / 100);
}

function getProviderStatusLabel(status: string) {
  if (status === "APPROVED") {
    return "🟢 Genehmigt";
  }

  if (status === "BLOCKED") {
    return "🔴 Gesperrt";
  }

  return "🟡 Ausstehend";
}

function getProviderStatusStyle(status: string) {
  if (status === "APPROVED") {
    return {
      border: "1px solid rgba(34,197,94,0.25)",
      background: "rgba(34,197,94,0.12)",
      color: "#bbf7d0",
    };
  }

  if (status === "BLOCKED") {
    return {
      border: "1px solid rgba(239,68,68,0.25)",
      background: "rgba(239,68,68,0.12)",
      color: "#fecaca",
    };
  }

  return {
    border: "1px solid rgba(250,204,21,0.25)",
    background: "rgba(250,204,21,0.10)",
    color: "#fde68a",
  };
}

export default async function AdminDashboardPage() {
  const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const [
    latestProviders,
    latestLeads,
    latestLeadPurchases,
    latestCreditPurchases,

    providerCount,
    pendingProviderCount,
    approvedProviderCount,
    blockedProviderCount,

    leadCount,
    leadPurchaseCount,
    leadPurchasesLast24Hours,
    creditPurchasesLast24Hours,

    leadCreditsAggregate,
    paidCreditAggregate,
  ] = await Promise.all([
    prisma.provider.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 6,
      select: {
        id: true,
        companyName: true,
        contactName: true,
        email: true,
        region: true,
        credits: true,
        status: true,
        createdAt: true,
      },
    }),

    prisma.lead.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 6,
      select: {
        id: true,
        title: true,
        region: true,
        category: true,
        price: true,
        createdAt: true,
        _count: {
          select: {
            purchases: true,
          },
        },
      },
    }),

    prisma.leadPurchase.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 6,
      include: {
        provider: {
          select: {
            id: true,
            companyName: true,
            email: true,
          },
        },
        lead: {
          select: {
            id: true,
            title: true,
            region: true,
            category: true,
          },
        },
      },
    }),

    prisma.creditPurchase.findMany({
      where: {
        status: "paid",
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 6,
      include: {
        provider: {
          select: {
            id: true,
            companyName: true,
            email: true,
          },
        },
      },
    }),

    prisma.provider.count(),

    prisma.provider.count({
      where: {
        status: "PENDING",
      },
    }),

    prisma.provider.count({
      where: {
        status: "APPROVED",
      },
    }),

    prisma.provider.count({
      where: {
        status: "BLOCKED",
      },
    }),

    prisma.lead.count(),

    prisma.leadPurchase.count(),

    prisma.leadPurchase.count({
      where: {
        createdAt: {
          gte: last24Hours,
        },
      },
    }),

    prisma.creditPurchase.count({
      where: {
        status: "paid",
        createdAt: {
          gte: last24Hours,
        },
      },
    }),

    prisma.leadPurchase.aggregate({
      _sum: {
        price: true,
      },
    }),

    prisma.creditPurchase.aggregate({
      where: {
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
  ]);

  const totalLeadCreditsSpent =
    leadCreditsAggregate._sum.price ?? 0;

  const totalStripeRevenue =
    paidCreditAggregate._sum.amount ?? 0;

  const totalCreditsSold =
    paidCreditAggregate._sum.credits ?? 0;

  const totalStripePayments =
    paidCreditAggregate._count.id;

  return (
    <main className="page">
      <section className="admin-dashboard">
        <div className="container">
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              gap: 24,
              flexWrap: "wrap",
            }}
          >
            <div>
              <span className="eyebrow">
                Auftrago Administration
              </span>

              <h1
                style={{
                  marginTop: 14,
                }}
              >
                Admin-Dashboard.
              </h1>

              <p
                style={{
                  maxWidth: 760,
                  marginTop: 14,
                }}
              >
                Anbieter freigeben, Leads verwalten, Käufe
                kontrollieren und die wichtigsten Kennzahlen der
                Plattform überwachen.
              </p>
            </div>

            <div
              className="admin-actions"
              style={{
                display: "flex",
                gap: 12,
                flexWrap: "wrap",
              }}
            >
              <Link
                href="/admin/providers"
                className="btn btn-primary"
              >
                Anbieter verwalten
              </Link>

              <Link
                href="/admin/leads"
                className="btn btn-primary"
              >
                Leads verwalten
              </Link>

              <Link
                href="/portal"
                className="btn btn-secondary"
              >
                Portal öffnen
              </Link>

              <Link
                href="/admin-logout"
                className="btn btn-secondary"
              >
                Abmelden
              </Link>
            </div>
          </div>

          {pendingProviderCount > 0 ? (
            <div
              style={{
                marginTop: 28,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 20,
                flexWrap: "wrap",
                padding: "22px 24px",
                borderRadius: 24,
                border:
                  "1px solid rgba(250,204,21,0.24)",
                background:
                  "linear-gradient(135deg, rgba(250,204,21,0.13), rgba(255,255,255,0.035))",
              }}
            >
              <div>
                <div
                  style={{
                    color: "#fde68a",
                    fontWeight: 900,
                    fontSize: 14,
                  }}
                >
                  🟡 Neue Anbieter warten auf Prüfung
                </div>

                <h2
                  style={{
                    marginTop: 8,
                    fontSize: 24,
                  }}
                >
                  {pendingProviderCount}{" "}
                  {pendingProviderCount === 1
                    ? "Anbieter ist"
                    : "Anbieter sind"}{" "}
                  noch nicht freigegeben.
                </h2>
              </div>

              <Link
                href="/admin/providers"
                className="btn btn-primary"
              >
                Jetzt prüfen
              </Link>
            </div>
          ) : null}

          <div
            className="admin-stats"
            style={{
              marginTop: 32,
            }}
          >
            <div className="admin-stat-card">
              <strong>{providerCount}</strong>
              <span>Anbieter insgesamt</span>
              <small
                style={{
                  marginTop: 8,
                  opacity: 0.52,
                }}
              >
                {approvedProviderCount} genehmigt
              </small>
            </div>

            <div className="admin-stat-card">
              <strong>{pendingProviderCount}</strong>
              <span>Offene Freigaben</span>
              <small
                style={{
                  marginTop: 8,
                  opacity: 0.52,
                }}
              >
                {blockedProviderCount} gesperrt
              </small>
            </div>

            <div className="admin-stat-card">
              <strong>{leadCount}</strong>
              <span>Leads insgesamt</span>
              <small
                style={{
                  marginTop: 8,
                  opacity: 0.52,
                }}
              >
                {leadPurchaseCount} Verkäufe
              </small>
            </div>

            <div className="admin-stat-card">
              <strong>{leadPurchasesLast24Hours}</strong>
              <span>Lead-Käufe in 24 h</span>
              <small
                style={{
                  marginTop: 8,
                  opacity: 0.52,
                }}
              >
                {totalLeadCreditsSpent} Credits insgesamt
              </small>
            </div>

            <div className="admin-stat-card">
              <strong>{totalCreditsSold}</strong>
              <span>Credits verkauft</span>
              <small
                style={{
                  marginTop: 8,
                  opacity: 0.52,
                }}
              >
                {totalStripePayments} Zahlungen
              </small>
            </div>

            <div className="admin-stat-card">
              <strong>
                {formatMoney(totalStripeRevenue)}
              </strong>
              <span>Stripe-Umsatz</span>
              <small
                style={{
                  marginTop: 8,
                  opacity: 0.52,
                }}
              >
                {creditPurchasesLast24Hours} Käufe in 24 h
              </small>
            </div>
          </div>

          <div
            className="admin-grid"
            style={{
              marginTop: 34,
            }}
          >
            <section className="admin-card">
              <div className="admin-card-head">
                <div>
                  <span>Neue Registrierungen</span>
                  <h2>Anbieter</h2>
                </div>

                <Link
                  href="/admin/providers"
                  className="btn btn-secondary"
                >
                  Alle Anbieter
                </Link>
              </div>

              <div className="admin-list">
                {latestProviders.length === 0 ? (
                  <p className="admin-empty">
                    Noch keine Anbieter vorhanden.
                  </p>
                ) : (
                  latestProviders.map((provider) => (
                    <article
                      key={provider.id}
                      className="admin-list-item"
                    >
                      <div
                        style={{
                          minWidth: 0,
                        }}
                      >
                        <h3>{provider.companyName}</h3>

                        <p>{provider.contactName}</p>

                        <small
                          style={{
                            display: "block",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {provider.email}
                        </small>

                        <small
                          style={{
                            display: "block",
                            marginTop: 5,
                            opacity: 0.42,
                          }}
                        >
                          {provider.region || "Keine Region"} ·{" "}
                          {formatDate(provider.createdAt)}
                        </small>
                      </div>

                      <div
                        style={{
                          display: "grid",
                          justifyItems: "end",
                          gap: 8,
                        }}
                      >
                        <span
                          style={{
                            ...getProviderStatusStyle(
                              provider.status
                            ),
                            display: "inline-flex",
                            padding: "7px 11px",
                            borderRadius: 999,
                            fontSize: 12,
                            fontWeight: 900,
                            whiteSpace: "nowrap",
                          }}
                        >
                          {getProviderStatusLabel(
                            provider.status
                          )}
                        </span>

                        <span className="admin-pill">
                          {provider.credits} Credits
                        </span>
                      </div>
                    </article>
                  ))
                )}
              </div>
            </section>

            <section className="admin-card">
              <div className="admin-card-head">
                <div>
                  <span>Neueste Anfragen</span>
                  <h2>Leads</h2>
                </div>

                <Link
                  href="/admin/leads"
                  className="btn btn-secondary"
                >
                  Alle Leads
                </Link>
              </div>

              <div className="admin-list">
                {latestLeads.length === 0 ? (
                  <p className="admin-empty">
                    Noch keine Leads vorhanden.
                  </p>
                ) : (
                  latestLeads.map((lead) => (
                    <article
                      key={lead.id}
                      className="admin-list-item"
                    >
                      <div
                        style={{
                          minWidth: 0,
                        }}
                      >
                        <h3>{lead.title}</h3>

                        <p>
                          {lead.region} · {lead.category}
                        </p>

                        <small>
                          {formatDate(lead.createdAt)}
                        </small>
                      </div>

                      <div
                        style={{
                          display: "grid",
                          justifyItems: "end",
                          gap: 8,
                        }}
                      >
                        <span className="admin-pill">
                          {lead.price} Credits
                        </span>

                        <span
                          style={{
                            fontSize: 12,
                            opacity: 0.55,
                            whiteSpace: "nowrap",
                          }}
                        >
                          {lead._count.purchases} Verkäufe
                        </span>
                      </div>
                    </article>
                  ))
                )}
              </div>
            </section>

            <section className="admin-card admin-card-wide">
              <div className="admin-card-head">
                <div>
                  <span>Letzte Verkäufe</span>
                  <h2>Lead-Käufe</h2>
                </div>

                <div className="admin-pill">
                  {leadPurchaseCount} insgesamt
                </div>
              </div>

              <div className="admin-list">
                {latestLeadPurchases.length === 0 ? (
                  <p className="admin-empty">
                    Noch keine Lead-Käufe vorhanden.
                  </p>
                ) : (
                  latestLeadPurchases.map((purchase) => (
                    <article
                      key={purchase.id}
                      className="admin-list-item"
                    >
                      <div
                        style={{
                          minWidth: 0,
                        }}
                      >
                        <h3>{purchase.lead.title}</h3>

                        <p>
                          Käufer:{" "}
                          {purchase.provider.companyName}
                        </p>

                        <small>
                          {purchase.lead.region} ·{" "}
                          {purchase.lead.category} ·{" "}
                          {formatDate(purchase.createdAt)}
                        </small>
                      </div>

                      <div
                        style={{
                          display: "grid",
                          justifyItems: "end",
                          gap: 8,
                        }}
                      >
                        <span className="admin-pill">
                          {purchase.price} Credits
                        </span>

                        <Link
                          href={`/portal/leads/${purchase.lead.id}`}
                          style={{
                            fontSize: 13,
                            fontWeight: 800,
                            color: "#7dd3fc",
                          }}
                        >
                          Lead öffnen
                        </Link>
                      </div>
                    </article>
                  ))
                )}
              </div>
            </section>

            <section className="admin-card admin-card-wide">
              <div className="admin-card-head">
                <div>
                  <span>Letzte Zahlungen</span>
                  <h2>Stripe-Creditkäufe</h2>
                </div>

                <div className="admin-pill">
                  {formatMoney(totalStripeRevenue)}
                </div>
              </div>

              <div className="admin-list">
                {latestCreditPurchases.length === 0 ? (
                  <p className="admin-empty">
                    Noch keine Stripe-Zahlungen vorhanden.
                  </p>
                ) : (
                  latestCreditPurchases.map((purchase) => (
                    <article
                      key={purchase.id}
                      className="admin-list-item"
                    >
                      <div
                        style={{
                          minWidth: 0,
                        }}
                      >
                        <h3>
                          {purchase.provider.companyName}
                        </h3>

                        <p>
                          {purchase.credits} Credits ·{" "}
                          {purchase.packageId ||
                            "Credit-Paket"}
                        </p>

                        <small>
                          {purchase.provider.email} ·{" "}
                          {formatDate(purchase.createdAt)}
                        </small>
                      </div>

                      <div
                        style={{
                          display: "grid",
                          justifyItems: "end",
                          gap: 8,
                        }}
                      >
                        <span
                          style={{
                            display: "inline-flex",
                            padding: "7px 11px",
                            borderRadius: 999,
                            border:
                              "1px solid rgba(34,197,94,0.25)",
                            background:
                              "rgba(34,197,94,0.12)",
                            color: "#bbf7d0",
                            fontSize: 12,
                            fontWeight: 900,
                          }}
                        >
                          ✓ Bezahlt
                        </span>

                        <strong>
                          {formatMoney(
                            purchase.amount,
                            purchase.currency
                          )}
                        </strong>
                      </div>
                    </article>
                  ))
                )}
              </div>
            </section>
          </div>

          <div
            style={{
              marginTop: 34,
              display: "grid",
              gap: 16,
              gridTemplateColumns:
                "repeat(auto-fit, minmax(230px, 1fr))",
            }}
          >
            <Link
              href="/admin/providers"
              style={{
                padding: 24,
                borderRadius: 24,
                border:
                  "1px solid rgba(255,255,255,0.10)",
                background:
                  "rgba(255,255,255,0.04)",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              <strong
                style={{
                  display: "block",
                  fontSize: 19,
                }}
              >
                👥 Anbieter prüfen
              </strong>

              <span
                style={{
                  display: "block",
                  marginTop: 8,
                  opacity: 0.58,
                }}
              >
                Registrierungen genehmigen, sperren und
                Credits verwalten.
              </span>
            </Link>

            <Link
              href="/admin/leads"
              style={{
                padding: 24,
                borderRadius: 24,
                border:
                  "1px solid rgba(255,255,255,0.10)",
                background:
                  "rgba(255,255,255,0.04)",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              <strong
                style={{
                  display: "block",
                  fontSize: 19,
                }}
              >
                📋 Leads verwalten
              </strong>

              <span
                style={{
                  display: "block",
                  marginTop: 8,
                  opacity: 0.58,
                }}
              >
                Neue Kundenanfragen erstellen und vorhandene
                Leads bearbeiten.
              </span>
            </Link>

            <Link
              href="/portal/transaktionen"
              style={{
                padding: 24,
                borderRadius: 24,
                border:
                  "1px solid rgba(255,255,255,0.10)",
                background:
                  "rgba(255,255,255,0.04)",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              <strong
                style={{
                  display: "block",
                  fontSize: 19,
                }}
              >
                💳 Transaktionen
              </strong>

              <span
                style={{
                  display: "block",
                  marginTop: 8,
                  opacity: 0.58,
                }}
              >
                Lead-Käufe und Creditbewegungen
                kontrollieren.
              </span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}