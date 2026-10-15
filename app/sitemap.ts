import type { MetadataRoute } from "next";
import { knownHandlesForSitemap } from "@/lib/catalog";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  const pages = ["", "/range", "/field-care", "/about", "/refill-programme"];
  return [...pages, ...knownHandlesForSitemap().map((h) => `/products/${h}`)].map((path) => ({ url: `${base}${path}` }));
}
