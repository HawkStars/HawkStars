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
        description: { en: 'Campaign title', pt: 'Título da campanha' },
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: { en: 'Description', pt: 'Descrição' },
      localized: true,
      admin: {
        description: { en: 'Brief description of the campaign', pt: 'Descrição breve da campanha' },
      },
    },
    {
      name: 'goalAmount',
      type: 'number',
      label: { en: 'Goal Amount', pt: 'Valor Alvo' },
      required: true,
      admin: {
        description: { en: 'Fundraising goal amount', pt: 'Valor alvo de angariação' },
      },
    },
    {
      name: 'currentAmount',
      type: 'number',
      label: { en: 'Current Amount', pt: 'Valor Atual' },
      required: true,
      admin: {
        description: { en: 'Current amount raised', pt: 'Valor atual angariado' },
      },
    },
    {
      name: 'currency',
      type: 'text',
      label: { en: 'Currency', pt: 'Moeda' },
      defaultValue: '€',
      admin: {
        description: { en: 'Currency symbol', pt: 'Símbolo de moeda' },
      },
    },
    {
      name: 'donorCount',
      type: 'number',
      label: { en: 'Donor Count', pt: 'Número de Doadores' },
      admin: {
        description: { en: 'Number of donors (optional)', pt: 'Número de doadores (opcional)' },
      },
    },
    linkGroup({ overrides: { maxRows: 2 } }),
    {
      name: 'showPercentage',
      type: 'checkbox',
      label: { en: 'Show Percentage', pt: 'Mostrar Percentagem' },
      defaultValue: true,
      admin: {
        description: { en: 'Display percentage progress', pt: 'Exibir progresso em percentagem' },
      },
    },
    {
      name: 'animateProgress',
      type: 'checkbox',
      label: { en: 'Animate Progress', pt: 'Animar Progresso' },
      defaultValue: true,
      admin: {
        description: {
          en: 'Animate progress bar on scroll',
          pt: 'Animar a barra de progresso ao fazer scroll',
        },
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
        description: { en: 'Visual theme for the block', pt: 'Tema visual para o bloco' },
      },
    },
    SectionID,
  ],
  labels: {
    plural: { en: 'Donation Progress Blocks', pt: 'Blocos de Progresso de Doação' },
    singular: { en: 'Donation Progress Block', pt: 'Bloco de Progresso de Doação' },
  },
};
