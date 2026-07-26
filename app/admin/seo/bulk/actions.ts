"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";

type BulkAction =
  | "SET_ACTIVE"
  | "SET_DRAFT"
  | "SET_INDEXABLE"
  | "SET_NOINDEX";

function refreshSeoPages() {
  revalidatePath("/admin/seo");
  revalidatePath("/admin/seo/bulk");
  revalidatePath("/admin/seo/audit");
  revalidatePath("/admin/seo/editor");
  revalidatePath("/admin/seo/health");
  revalidatePath("/admin/seo/publish");
  revalidatePath("/admin/seo/sitemap");
  revalidatePath("/admin/seo/snippets");
  revalidatePath("/sitemap.xml");
}

export async function executeBulkSeoAction(input: {
  ids: string[];
  action: BulkAction;
}) {
  const ids = Array.from(
    new Set(
      input.ids
        .map((id) => id.trim())
        .filter(Boolean)
    )
  );

  if (ids.length === 0) {
    throw new Error(
      "Es wurden keine Landingpages ausgewählt."
    );
  }

  if (ids.length > 500) {
    throw new Error(
      "Pro Durchlauf können höchstens 500 Landingpages bearbeitet werden."
    );
  }

  let result;

  switch (input.action) {
    case "SET_ACTIVE":
      result =
        await prisma.seoLandingPage.updateMany({
          where: {
            id: {
              in: ids,
            },
          },
          data: {
            status: "ACTIVE",
            publishedAt: new Date(),
          },
        });
      break;

    case "SET_DRAFT":
      result =
        await prisma.seoLandingPage.updateMany({
          where: {
            id: {
              in: ids,
            },
          },
          data: {
            status: "DRAFT",
          },
        });
      break;

    case "SET_INDEXABLE":
      result =
        await prisma.seoLandingPage.updateMany({
          where: {
            id: {
              in: ids,
            },
          },
          data: {
            indexable: true,
          },
        });
      break;

    case "SET_NOINDEX":
      result =
        await prisma.seoLandingPage.updateMany({
          where: {
            id: {
              in: ids,
            },
          },
          data: {
            indexable: false,
          },
        });
      break;

    default:
      throw new Error(
        "Die gewählte Aktion ist ungültig."
      );
  }

  refreshSeoPages();

  return {
    success: true,
    updated: result.count,
    message:
      `${result.count} Landingpages wurden erfolgreich aktualisiert.`,
  };
}
