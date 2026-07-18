import Link from "next/link";

import { prisma } from "@/lib/prisma";
import DeleteLeadButton from "./DeleteLeadButton";
import { createLeadAction } from "./actions";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams?: Promise<{
    message?: string;
    error?: string;
    q?: string;
    region?: string;
    category?: string;
    status?: string;
  }>;
};

type LeadStatus = "ACTIVE" | "ENDING" | "SOLD_OUT" | "EXPIRED";

const regions = [
  "Aargau",
  "Zürich",
  "Bern",
  "Luzern",
  "Basel",
  "Solothurn",
  "Zug",
  "St. Gallen",
];

const categories = [
  "Hauswartung",
  "Reinigung",
  "Fensterreinigung",
  "Gartenpflege",
  "Maler",
  "Gipser",
  "Sanitär",
  "Elektriker",
  "Umzug",
  "Entsorgung",
];

function getMessage(message?: string) {
  switch (message) {
    case "created":
      return "Lead wurde erfolgreich erstellt.";
    case "deleted":
      return "Lead wurde erfolgreich gelöscht.";
    case "updated":
      return "Lead wurde erfolgreich aktualisiert.";
    case "duplicated":
      return "Lead wurde erfolgreich dupliziert.";
    case "extended":
      return "Lead wurde erfolgreich verlängert.";
    case "archived":
      return "Lead wurde erfolgreich archiviert.";
    default:
      return "";
  }
}

function getError(error?: string) {
  switch (error) {
    case "missing-fields":
      return "Bitte alle Pflichtfelder ausfüllen.";
    case "invalid-price":
      return "Der Leadpreis muss mindestens 1 Credit betragen.";
    case "invalid-value":
      return "Der geschätzte Auftragswert muss mindestens CHF 1 betragen.";
    case "invalid-lead":
      return "Der Lead konnte nicht gefunden werden.";
    case "delete-blocked":
      return "Dieser Lead kann nicht gelöscht werden, weil bereits Käufe vorhanden sind.";
    default:
      return "";
  }
}

function shortText(text: string | null, maxLength = 120) {
  if (!text) {
    return "Keine Beschreibung vorhanden.";
  }

  const cleaned = text
    .replace(/\s+/g, " ")
    .replaceAll("Nicht angegeben", "")
    .trim();

  if (cleaned.length <= maxLength) {
    return cleaned;
  }

  return `${cleaned.slice(0, maxLength)}...`;
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("de-CH", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function formatDateTime(date: Date) {
  return new Intl.DateTimeFormat("de-CH", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function getExpiryDate(createdAt: Date, expiresAt: Date | null) {
  if (expiresAt) {
    return expiresAt;
  }

  return new Date(createdAt.getTime() + 7 * 24 * 60 * 60 * 1000);
}

function getLeadStatus({
  expiresAt,
  purchaseCount,
  maxPurchases,
}: {
  expiresAt: Date;
  purchaseCount: number;
  maxPurchases: number;
}): LeadStatus {
  const remainingTime = expiresAt.getTime() - Date.now();
  const oneDay = 24 * 60 * 60 * 1000;

  if (purchaseCount >= maxPurchases) {
    return "SOLD_OUT";
  }

  if (remainingTime <= 0) {
    return "EXPIRED";
  }

  if (remainingTime <= oneDay) {
    return "ENDING";
  }

  return "ACTIVE";
}

function getStatusDesign(status: LeadStatus) {
  switch (status) {
    case "SOLD_OUT":
      return {
        label: "Ausverkauft",
        color: "#e2e8f0",
        background: "rgba(148,163,184,0.12)",
        border: "rgba(148,163,184,0.32)",
        dot: "#94a3b8",
      };

    case "EXPIRED":
      return {
        label: "Abgelaufen",
        color: "#fecaca",
        background: "rgba(239,68,68,0.12)",
        border: "rgba(239,68,68,0.32)",
        dot: "#ef4444",
      };

    case "ENDING":
      return {
        label: "Läuft bald ab",
        color: "#fde68a",
        background: "rgba(245,158,11,0.12)",
        border: "rgba(245,158,11,0.32)",
        dot: "#f59e0b",
      };

    default:
      return {
        label: "Aktiv",
        color: "#bbf7d0",
        background: "rgba(34,197,94,0.12)",
        border: "rgba(34,197,94,0.32)",
        dot: "#22c55e",
      };
  }
}

function getCountdown(expiresAt: Date) {
  const difference = expiresAt.getTime() - Date.now();

  if (difference <= 0) {
    return "Abgelaufen";
  }

  const totalMinutes = Math.floor(difference / (1000 * 60));
  const totalHours = Math.floor(totalMinutes / 60);
  const days = Math.floor(totalHours / 24);

  if (days >= 1) {
    return days === 1 ? "Noch 1 Tag" : `Noch ${days} Tage`;
  }

  if (totalHours >= 1) {
    return totalHours === 1
      ? "Noch 1 Stunde"
      : `Noch ${totalHours} Stunden`;
  }

  return totalMinutes <= 1
    ? "Weniger als 1 Minute"
    : `Noch ${totalMinutes} Minuten`;
}

export default async function AdminLeadsPage({
  searchParams,
}: PageProps) {
  const params = searchParams ? await searchParams : undefined;

  const successMessage = getMessage(params?.message);
  const errorMessage = getError(params?.error);

  const q = String(params?.q || "").trim().toLowerCase();
  const regionFilter = String(params?.region || "ALL").trim();
  const categoryFilter = String(params?.category || "ALL").trim();
  const statusFilter = String(params?.status || "ALL").trim();

  const allLeads = await prisma.lead.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      purchases: {
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          price: true,
          createdAt: true,
          provider: {
            select: {
              companyName: true,
            },
          },
        },
      },
    },
  });

  const leads = allLeads.filter((lead) => {
    const maxPurchases =
      lead.maxPurchases > 0 ? lead.maxPurchases : 4;

    const expiresAt = getExpiryDate(
      lead.createdAt,
      lead.expiresAt
    );

    const status = getLeadStatus({
      expiresAt,
      purchaseCount: lead.purchases.length,
      maxPurchases,
    });

    const matchesSearch =
      !q ||
      lead.title.toLowerCase().includes(q) ||
      lead.description.toLowerCase().includes(q) ||
      lead.name.toLowerCase().includes(q) ||
      lead.email.toLowerCase().includes(q) ||
      lead.phone.toLowerCase().includes(q) ||
      (lead.postalCode ?? "").toLowerCase().includes(q) ||
      (lead.city ?? "").toLowerCase().includes(q);

    const matchesRegion =
      regionFilter === "ALL" ||
      lead.region === regionFilter;

    const matchesCategory =
      categoryFilter === "ALL" ||
      lead.category === categoryFilter;

    const matchesStatus =
      statusFilter === "ALL" ||
      status === statusFilter;

    return (
      matchesSearch &&
      matchesRegion &&
      matchesCategory &&
      matchesStatus
    );
  });

  const now = Date.now();
  const last24Hours = now - 24 * 60 * 60 * 1000;
  const last7Days = now - 7 * 24 * 60 * 60 * 1000;

  const totalLeads = allLeads.length;

  const leadsLast24Hours = allLeads.filter(
    (lead) => lead.createdAt.getTime() >= last24Hours
  ).length;

  const leadsLast7Days = allLeads.filter(
    (lead) => lead.createdAt.getTime() >= last7Days
  ).length;

  const totalPurchases = allLeads.reduce(
    (sum, lead) => sum + lead.purchases.length,
    0
  );

  const totalCreditsUsed = allLeads.reduce(
    (sum, lead) =>
      sum +
      lead.purchases.reduce(
        (purchaseSum, purchase) =>
          purchaseSum + purchase.price,
        0
      ),
    0
  );

  const soldLeadCount = allLeads.filter(
    (lead) => lead.purchases.length > 0
  ).length;

  const conversionRate =
    totalLeads > 0
      ? Math.round((soldLeadCount / totalLeads) * 100)
      : 0;

  const averageLeadPrice =
    totalLeads > 0
      ? Math.round(
          allLeads.reduce(
            (sum, lead) => sum + lead.price,
            0
          ) / totalLeads
        )
      : 0;

  const statusCounts = allLeads.reduce(
    (counts, lead) => {
      const maxPurchases =
        lead.maxPurchases > 0 ? lead.maxPurchases : 4;

      const expiresAt = getExpiryDate(
        lead.createdAt,
        lead.expiresAt
      );

      const status = getLeadStatus({
        expiresAt,
        purchaseCount: lead.purchases.length,
        maxPurchases,
      });

      counts[status] += 1;

      return counts;
    },
    {
      ACTIVE: 0,
      ENDING: 0,
      SOLD_OUT: 0,
      EXPIRED: 0,
    }
  );

  return (
    <main className="admin-page">
      <div className="container">
        <header className="page-header">
          <div>
            <span className="admin-badge">
              <span className="online-dot" />
              AUFTRAGO ADMINISTRATION
            </span>

            <h1>Lead-Zentrale.</h1>

            <p>
              Kundenanfragen erfassen, filtern und verkaufen —
              kompakt wie in einem modernen CRM.
            </p>
          </div>

          <div className="header-actions">
            <Link
              href="/admin"
              className="btn btn-secondary"
            >
              ← Dashboard
            </Link>

            <Link
              href="/admin/providers"
              className="btn btn-secondary"
            >
              Anbieter verwalten
            </Link>

            <a
              href="#new-lead"
              className="btn btn-primary"
            >
              + Neuer Lead
            </a>
          </div>
        </header>

        {successMessage ? (
          <div className="success-message">
            ✓ {successMessage}
          </div>
        ) : null}

        {errorMessage ? (
          <div className="error-message">
            {errorMessage}
          </div>
        ) : null}

        <section className="stats-grid">
          <StatCard
            label="LEADS"
            value={totalLeads}
            description={`+${leadsLast24Hours} in 24 Stunden`}
          />

          <StatCard
            label="AKTIV"
            value={statusCounts.ACTIVE}
            description={`${statusCounts.ENDING} laufen bald ab`}
          />

          <StatCard
            label="AUSVERKAUFT"
            value={statusCounts.SOLD_OUT}
            description="Keine Plätze mehr frei"
          />

          <StatCard
            label="VERKÄUFE"
            value={totalPurchases}
            description={`${soldLeadCount} Leads verkauft`}
          />

          <StatCard
            label="CONVERSION"
            value={`${conversionRate}%`}
            description="Leads mit mindestens 1 Kauf"
          />

          <StatCard
            label="CREDITS"
            value={totalCreditsUsed}
            description="Insgesamt eingesetzt"
          />

          <StatCard
            label="Ø LEADPREIS"
            value={averageLeadPrice}
            description="Credits pro Lead"
          />

          <StatCard
            label="NEU 7 TAGE"
            value={leadsLast7Days}
            description="Aktuelle Nachfrage"
          />
        </section>

        <section className="filter-card">
          <form className="filter-grid">
            <input
              name="q"
              defaultValue={params?.q ?? ""}
              placeholder="Titel, Kunde, E-Mail, Telefon, PLZ oder Ort suchen ..."
            />

            <select
              name="region"
              defaultValue={regionFilter}
            >
              <option value="ALL">
                Alle Regionen
              </option>

              {regions.map((region) => (
                <option
                  key={region}
                  value={region}
                >
                  {region}
                </option>
              ))}
            </select>

            <select
              name="category"
              defaultValue={categoryFilter}
            >
              <option value="ALL">
                Alle Kategorien
              </option>

              {categories.map((category) => (
                <option
                  key={category}
                  value={category}
                >
                  {category}
                </option>
              ))}
            </select>

            <select
              name="status"
              defaultValue={statusFilter}
            >
              <option value="ALL">
                Alle Status
              </option>

              <option value="ACTIVE">
                Aktiv
              </option>

              <option value="ENDING">
                Läuft bald ab
              </option>

              <option value="SOLD_OUT">
                Ausverkauft
              </option>

              <option value="EXPIRED">
                Abgelaufen
              </option>
            </select>

            <button
              type="submit"
              className="btn btn-primary"
            >
              Suchen
            </button>

            <Link
              href="/admin/leads"
              className="btn btn-secondary"
            >
              Zurücksetzen
            </Link>
          </form>
        </section>

        <div className="result-information">
          <span>
            {leads.length} Leads angezeigt
          </span>

          <span>
            Sortiert nach neuestem Eintrag
          </span>
        </div>

        <section className="lead-list">
          {leads.length === 0 ? (
            <div className="empty-state">
              <strong>
                Keine Leads gefunden
              </strong>

              <p>
                Passe die Suche oder die Filter an.
              </p>
            </div>
          ) : (
            leads.map((lead) => {
              const maxPurchases =
                lead.maxPurchases > 0
                  ? lead.maxPurchases
                  : 4;

              const expiresAt = getExpiryDate(
                lead.createdAt,
                lead.expiresAt
              );

              const purchaseCount =
                lead.purchases.length;

              const remainingSlots = Math.max(
                0,
                maxPurchases - purchaseCount
              );

              const progress = Math.min(
                100,
                Math.round(
                  (purchaseCount / maxPurchases) * 100
                )
              );

              const creditRevenue =
                lead.purchases.reduce(
                  (sum, purchase) =>
                    sum + purchase.price,
                  0
                );

              const status = getLeadStatus({
                expiresAt,
                purchaseCount,
                maxPurchases,
              });

              const statusDesign =
                getStatusDesign(status);

              return (
                <article
                  key={lead.id}
                  className="lead-card"
                >
                  <div className="lead-information">
                    <div className="lead-icon">
                      L
                    </div>

                    <div className="lead-content">
                      <div className="status-row">
                        <span
                          className="status-badge"
                          style={{
                            color:
                              statusDesign.color,
                            background:
                              statusDesign.background,
                            borderColor:
                              statusDesign.border,
                          }}
                        >
                          <span
                            className="status-dot"
                            style={{
                              background:
                                statusDesign.dot,
                            }}
                          />

                          {statusDesign.label}
                        </span>

                        {remainingSlots === 1 ? (
                          <span className="last-slot">
                            🔥 Letzter Platz
                          </span>
                        ) : null}
                      </div>

                      <h2>{lead.title}</h2>

                      <p className="customer-line">
                        {lead.name} · {lead.email}
                      </p>

                      <p className="description-line">
                        {shortText(
                          lead.description,
                          155
                        )}
                      </p>

                      <div className="lead-tags">
                        <span>
                          {lead.region}
                        </span>

                        <span>
                          {lead.category}
                        </span>

                        {lead.postalCode ||
                        lead.city ? (
                          <span>
                            {[
                              lead.postalCode,
                              lead.city,
                            ]
                              .filter(Boolean)
                              .join(" ")}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  <div className="lead-metrics">
                    <Metric
                      label="LEADPREIS"
                      value={lead.price}
                      description="Credits"
                      highlighted
                    />

                    <Metric
                      label="VERKAUFT"
                      value={`${purchaseCount}/${maxPurchases}`}
                      description={
                        remainingSlots === 0
                          ? "Keine Plätze frei"
                          : `${remainingSlots} Plätze frei`
                      }
                    />

                    <Metric
                      label="UMSATZ"
                      value={creditRevenue}
                      description="Credits"
                    />

                    <Metric
                      label="ABLAUF"
                      value={getCountdown(expiresAt)}
                      description={formatDateTime(
                        expiresAt
                      )}
                      small
                    />
                  </div>

                  <div className="progress-section">
                    <div className="progress-header">
                      <span>
                        Verkaufsfortschritt
                      </span>

                      <strong>
                        {progress}%
                      </strong>
                    </div>

                    <div className="progress-track">
                      <div
                        className="progress-value"
                        style={{
                          width: `${progress}%`,
                          background:
                            remainingSlots === 0
                              ? "linear-gradient(90deg, #94a3b8, #e2e8f0)"
                              : remainingSlots === 1
                                ? "linear-gradient(90deg, #f97316, #facc15)"
                                : "linear-gradient(90deg, #0ea5e9, #6366f1)",
                        }}
                      />
                    </div>
                  </div>

                  <div className="lead-actions">
                    <Link
                      href={`/admin/leads/${lead.id}`}
                      className="btn btn-primary"
                    >
                      Bearbeiten
                    </Link>

                    <details className="details-wrapper">
                      <summary className="btn btn-secondary">
                        Details
                      </summary>

                      <div className="details-popup">
                        <strong>
                          {lead.title}
                        </strong>

                        <p>
                          {lead.description}
                        </p>

                        <div className="contact-details">
                          <span>
                            Kunde: {lead.name}
                          </span>

                          <span>
                            Telefon: {lead.phone}
                          </span>

                          <span>
                            E-Mail: {lead.email}
                          </span>

                          <span>
                            Erstellt:{" "}
                            {formatDate(
                              lead.createdAt
                            )}
                          </span>

                          <span>
                            Ablauf:{" "}
                            {formatDateTime(
                              expiresAt
                            )}
                          </span>
                        </div>

                        {lead.purchases.length >
                        0 ? (
                          <div className="buyers">
                            <span className="small-heading">
                              GEKAUFT VON
                            </span>

                            {lead.purchases.map(
                              (purchase) => (
                                <div
                                  key={purchase.id}
                                  className="buyer"
                                >
                                  <strong>
                                    {
                                      purchase
                                        .provider
                                        .companyName
                                    }
                                  </strong>

                                  <span>
                                    {purchase.price}{" "}
                                    Credits ·{" "}
                                    {formatDateTime(
                                      purchase.createdAt
                                    )}
                                  </span>
                                </div>
                              )
                            )}
                          </div>
                        ) : (
                          <p className="no-purchases">
                            Dieser Lead wurde noch
                            nicht gekauft.
                          </p>
                        )}

                        <DeleteLeadButton
                          leadId={lead.id}
                          label="Lead löschen"
                          className="btn btn-secondary delete-button"
                        />
                      </div>
                    </details>
                  </div>
                </article>
              );
            })
          )}
        </section>

        <section
          id="new-lead"
          className="new-lead-card"
        >
          <div className="new-lead-header">
            <div>
              <span className="small-heading purple">
                NEUER LEAD
              </span>

              <h2>
                Kundenanfrage erfassen
              </h2>

              <p>
                Der Leadpreis wird automatisch
                berechnet, sofern du ihn nicht
                manuell vorgibst.
              </p>
            </div>

            <div className="price-logic">
              Automatische Preislogik aktiv
            </div>
          </div>

          <form
            action={createLeadAction}
            className="create-form"
          >
            <input
              name="title"
              placeholder="Titel, z. B. Fensterreinigung Zürich"
              required
            />

            <textarea
              name="description"
              placeholder="Beschreibung des Auftrags"
              required
            />

            <div className="form-row">
              <input
                name="name"
                placeholder="Kundenname"
                required
              />

              <input
                name="phone"
                placeholder="Telefon"
                required
              />
            </div>

            <input
              name="email"
              type="email"
              placeholder="E-Mail"
              required
            />

            <div className="form-row">
              <input
                name="postalCode"
                placeholder="Postleitzahl"
              />

              <input
                name="city"
                placeholder="Ort"
              />
            </div>

            <div className="three-columns">
              <select
                name="region"
                required
                defaultValue=""
              >
                <option
                  value=""
                  disabled
                >
                  Region auswählen
                </option>

                {regions.map((region) => (
                  <option
                    key={region}
                    value={region}
                  >
                    {region}
                  </option>
                ))}
              </select>

              <select
                name="category"
                required
                defaultValue=""
              >
                <option
                  value=""
                  disabled
                >
                  Kategorie auswählen
                </option>

                {categories.map(
                  (category) => (
                    <option
                      key={category}
                      value={category}
                    >
                      {category}
                    </option>
                  )
                )}
              </select>

              <input
                name="estimatedValue"
                type="number"
                min="1"
                placeholder="Auftragswert CHF"
                required
              />
            </div>

            <div className="three-columns">
              <input
                name="price"
                type="number"
                min="1"
                placeholder="Leadpreis Credits optional"
              />

              <input
                name="maxPurchases"
                type="number"
                min="1"
                defaultValue="4"
                placeholder="Maximale Käufer"
              />

              <input
                name="expiresAt"
                type="datetime-local"
              />
            </div>

            <div className="price-grid">
              <span>
                bis CHF 300 → 10 Credits
              </span>

              <span>
                CHF 301–700 → 20 Credits
              </span>

              <span>
                CHF 701–1&apos;500 → 35 Credits
              </span>

              <span>
                CHF 1&apos;501–3&apos;000 → 55 Credits
              </span>

              <span>
                über CHF 3&apos;000 → 80 Credits
              </span>
            </div>

            <button
              type="submit"
              className="btn btn-primary create-button"
            >
              Lead erstellen
            </button>
          </form>
        </section>
      </div>

      <style>{`
        .admin-page {
          min-height: 100vh;
          padding: 32px 0 72px;
          background:
            radial-gradient(
              circle at 10% 0%,
              rgba(14, 165, 233, 0.18),
              transparent 32%
            ),
            radial-gradient(
              circle at 88% 6%,
              rgba(99, 102, 241, 0.22),
              transparent 34%
            ),
            #071426;
        }

        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 24px;
          flex-wrap: wrap;
        }

        .page-header h1 {
          margin: 18px 0 0;
          font-size: clamp(42px, 6vw, 76px);
          line-height: 0.98;
          letter-spacing: -0.055em;
        }

        .page-header p {
          margin: 18px 0 0;
          opacity: 0.68;
          font-size: 18px;
        }

        .admin-badge {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          padding: 10px 14px;
          border-radius: 999px;
          border: 1px solid rgba(56, 189, 248, 0.35);
          background: rgba(14, 165, 233, 0.1);
          color: #c4b5fd;
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 0.14em;
        }

        .online-dot {
          width: 9px;
          height: 9px;
          border-radius: 999px;
          background: #22c55e;
          box-shadow: 0 0 18px rgba(34, 197, 94, 0.8);
        }

        .header-actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .success-message,
        .error-message {
          margin-top: 24px;
          padding: 16px 18px;
          border-radius: 18px;
          font-weight: 800;
        }

        .success-message {
          border: 1px solid rgba(34, 197, 94, 0.28);
          background: rgba(34, 197, 94, 0.12);
          color: #bbf7d0;
        }

        .error-message {
          border: 1px solid rgba(239, 68, 68, 0.28);
          background: rgba(239, 68, 68, 0.12);
          color: #fecaca;
        }

        .stats-grid {
          display: grid;
          grid-template-columns:
            repeat(auto-fit, minmax(165px, 1fr));
          gap: 14px;
          margin-top: 34px;
        }

        .stat-card {
          min-height: 142px;
          padding: 22px;
          border-radius: 24px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background:
            radial-gradient(
              circle at 100% 100%,
              rgba(255, 255, 255, 0.08),
              transparent 34%
            ),
            linear-gradient(
              135deg,
              rgba(20, 38, 64, 0.96),
              rgba(37, 45, 92, 0.82)
            );
          box-shadow: 0 22px 55px rgba(0, 0, 0, 0.22);
        }

        .stat-card span,
        .small-heading {
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.12em;
          opacity: 0.55;
        }

        .stat-card strong {
          display: block;
          margin-top: 20px;
          font-size: 34px;
          line-height: 1;
        }

        .stat-card small {
          display: block;
          margin-top: 12px;
          opacity: 0.48;
        }

        .filter-card {
          margin-top: 26px;
          padding: 18px;
          border-radius: 26px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(10, 23, 43, 0.78);
          box-shadow: 0 24px 65px rgba(0, 0, 0, 0.24);
        }

        .filter-grid {
          display: grid;
          grid-template-columns:
            minmax(260px, 1fr)
            170px
            190px
            170px
            auto
            auto;
          gap: 12px;
          align-items: center;
        }

        .result-information {
          display: flex;
          justify-content: space-between;
          gap: 14px;
          margin: 28px 2px 12px;
          opacity: 0.62;
          font-size: 14px;
        }

        .lead-list {
          display: grid;
          gap: 16px;
        }

        .empty-state {
          padding: 42px;
          text-align: center;
          border-radius: 28px;
          background: rgba(7, 20, 38, 0.82);
          border: 1px solid rgba(255, 255, 255, 0.09);
        }

        .empty-state strong {
          font-size: 22px;
        }

        .empty-state p {
          opacity: 0.58;
        }

        .lead-card {
          display: grid;
          grid-template-columns:
            minmax(320px, 1.35fr)
            minmax(430px, 1fr)
            210px;
          gap: 20px;
          padding: 22px;
          border-radius: 26px;
          border: 1px solid rgba(255, 255, 255, 0.09);
          background:
            radial-gradient(
              circle at 0% 0%,
              rgba(14, 165, 233, 0.08),
              transparent 35%
            ),
            rgba(7, 20, 38, 0.88);
          box-shadow: 0 24px 70px rgba(0, 0, 0, 0.22);
          position: relative;
        }

        .lead-information {
          display: flex;
          gap: 14px;
          min-width: 0;
        }

        .lead-icon {
          width: 46px;
          height: 46px;
          flex: 0 0 46px;
          border-radius: 15px;
          display: grid;
          place-items: center;
          background:
            linear-gradient(
              135deg,
              #0ea5e9,
              #6366f1
            );
          font-weight: 900;
        }

        .lead-content {
          min-width: 0;
        }

        .status-row {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .status-badge,
        .last-slot {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 7px 10px;
          border-radius: 999px;
          border: 1px solid;
          font-size: 11px;
          font-weight: 900;
        }

        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 999px;
        }

        .last-slot {
          color: #fed7aa;
          border-color: rgba(249, 115, 22, 0.34);
          background: rgba(249, 115, 22, 0.12);
        }

        .lead-content h2 {
          margin: 13px 0 0;
          font-size: 21px;
          line-height: 1.2;
        }

        .customer-line {
          margin: 7px 0 0;
          opacity: 0.62;
          font-size: 13px;
        }

        .description-line {
          margin: 10px 0 0;
          opacity: 0.48;
          font-size: 13px;
          line-height: 1.55;
        }

        .lead-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
          margin-top: 13px;
        }

        .lead-tags span {
          padding: 6px 9px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.08);
          font-size: 11px;
          opacity: 0.75;
        }

        .lead-metrics {
          display: grid;
          grid-template-columns:
            repeat(4, minmax(90px, 1fr));
          gap: 12px;
          align-content: start;
        }

        .metric {
          padding: 13px;
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.07);
        }

        .metric-label {
          display: block;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.1em;
          opacity: 0.45;
        }

        .metric-value {
          display: block;
          margin-top: 9px;
          font-size: 22px;
          line-height: 1.05;
        }

        .metric-value.highlighted {
          color: #fde68a;
        }

        .metric-value.small {
          font-size: 15px;
        }

        .metric small {
          display: block;
          margin-top: 6px;
          opacity: 0.43;
          font-size: 11px;
        }

        .progress-section {
          grid-column: 2;
          margin-top: -62px;
          align-self: end;
        }

        .progress-header {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 8px;
          font-size: 12px;
          opacity: 0.7;
        }

        .progress-track {
          height: 10px;
          border-radius: 999px;
          overflow: hidden;
          background: rgba(255, 255, 255, 0.08);
        }

        .progress-value {
          height: 100%;
          border-radius: 999px;
        }

        .lead-actions {
          grid-column: 3;
          grid-row: 1 / span 2;
          display: grid;
          align-content: start;
          gap: 10px;
        }

        .details-wrapper {
          position: relative;
        }

        .details-wrapper summary {
          width: 100%;
          list-style: none;
          cursor: pointer;
          justify-content: center;
        }

        .details-wrapper summary::-webkit-details-marker {
          display: none;
        }

        .details-popup {
          position: absolute;
          z-index: 30;
          top: calc(100% + 10px);
          right: 0;
          width: min(370px, calc(100vw - 42px));
          padding: 18px;
          border-radius: 18px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: #0d1b30;
          box-shadow: 0 22px 50px rgba(0, 0, 0, 0.45);
        }

        .details-popup p {
          margin: 10px 0;
          opacity: 0.65;
          font-size: 13px;
          line-height: 1.55;
        }

        .contact-details {
          display: grid;
          gap: 7px;
          font-size: 13px;
          opacity: 0.72;
        }

        .buyers {
          display: grid;
          gap: 8px;
          margin-top: 17px;
        }

        .buyer {
          display: grid;
          gap: 4px;
          padding: 10px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.05);
          font-size: 13px;
        }

        .buyer span {
          opacity: 0.55;
          font-size: 12px;
        }

        .no-purchases {
          margin-top: 16px !important;
          opacity: 0.55 !important;
        }

        .delete-button {
          width: 100%;
          margin-top: 16px;
          border-color: rgba(239, 68, 68, 0.32) !important;
          color: #fecaca !important;
        }

        .new-lead-card {
          margin-top: 34px;
          padding: 28px;
          border-radius: 30px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background:
            radial-gradient(
              circle at top left,
              rgba(56, 189, 248, 0.14),
              transparent 34%
            ),
            linear-gradient(
              135deg,
              rgba(15, 23, 42, 0.98),
              rgba(30, 41, 80, 0.9)
            );
          box-shadow: 0 30px 80px rgba(0, 0, 0, 0.3);
        }

        .new-lead-header {
          display: flex;
          justify-content: space-between;
          gap: 18px;
          flex-wrap: wrap;
        }

        .new-lead-header h2 {
          margin: 7px 0 0;
          font-size: 30px;
        }

        .new-lead-header p {
          margin: 8px 0 0;
          opacity: 0.58;
        }

        .purple {
          color: #c4b5fd;
        }

        .price-logic {
          padding: 13px 16px;
          border-radius: 16px;
          background: rgba(250, 204, 21, 0.1);
          border: 1px solid rgba(250, 204, 21, 0.22);
          color: #fde68a;
          font-weight: 800;
        }

        .create-form {
          display: grid;
          gap: 14px;
          margin-top: 24px;
        }

        .create-form textarea {
          min-height: 130px;
        }

        .three-columns {
          display: grid;
          grid-template-columns:
            repeat(3, minmax(0, 1fr));
          gap: 14px;
        }

        .price-grid {
          display: grid;
          grid-template-columns:
            repeat(auto-fit, minmax(180px, 1fr));
          gap: 10px;
          padding: 16px;
          border-radius: 18px;
          background: rgba(255, 255, 255, 0.045);
          border: 1px solid rgba(255, 255, 255, 0.08);
          font-size: 13px;
        }

        .create-button {
          width: 100%;
          margin-top: 4px;
        }

        @media (max-width: 1180px) {
          .filter-grid {
            grid-template-columns:
              repeat(2, minmax(0, 1fr));
          }

          .lead-card {
            grid-template-columns: 1fr;
          }

          .lead-metrics,
          .progress-section,
          .lead-actions {
            grid-column: auto;
            grid-row: auto;
            margin-top: 0;
          }

          .lead-actions {
            grid-template-columns:
              repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 760px) {
          .filter-grid,
          .lead-metrics,
          .three-columns,
          .form-row,
          .lead-actions {
            grid-template-columns: 1fr !important;
          }

          .result-information {
            flex-direction: column;
          }

          .lead-card {
            padding: 17px;
          }

          .new-lead-card {
            padding: 20px;
          }

          .details-popup {
            position: fixed;
            top: 90px;
            left: 20px;
            right: 20px;
            width: auto;
            max-height: calc(100vh - 120px);
            overflow-y: auto;
          }
        }
      `}</style>
    </main>
  );
}

function StatCard({
  label,
  value,
  description,
}: {
  label: string;
  value: string | number;
  description: string;
}) {
  return (
    <div className="stat-card">
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{description}</small>
    </div>
  );
}

function Metric({
  label,
  value,
  description,
  highlighted = false,
  small = false,
}: {
  label: string;
  value: string | number;
  description: string;
  highlighted?: boolean;
  small?: boolean;
}) {
  return (
    <div className="metric">
      <span className="metric-label">
        {label}
      </span>

      <strong
        className={[
          "metric-value",
          highlighted ? "highlighted" : "",
          small ? "small" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {value}
      </strong>

      <small>{description}</small>
    </div>
  );
}