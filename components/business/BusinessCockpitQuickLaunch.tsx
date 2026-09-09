import Link from "next/link";

const actions = [
  {
    href: "/portal/business/ai",
    eyebrow: "AI",
    title: "Offerte mit AI",
    text: "Neue Offerte intelligent vorbereiten.",
    icon: "✦",
    color: "#7dd3fc",
  },
  {
    href: "/portal/business/operations",
    eyebrow: "OPERATIONS",
    title: "Einsätze steuern",
    text: "Route, Mitarbeiter und Status verwalten.",
    icon: "↗",
    color: "#86efac",
  },
  {
    href: "/portal/business/tasks",
    eyebrow: "WORKFLOW",
    title: "Aufgaben öffnen",
    text: "Prioritäten und offene Aktionen bearbeiten.",
    icon: "✓",
    color: "#fbbf24",
  },
  {
    href: "/portal/business/calendar",
    eyebrow: "PLANUNG",
    title: "Kalender",
    text: "Woche und kommende Einsätze planen.",
    icon: "▦",
    color: "#c4b5fd",
  },
  {
    href: "/portal/business/rechnungen",
    eyebrow: "FINANCE",
    title: "Rechnungen",
    text: "Forderungen und Zahlungen verwalten.",
    icon: "▣",
    color: "#7dd3fc",
  },
  {
    href: "/portal/business/analytics",
    eyebrow: "INTELLIGENCE",
    title: "Analytics",
    text: "Umsatz und Performance analysieren.",
    icon: "◎",
    color: "#86efac",
  },
];

export default function BusinessCockpitQuickLaunch() {
  return (
    <>
      <style>{`
        .cockpit-launch-card {
          transition:
            transform .18s ease,
            border-color .18s ease,
            background .18s ease,
            box-shadow .18s ease;
        }

        .cockpit-launch-card:hover {
          transform: translateY(-4px);
          border-color: rgba(125,211,252,.16) !important;
          background: rgba(15,28,50,.72) !important;
          box-shadow: 0 18px 50px rgba(2,6,23,.20);
        }

        @media(max-width:900px) {
          .cockpit-launch-grid {
            grid-template-columns:
              repeat(2,minmax(0,1fr)) !important;
          }
        }

        @media(max-width:560px) {
          .cockpit-launch-grid {
            grid-template-columns:
              1fr !important;
          }
        }
      `}</style>

      <section
        style={{
          padding: 24,
          borderRadius: 23,
          border:
            "1px solid rgba(125,211,252,.09)",
          background:
            "linear-gradient(145deg,rgba(7,18,35,.92),rgba(17,21,49,.82))",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 16,
            alignItems: "end",
            flexWrap: "wrap",
          }}
        >
          <div>
            <div
              style={{
                color: "#7dd3fc",
                fontSize: 9,
                fontWeight: 950,
                letterSpacing: ".10em",
              }}
            >
              COMMAND SHORTCUTS
            </div>

            <h2
              style={{
                margin: "7px 0 4px",
                fontSize: 27,
                letterSpacing: "-.035em",
              }}
            >
              Schnellzugriff
            </h2>

            <p
              style={{
                margin: 0,
                color: "#64748b",
                fontSize: 10,
              }}
            >
              Die wichtigsten Bereiche ohne Umwege öffnen.
            </p>
          </div>

          <div
            style={{
              padding: "7px 10px",
              borderRadius: 999,
              border:
                "1px solid rgba(34,197,94,.10)",
              background:
                "rgba(34,197,94,.035)",
              color: "#86efac",
              fontSize: 8,
              fontWeight: 900,
            }}
          >
            ● SYSTEM BEREIT
          </div>
        </div>

        <div
          className="cockpit-launch-grid"
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(3,minmax(0,1fr))",
            gap: 10,
            marginTop: 18,
          }}
        >
          {actions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="cockpit-launch-card"
              style={{
                minWidth: 0,
                padding: 16,
                borderRadius: 15,
                border:
                  "1px solid rgba(148,163,184,.07)",
                background:
                  "rgba(2,6,23,.28)",
                color: "#f8fafc",
                textDecoration: "none",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 10,
                  alignItems: "start",
                }}
              >
                <div>
                  <div
                    style={{
                      color: action.color,
                      fontSize: 7,
                      fontWeight: 950,
                      letterSpacing: ".08em",
                    }}
                  >
                    {action.eyebrow}
                  </div>

                  <div
                    style={{
                      marginTop: 7,
                      fontSize: 12,
                      fontWeight: 900,
                    }}
                  >
                    {action.title}
                  </div>
                </div>

                <div
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 9,
                    display: "grid",
                    placeItems: "center",
                    background:
                      `${action.color}10`,
                    color: action.color,
                    fontSize: 11,
                    fontWeight: 950,
                  }}
                >
                  {action.icon}
                </div>
              </div>

              <div
                style={{
                  marginTop: 7,
                  color: "#64748b",
                  fontSize: 8,
                  lineHeight: 1.55,
                }}
              >
                {action.text}
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
