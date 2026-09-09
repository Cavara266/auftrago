import Link from "next/link";

import BusinessJobPlanner from "@/components/business/BusinessJobPlanner";
import BusinessRoutePlanner from "@/components/business/BusinessRoutePlanner";

export default async function BusinessOperationsPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at 80% 0%,rgba(124,58,237,.10),transparent 32%), #061120",
        color: "#f8fafc",
      }}
    >
      <style>{`
        .operations-shell {
          width: min(100%, 1500px);
          margin: 0 auto;
          padding: 34px 32px 80px;
          box-sizing: border-box;
        }

        .operations-hero {
          position: relative;
          overflow: hidden;
          border-radius: 28px;
          border: 1px solid rgba(125,211,252,.12);
          background:
            linear-gradient(
              135deg,
              rgba(7,20,38,.98),
              rgba(19,22,62,.93)
            );
          padding: 34px;
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,.03),
            0 24px 70px rgba(2,6,23,.24);
        }

        .operations-hero::after {
          content: "";
          position: absolute;
          width: 420px;
          height: 420px;
          right: -150px;
          top: -230px;
          border-radius: 50%;
          background: rgba(124,58,237,.13);
          filter: blur(85px);
          pointer-events: none;
        }

        .operations-action {
          transition:
            transform .18s ease,
            border-color .18s ease,
            background .18s ease;
        }

        .operations-action:hover {
          transform: translateY(-2px);
          border-color: rgba(125,211,252,.22) !important;
          background: rgba(30,41,59,.58) !important;
        }

        @media(max-width:800px) {
          .operations-shell {
            padding: 22px 14px 60px;
          }

          .operations-hero {
            padding: 23px;
            border-radius: 21px;
          }

          .operations-header {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

      <div className="operations-shell">
        <div
          style={{
            marginBottom: 18,
          }}
        >
          <Link
            href="/portal/business"
            style={{
              color: "#7dd3fc",
              fontSize: 10,
              fontWeight: 900,
              textDecoration: "none",
            }}
          >
            ← Business Cockpit
          </Link>
        </div>

        <section className="operations-hero">
          <div
            className="operations-header"
            style={{
              position: "relative",
              zIndex: 1,
              display: "grid",
              gridTemplateColumns: "minmax(0,1fr) auto",
              gap: 24,
              alignItems: "end",
            }}
          >
            <div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  color: "#7dd3fc",
                  fontSize: 10,
                  fontWeight: 950,
                  letterSpacing: ".11em",
                }}
              >
                <span
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: "#22c55e",
                    boxShadow: "0 0 14px rgba(34,197,94,.85)",
                  }}
                />
                AUFTRAGO BUSINESS OPERATIONS
              </div>

              <h1
                style={{
                  margin: "10px 0 8px",
                  fontSize: "clamp(38px,6vw,70px)",
                  lineHeight: .96,
                  letterSpacing: "-.055em",
                  fontWeight: 850,
                }}
              >
                Operations
                <span
                  style={{
                    display: "block",
                    color: "#94a3b8",
                    fontWeight: 650,
                  }}
                >
                  Einsatzsteuerung in Echtzeit
                </span>
              </h1>

              <p
                style={{
                  maxWidth: 760,
                  margin: "18px 0 0",
                  color: "#94a3b8",
                  fontSize: 14,
                  lineHeight: 1.75,
                }}
              >
                Plane Einsätze, steuere den aktuellen Status,
                koordiniere Mitarbeiter, informiere Kunden und
                behalte die heutige Route zentral im Blick.
              </p>
            </div>

            <div
              style={{
                display: "flex",
                gap: 9,
                flexWrap: "wrap",
              }}
            >
              <Link
                href="/portal/business"
                className="operations-action"
                style={{
                  minHeight: 42,
                  padding: "0 15px",
                  display: "inline-flex",
                  alignItems: "center",
                  borderRadius: 12,
                  border: "1px solid rgba(148,163,184,.10)",
                  background: "rgba(15,23,42,.46)",
                  color: "#cbd5e1",
                  textDecoration: "none",
                  fontSize: 10,
                  fontWeight: 900,
                }}
              >
                Dashboard
              </Link>

              <Link
                href="/portal/business/ai"
                className="operations-action"
                style={{
                  minHeight: 42,
                  padding: "0 16px",
                  display: "inline-flex",
                  alignItems: "center",
                  borderRadius: 12,
                  border: 0,
                  background:
                    "linear-gradient(100deg,#0ea5e9,#6366f1,#7c3aed)",
                  color: "#fff",
                  textDecoration: "none",
                  fontSize: 10,
                  fontWeight: 950,
                  boxShadow: "0 10px 28px rgba(99,102,241,.18)",
                }}
              >
                ✦ Mit AI planen
              </Link>
            </div>
          </div>

          <div
            style={{
              position: "relative",
              zIndex: 1,
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
              marginTop: 26,
            }}
          >
            {[
              "Einsätze",
              "Mitarbeiter",
              "Tagesroute",
              "Kundenstatus",
              "Live Workflow",
            ].map((item) => (
              <div
                key={item}
                style={{
                  padding: "7px 10px",
                  borderRadius: 999,
                  border: "1px solid rgba(125,211,252,.09)",
                  background: "rgba(2,6,23,.27)",
                  color: "#94a3b8",
                  fontSize: 8,
                  fontWeight: 900,
                  letterSpacing: ".04em",
                }}
              >
                {item}
              </div>
            ))}
          </div>
        </section>

        <div style={{ height: 26 }} />

        <BusinessJobPlanner />

        <div style={{ height: 26 }} />

        <BusinessRoutePlanner />
      </div>
    </main>
  );
}
