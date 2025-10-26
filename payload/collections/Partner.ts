import type { CollectionConfig } from 'payload';
import { anyone } from '../access/anyone';
import { authenticated } from '../access/authenticated';
import { SocialLinksField } from '../fields/SocialLink';

export const Partner: CollectionConfig = {
  slug: 'partners',
  labels: {
    singular: 'Partner',
    plural: 'Partners',
  },
  admin: { useAsTitle: 'name', defaultColumns: ['name', 'description'] },
  access: {
    admin: authenticated,
    read: anyone,
    create: authenticated,
    delete: authenticated,
    update: authenticated,
  },
  fields: [
    { type: 'text', name: 'name', label: 'Name of the partner', required: true },
    { type: 'textarea', name: 'description', label: 'Description' },
    { type: 'upload', name: 'logo', label: 'Logo', relationTo: 'media' },
    { ...SocialLinksField },
  ],
};
