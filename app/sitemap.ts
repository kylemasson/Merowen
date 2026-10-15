import type { MetadataRoute } from "next";
import { fallbackPostings, rangeItems } from "@/lib/fallback";
import { careLine } from "@/lib/fieldcare";

const base = (process.env.SITE_URL || "https://merowen.com").replace(/\/$/, "");

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const products = [
    ...fallbackPostings.map((p) => p.handle),
    ...rangeItems.map((r) => r.handle),
    ...careLine.map((c) => c.handle),
  ];
  return [
    { url: `${base}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    ...["/range", "/field-care", "/about", "/refill-programme"].map((path) => ({
      url: `${base}${path}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...products.map((h) => ({ url: `${base}/products/${h}`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.7 })),
  ];
}
