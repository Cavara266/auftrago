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
    href: "/portal/ausschreibungen",
    label: "Ausschreibungen",
    icon: "▤",
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

        {pathname === "/portal" && (
          <Link
            href="/portal/guthaben"
            style={{
              position: "fixed",
              right: "28px",
              bottom: "28px",
              zIndex: 100,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              minHeight: "58px",
              padding: "0 24px",
              borderRadius: "18px",
              border: "1px solid rgba(255, 221, 86, 0.45)",
              background:
                "linear-gradient(135deg, #ffd84d 0%, #ffb800 100%)",
              color: "#0a1020",
              fontSize: "15px",
              fontWeight: 900,
              textDecoration: "none",
              boxShadow:
                "0 18px 50px rgba(255, 190, 0, 0.28)",
            }}
          >
            <span style={{ fontSize: "20px" }}>🪙</span>
            Credits sofort kaufen
            <span>→</span>
          </Link>
        )}

        <main className={styles.main}>
          {children}
        </main>
      </div>
    </div>
  );
}
