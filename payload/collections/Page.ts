import type { CollectionConfig, Tab } from 'payload';
import { SEOTab } from '../fields/objects/SeoFields';

const PageDetailsTab: Tab = {
  label: 'Details',
  description: 'Information about the page',
  fields: [
    { name: 'title', label: 'Title', type: 'text', required: true, localized: true },
    {
      name: 'slug',
      label: 'Slug',
      type: 'text',
      unique: true,
      required: true,
      hooks: {
        beforeChange: [({ data }) => data?.title?.replace(/\s+/g, '-').toLowerCase()],
      },
    },
    { name: 'page_content', label: 'Page Content', type: 'richText', localized: true },
  ],
};

export const Page: CollectionConfig = {
  slug: 'pages',
  admin: {
    preview: ({ slug }) => `${process.env.NEXT_PUBLIC_APP_URL}/${slug}`,
  },
  fields: [
    {
      type: 'tabs',
      label: 'Page Details',
      tabs: [PageDetailsTab, SEOTab],
    },
  ],
};
