import Link from "next/link";

import { prisma } from "@/lib/prisma";

import {
  deleteSeoService,
  toggleSeoService,
} from "./actions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

function statusLabel(status: string) {
  if (status === "ACTIVE") return "Aktiv";
  if (status === "INACTIVE") return "Inaktiv";
  if (status === "ARCHIVED") return "Archiviert";

  return "Entwurf";
}

function formatMoney(value: number | null) {
  if (value === null) {
    return "–";
  }

  return new Intl.NumberFormat("de-CH", {
    style: "currency",
    currency: "CHF",
  }).format(value / 100);
}

export default async function SeoServicesPage() {
  const services = await prisma.seoServicePage.findMany({
    orderBy: [
      {
        sortOrder: "asc",
      },
      {
        name: "asc",
      },
    ],
    include: {
      _count: {
        select: {
          landingPages: true,
          faqs: true,
        },
      },
    },
  });

  const activeCount = services.filter(
    (service) => service.status === "ACTIVE"
  ).length;

  const indexableCount = services.filter(
    (service) => service.indexable
  ).length;

  const landingPageCount = services.reduce(
    (sum, service) => sum + service._count.landingPages,
    0
  );

  return (
    <main className="services-page">
      <div className="services-shell">
        <header className="services-header">
          <div>
            <Link href="/admin/seo" className="services-back">
              ← Zurück zum SEO Center
            </Link>

            <span className="services-kicker">
              SEO Verwaltung
            </span>

            <h1>Dienstleistungen</h1>

            <p>
              Dienstleistungen, Inhalte, Preise und Google-Metadaten
              zentral verwalten.
            </p>
          </div>

          <Link
            href="/admin/seo/services/new"
            className="services-new-button"
          >
            + Neue Dienstleistung
          </Link>
        </header>

        <section className="services-stats">
          <article>
            <span>Dienstleistungen</span>
            <strong>{services.length}</strong>
          </article>

          <article>
            <span>Aktiv</span>
            <strong>{activeCount}</strong>
          </article>

          <article>
            <span>Indexierbar</span>
            <strong>{indexableCount}</strong>
          </article>

          <article>
            <span>Landingpages</span>
            <strong>{landingPageCount}</strong>
          </article>
        </section>

        <section className="services-panel">
          <div className="services-panel-head">
            <div>
              <span>Übersicht</span>
              <h2>Alle SEO-Dienstleistungen</h2>
            </div>

            <small>{services.length} Einträge</small>
          </div>

          {services.length === 0 ? (
            <div className="services-empty">
              <div>🛠</div>
              <h3>Noch keine Dienstleistungen vorhanden</h3>

              <p>
                Erstelle die erste Dienstleistung als Grundlage für
                automatisch generierte Landingpages.
              </p>

              <Link href="/admin/seo/services/new">
                Erste Dienstleistung erstellen
              </Link>
            </div>
          ) : (
            <div className="services-table-wrap">
              <table className="services-table">
                <thead>
                  <tr>
                    <th>Dienstleistung</th>
                    <th>Preisbereich</th>
                    <th>Status</th>
                    <th>Google</th>
                    <th>Landingpages</th>
                    <th>FAQ</th>
                    <th>Aktionen</th>
                  </tr>
                </thead>

                <tbody>
                  {services.map((service) => (
                    <tr key={service.id}>
                      <td>
                        <strong>{service.name}</strong>
                        <span>/{service.slug}</span>
                      </td>

                      <td>
                        <strong>
                          {formatMoney(service.priceMinCents)}
                          {" – "}
                          {formatMoney(service.priceMaxCents)}
                        </strong>

                        <span>
                          {service.priceUnit || "Keine Einheit"}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`services-status status-${service.status.toLowerCase()}`}
                        >
                          {statusLabel(service.status)}
                        </span>
                      </td>

                      <td>
                        <span
                          className={
                            service.indexable
                              ? "services-index index-active"
                              : "services-index index-disabled"
                          }
                        >
                          {service.indexable
                            ? "Indexierbar"
                            : "Noindex"}
                        </span>
                      </td>

                      <td>
                        <strong>
                          {service._count.landingPages}
                        </strong>
                      </td>

                      <td>
                        <strong>{service._count.faqs}</strong>
                      </td>

                      <td>
                        <div className="services-actions">
                          <Link
                            href={`/admin/seo/services/${service.id}/edit`}
                          >
                            Bearbeiten
                          </Link>

                          <form
                            action={toggleSeoService.bind(
                              null,
                              service.id
                            )}
                          >
                            <button type="submit">
                              {service.status === "ACTIVE"
                                ? "Deaktivieren"
                                : "Aktivieren"}
                            </button>
                          </form>

                          <form
                            action={deleteSeoService.bind(
                              null,
                              service.id
                            )}
                          >
                            <button
                              type="submit"
                              className="danger"
                            >
                              Löschen
                            </button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      <style>{`
        :global(body) {
          margin: 0;
          background: #050711;
        }

        .services-page {
          min-height: 100vh;
          background:
            radial-gradient(
              circle at top right,
              rgba(124, 58, 237, 0.13),
              transparent 28%
            ),
            #050711;
          color: #ffffff;
          font-family:
            Inter,
            ui-sans-serif,
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
        }

        .services-shell {
          width: min(1450px, calc(100% - 32px));
          margin: 0 auto;
          padding: 36px 0 70px;
        }

        .services-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 24px;
          margin-bottom: 22px;
          padding: 28px;
          border: 1px solid rgba(148, 163, 184, 0.14);
          border-radius: 28px;
          background:
            linear-gradient(
              145deg,
              rgba(15, 23, 42, 0.94),
              rgba(6, 9, 20, 0.97)
            );
        }

        .services-back {
          display: inline-flex;
          margin-bottom: 20px;
          color: #94a3b8;
          font-size: 13px;
          font-weight: 800;
          text-decoration: none;
        }

        .services-kicker {
          display: block;
          margin-bottom: 10px;
          color: #a78bfa;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .services-header h1 {
          margin: 0;
          font-size: clamp(40px, 6vw, 66px);
          line-height: 1;
          letter-spacing: -0.04em;
        }

        .services-header p {
          max-width: 750px;
          margin: 16px 0 0;
          color: #94a3b8;
          line-height: 1.7;
        }

        .services-new-button {
          display: inline-flex;
          min-height: 50px;
          align-items: center;
          justify-content: center;
          padding: 0 20px;
          border-radius: 14px;
          background:
            linear-gradient(135deg, #2563eb, #7c3aed);
          color: #ffffff;
          font-size: 13px;
          font-weight: 900;
          text-decoration: none;
        }

        .services-stats {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 15px;
          margin-bottom: 22px;
        }

        .services-stats article {
          padding: 22px;
          border: 1px solid rgba(148, 163, 184, 0.13);
          border-radius: 22px;
          background:
            linear-gradient(
              145deg,
              rgba(255, 255, 255, 0.04),
              rgba(8, 12, 25, 0.96)
            );
        }

        .services-stats span {
          display: block;
          color: #c4b5fd;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.09em;
          text-transform: uppercase;
        }

        .services-stats strong {
          display: block;
          margin-top: 12px;
          font-size: 31px;
        }

        .services-panel {
          padding: 25px;
          border: 1px solid rgba(148, 163, 184, 0.14);
          border-radius: 26px;
          background:
            linear-gradient(
              145deg,
              rgba(255, 255, 255, 0.035),
              rgba(8, 12, 25, 0.97)
            );
        }

        .services-panel-head {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 20px;
        }

        .services-panel-head span {
          display: block;
          margin-bottom: 7px;
          color: #a78bfa;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .services-panel-head h2 {
          margin: 0;
          font-size: 25px;
        }

        .services-panel-head small {
          color: #64748b;
          font-weight: 800;
        }

        .services-empty {
          padding: 70px 20px;
          text-align: center;
        }

        .services-empty > div {
          font-size: 44px;
        }

        .services-empty h3 {
          margin: 18px 0 0;
          font-size: 24px;
        }

        .services-empty p {
          max-width: 540px;
          margin: 10px auto 0;
          color: #8491a6;
          line-height: 1.65;
        }

        .services-empty a {
          display: inline-flex;
          margin-top: 24px;
          padding: 14px 18px;
          border-radius: 13px;
          background: #7c3aed;
          color: #ffffff;
          font-size: 13px;
          font-weight: 900;
          text-decoration: none;
        }

        .services-table-wrap {
          overflow-x: auto;
        }

        .services-table {
          width: 100%;
          min-width: 1100px;
          border-collapse: collapse;
        }

        .services-table th {
          padding: 14px;
          border-bottom: 1px solid rgba(148, 163, 184, 0.13);
          color: #64748b;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-align: left;
          text-transform: uppercase;
        }

        .services-table td {
          padding: 17px 14px;
          border-bottom: 1px solid rgba(148, 163, 184, 0.09);
          vertical-align: middle;
        }

        .services-table td > strong {
          display: block;
          font-size: 14px;
        }

        .services-table td > span:not(.services-status):not(.services-index) {
          display: block;
          margin-top: 5px;
          color: #64748b;
          font-size: 11px;
        }

        .services-status,
        .services-index {
          display: inline-flex;
          padding: 6px 9px;
          border-radius: 999px;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .status-active,
        .index-active {
          background: rgba(34, 197, 94, 0.1);
          color: #86efac;
        }

        .status-draft {
          background: rgba(59, 130, 246, 0.1);
          color: #93c5fd;
        }

        .status-inactive,
        .status-archived,
        .index-disabled {
          background: rgba(100, 116, 139, 0.14);
          color: #cbd5e1;
        }

        .services-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
        }

        .services-actions a,
        .services-actions button {
          display: inline-flex;
          min-height: 34px;
          align-items: center;
          padding: 0 10px;
          border: 1px solid rgba(148, 163, 184, 0.16);
          border-radius: 9px;
          cursor: pointer;
          background: rgba(255, 255, 255, 0.035);
          color: #cbd5e1;
          font-size: 10px;
          font-weight: 900;
          text-decoration: none;
        }

        .services-actions button.danger {
          border-color: rgba(248, 113, 113, 0.2);
          color: #fca5a5;
        }

        @media (max-width: 850px) {
          .services-header {
            align-items: flex-start;
            flex-direction: column;
          }

          .services-stats {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 560px) {
          .services-shell {
            width: calc(100% - 20px);
            padding-top: 14px;
          }

          .services-header,
          .services-panel {
            padding: 20px;
            border-radius: 22px;
          }

          .services-stats {
            grid-template-columns: 1fr;
          }

          .services-new-button {
            width: 100%;
          }
        }
      `}</style>
    </main>
  );
}
