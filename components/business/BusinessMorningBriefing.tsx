import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

const money = (cents: number) =>
  new Intl.NumberFormat("de-CH", {
    style: "currency",
    currency: "CHF",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100);

export default async function BusinessMorningBriefing() {
  const user = await getCurrentUser();

  if (!user) return null;

  const now = new Date();

  const todayStart = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    0,
    0,
    0,
    0
  );

  const tomorrowStart = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1,
    0,
    0,
    0,
    0
  );

  const followupLimit = new Date(now);
  followupLimit.setDate(
    followupLimit.getDate() - 3
  );

  const [
    overdueInvoices,
    followupQuotes,
    acceptedToday,
    paymentsToday,
  ] = await Promise.all([
    prisma.businessInvoice.findMany({
      where: {
        providerId: user.id,
        status: {
          in: ["OPEN", "SENT", "OVERDUE"],
        },
      },
      select: {
        id: true,
        invoiceNumber: true,
        customerName: true,
        totalCents: true,
        paidAmountCents: true,
        dueAt: true,
        status: true,
      },
      orderBy: {
        dueAt: "asc",
      },
    }),

    prisma.businessQuote.findMany({
      where: {
        providerId: user.id,
        status: {
          in: ["SENT", "OPEN"],
        },
        createdAt: {
          lte: followupLimit,
        },
      },
      select: {
        id: true,
        quoteNumber: true,
        customerName: true,
        title: true,
        totalCents: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "asc",
      },
      take: 10,
    }),

    prisma.businessQuote.findMany({
      where: {
        providerId: user.id,
        status: "ACCEPTED",
        acceptedAt: {
          gte: todayStart,
          lt: tomorrowStart,
        },
      },
      select: {
        id: true,
        quoteNumber: true,
        customerName: true,
        title: true,
        totalCents: true,
      },
      orderBy: {
        acceptedAt: "desc",
      },
    }),

    prisma.businessInvoicePayment.findMany({
      where: {
        invoice: {
          providerId: user.id,
        },
        paymentDate: {
          gte: todayStart,
          lt: tomorrowStart,
        },
      },
      select: {
        amountCents: true,
      },
    }),
  ]);

  const overdue = overdueInvoices.filter(
    (invoice) =>
      invoice.status === "OVERDUE" ||
      (
        invoice.dueAt &&
        invoice.dueAt < now
      )
  );

  const overdueAmount = overdue.reduce(
    (sum, invoice) =>
      sum +
      Math.max(
        0,
        invoice.totalCents -
          (invoice.paidAmountCents || 0)
      ),
    0
  );

  const followupValue =
    followupQuotes.reduce(
      (sum, quote) =>
        sum + quote.totalCents,
      0
    );

  const wonTodayValue =
    acceptedToday.reduce(
      (sum, quote) =>
        sum + quote.totalCents,
      0
    );

  const paymentsTodayValue =
    paymentsToday.reduce(
      (sum, payment) =>
        sum + payment.amountCents,
      0
    );

  const priorityCount =
    overdue.length +
    followupQuotes.length;

  const allClean =
    priorityCount === 0;

  const priorities = [
    {
      label: "GELD EINZIEHEN",
      value: money(overdueAmount),
      sub:
        overdue.length === 1
          ? "1 überfällige Rechnung"
          : `${overdue.length} überfällige Rechnungen`,
      href: "/portal/business/rechnungen",
      accent:
        overdue.length > 0
          ? "#fca5a5"
          : "#86efac",
      icon: "!",
    },
    {
      label: "OFFERTEN NACHFASSEN",
      value: String(
        followupQuotes.length
      ),
      sub:
        followupQuotes.length > 0
          ? `${money(followupValue)} Pipeline`
          : "Aktuell nichts offen",
      href: "/portal/business/offerten",
      accent: "#7dd3fc",
      icon: "◇",
    },
    {
      label: "HEUTE GEWONNEN",
      value: money(wonTodayValue),
      sub:
        acceptedToday.length === 1
          ? "1 neuer Auftrag"
          : `${acceptedToday.length} neue Aufträge`,
      href: "/portal/business/offerten",
      accent: "#86efac",
      icon: "✓",
    },
    {
      label: "HEUTE EINGEGANGEN",
      value: money(
        paymentsTodayValue
      ),
      sub:
        paymentsToday.length === 1
          ? "1 Zahlung"
          : `${paymentsToday.length} Zahlungen`,
      href: "/portal/business/rechnungen",
      accent: "#c4b5fd",
      icon: "↗",
    },
  ];

  return (
    <>
      <style>{`
        .morning-priority-card {
          transition:
            transform .18s ease,
            border-color .18s ease,
            box-shadow .18s ease,
            background .18s ease;
        }

        .morning-priority-card:hover {
          transform: translateY(-3px);
          border-color: rgba(125,211,252,.20) !important;
          box-shadow: 0 20px 55px rgba(2,6,23,.24);
        }

        @media(max-width:900px) {
          .morning-priority-grid {
            grid-template-columns:
              repeat(2,minmax(0,1fr)) !important;
          }
        }

        @media(max-width:560px) {
          .morning-priority-grid {
            grid-template-columns:
              minmax(0,1fr) !important;
          }
        }
      `}</style>

      <section
        style={{
          position: "relative",
          overflow: "hidden",
          padding: 24,
          borderRadius: 24,
          border:
            allClean
              ? "1px solid rgba(34,197,94,.13)"
              : "1px solid rgba(251,191,36,.14)",
          background:
            allClean
              ? "linear-gradient(145deg,rgba(7,25,30,.90),rgba(9,28,45,.82))"
              : "linear-gradient(145deg,rgba(18,22,38,.94),rgba(34,25,55,.88))",
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,.025)",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: 260,
            height: 260,
            borderRadius: "50%",
            background:
              allClean
                ? "rgba(34,197,94,.07)"
                : "rgba(124,58,237,.09)",
            filter: "blur(70px)",
            right: -80,
            top: -130,
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 1,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent:
                "space-between",
              gap: 20,
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <div>
              <div
                style={{
                  color: "#7dd3fc",
                  fontSize: 10,
                  fontWeight: 950,
                  letterSpacing: ".10em",
                }}
              >
                AUFTRAGO MORNING BRIEFING
              </div>

              <h2
                style={{
                  margin: "7px 0 5px",
                  fontSize:
                    "clamp(24px,3vw,34px)",
                  letterSpacing: "-.04em",
                }}
              >
                {allClean
                  ? "Heute sieht alles sauber aus."
                  : `${priorityCount} Prioritäten für heute`}
              </h2>

              <div
                style={{
                  color: "#64748b",
                  fontSize: 12,
                }}
              >
                Auftrago zeigt dir automatisch,
                wo heute Geld und Abschlüsse liegen.
              </div>
            </div>

            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "9px 13px",
                borderRadius: 999,
                border:
                  allClean
                    ? "1px solid rgba(34,197,94,.18)"
                    : "1px solid rgba(251,191,36,.18)",
                background:
                  allClean
                    ? "rgba(34,197,94,.06)"
                    : "rgba(251,191,36,.06)",
                color:
                  allClean
                    ? "#86efac"
                    : "#fbbf24",
                fontSize: 10,
                fontWeight: 950,
                letterSpacing: ".05em",
              }}
            >
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background:
                    "currentColor",
                  boxShadow:
                    "0 0 14px currentColor",
                }}
              />

              {allClean
                ? "KEINE KRITISCHEN PUNKTE"
                : "AKTION EMPFOHLEN"}
            </div>
          </div>

          <div
            className="morning-priority-grid"
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(4,minmax(0,1fr))",
              gap: 10,
              marginTop: 20,
            }}
          >
            {priorities.map(
              (item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="morning-priority-card"
                  style={{
                    minWidth: 0,
                    padding: 16,
                    borderRadius: 16,
                    border:
                      "1px solid rgba(148,163,184,.09)",
                    background:
                      "rgba(2,6,23,.30)",
                    color: "inherit",
                    textDecoration: "none",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent:
                        "space-between",
                      gap: 10,
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        color: "#64748b",
                        fontSize: 8,
                        fontWeight: 950,
                        letterSpacing:
                          ".08em",
                      }}
                    >
                      {item.label}
                    </div>

                    <div
                      style={{
                        width: 27,
                        height: 27,
                        borderRadius: 9,
                        display: "grid",
                        placeItems: "center",
                        background:
                          "rgba(148,163,184,.06)",
                        color: item.accent,
                        fontSize: 11,
                        fontWeight: 950,
                      }}
                    >
                      {item.icon}
                    </div>
                  </div>

                  <div
                    style={{
                      color: item.accent,
                      fontSize: 22,
                      lineHeight: 1,
                      fontWeight: 950,
                      letterSpacing:
                        "-.03em",
                      marginTop: 13,
                    }}
                  >
                    {item.value}
                  </div>

                  <div
                    style={{
                      color: "#64748b",
                      fontSize: 9,
                      lineHeight: 1.4,
                      marginTop: 7,
                    }}
                  >
                    {item.sub}
                  </div>
                </Link>
              )
            )}
          </div>

          {!allClean && (
            <div
              style={{
                display: "flex",
                gap: 9,
                flexWrap: "wrap",
                marginTop: 16,
              }}
            >
              {overdue.length > 0 && (
                <Link
                  href="/portal/business/rechnungen"
                  style={actionButton}
                >
                  ! Überfällige Rechnungen prüfen
                </Link>
              )}

              {followupQuotes.length >
                0 && (
                <Link
                  href="/portal/business/ai?prompt=Welche%20Offerten%20sollte%20ich%20heute%20nachfassen%3F"
                  style={actionButton}
                >
                  ✦ Follow-up mit AI
                </Link>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

const actionButton = {
  display: "inline-flex",
  alignItems: "center",
  padding: "10px 13px",
  borderRadius: 10,
  border:
    "1px solid rgba(125,211,252,.12)",
  background:
    "rgba(15,23,42,.56)",
  color: "#cbd5e1",
  textDecoration: "none",
  fontSize: 10,
  fontWeight: 900,
} as const;
