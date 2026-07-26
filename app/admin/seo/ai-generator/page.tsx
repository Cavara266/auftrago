import Link from "next/link";

import { prisma } from "@/lib/prisma";

import GeneratorForm from "./generator-form";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AiSeoGeneratorPage() {
  const [
    cities,
    services,
    existingPages,
    totalLandingPages,
    activeLandingPages,
    draftLandingPages,
  ] = await Promise.all([
    prisma.seoCity.findMany({
      where: {
        status: {
          in: [
            "ACTIVE",
            "DRAFT",
          ],
        },
      },

      select: {
        id: true,
        name: true,
        slug: true,
        canton: true,
        neighboringCities: true,
      },

      orderBy: [
        {
          canton: "asc",
        },
        {
          name: "asc",
        },
      ],
    }),

    prisma.seoServicePage.findMany({
      where: {
        status: {
          in: [
            "ACTIVE",
            "DRAFT",
          ],
        },
      },

      select: {
        id: true,
        name: true,
        shortName: true,
        slug: true,
        description: true,
        priceMinCents: true,
        priceMaxCents: true,
        priceUnit: true,
        benefits: true,
      },

      orderBy: {
        name: "asc",
      },
    }),

    prisma.seoLandingPage.findMany({
      select: {
        id: true,
        cityId: true,
        serviceId: true,
        headline: true,
        introduction: true,
        content: true,
        seoTitle: true,
        seoDescription: true,
        canonicalUrl: true,
        customPriceMinCents: true,
        customPriceMaxCents: true,
        status: true,
      },
    }),

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
  ]);

  const possibleCombinations =
    cities.length * services.length;

  const missingCombinations =
    Math.max(
      possibleCombinations -
        totalLandingPages,
      0
    );

  return (
    <main className="generator-page">
      <div className="generator-shell">
        <header className="generator-header">
          <div>
            <Link
              href="/admin/seo"
              className="back-link"
            >
              ← Zurück zum SEO Center
            </Link>

            <span className="kicker">
              Content Automation
            </span>

            <h1>SEO Content Generator</h1>

            <p>
              Erstelle und bearbeite lokale
              Landingpages für Dienstleistungen
              und Städte. Prüfe die Vorschau und
              speichere die Inhalte als Entwurf
              oder veröffentliche sie direkt.
            </p>
          </div>

          <div className="header-actions">
            <Link href="/admin/seo/editor">
              SEO Editor
            </Link>

            <Link href="/admin/seo/bulk">
              Bulk Center
            </Link>

            <Link href="/admin/seo/audit">
              SEO Audit
            </Link>
          </div>
        </header>

        <section className="stats">
          <article>
            <span>Städte</span>
            <strong>{cities.length}</strong>
            <small>verfügbare Regionen</small>
          </article>

          <article>
            <span>Dienstleistungen</span>
            <strong>{services.length}</strong>
            <small>SEO-Servicebereiche</small>
          </article>

          <article>
            <span>Landingpages</span>
            <strong>
              {totalLandingPages}
            </strong>
            <small>bereits erstellt</small>
          </article>

          <article>
            <span>Aktiv</span>
            <strong>
              {activeLandingPages}
            </strong>
            <small>veröffentlicht</small>
          </article>

          <article>
            <span>Entwürfe</span>
            <strong>
              {draftLandingPages}
            </strong>
            <small>noch zu prüfen</small>
          </article>

          <article>
            <span>Potenzial</span>
            <strong>
              {missingCombinations}
            </strong>
            <small>noch nicht erstellt</small>
          </article>
        </section>

        {cities.length === 0 ||
        services.length === 0 ? (
          <section className="setup-warning">
            <strong>
              Generator noch nicht bereit
            </strong>

            <p>
              Es müssen mindestens eine
              SEO-Stadt und eine
              SEO-Dienstleistung vorhanden
              sein.
            </p>

            <div>
              <Link href="/admin/seo/cities">
                Städte verwalten
              </Link>

              <Link href="/admin/seo/services">
                Dienstleistungen verwalten
              </Link>
            </div>
          </section>
        ) : (
          <GeneratorForm
            cities={cities}
            services={services}
            existingPages={existingPages}
          />
        )}
      </div>

      <style suppressHydrationWarning>{`
        :global(body) {
          margin: 0;
          background: #050711;
        }

        * {
          box-sizing: border-box;
        }

        .generator-page {
          min-height: 100vh;
          background:
            radial-gradient(
              circle at top right,
              rgba(124, 58, 237, 0.16),
              transparent 28%
            ),
            radial-gradient(
              circle at bottom left,
              rgba(37, 99, 235, 0.12),
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

        .generator-shell {
          width: min(
            1550px,
            calc(100% - 32px)
          );
          margin: 0 auto;
          padding: 36px 0 70px;
        }

        .generator-header {
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
          color: #a78bfa;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .generator-header h1 {
          margin: 0;
          font-size:
            clamp(40px, 6vw, 66px);
          line-height: 1;
          letter-spacing: -0.045em;
        }

        .generator-header p {
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
            repeat(6, minmax(0, 1fr));
          gap: 13px;
          margin: 20px 0;
        }

        .stats article {
          padding: 20px;
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

        .stats span {
          display: block;
          color: #c4b5fd;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.07em;
          text-transform: uppercase;
        }

        .stats strong {
          display: block;
          margin-top: 10px;
          font-size: 29px;
        }

        .stats small {
          display: block;
          margin-top: 6px;
          color: #64748b;
          font-size: 8px;
        }

        .setup-warning {
          padding: 45px;
          border: 1px solid
            rgba(245, 158, 11, 0.2);
          border-radius: 24px;
          background:
            rgba(245, 158, 11, 0.06);
          text-align: center;
        }

        .setup-warning strong {
          font-size: 22px;
        }

        .setup-warning p {
          color: #cbd5e1;
        }

        .setup-warning div {
          display: flex;
          justify-content: center;
          gap: 10px;
          margin-top: 20px;
        }

        .setup-warning a {
          padding: 11px 15px;
          border-radius: 11px;
          background: #2563eb;
          color: #ffffff;
          font-size: 10px;
          font-weight: 900;
          text-decoration: none;
        }

        @media (max-width: 1100px) {
          .stats {
            grid-template-columns:
              repeat(3, minmax(0, 1fr));
          }
        }

        @media (max-width: 800px) {
          .generator-header {
            align-items: flex-start;
            flex-direction: column;
          }
        }

        @media (max-width: 600px) {
          .generator-shell {
            width: calc(100% - 20px);
            padding-top: 14px;
          }

          .generator-header {
            padding: 20px;
            border-radius: 21px;
          }

          .stats {
            grid-template-columns:
              repeat(2, minmax(0, 1fr));
          }

          .header-actions {
            width: 100%;
          }

          .header-actions a {
            flex: 1;
          }

          .setup-warning {
            padding: 25px 18px;
          }

          .setup-warning div {
            flex-direction: column;
          }
        }
      `}</style>
    </main>
  );
}
