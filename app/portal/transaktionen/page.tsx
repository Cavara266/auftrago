import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

type TransactionItem =
  | {
      id: string;
      type: "credit";
      title: string;
      description: string;
      meta: string;
      credits: number;
      date: Date;
      href: string | null;
      status: string;
    }
  | {
      id: string;
      type: "lead";
      title: string;
      description: string;
      meta: string;
      credits: number;
      date: Date;
      href: string;
      status: string;
    };

function formatPackageName(packageId?: string | null) {
  switch (packageId) {
    case "starter":
      return "Starter-Paket";

    case "pro":
      return "Pro-Paket";

    case "business":
      return "Business-Paket";

    case "agency":
      return "Agency-Paket";

    case "enterprise":
      return "Enterprise-Paket";

    default:
      return "Credit-Paket";
  }
}

function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat("de-CH", {
    style: "currency",
    currency: currency.toUpperCase(),
    minimumFractionDigits: 2,
  }).format(amount / 100);
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("de-CH", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function getLeadStatusLabel(status: string) {
  switch (status) {
    case "CONTACTED":
      return "Kontaktiert";

    case "APPOINTMENT_SET":
      return "Termin vereinbart";

    case "OFFER_SENT":
      return "Offerte gesendet";

    case "WON":
      return "Auftrag gewonnen";

    case "LOST":
      return "Nicht gewonnen";

    case "NO_OFFER":
      return "Keine Offerte";

    default:
      return "Offen";
  }
}

export default async function TransaktionenPage() {
  const user = await requireUser();

  if (!user) {
    redirect("/login");
  }

  if (user.status !== "APPROVED") {
    redirect("/login?error=provider-not-approved");
  }

  const provider = await prisma.provider.findUnique({
    where: {
      id: user.id,
    },
    include: {
      creditPurchases: {
        orderBy: {
          createdAt: "desc",
        },
      },

      purchases: {
        orderBy: {
          createdAt: "desc",
        },
        include: {
          lead: true,
        },
      },
    },
  });

  if (!provider) {
    redirect("/login");
  }

  const paidCreditPurchases = provider.creditPurchases.filter(
    (purchase) => purchase.status.toLowerCase() === "paid"
  );

  const totalCreditsAdded = paidCreditPurchases.reduce(
    (sum, purchase) => sum + purchase.credits,
    0
  );

  const totalCreditsSpent = provider.purchases.reduce(
    (sum, purchase) => sum + purchase.price,
    0
  );

  const totalAmountSpent = paidCreditPurchases.reduce(
    (sum, purchase) => sum + purchase.amount,
    0
  );

  const creditTransactions: TransactionItem[] =
    provider.creditPurchases.map((purchase) => {
      const paid = purchase.status.toLowerCase() === "paid";

      return {
        id: `credit-${purchase.id}`,
        type: "credit",
        title: paid
          ? `${purchase.credits} Credits aufgeladen`
          : "Credit-Zahlung",
        description: formatPackageName(purchase.packageId),
        meta: formatCurrency(
          purchase.amount,
          purchase.currency
        ),
        credits: paid ? purchase.credits : 0,
        date: purchase.createdAt,
        href: null,
        status: paid ? "Bezahlt" : purchase.status,
      };
    });

  const leadTransactions: TransactionItem[] =
    provider.purchases.map((purchase) => ({
      id: `lead-${purchase.id}`,
      type: "lead",
      title: purchase.lead.title,
      description: `${purchase.lead.region} · ${purchase.lead.category}`,
      meta: `Lead-Kauf · ${getLeadStatusLabel(
        purchase.status
      )}`,
      credits: -purchase.price,
      date: purchase.createdAt,
      href: `/portal/leads/${purchase.lead.id}`,
      status: getLeadStatusLabel(purchase.status),
    }));

  const transactions = [
    ...creditTransactions,
    ...leadTransactions,
  ].sort((a, b) => b.date.getTime() - a.date.getTime());

  return (
    <main className="page">
      <section className="transactions-hero">
        <div className="container">
          <span className="eyebrow">Transaktionen</span>

          <div className="transactions-head">
            <div>
              <h1>Deine Credit-Historie.</h1>

              <p>
                Alle Aufladungen, Lead-Käufe und Credit-Bewegungen
                deines Anbieterkontos an einem Ort.
              </p>
            </div>

            <div className="transactions-actions">
              <Link
                href="/portal"
                className="btn btn-secondary"
              >
                Dashboard
              </Link>

              <Link
                href="/portal/guthaben"
                className="btn btn-primary"
              >
                Guthaben aufladen
              </Link>
            </div>
          </div>

          <div className="transactions-stats">
            <div className="transactions-stat-card">
              <strong>{provider.credits}</strong>
              <span>Aktuelle Credits</span>
            </div>

            <div className="transactions-stat-card">
              <strong>{totalCreditsAdded}</strong>
              <span>Credits aufgeladen</span>
            </div>

            <div className="transactions-stat-card">
              <strong>{totalCreditsSpent}</strong>
              <span>Credits ausgegeben</span>
            </div>

            <div className="transactions-stat-card">
              <strong>
                {formatCurrency(totalAmountSpent, "chf")}
              </strong>
              <span>Über Stripe bezahlt</span>
            </div>
          </div>
        </div>
      </section>

      <section className="transactions-section">
        <div className="container">
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              gap: 18,
              flexWrap: "wrap",
              marginBottom: 24,
            }}
          >
            <div>
              <span className="eyebrow">
                Kontoaktivität
              </span>

              <h2
                style={{
                  marginTop: 10,
                  fontSize: "clamp(28px, 4vw, 42px)",
                }}
              >
                Alle Bewegungen
              </h2>
            </div>

            <div
              style={{
                padding: "10px 16px",
                borderRadius: 999,
                border:
                  "1px solid rgba(255,255,255,0.10)",
                background: "rgba(255,255,255,0.04)",
                fontSize: 14,
                fontWeight: 800,
              }}
            >
              {transactions.length} Transaktionen
            </div>
          </div>

          {transactions.length === 0 ? (
            <div className="transactions-empty">
              <span>🧾 Noch keine Transaktionen</span>

              <h2>Deine Historie ist noch leer.</h2>

              <p>
                Sobald du Credits auflädst oder Leads kaufst,
                erscheinen alle Bewegungen automatisch hier.
              </p>

              <Link
                href="/portal/guthaben"
                className="btn btn-primary"
              >
                Credits kaufen
              </Link>
            </div>
          ) : (
            <div className="transactions-list">
              {transactions.map((item) => {
                const content = (
                  <>
                    <div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          flexWrap: "wrap",
                        }}
                      >
                        <span className="transactions-type">
                          {item.type === "credit"
                            ? "Aufladung"
                            : "Lead-Kauf"}
                        </span>

                        <span
                          style={{
                            padding: "5px 10px",
                            borderRadius: 999,
                            background:
                              item.type === "credit"
                                ? "rgba(34,197,94,0.10)"
                                : "rgba(56,189,248,0.10)",
                            border:
                              item.type === "credit"
                                ? "1px solid rgba(34,197,94,0.20)"
                                : "1px solid rgba(56,189,248,0.20)",
                            color:
                              item.type === "credit"
                                ? "#bbf7d0"
                                : "#bae6fd",
                            fontSize: 12,
                            fontWeight: 800,
                          }}
                        >
                          {item.status}
                        </span>
                      </div>

                      <h2>{item.title}</h2>

                      <p>{item.description}</p>

                      <small>
                        {item.meta} · {formatDate(item.date)}
                      </small>
                    </div>

                    <strong
                      className={
                        item.credits > 0
                          ? "transactions-positive"
                          : item.credits < 0
                            ? "transactions-negative"
                            : ""
                      }
                    >
                      {item.credits > 0 ? "+" : ""}
                      {item.credits} Credits
                    </strong>
                  </>
                );

                if (item.href) {
                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      className="transactions-item"
                      style={{
                        textDecoration: "none",
                        color: "inherit",
                      }}
                    >
                      {content}
                    </Link>
                  );
                }

                return (
                  <article
                    key={item.id}
                    className="transactions-item"
                  >
                    {content}
                  </article>
                );
              })}
            </div>
          )}

          <div
            style={{
              marginTop: 30,
              padding: 24,
              borderRadius: 24,
              border:
                "1px solid rgba(255,255,255,0.09)",
              background: "rgba(255,255,255,0.035)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 18,
              flexWrap: "wrap",
            }}
          >
            <div>
              <strong
                style={{
                  display: "block",
                  fontSize: 18,
                }}
              >
                Weitere Kundenanfragen entdecken
              </strong>

              <span
                style={{
                  display: "block",
                  marginTop: 6,
                  opacity: 0.55,
                }}
              >
                Prüfe neue Leads und schalte passende Kontakte
                mit deinem Guthaben frei.
              </span>
            </div>

            <Link
              href="/portal/leads"
              className="btn btn-primary"
            >
              Neue Leads ansehen
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}