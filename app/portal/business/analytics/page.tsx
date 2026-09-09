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

const percent = (value: number) =>
  `${Math.round(value)} %`;

function monthStart(date: Date) {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    1,
    0,
    0,
    0,
    0
  );
}

function nextMonth(date: Date) {
  return new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    1,
    0,
    0,
    0,
    0
  );
}

function monthLabel(date: Date) {
  return new Intl.DateTimeFormat("de-CH", {
    month: "short",
  }).format(date);
}

export default async function BusinessAnalyticsPage() {
  const user = await getCurrentUser();

  if (!user) return null;

  const now = new Date();

  const currentMonthStart =
    monthStart(now);

  const nextMonthStart =
    nextMonth(now);

  const previousMonthStart =
    new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      1
    );

  const sixMonthsStart =
    new Date(
      now.getFullYear(),
      now.getMonth() - 5,
      1
    );

  const [
    invoices,
    payments,
    quotes,
    customerCount,
  ] = await Promise.all([
    prisma.businessInvoice.findMany({
      where: {
        providerId: user.id,
      },
      select: {
        id: true,
        invoiceNumber: true,
        customerName: true,
        status: true,
        totalCents: true,
        paidAmountCents: true,
        dueAt: true,
        issuedAt: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    }),

    prisma.businessInvoicePayment.findMany({
      where: {
        invoice: {
          providerId: user.id,
        },
        paymentDate: {
          gte: sixMonthsStart,
          lt: nextMonthStart,
        },
      },
      select: {
        amountCents: true,
        paymentDate: true,
      },
      orderBy: {
        paymentDate: "asc",
      },
    }),

    prisma.businessQuote.findMany({
      where: {
        providerId: user.id,
      },
      select: {
        id: true,
        quoteNumber: true,
        customerName: true,
        title: true,
        status: true,
        totalCents: true,
        sentAt: true,
        acceptedAt: true,
        declinedAt: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    }),

    prisma.businessCustomer.count({
      where: {
        providerId: user.id,
      },
    }),
  ]);

  // ========================================================
  // ZAHLUNGEN
  // ========================================================

  const currentMonthPayments =
    payments.filter(
      (payment) =>
        payment.paymentDate >=
          currentMonthStart &&
        payment.paymentDate <
          nextMonthStart
    );

  const previousMonthPayments =
    payments.filter(
      (payment) =>
        payment.paymentDate >=
          previousMonthStart &&
        payment.paymentDate <
          currentMonthStart
    );

  const currentRevenue =
    currentMonthPayments.reduce(
      (sum, payment) =>
        sum + payment.amountCents,
      0
    );

  const previousRevenue =
    previousMonthPayments.reduce(
      (sum, payment) =>
        sum + payment.amountCents,
      0
    );

  const revenueChange =
    previousRevenue > 0
      ? (
          (currentRevenue -
            previousRevenue) /
          previousRevenue
        ) * 100
      : currentRevenue > 0
      ? 100
      : 0;

  // ========================================================
  // RECHNUNGEN
  // ========================================================

  const activeInvoices =
    invoices.filter(
      (invoice) =>
        ![
          "PAID",
          "CANCELLED",
        ].includes(
          invoice.status
        )
    );

  const openInvoiceAmount =
    activeInvoices.reduce(
      (sum, invoice) =>
        sum +
        Math.max(
          0,
          invoice.totalCents -
            (invoice.paidAmountCents ||
              0)
        ),
      0
    );

  const overdueInvoices =
    activeInvoices.filter(
      (invoice) =>
        invoice.status ===
          "OVERDUE" ||
        (
          invoice.dueAt &&
          invoice.dueAt < now
        )
    );

  const overdueAmount =
    overdueInvoices.reduce(
      (sum, invoice) =>
        sum +
        Math.max(
          0,
          invoice.totalCents -
            (invoice.paidAmountCents ||
              0)
        ),
      0
    );

  const invoiceTotal =
    invoices
      .filter(
        (invoice) =>
          invoice.status !==
          "CANCELLED"
      )
      .reduce(
        (sum, invoice) =>
          sum +
          invoice.totalCents,
        0
      );

  const paidTotal =
    invoices.reduce(
      (sum, invoice) =>
        sum +
        (invoice.paidAmountCents ||
          0),
      0
    );

  const collectionRate =
    invoiceTotal > 0
      ? Math.min(
          100,
          (paidTotal /
            invoiceTotal) *
            100
        )
      : 100;

  // ========================================================
  // OFFER TEN
  // ========================================================

  const acceptedQuotes =
    quotes.filter(
      (quote) =>
        Boolean(
          quote.acceptedAt
        ) ||
        quote.status ===
          "ACCEPTED"
    );

  const declinedQuotes =
    quotes.filter(
      (quote) =>
        Boolean(
          quote.declinedAt
        ) ||
        quote.status ===
          "DECLINED"
    );

  const sentQuotes =
    quotes.filter(
      (quote) =>
        Boolean(quote.sentAt) ||
        [
          "SENT",
          "OPEN",
          "ACCEPTED",
          "DECLINED",
        ].includes(
          quote.status
        )
    );

  const openQuotes =
    quotes.filter(
      (quote) =>
        !quote.acceptedAt &&
        !quote.declinedAt &&
        [
          "DRAFT",
          "SENT",
          "OPEN",
        ].includes(
          quote.status
        )
    );

  const pipelineValue =
    openQuotes.reduce(
      (sum, quote) =>
        sum +
        quote.totalCents,
      0
    );

  const acceptedValue =
    acceptedQuotes.reduce(
      (sum, quote) =>
        sum +
        quote.totalCents,
      0
    );

  const conversionRate =
    sentQuotes.length > 0
      ? (
          acceptedQuotes.length /
          sentQuotes.length
        ) * 100
      : 0;

  // ========================================================
  // 6-MONATS UMSATZ
  // ========================================================

  const months = Array.from(
    { length: 6 },
    (_, index) => {
      const date =
        new Date(
          now.getFullYear(),
          now.getMonth() -
            (5 - index),
          1
        );

      const end =
        new Date(
          date.getFullYear(),
          date.getMonth() + 1,
          1
        );

      const revenue =
        payments
          .filter(
            (payment) =>
              payment.paymentDate >=
                date &&
              payment.paymentDate <
                end
          )
          .reduce(
            (sum, payment) =>
              sum +
              payment.amountCents,
            0
          );

      return {
        date,
        label: monthLabel(date),
        revenue,
      };
    }
  );

  const maxMonthlyRevenue =
    Math.max(
      1,
      ...months.map(
        (month) =>
          month.revenue
      )
    );

  const sixMonthRevenue =
    months.reduce(
      (sum, month) =>
        sum + month.revenue,
      0
    );

  const averageMonthlyRevenue =
    Math.round(
      sixMonthRevenue /
        months.length
    );

  const recentQuotes =
    quotes.slice(0, 5);

  const recentInvoices =
    invoices.slice(0, 5);

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at 82% 0%,rgba(124,58,237,.10),transparent 30%),radial-gradient(circle at 15% 20%,rgba(14,165,233,.055),transparent 25%),#061120",
        color: "#f8fafc",
      }}
    >
      <style>{`
        .analytics-card {
          transition:
            transform .18s ease,
            border-color .18s ease,
            box-shadow .18s ease;
        }

        .analytics-card:hover {
          transform: translateY(-3px);
          border-color: rgba(125,211,252,.16) !important;
          box-shadow: 0 20px 60px rgba(2,6,23,.20);
        }

        .analytics-link {
          transition:
            transform .16s ease,
            color .16s ease;
        }

        .analytics-link:hover {
          transform: translateX(3px);
        }

        @media(max-width:1050px) {
          .analytics-kpis {
            grid-template-columns:
              repeat(2,minmax(0,1fr)) !important;
          }

          .analytics-main-grid {
            grid-template-columns:
              1fr !important;
          }
        }

        @media(max-width:620px) {
          .analytics-shell {
            padding: 24px 14px 70px !important;
          }

          .analytics-kpis {
            grid-template-columns:
              1fr !important;
          }

          .analytics-bottom-grid {
            grid-template-columns:
              1fr !important;
          }
        }
      `}</style>

      <div
        className="analytics-shell"
        style={{
          width:
            "min(100%,1500px)",
          margin: "0 auto",
          padding:
            "38px 30px 90px",
          boxSizing:
            "border-box",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "end",
            gap: 20,
            flexWrap: "wrap",
          }}
        >
          <div>
            <div
              style={{
                color: "#c4b5fd",
                fontSize: 10,
                fontWeight: 950,
                letterSpacing:
                  ".11em",
              }}
            >
              AUFTRAGO INTELLIGENCE
            </div>

            <h1
              style={{
                margin:
                  "9px 0 8px",
                fontSize:
                  "clamp(42px,6vw,72px)",
                lineHeight: .95,
                letterSpacing:
                  "-.055em",
              }}
            >
              Analytics
            </h1>

            <p
              style={{
                margin: 0,
                maxWidth: 760,
                color: "#64748b",
                fontSize: 13,
                lineHeight: 1.7,
              }}
            >
              Umsatz, Liquidität,
              Forderungen und Vertrieb –
              dein Unternehmen in Zahlen.
            </p>
          </div>

          <div
            style={{
              display: "flex",
              gap: 8,
              flexWrap: "wrap",
            }}
          >
            <Link
              href="/portal/business/rechnungen"
              style={topButton}
            >
              Rechnungen →
            </Link>

            <Link
              href="/portal/business/offerten"
              style={{
                ...topButton,
                background:
                  "linear-gradient(90deg,#0ea5e9,#6366f1,#7c3aed)",
                border: 0,
                color: "#fff",
              }}
            >
              Offerten →
            </Link>
          </div>
        </div>

        <div
          className="analytics-kpis"
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(4,minmax(0,1fr))",
            gap: 12,
            marginTop: 30,
          }}
        >
          <KPI
            eyebrow="UMSATZ DIESEN MONAT"
            value={money(
              currentRevenue
            )}
            sub={
              previousRevenue > 0
                ? `${
                    revenueChange >= 0
                      ? "+"
                      : ""
                  }${Math.round(
                    revenueChange
                  )}% vs. Vormonat`
                : "Aktueller Monat"
            }
            color="#86efac"
            icon="↗"
          />

          <KPI
            eyebrow="OFFENE FORDERUNGEN"
            value={money(
              openInvoiceAmount
            )}
            sub={`${activeInvoices.length} offene Rechnung(en)`}
            color="#7dd3fc"
            icon="◎"
          />

          <KPI
            eyebrow="ÜBERFÄLLIG"
            value={money(
              overdueAmount
            )}
            sub={`${overdueInvoices.length} Rechnung(en)`}
            color={
              overdueAmount > 0
                ? "#fca5a5"
                : "#86efac"
            }
            icon="!"
          />

          <KPI
            eyebrow="OFFERTEN-PIPELINE"
            value={money(
              pipelineValue
            )}
            sub={`${openQuotes.length} offene Offerte(n)`}
            color="#c4b5fd"
            icon="◇"
          />
        </div>

        <div
          className="analytics-main-grid"
          style={{
            display: "grid",
            gridTemplateColumns:
              "minmax(0,1.45fr) minmax(330px,.55fr)",
            gap: 14,
            marginTop: 14,
          }}
        >
          <section
            className="analytics-card"
            style={{
              padding: 24,
              borderRadius: 22,
              border:
                "1px solid rgba(125,211,252,.09)",
              background:
                "linear-gradient(145deg,rgba(7,19,37,.94),rgba(8,25,43,.82))",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                gap: 15,
                alignItems: "start",
                flexWrap: "wrap",
              }}
            >
              <div>
                <div style={eyebrow}>
                  CASHFLOW
                </div>

                <h2 style={sectionTitle}>
                  Umsatzentwicklung
                </h2>

                <div style={sectionSub}>
                  Effektive Zahlungseingänge
                  der letzten sechs Monate
                </div>
              </div>

              <div
                style={{
                  textAlign: "right",
                }}
              >
                <div style={miniLabel}>
                  6 MONATE
                </div>

                <strong
                  style={{
                    color: "#86efac",
                    fontSize: 22,
                  }}
                >
                  {money(
                    sixMonthRevenue
                  )}
                </strong>
              </div>
            </div>

            <div
              style={{
                height: 270,
                display: "grid",
                gridTemplateColumns:
                  "repeat(6,minmax(0,1fr))",
                alignItems: "end",
                gap: 12,
                marginTop: 30,
              }}
            >
              {months.map(
                (month) => {
                  const height =
                    Math.max(
                      4,
                      Math.round(
                        (month.revenue /
                          maxMonthlyRevenue) *
                          100
                      )
                    );

                  const current =
                    month.date.getMonth() ===
                      now.getMonth() &&
                    month.date.getFullYear() ===
                      now.getFullYear();

                  return (
                    <div
                      key={
                        month.date.toISOString()
                      }
                      style={{
                        height: "100%",
                        display:
                          "flex",
                        flexDirection:
                          "column",
                        justifyContent:
                          "flex-end",
                        minWidth: 0,
                      }}
                    >
                      <div
                        style={{
                          textAlign:
                            "center",
                          color:
                            month.revenue >
                            0
                              ? "#94a3b8"
                              : "#334155",
                          fontSize: 8,
                          fontWeight:
                            850,
                          marginBottom: 7,
                        }}
                      >
                        {month.revenue >
                        0
                          ? money(
                              month.revenue
                            )
                          : "CHF 0"}
                      </div>

                      <div
                        style={{
                          height: `${height}%`,
                          minHeight: 5,
                          borderRadius:
                            "10px 10px 4px 4px",
                          background:
                            current
                              ? "linear-gradient(180deg,#38bdf8,#6366f1,#7c3aed)"
                              : "linear-gradient(180deg,rgba(56,189,248,.62),rgba(99,102,241,.40))",
                          boxShadow:
                            current
                              ? "0 0 28px rgba(99,102,241,.13)"
                              : "none",
                        }}
                      />

                      <div
                        style={{
                          color: current
                            ? "#7dd3fc"
                            : "#475569",
                          textAlign:
                            "center",
                          fontSize: 8,
                          fontWeight:
                            900,
                          marginTop: 8,
                          textTransform:
                            "uppercase",
                        }}
                      >
                        {month.label}
                      </div>
                    </div>
                  );
                }
              )}
            </div>

            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                gap: 15,
                marginTop: 20,
                paddingTop: 15,
                borderTop:
                  "1px solid rgba(148,163,184,.07)",
              }}
            >
              <div>
                <div style={miniLabel}>
                  Ø PRO MONAT
                </div>

                <strong
                  style={{
                    color: "#cbd5e1",
                    fontSize: 14,
                  }}
                >
                  {money(
                    averageMonthlyRevenue
                  )}
                </strong>
              </div>

              <div
                style={{
                  textAlign: "right",
                }}
              >
                <div style={miniLabel}>
                  AKTUELL
                </div>

                <strong
                  style={{
                    color:
                      revenueChange >= 0
                        ? "#86efac"
                        : "#fca5a5",
                    fontSize: 14,
                  }}
                >
                  {revenueChange >= 0
                    ? "+"
                    : ""}
                  {Math.round(
                    revenueChange
                  )}
                  %
                </strong>
              </div>
            </div>
          </section>

          <section
            className="analytics-card"
            style={{
              padding: 24,
              borderRadius: 22,
              border:
                "1px solid rgba(167,139,250,.11)",
              background:
                "linear-gradient(145deg,rgba(13,18,44,.95),rgba(31,22,67,.80))",
            }}
          >
            <div style={eyebrow}>
              MONEY TO COLLECT
            </div>

            <h2 style={sectionTitle}>
              Forderungen
            </h2>

            <div
              style={{
                color:
                  openInvoiceAmount >
                    0
                    ? "#7dd3fc"
                    : "#86efac",
                fontSize: 34,
                fontWeight: 950,
                letterSpacing:
                  "-.04em",
                marginTop: 16,
              }}
            >
              {money(
                openInvoiceAmount
              )}
            </div>

            <div
              style={{
                marginTop: 23,
              }}
            >
              <Progress
                label="Eingezogen"
                value={
                  collectionRate
                }
                color="#86efac"
              />
            </div>

            <MetricRow
              label="Offene Rechnungen"
              value={String(
                activeInvoices.length
              )}
            />

            <MetricRow
              label="Überfällig"
              value={money(
                overdueAmount
              )}
              color={
                overdueAmount > 0
                  ? "#fca5a5"
                  : "#86efac"
              }
            />

            <MetricRow
              label="Bereits bezahlt"
              value={money(
                paidTotal
              )}
              color="#86efac"
            />

            <Link
              href="/portal/business/rechnungen"
              className="analytics-link"
              style={{
                display:
                  "inline-flex",
                marginTop: 18,
                color: "#7dd3fc",
                fontSize: 9,
                fontWeight: 900,
                textDecoration:
                  "none",
              }}
            >
              Forderungen verwalten →
            </Link>
          </section>
        </div>

        <div
          className="analytics-kpis"
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(4,minmax(0,1fr))",
            gap: 12,
            marginTop: 14,
          }}
        >
          <KPI
            eyebrow="ABSCHLUSSQUOTE"
            value={percent(
              conversionRate
            )}
            sub={`${acceptedQuotes.length} angenommen`}
            color={
              conversionRate >=
              30
                ? "#86efac"
                : "#fbbf24"
            }
            icon="✓"
          />

          <KPI
            eyebrow="GEWONNENER WERT"
            value={money(
              acceptedValue
            )}
            sub="Angenommene Offerten"
            color="#86efac"
            icon="◆"
          />

          <KPI
            eyebrow="KUNDEN"
            value={String(
              customerCount
            )}
            sub="Im Business CRM"
            color="#7dd3fc"
            icon="◎"
          />

          <KPI
            eyebrow="ZAHLUNGEN DIESEN MONAT"
            value={String(
              currentMonthPayments.length
            )}
            sub={money(
              currentRevenue
            )}
            color="#c4b5fd"
            icon="↗"
          />
        </div>

        <div
          className="analytics-main-grid"
          style={{
            display: "grid",
            gridTemplateColumns:
              "minmax(0,1fr) minmax(0,1fr)",
            gap: 14,
            marginTop: 14,
          }}
        >
          <section
            className="analytics-card"
            style={panel}
          >
            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                gap: 10,
                alignItems:
                  "center",
              }}
            >
              <div>
                <div style={eyebrow}>
                  SALES PIPELINE
                </div>

                <h2
                  style={{
                    ...sectionTitle,
                    fontSize: 22,
                  }}
                >
                  Offerten
                </h2>
              </div>

              <Link
                href="/portal/business/offerten"
                style={smallLink}
              >
                Alle →
              </Link>
            </div>

            <MetricRow
              label="Offen"
              value={`${openQuotes.length} · ${money(
                pipelineValue
              )}`}
              color="#c4b5fd"
            />

            <MetricRow
              label="Angenommen"
              value={String(
                acceptedQuotes.length
              )}
              color="#86efac"
            />

            <MetricRow
              label="Abgelehnt"
              value={String(
                declinedQuotes.length
              )}
              color={
                declinedQuotes.length >
                0
                  ? "#fca5a5"
                  : "#64748b"
              }
            />

            <div
              style={{
                marginTop: 15,
                display: "grid",
                gap: 7,
              }}
            >
              {recentQuotes.map(
                (quote) => (
                  <Link
                    key={quote.id}
                    href={`/portal/business/offerten/${quote.id}`}
                    style={listRow}
                  >
                    <div
                      style={{
                        minWidth: 0,
                      }}
                    >
                      <strong
                        style={{
                          fontSize: 10,
                        }}
                      >
                        {quote.customerName ||
                          quote.title}
                      </strong>

                      <div
                        style={{
                          color:
                            "#475569",
                          fontSize: 7,
                          marginTop: 3,
                        }}
                      >
                        {
                          quote.quoteNumber
                        }
                      </div>
                    </div>

                    <div
                      style={{
                        textAlign:
                          "right",
                      }}
                    >
                      <strong
                        style={{
                          color:
                            "#c4b5fd",
                          fontSize: 9,
                        }}
                      >
                        {money(
                          quote.totalCents
                        )}
                      </strong>

                      <div
                        style={{
                          color:
                            "#64748b",
                          fontSize: 7,
                          marginTop: 3,
                        }}
                      >
                        {quote.status}
                      </div>
                    </div>
                  </Link>
                )
              )}
            </div>
          </section>

          <section
            className="analytics-card"
            style={panel}
          >
            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                gap: 10,
                alignItems:
                  "center",
              }}
            >
              <div>
                <div style={eyebrow}>
                  CASH COLLECTION
                </div>

                <h2
                  style={{
                    ...sectionTitle,
                    fontSize: 22,
                  }}
                >
                  Rechnungen
                </h2>
              </div>

              <Link
                href="/portal/business/rechnungen"
                style={smallLink}
              >
                Alle →
              </Link>
            </div>

            <div
              style={{
                marginTop: 17,
              }}
            >
              <Progress
                label="Collection Rate"
                value={
                  collectionRate
                }
                color="#86efac"
              />
            </div>

            <div
              style={{
                marginTop: 15,
                display: "grid",
                gap: 7,
              }}
            >
              {recentInvoices.map(
                (invoice) => {
                  const remaining =
                    Math.max(
                      0,
                      invoice.totalCents -
                        (invoice.paidAmountCents ||
                          0)
                    );

                  return (
                    <Link
                      key={
                        invoice.id
                      }
                      href={`/portal/business/rechnungen/${invoice.id}`}
                      style={listRow}
                    >
                      <div
                        style={{
                          minWidth: 0,
                        }}
                      >
                        <strong
                          style={{
                            fontSize:
                              10,
                          }}
                        >
                          {invoice.customerName ||
                            invoice.invoiceNumber}
                        </strong>

                        <div
                          style={{
                            color:
                              "#475569",
                            fontSize:
                              7,
                            marginTop:
                              3,
                          }}
                        >
                          {
                            invoice.invoiceNumber
                          }
                        </div>
                      </div>

                      <div
                        style={{
                          textAlign:
                            "right",
                        }}
                      >
                        <strong
                          style={{
                            color:
                              remaining >
                              0
                                ? "#7dd3fc"
                                : "#86efac",
                            fontSize:
                              9,
                          }}
                        >
                          {money(
                            remaining >
                              0
                              ? remaining
                              : invoice.totalCents
                          )}
                        </strong>

                        <div
                          style={{
                            color:
                              "#64748b",
                            fontSize:
                              7,
                            marginTop:
                              3,
                          }}
                        >
                          {
                            invoice.status
                          }
                        </div>
                      </div>
                    </Link>
                  );
                }
              )}
            </div>
          </section>
        </div>

        <section
          className="analytics-card"
          style={{
            marginTop: 14,
            padding: 24,
            borderRadius: 22,
            border:
              "1px solid rgba(34,197,94,.09)",
            background:
              collectionRate >= 90
                ? "linear-gradient(135deg,rgba(8,34,34,.72),rgba(7,23,39,.87))"
                : "linear-gradient(135deg,rgba(48,31,13,.42),rgba(7,23,39,.87))",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent:
                "space-between",
              gap: 20,
              alignItems:
                "center",
              flexWrap: "wrap",
            }}
          >
            <div>
              <div style={eyebrow}>
                AUFTRAGO BUSINESS HEALTH
              </div>

              <h2
                style={{
                  margin: "7px 0 5px",
                  fontSize: 26,
                  letterSpacing:
                    "-.035em",
                }}
              >
                {overdueAmount ===
                  0 &&
                openInvoiceAmount ===
                  0
                  ? "Finanzen sehen sauber aus."
                  : overdueAmount >
                    0
                  ? "Offene Forderungen brauchen Aufmerksamkeit."
                  : "Cashflow unter Kontrolle halten."}
              </h2>

              <p
                style={{
                  margin: 0,
                  color: "#64748b",
                  fontSize: 10,
                  lineHeight: 1.6,
                }}
              >
                Auftrago bewertet Umsatz,
                Forderungen und Vertrieb
                anhand deiner aktuellen
                Business-Daten.
              </p>
            </div>

            <div
              style={{
                display: "flex",
                gap: 8,
                flexWrap: "wrap",
              }}
            >
              <HealthPill
                label="COLLECTION"
                value={percent(
                  collectionRate
                )}
                good={
                  collectionRate >=
                  90
                }
              />

              <HealthPill
                label="ABSCHLUSS"
                value={percent(
                  conversionRate
                )}
                good={
                  conversionRate >=
                  30
                }
              />

              <HealthPill
                label="ÜBERFÄLLIG"
                value={money(
                  overdueAmount
                )}
                good={
                  overdueAmount ===
                  0
                }
              />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function KPI({
  eyebrow: label,
  value,
  sub,
  color,
  icon,
}: {
  eyebrow: string;
  value: string;
  sub: string;
  color: string;
  icon: string;
}) {
  return (
    <div
      className="analytics-card"
      style={{
        minWidth: 0,
        padding: 19,
        borderRadius: 18,
        border:
          "1px solid rgba(148,163,184,.08)",
        background:
          "linear-gradient(145deg,rgba(7,18,35,.93),rgba(13,22,45,.78))",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          gap: 10,
        }}
      >
        <div style={miniLabel}>
          {label}
        </div>

        <div
          style={{
            width: 29,
            height: 29,
            borderRadius: 9,
            display: "grid",
            placeItems: "center",
            background: `${color}10`,
            color,
            fontSize: 10,
            fontWeight: 950,
          }}
        >
          {icon}
        </div>
      </div>

      <div
        style={{
          color,
          marginTop: 14,
          fontSize: 24,
          fontWeight: 950,
          letterSpacing: "-.035em",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {value}
      </div>

      <div
        style={{
          color: "#64748b",
          fontSize: 8,
          marginTop: 6,
        }}
      >
        {sub}
      </div>
    </div>
  );
}

function Progress({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  const safe =
    Math.min(
      100,
      Math.max(0, value)
    );

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          gap: 10,
          color: "#64748b",
          fontSize: 8,
        }}
      >
        <span>{label}</span>

        <strong
          style={{
            color,
          }}
        >
          {percent(safe)}
        </strong>
      </div>

      <div
        style={{
          height: 7,
          marginTop: 7,
          borderRadius: 999,
          background:
            "rgba(148,163,184,.08)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${safe}%`,
            height: "100%",
            borderRadius: 999,
            background:
              `linear-gradient(90deg,${color},#38bdf8)`,
          }}
        />
      </div>
    </div>
  );
}

function MetricRow({
  label,
  value,
  color = "#cbd5e1",
}: {
  label: string;
  value: string;
  color?: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent:
          "space-between",
        gap: 12,
        padding: "13px 0",
        borderBottom:
          "1px solid rgba(148,163,184,.07)",
        fontSize: 9,
      }}
    >
      <span
        style={{
          color: "#64748b",
        }}
      >
        {label}
      </span>

      <strong
        style={{
          color,
        }}
      >
        {value}
      </strong>
    </div>
  );
}

function HealthPill({
  label,
  value,
  good,
}: {
  label: string;
  value: string;
  good: boolean;
}) {
  const color =
    good
      ? "#86efac"
      : "#fbbf24";

  return (
    <div
      style={{
        minWidth: 95,
        padding: "10px 13px",
        borderRadius: 12,
        border:
          `1px solid ${color}16`,
        background:
          `${color}08`,
      }}
    >
      <div
        style={{
          color: "#64748b",
          fontSize: 7,
          fontWeight: 950,
          letterSpacing:
            ".07em",
        }}
      >
        {label}
      </div>

      <div
        style={{
          color,
          fontSize: 14,
          fontWeight: 950,
          marginTop: 4,
        }}
      >
        {value}
      </div>
    </div>
  );
}

const panel = {
  padding: 22,
  borderRadius: 20,
  border:
    "1px solid rgba(148,163,184,.08)",
  background:
    "rgba(7,18,35,.88)",
} as const;

const eyebrow = {
  color: "#7dd3fc",
  fontSize: 8,
  fontWeight: 950,
  letterSpacing: ".09em",
} as const;

const miniLabel = {
  color: "#64748b",
  fontSize: 7,
  fontWeight: 950,
  letterSpacing: ".08em",
} as const;

const sectionTitle = {
  margin: "7px 0 3px",
  fontSize: 27,
  letterSpacing: "-.035em",
} as const;

const sectionSub = {
  color: "#64748b",
  fontSize: 9,
} as const;

const topButton = {
  minHeight: 40,
  display: "inline-flex",
  alignItems: "center",
  padding: "0 14px",
  borderRadius: 10,
  border:
    "1px solid rgba(148,163,184,.10)",
  background:
    "rgba(15,23,42,.44)",
  color: "#cbd5e1",
  textDecoration: "none",
  fontSize: 9,
  fontWeight: 900,
} as const;

const smallLink = {
  color: "#7dd3fc",
  textDecoration: "none",
  fontSize: 8,
  fontWeight: 900,
} as const;

const listRow = {
  display: "flex",
  justifyContent:
    "space-between",
  alignItems: "center",
  gap: 12,
  padding: 11,
  borderRadius: 11,
  border:
    "1px solid rgba(148,163,184,.06)",
  background:
    "rgba(2,6,23,.24)",
  color: "#cbd5e1",
  textDecoration: "none",
} as const;
