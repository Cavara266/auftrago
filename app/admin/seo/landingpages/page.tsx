import Link from "next/link";

import { prisma } from "@/lib/prisma";

import {
  deleteLandingPage,
  toggleLandingPage,
} from "./actions";

import GenerateLandingPagesButton from "./generate-button";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

function formatDate(date: Date | null) {
  if (!date) return "Noch nicht veröffentlicht";

  return new Intl.DateTimeFormat("de-CH", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

export default async function SeoLandingPagesPage() {
  const [pages, cityCount, serviceCount] = await Promise.all([
    prisma.seoLandingPage.findMany({
      include: {
        city: {
          select: {
            name: true,
            slug: true,
            canton: true,
          },
        },
        service: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
      orderBy: [
        {
          updatedAt: "desc",
        },
      ],
    }),

    prisma.seoCity.count({
      where: {
        status: "ACTIVE",
        indexable: true,
      },
    }),

    prisma.seoServicePage.count({
      where: {
        status: "ACTIVE",
        indexable: true,
      },
    }),
  ]);

  const activeCount = pages.filter(
    (page) => page.status === "ACTIVE"
  ).length;

  const indexableCount = pages.filter(
    (page) => page.indexable
  ).length;

  const possibleCombinations = cityCount * serviceCount;

  return (
    <main className="landing-page-admin">
      <div className="landing-shell">
        <header className="landing-header">
          <div>
            <Link href="/admin/seo" className="landing-back">
              ← Zurück zum SEO Center
            </Link>

            <span className="landing-kicker">
              Programmatic SEO
            </span>

            <h1>Landingpages</h1>

            <p>
              Erzeuge aus aktiven Städten und Dienstleistungen automatisch
              regionale SEO-Landingpages.
            </p>
          </div>

          <GenerateLandingPagesButton />
        </header>

        <section className="landing-stats">
          <article>
            <span>Landingpages</span>
            <strong>{pages.length}</strong>
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
            <span>Mögliche Kombinationen</span>
            <strong>{possibleCombinations}</strong>
          </article>
        </section>

        <section className="landing-info">
          <div>
            <strong>{cityCount}</strong>
            <span>aktive Städte</span>
          </div>

          <b>×</b>

          <div>
            <strong>{serviceCount}</strong>
            <span>aktive Dienstleistungen</span>
          </div>

          <b>=</b>

          <div>
            <strong>{possibleCombinations}</strong>
            <span>mögliche Landingpages</span>
          </div>
        </section>

        <section className="landing-panel">
          <div className="landing-panel-head">
            <div>
              <span>Übersicht</span>
              <h2>Generierte SEO-Seiten</h2>
            </div>

            <small>{pages.length} Einträge</small>
          </div>

          {pages.length === 0 ? (
            <div className="landing-empty">
              <div>🚀</div>

              <h3>Noch keine Landingpages vorhanden</h3>

              <p>
                Aktiviere mindestens eine Stadt und eine Dienstleistung.
                Danach kannst du alle Kombinationen automatisch erzeugen.
              </p>

              <div className="landing-empty-links">
                <Link href="/admin/seo/cities">
                  Städte verwalten
                </Link>

                <Link href="/admin/seo/services">
                  Dienstleistungen verwalten
                </Link>
              </div>
            </div>
          ) : (
            <div className="landing-table-wrap">
              <table className="landing-table">
                <thead>
                  <tr>
                    <th>Landingpage</th>
                    <th>Stadt</th>
                    <th>Dienstleistung</th>
                    <th>Status</th>
                    <th>Google</th>
                    <th>Veröffentlicht</th>
                    <th>Aktionen</th>
                  </tr>
                </thead>

                <tbody>
                  {pages.map((page) => {
                    const publicUrl =
                      `/dienstleistung/${page.service.slug}/${page.city.slug}`;

                    return (
                      <tr key={page.id}>
                        <td>
                          <strong>
                            {page.headline ||
                              `${page.service.name} in ${page.city.name}`}
                          </strong>

                          <span>{publicUrl}</span>
                        </td>

                        <td>
                          <strong>{page.city.name}</strong>
                          <span>{page.city.canton}</span>
                        </td>

                        <td>
                          <strong>{page.service.name}</strong>
                          <span>/{page.service.slug}</span>
                        </td>

                        <td>
                          <span
                            className={`landing-status status-${page.status.toLowerCase()}`}
                          >
                            {page.status === "ACTIVE"
                              ? "Aktiv"
                              : page.status === "INACTIVE"
                                ? "Inaktiv"
                                : page.status === "ARCHIVED"
                                  ? "Archiviert"
                                  : "Entwurf"}
                          </span>
                        </td>

                        <td>
                          <span
                            className={
                              page.indexable
                                ? "landing-index index-active"
                                : "landing-index index-disabled"
                            }
                          >
                            {page.indexable
                              ? "Indexierbar"
                              : "Noindex"}
                          </span>
                        </td>

                        <td>
                          <strong>
                            {formatDate(page.publishedAt)}
                          </strong>
                        </td>

                        <td>
                          <div className="landing-actions">
                            <Link href={publicUrl} target="_blank">
                              Öffnen
                            </Link>

                            <form
                              action={toggleLandingPage.bind(
                                null,
                                page.id
                              )}
                            >
                              <button type="submit">
                                {page.status === "ACTIVE"
                                  ? "Deaktivieren"
                                  : "Aktivieren"}
                              </button>
                            </form>

                            <form
                              action={deleteLandingPage.bind(
                                null,
                                page.id
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
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      <style suppressHydrationWarning>{`
        :global(body) {
          margin: 0;
          background: #050711;
        }

        .landing-page-admin {
          min-height: 100vh;
          background:
            radial-gradient(
              circle at top right,
              rgba(37, 99, 235, 0.13),
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

        .landing-shell {
          width: min(1500px, calc(100% - 32px));
          margin: 0 auto;
          padding: 36px 0 70px;
        }

        .landing-header {
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

        .landing-back {
          display: inline-flex;
          margin-bottom: 20px;
          color: #94a3b8;
          font-size: 13px;
          font-weight: 800;
          text-decoration: none;
        }

        .landing-kicker {
          display: block;
          margin-bottom: 10px;
          color: #60a5fa;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .landing-header h1 {
          margin: 0;
          font-size: clamp(40px, 6vw, 66px);
          line-height: 1;
          letter-spacing: -0.04em;
        }

        .landing-header p {
          max-width: 760px;
          margin: 16px 0 0;
          color: #94a3b8;
          line-height: 1.7;
        }

        .landing-stats {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 15px;
          margin-bottom: 18px;
        }

        .landing-stats article {
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

        .landing-stats span {
          display: block;
          color: #93c5fd;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.09em;
          text-transform: uppercase;
        }

        .landing-stats strong {
          display: block;
          margin-top: 12px;
          font-size: 31px;
        }

        .landing-info {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 30px;
          margin-bottom: 22px;
          padding: 22px;
          border: 1px solid rgba(56, 189, 248, 0.18);
          border-radius: 22px;
          background: rgba(8, 47, 73, 0.3);
        }

        .landing-info div {
          text-align: center;
        }

        .landing-info strong {
          display: block;
          font-size: 25px;
        }

        .landing-info span {
          display: block;
          margin-top: 5px;
          color: #94a3b8;
          font-size: 11px;
        }

        .landing-info b {
          color: #60a5fa;
          font-size: 22px;
        }

        .landing-panel {
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

        .landing-panel-head {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 20px;
        }

        .landing-panel-head span {
          display: block;
          margin-bottom: 7px;
          color: #60a5fa;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .landing-panel-head h2 {
          margin: 0;
          font-size: 25px;
        }

        .landing-panel-head small {
          color: #64748b;
          font-weight: 800;
        }

        .landing-empty {
          padding: 70px 20px;
          text-align: center;
        }

        .landing-empty > div:first-child {
          font-size: 44px;
        }

        .landing-empty h3 {
          margin: 18px 0 0;
          font-size: 24px;
        }

        .landing-empty p {
          max-width: 570px;
          margin: 10px auto 0;
          color: #8491a6;
          line-height: 1.65;
        }

        .landing-empty-links {
          display: flex;
          justify-content: center;
          gap: 10px;
          margin-top: 24px;
        }

        .landing-empty-links a {
          padding: 13px 16px;
          border: 1px solid rgba(148, 163, 184, 0.18);
          border-radius: 12px;
          color: #ffffff;
          font-size: 12px;
          font-weight: 900;
          text-decoration: none;
        }

        .landing-table-wrap {
          overflow-x: auto;
        }

        .landing-table {
          width: 100%;
          min-width: 1150px;
          border-collapse: collapse;
        }

        .landing-table th {
          padding: 14px;
          border-bottom: 1px solid rgba(148, 163, 184, 0.13);
          color: #64748b;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-align: left;
          text-transform: uppercase;
        }

        .landing-table td {
          padding: 17px 14px;
          border-bottom: 1px solid rgba(148, 163, 184, 0.09);
          vertical-align: middle;
        }

        .landing-table td > strong {
          display: block;
          font-size: 13px;
        }

        .landing-table td > span:not(.landing-status):not(.landing-index) {
          display: block;
          margin-top: 5px;
          color: #64748b;
          font-size: 10px;
        }

        .landing-status,
        .landing-index {
          display: inline-flex;
          padding: 6px 9px;
          border-radius: 999px;
          font-size: 9px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .status-active,
        .index-active {
          background: rgba(34, 197, 94, 0.1);
          color: #86efac;
        }

        .status-inactive,
        .status-archived,
        .status-draft,
        .index-disabled {
          background: rgba(100, 116, 139, 0.14);
          color: #cbd5e1;
        }

        .landing-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
        }

        .landing-actions a,
        .landing-actions button {
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

        .landing-actions button.danger {
          border-color: rgba(248, 113, 113, 0.2);
          color: #fca5a5;
        }

        @media (max-width: 850px) {
          .landing-header {
            align-items: flex-start;
            flex-direction: column;
          }

          .landing-stats {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 600px) {
          .landing-shell {
            width: calc(100% - 20px);
            padding-top: 14px;
          }

          .landing-header,
          .landing-panel {
            padding: 20px;
            border-radius: 22px;
          }

          .landing-stats {
            grid-template-columns: 1fr;
          }

          .landing-info {
            flex-direction: column;
            gap: 14px;
          }

          .landing-info b {
            transform: rotate(90deg);
          }

          .landing-empty-links {
            flex-direction: column;
          }
        }
      `}</style>
    </main>
  );
}
