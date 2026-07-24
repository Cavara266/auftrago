import type { DailyPoint } from "./types";

type Props = {
  points: DailyPoint[];
};

function safeHeight(value: number, max: number) {
  if (max <= 0 || value <= 0) return 4;
  return Math.max(6, Math.round((value / max) * 100));
}

export default function ActivityChart({ points }: Props) {
  const maxActivity = Math.max(
    ...points.map(
      (point) => point.leads + point.registrations + point.leadPurchases,
    ),
    1,
  );

  return (
    <section
      style={{
        padding: 26,
        borderRadius: 30,
        border: "1px solid rgba(255,255,255,0.10)",
        background: "rgba(8,20,39,0.84)",
        boxShadow: "0 28px 80px rgba(0,0,0,0.28)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 18,
          flexWrap: "wrap",
        }}
      >
        <div>
          <small style={{ color: "#c4b5fd", fontWeight: 900 }}>
            LETZTE 7 TAGE
          </small>
          <h2 style={{ marginTop: 6 }}>Plattform-Aktivität</h2>
        </div>

        <span style={{ opacity: 0.55, fontSize: 13 }}>
          Leads · Anbieter · Leadkäufe
        </span>
      </div>

      <div
        style={{
          marginTop: 28,
          height: 280,
          display: "grid",
          gridTemplateColumns: "repeat(7, minmax(38px, 1fr))",
          gap: 12,
          alignItems: "end",
        }}
      >
        {points.map((point) => {
          const activity =
            point.leads + point.registrations + point.leadPurchases;

          return (
            <div
              key={point.key}
              style={{
                height: "100%",
                display: "grid",
                gridTemplateRows: "1fr auto",
                gap: 10,
                alignItems: "end",
              }}
            >
              <div
                title={`${point.leads} Leads, ${point.registrations} Anbieter, ${point.leadPurchases} Käufe`}
                style={{
                  width: "100%",
                  height: `${safeHeight(activity, maxActivity)}%`,
                  minHeight: 10,
                  borderRadius: "14px 14px 5px 5px",
                  background: "linear-gradient(180deg, #38bdf8, #6366f1)",
                  boxShadow: "0 10px 28px rgba(56,189,248,0.20)",
                }}
              />

              <div style={{ textAlign: "center" }}>
                <strong style={{ display: "block", fontSize: 13 }}>
                  {activity}
                </strong>
                <small style={{ opacity: 0.5, fontSize: 11 }}>
                  {point.label}
                </small>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
