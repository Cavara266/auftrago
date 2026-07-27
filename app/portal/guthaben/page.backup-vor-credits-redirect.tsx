import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { startCheckoutAction } from "./actions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const creditPackages = [
  {
    id: "starter",
    title: "Starter",
    credits: 20,
    price: "CHF 29",
    pricePerCredit: "CHF 1.45 pro Credit",
    badge: "Zum Starten",
    description:
      "Ideal für den Einstieg und erste Freischaltungen auf Auftrago.",
    highlight: false,
    benefits: [
      "20 Credits sofort verfügbar",
      "Ideal für erste Freischaltungen",
      "Kein Abo und keine Fixkosten",
      "Credits verfallen nicht",
    ],
  },
  {
    id: "pro",
    title: "Pro",
    credits: 50,
    price: "CHF 69",
    pricePerCredit: "CHF 1.38 pro Credit",
    badge: "Beliebteste Wahl",
    description:
      "Für aktive Anbieter, die regelmässig neue Kundenanfragen freischalten.",
    highlight: true,
    benefits: [
      "50 Credits sofort verfügbar",
      "Besserer Preis pro Credit",
      "Ideal für aktive Anbieter",
      "Kein Abo und keine Fixkosten",
    ],
  },
  {
    id: "business",
    title: "Business",
    credits: 100,
    price: "CHF 129",
    pricePerCredit: "CHF 1.29 pro Credit",
    badge: "Für Wachstum",
    description:
      "Für Firmen mit regelmässigem Leadbedarf und mehreren Einsatzgebieten.",
    highlight: false,
    benefits: [
      "100 Credits sofort verfügbar",
      "Bestes Preis-Leistungs-Verhältnis",
      "Ideal für regelmässige Freischaltungen",
      "Volle Kontrolle über dein Budget",
    ],
  },
] as const;

type SearchParams = {
  payment?: string;
  message?: string;
  error?: string;
  session_id?: string;
};

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("de-CH", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function formatMoney(amountInRappen: number, currency: string) {
  return new Intl.NumberFormat("de-CH", {
    style: "currency",
    currency: currency.toUpperCase(),
    minimumFractionDigits: 2,
  }).format(amountInRappen / 100);
}

function getSuccessMessage(params?: SearchParams) {
  if (
    params?.payment === "success" ||
    params?.message === "checkout-success" ||
    params?.message === "success"
  ) {
    return "Zahlung erfolgreich. Deine Credits werden automatisch gutgeschrieben.";
  }

  return "";
}

function getErrorMessage(params?: SearchParams) {
  if (
    params?.payment === "cancelled" ||
    params?.error === "checkout-cancelled"
  ) {
    return "Die Zahlung wurde abgebrochen. Es wurden keine Kosten belastet.";
  }

  switch (params?.error) {
    case "invalid":
      return "Das ausgewählte Credit-Paket ist ungültig.";

    case "provider-missing":
      return "Es wurde kein Anbieterprofil gefunden.";

    case "stripe":
      return "Der Stripe-Checkout konnte nicht gestartet werden.";

    default:
      return "";
  }
}

export default async function GuthabenPage({
  searchParams,
}: {
  searchParams?: Promise<SearchParams>;
}) {
  const params = searchParams ? await searchParams : undefined;

  const user = await requireUser();

  if (!user) {
    redirect("/login");
  }

  if (user.status !== "APPROVED") {
    redirect("/login");
  }

  const provider = await prisma.provider.findUnique({
    where: {
      id: user.id,
    },
    include: {
      creditPurchases: {
        orderBy: {
          createdAt: "desc",
        },
        take: 20,
      },
    },
  });

  if (!provider) {
    redirect("/login");
  }

  const successMessage = getSuccessMessage(params);
  const errorMessage = getErrorMessage(params);

  const totalPurchasedCredits = provider.creditPurchases
    .filter((purchase) => purchase.status === "paid")
    .reduce((total, purchase) => total + purchase.credits, 0);

  const totalSpentRappen = provider.creditPurchases
    .filter((purchase) => purchase.status === "paid")
    .reduce((total, purchase) => total + purchase.amount, 0);

  return (
    <main className="page">
      <section className="creditx-hero">
        <div className="container creditx-shell">
          <div className="creditx-top">
            <div>
              <span className="eyebrow">Guthaben</span>

              <h1>Credits kaufen. Aufträge sichern.</h1>

              <p>
                Lade dein Guthaben auf und schalte passende Kundenkontakte
                sofort frei. Du entscheidest selbst, welche Anfrage für deine
                Firma interessant ist.
              </p>

              <div className="creditx-live-row">
                <span>⚡ Credits sofort verfügbar</span>
                <span>🔒 Sichere Stripe-Zahlung</span>
                <span>✓ Kein Abonnement</span>
              </div>
            </div>

            <div className="creditx-actions">
              <Link href="/portal" className="btn btn-secondary">
                Dashboard
              </Link>

              <Link href="/portal/leads" className="btn btn-primary">
                Leads ansehen
              </Link>
            </div>
          </div>

          {successMessage ? (
            <div className="creditx-success">{successMessage}</div>
          ) : null}

          {errorMessage ? (
            <div className="creditx-error">{errorMessage}</div>
          ) : null}

          {provider.credits <= 0 ? (
            <div className="creditx-warning">
              <div>
                <span>⚠️ Guthaben leer</span>

                <h2>Du kannst aktuell keine Kontakte freischalten.</h2>

                <p>
                  Lade Credits auf, damit du neue Leads sofort freischalten und
                  Kunden direkt kontaktieren kannst.
                </p>
              </div>

              <Link href="#pakete" className="btn btn-primary">
                Paket auswählen
              </Link>
            </div>
          ) : null}

          <div className="creditx-overview">
            <div className="creditx-balance-card">
              <span>Aktuelles Guthaben</span>

              <strong>{provider.credits}</strong>

              <small>Credits verfügbar</small>
            </div>

            <div className="creditx-firm-card">
              <span>Firma</span>

              <strong>{provider.companyName}</strong>

              <small>{provider.email}</small>
            </div>

            <div className="creditx-roi-card">
              <span>Insgesamt gekauft</span>

              <strong>{totalPurchasedCredits} Credits</strong>

              <small>
                {formatMoney(totalSpentRappen, "chf")} über Stripe bezahlt
              </small>
            </div>
          </div>

          <div id="pakete" className="creditx-packages">
            {creditPackages.map((item) => (
              <form
                key={item.id}
                action={startCheckoutAction}
                className={
                  item.highlight
                    ? "creditx-package-card creditx-package-featured"
                    : "creditx-package-card"
                }
              >
                <input type="hidden" name="packageId" value={item.id} />

                <div className="creditx-package-badge">
                  {item.badge}
                </div>

                <span>Credit-Paket</span>

                <h2>{item.title}</h2>

                <div
                  style={{
                    marginTop: 18,
                    display: "flex",
                    alignItems: "baseline",
                    gap: 10,
                  }}
                >
                  <strong
                    style={{
                      fontSize: 44,
                      lineHeight: 1,
                    }}
                  >
                    {item.credits}
                  </strong>

                  <span>Credits</span>
                </div>

                <div className="creditx-price">{item.price}</div>

                <small
                  style={{
                    display: "block",
                    marginTop: -8,
                    marginBottom: 18,
                    opacity: 0.55,
                  }}
                >
                  {item.pricePerCredit}
                </small>

                <p>{item.description}</p>

                <div className="creditx-benefits">
                  {item.benefits.map((benefit) => (
                    <div key={benefit}>✓ {benefit}</div>
                  ))}
                </div>

                <button
                  type="submit"
                  className="btn btn-primary creditx-full"
                >
                  Credits kaufen
                </button>
              </form>
            ))}
          </div>

          <section
            style={{
              marginTop: 56,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "space-between",
                gap: 20,
                marginBottom: 22,
                flexWrap: "wrap",
              }}
            >
              <div>
                <span className="eyebrow">Zahlungsverlauf</span>

                <h2
                  style={{
                    marginTop: 10,
                    fontSize: "clamp(28px, 4vw, 42px)",
                  }}
                >
                  Deine Credit-Käufe
                </h2>

                <p
                  style={{
                    marginTop: 10,
                    opacity: 0.6,
                  }}
                >
                  Hier siehst du deine letzten Stripe-Zahlungen und
                  Credit-Gutschriften.
                </p>
              </div>

              <div
                style={{
                  padding: "12px 18px",
                  borderRadius: 999,
                  border: "1px solid rgba(255,255,255,0.1)",
                  background: "rgba(255,255,255,0.04)",
                  fontSize: 14,
                  fontWeight: 800,
                }}
              >
                {provider.creditPurchases.length} Zahlungen
              </div>
            </div>

            {provider.creditPurchases.length === 0 ? (
              <div
                style={{
                  padding: "46px 24px",
                  borderRadius: 28,
                  border: "1px dashed rgba(255,255,255,0.15)",
                  background: "rgba(255,255,255,0.03)",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: 38,
                  }}
                >
                  🧾
                </div>

                <h3
                  style={{
                    marginTop: 14,
                    fontSize: 24,
                  }}
                >
                  Noch keine Credit-Käufe
                </h3>

                <p
                  style={{
                    maxWidth: 560,
                    margin: "12px auto 0",
                    lineHeight: 1.7,
                    opacity: 0.55,
                  }}
                >
                  Sobald du ein Credit-Paket über Stripe bezahlst, erscheint
                  die Zahlung automatisch in dieser Übersicht.
                </p>
              </div>
            ) : (
              <div
                style={{
                  display: "grid",
                  gap: 12,
                }}
              >
                {provider.creditPurchases.map((purchase) => {
                  const paid = purchase.status === "paid";

                  return (
                    <article
                      key={purchase.id}
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "minmax(180px, 1.5fr) minmax(120px, 0.8fr) minmax(120px, 0.8fr) minmax(120px, 0.8fr)",
                        gap: 18,
                        alignItems: "center",
                        padding: "20px 22px",
                        borderRadius: 22,
                        border: "1px solid rgba(255,255,255,0.09)",
                        background: "rgba(255,255,255,0.04)",
                      }}
                    >
                      <div>
                        <div
                          style={{
                            fontSize: 16,
                            fontWeight: 900,
                          }}
                        >
                          {purchase.packageId
                            ? `Paket ${purchase.packageId}`
                            : "Credit-Paket"}
                        </div>

                        <div
                          style={{
                            marginTop: 6,
                            fontSize: 13,
                            opacity: 0.5,
                          }}
                        >
                          {formatDate(purchase.createdAt)}
                        </div>
                      </div>

                      <div>
                        <small
                          style={{
                            display: "block",
                            marginBottom: 5,
                            opacity: 0.45,
                          }}
                        >
                          Credits
                        </small>

                        <strong
                          style={{
                            color: "#fde68a",
                          }}
                        >
                          +{purchase.credits}
                        </strong>
                      </div>

                      <div>
                        <small
                          style={{
                            display: "block",
                            marginBottom: 5,
                            opacity: 0.45,
                          }}
                        >
                          Betrag
                        </small>

                        <strong>
                          {formatMoney(
                            purchase.amount,
                            purchase.currency
                          )}
                        </strong>
                      </div>

                      <div>
                        <small
                          style={{
                            display: "block",
                            marginBottom: 5,
                            opacity: 0.45,
                          }}
                        >
                          Status
                        </small>

                        <span
                          style={{
                            display: "inline-flex",
                            padding: "7px 12px",
                            borderRadius: 999,
                            border: paid
                              ? "1px solid rgba(34,197,94,0.25)"
                              : "1px solid rgba(250,204,21,0.25)",
                            background: paid
                              ? "rgba(34,197,94,0.12)"
                              : "rgba(250,204,21,0.10)",
                            color: paid ? "#bbf7d0" : "#fde68a",
                            fontSize: 13,
                            fontWeight: 900,
                          }}
                        >
                          {paid ? "✓ Bezahlt" : purchase.status}
                        </span>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>

          <div className="creditx-bottom-grid">
            <div className="creditx-info-box">
              <span>📈 Lead-Rechner</span>

              <h2>Ein Auftrag kann viele Leads finanzieren.</h2>

              <div className="creditx-calc-row">
                <small>Typischer Leadpreis</small>
                <strong>20 Credits</strong>
              </div>

              <div className="creditx-calc-row">
                <small>Möglicher Auftragswert</small>
                <strong>CHF 900</strong>
              </div>

              <p>
                Wenn aus einem Lead ein Auftrag entsteht, kann sich der Einkauf
                bereits mit einem einzigen Kundenkontakt lohnen.
              </p>
            </div>

            <div className="creditx-info-box">
              <span>🚀 So funktioniert es</span>

              <h2>Credits kaufen. Lead öffnen. Kunde kontaktieren.</h2>

              <div className="creditx-steps">
                <div>
                  <strong>1</strong>
                  <p>Credit-Paket auswählen und sicher bezahlen.</p>
                </div>

                <div>
                  <strong>2</strong>
                  <p>Passende Kundenanfrage auswählen.</p>
                </div>

                <div>
                  <strong>3</strong>
                  <p>Name, E-Mail und Telefonnummer freischalten.</p>
                </div>
              </div>

              <Link href="/portal/leads" className="btn btn-secondary">
                Zu den Leads
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}