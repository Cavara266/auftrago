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
    description: "Ideal zum Testen und für einzelne Lead-Käufe.",
  },
  {
    id: "business",
    title: "Business",
    credits: 120,
    price: "CHF 100",
    description: "Mehr Credits für aktive Anbieter mit regelmässigen Leads.",
  },
  {
    id: "pro",
    title: "Pro",
    credits: 300,
    price: "CHF 250",
    description: "Für Anbieter, die laufend neue Aufträge freischalten.",
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
      <section className="credit-hero">
        <div className="container">
          <span className="eyebrow">Guthaben</span>

          <div className="credit-head">
            <div>
              <h1>Credits aufladen.</h1>
              <p>
                Lade Guthaben auf, um Leads freizuschalten und direkt mit
                potenziellen Kunden Kontakt aufzunehmen.
              </p>
            </div>

            <div className="credit-actions">
              <Link href="/portal" className="btn btn-secondary">
                Dashboard
              </Link>

              <Link href="/portal/leads" className="btn btn-primary">
                Leads ansehen
              </Link>
            </div>
          </div>

          {successMessage ? (
            <div className="credit-success">{successMessage}</div>
          ) : null}

          {errorMessage ? (
            <div className="credit-error">{errorMessage}</div>
          ) : null}

          <div className="credit-overview">
            <div className="credit-balance-card">
              <span>Aktuelles Guthaben</span>
              <strong>{provider.credits}</strong>
              <small>Credits verfügbar</small>
            </div>

            <div className="credit-info-card">
              <span>Firma</span>
              <strong>{provider.companyName}</strong>
              <small>{provider.email}</small>
            </div>
          </div>

          <div className="credit-packages">
            {creditPackages.map((item) => (
              <form
                key={item.id}
                action={startCheckoutAction}
                className="credit-package-card"
              >
                <input type="hidden" name="packageId" value={item.id} />

                <span>{item.title}</span>
                <h2>{item.credits} Credits</h2>
                <p>{item.description}</p>

                <div className="credit-price">{item.price}</div>

                <button type="submit" className="btn btn-primary">
                  Weiter zur Zahlung
                </button>
              </form>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}