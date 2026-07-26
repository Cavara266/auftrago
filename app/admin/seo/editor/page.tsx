import Link from "next/link";

import { prisma } from "@/lib/prisma";

import {
  updateSeoLandingPage,
} from "./actions";

import SaveButton from "./save-button";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const BASE_URL =
  "https://www.auftrago.ch";

type SearchParams = {
  query?: string;
  status?: string;
  indexable?: string;
};

function getTitleState(
  value: string | null
) {
  const length =
    value?.trim().length ?? 0;

  if (length === 0) {
    return {
      label: "Fehlt",
      className: "bad",
    };
  }

  if (
    length < 30 ||
    length > 65
  ) {
    return {
      label: `${length} Zeichen`,
      className: "warning",
    };
  }

  return {
    label: `${length} Zeichen`,
    className: "good",
  };
}

function getDescriptionState(
  value: string | null
) {
  const length =
    value?.trim().length ?? 0;

  if (length === 0) {
    return {
      label: "Fehlt",
      className: "bad",
    };
  }

  if (
    length < 110 ||
    length > 170
  ) {
    return {
      label: `${length} Zeichen`,
      className: "warning",
    };
  }

  return {
    label: `${length} Zeichen`,
    className: "good",
  };
}

export default async function SeoEditorPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const query =
    searchParams.query?.trim() ?? "";

  const status =
    searchParams.status ?? "ALL";

  const indexableFilter =
    searchParams.indexable ?? "ALL";

  const landingPages =
    await prisma.seoLandingPage.findMany({
      where: {
        ...(query
          ? {
              OR: [
                {
                  headline: {
                    contains: query,
                    mode: "insensitive",
                  },
                },
                {
                  seoTitle: {
                    contains: query,
                    mode: "insensitive",
                  },
                },
                {
                  city: {
                    name: {
                      contains: query,
                      mode: "insensitive",
                    },
                  },
                },
                {
                  service: {
                    name: {
                      contains: query,
                      mode: "insensitive",
                    },
                  },
                },
              ],
            }
          : {}),

        ...(status !== "ALL"
          ? {
              status: status as never,
            }
          : {}),

        ...(indexableFilter === "YES"
          ? {
              indexable: true,
            }
          : {}),

        ...(indexableFilter === "NO"
          ? {
              indexable: false,
            }
          : {}),
      },

      include: {
        city: {
          select: {
            name: true,
            slug: true,
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

      take: 200,
    });

  const totalPages =
    await prisma.seoLandingPage.count();

  const indexablePages =
    await prisma.seoLandingPage.count({
      where: {
        indexable: true,
      },
    });

  const nonIndexablePages =
    await prisma.seoLandingPage.count({
      where: {
        indexable: false,
      },
    });

  return (
    <main className="editor-page">
      <div className="editor-shell">
        <header className="editor-header">
          <div>
            <Link
              href="/admin/seo"
              className="back-link"
            >
              ← Zurück zum SEO Center
            </Link>

            <span className="kicker">
              Schnellbearbeitung
            </span>

            <h1>SEO Editor</h1>

            <p>
              Bearbeite Titel,
              Meta-Beschreibungen,
              Canonical URLs und
              Indexierung direkt in einer
              zentralen Übersicht.
            </p>
          </div>

          <div className="header-actions">
            <Link href="/admin/seo/audit">
              SEO Audit
            </Link>

            <Link href="/admin/seo/snippets">
              Vorschau
            </Link>

            <Link href="/admin/seo/export">
              Export
            </Link>
          </div>
        </header>

        <section className="stats">
          <article>
            <span>Landingpages</span>
            <strong>{totalPages}</strong>
            <small>
              insgesamt vorhanden
            </small>
          </article>

          <article>
            <span>Indexierbar</span>
            <strong>
              {indexablePages}
            </strong>
            <small>
              für Google freigegeben
            </small>
          </article>

          <article>
            <span>Noindex</span>
            <strong>
              {nonIndexablePages}
            </strong>
            <small>
              aktuell ausgeschlossen
            </small>
          </article>

          <article>
            <span>Ergebnisse</span>
            <strong>
              {landingPages.length}
            </strong>
            <small>
              aktuelle Filterung
            </small>
          </article>
        </section>

        <section className="filter-panel">
          <form method="get">
            <label>
              <span>Suche</span>

              <input
                type="search"
                name="query"
                defaultValue={query}
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
              <span>Indexierung</span>

              <select
                name="indexable"
                defaultValue={
                  indexableFilter
                }
              >
                <option value="ALL">
                  Alle
                </option>

                <option value="YES">
                  Indexierbar
                </option>

                <option value="NO">
                  Noindex
                </option>
              </select>
            </label>

            <button type="submit">
              Filtern
            </button>

            <Link href="/admin/seo/editor">
              Zurücksetzen
            </Link>
          </form>
        </section>

        <section className="editor-panel">
          <div className="panel-heading">
            <div>
              <span>
                Landingpages
              </span>

              <h2>
                SEO-Daten bearbeiten
              </h2>
            </div>

            <strong>
              {landingPages.length}
            </strong>
          </div>

          {landingPages.length === 0 ? (
            <div className="empty-state">
              Keine passenden Landingpages
              gefunden.
            </div>
          ) : (
            <div className="page-list">
              {landingPages.map(
                (page) => {
                  const publicPath =
                    `/dienstleistung/` +
                    `${page.service.slug}/` +
                    `${page.city.slug}`;

                  const expectedCanonical =
                    `${BASE_URL}${publicPath}`;

                  const titleState =
                    getTitleState(
                      page.seoTitle
                    );

                  const descriptionState =
                    getDescriptionState(
                      page.seoDescription
                    );

                  return (
                    <article
                      className="page-card"
                      key={page.id}
                    >
                      <div className="page-head">
                        <div>
                          <div className="badges">
                            <span
                              className={
                                page.status ===
                                "ACTIVE"
                                  ? "active"
                                  : "draft"
                              }
                            >
                              {page.status ===
                              "ACTIVE"
                                ? "Aktiv"
                                : "Entwurf"}
                            </span>

                            <span
                              className={
                                page.indexable
                                  ? "indexable"
                                  : "noindex"
                              }
                            >
                              {page.indexable
                                ? "Indexierbar"
                                : "Noindex"}
                            </span>
                          </div>

                          <h3>
                            {
                              page.service
                                .name
                            }{" "}
                            in{" "}
                            {page.city.name}
                          </h3>

                          <p>
                            {publicPath}
                          </p>
                        </div>

                        <div className="page-links">
                          <Link
                            href={`/admin/seo/landingpages/${page.id}`}
                          >
                            Detail
                          </Link>

                          <Link
                            href={
                              publicPath
                            }
                            target="_blank"
                          >
                            Öffnen
                          </Link>
                        </div>
                      </div>

                      <form
                        action={
                          updateSeoLandingPage
                        }
                      >
                        <input
                          type="hidden"
                          name="id"
                          value={page.id}
                        />

                        <div className="field">
                          <div className="field-heading">
                            <label
                              htmlFor={`title-${page.id}`}
                            >
                              SEO-Titel
                            </label>

                            <span
                              className={
                                titleState.className
                              }
                            >
                              {
                                titleState.label
                              }
                            </span>
                          </div>

                          <input
                            id={`title-${page.id}`}
                            name="seoTitle"
                            defaultValue={
                              page.seoTitle ??
                              ""
                            }
                            maxLength={120}
                            placeholder={`${page.service.name} in ${page.city.name} | Auftrago`}
                          />
                        </div>

                        <div className="field">
                          <div className="field-heading">
                            <label
                              htmlFor={`description-${page.id}`}
                            >
                              Meta-Beschreibung
                            </label>

                            <span
                              className={
                                descriptionState.className
                              }
                            >
                              {
                                descriptionState.label
                              }
                            </span>
                          </div>

                          <textarea
                            id={`description-${page.id}`}
                            name="seoDescription"
                            defaultValue={
                              page.seoDescription ??
                              ""
                            }
                            maxLength={320}
                            rows={3}
                            placeholder={`Finde passende Anbieter für ${page.service.name} in ${page.city.name}.`}
                          />
                        </div>

                        <div className="bottom-grid">
                          <div className="field">
                            <div className="field-heading">
                              <label
                                htmlFor={`canonical-${page.id}`}
                              >
                                Canonical URL
                              </label>
                            </div>

                            <input
                              id={`canonical-${page.id}`}
                              name="canonicalUrl"
                              defaultValue={
                                page.canonicalUrl ??
                                expectedCanonical
                              }
                              placeholder={
                                expectedCanonical
                              }
                            />
                          </div>

                          <label className="checkbox">
                            <input
                              type="checkbox"
                              name="indexable"
                              defaultChecked={
                                page.indexable
                              }
                            />

                            <span>
                              Für Google
                              indexierbar
                            </span>
                          </label>

                          <SaveButton />
                        </div>
                      </form>
                    </article>
                  );
                }
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

        .editor-page {
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

        .editor-shell {
          width: min(
            1500px,
            calc(100% - 32px)
          );
          margin: 0 auto;
          padding: 36px 0 70px;
        }

        .editor-header {
          display: flex;
          align-items: flex-end;
          justify-content:
            space-between;
          gap: 26px;
          padding: 30px;
          border:
            1px solid
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

        .editor-header h1 {
          margin: 0;
          font-size:
            clamp(40px, 6vw, 66px);
          line-height: 1;
          letter-spacing: -0.045em;
        }

        .editor-header p {
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
          border:
            1px solid
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
            repeat(4, minmax(0, 1fr));
          gap: 13px;
          margin: 20px 0;
        }

        .stats article {
          padding: 22px;
          border:
            1px solid
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

        .filter-panel,
        .editor-panel {
          padding: 24px;
          border:
            1px solid
            rgba(148, 163, 184, 0.13);
          border-radius: 24px;
          background:
            linear-gradient(
              145deg,
              rgba(15, 23, 42, 0.94),
              rgba(6, 9, 20, 0.98)
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
            180px
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

        input,
        textarea,
        select {
          width: 100%;
          border:
            1px solid
            rgba(148, 163, 184, 0.17);
          border-radius: 11px;
          outline: 0;
          background:
            rgba(255, 255, 255, 0.035);
          color: #ffffff;
          font: inherit;
        }

        input,
        select {
          min-height: 44px;
          padding: 0 12px;
        }

        textarea {
          padding: 12px;
          resize: vertical;
          line-height: 1.55;
        }

        select option {
          background: #111827;
        }

        input:focus,
        textarea:focus,
        select:focus {
          border-color:
            rgba(96, 165, 250, 0.7);
        }

        .filter-panel button,
        .filter-panel a {
          display: inline-flex;
          min-height: 44px;
          align-items: center;
          justify-content: center;
          padding: 0 15px;
          border: 0;
          border-radius: 11px;
          cursor: pointer;
          color: #ffffff;
          font-size: 9px;
          font-weight: 900;
          text-decoration: none;
        }

        .filter-panel button {
          background: #2563eb;
        }

        .filter-panel a {
          border:
            1px solid
            rgba(148, 163, 184, 0.15);
          background:
            rgba(255, 255, 255, 0.03);
        }

        .panel-heading {
          display: flex;
          align-items: center;
          justify-content:
            space-between;
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

        .page-list {
          display: grid;
          gap: 14px;
        }

        .page-card {
          padding: 20px;
          border:
            1px solid
            rgba(148, 163, 184, 0.12);
          border-radius: 18px;
          background:
            rgba(255, 255, 255, 0.025);
        }

        .page-head {
          display: flex;
          align-items: flex-start;
          justify-content:
            space-between;
          gap: 20px;
          margin-bottom: 18px;
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
        .indexable {
          background:
            rgba(34, 197, 94, 0.11);
          color: #86efac;
        }

        .draft {
          background:
            rgba(245, 158, 11, 0.11);
          color: #fde68a;
        }

        .noindex {
          background:
            rgba(239, 68, 68, 0.11);
          color: #fca5a5;
        }

        .page-head h3 {
          margin: 10px 0 0;
          font-size: 17px;
        }

        .page-head p {
          margin: 5px 0 0;
          color: #64748b;
          font-size: 9px;
        }

        .page-links {
          display: flex;
          gap: 7px;
        }

        .page-links a {
          display: inline-flex;
          padding: 8px 10px;
          border:
            1px solid
            rgba(148, 163, 184, 0.14);
          border-radius: 8px;
          color: #bfdbfe;
          font-size: 8px;
          font-weight: 900;
          text-decoration: none;
        }

        .page-card form {
          display: grid;
          gap: 14px;
        }

        .field-heading {
          display: flex;
          align-items: center;
          justify-content:
            space-between;
          gap: 12px;
          margin-bottom: 7px;
        }

        .field-heading label {
          color: #cbd5e1;
          font-size: 9px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .field-heading span {
          padding: 4px 7px;
          border-radius: 999px;
          font-size: 7px;
          font-weight: 900;
        }

        .field-heading .good {
          background:
            rgba(34, 197, 94, 0.11);
          color: #86efac;
        }

        .field-heading .warning {
          background:
            rgba(245, 158, 11, 0.11);
          color: #fde68a;
        }

        .field-heading .bad {
          background:
            rgba(239, 68, 68, 0.11);
          color: #fca5a5;
        }

        .bottom-grid {
          display: grid;
          grid-template-columns:
            minmax(0, 1fr)
            auto
            auto;
          gap: 14px;
          align-items: end;
        }

        .checkbox {
          display: flex;
          min-height: 44px;
          align-items: center;
          gap: 9px;
          padding: 0 13px;
          border:
            1px solid
            rgba(148, 163, 184, 0.14);
          border-radius: 11px;
          background:
            rgba(255, 255, 255, 0.025);
          color: #cbd5e1;
          font-size: 9px;
          font-weight: 800;
          white-space: nowrap;
        }

        .checkbox input {
          width: 16px;
          min-height: auto;
          height: 16px;
          padding: 0;
        }

        .bottom-grid button {
          min-height: 44px;
          padding: 0 17px;
          border: 0;
          border-radius: 11px;
          cursor: pointer;
          background:
            linear-gradient(
              135deg,
              #059669,
              #2563eb
            );
          color: #ffffff;
          font-size: 9px;
          font-weight: 900;
        }

        .bottom-grid button:disabled {
          cursor: wait;
          opacity: 0.6;
        }

        .empty-state {
          padding: 55px 20px;
          border:
            1px dashed
            rgba(148, 163, 184, 0.17);
          border-radius: 16px;
          color: #64748b;
          text-align: center;
        }

        @media (max-width: 1000px) {
          .filter-panel form {
            grid-template-columns:
              repeat(2, minmax(0, 1fr));
          }

          .bottom-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 800px) {
          .editor-header {
            align-items: flex-start;
            flex-direction: column;
          }

          .stats {
            grid-template-columns:
              repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 600px) {
          .editor-shell {
            width:
              calc(100% - 20px);
            padding-top: 14px;
          }

          .editor-header,
          .filter-panel,
          .editor-panel {
            padding: 20px;
            border-radius: 21px;
          }

          .header-actions {
            width: 100%;
          }

          .header-actions a {
            flex: 1;
          }

          .filter-panel form,
          .stats {
            grid-template-columns: 1fr;
          }

          .page-head {
            flex-direction: column;
          }
        }
      `}</style>
    </main>
  );
}
