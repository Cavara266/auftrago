import Link from "next/link";
import { redirect } from "next/navigation";

import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import "./portal-dashboard.css";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const quickActions = [
  {
    title: "Fixaufträge",
    text: "Bestätigte Aufträge direkt übernehmen",
    href: "/portal/fixed-orders",
    cta: "Ansehen",
  },
  {
    title: "Neue Leads",
    text: "Passende Kundenanfragen entdecken",
    href: "/portal/leads",
    cta: "Ansehen",
  },
  {
    title: "Meine Käufe",
    text: "Gekaufte Leads und Aufträge verwalten",
    href: "/portal/meine-leads",
    cta: "Öffnen",
  },
  {
    title: "Rechnungen",
    text: "Rechnungen für Fixaufträge herunterladen",
    href: "/portal/rechnungen",
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
      message:
        "Dein Guthaben reicht voraussichtlich nur noch für einen günstigen Lead.",
      tone: "danger",
    };
  }

  if (credits <= 35) {
    return {
      label: "Guthaben wird knapp",
      message:
        "Lade rechtzeitig Credits auf, damit du keine passende Anfrage verpasst.",
      tone: "warning",
    };
  }

  return {
    label: "Bereit für neue Aufträge",
    message:
      "Dein Guthaben ist bereit für passende Kundenanfragen.",
    tone: "success",
  };
}

function getLeadFit(
  leadRegion: string | null,
  providerRegion: string | null
) {
  if (
    providerRegion &&
    leadRegion &&
    leadRegion
      .toLowerCase()
      .includes(providerRegion.toLowerCase())
  ) {
    return "Sehr passend";
  }

  return "Neue Chance";
}

function formatMoney(cents: number) {
  return new Intl.NumberFormat("de-CH", {
    style: "currency",
    currency: "CHF",
    minimumFractionDigits: 2,
  }).format(cents / 100);
}

function formatDate(
  date: Date | null,
  flexibleDate: boolean
) {
  if (flexibleDate) {
    return "Termin flexibel";
  }

  if (!date) {
    return "Termin offen";
  }

  return new Intl.DateTimeFormat("de-CH", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function getAgeLabel(date: Date) {
  const difference =
    Date.now() - new Date(date).getTime();

  const minutes = Math.max(
    0,
    Math.floor(difference / 60000)
  );

  if (minutes < 2) {
    return "Gerade veröffentlicht";
  }

  if (minutes < 60) {
    return `Vor ${minutes} Minuten`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `Vor ${hours} ${
      hours === 1 ? "Stunde" : "Stunden"
    }`;
  }

  const days = Math.floor(hours / 24);

  return `Vor ${days} ${days === 1 ? "Tag" : "Tagen"}`;
}

export default async function PortalDashboardPage() {
  const user = await requireUser();

  if (!user) {
    redirect("/login");
  }

  const provider = await prisma.provider.findUnique({
    where: {
      id: user.id,
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

  if (provider.status !== "APPROVED") {
    redirect("/dashboard");
  }

  const purchasedLeadIds = provider.purchases.map(
    (purchase) => purchase.lead.id
  );

  const [
    latestLeads,
    totalLeads,
    availableFixedOrders,
    availableFixedOrderCount,
    purchasedFixedOrders,
  ] = await Promise.all([
    prisma.lead.findMany({
      where:
        purchasedLeadIds.length > 0
          ? {
              id: {
                notIn: purchasedLeadIds,
              },
            }
          : undefined,
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
    }),

    prisma.lead.count(),

    prisma.fixedOrder.findMany({
      where: {
        status: "OPEN",
        buyerId: null,
      },
      take: 3,
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        title: true,
        category: true,
        region: true,
        postalCode: true,
        city: true,
        executionDate: true,
        flexibleDate: true,
        orderValueCents: true,
        commissionAmountCents: true,
        createdAt: true,
      },
    }),

    prisma.fixedOrder.count({
      where: {
        status: "OPEN",
        buyerId: null,
      },
    }),

    prisma.fixedOrder.findMany({
      where: {
        buyerId: provider.id,
        status: {
          in: ["SOLD", "COMPLETED"],
        },
      },
      orderBy: {
        soldAt: "desc",
      },
      take: 4,
      select: {
        id: true,
        title: true,
        category: true,
        city: true,
        status: true,
        orderValueCents: true,
        commissionAmountCents: true,
        soldAt: true,
      },
    }),
  ]);

  const creditStatus = getCreditStatus(
    provider.credits
  );

  const purchasedCount =
    provider.purchases.length;

  const estimatedLeadCapacity =
    latestLeads.length > 0
      ? Math.max(
          0,
          Math.floor(
            provider.credits /
              Math.max(
                1,
                Math.round(
                  latestLeads.reduce(
                    (sum, lead) =>
                      sum + lead.price,
                    0
                  ) / latestLeads.length
                )
              )
          )
        )
      : 0;

  const availableFixedOrderVolume =
    availableFixedOrders.reduce(
      (total, order) =>
        total + order.orderValueCents,
      0
    );

  const purchasedFixedOrderVolume =
    purchasedFixedOrders.reduce(
      (total, order) =>
        total + order.orderValueCents,
      0
    );

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
              Entdecke neue Kundenanfragen,
              übernimm bestätigte Fixaufträge und
              verwalte deine Käufe zentral an einem
              Ort.
            </p>

            <div className="provider-hero__actions">
              <Link
                href="/portal/fixed-orders"
                className="provider-button provider-button--primary"
              >
                Fixaufträge ansehen
                <span aria-hidden="true">→</span>
              </Link>

              <Link
                href="/portal/leads"
                className="provider-button provider-button--secondary"
              >
                Leads entdecken
              </Link>
            </div>
          </div>

          <div className="provider-hero__spotlight">
            <span className="provider-hero__spotlight-label">
              Bestätigte Aufträge verfügbar
            </span>

            <strong>
              {availableFixedOrderCount}
            </strong>

            <p>
              Fixaufträge können ohne erneute
              Offertenerstellung übernommen werden.
            </p>

            <Link href="/portal/fixed-orders">
              Jetzt Fixaufträge ansehen
              <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </section>

        <section
          className="provider-kpis"
          aria-label="Portal Kennzahlen"
        >
          <article className="provider-kpi">
            <div className="provider-kpi__top">
              <span>Fixaufträge</span>

              <span className="provider-kpi__trend">
                Live
              </span>
            </div>

            <strong>
              {availableFixedOrderCount}
            </strong>

            <p>
              Bestätigte Aufträge sind aktuell
              verfügbar.
            </p>
          </article>

          <article className="provider-kpi">
            <div className="provider-kpi__top">
              <span>Verfügbare Credits</span>

              <span
                className={`provider-status provider-status--${creditStatus.tone}`}
              >
                {creditStatus.label}
              </span>
            </div>

            <strong>{provider.credits}</strong>

            <p>
              Reicht aktuell für ungefähr{" "}
              {estimatedLeadCapacity} Leads.
            </p>
          </article>

          <article className="provider-kpi">
            <div className="provider-kpi__top">
              <span>Meine Fixaufträge</span>

              <span className="provider-kpi__trend">
                Gesamt
              </span>
            </div>

            <strong>
              {purchasedFixedOrders.length}
            </strong>

            <p>
              Auftragsvolumen{" "}
              {formatMoney(
                purchasedFixedOrderVolume
              )}
              .
            </p>
          </article>

          <article className="provider-kpi">
            <div className="provider-kpi__top">
              <span>Freigeschaltete Leads</span>

              <span className="provider-kpi__trend">
                Gesamt
              </span>
            </div>

            <strong>{purchasedCount}</strong>

            <p>
              Leads wurden von deinem Unternehmen
              gekauft.
            </p>
          </article>

          <article className="provider-kpi">
            <div className="provider-kpi__top">
              <span>Aktive Leads</span>

              <span className="provider-kpi__trend">
                Live
              </span>
            </div>

            <strong>{totalLeads}</strong>

            <p>
              Aktuelle Kundenanfragen auf der
              Plattform.
            </p>
          </article>

          <article className="provider-kpi">
            <div className="provider-kpi__top">
              <span>Deine Region</span>

              <span className="provider-kpi__trend">
                Profil
              </span>
            </div>

            <strong className="provider-kpi__region">
              {provider.region || "Schweiz"}
            </strong>

            <p>
              Hier werden bevorzugt passende Chancen
              angezeigt.
            </p>
          </article>
        </section>

        <section
          style={{
            marginBottom: "28px",
            border:
              "1px solid rgba(251, 191, 36, 0.2)",
            borderRadius: "24px",
            background:
              "linear-gradient(135deg, rgba(251, 191, 36, 0.08), rgba(13, 19, 32, 0.96))",
            padding: "24px",
          }}
        >
          <div className="provider-section-heading">
            <div>
              <span>Premium Fixaufträge</span>

              <h2>
                Bestätigte Aufträge direkt übernehmen
              </h2>

              <p>
                Kunde, Leistung und Auftragswert sind
                bereits bestätigt. Nach der Zahlung
                werden die Kontaktdaten sofort
                freigeschaltet.
              </p>
            </div>

            <Link
              href="/portal/fixed-orders"
              className="provider-text-link"
            >
              Alle Fixaufträge
              <span aria-hidden="true">→</span>
            </Link>
          </div>

          {availableFixedOrders.length > 0 ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(260px, 1fr))",
                gap: "16px",
                marginTop: "22px",
              }}
            >
              {availableFixedOrders.map(
                (order) => (
                  <article
                    key={order.id}
                    style={{
                      border:
                        "1px solid rgba(255, 255, 255, 0.1)",
                      borderRadius: "20px",
                      background:
                        "rgba(7, 11, 20, 0.72)",
                      padding: "20px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent:
                          "space-between",
                        gap: "12px",
                        alignItems: "flex-start",
                      }}
                    >
                      <div>
                        <span
                          style={{
                            display:
                              "inline-flex",
                            borderRadius:
                              "999px",
                            background:
                              "rgba(251, 191, 36, 0.12)",
                            color: "#fcd34d",
                            padding:
                              "6px 10px",
                            fontSize: "11px",
                            fontWeight: 800,
                            textTransform:
                              "uppercase",
                            letterSpacing:
                              "0.08em",
                          }}
                        >
                          Bestätigter Auftrag
                        </span>

                        <p
                          style={{
                            marginTop: "14px",
                            color: "#94a3b8",
                            fontSize: "12px",
                            fontWeight: 700,
                            textTransform:
                              "uppercase",
                          }}
                        >
                          {order.category}
                        </p>

                        <h3
                          style={{
                            marginTop: "4px",
                            fontSize: "19px",
                            lineHeight: 1.3,
                          }}
                        >
                          {order.title}
                        </h3>
                      </div>

                      <span
                        style={{
                          fontSize: "24px",
                        }}
                      >
                        🔥
                      </span>
                    </div>

                    <p
                      style={{
                        marginTop: "14px",
                        color: "#cbd5e1",
                        fontSize: "14px",
                      }}
                    >
                      📍 {order.postalCode}{" "}
                      {order.city}
                    </p>

                    <p
                      style={{
                        marginTop: "7px",
                        color: "#94a3b8",
                        fontSize: "13px",
                      }}
                    >
                      📅{" "}
                      {formatDate(
                        order.executionDate,
                        order.flexibleDate
                      )}
                    </p>

                    <p
                      style={{
                        marginTop: "7px",
                        color: "#fcd34d",
                        fontSize: "12px",
                        fontWeight: 700,
                      }}
                    >
                      {getAgeLabel(
                        order.createdAt
                      )}
                    </p>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "1fr 1fr",
                        gap: "10px",
                        marginTop: "18px",
                      }}
                    >
                      <div
                        style={{
                          borderRadius: "14px",
                          background:
                            "rgba(255,255,255,0.04)",
                          padding: "13px",
                        }}
                      >
                        <small
                          style={{
                            display: "block",
                            color: "#64748b",
                          }}
                        >
                          Auftragswert
                        </small>

                        <strong
                          style={{
                            display: "block",
                            marginTop: "5px",
                          }}
                        >
                          {formatMoney(
                            order.orderValueCents
                          )}
                        </strong>
                      </div>

                      <div
                        style={{
                          borderRadius: "14px",
                          background:
                            "rgba(251,191,36,0.08)",
                          padding: "13px",
                        }}
                      >
                        <small
                          style={{
                            display: "block",
                            color: "#fcd34d",
                          }}
                        >
                          Übernahmepreis
                        </small>

                        <strong
                          style={{
                            display: "block",
                            marginTop: "5px",
                            color: "#fcd34d",
                          }}
                        >
                          {formatMoney(
                            order.commissionAmountCents
                          )}
                        </strong>
                      </div>
                    </div>

                    <Link
                      href={`/portal/fixed-orders/${order.id}`}
                      className="provider-button provider-button--primary provider-button--full"
                      style={{
                        marginTop: "18px",
                      }}
                    >
                      Auftrag prüfen
                      <span aria-hidden="true">
                        →
                      </span>
                    </Link>
                  </article>
                )
              )}
            </div>
          ) : (
            <div
              className="provider-empty"
              style={{
                marginTop: "22px",
              }}
            >
              <span>✓</span>

              <h3>
                Momentan keine Fixaufträge verfügbar
              </h3>

              <p>
                Sobald ein bestätigter Auftrag
                veröffentlicht wird, erscheint er hier.
              </p>
            </div>
          )}

          {availableFixedOrders.length > 0 ? (
            <div
              style={{
                marginTop: "18px",
                color: "#94a3b8",
                fontSize: "13px",
              }}
            >
              Verfügbares Auftragsvolumen:{" "}
              <strong
                style={{
                  color: "#ffffff",
                }}
              >
                {formatMoney(
                  availableFixedOrderVolume
                )}
              </strong>
            </div>
          ) : null}
        </section>

        <div className="provider-dashboard__grid">
          <section className="provider-leads">
            <div className="provider-section-heading">
              <div>
                <span>Neue Chancen</span>

                <h2>
                  Aktuelle Kundenanfragen
                </h2>

                <p>
                  Neue Leads werden laufend ergänzt.
                  Frühes Reagieren erhöht deine Chance
                  auf den Auftrag.
                </p>
              </div>

              <Link
                href="/portal/leads"
                className="provider-text-link"
              >
                Alle Leads ansehen
                <span aria-hidden="true">→</span>
              </Link>
            </div>

            <div className="provider-leads__list">
              {latestLeads.length > 0 ? (
                latestLeads.map(
                  (lead, index) => {
                    const fit = getLeadFit(
                      lead.region,
                      provider.region
                    );

                    return (
                      <article
                        className="provider-lead-card"
                        key={lead.id}
                      >
                        <div className="provider-lead-card__number">
                          {String(
                            index + 1
                          ).padStart(2, "0")}
                        </div>

                        <div className="provider-lead-card__content">
                          <div className="provider-lead-card__badges">
                            <span className="provider-lead-card__new">
                              Neu
                            </span>

                            <span>{fit}</span>

                            <span>
                              {lead.region ||
                                "Schweiz"}
                            </span>
                          </div>

                          <h3>
                            {lead.title ||
                              lead.category}
                          </h3>

                          <div className="provider-lead-card__meta">
                            <span>
                              <small>
                                Leistung
                              </small>

                              {lead.category}
                            </span>

                            <span>
                              <small>Region</small>

                              {lead.region ||
                                "Schweiz"}
                            </span>

                            <span>
                              <small>Kontakt</small>

                              Nach Kauf sichtbar
                            </span>
                          </div>
                        </div>

                        <div className="provider-lead-card__purchase">
                          <span>Leadpreis</span>

                          <strong>
                            {lead.price}
                          </strong>

                          <small>Credits</small>

                          <Link
                            href="/portal/leads"
                            className="provider-button provider-button--compact"
                          >
                            Freischalten
                          </Link>
                        </div>
                      </article>
                    );
                  }
                )
              ) : (
                <div className="provider-empty">
                  <span>✓</span>

                  <h3>
                    Du bist auf dem neusten Stand
                  </h3>

                  <p>
                    Aktuell sind keine neuen Leads
                    vorhanden.
                  </p>
                </div>
              )}
            </div>
          </section>

          <aside className="provider-sidebar">
            <section
              className={`provider-credit provider-credit--${creditStatus.tone}`}
            >
              <div className="provider-credit__head">
                <span>Dein Guthaben</span>

                <span className="provider-credit__icon">
                  C
                </span>
              </div>

              <strong>
                {provider.credits}
              </strong>

              <small>Credits verfügbar</small>

              <p>{creditStatus.message}</p>

              <div className="provider-credit__bar">
                <span
                  style={{
                    width: `${Math.min(
                      100,
                      Math.max(
                        8,
                        provider.credits
                      )
                    )}%`,
                  }}
                />
              </div>

              <Link
                href="/portal/guthaben"
                className="provider-button provider-button--primary provider-button--full"
              >
                Credits kaufen
                <span aria-hidden="true">
                  →
                </span>
              </Link>
            </section>

            <section className="provider-side-card">
              <div className="provider-side-card__heading">
                <span>Schnellzugriff</span>

                <h2>Wichtige Aktionen</h2>
              </div>

              <div className="provider-actions">
                {quickActions.map((item) => (
                  <Link
                    href={item.href}
                    key={item.title}
                  >
                    <div>
                      <strong>
                        {item.title}
                      </strong>

                      <span>{item.text}</span>
                    </div>

                    <small>
                      {item.cta} →
                    </small>
                  </Link>
                ))}
              </div>
            </section>

            <section className="provider-side-card">
              <div className="provider-side-card__heading">
                <span>Meine Fixaufträge</span>

                <h2>
                  Zuletzt übernommen
                </h2>
              </div>

              <div className="provider-purchases">
                {purchasedFixedOrders.length >
                0 ? (
                  purchasedFixedOrders.map(
                    (order) => (
                      <div key={order.id}>
                        <span className="provider-purchases__dot" />

                        <div>
                          <strong>
                            {order.title}
                          </strong>

                          <small>
                            {order.city} ·{" "}
                            {formatMoney(
                              order.orderValueCents
                            )}
                          </small>
                        </div>
                      </div>
                    )
                  )
                ) : (
                  <div className="provider-purchases__empty">
                    Noch keinen Fixauftrag
                    übernommen.
                  </div>
                )}
              </div>

              <Link
                href="/portal/rechnungen"
                className="provider-text-link provider-text-link--full"
              >
                Käufe und Rechnungen
                <span aria-hidden="true">
                  →
                </span>
              </Link>
            </section>

            <section className="provider-side-card">
              <div className="provider-side-card__heading">
                <span>Letzte Aktivität</span>

                <h2>
                  Freigeschaltete Leads
                </h2>
              </div>

              <div className="provider-purchases">
                {provider.purchases.length >
                0 ? (
                  provider.purchases
                    .slice(0, 4)
                    .map((purchase) => (
                      <div
                        key={purchase.id}
                      >
                        <span className="provider-purchases__dot" />

                        <div>
                          <strong>
                            {
                              purchase.lead
                                .title
                            }
                          </strong>

                          <small>
                            {purchase.lead
                              .region ||
                              "Schweiz"}
                          </small>
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
                <span aria-hidden="true">
                  →
                </span>
              </Link>
            </section>
          </aside>
        </div>

        <section className="provider-value">
          <div>
            <span>
              Bestätigte Aufträge statt
              unverbindlicher Anfragen
            </span>

            <h2>
              Mit Fixaufträgen kannst du direkt
              Umsatz sichern.
            </h2>

            <p>
              Der Kunde, die Leistung und der
              Auftragswert wurden bereits bestätigt.
              Nach erfolgreicher Zahlung erhältst du
              sofort die vollständigen Kontaktdaten.
            </p>
          </div>

          <Link
            href="/portal/fixed-orders"
            className="provider-button provider-button--light"
          >
            Fixaufträge ansehen
            <span aria-hidden="true">→</span>
          </Link>
        </section>
      </div>
    </main>
  );
}