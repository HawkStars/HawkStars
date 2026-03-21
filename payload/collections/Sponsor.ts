import type { CollectionConfig } from 'payload';
import { anyone } from '../access/anyone';
import { authenticatedEditor } from '../access/authenticatedEditor';
import { authenticatedAdmin } from '../access/authenticatedAdmin';

export const Sponsor: CollectionConfig = {
  slug: 'sponsors',
  labels: {
    singular: 'Sponsor',
    plural: 'Sponsors',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'tier', 'website'],
    description:
      'Manage sponsors and their branding. Sponsors are displayed on the website through the Sponsors block.',
    group: {
      name: 'Organization',
    },
  },
  access: {
    admin: authenticatedEditor,
    read: anyone,
    create: authenticatedEditor,
    delete: authenticatedAdmin,
    update: authenticatedEditor,
  },
  fields: [
    {
      type: 'text',
      name: 'name',
      label: 'Sponsor Name',
      required: true,
    },
    {
      type: 'upload',
      name: 'logo',
      label: 'Logo',
      relationTo: 'media',
      required: true,
    },
    {
      type: 'text',
      name: 'website',
      label: 'Website URL',
      admin: {
        description: 'External link to the sponsor website',
      },
    },
    {
      type: 'select',
      name: 'tier',
      label: 'Sponsor Tier',
      required: true,
      defaultValue: 'bronze',
      options: [
        { label: 'Gold', value: 'gold' },
        { label: 'Silver', value: 'silver' },
        { label: 'Bronze', value: 'bronze' },
      ],
    },
  ],
};
