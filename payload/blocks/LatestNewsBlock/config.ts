import SectionID from '@/payload/fields/SectionID';
import type { Block } from 'payload';

export const LatestNewsBlock: Block = {
  slug: 'latestNews',
  interfaceName: 'LatestNewsBlock',
  admin: {
    group: 'News & Events',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: { en: 'Title', pt: 'Título' },
      defaultValue: 'Latest News',
      localized: true,
      admin: {
        description: 'Section heading displayed above the item',
      },
    },
    {
      name: 'subtitle',
      type: 'textarea',
      label: { en: 'Subtitle', pt: 'Subtítulo' },
      localized: true,
      admin: {
        description: 'Optional section description',
      },
    },
    {
      name: 'source',
      type: 'select',
      label: { en: 'Source', pt: 'Fonte' },
      defaultValue: 'news',
      required: true,
      options: [
        { label: { en: 'News', pt: 'Notícias' }, value: 'news' },
        { label: { en: 'Hawk Projects', pt: 'Projetos Hawk' }, value: 'hawk_projects' },
      ],
      admin: {
        description: 'Choose which collection to pull the latest item from.',
      },
    },
    {
      name: 'newsType',
      type: 'select',
      label: { en: 'News Type', pt: 'Tipo de Notícia' },
      hasMany: true,
      options: [
        { label: 'Blog', value: 'blog' },
        { label: { en: 'News', pt: 'Notícia' }, value: 'news' },
        { label: { en: 'Press Release', pt: 'Comunicado de Imprensa' }, value: 'press_release' },
        { label: { en: 'Announcement', pt: 'Anúncio' }, value: 'announcement' },
        { label: { en: 'Other', pt: 'Outro' }, value: 'other' },
      ],
      admin: {
        description: 'Filter by news type. Leave empty to show the latest regardless of type.',
        condition: (_, siblingData) => siblingData?.source === 'news',
      },
    },
    {
      name: 'eventType',
      type: 'select',
      label: { en: 'Event Type', pt: 'Tipo de Evento' },
      hasMany: true,
      options: [
        { label: 'Erasmus +', value: 'erasmus' },
        { label: { en: 'Local Event', pt: 'Evento Local' }, value: 'local_event' },
        { label: { en: 'International Event', pt: 'Evento Internacional' }, value: 'international_event' },
        { label: { en: 'Other', pt: 'Outro' }, value: 'other' },
      ],
      admin: {
        description: 'Filter by event type. Leave empty to show the latest regardless of type.',
        condition: (_, siblingData) => siblingData?.source === 'hawk_projects',
      },
    },
    {
      name: 'linkLabel',
      type: 'text',
      label: { en: 'Link Label', pt: 'Rótulo do Link' },
      defaultValue: 'Read more',
      localized: true,
      admin: {
        description: 'Label for the link to the full article or event',
      },
    },
    SectionID,
  ],
  labels: {
    singular: { en: 'Latest News', pt: 'Últimas Notícias' },
    plural: { en: 'Latest News Blocks', pt: 'Blocos de Últimas Notícias' },
  },
};
