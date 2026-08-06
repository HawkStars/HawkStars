import { MetadataRoute } from 'next';
import { languages } from '@/i18n/settings';
import { routes } from '@/utils/paths';
import { getPayloadConfig } from '@/lib/payload/server';
import { BASE_URL } from '@/lib/constants';

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

    // These six finds are all independent, and the sitemap only ever reads
    // `slug`/`updatedAt` off any of them — running them sequentially at the
    // default depth (2) meant six round-trips (uncached, on every request)
    // each pulling relationships nothing here uses. `Promise.all` +
    // `depth: 0` + `select` fixes both.
    const publishedWhere = { _status: { equals: 'published' as const } };
    const slugSelect = { slug: true, updatedAt: true } as const;

    const [pages, artworks, curators, projects, news, events] = await Promise.all([
      payload.find({
        collection: 'pages',
        draft: false,
        limit: 1000,
        depth: 0,
        select: slugSelect,
      }),
      payload.find({
        collection: 'artworks',
        limit: 1000,
        where: publishedWhere,
        depth: 0,
        select: slugSelect,
      }),
      payload.find({
        collection: 'curators',
        limit: 1000,
        where: publishedWhere,
        depth: 0,
        select: slugSelect,
      }),
      payload.find({
        collection: 'hawk_projects',
        limit: 1000,
        where: publishedWhere,
        depth: 0,
        select: slugSelect,
      }),
      payload.find({
        collection: 'news',
        limit: 1000,
        where: publishedWhere,
        depth: 0,
        select: slugSelect,
      }),
      payload.find({
        collection: 'hawk_events',
        limit: 1000,
        where: publishedWhere,
        depth: 0,
        select: slugSelect,
      }),
    ]);

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

    for (const newsItem of news.docs) {
      for (const language of languages) {
        // News items are accessible via /news/[slug]
        sitemapRoutes.push({
          url: `${BASE_URL}/${language}/news/${newsItem.slug}`,
          priority: 0.6,
          lastModified: newsItem.updatedAt ? new Date(newsItem.updatedAt) : new Date(),
          changeFrequency: 'weekly',
        });
      }
    }

    for (const event of events.docs) {
      for (const language of languages) {
        // Events are accessible via /events/[slug]
        sitemapRoutes.push({
          url: `${BASE_URL}/${language}/events/${event.slug}`,
          priority: 0.6,
          lastModified: event.updatedAt ? new Date(event.updatedAt) : new Date(),
          changeFrequency: 'weekly',
        });
      }
    }
  } catch (error) {
    console.error('Error generating dynamic sitemap entries:', error);
  }

  return sitemapRoutes;
}
