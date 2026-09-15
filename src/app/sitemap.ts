import type { MetadataRoute } from "next";
import { subscriptions } from "@/lib/catalog";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/menu", "/plans", "/thali", "/trial", "/subscribe", "/shop", "/about", "/contact", "/faq", "/delivery-areas", "/terms", "/privacy-policy"];
  return [
    ...pages.map((p) => ({ url: `${site.url}${p}`, changeFrequency: p === "/menu" ? ("weekly" as const) : ("monthly" as const), priority: p === "" ? 1 : 0.7 })),
    ...subscriptions.map((p) => ({ url: `${site.url}/product/${p.slug}`, changeFrequency: "monthly" as const, priority: 0.8 })),
  ];
}
