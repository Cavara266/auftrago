import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

export const dynamic = "force-dynamic";

const globalForPrisma = globalThis as unknown as {
  companyPrisma?: PrismaClient;
};

const prisma =
  globalForPrisma.companyPrisma ??
  new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.companyPrisma = prisma;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim() || "";

  if (query.length < 2) {
    return NextResponse.json({ results: [] });
  }

  try {
    // 1. Exakte Treffer zuerst
    const exact = await prisma.company.findMany({
      where: {
        name: {
          equals: query,
          mode: "insensitive",
        },
      },
      take: 5,
    });

    // 2. Firmen, deren Name mit dem Suchbegriff beginnt
    const starts = await prisma.company.findMany({
      where: {
        name: {
          startsWith: query,
          mode: "insensitive",
        },
      },
      orderBy: {
        name: "asc",
      },
      take: 15,
    });

    // 3. Weitere passende Treffer
    const contains = await prisma.company.findMany({
      where: {
        OR: [
          {
            name: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            city: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            municipality: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            postalCode: {
              contains: query,
            },
          },
          {
            uid: {
              contains: query,
              mode: "insensitive",
            },
          },
        ],
      },
      orderBy: {
        name: "asc",
      },
      take: 30,
    });

    const map = new Map();

    for (const company of [...exact, ...starts, ...contains]) {
      if (!map.has(company.id)) {
        map.set(company.id, company);
      }
    }

    const companies = Array.from(map.values()).slice(0, 20);

    const results = companies.map((company: any) => ({
      id: company.id,
      slug: company.slug,
      uid: company.uid || "",
      ehraid: company.ehraid || "",
      name: company.name,
      type: company.legalForm || "",
      municipality: company.municipality || "",
      street: [company.street, company.houseNumber]
        .filter(Boolean)
        .join(" "),
      locality: [company.postalCode, company.city]
        .filter(Boolean)
        .join(" "),
      canton: company.canton || "",
      status: company.status || "",
      sourceUrl: company.sourceUrl || "",
      claimed: company.claimed || false,
    }));

    return NextResponse.json({
      results,
      count: results.length,
    });
  } catch (error) {
    console.error("Firmensuche Datenbankfehler:", error);

    return NextResponse.json(
      {
        error: "Die Firmensuche konnte momentan nicht geladen werden.",
      },
      {
        status: 500,
      }
    );
  }
}
