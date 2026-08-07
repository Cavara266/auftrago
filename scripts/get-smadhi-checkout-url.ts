import { loadEnvConfig } from "@next/env";
loadEnvConfig(process.cwd());

import Stripe from "stripe";

async function main() {
  const key = process.env.STRIPE_SECRET_KEY;

  if (!key) {
    throw new Error("STRIPE_SECRET_KEY fehlt");
  }

  const stripe = new Stripe(key);

  const customers = await stripe.customers.list({
    email: "info@smadhihauswartungen.ch",
    limit: 10,
  });

  if (!customers.data.length) {
    throw new Error("Smadhi Stripe-Kunde nicht gefunden");
  }

  const customer = customers.data[0];

  const sessions = await stripe.checkout.sessions.list({
    customer: customer.id,
    limit: 20,
  });

  const openSession = sessions.data.find(
    (session) =>
      session.mode === "subscription" &&
      session.status === "open"
  );

  if (!openSession) {
    console.log("Keine offene Subscription-Checkout-Session gefunden.");
    return;
  }

  console.log("\n================================");
  console.log("SMADHI CHECKOUT");
  console.log("================================");
  console.log("Session:", openSession.id);
  console.log("Status:", openSession.status);
  console.log("Payment:", openSession.payment_status);
  console.log("Expires:", openSession.expires_at
    ? new Date(openSession.expires_at * 1000).toLocaleString("de-CH")
    : null
  );
  console.log("\nCHECKOUT URL:");
  console.log(openSession.url);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
