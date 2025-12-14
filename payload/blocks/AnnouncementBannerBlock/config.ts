import type { Block } from 'payload';

export const AnnouncementBannerBlock: Block = {
  slug: 'announcementBanner',
  interfaceName: 'AnnouncementBannerBlock',
  fields: [
    {
      name: 'message',
      type: 'textarea',
      required: true,
    },
    {
      name: 'ctaText',
      type: 'text',
    },
    {
      name: 'ctaLink',
      type: 'text',
    },
    {
      name: 'variant',
      type: 'select',
      options: [
        { label: 'Info', value: 'info' },
        { label: 'Success', value: 'success' },
        { label: 'Warning', value: 'warning' },
        { label: 'Urgent', value: 'urgent' },
      ],
      defaultValue: 'info',
    },
    {
      name: 'dismissible',
      type: 'checkbox',
      defaultValue: true,
    },
  ],
  labels: {
    plural: 'Announcement Banners',
    singular: 'Announcement Banner',
  },
};
