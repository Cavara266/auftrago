import { prisma } from "../lib/prisma";

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

async function main() {
  const providers = await prisma.provider.findMany();

  for (const provider of providers) {
    if (provider.slug) continue;

    const baseSlug = slugify(provider.companyName);
    let slug = baseSlug;
    let counter = 2;

    while (
      await prisma.provider.findFirst({
        where: {
          slug,
          id: {
            not: provider.id,
          },
        },
      })
    ) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    await prisma.provider.update({
      where: {
        id: provider.id,
      },
      data: {
        slug,
      },
    });

    console.log(`✔ ${provider.companyName} → ${slug}`);
  }

  console.log("✅ Alle Slugs wurden erstellt.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });