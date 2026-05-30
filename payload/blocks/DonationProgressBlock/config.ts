import { linkGroup } from '@/payload/fields/linkGroup';
import SectionID from '@/payload/fields/SectionID';
import type { Block } from 'payload';

export const DonationProgressBlock: Block = {
  slug: 'donationProgress',
  interfaceName: 'DonationProgressBlock',
  admin: {
    group: 'CTA & Engagement',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: { en: 'Title', pt: 'Título' },
      required: true,
      localized: true,
      admin: {
        description: 'Campaign title',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: { en: 'Description', pt: 'Descrição' },
      localized: true,
      admin: {
        description: 'Brief description of the campaign',
      },
    },
    {
      name: 'goalAmount',
      type: 'number',
      label: { en: 'Goal Amount', pt: 'Valor Alvo' },
      required: true,
      admin: {
        description: 'Fundraising goal amount',
      },
    },
    {
      name: 'currentAmount',
      type: 'number',
      label: { en: 'Current Amount', pt: 'Valor Atual' },
      required: true,
      admin: {
        description: 'Current amount raised',
      },
    },
    {
      name: 'currency',
      type: 'text',
      label: { en: 'Currency', pt: 'Moeda' },
      defaultValue: '€',
      admin: {
        description: 'Currency symbol',
      },
    },
    {
      name: 'donorCount',
      type: 'number',
      label: { en: 'Donor Count', pt: 'Número de Doadores' },
      admin: {
        description: 'Number of donors (optional)',
      },
    },
    linkGroup({ overrides: { maxRows: 2 } }),
    {
      name: 'showPercentage',
      type: 'checkbox',
      label: { en: 'Show Percentage', pt: 'Mostrar Percentagem' },
      defaultValue: true,
      admin: {
        description: 'Display percentage progress',
      },
    },
    {
      name: 'animateProgress',
      type: 'checkbox',
      label: { en: 'Animate Progress', pt: 'Animar Progresso' },
      defaultValue: true,
      admin: {
        description: 'Animate progress bar on scroll',
      },
    },
    {
      name: 'theme',
      type: 'select',
      label: { en: 'Theme', pt: 'Tema' },
      options: [
        { label: { en: 'Light', pt: 'Claro' }, value: 'light' },
        { label: { en: 'Dark', pt: 'Escuro' }, value: 'dark' },
        { label: { en: 'Gradient', pt: 'Gradiente' }, value: 'gradient' },
      ],
      defaultValue: 'light',
      admin: {
        description: 'Visual theme for the block',
      },
    },
    SectionID,
  ],
  labels: {
    plural: { en: 'Donation Progress Blocks', pt: 'Blocos de Progresso de Doação' },
    singular: { en: 'Donation Progress Block', pt: 'Bloco de Progresso de Doação' },
  },
};
