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
  "Fensterreinigung",
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

function estimateOrderValue(price: number) {
  if (price <= 10) return "CHF 300–600";
  if (price <= 20) return "CHF 600–1'200";
  if (price <= 35) return "CHF 1'200–2'500";
  if (price <= 55) return "CHF 2'500–4'500";
  return "CHF 4'500+";
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

  const purchasedLeadIds = new Set(
    provider.purchases.map((purchase) => purchase.leadId)
  );

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

  const errorMessage = getErrorMessage(params?.error);
  const infoMessage = getInfoMessage(params?.message);

  return (
    <main className="page">
      <section className="leadx-hero">
        <div className="container leadx-hero-shell">
          <div className="leadx-hero-content">
            <span className="eyebrow">Lead-Marketplace</span>

            <h1>Neue Aufträge sichern.</h1>

            <p>
              Kaufe nur Leads, die wirklich zu deiner Firma passen. Nach dem
              Freischalten erhältst du Name, E-Mail und Telefonnummer des Kunden.
            </p>

            <div className="leadx-hero-badges">
              <span>🔥 34 neue Anfragen heute</span>
              <span>🔒 Kontakt erst nach Kauf sichtbar</span>
              <span>⚡ Sofort verfügbar</span>
            </div>
          </div>

          <div className="leadx-hero-actions">
            <Link href="/portal" className="btn btn-secondary">
              Dashboard
            </Link>

            <Link href="/portal/guthaben" className="btn btn-primary">
              Credits kaufen
            </Link>
          </div>
        </div>
      </section>

      <section className="leadx-section">
        <div className="container">
          {errorMessage ? (
            <div className="leadx-error">{errorMessage}</div>
          ) : null}

          {infoMessage ? (
            <div className="leadx-success">{infoMessage}</div>
          ) : null}

          {provider.credits <= 0 ? (
            <div className="leadx-credit-warning">
              <div>
                <span>⚠️ Guthaben leer</span>
                <h2>Du verpasst gerade kaufbereite Kunden.</h2>
                <p>
                  Lade Credits auf, damit du Kontakte sofort freischalten und
                  Kunden direkt kontaktieren kannst.
                </p>
              </div>

              <Link href="/portal/guthaben" className="btn btn-primary">
                Jetzt Guthaben aufladen
              </Link>
            </div>
          ) : null}

          <div className="leadx-stats">
            <div>
              <strong>{provider.credits}</strong>
              <span>Credits verfügbar</span>
            </div>

            <div>
              <strong>{sortedLeads.length}</strong>
              <span>Neue Leads verfügbar</span>
            </div>

            <div>
              <strong>{purchasedLeadIds.size}</strong>
              <span>Bereits freigeschaltet</span>
            </div>

            <div>
              <strong>{provider.region || "Schweiz"}</strong>
              <span>Deine Region</span>
            </div>
          </div>

          <div className="leadx-layout">
            <div className="leadx-main">
              <form className="leadx-filter" action="/portal/leads">
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
                  Passende Leads finden
                </button>

                <Link href="/portal/leads" className="btn btn-secondary">
                  Zurücksetzen
                </Link>
              </form>

              {sortedLeads.length === 0 ? (
                <div className="leadx-empty">
                  <span>Keine Leads gefunden</span>
                  <h2>Für diese Filter gibt es aktuell keine Leads.</h2>
                  <p>
                    Entferne den Filter oder prüfe später erneut neue Anfragen.
                  </p>
                </div>
              ) : (
                <div className="leadx-list">
                  {sortedLeads.map((lead) => {
                    const isBought = purchasedLeadIds.has(lead.id);
                    const hasEnoughCredits = provider.credits >= lead.price;
                    const isMatching =
                      lead.region === provider.region ||
                      lead.category === provider.category;

                    return (
                      <article key={lead.id} className="leadx-card">
                        <div className="leadx-card-main">
                          <div className="leadx-badges">
                            <span>{isBought ? "Freigeschaltet" : "Neu"}</span>
                            {isMatching ? <span>Perfekt passend</span> : null}
                            <span>{lead.category}</span>
                            <span>{lead.region}</span>
                          </div>

                          <h2>{lead.title}</h2>

                          <p>{lead.description}</p>

                          <div className="leadx-value-grid">
                            <div>
                              <small>Geschätzter Auftragswert</small>
                              <strong>{estimateOrderValue(lead.price)}</strong>
                            </div>

                            <div>
                              <small>Leadpreis</small>
                              <strong>{lead.price} Credits</strong>
                            </div>

                            <div>
                              <small>Status</small>
                              <strong>
                                {isBought ? "Kontakt sichtbar" : "Gesperrt"}
                              </strong>
                            </div>
                          </div>

                          <div className="leadx-locked-box">
                            <span>Kontaktdaten</span>

                            {isBought ? (
                              <div className="leadx-contact-grid">
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
                                Nach dem Kauf werden Name, E-Mail und
                                Telefonnummer sofort freigeschaltet.
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="leadx-buybox">
                          <div className="leadx-buy-top">
                            <span>Nur</span>
                            <strong>{lead.price}</strong>
                            <small>Credits</small>
                          </div>

                          <div className="leadx-fomo">
                            <span>🔥 Hohe Anfragequalität</span>
                            <span>👀 Mehrere Anbieter sehen diesen Lead</span>
                            <span>⚡ Sofort kontaktieren</span>
                          </div>

                          {isBought ? (
                            <Link
                              href="/portal/meine-leads"
                              className="btn btn-secondary leadx-full"
                            >
                              Kontakt ansehen
                            </Link>
                          ) : hasEnoughCredits ? (
                            <form action={buyLeadAction}>
                              <input
                                type="hidden"
                                name="leadId"
                                value={lead.id}
                              />

                              <button
                                type="submit"
                                className="btn btn-primary leadx-full"
                              >
                                Kontakt jetzt freischalten
                              </button>
                            </form>
                          ) : (
                            <Link
                              href="/portal/guthaben"
                              className="btn btn-primary leadx-full"
                            >
                              Credits aufladen
                            </Link>
                          )}

                          <Link
                            href="/portal/meine-leads"
                            className="btn btn-secondary leadx-full"
                          >
                            Meine Leads
                          </Link>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </div>

            <aside className="leadx-sidebar">
              <div className="leadx-side-card">
                <span>Dein Konto</span>
                <h2>Anbieterstatus</h2>

                <div className="leadx-side-stat">
                  <strong>{provider.credits}</strong>
                  <small>Aktuelle Credits</small>
                </div>

                <div className="leadx-side-stat">
                  <strong>{provider.companyName}</strong>
                  <small>Firma</small>
                </div>

                <div className="leadx-side-stat">
                  <strong>{provider.category || "—"}</strong>
                  <small>Deine Kategorie</small>
                </div>
              </div>

              <div className="leadx-side-card leadx-profit">
                <span>Rechner</span>
                <h2>Warum sich Leads lohnen.</h2>

                <p>
                  Ein Lead für 20 Credits kann einen Auftrag von mehreren
                  hundert Franken bringen.
                </p>

                <div>
                  <strong>20 Credits</strong>
                  <small>Leadpreis</small>
                </div>

                <div>
                  <strong>CHF 900</strong>
                  <small>Ø Auftragswert</small>
                </div>

                <div>
                  <strong>45x</strong>
                  <small>möglicher Hebel</small>
                </div>

                <Link href="/portal/guthaben" className="btn btn-primary">
                  Credits kaufen
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}