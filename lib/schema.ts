import { absoluteUrl, seoConfig } from "@/lib/seo";

export type BreadcrumbSchemaItem = {
  name: string;
  path: string;
};

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${seoConfig.siteUrl}/#organization`,
    name: seoConfig.siteName,
    url: seoConfig.siteUrl,
    logo: {
      "@type": "ImageObject",
      url: `${seoConfig.siteUrl}/logo.png`,
    },
    description: seoConfig.defaultDescription,
    areaServed: {
      "@type": "Country",
      name: "Schweiz",
    },
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${seoConfig.siteUrl}/#website`,
    name: seoConfig.siteName,
    url: seoConfig.siteUrl,
    inLanguage: seoConfig.language,
    publisher: {
      "@id": `${seoConfig.siteUrl}/#organization`,
    },
  };
}

export function webPageSchema({
  name,
  description,
  path,
  dateModified,
}: {
  name: string;
  description: string;
  path: string;
  dateModified?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${absoluteUrl(path)}#webpage`,
    url: absoluteUrl(path),
    name,
    description,
    inLanguage: seoConfig.language,
    isPartOf: {
      "@id": `${seoConfig.siteUrl}/#website`,
    },
    about: {
      "@id": `${seoConfig.siteUrl}/#organization`,
    },
    ...(dateModified ? { dateModified } : {}),
  };
}

export function breadcrumbSchema(items: BreadcrumbSchemaItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function serviceSchema({
  name,
  description,
  path,
  areaServed,
  category,
}: {
  name: string;
  description: string;
  path: string;
  areaServed: string[];
  category?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${absoluteUrl(path)}#service`,
    name,
    description,
    url: absoluteUrl(path),
    serviceType: category || name,
    areaServed: areaServed.map((name) => ({
      "@type": "AdministrativeArea",
      name,
    })),
    provider: {
      "@id": `${seoConfig.siteUrl}/#organization`,
    },
  };
}

export function itemListSchema(
  name: string,
  items: Array<{ name: string; path: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      url: absoluteUrl(item.path),
    })),
  };
}
