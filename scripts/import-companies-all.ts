import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const ENDPOINT = "https://lindas.admin.ch/query";

const BATCH_SIZE = 500;
const START_OFFSET = 50000;
const MAX_BATCHES = 200;

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 100);
}

async function fetchBatch(offset: number) {
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
LIMIT ${BATCH_SIZE}
OFFSET ${offset}
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
  return data?.results?.bindings || [];
}

async function main() {
  console.log("====================================");
  console.log("AUFTRAGO SCHWEIZ IMPORT");
  console.log("====================================");

  let totalImported = 0;
  let totalSkipped = 0;

  for (let batch = 0; batch < MAX_BATCHES; batch++) {
    const offset = START_OFFSET + batch * BATCH_SIZE;

    console.log("");
    console.log(`Batch ${batch + 1} - Offset ${offset}`);

    const rows = await fetchBatch(offset);

    if (rows.length === 0) {
      console.log("Keine weiteren Datensätze.");
      break;
    }

    console.log(`${rows.length} Datensätze erhalten.`);

    const seen = new Set<string>();
    let imported = 0;
    let skipped = 0;

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
          ehraid,
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

      if (imported % 100 === 0) {
        console.log(`${imported} Firmen in diesem Batch gespeichert...`);
      }
    }

    totalImported += imported;
    totalSkipped += skipped;

    const totalDb = await prisma.company.count();

    console.log(
      `Batch fertig: ${imported} importiert, ${skipped} übersprungen`
    );
    console.log(`Firmen aktuell in DB: ${totalDb}`);

    if (rows.length < BATCH_SIZE) {
      console.log("Letzter Batch erreicht.");
      break;
    }
  }

  console.log("");
  console.log("====================================");
  console.log("IMPORT BEENDET");
  console.log("Importiert:", totalImported);
  console.log("Übersprungen:", totalSkipped);
  console.log(
    "Firmen insgesamt:",
    await prisma.company.count()
  );
  console.log("====================================");
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
