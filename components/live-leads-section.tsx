import { prisma } from "@/lib/db";
import Link from "next/link";

function getIcon(category: string | null) {
  const value = (category || "").toLowerCase();

  if (value.includes("fenster")) return "🪟";
  if (value.includes("garten")) return "🌿";
  if (value.includes("hauswart")) return "🏢";
  if (value.includes("umzug")) return "🏠";
  if (value.includes("entsorgung")) return "♻️";
  if (value.includes("transport")) return "🚚";
  if (value.includes("maler")) return "🎨";

  return "🧹";
}

function formatTimeAgo(date: Date | null) {
  if (!date) return "Aktiv";

  const diffMs = Date.now() - new Date(date).getTime();
  const minutes = Math.max(1, Math.floor(diffMs / 60000));

  if (minutes < 60) return `vor ${minutes} Min.`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `vor ${hours} Std.`;

  return "Aktiv";
}

function cleanText(value: string | null | undefined, fallback: string) {
  const text = String(value || fallback)
    .replace(/\*\*/g, "")
    .replace(/>>/g, "")
    .replace(/>/g, "")
    .replace(/\s+/g, " ")
    .trim();

  return text || fallback;
}

function shortText(value: string | null | undefined, fallback: string, max = 42) {
  const text = cleanText(value, fallback);

  if (text.length <= max) return text;

  return `${text.slice(0, max).trim()}...`;
}

function getLeadTitle(title: string | null, category: string | null, region: string | null) {
  const cleanTitle = cleanText(title, "");
  const cleanCategory = cleanText(category, "Auftrag");
  const cleanRegion = cleanText(region, "Schweiz");

  if (!cleanTitle || cleanTitle.length > 70) {
    return `${cleanCategory} in ${cleanRegion}`;
  }

  return cleanTitle;
}

export default async function LiveLeadsSection() {
  const leads = await prisma.lead.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 12,
    select: {
      id: true,
      title: true,
      region: true,
      category: true,
      price: true,
      createdAt: true,
    },
  });

  if (!leads.length) return null;

  return (
    <section className="live-leads-section">
      <div className="container">
        <div className="live-leads-head">
          <span className="live-badge">
            <span className="live-dot" />
            NEUE AUFTRÄGE
          </span>

          <h2>Aktuelle Aufträge auf Auftrago</h2>

          <p>
            Anbieter sehen hier neue Anfragen aus verschiedenen Regionen.
            Vollständige Details, Adresse und Kontaktdaten sind erst nach
            Freischaltung sichtbar.
          </p>
        </div>

        <div className="live-leads-grid">
          {leads.map((lead, index) => {
            const title = getLeadTitle(lead.title, lead.category, lead.region);
            const region = shortText(lead.region, "Schweiz", 20);
            const category = shortText(lead.category, "Dienstleistung", 22);

            return (
              <article key={lead.id} className="live-lead-card">
                <div className="live-lead-top">
                  <span className="live-lead-icon">{getIcon(lead.category)}</span>
                  <span className="live-lead-new">
                    {index === 0 ? "🔥 Neu" : "Aktiv"}
                  </span>
                </div>

                <h3 className="live-lead-title">{title}</h3>

                <p className="live-lead-privacy">
                  🔒 Vollständige Auftragsdetails, Adresse und Kontaktdaten sind
                  erst nach Freischaltung sichtbar.
                </p>

                <div className="live-lead-meta">
                  <span>📍 {region}</span>
                  <span>🏷 {category}</span>
                  <span>⏱ {formatTimeAgo(lead.createdAt)}</span>
                </div>

                <div className="live-lead-bottom">
                  <div>
                    <strong>{lead.price || 20}</strong>
                    <span>Credits</span>
                  </div>

                  <Link href="/anbieter-werden">Auftrag ansehen →</Link>
                </div>
              </article>
            );
          })}
        </div>

        <div className="live-leads-cta">
          <div>
            <h3>Du bist Anbieter?</h3>
            <p>
              Registriere dich kostenlos und erhalte Zugang zu neuen Aufträgen
              aus deiner Region.
            </p>
          </div>

          <Link href="/anbieter-werden" className="btn btn-primary">
            Anbieter werden
          </Link>
        </div>
      </div>
    </section>
  );
}