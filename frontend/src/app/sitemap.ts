import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  return [
    {
      url: new URL("/", siteUrl).toString(),
      changeFrequency: "monthly",
      priority: 1,
    },
    { url: new URL("/about", siteUrl).toString(), changeFrequency: "monthly", priority: 0.7 },
    { url: new URL("/how-it-works", siteUrl).toString(), changeFrequency: "monthly", priority: 0.8 },
    { url: new URL("/why-clientpilot", siteUrl).toString(), changeFrequency: "monthly", priority: 0.8 },
  ];
}
