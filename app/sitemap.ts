import { MetadataRoute } from "next";
import { getAllSeoSlugs } from "@/lib/seo-data";

function getBaseUrl() {
  return process.env.NEXT_PUBLIC_APP_URL?.replace(/\/+$/, "") || "https://auftrago.ch";
}

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getBaseUrl();

  const staticPages = [
    "",
    "/anfrage",
    "/partner",
    "/register",
    "/login",
    "/preise",
    "/credits",
    "/leistungen",
  ];

  const staticEntries: MetadataRoute.Sitemap = staticPages.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.8,
  }));

  const seoEntries: MetadataRoute.Sitemap = getAllSeoSlugs().map((slug) => ({
    url: `${baseUrl}/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  return [...staticEntries, ...seoEntries];
}