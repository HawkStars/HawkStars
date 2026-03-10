import type { CollectionConfig } from 'payload';
import { authenticated } from '@/payload/access/authenticated';

export const Notification: CollectionConfig = {
  slug: 'notifications',
  labels: {
    singular: 'Notification',
    plural: 'Notifications',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'type', 'read', 'createdAt'],
    description: 'System notifications for admin activity tracking',
    group: 'System',
  },
  access: {
    read: authenticated,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  defaultSort: '-createdAt',
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'Short summary of what happened',
      },
    },
    {
      name: 'message',
      type: 'textarea',
      required: false,
      admin: {
        description: 'Detailed notification message',
      },
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'New Contribution', value: 'contribution_created' },
        { label: 'Contribution Confirmed', value: 'contribution_confirmed' },
        { label: 'Page Published', value: 'page_published' },
        { label: 'Page Updated', value: 'page_updated' },
        { label: 'News Published', value: 'news_published' },
        { label: 'News Updated', value: 'news_updated' },
        { label: 'Media Uploaded', value: 'media_uploaded' },
        { label: 'General', value: 'general' },
      ],
      defaultValue: 'general',
    },
    {
      name: 'read',
      type: 'checkbox',
      defaultValue: false,
      label: 'Read',
      admin: {
        description: 'Whether this notification has been read',
      },
    },
    {
      name: 'link',
      type: 'text',
      required: false,
      admin: {
        description: 'Admin panel link to the related document',
      },
    },
    {
      name: 'relatedCollection',
      type: 'text',
      required: false,
      admin: {
        description: 'The collection slug this notification refers to',
      },
    },
    {
      name: 'relatedDocId',
      type: 'text',
      required: false,
      admin: {
        description: 'The ID of the related document',
      },
    },
  ],
};
