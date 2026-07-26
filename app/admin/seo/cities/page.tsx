import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  deleteSeoCity,
  toggleSeoCity,
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

export default async function SeoCitiesPage() {
  const cities = await prisma.seoCity.findMany({
    orderBy: [
      { sortOrder: "asc" },
      { name: "asc" },
    ],
    include: {
      _count: {
        select: {
          landingPages: true,
        },
      },
    },
  });

  const activeCount = cities.filter(
    (city) => city.status === "ACTIVE"
  ).length;

  const indexableCount = cities.filter(
    (city) => city.indexable
  ).length;

  return (
    <main className="cities-page">
      <div className="cities-shell">
        <header className="cities-header">
          <div>
            <Link href="/admin/seo" className="cities-back">
              ← Zurück zum SEO Center
            </Link>

            <span className="cities-kicker">SEO Verwaltung</span>
            <h1>Städte</h1>

            <p>
              Städte, Kantone, regionale Inhalte und Google-Metadaten
              zentral verwalten.
            </p>
          </div>

          <Link
            href="/admin/seo/cities/new"
            className="cities-new-button"
          >
            + Neue Stadt
          </Link>
        </header>

        <section className="cities-stats">
          <article>
            <span>Städte gesamt</span>
            <strong>{cities.length}</strong>
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
            <strong>
              {cities.reduce(
                (sum, city) => sum + city._count.landingPages,
                0
              )}
            </strong>
          </article>
        </section>

        <section className="cities-panel">
          <div className="cities-panel-head">
            <div>
              <span>Übersicht</span>
              <h2>Alle SEO-Städte</h2>
            </div>

            <small>{cities.length} Einträge</small>
          </div>

          {cities.length === 0 ? (
            <div className="cities-empty">
              <div>🏙</div>
              <h3>Noch keine Städte vorhanden</h3>
              <p>
                Erstelle die erste Stadt und bereite damit regionale
                Landingpages vor.
              </p>

              <Link href="/admin/seo/cities/new">
                Erste Stadt erstellen
              </Link>
            </div>
          ) : (
            <div className="cities-table-wrap">
              <table className="cities-table">
                <thead>
                  <tr>
                    <th>Stadt</th>
                    <th>Kanton</th>
                    <th>Status</th>
                    <th>Google</th>
                    <th>Landingpages</th>
                    <th>Aktionen</th>
                  </tr>
                </thead>

                <tbody>
                  {cities.map((city) => (
                    <tr key={city.id}>
                      <td>
                        <strong>{city.name}</strong>
                        <span>/{city.slug}</span>
                      </td>

                      <td>
                        <strong>{city.canton}</strong>
                        <span>{city.region || "Keine Region"}</span>
                      </td>

                      <td>
                        <span
                          className={`cities-status status-${city.status.toLowerCase()}`}
                        >
                          {statusLabel(city.status)}
                        </span>
                      </td>

                      <td>
                        <span
                          className={
                            city.indexable
                              ? "cities-index index-active"
                              : "cities-index index-disabled"
                          }
                        >
                          {city.indexable
                            ? "Indexierbar"
                            : "Noindex"}
                        </span>
                      </td>

                      <td>
                        <strong>{city._count.landingPages}</strong>
                      </td>

                      <td>
                        <div className="cities-actions">
                          <Link
                            href={`/admin/seo/cities/${city.id}/edit`}
                          >
                            Bearbeiten
                          </Link>

                          <form action={toggleSeoCity.bind(null, city.id)}>
                            <button type="submit">
                              {city.status === "ACTIVE"
                                ? "Deaktivieren"
                                : "Aktivieren"}
                            </button>
                          </form>

                          <form action={deleteSeoCity.bind(null, city.id)}>
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

        .cities-page {
          min-height: 100vh;
          background:
            radial-gradient(circle at top right, rgba(37, 99, 235, 0.12), transparent 28%),
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

        .cities-shell {
          width: min(1450px, calc(100% - 32px));
          margin: 0 auto;
          padding: 36px 0 70px;
        }

        .cities-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 24px;
          margin-bottom: 22px;
          padding: 28px;
          border: 1px solid rgba(148, 163, 184, 0.14);
          border-radius: 28px;
          background: linear-gradient(
            145deg,
            rgba(15, 23, 42, 0.94),
            rgba(6, 9, 20, 0.97)
          );
        }

        .cities-back {
          display: inline-flex;
          margin-bottom: 20px;
          color: #94a3b8;
          font-size: 13px;
          font-weight: 800;
          text-decoration: none;
        }

        .cities-kicker {
          display: block;
          margin-bottom: 10px;
          color: #60a5fa;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .cities-header h1 {
          margin: 0;
          font-size: clamp(40px, 6vw, 66px);
          line-height: 1;
          letter-spacing: -0.04em;
        }

        .cities-header p {
          max-width: 750px;
          margin: 16px 0 0;
          color: #94a3b8;
          line-height: 1.7;
        }

        .cities-new-button {
          display: inline-flex;
          min-height: 50px;
          align-items: center;
          justify-content: center;
          padding: 0 20px;
          border-radius: 14px;
          background: linear-gradient(135deg, #2563eb, #7c3aed);
          color: #ffffff;
          font-size: 13px;
          font-weight: 900;
          text-decoration: none;
        }

        .cities-stats {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 15px;
          margin-bottom: 22px;
        }

        .cities-stats article {
          padding: 22px;
          border: 1px solid rgba(148, 163, 184, 0.13);
          border-radius: 22px;
          background: linear-gradient(
            145deg,
            rgba(255, 255, 255, 0.04),
            rgba(8, 12, 25, 0.96)
          );
        }

        .cities-stats span {
          display: block;
          color: #93c5fd;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.09em;
          text-transform: uppercase;
        }

        .cities-stats strong {
          display: block;
          margin-top: 12px;
          font-size: 31px;
        }

        .cities-panel {
          padding: 25px;
          border: 1px solid rgba(148, 163, 184, 0.14);
          border-radius: 26px;
          background: linear-gradient(
            145deg,
            rgba(255, 255, 255, 0.035),
            rgba(8, 12, 25, 0.97)
          );
        }

        .cities-panel-head {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 20px;
        }

        .cities-panel-head span {
          display: block;
          margin-bottom: 7px;
          color: #60a5fa;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .cities-panel-head h2 {
          margin: 0;
          font-size: 25px;
        }

        .cities-panel-head small {
          color: #64748b;
          font-weight: 800;
        }

        .cities-empty {
          padding: 70px 20px;
          text-align: center;
        }

        .cities-empty > div {
          font-size: 44px;
        }

        .cities-empty h3 {
          margin: 18px 0 0;
          font-size: 24px;
        }

        .cities-empty p {
          max-width: 520px;
          margin: 10px auto 0;
          color: #8491a6;
          line-height: 1.65;
        }

        .cities-empty a {
          display: inline-flex;
          margin-top: 24px;
          padding: 14px 18px;
          border-radius: 13px;
          background: #2563eb;
          color: #ffffff;
          font-size: 13px;
          font-weight: 900;
          text-decoration: none;
        }

        .cities-table-wrap {
          overflow-x: auto;
        }

        .cities-table {
          width: 100%;
          border-collapse: collapse;
          min-width: 900px;
        }

        .cities-table th {
          padding: 14px;
          border-bottom: 1px solid rgba(148, 163, 184, 0.13);
          color: #64748b;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-align: left;
          text-transform: uppercase;
        }

        .cities-table td {
          padding: 17px 14px;
          border-bottom: 1px solid rgba(148, 163, 184, 0.09);
          vertical-align: middle;
        }

        .cities-table td > strong {
          display: block;
          font-size: 14px;
        }

        .cities-table td > span:not(.cities-status):not(.cities-index) {
          display: block;
          margin-top: 5px;
          color: #64748b;
          font-size: 11px;
        }

        .cities-status,
        .cities-index {
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

        .cities-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
        }

        .cities-actions a,
        .cities-actions button {
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

        .cities-actions button.danger {
          border-color: rgba(248, 113, 113, 0.2);
          color: #fca5a5;
        }

        @media (max-width: 850px) {
          .cities-header {
            align-items: flex-start;
            flex-direction: column;
          }

          .cities-stats {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 560px) {
          .cities-shell {
            width: calc(100% - 20px);
            padding-top: 14px;
          }

          .cities-header,
          .cities-panel {
            padding: 20px;
            border-radius: 22px;
          }

          .cities-stats {
            grid-template-columns: 1fr;
          }

          .cities-new-button {
            width: 100%;
          }
        }
      `}</style>
    </main>
  );
}
