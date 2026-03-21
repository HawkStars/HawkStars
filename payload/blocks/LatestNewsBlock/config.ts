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
      defaultValue: 'Latest News',
      localized: true,
      admin: {
        description: 'Section heading displayed above the item',
      },
    },
    {
      name: 'subtitle',
      type: 'textarea',
      localized: true,
      admin: {
        description: 'Optional section description',
      },
    },
    {
      name: 'source',
      type: 'select',
      defaultValue: 'news',
      required: true,
      options: [
        { label: 'News', value: 'news' },
        { label: 'Hawk Projects', value: 'hawk_projects' },
      ],
      admin: {
        description: 'Choose which collection to pull the latest item from.',
      },
    },
    {
      name: 'newsType',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'Blog', value: 'blog' },
        { label: 'News', value: 'news' },
        { label: 'Press Release', value: 'press_release' },
        { label: 'Announcement', value: 'announcement' },
        { label: 'Other', value: 'other' },
      ],
      admin: {
        description:
          'Filter by news type. Leave empty to show the latest regardless of type.',
        condition: (_, siblingData) => siblingData?.source === 'news',
      },
    },
    {
      name: 'eventType',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'Erasmus +', value: 'erasmus' },
        { label: 'Local Event', value: 'local_event' },
        { label: 'International Event', value: 'international_event' },
        { label: 'Other', value: 'other' },
      ],
      admin: {
        description:
          'Filter by event type. Leave empty to show the latest regardless of type.',
        condition: (_, siblingData) => siblingData?.source === 'hawk_projects',
      },
    },
    {
      name: 'linkLabel',
      type: 'text',
      defaultValue: 'Read more',
      localized: true,
      admin: {
        description: 'Label for the link to the full article or event',
      },
    },
    SectionID,
  ],
  labels: {
    singular: 'Latest News',
    plural: 'Latest News Blocks',
  },
};
