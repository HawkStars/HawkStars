import type { CollectionConfig } from 'payload';
import { anyone } from '../access/anyone';
import { authenticated } from '../access/authenticated';

export const Partner: CollectionConfig = {
  slug: 'partners',
  access: {
    admin: authenticated,
    read: anyone,
    create: authenticated,
    delete: authenticated,
    update: authenticated,
  },
  fields: [
    { type: 'text', name: 'name', label: 'Name of the partner', required: true },
    { type: 'upload', name: 'image', label: 'Image', relationTo: 'media', required: true },
  ],
};
