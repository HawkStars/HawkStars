import { MetadataRoute } from 'next';
import { languages } from '@/i18n/settings';
import { routes } from '@/utils/paths';

export default function sitemap(): MetadataRoute.Sitemap {
  const sitemapRoutes = [] as MetadataRoute.Sitemap;

  for (const route of routes) {
    for (const language of languages) {
      sitemapRoutes.push({
        url: `/${language}${route.url}`,
        priority: route.priority,
        lastModified: new Date(),
        changeFrequency: 'monthly',
      });
    }
  }

  return sitemapRoutes;
}
