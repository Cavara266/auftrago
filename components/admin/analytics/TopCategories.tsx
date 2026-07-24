import type { RankingItem } from "./types";

type Props = {
  items: RankingItem[];
};

export default function TopCategories({ items }: Props) {
  const max = Math.max(...items.map((item) => item.value), 1);

  return (
    <section className="analytics-ranking-card">
      <small>🧹 KATEGORIEN</small>
      <h2>Top-Kategorien</h2>

      <div className="analytics-ranking-list">
        {items.length === 0 ? (
          <p className="analytics-empty">Noch keine Daten vorhanden.</p>
        ) : (
          items.map((item, index) => (
            <div key={item.label}>
              <div className="analytics-ranking-head">
                <span>
                  {index < 3 ? ["🥇", "🥈", "🥉"][index] : "•"} {item.label}
                </span>
                <strong>{item.value}</strong>
              </div>

              <div className="analytics-ranking-track">
                <i style={{ width: `${Math.max(6, (item.value / max) * 100)}%` }} />
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
