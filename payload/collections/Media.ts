import type { CollectionConfig } from 'payload';

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    description:
      'Upload and manage media assets such as images used throughout the website. Use a image compression tool to optimize images before uploading to improve performance. Ideally in webP',
  },
  upload: {
    staticDir: 'media',
    mimeTypes: ['image/*'],
    disableLocalStorage: true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      admin: {
        description: 'Alternative text for the media item, used for accessibility.',
      },
    },
  ],
};
