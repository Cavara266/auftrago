"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";

type GeneratorInput = {
  cityId: string;
  serviceId: string;
  seoTitle: string;
  seoDescription: string;
  headline: string;
  introduction: string;
  content: string;
  canonicalUrl: string;
  customPriceMinCents: number | null;
  customPriceMaxCents: number | null;
  publish: boolean;
};

function cleanText(value: string) {
  return value.trim();
}

function getLandingPath(
  serviceSlug: string,
  citySlug: string
) {
  return `/dienstleistung/${serviceSlug}/${citySlug}`;
}

function refreshSeoPages(
  serviceSlug: string,
  citySlug: string
) {
  const publicPath = getLandingPath(
    serviceSlug,
    citySlug
  );

  revalidatePath("/admin/seo");
  revalidatePath("/admin/seo/ai-generator");
  revalidatePath("/admin/seo/editor");
  revalidatePath("/admin/seo/audit");
  revalidatePath("/admin/seo/bulk");
  revalidatePath("/admin/seo/links");
  revalidatePath("/sitemap.xml");
  revalidatePath(publicPath);
}

export async function saveGeneratedLandingPage(
  input: GeneratorInput
) {
  const cityId = cleanText(input.cityId);
  const serviceId = cleanText(input.serviceId);

  if (!cityId || !serviceId) {
    throw new Error(
      "Bitte eine Stadt und eine Dienstleistung auswählen."
    );
  }

  const [
    city,
    service,
  ] = await Promise.all([
    prisma.seoCity.findUnique({
      where: {
        id: cityId,
      },
      select: {
        id: true,
        name: true,
        slug: true,
      },
    }),

    prisma.seoServicePage.findUnique({
      where: {
        id: serviceId,
      },
      select: {
        id: true,
        name: true,
        slug: true,
      },
    }),
  ]);

  if (!city) {
    throw new Error(
      "Die gewählte Stadt wurde nicht gefunden."
    );
  }

  if (!service) {
    throw new Error(
      "Die gewählte Dienstleistung wurde nicht gefunden."
    );
  }

  const seoTitle = cleanText(input.seoTitle);
  const seoDescription = cleanText(
    input.seoDescription
  );
  const headline = cleanText(input.headline);
  const introduction = cleanText(
    input.introduction
  );
  const content = cleanText(input.content);

  if (!seoTitle) {
    throw new Error(
      "Der SEO-Titel darf nicht leer sein."
    );
  }

  if (seoTitle.length > 70) {
    throw new Error(
      "Der SEO-Titel darf höchstens 70 Zeichen lang sein."
    );
  }

  if (!seoDescription) {
    throw new Error(
      "Die Meta-Beschreibung darf nicht leer sein."
    );
  }

  if (seoDescription.length > 180) {
    throw new Error(
      "Die Meta-Beschreibung darf höchstens 180 Zeichen lang sein."
    );
  }

  if (!headline) {
    throw new Error(
      "Die Hauptüberschrift darf nicht leer sein."
    );
  }

  if (!introduction) {
    throw new Error(
      "Die Einleitung darf nicht leer sein."
    );
  }

  if (!content) {
    throw new Error(
      "Der Haupttext darf nicht leer sein."
    );
  }

  const slug = `${service.slug}-${city.slug}`;

  const canonicalUrl =
    cleanText(input.canonicalUrl) ||
    `https://www.auftrago.ch${getLandingPath(
      service.slug,
      city.slug
    )}`;

  const existing =
    await prisma.seoLandingPage.findUnique({
      where: {
        cityId_serviceId: {
          cityId,
          serviceId,
        },
      },
      select: {
        id: true,
        publishedAt: true,
      },
    });

  const status = input.publish
    ? "ACTIVE"
    : "DRAFT";

  const publishedAt = input.publish
    ? existing?.publishedAt ?? new Date()
    : existing?.publishedAt ?? null;

  const page =
    await prisma.seoLandingPage.upsert({
      where: {
        cityId_serviceId: {
          cityId,
          serviceId,
        },
      },

      create: {
        cityId,
        serviceId,
        slug,
        headline,
        introduction,
        content,
        seoTitle,
        seoDescription,
        canonicalUrl,
        customPriceMinCents:
          input.customPriceMinCents,
        customPriceMaxCents:
          input.customPriceMaxCents,
        status,
        indexable: true,
        publishedAt,
      },

      update: {
        headline,
        introduction,
        content,
        seoTitle,
        seoDescription,
        canonicalUrl,
        customPriceMinCents:
          input.customPriceMinCents,
        customPriceMaxCents:
          input.customPriceMaxCents,
        status,
        indexable: true,
        publishedAt,
      },

      select: {
        id: true,
        status: true,
      },
    });

  refreshSeoPages(
    service.slug,
    city.slug
  );

  return {
    success: true,
    id: page.id,
    status: page.status,
    publicPath: getLandingPath(
      service.slug,
      city.slug
    ),
    message: existing
      ? input.publish
        ? "Landingpage wurde aktualisiert und veröffentlicht."
        : "Landingpage wurde aktualisiert und als Entwurf gespeichert."
      : input.publish
        ? "Landingpage wurde erstellt und veröffentlicht."
        : "Landingpage wurde als Entwurf erstellt.",
  };
}
