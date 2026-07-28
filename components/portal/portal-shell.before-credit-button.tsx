"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import styles from "./portal-shell.module.css";

const navigation = [
  {
    href: "/portal",
    label: "Übersicht",
    icon: "⌂",
    exact: true,
  },
  {
    href: "/portal/leads",
    label: "Neue Leads",
    icon: "✦",
  },
  {
    href: "/portal/fixed-orders",
    label: "Fixaufträge",
    icon: "⚡",
  },
  {
    href: "/portal/meine-leads",
    label: "Mein CRM",
    icon: "◎",
  },
  {
    href: "/portal/guthaben",
    label: "Credits",
    icon: "◉",
  },
  {
    href: "/portal/rechnungen",
    label: "Rechnungen",
    icon: "▤",
  },
  {
    href: "/portal/transaktionen",
    label: "Transaktionen",
    icon: "↗",
  },
  {
    href: "/portal/profil",
    label: "Firmenprofil",
    icon: "◇",
  },
  {
    href: "/portal/einstellungen",
    label: "Einstellungen",
    icon: "⚙",
  },
];

type PortalShellProps = {
  children: ReactNode;
};

export default function PortalShell({ children }: PortalShellProps) {
  const pathname = usePathname();

  function isActive(
    href: string,
    exact?: boolean
  ) {
    if (exact) {
      return pathname === href;
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <div className={styles.portal}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <div className={styles.brandIcon}>A</div>

          <div>
            <strong>Auftrago</strong>
            <span>Anbieterportal</span>
          </div>
        </div>

        <div className={styles.liveStatus}>
          <span />
          Plattform online
        </div>

        <nav className={styles.navigation}>
          {navigation.map((item) => {
            const active = isActive(item.href, item.exact);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={
                  active
                    ? `${styles.navLink} ${styles.navLinkActive}`
                    : styles.navLink
                }
              >
                <span className={styles.navIcon}>
                  {item.icon}
                </span>

                <span>{item.label}</span>

                <span className={styles.navArrow}>›</span>
              </Link>
            );
          })}
        </nav>

        <div className={styles.sidebarBottom}>
          <Link
            href="/portal/einstellungen"
            className={styles.matchingCard}
          >
            <span className={styles.matchingBadge}>
              SMART MATCHING
            </span>

            <strong>Passende Leads erhalten</strong>

            <small>
              Dienstleistungen und Regionen konfigurieren.
            </small>
          </Link>

          <Link
            href="/logout"
            className={styles.logout}
          >
            Abmelden
          </Link>
        </div>
      </aside>

      <div className={styles.content}>
        <div className={styles.mobileNavigation}>
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={
                isActive(item.href, item.exact)
                  ? styles.mobileActive
                  : undefined
              }
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </div>

        <main className={styles.main}>
          {children}
        </main>
      </div>
    </div>
  );
}
