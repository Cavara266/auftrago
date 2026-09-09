import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import BusinessTaskBoardClient from "./BusinessTaskBoardClient";
import BusinessCreateTaskButton from "./BusinessCreateTaskButton";

export default async function BusinessWorkflowBoard() {
  const user = await getCurrentUser();

  if (!user) return null;

  const now = new Date();

  const followupDate = new Date(now);
  followupDate.setDate(
    followupDate.getDate() - 3
  );

  const acceptedLimit = new Date(now);
  acceptedLimit.setDate(
    acceptedLimit.getDate() - 14
  );

  const [
    invoices,
    followupQuotes,
    acceptedQuotes,
  ] = await Promise.all([
    prisma.businessInvoice.findMany({
      where: {
        providerId: user.id,
        status: {
          in: ["OPEN", "SENT", "OVERDUE"],
        },
      },
      select: {
        id: true,
        invoiceNumber: true,
        customerName: true,
        totalCents: true,
        paidAmountCents: true,
        dueAt: true,
        status: true,
      },
    }),

    prisma.businessQuote.findMany({
      where: {
        providerId: user.id,
        status: {
          in: ["SENT", "OPEN"],
        },
        createdAt: {
          lte: followupDate,
        },
      },
      select: {
        id: true,
        quoteNumber: true,
        customerName: true,
        title: true,
        totalCents: true,
        createdAt: true,
        sentAt: true,
      },
    }),

    prisma.businessQuote.findMany({
      where: {
        providerId: user.id,
        status: "ACCEPTED",
        acceptedAt: {
          gte: acceptedLimit,
        },
      },
      select: {
        id: true,
        quoteNumber: true,
        customerName: true,
        title: true,
        totalCents: true,
        acceptedAt: true,
      },
    }),
  ]);

  // ========================================================
  // AUTO TASKS AUS RECHNUNGEN
  // ========================================================

  for (const invoice of invoices) {
    const remaining = Math.max(
      0,
      invoice.totalCents -
        (invoice.paidAmountCents || 0)
    );

    const overdue =
      invoice.status === "OVERDUE" ||
      (
        invoice.dueAt &&
        invoice.dueAt < now
      );

    if (!overdue || remaining <= 0) {
      continue;
    }

    const overdueDays =
      invoice.dueAt
        ? Math.max(
            1,
            Math.floor(
              (
                now.getTime() -
                invoice.dueAt.getTime()
              ) /
                86400000
            )
          )
        : 1;

    const existing =
      await prisma.businessWorkflowTask.findUnique({
        where: {
          providerId_sourceType_sourceId: {
            providerId: user.id,
            sourceType: "INVOICE",
            sourceId: invoice.id,
          },
        },
      });

    if (!existing) {
      await prisma.businessWorkflowTask.create({
        data: {
          providerId: user.id,
          sourceType: "INVOICE",
          sourceId: invoice.id,

          title:
            `Zahlung einziehen: ${
              invoice.customerName ||
              invoice.invoiceNumber
            }`,

          description:
            `${invoice.invoiceNumber} · ${overdueDays} Tag(e) überfällig`,

          href:
            `/portal/business/rechnungen/${invoice.id}`,

          priority:
            overdueDays >= 14
              ? "CRITICAL"
              : "HIGH",

          valueCents: remaining,
          dueAt: new Date(),
        },
      });
    }
  }

  // ========================================================
  // AUTO TASKS AUS OFFER TEN
  // ========================================================

  for (const quote of followupQuotes) {
    const existing =
      await prisma.businessWorkflowTask.findUnique({
        where: {
          providerId_sourceType_sourceId: {
            providerId: user.id,
            sourceType: "QUOTE_FOLLOWUP",
            sourceId: quote.id,
          },
        },
      });

    if (!existing) {
      const dueAt = new Date();
      dueAt.setDate(dueAt.getDate() + 1);

      await prisma.businessWorkflowTask.create({
        data: {
          providerId: user.id,
          sourceType: "QUOTE_FOLLOWUP",
          sourceId: quote.id,

          title:
            `Offerte nachfassen: ${
              quote.customerName ||
              quote.title
            }`,

          description:
            `${quote.quoteNumber} · offene Verkaufschance`,

          href:
            `/portal/business/offerten/${quote.id}`,

          priority: "MEDIUM",
          valueCents: quote.totalCents,
          dueAt,
        },
      });
    }
  }

  // ========================================================
  // AUTO TASKS AUS ANGENOMMENEN OFFER TEN
  // ========================================================

  for (const quote of acceptedQuotes) {
    const existing =
      await prisma.businessWorkflowTask.findUnique({
        where: {
          providerId_sourceType_sourceId: {
            providerId: user.id,
            sourceType: "ACCEPTED_QUOTE",
            sourceId: quote.id,
          },
        },
      });

    if (!existing) {
      const dueAt = new Date();
      dueAt.setDate(dueAt.getDate() + 1);

      await prisma.businessWorkflowTask.create({
        data: {
          providerId: user.id,
          sourceType: "ACCEPTED_QUOTE",
          sourceId: quote.id,

          title:
            `Auftrag vorbereiten: ${
              quote.customerName ||
              quote.title
            }`,

          description:
            `${quote.quoteNumber} wurde angenommen`,

          href:
            `/portal/business/offerten/${quote.id}`,

          priority: "MEDIUM",
          valueCents: quote.totalCents,
          dueAt,
        },
      });
    }
  }

  const tasks =
    await prisma.businessWorkflowTask.findMany({
      where: {
        providerId: user.id,
      },
      orderBy: [
        {
          completedAt: "desc",
        },
        {
          dueAt: "asc",
        },
        {
          createdAt: "desc",
        },
      ],
      take: 30,
    });

  const serialized = tasks.map((task) => ({
    id: task.id,
    title: task.title,
    description: task.description,
    href: task.href,
    status: task.status,
    priority: task.priority,
    valueCents: task.valueCents,
    dueAt:
      task.dueAt
        ? task.dueAt.toISOString()
        : null,
    assigneeName:
      task.assigneeName,
    notes:
      task.notes,
  }));

  const openCount =
    tasks.filter(
      (task) =>
        task.status === "OPEN"
    ).length;

  const progressCount =
    tasks.filter(
      (task) =>
        task.status === "IN_PROGRESS"
    ).length;

  const doneCount =
    tasks.filter(
      (task) =>
        task.status === "DONE"
    ).length;

  return (
    <section
      style={{
        position: "relative",
        padding: 26,
        borderRadius: 24,
        border:
          "1px solid rgba(125,211,252,.11)",
        background:
          "linear-gradient(145deg,rgba(7,18,35,.96),rgba(17,21,48,.88))",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          width: 300,
          height: 300,
          borderRadius: "50%",
          right: -130,
          top: -160,
          background:
            "rgba(14,165,233,.07)",
          filter: "blur(80px)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 20,
            flexWrap: "wrap",
            alignItems: "end",
          }}
        >
          <div>
            <div
              style={{
                color: "#7dd3fc",
                fontSize: 10,
                fontWeight: 950,
                letterSpacing: ".10em",
              }}
            >
              AUFTRAGO WORKFLOW
            </div>

            <h2
              style={{
                margin: "7px 0 5px",
                fontSize:
                  "clamp(26px,3vw,36px)",
                letterSpacing: "-.04em",
              }}
            >
              Aufgaben & Workflow
            </h2>

            <p
              style={{
                margin: 0,
                color: "#64748b",
                fontSize: 12,
              }}
            >
              Aufgaben werden aus deinen
              Business-Daten automatisch erzeugt
              und bleiben gespeichert.
            </p>
          </div>

          <div
            style={{
              display: "flex",
              gap: 8,
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <BusinessCreateTaskButton />

            <Counter
              label="OFFEN"
              value={openCount}
              color="#7dd3fc"
            />

            <Counter
              label="IN ARBEIT"
              value={progressCount}
              color="#fbbf24"
            />

            <Counter
              label="ERLEDIGT"
              value={doneCount}
              color="#86efac"
            />
          </div>
        </div>

        <BusinessTaskBoardClient
          tasks={serialized}
        />
      </div>
    </section>
  );
}

function Counter({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div
      style={{
        minWidth: 74,
        padding: "8px 11px",
        borderRadius: 11,
        border:
          "1px solid rgba(148,163,184,.08)",
        background:
          "rgba(2,6,23,.30)",
      }}
    >
      <div
        style={{
          color: "#64748b",
          fontSize: 7,
          fontWeight: 950,
          letterSpacing: ".07em",
        }}
      >
        {label}
      </div>

      <div
        style={{
          color,
          fontSize: 16,
          fontWeight: 950,
          marginTop: 3,
        }}
      >
        {value}
      </div>
    </div>
  );
}
