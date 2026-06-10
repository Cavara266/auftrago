import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const statusLabels: Record<string, string> = {
  OPEN: "Offene Anfrage",
  CONTACTED: "Kontaktiert",
  APPOINTMENT_SET: "Termin abgemacht",
  OFFER_SENT: "Offerte geschickt",
  WON: "Auftrag gewonnen",
  LOST: "Auftrag verloren",
  NO_OFFER: "Kein Angebot gemacht",
};

export default async function MeineLeadsPage() {
  const cookieStore = await cookies();
  const providerId = cookieStore.get("auftrago_session")?.value;

  if (!providerId) redirect("/login");

  const provider = await prisma.provider.findUnique({
    where: { id: providerId },
    include: {
      purchases: {
        include: {
          lead: true,
          notes: true,
          messages: true,
          activities: true,
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!provider) redirect("/login");

  return (
    <main className="page">
      <section className="portal-clean">
        <div className="container">
          <div className="portal-section-head">
            <div>
              <span>Firmenportal</span>
              <h1>Meine gekauften Leads</h1>
              <p>
                Verwalte deine Leads, Notizen, Nachrichten, Status und
                Aktivitäten.
              </p>
            </div>

            <Link href="/portal/leads" className="btn btn-secondary">
              Neue Leads ansehen
            </Link>
          </div>

          <div className="portal-leads-stack">
            {provider.purchases.length > 0 ? (
              provider.purchases.map((purchase) => (
                <article key={purchase.id} className="portal-lead-card">
                  <div className="portal-lead-left">
                    <div className="portal-lead-tags">
                      <span>{statusLabels[purchase.status]}</span>
                      <span>{purchase.lead.category}</span>
                      <span>{purchase.lead.region}</span>
                    </div>

                    <h3>{purchase.lead.title}</h3>

                    <div className="portal-lead-meta">
                      <span>📍 {purchase.lead.region}</span>
                      <span>👤 {purchase.lead.name}</span>
                      <span>📞 {purchase.lead.phone}</span>
                      <span>✉️ {purchase.lead.email}</span>
                    </div>
                  </div>

                  <div className="portal-lead-right">
                    <div>
                      <strong>{purchase.price}</strong>
                      <span>Credits</span>
                    </div>

                    <Link
                      href={`/portal/meine-leads/${purchase.id}`}
                      className="btn btn-primary"
                    >
                      Öffnen
                    </Link>
                  </div>
                </article>
              ))
            ) : (
              <div className="portal-empty">
                <h3>Noch keine Leads gekauft</h3>
                <p>Gekaufte Leads erscheinen hier.</p>
                <Link href="/portal/leads" className="btn btn-primary">
                  Leads ansehen
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}