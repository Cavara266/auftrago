import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const ENDPOINT = "https://lindas.admin.ch/query";

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 100);
}

async function main() {
  console.log("Import wird gestartet...");

  const sparql = `
PREFIX schema: <http://schema.org/>
PREFIX admin: <https://schema.ld.admin.ch/>

SELECT DISTINCT ?company_uri ?name ?municipality WHERE {
  ?company_uri a admin:ZefixOrganisation ;
               schema:name ?name .

  OPTIONAL {
    ?company_uri admin:municipality ?muni .
    ?muni schema:name ?municipality .
    FILTER(lang(?municipality) = "de" || lang(?municipality) = "")
  }
}
ORDER BY ?name
LIMIT 500
`;

  const response = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/sparql-query",
      Accept: "application/sparql-results+json",
    },
    body: sparql,
  });

  if (!response.ok) {
    throw new Error(
      `LINDAS Fehler ${response.status}: ${await response.text()}`
    );
  }

  const data = await response.json();
  const rows = data?.results?.bindings || [];

  console.log(`${rows.length} Datensätze erhalten.`);

  let imported = 0;
  let skipped = 0;

  const seen = new Set<string>();

  for (const row of rows) {
    const uri = row.company_uri?.value || "";
    const name = row.name?.value?.trim() || "";

    if (!uri || !name) {
      skipped++;
      continue;
    }

    const ehraid = uri.split("/").filter(Boolean).pop();

    if (!ehraid || seen.has(ehraid)) {
      skipped++;
      continue;
    }

    seen.add(ehraid);

    const slug = `${slugify(name)}-${ehraid}`.slice(0, 180);

    await prisma.company.upsert({
      where: {
        ehraid: ehraid,
      },
      update: {
        name,
        municipality: row.municipality?.value || null,
        source: "ZEFIX",
        sourceUrl: uri,
      },
      create: {
        name,
        municipality: row.municipality?.value || null,
        ehraid,
        source: "ZEFIX",
        sourceUrl: uri,
        slug,
      },
    });

    imported++;

    if (imported % 50 === 0) {
      console.log(`${imported} Firmen gespeichert...`);
    }
  }

  console.log("");
  console.log("================================");
  console.log("IMPORT ABGESCHLOSSEN");
  console.log("Importiert:", imported);
  console.log("Übersprungen:", skipped);
  console.log("================================");

  const total = await prisma.company.count();
  console.log("Firmen insgesamt in DB:", total);
}

main()
  .catch((error) => {
    console.error("IMPORT FEHLER:");
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
