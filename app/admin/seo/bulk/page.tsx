import Link from "next/link";

import { prisma } from "@/lib/prisma";

import BulkManager from "./bulk-manager";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

type SearchParams = {
  query?: string;
  status?: string;
  indexable?: string;
};

export default async function SeoBulkPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const query =
    searchParams.query?.trim() ?? "";

  const status =
    searchParams.status ?? "ALL";

  const indexable =
    searchParams.indexable ?? "ALL";

  const pages =
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

        ...(status === "ACTIVE"
          ? {
              status: "ACTIVE",
            }
          : {}),

        ...(status === "DRAFT"
          ? {
              status: "DRAFT",
            }
          : {}),

        ...(indexable === "YES"
          ? {
              indexable: true,
            }
          : {}),

        ...(indexable === "NO"
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

      orderBy: {
        updatedAt: "desc",
      },

      take: 500,
    });

  const [
    totalPages,
    activePages,
    draftPages,
    indexablePages,
  ] = await Promise.all([
    prisma.seoLandingPage.count(),

    prisma.seoLandingPage.count({
      where: {
        status: "ACTIVE",
      },
    }),

    prisma.seoLandingPage.count({
      where: {
        status: "DRAFT",
      },
    }),

    prisma.seoLandingPage.count({
      where: {
        indexable: true,
      },
    }),
  ]);

  const serializedPages =
    pages.map((page) => ({
      id: page.id,

      title:
        page.headline ||
        page.seoTitle ||
        `${page.service.name} in ${page.city.name}`,

      cityName: page.city.name,

      serviceName:
        page.service.name,

      publicPath:
        `/dienstleistung/${page.service.slug}/${page.city.slug}`,

      status: page.status,

      indexable:
        page.indexable,

      updatedAt:
        page.updatedAt.toISOString(),
    }));

  return (
    <main className="bulk-page">
      <div className="bulk-shell">
        <header className="bulk-header">
          <div>
            <Link
              href="/admin/seo"
              className="back-link"
            >
              ← Zurück zum SEO Center
            </Link>

            <span className="kicker">
              Massenbearbeitung
            </span>

            <h1>SEO Bulk Center</h1>

            <p>
              Bearbeite den Status und die
              Indexierung mehrerer
              SEO-Landingpages gleichzeitig.
            </p>
          </div>

          <div className="header-actions">
            <Link href="/admin/seo/editor">
              SEO Editor
            </Link>

            <Link href="/admin/seo/audit">
              SEO Audit
            </Link>

            <Link href="/admin/seo/sitemap">
              Sitemap
            </Link>
          </div>
        </header>

        <section className="stats">
          <article>
            <span>Landingpages</span>
            <strong>{totalPages}</strong>
            <small>insgesamt</small>
          </article>

          <article>
            <span>Aktiv</span>
            <strong>{activePages}</strong>
            <small>veröffentlicht</small>
          </article>

          <article>
            <span>Entwürfe</span>
            <strong>{draftPages}</strong>
            <small>nicht veröffentlicht</small>
          </article>

          <article>
            <span>Indexierbar</span>
            <strong>
              {indexablePages}
            </strong>
            <small>für Google freigegeben</small>
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
                defaultValue={indexable}
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

            <Link href="/admin/seo/bulk">
              Zurücksetzen
            </Link>
          </form>
        </section>

        <section className="bulk-panel">
          <div className="panel-heading">
            <div>
              <span>
                Landingpages auswählen
              </span>

              <h2>
                Massenaktion ausführen
              </h2>
            </div>

            <strong>
              {serializedPages.length}
            </strong>
          </div>

          <BulkManager
            pages={serializedPages}
          />
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

        .bulk-page {
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

        .bulk-shell {
          width: min(
            1500px,
            calc(100% - 32px)
          );
          margin: 0 auto;
          padding: 36px 0 70px;
        }

        .bulk-header {
          display: flex;
          align-items: flex-end;
          justify-content:
            space-between;
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

        .bulk-header h1 {
          margin: 0;
          font-size:
            clamp(40px, 6vw, 66px);
          line-height: 1;
          letter-spacing: -0.045em;
        }

        .bulk-header p {
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
            repeat(4, minmax(0, 1fr));
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

        .filter-panel,
        .bulk-panel {
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

        @media (max-width: 1000px) {
          .filter-panel form {
            grid-template-columns:
              repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 800px) {
          .bulk-header {
            align-items: flex-start;
            flex-direction: column;
          }

          .stats {
            grid-template-columns:
              repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 600px) {
          .bulk-shell {
            width: calc(100% - 20px);
            padding-top: 14px;
          }

          .bulk-header,
          .filter-panel,
          .bulk-panel {
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
        }
      `}</style>
    </main>
  );
}
