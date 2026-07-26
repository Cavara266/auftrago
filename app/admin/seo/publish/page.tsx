import Link from "next/link";

import { prisma } from "@/lib/prisma";

import {
  canPublishSeoPage,
  getSeoQualityScore,
} from "./seo-quality";

import PublishButtons from "./publish-buttons";
import AutoPipelineButton from "./auto-pipeline-button";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

function formatDate(date: Date | null) {
  if (!date) {
    return "Noch nicht veröffentlicht";
  }

  return new Intl.DateTimeFormat("de-CH", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export default async function SeoPublishPage() {
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
          description: true,
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
    orderBy: [
      {
        status: "desc",
      },
      {
        updatedAt: "desc",
      },
    ],
  });

  const draftPages = pages.filter(
    (page) => page.status === "DRAFT"
  );

  const activePages = pages.filter(
    (page) => page.status === "ACTIVE"
  );

  const blockedDrafts = draftPages.filter(
    (page) =>
      page.city.status !== "ACTIVE" ||
      page.service.status !== "ACTIVE"
  );

  return (
    <main className="publish-page">
      <div className="publish-shell">
        <header className="publish-header">
          <div>
            <Link
              href="/admin/seo"
              className="publish-back"
            >
              ← Zurück zum SEO Center
            </Link>

            <span className="publish-kicker">
              Veröffentlichung
            </span>

            <h1>Landingpages freigeben</h1>

            <p>
              Prüfe generierte Entwürfe und veröffentliche
              sie einzeln oder gesammelt.
            </p>
          </div>

          <div className="publish-header-actions">
            {draftPages.length > 0 ? (
              <AutoPipelineButton />
            ) : null}

            {draftPages.length > 0 ? (
              <PublishButtons mode="publish-all" />
            ) : null}

            <Link href="/admin/seo/generator">
              Generator öffnen
            </Link>

            <Link href="/admin/seo/health">
              SEO Health öffnen
            </Link>
          </div>
        </header>

        <section className="publish-stats">
          <article>
            <span>Alle Landingpages</span>
            <strong>{pages.length}</strong>
          </article>

          <article>
            <span>Entwürfe</span>
            <strong>{draftPages.length}</strong>
          </article>

          <article>
            <span>Veröffentlicht</span>
            <strong>{activePages.length}</strong>
          </article>

          <article>
            <span>Blockierte Entwürfe</span>
            <strong>{blockedDrafts.length}</strong>
          </article>
        </section>

        <section className="publish-section">
          <div className="publish-section-heading">
            <div>
              <span>Warteschlange</span>
              <h2>Entwürfe</h2>
            </div>

            <strong>{draftPages.length}</strong>
          </div>

          {draftPages.length === 0 ? (
            <div className="publish-empty">
              <div>✓</div>
              <h3>Keine Entwürfe vorhanden</h3>
              <p>
                Alle vorhandenen Landingpages wurden bereits
                veröffentlicht.
              </p>

              <Link href="/admin/seo/generator">
                Neue Landingpages generieren
              </Link>
            </div>
          ) : (
            <div className="publish-list">
              {draftPages.map((page) => {
                const quality =
                  canPublishSeoPage(page, 70);

                const canPublish = quality.allowed;

                const publicUrl =
                  `/dienstleistung/${page.service.slug}/${page.city.slug}`;

                return (
                  <article
                    className="publish-card"
                    key={page.id}
                  >
                    <div className="publish-card-main">
                      <div>
                        <span
                          className={
                            canPublish
                              ? "status draft"
                              : "status blocked"
                          }
                        >
                          {canPublish
                            ? "Entwurf"
                            : "Blockiert"}
                        </span>

                        <h3>
                          {page.headline ||
                            `${page.service.name} in ${page.city.name}`}
                        </h3>

                        <p>
                          {page.service.name} ·{" "}
                          {page.city.name}
                        </p>

                        <small>{publicUrl}</small>
                      </div>

                      <div className="publish-card-actions">
                        {canPublish ? (
                          <PublishButtons
                            mode="single-publish"
                            landingPageId={page.id}
                          />
                        ) : (
                          <span className="blocked-message">
                            SEO-Score {quality.score}/100.
                            Mindestens 70/100 erforderlich.
                            Fehlend:{" "}
                            {quality.failedChecks
                              .map(
                                (check) => check.label
                              )
                              .join(", ")}
                          </span>
                        )}

                        <Link
                          href={publicUrl}
                          target="_blank"
                        >
                          Vorschau öffnen
                        </Link>
                      </div>
                    </div>

                    <div className="publish-meta">
                      <span>
                        <small>SEO-Score</small>
                        <b>
                          {getSeoQualityScore(page)}/100
                        </b>
                      </span>

                      <span>
                        <small>SEO-Titel</small>
                        <b>
                          {page.seoTitle
                            ? "Vorhanden"
                            : "Fehlt"}
                        </b>
                      </span>

                      <span>
                        <small>Meta Description</small>
                        <b>
                          {page.seoDescription
                            ? "Vorhanden"
                            : "Fehlt"}
                        </b>
                      </span>

                      <span>
                        <small>Indexierbar</small>
                        <b>
                          {page.indexable
                            ? "Ja"
                            : "Nein"}
                        </b>
                      </span>

                      <span>
                        <small>Veröffentlicht</small>
                        <b>
                          {formatDate(page.publishedAt)}
                        </b>
                      </span>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <section className="publish-section">
          <div className="publish-section-heading">
            <div>
              <span>Öffentlich</span>
              <h2>Veröffentlichte Seiten</h2>
            </div>

            <strong>{activePages.length}</strong>
          </div>

          {activePages.length === 0 ? (
            <div className="publish-empty compact">
              <p>
                Noch keine Landingpages veröffentlicht.
              </p>
            </div>
          ) : (
            <div className="publish-list">
              {activePages.map((page) => {
                const publicUrl =
                  `/dienstleistung/${page.service.slug}/${page.city.slug}`;

                return (
                  <article
                    className="publish-card active-card"
                    key={page.id}
                  >
                    <div className="publish-card-main">
                      <div>
                        <span className="status active">
                          Veröffentlicht
                        </span>

                        <h3>
                          {page.headline ||
                            `${page.service.name} in ${page.city.name}`}
                        </h3>

                        <p>
                          {page.service.name} ·{" "}
                          {page.city.name}
                        </p>

                        <small>{publicUrl}</small>
                      </div>

                      <div className="publish-card-actions">
                        <Link
                          href={publicUrl}
                          target="_blank"
                        >
                          Seite öffnen
                        </Link>

                        <PublishButtons
                          mode="single-unpublish"
                          landingPageId={page.id}
                        />
                      </div>
                    </div>

                    <div className="publish-meta">
                      <span>
                        <small>Indexierbar</small>
                        <b>
                          {page.indexable
                            ? "Ja"
                            : "Nein"}
                        </b>
                      </span>

                      <span>
                        <small>Veröffentlicht</small>
                        <b>
                          {formatDate(page.publishedAt)}
                        </b>
                      </span>
                    </div>
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

        .publish-page {
          min-height: 100vh;
          background:
            radial-gradient(
              circle at top right,
              rgba(37, 99, 235, 0.14),
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

        .publish-shell {
          width: min(1450px, calc(100% - 32px));
          margin: 0 auto;
          padding: 36px 0 70px;
        }

        .publish-header {
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
              rgba(15, 23, 42, 0.95),
              rgba(6, 9, 20, 0.98)
            );
        }

        .publish-back {
          display: inline-flex;
          margin-bottom: 20px;
          color: #94a3b8;
          font-size: 13px;
          font-weight: 800;
          text-decoration: none;
        }

        .publish-kicker {
          display: block;
          margin-bottom: 10px;
          color: #60a5fa;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .publish-header h1 {
          margin: 0;
          font-size: clamp(38px, 6vw, 65px);
          line-height: 1;
          letter-spacing: -0.045em;
        }

        .publish-header p {
          max-width: 720px;
          margin: 16px 0 0;
          color: #94a3b8;
          line-height: 1.7;
        }

        .publish-header-actions {
          display: flex;
          flex-wrap: wrap;
          align-items: flex-start;
          justify-content: flex-end;
          gap: 10px;
        }

        .publish-header-actions > a {
          display: inline-flex;
          min-height: 46px;
          align-items: center;
          justify-content: center;
          padding: 0 16px;
          border: 1px solid
            rgba(148, 163, 184, 0.16);
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.04);
          color: #ffffff;
          font-size: 10px;
          font-weight: 900;
          text-decoration: none;
        }

        .publish-stats {
          display: grid;
          grid-template-columns:
            repeat(4, minmax(0, 1fr));
          gap: 13px;
          margin: 20px 0;
        }

        .publish-stats article {
          padding: 21px;
          border: 1px solid
            rgba(148, 163, 184, 0.13);
          border-radius: 20px;
          background:
            linear-gradient(
              145deg,
              rgba(255, 255, 255, 0.04),
              rgba(8, 12, 25, 0.96)
            );
        }

        .publish-stats span {
          display: block;
          color: #93c5fd;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.07em;
          text-transform: uppercase;
        }

        .publish-stats strong {
          display: block;
          margin-top: 10px;
          font-size: 30px;
        }

        .publish-section {
          margin-top: 20px;
          padding: 24px;
          border: 1px solid
            rgba(148, 163, 184, 0.13);
          border-radius: 25px;
          background:
            linear-gradient(
              145deg,
              rgba(15, 23, 42, 0.94),
              rgba(6, 9, 20, 0.98)
            );
        }

        .publish-section-heading {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 18px;
        }

        .publish-section-heading span {
          color: #60a5fa;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .publish-section-heading h2 {
          margin: 7px 0 0;
          font-size: 25px;
        }

        .publish-section-heading > strong {
          display: grid;
          width: 48px;
          height: 48px;
          place-items: center;
          border-radius: 15px;
          background: rgba(37, 99, 235, 0.12);
          color: #bfdbfe;
        }

        .publish-list {
          display: grid;
          gap: 13px;
        }

        .publish-card {
          overflow: hidden;
          border: 1px solid
            rgba(148, 163, 184, 0.12);
          border-radius: 18px;
          background: rgba(255, 255, 255, 0.025);
        }

        .publish-card-main {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          padding: 19px;
        }

        .status {
          display: inline-flex;
          padding: 6px 9px;
          border-radius: 999px;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        .status.draft {
          background: rgba(245, 158, 11, 0.1);
          color: #fde68a;
        }

        .status.active {
          background: rgba(34, 197, 94, 0.1);
          color: #86efac;
        }

        .status.blocked {
          background: rgba(239, 68, 68, 0.1);
          color: #fca5a5;
        }

        .publish-card h3 {
          margin: 11px 0 0;
          font-size: 17px;
        }

        .publish-card p {
          margin: 7px 0 0;
          color: #94a3b8;
          font-size: 10px;
        }

        .publish-card small {
          display: block;
          margin-top: 6px;
          color: #59667a;
          font-size: 9px;
        }

        .publish-card-actions {
          display: flex;
          flex-wrap: wrap;
          align-items: flex-start;
          justify-content: flex-end;
          gap: 9px;
        }

        .publish-card-actions > a {
          display: inline-flex;
          min-height: 40px;
          align-items: center;
          padding: 0 13px;
          border: 1px solid
            rgba(148, 163, 184, 0.15);
          border-radius: 10px;
          color: #cbd5e1;
          font-size: 9px;
          font-weight: 900;
          text-decoration: none;
        }

        .blocked-message {
          max-width: 220px;
          padding: 11px;
          border-radius: 10px;
          background: rgba(239, 68, 68, 0.08);
          color: #fca5a5;
          font-size: 9px;
          line-height: 1.5;
        }

        .publish-meta {
          display: grid;
          grid-template-columns:
            repeat(4, minmax(0, 1fr));
          gap: 1px;
          border-top: 1px solid
            rgba(148, 163, 184, 0.09);
          background: rgba(148, 163, 184, 0.08);
        }

        .publish-meta span {
          min-width: 0;
          padding: 13px 16px;
          background: #090d19;
        }

        .publish-meta small {
          margin: 0;
          color: #64748b;
          font-size: 8px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .publish-meta b {
          display: block;
          overflow: hidden;
          margin-top: 6px;
          color: #cbd5e1;
          font-size: 9px;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .publish-empty {
          padding: 60px 20px;
          border: 1px dashed
            rgba(148, 163, 184, 0.18);
          border-radius: 18px;
          text-align: center;
        }

        .publish-empty > div {
          display: grid;
          width: 55px;
          height: 55px;
          margin: 0 auto;
          place-items: center;
          border-radius: 999px;
          background: rgba(34, 197, 94, 0.1);
          color: #86efac;
          font-size: 23px;
        }

        .publish-empty h3 {
          margin: 16px 0 0;
        }

        .publish-empty p {
          margin: 9px 0 0;
          color: #8390a5;
          font-size: 11px;
        }

        .publish-empty a {
          display: inline-flex;
          margin-top: 19px;
          padding: 13px 16px;
          border-radius: 11px;
          background: #2563eb;
          color: #ffffff;
          font-size: 10px;
          font-weight: 900;
          text-decoration: none;
        }

        .publish-empty.compact {
          padding: 30px 20px;
        }

        @media (max-width: 900px) {
          .publish-stats {
            grid-template-columns:
              repeat(2, minmax(0, 1fr));
          }

          .publish-card-main {
            align-items: flex-start;
            flex-direction: column;
          }

          .publish-card-actions {
            justify-content: flex-start;
          }

          .publish-meta {
            grid-template-columns:
              repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 650px) {
          .publish-header {
            align-items: flex-start;
            flex-direction: column;
          }

          .publish-header-actions {
            width: 100%;
            justify-content: flex-start;
          }

          .publish-header-actions > a {
            flex: 1;
          }
        }

        @media (max-width: 500px) {
          .publish-shell {
            width: calc(100% - 20px);
            padding-top: 14px;
          }

          .publish-header,
          .publish-section {
            padding: 20px;
            border-radius: 21px;
          }

          .publish-stats {
            grid-template-columns: 1fr;
          }

          .publish-meta {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </main>
  );
}
