import type { MetadataRoute } from "next";

import { seoConfig } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin/",
          "/api/",
          "/dashboard/",
          "/portal/",
          "/login",
          "/register",
          "/credits/",
          "/checkout/",
          "/*?*sort=",
          "/*?*filter=",
          "/*?*page=",
          "/*?*query=",
        ],
      },
    ],
    sitemap: `${seoConfig.siteUrl}/sitemap.xml`,
    host: seoConfig.siteUrl,
  };
}
