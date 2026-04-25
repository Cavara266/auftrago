import AppShell from "@/components/app-shell";
import Link from "next/link";

const demoLeads = [
  {
    id: "demo-1",
    title: "Hauswartung Anfrage",
    city: "Aargau",
    category: "Hauswartung",
    status: "Neu",
  },
  {
    id: "demo-2",
    title: "Reinigung Anfrage",
    city: "Zürich",
    category: "Reinigung",
    status: "Neu",
  },
];

export default function LeadsPage() {
  return (
    <AppShell>
      <main className="section">
        <div className="container">
          <span className="eyebrow">Leads</span>

          <h1>
            Aktuelle
            <br />
            Kundenanfragen.
          </h1>

          <p>
            Hier werden später echte Kundenanfragen angezeigt. Aktuell ist diese
            Seite vorbereitet, damit der Build sauber funktioniert.
          </p>

          <div className="service-grid">
            {demoLeads.map((lead) => (
              <article className="service-card" key={lead.id}>
                <h3>{lead.title}</h3>
                <p>
                  {lead.category} · {lead.city}
                </p>
                <p>Status: {lead.status}</p>

                <Link href={`/leads/${lead.id}`} className="btn btn-secondary">
                  Details ansehen
                </Link>
              </article>
            ))}
          </div>
        </div>
      </main>
    </AppShell>
  );
}