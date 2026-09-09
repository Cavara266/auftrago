import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

const money = (cents: number) =>
  new Intl.NumberFormat("de-CH", {
    style: "currency",
    currency: "CHF",
    minimumFractionDigits: 2,
  }).format(cents / 100);

const labels: Record<string, string> = {
  DRAFT: "Entwurf",
  SENT: "Gesendet",
  OPEN: "Offen",
  PAID: "Bezahlt",
  OVERDUE: "Überfällig",
  CANCELLED: "Storniert",
};

const colors: Record<string, string> = {
  DRAFT: "#c4b5fd",
  SENT: "#7dd3fc",
  OPEN: "#7dd3fc",
  PAID: "#86efac",
  OVERDUE: "#fca5a5",
  CANCELLED: "#94a3b8",
};

export default async function RechnungenPage() {
  const user = await getCurrentUser();

  if (!user) redirect("/login");

  const invoices = await prisma.businessInvoice.findMany({
    where: { providerId: user.id },
    orderBy: { createdAt: "desc" },
  });

  const total = invoices.reduce((sum, x) => sum + x.totalCents, 0);

  const open = invoices
    .filter((x) => !["PAID", "CANCELLED"].includes(x.status))
    .reduce((sum, x) => sum + x.totalCents, 0);

  const paid = invoices
    .filter((x) => x.status === "PAID")
    .reduce((sum, x) => sum + x.totalCents, 0);

  const overdue = invoices
    .filter(
      (x) =>
        x.status !== "PAID" &&
        x.status !== "CANCELLED" &&
        x.dueAt &&
        x.dueAt < new Date()
    )
    .reduce((sum, x) => sum + x.totalCents, 0);

  return (
    <main
      style={{
        minHeight: "100vh",
        color: "#fff",
        padding: "36px",
        background:
          "radial-gradient(circle at 85% 0%,rgba(124,58,237,.16),transparent 28%),#06101f",
      }}
    >
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        <div style={{ color: "#a78bfa", fontWeight: 900, fontSize: 12 }}>
          AUFTRAGO BUSINESS / RECHNUNGEN
        </div>

        <h1 style={{ fontSize: 42, margin: "8px 0 5px" }}>Rechnungen</h1>

        <p style={{ color: "#94a3b8", margin: 0 }}>
          Rechnungen verwalten, Zahlungen überwachen und offene Beträge im Blick behalten.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(210px,1fr))",
            gap: 14,
            margin: "28px 0",
          }}
        >
          <Metric label="Rechnungsvolumen" value={money(total)} />
          <Metric label="Offene Beträge" value={money(open)} />
          <Metric label="Bezahlt" value={money(paid)} />
          <Metric label="Überfällig" value={money(overdue)} alert={overdue > 0} />
        </div>

        <section
          style={{
            border: "1px solid rgba(148,163,184,.14)",
            borderRadius: 20,
            overflow: "hidden",
            background: "rgba(10,22,41,.92)",
          }}
        >
          <div
            style={{
              padding: 18,
              fontWeight: 900,
              borderBottom: "1px solid rgba(148,163,184,.12)",
            }}
          >
            Aktuelle Rechnungen
          </div>

          {invoices.length === 0 ? (
            <div style={{ padding: 30, color: "#94a3b8" }}>
              Noch keine Rechnungen vorhanden.
            </div>
          ) : (
            invoices.map((invoice) => {
              const actuallyOverdue =
                invoice.status !== "PAID" &&
                invoice.status !== "CANCELLED" &&
                invoice.dueAt &&
                invoice.dueAt < new Date();

              const displayStatus = actuallyOverdue
                ? "OVERDUE"
                : invoice.status;

              return (
                <div
                  key={invoice.id}
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "1.25fr 1.5fr 1.2fr 1fr .9fr .7fr",
                    gap: 14,
                    padding: 18,
                    alignItems: "center",
                    borderBottom: "1px solid rgba(148,163,184,.08)",
                  }}
                >
                  <strong>{invoice.invoiceNumber}</strong>

                  <div>{invoice.customerName || "Kein Kunde"}</div>

                  <div style={{ color: "#94a3b8" }}>{invoice.title}</div>

                  <strong>{money(invoice.totalCents)}</strong>

                  <div
                    style={{
                      color: colors[displayStatus] || "#c4b5fd",
                      fontWeight: 800,
                      fontSize: 13,
                    }}
                  >
                    • {labels[displayStatus] || displayStatus}
                  </div>

                  <Link
                    href={`/portal/business/rechnungen/${invoice.id}`}
                    style={{
                      color: "#7dd3fc",
                      textDecoration: "none",
                      fontWeight: 900,
                      padding: "10px 12px",
                      border: "1px solid rgba(125,211,252,.22)",
                      borderRadius: 9,
                      textAlign: "center",
                    }}
                  >
                    Öffnen →
                  </Link>
                </div>
              );
            })
          )}
        </section>
      </div>
    </main>
  );
}

function Metric({
  label,
  value,
  alert = false,
}: {
  label: string;
  value: string;
  alert?: boolean;
}) {
  return (
    <div
      style={{
        padding: 24,
        borderRadius: 18,
        border: `1px solid ${
          alert ? "rgba(248,113,113,.24)" : "rgba(148,163,184,.14)"
        }`,
        background: alert
          ? "rgba(127,29,29,.13)"
          : "rgba(12,24,45,.92)",
      }}
    >
      <div
        style={{
          fontSize: 25,
          fontWeight: 900,
          color: alert ? "#fca5a5" : "#f8fafc",
        }}
      >
        {value}
      </div>

      <div style={{ color: "#8291a9", marginTop: 6 }}>{label}</div>
    </div>
  );
}
