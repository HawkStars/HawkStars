import type { CollectionConfig } from 'payload';
import { anyone } from '../access/anyone';
import { SocialLinksField } from '../fields/Link/SocialLink';
import { authenticated } from '../access/authenticated';
import { authenticatedAdmin } from '../access/authenticatedAdmin';
import { GROUP_LABELS } from '../constants';
import { createRevalidateHooks } from '../utilities/revalidateCollection';
import { geocodeButton } from '../fields/GeocodeButton';

export const PARTNER_CACHE_TAG = 'partners' as const;
const { afterChange: revalidatePartner, afterDelete: revalidatePartnerDelete } =
  createRevalidateHooks(PARTNER_CACHE_TAG);

export const Partner: CollectionConfig = {
  slug: 'partners',
  labels: {
    singular: { en: 'Partner', pt: 'Parceiro' },
    plural: { en: 'Partners', pt: 'Parceiros' },
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'country', 'type', 'partnership', 'createdAt'],
    description: {
      en: 'Manage national and international partner organizations. Add their logo, country, and social links. Partners are displayed on the public partners page.',
      pt: 'Gira as organizações parceiras nacionais e internacionais. Adicione o logótipo, país e links sociais. Os parceiros são exibidos na página pública de parceiros.',
    },
    group: GROUP_LABELS.erasmus,
    pagination: {
      defaultLimit: 100,
      limits: [100, 250, 1000],
    },
  },
  access: {
    admin: authenticated,
    read: anyone,
    create: authenticated,
    delete: authenticatedAdmin,
    update: authenticated,
  },
  hooks: {
    afterChange: [revalidatePartner],
    afterDelete: [revalidatePartnerDelete],
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
    {
      type: 'radio',
      name: 'partnership',
      label: { en: 'Partnership Type', pt: 'Tipo de Parceria' },
      required: true,
      defaultValue: 'local_entity',
      options: [
        { label: { en: 'Local Entity', pt: 'Entidade Local' }, value: 'local_entity' },
        {
          label: { en: 'Government Entity', pt: 'Entidade Governamental' },
          value: 'government_entity',
        },
        { label: { en: 'Erasmus + Partner', pt: 'Parceiro Erasmus +' }, value: 'erasmus_partner' },
        { label: { en: 'Other', pt: 'Outro' }, value: 'other' },
      ],
    },
    {
      type: 'group',
      name: 'location',
      label: { en: 'Map location', pt: 'Localização no mapa' },
      admin: {
        description: {
          en: 'Optional. Partners with coordinates get a pin on the partners page map; partners without them are simply not shown on the map.',
          pt: 'Opcional. Os parceiros com coordenadas aparecem com um marcador no mapa da página de parceiros; os que não as têm simplesmente não aparecem no mapa.',
        },
      },
      fields: [
        {
          type: 'text',
          name: 'address',
          label: { en: 'City / address', pt: 'Cidade / morada' },
          admin: {
            description: {
              en: 'e.g. "Pinhel, Portugal". Use "Find coordinates" to fill latitude and longitude.',
              pt: 'ex: "Pinhel, Portugal". Use o botão "Find coordinates" para preencher a latitude e a longitude.',
            },
          },
        },
        geocodeButton({ sourceField: 'address' }),
        {
          type: 'row',
          fields: [
            {
              name: 'latitude',
              label: { en: 'Latitude', pt: 'Latitude' },
              type: 'number',
              min: -90,
              max: 90,
              admin: { width: '50%', step: 0.000001 },
            },
            {
              name: 'longitude',
              label: { en: 'Longitude', pt: 'Longitude' },
              type: 'number',
              min: -180,
              max: 180,
              admin: { width: '50%', step: 0.000001 },
            },
          ],
        },
      ],
    },
    { ...SocialLinksField },
  ],
};
