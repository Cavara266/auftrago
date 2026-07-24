import type { RankingItem } from "./types";

type Props = {
  items: RankingItem[];
};

export default function TopProviders({ items }: Props) {
  const max = Math.max(...items.map((item) => item.value), 1);

  return (
    <section className="analytics-ranking-card">
      <small style={{ color: "#fde68a" }}>🏆 ANBIETER</small>
      <h2>Top-Anbieter</h2>

      <div className="analytics-ranking-list">
        {items.length === 0 ? (
          <p className="analytics-empty">Noch keine Leadkäufe vorhanden.</p>
        ) : (
          items.map((item, index) => (
            <div key={`${item.label}-${index}`}>
              <div className="analytics-ranking-head">
                <span>
                  {index < 3 ? ["🥇", "🥈", "🥉"][index] : "•"} {item.label}
                </span>
                <strong>{item.value}</strong>
              </div>

              <div className="analytics-ranking-track analytics-ranking-track-gold">
                <i style={{ width: `${Math.max(6, (item.value / max) * 100)}%` }} />
              </div>

              {item.detail ? (
                <small className="analytics-ranking-detail">{item.detail}</small>
              ) : null}
            </div>
          ))
        )}
      </div>
    </section>
  );
}
