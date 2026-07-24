import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type PageProps = {
  params: {
    id: string;
  };
  searchParams?: {
    success?: string;
    error?: string;
  };
};

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("de-CH", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("de-CH").format(value);
}

function getActivityAmount(metadata: unknown) {
  if (
    metadata &&
    typeof metadata === "object" &&
    "amount" in metadata &&
    typeof metadata.amount === "number"
  ) {
    return metadata.amount;
  }

  return null;
}

export default async function ProviderCreditsPage({
  params,
  searchParams,
}: PageProps) {
  const provider = await prisma.provider.findUnique({
    where: {
      id: params.id,
    },
    include: {
      creditPurchases: {
        orderBy: {
          createdAt: "desc",
        },
        take: 30,
      },
      activities: {
        where: {
          event: {
            in: [
              "ADMIN_CREDITS_ADDED",
              "ADMIN_CREDITS_REMOVED",
              "CREDITS_PURCHASED",
            ],
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 30,
      },
    },
  });

  if (!provider) {
    notFound();
  }

  async function updateCredits(formData: FormData) {
    "use server";

    const providerId = String(formData.get("providerId") || "");
    const operation = String(formData.get("operation") || "");
    const reason = String(formData.get("reason") || "").trim();
    const rawAmount = Number(formData.get("amount"));

    if (!providerId || providerId !== params.id) {
      redirect(
        `/admin/providers/${params.id}/credits?error=Ungültiger Anbieter`,
      );
    }

    if (
      !Number.isInteger(rawAmount) ||
      rawAmount <= 0 ||
      rawAmount > 100000
    ) {
      redirect(
        `/admin/providers/${params.id}/credits?error=Bitte eine gültige Credit-Anzahl eingeben`,
      );
    }

    if (operation !== "add" && operation !== "remove") {
      redirect(
        `/admin/providers/${params.id}/credits?error=Ungültige Aktion`,
      );
    }

    const currentProvider = await prisma.provider.findUnique({
      where: {
        id: providerId,
      },
      select: {
        id: true,
        credits: true,
        companyName: true,
      },
    });

    if (!currentProvider) {
      redirect("/admin/providers");
    }

    if (
      operation === "remove" &&
      currentProvider.credits < rawAmount
    ) {
      redirect(
        `/admin/providers/${providerId}/credits?error=Der Anbieter besitzt nicht genügend Credits`,
      );
    }

    const creditChange =
      operation === "add" ? rawAmount : -rawAmount;

    const newBalance = currentProvider.credits + creditChange;

    await prisma.$transaction([
      prisma.provider.update({
        where: {
          id: providerId,
        },
        data: {
          credits: {
            increment: creditChange,
          },
        },
      }),

      prisma.providerActivity.create({
        data: {
          providerId,
          event:
            operation === "add"
              ? "ADMIN_CREDITS_ADDED"
              : "ADMIN_CREDITS_REMOVED",
          description:
            operation === "add"
              ? `${rawAmount} Credits wurden durch den Admin hinzugefügt.${
                  reason ? ` Grund: ${reason}` : ""
                }`
              : `${rawAmount} Credits wurden durch den Admin entfernt.${
                  reason ? ` Grund: ${reason}` : ""
                }`,
          page: `/admin/providers/${providerId}/credits`,
          metadata: {
            amount: rawAmount,
            operation,
            previousBalance: currentProvider.credits,
            newBalance,
            reason: reason || null,
          },
        },
      }),
    ]);

    revalidatePath(`/admin/providers/${providerId}`);
    revalidatePath(`/admin/providers/${providerId}/credits`);
    revalidatePath("/admin/providers");

    redirect(
      `/admin/providers/${providerId}/credits?success=${
        operation === "add"
          ? `${rawAmount} Credits wurden hinzugefügt`
          : `${rawAmount} Credits wurden entfernt`
      }`,
    );
  }

  const totalPurchasedCredits = provider.creditPurchases
    .filter(
      (purchase) => purchase.status.toLowerCase() === "paid",
    )
    .reduce((sum, purchase) => sum + purchase.credits, 0);

  const totalPurchasedAmount = provider.creditPurchases
    .filter(
      (purchase) => purchase.status.toLowerCase() === "paid",
    )
    .reduce((sum, purchase) => sum + purchase.amount, 0);

  const adminCreditsAdded = provider.activities
    .filter(
      (activity) => activity.event === "ADMIN_CREDITS_ADDED",
    )
    .reduce((sum, activity) => {
      return sum + (getActivityAmount(activity.metadata) || 0);
    }, 0);

  const adminCreditsRemoved = provider.activities
    .filter(
      (activity) => activity.event === "ADMIN_CREDITS_REMOVED",
    )
    .reduce((sum, activity) => {
      return sum + (getActivityAmount(activity.metadata) || 0);
    }, 0);

  return (
    <main className="credits-page">
      <div className="credits-container">
        <header className="credits-header">
          <div>
            <Link
              href={`/admin/providers/${provider.id}`}
              className="credits-back"
            >
              ← Zurück zum Anbieter
            </Link>

            <span className="credits-eyebrow">
              Anbieter CRM
            </span>

            <h1>Credits verwalten</h1>

            <p>
              Credits von{" "}
              <strong>{provider.companyName}</strong> hinzufügen
              oder entfernen.
            </p>
          </div>

          <div className="credits-balance">
            <span>Aktuelles Guthaben</span>

            <strong>
              {formatNumber(provider.credits)}
            </strong>

            <small>Credits verfügbar</small>
          </div>
        </header>

        {searchParams?.success ? (
          <div className="credits-alert success">
            <span>✅</span>
            <div>
              <strong>Änderung gespeichert</strong>
              <p>{searchParams.success}</p>
            </div>
          </div>
        ) : null}

        {searchParams?.error ? (
          <div className="credits-alert error">
            <span>⚠️</span>
            <div>
              <strong>Änderung nicht möglich</strong>
              <p>{searchParams.error}</p>
            </div>
          </div>
        ) : null}

        <section className="credits-stat-grid">
          <article>
            <div>⭐</div>

            <span>Aktuelles Guthaben</span>

            <strong>
              {formatNumber(provider.credits)}
            </strong>

            <small>Verfügbare Credits</small>
          </article>

          <article>
            <div>💳</div>

            <span>Gekaufte Credits</span>

            <strong>
              {formatNumber(totalPurchasedCredits)}
            </strong>

            <small>
              CHF{" "}
              {(totalPurchasedAmount / 100).toLocaleString(
                "de-CH",
                {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                },
              )}
            </small>
          </article>

          <article>
            <div>➕</div>

            <span>Admin-Gutschriften</span>

            <strong>
              {formatNumber(adminCreditsAdded)}
            </strong>

            <small>Manuell hinzugefügt</small>
          </article>

          <article>
            <div>➖</div>

            <span>Admin-Abzüge</span>

            <strong>
              {formatNumber(adminCreditsRemoved)}
            </strong>

            <small>Manuell entfernt</small>
          </article>
        </section>

        <section className="credits-grid">
          <article className="credits-panel">
            <div className="credits-panel-head">
              <div>
                <span>Guthaben anpassen</span>
                <h2>Credits hinzufügen oder entfernen</h2>
              </div>

              <div className="credits-icon">⭐</div>
            </div>

            <form action={updateCredits}>
              <input
                type="hidden"
                name="providerId"
                value={provider.id}
              />

              <label className="credits-field">
                <span>Anzahl Credits</span>

                <input
                  name="amount"
                  type="number"
                  min="1"
                  max="100000"
                  step="1"
                  placeholder="Zum Beispiel 100"
                  required
                />
              </label>

              <div className="credits-presets">
                {[10, 25, 50, 100, 250, 500].map(
                  (amount) => (
                    <button
                      key={amount}
                      type="button"
                      onClick={undefined}
                      className="credits-preset"
                      disabled
                    >
                      {amount}
                    </button>
                  ),
                )}
              </div>

              <label className="credits-field">
                <span>Interne Begründung</span>

                <textarea
                  name="reason"
                  rows={4}
                  placeholder="Zum Beispiel: Kulanz, Rückerstattung oder Korrektur"
                />
              </label>

              <div className="credits-warning">
                <span>🔒</span>

                <p>
                  Jede Änderung wird automatisch im
                  Aktivitätenverlauf des Anbieters gespeichert.
                </p>
              </div>

              <div className="credits-actions">
                <button
                  type="submit"
                  name="operation"
                  value="add"
                  className="credits-button add"
                >
                  <span>＋</span>
                  Credits hinzufügen
                </button>

                <button
                  type="submit"
                  name="operation"
                  value="remove"
                  className="credits-button remove"
                >
                  <span>−</span>
                  Credits entfernen
                </button>
              </div>
            </form>
          </article>

          <aside className="credits-panel">
            <div className="credits-panel-head">
              <div>
                <span>Anbieter</span>
                <h2>Kontoinformationen</h2>
              </div>
            </div>

            <div className="credits-provider">
              <div className="credits-avatar">
                {provider.companyName
                  .split(" ")
                  .filter(Boolean)
                  .slice(0, 2)
                  .map((word) => word.charAt(0))
                  .join("")
                  .toUpperCase()}
              </div>

              <div>
                <strong>{provider.companyName}</strong>
                <span>{provider.contactName}</span>
              </div>
            </div>

            <div className="credits-provider-details">
              <div>
                <span>E-Mail</span>
                <strong>{provider.email}</strong>
              </div>

              <div>
                <span>Status</span>
                <strong>{provider.status}</strong>
              </div>

              <div>
                <span>Registriert</span>
                <strong>
                  {formatDate(provider.createdAt)}
                </strong>
              </div>

              <div>
                <span>Anbieter-ID</span>
                <strong>{provider.id}</strong>
              </div>
            </div>
          </aside>
        </section>

        <section className="credits-panel history">
          <div className="credits-panel-head">
            <div>
              <span>Chronologie</span>
              <h2>Credit-Aktivitäten</h2>
            </div>

            <strong>
              {provider.activities.length}
            </strong>
          </div>

          {provider.activities.length === 0 ? (
            <div className="credits-empty">
              <div>📭</div>
              <strong>Noch keine manuellen Änderungen</strong>
              <p>
                Manuelle Gutschriften und Abzüge erscheinen
                automatisch in diesem Bereich.
              </p>
            </div>
          ) : (
            <div className="credits-history">
              {provider.activities.map((activity) => {
                const amount = getActivityAmount(
                  activity.metadata,
                );

                const isAdded =
                  activity.event ===
                  "ADMIN_CREDITS_ADDED";

                return (
                  <div
                    className="credits-history-row"
                    key={activity.id}
                  >
                    <div
                      className={`credits-history-icon ${
                        isAdded ? "added" : "removed"
                      }`}
                    >
                      {isAdded ? "＋" : "−"}
                    </div>

                    <div className="credits-history-copy">
                      <strong>
                        {isAdded
                          ? "Credits hinzugefügt"
                          : "Credits entfernt"}
                      </strong>

                      <p>
                        {activity.description ||
                          "Credit-Guthaben wurde geändert."}
                      </p>
                    </div>

                    <div className="credits-history-value">
                      <strong
                        className={
                          isAdded ? "positive" : "negative"
                        }
                      >
                        {isAdded ? "+" : "-"}
                        {formatNumber(amount || 0)}
                      </strong>

                      <time>
                        {formatDate(activity.createdAt)}
                      </time>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <section className="credits-panel history">
          <div className="credits-panel-head">
            <div>
              <span>Stripe</span>
              <h2>Credit-Käufe</h2>
            </div>

            <strong>
              {provider.creditPurchases.length}
            </strong>
          </div>

          {provider.creditPurchases.length === 0 ? (
            <div className="credits-empty">
              <div>💳</div>
              <strong>Noch keine Credit-Käufe</strong>
              <p>
                Bezahlte Stripe-Creditpakete erscheinen hier.
              </p>
            </div>
          ) : (
            <div className="credits-history">
              {provider.creditPurchases.map((purchase) => (
                <div
                  className="credits-history-row"
                  key={purchase.id}
                >
                  <div className="credits-history-icon purchase">
                    ⭐
                  </div>

                  <div className="credits-history-copy">
                    <strong>
                      {formatNumber(purchase.credits)} Credits
                    </strong>

                    <p>
                      {purchase.packageId
                        ? `Paket: ${purchase.packageId}`
                        : "Credit-Paket"}
                    </p>
                  </div>

                  <div className="credits-history-value">
                    <strong>
                      CHF{" "}
                      {(purchase.amount / 100).toLocaleString(
                        "de-CH",
                        {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        },
                      )}
                    </strong>

                    <span
                      className={
                        purchase.status.toLowerCase() ===
                        "paid"
                          ? "paid"
                          : ""
                      }
                    >
                      {purchase.status}
                    </span>

                    <time>
                      {formatDate(purchase.createdAt)}
                    </time>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <style>{`
        .credits-page {
          min-height: 100vh;
          padding: 32px 20px 80px;
          color: #111827;
          background:
            radial-gradient(
              circle at top left,
              rgba(37, 99, 235, 0.1),
              transparent 30%
            ),
            #f4f7fb;
        }

        .credits-container {
          width: min(1250px, 100%);
          margin: 0 auto;
        }

        .credits-header {
          display: flex;
          align-items: stretch;
          justify-content: space-between;
          gap: 30px;
          margin-bottom: 22px;
        }

        .credits-back {
          display: block;
          margin-bottom: 16px;
          color: #64748b;
          font-size: 14px;
          font-weight: 800;
          text-decoration: none;
        }

        .credits-eyebrow {
          display: block;
          margin-bottom: 6px;
          color: #2563eb;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.13em;
          text-transform: uppercase;
        }

        .credits-header h1 {
          margin: 0;
          font-size: clamp(32px, 5vw, 48px);
          line-height: 1.05;
          letter-spacing: -0.045em;
        }

        .credits-header p {
          margin: 10px 0 0;
          color: #64748b;
          font-size: 15px;
        }

        .credits-balance {
          min-width: 260px;
          padding: 24px;
          color: white;
          border-radius: 22px;
          background: linear-gradient(
            135deg,
            #111827,
            #334155
          );
          box-shadow: 0 20px 45px rgba(15, 23, 42, 0.2);
        }

        .credits-balance span,
        .credits-balance small {
          display: block;
          color: #cbd5e1;
          font-size: 12px;
          font-weight: 700;
        }

        .credits-balance strong {
          display: block;
          margin: 5px 0;
          font-size: 40px;
          letter-spacing: -0.04em;
        }

        .credits-alert {
          display: flex;
          gap: 13px;
          align-items: center;
          margin-bottom: 18px;
          padding: 15px 18px;
          border-radius: 14px;
        }

        .credits-alert.success {
          color: #047857;
          background: #ecfdf5;
          border: 1px solid #a7f3d0;
        }

        .credits-alert.error {
          color: #b91c1c;
          background: #fef2f2;
          border: 1px solid #fecaca;
        }

        .credits-alert strong,
        .credits-alert p {
          display: block;
          margin: 0;
        }

        .credits-alert p {
          margin-top: 2px;
          font-size: 13px;
        }

        .credits-stat-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 15px;
          margin-bottom: 20px;
        }

        .credits-stat-grid article {
          padding: 19px;
          border: 1px solid #e2e8f0;
          border-radius: 18px;
          background: white;
          box-shadow: 0 10px 30px rgba(15, 23, 42, 0.05);
        }

        .credits-stat-grid article > div {
          width: 42px;
          height: 42px;
          display: grid;
          place-items: center;
          margin-bottom: 12px;
          border-radius: 12px;
          background: #f1f5f9;
        }

        .credits-stat-grid span,
        .credits-stat-grid small {
          display: block;
          color: #64748b;
          font-size: 11px;
          font-weight: 700;
        }

        .credits-stat-grid strong {
          display: block;
          margin: 4px 0;
          font-size: 25px;
          letter-spacing: -0.03em;
        }

        .credits-grid {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 360px;
          gap: 20px;
          align-items: start;
          margin-bottom: 20px;
        }

        .credits-panel {
          min-width: 0;
          padding: 24px;
          border: 1px solid #e2e8f0;
          border-radius: 20px;
          background: white;
          box-shadow: 0 10px 35px rgba(15, 23, 42, 0.05);
        }

        .credits-panel.history {
          margin-bottom: 20px;
        }

        .credits-panel-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 22px;
        }

        .credits-panel-head span {
          display: block;
          margin-bottom: 4px;
          color: #2563eb;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .credits-panel-head h2 {
          margin: 0;
          font-size: 20px;
          letter-spacing: -0.02em;
        }

        .credits-icon {
          width: 48px;
          height: 48px;
          display: grid;
          place-items: center;
          border-radius: 14px;
          background: #f1f5f9;
          font-size: 22px;
        }

        .credits-field {
          display: block;
          margin-bottom: 18px;
        }

        .credits-field > span {
          display: block;
          margin-bottom: 7px;
          color: #475569;
          font-size: 12px;
          font-weight: 900;
        }

        .credits-field input,
        .credits-field textarea {
          width: 100%;
          box-sizing: border-box;
          padding: 14px 15px;
          color: #111827;
          border: 1px solid #cbd5e1;
          border-radius: 13px;
          outline: none;
          background: #f8fafc;
          font: inherit;
          transition: 0.2s ease;
        }

        .credits-field input:focus,
        .credits-field textarea:focus {
          border-color: #2563eb;
          background: white;
          box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
        }

        .credits-field input {
          min-height: 54px;
          font-size: 22px;
          font-weight: 900;
        }

        .credits-field textarea {
          resize: vertical;
          font-size: 14px;
          line-height: 1.6;
        }

        .credits-presets {
          display: grid;
          grid-template-columns: repeat(6, minmax(0, 1fr));
          gap: 8px;
          margin: -7px 0 18px;
        }

        .credits-preset {
          min-height: 38px;
          color: #64748b;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          background: #f8fafc;
          font-weight: 800;
        }

        .credits-warning {
          display: flex;
          gap: 11px;
          align-items: flex-start;
          margin-bottom: 18px;
          padding: 13px;
          border-radius: 12px;
          background: #fffbeb;
          border: 1px solid #fde68a;
        }

        .credits-warning p {
          margin: 0;
          color: #92400e;
          font-size: 12px;
          line-height: 1.6;
        }

        .credits-actions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .credits-button {
          min-height: 50px;
          border: 0;
          border-radius: 13px;
          font-size: 14px;
          font-weight: 900;
          cursor: pointer;
          transition: 0.2s ease;
        }

        .credits-button:hover {
          transform: translateY(-1px);
        }

        .credits-button.add {
          color: white;
          background: #111827;
          box-shadow: 0 12px 25px rgba(15, 23, 42, 0.18);
        }

        .credits-button.remove {
          color: #b91c1c;
          background: #fef2f2;
          border: 1px solid #fecaca;
        }

        .credits-provider {
          display: flex;
          align-items: center;
          gap: 13px;
          padding-bottom: 18px;
          border-bottom: 1px solid #e2e8f0;
        }

        .credits-avatar {
          width: 52px;
          height: 52px;
          flex: 0 0 52px;
          display: grid;
          place-items: center;
          color: white;
          border-radius: 15px;
          background: linear-gradient(
            135deg,
            #111827,
            #475569
          );
          font-weight: 900;
        }

        .credits-provider strong,
        .credits-provider span {
          display: block;
        }

        .credits-provider span {
          margin-top: 3px;
          color: #64748b;
          font-size: 12px;
        }

        .credits-provider-details {
          display: grid;
          gap: 10px;
          margin-top: 18px;
        }

        .credits-provider-details > div {
          padding: 12px;
          border-radius: 12px;
          background: #f8fafc;
        }

        .credits-provider-details span,
        .credits-provider-details strong {
          display: block;
        }

        .credits-provider-details span {
          margin-bottom: 4px;
          color: #94a3b8;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        .credits-provider-details strong {
          overflow-wrap: anywhere;
          font-size: 12px;
        }

        .credits-history {
          display: grid;
        }

        .credits-history-row {
          display: grid;
          grid-template-columns: 46px minmax(0, 1fr) auto;
          gap: 14px;
          align-items: center;
          padding: 15px 0;
          border-bottom: 1px solid #f1f5f9;
        }

        .credits-history-row:last-child {
          border-bottom: 0;
        }

        .credits-history-icon {
          width: 44px;
          height: 44px;
          display: grid;
          place-items: center;
          border-radius: 13px;
          font-size: 20px;
          font-weight: 900;
        }

        .credits-history-icon.added {
          color: #047857;
          background: #ecfdf5;
        }

        .credits-history-icon.removed {
          color: #b91c1c;
          background: #fef2f2;
        }

        .credits-history-icon.purchase {
          background: #f1f5f9;
        }

        .credits-history-copy strong {
          display: block;
          margin-bottom: 3px;
          font-size: 13px;
        }

        .credits-history-copy p {
          margin: 0;
          color: #64748b;
          font-size: 12px;
          line-height: 1.5;
        }

        .credits-history-value {
          min-width: 150px;
          text-align: right;
        }

        .credits-history-value strong,
        .credits-history-value span,
        .credits-history-value time {
          display: block;
        }

        .credits-history-value .positive {
          color: #059669;
        }

        .credits-history-value .negative {
          color: #dc2626;
        }

        .credits-history-value span,
        .credits-history-value time {
          margin-top: 3px;
          color: #94a3b8;
          font-size: 10px;
        }

        .credits-history-value span.paid {
          color: #059669;
          font-weight: 800;
        }

        .credits-empty {
          padding: 35px 20px;
          text-align: center;
          border: 1px dashed #cbd5e1;
          border-radius: 15px;
          background: #f8fafc;
        }

        .credits-empty > div {
          margin-bottom: 8px;
          font-size: 28px;
        }

        .credits-empty strong {
          display: block;
        }

        .credits-empty p {
          margin: 6px 0 0;
          color: #64748b;
          font-size: 12px;
        }

        @media (max-width: 1000px) {
          .credits-stat-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .credits-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 700px) {
          .credits-page {
            padding: 20px 12px 60px;
          }

          .credits-header {
            flex-direction: column;
          }

          .credits-balance {
            min-width: 0;
          }

          .credits-stat-grid {
            grid-template-columns: 1fr;
          }

          .credits-panel {
            padding: 18px;
            border-radius: 17px;
          }

          .credits-presets {
            grid-template-columns: repeat(3, 1fr);
          }

          .credits-actions {
            grid-template-columns: 1fr;
          }

          .credits-history-row {
            grid-template-columns: 44px minmax(0, 1fr);
          }

          .credits-history-value {
            grid-column: 2;
            min-width: 0;
            text-align: left;
          }
        }
      `}</style>
    </main>
  );
}