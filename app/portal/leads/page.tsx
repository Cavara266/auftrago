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

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("de-CH", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function getShortTitle(title: string) {
  return title
    .replace("Umzugsreinigung - ", "")
    .replace("Grundreinigung - ", "")
    .replace("Fensterreinigung - ", "")
    .replace("Unterhaltsreinigung - ", "");
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
              Freischalten erhältst du alle Kontaktdaten und Details.
            </p>
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
          {errorMessage ? <div className="leadx-error">{errorMessage}</div> : null}
          {infoMessage ? <div className="leadx-success">{infoMessage}</div> : null}

          <div className="leadx-stats">
            <div>
              <strong>{provider.credits}</strong>
              <span>Credits verfügbar</span>
            </div>

            <div>
              <strong>{sortedLeads.length}</strong>
              <span>Leads verfügbar</span>
            </div>

            <div>
              <strong>{purchasedLeadIds.size}</strong>
              <span>Gekauft</span>
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
                  Leads filtern
                </button>

                <Link href="/portal/leads" className="btn btn-secondary">
                  Zurücksetzen
                </Link>
              </form>

              {sortedLeads.length === 0 ? (
                <div className="leadx-empty">
                  <span>Keine Leads gefunden</span>
                  <h2>Für diese Filter gibt es aktuell keine Leads.</h2>
                  <p>Entferne den Filter oder prüfe später erneut neue Anfragen.</p>
                </div>
              ) : (
                <div className="topoffer-leads-list">
                  {sortedLeads.map((lead) => {
                    const isBought = purchasedLeadIds.has(lead.id);
                    const hasEnoughCredits = provider.credits >= lead.price;
                    const isMatching =
                      lead.region === provider.region ||
                      lead.category === provider.category;

                    return (
                      <article key={lead.id} className="topoffer-lead-card">
                        <div className="topoffer-card-header">
                          <div className="topoffer-badges">
                            <span>{isBought ? "Freigeschaltet" : "Neu"}</span>
                            <span>{lead.category}</span>
                            {isMatching ? <span>Passend</span> : null}
                          </div>

                          <span className="topoffer-company-count">
                            2 von 4 Firmen
                          </span>
                        </div>

                        <div className="topoffer-card-body">
                          <h2>{lead.category}</h2>

                          <p className="topoffer-subtitle">
                            {getShortTitle(lead.title)}
                          </p>

                          <p className="topoffer-location">{lead.region}</p>

                          <p className="topoffer-date">
                            Angefragt am {formatDate(lead.createdAt)}
                          </p>

                          <p className="topoffer-status">
                            {isBought ? "Kontakt freigeschaltet" : "Kontakt gesperrt"}
                          </p>
                        </div>

                        <div className="topoffer-card-footer">
                          <div>
                            <strong>{lead.price} Credits</strong>
                            <small>Details erst nach Freischaltung</small>
                          </div>

                          {isBought ? (
                            <Link
                              href="/portal/meine-leads"
                              className="btn btn-secondary"
                            >
                              Kontakt ansehen
                            </Link>
                          ) : hasEnoughCredits ? (
                            <form action={buyLeadAction}>
                              <input type="hidden" name="leadId" value={lead.id} />

                              <button type="submit" className="btn btn-primary">
                                Kontakt freischalten
                              </button>
                            </form>
                          ) : (
                            <Link href="/portal/guthaben" className="btn btn-primary">
                              Credits aufladen
                            </Link>
                          )}
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
                <span>Aktionen</span>
                <h2>Neue Leads ansehen.</h2>

                <p>
                  Öffne den Lead-Marktplatz und sichere dir passende Aufträge.
                </p>

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