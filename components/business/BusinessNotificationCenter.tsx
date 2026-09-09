"use client";

import { useState } from "react";
import Link from "next/link";

type Notification = {
  id: string;
  title: string;
  text: string;
  href: string;
  type: "success" | "warning" | "info";
};

export default function BusinessNotificationCenter({
  notifications,
}: {
  notifications: Notification[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ position: "relative" }}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        style={{
          position: "relative",
          width: 42,
          height: 42,
          borderRadius: 13,
          border:
            "1px solid rgba(148,163,184,.12)",
          background: "rgba(8,19,37,.74)",
          color: "#cbd5e1",
          cursor: "pointer",
          fontSize: 16,
        }}
      >
        ◉

        {notifications.length > 0 && (
          <span
            style={{
              position: "absolute",
              top: -4,
              right: -4,
              minWidth: 18,
              height: 18,
              padding: "0 5px",
              borderRadius: 999,
              display: "grid",
              placeItems: "center",
              background: "#7c3aed",
              color: "#fff",
              fontSize: 9,
              fontWeight: 950,
              border: "2px solid #071426",
            }}
          >
            {notifications.length}
          </span>
        )}
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            right: 0,
            top: 50,
            width: 360,
            maxWidth: "calc(100vw - 40px)",
            borderRadius: 18,
            border:
              "1px solid rgba(148,163,184,.12)",
            background:
              "linear-gradient(145deg,rgba(7,18,34,.98),rgba(18,20,52,.98))",
            boxShadow:
              "0 30px 80px rgba(2,6,23,.45)",
            padding: 12,
            zIndex: 3000,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 10,
              padding: "8px 8px 12px",
            }}
          >
            <div>
              <div
                style={{
                  color: "#7dd3fc",
                  fontSize: 9,
                  fontWeight: 950,
                  letterSpacing: ".08em",
                }}
              >
                BUSINESS ALERTS
              </div>

              <div
                style={{
                  fontSize: 16,
                  fontWeight: 900,
                  marginTop: 4,
                }}
              >
                Benachrichtigungen
              </div>
            </div>

            <div
              style={{
                color: "#64748b",
                fontSize: 10,
              }}
            >
              {notifications.length}
            </div>
          </div>

          {notifications.length === 0 && (
            <div
              style={{
                padding: "24px 12px",
                textAlign: "center",
                color: "#64748b",
                fontSize: 12,
              }}
            >
              Aktuell keine wichtigen Meldungen.
            </div>
          )}

          {notifications.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              onClick={() => setOpen(false)}
              style={{
                display: "block",
                padding: 13,
                marginTop: 6,
                borderRadius: 13,
                border:
                  "1px solid rgba(148,163,184,.08)",
                background: "rgba(2,6,23,.32)",
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: 10,
                  alignItems: "flex-start",
                }}
              >
                <div
                  style={{
                    width: 9,
                    height: 9,
                    borderRadius: "50%",
                    marginTop: 5,
                    flex: "0 0 9px",
                    background:
                      item.type === "success"
                        ? "#22c55e"
                        : item.type === "warning"
                        ? "#f59e0b"
                        : "#38bdf8",
                    boxShadow:
                      item.type === "success"
                        ? "0 0 13px rgba(34,197,94,.55)"
                        : item.type === "warning"
                        ? "0 0 13px rgba(245,158,11,.45)"
                        : "0 0 13px rgba(56,189,248,.45)",
                  }}
                />

                <div>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 900,
                    }}
                  >
                    {item.title}
                  </div>

                  <div
                    style={{
                      color: "#64748b",
                      fontSize: 10,
                      lineHeight: 1.5,
                      marginTop: 3,
                    }}
                  >
                    {item.text}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
