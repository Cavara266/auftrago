import Link from "next/link";

import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

type LandingPageRecord = {
  id: string;
  headline: string | null;
  status: string;
  indexable: boolean;
  updatedAt: Date;
  cityId: string;
  serviceId: string;
  city: {
    id: string;
    name: string;
    slug: string;
    status: string;
    indexable: boolean;
  };
  service: {
    id: string;
    name: string;
    slug: string;
    status: string;
    indexable: boolean;
  };
};

function getPublicPath(page: LandingPageRecord) {
  return `/dienstleistung/${page.service.slug}/${page.city.slug}`;
}

function calculateInboundLinks(
  targetPage: LandingPageRecord,
  allPages: LandingPageRecord[]
) {
  return allPages.filter((sourcePage) => {
    if (sourcePage.id === targetPage.id) {
      return false;
    }

    const sameCity =
      sourcePage.cityId === targetPage.cityId;

    const sameService =
      sourcePage.serviceId === targetPage.serviceId;

    return sameCity || sameService;
  }).length;
}

function calculateCityLinks(
  targetPage: LandingPageRecord,
  allPages: LandingPageRecord[]
) {
  return allPages.filter(
    (sourcePage) =>
      sourcePage.id !== targetPage.id &&
      sourcePage.cityId === targetPage.cityId
  ).length;
}

function calculateServiceLinks(
  targetPage: LandingPageRecord,
  allPages: LandingPageRecord[]
) {
  return allPages.filter(
    (sourcePage) =>
      sourcePage.id !== targetPage.id &&
      sourcePage.serviceId === targetPage.serviceId
  ).length;
}

function getLinkStatus(linkCount: number) {
  if (linkCount === 0) {
    return {
      label: "Verwaist",
      className: "critical",
    };
  }

  if (linkCount < 3) {
    return {
      label: "Schwach",
      className: "warning",
    };
  }

  if (linkCount < 6) {
    return {
      label: "Gut",
      className: "good",
    };
  }

  return {
    label: "Stark",
    className: "excellent",
  };
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("de-CH", {
    dateStyle: "medium",
  }).format(date);
}

export default async function InternalLinksPage() {
  const landingPages =
    await prisma.seoLandingPage.findMany({
      include: {
        city: {
          select: {
            id: true,
            name: true,
            slug: true,
            status: true,
            indexable: true,
          },
        },
        service: {
          select: {
            id: true,
            name: true,
            slug: true,
            status: true,
            indexable: true,
          },
        },
      },
      orderBy: [
        {
          city: {
            name: "asc",
          },
        },
        {
          service: {
            name: "asc",
          },
        },
      ],
    });

  const publicPages = landingPages.filter(
    (page) =>
      page.status === "ACTIVE" &&
      page.indexable &&
      page.city.status === "ACTIVE" &&
      page.city.indexable &&
      page.service.status === "ACTIVE" &&
      page.service.indexable
  );

  const pageAnalysis = publicPages
    .map((page) => {
      const inboundLinks = calculateInboundLinks(
        page,
        publicPages
      );

      const cityLinks = calculateCityLinks(
        page,
        publicPages
      );

      const serviceLinks = calculateServiceLinks(
        page,
        publicPages
      );

      return {
        page,
        inboundLinks,
        cityLinks,
        serviceLinks,
        status: getLinkStatus(inboundLinks),
      };
    })
    .sort(
      (a, b) =>
        a.inboundLinks - b.inboundLinks
    );

  const orphanPages = pageAnalysis.filter(
    (item) => item.inboundLinks === 0
  );

  const weakPages = pageAnalysis.filter(
    (item) =>
      item.inboundLinks > 0 &&
      item.inboundLinks < 3
  );

  const strongPages = pageAnalysis.filter(
    (item) => item.inboundLinks >= 6
  );

  const totalInternalLinks =
    pageAnalysis.reduce(
      (sum, item) => sum + item.inboundLinks,
      0
    );

  const averageLinks =
    pageAnalysis.length > 0
      ? Math.round(
          (totalInternalLinks /
            pageAnalysis.length) *
            10
        ) / 10
      : 0;

  const cities = Array.from(
    new Map(
      publicPages.map((page) => [
        page.city.id,
        page.city,
      ])
    ).values()
  );

  const services = Array.from(
    new Map(
      publicPages.map((page) => [
        page.service.id,
        page.service,
      ])
    ).values()
  );

  const cityGroups = cities
    .map((city) => {
      const pages = publicPages.filter(
        (page) => page.cityId === city.id
      );

      return {
        city,
        pages,
        linkPotential:
          pages.length > 1
            ? pages.length *
              (pages.length - 1)
            : 0,
      };
    })
    .sort(
      (a, b) =>
        b.pages.length - a.pages.length
    );

  const serviceGroups = services
    .map((service) => {
      const pages = publicPages.filter(
        (page) =>
          page.serviceId === service.id
      );

      return {
        service,
        pages,
        linkPotential:
          pages.length > 1
            ? pages.length *
              (pages.length - 1)
            : 0,
      };
    })
    .sort(
      (a, b) =>
        b.pages.length - a.pages.length
    );

  return (
    <main className="links-page">
      <div className="links-shell">
        <header className="links-header">
          <div>
            <Link
              href="/admin/seo"
              className="links-back"
            >
              ← Zurück zum SEO Center
            </Link>

            <span className="links-kicker">
              Interne SEO-Struktur
            </span>

            <h1>Internal-Linking Center</h1>

            <p>
              Analysiere die interne Verlinkung deiner
              Landingpages nach Städten und
              Dienstleistungen. Schwach verlinkte oder
              verwaiste Seiten werden automatisch erkannt.
            </p>
          </div>

          <div className="links-header-actions">
            <Link href="/admin/seo/health">
              SEO Health
            </Link>

            <Link href="/admin/seo/sitemap">
              Sitemap
            </Link>

            <Link href="/admin/seo/publish">
              Freigaben
            </Link>
          </div>
        </header>

        <section className="links-stats">
          <article>
            <span>Öffentliche Seiten</span>
            <strong>{publicPages.length}</strong>
            <small>aktiv und indexierbar</small>
          </article>

          <article>
            <span>Ø interne Links</span>
            <strong>{averageLinks}</strong>
            <small>pro Landingpage</small>
          </article>

          <article>
            <span>Verwaiste Seiten</span>
            <strong>{orphanPages.length}</strong>
            <small>ohne interne Verbindung</small>
          </article>

          <article>
            <span>Schwache Seiten</span>
            <strong>{weakPages.length}</strong>
            <small>weniger als 3 Verbindungen</small>
          </article>

          <article>
            <span>Stark verlinkt</span>
            <strong>{strongPages.length}</strong>
            <small>mindestens 6 Verbindungen</small>
          </article>
        </section>

        {(orphanPages.length > 0 ||
          weakPages.length > 0) && (
          <section className="links-panel alert-panel">
            <div className="panel-heading">
              <div>
                <span>Handlungsbedarf</span>
                <h2>Schwach verlinkte Landingpages</h2>
              </div>

              <strong>
                {orphanPages.length +
                  weakPages.length}
              </strong>
            </div>

            <div className="alert-grid">
              {[...orphanPages, ...weakPages]
                .slice(0, 12)
                .map((item) => (
                  <article key={item.page.id}>
                    <div className="alert-top">
                      <span
                        className={`link-status ${item.status.className}`}
                      >
                        {item.status.label}
                      </span>

                      <b>
                        {item.inboundLinks} Links
                      </b>
                    </div>

                    <h3>
                      {item.page.headline ||
                        `${item.page.service.name} in ${item.page.city.name}`}
                    </h3>

                    <p>
                      Stadt-Verbindungen:{" "}
                      {item.cityLinks}
                      <br />
                      Leistungs-Verbindungen:{" "}
                      {item.serviceLinks}
                    </p>

                    <Link
                      href={getPublicPath(
                        item.page
                      )}
                      target="_blank"
                    >
                      Seite öffnen
                    </Link>
                  </article>
                ))}
            </div>
          </section>
        )}

        <section className="links-columns">
          <article className="links-panel">
            <div className="panel-heading">
              <div>
                <span>Lokale Navigation</span>
                <h2>Verlinkung nach Stadt</h2>
              </div>

              <Link href="/admin/seo/cities">
                Städte verwalten
              </Link>
            </div>

            {cityGroups.length === 0 ? (
              <div className="empty-state">
                Keine öffentlichen Stadtseiten
                vorhanden.
              </div>
            ) : (
              <div className="group-list">
                {cityGroups
                  .slice(0, 15)
                  .map((group) => (
                    <div
                      className="group-row"
                      key={group.city.id}
                    >
                      <div>
                        <strong>
                          {group.city.name}
                        </strong>

                        <small>
                          {
                            group.pages.length
                          }{" "}
                          Landingpages
                        </small>
                      </div>

                      <div className="group-metrics">
                        <span>
                          Potenzial
                        </span>

                        <b>
                          {
                            group.linkPotential
                          }
                        </b>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </article>

          <article className="links-panel">
            <div className="panel-heading">
              <div>
                <span>Leistungsnavigation</span>
                <h2>
                  Verlinkung nach Dienstleistung
                </h2>
              </div>

              <Link href="/admin/seo/services">
                Leistungen verwalten
              </Link>
            </div>

            {serviceGroups.length === 0 ? (
              <div className="empty-state">
                Keine öffentlichen
                Dienstleistungsseiten vorhanden.
              </div>
            ) : (
              <div className="group-list">
                {serviceGroups
                  .slice(0, 15)
                  .map((group) => (
                    <div
                      className="group-row"
                      key={group.service.id}
                    >
                      <div>
                        <strong>
                          {group.service.name}
                        </strong>

                        <small>
                          {
                            group.pages.length
                          }{" "}
                          Landingpages
                        </small>
                      </div>

                      <div className="group-metrics">
                        <span>
                          Potenzial
                        </span>

                        <b>
                          {
                            group.linkPotential
                          }
                        </b>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </article>
        </section>

        <section className="links-panel">
          <div className="panel-heading">
            <div>
              <span>Alle Landingpages</span>
              <h2>Interne Linkanalyse</h2>
            </div>

            <strong>
              {pageAnalysis.length}
            </strong>
          </div>

          {pageAnalysis.length === 0 ? (
            <div className="empty-state">
              Noch keine aktiven und indexierbaren
              Landingpages vorhanden.
            </div>
          ) : (
            <div className="analysis-table">
              <div className="table-header">
                <span>Landingpage</span>
                <span>Status</span>
                <span>Stadt-Links</span>
                <span>Leistungs-Links</span>
                <span>Gesamt</span>
                <span>Aktualisiert</span>
                <span />
              </div>

              {pageAnalysis.map((item) => (
                <div
                  className="table-row"
                  key={item.page.id}
                >
                  <div>
                    <strong>
                      {item.page.headline ||
                        `${item.page.service.name} in ${item.page.city.name}`}
                    </strong>

                    <small>
                      {item.page.service.name} ·{" "}
                      {item.page.city.name}
                    </small>
                  </div>

                  <span
                    className={`link-status ${item.status.className}`}
                  >
                    {item.status.label}
                  </span>

                  <b>{item.cityLinks}</b>

                  <b>{item.serviceLinks}</b>

                  <b>{item.inboundLinks}</b>

                  <span className="updated-date">
                    {formatDate(
                      item.page.updatedAt
                    )}
                  </span>

                  <Link
                    href={getPublicPath(
                      item.page
                    )}
                    target="_blank"
                  >
                    Öffnen
                  </Link>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <style suppressHydrationWarning>{`
        :global(body) {
          margin: 0;
          background: #050711;
        }

        .links-page {
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

        .links-shell {
          width: min(1500px, calc(100% - 32px));
          margin: 0 auto;
          padding: 36px 0 70px;
        }

        .links-header {
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

        .links-back {
          display: inline-flex;
          margin-bottom: 20px;
          color: #94a3b8;
          font-size: 13px;
          font-weight: 800;
          text-decoration: none;
        }

        .links-kicker {
          display: block;
          margin-bottom: 10px;
          color: #60a5fa;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .links-header h1 {
          margin: 0;
          font-size: clamp(40px, 6vw, 66px);
          line-height: 1;
          letter-spacing: -0.045em;
        }

        .links-header p {
          max-width: 760px;
          margin: 16px 0 0;
          color: #94a3b8;
          line-height: 1.7;
        }

        .links-header-actions {
          display: flex;
          flex-wrap: wrap;
          justify-content: flex-end;
          gap: 10px;
        }

        .links-header-actions a {
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

        .links-stats {
          display: grid;
          grid-template-columns:
            repeat(5, minmax(0, 1fr));
          gap: 13px;
          margin: 20px 0;
        }

        .links-stats article {
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

        .links-stats span {
          display: block;
          color: #93c5fd;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.07em;
          text-transform: uppercase;
        }

        .links-stats strong {
          display: block;
          margin-top: 11px;
          font-size: 32px;
        }

        .links-stats small {
          display: block;
          margin-top: 7px;
          color: #64748b;
          font-size: 9px;
        }

        .links-panel {
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

        .links-columns {
          display: grid;
          grid-template-columns:
            repeat(2, minmax(0, 1fr));
          gap: 18px;
          margin-top: 18px;
        }

        .links-columns .links-panel {
          margin-top: 0;
        }

        .alert-panel {
          border-color:
            rgba(245, 158, 11, 0.18);
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
          background:
            rgba(37, 99, 235, 0.12);
          color: #bfdbfe;
        }

        .panel-heading a {
          color: #bfdbfe;
          font-size: 9px;
          font-weight: 900;
          text-decoration: none;
        }

        .alert-grid {
          display: grid;
          grid-template-columns:
            repeat(3, minmax(0, 1fr));
          gap: 11px;
        }

        .alert-grid article {
          padding: 16px;
          border: 1px solid
            rgba(245, 158, 11, 0.13);
          border-radius: 15px;
          background:
            rgba(245, 158, 11, 0.04);
        }

        .alert-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
        }

        .alert-top b {
          color: #fde68a;
          font-size: 9px;
        }

        .alert-grid h3 {
          margin: 13px 0 0;
          font-size: 13px;
          line-height: 1.4;
        }

        .alert-grid p {
          margin: 8px 0 0;
          color: #9c8d62;
          font-size: 9px;
          line-height: 1.6;
        }

        .alert-grid a {
          display: inline-flex;
          margin-top: 13px;
          color: #bfdbfe;
          font-size: 8px;
          font-weight: 900;
          text-decoration: none;
        }

        .link-status {
          display: inline-flex;
          width: fit-content;
          padding: 5px 8px;
          border-radius: 999px;
          font-size: 8px;
          font-weight: 900;
        }

        .link-status.critical {
          background:
            rgba(239, 68, 68, 0.11);
          color: #fca5a5;
        }

        .link-status.warning {
          background:
            rgba(245, 158, 11, 0.11);
          color: #fde68a;
        }

        .link-status.good {
          background:
            rgba(59, 130, 246, 0.11);
          color: #93c5fd;
        }

        .link-status.excellent {
          background:
            rgba(34, 197, 94, 0.11);
          color: #86efac;
        }

        .group-list {
          display: grid;
          gap: 9px;
        }

        .group-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          padding: 14px;
          border-radius: 13px;
          background:
            rgba(255, 255, 255, 0.025);
        }

        .group-row strong {
          display: block;
          font-size: 11px;
        }

        .group-row small {
          display: block;
          margin-top: 4px;
          color: #64748b;
          font-size: 8px;
        }

        .group-metrics {
          text-align: right;
        }

        .group-metrics span {
          display: block;
          color: #64748b;
          font-size: 7px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .group-metrics b {
          display: block;
          margin-top: 4px;
          color: #bfdbfe;
          font-size: 16px;
        }

        .analysis-table {
          overflow-x: auto;
        }

        .table-header,
        .table-row {
          display: grid;
          grid-template-columns:
            minmax(240px, 2fr)
            80px
            80px
            100px
            65px
            105px
            65px;
          gap: 12px;
          align-items: center;
          min-width: 920px;
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
          border-top: 1px solid
            rgba(148, 163, 184, 0.08);
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

        .table-row b {
          color: #cbd5e1;
          font-size: 11px;
        }

        .updated-date {
          color: #7c8aa0;
          font-size: 8px;
        }

        .table-row a {
          display: inline-flex;
          justify-content: center;
          padding: 8px;
          border: 1px solid
            rgba(148, 163, 184, 0.14);
          border-radius: 8px;
          color: #bfdbfe;
          font-size: 8px;
          font-weight: 900;
          text-decoration: none;
        }

        .empty-state {
          padding: 45px 20px;
          border: 1px dashed
            rgba(148, 163, 184, 0.16);
          border-radius: 15px;
          color: #64748b;
          text-align: center;
          font-size: 10px;
        }

        @media (max-width: 1150px) {
          .links-stats {
            grid-template-columns:
              repeat(3, minmax(0, 1fr));
          }

          .alert-grid {
            grid-template-columns:
              repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 850px) {
          .links-header {
            align-items: flex-start;
            flex-direction: column;
          }

          .links-header-actions {
            justify-content: flex-start;
          }

          .links-columns {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 600px) {
          .links-shell {
            width: calc(100% - 20px);
            padding-top: 14px;
          }

          .links-header,
          .links-panel {
            padding: 20px;
            border-radius: 21px;
          }

          .links-stats {
            grid-template-columns:
              repeat(2, minmax(0, 1fr));
          }

          .links-header-actions {
            width: 100%;
          }

          .links-header-actions a {
            flex: 1;
          }

          .alert-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 420px) {
          .links-stats {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </main>
  );
}
