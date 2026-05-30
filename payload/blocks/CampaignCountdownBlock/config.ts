import { linkGroup } from '@/payload/fields/linkGroup';
import SectionID from '@/payload/fields/SectionID';
import type { Block } from 'payload';

export const CampaignCountdownBlock: Block = {
  slug: 'campaignCountdown',
  interfaceName: 'CampaignCountdownBlock',
  admin: {
    group: 'CTA & Engagement',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
      admin: {
        description: { en: 'Campaign or event title', pt: 'Título da campanha ou evento' },
      },
    },
    {
      name: 'description',
      type: 'textarea',
      localized: true,
      admin: {
        description: {
          en: 'Brief description or urgency message',
          pt: 'Descrição breve ou mensagem de urgência',
        },
      },
    },
    {
      name: 'targetDate',
      type: 'date',
      label: { en: 'Target Date', pt: 'Data Alvo' },
      required: true,
      admin: {
        description: {
          en: 'Target end date for the countdown',
          pt: 'Data alvo de fim para a contagem decrescente',
        },
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    linkGroup({ overrides: { maxRows: 2 } }),
    {
      name: 'showDays',
      type: 'checkbox',
      label: { en: 'Show Days', pt: 'Mostrar Dias' },
      defaultValue: true,
    },
    {
      name: 'showHours',
      type: 'checkbox',
      label: { en: 'Show Hours', pt: 'Mostrar Horas' },
      defaultValue: true,
    },
    {
      name: 'showMinutes',
      type: 'checkbox',
      label: { en: 'Show Minutes', pt: 'Mostrar Minutos' },
      defaultValue: true,
    },
    {
      name: 'showSeconds',
      type: 'checkbox',
      label: { en: 'Show Seconds', pt: 'Mostrar Segundos' },
      defaultValue: true,
    },
    {
      name: 'theme',
      type: 'select',
      label: { en: 'Theme', pt: 'Tema' },
      options: [
        { label: { en: 'Light', pt: 'Claro' }, value: 'light' },
        { label: { en: 'Dark', pt: 'Escuro' }, value: 'dark' },
        { label: { en: 'Urgent (Red)', pt: 'Urgente (Vermelho)' }, value: 'urgent' },
      ],
      defaultValue: 'light',
      admin: {
        description: { en: 'Visual theme', pt: 'Tema visual' },
      },
    },
    {
      name: 'completedMessage',
      type: 'text',
      label: { en: 'Completed Message', pt: 'Mensagem de Conclusão' },
      defaultValue: 'Campaign Ended',
      localized: true,
      admin: {
        description: {
          en: 'Message to show when countdown reaches zero',
          pt: 'Mensagem a mostrar quando a contagem chega a zero',
        },
      },
    },
    SectionID,
  ],
  labels: {
    plural: { en: 'Campaign Countdowns', pt: 'Contagens Decrescentes de Campanha' },
    singular: { en: 'Campaign Countdown', pt: 'Contagem Decrescente de Campanha' },
  },
};
