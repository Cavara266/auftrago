import Link from "next/link";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const modules = [
  {
    title: "Städte",
    description:
      "SEO-Städte verwalten, aktivieren und regionale Landingpages vorbereiten.",
    href: "/admin/seo/cities",
    icon: "🏙",
    status: "Bereit",
  },
  {
    title: "Dienstleistungen",
    description:
      "Dienstleistungen, Slugs, SEO-Titel, Beschreibungen und Preisbereiche verwalten.",
    href: "/admin/seo/services",
    icon: "🛠",
    status: "Bereit",
  },
  {
    title: "Landingpages",
    description:
      "Regionale Stadt-Dienstleistungs-Kombinationen automatisch erzeugen und verwalten.",
    href: "/admin/seo/landingpages",
    icon: "🚀",
    status: "Aktiv",
  },
  {
    title: "Ratgeber",
    description:
      "SEO-Ratgeber und Informationsartikel erstellen und veröffentlichen.",
    href: "/admin/seo/articles",
    icon: "📰",
    status: "Vorbereitet",
  },
  {
    title: "FAQ",
    description:
      "Häufige Fragen zentral verwalten und für strukturierte Daten verwenden.",
    href: "/admin/seo/faq",
    icon: "❓",
    status: "Vorbereitet",
  },
  {
    title: "Sitemap",
    description:
      "Sitemap-Status prüfen und später die automatische Generierung verwalten.",
    href: "/admin/seo/sitemap",
    icon: "🗺",
    status: "Aktiv",
  },
  {
    title: "Redirects",
    description:
      "301-Weiterleitungen, alte URLs und potenzielle 404-Seiten verwalten.",
    href: "/admin/seo/redirects",
    icon: "🔀",
    status: "Vorbereitet",
  },
  {
    title: "SEO Freigabe",
    description:
      "Generierte Landingpages prüfen und einzeln oder gesammelt veröffentlichen.",
    href: "/admin/seo/publish",
    icon: "🚀",
    status: "Aktiv",
  },
  {
    title: "SEO Generator",
    description:
      "Städte und Dienstleistungen automatisch zu neuen Landingpages kombinieren.",
    href: "/admin/seo/generator",
    icon: "⚡",
    status: "Aktiv",
  },
  {
    title: "SEO Export",
    description:
      "Landingpages, URLs und SEO-Metadaten als Excel-kompatible CSV-Datei exportieren.",
    href: "/admin/seo/export",
    icon: "📥",
    status: "Aktiv",
  },
  {
    title: "SEO Content Generator",
    description:
      "Lokale Landingpages erstellen, prüfen, speichern und veröffentlichen.",
    href: "/admin/seo/ai-generator",
    icon: "🤖",
    status: "Aktiv",
  },
  {
    title: "Internal Linking",
    description:
      "Interne Verlinkungen analysieren und passende SEO-Linkvorschläge erstellen.",
    href: "/admin/seo/links",
    icon: "🔗",
    status: "Aktiv",
  },
  {
    title: "SEO Bulk Center",
    description:
      "Status und Indexierung mehrerer Landingpages gleichzeitig bearbeiten.",
    href: "/admin/seo/bulk",
    icon: "⚡",
    status: "Aktiv",
  },
  {
    title: "SEO Editor",
    description:
      "SEO-Titel, Meta-Beschreibungen, Canonicals und Indexierung direkt bearbeiten.",
    href: "/admin/seo/editor",
    icon: "✏️",
    status: "Aktiv",
  },
  {
    title: "Snippet Preview",
    description:
      "Google-Vorschau für SEO-Titel, Meta-Beschreibungen und öffentliche URLs kontrollieren.",
    href: "/admin/seo/snippets",
    icon: "👁️",
    status: "Aktiv",
  },
  {
    title: "SEO Audit",
    description:
      "Doppelte Metadaten, Thin Content, Canonicals und technische SEO-Probleme erkennen.",
    href: "/admin/seo/audit",
    icon: "🔍",
    status: "Aktiv",
  },
  {
    title: "SEO Health",
    description:
      "Landingpages automatisch auf Titel, Metadaten, Inhalte, FAQ und Indexierung prüfen.",
    href: "/admin/seo/health",
    icon: "🩺",
    status: "Aktiv",
  },
  {
    title: "Internal Linking",
    description:
      "Interne Verlinkungen, verwaiste Seiten und SEO-Linkpotenziale analysieren.",
    href: "/admin/seo/internal-links",
    icon: "🔗",
    status: "Aktiv",
  },
  {
    title: "SEO Analytics",
    description:
      "Landingpages, Indexierung, Meta-Probleme und interne Links überwachen.",
    href: "/admin/seo/analytics",
    icon: "📈",
    status: "Vorbereitet",
  },
  {
    title: "Einstellungen",
    description:
      "Globale SEO-Standards, Seitentitel, Canonicals und Indexierung festlegen.",
    href: "/admin/seo/settings",
    icon: "⚙",
    status: "Bereit",
  },
];

const quickStats = [
  {
    label: "SEO Score",
    value: "92",
    suffix: "/100",
    detail: "Technische Basis aktiv",
  },
  {
    label: "Landingpages",
    value: "24",
    suffix: "",
    detail: "Aktuell bekannte Seiten",
  },
  {
    label: "Städte",
    value: "18",
    suffix: "",
    detail: "Für SEO vorbereitet",
  },
  {
    label: "Dienstleistungen",
    value: "12",
    suffix: "",
    detail: "Im System erfasst",
  },
];

const checks = [
  {
    title: "Dynamische SEO-Route",
    text: "/dienstleistung/[service]/[city] ist vorbereitet.",
    state: "Aktiv",
    tone: "success",
  },
  {
    title: "Sitemap",
    text: "Die Next.js-Sitemap kann automatisch erweitert werden.",
    state: "Bereit",
    tone: "success",
  },
  {
    title: "SEO-Datenbank",
    text: "Prisma-Modelle werden im nächsten Schritt ergänzt.",
    state: "Offen",
    tone: "warning",
  },
  {
    title: "Google Search Console",
    text: "Die direkte Anbindung ist für eine spätere Ausbaustufe vorgesehen.",
    state: "Später",
    tone: "neutral",
  },
];

export default function AdminSeoPage() {
  return (
    <main className="seo-page">
      <div className="seo-glow seo-glow-one" />
      <div className="seo-glow seo-glow-two" />

      <div className="seo-shell">
        <header className="seo-header">
          <div>
            <Link href="/admin" className="seo-back-link">
              ← Zurück zum Admin-Dashboard
            </Link>

            <div className="seo-kicker">
              <span className="seo-live-dot" />
              Auftrago SEO Administration
            </div>

            <h1>SEO Center</h1>

            <p>
              Verwalte Städte, Dienstleistungen, Inhalte, interne Links und
              technische SEO-Einstellungen an einem zentralen Ort.
            </p>
          </div>

          <div className="seo-header-actions">
            <Link href="/admin/seo/cities" className="seo-button seo-button-primary">
              + Neue Stadt
            </Link>

            <Link
              href="/admin/seo/services"
              className="seo-button seo-button-secondary"
            >
              Dienstleistungen
            </Link>

            <Link href="/sitemap.xml" className="seo-button seo-button-ghost">
              Sitemap öffnen
            </Link>
          </div>
        </header>

        <section className="seo-stats-grid" aria-label="SEO Kennzahlen">
          {quickStats.map((item) => (
            <article className="seo-stat-card" key={item.label}>
              <span>{item.label}</span>

              <div className="seo-stat-value">
                <strong>{item.value}</strong>
                {item.suffix ? <small>{item.suffix}</small> : null}
              </div>

              <p>{item.detail}</p>
            </article>
          ))}
        </section>

        <section className="seo-highlight">
          <div>
            <span className="seo-highlight-label">✦ SEO Automatisierung</span>

            <h2>Das Fundament für skalierbare Landingpages steht.</h2>

            <p>
              Im nächsten Schritt verbinden wir dieses Center mit Prisma. Danach
              kannst du Städte, Dienstleistungen, Meta-Daten, FAQs und
              Preisbereiche direkt im Adminbereich verwalten.
            </p>
          </div>

          <Link href="/admin/seo/settings" className="seo-button seo-button-primary">
            SEO einrichten
          </Link>
        </section>

        <section className="seo-content-grid">
          <div className="seo-main-column">
            <div className="seo-section-head">
              <div>
                <span>Verwaltung</span>
                <h2>SEO-Module</h2>
              </div>

              <small>{modules.length} Bereiche</small>
            </div>

            <div className="seo-module-grid">
              {modules.map((module) => (
                <Link
                  href={module.href}
                  className="seo-module-card"
                  key={module.title}
                >
                  <div className="seo-module-top">
                    <div className="seo-module-icon">{module.icon}</div>
                    <span>{module.status}</span>
                  </div>

                  <h3>{module.title}</h3>
                  <p>{module.description}</p>

                  <div className="seo-module-link">Öffnen →</div>
                </Link>
              ))}
            </div>
          </div>

          <aside className="seo-side-column">
            <article className="seo-panel">
              <div className="seo-section-head compact">
                <div>
                  <span>Status</span>
                  <h2>SEO-System</h2>
                </div>
              </div>

              <div className="seo-check-list">
                {checks.map((check) => (
                  <div className="seo-check-row" key={check.title}>
                    <div className={`seo-check-dot ${check.tone}`} />

                    <div>
                      <strong>{check.title}</strong>
                      <p>{check.text}</p>
                    </div>

                    <span className={`seo-check-state ${check.tone}`}>
                      {check.state}
                    </span>
                  </div>
                ))}
              </div>
            </article>

            <article className="seo-panel seo-ai-panel">
              <span className="seo-ai-label">AI SEO</span>

              <h2>Automatische Chancenanalyse</h2>

              <p>
                Später erkennt das System fehlende Städte, dünne Inhalte,
                doppelte Meta-Titel, fehlende Links und neue Keyword-Chancen.
              </p>

              <Link href="/admin/seo/analytics">Analyse vorbereiten →</Link>
            </article>
          </aside>
        </section>

        <section className="seo-roadmap">
          <div className="seo-section-head">
            <div>
              <span>Nächste Schritte</span>
              <h2>SEO Center Roadmap</h2>
            </div>
          </div>

          <div className="seo-roadmap-grid">
            {[
              {
                number: "01",
                title: "Prisma erweitern",
                text: "Modelle für Städte, SEO-Dienstleistungen, FAQs, Artikel und Weiterleitungen.",
              },
              {
                number: "02",
                title: "CRUD aktivieren",
                text: "Erstellen, Bearbeiten, Aktivieren und Löschen direkt im Adminbereich.",
              },
              {
                number: "03",
                title: "Landingpages verbinden",
                text: "Dynamische Seiten lesen ihre Inhalte automatisch aus der Datenbank.",
              },
              {
                number: "04",
                title: "SEO Intelligence",
                text: "Automatische Prüfungen für Meta-Daten, Inhalte, Links und Indexierung.",
              },
            ].map((item) => (
              <article key={item.number}>
                <span>{item.number}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </section>
      </div>

      <style>{`
        :global(*) {
          box-sizing: border-box;
        }

        :global(body) {
          margin: 0;
          background: #050711;
        }

        .seo-page {
          position: relative;
          min-height: 100vh;
          overflow: hidden;
          background:
            radial-gradient(circle at top left, rgba(59, 130, 246, 0.12), transparent 28%),
            radial-gradient(circle at bottom right, rgba(124, 58, 237, 0.12), transparent 30%),
            #050711;
          color: #f8fafc;
          font-family:
            Inter,
            ui-sans-serif,
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
        }

        .seo-glow {
          position: fixed;
          width: 360px;
          height: 360px;
          border-radius: 999px;
          filter: blur(120px);
          pointer-events: none;
          opacity: 0.25;
        }

        .seo-glow-one {
          top: -120px;
          right: 8%;
          background: #2563eb;
        }

        .seo-glow-two {
          bottom: -160px;
          left: 4%;
          background: #7c3aed;
        }

        .seo-shell {
          position: relative;
          z-index: 1;
          width: min(1480px, calc(100% - 32px));
          margin: 0 auto;
          padding: 36px 0 64px;
        }

        .seo-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 30px;
          margin-bottom: 28px;
          padding: 28px;
          border: 1px solid rgba(148, 163, 184, 0.14);
          border-radius: 30px;
          background:
            linear-gradient(145deg, rgba(15, 23, 42, 0.94), rgba(6, 9, 20, 0.96));
          box-shadow: 0 28px 80px rgba(0, 0, 0, 0.32);
        }

        .seo-back-link {
          display: inline-flex;
          margin-bottom: 22px;
          color: #94a3b8;
          font-size: 13px;
          font-weight: 800;
          text-decoration: none;
        }

        .seo-back-link:hover {
          color: #ffffff;
        }

        .seo-kicker {
          display: flex;
          align-items: center;
          gap: 9px;
          margin-bottom: 12px;
          color: #60a5fa;
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .seo-live-dot {
          width: 9px;
          height: 9px;
          border-radius: 999px;
          background: #22c55e;
          box-shadow: 0 0 18px rgba(34, 197, 94, 0.9);
        }

        .seo-header h1 {
          margin: 0;
          font-size: clamp(38px, 6vw, 68px);
          line-height: 0.98;
          letter-spacing: -0.045em;
        }

        .seo-header p {
          max-width: 760px;
          margin: 18px 0 0;
          color: #a8b3c7;
          font-size: 16px;
          line-height: 1.75;
        }

        .seo-header-actions {
          display: flex;
          flex-wrap: wrap;
          justify-content: flex-end;
          gap: 11px;
        }

        .seo-button {
          display: inline-flex;
          min-height: 48px;
          align-items: center;
          justify-content: center;
          padding: 0 18px;
          border-radius: 14px;
          font-size: 13px;
          font-weight: 900;
          text-decoration: none;
          transition:
            transform 0.2s ease,
            border-color 0.2s ease,
            background 0.2s ease;
        }

        .seo-button:hover {
          transform: translateY(-2px);
        }

        .seo-button-primary {
          border: 1px solid #3b82f6;
          background: linear-gradient(135deg, #2563eb, #7c3aed);
          color: white;
          box-shadow: 0 12px 30px rgba(37, 99, 235, 0.25);
        }

        .seo-button-secondary {
          border: 1px solid rgba(148, 163, 184, 0.2);
          background: rgba(255, 255, 255, 0.06);
          color: #ffffff;
        }

        .seo-button-ghost {
          border: 1px solid rgba(148, 163, 184, 0.14);
          background: transparent;
          color: #cbd5e1;
        }

        .seo-stats-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 16px;
          margin-bottom: 22px;
        }

        .seo-stat-card {
          padding: 24px;
          border: 1px solid rgba(148, 163, 184, 0.13);
          border-radius: 24px;
          background:
            linear-gradient(145deg, rgba(255, 255, 255, 0.045), rgba(8, 12, 25, 0.96));
        }

        .seo-stat-card > span {
          color: #93c5fd;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.09em;
          text-transform: uppercase;
        }

        .seo-stat-value {
          display: flex;
          align-items: baseline;
          gap: 7px;
          margin-top: 14px;
        }

        .seo-stat-value strong {
          font-size: 34px;
          line-height: 1;
        }

        .seo-stat-value small {
          color: #94a3b8;
          font-size: 14px;
          font-weight: 800;
        }

        .seo-stat-card p {
          margin: 10px 0 0;
          color: #7f8ca3;
          font-size: 13px;
          line-height: 1.5;
        }

        .seo-highlight {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 30px;
          margin-bottom: 24px;
          padding: 30px;
          border: 1px solid rgba(56, 189, 248, 0.2);
          border-radius: 28px;
          background:
            radial-gradient(circle at 88% 18%, rgba(56, 189, 248, 0.16), transparent 27%),
            linear-gradient(135deg, rgba(8, 47, 73, 0.55), rgba(8, 12, 25, 0.97));
        }

        .seo-highlight-label,
        .seo-ai-label {
          display: inline-flex;
          padding: 7px 11px;
          border-radius: 999px;
          background: rgba(56, 189, 248, 0.1);
          color: #7dd3fc;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .seo-highlight h2 {
          margin: 14px 0 0;
          font-size: clamp(24px, 3vw, 35px);
          line-height: 1.2;
        }

        .seo-highlight p {
          max-width: 880px;
          margin: 11px 0 0;
          color: #9aa8bd;
          font-size: 14px;
          line-height: 1.75;
        }

        .seo-content-grid {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 390px;
          gap: 22px;
        }

        .seo-section-head {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 18px;
        }

        .seo-section-head.compact {
          margin-bottom: 10px;
        }

        .seo-section-head span {
          display: block;
          margin-bottom: 7px;
          color: #60a5fa;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.09em;
          text-transform: uppercase;
        }

        .seo-section-head h2 {
          margin: 0;
          font-size: 25px;
          line-height: 1.2;
        }

        .seo-section-head small {
          color: #7f8ca3;
          font-size: 12px;
          font-weight: 800;
        }

        .seo-module-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 16px;
        }

        .seo-module-card {
          min-height: 230px;
          padding: 22px;
          border: 1px solid rgba(148, 163, 184, 0.13);
          border-radius: 24px;
          background:
            linear-gradient(145deg, rgba(255, 255, 255, 0.045), rgba(8, 12, 25, 0.96));
          color: inherit;
          text-decoration: none;
          transition:
            transform 0.2s ease,
            border-color 0.2s ease,
            box-shadow 0.2s ease;
        }

        .seo-module-card:hover {
          transform: translateY(-4px);
          border-color: rgba(96, 165, 250, 0.42);
          box-shadow: 0 22px 50px rgba(0, 0, 0, 0.24);
        }

        .seo-module-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .seo-module-icon {
          display: grid;
          width: 48px;
          height: 48px;
          place-items: center;
          border: 1px solid rgba(96, 165, 250, 0.18);
          border-radius: 15px;
          background: rgba(59, 130, 246, 0.09);
          font-size: 21px;
        }

        .seo-module-top > span {
          padding: 6px 9px;
          border-radius: 999px;
          background: rgba(34, 197, 94, 0.08);
          color: #86efac;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        .seo-module-card h3 {
          margin: 20px 0 0;
          font-size: 21px;
        }

        .seo-module-card p {
          margin: 10px 0 0;
          color: #8f9bb0;
          font-size: 13px;
          line-height: 1.65;
        }

        .seo-module-link {
          margin-top: 22px;
          color: #93c5fd;
          font-size: 12px;
          font-weight: 900;
        }

        .seo-side-column {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .seo-panel {
          padding: 22px;
          border: 1px solid rgba(148, 163, 184, 0.13);
          border-radius: 24px;
          background:
            linear-gradient(145deg, rgba(255, 255, 255, 0.045), rgba(8, 12, 25, 0.96));
        }

        .seo-check-list {
          display: flex;
          flex-direction: column;
        }

        .seo-check-row {
          display: grid;
          grid-template-columns: 10px minmax(0, 1fr) auto;
          gap: 12px;
          align-items: start;
          padding: 16px 0;
          border-bottom: 1px solid rgba(148, 163, 184, 0.09);
        }

        .seo-check-row:last-child {
          border-bottom: 0;
        }

        .seo-check-dot {
          width: 8px;
          height: 8px;
          margin-top: 5px;
          border-radius: 999px;
        }

        .seo-check-dot.success {
          background: #22c55e;
          box-shadow: 0 0 12px rgba(34, 197, 94, 0.6);
        }

        .seo-check-dot.warning {
          background: #f59e0b;
        }

        .seo-check-dot.neutral {
          background: #64748b;
        }

        .seo-check-row strong {
          display: block;
          font-size: 13px;
        }

        .seo-check-row p {
          margin: 6px 0 0;
          color: #7f8ca3;
          font-size: 12px;
          line-height: 1.55;
        }

        .seo-check-state {
          padding: 5px 7px;
          border-radius: 999px;
          font-size: 9px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .seo-check-state.success {
          background: rgba(34, 197, 94, 0.09);
          color: #86efac;
        }

        .seo-check-state.warning {
          background: rgba(245, 158, 11, 0.1);
          color: #fcd34d;
        }

        .seo-check-state.neutral {
          background: rgba(100, 116, 139, 0.14);
          color: #cbd5e1;
        }

        .seo-ai-panel {
          background:
            radial-gradient(circle at 90% 10%, rgba(124, 58, 237, 0.18), transparent 30%),
            linear-gradient(145deg, rgba(42, 22, 87, 0.54), rgba(8, 12, 25, 0.97));
        }

        .seo-ai-panel h2 {
          margin: 16px 0 0;
          font-size: 24px;
        }

        .seo-ai-panel p {
          margin: 11px 0 0;
          color: #9aa8bd;
          font-size: 13px;
          line-height: 1.7;
        }

        .seo-ai-panel a {
          display: inline-flex;
          margin-top: 22px;
          color: #c4b5fd;
          font-size: 12px;
          font-weight: 900;
          text-decoration: none;
        }

        .seo-roadmap {
          margin-top: 24px;
          padding: 26px;
          border: 1px solid rgba(148, 163, 184, 0.13);
          border-radius: 28px;
          background:
            linear-gradient(145deg, rgba(255, 255, 255, 0.035), rgba(8, 12, 25, 0.96));
        }

        .seo-roadmap-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 14px;
        }

        .seo-roadmap-grid article {
          padding: 20px;
          border: 1px solid rgba(148, 163, 184, 0.1);
          border-radius: 20px;
          background: rgba(255, 255, 255, 0.025);
        }

        .seo-roadmap-grid article > span {
          color: #60a5fa;
          font-size: 12px;
          font-weight: 900;
        }

        .seo-roadmap-grid h3 {
          margin: 14px 0 0;
          font-size: 17px;
        }

        .seo-roadmap-grid p {
          margin: 9px 0 0;
          color: #7f8ca3;
          font-size: 12px;
          line-height: 1.6;
        }

        @media (max-width: 1100px) {
          .seo-content-grid {
            grid-template-columns: 1fr;
          }

          .seo-side-column {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .seo-roadmap-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 850px) {
          .seo-header,
          .seo-highlight {
            align-items: flex-start;
            flex-direction: column;
          }

          .seo-header-actions {
            justify-content: flex-start;
          }

          .seo-stats-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 640px) {
          .seo-shell {
            width: min(100% - 20px, 1480px);
            padding-top: 14px;
          }

          .seo-header,
          .seo-highlight,
          .seo-panel,
          .seo-roadmap {
            padding: 20px;
            border-radius: 22px;
          }

          .seo-header h1 {
            font-size: 42px;
          }

          .seo-header-actions {
            width: 100%;
          }

          .seo-button {
            width: 100%;
          }

          .seo-stats-grid,
          .seo-module-grid,
          .seo-side-column,
          .seo-roadmap-grid {
            grid-template-columns: 1fr;
          }

          .seo-module-card {
            min-height: auto;
          }
        }
      `}</style>
    </main>
  );
}
