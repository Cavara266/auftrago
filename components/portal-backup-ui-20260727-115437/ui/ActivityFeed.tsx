import type { ReactNode } from "react";
import styles from "./portal-ui.module.css";

export type ActivityFeedItem = {
  id: string;
  icon: ReactNode;
  title: string;
  description: string;
  time: string;
};

type ActivityFeedProps = {
  items: ActivityFeedItem[];
};

export function ActivityFeed({
  items,
}: ActivityFeedProps) {
  return (
    <div className={styles.activityFeed}>
      {items.map((item) => (
        <div
          key={item.id}
          className={styles.activityItem}
        >
          <span className={styles.activityIcon}>
            {item.icon}
          </span>

          <span>
            <strong>{item.title}</strong>
            <small>{item.description}</small>
          </span>

          <span className={styles.activityTime}>
            {item.time}
          </span>
        </div>
      ))}
    </div>
  );
}
