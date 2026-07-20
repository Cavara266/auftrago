import { redirect } from "next/navigation";

import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import ProviderProfileForm from "./provider-profile-form";

export const dynamic = "force-dynamic";

export default async function ProviderProfilePage() {
  const user = await requireUser();

  if (!user) {
    redirect("/login");
  }

  const provider = await prisma.provider.findUnique({
    where: {
      id: user.id,
    },
    select: {
      email: true,
      companyName: true,
      contactName: true,
      phone: true,
      slug: true,
      logoUrl: true,
      website: true,
      description: true,
      address: true,
      postalCode: true,
      city: true,
      serviceCategories: true,
      serviceRegions: true,
      status: true,
      createdAt: true,
    },
  });

  if (!provider) {
    redirect("/login");
  }

  return (
    <ProviderProfileForm
      initialProfile={{
        email: provider.email,
        companyName: provider.companyName,
        contactName: provider.contactName,
        phone: provider.phone ?? "",
        slug: provider.slug ?? "",
        logoUrl: provider.logoUrl ?? "",
        website: provider.website ?? "",
        description: provider.description ?? "",
        address: provider.address ?? "",
        postalCode: provider.postalCode ?? "",
        city: provider.city ?? "",
        serviceCategories: provider.serviceCategories,
        serviceRegions: provider.serviceRegions,
        status: provider.status,
        createdAt: provider.createdAt.toISOString(),
      }}
    />
  );
}