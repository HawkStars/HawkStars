import type { CollectionConfig } from 'payload';
import { anyone } from '../access/anyone';
import { SocialLinksField } from '../fields/Link/SocialLink';
import { authenticatedEditor } from '../access/authenticatedEditor';
import { authenticatedAdmin } from '../access/authenticatedAdmin';

export const Partner: CollectionConfig = {
  slug: 'partners',
  labels: {
    singular: 'Partner',
    plural: 'Partners',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'country', 'type'],
    description:
      'Manage national and international partner organizations. Add their logo, country, and social links. Partners are displayed on the public partners page.',
  },
  access: {
    admin: authenticatedEditor,
    read: anyone,
    create: authenticatedEditor,
    delete: authenticatedAdmin,
    update: authenticatedEditor,
  },
  fields: [
    { type: 'text', name: 'name', label: 'Name of the partner', required: true },
    { type: 'richText', name: 'description', label: 'Description' },
    { type: 'upload', name: 'logo', label: 'Logo', relationTo: 'media' },
    { type: 'text', name: 'country', label: 'Country', required: true },
    {
      type: 'radio',
      name: 'type',
      label: 'Partner Type',
      required: true,
      options: [
        { label: 'National', value: 'national' },
        { label: 'International', value: 'international' },
      ],
    },
    { ...SocialLinksField },
  ],
};
