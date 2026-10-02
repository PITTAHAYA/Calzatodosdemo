import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/utils";

export default function robots(): MetadataRoute.Robots {
  const base = siteUrl();
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // El panel no debe aparecer en Google.
      disallow: ["/admin"],
    },
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
