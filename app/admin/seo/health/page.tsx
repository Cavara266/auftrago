import Link from "next/link";

import { prisma } from "@/lib/prisma";
import OptimizeButton from "./optimize-button";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

type SeoCheck = {
  label: string;
  passed: boolean;
  points: number;
  detail: string;
};

function getSeoChecks(page: {
  headline: string | null;
  introduction: string | null;
  content: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  canonicalUrl: string | null;
  customPriceMinCents: number | null;
  customPriceMaxCents: number | null;
  indexable: boolean;
  status: string;
  city: {
    name: string;
    status: string;
    indexable: boolean;
    introduction: string | null;
    localContent: string | null;
  };
  service: {
    name: string;
    status: string;
    indexable: boolean;
    priceMinCents: number | null;
    priceMaxCents: number | null;
    faqs: Array<{
      id: string;
    }>;
  };
}): SeoCheck[] {
  const titleLength = page.seoTitle?.trim().length ?? 0;
  const descriptionLength =
    page.seoDescription?.trim().length ?? 0;

  const fullContent = [
    page.introduction,
    page.content,
    page.city.introduction,
    page.city.localContent,
  ]
    .filter(Boolean)
    .join(" ");

  const wordCount = fullContent
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

  const hasPrice =
    (page.customPriceMinCents !== null &&
      page.customPriceMaxCents !== null) ||
    (page.service.priceMinCents !== null &&
      page.service.priceMaxCents !== null);

  return [
    {
      label: "SEO-Titel",
      passed: titleLength >= 30 && titleLength <= 65,
      points: 15,
      detail:
        titleLength === 0
          ? "SEO-Titel fehlt."
          : `${titleLength} Zeichen – empfohlen sind 30 bis 65 Zeichen.`,
    },
    {
      label: "Meta Description",
      passed:
        descriptionLength >= 110 &&
        descriptionLength <= 170,
      points: 15,
      detail:
        descriptionLength === 0
          ? "Meta Description fehlt."
          : `${descriptionLength} Zeichen – empfohlen sind 110 bis 170 Zeichen.`,
    },
    {
      label: "Canonical URL",
      passed: Boolean(
        page.canonicalUrl?.startsWith("https://")
      ),
      points: 10,
      detail: page.canonicalUrl
        ? page.canonicalUrl
        : "Canonical URL fehlt.",
    },
    {
      label: "H1 / Überschrift",
      passed: Boolean(page.headline?.trim()),
      points: 10,
      detail: page.headline
        ? page.headline
        : "Überschrift fehlt.",
    },
    {
      label: "Seiteninhalt",
      passed: wordCount >= 120,
      points: 15,
      detail: `${wordCount} Wörter – mindestens 120 Wörter empfohlen.`,
    },
    {
      label: "Preisbereich",
      passed: hasPrice,
      points: 10,
      detail: hasPrice
        ? "Preisbereich vorhanden."
        : "Preisbereich fehlt.",
    },
    {
      label: "FAQ",
      passed: page.service.faqs.length >= 3,
      points: 10,
      detail: `${page.service.faqs.length} FAQ vorhanden – mindestens 3 empfohlen.`,
    },
    {
      label: "Indexierung",
      passed:
        page.indexable &&
        page.city.indexable &&
        page.service.indexable,
      points: 5,
      detail:
        page.indexable &&
        page.city.indexable &&
        page.service.indexable
          ? "Seite kann indexiert werden."
          : "Mindestens ein Indexierungs-Schalter ist deaktiviert.",
    },
    {
      label: "Status",
      passed:
        page.status === "ACTIVE" &&
        page.city.status === "ACTIVE" &&
        page.service.status === "ACTIVE",
      points: 10,
      detail:
        page.status === "ACTIVE" &&
        page.city.status === "ACTIVE" &&
        page.service.status === "ACTIVE"
          ? "Landingpage, Stadt und Dienstleistung sind aktiv."
          : "Mindestens ein Datensatz ist nicht aktiv.",
    },
  ];
}

function getScore(checks: SeoCheck[]) {
  return checks.reduce(
    (total, check) =>
      total + (check.passed ? check.points : 0),
    0
  );
}

function scoreClass(score: number) {
  if (score >= 90) return "excellent";
  if (score >= 70) return "good";
  if (score >= 50) return "warning";
  return "critical";
}

function scoreLabel(score: number) {
  if (score >= 90) return "Sehr gut";
  if (score >= 70) return "Gut";
  if (score >= 50) return "Optimieren";
  return "Kritisch";
}

export default async function SeoHealthPage() {
  const pages = await prisma.seoLandingPage.findMany({
    include: {
      city: {
        select: {
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

  const auditedPages = pages.map((page) => {
    const checks = getSeoChecks(page);
    const score = getScore(checks);

    return {
      ...page,
      checks,
      score,
    };
  });

  const averageScore =
    auditedPages.length > 0
      ? Math.round(
          auditedPages.reduce(
            (sum, page) => sum + page.score,
            0
          ) / auditedPages.length
        )
      : 0;

  const excellentCount = auditedPages.filter(
    (page) => page.score >= 90
  ).length;

  const warningCount = auditedPages.filter(
    (page) => page.score >= 50 && page.score < 70
  ).length;

  const criticalCount = auditedPages.filter(
    (page) => page.score < 50
  ).length;

  const failedChecks = auditedPages.reduce(
    (sum, page) =>
      sum +
      page.checks.filter((check) => !check.passed).length,
    0
  );

  return (
    <main className="health-page">
      <div className="health-shell">
        <header className="health-header">
          <div>
            <Link href="/admin/seo" className="health-back">
              ← Zurück zum SEO Center
            </Link>

            <span className="health-kicker">
              SEO Qualitätsprüfung
            </span>

            <h1>SEO Health Center</h1>

            <p>
              Prüfe Landingpages automatisch auf Inhalte,
              Metadaten, Indexierung, Preise und FAQ.
            </p>
          </div>

          <div className="health-header-actions">
            <OptimizeButton mode="all" />

            <Link href="/admin/seo/landingpages">
              Landingpages verwalten
            </Link>

            <Link href="/sitemap.xml" target="_blank">
              Sitemap öffnen
            </Link>
          </div>
        </header>

        <section className="health-stats">
          <article>
            <span>Durchschnittlicher Score</span>
            <strong>{averageScore}/100</strong>
          </article>

          <article>
            <span>Sehr gute Seiten</span>
            <strong>{excellentCount}</strong>
          </article>

          <article>
            <span>Optimierung nötig</span>
            <strong>{warningCount}</strong>
          </article>

          <article>
            <span>Kritische Seiten</span>
            <strong>{criticalCount}</strong>
          </article>

          <article>
            <span>Offene Prüfungen</span>
            <strong>{failedChecks}</strong>
          </article>
        </section>

        {auditedPages.length === 0 ? (
          <section className="health-empty">
            <div>📊</div>
            <h2>Noch keine Landingpages vorhanden</h2>
            <p>
              Erzeuge zuerst Landingpages und starte danach
              die automatische Qualitätsprüfung.
            </p>

            <Link href="/admin/seo/landingpages">
              Landingpages erstellen
            </Link>
          </section>
        ) : (
          <section className="health-list">
            {auditedPages.map((page) => {
              const publicUrl =
                `/dienstleistung/${page.service.slug}/${page.city.slug}`;

              return (
                <article
                  className="health-card"
                  key={page.id}
                >
                  <div className="health-card-header">
                    <div>
                      <span>
                        {page.service.name} · {page.city.name}
                      </span>

                      <h2>
                        {page.headline ||
                          `${page.service.name} in ${page.city.name}`}
                      </h2>

                      <p>{publicUrl}</p>
                    </div>

                    <div
                      className={`health-score ${scoreClass(
                        page.score
                      )}`}
                    >
                      <strong>{page.score}</strong>
                      <span>/100</span>
                      <small>
                        {scoreLabel(page.score)}
                      </small>
                    </div>
                  </div>

                  <div className="health-check-grid">
                    {page.checks.map((check) => (
                      <div
                        className={
                          check.passed
                            ? "health-check passed"
                            : "health-check failed"
                        }
                        key={check.label}
                      >
                        <div className="health-check-icon">
                          {check.passed ? "✓" : "!"}
                        </div>

                        <div>
                          <strong>{check.label}</strong>
                          <p>{check.detail}</p>
                        </div>

                        <span>
                          {check.passed
                            ? `+${check.points}`
                            : `0/${check.points}`}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="health-card-actions">
                    <OptimizeButton
                      mode="single"
                      landingPageId={page.id}
                    />

                    <Link
                      href={publicUrl}
                      target="_blank"
                    >
                      Öffentliche Seite öffnen
                    </Link>

                    <Link href="/admin/seo/landingpages">
                      Landingpage verwalten
                    </Link>

                    <Link
                      href={`/admin/seo/services/${page.serviceId}/edit`}
                    >
                      Dienstleistung bearbeiten
                    </Link>

                    <Link
                      href={`/admin/seo/cities/${page.cityId}/edit`}
                    >
                      Stadt bearbeiten
                    </Link>
                  </div>
                </article>
              );
            })}
          </section>
        )}
      </div>

      <style suppressHydrationWarning>{`
        :global(body) {
          margin: 0;
          background: #050711;
        }

        .health-page {
          min-height: 100vh;
          background:
            radial-gradient(
              circle at top right,
              rgba(14, 165, 233, 0.13),
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

        .health-shell {
          width: min(1500px, calc(100% - 32px));
          margin: 0 auto;
          padding: 36px 0 70px;
        }

        .health-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 26px;
          margin-bottom: 22px;
          padding: 30px;
          border: 1px solid rgba(148, 163, 184, 0.14);
          border-radius: 28px;
          background:
            linear-gradient(
              145deg,
              rgba(15, 23, 42, 0.95),
              rgba(6, 9, 20, 0.98)
            );
        }

        .health-back {
          display: inline-flex;
          margin-bottom: 20px;
          color: #94a3b8;
          font-size: 13px;
          font-weight: 800;
          text-decoration: none;
        }

        .health-kicker {
          display: block;
          margin-bottom: 10px;
          color: #38bdf8;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .health-header h1 {
          margin: 0;
          font-size: clamp(40px, 6vw, 66px);
          line-height: 1;
          letter-spacing: -0.045em;
        }

        .health-header p {
          max-width: 760px;
          margin: 16px 0 0;
          color: #94a3b8;
          line-height: 1.7;
        }

        .health-header-actions {
          display: flex;
          flex-wrap: wrap;
          justify-content: flex-end;
          gap: 10px;
        }

        .health-header-actions a {
          display: inline-flex;
          min-height: 48px;
          align-items: center;
          justify-content: center;
          padding: 0 17px;
          border: 1px solid rgba(148, 163, 184, 0.18);
          border-radius: 13px;
          background: rgba(255, 255, 255, 0.04);
          color: #ffffff;
          font-size: 12px;
          font-weight: 900;
          text-decoration: none;
        }

        .health-stats {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 14px;
          margin-bottom: 22px;
        }

        .health-stats article {
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

        .health-stats span {
          display: block;
          min-height: 27px;
          color: #7dd3fc;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.08em;
          line-height: 1.4;
          text-transform: uppercase;
        }

        .health-stats strong {
          display: block;
          margin-top: 12px;
          font-size: 31px;
        }

        .health-empty {
          padding: 80px 24px;
          border: 1px solid rgba(148, 163, 184, 0.14);
          border-radius: 26px;
          background: rgba(8, 12, 25, 0.96);
          text-align: center;
        }

        .health-empty > div {
          font-size: 48px;
        }

        .health-empty h2 {
          margin: 18px 0 0;
          font-size: 27px;
        }

        .health-empty p {
          max-width: 560px;
          margin: 12px auto 0;
          color: #8491a6;
          line-height: 1.7;
        }

        .health-empty a {
          display: inline-flex;
          margin-top: 25px;
          padding: 14px 18px;
          border-radius: 13px;
          background: #2563eb;
          color: #ffffff;
          font-size: 13px;
          font-weight: 900;
          text-decoration: none;
        }

        .health-list {
          display: grid;
          gap: 20px;
        }

        .health-card {
          overflow: hidden;
          border: 1px solid rgba(148, 163, 184, 0.14);
          border-radius: 26px;
          background:
            linear-gradient(
              145deg,
              rgba(255, 255, 255, 0.04),
              rgba(8, 12, 25, 0.98)
            );
        }

        .health-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          padding: 25px;
          border-bottom: 1px solid rgba(148, 163, 184, 0.1);
        }

        .health-card-header > div:first-child > span {
          display: block;
          margin-bottom: 8px;
          color: #7dd3fc;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .health-card-header h2 {
          margin: 0;
          font-size: 24px;
        }

        .health-card-header p {
          margin: 8px 0 0;
          color: #64748b;
          font-size: 12px;
        }

        .health-score {
          display: grid;
          min-width: 112px;
          min-height: 112px;
          place-content: center;
          border: 1px solid;
          border-radius: 999px;
          text-align: center;
        }

        .health-score strong {
          font-size: 31px;
          line-height: 1;
        }

        .health-score > span {
          margin-top: 2px;
          font-size: 10px;
        }

        .health-score small {
          margin-top: 5px;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .health-score.excellent {
          border-color: rgba(34, 197, 94, 0.35);
          background: rgba(34, 197, 94, 0.08);
          color: #86efac;
        }

        .health-score.good {
          border-color: rgba(59, 130, 246, 0.35);
          background: rgba(59, 130, 246, 0.08);
          color: #93c5fd;
        }

        .health-score.warning {
          border-color: rgba(245, 158, 11, 0.35);
          background: rgba(245, 158, 11, 0.08);
          color: #fcd34d;
        }

        .health-score.critical {
          border-color: rgba(239, 68, 68, 0.35);
          background: rgba(239, 68, 68, 0.08);
          color: #fca5a5;
        }

        .health-check-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 12px;
          padding: 22px;
        }

        .health-check {
          display: grid;
          grid-template-columns: 34px minmax(0, 1fr) auto;
          gap: 11px;
          align-items: start;
          padding: 16px;
          border: 1px solid rgba(148, 163, 184, 0.1);
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.025);
        }

        .health-check-icon {
          display: grid;
          width: 31px;
          height: 31px;
          place-items: center;
          border-radius: 999px;
          font-size: 13px;
          font-weight: 900;
        }

        .health-check.passed .health-check-icon {
          background: rgba(34, 197, 94, 0.12);
          color: #86efac;
        }

        .health-check.failed .health-check-icon {
          background: rgba(239, 68, 68, 0.12);
          color: #fca5a5;
        }

        .health-check strong {
          display: block;
          font-size: 12px;
        }

        .health-check p {
          margin: 6px 0 0;
          color: #768399;
          font-size: 10px;
          line-height: 1.5;
        }

        .health-check > span {
          color: #64748b;
          font-size: 9px;
          font-weight: 900;
        }

        .health-card-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 9px;
          padding: 0 22px 22px;
        }

        .health-card-actions a {
          display: inline-flex;
          min-height: 38px;
          align-items: center;
          padding: 0 12px;
          border: 1px solid rgba(148, 163, 184, 0.16);
          border-radius: 10px;
          color: #cbd5e1;
          font-size: 10px;
          font-weight: 900;
          text-decoration: none;
        }

        @media (max-width: 1100px) {
          .health-stats {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }

          .health-check-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 760px) {
          .health-header,
          .health-card-header {
            align-items: flex-start;
            flex-direction: column;
          }

          .health-header-actions {
            width: 100%;
            justify-content: flex-start;
          }

          .health-header-actions a {
            flex: 1;
          }

          .health-stats {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .health-check-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 520px) {
          .health-shell {
            width: calc(100% - 20px);
            padding-top: 14px;
          }

          .health-header {
            padding: 20px;
            border-radius: 22px;
          }

          .health-stats {
            grid-template-columns: 1fr;
          }

          .health-header-actions a {
            width: 100%;
            flex: auto;
          }

          .health-score {
            min-width: 94px;
            min-height: 94px;
          }
        }
      `}</style>
    </main>
  );
}
