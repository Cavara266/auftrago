import Link from "next/link";

import { prisma } from "@/lib/prisma";

import RepairCanonicalButton from "./repair-button";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const BASE_URL = "https://www.auftrago.ch";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("de-CH", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function getPublicUrl(
  serviceSlug: string,
  citySlug: string
) {
  return `${BASE_URL}/dienstleistung/${serviceSlug}/${citySlug}`;
}

export default async function SeoSitemapCenterPage() {
  const [landingPages, cities, services] =
    await Promise.all([
      prisma.seoLandingPage.findMany({
        include: {
          city: {
            select: {
              name: true,
              slug: true,
              status: true,
              indexable: true,
            },
          },
          service: {
            select: {
              name: true,
              slug: true,
              status: true,
              indexable: true,
            },
          },
        },
        orderBy: {
          updatedAt: "desc",
        },
      }),

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
    ]);

  const sitemapPages = landingPages.filter(
    (page) =>
      page.status === "ACTIVE" &&
      page.indexable &&
      page.city.status === "ACTIVE" &&
      page.city.indexable &&
      page.service.status === "ACTIVE" &&
      page.service.indexable
  );

  const excludedPages = landingPages.filter(
    (page) =>
      !(
        page.status === "ACTIVE" &&
        page.indexable &&
        page.city.status === "ACTIVE" &&
        page.city.indexable &&
        page.service.status === "ACTIVE" &&
        page.service.indexable
      )
  );

  const invalidCanonicalPages = landingPages.filter(
    (page) =>
      page.canonicalUrl &&
      !page.canonicalUrl.startsWith("https://")
  );

  const missingCanonicalPages = landingPages.filter(
    (page) => !page.canonicalUrl?.trim()
  );

  const expectedCanonicalMismatch =
    landingPages.filter((page) => {
      if (!page.canonicalUrl) {
        return false;
      }

      const expected = getPublicUrl(
        page.service.slug,
        page.city.slug
      );

      return page.canonicalUrl !== expected;
    });

  const publicUrls = sitemapPages.map((page) =>
    getPublicUrl(
      page.service.slug,
      page.city.slug
    )
  );

  const duplicateUrlSet = new Set<string>();
  const duplicateUrls = publicUrls.filter(
    (url, index) => {
      if (publicUrls.indexOf(url) !== index) {
        duplicateUrlSet.add(url);
        return true;
      }

      return false;
    }
  );

  const activeCities = cities.filter(
    (city) =>
      city.status === "ACTIVE" &&
      city.indexable
  );

  const activeServices = services.filter(
    (service) =>
      service.status === "ACTIVE" &&
      service.indexable
  );

  const issueCount =
    invalidCanonicalPages.length +
    missingCanonicalPages.length +
    expectedCanonicalMismatch.length +
    duplicateUrlSet.size;

  return (
    <main className="sitemap-page">
      <div className="sitemap-shell">
        <header className="sitemap-header">
          <div>
            <Link
              href="/admin/seo"
              className="sitemap-back"
            >
              ← Zurück zum SEO Center
            </Link>

            <span className="sitemap-kicker">
              Indexierungsübersicht
            </span>

            <h1>Sitemap Center</h1>

            <p>
              Kontrolliere, welche Landingpages in der
              XML-Sitemap erscheinen und welche Seiten von
              der Indexierung ausgeschlossen sind.
            </p>
          </div>

          <div className="sitemap-header-actions">
            <RepairCanonicalButton />

            <Link
              href="/sitemap.xml"
              target="_blank"
            >
              XML-Sitemap öffnen
            </Link>

            <Link href="/admin/seo/publish">
              Freigaben
            </Link>

            <Link href="/admin/seo/health">
              SEO Health
            </Link>
          </div>
        </header>

        <section className="sitemap-stats">
          <article>
            <span>In der Sitemap</span>
            <strong>{sitemapPages.length}</strong>
            <small>öffentlich und indexierbar</small>
          </article>

          <article>
            <span>Ausgeschlossen</span>
            <strong>{excludedPages.length}</strong>
            <small>Entwurf, noindex oder inaktiv</small>
          </article>

          <article>
            <span>Aktive Städte</span>
            <strong>{activeCities.length}</strong>
            <small>für SEO freigegeben</small>
          </article>

          <article>
            <span>Aktive Leistungen</span>
            <strong>{activeServices.length}</strong>
            <small>für SEO freigegeben</small>
          </article>

          <article>
            <span>Offene Probleme</span>
            <strong>{issueCount}</strong>
            <small>Canonical oder URL-Probleme</small>
          </article>
        </section>

        <section className="sitemap-grid">
          <article className="sitemap-panel">
            <div className="panel-heading">
              <div>
                <span>Technische Prüfung</span>
                <h2>Sitemap-Status</h2>
              </div>
            </div>

            <div className="check-list">
              <div>
                <i
                  className={
                    missingCanonicalPages.length === 0
                      ? "success"
                      : "warning"
                  }
                >
                  {missingCanonicalPages.length === 0
                    ? "✓"
                    : "!"}
                </i>

                <div>
                  <strong>Canonical vorhanden</strong>
                  <small>
                    {missingCanonicalPages.length} Seiten ohne
                    Canonical URL
                  </small>
                </div>
              </div>

              <div>
                <i
                  className={
                    invalidCanonicalPages.length === 0
                      ? "success"
                      : "warning"
                  }
                >
                  {invalidCanonicalPages.length === 0
                    ? "✓"
                    : "!"}
                </i>

                <div>
                  <strong>HTTPS Canonical</strong>
                  <small>
                    {invalidCanonicalPages.length} ungültige
                    Canonical URLs
                  </small>
                </div>
              </div>

              <div>
                <i
                  className={
                    expectedCanonicalMismatch.length === 0
                      ? "success"
                      : "warning"
                  }
                >
                  {expectedCanonicalMismatch.length === 0
                    ? "✓"
                    : "!"}
                </i>

                <div>
                  <strong>Canonical stimmt mit Route überein</strong>
                  <small>
                    {expectedCanonicalMismatch.length} Abweichungen
                    gefunden
                  </small>
                </div>
              </div>

              <div>
                <i
                  className={
                    duplicateUrlSet.size === 0
                      ? "success"
                      : "warning"
                  }
                >
                  {duplicateUrlSet.size === 0
                    ? "✓"
                    : "!"}
                </i>

                <div>
                  <strong>Keine doppelten URLs</strong>
                  <small>
                    {duplicateUrls.length} doppelte Sitemap-Einträge
                  </small>
                </div>
              </div>
            </div>
          </article>

          <article className="sitemap-panel">
            <div className="panel-heading">
              <div>
                <span>XML-Endpunkt</span>
                <h2>Google Sitemap</h2>
              </div>
            </div>

            <div className="sitemap-url-box">
              <small>Sitemap URL</small>

              <code>
                https://www.auftrago.ch/sitemap.xml
              </code>

              <Link
                href="/sitemap.xml"
                target="_blank"
              >
                Sitemap prüfen
              </Link>
            </div>

            <div className="sitemap-info">
              <strong>Wichtig</strong>

              <p>
                Nur aktive und indexierbare Landingpages mit
                aktiver Stadt und aktiver Dienstleistung werden
                in die Sitemap aufgenommen.
              </p>
            </div>
          </article>
        </section>

        {issueCount > 0 ? (
          <section className="sitemap-panel">
            <div className="panel-heading">
              <div>
                <span>Fehlerprüfung</span>
                <h2>Canonical-Probleme</h2>
              </div>

              <strong>{issueCount}</strong>
            </div>

            <div className="issue-list">
              {missingCanonicalPages.map((page) => (
                <div key={`missing-${page.id}`}>
                  <span className="issue-badge">
                    Fehlt
                  </span>

                  <div>
                    <strong>
                      {page.service.name} in{" "}
                      {page.city.name}
                    </strong>

                    <small>
                      Keine Canonical URL eingetragen.
                    </small>
                  </div>
                </div>
              ))}

              {invalidCanonicalPages.map((page) => (
                <div key={`invalid-${page.id}`}>
                  <span className="issue-badge">
                    Ungültig
                  </span>

                  <div>
                    <strong>
                      {page.service.name} in{" "}
                      {page.city.name}
                    </strong>

                    <small>
                      {page.canonicalUrl}
                    </small>
                  </div>
                </div>
              ))}

              {expectedCanonicalMismatch.map((page) => (
                <div key={`mismatch-${page.id}`}>
                  <span className="issue-badge">
                    Abweichung
                  </span>

                  <div>
                    <strong>
                      {page.service.name} in{" "}
                      {page.city.name}
                    </strong>

                    <small>
                      Erwartet:{" "}
                      {getPublicUrl(
                        page.service.slug,
                        page.city.slug
                      )}
                    </small>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        <section className="sitemap-panel">
          <div className="panel-heading">
            <div>
              <span>Google Indexierung</span>
              <h2>Seiten in der Sitemap</h2>
            </div>

            <strong>{sitemapPages.length}</strong>
          </div>

          {sitemapPages.length === 0 ? (
            <div className="empty-state">
              Noch keine indexierbaren Landingpages vorhanden.
            </div>
          ) : (
            <div className="page-table">
              <div className="table-header">
                <span>Landingpage</span>
                <span>Canonical</span>
                <span>Aktualisiert</span>
                <span />
              </div>

              {sitemapPages.map((page) => {
                const publicPath =
                  `/dienstleistung/${page.service.slug}/${page.city.slug}`;

                const expectedCanonical =
                  getPublicUrl(
                    page.service.slug,
                    page.city.slug
                  );

                return (
                  <div
                    className="table-row"
                    key={page.id}
                  >
                    <div>
                      <strong>
                        {page.headline ||
                          `${page.service.name} in ${page.city.name}`}
                      </strong>

                      <small>
                        {page.service.name} ·{" "}
                        {page.city.name}
                      </small>
                    </div>

                    <code>
                      {page.canonicalUrl ||
                        expectedCanonical}
                    </code>

                    <span>
                      {formatDate(page.updatedAt)}
                    </span>

                    <Link
                      href={publicPath}
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

        <section className="sitemap-panel">
          <div className="panel-heading">
            <div>
              <span>Nicht in Google-Sitemap</span>
              <h2>Ausgeschlossene Seiten</h2>
            </div>

            <strong>{excludedPages.length}</strong>
          </div>

          {excludedPages.length === 0 ? (
            <div className="empty-state success-state">
              Alle Landingpages sind aktiv und indexierbar.
            </div>
          ) : (
            <div className="excluded-grid">
              {excludedPages.map((page) => {
                const reasons: string[] = [];

                if (page.status !== "ACTIVE") {
                  reasons.push("Entwurf");
                }

                if (!page.indexable) {
                  reasons.push("noindex");
                }

                if (page.city.status !== "ACTIVE") {
                  reasons.push("Stadt inaktiv");
                }

                if (!page.city.indexable) {
                  reasons.push("Stadt noindex");
                }

                if (
                  page.service.status !== "ACTIVE"
                ) {
                  reasons.push(
                    "Dienstleistung inaktiv"
                  );
                }

                if (!page.service.indexable) {
                  reasons.push(
                    "Dienstleistung noindex"
                  );
                }

                return (
                  <article key={page.id}>
                    <span>Ausgeschlossen</span>

                    <h3>
                      {page.headline ||
                        `${page.service.name} in ${page.city.name}`}
                    </h3>

                    <p>
                      {reasons.join(" · ")}
                    </p>

                    <Link href="/admin/seo/publish">
                      Freigabe verwalten
                    </Link>
                  </article>
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

        .sitemap-page {
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

        .sitemap-shell {
          width: min(1500px, calc(100% - 32px));
          margin: 0 auto;
          padding: 36px 0 70px;
        }

        .sitemap-header {
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

        .sitemap-back {
          display: inline-flex;
          margin-bottom: 20px;
          color: #94a3b8;
          font-size: 13px;
          font-weight: 800;
          text-decoration: none;
        }

        .sitemap-kicker {
          display: block;
          margin-bottom: 10px;
          color: #60a5fa;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .sitemap-header h1 {
          margin: 0;
          font-size: clamp(40px, 6vw, 66px);
          line-height: 1;
          letter-spacing: -0.045em;
        }

        .sitemap-header p {
          max-width: 760px;
          margin: 16px 0 0;
          color: #94a3b8;
          line-height: 1.7;
        }

        .sitemap-header-actions {
          display: flex;
          flex-wrap: wrap;
          justify-content: flex-end;
          gap: 10px;
        }

        .sitemap-header-actions a {
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

        .sitemap-stats {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 13px;
          margin: 20px 0;
        }

        .sitemap-stats article {
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

        .sitemap-stats span {
          display: block;
          color: #93c5fd;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.07em;
          text-transform: uppercase;
        }

        .sitemap-stats strong {
          display: block;
          margin-top: 11px;
          font-size: 32px;
        }

        .sitemap-stats small {
          display: block;
          margin-top: 7px;
          color: #64748b;
          font-size: 9px;
        }

        .sitemap-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 18px;
        }

        .sitemap-panel {
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

        .sitemap-grid .sitemap-panel {
          margin-top: 0;
        }

        .panel-heading {
          display: flex;
          align-items: center;
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

        .panel-heading > strong {
          display: grid;
          width: 45px;
          height: 45px;
          place-items: center;
          border-radius: 14px;
          background: rgba(37, 99, 235, 0.12);
          color: #bfdbfe;
        }

        .check-list {
          display: grid;
          gap: 10px;
        }

        .check-list > div {
          display: grid;
          grid-template-columns: 34px minmax(0, 1fr);
          gap: 11px;
          align-items: center;
          padding: 14px;
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.025);
        }

        .check-list i {
          display: grid;
          width: 31px;
          height: 31px;
          place-items: center;
          border-radius: 999px;
          font-style: normal;
          font-size: 12px;
          font-weight: 900;
        }

        .check-list i.success {
          background: rgba(34, 197, 94, 0.12);
          color: #86efac;
        }

        .check-list i.warning {
          background: rgba(245, 158, 11, 0.12);
          color: #fde68a;
        }

        .check-list strong {
          display: block;
          font-size: 11px;
        }

        .check-list small {
          display: block;
          margin-top: 4px;
          color: #64748b;
          font-size: 9px;
        }

        .sitemap-url-box {
          padding: 18px;
          border: 1px solid rgba(96, 165, 250, 0.16);
          border-radius: 15px;
          background: rgba(37, 99, 235, 0.06);
        }

        .sitemap-url-box small {
          display: block;
          color: #93c5fd;
          font-size: 8px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .sitemap-url-box code {
          display: block;
          overflow-wrap: anywhere;
          margin-top: 10px;
          color: #ffffff;
          font-size: 12px;
        }

        .sitemap-url-box a {
          display: inline-flex;
          margin-top: 15px;
          padding: 10px 13px;
          border-radius: 9px;
          background: #2563eb;
          color: #ffffff;
          font-size: 9px;
          font-weight: 900;
          text-decoration: none;
        }

        .sitemap-info {
          margin-top: 13px;
          padding: 15px;
          border-radius: 13px;
          background: rgba(255, 255, 255, 0.025);
        }

        .sitemap-info strong {
          font-size: 10px;
        }

        .sitemap-info p {
          margin: 7px 0 0;
          color: #7c8aa0;
          font-size: 9px;
          line-height: 1.6;
        }

        .issue-list {
          display: grid;
          gap: 9px;
        }

        .issue-list > div {
          display: grid;
          grid-template-columns: auto minmax(0, 1fr);
          gap: 12px;
          align-items: center;
          padding: 13px;
          border-radius: 13px;
          background: rgba(239, 68, 68, 0.045);
        }

        .issue-badge {
          padding: 6px 8px;
          border-radius: 999px;
          background: rgba(239, 68, 68, 0.1);
          color: #fca5a5;
          font-size: 8px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .issue-list strong {
          display: block;
          font-size: 10px;
        }

        .issue-list small {
          display: block;
          overflow-wrap: anywhere;
          margin-top: 4px;
          color: #7c8aa0;
          font-size: 8px;
        }

        .page-table {
          overflow-x: auto;
        }

        .table-header,
        .table-row {
          display: grid;
          grid-template-columns:
            minmax(220px, 1.4fr)
            minmax(300px, 2fr)
            170px
            65px;
          gap: 12px;
          align-items: center;
          min-width: 850px;
        }

        .table-header {
          padding: 0 13px 11px;
          color: #64748b;
          font-size: 8px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .table-row {
          padding: 14px 13px;
          border-top: 1px solid rgba(148, 163, 184, 0.08);
        }

        .table-row strong {
          display: block;
          font-size: 10px;
        }

        .table-row small {
          display: block;
          margin-top: 4px;
          color: #64748b;
          font-size: 8px;
        }

        .table-row code {
          overflow: hidden;
          color: #94a3b8;
          font-size: 8px;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .table-row > span {
          color: #7c8aa0;
          font-size: 8px;
        }

        .table-row a {
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

        .excluded-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 11px;
        }

        .excluded-grid article {
          padding: 16px;
          border: 1px solid rgba(245, 158, 11, 0.13);
          border-radius: 15px;
          background: rgba(245, 158, 11, 0.04);
        }

        .excluded-grid article > span {
          color: #fde68a;
          font-size: 8px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .excluded-grid h3 {
          margin: 9px 0 0;
          font-size: 13px;
        }

        .excluded-grid p {
          margin: 7px 0 0;
          color: #9c8d62;
          font-size: 9px;
          line-height: 1.5;
        }

        .excluded-grid a {
          display: inline-flex;
          margin-top: 13px;
          color: #bfdbfe;
          font-size: 8px;
          font-weight: 900;
          text-decoration: none;
        }

        .empty-state {
          padding: 45px 20px;
          border: 1px dashed rgba(148, 163, 184, 0.16);
          border-radius: 15px;
          color: #64748b;
          text-align: center;
          font-size: 10px;
        }

        .success-state {
          color: #86efac;
        }

        @media (max-width: 1150px) {
          .sitemap-stats {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }

          .excluded-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 850px) {
          .sitemap-header {
            align-items: flex-start;
            flex-direction: column;
          }

          .sitemap-header-actions {
            justify-content: flex-start;
          }

          .sitemap-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 600px) {
          .sitemap-shell {
            width: calc(100% - 20px);
            padding-top: 14px;
          }

          .sitemap-header,
          .sitemap-panel {
            padding: 20px;
            border-radius: 21px;
          }

          .sitemap-stats {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .sitemap-header-actions {
            width: 100%;
          }

          .sitemap-header-actions a {
            flex: 1;
          }

          .excluded-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 420px) {
          .sitemap-stats {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </main>
  );
}
