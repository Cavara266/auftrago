import Link from "next/link";

import { prisma } from "@/lib/prisma";

import GeneratorForm from "./generator-form";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function SeoGeneratorPage() {
  const [
    activeCities,
    activeServices,
    existingLandingPages,
  ] = await Promise.all([
    prisma.seoCity.count({
      where: {
        status: "ACTIVE",
        indexable: true,
      },
    }),

    prisma.seoServicePage.count({
      where: {
        status: "ACTIVE",
        indexable: true,
      },
    }),

    prisma.seoLandingPage.count(),
  ]);

  const possibleCombinations =
    activeCities * activeServices;

  const missingCombinations = Math.max(
    possibleCombinations - existingLandingPages,
    0
  );

  return (
    <main className="generator-page">
      <div className="generator-shell">
        <header className="generator-header">
          <div>
            <Link href="/admin/seo" className="generator-back">
              ← Zurück zum SEO Center
            </Link>

            <span className="generator-kicker">
              Programmatic SEO
            </span>

            <h1>Landingpage Generator</h1>

            <p>
              Kombiniere aktive Städte und Dienstleistungen
              automatisch zu vollständigen SEO-Landingpages.
              Bereits vorhandene Kombinationen werden übersprungen.
            </p>
          </div>

          <div className="generator-header-actions">
            <Link href="/admin/seo/landingpages">
              Landingpages
            </Link>

            <Link href="/admin/seo/health">
              SEO Health
            </Link>
          </div>
        </header>

        <section className="generator-stats">
          <article>
            <span>Aktive Städte</span>
            <strong>{activeCities}</strong>
          </article>

          <article>
            <span>Aktive Dienstleistungen</span>
            <strong>{activeServices}</strong>
          </article>

          <article>
            <span>Mögliche Kombinationen</span>
            <strong>{possibleCombinations}</strong>
          </article>

          <article>
            <span>Bereits vorhanden</span>
            <strong>{existingLandingPages}</strong>
          </article>

          <article>
            <span>Noch generierbar</span>
            <strong>{missingCombinations}</strong>
          </article>
        </section>

        <section className="generator-layout">
          <GeneratorForm />

          <aside className="generator-sidebar">
            <div>
              <span>So funktioniert es</span>

              <h2>Sichere automatische Erstellung</h2>

              <p>
                Der Generator liest alle aktiven Städte und
                Dienstleistungen aus der Datenbank und erstellt
                daraus neue Kombinationen.
              </p>
            </div>

            <ul>
              <li>
                <b>01</b>
                Doppelte Seiten werden automatisch verhindert.
              </li>

              <li>
                <b>02</b>
                Titel, Beschreibung, H1, Inhalt und Canonical
                werden erzeugt.
              </li>

              <li>
                <b>03</b>
                Preise werden von der Dienstleistung übernommen.
              </li>

              <li>
                <b>04</b>
                Entwürfe erscheinen nicht in der Sitemap.
              </li>

              <li>
                <b>05</b>
                Danach können alle Seiten im SEO Health Center
                geprüft werden.
              </li>
            </ul>

            <div className="generator-recommendation">
              <strong>Empfehlung</strong>

              <p>
                Zuerst 50 bis 100 Seiten als Entwurf erzeugen,
                Qualität prüfen und erst danach schrittweise
                veröffentlichen.
              </p>
            </div>
          </aside>
        </section>
      </div>

      <style suppressHydrationWarning>{`
        :global(body) {
          margin: 0;
          background: #050711;
        }

        .generator-page {
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

        .generator-shell {
          width: min(1450px, calc(100% - 32px));
          margin: 0 auto;
          padding: 36px 0 70px;
        }

        .generator-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 25px;
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

        .generator-back {
          display: inline-flex;
          margin-bottom: 20px;
          color: #94a3b8;
          font-size: 13px;
          font-weight: 800;
          text-decoration: none;
        }

        .generator-kicker {
          display: block;
          margin-bottom: 10px;
          color: #60a5fa;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .generator-header h1 {
          margin: 0;
          font-size: clamp(38px, 6vw, 65px);
          line-height: 1;
          letter-spacing: -0.045em;
        }

        .generator-header p {
          max-width: 760px;
          margin: 16px 0 0;
          color: #94a3b8;
          line-height: 1.7;
        }

        .generator-header-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .generator-header-actions a {
          display: inline-flex;
          min-height: 46px;
          align-items: center;
          justify-content: center;
          padding: 0 17px;
          border: 1px solid rgba(148, 163, 184, 0.16);
          border-radius: 13px;
          background: rgba(255, 255, 255, 0.04);
          color: #ffffff;
          font-size: 11px;
          font-weight: 900;
          text-decoration: none;
        }

        .generator-stats {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 13px;
          margin: 20px 0;
        }

        .generator-stats article {
          padding: 21px;
          border: 1px solid rgba(148, 163, 184, 0.13);
          border-radius: 20px;
          background:
            linear-gradient(
              145deg,
              rgba(255, 255, 255, 0.04),
              rgba(8, 12, 25, 0.96)
            );
        }

        .generator-stats span {
          display: block;
          min-height: 27px;
          color: #93c5fd;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.07em;
          line-height: 1.4;
          text-transform: uppercase;
        }

        .generator-stats strong {
          display: block;
          margin-top: 10px;
          font-size: 30px;
        }

        .generator-layout {
          display: grid;
          grid-template-columns:
            minmax(0, 1.55fr)
            minmax(320px, 0.75fr);
          gap: 20px;
          align-items: start;
        }

        .generator-sidebar {
          padding: 25px;
          border: 1px solid rgba(148, 163, 184, 0.14);
          border-radius: 25px;
          background:
            linear-gradient(
              145deg,
              rgba(15, 23, 42, 0.94),
              rgba(6, 9, 20, 0.98)
            );
        }

        .generator-sidebar > div:first-child > span {
          color: #60a5fa;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .generator-sidebar h2 {
          margin: 10px 0 0;
          font-size: 22px;
        }

        .generator-sidebar p {
          margin: 10px 0 0;
          color: #8390a5;
          font-size: 11px;
          line-height: 1.7;
        }

        .generator-sidebar ul {
          display: grid;
          gap: 11px;
          margin: 23px 0 0;
          padding: 0;
          list-style: none;
        }

        .generator-sidebar li {
          display: grid;
          grid-template-columns: 31px minmax(0, 1fr);
          gap: 10px;
          align-items: start;
          padding: 13px;
          border-radius: 13px;
          background: rgba(255, 255, 255, 0.025);
          color: #a8b3c4;
          font-size: 10px;
          line-height: 1.6;
        }

        .generator-sidebar li b {
          display: grid;
          width: 28px;
          height: 28px;
          place-items: center;
          border-radius: 9px;
          background: rgba(37, 99, 235, 0.12);
          color: #93c5fd;
          font-size: 9px;
        }

        .generator-recommendation {
          margin-top: 22px;
          padding: 16px;
          border: 1px solid rgba(245, 158, 11, 0.18);
          border-radius: 14px;
          background: rgba(245, 158, 11, 0.06);
        }

        .generator-recommendation strong {
          color: #fde68a;
          font-size: 11px;
        }

        .generator-recommendation p {
          color: #d6c48c;
        }

        @media (max-width: 1050px) {
          .generator-stats {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }

          .generator-layout {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 700px) {
          .generator-header {
            align-items: flex-start;
            flex-direction: column;
          }

          .generator-header-actions {
            width: 100%;
          }

          .generator-header-actions a {
            flex: 1;
          }

          .generator-stats {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 500px) {
          .generator-shell {
            width: calc(100% - 20px);
            padding-top: 14px;
          }

          .generator-header {
            padding: 20px;
            border-radius: 22px;
          }

          .generator-stats {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </main>
  );
}
