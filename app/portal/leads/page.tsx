import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { buyLeadAction } from "./actions";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams?: Promise<{
    error?: string;
    message?: string;
    region?: string;
    category?: string;
  }>;
};

const regions = [
  "Aargau",
  "Zürich",
  "Bern",
  "Luzern",
  "Basel",
  "Solothurn",
  "Zug",
  "St. Gallen",
];

const categories = [
  "Hauswartung",
  "Reinigung",
  "Gartenpflege",
  "Maler",
  "Gipser",
  "Sanitär",
  "Elektriker",
  "Umzug",
  "Entsorgung",
];

function getErrorMessage(error?: string) {
  switch (error) {
    case "invalid-lead":
      return "Der Lead konnte nicht verarbeitet werden.";
    case "lead-not-found":
      return "Der ausgewählte Lead wurde nicht gefunden.";
    case "not-enough-credits":
      return "Nicht genügend Credits vorhanden. Bitte lade dein Guthaben auf.";
    default:
      return "";
  }
}

function getInfoMessage(message?: string) {
  switch (message) {
    case "purchased":
      return "Lead erfolgreich gekauft.";
    case "already-bought":
      return "Dieser Lead wurde bereits gekauft.";
    default:
      return "";
  }
}

export default async function PortalLeadsPage({ searchParams }: PageProps) {
  const params = searchParams ? await searchParams : undefined;

  const selectedRegion = params?.region || "";
  const selectedCategory = params?.category || "";

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

  const leads = await prisma.lead.findMany({
    where: {
      ...(selectedRegion ? { region: selectedRegion } : {}),
      ...(selectedCategory ? { category: selectedCategory } : {}),
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const sortedLeads = [...leads].sort((a, b) => {
    const aMatch =
      a.region === provider.region || a.category === provider.category;
    const bMatch =
      b.region === provider.region || b.category === provider.category;

    if (aMatch === bMatch) {
      return b.createdAt.getTime() - a.createdAt.getTime();
    }

    return aMatch ? -1 : 1;
  });

  const purchasedLeadIds = new Set(
    provider.purchases.map((purchase) => purchase.leadId)
  );

  const errorMessage = getErrorMessage(params?.error);
  const infoMessage = getInfoMessage(params?.message);

  return (
    <main className="page">
      <section className="lead-market-hero">
        <div className="container">
          <span className="eyebrow">Lead-Marketplace</span>

          <div className="lead-market-head">
            <div>
              <h1>Neue Leads einkaufen.</h1>
              <p>
                Filtere passende Anfragen nach Region und Kategorie. Relevante
                Leads für dein Profil werden automatisch zuerst angezeigt.
              </p>
            </div>

            <div className="lead-market-actions">
              <Link href="/portal" className="btn btn-secondary">
                Zum Dashboard
              </Link>

              <Link href="/portal/guthaben" className="btn btn-primary">
                Guthaben aufladen
              </Link>
            </div>
          </div>

          <div className="lead-market-stats">
            <div className="lead-market-stat">
              <strong>{provider.credits}</strong>
              <span>Verfügbare Credits</span>
            </div>

            <div className="lead-market-stat">
              <strong>{sortedLeads.length}</strong>
              <span>Gefundene Leads</span>
            </div>

            <div className="lead-market-stat">
              <strong>{purchasedLeadIds.size}</strong>
              <span>Bereits gekauft</span>
            </div>

            <div className="lead-market-stat">
              <strong>{provider.region || "—"}</strong>
              <span>Deine Region</span>
            </div>
          </div>

          {errorMessage ? (
            <div className="lead-market-error">{errorMessage}</div>
          ) : null}

          {infoMessage ? (
            <div className="lead-market-success">{infoMessage}</div>
          ) : null}
        </div>
      </section>

      <section className="lead-market-section">
        <div className="container lead-market-layout">
          <div className="lead-market-list">
            <form className="lead-market-filter" action="/portal/leads">
              <div>
                <label>Region</label>
                <select name="region" defaultValue={selectedRegion}>
                  <option value="">Alle Regionen</option>
                  {regions.map((region) => (
                    <option key={region} value={region}>
                      {region}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label>Kategorie</label>
                <select name="category" defaultValue={selectedCategory}>
                  <option value="">Alle Kategorien</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <button type="submit" className="btn btn-primary">
                Filter anwenden
              </button>

              <Link href="/portal/leads" className="btn btn-secondary">
                Zurücksetzen
              </Link>
            </form>

            {sortedLeads.length === 0 ? (
              <div className="lead-market-empty">
                <span>Keine Leads gefunden</span>
                <h2>Für diese Filter gibt es aktuell keine Leads.</h2>
                <p>
                  Entferne den Filter oder prüfe später erneut neue Anfragen.
                </p>
              </div>
            ) : (
              sortedLeads.map((lead) => {
                const isBought = purchasedLeadIds.has(lead.id);
                const hasEnoughCredits = provider.credits >= lead.price;
                const isMatching =
                  lead.region === provider.region ||
                  lead.category === provider.category;

                return (
                  <article key={lead.id} className="lead-market-card">
                    <div className="lead-market-card-main">
                      <div className="lead-market-badges">
                        <span>{isBought ? "Freigeschaltet" : "Neu"}</span>
                        {isMatching ? <span>Passend</span> : null}
                        <span>{lead.category}</span>
                        <span>{lead.region}</span>
                      </div>

                      <h2>{lead.title}</h2>
                      <p>{lead.description}</p>

                      <div className="lead-market-meta">
                        <span>Preis: {lead.price} Credits</span>
                        <span>
                          Erstellt:{" "}
                          {new Intl.DateTimeFormat("de-CH").format(
                            lead.createdAt
                          )}
                        </span>
                        <span>
                          Status:{" "}
                          {isBought
                            ? "Kontaktdaten sichtbar"
                            : "Kontaktdaten gesperrt"}
                        </span>
                      </div>

                      <div className="lead-market-contact">
                        <span>Kontaktdaten</span>

                        {isBought ? (
                          <div className="lead-market-contact-grid">
                            <div>
                              <small>Name</small>
                              <strong>{lead.name}</strong>
                            </div>

                            <div>
                              <small>E-Mail</small>
                              <strong>{lead.email}</strong>
                            </div>

                            <div>
                              <small>Telefon</small>
                              <strong>{lead.phone}</strong>
                            </div>
                          </div>
                        ) : (
                          <p>
                            Nach dem Kauf werden Name, E-Mail und Telefonnummer
                            freigeschaltet.
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="lead-market-buybox">
                      <span>Leadpreis</span>
                      <strong>{lead.price}</strong>
                      <small>Credits</small>

                      <div className="lead-market-buy-actions">
                        {isBought ? (
                          <button type="button" className="btn btn-secondary" disabled>
                            Bereits gekauft
                          </button>
                        ) : hasEnoughCredits ? (
                          <form action={buyLeadAction}>
                            <input type="hidden" name="leadId" value={lead.id} />
                            <button type="submit" className="btn btn-primary">
                              Lead kaufen
                            </button>
                          </form>
                        ) : (
                          <Link href="/portal/guthaben" className="btn btn-primary">
                            Credits aufladen
                          </Link>
                        )}

                        <Link href="/portal/meine-leads" className="btn btn-secondary">
                          Meine Leads
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })
            )}
          </div>

          <aside className="lead-market-sidebar">
            <div className="lead-market-side-card">
              <span>Dein Konto</span>
              <h2>Anbieterstatus</h2>

              <div className="lead-market-side-stat">
                <strong>{provider.credits}</strong>
                <span>Aktuelle Credits</span>
              </div>

              <div className="lead-market-side-stat">
                <strong>{provider.companyName}</strong>
                <span>Firma</span>
              </div>

              <div className="lead-market-side-stat">
                <strong>{provider.category || "—"}</strong>
                <span>Deine Kategorie</span>
              </div>
            </div>

            <div className="lead-market-side-card">
              <span>Filter-Tipp</span>
              <h2>Passende Leads</h2>

              <p>
                Leads mit deiner Region oder Kategorie werden automatisch weiter
                oben angezeigt. So findest du schneller relevante Aufträge.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}