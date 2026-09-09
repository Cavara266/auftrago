import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

const money = (cents: number) =>
  new Intl.NumberFormat("de-CH", {
    style: "currency",
    currency: "CHF",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100);

function createGoogleMapsRoute(
  locations: string[]
) {
  const clean = locations
    .map((item) => item.trim())
    .filter(Boolean);

  if (clean.length === 0) {
    return null;
  }

  if (clean.length === 1) {
    return (
      "https://www.google.com/maps/search/?api=1&query=" +
      encodeURIComponent(clean[0])
    );
  }

  const origin = clean[0];
  const destination =
    clean[clean.length - 1];

  const waypoints =
    clean.slice(1, -1);

  let url =
    "https://www.google.com/maps/dir/?api=1" +
    "&origin=" +
    encodeURIComponent(origin) +
    "&destination=" +
    encodeURIComponent(destination);

  if (waypoints.length > 0) {
    url +=
      "&waypoints=" +
      encodeURIComponent(
        waypoints.join("|")
      );
  }

  return url;
}

function minutesBetween(
  start: string | null,
  end: string | null
) {
  if (!start || !end) return 0;

  const [sh, sm] = start
    .split(":")
    .map(Number);

  const [eh, em] = end
    .split(":")
    .map(Number);

  const startMinutes =
    sh * 60 + sm;

  const endMinutes =
    eh * 60 + em;

  return Math.max(
    0,
    endMinutes - startMinutes
  );
}

function durationLabel(
  minutes: number
) {
  if (minutes <= 0) return "–";

  const hours =
    Math.floor(minutes / 60);

  const rest =
    minutes % 60;

  if (hours === 0) {
    return `${rest} Min`;
  }

  if (rest === 0) {
    return `${hours} Std`;
  }

  return `${hours} Std ${rest} Min`;
}

export default async function BusinessRoutePlanner() {
  const user =
    await getCurrentUser();

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

  const jobs =
    await prisma.businessJob.findMany({
      where: {
        providerId: user.id,

        scheduledDate: {
          gte: todayStart,
          lt: tomorrowStart,
        },

        status: {
          not: "CANCELLED",
        },
      },

      orderBy: [
        {
          startTime: "asc",
        },
        {
          createdAt: "asc",
        },
      ],
    });

  const routeLocations =
    jobs
      .map((job) => job.location)
      .filter(
        (
          value
        ): value is string =>
          Boolean(value)
      );

  const googleRoute =
    createGoogleMapsRoute(
      routeLocations
    );

  const totalValue =
    jobs.reduce(
      (sum, job) =>
        sum + job.valueCents,
      0
    );

  const totalMinutes =
    jobs.reduce(
      (sum, job) =>
        sum +
        minutesBetween(
          job.startTime,
          job.endTime
        ),
      0
    );

  const employees =
    Array.from(
      new Set(
        jobs
          .map(
            (job) =>
              job.assignedTo
          )
          .filter(
            (
              value
            ): value is string =>
              Boolean(value)
          )
      )
    );

  const employeeStats =
    employees.map((employee) => {
      const employeeJobs =
        jobs.filter(
          (job) =>
            job.assignedTo ===
            employee
        );

      const minutes =
        employeeJobs.reduce(
          (sum, job) =>
            sum +
            minutesBetween(
              job.startTime,
              job.endTime
            ),
          0
        );

      const value =
        employeeJobs.reduce(
          (sum, job) =>
            sum +
            job.valueCents,
          0
        );

      return {
        employee,
        jobs:
          employeeJobs.length,
        minutes,
        value,
      };
    });

  const maxMinutes =
    Math.max(
      480,
      ...employeeStats.map(
        (item) => item.minutes
      )
    );

  return (
    <>
      <style>{`
        .route-stop {
          transition:
            transform .18s ease,
            background .18s ease,
            border-color .18s ease,
            box-shadow .18s ease;
        }

        .route-stop:hover {
          transform: translateX(4px);
          background: rgba(30,41,59,.38) !important;
          border-color: rgba(125,211,252,.14) !important;
          box-shadow: 0 12px 35px rgba(2,6,23,.16);
        }

        .route-employee {
          transition:
            transform .18s ease,
            border-color .18s ease;
        }

        .route-employee:hover {
          transform: translateY(-2px);
          border-color: rgba(125,211,252,.17) !important;
        }

        @media(max-width:950px) {
          .route-main-grid {
            grid-template-columns:1fr !important;
          }
        }

        @media(max-width:650px) {
          .route-stop-grid {
            grid-template-columns:
              38px minmax(0,1fr) !important;
          }

          .route-stop-meta {
            grid-column:2;
          }

          .route-stop-value {
            grid-column:2;
            text-align:left !important;
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
            "linear-gradient(145deg,rgba(7,18,35,.96),rgba(15,20,48,.90))",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: 360,
            height: 360,
            right: -150,
            top: -190,
            borderRadius: "50%",
            background:
              "rgba(14,165,233,.07)",
            filter: "blur(95px)",
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
              alignItems: "end",
              flexWrap: "wrap",
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
                AUFTRAGO ROUTE CONTROL
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
                Heutige Route & Auslastung
              </h2>

              <p
                style={{
                  margin: 0,
                  color: "#64748b",
                  fontSize: 12,
                }}
              >
                Einsätze automatisch nach
                Startzeit sortiert – inklusive
                Route und Team-Auslastung.
              </p>
            </div>

            {googleRoute && (
              <a
                href={googleRoute}
                target="_blank"
                rel="noreferrer"
                style={{
                  minHeight: 42,
                  padding: "0 16px",
                  borderRadius: 12,
                  display: "inline-flex",
                  alignItems: "center",
                  textDecoration: "none",
                  background:
                    "linear-gradient(90deg,#0ea5e9,#6366f1,#7c3aed)",
                  color: "#fff",
                  fontSize: 10,
                  fontWeight: 950,
                  boxShadow:
                    "0 10px 28px rgba(99,102,241,.18)",
                }}
              >
                ◎ Route in Google Maps öffnen →
              </a>
            )}
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(4,minmax(0,1fr))",
              gap: 10,
              marginTop: 20,
            }}
          >
            <Summary
              label="EINSÄTZE HEUTE"
              value={String(jobs.length)}
              color="#7dd3fc"
            />

            <Summary
              label="AUFTRAGSWERT"
              value={money(totalValue)}
              color="#86efac"
            />

            <Summary
              label="GEPLANTE ZEIT"
              value={durationLabel(
                totalMinutes
              )}
              color="#c4b5fd"
            />

            <Summary
              label="TEAM"
              value={String(
                employees.length
              )}
              color="#fbbf24"
            />
          </div>

          <div
            className="route-main-grid"
            style={{
              display: "grid",
              gridTemplateColumns:
                "minmax(0,1.35fr) minmax(300px,.65fr)",
              gap: 15,
              marginTop: 17,
            }}
          >
            <section
              style={{
                padding: 16,
                borderRadius: 18,
                border:
                  "1px solid rgba(148,163,184,.08)",
                background:
                  "rgba(2,6,23,.26)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  gap: 12,
                  alignItems: "center",
                }}
              >
                <div>
                  <div
                    style={{
                      color: "#7dd3fc",
                      fontSize: 9,
                      fontWeight: 950,
                      letterSpacing:
                        ".08em",
                    }}
                  >
                    TAGESROUTE
                  </div>

                  <div
                    style={{
                      color: "#64748b",
                      fontSize: 9,
                      marginTop: 4,
                    }}
                  >
                    Reihenfolge nach Startzeit
                  </div>
                </div>

                <div
                  style={{
                    color: "#64748b",
                    fontSize: 9,
                  }}
                >
                  {routeLocations.length} Orte
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gap: 7,
                  marginTop: 14,
                }}
              >
                {jobs.length === 0 && (
                  <div
                    style={{
                      padding: "30px 15px",
                      textAlign: "center",
                      color: "#475569",
                      fontSize: 10,
                    }}
                  >
                    Heute sind noch keine Einsätze geplant.
                  </div>
                )}

                {jobs.map(
                  (job, index) => (
                    <div
                      key={job.id}
                      className="route-stop route-stop-grid"
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "38px minmax(0,1fr) 135px auto",
                        gap: 12,
                        alignItems: "center",
                        padding: 12,
                        borderRadius: 14,
                        border:
                          "1px solid rgba(148,163,184,.07)",
                        background:
                          "rgba(8,19,37,.52)",
                      }}
                    >
                      <div
                        style={{
                          width: 34,
                          height: 34,
                          display: "grid",
                          placeItems: "center",
                          borderRadius: 11,
                          background:
                            "linear-gradient(135deg,rgba(14,165,233,.12),rgba(124,58,237,.16))",
                          border:
                            "1px solid rgba(125,211,252,.10)",
                          color: "#7dd3fc",
                          fontSize: 11,
                          fontWeight: 950,
                        }}
                      >
                        {index + 1}
                      </div>

                      <div>
                        <div
                          style={{
                            fontSize: 12,
                            fontWeight: 900,
                          }}
                        >
                          {job.title}
                        </div>

                        <div
                          style={{
                            color: "#64748b",
                            fontSize: 9,
                            marginTop: 4,
                          }}
                        >
                          {job.customerName ||
                            "Kein Kunde"}

                          {job.location
                            ? ` · ${job.location}`
                            : ""}
                        </div>
                      </div>

                      <div
                        className="route-stop-meta"
                      >
                        <div
                          style={{
                            color: "#94a3b8",
                            fontSize: 10,
                            fontWeight: 900,
                          }}
                        >
                          {job.startTime ||
                            "--:--"}
                          {job.endTime
                            ? ` – ${job.endTime}`
                            : ""}
                        </div>

                        <div
                          style={{
                            color: "#64748b",
                            fontSize: 8,
                            marginTop: 4,
                          }}
                        >
                          ◎{" "}
                          {job.assignedTo ||
                            "Nicht zugewiesen"}
                        </div>
                      </div>

                      <div
                        className="route-stop-value"
                        style={{
                          textAlign: "right",
                        }}
                      >
                        <strong
                          style={{
                            color: "#86efac",
                            fontSize: 11,
                          }}
                        >
                          {money(
                            job.valueCents
                          )}
                        </strong>

                        <div
                          style={{
                            marginTop: 4,
                            color:
                              job.status ===
                              "DONE"
                                ? "#86efac"
                                : job.status ===
                                  "IN_PROGRESS"
                                ? "#fbbf24"
                                : "#7dd3fc",
                            fontSize: 7,
                            fontWeight: 900,
                          }}
                        >
                          {job.status}
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            </section>

            <section
              style={{
                padding: 16,
                borderRadius: 18,
                border:
                  "1px solid rgba(148,163,184,.08)",
                background:
                  "rgba(2,6,23,.26)",
              }}
            >
              <div
                style={{
                  color: "#7dd3fc",
                  fontSize: 9,
                  fontWeight: 950,
                  letterSpacing: ".08em",
                }}
              >
                TEAM-AUSLASTUNG
              </div>

              <div
                style={{
                  color: "#64748b",
                  fontSize: 9,
                  marginTop: 4,
                }}
              >
                Basierend auf den heutigen Einsatzzeiten
              </div>

              <div
                style={{
                  display: "grid",
                  gap: 9,
                  marginTop: 15,
                }}
              >
                {employeeStats.length ===
                  0 && (
                  <div
                    style={{
                      padding: "25px 10px",
                      textAlign: "center",
                      color: "#475569",
                      fontSize: 9,
                    }}
                  >
                    Noch keine Mitarbeiter zugewiesen.
                  </div>
                )}

                {employeeStats.map(
                  (employee) => {
                    const percent =
                      Math.min(
                        100,
                        Math.round(
                          (employee.minutes /
                            maxMinutes) *
                            100
                        )
                      );

                    const accent =
                      percent >= 90
                        ? "#fca5a5"
                        : percent >= 70
                        ? "#fbbf24"
                        : "#86efac";

                    return (
                      <div
                        key={
                          employee.employee
                        }
                        className="route-employee"
                        style={{
                          padding: 13,
                          borderRadius: 13,
                          border:
                            "1px solid rgba(148,163,184,.07)",
                          background:
                            "rgba(8,19,37,.45)",
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
                          <div>
                            <strong
                              style={{
                                fontSize: 10,
                              }}
                            >
                              {
                                employee.employee
                              }
                            </strong>

                            <div
                              style={{
                                color:
                                  "#64748b",
                                fontSize: 8,
                                marginTop: 3,
                              }}
                            >
                              {employee.jobs}{" "}
                              Einsatz/Einsätze
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
                                  accent,
                                fontSize: 11,
                              }}
                            >
                              {durationLabel(
                                employee.minutes
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
                              {money(
                                employee.value
                              )}
                            </div>
                          </div>
                        </div>

                        <div
                          style={{
                            height: 6,
                            marginTop: 10,
                            borderRadius: 999,
                            background:
                              "rgba(148,163,184,.08)",
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              width: `${percent}%`,
                              height: "100%",
                              borderRadius: 999,
                              background:
                                accent,
                            }}
                          />
                        </div>

                        <div
                          style={{
                            display: "flex",
                            justifyContent:
                              "space-between",
                            marginTop: 5,
                            color: "#475569",
                            fontSize: 7,
                          }}
                        >
                          <span>Auslastung</span>
                          <strong
                            style={{
                              color: accent,
                            }}
                          >
                            {percent} %
                          </strong>
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            </section>
          </div>
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
  value: string;
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
        minWidth: 0,
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
          fontSize: 20,
          fontWeight: 950,
          marginTop: 5,
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {value}
      </div>
    </div>
  );
}
