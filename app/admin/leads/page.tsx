import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { createLeadAction, deleteLeadAction } from "./actions";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams?: Promise<{
    message?: string;
    error?: string;
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

function getMessage(message?: string) {
  switch (message) {
    case "created":
      return "Lead wurde erfolgreich erstellt.";
    case "deleted":
      return "Lead wurde erfolgreich gelöscht.";
    default:
      return "";
  }
}

function getError(error?: string) {
  switch (error) {
    case "missing-fields":
      return "Bitte alle Pflichtfelder ausfüllen.";
    case "invalid-price":
      return "Der Leadpreis muss mindestens 1 Credit betragen.";
    case "invalid-value":
      return "Der geschätzte Auftragswert muss mindestens CHF 1 betragen.";
    case "invalid-lead":
      return "Der Lead konnte nicht gefunden werden.";
    default:
      return "";
  }
}

function shortText(text: string | null, maxLength = 120) {
  if (!text) return "Keine Beschreibung vorhanden.";

  const cleaned = text
    .replace(/\s+/g, " ")
    .replaceAll("Nicht angegeben", "")
    .trim();

  if (cleaned.length <= maxLength) return cleaned;

  return `${cleaned.slice(0, maxLength)}...`;
}

export default async function AdminLeadsPage({ searchParams }: PageProps) {
  const params = searchParams ? await searchParams : undefined;

  const successMessage = getMessage(params?.message);
  const errorMessage = getError(params?.error);

  const leads = await prisma.lead.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      purchases: {
        select: {
          id: true,
        },
      },
    },
  });

  return (
    <main className="page">
      <section className="admin-leads-hero">
        <div className="container">
          <span className="eyebrow">Admin</span>

          <div className="admin-leads-head">
            <div>
              <h1>Leads verwalten.</h1>

              <p>
                Erstelle Kundenanfragen, berechne den Leadpreis automatisch und
                stelle neue Aufträge direkt im Anbieter-Portal bereit.
              </p>
            </div>

            <Link href="/admin" className="btn btn-secondary">
              Anbieter ansehen
            </Link>
          </div>

          {successMessage ? (
            <div className="admin-success">{successMessage}</div>
          ) : null}

          {errorMessage ? (
            <div className="admin-error">{errorMessage}</div>
          ) : null}

          <div className="admin-leads-grid">
            <form action={createLeadAction} className="admin-leads-form">
              <div className="admin-card-head">
                <span>Neuer Lead</span>
                <h2>Kundenanfrage erfassen</h2>
                <p>
                  Gib den geschätzten Auftragswert ein. Der Leadpreis wird
                  automatisch berechnet. Du kannst ihn optional manuell
                  überschreiben.
                </p>
              </div>

              <input
                name="title"
                className="admin-input"
                placeholder="Titel z.B. Fensterreinigung Grafstal"
                required
              />

              <textarea
                name="description"
                className="admin-input admin-textarea"
                placeholder="Beschreibung des Auftrags"
                required
              />

              <div className="admin-two">
                <input
                  name="name"
                  className="admin-input"
                  placeholder="Kundenname"
                  required
                />

                <input
                  name="phone"
                  className="admin-input"
                  placeholder="Telefon"
                  required
                />
              </div>

              <input
                name="email"
                type="email"
                className="admin-input"
                placeholder="E-Mail"
                required
              />

              <div className="admin-three">
                <select
                  name="region"
                  className="admin-input"
                  required
                  defaultValue=""
                >
                  <option value="" disabled>
                    Region auswählen
                  </option>

                  {regions.map((region) => (
                    <option key={region} value={region}>
                      {region}
                    </option>
                  ))}
                </select>

                <select
                  name="category"
                  className="admin-input"
                  required
                  defaultValue=""
                >
                  <option value="" disabled>
                    Kategorie auswählen
                  </option>

                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>

                <input
                  name="estimatedValue"
                  type="number"
                  min="1"
                  className="admin-input"
                  placeholder="Auftragswert CHF z.B. 520"
                  required
                />
              </div>

              <input
                name="price"
                type="number"
                min="1"
                className="admin-input"
                placeholder="Leadpreis Credits optional, sonst automatisch"
              />

              <div className="admin-price-help">
                <strong>Automatische Preislogik</strong>
                <span>bis CHF 300 → 10 Credits</span>
                <span>CHF 301–700 → 20 Credits</span>
                <span>CHF 701–1'500 → 35 Credits</span>
                <span>CHF 1'501–3'000 → 55 Credits</span>
                <span>über CHF 3'000 → 80 Credits</span>
              </div>

              <button type="submit" className="btn btn-primary admin-submit">
                Lead erstellen
              </button>
            </form>

            <div className="admin-leads-list">
              <div className="admin-card-head">
                <span>Übersicht</span>
                <h2>Bestehende Leads</h2>
              </div>

              {leads.length === 0 ? (
                <div className="admin-empty">
                  <strong>Noch keine Leads</strong>

                  <p>
                    Erstelle den ersten Lead. Danach erscheint er automatisch
                    hier und im Anbieter-Portal.
                  </p>
                </div>
              ) : (
                <div className="admin-list-stack">
                  {leads.map((lead) => (
                    <article key={lead.id} className="admin-lead-item">
                      <div>
                        <div className="admin-tags">
                          <span>{lead.category}</span>
                          <span>{lead.region}</span>
                          <span>{lead.purchases.length} Käufe</span>
                        </div>

                        <h3>{lead.title}</h3>

                        <p>{shortText(lead.description)}</p>

                        <div className="admin-contact">
                          {lead.name} · {lead.email} · {lead.phone}
                        </div>
                      </div>

                      <div className="admin-price">
                        <span>Leadpreis</span>
                        <strong>{lead.price}</strong>
                        <small>Credits</small>

                        <form
                          action={deleteLeadAction}
                          className="admin-delete-form"
                        >
                          <input type="hidden" name="leadId" value={lead.id} />

                          <button type="submit" className="admin-delete-btn">
                            Löschen
                          </button>
                        </form>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}