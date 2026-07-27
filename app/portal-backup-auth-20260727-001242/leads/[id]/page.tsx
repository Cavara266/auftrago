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
  if (!description) {
    return "Keine zusätzliche Beschreibung vorhanden.";
  }

  return description
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .join("\n");
}

export default async function LeadDetailPage({
  params,
}: PageProps) {
  const { id } = await params;

  const cookieStore = await cookies();
  const providerId = cookieStore.get("auftrago_session")?.value;

  if (!providerId) {
    redirect("/login");
  }

  const provider = await prisma.provider.findUnique({
    where: {
      id: providerId,
    },
    include: {
      purchases: {
        select: {
          leadId: true,
          createdAt: true,
          price: true,
        },
      },
    },
  });

  if (!provider) {
    redirect("/login");
  }

  if (provider.status !== "APPROVED") {
    redirect("/login");
  }

  const lead = await prisma.lead.findUnique({
    where: {
      id,
    },
  });

  if (!lead) {
    notFound();
  }

  const purchase = provider.purchases.find(
    (entry) => entry.leadId === lead.id
  );

  const isBought = Boolean(purchase);
  const hasEnoughCredits = provider.credits >= lead.price;

  return (
    <main className="page">
      <section className="lead-detail-section">
        <div className="container">
          <div className="lead-detail-topbar">
            <Link
              href="/portal/leads"
              className="lead-detail-back"
            >
              ← Zurück zu den Aufträgen
            </Link>

            <div className="lead-detail-credit-balance">
              Dein Guthaben:{" "}
              <strong>{provider.credits} Credits</strong>
            </div>
          </div>

          <div
            className={
              isBought
                ? "lead-detail-shell lead-detail-shell-unlocked"
                : "lead-detail-shell"
            }
          >
            <div className="lead-detail-main">
              <div className="lead-detail-card">
                <div className="lead-detail-badges">
                  <span>{lead.category}</span>
                  <span>{lead.region}</span>

                  <span>
                    {isBought
                      ? "✅ Freigeschaltet"
                      : "🔒 Kontakt gesperrt"}
                  </span>
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
                <div className="lead-detail-card lead-detail-contact-card">
                  <div className="lead-detail-contact-heading">
                    <div>
                      <span className="lead-detail-contact-kicker">
                        Freigeschalteter Kundenkontakt
                      </span>

                      <h2>Kontaktdaten</h2>
                    </div>

                    <span className="lead-detail-paid-badge">
                      ✅ Bezahlt
                    </span>
                  </div>

                  <div className="lead-detail-grid">
                    <div>
                      <small>Name</small>

                      <strong>
                        {lead.name || "Nicht angegeben"}
                      </strong>
                    </div>

                    <div>
                      <small>Telefonnummer</small>

                      {lead.phone ? (
                        <a
                          href={`tel:${lead.phone}`}
                          className="lead-detail-contact-link"
                        >
                          {lead.phone}
                        </a>
                      ) : (
                        <strong>Nicht angegeben</strong>
                      )}
                    </div>

                    <div className="lead-detail-email-field">
                      <small>E-Mail-Adresse</small>

                      {lead.email ? (
                        <a
                          href={`mailto:${lead.email}`}
                          className="lead-detail-contact-link"
                        >
                          {lead.email}
                        </a>
                      ) : (
                        <strong>Nicht angegeben</strong>
                      )}
                    </div>
                  </div>

                  <div className="lead-detail-contact-actions">
                    {lead.phone ? (
                      <a
                        href={`tel:${lead.phone}`}
                        className="btn btn-primary"
                      >
                        📞 Jetzt anrufen
                      </a>
                    ) : null}

                    {lead.email ? (
                      <a
                        href={`mailto:${lead.email}?subject=${encodeURIComponent(
                          `Ihre Anfrage: ${lead.title}`
                        )}`}
                        className="btn btn-secondary"
                      >
                        ✉️ E-Mail schreiben
                      </a>
                    ) : null}
                  </div>

                  {purchase ? (
                    <p className="lead-detail-purchase-info">
                      Freigeschaltet am{" "}
                      {formatDate(purchase.createdAt)} für{" "}
                      {purchase.price} Credits.
                    </p>
                  ) : null}
                </div>
              ) : (
                <div className="lead-detail-card lead-detail-locked">
                  <h2>Kontakt gesperrt</h2>

                  <p>
                    Die vollständigen Kontaktdaten werden erst nach
                    dem Freischalten angezeigt.
                  </p>

                  <div className="locked-grid">
                    <span>🔒 Name verborgen</span>
                    <span>🔒 Telefon verborgen</span>
                    <span>🔒 E-Mail verborgen</span>
                  </div>
                </div>
              )}
            </div>

            {!isBought ? (
              <aside className="lead-detail-sidebar">
                <div className="lead-detail-buybox">
                  <span>Lead freischalten</span>

                  <h2>{lead.price} Credits</h2>

                  <p>
                    Nach dem Kauf erhältst du alle Kontaktdaten und
                    kannst den Kunden direkt kontaktieren.
                  </p>

                  {hasEnoughCredits ? (
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
                        Kontakt freischalten
                      </button>
                    </form>
                  ) : (
                    <>
                      <p className="lead-detail-credit-warning">
                        Dein Guthaben reicht für diese Anfrage nicht
                        aus.
                      </p>

                      <Link
                        href="/portal/guthaben"
                        className="btn btn-primary leadx-full"
                      >
                        Credits aufladen
                      </Link>
                    </>
                  )}
                </div>
              </aside>
            ) : null}
          </div>
        </div>
      </section>
    </main>
  );
}