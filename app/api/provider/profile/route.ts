import { del, put } from "@vercel/blob";
import {
  NextRequest,
  NextResponse,
} from "next/server";

import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_LOGO_SIZE =
  4 * 1024 * 1024;

const ALLOWED_LOGO_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

function getStringValue(
  formData: FormData,
  key: string
): string {
  const value = formData.get(key);

  return typeof value === "string"
    ? value.trim()
    : "";
}

function getOptionalValue(
  formData: FormData,
  key: string
): string | null {
  const value =
    getStringValue(formData, key);

  return value || null;
}

function getStringArray(
  formData: FormData,
  key: string
): string[] {
  const value = formData.get(key);

  if (typeof value !== "string") {
    return [];
  }

  try {
    const parsed = JSON.parse(value);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return Array.from(
      new Set(
        parsed
          .filter(
            (item): item is string =>
              typeof item === "string"
          )
          .map((item) => item.trim())
          .filter(Boolean)
      )
    ).slice(0, 50);
  } catch {
    return [];
  }
}

function normalizeWebsite(
  value: string | null
): string | null {
  if (!value) {
    return null;
  }

  if (
    value.startsWith("https://") ||
    value.startsWith("http://")
  ) {
    return value;
  }

  return `https://${value}`;
}

function createSlugBase(
  value: string
): string {
  return (
    value
      .trim()
      .toLowerCase()
      .replace(/ä/g, "ae")
      .replace(/ö/g, "oe")
      .replace(/ü/g, "ue")
      .replace(/ß/g, "ss")
      .normalize("NFD")
      .replace(
        /[\u0300-\u036f]/g,
        ""
      )
      .replace(/&/g, " und ")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .replace(/-{2,}/g, "-") ||
    "anbieter"
  );
}

async function generateUniqueSlug(
  companyName: string,
  providerId: string
): Promise<string> {
  const baseSlug =
    createSlugBase(companyName);

  let candidate = baseSlug;
  let counter = 2;

  while (true) {
    const existing =
      await prisma.provider.findFirst({
        where: {
          slug: candidate,
          id: {
            not: providerId,
          },
        },
        select: {
          id: true,
        },
      });

    if (!existing) {
      return candidate;
    }

    candidate = `${baseSlug}-${counter}`;
    counter += 1;
  }
}

function getFileExtension(
  file: File
): string {
  if (file.type === "image/jpeg") {
    return "jpg";
  }

  if (file.type === "image/png") {
    return "png";
  }

  if (file.type === "image/webp") {
    return "webp";
  }

  return "bin";
}

function isVercelBlobUrl(
  value: string | null
): boolean {
  if (!value) {
    return false;
  }

  try {
    const url = new URL(value);

    return (
      url.hostname.endsWith(
        ".public.blob.vercel-storage.com"
      ) ||
      url.hostname.endsWith(
        ".blob.vercel-storage.com"
      )
    );
  } catch {
    return false;
  }
}

async function safelyDeleteBlob(
  url: string | null
) {
  if (!isVercelBlobUrl(url)) {
    return;
  }

  try {
    await del(url as string);
  } catch (error) {
    console.error(
      "Blob konnte nicht gelöscht werden:",
      error
    );
  }
}

async function uploadProviderLogo(
  providerId: string,
  file: File
): Promise<string> {
  if (
    !ALLOWED_LOGO_TYPES.includes(
      file.type
    )
  ) {
    throw new Error(
      "Erlaubt sind nur JPG-, PNG- und WEBP-Dateien."
    );
  }

  if (
    file.size <= 0 ||
    file.size > MAX_LOGO_SIZE
  ) {
    throw new Error(
      "Das Firmenlogo darf maximal 4 MB gross sein."
    );
  }

  const extension =
    getFileExtension(file);

  const blob = await put(
    `provider-logos/${providerId}/logo.${extension}`,
    file,
    {
      access: "public",
      addRandomSuffix: true,
      contentType: file.type,
      cacheControlMaxAge:
        60 * 60 * 24 * 30,
    }
  );

  return blob.url;
}

export async function GET() {
  try {
    const user = await requireUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Du bist nicht angemeldet.",
        },
        {
          status: 401,
        }
      );
    }

    const provider =
      await prisma.provider.findUnique({
        where: {
          id: user.id,
        },
        select: {
          id: true,
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
      return NextResponse.json(
        {
          success: false,
          message:
            "Anbieter nicht gefunden.",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      success: true,
      provider,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message:
          "Das Profil konnte nicht geladen werden.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(
  request: NextRequest
) {
  let newLogoUrl: string | null = null;

  try {
    const user = await requireUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Du bist nicht angemeldet.",
        },
        {
          status: 401,
        }
      );
    }

    const formData =
      await request.formData();

    const companyName =
      getStringValue(
        formData,
        "companyName"
      );

    const contactName =
      getStringValue(
        formData,
        "contactName"
      );

    const phone =
      getOptionalValue(
        formData,
        "phone"
      );

    const website =
      normalizeWebsite(
        getOptionalValue(
          formData,
          "website"
        )
      );

    const description =
      getOptionalValue(
        formData,
        "description"
      );

    const address =
      getOptionalValue(
        formData,
        "address"
      );

    const postalCode =
      getOptionalValue(
        formData,
        "postalCode"
      );

    const city =
      getOptionalValue(
        formData,
        "city"
      );

    const serviceCategories =
      getStringArray(
        formData,
        "serviceCategories"
      );

    const serviceRegions =
      getStringArray(
        formData,
        "serviceRegions"
      );

    if (companyName.length < 2) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Bitte gib einen gültigen Firmennamen ein.",
        },
        {
          status: 400,
        }
      );
    }

    if (contactName.length < 2) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Bitte gib einen gültigen Ansprechpartner ein.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      description &&
      description.length > 1500
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Die Beschreibung darf maximal 1'500 Zeichen enthalten.",
        },
        {
          status: 400,
        }
      );
    }

    const currentProvider =
      await prisma.provider.findUnique({
        where: {
          id: user.id,
        },
        select: {
          logoUrl: true,
        },
      });

    if (!currentProvider) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Anbieter nicht gefunden.",
        },
        {
          status: 404,
        }
      );
    }

    const slug =
      await generateUniqueSlug(
        companyName,
        user.id
      );

    let logoUrl =
      currentProvider.logoUrl;

    const logo = formData.get("logo");

    if (
      logo instanceof File &&
      logo.size > 0
    ) {
      newLogoUrl =
        await uploadProviderLogo(
          user.id,
          logo
        );

      logoUrl = newLogoUrl;
    }

    const provider =
      await prisma.provider.update({
        where: {
          id: user.id,
        },
        data: {
          companyName,
          contactName,
          phone,
          slug,
          logoUrl,
          website,
          description,
          address,
          postalCode,
          city,
          serviceCategories,
          serviceRegions,
        },
        select: {
          id: true,
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

    if (
      newLogoUrl &&
      currentProvider.logoUrl &&
      currentProvider.logoUrl !==
        newLogoUrl
    ) {
      await safelyDeleteBlob(
        currentProvider.logoUrl
      );
    }

    return NextResponse.json({
      success: true,
      message:
        "Dein Firmenprofil wurde erfolgreich gespeichert.",
      provider,
      publicProfileUrl:
        `/anbieter/${provider.slug}`,
    });
  } catch (error) {
    if (newLogoUrl) {
      await safelyDeleteBlob(newLogoUrl);
    }

    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Das Profil konnte nicht gespeichert werden.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE() {
  try {
    const user = await requireUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Du bist nicht angemeldet.",
        },
        {
          status: 401,
        }
      );
    }

    const provider =
      await prisma.provider.findUnique({
        where: {
          id: user.id,
        },
        select: {
          logoUrl: true,
        },
      });

    if (!provider) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Anbieter nicht gefunden.",
        },
        {
          status: 404,
        }
      );
    }

    await prisma.provider.update({
      where: {
        id: user.id,
      },
      data: {
        logoUrl: null,
      },
    });

    await safelyDeleteBlob(
      provider.logoUrl
    );

    return NextResponse.json({
      success: true,
      message:
        "Das Firmenlogo wurde entfernt.",
      logoUrl: null,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message:
          "Das Firmenlogo konnte nicht entfernt werden.",
      },
      {
        status: 500,
      }
    );
  }
}