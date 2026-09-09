import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import BusinessCommandHero from "@/components/business/BusinessCommandHero";
import BusinessPerformanceSection from "@/components/business/BusinessPerformanceSection";
import BusinessActionCenter from "@/components/business/BusinessActionCenter";
import BusinessCommandPalette from "@/components/business/BusinessCommandPalette";
import BusinessNotificationCenter from "@/components/business/BusinessNotificationCenter";
import BusinessMorningBriefing from "@/components/business/BusinessMorningBriefing";
import BusinessTaskQueue from "@/components/business/BusinessTaskQueue";
import BusinessCockpitQuickLaunch from "@/components/business/BusinessCockpitQuickLaunch";

export default async function BusinessPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const now = new Date();

  const monthStart = new Date(
    now.getFullYear(),
    now.getMonth(),
    1
  );

  const nextMonthStart = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    1
  );

  // Überfällige Rechnungen automatisch erkennen
  await prisma.businessInvoice.updateMany({
    where: {
      providerId: user.id,
      dueAt: {
        lt: now,
      },
      status: {
        in: ["OPEN", "SENT"],
      },
    },
    data: {
      status: "OVERDUE",
    },
  });

  const [
    monthlyInvoices,
    openInvoices,
    overdueInvoices,
    openQuotes,
    customerCount,
    acceptedQuotes,
    decidedQuotes,
  ] = await Promise.all([
    prisma.businessInvoice.findMany({
      where: {
        providerId: user.id,
        paidAt: {
          gte: monthStart,
          lt: nextMonthStart,
        },
        status: "PAID",
      },
      select: {
        totalCents: true,
        paidAmountCents: true,
      },
    }),

    prisma.businessInvoice.findMany({
      where: {
        providerId: user.id,
        status: {
          in: ["SENT", "OPEN", "OVERDUE"],
        },
      },
      select: {
        totalCents: true,
        paidAmountCents: true,
      },
    }),

    prisma.businessInvoice.findMany({
      where: {
        providerId: user.id,
        status: "OVERDUE",
      },
      select: {
        totalCents: true,
        paidAmountCents: true,
      },
    }),

    prisma.businessQuote.findMany({
      where: {
        providerId: user.id,
        status: {
          in: ["DRAFT", "SENT", "OPEN"],
        },
      },
      select: {
        totalCents: true,
      },
    }),

    prisma.businessCustomer.count({
      where: {
        providerId: user.id,
      },
    }),

    prisma.businessQuote.count({
      where: {
        providerId: user.id,
        status: "ACCEPTED",
      },
    }),

    prisma.businessQuote.count({
      where: {
        providerId: user.id,
        status: {
          in: ["ACCEPTED", "DECLINED"],
        },
      },
    }),
  ]);

  const monthlyRevenueCents =
    monthlyInvoices.reduce(
      (sum, invoice) =>
        sum +
        (
          invoice.paidAmountCents > 0
            ? invoice.paidAmountCents
            : invoice.totalCents
        ),
      0
    );

  const openInvoiceCents =
    openInvoices.reduce(
      (sum, invoice) =>
        sum +
        Math.max(
          0,
          invoice.totalCents -
            (invoice.paidAmountCents || 0)
        ),
      0
    );

  const overdueCents =
    overdueInvoices.reduce(
      (sum, invoice) =>
        sum +
        Math.max(
          0,
          invoice.totalCents -
            (invoice.paidAmountCents || 0)
        ),
      0
    );

  const openQuoteCents =
    openQuotes.reduce(
      (sum, quote) =>
        sum + quote.totalCents,
      0
    );

  const attentionCount =
    overdueInvoices.length;

  const companyName =
    user.name ||
    user.email ||
    "Business";

  return (
    <main
      style={{
        position: "relative",
        minHeight: "100vh",
        padding: "36px 34px 80px",
        overflow: "hidden",
      }}
    >
      {/* Hintergrund Glow */}
      <div
        style={{
          position: "fixed",
          width: 520,
          height: 520,
          borderRadius: "50%",
          background:
            "rgba(14,165,233,.045)",
          filter: "blur(120px)",
          top: 120,
          right: -220,
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <div
        style={{
          position: "fixed",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background:
            "rgba(124,58,237,.055)",
          filter: "blur(130px)",
          bottom: -180,
          left: 100,
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: 1460,
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            gap: 10,
            marginBottom: 14,
          }}
        >
          <BusinessCommandPalette />

          <BusinessNotificationCenter
            notifications={[
              ...(overdueCents > 0
                ? [
                    {
                      id: "overdue",
                      title: "Überfällige Rechnungen",
                      text: `${overdueInvoices.length} Rechnung(en) benötigen Aufmerksamkeit.`,
                      href: "/portal/business/rechnungen",
                      type: "warning" as const,
                    },
                  ]
                : []),

              ...(openQuoteCents > 0
                ? [
                    {
                      id: "quotes",
                      title: "Offene Offerten",
                      text: `Aktuelles Potenzial: CHF ${(openQuoteCents / 100).toFixed(0)}.`,
                      href: "/portal/business/offerten",
                      type: "info" as const,
                    },
                  ]
                : []),
            ]}
          />
        </div>
        {/* ==================================================
            COMMAND CENTER
        ================================================== */}

        <BusinessCommandHero
          companyName={companyName}
          monthlyRevenueCents={
            monthlyRevenueCents
          }
          openInvoiceCents={
            openInvoiceCents
          }
          overdueCents={
            overdueCents
          }
          openQuoteCents={
            openQuoteCents
          }
          customerCount={
            customerCount
          }
          acceptedQuotes={
            acceptedQuotes
          }
          totalDecidedQuotes={
            decidedQuotes
          }
          attentionCount={
            attentionCount
          }
        />

        <div style={{ height: 18 }} />

        <BusinessCockpitQuickLaunch />

        <div style={{ height: 18 }} />

        <BusinessMorningBriefing />

        <div style={{ height: 22 }} />

        <BusinessTaskQueue />

        <div style={{ height: 22 }} />


        <div style={{ height: 30 }} />


        <div style={{ height: 30 }} />


        <div style={{ height: 30 }} />



        {/* ==================================================
            PERFORMANCE
        ================================================== */}

        <div
          style={{
            height: 42,
          }}
        />

        <BusinessPerformanceSection />

        {/* ==================================================
            TODAY / ACTION CENTER
        ================================================== */}

        <div
          style={{
            height: 50,
          }}
        />

        <BusinessActionCenter />

        <div
          style={{
            height: 40,
          }}
        />

        {/* ==================================================
            PREMIUM FOOTER STRIP
        ================================================== */}

        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
            gap: 20,
            flexWrap: "wrap",
            padding: "20px 24px",
            borderRadius: 20,
            border:
              "1px solid rgba(148,163,184,.08)",
            background:
              "rgba(8,19,37,.42)",
            color: "#64748b",
            fontSize: 11,
          }}
        >
          <div>
            <strong
              style={{
                color: "#94a3b8",
              }}
            >
              Auftrago Business
            </strong>
            {" · "}
            Dein digitales Business Command Center
          </div>

          <div
            style={{
              display: "flex",
              gap: 18,
              alignItems: "center",
            }}
          >
            <span>
              ● Systeme aktiv
            </span>

            <span>
              Daten live
            </span>

            <span
              style={{
                color: "#86efac",
                fontWeight: 800,
              }}
            >
              ✓ Online
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}
