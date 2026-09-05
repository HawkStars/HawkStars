import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: [
          '*',
          'GPTBot',
          'ClaudeBot',
          'Google-Extended',
          'PerplexityBot',
          'cohere-ai',
          'FacebookBot',
          'Bingbot',
          'CCBot',
        ],
        allow: '/',
        disallow: ['/admin', '/api', '/*/preview/'],
      },
    ],
    sitemap: 'https://hawkstars.org/sitemap.xml',
  };
}
