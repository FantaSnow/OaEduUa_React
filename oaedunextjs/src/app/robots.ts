import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/HomePage", "/schedule", "/news", "/volunteering"],
      disallow: ["/admin", "/AdminPanel"],
    },
    sitemap: "https://example.com/sitemap.xml",
  };
}

