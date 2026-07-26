"use server";

import { SeoContentStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";

function clean(value: FormDataEntryValue | null) {
  const text = String(value || "").trim();
  return text || null;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function parseList(value: FormDataEntryValue | null) {
  return String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseOptionalInteger(value: FormDataEntryValue | null) {
  const text = String(value || "").trim();

  if (!text) {
    return null;
  }

  const number = Number(text);

  if (!Number.isFinite(number)) {
    return null;
  }

  return Math.round(number);
}

function getStatus(value: FormDataEntryValue | null): SeoContentStatus {
  const status = String(value || "DRAFT");

  if (status === "ACTIVE") return SeoContentStatus.ACTIVE;
  if (status === "INACTIVE") return SeoContentStatus.INACTIVE;
  if (status === "ARCHIVED") return SeoContentStatus.ARCHIVED;

  return SeoContentStatus.DRAFT;
}

export async function createSeoService(formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  const slugInput = String(formData.get("slug") || "").trim();

  if (!name) {
    throw new Error("Der Name der Dienstleistung ist erforderlich.");
  }

  const slug = slugify(slugInput || name);

  const existing = await prisma.seoServicePage.findUnique({
    where: { slug },
    select: { id: true },
  });

  if (existing) {
    throw new Error(`Der Slug "${slug}" wird bereits verwendet.`);
  }

  await prisma.seoServicePage.create({
    data: {
      name,
      slug,
      shortName: clean(formData.get("shortName")),
      description: clean(formData.get("description")),
      content: clean(formData.get("content")),

      priceMinCents: parseOptionalInteger(formData.get("priceMinCents")),
      priceMaxCents: parseOptionalInteger(formData.get("priceMaxCents")),
      priceUnit: clean(formData.get("priceUnit")),

      seoTitle: clean(formData.get("seoTitle")),
      seoDescription: clean(formData.get("seoDescription")),
      canonicalUrl: clean(formData.get("canonicalUrl")),

      benefits: parseList(formData.get("benefits")),
      relatedServices: parseList(formData.get("relatedServices")),

      status: getStatus(formData.get("status")),
      indexable: formData.get("indexable") === "on",
      sortOrder: Number(formData.get("sortOrder") || 0),
    },
  });

  revalidatePath("/admin/seo");
  revalidatePath("/admin/seo/services");
  revalidatePath("/sitemap.xml");

  redirect("/admin/seo/services");
}

export async function updateSeoService(
  id: string,
  formData: FormData
) {
  const name = String(formData.get("name") || "").trim();
  const slugInput = String(formData.get("slug") || "").trim();

  if (!name) {
    throw new Error("Der Name der Dienstleistung ist erforderlich.");
  }

  const slug = slugify(slugInput || name);

  const existing = await prisma.seoServicePage.findFirst({
    where: {
      slug,
      NOT: {
        id,
      },
    },
    select: {
      id: true,
    },
  });

  if (existing) {
    throw new Error(`Der Slug "${slug}" wird bereits verwendet.`);
  }

  await prisma.seoServicePage.update({
    where: { id },
    data: {
      name,
      slug,
      shortName: clean(formData.get("shortName")),
      description: clean(formData.get("description")),
      content: clean(formData.get("content")),

      priceMinCents: parseOptionalInteger(formData.get("priceMinCents")),
      priceMaxCents: parseOptionalInteger(formData.get("priceMaxCents")),
      priceUnit: clean(formData.get("priceUnit")),

      seoTitle: clean(formData.get("seoTitle")),
      seoDescription: clean(formData.get("seoDescription")),
      canonicalUrl: clean(formData.get("canonicalUrl")),

      benefits: parseList(formData.get("benefits")),
      relatedServices: parseList(formData.get("relatedServices")),

      status: getStatus(formData.get("status")),
      indexable: formData.get("indexable") === "on",
      sortOrder: Number(formData.get("sortOrder") || 0),
    },
  });

  revalidatePath("/admin/seo");
  revalidatePath("/admin/seo/services");
  revalidatePath(`/admin/seo/services/${id}/edit`);
  revalidatePath("/sitemap.xml");

  redirect("/admin/seo/services");
}

export async function toggleSeoService(id: string) {
  const service = await prisma.seoServicePage.findUnique({
    where: { id },
    select: {
      status: true,
    },
  });

  if (!service) {
    throw new Error("Die Dienstleistung wurde nicht gefunden.");
  }

  await prisma.seoServicePage.update({
    where: { id },
    data: {
      status:
        service.status === SeoContentStatus.ACTIVE
          ? SeoContentStatus.INACTIVE
          : SeoContentStatus.ACTIVE,
    },
  });

  revalidatePath("/admin/seo");
  revalidatePath("/admin/seo/services");
  revalidatePath("/sitemap.xml");
}

export async function deleteSeoService(id: string) {
  await prisma.seoServicePage.delete({
    where: { id },
  });

  revalidatePath("/admin/seo");
  revalidatePath("/admin/seo/services");
  revalidatePath("/sitemap.xml");
}
