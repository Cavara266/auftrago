import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import "./transaction-center.css";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

type PageProps = {
  searchParams?: Promise<{
    type?: string;
  }>;
};

type TransactionItem = {
  id: string;
  type: "credit" | "lead";
  title: string;
  description: string;
  meta: string;
  credits: number;
  date: Date;
  href: string | null;
  status: string;
  amountLabel?: string;
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

function formatCurrency(
  amount: number,
  currency: string
) {
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
    timeZone: "Europe/Zurich",
  }).format(date);
}

function formatShortDate(date: Date) {
  return new Intl.DateTimeFormat("de-CH", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "Europe/Zurich",
  }).format(date);
}

function formatRelativeDate(date: Date) {
  const difference =
    Date.now() - date.getTime();

  const minutes = Math.max(
    1,
    Math.floor(difference / 60000)
  );

  if (minutes < 60) {
    return `Vor ${minutes} Min.`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `Vor ${hours} Std.`;
  }

  const days = Math.floor(hours / 24);

  if (days === 1) {
    return "Gestern";
  }

  if (days < 30) {
    return `Vor ${days} Tagen`;
  }

  return formatShortDate(date);
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

export default async function TransaktionenPage({
  searchParams,
}: PageProps) {
  const params = searchParams
    ? await searchParams
    : undefined;

  const selectedType =
    params?.type || "all";

  const user = await requireUser();

  if (!user) {
    redirect("/login");
  }

  if (user.status !== "APPROVED") {
    redirect(
      "/login?error=provider-not-approved"
    );
  }

  const provider =
    await prisma.provider.findUnique({
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

  const now = new Date();

  const startOfMonth = new Date(
    now.getFullYear(),
    now.getMonth(),
    1
  );

  const paidCreditPurchases =
    provider.creditPurchases.filter(
      (purchase) =>
        purchase.status.toLowerCase() ===
        "paid"
    );

  const totalCreditsAdded =
    paidCreditPurchases.reduce(
      (sum, purchase) =>
        sum + purchase.credits,
      0
    );

  const totalCreditsSpent =
    provider.purchases.reduce(
      (sum, purchase) =>
        sum + purchase.price,
      0
    );

  const totalAmountSpent =
    paidCreditPurchases.reduce(
      (sum, purchase) =>
        sum + purchase.amount,
      0
    );

  const creditsAddedThisMonth =
    paidCreditPurchases
      .filter(
        (purchase) =>
          purchase.createdAt >=
          startOfMonth
      )
      .reduce(
        (sum, purchase) =>
          sum + purchase.credits,
        0
      );

  const creditsSpentThisMonth =
    provider.purchases
      .filter(
        (purchase) =>
          purchase.createdAt >=
          startOfMonth
      )
      .reduce(
        (sum, purchase) =>
          sum + purchase.price,
        0
      );

  const wonLeadCount =
    provider.purchases.filter(
      (purchase) =>
        purchase.status === "WON"
    ).length;

  const averageLeadPrice =
    provider.purchases.length > 0
      ? Math.round(
          totalCreditsSpent /
            provider.purchases.length
        )
      : 0;

  const creditTransactions: TransactionItem[] =
    provider.creditPurchases.map(
      (purchase) => {
        const paid =
          purchase.status.toLowerCase() ===
          "paid";

        return {
          id: `credit-${purchase.id}`,
          type: "credit",
          title: paid
            ? `${purchase.credits} Credits aufgeladen`
            : "Credit-Zahlung",
          description: formatPackageName(
            purchase.packageId
          ),
          meta: paid
            ? "Erfolgreich über Stripe bezahlt"
            : "Zahlung noch nicht abgeschlossen",
          credits: paid
            ? purchase.credits
            : 0,
          date: purchase.createdAt,
          href: null,
          status: paid
            ? "Bezahlt"
            : purchase.status,
          amountLabel: formatCurrency(
            purchase.amount,
            purchase.currency
          ),
        };
      }
    );

  const leadTransactions: TransactionItem[] =
    provider.purchases.map(
      (purchase) => ({
        id: `lead-${purchase.id}`,
        type: "lead",
        title: purchase.lead.title,
        description: `${purchase.lead.region} · ${purchase.lead.category}`,
        meta: `Lead-Kauf · ${getLeadStatusLabel(
          purchase.status
        )}`,
        credits: -purchase.price,
        date: purchase.createdAt,
        href: `/portal/meine-leads/${purchase.id}`,
        status: getLeadStatusLabel(
          purchase.status
        ),
      })
    );

  const transactions = [
    ...creditTransactions,
    ...leadTransactions,
  ].sort(
    (a, b) =>
      b.date.getTime() -
      a.date.getTime()
  );

  const filteredTransactions =
    selectedType === "credit"
      ? transactions.filter(
          (item) =>
            item.type === "credit"
        )
      : selectedType === "lead"
        ? transactions.filter(
            (item) =>
              item.type === "lead"
          )
        : transactions;

  const balanceUsage =
    totalCreditsAdded > 0
      ? Math.min(
          100,
          Math.round(
            (totalCreditsSpent /
              totalCreditsAdded) *
              100
          )
        )
      : 0;

  return (
    <main className="transaction-center">
      <div className="transaction-center__glow transaction-center__glow--one" />
      <div className="transaction-center__glow transaction-center__glow--two" />

      <div className="transaction-center__container">
        <section className="transaction-center__hero">
          <div className="transaction-center__hero-copy">
            <span className="transaction-center__eyebrow">
              CREDIT & FINANCE CENTER
            </span>

            <h1>
              Dein kompletter
              <em>Credit-Verlauf.</em>
            </h1>

            <p>
              Verfolge Aufladungen,
              Lead-Käufe und sämtliche
              Credit-Bewegungen deines
              Anbieterkontos zentral.
            </p>

            <div className="transaction-center__hero-actions">
              <Link
                href="/portal/guthaben"
                className="transaction-center__button transaction-center__button--primary"
              >
                Credits aufladen
                <span>→</span>
              </Link>

              <Link
                href="/portal"
                className="transaction-center__button transaction-center__button--ghost"
              >
                Zum Dashboard
              </Link>
            </div>
          </div>

          <div className="transaction-center__balance">
            <span>AKTUELLER KONTOSTAND</span>

            <strong>
              {provider.credits}
            </strong>

            <p>verfügbare Credits</p>

            <div className="transaction-center__balance-track">
              <span
                style={{
                  width: `${Math.max(
                    4,
                    100 - balanceUsage
                  )}%`,
                }}
              />
            </div>

            <div className="transaction-center__balance-grid">
              <div>
                <strong>
                  +{creditsAddedThisMonth}
                </strong>

                <span>
                  diesen Monat geladen
                </span>
              </div>

              <div>
                <strong>
                  -{creditsSpentThisMonth}
                </strong>

                <span>
                  diesen Monat verwendet
                </span>
              </div>
            </div>

            <Link
              href="/portal/guthaben"
              className="transaction-center__button transaction-center__button--primary"
            >
              Guthaben erhöhen
            </Link>
          </div>
        </section>

        <section className="transaction-center__metrics">
          <article>
            <span className="transaction-center__metric-number">
              01
            </span>

            <strong>
              {totalCreditsAdded}
            </strong>

            <h2>Credits aufgeladen</h2>

            <p>
              Gesamtes bisher gekauftes
              Guthaben
            </p>
          </article>

          <article>
            <span className="transaction-center__metric-number">
              02
            </span>

            <strong>
              {totalCreditsSpent}
            </strong>

            <h2>Credits investiert</h2>

            <p>
              Für Kundenanfragen eingesetzt
            </p>
          </article>

          <article>
            <span className="transaction-center__metric-number">
              03
            </span>

            <strong>
              {averageLeadPrice}
            </strong>

            <h2>Ø Leadpreis</h2>

            <p>
              Durchschnittliche Credits
              pro Lead
            </p>
          </article>

          <article>
            <span className="transaction-center__metric-number">
              04
            </span>

            <strong>
              {wonLeadCount}
            </strong>

            <h2>Aufträge gewonnen</h2>

            <p>
              Im CRM als gewonnen markiert
            </p>
          </article>
        </section>

        <section className="transaction-center__finance-summary">
          <div>
            <span className="transaction-center__eyebrow">
              DEINE INVESTITION
            </span>

            <h2>
              {formatCurrency(
                totalAmountSpent,
                "chf"
              )}
            </h2>

            <p>
              Bisher erfolgreich über
              Stripe bezahlt.
            </p>
          </div>

          <div className="transaction-center__flow">
            <div>
              <span>Aufgeladen</span>

              <strong>
                {totalCreditsAdded}
              </strong>
            </div>

            <div className="transaction-center__flow-arrow">
              →
            </div>

            <div>
              <span>Investiert</span>

              <strong>
                {totalCreditsSpent}
              </strong>
            </div>

            <div className="transaction-center__flow-arrow">
              →
            </div>

            <div>
              <span>Verfügbar</span>

              <strong>
                {provider.credits}
              </strong>
            </div>
          </div>
        </section>

        <section className="transaction-center__history">
          <header className="transaction-center__section-header">
            <div>
              <span className="transaction-center__eyebrow">
                KONTOAKTIVITÄT
              </span>

              <h2>
                Alle Bewegungen
              </h2>

              <p>
                Jede Aufladung und jeder
                Lead-Kauf chronologisch
                dokumentiert.
              </p>
            </div>

            <div className="transaction-center__transaction-count">
              <strong>
                {
                  filteredTransactions.length
                }
              </strong>

              <span>
                Transaktionen
              </span>
            </div>
          </header>

          <nav className="transaction-center__filters">
            <Link
              href="/portal/transaktionen"
              className={
                selectedType === "all"
                  ? "transaction-center__filter transaction-center__filter--active"
                  : "transaction-center__filter"
              }
            >
              Alle Bewegungen
              <span>
                {transactions.length}
              </span>
            </Link>

            <Link
              href="/portal/transaktionen?type=credit"
              className={
                selectedType === "credit"
                  ? "transaction-center__filter transaction-center__filter--active"
                  : "transaction-center__filter"
              }
            >
              Aufladungen
              <span>
                {
                  creditTransactions.length
                }
              </span>
            </Link>

            <Link
              href="/portal/transaktionen?type=lead"
              className={
                selectedType === "lead"
                  ? "transaction-center__filter transaction-center__filter--active"
                  : "transaction-center__filter"
              }
            >
              Lead-Käufe
              <span>
                {
                  leadTransactions.length
                }
              </span>
            </Link>
          </nav>

          {filteredTransactions.length ===
          0 ? (
            <div className="transaction-center__empty">
              <span>KEINE BEWEGUNGEN</span>

              <h3>
                Noch keine Transaktionen
              </h3>

              <p>
                Sobald du Credits auflädst
                oder Leads kaufst, werden
                alle Bewegungen hier
                angezeigt.
              </p>

              <Link
                href="/portal/guthaben"
                className="transaction-center__button transaction-center__button--primary"
              >
                Credits kaufen
              </Link>
            </div>
          ) : (
            <div className="transaction-center__timeline">
              {filteredTransactions.map(
                (item) => {
                  const content = (
                    <>
                      <div className="transaction-center__timeline-marker">
                        <span>
                          {item.type ===
                          "credit"
                            ? "+"
                            : "−"}
                        </span>
                      </div>

                      <div className="transaction-center__transaction-main">
                        <div className="transaction-center__badges">
                          <span
                            className={`transaction-center__type transaction-center__type--${item.type}`}
                          >
                            {item.type ===
                            "credit"
                              ? "Aufladung"
                              : "Lead-Kauf"}
                          </span>

                          <span
                            className={`transaction-center__status transaction-center__status--${item.type}`}
                          >
                            {item.status}
                          </span>
                        </div>

                        <h3>
                          {item.title}
                        </h3>

                        <p>
                          {item.description}
                        </p>

                        <div className="transaction-center__meta">
                          <span>
                            {formatDate(
                              item.date
                            )}
                          </span>

                          <span>
                            {formatRelativeDate(
                              item.date
                            )}
                          </span>

                          <span>
                            {item.meta}
                          </span>
                        </div>
                      </div>

                      <div className="transaction-center__transaction-value">
                        {item.amountLabel ? (
                          <small>
                            {item.amountLabel}
                          </small>
                        ) : null}

                        <strong
                          className={
                            item.credits > 0
                              ? "transaction-center__positive"
                              : item.credits < 0
                                ? "transaction-center__negative"
                                : ""
                          }
                        >
                          {item.credits > 0
                            ? "+"
                            : ""}
                          {item.credits} Credits
                        </strong>

                        {item.href ? (
                          <span>
                            Im CRM öffnen →
                          </span>
                        ) : (
                          <span>
                            Erfolgreich verbucht
                          </span>
                        )}
                      </div>
                    </>
                  );

                  if (item.href) {
                    return (
                      <Link
                        key={item.id}
                        href={item.href}
                        className="transaction-center__transaction"
                      >
                        {content}
                      </Link>
                    );
                  }

                  return (
                    <article
                      key={item.id}
                      className="transaction-center__transaction"
                    >
                      {content}
                    </article>
                  );
                }
              )}
            </div>
          )}
        </section>

        <section className="transaction-center__cta">
          <div>
            <span className="transaction-center__eyebrow">
              NEUE CHANCEN
            </span>

            <h2>
              Nutze deine Credits für
              passende Kundenanfragen.
            </h2>

            <p>
              Entdecke neue Leads in deinen
              Regionen und Dienstleistungen.
            </p>
          </div>

          <Link
            href="/portal/leads"
            className="transaction-center__button transaction-center__button--primary"
          >
            Neue Leads ansehen
            <span>→</span>
          </Link>
        </section>
      </div>
    </main>
  );
}
