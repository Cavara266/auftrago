import Link from "next/link";
import type { ReactNode } from "react";
import styles from "./portal-ui.module.css";

type QuickActionCardProps = {
  href: string;
  icon: ReactNode;
  title: string;
  description: string;
};

export function QuickActionCard({
  href,
  icon,
  title,
  description,
}: QuickActionCardProps) {
  return (
    <Link
      href={href}
      className={styles.quickAction}
    >
      <span className={styles.quickActionIcon}>
        {icon}
      </span>

      <span>
        <strong>{title}</strong>
        <small>{description}</small>
      </span>

      <span className={styles.quickActionArrow}>
        ›
      </span>
    </Link>
  );
}
