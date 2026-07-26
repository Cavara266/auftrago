import type { Metadata } from "next";

export const seoConfig = {
  siteName: "Auftrago",
  siteUrl: "https://www.auftrago.ch",
  locale: "de_CH",
  language: "de-CH",
  defaultOgImage: "https://www.auftrago.ch/opengraph-image",
  titleTemplate: "%s | Auftrago",
  defaultDescription:
    "Kostenlos regionale Anbieter für Reinigung, Umzug, Hauswartung, Handwerk, Gartenpflege und weitere Dienstleistungen in der Schweiz vergleichen.",
} as const;

export type SeoPageType =
  | "website"
  | "service"
  | "city"
  | "region"
  | "article";

export type SeoInput = {
  title: string;
  description: string;
  path?: string;
  keywords?: string[];
  image?: string;
  type?: SeoPageType;
  noindex?: boolean;
  nofollow?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
};

export function normalizePath(path = "/") {
  if (!path || path === "/") return "/";
  return `/${path.replace(/^\/+|\/+$/g, "")}`;
}

export function absoluteUrl(path = "/") {
  const normalizedPath = normalizePath(path);
  return normalizedPath === "/"
    ? seoConfig.siteUrl
    : `${seoConfig.siteUrl}${normalizedPath}`;
}

export function cleanText(value: string, maxLength?: number) {
  const text = value.replace(/\s+/g, " ").trim();

  if (!maxLength || text.length <= maxLength) return text;

  const shortened = text.slice(0, Math.max(0, maxLength - 1));
  const lastSpace = shortened.lastIndexOf(" ");

  return `${shortened.slice(0, lastSpace > 0 ? lastSpace : shortened.length)}…`;
}

export function createSeoMetadata({
  title,
  description,
  path = "/",
  keywords = [],
  image = seoConfig.defaultOgImage,
  type = "website",
  noindex = false,
  nofollow = false,
  publishedTime,
  modifiedTime,
  authors = [],
}: SeoInput): Metadata {
  const canonical = absoluteUrl(path);
  const safeTitle = cleanText(title, 65);
  const safeDescription = cleanText(description, 165);

  const metadata: Metadata = {
    metadataBase: new URL(seoConfig.siteUrl),
    title: safeTitle,
    description: safeDescription,
    applicationName: seoConfig.siteName,
    category: "Dienstleistungen",
    keywords: [...new Set(keywords.filter(Boolean))],
    alternates: {
      canonical,
      languages: {
        "de-CH": canonical,
        "x-default": canonical,
      },
    },
    robots: {
      index: !noindex,
      follow: !nofollow,
      googleBot: {
        index: !noindex,
        follow: !nofollow,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    openGraph: {
      title: safeTitle,
      description: safeDescription,
      url: canonical,
      siteName: seoConfig.siteName,
      locale: seoConfig.locale,
      type: type === "article" ? "article" : "website",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: safeTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: safeTitle,
      description: safeDescription,
      images: [image],
    },
  };

  if (type === "article") {
    metadata.openGraph = {
      ...metadata.openGraph,
      type: "article",
      publishedTime,
      modifiedTime,
      authors,
    };
  }

  return metadata;
}

export function serviceCityTitle(service: string, city: string) {
  return `${service} in ${city} – Anbieter & Offerten`;
}

export function serviceCityDescription(service: string, city: string) {
  return `Finde regionale Anbieter für ${service} in ${city}. Auftrag kostenlos beschreiben, Firmen vergleichen und unverbindliche Offerten erhalten.`;
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
