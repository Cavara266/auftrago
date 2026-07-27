import styles from "./portal-ui.module.css";

type TrendBadgeProps = {
  value: string;
  negative?: boolean;
};

export function TrendBadge({
  value,
  negative = false,
}: TrendBadgeProps) {
  return (
    <span
      className={[
        styles.trendBadge,
        negative ? styles.trendBadgeNegative : "",
      ].join(" ")}
    >
      {negative ? "↓" : "↑"} {value}
    </span>
  );
}
