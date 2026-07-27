import type { ReactNode } from "react";
import styles from "./portal-ui.module.css";

type SectionHeaderProps = {
  kicker?: string;
  title: string;
  description?: string;
  action?: ReactNode;
};

export function SectionHeader({
  kicker,
  title,
  description,
  action,
}: SectionHeaderProps) {
  return (
    <header className={styles.sectionHeader}>
      <div>
        {kicker ? (
          <span className={styles.sectionKicker}>
            {kicker}
          </span>
        ) : null}

        <h2 className={styles.sectionTitle}>
          {title}
        </h2>

        {description ? (
          <p className={styles.sectionDescription}>
            {description}
          </p>
        ) : null}
      </div>

      {action ? <div>{action}</div> : null}
    </header>
  );
}
