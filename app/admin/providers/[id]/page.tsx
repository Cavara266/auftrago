import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type PageProps = {
  params: {
    id: string;
  };
};

function formatDate(date: Date | null | undefined) {
  if (!date) return "–";

  return new Intl.DateTimeFormat("de-CH", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function formatMoneyFromCents(amount: number) {
  return new Intl.NumberFormat("de-CH", {
    style: "currency",
    currency: "CHF",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount / 100);
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("de-CH").format(value);
}

function initials(value: string) {
  const parts = value
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2);

  if (parts.length === 0) return "A";

  return parts.map((part) => part.charAt(0).toUpperCase()).join("");
}

function providerStatus(status: string) {
  if (status === "APPROVED") {
    return {
      label: "Freigegeben",
      icon: "●",
      className: "provider-crm-status approved",
    };
  }

  if (status === "BLOCKED") {
    return {
      label: "Gesperrt",
      icon: "●",
      className: "provider-crm-status blocked",
    };
  }

  return {
    label: "Ausstehend",
    icon: "●",
    className: "provider-crm-status pending",
  };
}

function purchaseStatus(status: string) {
  if (status === "WON") return "Gewonnen";
  if (status === "LOST") return "Verloren";
  if (status === "CONTACTED") return "Kontaktiert";
  if (status === "APPOINTMENT_SET") return "Termin vereinbart";
  if (status === "OFFER_SENT") return "Offerte gesendet";
  if (status === "NO_OFFER") return "Keine Offerte";

  return "Offen";
}

function activityIcon(event: string) {
  const normalized = event.toLowerCase();

  if (normalized.includes("login")) return "🔐";
  if (normalized.includes("credit")) return "⭐";
  if (normalized.includes("payment")) return "💳";
  if (normalized.includes("purchase")) return "🛒";
  if (normalized.includes("lead")) return "📈";
  if (normalized.includes("email")) return "✉️";
  if (normalized.includes("provider")) return "👤";

  return "⚡";
}

export default async function AdminProviderDetailPage({
  params,
}: PageProps) {
  const provider = await prisma.provider.findUnique({
    where: {
      id: params.id,
    },
    include: {
      purchases: {
        orderBy: {
          createdAt: "desc",
        },
        include: {
          lead: {
            select: {
              id: true,
              title: true,
              category: true,
              region: true,
              city: true,
              price: true,
            },
          },
        },
      },
      creditPurchases: {
        orderBy: {
          createdAt: "desc",
        },
      },
      activities: {
        orderBy: {
          createdAt: "desc",
        },
        take: 100,
      },
      fixedOrders: {
        orderBy: {
          createdAt: "desc",
        },
      },
      invoices: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!provider) {
    notFound();
  }

  const [
    totalProviderCount,
    providersWithMoreLeadPurchases,
  ] = await Promise.all([
    prisma.provider.count(),
    prisma.provider.count({
      where: {
        purchases: {
          some: {},
        },
        NOT: {
          id: provider.id,
        },
      },
    }),
  ]);

  const totalCreditRevenue = provider.creditPurchases
    .filter((purchase) => purchase.status.toLowerCase() === "paid")
    .reduce((sum, purchase) => sum + purchase.amount, 0);

  const totalInvoiceRevenue = provider.invoices
    .filter((invoice) => invoice.status.toUpperCase() === "PAID")
    .reduce((sum, invoice) => sum + invoice.amountCents, 0);

  const totalRevenue = totalCreditRevenue + totalInvoiceRevenue;

  const purchasedLeads = provider.purchases.length;

  const wonLeads = provider.purchases.filter(
    (purchase) => purchase.status === "WON",
  ).length;

  const successRate =
    purchasedLeads > 0
      ? Math.round((wonLeads / purchasedLeads) * 100)
      : 0;

  const creditsSpent = provider.purchases.reduce(
    (sum, purchase) => sum + purchase.price,
    0,
  );

  const paidCreditPackages = provider.creditPurchases.filter(
    (purchase) => purchase.status.toLowerCase() === "paid",
  ).length;

  const latestActivity =
    provider.activities[0]?.createdAt ||
    provider.purchases[0]?.createdAt ||
    provider.creditPurchases[0]?.createdAt ||
    provider.updatedAt;

  const rank =
    purchasedLeads === 0
      ? totalProviderCount
      : Math.min(providersWithMoreLeadPurchases + 1, totalProviderCount);

  const status = providerStatus(provider.status);

  const address = [
    provider.address,
    [provider.postalCode, provider.city].filter(Boolean).join(" "),
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <main className="provider-crm-page">
      <div className="provider-crm-container">
        <div className="provider-crm-topbar">
          <div>
            <Link href="/admin/providers" className="provider-crm-back">
              ← Zurück zu den Anbietern
            </Link>

            <span className="provider-crm-eyebrow">Anbieter CRM</span>
          </div>

          <div className="provider-crm-top-actions">
            <a
              href={`mailto:${provider.email}`}
              className="provider-crm-button secondary"
            >
              ✉️ E-Mail senden
            </a>

            <Link
              href={`/admin/providers/${provider.id}/edit`}
              className="provider-crm-button primary"
            >
              ✏️ Anbieter bearbeiten
            </Link>
          </div>
        </div>

        <section className="provider-crm-profile">
          <div className="provider-crm-profile-main">
            <div className="provider-crm-avatar">
              {provider.logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={provider.logoUrl}
                  alt={provider.companyName}
                />
              ) : (
                <span>{initials(provider.companyName)}</span>
              )}
            </div>

            <div className="provider-crm-profile-copy">
              <div className="provider-crm-title-row">
                <h1>{provider.companyName}</h1>

                <span className={status.className}>
                  <i>{status.icon}</i>
                  {status.label}
                </span>
              </div>

              <p>{provider.contactName}</p>

              <div className="provider-crm-contact-row">
                <a href={`mailto:${provider.email}`}>
                  ✉️ {provider.email}
                </a>

                {provider.phone ? (
                  <a href={`tel:${provider.phone}`}>
                    📞 {provider.phone}
                  </a>
                ) : null}

                {provider.website ? (
                  <a
                    href={
                      provider.website.startsWith("http")
                        ? provider.website
                        : `https://${provider.website}`
                    }
                    target="_blank"
                    rel="noreferrer"
                  >
                    🌐 Website öffnen
                  </a>
                ) : null}
              </div>
            </div>
          </div>

          <div className="provider-crm-profile-side">
            <div>
              <span>Mitglied seit</span>
              <strong>{formatDate(provider.createdAt)}</strong>
            </div>

            <div>
              <span>Letzte Aktivität</span>
              <strong>{formatDate(latestActivity)}</strong>
            </div>

            <div>
              <span>Anbieter-ID</span>
              <strong className="provider-crm-id">
                {provider.id}
              </strong>
            </div>
          </div>
        </section>

        <section className="provider-crm-metrics">
          <article>
            <div className="provider-crm-metric-icon">⭐</div>
            <div>
              <span>Credit-Guthaben</span>
              <strong>{formatNumber(provider.credits)}</strong>
              <small>Aktuell verfügbar</small>
            </div>
          </article>

          <article>
            <div className="provider-crm-metric-icon">💰</div>
            <div>
              <span>Gesamtausgaben</span>
              <strong>{formatMoneyFromCents(totalRevenue)}</strong>
              <small>{paidCreditPackages} bezahlte Credit-Pakete</small>
            </div>
          </article>

          <article>
            <div className="provider-crm-metric-icon">📈</div>
            <div>
              <span>Gekaufte Leads</span>
              <strong>{formatNumber(purchasedLeads)}</strong>
              <small>{formatNumber(creditsSpent)} Credits eingesetzt</small>
            </div>
          </article>

          <article>
            <div className="provider-crm-metric-icon">🏆</div>
            <div>
              <span>Erfolgsquote</span>
              <strong>{successRate}%</strong>
              <small>
                Rang {rank} von {totalProviderCount}
              </small>
            </div>
          </article>
        </section>

        <section className="provider-crm-grid">
          <div className="provider-crm-main-column">
            <article className="provider-crm-panel">
              <div className="provider-crm-panel-head">
                <div>
                  <span>CRM Übersicht</span>
                  <h2>Firmenprofil</h2>
                </div>

                <Link href={`/admin/providers/${provider.id}/edit`}>
                  Bearbeiten →
                </Link>
              </div>

              <div className="provider-crm-details-grid">
                <div>
                  <span>Firmenname</span>
                  <strong>{provider.companyName}</strong>
                </div>

                <div>
                  <span>Ansprechperson</span>
                  <strong>{provider.contactName}</strong>
                </div>

                <div>
                  <span>E-Mail-Adresse</span>
                  <strong>{provider.email}</strong>
                </div>

                <div>
                  <span>Telefonnummer</span>
                  <strong>{provider.phone || "Nicht angegeben"}</strong>
                </div>

                <div>
                  <span>Adresse</span>
                  <strong>{address || "Nicht angegeben"}</strong>
                </div>

                <div>
                  <span>Region</span>
                  <strong>{provider.region || "Nicht angegeben"}</strong>
                </div>

                <div>
                  <span>Hauptkategorie</span>
                  <strong>{provider.category || "Nicht angegeben"}</strong>
                </div>

                <div>
                  <span>E-Mail-Benachrichtigungen</span>
                  <strong>
                    {provider.receiveLeadEmails
                      ? "Aktiviert"
                      : "Deaktiviert"}
                  </strong>
                </div>

                <div>
                  <span>Alle Leads erhalten</span>
                  <strong>
                    {provider.receiveAllLeadEmails ? "Ja" : "Nein"}
                  </strong>
                </div>

                <div>
                  <span>Letzte Änderung</span>
                  <strong>{formatDate(provider.updatedAt)}</strong>
                </div>
              </div>

              {provider.description ? (
                <div className="provider-crm-description">
                  <span>Firmenbeschreibung</span>
                  <p>{provider.description}</p>
                </div>
              ) : null}
            </article>

            <article className="provider-crm-panel">
              <div className="provider-crm-panel-head">
                <div>
                  <span>Lead-Historie</span>
                  <h2>Gekaufte Leads</h2>
                </div>

                <strong>{purchasedLeads}</strong>
              </div>

              {provider.purchases.length === 0 ? (
                <div className="provider-crm-empty">
                  <div>📭</div>
                  <strong>Noch keine Leads gekauft</strong>
                  <p>
                    Sobald der Anbieter einen Lead kauft, erscheint dieser
                    hier.
                  </p>
                </div>
              ) : (
                <div className="provider-crm-table-wrap">
                  <table className="provider-crm-table">
                    <thead>
                      <tr>
                        <th>Lead</th>
                        <th>Kategorie</th>
                        <th>Region</th>
                        <th>Credits</th>
                        <th>Status</th>
                        <th>Datum</th>
                        <th />
                      </tr>
                    </thead>

                    <tbody>
                      {provider.purchases.map((purchase) => (
                        <tr key={purchase.id}>
                          <td>
                            <strong>{purchase.lead.title}</strong>
                          </td>

                          <td>{purchase.lead.category}</td>

                          <td>
                            {purchase.lead.city ||
                              purchase.lead.region ||
                              "–"}
                          </td>

                          <td>{purchase.price}</td>

                          <td>
                            <span
                              className={`provider-crm-lead-status status-${purchase.status.toLowerCase()}`}
                            >
                              {purchaseStatus(purchase.status)}
                            </span>
                          </td>

                          <td>{formatDate(purchase.createdAt)}</td>

                          <td>
                            <Link
                              href={`/admin/leads/${purchase.lead.id}`}
                            >
                              Öffnen →
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </article>

            <article className="provider-crm-panel">
              <div className="provider-crm-panel-head">
                <div>
                  <span>Finanzen</span>
                  <h2>Zahlungsverlauf</h2>
                </div>

                <strong>
                  {formatMoneyFromCents(totalRevenue)}
                </strong>
              </div>

              {provider.creditPurchases.length === 0 &&
              provider.invoices.length === 0 ? (
                <div className="provider-crm-empty">
                  <div>💳</div>
                  <strong>Noch keine Zahlungen</strong>
                  <p>
                    Credit-Käufe und Rechnungen erscheinen automatisch
                    in diesem Bereich.
                  </p>
                </div>
              ) : (
                <div className="provider-crm-payment-list">
                  {provider.creditPurchases.map((purchase) => (
                    <div
                      className="provider-crm-payment-row"
                      key={purchase.id}
                    >
                      <div className="provider-crm-payment-icon">
                        ⭐
                      </div>

                      <div className="provider-crm-payment-copy">
                        <strong>
                          {formatNumber(purchase.credits)} Credits
                        </strong>
                        <span>
                          Credit-Paket
                          {purchase.packageId
                            ? ` · ${purchase.packageId}`
                            : ""}
                        </span>
                      </div>

                      <div className="provider-crm-payment-value">
                        <strong>
                          {formatMoneyFromCents(purchase.amount)}
                        </strong>
                        <span
                          className={
                            purchase.status.toLowerCase() === "paid"
                              ? "paid"
                              : ""
                          }
                        >
                          {purchase.status}
                        </span>
                      </div>

                      <time>{formatDate(purchase.createdAt)}</time>
                    </div>
                  ))}

                  {provider.invoices.map((invoice) => (
                    <div
                      className="provider-crm-payment-row"
                      key={invoice.id}
                    >
                      <div className="provider-crm-payment-icon">
                        🧾
                      </div>

                      <div className="provider-crm-payment-copy">
                        <strong>{invoice.invoiceNumber}</strong>
                        <span>Fixauftrag-Rechnung</span>
                      </div>

                      <div className="provider-crm-payment-value">
                        <strong>
                          {formatMoneyFromCents(invoice.amountCents)}
                        </strong>
                        <span
                          className={
                            invoice.status.toUpperCase() === "PAID"
                              ? "paid"
                              : ""
                          }
                        >
                          {invoice.status}
                        </span>
                      </div>

                      <time>{formatDate(invoice.createdAt)}</time>
                    </div>
                  ))}
                </div>
              )}
            </article>

            <article className="provider-crm-panel">
              <div className="provider-crm-panel-head">
                <div>
                  <span>Chronologie</span>
                  <h2>Aktivitäten</h2>
                </div>

                <strong>{provider.activities.length}</strong>
              </div>

              {provider.activities.length === 0 ? (
                <div className="provider-crm-empty">
                  <div>⚡</div>
                  <strong>Noch keine Aktivitäten erfasst</strong>
                  <p>
                    Logins, Lead-Käufe und weitere Aktionen werden hier
                    angezeigt.
                  </p>
                </div>
              ) : (
                <div className="provider-crm-timeline">
                  {provider.activities.map((activity) => (
                    <div
                      className="provider-crm-timeline-row"
                      key={activity.id}
                    >
                      <div className="provider-crm-timeline-icon">
                        {activityIcon(activity.event)}
                      </div>

                      <div className="provider-crm-timeline-copy">
                        <strong>{activity.event}</strong>

                        <p>
                          {activity.description ||
                            "Aktivität wurde registriert."}
                        </p>

                        <div>
                          {activity.page ? (
                            <span>Seite: {activity.page}</span>
                          ) : null}

                          {activity.ipAddress ? (
                            <span>IP: {activity.ipAddress}</span>
                          ) : null}
                        </div>
                      </div>

                      <time>{formatDate(activity.createdAt)}</time>
                    </div>
                  ))}
                </div>
              )}
            </article>
          </div>

          <aside className="provider-crm-sidebar">
            <article className="provider-crm-panel">
              <div className="provider-crm-panel-head compact">
                <div>
                  <span>Anbieter</span>
                  <h2>Schnellaktionen</h2>
                </div>
              </div>

              <div className="provider-crm-quick-actions">
                <Link
                  href={`/admin/providers/${provider.id}/edit`}
                  className="provider-crm-quick-action"
                >
                  <i>✏️</i>
                  <span>
                    <strong>Anbieter bearbeiten</strong>
                    <small>Profil und Einstellungen ändern</small>
                  </span>
                </Link>

                <Link
                  href={`/admin/providers/${provider.id}/credits`}
                  className="provider-crm-quick-action"
                >
                  <i>⭐</i>
                  <span>
                    <strong>Credits verwalten</strong>
                    <small>Credits hinzufügen oder entfernen</small>
                  </span>
                </Link>

                <a
                  href={`mailto:${provider.email}`}
                  className="provider-crm-quick-action"
                >
                  <i>✉️</i>
                  <span>
                    <strong>E-Mail senden</strong>
                    <small>Anbieter direkt kontaktieren</small>
                  </span>
                </a>

                {provider.phone ? (
                  <a
                    href={`tel:${provider.phone}`}
                    className="provider-crm-quick-action"
                  >
                    <i>📞</i>
                    <span>
                      <strong>Anrufen</strong>
                      <small>{provider.phone}</small>
                    </span>
                  </a>
                ) : null}
              </div>
            </article>

            <article className="provider-crm-panel">
              <div className="provider-crm-panel-head compact">
                <div>
                  <span>Abdeckung</span>
                  <h2>Dienstleistungen</h2>
                </div>
              </div>

              <div className="provider-crm-tag-section">
                <span>Kategorien</span>

                <div className="provider-crm-tags">
                  {provider.serviceCategories.length === 0 ? (
                    <small>Keine Kategorien hinterlegt</small>
                  ) : (
                    provider.serviceCategories.map((category) => (
                      <strong key={category}>{category}</strong>
                    ))
                  )}
                </div>
              </div>

              <div className="provider-crm-tag-section">
                <span>Regionen</span>

                <div className="provider-crm-tags">
                  {provider.serviceRegions.length === 0 ? (
                    <small>Keine Regionen hinterlegt</small>
                  ) : (
                    provider.serviceRegions.map((region) => (
                      <strong key={region}>{region}</strong>
                    ))
                  )}
                </div>
              </div>

              <div className="provider-crm-tag-section">
                <span>Städte</span>

                <div className="provider-crm-tags">
                  {provider.serviceCities.length === 0 ? (
                    <small>Keine Städte hinterlegt</small>
                  ) : (
                    provider.serviceCities.slice(0, 15).map((city) => (
                      <strong key={city}>{city}</strong>
                    ))
                  )}
                </div>
              </div>
            </article>

            <article className="provider-crm-panel">
              <div className="provider-crm-panel-head compact">
                <div>
                  <span>Performance</span>
                  <h2>Anbieterbewertung</h2>
                </div>
              </div>

              <div className="provider-crm-score">
                <div className="provider-crm-score-circle">
                  <strong>{successRate}</strong>
                  <span>/ 100</span>
                </div>

                <div>
                  <strong>
                    {successRate >= 70
                      ? "Sehr guter Anbieter"
                      : successRate >= 40
                        ? "Aktiver Anbieter"
                        : purchasedLeads > 0
                          ? "Im Aufbau"
                          : "Noch keine Daten"}
                  </strong>

                  <p>
                    Automatische Bewertung basierend auf Käufen und
                    gewonnenen Leads.
                  </p>
                </div>
              </div>

              <div className="provider-crm-progress-list">
                <div>
                  <span>Erfolgsquote</span>
                  <strong>{successRate}%</strong>
                  <i>
                    <b style={{ width: `${successRate}%` }} />
                  </i>
                </div>

                <div>
                  <span>Profilvollständigkeit</span>
                  <strong>
                    {[
                      provider.companyName,
                      provider.contactName,
                      provider.email,
                      provider.phone,
                      provider.address,
                      provider.city,
                      provider.website,
                      provider.description,
                    ].filter(Boolean).length * 12}
                    %
                  </strong>

                  <i>
                    <b
                      style={{
                        width: `${Math.min(
                          [
                            provider.companyName,
                            provider.contactName,
                            provider.email,
                            provider.phone,
                            provider.address,
                            provider.city,
                            provider.website,
                            provider.description,
                          ].filter(Boolean).length * 12,
                          100,
                        )}%`,
                      }}
                    />
                  </i>
                </div>
              </div>
            </article>

            <article className="provider-crm-panel">
              <div className="provider-crm-panel-head compact">
                <div>
                  <span>Interne Nutzung</span>
                  <h2>Notizen</h2>
                </div>
              </div>

              <div className="provider-crm-note-placeholder">
                <div>📝</div>
                <strong>Noch keine internen Notizen</strong>
                <p>
                  Im nächsten Schritt bauen wir das Speichern und
                  Bearbeiten interner CRM-Notizen ein.
                </p>

                <button type="button" disabled>
                  Neue Notiz
                </button>
              </div>
            </article>
          </aside>
        </section>
      </div>

      <style>{`
        .provider-crm-page {
          min-height: 100vh;
          background:
            radial-gradient(circle at top left, rgba(37, 99, 235, 0.08), transparent 30%),
            #f4f7fb;
          color: #111827;
          padding: 32px 20px 80px;
        }

        .provider-crm-container {
          width: min(1500px, 100%);
          margin: 0 auto;
        }

        .provider-crm-topbar,
        .provider-crm-profile,
        .provider-crm-profile-main,
        .provider-crm-title-row,
        .provider-crm-contact-row,
        .provider-crm-top-actions,
        .provider-crm-panel-head,
        .provider-crm-payment-row,
        .provider-crm-timeline-row,
        .provider-crm-score {
          display: flex;
          align-items: center;
        }

        .provider-crm-topbar {
          justify-content: space-between;
          gap: 24px;
          margin-bottom: 22px;
        }

        .provider-crm-topbar > div:first-child {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .provider-crm-back {
          color: #64748b;
          text-decoration: none;
          font-size: 14px;
          font-weight: 700;
        }

        .provider-crm-back:hover {
          color: #111827;
        }

        .provider-crm-eyebrow {
          color: #2563eb;
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        .provider-crm-top-actions {
          gap: 10px;
          flex-wrap: wrap;
        }

        .provider-crm-button {
          min-height: 44px;
          padding: 0 18px;
          border-radius: 12px;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: 800;
          transition: 0.2s ease;
        }

        .provider-crm-button:hover {
          transform: translateY(-1px);
        }

        .provider-crm-button.primary {
          color: white;
          background: #111827;
          box-shadow: 0 10px 30px rgba(15, 23, 42, 0.18);
        }

        .provider-crm-button.secondary {
          color: #111827;
          background: white;
          border: 1px solid #e2e8f0;
        }

        .provider-crm-profile {
          justify-content: space-between;
          align-items: stretch;
          gap: 30px;
          padding: 28px;
          border-radius: 24px;
          background:
            linear-gradient(135deg, rgba(255,255,255,0.98), rgba(248,250,252,0.96));
          border: 1px solid rgba(226, 232, 240, 0.9);
          box-shadow: 0 20px 60px rgba(15, 23, 42, 0.08);
        }

        .provider-crm-profile-main {
          gap: 20px;
          min-width: 0;
        }

        .provider-crm-avatar {
          width: 84px;
          height: 84px;
          flex: 0 0 84px;
          border-radius: 24px;
          overflow: hidden;
          display: grid;
          place-items: center;
          color: white;
          background: linear-gradient(135deg, #111827, #334155);
          font-size: 27px;
          font-weight: 900;
          box-shadow: 0 14px 28px rgba(15, 23, 42, 0.2);
        }

        .provider-crm-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .provider-crm-profile-copy {
          min-width: 0;
        }

        .provider-crm-title-row {
          gap: 12px;
          flex-wrap: wrap;
        }

        .provider-crm-title-row h1 {
          margin: 0;
          font-size: clamp(28px, 4vw, 42px);
          line-height: 1.05;
          letter-spacing: -0.04em;
        }

        .provider-crm-profile-copy > p {
          margin: 7px 0 14px;
          color: #64748b;
          font-size: 16px;
        }

        .provider-crm-status {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 7px 10px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 900;
        }

        .provider-crm-status i {
          font-style: normal;
          font-size: 10px;
        }

        .provider-crm-status.approved {
          color: #047857;
          background: #ecfdf5;
          border: 1px solid #a7f3d0;
        }

        .provider-crm-status.pending {
          color: #b45309;
          background: #fffbeb;
          border: 1px solid #fde68a;
        }

        .provider-crm-status.blocked {
          color: #b91c1c;
          background: #fef2f2;
          border: 1px solid #fecaca;
        }

        .provider-crm-contact-row {
          gap: 15px;
          flex-wrap: wrap;
        }

        .provider-crm-contact-row a {
          color: #475569;
          text-decoration: none;
          font-size: 13px;
          font-weight: 700;
        }

        .provider-crm-contact-row a:hover {
          color: #2563eb;
        }

        .provider-crm-profile-side {
          min-width: 310px;
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
        }

        .provider-crm-profile-side > div {
          padding: 14px;
          border-radius: 14px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
        }

        .provider-crm-profile-side > div:last-child {
          grid-column: 1 / -1;
        }

        .provider-crm-profile-side span,
        .provider-crm-details-grid span,
        .provider-crm-description span,
        .provider-crm-tag-section > span {
          display: block;
          color: #94a3b8;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          margin-bottom: 6px;
        }

        .provider-crm-profile-side strong {
          font-size: 13px;
        }

        .provider-crm-id {
          display: block;
          max-width: 260px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-family: monospace;
          color: #475569;
        }

        .provider-crm-metrics {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 16px;
          margin: 20px 0;
        }

        .provider-crm-metrics article {
          display: flex;
          gap: 14px;
          align-items: center;
          padding: 20px;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 18px;
          box-shadow: 0 10px 30px rgba(15, 23, 42, 0.05);
        }

        .provider-crm-metric-icon {
          width: 48px;
          height: 48px;
          flex: 0 0 48px;
          border-radius: 14px;
          display: grid;
          place-items: center;
          background: #f1f5f9;
          font-size: 21px;
        }

        .provider-crm-metrics article span,
        .provider-crm-metrics article small {
          display: block;
        }

        .provider-crm-metrics article span {
          color: #64748b;
          font-size: 12px;
          font-weight: 800;
        }

        .provider-crm-metrics article strong {
          display: block;
          margin: 3px 0;
          font-size: 24px;
          letter-spacing: -0.03em;
        }

        .provider-crm-metrics article small {
          color: #94a3b8;
          font-size: 11px;
        }

        .provider-crm-grid {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 360px;
          align-items: start;
          gap: 20px;
        }

        .provider-crm-main-column,
        .provider-crm-sidebar {
          display: grid;
          gap: 20px;
        }

        .provider-crm-panel {
          min-width: 0;
          padding: 24px;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 20px;
          box-shadow: 0 10px 35px rgba(15, 23, 42, 0.05);
        }

        .provider-crm-panel-head {
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 22px;
        }

        .provider-crm-panel-head.compact {
          margin-bottom: 18px;
        }

        .provider-crm-panel-head span {
          display: block;
          color: #2563eb;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-bottom: 4px;
        }

        .provider-crm-panel-head h2 {
          margin: 0;
          font-size: 20px;
          letter-spacing: -0.02em;
        }

        .provider-crm-panel-head > a {
          color: #2563eb;
          text-decoration: none;
          font-size: 13px;
          font-weight: 800;
        }

        .provider-crm-details-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
        }

        .provider-crm-details-grid > div {
          min-width: 0;
          padding: 14px;
          border-radius: 14px;
          background: #f8fafc;
          border: 1px solid #edf2f7;
        }

        .provider-crm-details-grid strong {
          display: block;
          overflow-wrap: anywhere;
          font-size: 14px;
        }

        .provider-crm-description {
          margin-top: 14px;
          padding: 16px;
          border-radius: 14px;
          background: #f8fafc;
          border: 1px solid #edf2f7;
        }

        .provider-crm-description p {
          margin: 0;
          color: #475569;
          font-size: 14px;
          line-height: 1.7;
          white-space: pre-line;
        }

        .provider-crm-table-wrap {
          overflow-x: auto;
        }

        .provider-crm-table {
          width: 100%;
          border-collapse: collapse;
          min-width: 850px;
        }

        .provider-crm-table th {
          padding: 11px 12px;
          text-align: left;
          color: #94a3b8;
          font-size: 10px;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          border-bottom: 1px solid #e2e8f0;
        }

        .provider-crm-table td {
          padding: 14px 12px;
          color: #475569;
          font-size: 13px;
          border-bottom: 1px solid #f1f5f9;
        }

        .provider-crm-table td strong {
          color: #111827;
        }

        .provider-crm-table td a {
          color: #2563eb;
          text-decoration: none;
          font-weight: 800;
          white-space: nowrap;
        }

        .provider-crm-lead-status {
          display: inline-flex;
          padding: 6px 9px;
          border-radius: 999px;
          background: #f1f5f9;
          color: #475569;
          font-size: 10px;
          font-weight: 900;
          white-space: nowrap;
        }

        .provider-crm-lead-status.status-won {
          color: #047857;
          background: #ecfdf5;
        }

        .provider-crm-lead-status.status-lost,
        .provider-crm-lead-status.status-no_offer {
          color: #b91c1c;
          background: #fef2f2;
        }

        .provider-crm-lead-status.status-offer_sent,
        .provider-crm-lead-status.status-appointment_set {
          color: #1d4ed8;
          background: #eff6ff;
        }

        .provider-crm-empty {
          padding: 35px 20px;
          text-align: center;
          border-radius: 16px;
          background: #f8fafc;
          border: 1px dashed #cbd5e1;
        }

        .provider-crm-empty > div {
          font-size: 28px;
          margin-bottom: 8px;
        }

        .provider-crm-empty strong {
          display: block;
        }

        .provider-crm-empty p {
          margin: 6px auto 0;
          max-width: 420px;
          color: #64748b;
          font-size: 13px;
          line-height: 1.6;
        }

        .provider-crm-payment-list,
        .provider-crm-timeline {
          display: grid;
        }

        .provider-crm-payment-row {
          display: grid;
          grid-template-columns: 44px minmax(0, 1fr) auto auto;
          gap: 13px;
          padding: 14px 0;
          border-bottom: 1px solid #f1f5f9;
        }

        .provider-crm-payment-row:last-child,
        .provider-crm-timeline-row:last-child {
          border-bottom: 0;
        }

        .provider-crm-payment-icon,
        .provider-crm-timeline-icon {
          width: 42px;
          height: 42px;
          border-radius: 13px;
          display: grid;
          place-items: center;
          background: #f1f5f9;
        }

        .provider-crm-payment-copy strong,
        .provider-crm-payment-copy span,
        .provider-crm-payment-value strong,
        .provider-crm-payment-value span {
          display: block;
        }

        .provider-crm-payment-copy span,
        .provider-crm-payment-value span,
        .provider-crm-payment-row time {
          color: #94a3b8;
          font-size: 11px;
        }

        .provider-crm-payment-value {
          text-align: right;
        }

        .provider-crm-payment-value span.paid {
          color: #059669;
          font-weight: 800;
        }

        .provider-crm-payment-row time {
          min-width: 120px;
          text-align: right;
        }

        .provider-crm-timeline-row {
          align-items: flex-start;
          gap: 14px;
          padding: 15px 0;
          border-bottom: 1px solid #f1f5f9;
        }

        .provider-crm-timeline-icon {
          flex: 0 0 42px;
        }

        .provider-crm-timeline-copy {
          flex: 1;
          min-width: 0;
        }

        .provider-crm-timeline-copy strong {
          display: block;
          margin-bottom: 3px;
        }

        .provider-crm-timeline-copy p {
          margin: 0;
          color: #64748b;
          font-size: 13px;
          line-height: 1.5;
        }

        .provider-crm-timeline-copy > div {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          margin-top: 7px;
        }

        .provider-crm-timeline-copy span,
        .provider-crm-timeline-row time {
          color: #94a3b8;
          font-size: 10px;
        }

        .provider-crm-timeline-row time {
          text-align: right;
          white-space: nowrap;
        }

        .provider-crm-quick-actions {
          display: grid;
          gap: 9px;
        }

        .provider-crm-quick-action {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 13px;
          border-radius: 14px;
          color: #111827;
          text-decoration: none;
          background: #f8fafc;
          border: 1px solid #edf2f7;
          transition: 0.2s ease;
        }

        .provider-crm-quick-action:hover {
          transform: translateX(3px);
          border-color: #cbd5e1;
          background: white;
        }

        .provider-crm-quick-action i {
          width: 38px;
          height: 38px;
          flex: 0 0 38px;
          display: grid;
          place-items: center;
          border-radius: 12px;
          background: white;
          font-style: normal;
          box-shadow: 0 5px 15px rgba(15, 23, 42, 0.06);
        }

        .provider-crm-quick-action span {
          min-width: 0;
        }

        .provider-crm-quick-action strong,
        .provider-crm-quick-action small {
          display: block;
        }

        .provider-crm-quick-action strong {
          font-size: 13px;
        }

        .provider-crm-quick-action small {
          margin-top: 2px;
          color: #94a3b8;
          font-size: 10px;
        }

        .provider-crm-tag-section + .provider-crm-tag-section {
          margin-top: 18px;
        }

        .provider-crm-tags {
          display: flex;
          gap: 7px;
          flex-wrap: wrap;
        }

        .provider-crm-tags strong {
          padding: 7px 9px;
          border-radius: 9px;
          color: #334155;
          background: #f1f5f9;
          font-size: 10px;
        }

        .provider-crm-tags small {
          color: #94a3b8;
        }

        .provider-crm-score {
          align-items: center;
          gap: 15px;
          padding: 15px;
          border-radius: 16px;
          background: #f8fafc;
          border: 1px solid #edf2f7;
        }

        .provider-crm-score-circle {
          width: 72px;
          height: 72px;
          flex: 0 0 72px;
          border-radius: 50%;
          display: grid;
          place-content: center;
          text-align: center;
          color: white;
          background: linear-gradient(135deg, #111827, #334155);
        }

        .provider-crm-score-circle strong {
          display: block;
          font-size: 24px;
          line-height: 1;
        }

        .provider-crm-score-circle span {
          font-size: 9px;
          opacity: 0.7;
        }

        .provider-crm-score > div:last-child > strong {
          display: block;
          margin-bottom: 4px;
          font-size: 13px;
        }

        .provider-crm-score p {
          margin: 0;
          color: #64748b;
          font-size: 11px;
          line-height: 1.5;
        }

        .provider-crm-progress-list {
          display: grid;
          gap: 14px;
          margin-top: 18px;
        }

        .provider-crm-progress-list > div {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 7px 10px;
        }

        .provider-crm-progress-list span,
        .provider-crm-progress-list strong {
          font-size: 11px;
        }

        .provider-crm-progress-list > div > i {
          grid-column: 1 / -1;
          height: 7px;
          overflow: hidden;
          border-radius: 999px;
          background: #e2e8f0;
        }

        .provider-crm-progress-list > div > i > b {
          display: block;
          height: 100%;
          border-radius: inherit;
          background: #111827;
        }

        .provider-crm-note-placeholder {
          text-align: center;
          padding: 15px 5px 5px;
        }

        .provider-crm-note-placeholder > div {
          font-size: 28px;
        }

        .provider-crm-note-placeholder strong {
          display: block;
          margin-top: 7px;
        }

        .provider-crm-note-placeholder p {
          margin: 6px 0 14px;
          color: #64748b;
          font-size: 11px;
          line-height: 1.6;
        }

        .provider-crm-note-placeholder button {
          width: 100%;
          min-height: 42px;
          border: 0;
          border-radius: 12px;
          color: #94a3b8;
          background: #f1f5f9;
          font-weight: 800;
          cursor: not-allowed;
        }

        @media (max-width: 1180px) {
          .provider-crm-metrics {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .provider-crm-grid {
            grid-template-columns: 1fr;
          }

          .provider-crm-sidebar {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 850px) {
          .provider-crm-topbar,
          .provider-crm-profile {
            align-items: stretch;
            flex-direction: column;
          }

          .provider-crm-top-actions {
            display: grid;
            grid-template-columns: 1fr 1fr;
          }

          .provider-crm-profile-side {
            min-width: 0;
          }

          .provider-crm-details-grid {
            grid-template-columns: 1fr;
          }

          .provider-crm-sidebar {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 600px) {
          .provider-crm-page {
            padding: 20px 12px 60px;
          }

          .provider-crm-profile,
          .provider-crm-panel {
            padding: 18px;
            border-radius: 17px;
          }

          .provider-crm-profile-main {
            align-items: flex-start;
          }

          .provider-crm-avatar {
            width: 64px;
            height: 64px;
            flex-basis: 64px;
            border-radius: 18px;
            font-size: 20px;
          }

          .provider-crm-title-row h1 {
            font-size: 25px;
          }

          .provider-crm-contact-row {
            align-items: flex-start;
            flex-direction: column;
            gap: 8px;
          }

          .provider-crm-profile-side {
            grid-template-columns: 1fr;
          }

          .provider-crm-profile-side > div:last-child {
            grid-column: auto;
          }

          .provider-crm-metrics {
            grid-template-columns: 1fr;
          }

          .provider-crm-top-actions {
            grid-template-columns: 1fr;
          }

          .provider-crm-payment-row {
            grid-template-columns: 42px minmax(0, 1fr) auto;
          }

          .provider-crm-payment-row time {
            grid-column: 2 / -1;
            min-width: 0;
            text-align: left;
          }

          .provider-crm-timeline-row {
            display: grid;
            grid-template-columns: 42px minmax(0, 1fr);
          }

          .provider-crm-timeline-row time {
            grid-column: 2;
            text-align: left;
          }
        }
      `}</style>
    </main>
  );
}