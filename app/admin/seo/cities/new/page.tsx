import Link from "next/link";
import CityForm from "../city-form";
import { createSeoCity } from "../actions";

export default function NewSeoCityPage() {
  return (
    <main className="city-editor-page">
      <div className="city-editor-shell">
        <header>
          <Link href="/admin/seo/cities">
            ← Zurück zu den Städten
          </Link>

          <span>SEO Stadt</span>
          <h1>Neue Stadt</h1>

          <p>
            Erstelle eine neue Stadt für regionale SEO-Landingpages.
          </p>
        </header>

        <CityForm
          action={createSeoCity}
          submitLabel="Stadt speichern"
        />
      </div>

      <style>{`
        :global(body) {
          margin: 0;
          background: #050711;
        }

        .city-editor-page {
          min-height: 100vh;
          background:
            radial-gradient(circle at top right, rgba(37, 99, 235, 0.12), transparent 28%),
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

        .city-editor-shell {
          width: min(1100px, calc(100% - 32px));
          margin: 0 auto;
          padding: 36px 0 70px;
        }

        header {
          margin-bottom: 24px;
          padding: 28px;
          border: 1px solid rgba(148, 163, 184, 0.14);
          border-radius: 28px;
          background: linear-gradient(
            145deg,
            rgba(15, 23, 42, 0.94),
            rgba(6, 9, 20, 0.97)
          );
        }

        header a {
          display: inline-flex;
          margin-bottom: 20px;
          color: #94a3b8;
          font-size: 13px;
          font-weight: 800;
          text-decoration: none;
        }

        header > span {
          display: block;
          margin-bottom: 9px;
          color: #60a5fa;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        header h1 {
          margin: 0;
          font-size: clamp(40px, 6vw, 62px);
          line-height: 1;
          letter-spacing: -0.04em;
        }

        header p {
          margin: 15px 0 0;
          color: #94a3b8;
          line-height: 1.7;
        }

        @media (max-width: 560px) {
          .city-editor-shell {
            width: calc(100% - 20px);
            padding-top: 14px;
          }

          header {
            padding: 20px;
            border-radius: 22px;
          }
        }
      `}</style>
    </main>
  );
}
