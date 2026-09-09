"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import BusinessAICommandBar from "@/components/business/BusinessAICommandBar";


function formatCHF(cents: number) {
  const value = Math.round(cents / 100);

  const formatted = String(value).replace(
    /\B(?=(\d{3})+(?!\d))/g,
    "'"
  );

  return `CHF ${formatted}`;
}


type Props = {
  companyName: string;
  monthlyRevenueCents: number;
  openInvoiceCents: number;
  overdueCents: number;
  openQuoteCents: number;
  customerCount: number;
  acceptedQuotes: number;
  totalDecidedQuotes: number;
  attentionCount: number;
};

function money(cents: number) {
  return new Intl.NumberFormat("de-CH", {
    style: "currency",
    currency: "CHF",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

export default function BusinessCommandHero({
  companyName,
  monthlyRevenueCents,
  openInvoiceCents,
  overdueCents,
  openQuoteCents,
  customerCount,
  acceptedQuotes,
  totalDecidedQuotes,
  attentionCount,
}: Props) {
  const router = useRouter();
  const [command, setCommand] = useState("");

  const conversion =
    totalDecidedQuotes > 0
      ? Math.round(
          (acceptedQuotes / totalDecidedQuotes) * 100
        )
      : 0;

  function runCommand() {
    const value = command.trim();

    if (!value) {
      router.push("/portal/business/ai");
      return;
    }

    router.push(
      `/portal/business/ai?prompt=${encodeURIComponent(value)}`
    );
  }

  const metrics = [
    {
      icon: "↗",
      label: "MONATSUMSATZ",
      value: money(monthlyRevenueCents),
      detail: "Aktueller Monat",
      glow: "rgba(34,197,94,.16)",
      valueColor: "#86efac",
    },
    {
      icon: "◫",
      label: "OFFENE RECHNUNGEN",
      value: money(openInvoiceCents),
      detail: "Noch ausstehend",
      glow: "rgba(14,165,233,.15)",
      valueColor: "#7dd3fc",
    },
    {
      icon: "!",
      label: "ÜBERFÄLLIG",
      value: money(overdueCents),
      detail:
        overdueCents > 0
          ? "Jetzt nachfassen"
          : "Alles im grünen Bereich",
      glow: "rgba(248,113,113,.15)",
      valueColor:
        overdueCents > 0 ? "#fca5a5" : "#86efac",
    },
    {
      icon: "◇",
      label: "OFFERTEN-PIPELINE",
      value: money(openQuoteCents),
      detail: "Offenes Potenzial",
      glow: "rgba(167,139,250,.16)",
      valueColor: "#c4b5fd",
    },
  ];

  return (
    <>
      <style>{`
        @keyframes auftragoOrbOne {
          0%,100% { transform: translate3d(0,0,0) scale(1); }
          50% { transform: translate3d(40px,18px,0) scale(1.12); }
        }

        @keyframes auftragoOrbTwo {
          0%,100% { transform: translate3d(0,0,0) scale(1); }
          50% { transform: translate3d(-35px,25px,0) scale(1.15); }
        }

        @keyframes auftragoPulse {
          0%,100% { opacity:.45; }
          50% { opacity:.9; }
        }

        .auftrago-command-card {
          transition:
            transform .22s ease,
            border-color .22s ease,
            box-shadow .22s ease,
            background .22s ease;
        }

        .auftrago-command-card:hover {
          transform: translateY(-4px);
          border-color: rgba(125,211,252,.26) !important;
          box-shadow: 0 24px 70px rgba(2,6,23,.35);
        }

        .auftrago-quick {
          transition:
            transform .18s ease,
            background .18s ease,
            border-color .18s ease;
        }

        .auftrago-quick:hover {
          transform: translateY(-2px);
          background: rgba(30,41,59,.88) !important;
          border-color: rgba(125,211,252,.24) !important;
        }

        @media(max-width:850px) {
          .auftrago-command-metrics {
            grid-template-columns:1fr 1fr !important;
          }

          .auftrago-command-input {
            grid-template-columns:1fr !important;
          }

          .auftrago-command-bottom {
            grid-template-columns:1fr !important;
          }
        }

        @media(max-width:560px) {
          .auftrago-command-metrics {
            grid-template-columns:1fr !important;
          }
        }
      `}</style>

      <section
        style={{
          position: "relative",
          overflow: "hidden",
          borderRadius: 30,
          padding: "32px",
          border: "1px solid rgba(125,211,252,.13)",
          background:
            "linear-gradient(135deg,rgba(4,15,30,.98),rgba(13,21,48,.97) 52%,rgba(34,22,75,.88))",
          boxShadow:
            "0 35px 100px rgba(2,6,23,.38), inset 0 1px 0 rgba(255,255,255,.035)",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: 380,
            height: 380,
            borderRadius: "50%",
            background: "rgba(14,165,233,.12)",
            filter: "blur(90px)",
            top: -220,
            left: -80,
            pointerEvents: "none",
            animation:
              "auftragoOrbOne 9s ease-in-out infinite",
          }}
        />

        <div
          style={{
            position: "absolute",
            width: 420,
            height: 420,
            borderRadius: "50%",
            background: "rgba(124,58,237,.15)",
            filter: "blur(100px)",
            right: -140,
            bottom: -260,
            pointerEvents: "none",
            animation:
              "auftragoOrbTwo 11s ease-in-out infinite",
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 2,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 20,
              flexWrap: "wrap",
              alignItems: "flex-start",
            }}
          >
            <div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  color: "#7dd3fc",
                  fontSize: 11,
                  fontWeight: 950,
                  letterSpacing: ".11em",
                }}
              >
                <span
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: 999,
                    background: "#38bdf8",
                    boxShadow:
                      "0 0 16px rgba(56,189,248,.9)",
                    animation:
                      "auftragoPulse 2s ease-in-out infinite",
                  }}
                />
                AUFTRAGO BUSINESS COMMAND CENTER
              </div>

              <h1
                style={{
                  margin: "13px 0 8px",
                  fontSize: "clamp(32px,4vw,54px)",
                  lineHeight: 1,
                  letterSpacing: "-.045em",
                  fontWeight: 950,
                }}
              >
                Guten Tag, {companyName}
              </h1>

              <p
                style={{
                  color: "#94a3b8",
                  fontSize: 15,
                  lineHeight: 1.7,
                  margin: 0,
                  maxWidth: 650,
                }}
              >
                Umsatz, Kunden, Offerten und Zahlungen.
                Dein Unternehmen auf einen Blick.
              </p>
            </div>

            <div
              style={{
                padding: "10px 14px",
                borderRadius: 999,
                border:
                  attentionCount > 0
                    ? "1px solid rgba(251,191,36,.25)"
                    : "1px solid rgba(34,197,94,.22)",
                background:
                  attentionCount > 0
                    ? "rgba(251,191,36,.08)"
                    : "rgba(34,197,94,.07)",
                color:
                  attentionCount > 0
                    ? "#fbbf24"
                    : "#86efac",
                fontWeight: 900,
                fontSize: 12,
              }}
            >
              {attentionCount > 0
                ? `⚡ ${attentionCount} Punkte brauchen Aufmerksamkeit`
                : "✓ Business läuft sauber"}
            </div>
          </div>

          <div style={{ marginTop: 30 }}>
            <BusinessAICommandBar />
          </div>

<div
            className="auftrago-command-metrics"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4,1fr)",
              gap: 12,
              marginTop: 18,
            }}
          >
            {metrics.map((metric) => (
              <div
                key={metric.label}
                className="auftrago-command-card"
                style={{
                  position: "relative",
                  overflow: "hidden",
                  padding: 18,
                  minHeight: 142,
                  borderRadius: 18,
                  border:
                    "1px solid rgba(148,163,184,.10)",
                  background: "rgba(2,6,23,.38)",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    width: 110,
                    height: 110,
                    borderRadius: "50%",
                    background: metric.glow,
                    filter: "blur(35px)",
                    right: -40,
                    top: -40,
                  }}
                />

                <div
                  style={{
                    width: 32,
                    height: 32,
                    display: "grid",
                    placeItems: "center",
                    borderRadius: 10,
                    background: metric.glow,
                    fontWeight: 950,
                  }}
                >
                  {metric.icon}
                </div>

                <div
                  style={{
                    color: "#64748b",
                    fontSize: 10,
                    fontWeight: 950,
                    letterSpacing: ".08em",
                    marginTop: 15,
                  }}
                >
                  {metric.label}
                </div>

                <div
                  style={{
                    color: metric.valueColor,
                    fontSize: 25,
                    fontWeight: 950,
                    letterSpacing: "-.03em",
                    marginTop: 5,
                  }}
                >
                  {metric.value}
                </div>

                <div
                  style={{
                    color: "#64748b",
                    fontSize: 11,
                    marginTop: 5,
                  }}
                >
                  {metric.detail}
                </div>
              </div>
            ))}
          </div>

          <div
            className="auftrago-command-bottom"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr auto",
              gap: 14,
              marginTop: 16,
              alignItems: "stretch",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: 9,
                flexWrap: "wrap",
              }}
            >
              {[
                {
                  href: "/portal/business/ai",
                  icon: "✦",
                  text: "AI Offerte",
                },
                {
                  href: "/portal/business/offerten",
                  icon: "◇",
                  text: "Offerten",
                },
                {
                  href: "/portal/business/rechnungen",
                  icon: "◫",
                  text: "Rechnungen",
                },
                {
                  href: "/portal/business/kunden",
                  icon: "◎",
                  text: "Kunden",
                },
                {
                  href: "/portal/business/analytics",
                  icon: "↗",
                  text: "Analytics",
                },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="auftrago-quick"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "11px 14px",
                    borderRadius: 12,
                    border:
                      "1px solid rgba(148,163,184,.11)",
                    background: "rgba(15,23,42,.54)",
                    color: "#cbd5e1",
                    textDecoration: "none",
                    fontSize: 12,
                    fontWeight: 850,
                  }}
                >
                  <span style={{ color: "#7dd3fc" }}>
                    {item.icon}
                  </span>
                  {item.text}
                </Link>
              ))}
            </div>

            <div
              style={{
                display: "flex",
                gap: 18,
                alignItems: "center",
                padding: "10px 16px",
                borderRadius: 14,
                background: "rgba(2,6,23,.32)",
                border:
                  "1px solid rgba(148,163,184,.08)",
              }}
            >
              <div>
                <div
                  style={{
                    color: "#64748b",
                    fontSize: 9,
                    fontWeight: 950,
                    letterSpacing: ".08em",
                  }}
                >
                  KUNDEN
                </div>
                <strong style={{ fontSize: 18 }}>
                  {customerCount}
                </strong>
              </div>

              <div
                style={{
                  width: 1,
                  height: 28,
                  background:
                    "rgba(148,163,184,.12)",
                }}
              />

              <div>
                <div
                  style={{
                    color: "#64748b",
                    fontSize: 9,
                    fontWeight: 950,
                    letterSpacing: ".08em",
                  }}
                >
                  ABSCHLUSSQUOTE
                </div>
                <strong
                  style={{
                    fontSize: 18,
                    color: "#c4b5fd",
                  }}
                >
                  {conversion} %
                </strong>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
