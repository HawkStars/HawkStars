import type { CollectionConfig } from 'payload';
import { anyone } from '../access/anyone';
import { SocialLinksField } from '../fields/Link/SocialLink';
import { authenticatedEditor } from '../access/authenticatedEditor';
import { authenticatedAdmin } from '../access/authenticatedAdmin';

export const Partner: CollectionConfig = {
  slug: 'partners',
  labels: {
    singular: { en: 'Partner', pt: 'Parceiro' },
    plural: { en: 'Partners', pt: 'Parceiros' },
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'country', 'type'],
    description: {
      en: 'Manage national and international partner organizations. Add their logo, country, and social links. Partners are displayed on the public partners page.',
      pt: 'Gira as organizações parceiras nacionais e internacionais. Adicione o logótipo, país e links sociais. Os parceiros são exibidos na página pública de parceiros.',
    },
    group: {
      name: 'Erasmus',
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
      label: { en: 'Name of the partner', pt: 'Nome do Parceiro' },
      required: true,
    },
    { type: 'richText', name: 'description', label: { en: 'Description', pt: 'Descrição' } },
    { type: 'upload', name: 'logo', label: { en: 'Logo', pt: 'Logótipo' }, relationTo: 'media' },
    { type: 'text', name: 'country', label: { en: 'Country', pt: 'País' }, required: true },
    {
      type: 'radio',
      name: 'type',
      label: { en: 'Partner Type', pt: 'Tipo de Parceiro' },
      required: true,
      options: [
        { label: { en: 'National', pt: 'Nacional' }, value: 'national' },
        { label: { en: 'International', pt: 'Internacional' }, value: 'international' },
      ],
    },
    { ...SocialLinksField },
  ],
};
