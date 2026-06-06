type PublicLead = {
  id: string;
  title: string;
  region: string;
  category: string;
  price: number;
  createdAt: Date;
};

type LiveLeadFeedProps = {
  leads: PublicLead[];
  todayCount: number;
  weekCount: number;
  totalCount: number;
};

function timeAgo(date: Date) {
  const diff = Date.now() - new Date(date).getTime();
  const minutes = Math.max(1, Math.floor(diff / 1000 / 60));

  if (minutes < 60) {
    return `vor ${minutes} Min.`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `vor ${hours} Std.`;
  }

  const days = Math.floor(hours / 24);

  return `vor ${days} Tg.`;
}

export default function LiveLeadFeed({
  leads,
  todayCount,
  weekCount,
  totalCount,
}: LiveLeadFeedProps) {
  return (
    <section className="live-feed-section">
      <div className="container">
        <div className="live-feed-shell">
          <div className="live-feed-head">
            <div>
              <span className="eyebrow">Live auf Auftrago</span>
              <h2>Aktuelle Aufträge in deiner Region.</h2>
              <p>
                Neue Kundenanfragen kommen laufend rein. Anbieter sehen hier
                echte Nachfrage aus der Schweiz.
              </p>
            </div>

            <div className="live-feed-pulse">
              <span />
              Live
            </div>
          </div>

          <div className="live-stats-grid">
            <div>
              <strong>{totalCount}</strong>
              <span>Anfragen insgesamt</span>
            </div>

            <div>
              <strong>{weekCount}</strong>
              <span>Neue Anfragen diese Woche</span>
            </div>

            <div>
              <strong>{todayCount}</strong>
              <span>Neue Anfragen heute</span>
            </div>
          </div>

          <div className="live-lead-list">
            {leads.length > 0 ? (
              leads.map((lead) => (
                <article key={lead.id} className="live-lead-item">
                  <div className="live-lead-dot" />

                  <div>
                    <div className="live-lead-meta">
                      <span>{timeAgo(lead.createdAt)}</span>
                      <span>{lead.category}</span>
                      <span>{lead.region}</span>
                    </div>

                    <h3>{lead.title}</h3>

                    <p>
                      Neuer Auftrag in {lead.region}. Kontaktinformationen sind
                      nur für registrierte Anbieter sichtbar.
                    </p>
                  </div>

                  <div className="live-lead-price">
                    <strong>{lead.price}</strong>
                    <span>Credits</span>
                  </div>
                </article>
              ))
            ) : (
              <div className="live-feed-empty">
                <h3>Noch keine öffentlichen Aufträge vorhanden.</h3>
                <p>
                  Sobald neue Anfragen erfasst werden, erscheinen sie hier
                  automatisch.
                </p>
              </div>
            )}
          </div>

          <div className="live-feed-actions">
            <a href="/anbieter" className="btn btn-primary">
              Als Anbieter starten
            </a>

            <a href="/offerte-anfragen" className="btn btn-secondary">
              Offerte anfragen
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}