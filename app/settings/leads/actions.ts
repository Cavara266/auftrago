"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  SERVICE_CATEGORIES,
  SWISS_REGIONS,
} from "@/lib/provider-preferences";

function cleanValue(value: FormDataEntryValue | null) {
  return String(value || "").trim();
}

function cleanList(values: FormDataEntryValue[]) {
  return Array.from(
    new Set(
      values
        .map((value) => String(value).trim())
        .filter(Boolean)
    )
  );
}

function parseCustomList(value: string) {
  return Array.from(
    new Set(
      value
        .split(/[\n,;]+/)
        .map((item) => item.trim())
        .filter(Boolean)
    )
  ).slice(0, 100);
}

export async function updateLeadPreferencesAction(
  formData: FormData
) {
  const user = await requireUser();

  if (!user) {
    redirect("/login");
  }

  const submittedCategories = cleanList(
    formData.getAll("serviceCategories")
  );

  const submittedRegions = cleanList(
    formData.getAll("serviceRegions")
  );

  const allowedCategories = new Set<string>(
    SERVICE_CATEGORIES
  );

  const allowedRegions = new Set<string>(
    SWISS_REGIONS
  );

  const serviceCategories = submittedCategories.filter(
    (category) => allowedCategories.has(category)
  );

  const serviceRegions = submittedRegions.filter(
    (region) => allowedRegions.has(region)
  );

  const serviceCities = parseCustomList(
    cleanValue(formData.get("serviceCities"))
  );

  const servicePostalCodes = parseCustomList(
    cleanValue(formData.get("servicePostalCodes"))
  ).filter((postalCode) =>
    /^[0-9]{4}$/.test(postalCode)
  );

  const receiveLeadEmails =
    formData.get("receiveLeadEmails") === "on";

  const receiveAllLeadEmails =
    receiveLeadEmails &&
    formData.get("receiveAllLeadEmails") === "on";

  await prisma.provider.update({
    where: {
      id: user.id,
    },
    data: {
      serviceCategories,
      serviceRegions,
      serviceCities,
      servicePostalCodes,
      receiveLeadEmails,
      receiveAllLeadEmails,

      // Die alten Felder bleiben für bestehende Funktionen erhalten.
      category: serviceCategories[0] || null,
      region: serviceRegions[0] || null,
    },
  });

  revalidatePath("/settings/leads");
  revalidatePath("/dashboard");
  revalidatePath("/leads");

  redirect("/settings/leads?message=saved");
}