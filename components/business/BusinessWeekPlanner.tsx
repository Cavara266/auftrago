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

const dayName = (date: Date) =>
  new Intl.DateTimeFormat("de-CH", {
    weekday: "short",
  }).format(date);

const dayNumber = (date: Date) =>
  new Intl.DateTimeFormat("de-CH", {
    day: "2-digit",
    month: "2-digit",
  }).format(date);

function startOfDay(date: Date) {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    0,
    0,
    0,
    0
  );
}

function sameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export default async function BusinessWeekPlanner() {
  const user = await getCurrentUser();

  if (!user) return null;

  const today = startOfDay(new Date());

  const monday = new Date(today);
  const day = monday.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  monday.setDate(monday.getDate() + diff);

  const weekEnd = new Date(monday);
  weekEnd.setDate(weekEnd.getDate() + 7);

  const tasks =
    await prisma.businessWorkflowTask.findMany({
      where: {
        providerId: user.id,
        status: {
          not: "DONE",
        },
      },
      orderBy: [
        {
          dueAt: "asc",
        },
        {
          createdAt: "desc",
        },
      ],
      take: 100,
    });

  const days = Array.from(
    { length: 7 },
    (_, index) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + index);

      return date;
    }
  );

  const overdueTasks = tasks.filter(
    (task) =>
      task.dueAt &&
      startOfDay(task.dueAt) < today
  );

  const plannedTasks = tasks.filter(
    (task) =>
      task.dueAt &&
      task.dueAt >= monday &&
      task.dueAt < weekEnd
  );

  const unscheduledTasks = tasks.filter(
    (task) => !task.dueAt
  );

  const weekValue = plannedTasks.reduce(
    (sum, task) =>
      sum + (task.valueCents || 0),
    0
  );

  return (
    <>
      <style>{`
        .planner-day {
          transition:
            transform .18s ease,
            border-color .18s ease,
            background .18s ease,
            box-shadow .18s ease;
        }

        .planner-day:hover {
          transform: translateY(-3px);
          border-color: rgba(125,211,252,.18) !important;
          box-shadow: 0 18px 48px rgba(2,6,23,.20);
        }

        .planner-task {
          transition:
            transform .16s ease,
            background .16s ease,
            border-color .16s ease;
        }

        .planner-task:hover {
          transform: translateX(2px);
          background: rgba(30,41,59,.44) !important;
          border-color: rgba(125,211,252,.12) !important;
        }

        @media(max-width:1150px) {
          .planner-week-grid {
            grid-template-columns:
              repeat(4,minmax(0,1fr)) !important;
          }
        }

        @media(max-width:850px) {
          .planner-week-grid {
            grid-template-columns:
              repeat(2,minmax(0,1fr)) !important;
          }

          .planner-summary-grid {
            grid-template-columns:
              repeat(2,minmax(0,1fr)) !important;
          }
        }

        @media(max-width:560px) {
          .planner-week-grid,
          .planner-summary-grid {
            grid-template-columns:
              minmax(0,1fr) !important;
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
            "linear-gradient(145deg,rgba(7,18,35,.96),rgba(18,19,48,.90))",
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,.025)",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: 340,
            height: 340,
            borderRadius: "50%",
            right: -150,
            bottom: -180,
            background:
              "rgba(124,58,237,.08)",
            filter: "blur(90px)",
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
              justifyContent: "space-between",
              alignItems: "end",
              gap: 20,
              flexWrap: "wrap",
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
                AUFTRAGO PLANNER
              </div>

              <h2
                style={{
                  margin: "7px 0 5px",
                  fontSize:
                    "clamp(26px,3vw,36px)",
                  letterSpacing: "-.04em",
                }}
              >
                Wochen- & Einsatzplanung
              </h2>

              <p
                style={{
                  margin: 0,
                  color: "#64748b",
                  fontSize: 12,
                  lineHeight: 1.6,
                }}
              >
                Aufgaben, Follow-ups und offene Arbeiten
                nach Fälligkeit organisiert.
              </p>
            </div>

            <div
              style={{
                padding: "10px 14px",
                borderRadius: 13,
                border:
                  "1px solid rgba(167,139,250,.12)",
                background:
                  "rgba(124,58,237,.06)",
              }}
            >
              <div
                style={{
                  color: "#64748b",
                  fontSize: 8,
                  fontWeight: 950,
                  letterSpacing: ".08em",
                }}
              >
                WERT DIESER WOCHE
              </div>

              <div
                style={{
                  color: "#c4b5fd",
                  fontSize: 19,
                  fontWeight: 950,
                  marginTop: 4,
                }}
              >
                {money(weekValue)}
              </div>
            </div>
          </div>

          <div
            className="planner-summary-grid"
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(4,minmax(0,1fr))",
              gap: 10,
              marginTop: 20,
            }}
          >
            <Summary
              label="DIESE WOCHE"
              value={plannedTasks.length}
              color="#7dd3fc"
            />

            <Summary
              label="ÜBERFÄLLIG"
              value={overdueTasks.length}
              color={
                overdueTasks.length > 0
                  ? "#fca5a5"
                  : "#86efac"
              }
            />

            <Summary
              label="OHNE TERMIN"
              value={unscheduledTasks.length}
              color="#fbbf24"
            />

            <Summary
              label="HEUTE"
              value={
                plannedTasks.filter(
                  (task) =>
                    task.dueAt &&
                    sameDay(task.dueAt, today)
                ).length
              }
              color="#86efac"
            />
          </div>

          {overdueTasks.length > 0 && (
            <div
              style={{
                marginTop: 18,
                padding: 14,
                borderRadius: 15,
                border:
                  "1px solid rgba(248,113,113,.12)",
                background:
                  "linear-gradient(90deg,rgba(239,68,68,.05),rgba(2,6,23,.22))",
              }}
            >
              <div
                style={{
                  color: "#fca5a5",
                  fontSize: 9,
                  fontWeight: 950,
                  letterSpacing: ".08em",
                }}
              >
                ! ÜBERFÄLLIGE AUFGABEN
              </div>

              <div
                style={{
                  display: "flex",
                  gap: 8,
                  flexWrap: "wrap",
                  marginTop: 10,
                }}
              >
                {overdueTasks
                  .slice(0, 5)
                  .map((task) => (
                    <Link
                      key={task.id}
                      href={task.href || "#"}
                      style={{
                        padding: "8px 10px",
                        borderRadius: 9,
                        border:
                          "1px solid rgba(248,113,113,.09)",
                        background:
                          "rgba(2,6,23,.30)",
                        color: "#cbd5e1",
                        textDecoration: "none",
                        fontSize: 9,
                        fontWeight: 850,
                      }}
                    >
                      {task.title}
                    </Link>
                  ))}
              </div>
            </div>
          )}

          <div
            className="planner-week-grid"
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(7,minmax(0,1fr))",
              gap: 10,
              marginTop: 18,
            }}
          >
            {days.map((date) => {
              const isToday =
                sameDay(date, today);

              const dayTasks =
                plannedTasks.filter(
                  (task) =>
                    task.dueAt &&
                    sameDay(
                      task.dueAt,
                      date
                    )
                );

              return (
                <section
                  key={date.toISOString()}
                  className="planner-day"
                  style={{
                    minWidth: 0,
                    minHeight: 230,
                    padding: 12,
                    borderRadius: 16,
                    border: isToday
                      ? "1px solid rgba(56,189,248,.22)"
                      : "1px solid rgba(148,163,184,.08)",
                    background: isToday
                      ? "linear-gradient(145deg,rgba(14,165,233,.07),rgba(15,23,42,.45))"
                      : "rgba(2,6,23,.25)",
                    boxShadow: isToday
                      ? "inset 0 0 30px rgba(14,165,233,.035)"
                      : "none",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 8,
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          color: isToday
                            ? "#7dd3fc"
                            : "#64748b",
                          fontSize: 8,
                          fontWeight: 950,
                          textTransform: "uppercase",
                        }}
                      >
                        {dayName(date)}
                      </div>

                      <div
                        style={{
                          fontSize: 16,
                          fontWeight: 950,
                          marginTop: 2,
                        }}
                      >
                        {dayNumber(date)}
                      </div>
                    </div>

                    {isToday && (
                      <div
                        style={{
                          width: 7,
                          height: 7,
                          borderRadius: "50%",
                          background: "#38bdf8",
                          boxShadow:
                            "0 0 13px rgba(56,189,248,.8)",
                        }}
                      />
                    )}
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gap: 7,
                      marginTop: 12,
                    }}
                  >
                    {dayTasks.length ===
                      0 && (
                      <div
                        style={{
                          padding:
                            "18px 5px",
                          color:
                            "#334155",
                          fontSize: 8,
                          textAlign:
                            "center",
                        }}
                      >
                        Keine Aufgaben
                      </div>
                    )}

                    {dayTasks
                      .slice(0, 5)
                      .map((task) => {
                        const accent =
                          task.priority ===
                          "CRITICAL"
                            ? "#fca5a5"
                            : task.priority ===
                              "HIGH"
                            ? "#fbbf24"
                            : task.priority ===
                              "LOW"
                            ? "#94a3b8"
                            : "#7dd3fc";

                        return (
                          <Link
                            key={task.id}
                            href={
                              task.href ||
                              "#"
                            }
                            className="planner-task"
                            style={{
                              display:
                                "block",
                              padding:
                                "9px 9px",
                              borderRadius:
                                10,
                              border:
                                "1px solid rgba(148,163,184,.06)",
                              background:
                                "rgba(8,19,37,.52)",
                              textDecoration:
                                "none",
                              color:
                                "inherit",
                              borderLeft:
                                `2px solid ${accent}`,
                            }}
                          >
                            <div
                              style={{
                                fontSize:
                                  9,
                                fontWeight:
                                  900,
                                lineHeight:
                                  1.35,
                              }}
                            >
                              {
                                task.title
                              }
                            </div>

                            {task.assigneeName && (
                              <div
                                style={{
                                  color:
                                    "#64748b",
                                  fontSize:
                                    7,
                                  marginTop:
                                    5,
                                }}
                              >
                                ◎{" "}
                                {
                                  task.assigneeName
                                }
                              </div>
                            )}

                            {task.valueCents >
                              0 && (
                              <div
                                style={{
                                  color:
                                    accent,
                                  fontSize:
                                    8,
                                  fontWeight:
                                    900,
                                  marginTop:
                                    5,
                                }}
                              >
                                {money(
                                  task.valueCents
                                )}
                              </div>
                            )}
                          </Link>
                        );
                      })}

                    {dayTasks.length >
                      5 && (
                      <div
                        style={{
                          color:
                            "#64748b",
                          fontSize: 7,
                          textAlign:
                            "center",
                        }}
                      >
                        +{" "}
                        {dayTasks.length -
                          5}{" "}
                        weitere
                      </div>
                    )}
                  </div>
                </section>
              );
            })}
          </div>

          {unscheduledTasks.length > 0 && (
            <div
              style={{
                marginTop: 18,
                padding: 16,
                borderRadius: 16,
                border:
                  "1px solid rgba(251,191,36,.10)",
                background:
                  "rgba(251,191,36,.025)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  gap: 12,
                  alignItems:
                    "center",
                  flexWrap: "wrap",
                }}
              >
                <div>
                  <div
                    style={{
                      color:
                        "#fbbf24",
                      fontSize: 9,
                      fontWeight:
                        950,
                      letterSpacing:
                        ".08em",
                    }}
                  >
                    OHNE TERMIN
                  </div>

                  <div
                    style={{
                      color:
                        "#64748b",
                      fontSize: 9,
                      marginTop: 4,
                    }}
                  >
                    Diese Aufgaben brauchen noch ein Fälligkeitsdatum.
                  </div>
                </div>

                <div
                  style={{
                    color:
                      "#fbbf24",
                    fontSize: 16,
                    fontWeight:
                      950,
                  }}
                >
                  {
                    unscheduledTasks.length
                  }
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

function Summary({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div
      style={{
        padding: 14,
        borderRadius: 14,
        border:
          "1px solid rgba(148,163,184,.08)",
        background:
          "rgba(2,6,23,.27)",
      }}
    >
      <div
        style={{
          color: "#64748b",
          fontSize: 8,
          fontWeight: 950,
          letterSpacing: ".08em",
        }}
      >
        {label}
      </div>

      <div
        style={{
          color,
          fontSize: 21,
          fontWeight: 950,
          marginTop: 5,
        }}
      >
        {value}
      </div>
    </div>
  );
}
