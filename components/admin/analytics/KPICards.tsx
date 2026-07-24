import type { AnalyticsKpi } from "./types";

type Props = {
  cards: AnalyticsKpi[];
};

export default function KPICards({ cards }: Props) {
  return (
    <section
      style={{
        marginTop: 34,
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        gap: 14,
      }}
    >
      {cards.map((card) => (
        <article
          key={card.label}
          style={{
            position: "relative",
            overflow: "hidden",
            minHeight: 156,
            padding: 22,
            borderRadius: 26,
            border: "1px solid rgba(255,255,255,0.10)",
            background:
              "radial-gradient(circle at 100% 100%, rgba(99,102,241,0.18), transparent 34%), linear-gradient(145deg, rgba(16,39,61,0.96), rgba(30,38,83,0.92))",
            boxShadow: "0 22px 60px rgba(0,0,0,0.22)",
          }}
        >
          <small
            style={{
              opacity: 0.62,
              fontWeight: 900,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            {card.label}
          </small>

          <strong
            style={{
              display: "block",
              marginTop: 24,
              fontSize: 34,
              lineHeight: 1,
            }}
          >
            {card.value}
          </strong>

          <span
            style={{
              display: "block",
              marginTop: 12,
              fontSize: 13,
              opacity: 0.6,
            }}
          >
            {card.sub}
          </span>

          {typeof card.trend === "number" ? (
            <span
              style={{
                position: "absolute",
                top: 18,
                right: 18,
                padding: "6px 9px",
                borderRadius: 999,
                background:
                  card.trend >= 0
                    ? "rgba(34,197,94,0.12)"
                    : "rgba(239,68,68,0.12)",
                color: card.trend >= 0 ? "#86efac" : "#fca5a5",
                fontSize: 12,
                fontWeight: 900,
              }}
            >
              {card.trend >= 0 ? "▲" : "▼"} {Math.abs(card.trend)}%
            </span>
          ) : null}
        </article>
      ))}
    </section>
  );
}
