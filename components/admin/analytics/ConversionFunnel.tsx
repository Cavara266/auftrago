type FunnelItem = {
  label: string;
  value: number;
  base: number;
};

type Props = {
  items: FunnelItem[];
};

function percent(value: number, total: number) {
  if (total <= 0) return 0;
  return Math.min(100, Math.round((value / total) * 100));
}

export default function ConversionFunnel({ items }: Props) {
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
      <small style={{ color: "#c4b5fd", fontWeight: 900 }}>
        PERFORMANCE
      </small>
      <h2 style={{ marginTop: 6 }}>Conversion-Funnel</h2>

      <div style={{ display: "grid", gap: 18, marginTop: 28 }}>
        {items.map((item) => {
          const ratio = percent(item.value, item.base);

          return (
            <div key={item.label}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 12,
                  marginBottom: 8,
                }}
              >
                <span style={{ opacity: 0.7 }}>{item.label}</span>
                <strong>{item.value}</strong>
              </div>

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
                    width: `${Math.max(ratio, item.value ? 5 : 0)}%`,
                    height: "100%",
                    borderRadius: 999,
                    background: "linear-gradient(90deg, #9333ea, #38bdf8)",
                  }}
                />
              </div>

              <small style={{ display: "block", marginTop: 6, opacity: 0.4 }}>
                {ratio}%
              </small>
            </div>
          );
        })}
      </div>
    </section>
  );
}
