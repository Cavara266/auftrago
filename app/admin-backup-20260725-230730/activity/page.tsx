import Link from "next/link";
import type { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type ActivitySearchParams = {
  q?: string;
  event?: string;
};

const EVENT_OPTIONS = [
  "ALL",
  "LOGIN",
  "LOGIN_FAILED",
  "LOGIN_BLOCKED",
  "DASHBOARD_VIEWED",
  "LEADS_VIEWED",
  "LEAD_VIEWED",
  "CREDITS_VIEWED",
  "CHECKOUT_STARTED",
  "CREDIT_PURCHASED",
  "LEAD_PURCHASED",
  "LOGOUT",
] as const;

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("de-CH", {
    dateStyle: "medium",
    timeStyle: "medium",
    timeZone: "Europe/Zurich",
  }).format(date);
}

function formatRelativeDate(date: Date) {
  const difference = Date.now() - date.getTime();
  const minutes = Math.floor(difference / 60_000);

  if (minutes < 1) return "Gerade eben";
  if (minutes < 60) return `Vor ${minutes} Min.`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Vor ${hours} Std.`;

  const days = Math.floor(hours / 24);
  if (days === 1) return "Gestern";

  return `Vor ${days} Tagen`;
}

function getEventDetails(event: string) {
  switch (event) {
    case "LOGIN":
      return {
        icon: "🟢",
        label: "Login erfolgreich",
        color: "#86efac",
        background: "rgba(34,197,94,0.12)",
        border: "rgba(34,197,94,0.25)",
      };
    case "LOGIN_FAILED":
      return {
        icon: "🔴",
        label: "Login fehlgeschlagen",
        color: "#fca5a5",
        background: "rgba(239,68,68,0.12)",
        border: "rgba(239,68,68,0.25)",
      };
    case "LOGIN_BLOCKED":
      return {
        icon: "⛔",
        label: "Login blockiert",
        color: "#fdba74",
        background: "rgba(249,115,22,0.12)",
        border: "rgba(249,115,22,0.25)",
      };
    case "DASHBOARD_VIEWED":
      return {
        icon: "📊",
        label: "Dashboard geöffnet",
        color: "#93c5fd",
        background: "rgba(59,130,246,0.12)",
        border: "rgba(59,130,246,0.25)",
      };
    case "LEADS_VIEWED":
      return {
        icon: "📋",
        label: "Leadliste geöffnet",
        color: "#c4b5fd",
        background: "rgba(139,92,246,0.12)",
        border: "rgba(139,92,246,0.25)",
      };
    case "LEAD_VIEWED":
      return {
        icon: "👀",
        label: "Lead angesehen",
        color: "#67e8f9",
        background: "rgba(6,182,212,0.12)",
        border: "rgba(6,182,212,0.25)",
      };
    case "CREDITS_VIEWED":
      return {
        icon: "💰",
        label: "Credits geöffnet",
        color: "#fde68a",
        background: "rgba(234,179,8,0.12)",
        border: "rgba(234,179,8,0.25)",
      };
    case "CHECKOUT_STARTED":
      return {
        icon: "🛒",
        label: "Checkout gestartet",
        color: "#f9a8d4",
        background: "rgba(236,72,153,0.12)",
        border: "rgba(236,72,153,0.25)",
      };
    case "CREDIT_PURCHASED":
      return {
        icon: "💳",
        label: "Credits gekauft",
        color: "#6ee7b7",
        background: "rgba(16,185,129,0.12)",
        border: "rgba(16,185,129,0.25)",
      };
    case "LEAD_PURCHASED":
      return {
        icon: "✅",
        label: "Lead gekauft",
        color: "#86efac",
        background: "rgba(34,197,94,0.12)",
        border: "rgba(34,197,94,0.25)",
      };
    case "LOGOUT":
      return {
        icon: "🚪",
        label: "Logout",
        color: "#cbd5e1",
        background: "rgba(148,163,184,0.12)",
        border: "rgba(148,163,184,0.25)",
      };
    default:
      return {
        icon: "⚡",
        label: event,
        color: "#bfdbfe",
        background: "rgba(59,130,246,0.12)",
        border: "rgba(59,130,246,0.25)",
      };
  }
}

function parseUserAgent(userAgent: string | null) {
  if (!userAgent) {
    return {
      browser: "Unbekannt",
      device: "Unbekannt",
      system: "Unbekannt",
    };
  }

  let browser = "Anderer Browser";

  if (userAgent.includes("Edg/")) browser = "Microsoft Edge";
  else if (userAgent.includes("Chrome/")) browser = "Google Chrome";
  else if (userAgent.includes("Firefox/")) browser = "Firefox";
  else if (userAgent.includes("Safari/") && !userAgent.includes("Chrome/")) {
    browser = "Safari";
  }

  let system = "Anderes System";

  if (userAgent.includes("Mac OS X")) system = "macOS";
  else if (userAgent.includes("Windows")) system = "Windows";
  else if (userAgent.includes("Android")) system = "Android";
  else if (userAgent.includes("iPhone") || userAgent.includes("iPad")) {
    system = "iOS";
  } else if (userAgent.includes("Linux")) system = "Linux";

  let device = "Desktop";

  if (
    userAgent.includes("Mobile") ||
    userAgent.includes("Android") ||
    userAgent.includes("iPhone")
  ) {
    device = "Mobilgerät";
  } else if (userAgent.includes("iPad")) {
    device = "Tablet";
  }

  return { browser, device, system };
}

function metadataToText(metadata: Prisma.JsonValue | null) {
  if (!metadata) return null;

  try {
    return JSON.stringify(metadata, null, 2);
  } catch {
    return String(metadata);
  }
}

export default async function AdminActivityPage({
  searchParams,
}: {
  searchParams?: ActivitySearchParams;
}) {
  const q = String(searchParams?.q || "").trim();
  const selectedEvent = String(searchParams?.event || "ALL").trim();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const where: Prisma.ProviderActivityWhereInput = {
    AND: [
      selectedEvent !== "ALL" ? { event: selectedEvent } : {},
      q
        ? {
            OR: [
              { event: { contains: q, mode: "insensitive" } },
              { description: { contains: q, mode: "insensitive" } },
              { page: { contains: q, mode: "insensitive" } },
              { ipAddress: { contains: q, mode: "insensitive" } },
              {
                provider: {
                  is: {
                    OR: [
                      {
                        companyName: {
                          contains: q,
                          mode: "insensitive",
                        },
                      },
                      {
                        contactName: {
                          contains: q,
                          mode: "insensitive",
                        },
                      },
                      {
                        email: {
                          contains: q,
                          mode: "insensitive",
                        },
                      },
                    ],
                  },
                },
              },
            ],
          }
        : {},
    ],
  };

  const [
    activities,
    totalActivities,
    loginCount,
    failedLoginCount,
    todayActivities,
    todayProviderRows,
  ] = await Promise.all([
    prisma.providerActivity.findMany({
      where,
      include: {
        provider: {
          select: {
            id: true,
            companyName: true,
            contactName: true,
            email: true,
            phone: true,
            status: true,
            credits: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 250,
    }),
    prisma.providerActivity.count(),
    prisma.providerActivity.count({ where: { event: "LOGIN" } }),
    prisma.providerActivity.count({ where: { event: "LOGIN_FAILED" } }),
    prisma.providerActivity.count({
      where: { createdAt: { gte: today } },
    }),
    prisma.providerActivity.findMany({
      where: { createdAt: { gte: today } },
      select: { providerId: true },
    }),
  ]);

  const activeProvidersToday = new Set(
    todayProviderRows.map((activity) => activity.providerId)
  ).size;

  const successfulLoginRate =
    loginCount + failedLoginCount > 0
      ? Math.round((loginCount / (loginCount + failedLoginCount)) * 100)
      : 0;

  return (
    <main className="page">
      <section className="admin-dashboard">
        <div className="container">
          <span className="eyebrow">Auftrago Analytics</span>

          <div className="admin-head">
            <div>
              <h1>Anbieter-Aktivitäten</h1>
              <p>
                Logins, Fehler, Seitenaufrufe und Kaufaktivitäten zentral
                überwachen.
              </p>
            </div>

            <div
              className="admin-actions"
              style={{ display: "flex", gap: 12, flexWrap: "wrap" }}
            >
              <Link href="/admin" className="btn btn-secondary">
                Admin
              </Link>

              <Link href="/admin/providers" className="btn btn-secondary">
                Anbieter
              </Link>

              <Link href="/admin/activity" className="btn btn-primary">
                Aktualisieren
              </Link>
            </div>
          </div>

          <div className="admin-stats">
            <div className="admin-stat-card">
              <strong>{totalActivities}</strong>
              <span>⚡ Aktivitäten</span>
            </div>

            <div className="admin-stat-card">
              <strong>{todayActivities}</strong>
              <span>📅 Heute</span>
            </div>

            <div className="admin-stat-card">
              <strong>{activeProvidersToday}</strong>
              <span>🟢 Anbieter heute</span>
            </div>

            <div className="admin-stat-card">
              <strong>{loginCount}</strong>
              <span>🔐 Logins</span>
            </div>

            <div className="admin-stat-card">
              <strong>{failedLoginCount}</strong>
              <span>🔴 Login-Fehler</span>
            </div>

            <div className="admin-stat-card">
              <strong>{successfulLoginRate}%</strong>
              <span>📈 Login-Erfolg</span>
            </div>
          </div>

          <section
            className="admin-card admin-card-wide"
            style={{
              marginBottom: 28,
              borderRadius: 34,
              background:
                "linear-gradient(135deg, rgba(15,23,42,0.98), rgba(30,64,112,0.76))",
              boxShadow: "0 30px 90px rgba(0,0,0,0.35)",
            }}
          >
            <div className="admin-card-head">
              <span>Suche & Filter</span>
              <h2>Aktivitäten analysieren</h2>
            </div>

            <form
              style={{
                display: "grid",
                gridTemplateColumns:
                  "minmax(240px, 1fr) minmax(210px, 280px) auto",
                gap: 14,
                alignItems: "center",
              }}
            >
              <input
                name="q"
                defaultValue={q}
                placeholder="Firma, Kontakt, E-Mail, Event, Seite oder IP suchen..."
              />

              <select name="event" defaultValue={selectedEvent}>
                {EVENT_OPTIONS.map((event) => (
                  <option key={event} value={event}>
                    {event === "ALL"
                      ? "Alle Aktivitäten"
                      : getEventDetails(event).label}
                  </option>
                ))}
              </select>

              <button type="submit" className="btn btn-primary">
                Filtern
              </button>
            </form>
          </section>

          <section style={{ display: "grid", gap: 18 }}>
            {activities.length === 0 ? (
              <div
                className="admin-card admin-card-wide"
                style={{ padding: 36, borderRadius: 30, textAlign: "center" }}
              >
                <div style={{ fontSize: 42, marginBottom: 12 }}>🔎</div>
                <h2>Keine Aktivitäten gefunden</h2>
                <p style={{ opacity: 0.7 }}>
                  Für diese Suche oder diesen Filter sind noch keine Einträge
                  vorhanden.
                </p>
              </div>
            ) : (
              activities.map((activity) => {
                const eventDetails = getEventDetails(activity.event);
                const device = parseUserAgent(activity.userAgent);
                const metadata = metadataToText(activity.metadata);

                return (
                  <article
                    key={activity.id}
                    style={{
                      padding: 24,
                      borderRadius: 30,
                      border: `1px solid ${eventDetails.border}`,
                      background:
                        "linear-gradient(135deg, rgba(15,23,42,0.98), rgba(30,41,59,0.92))",
                      boxShadow: "0 24px 70px rgba(0,0,0,0.28)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        gap: 20,
                        flexWrap: "wrap",
                      }}
                    >
                      <div
                        style={{ display: "flex", gap: 16, alignItems: "center" }}
                      >
                        <div
                          style={{
                            width: 64,
                            height: 64,
                            display: "grid",
                            placeItems: "center",
                            borderRadius: 22,
                            background: eventDetails.background,
                            border: `1px solid ${eventDetails.border}`,
                            fontSize: 28,
                          }}
                        >
                          {eventDetails.icon}
                        </div>

                        <div>
                          <div
                            style={{
                              color: eventDetails.color,
                              fontWeight: 950,
                              fontSize: 13,
                              textTransform: "uppercase",
                              letterSpacing: "0.08em",
                            }}
                          >
                            {eventDetails.label}
                          </div>

                          <h2 style={{ margin: "5px 0 0", fontSize: 25 }}>
                            {activity.provider.companyName}
                          </h2>

                          <p style={{ margin: "6px 0 0", opacity: 0.7 }}>
                            👤 {activity.provider.contactName} · 📧{" "}
                            {activity.provider.email}
                          </p>
                        </div>
                      </div>

                      <div style={{ textAlign: "right" }}>
                        <strong style={{ display: "block", fontSize: 16 }}>
                          {formatRelativeDate(activity.createdAt)}
                        </strong>

                        <span
                          style={{
                            display: "block",
                            marginTop: 5,
                            opacity: 0.62,
                            fontSize: 14,
                          }}
                        >
                          {formatDate(activity.createdAt)}
                        </span>
                      </div>
                    </div>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fit, minmax(190px, 1fr))",
                        gap: 12,
                        marginTop: 22,
                      }}
                    >
                      {[
                        [
                          "Beschreibung",
                          activity.description || "Keine Beschreibung",
                        ],
                        ["Seite", activity.page || "Keine Seite"],
                        ["Gerät", `${device.device} · ${device.system}`],
                        ["Browser", device.browser],
                        ["IP-Adresse", activity.ipAddress || "Nicht verfügbar"],
                        ["Credits", `${activity.provider.credits} Credits`],
                      ].map(([label, value]) => (
                        <div
                          key={label}
                          style={{
                            padding: 15,
                            borderRadius: 18,
                            background: "rgba(255,255,255,0.045)",
                            border: "1px solid rgba(255,255,255,0.08)",
                          }}
                        >
                          <small style={{ opacity: 0.55 }}>{label}</small>
                          <div
                            style={{
                              marginTop: 5,
                              fontWeight: 750,
                              wordBreak: "break-word",
                            }}
                          >
                            {value}
                          </div>
                        </div>
                      ))}
                    </div>

                    {metadata ? (
                      <details
                        style={{
                          marginTop: 18,
                          padding: 16,
                          borderRadius: 18,
                          background: "rgba(2,6,23,0.45)",
                          border: "1px solid rgba(255,255,255,0.08)",
                        }}
                      >
                        <summary style={{ cursor: "pointer", fontWeight: 850 }}>
                          Technische Details anzeigen
                        </summary>

                        <pre
                          style={{
                            margin: "14px 0 0",
                            whiteSpace: "pre-wrap",
                            wordBreak: "break-word",
                            fontSize: 13,
                            opacity: 0.8,
                          }}
                        >
                          {metadata}
                        </pre>
                      </details>
                    ) : null}
                  </article>
                );
              })
            )}
          </section>

          {activities.length >= 250 ? (
            <p
              style={{
                marginTop: 22,
                textAlign: "center",
                opacity: 0.58,
              }}
            >
              Es werden die neuesten 250 Aktivitäten angezeigt.
            </p>
          ) : null}
        </div>
      </section>
    </main>
  );
}
