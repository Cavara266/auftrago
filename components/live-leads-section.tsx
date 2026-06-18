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

export default async function LiveLeadsSection() {
  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: "desc" },
    take: 6,
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

  const averageCredits = Math.round(
    leads.reduce((sum, lead) => sum + (lead.price || 20), 0) / leads.length
  );

  return (
    <section className="live-leads-section">
      <div className="container">
        <div className="live-leads-head">
          <span className="live-badge">
            <span className="live-dot" />
            LIVE AUF AUFTRAGO
          </span>

          <h2>Aktuelle Aufträge in deiner Region</h2>

          <p>
            Auftrago zeigt laufend neue Anfragen von Kunden aus der Schweiz.
            Exakte Kontaktdaten und Adressen sind erst nach Freischaltung
            sichtbar.
          </p>
        </div>

        <div className="live-leads-stats">
          <div>
            <strong>{leads.length}</strong>
            <span>Aktuelle Aufträge</span>
          </div>

          <div>
            <strong>{averageCredits}</strong>
            <span>Ø Credits pro Auftrag</span>
          </div>

          <div>
            <strong>Live</strong>
            <span>Neue Anfragen verfügbar</span>
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

              <p className="live-lead-privacy">
                🔒 Vollständige Auftragsdetails, Adresse und Kontaktdaten sind
                erst nach Freischaltung sichtbar.
              </p>

              <div className="live-lead-meta">
                <span>📍 {lead.region || "Schweiz"}</span>
                <span>🏷 {lead.category || "Dienstleistung"}</span>
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
          ))}
        </div>

        <div className="live-leads-cta">
          <div>
            <h3>Du bist Anbieter?</h3>
            <p>
              Erhalte Zugang zu neuen Aufträgen aus deiner Region und kaufe nur
              Leads, die zu deinem Betrieb passen.
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