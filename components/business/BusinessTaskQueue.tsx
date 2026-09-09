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

const formatDate = (date: Date | null) => {
  if (!date) return "Kein Datum";

  return new Intl.DateTimeFormat("de-CH", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
};

type Task = {
  id: string;
  priority: number;
  priorityLabel: "KRITISCH" | "HOCH" | "MITTEL";
  category: string;
  title: string;
  description: string;
  value?: string;
  href: string;
  action: string;
  icon: string;
  accent: string;
};

export default async function BusinessTaskQueue() {
  const user = await getCurrentUser();

  if (!user) return null;

  const now = new Date();

  const followupThreshold = new Date(now);
  followupThreshold.setDate(
    followupThreshold.getDate() - 3
  );

  const recentAcceptedThreshold = new Date(now);
  recentAcceptedThreshold.setDate(
    recentAcceptedThreshold.getDate() - 14
  );

  const [
    invoices,
    followupQuotes,
    acceptedQuotes,
  ] = await Promise.all([
    prisma.businessInvoice.findMany({
      where: {
        providerId: user.id,
        status: {
          in: ["SENT", "OPEN", "OVERDUE"],
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
      take: 20,
    }),

    prisma.businessQuote.findMany({
      where: {
        providerId: user.id,
        status: {
          in: ["SENT", "OPEN"],
        },
        createdAt: {
          lte: followupThreshold,
        },
      },
      select: {
        id: true,
        quoteNumber: true,
        customerName: true,
        title: true,
        totalCents: true,
        createdAt: true,
        sentAt: true,
      },
      orderBy: {
        createdAt: "asc",
      },
      take: 20,
    }),

    prisma.businessQuote.findMany({
      where: {
        providerId: user.id,
        status: "ACCEPTED",
        acceptedAt: {
          gte: recentAcceptedThreshold,
        },
      },
      select: {
        id: true,
        quoteNumber: true,
        customerName: true,
        title: true,
        totalCents: true,
        acceptedAt: true,
      },
      orderBy: {
        acceptedAt: "desc",
      },
      take: 12,
    }),
  ]);

  const tasks: Task[] = [];

  // ========================================================
  // RECHNUNGEN
  // ========================================================

  for (const invoice of invoices) {
    const remaining = Math.max(
      0,
      invoice.totalCents -
        (invoice.paidAmountCents || 0)
    );

    if (remaining <= 0) continue;

    const overdue =
      invoice.status === "OVERDUE" ||
      (
        invoice.dueAt &&
        invoice.dueAt < now
      );

    if (overdue) {
      const overdueDays =
        invoice.dueAt
          ? Math.max(
              1,
              Math.floor(
                (
                  now.getTime() -
                  invoice.dueAt.getTime()
                ) /
                  86400000
              )
            )
          : 1;

      tasks.push({
        id: `invoice-${invoice.id}`,
        priority:
          overdueDays >= 14 ? 100 : 90,
        priorityLabel:
          overdueDays >= 14
            ? "KRITISCH"
            : "HOCH",
        category: "FORDERUNG",
        title:
          invoice.customerName ||
          invoice.invoiceNumber,
        description:
          `${invoice.invoiceNumber} · ${overdueDays} Tag(e) überfällig`,
        value: money(remaining),
        href:
          `/portal/business/rechnungen/${invoice.id}`,
        action: "Zahlung einziehen",
        icon: "!",
        accent: "#fca5a5",
      });
    }
  }

  // ========================================================
  // OFFER TEN NACHFASSEN
  // ========================================================

  for (const quote of followupQuotes) {
    const baseDate =
      quote.sentAt ||
      quote.createdAt;

    const daysOpen = Math.max(
      3,
      Math.floor(
        (
          now.getTime() -
          baseDate.getTime()
        ) /
          86400000
      )
    );

    tasks.push({
      id: `followup-${quote.id}`,
      priority:
        daysOpen >= 7 ? 80 : 65,
      priorityLabel:
        daysOpen >= 7
          ? "HOCH"
          : "MITTEL",
      category: "VERKAUF",
      title:
        quote.customerName ||
        quote.title,
      description:
        `${quote.quoteNumber} · seit ${daysOpen} Tagen offen`,
      value: money(
        quote.totalCents
      ),
      href:
        `/portal/business/offerten/${quote.id}`,
      action: "Offerte nachfassen",
      icon: "◇",
      accent: "#7dd3fc",
    });
  }

  // ========================================================
  // ANGENOMMENE OFFER TEN
  // ========================================================

  for (const quote of acceptedQuotes) {
    tasks.push({
      id: `accepted-${quote.id}`,
      priority: 55,
      priorityLabel: "MITTEL",
      category: "AUFTRAG",
      title:
        quote.customerName ||
        quote.title,
      description:
        `${quote.quoteNumber} · angenommen ${formatDate(
          quote.acceptedAt
        )}`,
      value: money(
        quote.totalCents
      ),
      href:
        `/portal/business/offerten/${quote.id}`,
      action: "Auftrag vorbereiten",
      icon: "✓",
      accent: "#86efac",
    });
  }

  tasks.sort(
    (a, b) =>
      b.priority - a.priority
  );

  const visibleTasks =
    tasks.slice(0, 8);

  const criticalCount =
    tasks.filter(
      (task) =>
        task.priorityLabel ===
        "KRITISCH"
    ).length;

  const highCount =
    tasks.filter(
      (task) =>
        task.priorityLabel === "HOCH"
    ).length;

  const salesValue =
    followupQuotes.reduce(
      (sum, quote) =>
        sum + quote.totalCents,
      0
    );

  return (
    <>
      <style>{`
        .business-task-row {
          transition:
            transform .18s ease,
            background .18s ease,
            border-color .18s ease,
            box-shadow .18s ease;
        }

        .business-task-row:hover {
          transform: translateX(4px);
          background: rgba(30,41,59,.38) !important;
          border-color: rgba(125,211,252,.14) !important;
          box-shadow: 0 12px 35px rgba(2,6,23,.16);
        }

        .business-task-action {
          transition:
            transform .18s ease,
            border-color .18s ease,
            background .18s ease;
        }

        .business-task-action:hover {
          transform: translateY(-2px);
          border-color: rgba(125,211,252,.25) !important;
          background: rgba(30,41,59,.60) !important;
        }

        @media(max-width:900px) {
          .business-task-header-grid {
            grid-template-columns:1fr !important;
          }
        }

        @media(max-width:700px) {
          .business-task-row-grid {
            grid-template-columns:
              38px minmax(0,1fr) !important;
          }

          .business-task-value {
            grid-column:2;
            text-align:left !important;
          }

          .business-task-button-wrapper {
            grid-column:2;
          }
        }
      `}</style>

      <section
        style={{
          position: "relative",
          overflow: "hidden",
          padding: 26,
          borderRadius: 24,
          border:
            "1px solid rgba(125,211,252,.11)",
          background:
            "linear-gradient(145deg,rgba(7,18,35,.96),rgba(15,20,47,.88))",
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,.025)",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: 320,
            height: 320,
            borderRadius: "50%",
            background:
              "rgba(124,58,237,.07)",
            filter: "blur(80px)",
            right: -130,
            top: -160,
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
            className="business-task-header-grid"
            style={{
              display: "grid",
              gridTemplateColumns:
                "minmax(0,1fr) auto",
              gap: 22,
              alignItems: "end",
            }}
          >
            <div>
              <div
                style={{
                  color: "#7dd3fc",
                  fontSize: 10,
                  fontWeight: 950,
                  letterSpacing:
                    ".10em",
                }}
              >
                AUFTRAGO ACTION QUEUE
              </div>

              <h2
                style={{
                  margin: "7px 0 5px",
                  fontSize:
                    "clamp(26px,3vw,36px)",
                  letterSpacing:
                    "-.04em",
                }}
              >
                Deine nächsten besten Aktionen
              </h2>

              <p
                style={{
                  margin: 0,
                  color: "#64748b",
                  fontSize: 12,
                  lineHeight: 1.6,
                }}
              >
                Automatisch priorisiert nach
                offenen Zahlungen, Verkaufschancen
                und gewonnenen Aufträgen.
              </p>
            </div>

            <div
              style={{
                display: "flex",
                gap: 9,
                flexWrap: "wrap",
              }}
            >
              <StatPill
                label="KRITISCH"
                value={criticalCount}
                color="#fca5a5"
              />

              <StatPill
                label="HOCH"
                value={highCount}
                color="#fbbf24"
              />

              <StatPill
                label="PIPELINE"
                value={money(
                  salesValue
                )}
                color="#c4b5fd"
              />
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gap: 7,
              marginTop: 22,
            }}
          >
            {visibleTasks.length ===
              0 && (
              <div
                style={{
                  padding:
                    "35px 20px",
                  textAlign: "center",
                  borderRadius: 18,
                  border:
                    "1px solid rgba(34,197,94,.10)",
                  background:
                    "rgba(34,197,94,.035)",
                }}
              >
                <div
                  style={{
                    width: 45,
                    height: 45,
                    borderRadius: 14,
                    display: "grid",
                    placeItems: "center",
                    margin: "0 auto",
                    background:
                      "rgba(34,197,94,.08)",
                    color: "#86efac",
                    fontSize: 18,
                    fontWeight: 950,
                  }}
                >
                  ✓
                </div>

                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 900,
                    marginTop: 12,
                  }}
                >
                  Keine dringenden Aufgaben
                </div>

                <div
                  style={{
                    color: "#64748b",
                    fontSize: 10,
                    marginTop: 5,
                  }}
                >
                  Auftrago überwacht deine
                  Rechnungen und Offerten weiter.
                </div>
              </div>
            )}

            {visibleTasks.map(
              (task, index) => (
                <div
                  key={task.id}
                  className="business-task-row business-task-row-grid"
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "38px minmax(0,1fr) auto auto",
                    gap: 13,
                    alignItems: "center",
                    padding: 13,
                    borderRadius: 15,
                    border:
                      "1px solid rgba(148,163,184,.07)",
                    background:
                      index === 0 &&
                      task.priority >=
                        90
                        ? "linear-gradient(90deg,rgba(239,68,68,.055),rgba(2,6,23,.26))"
                        : "rgba(2,6,23,.26)",
                  }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 11,
                      display: "grid",
                      placeItems: "center",
                      background:
                        `${task.accent}12`,
                      border:
                        `1px solid ${task.accent}22`,
                      color:
                        task.accent,
                      fontWeight: 950,
                    }}
                  >
                    {task.icon}
                  </div>

                  <div
                    style={{
                      minWidth: 0,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        gap: 8,
                        flexWrap: "wrap",
                        alignItems:
                          "center",
                      }}
                    >
                      <strong
                        style={{
                          fontSize: 12,
                        }}
                      >
                        {task.title}
                      </strong>

                      <span
                        style={{
                          padding:
                            "3px 6px",
                          borderRadius: 6,
                          background:
                            "rgba(148,163,184,.06)",
                          color:
                            "#64748b",
                          fontSize: 7,
                          fontWeight:
                            950,
                          letterSpacing:
                            ".08em",
                        }}
                      >
                        {task.category}
                      </span>

                      <span
                        style={{
                          padding:
                            "3px 6px",
                          borderRadius: 6,
                          background:
                            `${task.accent}0d`,
                          color:
                            task.accent,
                          fontSize: 7,
                          fontWeight:
                            950,
                          letterSpacing:
                            ".08em",
                        }}
                      >
                        {
                          task.priorityLabel
                        }
                      </span>
                    </div>

                    <div
                      style={{
                        color:
                          "#64748b",
                        fontSize: 9,
                        marginTop: 5,
                        lineHeight: 1.4,
                      }}
                    >
                      {task.description}
                    </div>
                  </div>

                  <div
                    className="business-task-value"
                    style={{
                      textAlign: "right",
                      whiteSpace:
                        "nowrap",
                    }}
                  >
                    {task.value && (
                      <strong
                        style={{
                          color:
                            task.accent,
                          fontSize: 12,
                        }}
                      >
                        {task.value}
                      </strong>
                    )}
                  </div>

                  <div
                    className="business-task-button-wrapper"
                  >
                    <Link
                      href={task.href}
                      className="business-task-action"
                      style={{
                        display:
                          "inline-flex",
                        alignItems:
                          "center",
                        justifyContent:
                          "center",
                        minWidth: 130,
                        minHeight: 36,
                        padding:
                          "0 12px",
                        borderRadius:
                          10,
                        border:
                          "1px solid rgba(125,211,252,.11)",
                        background:
                          "rgba(15,23,42,.50)",
                        color:
                          "#cbd5e1",
                        textDecoration:
                          "none",
                        fontSize: 9,
                        fontWeight:
                          900,
                        whiteSpace:
                          "nowrap",
                      }}
                    >
                      {task.action} →
                    </Link>
                  </div>
                </div>
              )
            )}
          </div>

          {tasks.length > 8 && (
            <div
              style={{
                marginTop: 14,
                color: "#64748b",
                fontSize: 9,
              }}
            >
              + {tasks.length - 8} weitere
              automatisch erkannte Aktionen
            </div>
          )}
        </div>
      </section>
    </>
  );
}

function StatPill({
  label,
  value,
  color,
}: {
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <div
      style={{
        minWidth: 85,
        padding: "9px 12px",
        borderRadius: 12,
        border:
          "1px solid rgba(148,163,184,.08)",
        background:
          "rgba(2,6,23,.30)",
      }}
    >
      <div
        style={{
          color: "#64748b",
          fontSize: 7,
          fontWeight: 950,
          letterSpacing: ".08em",
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
