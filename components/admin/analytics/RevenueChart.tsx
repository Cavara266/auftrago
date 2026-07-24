import type { DailyPoint } from "./types";

type Props = {
  points: DailyPoint[];
  formatMoney: (value: number) => string;
};

function safeWidth(value: number, max: number) {
  if (max <= 0 || value <= 0) return 0;
  return Math.max(6, Math.round((value / max) * 100));
}

export default function RevenueChart({ points, formatMoney }: Props) {
  const maxRevenue = Math.max(
    ...points.map((point) => point.creditRevenue),
    1,
  );

  return (
    <section
      style={{
        padding: 26,
        borderRadius: 30,
        border: "1px solid rgba(255,255,255,0.10)",
        background: "rgba(8,20,39,0.84)",
      }}
    >
      <small style={{ color: "#67e8f9", fontWeight: 900 }}>UMSATZ</small>
      <h2 style={{ marginTop: 6 }}>Credit-Umsatz nach Tag</h2>

      <div style={{ display: "grid", gap: 14, marginTop: 24 }}>
        {points.map((point) => (
          <div
            key={point.key}
            style={{
              display: "grid",
              gridTemplateColumns: "80px 1fr 110px",
              gap: 12,
              alignItems: "center",
            }}
          >
            <span style={{ opacity: 0.58, fontSize: 13 }}>
              {point.label}
            </span>

            <div
              style={{
                height: 10,
                borderRadius: 999,
                background: "rgba(255,255,255,0.07)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${safeWidth(point.creditRevenue, maxRevenue)}%`,
                  height: "100%",
                  borderRadius: 999,
                  background: "linear-gradient(90deg, #22c55e, #38bdf8)",
                }}
              />
            </div>

            <strong style={{ textAlign: "right", fontSize: 13 }}>
              {formatMoney(point.creditRevenue)}
            </strong>
          </div>
        ))}
      </div>
    </section>
  );
}
