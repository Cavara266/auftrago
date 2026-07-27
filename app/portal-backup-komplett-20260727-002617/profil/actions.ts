"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

import { requireUser } from "@/lib/auth";
function cleanValue(value: FormDataEntryValue | null) {
  return String(value || "").trim();
}

function normalizeWebsite(value: string) {
  const cleaned = value.trim();

  if (!cleaned) {
    return "";
  }

  if (cleaned.startsWith("http://") || cleaned.startsWith("https://")) {
    return cleaned;
  }

  return `https://${cleaned}`;
}

export async function updateProviderProfileAction(formData: FormData) {
  
  const user = await requireUser();

  if (!user) {
    redirect("/login");
  }

  const providerId = user.id;


  const companyName = cleanValue(formData.get("companyName"));
  const contactName = cleanValue(formData.get("contactName"));
  const phone = cleanValue(formData.get("phone"));
  const region = cleanValue(formData.get("region"));
  const category = cleanValue(formData.get("category"));
  const website = normalizeWebsite(cleanValue(formData.get("website")));
  const description = cleanValue(formData.get("description"));
  const address = cleanValue(formData.get("address"));
  const postalCode = cleanValue(formData.get("postalCode"));
  const city = cleanValue(formData.get("city"));

  if (!companyName || !contactName) {
    redirect("/portal/profil?error=missing-fields");
  }

  await prisma.provider.update({
    where: {
      id: providerId,
    },
    data: {
      companyName,
      contactName,
      phone: phone || null,
      region: region || null,
      category: category || null,
      website: website || null,
      description: description || null,
      address: address || null,
      postalCode: postalCode || null,
      city: city || null,
    },
  });

  redirect("/portal/profil?message=saved");
}