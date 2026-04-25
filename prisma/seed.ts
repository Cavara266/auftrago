import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {

  await prisma.provider.createMany({
    data: [

      {
        name: "CleanPro Zürich",
        slug: "cleanpro-zuerich",
        city: "Zürich",
        description: "Professionelle Reinigungen für Wohnungen und Büros."
      },

      {
        name: "Top Umzüge AG",
        slug: "top-umzuege-ag",
        city: "Zürich",
        description: "Professionelle Umzüge für Privatpersonen und Firmen."
      },

      {
        name: "Hauswartung Meier",
        slug: "hauswartung-meier",
        city: "Winterthur",
        description: "Hauswartung und Liegenschaftsbetreuung."
      }

    ],

    skipDuplicates: true
  })

  console.log("Seed completed")

}

main()
  .catch((e) => {
    console.error(e)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })