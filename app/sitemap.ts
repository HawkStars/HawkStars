import { MetadataRoute } from 'next';
import { languages } from '@/i18n/settings';
import { routes } from '@/utils/paths';

export default function sitemap(): MetadataRoute.Sitemap {
  const sitemapRoutes = [] as MetadataRoute.Sitemap;

  for (let route of routes) {
    for (let language of languages) {
      sitemapRoutes.push({
        url: `${process.env.NEXT_PUBLIC_APP_URL}/${language}${route.url}`,
        priority: route.priority,
        lastModified: new Date(),
        changeFrequency: 'monthly',
      });
    }
  }

  return sitemapRoutes;
}
