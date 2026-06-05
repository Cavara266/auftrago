import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function formatPackageName(packageId?: string | null) {
  switch (packageId) {
    case "starter":
      return "Starter Paket";
    case "business":
      return "Business Paket";
    case "pro":
      return "Pro Paket";
    default:
      return "Stripe Zahlung";
  }
}

function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat("de-CH", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount / 100);
}

export default async function TransaktionenPage() {
  const cookieStore = await cookies();
  const providerId = cookieStore.get("auftrago_session")?.value;

  if (!providerId) {
    redirect("/login");
  }

  const provider = await prisma.provider.findUnique({
    where: {
      id: providerId,
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

  const totalCreditsAdded = provider.creditPurchases.reduce(
    (sum, item) => sum + item.credits,
    0
  );

  const totalCreditsSpent = provider.purchases.reduce(
    (sum, item) => sum + item.price,
    0
  );

  const transactions = [
    ...provider.creditPurchases.map((item) => ({
      id: item.id,
      type: "credit" as const,
      title: "Credits aufgeladen",
      description: formatPackageName(item.packageId),
      meta: formatCurrency(item.amount, item.currency),
      credits: item.credits,
      date: item.createdAt,
    })),
    ...provider.purchases.map((item) => ({
      id: item.id,
      type: "lead" as const,
      title: item.lead.title,
      description: `${item.lead.region} · ${item.lead.category}`,
      meta: "Lead-Kauf",
      credits: -item.price,
      date: item.createdAt,
    })),
  ].sort((a, b) => b.date.getTime() - a.date.getTime());

  return (
    <main className="page">
      <section className="transactions-hero">
        <div className="container">
          <span className="eyebrow">Transaktionen</span>

          <div className="transactions-head">
            <div>
              <h1>Credit-Historie.</h1>

              <p>
                Alle Aufladungen, Lead-Käufe und Credit-Bewegungen deines
                Anbieter-Kontos an einem Ort.
              </p>
            </div>

            <div className="transactions-actions">
              <Link href="/portal" className="btn btn-secondary">
                Dashboard
              </Link>

              <Link href="/portal/guthaben" className="btn btn-primary">
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
              <strong>{transactions.length}</strong>
              <span>Transaktionen</span>
            </div>
          </div>
        </div>
      </section>

      <section className="transactions-section">
        <div className="container">
          {transactions.length === 0 ? (
            <div className="transactions-empty">
              <span>Noch keine Transaktionen</span>

              <h2>Deine Historie ist noch leer.</h2>

              <p>
                Sobald du Credits auflädst oder Leads kaufst, erscheinen alle
                Bewegungen hier.
              </p>

              <Link href="/portal/guthaben" className="btn btn-primary">
                Credits kaufen
              </Link>
            </div>
          ) : (
            <div className="transactions-list">
              {transactions.map((item) => (
                <article key={item.id} className="transactions-item">
                  <div>
                    <span className="transactions-type">
                      {item.type === "credit" ? "Aufladung" : "Lead-Kauf"}
                    </span>

                    <h2>{item.title}</h2>

                    <p>{item.description}</p>

                    <small>
                      {item.meta} ·{" "}
                      {new Intl.DateTimeFormat("de-CH", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      }).format(item.date)}
                    </small>
                  </div>

                  <strong
                    className={
                      item.credits > 0
                        ? "transactions-positive"
                        : "transactions-negative"
                    }
                  >
                    {item.credits > 0 ? "+" : ""}
                    {item.credits} Credits
                  </strong>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}