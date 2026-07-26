import Link from "next/link";

import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

type SearchParams = {
  query?: string;
  status?: string;
  issue?: string;
};

type LandingPageRecord = Awaited<
  ReturnType<typeof getLandingPages>
>[number];

async function getLandingPages() {
  return prisma.seoLandingPage.findMany({
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
        service: {
          name: "asc",
        },
      },
      {
        city: {
          name: "asc",
        },
      },
    ],
  });
}

function getPublicPath(page: LandingPageRecord) {
  return (
    `/dienstleistung/` +
    `${page.service.slug}/` +
    `${page.city.slug}`
  );
}

function getPageTitle(page: LandingPageRecord) {
  return (
    page.headline?.trim() ||
    page.seoTitle?.trim() ||
    `${page.service.name} in ${page.city.name}`
  );
}

function normalizeContent(page: LandingPageRecord) {
  return [
    page.introduction,
    page.content,
    page.seoDescription,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function hasInternalLink(
  source: LandingPageRecord,
  target: LandingPageRecord
) {
  const content = normalizeContent(source);

  if (!content) {
    return false;
  }

  const publicPath =
    getPublicPath(target).toLowerCase();

  const absoluteUrl =
    `https://www.auftrago.ch${publicPath}`;

  return (
    content.includes(publicPath) ||
    content.includes(absoluteUrl)
  );
}

function createAnchorText(
  source: LandingPageRecord,
  target: LandingPageRecord
) {
  if (
    source.service.id ===
    target.service.id
  ) {
    return (
      `${target.service.name} ` +
      `in ${target.city.name}`
    );
  }

  return (
    `${target.service.name} ` +
    `in ${target.city.name}`
  );
}

function createSuggestionText(
  source: LandingPageRecord,
  target: LandingPageRecord
) {
  const anchorText =
    createAnchorText(source, target);

  if (
    source.service.id ===
    target.service.id
  ) {
    return (
      `Benötigst du diese Dienstleistung in einer anderen Region? ` +
      `Informiere dich auch über ${anchorText}.`
    );
  }

  return (
    `Entdecke zusätzlich passende Anbieter für ` +
    `${anchorText}.`
  );
}

function calculateScore(
  totalPages: number,
  linkedPages: number
) {
  if (totalPages === 0) {
    return 100;
  }

  return Math.round(
    (linkedPages / totalPages) * 100
  );
}

export default async function SeoLinksPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const query =
    searchParams.query?.trim().toLowerCase() ??
    "";

  const status =
    searchParams.status ?? "ALL";

  const issue =
    searchParams.issue ?? "ALL";

  const allPages = await getLandingPages();

  const analyses = allPages.map((page) => {
    const sameServicePages = allPages
      .filter(
        (candidate) =>
          candidate.id !== page.id &&
          candidate.service.id ===
            page.service.id &&
          candidate.status === "ACTIVE" &&
          candidate.indexable
      )
      .sort((a, b) =>
        a.city.name.localeCompare(
          b.city.name,
          "de"
        )
      );

    const sameCityPages = allPages
      .filter(
        (candidate) =>
          candidate.id !== page.id &&
          candidate.city.id ===
            page.city.id &&
          candidate.service.id !==
            page.service.id &&
          candidate.status === "ACTIVE" &&
          candidate.indexable
      )
      .sort((a, b) =>
        a.service.name.localeCompare(
          b.service.name,
          "de"
        )
      );

    const candidates = [
      ...sameServicePages.slice(0, 3),
      ...sameCityPages.slice(0, 3),
    ];

    const uniqueCandidates = Array.from(
      new Map(
        candidates.map((candidate) => [
          candidate.id,
          candidate,
        ])
      ).values()
    );

    const existingLinks =
      uniqueCandidates.filter((target) =>
        hasInternalLink(page, target)
      );

    const missingLinks =
      uniqueCandidates.filter(
        (target) =>
          !hasInternalLink(page, target)
      );

    return {
      page,
      publicPath: getPublicPath(page),
      title: getPageTitle(page),
      existingLinks,
      missingLinks,
      candidateCount:
        uniqueCandidates.length,
      hasAnyInternalLink:
        existingLinks.length > 0,
    };
  });

  const filteredAnalyses =
    analyses.filter((analysis) => {
      const page = analysis.page;

      const matchesQuery =
        !query ||
        analysis.title
          .toLowerCase()
          .includes(query) ||
        page.city.name
          .toLowerCase()
          .includes(query) ||
        page.service.name
          .toLowerCase()
          .includes(query);

      const matchesStatus =
        status === "ALL" ||
        page.status === status;

      const matchesIssue =
        issue === "ALL" ||
        (issue === "MISSING" &&
          !analysis.hasAnyInternalLink) ||
        (issue === "LINKED" &&
          analysis.hasAnyInternalLink) ||
        (issue === "NO_CANDIDATES" &&
          analysis.candidateCount === 0);

      return (
        matchesQuery &&
        matchesStatus &&
        matchesIssue
      );
    });

  const linkedPages =
    analyses.filter(
      (analysis) =>
        analysis.hasAnyInternalLink
    ).length;

  const pagesWithoutLinks =
    analyses.filter(
      (analysis) =>
        !analysis.hasAnyInternalLink
    ).length;

  const totalSuggestions =
    analyses.reduce(
      (total, analysis) =>
        total +
        analysis.missingLinks.length,
      0
    );

  const linkingScore =
    calculateScore(
      analyses.length,
      linkedPages
    );

  return (
    <main className="links-page">
      <div className="links-shell">
        <header className="links-header">
          <div>
            <Link
              href="/admin/seo"
              className="back-link"
            >
              ← Zurück zum SEO Center
            </Link>

            <span className="kicker">
              Interne Verlinkung
            </span>

            <h1>Internal Linking Center</h1>

            <p>
              Analysiere die Verlinkung zwischen
              Dienstleistungen und Städten. Das
              System erkennt vorhandene Links und
              erstellt passende Vorschläge für
              weitere SEO-Verknüpfungen.
            </p>
          </div>

          <div className="header-actions">
            <Link href="/admin/seo/editor">
              SEO Editor
            </Link>

            <Link href="/admin/seo/audit">
              SEO Audit
            </Link>

            <Link href="/admin/seo/snippets">
              Vorschau
            </Link>
          </div>
        </header>

        <section className="stats">
          <article>
            <span>Landingpages</span>
            <strong>{analyses.length}</strong>
            <small>analysierte Seiten</small>
          </article>

          <article>
            <span>Mit internen Links</span>
            <strong>{linkedPages}</strong>
            <small>Verknüpfung erkannt</small>
          </article>

          <article>
            <span>Ohne interne Links</span>
            <strong>{pagesWithoutLinks}</strong>
            <small>Optimierung empfohlen</small>
          </article>

          <article>
            <span>Linkvorschläge</span>
            <strong>{totalSuggestions}</strong>
            <small>mögliche Verknüpfungen</small>
          </article>

          <article>
            <span>Linking Score</span>
            <strong>{linkingScore}%</strong>
            <small>SEO-Verknüpfungsquote</small>
          </article>
        </section>

        <section className="score-panel">
          <div>
            <span>Interne Verlinkung</span>

            <strong>
              {linkingScore >= 80
                ? "Sehr gut"
                : linkingScore >= 50
                  ? "Ausbaufähig"
                  : "Optimierung nötig"}
            </strong>

            <p>
              Ziel: Jede aktive Landingpage sollte
              auf mehrere thematisch passende
              Auftrago-Seiten verweisen.
            </p>
          </div>

          <div className="score-area">
            <strong>{linkingScore}%</strong>

            <div className="progress">
              <span
                style={{
                  width: `${linkingScore}%`,
                }}
              />
            </div>
          </div>
        </section>

        <section className="filter-panel">
          <form method="get">
            <label>
              <span>Suche</span>

              <input
                type="search"
                name="query"
                defaultValue={
                  searchParams.query ?? ""
                }
                placeholder="Stadt, Dienstleistung oder Titel"
              />
            </label>

            <label>
              <span>Status</span>

              <select
                name="status"
                defaultValue={status}
              >
                <option value="ALL">
                  Alle
                </option>

                <option value="ACTIVE">
                  Aktiv
                </option>

                <option value="DRAFT">
                  Entwurf
                </option>
              </select>
            </label>

            <label>
              <span>Verlinkung</span>

              <select
                name="issue"
                defaultValue={issue}
              >
                <option value="ALL">
                  Alle Seiten
                </option>

                <option value="MISSING">
                  Ohne interne Links
                </option>

                <option value="LINKED">
                  Mit internen Links
                </option>

                <option value="NO_CANDIDATES">
                  Keine Vorschläge
                </option>
              </select>
            </label>

            <button type="submit">
              Filtern
            </button>

            <Link href="/admin/seo/links">
              Zurücksetzen
            </Link>
          </form>
        </section>

        <section className="links-panel">
          <div className="panel-heading">
            <div>
              <span>Landingpages</span>

              <h2>
                Linkanalyse und Vorschläge
              </h2>
            </div>

            <strong>
              {filteredAnalyses.length}
            </strong>
          </div>

          {filteredAnalyses.length === 0 ? (
            <div className="empty-state">
              Keine passenden Landingpages
              gefunden.
            </div>
          ) : (
            <div className="analysis-list">
              {filteredAnalyses.map(
                (analysis) => (
                  <article
                    className="analysis-card"
                    key={analysis.page.id}
                  >
                    <div className="card-header">
                      <div>
                        <div className="badges">
                          <span
                            className={
                              analysis.page
                                .status ===
                              "ACTIVE"
                                ? "active"
                                : "draft"
                            }
                          >
                            {analysis.page
                              .status === "ACTIVE"
                              ? "Aktiv"
                              : "Entwurf"}
                          </span>

                          <span
                            className={
                              analysis.hasAnyInternalLink
                                ? "linked"
                                : "missing"
                            }
                          >
                            {analysis.hasAnyInternalLink
                              ? "Links erkannt"
                              : "Keine Links erkannt"}
                          </span>

                          <span className="candidate">
                            {
                              analysis
                                .candidateCount
                            }{" "}
                            Vorschläge
                          </span>
                        </div>

                        <h3>
                          {analysis.title}
                        </h3>

                        <p>
                          {analysis.publicPath}
                        </p>
                      </div>

                      <div className="card-actions">
                        <Link
                          href={`/admin/seo/landingpages/${analysis.page.id}`}
                        >
                          Bearbeiten
                        </Link>

                        <Link
                          href={
                            analysis.publicPath
                          }
                          target="_blank"
                        >
                          Öffnen
                        </Link>
                      </div>
                    </div>

                    {analysis.existingLinks
                      .length > 0 ? (
                      <div className="link-section">
                        <div className="section-title">
                          <span>
                            Vorhandene Links
                          </span>

                          <strong>
                            {
                              analysis
                                .existingLinks
                                .length
                            }
                          </strong>
                        </div>

                        <div className="existing-links">
                          {analysis.existingLinks.map(
                            (target) => (
                              <Link
                                key={target.id}
                                href={getPublicPath(
                                  target
                                )}
                                target="_blank"
                              >
                                <span>✓</span>

                                <div>
                                  <strong>
                                    {getPageTitle(
                                      target
                                    )}
                                  </strong>

                                  <small>
                                    {getPublicPath(
                                      target
                                    )}
                                  </small>
                                </div>
                              </Link>
                            )
                          )}
                        </div>
                      </div>
                    ) : null}

                    <div className="link-section">
                      <div className="section-title">
                        <span>
                          Empfohlene Links
                        </span>

                        <strong>
                          {
                            analysis.missingLinks
                              .length
                          }
                        </strong>
                      </div>

                      {analysis.missingLinks
                        .length === 0 ? (
                        <div className="no-suggestions">
                          Für diese Landingpage wurden
                          keine weiteren passenden
                          Linkvorschläge gefunden.
                        </div>
                      ) : (
                        <div className="suggestions">
                          {analysis.missingLinks.map(
                            (target) => {
                              const targetPath =
                                getPublicPath(
                                  target
                                );

                              const anchorText =
                                createAnchorText(
                                  analysis.page,
                                  target
                                );

                              const suggestionText =
                                createSuggestionText(
                                  analysis.page,
                                  target
                                );

                              return (
                                <article
                                  key={target.id}
                                  className="suggestion"
                                >
                                  <div className="suggestion-top">
                                    <div>
                                      <span>
                                        {analysis.page
                                          .service
                                          .id ===
                                        target.service
                                          .id
                                          ? "Gleiche Dienstleistung"
                                          : "Gleiche Stadt"}
                                      </span>

                                      <strong>
                                        {getPageTitle(
                                          target
                                        )}
                                      </strong>
                                    </div>

                                    <Link
                                      href={
                                        targetPath
                                      }
                                      target="_blank"
                                    >
                                      Zielseite
                                    </Link>
                                  </div>

                                  <div className="suggestion-data">
                                    <div>
                                      <span>
                                        Ankertext
                                      </span>

                                      <code>
                                        {
                                          anchorText
                                        }
                                      </code>
                                    </div>

                                    <div>
                                      <span>
                                        Ziel-URL
                                      </span>

                                      <code>
                                        {
                                          targetPath
                                        }
                                      </code>
                                    </div>

                                    <div>
                                      <span>
                                        Textvorschlag
                                      </span>

                                      <p>
                                        {
                                          suggestionText
                                        }
                                      </p>
                                    </div>
                                  </div>
                                </article>
                              );
                            }
                          )}
                        </div>
                      )}
                    </div>
                  </article>
                )
              )}
            </div>
          )}
        </section>
      </div>

      <style suppressHydrationWarning>{`
        :global(body) {
          margin: 0;
          background: #050711;
        }

        * {
          box-sizing: border-box;
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
            sans-serif;
        }

        .links-shell {
          width: min(
            1500px,
            calc(100% - 32px)
          );
          margin: 0 auto;
          padding: 36px 0 70px;
        }

        .links-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 26px;
          padding: 30px;
          border: 1px solid
            rgba(148, 163, 184, 0.14);
          border-radius: 28px;
          background:
            linear-gradient(
              145deg,
              rgba(15, 23, 42, 0.96),
              rgba(6, 9, 20, 0.98)
            );
        }

        .back-link {
          display: inline-flex;
          margin-bottom: 20px;
          color: #94a3b8;
          font-size: 13px;
          font-weight: 800;
          text-decoration: none;
        }

        .kicker {
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
          font-size:
            clamp(40px, 6vw, 66px);
          line-height: 1;
          letter-spacing: -0.045em;
        }

        .links-header p {
          max-width: 760px;
          margin: 16px 0 0;
          color: #94a3b8;
          line-height: 1.7;
        }

        .header-actions {
          display: flex;
          flex-wrap: wrap;
          justify-content: flex-end;
          gap: 10px;
        }

        .header-actions a {
          display: inline-flex;
          min-height: 46px;
          align-items: center;
          justify-content: center;
          padding: 0 16px;
          border: 1px solid
            rgba(148, 163, 184, 0.16);
          border-radius: 12px;
          background:
            rgba(255, 255, 255, 0.04);
          color: #ffffff;
          font-size: 10px;
          font-weight: 900;
          text-decoration: none;
        }

        .stats {
          display: grid;
          grid-template-columns:
            repeat(5, minmax(0, 1fr));
          gap: 13px;
          margin: 20px 0;
        }

        .stats article {
          padding: 22px;
          border: 1px solid
            rgba(148, 163, 184, 0.13);
          border-radius: 21px;
          background:
            linear-gradient(
              145deg,
              rgba(255, 255, 255, 0.04),
              rgba(8, 12, 25, 0.96)
            );
        }

        .stats span {
          display: block;
          color: #93c5fd;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.07em;
          text-transform: uppercase;
        }

        .stats strong {
          display: block;
          margin-top: 11px;
          font-size: 32px;
        }

        .stats small {
          display: block;
          margin-top: 7px;
          color: #64748b;
          font-size: 9px;
        }

        .score-panel,
        .filter-panel,
        .links-panel {
          padding: 24px;
          border: 1px solid
            rgba(148, 163, 184, 0.13);
          border-radius: 24px;
          background:
            linear-gradient(
              145deg,
              rgba(15, 23, 42, 0.94),
              rgba(6, 9, 20, 0.98)
            );
        }

        .score-panel {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 30px;
          margin-bottom: 18px;
        }

        .score-panel span {
          color: #60a5fa;
          font-size: 9px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .score-panel > div > strong {
          display: block;
          margin-top: 8px;
          font-size: 24px;
        }

        .score-panel p {
          max-width: 650px;
          margin: 8px 0 0;
          color: #94a3b8;
          font-size: 11px;
          line-height: 1.6;
        }

        .score-area {
          width: min(420px, 40%);
        }

        .score-area > strong {
          display: block;
          margin-bottom: 10px;
          font-size: 26px;
          text-align: right;
        }

        .progress {
          height: 11px;
          overflow: hidden;
          border-radius: 999px;
          background:
            rgba(255, 255, 255, 0.07);
        }

        .progress span {
          display: block;
          height: 100%;
          border-radius: inherit;
          background:
            linear-gradient(
              90deg,
              #059669,
              #2563eb,
              #7c3aed
            );
        }

        .filter-panel {
          margin-bottom: 18px;
        }

        .filter-panel form {
          display: grid;
          grid-template-columns:
            minmax(280px, 1fr)
            180px
            220px
            auto
            auto;
          gap: 12px;
          align-items: end;
        }

        .filter-panel label > span {
          display: block;
          margin-bottom: 7px;
          color: #94a3b8;
          font-size: 9px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .filter-panel input,
        .filter-panel select {
          width: 100%;
          min-height: 44px;
          padding: 0 12px;
          border: 1px solid
            rgba(148, 163, 184, 0.17);
          border-radius: 11px;
          outline: 0;
          background: #101625;
          color: #ffffff;
          font: inherit;
        }

        .filter-panel button,
        .filter-panel a {
          display: inline-flex;
          min-height: 44px;
          align-items: center;
          justify-content: center;
          padding: 0 15px;
          border-radius: 11px;
          color: #ffffff;
          font-size: 9px;
          font-weight: 900;
          text-decoration: none;
        }

        .filter-panel button {
          border: 0;
          cursor: pointer;
          background: #2563eb;
        }

        .filter-panel a {
          border: 1px solid
            rgba(148, 163, 184, 0.15);
          background:
            rgba(255, 255, 255, 0.03);
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

        .analysis-list {
          display: grid;
          gap: 16px;
        }

        .analysis-card {
          padding: 20px;
          border: 1px solid
            rgba(148, 163, 184, 0.12);
          border-radius: 18px;
          background:
            rgba(255, 255, 255, 0.025);
        }

        .card-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 20px;
        }

        .badges {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .badges span {
          display: inline-flex;
          padding: 5px 8px;
          border-radius: 999px;
          font-size: 7px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .active,
        .linked {
          background:
            rgba(34, 197, 94, 0.11);
          color: #86efac;
        }

        .draft,
        .candidate {
          background:
            rgba(245, 158, 11, 0.11);
          color: #fde68a;
        }

        .missing {
          background:
            rgba(239, 68, 68, 0.11);
          color: #fca5a5;
        }

        .card-header h3 {
          margin: 11px 0 0;
          font-size: 18px;
        }

        .card-header p {
          margin: 6px 0 0;
          color: #64748b;
          font-size: 9px;
        }

        .card-actions {
          display: flex;
          gap: 7px;
        }

        .card-actions a {
          display: inline-flex;
          padding: 8px 10px;
          border: 1px solid
            rgba(148, 163, 184, 0.14);
          border-radius: 8px;
          color: #bfdbfe;
          font-size: 8px;
          font-weight: 900;
          text-decoration: none;
        }

        .link-section {
          margin-top: 18px;
          padding-top: 18px;
          border-top: 1px solid
            rgba(148, 163, 184, 0.1);
        }

        .section-title {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
        }

        .section-title span {
          color: #cbd5e1;
          font-size: 9px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .section-title strong {
          display: grid;
          width: 28px;
          height: 28px;
          place-items: center;
          border-radius: 9px;
          background:
            rgba(37, 99, 235, 0.12);
          color: #bfdbfe;
          font-size: 10px;
        }

        .existing-links {
          display: grid;
          grid-template-columns:
            repeat(3, minmax(0, 1fr));
          gap: 9px;
        }

        .existing-links a {
          display: flex;
          align-items: center;
          gap: 10px;
          min-width: 0;
          padding: 12px;
          border-radius: 12px;
          background:
            rgba(34, 197, 94, 0.06);
          color: #ffffff;
          text-decoration: none;
        }

        .existing-links a > span {
          display: grid;
          width: 26px;
          height: 26px;
          flex-shrink: 0;
          place-items: center;
          border-radius: 999px;
          background:
            rgba(34, 197, 94, 0.12);
          color: #86efac;
          font-size: 9px;
          font-weight: 900;
        }

        .existing-links div {
          min-width: 0;
        }

        .existing-links strong {
          display: block;
          overflow: hidden;
          font-size: 9px;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .existing-links small {
          display: block;
          overflow: hidden;
          margin-top: 4px;
          color: #64748b;
          font-size: 7px;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .suggestions {
          display: grid;
          gap: 10px;
        }

        .suggestion {
          padding: 15px;
          border: 1px solid
            rgba(59, 130, 246, 0.12);
          border-radius: 14px;
          background:
            rgba(37, 99, 235, 0.04);
        }

        .suggestion-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 15px;
        }

        .suggestion-top span {
          display: block;
          color: #60a5fa;
          font-size: 7px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .suggestion-top strong {
          display: block;
          margin-top: 5px;
          font-size: 11px;
        }

        .suggestion-top a {
          display: inline-flex;
          padding: 7px 9px;
          border: 1px solid
            rgba(148, 163, 184, 0.14);
          border-radius: 8px;
          color: #bfdbfe;
          font-size: 7px;
          font-weight: 900;
          text-decoration: none;
          white-space: nowrap;
        }

        .suggestion-data {
          display: grid;
          grid-template-columns:
            1fr 1.4fr 2fr;
          gap: 10px;
          margin-top: 13px;
        }

        .suggestion-data div {
          min-width: 0;
          padding: 11px;
          border-radius: 10px;
          background:
            rgba(255, 255, 255, 0.025);
        }

        .suggestion-data span {
          display: block;
          margin-bottom: 6px;
          color: #64748b;
          font-size: 7px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .suggestion-data code {
          display: block;
          overflow-wrap: anywhere;
          color: #bfdbfe;
          font-size: 8px;
          line-height: 1.5;
        }

        .suggestion-data p {
          margin: 0;
          color: #cbd5e1;
          font-size: 8px;
          line-height: 1.55;
        }

        .no-suggestions,
        .empty-state {
          padding: 40px 20px;
          border: 1px dashed
            rgba(148, 163, 184, 0.17);
          border-radius: 14px;
          color: #64748b;
          text-align: center;
          font-size: 10px;
        }

        @media (max-width: 1100px) {
          .stats {
            grid-template-columns:
              repeat(3, minmax(0, 1fr));
          }

          .existing-links {
            grid-template-columns:
              repeat(2, minmax(0, 1fr));
          }

          .suggestion-data {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 900px) {
          .filter-panel form {
            grid-template-columns:
              repeat(2, minmax(0, 1fr));
          }

          .links-header,
          .score-panel {
            align-items: flex-start;
            flex-direction: column;
          }

          .score-area {
            width: 100%;
          }

          .score-area > strong {
            text-align: left;
          }
        }

        @media (max-width: 650px) {
          .links-shell {
            width: calc(100% - 20px);
            padding-top: 14px;
          }

          .links-header,
          .score-panel,
          .filter-panel,
          .links-panel {
            padding: 20px;
            border-radius: 21px;
          }

          .stats,
          .filter-panel form,
          .existing-links {
            grid-template-columns: 1fr;
          }

          .header-actions {
            width: 100%;
          }

          .header-actions a {
            flex: 1;
          }

          .card-header {
            flex-direction: column;
          }
        }
      `}</style>
    </main>
  );
}
