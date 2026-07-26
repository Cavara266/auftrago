import Link from "next/link";

import { prisma } from "@/lib/prisma";

import AuditRepairButton from "./repair-button";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

type Severity = "critical" | "warning" | "info";

type AuditIssue = {
  id: string;
  severity: Severity;
  title: string;
  description: string;
  pageName: string;
  publicPath: string;
  adminPath: string;
};

function countWords(value: string | null | undefined) {
  if (!value?.trim()) {
    return 0;
  }

  return value
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

function normalizeValue(
  value: string | null | undefined
) {
  return value?.trim().toLowerCase() ?? "";
}

function getSeverityLabel(severity: Severity) {
  if (severity === "critical") {
    return "Kritisch";
  }

  if (severity === "warning") {
    return "Warnung";
  }

  return "Hinweis";
}

export default async function SeoAuditPage() {
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
            priceMinCents: true,
            priceMaxCents: true,
            faqs: {
              where: {
                status: "ACTIVE",
              },
              select: {
                id: true,
              },
            },
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

  const titleGroups = new Map<
    string,
    typeof landingPages
  >();

  const descriptionGroups = new Map<
    string,
    typeof landingPages
  >();

  for (const page of landingPages) {
    const title = normalizeValue(page.seoTitle);
    const description = normalizeValue(
      page.seoDescription
    );

    if (title) {
      const pages = titleGroups.get(title) ?? [];
      pages.push(page);
      titleGroups.set(title, pages);
    }

    if (description) {
      const pages =
        descriptionGroups.get(description) ?? [];

      pages.push(page);
      descriptionGroups.set(
        description,
        pages
      );
    }
  }

  const duplicateTitleIds = new Set(
    Array.from(titleGroups.values())
      .filter((pages) => pages.length > 1)
      .flatMap((pages) =>
        pages.map((page) => page.id)
      )
  );

  const duplicateDescriptionIds = new Set(
    Array.from(descriptionGroups.values())
      .filter((pages) => pages.length > 1)
      .flatMap((pages) =>
        pages.map((page) => page.id)
      )
  );

  const issues: AuditIssue[] = [];

  for (const page of landingPages) {
    const pageName =
      page.headline ||
      `${page.service.name} in ${page.city.name}`;

    const publicPath =
      `/dienstleistung/${page.service.slug}/${page.city.slug}`;

    const adminPath =
      `/admin/seo/landingpages/${page.id}`;

    const wordCount =
      countWords(page.introduction) +
      countWords(page.content);

    const priceMin =
      page.customPriceMinCents ??
      page.service.priceMinCents;

    const priceMax =
      page.customPriceMaxCents ??
      page.service.priceMaxCents;

    if (!page.seoTitle?.trim()) {
      issues.push({
        id: `${page.id}-missing-title`,
        severity: "critical",
        title: "SEO-Titel fehlt",
        description:
          "Die Landingpage besitzt keinen SEO-Titel.",
        pageName,
        publicPath,
        adminPath,
      });
    } else {
      if (page.seoTitle.trim().length < 30) {
        issues.push({
          id: `${page.id}-short-title`,
          severity: "warning",
          title: "SEO-Titel ist zu kurz",
          description:
            `${page.seoTitle.trim().length} Zeichen. ` +
            "Empfohlen sind ungefähr 30 bis 65 Zeichen.",
          pageName,
          publicPath,
          adminPath,
        });
      }

      if (page.seoTitle.trim().length > 65) {
        issues.push({
          id: `${page.id}-long-title`,
          severity: "warning",
          title: "SEO-Titel ist zu lang",
          description:
            `${page.seoTitle.trim().length} Zeichen. ` +
            "Der Titel könnte in Google abgeschnitten werden.",
          pageName,
          publicPath,
          adminPath,
        });
      }
    }

    if (!page.seoDescription?.trim()) {
      issues.push({
        id: `${page.id}-missing-description`,
        severity: "critical",
        title: "Meta-Beschreibung fehlt",
        description:
          "Die Landingpage besitzt keine Meta-Beschreibung.",
        pageName,
        publicPath,
        adminPath,
      });
    } else {
      if (
        page.seoDescription.trim().length < 110
      ) {
        issues.push({
          id: `${page.id}-short-description`,
          severity: "warning",
          title: "Meta-Beschreibung ist zu kurz",
          description:
            `${page.seoDescription.trim().length} Zeichen. ` +
            "Empfohlen sind ungefähr 110 bis 170 Zeichen.",
          pageName,
          publicPath,
          adminPath,
        });
      }

      if (
        page.seoDescription.trim().length > 170
      ) {
        issues.push({
          id: `${page.id}-long-description`,
          severity: "warning",
          title: "Meta-Beschreibung ist zu lang",
          description:
            `${page.seoDescription.trim().length} Zeichen. ` +
            "Die Beschreibung könnte abgeschnitten werden.",
          pageName,
          publicPath,
          adminPath,
        });
      }
    }

    if (duplicateTitleIds.has(page.id)) {
      issues.push({
        id: `${page.id}-duplicate-title`,
        severity: "critical",
        title: "Doppelter SEO-Titel",
        description:
          "Dieser SEO-Titel wird auf mehreren Landingpages verwendet.",
        pageName,
        publicPath,
        adminPath,
      });
    }

    if (
      duplicateDescriptionIds.has(page.id)
    ) {
      issues.push({
        id: `${page.id}-duplicate-description`,
        severity: "warning",
        title: "Doppelte Meta-Beschreibung",
        description:
          "Diese Meta-Beschreibung wird auf mehreren Landingpages verwendet.",
        pageName,
        publicPath,
        adminPath,
      });
    }

    if (!page.headline?.trim()) {
      issues.push({
        id: `${page.id}-missing-headline`,
        severity: "critical",
        title: "H1-Überschrift fehlt",
        description:
          "Die Landingpage besitzt keine Hauptüberschrift.",
        pageName,
        publicPath,
        adminPath,
      });
    }

    if (wordCount < 250) {
      issues.push({
        id: `${page.id}-thin-content`,
        severity:
          wordCount < 100
            ? "critical"
            : "warning",
        title: "Zu wenig Inhalt",
        description:
          `Die Landingpage enthält ungefähr ${wordCount} Wörter. ` +
          "Empfohlen sind mindestens 250 Wörter.",
        pageName,
        publicPath,
        adminPath,
      });
    }

    if (!page.canonicalUrl?.trim()) {
      issues.push({
        id: `${page.id}-missing-canonical`,
        severity: "critical",
        title: "Canonical URL fehlt",
        description:
          "Google erhält keine eindeutige Haupt-URL.",
        pageName,
        publicPath,
        adminPath,
      });
    } else {
      const expectedCanonical =
        `https://www.auftrago.ch${publicPath}`;

      if (
        page.canonicalUrl.trim() !==
        expectedCanonical
      ) {
        issues.push({
          id: `${page.id}-wrong-canonical`,
          severity: "warning",
          title: "Canonical URL weicht ab",
          description:
            `Erwartet: ${expectedCanonical}`,
          pageName,
          publicPath,
          adminPath,
        });
      }
    }

    if (page.status !== "ACTIVE") {
      issues.push({
        id: `${page.id}-draft`,
        severity: "info",
        title: "Landingpage ist nicht veröffentlicht",
        description:
          "Die Seite besitzt noch den Status Entwurf.",
        pageName,
        publicPath,
        adminPath,
      });
    }

    if (!page.indexable) {
      issues.push({
        id: `${page.id}-noindex`,
        severity: "warning",
        title: "Landingpage ist auf noindex",
        description:
          "Die Seite darf aktuell nicht von Suchmaschinen indexiert werden.",
        pageName,
        publicPath,
        adminPath,
      });
    }

    if (
      page.city.status !== "ACTIVE" ||
      !page.city.indexable
    ) {
      issues.push({
        id: `${page.id}-city-inactive`,
        severity: "warning",
        title: "Stadt ist nicht vollständig aktiv",
        description:
          "Die zugehörige Stadt ist inaktiv oder nicht indexierbar.",
        pageName,
        publicPath,
        adminPath,
      });
    }

    if (
      page.service.status !== "ACTIVE" ||
      !page.service.indexable
    ) {
      issues.push({
        id: `${page.id}-service-inactive`,
        severity: "warning",
        title:
          "Dienstleistung ist nicht vollständig aktiv",
        description:
          "Die zugehörige Dienstleistung ist inaktiv oder nicht indexierbar.",
        pageName,
        publicPath,
        adminPath,
      });
    }

    if (
      priceMin == null ||
      priceMax == null
    ) {
      issues.push({
        id: `${page.id}-missing-price`,
        severity: "warning",
        title: "Preisangaben fehlen",
        description:
          "Für diese Landingpage fehlen Mindest- oder Höchstpreise.",
        pageName,
        publicPath,
        adminPath,
      });
    }

    if (
      page.service.faqs.length === 0
    ) {
      issues.push({
        id: `${page.id}-missing-faq`,
        severity: "warning",
        title: "Keine aktive FAQ vorhanden",
        description:
          "Für diese Dienstleistung wurde keine aktive FAQ gefunden.",
        pageName,
        publicPath,
        adminPath,
      });
    }
  }

  const criticalIssues = issues.filter(
    (issue) => issue.severity === "critical"
  );

  const warningIssues = issues.filter(
    (issue) => issue.severity === "warning"
  );

  const infoIssues = issues.filter(
    (issue) => issue.severity === "info"
  );

  const healthyPageIds = new Set(
    landingPages
      .filter(
        (page) =>
          !issues.some((issue) =>
            issue.id.startsWith(`${page.id}-`)
          )
      )
      .map((page) => page.id)
  );

  const auditScore =
    landingPages.length === 0
      ? 100
      : Math.max(
          0,
          Math.round(
            100 -
              (criticalIssues.length * 5 +
                warningIssues.length * 2 +
                infoIssues.length) /
                landingPages.length
          )
        );

  return (
    <main className="audit-page">
      <div className="audit-shell">
        <header className="audit-header">
          <div>
            <Link
              href="/admin/seo"
              className="audit-back"
            >
              ← Zurück zum SEO Center
            </Link>

            <span className="audit-kicker">
              Technische SEO-Prüfung
            </span>

            <h1>SEO Audit Center</h1>

            <p>
              Prüfe alle Landingpages automatisch auf
              technische Fehler, doppelte Inhalte,
              unvollständige Metadaten und fehlende
              Indexierungssignale.
            </p>
          </div>

          <div className="audit-actions">
            <AuditRepairButton />

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

        <section className="audit-score">
          <div
            className={`score-circle ${
              auditScore >= 85
                ? "excellent"
                : auditScore >= 65
                  ? "medium"
                  : "bad"
            }`}
          >
            <strong>{auditScore}</strong>
            <span>/ 100</span>
          </div>

          <div>
            <span>Gesamtbewertung</span>

            <h2>
              {auditScore >= 85
                ? "Sehr guter SEO-Zustand"
                : auditScore >= 65
                  ? "SEO-Optimierung empfohlen"
                  : "Dringender Handlungsbedarf"}
            </h2>

            <p>
              {landingPages.length} Landingpages wurden
              geprüft. Dabei wurden {issues.length} Hinweise
              gefunden.
            </p>
          </div>
        </section>

        <section className="audit-stats">
          <article>
            <span>Landingpages</span>
            <strong>{landingPages.length}</strong>
            <small>vollständig geprüft</small>
          </article>

          <article className="critical-card">
            <span>Kritische Fehler</span>
            <strong>{criticalIssues.length}</strong>
            <small>sofort beheben</small>
          </article>

          <article className="warning-card">
            <span>Warnungen</span>
            <strong>{warningIssues.length}</strong>
            <small>Optimierung empfohlen</small>
          </article>

          <article>
            <span>Hinweise</span>
            <strong>{infoIssues.length}</strong>
            <small>nicht dringend</small>
          </article>

          <article className="healthy-card">
            <span>Fehlerfreie Seiten</span>
            <strong>{healthyPageIds.size}</strong>
            <small>ohne erkannte Probleme</small>
          </article>
        </section>

        <section className="audit-panel">
          <div className="panel-heading">
            <div>
              <span>Audit-Ergebnisse</span>
              <h2>Gefundene SEO-Probleme</h2>
            </div>

            <strong>{issues.length}</strong>
          </div>

          {issues.length === 0 ? (
            <div className="empty-state">
              <strong>
                Keine SEO-Probleme gefunden
              </strong>

              <p>
                Alle geprüften Landingpages erfüllen die
                aktuellen Audit-Regeln.
              </p>
            </div>
          ) : (
            <div className="issue-list">
              {issues.map((issue) => (
                <article
                  key={issue.id}
                  className={`issue-row ${issue.severity}`}
                >
                  <div className="issue-status">
                    <span>
                      {getSeverityLabel(
                        issue.severity
                      )}
                    </span>
                  </div>

                  <div className="issue-content">
                    <strong>{issue.title}</strong>

                    <p>{issue.description}</p>

                    <small>{issue.pageName}</small>
                  </div>

                  <div className="issue-actions">
                    <Link href={issue.adminPath}>
                      Bearbeiten
                    </Link>

                    <Link
                      href={issue.publicPath}
                      target="_blank"
                    >
                      Öffnen
                    </Link>
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

        .audit-page {
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

        .audit-shell {
          width: min(1500px, calc(100% - 32px));
          margin: 0 auto;
          padding: 36px 0 70px;
        }

        .audit-header {
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

        .audit-back {
          display: inline-flex;
          margin-bottom: 20px;
          color: #94a3b8;
          font-size: 13px;
          font-weight: 800;
          text-decoration: none;
        }

        .audit-kicker {
          display: block;
          margin-bottom: 10px;
          color: #60a5fa;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .audit-header h1 {
          margin: 0;
          font-size: clamp(40px, 6vw, 66px);
          line-height: 1;
          letter-spacing: -0.045em;
        }

        .audit-header p {
          max-width: 760px;
          margin: 16px 0 0;
          color: #94a3b8;
          line-height: 1.7;
        }

        .audit-actions {
          display: flex;
          flex-wrap: wrap;
          justify-content: flex-end;
          gap: 10px;
        }

        .audit-actions a {
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

        .audit-score {
          display: flex;
          align-items: center;
          gap: 24px;
          margin-top: 20px;
          padding: 25px;
          border: 1px solid rgba(148, 163, 184, 0.13);
          border-radius: 24px;
          background:
            linear-gradient(
              145deg,
              rgba(15, 23, 42, 0.94),
              rgba(6, 9, 20, 0.98)
            );
        }

        .score-circle {
          display: flex;
          width: 120px;
          height: 120px;
          flex-shrink: 0;
          align-items: baseline;
          justify-content: center;
          border: 9px solid;
          border-radius: 999px;
          padding-top: 31px;
          box-sizing: border-box;
        }

        .score-circle.excellent {
          border-color: #22c55e;
          color: #86efac;
        }

        .score-circle.medium {
          border-color: #f59e0b;
          color: #fde68a;
        }

        .score-circle.bad {
          border-color: #ef4444;
          color: #fca5a5;
        }

        .score-circle strong {
          font-size: 35px;
        }

        .score-circle span {
          font-size: 11px;
        }

        .audit-score > div:last-child > span {
          color: #60a5fa;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .audit-score h2 {
          margin: 7px 0 0;
          font-size: 26px;
        }

        .audit-score p {
          margin: 8px 0 0;
          color: #7c8aa0;
          font-size: 11px;
          line-height: 1.6;
        }

        .audit-stats {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 13px;
          margin: 20px 0;
        }

        .audit-stats article {
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

        .audit-stats span {
          display: block;
          color: #93c5fd;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.07em;
          text-transform: uppercase;
        }

        .audit-stats strong {
          display: block;
          margin-top: 11px;
          font-size: 32px;
        }

        .audit-stats small {
          display: block;
          margin-top: 7px;
          color: #64748b;
          font-size: 9px;
        }

        .critical-card strong {
          color: #fca5a5;
        }

        .warning-card strong {
          color: #fde68a;
        }

        .healthy-card strong {
          color: #86efac;
        }

        .audit-panel {
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

        .issue-list {
          display: grid;
          gap: 9px;
        }

        .issue-row {
          display: grid;
          grid-template-columns: 90px minmax(0, 1fr) auto;
          gap: 15px;
          align-items: center;
          padding: 15px;
          border: 1px solid transparent;
          border-radius: 14px;
        }

        .issue-row.critical {
          border-color: rgba(239, 68, 68, 0.12);
          background: rgba(239, 68, 68, 0.045);
        }

        .issue-row.warning {
          border-color: rgba(245, 158, 11, 0.12);
          background: rgba(245, 158, 11, 0.04);
        }

        .issue-row.info {
          border-color: rgba(59, 130, 246, 0.12);
          background: rgba(59, 130, 246, 0.04);
        }

        .issue-status span {
          display: inline-flex;
          padding: 6px 9px;
          border-radius: 999px;
          font-size: 8px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .critical .issue-status span {
          background: rgba(239, 68, 68, 0.12);
          color: #fca5a5;
        }

        .warning .issue-status span {
          background: rgba(245, 158, 11, 0.12);
          color: #fde68a;
        }

        .info .issue-status span {
          background: rgba(59, 130, 246, 0.12);
          color: #93c5fd;
        }

        .issue-content strong {
          display: block;
          font-size: 11px;
        }

        .issue-content p {
          margin: 5px 0 0;
          color: #94a3b8;
          font-size: 9px;
          line-height: 1.5;
        }

        .issue-content small {
          display: block;
          margin-top: 5px;
          color: #64748b;
          font-size: 8px;
        }

        .issue-actions {
          display: flex;
          gap: 7px;
        }

        .issue-actions a {
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
          padding: 55px 20px;
          border: 1px dashed rgba(34, 197, 94, 0.25);
          border-radius: 16px;
          text-align: center;
        }

        .empty-state strong {
          display: block;
          color: #86efac;
          font-size: 16px;
        }

        .empty-state p {
          margin: 8px 0 0;
          color: #64748b;
          font-size: 10px;
        }

        @media (max-width: 1100px) {
          .audit-stats {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }

        @media (max-width: 800px) {
          .audit-header {
            align-items: flex-start;
            flex-direction: column;
          }

          .audit-actions {
            justify-content: flex-start;
          }

          .issue-row {
            grid-template-columns: 80px minmax(0, 1fr);
          }

          .issue-actions {
            grid-column: 2;
          }
        }

        @media (max-width: 600px) {
          .audit-shell {
            width: calc(100% - 20px);
            padding-top: 14px;
          }

          .audit-header,
          .audit-panel,
          .audit-score {
            padding: 20px;
            border-radius: 21px;
          }

          .audit-score {
            align-items: flex-start;
            flex-direction: column;
          }

          .audit-stats {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .audit-actions {
            width: 100%;
          }

          .audit-actions a {
            flex: 1;
          }

          .issue-row {
            grid-template-columns: 1fr;
          }

          .issue-actions {
            grid-column: auto;
          }
        }

        @media (max-width: 420px) {
          .audit-stats {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </main>
  );
}
