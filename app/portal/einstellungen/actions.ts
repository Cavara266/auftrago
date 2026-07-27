"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function cleanList(values: FormDataEntryValue[]) {
  return Array.from(
    new Set(
      values
        .flatMap((value) => String(value).split(","))
        .map((value) => value.trim())
        .filter(Boolean)
    )
  );
}

export async function updatePortalSettingsAction(
  formData: FormData
) {
  const user = await requireUser();

  if (!user) {
    redirect("/login");
  }

  const serviceIds = cleanList(formData.getAll("serviceIds"));
  const regions = cleanList(formData.getAll("regions"));
  const cities = cleanList(formData.getAll("cities"));
  const postalCodes = cleanList(formData.getAll("postalCodes"));

  const receiveLeadEmails =
    formData.get("receiveLeadEmails") === "on";

  const receiveAllLeadEmails =
    formData.get("receiveAllLeadEmails") === "on";

  const selectedServices = serviceIds.length
    ? await prisma.service.findMany({
        where: {
          id: {
            in: serviceIds,
          },
        },
        include: {
          category: true,
        },
      })
    : [];

  const categories = Array.from(
    new Set(
      selectedServices.flatMap((service) => [
        service.category.slug,
        service.category.name,
      ])
    )
  );

  await prisma.$transaction(async (tx) => {
    await tx.provider.update({
      where: {
        id: user.id,
      },
      data: {
        region: regions[0] || null,
        category: selectedServices[0]?.name || null,
        serviceRegions: regions,
        serviceCities: cities,
        servicePostalCodes: postalCodes,
        serviceCategories: categories,
        receiveLeadEmails,
        receiveAllLeadEmails,
      },
    });

    await tx.providerService.deleteMany({
      where: {
        providerId: user.id,
      },
    });

    if (serviceIds.length) {
      await tx.providerService.createMany({
        data: serviceIds.map((serviceId) => ({
          providerId: user.id,
          serviceId,
          active: true,
          regions,
          cities,
          postalCodes,
        })),
        skipDuplicates: true,
      });
    }
  });

  revalidatePath("/portal");
  revalidatePath("/portal/leads");
  revalidatePath("/portal/profil");
  revalidatePath("/portal/einstellungen");

  redirect("/portal/einstellungen?saved=1");
}
