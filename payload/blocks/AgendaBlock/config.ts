import SectionID from '@/payload/fields/SectionID';
import type { Block } from 'payload';

export const AgendaBlock: Block = {
  slug: 'agenda',
  interfaceName: 'AgendaBlock',
  admin: {
    group: 'News & Events',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: { en: 'Section Title', pt: 'Título da Secção' },
      localized: true,
      admin: {
        description: {
          en: 'Heading displayed above the event list',
          pt: 'Título exibido acima da lista de eventos',
        },
      },
    },
    {
      name: 'subtitle',
      type: 'textarea',
      label: { en: 'Section Subtitle', pt: 'Subtítulo da Secção' },
      localized: true,
      admin: {
        description: {
          en: 'Optional description shown below the title',
          pt: 'Descrição opcional exibida abaixo do título',
        },
      },
    },
    {
      name: 'eventType',
      type: 'select',
      label: { en: 'Event Type', pt: 'Tipo de Evento' },
      hasMany: true,
      options: [
        { label: { en: 'Local Event', pt: 'Evento Local' }, value: 'local_event' },
        {
          label: { en: 'International Event', pt: 'Evento Internacional' },
          value: 'international_event',
        },
        { label: { en: 'Other', pt: 'Outro' }, value: 'other' },
      ],
      admin: {
        description: {
          en: 'Filter by event type. Leave empty to show all upcoming events regardless of type.',
          pt: 'Filtre por tipo de evento. Deixe vazio para mostrar todos os eventos futuros independentemente do tipo.',
        },
      },
    },
    {
      name: 'maxEvents',
      type: 'number',
      label: { en: 'Maximum Events to Show', pt: 'Máximo de Eventos a Mostrar' },
      defaultValue: 5,
      admin: {
        description: {
          en: 'Maximum number of upcoming events to display (1–20)',
          pt: 'Número máximo de eventos futuros a exibir (1–20)',
        },
        step: 1,
      },
      validate: (value: number | null | undefined) => {
        if (value === null || value === undefined) return true;
        if (value < 1) return 'Must be at least 1';
        if (value > 20) return 'Cannot exceed 20';
        return true;
      },
    },
    {
      name: 'layout',
      type: 'select',
      label: { en: 'Layout', pt: 'Disposição' },
      defaultValue: 'list',
      options: [
        { label: { en: 'List (default)', pt: 'Lista (padrão)' }, value: 'list' },
        { label: { en: 'Compact', pt: 'Compacto' }, value: 'compact' },
        { label: { en: 'Cards', pt: 'Cartões' }, value: 'cards' },
      ],
      admin: {
        description: {
          en: 'Visual style for the event list',
          pt: 'Estilo visual para a lista de eventos',
        },
      },
    },
    {
      name: 'linkLabel',
      type: 'text',
      label: { en: 'Link Label', pt: 'Rótulo do Link' },
      defaultValue: 'Ver mais',
      localized: true,
      admin: {
        description: {
          en: 'Text for the "learn more" link on each event card',
          pt: 'Texto para o link "saber mais" em cada cartão de evento',
        },
      },
    },
    SectionID,
  ],
  labels: {
    plural: { en: 'Agenda Blocks', pt: 'Blocos de Agenda' },
    singular: { en: 'Agenda Block', pt: 'Bloco de Agenda' },
  },
};
