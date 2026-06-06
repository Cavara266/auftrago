import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { startCheckoutAction } from "./actions";

export const dynamic = "force-dynamic";

const creditPackages = [
  {
    id: "starter",
    title: "Starter",
    credits: 50,
    price: "CHF 50",
    badge: "Zum Starten",
    description: "Perfekt, um erste Leads zu testen und einzelne Kontakte freizuschalten.",
    highlight: false,
    benefits: [
      "Bis zu 3 kleinere Leads",
      "Ideal für erste Tests",
      "Sofort nach Zahlung verfügbar",
    ],
  },
  {
    id: "business",
    title: "Business",
    credits: 120,
    price: "CHF 100",
    badge: "Beliebtestes Paket",
    description: "Für aktive Anbieter, die regelmässig neue Kundenkontakte kaufen wollen.",
    highlight: true,
    benefits: [
      "Mehr Credits für weniger Geld",
      "Ideal für laufende Leads",
      "Beste Wahl für aktive Anbieter",
    ],
  },
  {
    id: "pro",
    title: "Pro",
    credits: 300,
    price: "CHF 250",
    badge: "Maximale Reichweite",
    description: "Für Firmen, die konsequent neue Aufträge gewinnen und schnell reagieren wollen.",
    highlight: false,
    benefits: [
      "Für viele Lead-Käufe",
      "Stark für Wachstumsfirmen",
      "Mehr Chancen auf neue Aufträge",
    ],
  },
];

function getMessage(message?: string) {
  switch (message) {
    case "checkout-success":
      return "Zahlung erfolgreich. Die Credits werden nach Stripe-Bestätigung automatisch gutgeschrieben.";
    case "success":
      return "Guthaben wurde erfolgreich aufgeladen.";
    default:
      return "";
  }
}

function getError(error?: string) {
  switch (error) {
    case "invalid":
      return "Das ausgewählte Paket ist ungültig.";
    case "provider-missing":
      return "Es wurde kein Anbieter-Profil gefunden.";
    case "checkout-cancelled":
      return "Zahlung wurde abgebrochen.";
    case "stripe":
      return "Stripe Checkout konnte nicht gestartet werden.";
    default:
      return "";
  }
}

export default async function GuthabenPage({
  searchParams,
}: {
  searchParams?: Promise<{
    message?: string;
    error?: string;
  }>;
}) {
  const params = searchParams ? await searchParams : undefined;

  const cookieStore = await cookies();
  const providerId = cookieStore.get("auftrago_session")?.value;

  if (!providerId) {
    redirect("/login");
  }

  const provider = await prisma.provider.findUnique({
    where: {
      id: providerId,
    },
  });

  if (!provider) {
    redirect("/login");
  }

  const successMessage = getMessage(params?.message);
  const errorMessage = getError(params?.error);

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
                sofort frei. Jeder Lead kann der nächste Auftrag für deine Firma
                sein.
              </p>

              <div className="creditx-live-row">
                <span>🔥 34 neue Anfragen heute</span>
                <span>⚡ Kontakte sofort sichtbar</span>
                <span>🔒 Sichere Stripe-Zahlung</span>
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
                  Lade Credits auf, damit du neue Leads sofort kaufen und Kunden
                  direkt kontaktieren kannst.
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
              <span>Beispiel-Rechnung</span>
              <strong>20 Credits</strong>
              <small>können einen Auftrag von CHF 600–1'200 freischalten</small>
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

                <div className="creditx-package-badge">{item.badge}</div>

                <span>{item.title}</span>

                <h2>{item.credits} Credits</h2>

                <p>{item.description}</p>

                <div className="creditx-price">{item.price}</div>

                <div className="creditx-benefits">
                  {item.benefits.map((benefit) => (
                    <div key={benefit}>✓ {benefit}</div>
                  ))}
                </div>

                <button type="submit" className="btn btn-primary creditx-full">
                  Weiter zur Zahlung
                </button>
              </form>
            ))}
          </div>

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

              <div className="creditx-calc-row">
                <small>Möglicher Hebel</small>
                <strong>45x</strong>
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
                  <p>Passenden Lead im Marketplace auswählen.</p>
                </div>

                <div>
                  <strong>3</strong>
                  <p>Name, E-Mail und Telefon freischalten.</p>
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