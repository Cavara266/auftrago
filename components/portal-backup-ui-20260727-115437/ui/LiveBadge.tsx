import styles from "./portal-ui.module.css";

type LiveBadgeProps = {
  label?: string;
};

export function LiveBadge({
  label = "Live",
}: LiveBadgeProps) {
  return (
    <span className={styles.liveBadge}>
      <span className={styles.liveDot} />
      {label}
    </span>
  );
}
