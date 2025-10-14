import type { MetadataRoute } from 'next';

const BASE = process.env.NEXT_PUBLIC_BASE_URL || 'https://westlawai.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString();
  const urls = ['/', '/pricing', '/draft', '/signin', '/signup', '/ensemble', '/privacy', '/terms'];
  return urls.map((p) => ({
    url: `${BASE}${p}`,
    lastModified: now,
    changeFrequency: p === '/' ? 'daily' : 'weekly',
    priority: p === '/' ? 1 : 0.6,
  }));
}
