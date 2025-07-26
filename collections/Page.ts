import type { CollectionConfig } from 'payload';

export const Page: CollectionConfig = {
  slug: 'pages',
  admin: {
    preview: ({ slug }) => `${process.env.NEXT_PUBLIC_APP_URL}/${slug}`,
  },
  fields: [
    {
      name: 'slug',
      type: 'text',
      unique: true,
      admin: {
        description: 'This will be used in the URL of the page.',
      },
    },
    { name: 'page_content', type: 'richText', localized: true },
  ],
};
