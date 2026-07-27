import type { ReactNode } from "react";
import styles from "./portal-ui.module.css";
import { PortalButton } from "./PortalButton";

type EmptyStateProps = {
  icon: ReactNode;
  title: string;
  description: string;
  href?: string;
  actionLabel?: string;
};

export function EmptyState({
  icon,
  title,
  description,
  href,
  actionLabel,
}: EmptyStateProps) {
  return (
    <div className={styles.emptyState}>
      <span className={styles.emptyIcon}>
        {icon}
      </span>

      <h3>{title}</h3>
      <p>{description}</p>

      {href && actionLabel ? (
        <PortalButton href={href}>
          {actionLabel}
        </PortalButton>
      ) : null}
    </div>
  );
}
