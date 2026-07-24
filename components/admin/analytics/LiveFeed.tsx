import type { LiveFeedItem } from "./types";

type Props = {
  items: LiveFeedItem[];
};

export default function LiveFeed({ items }: Props) {
  return (
    <section
      style={{
        padding: 26,
        borderRadius: 30,
        border: "1px solid rgba(255,255,255,0.10)",
        background: "rgba(8,20,39,0.84)",
      }}
    >
      <small style={{ color: "#c4b5fd", fontWeight: 900 }}>LIVE</small>
      <h2 style={{ marginTop: 6 }}>Neueste Aktivitäten</h2>

      <div style={{ display: "grid", gap: 6, marginTop: 18 }}>
        {items.length === 0 ? (
          <p style={{ opacity: 0.55 }}>Noch keine Aktivitäten vorhanden.</p>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              style={{
                display: "grid",
                gridTemplateColumns: "44px 1fr auto",
                gap: 12,
                alignItems: "center",
                padding: "13px 0",
                borderBottom: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  display: "grid",
                  placeItems: "center",
                  borderRadius: 14,
                  background: "rgba(56,189,248,0.11)",
                }}
              >
                {item.icon}
              </div>

              <div style={{ minWidth: 0 }}>
                <strong style={{ display: "block", fontSize: 14 }}>
                  {item.title}
                </strong>
                <span
                  style={{
                    display: "block",
                    marginTop: 3,
                    opacity: 0.58,
                    fontSize: 12,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {item.description}
                </span>
              </div>

              <div style={{ textAlign: "right" }}>
                <strong style={{ display: "block", fontSize: 12 }}>
                  {item.detail}
                </strong>
                <small style={{ opacity: 0.4, fontSize: 10 }}>
                  {item.dateLabel}
                </small>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
