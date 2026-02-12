import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/business/", "/provider/", "/settings", "/api/"],
    },
    sitemap: "https://hasio.xyz/sitemap.xml",
  };
}
