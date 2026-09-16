import * as Sentry from '@sentry/nextjs';
import { MetadataRoute } from 'next';
import { languages } from '@/i18n/settings';
import { routes } from '@/utils/paths';
import { getPayloadConfig } from '@/lib/payload/server';
import { BASE_URL } from '@/lib/constants';
import { cacheLife, cacheTag } from 'next/cache';
import { NEWS_CACHE_TAG } from '@/payload/collections/News';
import { HAWK_PROJECT_CACHE_TAG } from '@/payload/collections/HawkProject';
import { HAWK_EVENT_CACHE_TAG } from '@/payload/collections/HawkEvent';
import { ART_COLLECTION_CACHE_TAG } from '@/payload/collections/ArtCollection';
import { CURATOR_CACHE_TAG } from '@/payload/collections/Curator';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return buildSitemap();
}

// Bots hit /sitemap.xml often and this ran six 1,000-document finds each time. Tagged
// with every collection it reads, so publishing still updates it immediately.
async function buildSitemap(): Promise<MetadataRoute.Sitemap> {
  'use cache';
  cacheLife('hours');
  cacheTag(
    'pages',
    NEWS_CACHE_TAG,
    HAWK_PROJECT_CACHE_TAG,
    HAWK_EVENT_CACHE_TAG,
    ART_COLLECTION_CACHE_TAG,
    CURATOR_CACHE_TAG
  );

  const sitemapRoutes = [] as MetadataRoute.Sitemap;

  // Add static routes
  for (const route of routes) {
    for (const language of languages) {
      sitemapRoutes.push({
        // `route.url` is '/' for the home route, which produced `/pt/` — and
        // Next's default `trailingSlash: false` 308-redirects that to `/pt`, so
        // the sitemap advertised a redirect. Strip the trailing slash.
        url: `${BASE_URL}/${language}${route.url === '/' ? '' : route.url}`,
        priority: route.priority,
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
    // Only `pages`, `news` and `hawk_projects` enable `versions.drafts`, so only
    // those documents carry `_status`. Applying this filter to a collection
    // without drafts matches nothing — which silently dropped every artwork,
    // curator and event from the sitemap.
    const publishedWhere = { _status: { equals: 'published' as const } };
    const slugSelect = { slug: true, updatedAt: true } as const;

    const [pages, artworks, curators, projects, news, events] = await Promise.all([
      payload.find({
        collection: 'pages',
        draft: false,
        limit: 1000,
        where: publishedWhere,
        depth: 0,
        select: slugSelect,
      }),
      payload.find({
        collection: 'artworks',
        draft: false,
        limit: 1000,
        depth: 0,
        select: slugSelect,
      }),
      payload.find({
        collection: 'curators',
        draft: false,
        limit: 1000,
        depth: 0,
        select: slugSelect,
      }),
      payload.find({
        collection: 'hawk_projects',
        draft: false,
        limit: 1000,
        where: publishedWhere,
        depth: 0,
        select: slugSelect,
      }),
      payload.find({
        collection: 'news',
        draft: false,
        limit: 1000,
        where: publishedWhere,
        depth: 0,
        select: slugSelect,
      }),
      payload.find({
        collection: 'hawk_events',
        draft: false,
        limit: 1000,
        depth: 0,
        select: slugSelect,
      }),
    ]);

    for (const page of pages.docs) {
      for (const language of languages) {
        sitemapRoutes.push({
          url: `${BASE_URL}/${language}/${page.slug}`,
          priority: 0.7,
          // No `new Date()` fallback: it is read inside this function's `'use cache'`
          // scope, so it freezes into the entry (and can trip Next's prerender
          // bail-out). An absent lastModified is better than a frozen one.
          ...(page.updatedAt ? { lastModified: new Date(page.updatedAt) } : {}),
          changeFrequency: 'weekly',
        });
      }
    }

    for (const artwork of artworks.docs) {
      for (const language of languages) {
        sitemapRoutes.push({
          url: `${BASE_URL}/${language}/artwork/${artwork.slug}`,
          priority: 0.6,
          ...(artwork.updatedAt ? { lastModified: new Date(artwork.updatedAt) } : {}),
          changeFrequency: 'weekly',
        });
      }
    }

    for (const curator of curators.docs) {
      for (const language of languages) {
        sitemapRoutes.push({
          url: `${BASE_URL}/${language}/curator/${curator.slug}`,
          priority: 0.6,
          ...(curator.updatedAt ? { lastModified: new Date(curator.updatedAt) } : {}),
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
          ...(project.updatedAt ? { lastModified: new Date(project.updatedAt) } : {}),
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
          ...(newsItem.updatedAt ? { lastModified: new Date(newsItem.updatedAt) } : {}),
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
          ...(event.updatedAt ? { lastModified: new Date(event.updatedAt) } : {}),
          changeFrequency: 'weekly',
        });
      }
    }
  } catch (error) {
    Sentry.captureException(error);
  }

  return sitemapRoutes;
}
