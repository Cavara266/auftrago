import type { HTMLAttributes, ReactNode } from "react";
import styles from "./portal-ui.module.css";

type PremiumCardProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode;
  as?: "article" | "section" | "div";
};

export function PremiumCard({
  children,
  className = "",
  as = "article",
  ...props
}: PremiumCardProps) {
  const Component = as;

  return (
    <Component
      className={`${styles.premiumCard} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}
