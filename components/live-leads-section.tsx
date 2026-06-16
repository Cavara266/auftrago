import { prisma } from "@/lib/db";
import Link from "next/link";

function shorten(text: string | null, length = 80) {
  if (!text) return "";
  return text.length > length ? `${text.slice(0, length)}...` : text;
}

function getIcon(category: string | null) {
  const value = (category || "").toLowerCase();

  if (value.includes("fenster")) return "🪟";
  if (value.includes("garten")) return "🌿";
  if (value.includes("hauswart")) return "🏢";
  if (value.includes("umzug")) return "🏠";
  if (value.includes("entsorgung")) return "♻️";
  if (value.includes("transport")) return "🚚";

  return "🧹";
}

export default async function LiveLeadsSection() {
  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: "desc" },
    take: 6,
    select: {
      id: true,
      title: true,
      description: true,
      region: true,
      category: true,
      price: true,
    },
  });

  if (!leads.length) return null;

  return (
    <section className="live-leads-section">
      <div className="container">
        <div className="live-leads-head">
          <span className="live-badge">
            <span className="live-dot" />
            LIVE AUF AUFTRAGO
          </span>

          <h2>Aktuelle Aufträge auf Auftrago</h2>

          <p>
            Privatpersonen und Firmen suchen täglich passende Anbieter für
            Reinigung, Umzug, Hauswartung, Gartenpflege und weitere
            Dienstleistungen.
          </p>
        </div>

        <div className="live-leads-stats">
          <div>
            <strong>{leads.length}</strong>
            <span>Aktuelle Aufträge</span>
          </div>

          <div>
            <strong>ab {Math.min(...leads.map((lead) => lead.price || 20))}</strong>
            <span>Credits pro Auftrag</span>
          </div>

          <div>
            <strong>24h</strong>
            <span>Neue Anfragen</span>
          </div>
        </div>

        <div className="live-leads-grid">
          {leads.map((lead, index) => (
            <article key={lead.id} className="live-lead-card">
              <div className="live-lead-top">
                <span className="live-lead-icon">{getIcon(lead.category)}</span>
                <span className="live-lead-new">
                  {index === 0 ? "🔥 Neu" : "Aktiv"}
                </span>
              </div>

              <h3>{lead.title || lead.category || "Neuer Auftrag"}</h3>

              <p>{shorten(lead.description)}</p>

              <div className="live-lead-meta">
                <span>📍 {lead.region || "Schweiz"}</span>
                <span>🏷 {lead.category || "Dienstleistung"}</span>
              </div>

              <div className="live-lead-bottom">
                <div>
                  <strong>{lead.price || 20}</strong>
                  <span>Credits</span>
                </div>

                <Link href="/anbieter-werden">Auftrag ansehen →</Link>
              </div>
            </article>
          ))}
        </div>

        <div className="live-leads-cta">
          <div>
            <h3>Du bist Anbieter?</h3>
            <p>Erhalte Zugang zu neuen Aufträgen aus deiner Region.</p>
          </div>

          <Link href="/anbieter-werden" className="btn btn-primary">
            Anbieter werden
          </Link>
        </div>
      </div>
    </section>
  );
}