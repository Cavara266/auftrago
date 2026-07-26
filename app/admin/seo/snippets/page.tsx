import Link from "next/link";

import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const BASE_URL = "https://www.auftrago.ch";

function getTitleStatus(value: string | null) {
  const length = value?.trim().length ?? 0;

  if (length === 0) {
    return {
      label: "Fehlt",
      className: "critical",
    };
  }

  if (length < 30) {
    return {
      label: "Zu kurz",
      className: "warning",
    };
  }

  if (length > 65) {
    return {
      label: "Zu lang",
      className: "warning",
    };
  }

  return {
    label: "Optimal",
    className: "success",
  };
}

function getDescriptionStatus(
  value: string | null
) {
  const length = value?.trim().length ?? 0;

  if (length === 0) {
    return {
      label: "Fehlt",
      className: "critical",
    };
  }

  if (length < 110) {
    return {
      label: "Zu kurz",
      className: "warning",
    };
  }

  if (length > 170) {
    return {
      label: "Zu lang",
      className: "warning",
    };
  }

  return {
    label: "Optimal",
    className: "success",
  };
}

function truncateTitle(value: string) {
  if (value.length <= 68) {
    return value;
  }

  return `${value.slice(0, 65).trim()}...`;
}

function truncateDescription(value: string) {
  if (value.length <= 175) {
    return value;
  }

  return `${value.slice(0, 172).trim()}...`;
}

export default async function SeoSnippetPreviewPage() {
  const landingPages =
    await prisma.seoLandingPage.findMany({
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
      orderBy: [
        {
          updatedAt: "desc",
        },
      ],
    });

  const previews = landingPages.map((page) => {
    const title =
      page.seoTitle?.trim() ||
      `${page.service.name} in ${page.city.name} | Auftrago`;

    const description =
      page.seoDescription?.trim() ||
      `Finde passende Anbieter für ${page.service.name} in ${page.city.name} und vergleiche regionale Angebote über Auftrago.`;

    const publicPath =
      `/dienstleistung/${page.service.slug}/${page.city.slug}`;

    const publicUrl = `${BASE_URL}${publicPath}`;

    return {
      page,
      title,
      description,
      publicPath,
      publicUrl,
      titleStatus: getTitleStatus(
        page.seoTitle
      ),
      descriptionStatus:
        getDescriptionStatus(
          page.seoDescription
        ),
    };
  });

  const optimalTitles = previews.filter(
    (preview) =>
      preview.titleStatus.className ===
      "success"
  ).length;

  const optimalDescriptions =
    previews.filter(
      (preview) =>
        preview.descriptionStatus.className ===
        "success"
    ).length;

  const missingTitles = previews.filter(
    (preview) =>
      preview.titleStatus.className ===
      "critical"
  ).length;

  const missingDescriptions =
    previews.filter(
      (preview) =>
        preview.descriptionStatus.className ===
        "critical"
    ).length;

  const fullyOptimized = previews.filter(
    (preview) =>
      preview.titleStatus.className ===
        "success" &&
      preview.descriptionStatus.className ===
        "success"
  ).length;

  return (
    <main className="snippet-page">
      <div className="snippet-shell">
        <header className="snippet-header">
          <div>
            <Link
              href="/admin/seo"
              className="snippet-back"
            >
              ← Zurück zum SEO Center
            </Link>

            <span className="snippet-kicker">
              Google Vorschau
            </span>

            <h1>Snippet Preview Center</h1>

            <p>
              Kontrolliere Titel, Beschreibungen und URLs
              deiner Landingpages so, wie sie ungefähr in
              den Google-Suchergebnissen dargestellt werden.
            </p>
          </div>

          <div className="snippet-actions">
            <Link href="/admin/seo/audit">
              SEO Audit
            </Link>

            <Link href="/admin/seo/health">
              SEO Health
            </Link>

            <Link href="/admin/seo/export">
              Export
            </Link>
          </div>
        </header>

        <section className="snippet-stats">
          <article>
            <span>Landingpages</span>
            <strong>{previews.length}</strong>
            <small>mit Google-Vorschau</small>
          </article>

          <article>
            <span>Optimale Titel</span>
            <strong>{optimalTitles}</strong>
            <small>30 bis 65 Zeichen</small>
          </article>

          <article>
            <span>Optimale Beschreibungen</span>
            <strong>
              {optimalDescriptions}
            </strong>
            <small>110 bis 170 Zeichen</small>
          </article>

          <article>
            <span>Vollständig optimiert</span>
            <strong>{fullyOptimized}</strong>
            <small>Titel und Beschreibung</small>
          </article>

          <article>
            <span>Fehlende Felder</span>
            <strong>
              {missingTitles +
                missingDescriptions}
            </strong>
            <small>sofort ergänzen</small>
          </article>
        </section>

        <section className="snippet-panel">
          <div className="panel-heading">
            <div>
              <span>Suchergebnis-Vorschau</span>
              <h2>Alle Landingpages</h2>
            </div>

            <strong>{previews.length}</strong>
          </div>

          {previews.length === 0 ? (
            <div className="empty-state">
              Noch keine SEO-Landingpages vorhanden.
            </div>
          ) : (
            <div className="preview-grid">
              {previews.map((preview) => (
                <article
                  className="preview-card"
                  key={preview.page.id}
                >
                  <div className="preview-top">
                    <div>
                      <span
                        className={`status ${preview.titleStatus.className}`}
                      >
                        Titel:{" "}
                        {preview.titleStatus.label}
                      </span>

                      <span
                        className={`status ${preview.descriptionStatus.className}`}
                      >
                        Beschreibung:{" "}
                        {
                          preview
                            .descriptionStatus
                            .label
                        }
                      </span>
                    </div>

                    <span
                      className={
                        preview.page.status ===
                        "ACTIVE"
                          ? "page-status active"
                          : "page-status draft"
                      }
                    >
                      {preview.page.status ===
                      "ACTIVE"
                        ? "Aktiv"
                        : "Entwurf"}
                    </span>
                  </div>

                  <div className="google-result">
                    <div className="google-source">
                      <span className="google-logo">
                        A
                      </span>

                      <div>
                        <strong>
                          Auftrago
                        </strong>

                        <small>
                          {preview.publicUrl}
                        </small>
                      </div>
                    </div>

                    <h3>
                      {truncateTitle(
                        preview.title
                      )}
                    </h3>

                    <p>
                      {truncateDescription(
                        preview.description
                      )}
                    </p>
                  </div>

                  <div className="length-grid">
                    <div>
                      <span>Titellänge</span>

                      <strong>
                        {
                          preview.page.seoTitle
                            ?.trim().length ?? 0
                        }
                      </strong>

                      <small>Zeichen</small>
                    </div>

                    <div>
                      <span>
                        Beschreibung
                      </span>

                      <strong>
                        {
                          preview.page
                            .seoDescription
                            ?.trim().length ?? 0
                        }
                      </strong>

                      <small>Zeichen</small>
                    </div>

                    <div>
                      <span>Indexierung</span>

                      <strong>
                        {preview.page.indexable
                          ? "Ja"
                          : "Nein"}
                      </strong>

                      <small>
                        Google-Freigabe
                      </small>
                    </div>
                  </div>

                  <div className="preview-footer">
                    <div>
                      <strong>
                        {preview.page.service.name}
                      </strong>

                      <small>
                        {preview.page.city.name}
                      </small>
                    </div>

                    <div>
                      <Link
                        href={`/admin/seo/landingpages/${preview.page.id}`}
                      >
                        Bearbeiten
                      </Link>

                      <Link
                        href={preview.publicPath}
                        target="_blank"
                      >
                        Öffnen
                      </Link>
                    </div>
                  </div>
                </article>
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

        .snippet-page {
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

        .snippet-shell {
          width: min(1500px, calc(100% - 32px));
          margin: 0 auto;
          padding: 36px 0 70px;
        }

        .snippet-header {
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

        .snippet-back {
          display: inline-flex;
          margin-bottom: 20px;
          color: #94a3b8;
          font-size: 13px;
          font-weight: 800;
          text-decoration: none;
        }

        .snippet-kicker {
          display: block;
          margin-bottom: 10px;
          color: #60a5fa;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .snippet-header h1 {
          margin: 0;
          font-size: clamp(40px, 6vw, 66px);
          line-height: 1;
          letter-spacing: -0.045em;
        }

        .snippet-header p {
          max-width: 760px;
          margin: 16px 0 0;
          color: #94a3b8;
          line-height: 1.7;
        }

        .snippet-actions {
          display: flex;
          flex-wrap: wrap;
          justify-content: flex-end;
          gap: 10px;
        }

        .snippet-actions a {
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

        .snippet-stats {
          display: grid;
          grid-template-columns:
            repeat(5, minmax(0, 1fr));
          gap: 13px;
          margin: 20px 0;
        }

        .snippet-stats article {
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

        .snippet-stats span {
          display: block;
          color: #93c5fd;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.07em;
          text-transform: uppercase;
        }

        .snippet-stats strong {
          display: block;
          margin-top: 11px;
          font-size: 32px;
        }

        .snippet-stats small {
          display: block;
          margin-top: 7px;
          color: #64748b;
          font-size: 9px;
        }

        .snippet-panel {
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

        .preview-grid {
          display: grid;
          grid-template-columns:
            repeat(2, minmax(0, 1fr));
          gap: 16px;
        }

        .preview-card {
          padding: 18px;
          border: 1px solid rgba(148, 163, 184, 0.11);
          border-radius: 18px;
          background: rgba(255, 255, 255, 0.025);
        }

        .preview-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 14px;
        }

        .preview-top > div {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .status,
        .page-status {
          display: inline-flex;
          padding: 5px 8px;
          border-radius: 999px;
          font-size: 7px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .status.success,
        .page-status.active {
          background: rgba(34, 197, 94, 0.11);
          color: #86efac;
        }

        .status.warning {
          background: rgba(245, 158, 11, 0.11);
          color: #fde68a;
        }

        .status.critical,
        .page-status.draft {
          background: rgba(239, 68, 68, 0.11);
          color: #fca5a5;
        }

        .google-result {
          padding: 20px;
          border-radius: 15px;
          background: #ffffff;
          color: #202124;
        }

        .google-source {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .google-logo {
          display: grid;
          width: 28px;
          height: 28px;
          place-items: center;
          border-radius: 999px;
          background: #111827;
          color: #ffffff;
          font-size: 11px;
          font-weight: 900;
        }

        .google-source strong {
          display: block;
          font-size: 11px;
        }

        .google-source small {
          display: block;
          max-width: 430px;
          overflow: hidden;
          margin-top: 2px;
          color: #4d5156;
          font-size: 9px;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .google-result h3 {
          margin: 12px 0 0;
          color: #1a0dab;
          font-family: Arial, sans-serif;
          font-size: 20px;
          font-weight: 400;
          line-height: 1.25;
        }

        .google-result p {
          margin: 6px 0 0;
          color: #4d5156;
          font-family: Arial, sans-serif;
          font-size: 12px;
          line-height: 1.5;
        }

        .length-grid {
          display: grid;
          grid-template-columns:
            repeat(3, minmax(0, 1fr));
          gap: 8px;
          margin-top: 12px;
        }

        .length-grid div {
          padding: 11px;
          border-radius: 11px;
          background: rgba(255, 255, 255, 0.025);
        }

        .length-grid span {
          display: block;
          color: #64748b;
          font-size: 7px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .length-grid strong {
          display: block;
          margin-top: 5px;
          font-size: 14px;
        }

        .length-grid small {
          display: block;
          margin-top: 3px;
          color: #64748b;
          font-size: 7px;
        }

        .preview-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          margin-top: 13px;
        }

        .preview-footer > div:first-child strong {
          display: block;
          font-size: 10px;
        }

        .preview-footer > div:first-child small {
          display: block;
          margin-top: 3px;
          color: #64748b;
          font-size: 8px;
        }

        .preview-footer > div:last-child {
          display: flex;
          gap: 7px;
        }

        .preview-footer a {
          display: inline-flex;
          padding: 8px 10px;
          border: 1px solid rgba(148, 163, 184, 0.14);
          border-radius: 8px;
          color: #bfdbfe;
          font-size: 8px;
          font-weight: 900;
          text-decoration: none;
        }

        .empty-state {
          padding: 50px 20px;
          border: 1px dashed rgba(148, 163, 184, 0.16);
          border-radius: 15px;
          color: #64748b;
          text-align: center;
          font-size: 10px;
        }

        @media (max-width: 1100px) {
          .snippet-stats {
            grid-template-columns:
              repeat(3, minmax(0, 1fr));
          }

          .preview-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 800px) {
          .snippet-header {
            align-items: flex-start;
            flex-direction: column;
          }

          .snippet-actions {
            justify-content: flex-start;
          }
        }

        @media (max-width: 600px) {
          .snippet-shell {
            width: calc(100% - 20px);
            padding-top: 14px;
          }

          .snippet-header,
          .snippet-panel {
            padding: 20px;
            border-radius: 21px;
          }

          .snippet-stats {
            grid-template-columns:
              repeat(2, minmax(0, 1fr));
          }

          .snippet-actions {
            width: 100%;
          }

          .snippet-actions a {
            flex: 1;
          }

          .length-grid {
            grid-template-columns: 1fr;
          }

          .preview-footer {
            align-items: flex-start;
            flex-direction: column;
          }
        }

        @media (max-width: 420px) {
          .snippet-stats {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </main>
  );
}
