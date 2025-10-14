// app/sitemap.ts
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://westlawai.com";
  const now = new Date();
  return [
    { url: `${base}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/draft`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/analyze`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/signup`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/signin`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];
}
