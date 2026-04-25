import AppShell from "@/components/app-shell";
import Link from "next/link";

export default function LeadDetailPage({
  params,
}: {
  params: {
    id: string;
  };
}) {
  return (
    <AppShell>
      <main className="section">
        <div className="container">
          <span className="eyebrow">Lead Detail</span>

          <h1>
            Anfrage
            <br />
            ansehen.
          </h1>

          <div className="provider-dashboard-card">
            <div className="provider-dashboard-top">
              <span>Lead-ID</span>
              <strong>{params.id}</strong>
            </div>

            <h2>Demo Anfrage</h2>

            <div className="provider-dashboard-list">
              <div>
                <span>01</span>
                <strong>Kategorie</strong>
                <p>Hauswartung / Reinigung</p>
              </div>

              <div>
                <span>02</span>
                <strong>Region</strong>
                <p>Aargau / Zürich</p>
              </div>

              <div>
                <span>03</span>
                <strong>Status</strong>
                <p>Vorbereitet für späteres Lead-System.</p>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 30 }}>
            <Link href="/leads" className="btn btn-secondary">
              Zurück zu Leads
            </Link>
          </div>
        </div>
      </main>
    </AppShell>
  );
}