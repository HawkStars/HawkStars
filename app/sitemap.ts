import { MetadataRoute } from 'next';
import { languages } from '@/i18n/settings';
import { routes } from '@/utils/paths';
import { getPayloadConfig } from '@/lib/payload/server';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://hawkstars.org';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const sitemapRoutes = [] as MetadataRoute.Sitemap;

  // Add static routes
  for (const route of routes) {
    for (const language of languages) {
      sitemapRoutes.push({
        url: `${BASE_URL}/${language}${route.url}`,
        priority: route.priority,
        lastModified: new Date(),
        changeFrequency: 'monthly',
      });
    }
  }

  try {
    const payload = await getPayloadConfig();

    // Add dynamic Pages collection routes (custom pages with slugs)
    const pages = await payload.find({
      collection: 'pages',
      where: { visible: { equals: true } },
      limit: 1000,
    });

    for (const page of pages.docs) {
      for (const language of languages) {
        sitemapRoutes.push({
          url: `${BASE_URL}/${language}/${page.slug}`,
          priority: 0.7,
          lastModified: page.updatedAt ? new Date(page.updatedAt) : new Date(),
          changeFrequency: 'weekly',
        });
      }
    }

    // Add Artwork routes
    const artworks = await payload.find({
      collection: 'artworks',
      limit: 1000,
    });

    for (const artwork of artworks.docs) {
      for (const language of languages) {
        sitemapRoutes.push({
          url: `${BASE_URL}/${language}/artwork/${artwork.slug}`,
          priority: 0.6,
          lastModified: artwork.updatedAt ? new Date(artwork.updatedAt) : new Date(),
          changeFrequency: 'weekly',
        });
      }
    }

    // Add Curator routes
    const curators = await payload.find({
      collection: 'curators',
      limit: 1000,
    });

    for (const curator of curators.docs) {
      for (const language of languages) {
        sitemapRoutes.push({
          url: `${BASE_URL}/${language}/curator/${curator.slug}`,
          priority: 0.6,
          lastModified: curator.updatedAt ? new Date(curator.updatedAt) : new Date(),
          changeFrequency: 'monthly',
        });
      }
    }

    // Add HawkProject routes (projects/news)
    const projects = await payload.find({
      collection: 'hawk_projects',
      limit: 1000,
    });

    for (const project of projects.docs) {
      for (const language of languages) {
        // Projects are accessible via /projects/[slug]
        sitemapRoutes.push({
          url: `${BASE_URL}/${language}/projects/${project.slug}`,
          priority: 0.7,
          lastModified: project.updatedAt ? new Date(project.updatedAt) : new Date(),
          changeFrequency: 'weekly',
        });
      }
    }
  } catch (error) {
    console.error('Error generating dynamic sitemap entries:', error);
  }

  return sitemapRoutes;
}
