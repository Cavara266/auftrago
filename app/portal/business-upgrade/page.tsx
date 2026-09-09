import Link from "next/link";
import { redirect } from "next/navigation";

import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getBusinessSubscriptionAccess } from "@/lib/business/subscription-access";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type Props = {
  searchParams?: Promise<{
    reason?: string;
  }>;
};

export default async function BusinessUpgradePage({
  searchParams,
}: Props) {
  const params: {
    reason?: string;
  } =
    await Promise.resolve(
      searchParams ?? {}
    );

  const user =
    await requireUser();

  if (!user) {
    redirect(
      "/login?redirect=/portal/business"
    );
  }

  const provider =
    await prisma.provider.findUnique({
      where: {
        id: user.id,
      },
      select: {
        subscriptionExempt: true,
        subscriptionStatus: true,
        subscriptionCurrentPeriodEnd:
          true,

        businessSubscriptionExempt:
          true,
        businessSubscriptionStatus:
          true,
        businessSubscriptionCurrentPeriodEnd:
          true,
      },
    });

  if (!provider) {
    redirect("/portal");
  }

  const access =
    getBusinessSubscriptionAccess(
      provider
    );

  if (access.hasBusinessAccess) {
    redirect(
      "/portal/business"
    );
  }

  const reason =
    params.reason ||
    (
      !access.baseSubscriptionActive &&
      !access.businessSubscriptionActive
        ? "both"
        : !access.baseSubscriptionActive
        ? "base"
        : "business"
    );

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at 70% 10%,rgba(124,58,237,.16),transparent 34%),radial-gradient(circle at 18% 15%,rgba(14,165,233,.08),transparent 30%),#061120",
        color: "#f8fafc",
        padding: "60px 24px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: "min(100%,1080px)",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "7px 11px",
            borderRadius: 999,
            border:
              "1px solid rgba(251,191,36,.18)",
            background:
              "rgba(251,191,36,.06)",
            color: "#fbbf24",
            fontSize: 9,
            fontWeight: 950,
            letterSpacing: ".08em",
          }}
        >
          ✦ NEU · AUFTRAGO BUSINESS
        </div>

        <h1
          style={{
            maxWidth: 850,
            margin: "18px 0 10px",
            fontSize:
              "clamp(44px,7vw,82px)",
            lineHeight: .96,
            letterSpacing: "-.055em",
          }}
        >
          Dein komplettes
          <span
            style={{
              display: "block",
              background:
                "linear-gradient(90deg,#38bdf8,#818cf8,#c084fc)",
              WebkitBackgroundClip:
                "text",
              color: "transparent",
            }}
          >
            Business Command System.
          </span>
        </h1>

        <p
          style={{
            maxWidth: 760,
            margin: "20px 0 0",
            color: "#94a3b8",
            fontSize: 15,
            lineHeight: 1.8,
          }}
        >
          Auftrago Business ist ein Zusatzmodul
          für aktive Auftrago-Anbieter. Für den
          Zugriff müssen das Anbieter-Abo und
          das Business-Abo gleichzeitig aktiv
          sein.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(280px,1fr))",
            gap: 14,
            marginTop: 34,
          }}
        >
          <Plan
            title="Auftrago Anbieter"
            price="CHF 69.–"
            text="Marktplatz, Leads, Fixaufträge, Ausschreibungen und Mein CRM."
            active={
              access.baseSubscriptionActive
            }
            number="01"
          />

          <Plan
            title="Auftrago Business"
            price="CHF 79.–"
            text="Kunden, Offerten, Rechnungen, Operations, Aufgaben, Kalender und Analytics."
            active={
              access.businessSubscriptionActive
            }
            number="02"
            isNew
          />
        </div>

        <section
          style={{
            marginTop: 16,
            padding: 25,
            borderRadius: 22,
            border:
              "1px solid rgba(125,211,252,.11)",
            background:
              "linear-gradient(135deg,rgba(7,19,37,.94),rgba(21,20,57,.88))",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent:
                "space-between",
              alignItems: "center",
              gap: 20,
              flexWrap: "wrap",
            }}
          >
            <div>
              <div
                style={{
                  color: "#7dd3fc",
                  fontSize: 8,
                  fontWeight: 950,
                  letterSpacing: ".10em",
                }}
              >
                DEIN ZUGANG
              </div>

              <h2
                style={{
                  margin: "7px 0 5px",
                  fontSize: 25,
                }}
              >
                {reason === "business"
                  ? "Business-Abo fehlt"
                  : reason === "base"
                  ? "Anbieter-Abo fehlt"
                  : "Beide Abos werden benötigt"}
              </h2>

              <p
                style={{
                  margin: 0,
                  color: "#64748b",
                  fontSize: 10,
                  lineHeight: 1.7,
                }}
              >
                Vollzugriff auf Auftrago Business:
                CHF 69.– Anbieter-Abo + CHF 79.–
                Business-Abo.
              </p>
            </div>

            <div
              style={{
                fontSize: 31,
                fontWeight: 950,
                color: "#f8fafc",
              }}
            >
              CHF 148.–
              <span
                style={{
                  color: "#64748b",
                  fontSize: 10,
                  fontWeight: 800,
                }}
              >
                {" "}
                / Monat gesamt
              </span>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: 9,
              flexWrap: "wrap",
              marginTop: 20,
            }}
          >
            {!access.baseSubscriptionActive && (
              <Link
                href="/portal/abo"
                style={primaryButton}
              >
                Anbieter-Abo aktivieren →
              </Link>
            )}

            {access.baseSubscriptionActive &&
              !access.businessSubscriptionActive && (
                <form
                  action="/api/business/subscription/checkout"
                  method="post"
                >
                  <button
                    type="submit"
                    style={{
                      ...primaryButton,
                      cursor: "pointer",
                      fontFamily: "inherit",
                    }}
                  >
                    Business-Abo CHF 79.– aktivieren →
                  </button>
                </form>
              )}

            <Link
              href="/portal"
              style={secondaryButton}
            >
              ← Zurück zum Portal
            </Link>
          </div>
        </section>

        <div
          style={{
            marginTop: 17,
            color: "#475569",
            fontSize: 9,
            lineHeight: 1.7,
          }}
        >
          Mein CRM und die Lead-Verwaltung
          gehören weiterhin zum CHF-69-Anbieter-Abo.
          Die Kundenverwaltung innerhalb von
          Auftrago Business ist ein separates
          Business-Modul.
        </div>
      </div>
    </main>
  );
}

function Plan({
  title,
  price,
  text,
  active,
  number,
  isNew = false,
}: {
  title: string;
  price: string;
  text: string;
  active: boolean;
  number: string;
  isNew?: boolean;
}) {
  return (
    <div
      style={{
        padding: 23,
        borderRadius: 20,
        border: active
          ? "1px solid rgba(34,197,94,.19)"
          : "1px solid rgba(148,163,184,.10)",
        background: active
          ? "linear-gradient(145deg,rgba(8,35,34,.68),rgba(7,19,37,.90))"
          : "linear-gradient(145deg,rgba(7,19,37,.92),rgba(17,20,49,.84))",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          gap: 10,
        }}
      >
        <span
          style={{
            color: "#475569",
            fontSize: 8,
            fontWeight: 950,
          }}
        >
          {number}
        </span>

        <span
          style={{
            color: active
              ? "#86efac"
              : "#fbbf24",
            fontSize: 8,
            fontWeight: 950,
          }}
        >
          {active
            ? "✓ AKTIV"
            : isNew
            ? "NEU · NICHT AKTIV"
            : "NICHT AKTIV"}
        </span>
      </div>

      <h2
        style={{
          margin: "21px 0 5px",
          fontSize: 22,
        }}
      >
        {title}
      </h2>

      <div
        style={{
          color: active
            ? "#86efac"
            : "#7dd3fc",
          fontSize: 28,
          fontWeight: 950,
        }}
      >
        {price}
      </div>

      <p
        style={{
          margin: "12px 0 0",
          color: "#64748b",
          fontSize: 10,
          lineHeight: 1.65,
        }}
      >
        {text}
      </p>
    </div>
  );
}

const primaryButton = {
  minHeight: 44,
  padding: "0 17px",
  display: "inline-flex",
  alignItems: "center",
  borderRadius: 11,
  border: 0,
  background:
    "linear-gradient(90deg,#0ea5e9,#6366f1,#7c3aed)",
  color: "#fff",
  textDecoration: "none",
  fontSize: 9,
  fontWeight: 950,
} as const;

const secondaryButton = {
  minHeight: 44,
  padding: "0 17px",
  display: "inline-flex",
  alignItems: "center",
  borderRadius: 11,
  border:
    "1px solid rgba(148,163,184,.10)",
  background:
    "rgba(15,23,42,.40)",
  color: "#94a3b8",
  textDecoration: "none",
  fontSize: 9,
  fontWeight: 900,
} as const;
