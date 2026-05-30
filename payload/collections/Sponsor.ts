import type { CollectionConfig } from 'payload';
import { anyone } from '../access/anyone';
import { authenticatedEditor } from '../access/authenticatedEditor';
import { authenticatedAdmin } from '../access/authenticatedAdmin';

export const Sponsor: CollectionConfig = {
  slug: 'sponsors',
  labels: {
    singular: { en: 'Sponsor', pt: 'Patrocinador' },
    plural: { en: 'Sponsors', pt: 'Patrocinadores' },
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
      label: { en: 'Sponsor Name', pt: 'Nome do Patrocinador' },
      required: true,
    },
    {
      type: 'upload',
      name: 'logo',
      label: { en: 'Logo', pt: 'Logótipo' },
      relationTo: 'media',
      required: true,
    },
    {
      type: 'text',
      name: 'website',
      label: { en: 'Website URL', pt: 'URL do Website' },
      admin: {
        description: 'External link to the sponsor website',
      },
    },
    {
      type: 'select',
      name: 'tier',
      label: { en: 'Sponsor Tier', pt: 'Nível do Patrocinador' },
      required: true,
      defaultValue: 'bronze',
      options: [
        { label: { en: 'Exclusive', pt: 'Exclusivo' }, value: 'exclusive' },
        { label: { en: 'Diamond', pt: 'Diamante' }, value: 'diamond' },
        { label: { en: 'Platinum', pt: 'Platina' }, value: 'platinum' },
        { label: { en: 'Gold', pt: 'Ouro' }, value: 'gold' },
        { label: { en: 'Silver', pt: 'Prata' }, value: 'silver' },
        { label: { en: 'Bronze', pt: 'Bronze' }, value: 'bronze' },
      ],
    },
  ],
};
