import type { CollectionConfig } from 'payload';

export const Media: CollectionConfig = {
  slug: 'media',
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
    },
  ],
};
