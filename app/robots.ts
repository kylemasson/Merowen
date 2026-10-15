import type { MetadataRoute } from "next";

const base = (process.env.SITE_URL || "https://merowen.com").replace(/\/$/, "");

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/cart"] },
    sitemap: `${base}/sitemap.xml`,
  };
}
