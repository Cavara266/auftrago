import Link from "next/link";
import { cookies } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { buyLeadAction } from "../actions";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("de-CH", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function cleanDescription(description: string | null) {
  if (!description) return "Keine zusätzliche Beschreibung vorhanden.";

  return description
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .join("\n");
}

export default async function LeadDetailPage({ params }: PageProps) {
  const { id } = await params;

  const cookieStore = await cookies();
  const providerId = cookieStore.get("auftrago_session")?.value;

  if (!providerId) {
    redirect("/login");
  }

  const provider = await prisma.provider.findUnique({
    where: { id: providerId },
    include: {
      purchases: {
        select: {
          leadId: true,
        },
      },
    },
  });

  if (!provider) {
    redirect("/login");
  }

  const lead = await prisma.lead.findUnique({
    where: { id },
  });

  if (!lead) {
    notFound();
  }

  const isBought = provider.purchases.some(
    (purchase) => purchase.leadId === lead.id
  );

  const hasEnoughCredits = provider.credits >= lead.price;

  return (
    <main className="page">
      <section className="lead-detail-section">
        <div className="container">
          <Link href="/portal/leads" className="lead-detail-back">
            ← Zurück zu den Leads
          </Link>

          <div className="lead-detail-shell">
            <div className="lead-detail-main">
              <div className="lead-detail-card">
                <div className="lead-detail-badges">
                  <span>{lead.category}</span>
                  <span>{lead.region}</span>
                  <span>{isBought ? "Freigeschaltet" : "Kontakt gesperrt"}</span>
                </div>

                <h1>{lead.title}</h1>

                <div className="lead-detail-grid">
                  <div>
                    <small>Kategorie</small>
                    <strong>{lead.category}</strong>
                  </div>

                  <div>
                    <small>Region</small>
                    <strong>{lead.region}</strong>
                  </div>

                  <div>
                    <small>Angefragt am</small>
                    <strong>{formatDate(lead.createdAt)}</strong>
                  </div>

                  <div>
                    <small>Leadpreis</small>
                    <strong>{lead.price} Credits</strong>
                  </div>
                </div>
              </div>

              <div className="lead-detail-card">
                <h2>Beschreibung</h2>
                <p className="lead-detail-description">
                  {cleanDescription(lead.description)}
                </p>
              </div>

              {isBought ? (
                <div className="lead-detail-card">
                  <h2>Kontaktdaten</h2>

                  <div className="lead-detail-grid">
                    <div>
                      <small>Name</small>
                      <strong>{lead.name || "Nicht angegeben"}</strong>
                    </div>

                    <div>
                      <small>Telefon</small>
                      <strong>{lead.phone || "Nicht angegeben"}</strong>
                    </div>

                    <div>
                      <small>E-Mail</small>
                      <strong>{lead.email || "Nicht angegeben"}</strong>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="lead-detail-card lead-detail-locked">
                  <h2>Kontakt gesperrt</h2>
                  <p>
                    Die vollständigen Kontaktdaten werden erst nach dem
                    Freischalten angezeigt.
                  </p>

                  <div className="locked-grid">
                    <span>🔒 Name verborgen</span>
                    <span>🔒 Telefon verborgen</span>
                    <span>🔒 E-Mail verborgen</span>
                  </div>
                </div>
              )}
            </div>

            <aside className="lead-detail-sidebar">
              <div className="lead-detail-buybox">
                <span>Lead kaufen</span>
                <h2>{lead.price} Credits</h2>

                <p>
                  Nach dem Kauf erhältst du alle Kontaktdaten und kannst den
                  Kunden direkt kontaktieren.
                </p>

                {isBought ? (
                  <Link href="/portal/meine-leads" className="btn btn-secondary leadx-full">
                    Kontakt ansehen
                  </Link>
                ) : hasEnoughCredits ? (
                  <form action={buyLeadAction}>
                    <input type="hidden" name="leadId" value={lead.id} />

                    <button type="submit" className="btn btn-primary leadx-full">
                      Kontakt freischalten
                    </button>
                  </form>
                ) : (
                  <Link href="/portal/guthaben" className="btn btn-primary leadx-full">
                    Credits aufladen
                  </Link>
                )}
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}