import { Language } from '@/i18n/settings';
import { BASE_URL, SITE_NAME } from '@/lib/constants';

type BreadcrumbItem = {
  name: string;
  url: string;
};

/**
 * Organization + WebSite JSON-LD — renders once in root layout.
 */
export function OrganizationJsonLd({ lng }: { lng: string }) {
  const schema = [
    {
      '@context': 'https://schema.org',
      '@type': 'NGO',
      '@id': `${BASE_URL}/#organization`,
      name: SITE_NAME,
      alternateName: 'Associação HawkStars',
      url: BASE_URL,
      logo: `${BASE_URL}/images/logo.webp`,
      description:
        lng === 'pt'
          ? 'Associação HawkStars - Educação, Inovação e Desenvolvimento em Pinhel, Portugal.'
          : 'Hawk Stars NGO — Education, Innovation and Development in Pinhel, Portugal.',
      foundingDate: '2019',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Pinhel',
        addressCountry: 'PT',
      },
      sameAs: [
        'https://www.facebook.com/hawkstarsngo',
        'https://www.instagram.com/hawkstarsngo',
        'https://www.linkedin.com/company/hawkstarsngo',
      ],
      // No `nonprofitStatus`: the schema.org enumeration is US-centric and the
      // value here was 'Nonprofit501c3', a claim of US 501(c)(3) charitable status
      // for a Portuguese association. Publishing a false machine-readable claim
      // about legal status on a site that solicits donations is a trust problem,
      // not a schema nit. Re-add only with a NonprofitType matching the actual
      // Portuguese registration.
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': `${BASE_URL}/#website`,
      url: BASE_URL,
      name: SITE_NAME,
      publisher: { '@id': `${BASE_URL}/#organization` },
      inLanguage: ['pt', 'en'],
      // No `potentialAction`: the Sitelinks Searchbox declared here pointed at
      // `/{lng}/projects?q=`, and no route in the app reads a `q` param — the
      // projects page filters on type/year only — so it resolved to an unfiltered
      // project list. `{lng}` was also an undeclared template variable, which
      // invalidates the EntryPoint on its own. Restore this when a real site
      // search exists, with every variable declared in `query-input`.
    },
  ];

  return (
    <script
      type='application/ld+json'
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }}
    />
  );
}

/**
 * Breadcrumb JSON-LD — use on inner pages.
 */
export function BreadcrumbJsonLd({ items }: { items: BreadcrumbItem[] }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type='application/ld+json'
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }}
    />
  );
}

/**
 * Generic page-level JSON-LD for WebPage type.
 */
export function WebPageJsonLd({
  title,
  description,
  url,
  lng,
}: {
  title: string;
  description: string;
  url: string;
  lng: Language;
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': url,
    url,
    name: title,
    description,
    inLanguage: lng,
    isPartOf: { '@id': `${BASE_URL}/#website` },
    about: { '@id': `${BASE_URL}/#organization` },
  };

  return (
    <script
      type='application/ld+json'
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }}
    />
  );
}

/**
 * Event JSON-LD for project / event pages.
 */
export function EventJsonLd({
  name,
  description,
  startDate,
  endDate,
  location,
  url,
  image,
}: {
  name: string;
  description: string;
  startDate: string;
  endDate?: string;
  location?: string;
  url: string;
  image?: string;
}) {
  // `location` is a required property of schema.org/Event, and Google rejects the
  // whole Event rather than degrading it. Emitting an Event without one produced
  // invalid markup on every event page; emitting a *guessed* one (this previously
  // hardcoded "Pinhel, PT" around whatever name it was given, which is wrong for
  // every international event) publishes a false claim. So when the CMS field is
  // empty we render nothing at all — no structured data is strictly better than
  // invalid or fabricated structured data.
  if (!location) return null;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name,
    description,
    startDate,
    ...(endDate && { endDate }),
    url,
    ...(image && { image }),
    location: {
      '@type': 'Place',
      name: location,
    },
    organizer: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: BASE_URL,
    },
  };

  return (
    <script
      type='application/ld+json'
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }}
    />
  );
}

/**
 * Article JSON-LD for news articles and blog posts.
 */
export function ArticleJsonLd({
  title,
  description,
  url,
  image,
  publishedAt,
  modifiedAt,
  lng,
}: {
  title: string;
  description?: string;
  url: string;
  image?: string;
  publishedAt?: string;
  modifiedAt?: string;
  lng: Language;
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: title,
    ...(description && { description }),
    url,
    ...(image && { image }),
    ...(publishedAt && { datePublished: publishedAt }),
    ...(modifiedAt && { dateModified: modifiedAt }),
    inLanguage: lng,
    isPartOf: { '@id': `${BASE_URL}/#website` },
    publisher: {
      '@type': 'Organization',
      '@id': `${BASE_URL}/#organization`,
      name: SITE_NAME,
      url: BASE_URL,
    },
    author: {
      '@type': 'Organization',
      '@id': `${BASE_URL}/#organization`,
      name: SITE_NAME,
    },
  };

  return (
    <script
      type='application/ld+json'
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }}
    />
  );
}
