import { redirect } from "next/navigation";

import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updatePortalSettingsAction } from "./actions";
import MatchingCenter from "./matching-center";
import "./matching-center.css";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const cantons = [
  "Aargau",
  "Appenzell Ausserrhoden",
  "Appenzell Innerrhoden",
  "Basel-Landschaft",
  "Basel-Stadt",
  "Bern",
  "Freiburg",
  "Genf",
  "Glarus",
  "Graubünden",
  "Jura",
  "Luzern",
  "Neuenburg",
  "Nidwalden",
  "Obwalden",
  "Schaffhausen",
  "Schwyz",
  "Solothurn",
  "St. Gallen",
  "Tessin",
  "Thurgau",
  "Uri",
  "Waadt",
  "Wallis",
  "Zug",
  "Zürich",
];

type PageProps = {
  searchParams?: Promise<{
    saved?: string;
  }>;
};

export default async function PortalSettingsPage({
  searchParams,
}: PageProps) {
  const user = await requireUser();

  if (!user) {
    redirect("/login");
  }

  if (user.status !== "APPROVED") {
    redirect("/login?error=provider-not-approved");
  }

  const params = searchParams
    ? await searchParams
    : undefined;

  const [provider, services] = await Promise.all([
    prisma.provider.findUnique({
      where: {
        id: user.id,
      },
      include: {
        providerServices: {
          where: {
            active: true,
          },
          select: {
            serviceId: true,
          },
        },
      },
    }),

    prisma.service.findMany({
      include: {
        category: true,
      },
      orderBy: [
        {
          category: {
            sortOrder: "asc",
          },
        },
        {
          sortOrder: "asc",
        },
        {
          name: "asc",
        },
      ],
    }),
  ]);

  if (!provider) {
    redirect("/login");
  }

  const serializedServices = services.map((service) => ({
    id: service.id,
    name: service.name,
    categorySlug: service.category.slug,
    categoryName: service.category.name,
  }));

  return (
    <MatchingCenter
      action={updatePortalSettingsAction}
      saved={params?.saved === "1"}
      cantons={cantons}
      services={serializedServices}
      initialServiceIds={provider.providerServices.map(
        (entry) => entry.serviceId
      )}
      initialRegions={provider.serviceRegions}
      initialCities={provider.serviceCities}
      initialPostalCodes={provider.servicePostalCodes}
      initialReceiveLeadEmails={provider.receiveLeadEmails}
      initialReceiveAllLeadEmails={
        provider.receiveAllLeadEmails
      }
    />
  );
}
