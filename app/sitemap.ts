import { MetadataRoute } from "next";
import { generateSlugs } from "@/lib/seo-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://auftrago.ch";

  // Static pages
  const staticPages = [
    "",
    "/anbieter",
    "/offerte-anfragen",
    "/leistungen",
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    priority: 1,
  }));

  // SEO Pages (DEINE 500+ SEITEN)
  const seoPages = generateSlugs().map((slug) => ({
    url: `${baseUrl}/${slug}`,
    priority: 0.8,
  }));

  return [...staticPages, ...seoPages];
}