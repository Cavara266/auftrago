import fs from "node:fs";
import { newLeadMailTemplate } from "./lib/mail/templates/new-lead";

const result = newLeadMailTemplate({
  companyName: "Cavara Hauswartung",
  contactName: "Dejan",
  lead: {
    id: "preview-lead",
    title: "Umzugsreinigung 5.5 Zimmer",
    region: "Zürich",
    category: "Umzugsreinigung",
    price: 25,
    postalCode: "8000",
    city: "Zürich",
    description:
      "Gesucht wird eine Umzugsreinigung für eine 5.5-Zimmer-Wohnung. Küche, Badezimmer, Fenster und Böden müssen vollständig gereinigt werden. Der Termin ist flexibel und soll nach Absprache stattfinden.",
  },
  estimatedValue: 0,
  leadUrl: "https://auftrago.ch/portal/leads",
});

fs.writeFileSync(
  "/tmp/auftrago-new-lead-preview.html",
  result.html,
  "utf8"
);

console.log("✅ Vorschau erstellt:");
console.log("/tmp/auftrago-new-lead-preview.html");
