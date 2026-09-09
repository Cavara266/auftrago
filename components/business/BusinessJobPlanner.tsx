import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import BusinessCreateJobButton from "./BusinessCreateJobButton";
import BusinessJobCardsClient from "./BusinessJobCardsClient";

const money = (cents: number) =>
  new Intl.NumberFormat("de-CH", {
    style: "currency",
    currency: "CHF",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100);

export default async function BusinessJobPlanner() {
  const user = await getCurrentUser();

  if (!user) return null;

  const now = new Date();

  const weekStart = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 7);

  const jobs = await prisma.businessJob.findMany({
    where: {
      providerId: user.id,
      scheduledDate: {
        gte: weekStart,
        lt: weekEnd,
      },
      status: {
        not: "CANCELLED",
      },
    },
    orderBy: [
      {
        scheduledDate: "asc",
      },
      {
        startTime: "asc",
      },
    ],
  });

  const serializedJobs = jobs.map((job) => ({
    id: job.id,
    quoteId: job.quoteId,
    title: job.title,
    customerName: job.customerName,
    customerEmail: job.customerEmail,
    customerPhone: job.customerPhone,
    location: job.location,
    assignedTo: job.assignedTo,
    status: job.status,
    scheduledDate:
      job.scheduledDate.toISOString(),
    startTime: job.startTime,
    endTime: job.endTime,
    valueCents: job.valueCents,
    notes: job.notes,
  }));

  const totalValue = jobs.reduce(
    (sum, job) =>
      sum + job.valueCents,
    0
  );

  return (
    <section
      style={{
        padding: 26,
        borderRadius: 24,
        border:
          "1px solid rgba(125,211,252,.11)",
        background:
          "linear-gradient(145deg,rgba(7,18,35,.96),rgba(15,23,48,.90))",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "end",
          gap: 20,
          flexWrap: "wrap",
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
            AUFTRAGO OPERATIONS
          </div>

          <h2
            style={{
              margin: "7px 0 5px",
              fontSize:
                "clamp(26px,3vw,36px)",
              letterSpacing: "-.04em",
            }}
          >
            Einsätze & Aufträge
          </h2>

          <p
            style={{
              margin: 0,
              color: "#64748b",
              fontSize: 12,
            }}
          >
            Termine, Mitarbeiter, Orte und Auftragswerte.
          </p>
        </div>

        <div
          style={{
            display: "flex",
            gap: 10,
            alignItems: "center",
          }}
        >
          <div
            style={{
              padding: "9px 12px",
              borderRadius: 11,
              border:
                "1px solid rgba(167,139,250,.10)",
              background:
                "rgba(124,58,237,.05)",
            }}
          >
            <div
              style={{
                color: "#64748b",
                fontSize: 7,
                fontWeight: 950,
              }}
            >
              7 TAGE
            </div>

            <strong
              style={{
                color: "#c4b5fd",
                fontSize: 16,
              }}
            >
              {money(totalValue)}
            </strong>
          </div>

          <BusinessCreateJobButton />
        </div>
      </div>

      <BusinessJobCardsClient
        jobs={serializedJobs}
      />
</section>
  );
}
