"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";

function getRequiredString(
  formData: FormData,
  key: string
) {
  const value = formData.get(key);

  if (typeof value !== "string") {
    throw new Error(`${key} fehlt.`);
  }

  return value.trim();
}

function getOptionalString(
  formData: FormData,
  key: string
) {
  const value = formData.get(key);

  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.trim();

  return normalized || null;
}

export async function updateSeoLandingPage(
  formData: FormData
) {
  const id = getRequiredString(
    formData,
    "id"
  );

  const seoTitle = getOptionalString(
    formData,
    "seoTitle"
  );

  const seoDescription =
    getOptionalString(
      formData,
      "seoDescription"
    );

  const canonicalUrl =
    getOptionalString(
      formData,
      "canonicalUrl"
    );

  const indexable =
    formData.get("indexable") === "on";

  if (!id) {
    throw new Error(
      "Die Landingpage-ID fehlt."
    );
  }

  if (
    seoTitle &&
    seoTitle.length > 120
  ) {
    throw new Error(
      "Der SEO-Titel darf höchstens 120 Zeichen enthalten."
    );
  }

  if (
    seoDescription &&
    seoDescription.length > 320
  ) {
    throw new Error(
      "Die Meta-Beschreibung darf höchstens 320 Zeichen enthalten."
    );
  }

  if (
    canonicalUrl &&
    !canonicalUrl.startsWith("https://")
  ) {
    throw new Error(
      "Die Canonical URL muss mit https:// beginnen."
    );
  }

  const page =
    await prisma.seoLandingPage.update({
      where: {
        id,
      },
      data: {
        seoTitle,
        seoDescription,
        canonicalUrl,
        indexable,
      },
      select: {
        city: {
          select: {
            slug: true,
          },
        },
        service: {
          select: {
            slug: true,
          },
        },
      },
    });

  revalidatePath("/admin/seo");
  revalidatePath("/admin/seo/editor");
  revalidatePath("/admin/seo/audit");
  revalidatePath("/admin/seo/health");
  revalidatePath("/admin/seo/snippets");
  revalidatePath("/admin/seo/sitemap");
  revalidatePath("/sitemap.xml");

  revalidatePath(
    `/dienstleistung/${page.service.slug}/${page.city.slug}`
  );
}
