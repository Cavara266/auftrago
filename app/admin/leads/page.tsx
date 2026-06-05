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
      return "Der Preis muss mindestens 1 Credit betragen.";
    case "invalid-lead":
      return "Der Lead konnte nicht gefunden werden.";
    default:
      return "";
  }
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
                Erstelle Kundenanfragen, verwalte bestehende Leads und stelle
                sie direkt im Anbieter-Portal bereit.
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
              </div>

              <input
                name="title"
                className="admin-input"
                placeholder="Titel z.B. Hauswartung Mehrfamilienhaus"
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
                  name="price"
                  type="number"
                  min="1"
                  className="admin-input"
                  placeholder="Preis Credits"
                  required
                />
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

                        <p>{lead.description}</p>

                        <div className="admin-contact">
                          {lead.name} · {lead.email} · {lead.phone}
                        </div>
                      </div>

                      <div className="admin-price">
                        <span>Preis</span>
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