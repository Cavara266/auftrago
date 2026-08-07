import type { MetadataRoute } from "next";

const BASE_URL = "https://www.auftrago.ch";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    sitemap: [
      `${BASE_URL}/sitemap.xml`,
      `${BASE_URL}/sitemap-index.xml`,
    ],
    host: BASE_URL,
  };
}
