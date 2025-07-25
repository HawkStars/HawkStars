import type { CollectionConfig } from 'payload';

export const Partner: CollectionConfig = {
  slug: 'partners',
  fields: [
    { type: 'text', name: 'name', label: 'Name of the partner', required: true },
    { type: 'upload', name: 'image', label: 'Image', relationTo: 'media', required: true },
  ],
};
