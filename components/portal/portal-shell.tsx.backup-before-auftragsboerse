"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import type { ReactNode } from "react";
import styles from "./portal-shell.module.css";

const navigation = [
  {
    href: "/portal",
    label: "Übersicht",
    icon: "⌂",
    exact: true,
    group: "MARKTPLATZ",
  },
  {
    href: "/portal/leads",
    label: "Neue Leads",
    icon: "✦",
    group: "MARKTPLATZ",
  },
  {
    href: "/portal/fixed-orders",
    label: "Fixaufträge",
    icon: "⚡",
    group: "MARKTPLATZ",
  },
  {
    href: "/portal/ausschreibungen",
    label: "Ausschreibungen",
    icon: "▤",
    group: "MARKTPLATZ",
  },

  {
    href: "/portal/meine-leads",
    label: "Mein CRM",
    icon: "◎",
    group: "MARKTPLATZ",
  },

  {
    href: "/portal/business",
    label: "Business Cockpit · NEU",
    icon: "◈",
    exact: true,
    group: "BUSINESS",
  },
  {
    href: "/portal/business/operations",
    label: "Operations",
    icon: "↗",
    group: "BUSINESS",
  },
  {
    href: "/portal/business/tasks",
    label: "Aufgaben",
    icon: "✓",
    group: "BUSINESS",
  },
  {
    href: "/portal/business/calendar",
    label: "Kalender",
    icon: "▦",
    group: "BUSINESS",
  },
  {
    href: "/portal/business/kunden",
    label: "Kunden",
    icon: "◎",
    group: "BUSINESS",
  },
  {
    href: "/portal/business/offerten",
    label: "Offerten",
    icon: "◇",
    group: "BUSINESS",
  },
  {
    href: "/portal/business/rechnungen",
    label: "Rechnungen",
    icon: "▣",
    group: "BUSINESS",
  },
  {
    href: "/portal/business/analytics",
    label: "Analytics",
    icon: "↗",
    group: "BUSINESS",
  },

  {
    href: "/portal/guthaben",
    label: "Credits",
    icon: "◉",
    group: "KONTO",
  },
  {
    href: "/portal/transaktionen",
    label: "Transaktionen",
    icon: "↗",
    group: "KONTO",
  },
  {
    href: "/portal/profil",
    label: "Firmenprofil",
    icon: "◇",
    group: "KONTO",
  },
  {
    href: "/portal/einstellungen",
    label: "Einstellungen",
    icon: "⚙",
    group: "KONTO",
  },
];

type PortalShellProps = {
  children: ReactNode;
};

export default function PortalShell({ children }: PortalShellProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

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
      <aside
          className={styles.sidebar}
          style={{
            width: collapsed ? 82 : 250,
            minWidth: collapsed ? 82 : 250,
            transition: "width .22s ease,min-width .22s ease",
            overflowX: "hidden",
          }}
        >
        <div className={styles.brand}>
          <div
              className={styles.brandIcon}
              style={{
                flexShrink: 0,
              }}
            >
              A
            </div>

          <div>
            <strong>Auftrago</strong>
            <span>Anbieterportal</span>
          </div>
        </div>

        <div className={styles.liveStatus}>
          <span />
          Plattform online
        </div>

        <button
          type="button"
          onClick={() => setCollapsed((value) => !value)}
          aria-label={collapsed ? "Sidebar öffnen" : "Sidebar einklappen"}
          style={{
            width: "100%",
            minHeight: 36,
            marginBottom: 10,
            borderRadius: 10,
            border: "1px solid rgba(148,163,184,.08)",
            background: "rgba(15,23,42,.32)",
            color: "#64748b",
            fontSize: 10,
            fontWeight: 900,
            cursor: "pointer",
          }}
        >
          {collapsed ? "→" : "← Sidebar"}
        </button>

        <nav className={styles.navigation}>
          {navigation.map((item, index) => {
            const active = isActive(item.href, item.exact);

            const showGroup =
              index === 0 ||
              navigation[index - 1]?.group !== item.group;

            return (
              <div key={item.href}>
                {showGroup && !collapsed && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginTop: index === 0 ? 2 : 18,
                      marginBottom: 7,
                      padding: "0 10px",
                    }}
                  >
                    <span
                      style={{
                        width: 4,
                        height: 4,
                        borderRadius: "50%",
                        background:
                          item.group === "BUSINESS"
                            ? "#7dd3fc"
                            : item.group === "MARKTPLATZ"
                            ? "#fbbf24"
                            : "#64748b",
                        boxShadow:
                          item.group === "BUSINESS"
                            ? "0 0 10px rgba(125,211,252,.55)"
                            : "none",
                      }}
                    />

                    <span
                      style={{
                        color:
                          item.group === "BUSINESS"
                            ? "#7dd3fc"
                            : "#475569",
                        fontSize: 7,
                        fontWeight: 950,
                        letterSpacing: ".12em",
                      }}
                    >
                      {item.group}
                    </span>

                    <span
                      style={{
                        flex: 1,
                        height: 1,
                        background:
                          "linear-gradient(90deg,rgba(148,163,184,.10),transparent)",
                      }}
                    />
                  </div>
                )}

                <Link
                  href={item.href}
                  title={collapsed ? item.label : undefined}
                  className={
                    active
                      ? `${styles.navLink} ${styles.navLinkActive}`
                      : styles.navLink
                  }
                  style={{
                    position: "relative",
                    overflow: "hidden",
                    justifyContent: collapsed ? "center" : undefined,
                    paddingLeft: collapsed ? 0 : undefined,
                    paddingRight: collapsed ? 0 : undefined,
                    marginBottom: 3,
                    border:
                      active && item.group === "BUSINESS"
                        ? "1px solid rgba(125,211,252,.13)"
                        : undefined,
                    background:
                      active && item.group === "BUSINESS"
                        ? "linear-gradient(90deg,rgba(14,165,233,.08),rgba(124,58,237,.08))"
                        : undefined,
                    boxShadow:
                      active && item.group === "BUSINESS"
                        ? "inset 3px 0 0 rgba(56,189,248,.75)"
                        : undefined,
                  }}
                >
                  <span
                    className={styles.navIcon}
                    style={{
                      color:
                        active && item.group === "BUSINESS"
                          ? "#7dd3fc"
                          : undefined,
                    }}
                  >
                    {item.icon}
                  </span>

                  {!collapsed && <span>{item.label}</span>}

                  {!collapsed && active && item.group === "BUSINESS" && (
                    <span
                      style={{
                        width: 5,
                        height: 5,
                        marginLeft: "auto",
                        marginRight: 4,
                        borderRadius: "50%",
                        background: "#38bdf8",
                        boxShadow:
                          "0 0 10px rgba(56,189,248,.75)",
                      }}
                    />
                  )}

                  {!collapsed && !active && (
                    <span className={styles.navArrow}>›</span>
                  )}
                </Link>
              </div>
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
