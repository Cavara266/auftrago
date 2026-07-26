import Link from "next/link";

import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

function getWordCount(values: Array<string | null>) {
  return values
    .filter(Boolean)
    .join(" ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("de-CH", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function percentage(value: number, total: number) {
  if (total === 0) {
    return 0;
  }

  return Math.round((value / total) * 100);
}

export default async function SeoAnalyticsPage() {
  const [cities, services, landingPages] =
    await Promise.all([
      prisma.seoCity.findMany({
        select: {
          id: true,
          name: true,
          slug: true,
          status: true,
          indexable: true,
        },
        orderBy: {
          sortOrder: "asc",
        },
      }),

      prisma.seoServicePage.findMany({
        select: {
          id: true,
          name: true,
          slug: true,
          status: true,
          indexable: true,
        },
        orderBy: {
          sortOrder: "asc",
        },
      }),

      prisma.seoLandingPage.findMany({
        include: {
          city: {
            select: {
              id: true,
              name: true,
              slug: true,
              status: true,
              indexable: true,
              introduction: true,
              localContent: true,
            },
          },
          service: {
            select: {
              id: true,
              name: true,
              slug: true,
              status: true,
              indexable: true,
              description: true,
            },
          },
        },
        orderBy: {
          updatedAt: "desc",
        },
      }),
    ]);

  const activeCities = cities.filter(
    (city) =>
      city.status === "ACTIVE" && city.indexable
  );

  const activeServices = services.filter(
    (service) =>
      service.status === "ACTIVE" &&
      service.indexable
  );

  const totalPages = landingPages.length;

  const activePages = landingPages.filter(
    (page) => page.status === "ACTIVE"
  );

  const draftPages = landingPages.filter(
    (page) => page.status === "DRAFT"
  );

  const indexablePages = landingPages.filter(
    (page) =>
      page.status === "ACTIVE" &&
      page.indexable &&
      page.city.status === "ACTIVE" &&
      page.city.indexable &&
      page.service.status === "ACTIVE" &&
      page.service.indexable
  );

  const pagesMissingTitle = landingPages.filter(
    (page) => !page.seoTitle?.trim()
  );

  const pagesMissingDescription =
    landingPages.filter(
      (page) => !page.seoDescription?.trim()
    );

  const pagesMissingCanonical =
    landingPages.filter(
      (page) => !page.canonicalUrl?.trim()
    );

  const pagesMissingHeadline = landingPages.filter(
    (page) => !page.headline?.trim()
  );

  const pagesWithShortContent =
    landingPages.filter((page) => {
      const words = getWordCount([
        page.introduction,
        page.content,
        page.city.introduction,
        page.city.localContent,
        page.service.description,
      ]);

      return words < 120;
    });

  const wordCounts = landingPages.map((page) =>
    getWordCount([
      page.introduction,
      page.content,
      page.city.introduction,
      page.city.localContent,
      page.service.description,
    ])
  );

  const averageWordCount =
    wordCounts.length > 0
      ? Math.round(
          wordCounts.reduce(
            (sum, value) => sum + value,
            0
          ) / wordCounts.length
        )
      : 0;

  const possibleCombinations =
    activeCities.length * activeServices.length;

  const coverage = percentage(
    totalPages,
    possibleCombinations
  );

  const indexCoverage = percentage(
    indexablePages.length,
    totalPages
  );

  const cityDistribution = activeCities
    .map((city) => {
      const pages = landingPages.filter(
        (page) => page.cityId === city.id
      );

      const published = pages.filter(
        (page) => page.status === "ACTIVE"
      ).length;

      return {
        id: city.id,
        name: city.name,
        slug: city.slug,
        total: pages.length,
        published,
      };
    })
    .sort((a, b) => b.total - a.total);

  const serviceDistribution = activeServices
    .map((service) => {
      const pages = landingPages.filter(
        (page) => page.serviceId === service.id
      );

      const published = pages.filter(
        (page) => page.status === "ACTIVE"
      ).length;

      return {
        id: service.id,
        name: service.name,
        slug: service.slug,
        total: pages.length,
        published,
      };
    })
    .sort((a, b) => b.total - a.total);

  const issueCount =
    pagesMissingTitle.length +
    pagesMissingDescription.length +
    pagesMissingCanonical.length +
    pagesMissingHeadline.length +
    pagesWithShortContent.length;

  const recentPages = landingPages.slice(0, 12);

  return (
    <main className="analytics-page">
      <div className="analytics-shell">
        <header className="analytics-header">
          <div>
            <Link
              href="/admin/seo"
              className="analytics-back"
            >
              ← Zurück zum SEO Center
            </Link>

            <span className="analytics-kicker">
              SEO Datenbankanalyse
            </span>

            <h1>SEO Analytics</h1>

            <p>
              Übersicht über deine Städte,
              Dienstleistungen, Landingpages,
              Indexierung und offene SEO-Probleme.
            </p>
          </div>

          <div className="analytics-header-actions">
            <Link href="/admin/seo/generator">
              Generator
            </Link>

            <Link href="/admin/seo/health">
              SEO Health
            </Link>

            <Link href="/admin/seo/publish">
              Freigabe
            </Link>
          </div>
        </header>

        <section className="analytics-main-stats">
          <article>
            <span>Landingpages</span>
            <strong>{totalPages}</strong>
            <small>
              {activePages.length} veröffentlicht
            </small>
          </article>

          <article>
            <span>SEO-Abdeckung</span>
            <strong>{coverage}%</strong>
            <small>
              {totalPages} von {possibleCombinations} Kombinationen
            </small>
          </article>

          <article>
            <span>Indexierbar</span>
            <strong>{indexCoverage}%</strong>
            <small>
              {indexablePages.length} öffentliche Seiten
            </small>
          </article>

          <article>
            <span>Ø Inhaltslänge</span>
            <strong>{averageWordCount}</strong>
            <small>Wörter pro Landingpage</small>
          </article>

          <article>
            <span>Offene Probleme</span>
            <strong>{issueCount}</strong>
            <small>über alle SEO-Prüfungen</small>
          </article>
        </section>

        <section className="analytics-grid">
          <article className="analytics-panel">
            <div className="panel-heading">
              <div>
                <span>Seitenstatus</span>
                <h2>Veröffentlichung</h2>
              </div>

              <Link href="/admin/seo/publish">
                Verwalten
              </Link>
            </div>

            <div className="status-list">
              <div>
                <span className="status-dot active" />

                <div>
                  <strong>Veröffentlicht</strong>
                  <small>
                    Öffentlich verfügbare Landingpages
                  </small>
                </div>

                <b>{activePages.length}</b>
              </div>

              <div>
                <span className="status-dot draft" />

                <div>
                  <strong>Entwürfe</strong>
                  <small>
                    Noch nicht veröffentlichte Seiten
                  </small>
                </div>

                <b>{draftPages.length}</b>
              </div>

              <div>
                <span className="status-dot indexed" />

                <div>
                  <strong>Indexierbar</strong>
                  <small>
                    Aktiv und für Suchmaschinen freigegeben
                  </small>
                </div>

                <b>{indexablePages.length}</b>
              </div>
            </div>
          </article>

          <article className="analytics-panel">
            <div className="panel-heading">
              <div>
                <span>Infrastruktur</span>
                <h2>SEO-Datenbestand</h2>
              </div>

              <Link href="/admin/seo/generator">
                Erweitern
              </Link>
            </div>

            <div className="data-grid">
              <div>
                <small>Aktive Städte</small>
                <strong>{activeCities.length}</strong>
              </div>

              <div>
                <small>Aktive Leistungen</small>
                <strong>{activeServices.length}</strong>
              </div>

              <div>
                <small>Mögliche Seiten</small>
                <strong>{possibleCombinations}</strong>
              </div>

              <div>
                <small>Noch nicht erstellt</small>
                <strong>
                  {Math.max(
                    possibleCombinations - totalPages,
                    0
                  )}
                </strong>
              </div>
            </div>
          </article>
        </section>

        <section className="analytics-panel issues-panel">
          <div className="panel-heading">
            <div>
              <span>Qualitätskontrolle</span>
              <h2>Offene SEO-Probleme</h2>
            </div>

            <Link href="/admin/seo/health">
              Vollständige Prüfung
            </Link>
          </div>

          <div className="issue-grid">
            <div
              className={
                pagesMissingTitle.length > 0
                  ? "issue-card warning"
                  : "issue-card success"
              }
            >
              <span>
                {pagesMissingTitle.length > 0
                  ? "!"
                  : "✓"}
              </span>

              <div>
                <strong>SEO-Titel</strong>
                <small>
                  {pagesMissingTitle.length} Seiten ohne Titel
                </small>
              </div>
            </div>

            <div
              className={
                pagesMissingDescription.length > 0
                  ? "issue-card warning"
                  : "issue-card success"
              }
            >
              <span>
                {pagesMissingDescription.length > 0
                  ? "!"
                  : "✓"}
              </span>

              <div>
                <strong>Meta Description</strong>
                <small>
                  {pagesMissingDescription.length} Seiten ohne
                  Beschreibung
                </small>
              </div>
            </div>

            <div
              className={
                pagesMissingCanonical.length > 0
                  ? "issue-card warning"
                  : "issue-card success"
              }
            >
              <span>
                {pagesMissingCanonical.length > 0
                  ? "!"
                  : "✓"}
              </span>

              <div>
                <strong>Canonical</strong>
                <small>
                  {pagesMissingCanonical.length} Seiten ohne URL
                </small>
              </div>
            </div>

            <div
              className={
                pagesMissingHeadline.length > 0
                  ? "issue-card warning"
                  : "issue-card success"
              }
            >
              <span>
                {pagesMissingHeadline.length > 0
                  ? "!"
                  : "✓"}
              </span>

              <div>
                <strong>H1-Überschrift</strong>
                <small>
                  {pagesMissingHeadline.length} Seiten ohne H1
                </small>
              </div>
            </div>

            <div
              className={
                pagesWithShortContent.length > 0
                  ? "issue-card warning"
                  : "issue-card success"
              }
            >
              <span>
                {pagesWithShortContent.length > 0
                  ? "!"
                  : "✓"}
              </span>

              <div>
                <strong>Inhaltslänge</strong>
                <small>
                  {pagesWithShortContent.length} Seiten unter
                  120 Wörtern
                </small>
              </div>
            </div>
          </div>
        </section>

        <section className="analytics-columns">
          <article className="analytics-panel">
            <div className="panel-heading">
              <div>
                <span>Lokale Abdeckung</span>
                <h2>Landingpages nach Stadt</h2>
              </div>

              <Link href="/admin/seo/cities">
                Städte
              </Link>
            </div>

            {cityDistribution.length === 0 ? (
              <div className="empty-state">
                Keine aktiven Städte vorhanden.
              </div>
            ) : (
              <div className="ranking-list">
                {cityDistribution
                  .slice(0, 12)
                  .map((city) => {
                    const maximum = Math.max(
                      activeServices.length,
                      1
                    );

                    const width = Math.min(
                      percentage(city.total, maximum),
                      100
                    );

                    return (
                      <div
                        className="ranking-item"
                        key={city.id}
                      >
                        <div className="ranking-header">
                          <div>
                            <strong>{city.name}</strong>
                            <small>
                              {city.published} veröffentlicht
                            </small>
                          </div>

                          <b>{city.total}</b>
                        </div>

                        <div className="ranking-track">
                          <span
                            style={{
                              width: `${width}%`,
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </article>

          <article className="analytics-panel">
            <div className="panel-heading">
              <div>
                <span>Leistungsabdeckung</span>
                <h2>Landingpages nach Leistung</h2>
              </div>

              <Link href="/admin/seo/services">
                Leistungen
              </Link>
            </div>

            {serviceDistribution.length === 0 ? (
              <div className="empty-state">
                Keine aktiven Dienstleistungen vorhanden.
              </div>
            ) : (
              <div className="ranking-list">
                {serviceDistribution
                  .slice(0, 12)
                  .map((service) => {
                    const maximum = Math.max(
                      activeCities.length,
                      1
                    );

                    const width = Math.min(
                      percentage(service.total, maximum),
                      100
                    );

                    return (
                      <div
                        className="ranking-item"
                        key={service.id}
                      >
                        <div className="ranking-header">
                          <div>
                            <strong>{service.name}</strong>
                            <small>
                              {service.published} veröffentlicht
                            </small>
                          </div>

                          <b>{service.total}</b>
                        </div>

                        <div className="ranking-track">
                          <span
                            style={{
                              width: `${width}%`,
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </article>
        </section>

        <section className="analytics-panel">
          <div className="panel-heading">
            <div>
              <span>Letzte Änderungen</span>
              <h2>Aktuelle Landingpages</h2>
            </div>

            <Link href="/admin/seo/landingpages">
              Alle anzeigen
            </Link>
          </div>

          {recentPages.length === 0 ? (
            <div className="empty-state">
              Noch keine Landingpages vorhanden.
            </div>
          ) : (
            <div className="recent-table">
              <div className="recent-table-header">
                <span>Landingpage</span>
                <span>Status</span>
                <span>Indexierung</span>
                <span>Inhalt</span>
                <span>Aktualisiert</span>
                <span />
              </div>

              {recentPages.map((page) => {
                const publicUrl =
                  `/dienstleistung/${page.service.slug}/${page.city.slug}`;

                const words = getWordCount([
                  page.introduction,
                  page.content,
                  page.city.introduction,
                  page.city.localContent,
                  page.service.description,
                ]);

                return (
                  <div
                    className="recent-table-row"
                    key={page.id}
                  >
                    <div>
                      <strong>
                        {page.headline ||
                          `${page.service.name} in ${page.city.name}`}
                      </strong>

                      <small>
                        {page.service.name} · {page.city.name}
                      </small>
                    </div>

                    <span
                      className={
                        page.status === "ACTIVE"
                          ? "table-status active"
                          : "table-status draft"
                      }
                    >
                      {page.status === "ACTIVE"
                        ? "Aktiv"
                        : "Entwurf"}
                    </span>

                    <span>
                      {page.indexable ? "Ja" : "Nein"}
                    </span>

                    <span>{words} Wörter</span>

                    <span>
                      {formatDate(page.updatedAt)}
                    </span>

                    <Link
                      href={publicUrl}
                      target="_blank"
                    >
                      Öffnen
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>

      <style suppressHydrationWarning>{`
        :global(body) {
          margin: 0;
          background: #050711;
        }

        .analytics-page {
          min-height: 100vh;
          background:
            radial-gradient(
              circle at top right,
              rgba(37, 99, 235, 0.15),
              transparent 28%
            ),
            radial-gradient(
              circle at bottom left,
              rgba(124, 58, 237, 0.1),
              transparent 30%
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

        .analytics-shell {
          width: min(1500px, calc(100% - 32px));
          margin: 0 auto;
          padding: 36px 0 70px;
        }

        .analytics-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 26px;
          padding: 30px;
          border: 1px solid rgba(148, 163, 184, 0.14);
          border-radius: 28px;
          background:
            linear-gradient(
              145deg,
              rgba(15, 23, 42, 0.96),
              rgba(6, 9, 20, 0.98)
            );
        }

        .analytics-back {
          display: inline-flex;
          margin-bottom: 20px;
          color: #94a3b8;
          font-size: 13px;
          font-weight: 800;
          text-decoration: none;
        }

        .analytics-kicker {
          display: block;
          margin-bottom: 10px;
          color: #60a5fa;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .analytics-header h1 {
          margin: 0;
          font-size: clamp(40px, 6vw, 66px);
          line-height: 1;
          letter-spacing: -0.045em;
        }

        .analytics-header p {
          max-width: 760px;
          margin: 16px 0 0;
          color: #94a3b8;
          line-height: 1.7;
        }

        .analytics-header-actions {
          display: flex;
          flex-wrap: wrap;
          justify-content: flex-end;
          gap: 10px;
        }

        .analytics-header-actions a {
          display: inline-flex;
          min-height: 46px;
          align-items: center;
          justify-content: center;
          padding: 0 16px;
          border: 1px solid rgba(148, 163, 184, 0.16);
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.04);
          color: #ffffff;
          font-size: 10px;
          font-weight: 900;
          text-decoration: none;
        }

        .analytics-main-stats {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 13px;
          margin: 20px 0;
        }

        .analytics-main-stats article {
          padding: 22px;
          border: 1px solid rgba(148, 163, 184, 0.13);
          border-radius: 21px;
          background:
            linear-gradient(
              145deg,
              rgba(255, 255, 255, 0.04),
              rgba(8, 12, 25, 0.96)
            );
        }

        .analytics-main-stats span {
          display: block;
          color: #93c5fd;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.07em;
          text-transform: uppercase;
        }

        .analytics-main-stats strong {
          display: block;
          margin-top: 11px;
          font-size: 32px;
        }

        .analytics-main-stats small {
          display: block;
          margin-top: 7px;
          color: #64748b;
          font-size: 9px;
          line-height: 1.5;
        }

        .analytics-grid,
        .analytics-columns {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 18px;
          margin-top: 18px;
        }

        .analytics-panel {
          margin-top: 18px;
          padding: 24px;
          border: 1px solid rgba(148, 163, 184, 0.13);
          border-radius: 24px;
          background:
            linear-gradient(
              145deg,
              rgba(15, 23, 42, 0.94),
              rgba(6, 9, 20, 0.98)
            );
        }

        .analytics-grid .analytics-panel,
        .analytics-columns .analytics-panel {
          margin-top: 0;
        }

        .panel-heading {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 20px;
        }

        .panel-heading span {
          color: #60a5fa;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .panel-heading h2 {
          margin: 7px 0 0;
          font-size: 23px;
        }

        .panel-heading a {
          display: inline-flex;
          min-height: 37px;
          align-items: center;
          padding: 0 12px;
          border: 1px solid rgba(148, 163, 184, 0.14);
          border-radius: 10px;
          color: #cbd5e1;
          font-size: 9px;
          font-weight: 900;
          text-decoration: none;
        }

        .status-list {
          display: grid;
          gap: 10px;
        }

        .status-list > div {
          display: grid;
          grid-template-columns: 13px minmax(0, 1fr) auto;
          gap: 12px;
          align-items: center;
          padding: 15px;
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.025);
        }

        .status-dot {
          width: 10px;
          height: 10px;
          border-radius: 999px;
        }

        .status-dot.active {
          background: #22c55e;
        }

        .status-dot.draft {
          background: #f59e0b;
        }

        .status-dot.indexed {
          background: #3b82f6;
        }

        .status-list strong {
          display: block;
          font-size: 11px;
        }

        .status-list small {
          display: block;
          margin-top: 4px;
          color: #64748b;
          font-size: 9px;
        }

        .status-list b {
          font-size: 20px;
        }

        .data-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
        }

        .data-grid > div {
          padding: 18px;
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.025);
        }

        .data-grid small {
          color: #64748b;
          font-size: 9px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .data-grid strong {
          display: block;
          margin-top: 9px;
          font-size: 27px;
        }

        .issue-grid {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 11px;
        }

        .issue-card {
          display: flex;
          gap: 11px;
          align-items: flex-start;
          padding: 15px;
          border: 1px solid;
          border-radius: 15px;
        }

        .issue-card > span {
          display: grid;
          width: 29px;
          height: 29px;
          flex: 0 0 auto;
          place-items: center;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 900;
        }

        .issue-card.warning {
          border-color: rgba(245, 158, 11, 0.18);
          background: rgba(245, 158, 11, 0.05);
        }

        .issue-card.warning > span {
          background: rgba(245, 158, 11, 0.12);
          color: #fde68a;
        }

        .issue-card.success {
          border-color: rgba(34, 197, 94, 0.18);
          background: rgba(34, 197, 94, 0.05);
        }

        .issue-card.success > span {
          background: rgba(34, 197, 94, 0.12);
          color: #86efac;
        }

        .issue-card strong {
          display: block;
          font-size: 11px;
        }

        .issue-card small {
          display: block;
          margin-top: 5px;
          color: #8390a5;
          font-size: 9px;
          line-height: 1.5;
        }

        .ranking-list {
          display: grid;
          gap: 14px;
        }

        .ranking-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
        }

        .ranking-header strong {
          display: block;
          font-size: 11px;
        }

        .ranking-header small {
          display: block;
          margin-top: 3px;
          color: #64748b;
          font-size: 8px;
        }

        .ranking-header b {
          color: #bfdbfe;
          font-size: 14px;
        }

        .ranking-track {
          height: 7px;
          overflow: hidden;
          margin-top: 8px;
          border-radius: 999px;
          background: rgba(148, 163, 184, 0.09);
        }

        .ranking-track span {
          display: block;
          height: 100%;
          border-radius: inherit;
          background:
            linear-gradient(
              90deg,
              #2563eb,
              #7c3aed
            );
        }

        .recent-table {
          overflow-x: auto;
        }

        .recent-table-header,
        .recent-table-row {
          display: grid;
          grid-template-columns:
            minmax(240px, 2fr)
            100px
            90px
            100px
            165px
            70px;
          gap: 12px;
          align-items: center;
          min-width: 850px;
        }

        .recent-table-header {
          padding: 0 14px 11px;
          color: #64748b;
          font-size: 8px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .recent-table-row {
          padding: 14px;
          border-top: 1px solid rgba(148, 163, 184, 0.08);
          color: #94a3b8;
          font-size: 9px;
        }

        .recent-table-row strong {
          display: block;
          color: #ffffff;
          font-size: 11px;
        }

        .recent-table-row small {
          display: block;
          margin-top: 4px;
          color: #64748b;
          font-size: 8px;
        }

        .recent-table-row a {
          display: inline-flex;
          justify-content: center;
          padding: 8px;
          border: 1px solid rgba(148, 163, 184, 0.14);
          border-radius: 8px;
          color: #bfdbfe;
          font-size: 8px;
          font-weight: 900;
          text-decoration: none;
        }

        .table-status {
          display: inline-flex;
          width: fit-content;
          padding: 5px 8px;
          border-radius: 999px;
          font-size: 8px;
          font-weight: 900;
        }

        .table-status.active {
          background: rgba(34, 197, 94, 0.1);
          color: #86efac;
        }

        .table-status.draft {
          background: rgba(245, 158, 11, 0.1);
          color: #fde68a;
        }

        .empty-state {
          padding: 40px 20px;
          border: 1px dashed rgba(148, 163, 184, 0.16);
          border-radius: 15px;
          color: #64748b;
          text-align: center;
          font-size: 10px;
        }

        @media (max-width: 1150px) {
          .analytics-main-stats {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }

          .issue-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }

        @media (max-width: 850px) {
          .analytics-header {
            align-items: flex-start;
            flex-direction: column;
          }

          .analytics-header-actions {
            justify-content: flex-start;
          }

          .analytics-grid,
          .analytics-columns {
            grid-template-columns: 1fr;
          }

          .issue-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 600px) {
          .analytics-shell {
            width: calc(100% - 20px);
            padding-top: 14px;
          }

          .analytics-header,
          .analytics-panel {
            padding: 20px;
            border-radius: 21px;
          }

          .analytics-main-stats {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .analytics-header-actions {
            width: 100%;
          }

          .analytics-header-actions a {
            flex: 1;
          }

          .issue-grid,
          .data-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 420px) {
          .analytics-main-stats {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </main>
  );
}
