import SectionID from '@/payload/fields/SectionID';
import type { Block } from 'payload';

export const SponsorsBlock: Block = {
  slug: 'sponsorsBlock',
  interfaceName: 'SponsorsBlock',
  admin: {
    group: 'Organization',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      defaultValue: 'Our Sponsors',
      localized: true,
      label: { en: 'Title', pt: 'Título' },
      admin: {
        description: {
          en: 'Section heading displayed above the sponsors grid',
          pt: 'Título da secção exibido acima da grelha de patrocinadores',
        },
      },
    },
    {
      name: 'subtitle',
      type: 'textarea',
      localized: true,
      label: { en: 'Subtitle', pt: 'Subtítulo' },
      admin: {
        description: { en: 'Optional section description', pt: 'Descrição opcional da secção' },
      },
    },
    {
      name: 'tier',
      type: 'select',
      hasMany: true,
      label: { en: 'Tier', pt: 'Nível' },
      options: [
        { label: { en: 'Gold', pt: 'Ouro' }, value: 'gold' },
        { label: { en: 'Silver', pt: 'Prata' }, value: 'silver' },
        { label: 'Bronze', value: 'bronze' },
      ],
      admin: {
        description: {
          en: 'Filter by sponsor tier. Leave empty to show all sponsors.',
          pt: 'Filtre por nível de patrocinador. Deixe vazio para mostrar todos os patrocinadores.',
        },
      },
    },
    {
      name: 'limit',
      type: 'number',
      defaultValue: 12,
      min: 1,
      max: 50,
      label: { en: 'Limit', pt: 'Limite' },
      admin: {
        description: {
          en: 'Maximum number of sponsors to display',
          pt: 'Número máximo de patrocinadores a exibir',
        },
      },
    },
    SectionID,
  ],
  labels: {
    singular: { en: 'Sponsors Block', pt: 'Bloco de Patrocinadores' },
    plural: { en: 'Sponsors Blocks', pt: 'Blocos de Patrocinadores' },
  },
};
