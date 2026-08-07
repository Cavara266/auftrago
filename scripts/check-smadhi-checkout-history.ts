import { stripe } from "../lib/stripe";

async function main() {
  

  const email = "info@smadhihauswartungen.ch";

  const customers = await stripe.customers.list({
    email,
    limit: 20,
  });

  console.log("\n=== KUNDEN ===");
  console.log("Anzahl:", customers.data.length);

  for (const customer of customers.data) {
    console.log("\nKUNDE");
    console.log({
      id: customer.id,
      email: customer.email,
      name: customer.name,
      created: new Date(customer.created * 1000).toLocaleString("de-CH"),
      metadata: customer.metadata,
    });

    const sessions = await stripe.checkout.sessions.list({
      customer: customer.id,
      limit: 100,
    });

    console.log("\n=== CHECKOUT VERLAUF ===");
    console.log("Sessions:", sessions.data.length);

    for (const session of sessions.data) {
      console.log({
        id: session.id,
        created: new Date(session.created * 1000).toLocaleString("de-CH"),
        status: session.status,
        payment_status: session.payment_status,
        mode: session.mode,
        subscription: session.subscription,
        payment_intent: session.payment_intent,
        setup_intent: session.setup_intent,
        expires_at: session.expires_at
          ? new Date(session.expires_at * 1000).toLocaleString("de-CH")
          : null,
        url_vorhanden: !!session.url,
      });
    }

    const subs = await stripe.subscriptions.list({
      customer: customer.id,
      status: "all",
      limit: 100,
    });

    console.log("\n=== ABOS ===");
    console.log("Anzahl:", subs.data.length);

    for (const sub of subs.data) {
      console.log({
        id: sub.id,
        status: sub.status,
        trial_start: sub.trial_start
          ? new Date(sub.trial_start * 1000).toLocaleString("de-CH")
          : null,
        trial_end: sub.trial_end
          ? new Date(sub.trial_end * 1000).toLocaleString("de-CH")
          : null,
        canceled_at: sub.canceled_at
          ? new Date(sub.canceled_at * 1000).toLocaleString("de-CH")
          : null,
      });
    }
  }
}

main().catch((error) => {
  console.error("\nFEHLER:");
  console.error(error);
  process.exit(1);
});
