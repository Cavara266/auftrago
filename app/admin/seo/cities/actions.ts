"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

function clean(value: FormDataEntryValue | null) {
  const text = String(value || "").trim();
  return text.length > 0 ? text : null;
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

function getStatus(value: FormDataEntryValue | null) {
  const status = String(value || "DRAFT");

  if (
    status === "ACTIVE" ||
    status === "INACTIVE" ||
    status === "ARCHIVED"
  ) {
    return status;
  }

  return "DRAFT";
}

function getNeighbors(value: FormDataEntryValue | null) {
  return String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export async function createSeoCity(formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  const slugInput = String(formData.get("slug") || "").trim();
  const canton = String(formData.get("canton") || "").trim();

  if (!name || !canton) {
    throw new Error("Name und Kanton sind Pflichtfelder.");
  }

  const slug = slugInput ? slugify(slugInput) : slugify(name);

  const existingCity = await prisma.seoCity.findUnique({
    where: { slug },
    select: { id: true },
  });

  if (existingCity) {
    throw new Error(`Die Stadt mit dem Slug "${slug}" existiert bereits.`);
  }

  await prisma.seoCity.create({
    data: {
      name,
      slug,
      canton,
      region: clean(formData.get("region")),
      country: clean(formData.get("country")) || "Schweiz",
      introduction: clean(formData.get("introduction")),
      localContent: clean(formData.get("localContent")),
      seoTitle: clean(formData.get("seoTitle")),
      seoDescription: clean(formData.get("seoDescription")),
      canonicalUrl: clean(formData.get("canonicalUrl")),
      neighboringCities: getNeighbors(formData.get("neighboringCities")),
      status: getStatus(formData.get("status")),
      indexable: formData.get("indexable") === "on",
      sortOrder: Number(formData.get("sortOrder") || 0),
    },
  });

  revalidatePath("/admin/seo");
  revalidatePath("/admin/seo/cities");
  revalidatePath("/sitemap.xml");

  redirect("/admin/seo/cities");
}

export async function updateSeoCity(id: string, formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  const slugInput = String(formData.get("slug") || "").trim();
  const canton = String(formData.get("canton") || "").trim();

  if (!name || !canton) {
    throw new Error("Name und Kanton sind Pflichtfelder.");
  }

  const slug = slugInput ? slugify(slugInput) : slugify(name);

  const existingCity = await prisma.seoCity.findFirst({
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

  if (existingCity) {
    throw new Error(`Die Stadt mit dem Slug "${slug}" existiert bereits.`);
  }

  await prisma.seoCity.update({
    where: { id },
    data: {
      name,
      slug,
      canton,
      region: clean(formData.get("region")),
      country: clean(formData.get("country")) || "Schweiz",
      introduction: clean(formData.get("introduction")),
      localContent: clean(formData.get("localContent")),
      seoTitle: clean(formData.get("seoTitle")),
      seoDescription: clean(formData.get("seoDescription")),
      canonicalUrl: clean(formData.get("canonicalUrl")),
      neighboringCities: getNeighbors(formData.get("neighboringCities")),
      status: getStatus(formData.get("status")),
      indexable: formData.get("indexable") === "on",
      sortOrder: Number(formData.get("sortOrder") || 0),
    },
  });

  revalidatePath("/admin/seo");
  revalidatePath("/admin/seo/cities");
  revalidatePath(`/admin/seo/cities/${id}/edit`);
  revalidatePath("/sitemap.xml");

  redirect("/admin/seo/cities");
}

export async function toggleSeoCity(id: string) {
  const city = await prisma.seoCity.findUnique({
    where: { id },
    select: { status: true },
  });

  if (!city) {
    throw new Error("Stadt wurde nicht gefunden.");
  }

  await prisma.seoCity.update({
    where: { id },
    data: {
      status: city.status === "ACTIVE" ? "INACTIVE" : "ACTIVE",
    },
  });

  revalidatePath("/admin/seo");
  revalidatePath("/admin/seo/cities");
  revalidatePath("/sitemap.xml");
}

export async function deleteSeoCity(id: string) {
  await prisma.seoCity.delete({
    where: { id },
  });

  revalidatePath("/admin/seo");
  revalidatePath("/admin/seo/cities");
  revalidatePath("/sitemap.xml");
}
