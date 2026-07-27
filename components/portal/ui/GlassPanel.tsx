import type { HTMLAttributes, ReactNode } from "react";
import styles from "./portal-ui.module.css";

type GlassPanelProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

export function GlassPanel({
  children,
  className = "",
  ...props
}: GlassPanelProps) {
  return (
    <div
      className={`${styles.glassPanel} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
