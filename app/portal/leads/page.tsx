import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { buyLeadAction } from "./actions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

type PageProps = {
  searchParams?: Promise<{
    error?: string;
    message?: string;
    region?: string;
    category?: string;
  }>;
};

const regions = [
  "Aargau",
  "Zürich",
  "Bern",
  "Luzern",
  "Basel",
  "Solothurn",
  "Zug",
  "St. Gallen",
];

const categories = [
  "Hauswartung",
  "Reinigung",
  "Umzugsreinigung",
  "Grundreinigung",
  "Unterhaltsreinigung",
  "Fensterreinigung",
  "Gartenpflege",
  "Maler",
  "Gipser",
  "Sanitär",
  "Elektriker",
  "Umzug",
  "Transport",
  "Entsorgung",
];

function getErrorMessage(error?: string) {
  switch (error) {
    case "invalid-lead":
      return "Der Lead konnte nicht verarbeitet werden.";

    case "lead-not-found":
      return "Der ausgewählte Lead wurde nicht gefunden.";

    case "not-enough-credits":
      return "Nicht genügend Credits vorhanden. Bitte lade dein Guthaben auf.";

    default:
      return "";
  }
}

function getInfoMessage(message?: string) {
  switch (message) {
    case "purchased":
      return "Lead erfolgreich gekauft.";

    case "already-bought":
      return "Dieser Lead wurde bereits gekauft.";

    default:
      return "";
  }
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("de-CH", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "Europe/Zurich",
  }).format(date);
}

function formatExecutionDate(
  date: Date | null,
  flexibleDate: boolean
) {
  if (flexibleDate && date) {
    return `Flexibel ab ${formatDate(date)}`;
  }

  if (flexibleDate) {
    return "Datum flexibel";
  }

  if (!date) {
    return "Nach Vereinbarung";
  }

  return formatDate(date);
}

function formatCurrency(
  amountInCents: number,
  currency = "CHF"
) {
  return new Intl.NumberFormat("de-CH", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amountInCents / 100);
}

function getShortTitle(title: string) {
  return title
    .replace("Umzugsreinigung - ", "")
    .replace("Grundreinigung - ", "")
    .replace("Fensterreinigung - ", "")
    .replace("Unterhaltsreinigung - ", "");
}

function isMatchingProvider(
  itemRegion: string | null,
  itemCategory: string,
  providerRegion: string | null,
  providerCategory: string | null
) {
  return (
    Boolean(itemRegion && providerRegion && itemRegion === providerRegion) ||
    Boolean(
      itemCategory &&
        providerCategory &&
        itemCategory === providerCategory
    )
  );
}

export default async function PortalLeadsPage({
  searchParams,
}: PageProps) {
  const params = searchParams
    ? await searchParams
    : undefined;

  const selectedRegion = params?.region || "";
  const selectedCategory = params?.category || "";

  const cookieStore = await cookies();
  const providerId =
    cookieStore.get("auftrago_session")?.value;

  if (!providerId) {
    redirect("/login");
  }

  const provider = await prisma.provider.findUnique({
    where: {
      id: providerId,
    },
    include: {
      purchases: {
        select: {
          leadId: true,
        },
      },
    },
  });

  if (!provider) {
    redirect("/login");
  }

  const [leads, fixedOrders] = await Promise.all([
    prisma.lead.findMany({
      where: {
        ...(selectedRegion
          ? {
              region: selectedRegion,
            }
          : {}),
        ...(selectedCategory
          ? {
              category: selectedCategory,
            }
          : {}),
      },
      orderBy: {
        createdAt: "desc",
      },
    }),

    prisma.fixedOrder.findMany({
      where: {
        status: "OPEN",
        buyerId: null,

        ...(selectedRegion
          ? {
              region: selectedRegion,
            }
          : {}),

        ...(selectedCategory
          ? {
              category: selectedCategory,
            }
          : {}),
      },

      select: {
        id: true,
        title: true,
        description: true,
        category: true,
        region: true,
        postalCode: true,
        city: true,
        executionDate: true,
        flexibleDate: true,
        orderValueCents: true,
        commissionPercent: true,
        commissionAmountCents: true,
        createdAt: true,
      },

      orderBy: [
        {
          createdAt: "desc",
        },
      ],
    }),
  ]);

  const purchasedLeadIds = new Set(
    provider.purchases.map(
      (purchase) => purchase.leadId
    )
  );

  const sortedLeads = [...leads].sort((a, b) => {
    const aMatch = isMatchingProvider(
      a.region,
      a.category,
      provider.region,
      provider.category
    );

    const bMatch = isMatchingProvider(
      b.region,
      b.category,
      provider.region,
      provider.category
    );

    if (aMatch === bMatch) {
      return (
        b.createdAt.getTime() -
        a.createdAt.getTime()
      );
    }

    return aMatch ? -1 : 1;
  });

  const sortedFixedOrders = [...fixedOrders].sort(
    (a, b) => {
      const aMatch = isMatchingProvider(
        a.region,
        a.category,
        provider.region,
        provider.category
      );

      const bMatch = isMatchingProvider(
        b.region,
        b.category,
        provider.region,
        provider.category
      );

      if (aMatch === bMatch) {
        return (
          b.createdAt.getTime() -
          a.createdAt.getTime()
        );
      }

      return aMatch ? -1 : 1;
    }
  );

  const matchingFixedOrderCount =
    sortedFixedOrders.filter((order) =>
      isMatchingProvider(
        order.region,
        order.category,
        provider.region,
        provider.category
      )
    ).length;

  const matchingLeadCount = sortedLeads.filter(
    (lead) =>
      isMatchingProvider(
        lead.region,
        lead.category,
        provider.region,
        provider.category
      )
  ).length;

  const errorMessage = getErrorMessage(
    params?.error
  );

  const infoMessage = getInfoMessage(
    params?.message
  );

  return (
    <main className="page">
      <section className="leadx-hero">
        <div className="container leadx-hero-shell">
          <div className="leadx-hero-content">
            <span className="eyebrow">
              Kundenchancen Marketplace
            </span>

            <h1>Neue Aufträge sichern.</h1>

            <p>
              Übernimm bestätigte Fixaufträge oder
              schalte passende Kundenanfragen mit
              Credits frei.
            </p>
          </div>

          <div className="leadx-hero-actions">
            <Link
              href="/portal"
              className="btn btn-secondary"
            >
              Dashboard
            </Link>

            <Link
              href="/portal/fixed-orders"
              className="btn btn-secondary"
            >
              Fixaufträge
            </Link>

            <Link
              href="/portal/guthaben"
              className="btn btn-primary"
            >
              Credits kaufen
            </Link>
          </div>
        </div>
      </section>

      <section className="leadx-section">
        <div className="container">
          {errorMessage ? (
            <div className="leadx-error">
              {errorMessage}
            </div>
          ) : null}

          {infoMessage ? (
            <div className="leadx-success">
              {infoMessage}
            </div>
          ) : null}

          <div className="leadx-stats">
            <div>
              <strong>
                {sortedFixedOrders.length}
              </strong>

              <span>Fixaufträge verfügbar</span>
            </div>

            <div>
              <strong>{sortedLeads.length}</strong>
              <span>Leads verfügbar</span>
            </div>

            <div>
              <strong>
                {matchingFixedOrderCount +
                  matchingLeadCount}
              </strong>

              <span>Passende Chancen</span>
            </div>

            <div>
              <strong>{provider.credits}</strong>
              <span>Credits verfügbar</span>
            </div>
          </div>

          <div className="leadx-layout">
            <div className="leadx-main">
              <form
                className="leadx-filter"
                action="/portal/leads"
              >
                <div>
                  <label htmlFor="region">
                    Region
                  </label>

                  <select
                    id="region"
                    name="region"
                    defaultValue={selectedRegion}
                  >
                    <option value="">
                      Alle Regionen
                    </option>

                    {regions.map((region) => (
                      <option
                        key={region}
                        value={region}
                      >
                        {region}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="category">
                    Kategorie
                  </label>

                  <select
                    id="category"
                    name="category"
                    defaultValue={selectedCategory}
                  >
                    <option value="">
                      Alle Kategorien
                    </option>

                    {categories.map((category) => (
                      <option
                        key={category}
                        value={category}
                      >
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  Chancen filtern
                </button>

                <Link
                  href="/portal/leads"
                  className="btn btn-secondary"
                >
                  Zurücksetzen
                </Link>
              </form>

              <section
                style={{
                  position: "relative",
                  overflow: "hidden",
                  marginBottom: 34,
                  padding: 26,
                  borderRadius: 30,
                  border:
                    "1px solid rgba(251,191,36,0.25)",
                  background:
                    "radial-gradient(circle at 100% 0%, rgba(245,158,11,0.16), transparent 38%), linear-gradient(145deg, rgba(15,28,48,0.98), rgba(19,25,45,0.98))",
                  boxShadow:
                    "0 24px 70px rgba(0,0,0,0.24)",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 4,
                    background:
                      "linear-gradient(90deg, #f59e0b, #fb7185, #8b5cf6)",
                  }}
                />

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: 20,
                    flexWrap: "wrap",
                  }}
                >
                  <div>
                    <span
                      style={{
                        display: "inline-flex",
                        padding: "7px 12px",
                        borderRadius: 999,
                        border:
                          "1px solid rgba(251,191,36,0.25)",
                        background:
                          "rgba(245,158,11,0.10)",
                        color: "#fcd34d",
                        fontSize: 12,
                        fontWeight: 900,
                        letterSpacing: "0.12em",
                      }}
                    >
                      🔥 SOFORT VERFÜGBARE
                      FIXAUFTRÄGE
                    </span>

                    <h2
                      style={{
                        marginTop: 14,
                        fontSize: 30,
                      }}
                    >
                      Bestätigte Aufträge direkt
                      übernehmen
                    </h2>

                    <p
                      style={{
                        maxWidth: 700,
                        marginTop: 10,
                        opacity: 0.66,
                        lineHeight: 1.7,
                      }}
                    >
                      Diese Kunden haben den Auftrag
                      bereits bestätigt. Der Auftrag wird
                      nur einmal verkauft.
                    </p>
                  </div>

                  <div
                    style={{
                      minWidth: 120,
                      padding: "16px 20px",
                      borderRadius: 20,
                      border:
                        "1px solid rgba(251,191,36,0.20)",
                      background:
                        "rgba(245,158,11,0.08)",
                      textAlign: "center",
                    }}
                  >
                    <strong
                      style={{
                        display: "block",
                        fontSize: 30,
                        color: "#fcd34d",
                      }}
                    >
                      {sortedFixedOrders.length}
                    </strong>

                    <small
                      style={{
                        opacity: 0.58,
                      }}
                    >
                      verfügbar
                    </small>
                  </div>
                </div>

                {sortedFixedOrders.length === 0 ? (
                  <div
                    style={{
                      marginTop: 24,
                      padding: 28,
                      borderRadius: 22,
                      border:
                        "1px dashed rgba(255,255,255,0.13)",
                      background:
                        "rgba(255,255,255,0.025)",
                      textAlign: "center",
                    }}
                  >
                    <strong
                      style={{
                        display: "block",
                        fontSize: 18,
                      }}
                    >
                      Aktuell keine Fixaufträge
                      verfügbar
                    </strong>

                    <p
                      style={{
                        marginTop: 8,
                        opacity: 0.54,
                      }}
                    >
                      Sobald ein bestätigter Auftrag
                      erfasst wird, erscheint er hier
                      automatisch.
                    </p>

                    {(selectedRegion ||
                      selectedCategory) && (
                      <Link
                        href="/portal/leads"
                        className="btn btn-secondary"
                        style={{
                          marginTop: 16,
                        }}
                      >
                        Filter entfernen
                      </Link>
                    )}
                  </div>
                ) : (
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(280px, 1fr))",
                      gap: 18,
                      marginTop: 26,
                    }}
                  >
                    {sortedFixedOrders.map(
                      (order) => {
                        const isMatching =
                          isMatchingProvider(
                            order.region,
                            order.category,
                            provider.region,
                            provider.category
                          );

                        return (
                          <article
                            key={order.id}
                            style={{
                              position: "relative",
                              overflow: "hidden",
                              padding: 22,
                              borderRadius: 26,
                              border:
                                isMatching
                                  ? "1px solid rgba(52,211,153,0.26)"
                                  : "1px solid rgba(255,255,255,0.10)",
                              background:
                                "linear-gradient(145deg, rgba(15,31,54,0.98), rgba(19,25,45,0.98))",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                justifyContent:
                                  "space-between",
                                alignItems: "center",
                                gap: 12,
                              }}
                            >
                              <span
                                style={{
                                  display:
                                    "inline-flex",
                                  padding:
                                    "6px 10px",
                                  borderRadius: 999,
                                  background:
                                    "rgba(245,158,11,0.12)",
                                  color: "#fcd34d",
                                  fontSize: 11,
                                  fontWeight: 900,
                                }}
                              >
                                🔥 FIXAUFTRAG
                              </span>

                              {isMatching ? (
                                <span
                                  style={{
                                    display:
                                      "inline-flex",
                                    padding:
                                      "6px 10px",
                                    borderRadius: 999,
                                    background:
                                      "rgba(52,211,153,0.10)",
                                    color:
                                      "#6ee7b7",
                                    fontSize: 11,
                                    fontWeight: 900,
                                  }}
                                >
                                  ✓ PASST ZU DIR
                                </span>
                              ) : null}
                            </div>

                            <p
                              style={{
                                marginTop: 20,
                                color: "#93c5fd",
                                fontSize: 12,
                                fontWeight: 900,
                                letterSpacing:
                                  "0.08em",
                                textTransform:
                                  "uppercase",
                              }}
                            >
                              {order.category}
                            </p>

                            <h3
                              style={{
                                marginTop: 8,
                                fontSize: 23,
                                lineHeight: 1.25,
                              }}
                            >
                              {order.title}
                            </h3>

                            {order.description ? (
                              <p
                                style={{
                                  marginTop: 10,
                                  opacity: 0.58,
                                  fontSize: 13,
                                  lineHeight: 1.6,
                                  display:
                                    "-webkit-box",
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient:
                                    "vertical",
                                  overflow:
                                    "hidden",
                                }}
                              >
                                {order.description}
                              </p>
                            ) : null}

                            <div
                              style={{
                                display: "grid",
                                gridTemplateColumns:
                                  "repeat(2, minmax(0, 1fr))",
                                gap: 10,
                                marginTop: 20,
                              }}
                            >
                              <div
                                style={{
                                  padding: 14,
                                  borderRadius: 16,
                                  background:
                                    "rgba(255,255,255,0.035)",
                                }}
                              >
                                <small
                                  style={{
                                    display:
                                      "block",
                                    opacity: 0.48,
                                  }}
                                >
                                  Auftragswert
                                </small>

                                <strong
                                  style={{
                                    display:
                                      "block",
                                    marginTop: 5,
                                    fontSize: 18,
                                  }}
                                >
                                  {formatCurrency(
                                    order.orderValueCents
                                  )}
                                </strong>
                              </div>

                              <div
                                style={{
                                  padding: 14,
                                  borderRadius: 16,
                                  background:
                                    "rgba(245,158,11,0.09)",
                                }}
                              >
                                <small
                                  style={{
                                    display:
                                      "block",
                                    color:
                                      "#fcd34d",
                                    opacity: 0.76,
                                  }}
                                >
                                  Übernahmepreis
                                </small>

                                <strong
                                  style={{
                                    display:
                                      "block",
                                    marginTop: 5,
                                    color:
                                      "#fcd34d",
                                    fontSize: 18,
                                  }}
                                >
                                  {formatCurrency(
                                    order.commissionAmountCents
                                  )}
                                </strong>
                              </div>
                            </div>

                            <div
                              style={{
                                display: "grid",
                                gap: 10,
                                marginTop: 18,
                                paddingTop: 18,
                                borderTop:
                                  "1px solid rgba(255,255,255,0.08)",
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent:
                                    "space-between",
                                  gap: 12,
                                }}
                              >
                                <span
                                  style={{
                                    opacity: 0.5,
                                    fontSize: 13,
                                  }}
                                >
                                  Ort
                                </span>

                                <strong
                                  style={{
                                    fontSize: 13,
                                    textAlign:
                                      "right",
                                  }}
                                >
                                  {order.postalCode}{" "}
                                  {order.city}
                                </strong>
                              </div>

                              <div
                                style={{
                                  display: "flex",
                                  justifyContent:
                                    "space-between",
                                  gap: 12,
                                }}
                              >
                                <span
                                  style={{
                                    opacity: 0.5,
                                    fontSize: 13,
                                  }}
                                >
                                  Region
                                </span>

                                <strong
                                  style={{
                                    fontSize: 13,
                                    textAlign:
                                      "right",
                                  }}
                                >
                                  {order.region ||
                                    "Schweiz"}
                                </strong>
                              </div>

                              <div
                                style={{
                                  display: "flex",
                                  justifyContent:
                                    "space-between",
                                  gap: 12,
                                }}
                              >
                                <span
                                  style={{
                                    opacity: 0.5,
                                    fontSize: 13,
                                  }}
                                >
                                  Ausführung
                                </span>

                                <strong
                                  style={{
                                    fontSize: 13,
                                    textAlign:
                                      "right",
                                  }}
                                >
                                  {formatExecutionDate(
                                    order.executionDate,
                                    order.flexibleDate
                                  )}
                                </strong>
                              </div>

                              <div
                                style={{
                                  display: "flex",
                                  justifyContent:
                                    "space-between",
                                  gap: 12,
                                }}
                              >
                                <span
                                  style={{
                                    opacity: 0.5,
                                    fontSize: 13,
                                  }}
                                >
                                  Provision
                                </span>

                                <strong
                                  style={{
                                    fontSize: 13,
                                    color:
                                      "#fcd34d",
                                  }}
                                >
                                  {
                                    order.commissionPercent
                                  }
                                  %
                                </strong>
                              </div>
                            </div>

                            <Link
                              href={`/portal/fixed-orders/${order.id}`}
                              className="btn btn-primary"
                              style={{
                                width: "100%",
                                marginTop: 20,
                                minHeight: 50,
                              }}
                            >
                              🔥 Auftrag sofort
                              ansehen
                            </Link>

                            <small
                              style={{
                                display: "block",
                                marginTop: 10,
                                textAlign:
                                  "center",
                                opacity: 0.42,
                              }}
                            >
                              Kundendaten nach
                              erfolgreicher Übernahme
                            </small>
                          </article>
                        );
                      }
                    )}
                  </div>
                )}

                {sortedFixedOrders.length > 0 ? (
                  <div
                    style={{
                      marginTop: 22,
                      textAlign: "center",
                    }}
                  >
                    <Link
                      href="/portal/fixed-orders"
                      style={{
                        color: "#fcd34d",
                        fontWeight: 900,
                        textDecoration: "none",
                      }}
                    >
                      Alle Fixaufträge öffnen →
                    </Link>
                  </div>
                ) : null}
              </section>

              <section>
                <div
                  style={{
                    display: "flex",
                    justifyContent:
                      "space-between",
                    alignItems: "flex-end",
                    gap: 16,
                    flexWrap: "wrap",
                    marginBottom: 18,
                  }}
                >
                  <div>
                    <span className="eyebrow">
                      NORMALE LEADS
                    </span>

                    <h2
                      style={{
                        marginTop: 8,
                      }}
                    >
                      Kundenkontakte freischalten
                    </h2>
                  </div>

                  <span
                    style={{
                      opacity: 0.54,
                      fontSize: 13,
                    }}
                  >
                    {sortedLeads.length} Leads
                    verfügbar
                  </span>
                </div>

                {sortedLeads.length === 0 ? (
                  <div className="leadx-empty">
                    <span>
                      Keine Leads gefunden
                    </span>

                    <h2>
                      Für diese Filter gibt es
                      aktuell keine Leads.
                    </h2>

                    <p>
                      Entferne den Filter oder prüfe
                      später erneut neue Anfragen.
                    </p>
                  </div>
                ) : (
                  <div className="topoffer-leads-list">
                    {sortedLeads.map((lead) => {
                      const isBought =
                        purchasedLeadIds.has(
                          lead.id
                        );

                      const hasEnoughCredits =
                        provider.credits >=
                        lead.price;

                      const isMatching =
                        isMatchingProvider(
                          lead.region,
                          lead.category,
                          provider.region,
                          provider.category
                        );

                      return (
                        <article
                          key={lead.id}
                          className="topoffer-lead-card"
                        >
                          <div className="topoffer-card-header">
                            <div className="topoffer-badges">
                              <span>
                                {isBought
                                  ? "Freigeschaltet"
                                  : "Neu"}
                              </span>

                              <span>
                                {lead.category}
                              </span>

                              {isMatching ? (
                                <span>
                                  Passend
                                </span>
                              ) : null}
                            </div>

                            <span className="topoffer-company-count">
                              Maximal 4 Firmen
                            </span>
                          </div>

                          <div className="topoffer-card-body">
                            <h2>
                              {lead.category}
                            </h2>

                            <p className="topoffer-subtitle">
                              {getShortTitle(
                                lead.title
                              )}
                            </p>

                            <p className="topoffer-location">
                              {lead.region}
                            </p>

                            <p className="topoffer-date">
                              Angefragt am{" "}
                              {formatDate(
                                lead.createdAt
                              )}
                            </p>

                            <p className="topoffer-status">
                              {isBought
                                ? "Kontakt freigeschaltet"
                                : "Kontakt gesperrt"}
                            </p>
                          </div>

                          <div className="topoffer-card-footer">
                            <div>
                              <strong>
                                {lead.price} Credits
                              </strong>

                              <small>
                                Details erst nach
                                Freischaltung
                              </small>
                            </div>

                            {isBought ? (
                              <Link
                                href="/portal/meine-leads"
                                className="btn btn-secondary"
                              >
                                Kontakt ansehen
                              </Link>
                            ) : hasEnoughCredits ? (
                              <form
                                action={
                                  buyLeadAction
                                }
                              >
                                <input
                                  type="hidden"
                                  name="leadId"
                                  value={lead.id}
                                />

                                <button
                                  type="submit"
                                  className="btn btn-primary"
                                >
                                  Kontakt
                                  freischalten
                                </button>
                              </form>
                            ) : (
                              <Link
                                href="/portal/guthaben"
                                className="btn btn-primary"
                              >
                                Credits aufladen
                              </Link>
                            )}
                          </div>
                        </article>
                      );
                    })}
                  </div>
                )}
              </section>
            </div>

            <aside className="leadx-sidebar">
              <div className="leadx-side-card">
                <span>Dein Konto</span>
                <h2>Anbieterstatus</h2>

                <div className="leadx-side-stat">
                  <strong>
                    {provider.credits}
                  </strong>

                  <small>
                    Aktuelle Credits
                  </small>
                </div>

                <div className="leadx-side-stat">
                  <strong>
                    {provider.companyName}
                  </strong>

                  <small>Firma</small>
                </div>

                <div className="leadx-side-stat">
                  <strong>
                    {provider.category || "—"}
                  </strong>

                  <small>
                    Deine Kategorie
                  </small>
                </div>

                <div className="leadx-side-stat">
                  <strong>
                    {provider.region ||
                      "Schweiz"}
                  </strong>

                  <small>Deine Region</small>
                </div>
              </div>

              <div
                className="leadx-side-card"
                style={{
                  border:
                    "1px solid rgba(251,191,36,0.22)",
                  background:
                    "linear-gradient(145deg, rgba(44,31,14,0.55), rgba(15,26,46,0.96))",
                }}
              >
                <span
                  style={{
                    color: "#fcd34d",
                  }}
                >
                  🔥 Fixaufträge
                </span>

                <h2>
                  Bestätigte Aufträge sichern.
                </h2>

                <p>
                  Fixaufträge werden nur einmal
                  vergeben. Wer zuerst erfolgreich
                  übernimmt, erhält den Auftrag.
                </p>

                <Link
                  href="/portal/fixed-orders"
                  className="btn btn-primary"
                >
                  Fixaufträge ansehen
                </Link>
              </div>

              <div className="leadx-side-card leadx-profit">
                <span>Credits</span>

                <h2>
                  Normale Leads freischalten.
                </h2>

                <p>
                  Lade Credits auf und sichere dir
                  passende Kundenkontakte.
                </p>

                <Link
                  href="/portal/guthaben"
                  className="btn btn-primary"
                >
                  Credits kaufen
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}