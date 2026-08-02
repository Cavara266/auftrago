import Link from "next/link";
import { redirect } from "next/navigation";

import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import "./portal-dashboard.css";
import "./portal-dashboard-premium.css";
import "./portal-leads-showcase.css";

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

function formatMembershipDate(date: Date | null) {
  if (!date) {
    return "Noch nicht verfügbar";
  }

  return new Intl.DateTimeFormat("de-CH", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function getRemainingTrialDays(periodEnd: Date | null) {
  if (!periodEnd) {
    return null;
  }

  const difference =
    new Date(periodEnd).getTime() - Date.now();

  return Math.max(
    0,
    Math.ceil(difference / (1000 * 60 * 60 * 24)),
  );
}

function getMembershipInformation(provider: {
  subscriptionExempt: boolean;
  subscriptionStatus: string;
  subscriptionCurrentPeriodEnd: Date | null;
  subscriptionCancelAtPeriodEnd: boolean;
}) {
  const status = String(
    provider.subscriptionStatus || "INACTIVE",
  ).toUpperCase();

  if (provider.subscriptionExempt) {
    return {
      eyebrow: "Bestandsanbieter",
      title: "Dauerhaft kostenlos",
      description:
        "Dein Unternehmen nutzt Auftrago ohne monatliche Grundgebühr.",
      statusLabel: "Mitgliedschaft aktiv",
      priceLabel: "CHF 0.–",
      dateLabel: "Keine Abbuchung",
      tone: "free",
      buttonLabel: "Mitgliedschaft ansehen",
    };
  }

  if (status === "TRIALING") {
    const remainingDays = getRemainingTrialDays(
      provider.subscriptionCurrentPeriodEnd,
    );

    return {
      eyebrow: "Kostenlose Testphase",
      title:
        remainingDays === null
          ? "Testphase aktiv"
          : `Noch ${remainingDays} ${
              remainingDays === 1 ? "Tag" : "Tage"
            } kostenlos`,
      description:
        "Danach wird die Mitgliedschaft automatisch für CHF 69.– pro Monat verlängert.",
      statusLabel: "Testphase aktiv",
      priceLabel: "Danach CHF 69.–",
      dateLabel: provider.subscriptionCurrentPeriodEnd
        ? `Erste Abbuchung: ${formatMembershipDate(
            provider.subscriptionCurrentPeriodEnd,
          )}`
        : "Abrechnung nach der Testphase",
      tone: "trial",
      buttonLabel: "Zahlung verwalten",
    };
  }

  if (status === "ACTIVE") {
    return {
      eyebrow: "Auftrago Professional",
      title: "Mitgliedschaft aktiv",
      description:
        "Dein vollständiger Zugang zum Anbieterportal ist aktiv.",
      statusLabel: "Aktiv",
      priceLabel: "CHF 69.– / Monat",
      dateLabel: provider.subscriptionCurrentPeriodEnd
        ? `Nächste Abbuchung: ${formatMembershipDate(
            provider.subscriptionCurrentPeriodEnd,
          )}`
        : "Automatische Monatsabrechnung",
      tone: "active",
      buttonLabel: "Abo verwalten",
    };
  }

  if (
    status === "CANCELED" ||
    status === "CANCELLED" ||
    provider.subscriptionCancelAtPeriodEnd
  ) {
    return {
      eyebrow: "Mitgliedschaft",
      title: "Abo gekündigt",
      description:
        "Dein Zugang bleibt bis zum Ende der aktuellen Abrechnungsperiode bestehen.",
      statusLabel: "Gekündigt",
      priceLabel: "Keine weitere Verlängerung",
      dateLabel: provider.subscriptionCurrentPeriodEnd
        ? `Zugang bis: ${formatMembershipDate(
            provider.subscriptionCurrentPeriodEnd,
          )}`
        : "Enddatum noch nicht verfügbar",
      tone: "cancelled",
      buttonLabel: "Mitgliedschaft ansehen",
    };
  }

  if (status === "PAST_DUE" || status === "UNPAID") {
    return {
      eyebrow: "Zahlung erforderlich",
      title: "Zahlung ausstehend",
      description:
        "Bitte aktualisiere deine Zahlungsmethode, damit dein Zugang aktiv bleibt.",
      statusLabel: "Zahlung offen",
      priceLabel: "CHF 69.– / Monat",
      dateLabel: "Zahlungsmethode prüfen",
      tone: "warning",
      buttonLabel: "Zahlung verwalten",
    };
  }

  return {
    eyebrow: "Auftrago Mitgliedschaft",
    title: "Mitgliedschaft aktivieren",
    description:
      "Aktiviere deinen Anbieterzugang und nutze das vollständige Portal.",
    statusLabel: "Nicht aktiv",
    priceLabel: "CHF 69.– / Monat",
    dateLabel: "14 Tage kostenlos testen",
    tone: "inactive",
    buttonLabel: "Mitgliedschaft starten",
  };
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

  const membership =
    getMembershipInformation({
      subscriptionExempt:
        provider.subscriptionExempt,
      subscriptionStatus:
        provider.subscriptionStatus,
      subscriptionCurrentPeriodEnd:
        provider.subscriptionCurrentPeriodEnd,
      subscriptionCancelAtPeriodEnd:
        provider.subscriptionCancelAtPeriodEnd,
    });

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

  const purchasesLast30Days = provider.purchases.filter(
    (purchase) =>
      Date.now() -
        new Date(purchase.createdAt).getTime() <=
      30 * 24 * 60 * 60 * 1000
  ).length;

  const averageLeadPrice =
    latestLeads.length > 0
      ? Math.round(
          latestLeads.reduce(
            (total, lead) => total + lead.price,
            0
          ) / latestLeads.length
        )
      : 0;

  const regionalLeadMatches = latestLeads.filter(
    (lead) =>
      provider.region &&
      lead.region &&
      lead.region
        .toLowerCase()
        .includes(provider.region.toLowerCase())
  ).length;

  const dashboardRecommendation =
    provider.credits <= 10
      ? {
          badge: "Credits optimieren",
          title: "Lade dein Guthaben auf, bevor neue Chancen verloren gehen.",
          text: "Dein aktueller Creditstand ist sehr niedrig. Mit einem neuen Paket kannst du passende Leads wieder direkt freischalten.",
          href: "/portal/guthaben",
          cta: "Credits aufladen",
        }
      : availableFixedOrderCount > 0
      ? {
          badge: "Neue Umsatzchance",
          title: `${availableFixedOrderCount} bestätigte Fixaufträge warten auf Anbieter.`,
          text: "Fixaufträge haben bereits einen bestätigten Kunden und Auftragswert. Prüfe die aktuell verfügbaren Aufträge möglichst früh.",
          href: "/portal/fixed-orders",
          cta: "Fixaufträge prüfen",
        }
      : {
          badge: "Profil aktiv halten",
          title: "Prüfe regelmässig neue Leads in deiner Region.",
          text: "Schnelles Reagieren erhöht die Chance, dass du den Kunden vor anderen Anbietern erreichst.",
          href: "/portal/leads",
          cta: "Neue Leads ansehen",
        };

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

          <div
            style={{
              display: "flex",
              minHeight: "310px",
              flexDirection: "column",
              justifyContent: "space-between",
              padding: "24px",
              border: "1px solid rgba(255,255,255,0.10)",
              borderRadius: "24px",
              background:
                "linear-gradient(155deg, rgba(16,24,42,0.98), rgba(7,12,24,0.99))",
              boxShadow:
                "0 24px 60px rgba(0,0,0,0.26), inset 0 1px 0 rgba(255,255,255,0.04)",
              overflow: "hidden",
            }}
          >
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  gap: "14px",
                }}
              >
                <div>
                  <span
                    style={{
                      display: "block",
                      color: "#7c8aa0",
                      fontSize: "10px",
                      fontWeight: 900,
                      letterSpacing: "0.13em",
                      textTransform: "uppercase",
                    }}
                  >
                    Auftrago Mitgliedschaft
                  </span>

                  <strong
                    style={{
                      display: "block",
                      marginTop: "8px",
                      color: "#ffffff",
                      fontSize: "19px",
                      lineHeight: 1.2,
                    }}
                  >
                    {membership.eyebrow}
                  </strong>
                </div>

                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "7px",
                    flexShrink: 0,
                    padding: "8px 11px",
                    border:
                      membership.tone === "free"
                        ? "1px solid rgba(250,204,21,0.20)"
                        : "1px solid rgba(74,222,128,0.20)",
                    borderRadius: "999px",
                    background:
                      membership.tone === "free"
                        ? "rgba(250,204,21,0.08)"
                        : "rgba(34,197,94,0.08)",
                    color:
                      membership.tone === "free"
                        ? "#fde68a"
                        : "#86efac",
                    fontSize: "10px",
                    fontWeight: 900,
                    textTransform: "uppercase",
                  }}
                >
                  <span
                    style={{
                      width: "7px",
                      height: "7px",
                      borderRadius: "50%",
                      background:
                        membership.tone === "free"
                          ? "#facc15"
                          : "#4ade80",
                    }}
                  />

                  {membership.statusLabel}
                </span>
              </div>

              <div
                style={{
                  height: "1px",
                  margin: "20px 0",
                  background:
                    "linear-gradient(90deg, rgba(255,255,255,0.12), transparent)",
                }}
              />

              <strong
                style={{
                  display: "block",
                  color:
                    membership.tone === "free"
                      ? "#fde68a"
                      : "#ffffff",
                  fontSize: "30px",
                  lineHeight: 1.05,
                  letterSpacing: "-0.04em",
                }}
              >
                {membership.title}
              </strong>

              <p
                style={{
                  margin: "10px 0 0",
                  color: "#8b98ab",
                  fontSize: "12px",
                  lineHeight: 1.6,
                }}
              >
                {membership.description}
              </p>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "9px",
                  marginTop: "20px",
                }}
              >
                <div
                  style={{
                    padding: "13px",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "13px",
                    background: "rgba(255,255,255,0.025)",
                  }}
                >
                  <span
                    style={{
                      display: "block",
                      color: "#64748b",
                      fontSize: "9px",
                      fontWeight: 900,
                      textTransform: "uppercase",
                    }}
                  >
                    Plan
                  </span>

                  <strong
                    style={{
                      display: "block",
                      marginTop: "6px",
                      color: "#e8edf5",
                      fontSize: "12px",
                    }}
                  >
                    {membership.tone === "free"
                      ? "Bestandsanbieter"
                      : membership.tone === "trial"
                        ? "Testphase"
                        : "Professional"}
                  </strong>
                </div>

                <div
                  style={{
                    padding: "13px",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "13px",
                    background: "rgba(255,255,255,0.025)",
                  }}
                >
                  <span
                    style={{
                      display: "block",
                      color: "#64748b",
                      fontSize: "9px",
                      fontWeight: 900,
                      textTransform: "uppercase",
                    }}
                  >
                    Preis
                  </span>

                  <strong
                    style={{
                      display: "block",
                      marginTop: "6px",
                      color: "#e8edf5",
                      fontSize: "12px",
                    }}
                  >
                    {membership.priceLabel}
                  </strong>
                </div>

                <div
                  style={{
                    gridColumn: "1 / -1",
                    padding: "13px",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "13px",
                    background: "rgba(255,255,255,0.025)",
                  }}
                >
                  <span
                    style={{
                      display: "block",
                      color: "#64748b",
                      fontSize: "9px",
                      fontWeight: 900,
                      textTransform: "uppercase",
                    }}
                  >
                    Abrechnung
                  </span>

                  <strong
                    style={{
                      display: "block",
                      marginTop: "6px",
                      color: "#e8edf5",
                      fontSize: "12px",
                      lineHeight: 1.35,
                    }}
                  >
                    {membership.dateLabel}
                  </strong>
                </div>
              </div>
            </div>

            <Link
              href={
                membership.tone === "inactive"
                  ? "/subscription-required"
                  : "/portal/abo"
              }
              style={{
                display: "flex",
                minHeight: "48px",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: "20px",
                padding: "12px 15px",
                border:
                  membership.tone === "free"
                    ? "1px solid rgba(250,204,21,0.18)"
                    : "1px solid rgba(125,211,252,0.18)",
                borderRadius: "13px",
                background:
                  membership.tone === "free"
                    ? "rgba(250,204,21,0.07)"
                    : "rgba(56,189,248,0.08)",
                color:
                  membership.tone === "free"
                    ? "#fde68a"
                    : "#dff6ff",
                fontSize: "12px",
                fontWeight: 900,
                textDecoration: "none",
              }}
            >
              {membership.buttonLabel}
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>

        <section
          aria-label="Unternehmensübersicht"
          style={{
            marginBottom: "28px",
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(210px, 1fr))",
            gap: "14px",
          }}
        >
          <article
            style={{
              border: "1px solid rgba(56, 189, 248, 0.16)",
              borderRadius: "22px",
              background:
                "linear-gradient(145deg, rgba(14, 165, 233, 0.1), rgba(7, 11, 20, 0.94))",
              padding: "22px",
            }}
          >
            <span
              style={{
                color: "#7dd3fc",
                fontSize: "11px",
                fontWeight: 900,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              Käufe · 30 Tage
            </span>
            <strong
              style={{
                display: "block",
                marginTop: "14px",
                color: "#ffffff",
                fontSize: "32px",
                lineHeight: 1,
              }}
            >
              {purchasesLast30Days}
            </strong>
            <p
              style={{
                marginTop: "10px",
                color: "#94a3b8",
                fontSize: "13px",
                lineHeight: 1.6,
              }}
            >
              Freigeschaltete Leads innerhalb der letzten 30 Tage.
            </p>
          </article>

          <article
            style={{
              border: "1px solid rgba(167, 139, 250, 0.16)",
              borderRadius: "22px",
              background:
                "linear-gradient(145deg, rgba(139, 92, 246, 0.1), rgba(7, 11, 20, 0.94))",
              padding: "22px",
            }}
          >
            <span
              style={{
                color: "#c4b5fd",
                fontSize: "11px",
                fontWeight: 900,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              Ø Leadpreis
            </span>
            <strong
              style={{
                display: "block",
                marginTop: "14px",
                color: "#ffffff",
                fontSize: "32px",
                lineHeight: 1,
              }}
            >
              {averageLeadPrice}
            </strong>
            <p
              style={{
                marginTop: "10px",
                color: "#94a3b8",
                fontSize: "13px",
                lineHeight: 1.6,
              }}
            >
              Credits im Durchschnitt bei den neuesten Anfragen.
            </p>
          </article>

          <article
            style={{
              border: "1px solid rgba(52, 211, 153, 0.16)",
              borderRadius: "22px",
              background:
                "linear-gradient(145deg, rgba(16, 185, 129, 0.1), rgba(7, 11, 20, 0.94))",
              padding: "22px",
            }}
          >
            <span
              style={{
                color: "#6ee7b7",
                fontSize: "11px",
                fontWeight: 900,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              Regionale Treffer
            </span>
            <strong
              style={{
                display: "block",
                marginTop: "14px",
                color: "#ffffff",
                fontSize: "32px",
                lineHeight: 1,
              }}
            >
              {regionalLeadMatches}
            </strong>
            <p
              style={{
                marginTop: "10px",
                color: "#94a3b8",
                fontSize: "13px",
                lineHeight: 1.6,
              }}
            >
              Neue Leads, die aktuell zu deiner Region passen.
            </p>
          </article>

          <article
            style={{
              border: "1px solid rgba(251, 191, 36, 0.16)",
              borderRadius: "22px",
              background:
                "linear-gradient(145deg, rgba(245, 158, 11, 0.1), rgba(7, 11, 20, 0.94))",
              padding: "22px",
            }}
          >
            <span
              style={{
                color: "#fcd34d",
                fontSize: "11px",
                fontWeight: 900,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              Auftragspotenzial
            </span>
            <strong
              style={{
                display: "block",
                marginTop: "14px",
                color: "#ffffff",
                fontSize: "27px",
                lineHeight: 1.1,
              }}
            >
              {formatMoney(availableFixedOrderVolume)}
            </strong>
            <p
              style={{
                marginTop: "10px",
                color: "#94a3b8",
                fontSize: "13px",
                lineHeight: 1.6,
              }}
            >
              Auftragsvolumen der aktuell sichtbaren Fixaufträge.
            </p>
          </article>
        </section>

        <section
          style={{
            marginBottom: "28px",
            overflow: "hidden",
            position: "relative",
            border: "1px solid rgba(56, 189, 248, 0.18)",
            borderRadius: "26px",
            background:
              "radial-gradient(circle at 85% 15%, rgba(56, 189, 248, 0.16), transparent 32%), linear-gradient(135deg, rgba(8, 47, 73, 0.42), rgba(7, 11, 20, 0.96))",
            padding: "26px",
          }}
        >
          <div
            style={{
              position: "relative",
              zIndex: 1,
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "22px",
            }}
          >
            <div style={{ maxWidth: "760px" }}>
              <span
                style={{
                  display: "inline-flex",
                  borderRadius: "999px",
                  background: "rgba(56, 189, 248, 0.1)",
                  color: "#7dd3fc",
                  padding: "7px 11px",
                  fontSize: "11px",
                  fontWeight: 900,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                ✦ {dashboardRecommendation.badge}
              </span>
              <h2
                style={{
                  marginTop: "14px",
                  color: "#ffffff",
                  fontSize: "clamp(22px, 3vw, 31px)",
                  lineHeight: 1.18,
                }}
              >
                {dashboardRecommendation.title}
              </h2>
              <p
                style={{
                  marginTop: "10px",
                  color: "#a8b3c7",
                  fontSize: "14px",
                  lineHeight: 1.75,
                }}
              >
                {dashboardRecommendation.text}
              </p>
            </div>

            <Link
              href={dashboardRecommendation.href}
              className="provider-button provider-button--primary"
            >
              {dashboardRecommendation.cta}
              <span aria-hidden="true">→</span>
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
          <section className="lead-showcase">
            <div className="lead-showcase__ambient lead-showcase__ambient--one" />
            <div className="lead-showcase__ambient lead-showcase__ambient--two" />

            <header className="lead-showcase__header">
              <div className="lead-showcase__heading">
                <div className="lead-showcase__live">
                  <span />
                  Live-Marktplatz
                </div>

                <h2>
                  Aufträge, die dein
                  <strong> Unternehmen wachsen lassen.</strong>
                </h2>

                <p>
                  Entdecke aktuelle Kundenanfragen und sichere dir
                  interessante Projekte, bevor andere Anbieter
                  reagieren.
                </p>
              </div>

              <div className="lead-showcase__header-side">
                <div className="lead-showcase__availability">
                  <span>Jetzt verfügbar</span>

                  <strong>{latestLeads.length}</strong>

                  <small>neue Chancen</small>
                </div>

                <Link
                  href="/portal/leads"
                  className="lead-showcase__all-link"
                >
                  Alle Anfragen entdecken
                  <span aria-hidden="true">↗</span>
                </Link>
              </div>
            </header>

            {latestLeads.length > 0 ? (
              <div className="lead-showcase__list">
                {latestLeads.map((lead, index) => {
                  const fit = getLeadFit(
                    lead.region,
                    provider.region
                  );

                  const isStrongMatch =
                    fit === "Sehr passend";

                  const matchScore = isStrongMatch
                    ? Math.max(91, 98 - index)
                    : Math.max(72, 88 - index * 2);

                  return (
                    <article
                      className="lead-showcase__card"
                      key={lead.id}
                    >
                      <div className="lead-showcase__card-glow" />

                      <div className="lead-showcase__rank">
                        <span>Anfrage</span>

                        <strong>
                          {String(index + 1).padStart(2, "0")}
                        </strong>
                      </div>

                      <div className="lead-showcase__content">
                        <div className="lead-showcase__badges">
                          <span className="lead-showcase__badge lead-showcase__badge--new">
                            <i />
                            Neu
                          </span>

                          <span
                            className={
                              isStrongMatch
                                ? "lead-showcase__badge lead-showcase__badge--match"
                                : "lead-showcase__badge"
                            }
                          >
                            {isStrongMatch ? "★ " : ""}
                            {fit}
                          </span>

                          <span className="lead-showcase__badge">
                            {lead.region || "Schweiz"}
                          </span>

                          <span className="lead-showcase__age">
                            {getAgeLabel(lead.createdAt)}
                          </span>
                        </div>

                        <div className="lead-showcase__title-row">
                          <div>
                            <span className="lead-showcase__category">
                              {lead.category}
                            </span>

                            <h3>
                              {lead.title || lead.category}
                            </h3>
                          </div>

                          <div className="lead-showcase__match-score">
                            <div>
                              <strong>{matchScore}%</strong>
                              <span>Match</span>
                            </div>

                            <i>
                              <b
                                style={{
                                  width: `${matchScore}%`,
                                }}
                              />
                            </i>
                          </div>
                        </div>

                        <div className="lead-showcase__details">
                          <div>
                            <span className="lead-showcase__detail-icon">
                              ✦
                            </span>

                            <p>
                              <small>Dienstleistung</small>
                              <strong>{lead.category}</strong>
                            </p>
                          </div>

                          <div>
                            <span className="lead-showcase__detail-icon">
                              ◎
                            </span>

                            <p>
                              <small>Einsatzgebiet</small>
                              <strong>
                                {lead.region || "Schweiz"}
                              </strong>
                            </p>
                          </div>

                          <div>
                            <span className="lead-showcase__detail-icon">
                              ◈
                            </span>

                            <p>
                              <small>Kundendaten</small>
                              <strong>
                                Nach Kauf sofort sichtbar
                              </strong>
                            </p>
                          </div>
                        </div>

                        <div className="lead-showcase__trust">
                          <span>✓ Geprüfte Anfrage</span>
                          <span>✓ Direkter Kundenkontakt</span>
                          <span>✓ Sofort freischaltbar</span>
                        </div>
                      </div>

                      <div className="lead-showcase__purchase">
                        <span className="lead-showcase__price-label">
                          Freischaltpreis
                        </span>

                        <div className="lead-showcase__price">
                          <strong>{lead.price}</strong>

                          <span>
                            Credits
                            <small>einmalig</small>
                          </span>
                        </div>

                        <div className="lead-showcase__credit-check">
                          {provider.credits >= lead.price ? (
                            <>
                              <span className="lead-showcase__credit-check-dot" />
                              Guthaben ausreichend
                            </>
                          ) : (
                            <>
                              <span className="lead-showcase__credit-check-dot lead-showcase__credit-check-dot--warning" />
                              Credits aufladen
                            </>
                          )}
                        </div>

                        <Link
                          href="/portal/leads"
                          className="lead-showcase__unlock"
                        >
                          <span>
                            Anfrage freischalten
                            <small>Kontaktdaten sofort erhalten</small>
                          </span>

                          <b aria-hidden="true">→</b>
                        </Link>

                        <small className="lead-showcase__secure">
                          🔒 Sicher über dein Auftrago-Guthaben
                        </small>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="lead-showcase__empty">
                <div>✓</div>

                <span>Marktplatz aktualisiert</span>

                <h3>Du bist auf dem neuesten Stand</h3>

                <p>
                  Momentan sind keine neuen Kundenanfragen
                  verfügbar. Neue Leads erscheinen automatisch
                  an dieser Stelle.
                </p>

                <Link href="/portal/leads">
                  Marktplatz öffnen →
                </Link>
              </div>
            )}

            {latestLeads.length > 0 ? (
              <footer className="lead-showcase__footer">
                <div>
                  <span>✦</span>

                  <p>
                    <strong>Frühes Reagieren lohnt sich.</strong>
                    Besonders attraktive Anfragen werden häufig
                    innerhalb kurzer Zeit freigeschaltet.
                  </p>
                </div>

                <Link href="/portal/leads">
                  Alle {totalLeads} Leads ansehen
                  <span aria-hidden="true">→</span>
                </Link>
              </footer>
            ) : null}
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
