"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/admin", label: "Dashboard", icon: "▦", exact: true },
  { href: "/admin/analytics", label: "Analytics", icon: "↗" },
  { href: "/admin/providers", label: "Anbieter", icon: "👥" },
  { href: "/admin/leads", label: "Leads", icon: "▤" },
  { href: "/admin/activity", label: "Aktivitäten", icon: "⚡" },
  { href: "/portal/transaktionen", label: "Zahlungen", icon: "💳" },
  { href: "/portal", label: "Portal", icon: "⌂" },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <>
      <div className="admin-menu-brand">
        <div className="admin-menu-logo">A</div>
        <div>
          <strong>Auftrago</strong>
          <span>Administration</span>
        </div>
      </div>

      <nav className="admin-menu-nav" aria-label="Admin Navigation">
        {items.map((item) => {
          const active = item.exact
            ? pathname === item.href
            : pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`admin-menu-link${active ? " is-active" : ""}`}
            >
              <span className="admin-menu-icon" aria-hidden="true">
                {item.icon}
              </span>
              <span>{item.label}</span>
              {active ? <i aria-hidden="true" /> : null}
            </Link>
          );
        })}
      </nav>

      <div className="admin-menu-footer">
        <Link href="/admin-logout" className="admin-menu-logout">
          <span aria-hidden="true">↪</span>
          Abmelden
        </Link>
      </div>
    </>
  );
}