"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

function cleanValue(value: FormDataEntryValue | null) {
  return String(value || "").trim();
}

export async function createLeadAction(formData: FormData) {
  const title = cleanValue(formData.get("title"));
  const description = cleanValue(formData.get("description"));
  const name = cleanValue(formData.get("name"));
  const email = cleanValue(formData.get("email")).toLowerCase();
  const phone = cleanValue(formData.get("phone"));
  const region = cleanValue(formData.get("region"));
  const category = cleanValue(formData.get("category"));
  const price = Number(formData.get("price") || 0);

  if (
    !title ||
    !description ||
    !name ||
    !email ||
    !phone ||
    !region ||
    !category
  ) {
    redirect("/admin/leads?error=missing-fields");
  }

  if (!Number.isFinite(price) || price < 1) {
    redirect("/admin/leads?error=invalid-price");
  }

  await prisma.lead.create({
    data: {
      title,
      description,
      name,
      email,
      phone,
      region,
      category,
      price,
    },
  });

  redirect("/admin/leads?message=created");
}

export async function deleteLeadAction(formData: FormData) {
  const leadId = cleanValue(formData.get("leadId"));

  if (!leadId) {
    redirect("/admin/leads?error=invalid-lead");
  }

  const lead = await prisma.lead.findUnique({
    where: {
      id: leadId,
    },
    select: {
      id: true,
    },
  });

  if (!lead) {
    redirect("/admin/leads?error=invalid-lead");
  }

  await prisma.lead.delete({
    where: {
      id: leadId,
    },
  });

  redirect("/admin/leads?message=deleted");
}