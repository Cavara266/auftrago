import Link from "next/link";

import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function SeoExportPage() {
  const [
    totalPages,
    activePages,
    indexablePages,
    draftPages,
    missingTitles,
    missingDescriptions,
    missingCanonicals,
  ] = await Promise.all([
    prisma.seoLandingPage.count(),

    prisma.seoLandingPage.count({
      where: {
        status: "ACTIVE",
      },
    }),

    prisma.seoLandingPage.count({
      where: {
        status: "ACTIVE",
        indexable: true,
        city: {
          status: "ACTIVE",
          indexable: true,
        },
        service: {
          status: "ACTIVE",
          indexable: true,
        },
      },
    }),

    prisma.seoLandingPage.count({
      where: {
        status: "DRAFT",
      },
    }),

    prisma.seoLandingPage.count({
      where: {
        OR: [
          {
            seoTitle: null,
          },
          {
            seoTitle: "",
          },
        ],
      },
    }),

    prisma.seoLandingPage.count({
      where: {
        OR: [
          {
            seoDescription: null,
          },
          {
            seoDescription: "",
          },
        ],
      },
    }),

    prisma.seoLandingPage.count({
      where: {
        OR: [
          {
            canonicalUrl: null,
          },
          {
            canonicalUrl: "",
          },
        ],
      },
    }),
  ]);

  const exportReady =
    missingTitles === 0 &&
    missingDescriptions === 0 &&
    missingCanonicals === 0;

  return (
    <main className="export-page">
      <div className="export-shell">
        <header className="export-header">
          <div>
            <Link
              href="/admin/seo"
              className="export-back"
            >
              ← Zurück zum SEO Center
            </Link>

            <span className="export-kicker">
              Datenexport
            </span>

            <h1>SEO Export Center</h1>

            <p>
              Exportiere alle SEO-Landingpages als
              Excel-kompatible CSV-Datei. Die Datei enthält
              URLs, Metadaten, Status und
              Indexierungseinstellungen.
            </p>
          </div>

          <div className="export-actions">
            <a href="/admin/seo/export/download">
              CSV herunterladen
            </a>

            <Link href="/admin/seo/audit">
              SEO Audit
            </Link>

            <Link href="/admin/seo/sitemap">
              Sitemap
            </Link>
          </div>
        </header>

        <section className="export-stats">
          <article>
            <span>Landingpages</span>
            <strong>{totalPages}</strong>
            <small>im gesamten SEO-System</small>
          </article>

          <article>
            <span>Aktiv</span>
            <strong>{activePages}</strong>
            <small>veröffentlichte Seiten</small>
          </article>

          <article>
            <span>Indexierbar</span>
            <strong>{indexablePages}</strong>
            <small>bereit für Google</small>
          </article>

          <article>
            <span>Entwürfe</span>
            <strong>{draftPages}</strong>
            <small>noch nicht veröffentlicht</small>
          </article>
        </section>

        <section className="export-grid">
          <article className="export-panel">
            <div className="panel-heading">
              <div>
                <span>CSV-Datei</span>
                <h2>Kompletter SEO-Export</h2>
              </div>
            </div>

            <div className="download-box">
              <div className="download-icon">
                ↓
              </div>

              <div>
                <strong>
                  Auftrago SEO Landingpages
                </strong>

                <p>
                  Semikolon-getrennte CSV-Datei mit
                  UTF-8-Kodierung. Die Datei kann direkt in
                  Excel, Numbers oder Google Sheets geöffnet
                  werden.
                </p>
              </div>

              <a href="/admin/seo/export/download">
                Export starten
              </a>
            </div>
          </article>

          <article className="export-panel">
            <div className="panel-heading">
              <div>
                <span>Datenqualität</span>
                <h2>Export-Bereitschaft</h2>
              </div>

              <strong
                className={
                  exportReady
                    ? "ready"
                    : "warning"
                }
              >
                {exportReady ? "✓" : "!"}
              </strong>
            </div>

            <div className="quality-list">
              <div>
                <span>Fehlende SEO-Titel</span>
                <b>{missingTitles}</b>
              </div>

              <div>
                <span>
                  Fehlende Meta-Beschreibungen
                </span>
                <b>{missingDescriptions}</b>
              </div>

              <div>
                <span>
                  Fehlende Canonical-URLs
                </span>
                <b>{missingCanonicals}</b>
              </div>
            </div>

            {!exportReady ? (
              <Link
                href="/admin/seo/audit"
                className="repair-link"
              >
                Probleme im SEO Audit beheben
              </Link>
            ) : (
              <p className="ready-message">
                Alle wichtigen SEO-Felder sind vorhanden.
              </p>
            )}
          </article>
        </section>

        <section className="export-panel">
          <div className="panel-heading">
            <div>
              <span>Enthaltene Spalten</span>
              <h2>CSV-Inhalt</h2>
            </div>
          </div>

          <div className="column-grid">
            {[
              "Landingpage",
              "Öffentliche URL",
              "Stadt",
              "Dienstleistung",
              "SEO-Titel",
              "Meta-Beschreibung",
              "Canonical URL",
              "Seitenstatus",
              "Indexierbarkeit",
              "Stadtstatus",
              "Dienstleistungsstatus",
              "Veröffentlichungsdatum",
              "Aktualisierungsdatum",
            ].map((column) => (
              <div key={column}>
                <span>✓</span>
                <strong>{column}</strong>
              </div>
            ))}
          </div>
        </section>
      </div>

      <style suppressHydrationWarning>{`
        :global(body) {
          margin: 0;
          background: #050711;
        }

        .export-page {
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

        .export-shell {
          width: min(1400px, calc(100% - 32px));
          margin: 0 auto;
          padding: 36px 0 70px;
        }

        .export-header {
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

        .export-back {
          display: inline-flex;
          margin-bottom: 20px;
          color: #94a3b8;
          font-size: 13px;
          font-weight: 800;
          text-decoration: none;
        }

        .export-kicker {
          display: block;
          margin-bottom: 10px;
          color: #60a5fa;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .export-header h1 {
          margin: 0;
          font-size: clamp(40px, 6vw, 66px);
          line-height: 1;
          letter-spacing: -0.045em;
        }

        .export-header p {
          max-width: 760px;
          margin: 16px 0 0;
          color: #94a3b8;
          line-height: 1.7;
        }

        .export-actions {
          display: flex;
          flex-wrap: wrap;
          justify-content: flex-end;
          gap: 10px;
        }

        .export-actions a {
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

        .export-actions a:first-child {
          border: 0;
          background:
            linear-gradient(
              135deg,
              #059669,
              #2563eb
            );
        }

        .export-stats {
          display: grid;
          grid-template-columns:
            repeat(4, minmax(0, 1fr));
          gap: 13px;
          margin: 20px 0;
        }

        .export-stats article {
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

        .export-stats span {
          display: block;
          color: #93c5fd;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.07em;
          text-transform: uppercase;
        }

        .export-stats strong {
          display: block;
          margin-top: 11px;
          font-size: 32px;
        }

        .export-stats small {
          display: block;
          margin-top: 7px;
          color: #64748b;
          font-size: 9px;
        }

        .export-grid {
          display: grid;
          grid-template-columns:
            1.4fr 1fr;
          gap: 18px;
        }

        .export-panel {
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

        .export-grid .export-panel {
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
        }

        .panel-heading > strong.ready {
          background: rgba(34, 197, 94, 0.12);
          color: #86efac;
        }

        .panel-heading > strong.warning {
          background: rgba(245, 158, 11, 0.12);
          color: #fde68a;
        }

        .download-box {
          display: grid;
          grid-template-columns:
            54px minmax(0, 1fr) auto;
          gap: 18px;
          align-items: center;
          padding: 20px;
          border: 1px solid rgba(59, 130, 246, 0.15);
          border-radius: 18px;
          background: rgba(37, 99, 235, 0.06);
        }

        .download-icon {
          display: grid;
          width: 54px;
          height: 54px;
          place-items: center;
          border-radius: 16px;
          background:
            linear-gradient(
              135deg,
              #2563eb,
              #7c3aed
            );
          font-size: 24px;
          font-weight: 900;
        }

        .download-box strong {
          display: block;
          font-size: 14px;
        }

        .download-box p {
          margin: 7px 0 0;
          color: #94a3b8;
          font-size: 10px;
          line-height: 1.6;
        }

        .download-box a {
          display: inline-flex;
          min-height: 42px;
          align-items: center;
          padding: 0 14px;
          border-radius: 11px;
          background: #2563eb;
          color: #ffffff;
          font-size: 9px;
          font-weight: 900;
          text-decoration: none;
          white-space: nowrap;
        }

        .quality-list {
          display: grid;
          gap: 9px;
        }

        .quality-list div {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          padding: 14px;
          border-radius: 13px;
          background: rgba(255, 255, 255, 0.025);
        }

        .quality-list span {
          color: #94a3b8;
          font-size: 10px;
        }

        .quality-list b {
          font-size: 14px;
        }

        .repair-link {
          display: inline-flex;
          margin-top: 14px;
          color: #bfdbfe;
          font-size: 9px;
          font-weight: 900;
          text-decoration: none;
        }

        .ready-message {
          margin: 14px 0 0;
          color: #86efac;
          font-size: 9px;
          font-weight: 800;
        }

        .column-grid {
          display: grid;
          grid-template-columns:
            repeat(3, minmax(0, 1fr));
          gap: 10px;
        }

        .column-grid div {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 13px;
          border-radius: 13px;
          background: rgba(255, 255, 255, 0.025);
        }

        .column-grid span {
          display: grid;
          width: 25px;
          height: 25px;
          flex-shrink: 0;
          place-items: center;
          border-radius: 999px;
          background: rgba(34, 197, 94, 0.1);
          color: #86efac;
          font-size: 9px;
          font-weight: 900;
        }

        .column-grid strong {
          font-size: 9px;
        }

        @media (max-width: 900px) {
          .export-header {
            align-items: flex-start;
            flex-direction: column;
          }

          .export-grid {
            grid-template-columns: 1fr;
          }

          .column-grid {
            grid-template-columns:
              repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 650px) {
          .export-shell {
            width: calc(100% - 20px);
            padding-top: 14px;
          }

          .export-header,
          .export-panel {
            padding: 20px;
            border-radius: 21px;
          }

          .export-stats {
            grid-template-columns:
              repeat(2, minmax(0, 1fr));
          }

          .export-actions {
            width: 100%;
          }

          .export-actions a {
            flex: 1;
          }

          .download-box {
            grid-template-columns:
              48px minmax(0, 1fr);
          }

          .download-box a {
            grid-column: 1 / -1;
            justify-content: center;
          }
        }

        @media (max-width: 430px) {
          .export-stats,
          .column-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </main>
  );
}
