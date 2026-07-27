import type { ReactNode } from "react";
import styles from "./portal-ui.module.css";
import { TrendBadge } from "./TrendBadge";

type StatCardProps = {
  icon: ReactNode;
  label: string;
  value: ReactNode;
  description?: string;
  trend?: string;
  negativeTrend?: boolean;
};

export function StatCard({
  icon,
  label,
  value,
  description,
  trend,
  negativeTrend = false,
}: StatCardProps) {
  return (
    <article className={styles.statCard}>
      <div className={styles.statTop}>
        <span className={styles.statIcon}>
          {icon}
        </span>

        {trend ? (
          <TrendBadge
            value={trend}
            negative={negativeTrend}
          />
        ) : null}
      </div>

      <div className={styles.statLabel}>
        {label}
      </div>

      <div className={styles.statValue}>
        {value}
      </div>

      {description ? (
        <div className={styles.statDescription}>
          {description}
        </div>
      ) : null}
    </article>
  );
}
