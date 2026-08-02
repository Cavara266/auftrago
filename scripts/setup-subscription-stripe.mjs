import fs from "node:fs";
import path from "node:path";
import Stripe from "stripe";

function readEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return {};
  }

  const result = {};
  const content = fs.readFileSync(filePath, "utf8");

  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();

    if (!line || line.startsWith("#")) {
      continue;
    }

    const separatorIndex = line.indexOf("=");

    if (separatorIndex === -1) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();

    let value = line
      .slice(separatorIndex + 1)
      .trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    result[key] = value;
  }

  return result;
}

function setEnvValue(filePath, key, value) {
  let content = fs.existsSync(filePath)
    ? fs.readFileSync(filePath, "utf8")
    : "";

  const escapedKey = key.replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&",
  );

  const expression = new RegExp(
    `^${escapedKey}=.*$`,
    "m",
  );

  const newLine = `${key}=${value}`;

  if (expression.test(content)) {
    content = content.replace(
      expression,
      newLine,
    );
  } else {
    content = `${content.trimEnd()}\n${newLine}\n`;
  }

  fs.writeFileSync(
    filePath,
    content.replace(/^\n+/, ""),
    "utf8",
  );
}

const projectRoot = process.cwd();

const environment = {
  ...readEnvFile(
    path.join(projectRoot, ".env"),
  ),
  ...readEnvFile(
    path.join(projectRoot, ".env.local"),
  ),
  ...process.env,
};

const secretKey =
  environment.STRIPE_SECRET_KEY?.trim();

if (!secretKey) {
  throw new Error(
    "STRIPE_SECRET_KEY wurde nicht gefunden.",
  );
}

if (!secretKey.startsWith("sk_live_")) {
  throw new Error(
    "Es wurde kein Stripe-Live-Schlüssel gefunden. Erwartet wird sk_live_...",
  );
}

const stripe = new Stripe(secretKey);

const appUrl =
  (
    environment.NEXT_PUBLIC_APP_URL ||
    environment.APP_URL ||
    "https://www.auftrago.ch"
  ).replace(/\/+$/, "");

const webhookUrl =
  `${appUrl}/api/stripe/subscription-webhook`;

console.log("");
console.log("Stripe-Modus: LIVE");
console.log(`App-URL: ${appUrl}`);
console.log(`Webhook: ${webhookUrl}`);
console.log("");

const products = await stripe.products.search({
  query:
    "metadata['auftrago_type']:'provider_subscription'",
});

let product = products.data[0];

if (!product) {
  product = await stripe.products.create({
    name: "Auftrago Anbieter-Mitgliedschaft",

    description:
      "Monatlicher Zugang zum Auftrago Anbieterportal. Lead-Credits werden separat gekauft.",

    metadata: {
      auftrago_type:
        "provider_subscription",

      platform: "auftrago",
    },
  });

  console.log(
    `Produkt erstellt: ${product.id}`,
  );
} else {
  console.log(
    `Produkt vorhanden: ${product.id}`,
  );
}

const prices = await stripe.prices.list({
  product: product.id,
  active: true,
  limit: 100,
});

let price = prices.data.find(
  (item) =>
    item.currency === "chf" &&
    item.unit_amount === 6900 &&
    item.recurring?.interval === "month",
);

if (!price) {
  price = await stripe.prices.create({
    product: product.id,

    currency: "chf",

    unit_amount: 6900,

    recurring: {
      interval: "month",
    },

    nickname:
      "Auftrago Anbieter CHF 69 monatlich",

    metadata: {
      auftrago_type:
        "provider_subscription",

      monthly_price_chf: "69",
    },
  });

  console.log(
    `Monatspreis erstellt: ${price.id}`,
  );
} else {
  console.log(
    `Monatspreis vorhanden: ${price.id}`,
  );
}

const endpoints =
  await stripe.webhookEndpoints.list({
    limit: 100,
  });

let endpoint = endpoints.data.find(
  (item) => item.url === webhookUrl,
);

let webhookSecret = "";

const enabledEvents = [
  "checkout.session.completed",
  "checkout.session.async_payment_succeeded",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
  "invoice.paid",
  "invoice.payment_failed",
];

if (!endpoint) {
  endpoint =
    await stripe.webhookEndpoints.create({
      url: webhookUrl,

      enabled_events: enabledEvents,

      description:
        "Auftrago Anbieter-Abonnements",

      metadata: {
        platform: "auftrago",
        type: "provider_subscription",
      },
    });

  webhookSecret = endpoint.secret || "";

  console.log(
    `Webhook erstellt: ${endpoint.id}`,
  );
} else {
  endpoint =
    await stripe.webhookEndpoints.update(
      endpoint.id,
      {
        enabled_events: enabledEvents,

        description:
          "Auftrago Anbieter-Abonnements",
      },
    );

  console.log(
    `Webhook vorhanden und aktualisiert: ${endpoint.id}`,
  );

  webhookSecret =
    environment
      .STRIPE_SUBSCRIPTION_WEBHOOK_SECRET
      ?.trim() || "";
}

const localEnvPath = path.join(
  projectRoot,
  ".env.local",
);

setEnvValue(
  localEnvPath,
  "NEXT_PUBLIC_APP_URL",
  appUrl,
);

setEnvValue(
  localEnvPath,
  "STRIPE_PROVIDER_SUBSCRIPTION_PRICE_ID",
  price.id,
);

if (webhookSecret) {
  setEnvValue(
    localEnvPath,
    "STRIPE_SUBSCRIPTION_WEBHOOK_SECRET",
    webhookSecret,
  );
}

const result = {
  appUrl,
  productId: product.id,
  priceId: price.id,
  webhookId: endpoint.id,
  webhookUrl,
  webhookSecretCreated:
    Boolean(webhookSecret),
};

fs.writeFileSync(
  path.join(
    projectRoot,
    "subscription-stripe-result.json",
  ),
  JSON.stringify(result, null, 2),
  "utf8",
);

console.log("");
console.log(
  "==========================================",
);

console.log(
  "STRIPE ABO-EINRICHTUNG ABGESCHLOSSEN",
);

console.log(
  "==========================================",
);

console.log(
  `Produkt: ${product.id}`,
);

console.log(
  `Preis: ${price.id}`,
);

console.log(
  `Webhook: ${endpoint.id}`,
);

if (webhookSecret) {
  console.log(
    "Webhook-Signing-Secret wurde in .env.local gespeichert.",
  );
} else {
  console.log("");
  console.log(
    "ACHTUNG: Der Webhook bestand bereits.",
  );

  console.log(
    "Stripe zeigt das bestehende Signing Secret nicht erneut über die API an.",
  );

  console.log(
    "Falls STRIPE_SUBSCRIPTION_WEBHOOK_SECRET noch fehlt, muss es im Stripe-Dashboard kopiert werden.",
  );
}

console.log("");
