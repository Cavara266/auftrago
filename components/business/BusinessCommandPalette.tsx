"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type CommandItem = {
  label: string;
  description: string;
  href: string;
  icon: string;
  group: string;
};

const commands: CommandItem[] = [
  {
    label: "AI Offerte erstellen",
    description: "Neue Offerte mit Auftrago AI vorbereiten",
    href: "/portal/business/ai",
    icon: "✦",
    group: "ERSTELLEN",
  },
  {
    label: "Neue Offerte",
    description: "Offerte manuell erstellen",
    href: "/portal/business/offerten",
    icon: "◇",
    group: "ERSTELLEN",
  },
  {
    label: "Rechnungen öffnen",
    description: "Offene, bezahlte und überfällige Rechnungen",
    href: "/portal/business/rechnungen",
    icon: "◫",
    group: "FINANZEN",
  },
  {
    label: "Kunden öffnen",
    description: "Business CRM und Kundendaten",
    href: "/portal/business/kunden",
    icon: "◎",
    group: "CRM",
  },
  {
    label: "Analytics öffnen",
    description: "Umsatz, Pipeline und Kennzahlen",
    href: "/portal/business/analytics",
    icon: "↗",
    group: "ANALYSE",
  },
  {
    label: "Transaktionen",
    description: "Zahlungseingänge und Bewegungen",
    href: "/portal/business/transaktionen",
    icon: "⇄",
    group: "FINANZEN",
  },
  {
    label: "Firmenprofil",
    description: "Firmendaten und Branding",
    href: "/portal/business/firmenprofil",
    icon: "◆",
    group: "EINSTELLUNGEN",
  },
  {
    label: "Einstellungen",
    description: "Business-Einstellungen verwalten",
    href: "/portal/business/einstellungen",
    icon: "⚙",
    group: "EINSTELLUNGEN",
  },
];

export default function BusinessCommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (
        (event.metaKey || event.ctrlKey) &&
        event.key.toLowerCase() === "k"
      ) {
        event.preventDefault();
        setOpen((value) => !value);
      }

      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", handler);

    return () =>
      window.removeEventListener("keydown", handler);
  }, []);

  const filtered = useMemo(() => {
    const value = query.trim().toLowerCase();

    if (!value) return commands;

    return commands.filter((item) =>
      [
        item.label,
        item.description,
        item.group,
      ]
        .join(" ")
        .toLowerCase()
        .includes(value)
    );
  }, [query]);

  return (
    <>
      <style>{`
        .business-command-trigger {
          transition:
            transform .18s ease,
            border-color .18s ease,
            background .18s ease,
            box-shadow .18s ease;
        }

        .business-command-trigger:hover {
          transform: translateY(-2px);
          border-color: rgba(125,211,252,.26) !important;
          box-shadow: 0 16px 38px rgba(2,6,23,.22);
        }

        .business-command-item {
          transition:
            background .16s ease,
            transform .16s ease,
            border-color .16s ease;
        }

        .business-command-item:hover {
          background: rgba(30,41,59,.64) !important;
          transform: translateX(3px);
          border-color: rgba(125,211,252,.14) !important;
        }
      `}</style>

      <button
        type="button"
        onClick={() => setOpen(true)}
        className="business-command-trigger"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 10,
          padding: "11px 14px",
          borderRadius: 13,
          border:
            "1px solid rgba(148,163,184,.12)",
          background: "rgba(8,19,37,.74)",
          color: "#cbd5e1",
          fontSize: 12,
          fontWeight: 850,
          cursor: "pointer",
        }}
      >
        <span style={{ color: "#7dd3fc" }}>
          ⌘
        </span>
        Schnell öffnen
        <span
          style={{
            padding: "3px 7px",
            borderRadius: 7,
            background: "rgba(148,163,184,.08)",
            color: "#64748b",
            fontSize: 9,
            fontWeight: 900,
          }}
        >
          K
        </span>
      </button>

      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "rgba(2,6,23,.72)",
            backdropFilter: "blur(14px)",
            padding: "10vh 18px 30px",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: 720,
              margin: "0 auto",
              borderRadius: 24,
              border:
                "1px solid rgba(125,211,252,.14)",
              background:
                "linear-gradient(145deg,rgba(7,18,34,.98),rgba(18,20,52,.98))",
              boxShadow:
                "0 45px 120px rgba(2,6,23,.60)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: 18,
                borderBottom:
                  "1px solid rgba(148,163,184,.08)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: 12,
                  alignItems: "center",
                  padding: "0 12px",
                  borderRadius: 14,
                  background: "rgba(2,6,23,.52)",
                  border:
                    "1px solid rgba(148,163,184,.10)",
                }}
              >
                <span
                  style={{
                    color: "#7dd3fc",
                    fontSize: 18,
                  }}
                >
                  ✦
                </span>

                <input
                  autoFocus
                  value={query}
                  onChange={(e) =>
                    setQuery(e.target.value)
                  }
                  placeholder="Suche Funktion, Kunde, Rechnung oder Aktion..."
                  style={{
                    width: "100%",
                    minHeight: 54,
                    border: 0,
                    outline: 0,
                    background: "transparent",
                    color: "#f8fafc",
                    fontSize: 14,
                    fontWeight: 650,
                  }}
                />

                <span
                  style={{
                    color: "#475569",
                    fontSize: 10,
                    whiteSpace: "nowrap",
                  }}
                >
                  ESC
                </span>
              </div>
            </div>

            <div
              style={{
                maxHeight: "58vh",
                overflowY: "auto",
                padding: 12,
              }}
            >
              {filtered.length === 0 && (
                <div
                  style={{
                    padding: "30px 18px",
                    textAlign: "center",
                    color: "#64748b",
                    fontSize: 13,
                  }}
                >
                  Keine passende Aktion gefunden.
                </div>
              )}

              {filtered.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="business-command-item"
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "42px 1fr auto",
                    gap: 12,
                    alignItems: "center",
                    padding: 13,
                    borderRadius: 14,
                    border:
                      "1px solid transparent",
                    color: "#f8fafc",
                    textDecoration: "none",
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      display: "grid",
                      placeItems: "center",
                      borderRadius: 12,
                      background:
                        "linear-gradient(135deg,rgba(14,165,233,.10),rgba(124,58,237,.14))",
                      border:
                        "1px solid rgba(125,211,252,.10)",
                      color: "#7dd3fc",
                      fontWeight: 950,
                    }}
                  >
                    {item.icon}
                  </div>

                  <div>
                    <div
                      style={{
                        fontWeight: 900,
                        fontSize: 13,
                      }}
                    >
                      {item.label}
                    </div>

                    <div
                      style={{
                        color: "#64748b",
                        fontSize: 10,
                        marginTop: 3,
                      }}
                    >
                      {item.description}
                    </div>
                  </div>

                  <div
                    style={{
                      color: "#475569",
                      fontSize: 9,
                      fontWeight: 900,
                      letterSpacing: ".07em",
                    }}
                  >
                    {item.group}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
