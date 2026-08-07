import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());

import Stripe from "stripe";

async function main() {
  const key = process.env.STRIPE_SECRET_KEY;

  console.log("\n================================");
  console.log("STRIPE KONFIGURATION");
  console.log("================================");

  if (!key) {
    console.log("STRIPE_SECRET_KEY: FEHLT");
    process.exit(1);
  }

  console.log(
    "KEY:",
    key.slice(0, 12) + "..." + key.slice(-4)
  );

  console.log(
    "MODUS:",
    key.startsWith("sk_test_") ? "TEST" : "LIVE"
  );

  const stripe = new Stripe(key);

  const account = await stripe.accounts.retrieve();

  console.log("ACCOUNT:", account.id);

  console.log("\n================================");
  console.log("SMADHI KUNDE");
  console.log("================================");

  const customers = await stripe.customers.list({
    email: "info@smadhihauswartungen.ch",
    limit: 20,
  });

  console.log("Gefundene Kunden:", customers.data.length);

  for (const customer of customers.data) {
    console.log("\nKUNDE:");
    console.log({
      id: customer.id,
      email: customer.email,
      name: customer.name,
      created: new Date(
        customer.created * 1000
      ).toISOString(),
      metadata: customer.metadata,
    });

    console.log("\n--- CHECKOUT SESSIONS ---");

    const sessions =
      await stripe.checkout.sessions.list({
        customer: customer.id,
        limit: 100,
      });

    console.log("Anzahl:", sessions.data.length);

    for (const session of sessions.data) {
      console.log({
        id: session.id,
        created: new Date(
          session.created * 1000
        ).toISOString(),
        status: session.status,
        payment_status: session.payment_status,
        mode: session.mode,
        subscription: session.subscription,
        payment_intent: session.payment_intent,
        setup_intent: session.setup_intent,
        expires_at: session.expires_at
          ? new Date(
              session.expires_at * 1000
            ).toISOString()
          : null,
        metadata: session.metadata,
      });
    }

    console.log("\n--- ABOS ---");

    const subscriptions =
      await stripe.subscriptions.list({
        customer: customer.id,
        status: "all",
        limit: 100,
      });

    console.log(
      "Anzahl:",
      subscriptions.data.length
    );

    for (const sub of subscriptions.data) {
      console.log({
        id: sub.id,
        status: sub.status,
        customer: sub.customer,
        trial_start: sub.trial_start
          ? new Date(
              sub.trial_start * 1000
            ).toISOString()
          : null,
        trial_end: sub.trial_end
          ? new Date(
              sub.trial_end * 1000
            ).toISOString()
          : null,
        cancel_at_period_end:
          sub.cancel_at_period_end,
        metadata: sub.metadata,
      });
    }

    console.log("\n--- ZAHLUNGSMETHODEN ---");

    const methods =
      await stripe.paymentMethods.list({
        customer: customer.id,
        type: "card",
      });

    console.log("Anzahl:", methods.data.length);

    for (const pm of methods.data) {
      console.log({
        id: pm.id,
        brand: pm.card?.brand,
        last4: pm.card?.last4,
        exp_month: pm.card?.exp_month,
        exp_year: pm.card?.exp_year,
      });
    }
  }
}

main().catch((error) => {
  console.error("\nFEHLER:");
  console.error(error);
  process.exit(1);
});
