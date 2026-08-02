import Link from "next/link";
import { redirect } from "next/navigation";

import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

import {
  hasSubscriptionAccess,
  normalizeStripeId,
  synchronizeProviderSubscription,
} from "@/lib/provider-subscription";

import styles from "./subscription-required.module.css";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

type SearchParams = {
  success?: string;
  cancelled?: string;
  error?: string;
  session_id?: string;
};

type PageProps = {
  searchParams?: Promise<SearchParams> | SearchParams;
};

function getStatusText(status: string) {
  switch (String(status).toUpperCase()) {
    case "PAST_DUE":
      return "Die letzte Zahlung konnte nicht abgebucht werden.";

    case "UNPAID":
      return "Deine Mitgliedschaft ist momentan nicht bezahlt.";

    case "CANCELED":
    case "CANCELLED":
      return "Deine Mitgliedschaft wurde beendet.";

    case "INCOMPLETE":
      return "Die Einrichtung deiner Mitgliedschaft wurde noch nicht abgeschlossen.";

    case "INCOMPLETE_EXPIRED":
      return "Die Einrichtung deiner Mitgliedschaft ist abgelaufen.";

    default:
      return "Für den Zugriff auf das Anbieterportal wird eine aktive Mitgliedschaft benötigt.";
  }
}

async function finalizeCheckout(
  sessionId: string,
  providerId: string,
): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    if (!sessionId.startsWith("cs_")) {
      return {
        success: false,
        error: "INVALID_SESSION_ID",
      };
    }

    const session =
      await stripe.checkout.sessions.retrieve(
        sessionId,
        {
          expand: ["subscription"],
        },
      );

    const sessionProviderId =
      session.metadata?.providerId?.trim() ||
      session.client_reference_id?.trim() ||
      "";

    if (
      !sessionProviderId ||
      sessionProviderId !== providerId
    ) {
      return {
        success: false,
        error: "PROVIDER_MISMATCH",
      };
    }

    if (
      session.mode !== "subscription" ||
      session.metadata?.type !==
        "provider-subscription"
    ) {
      return {
        success: false,
        error: "NOT_PROVIDER_SUBSCRIPTION",
      };
    }

    const subscriptionId =
      normalizeStripeId(session.subscription);

    if (!subscriptionId) {
      return {
        success: false,
        error: "SUBSCRIPTION_ID_MISSING",
      };
    }

    const subscription =
      typeof session.subscription === "object" &&
      session.subscription &&
      "status" in session.subscription
        ? session.subscription
        : await stripe.subscriptions.retrieve(
            subscriptionId,
          );

    await synchronizeProviderSubscription(
      subscription,
    );

    return {
      success: true,
    };
  } catch (error) {
    console.error(
      "SUBSCRIPTION FINALIZE ERROR:",
      {
        sessionId,
        providerId,
        error,
      },
    );

    return {
      success: false,
      error: "FINALIZE_FAILED",
    };
  }
}

export default async function SubscriptionRequiredPage({
  searchParams,
}: PageProps) {
  const params =
    (await Promise.resolve(searchParams)) || {};

  const user = await requireUser();

  if (!user) {
    redirect(
      "/login?redirect=/subscription-required",
    );
  }

  let provider =
    await prisma.provider.findUnique({
      where: {
        id: user.id,
      },
      select: {
        id: true,
        companyName: true,
        status: true,
        subscriptionExempt: true,
        subscriptionStatus: true,
        stripeCustomerId: true,
        stripeSubscriptionId: true,
      },
    });

  if (!provider) {
    redirect("/login");
  }

  if (provider.status === "BLOCKED") {
    redirect(
      "/login?error=provider-blocked",
    );
  }

  /*
   * Stripe Checkout direkt nach erfolgreicher Rückkehr
   * serverseitig synchronisieren.
   */
  let synchronizationError = false;

  if (
    params.success === "1" &&
    params.session_id
  ) {
    const result = await finalizeCheckout(
      params.session_id,
      provider.id,
    );

    if (result.success) {
      provider =
        await prisma.provider.findUnique({
          where: {
            id: user.id,
          },
          select: {
            id: true,
            companyName: true,
            status: true,
            subscriptionExempt: true,
            subscriptionStatus: true,
            stripeCustomerId: true,
            stripeSubscriptionId: true,
          },
        });

      if (
        provider &&
        hasSubscriptionAccess(provider)
      ) {
        redirect("/portal");
      }
    } else {
      synchronizationError = true;
    }
  }

  if (!provider) {
    redirect("/login");
  }

  /*
   * Falls der Webhook zwischenzeitlich bereits
   * synchronisiert hat, Portal sofort öffnen.
   */
  if (hasSubscriptionAccess(provider)) {
    redirect("/portal");
  }

  return (
    <main className={styles.page}>
      <div className={styles.glow} />

      <div className={styles.container}>
        <section className={styles.hero}>
          <span className={styles.eyebrow}>
            Auftrago Anbieter-Mitgliedschaft
          </span>

          <h1>
            Starte mit
            <em>Auftrago.</em>
          </h1>

          <p>
            Hallo {provider.companyName}. Dein Konto
            wurde automatisch freigeschaltet.
            Aktiviere jetzt deine Mitgliedschaft und
            erhalte Zugang zum vollständigen
            Anbieterportal.
          </p>
        </section>

        {params.success === "1" &&
        synchronizationError ? (
          <div className={styles.notice}>
            Deine Zahlungsmethode wurde erfolgreich
            hinterlegt. Die Aktivierung wird noch
            verarbeitet. Lade diese Seite in wenigen
            Sekunden erneut.
          </div>
        ) : null}

        {params.cancelled === "1" ? (
          <div className={styles.notice}>
            Der Zahlungsvorgang wurde abgebrochen.
            Dein Konto bleibt gespeichert und du
            kannst jederzeit fortfahren.
          </div>
        ) : null}

        {params.error ? (
          <div className={styles.error}>
            Der Stripe-Checkout konnte nicht
            abgeschlossen werden. Bitte versuche es
            erneut.
          </div>
        ) : null}

        <section className={styles.grid}>
          <article className={styles.content}>
            <span className={styles.eyebrow}>
              Alles für dein Wachstum
            </span>

            <h2>
              Mehr Kunden.
              <br />
              Mehr Aufträge.
            </h2>

            <p>
              {getStatusText(
                provider.subscriptionStatus,
              )}
            </p>

            <div className={styles.features}>
              <div>
                Vollständiger Zugang zu neuen Leads
              </div>

              <div>
                Bestätigte Fixaufträge übernehmen
              </div>

              <div>
                CRM und Kundenkontakte verwalten
              </div>

              <div>
                Offerten und Aktivitäten organisieren
              </div>

              <div>
                Rechnungen zentral herunterladen
              </div>

              <div>
                Mitgliedschaft online verwalten
              </div>
            </div>
          </article>

          <aside className={styles.priceCard}>
            <span>Auftrago Anbieter</span>

            <div className={styles.trial}>
              14 Tage kostenlos
            </div>

            <strong>CHF 69.–</strong>

            <small>
              pro Monat nach der kostenlosen
              Testphase
            </small>

            <form
              action="/api/subscription/checkout"
              method="POST"
            >
              <button
                type="submit"
                className={styles.primaryButton}
              >
                Jetzt kostenlos starten
              </button>
            </form>

            {provider.stripeCustomerId ? (
              <form
                action="/api/subscription/portal"
                method="POST"
              >
                <button
                  type="submit"
                  className={
                    styles.secondaryButton
                  }
                >
                  Zahlung verwalten
                </button>
              </form>
            ) : null}

            <div className={styles.security}>
              <span>
                ✓ Sichere Abrechnung über Stripe
              </span>

              <span>
                ✓ Automatische Monatsabrechnung
              </span>

              <span>✓ Online verwaltbar</span>

              <span>
                ✓ Credits separat erhältlich
              </span>
            </div>
          </aside>
        </section>

        <footer className={styles.footer}>
          <Link href="/">
            Zur Auftrago-Startseite
          </Link>

          <Link href="/api/logout">
            Abmelden
          </Link>
        </footer>
      </div>
    </main>
  );
}
