import type { CollectionConfig } from 'payload';
import { authenticated } from '@/payload/access/authenticated';
import { authenticatedAdmin } from '@/payload/access/authenticatedAdmin';

export const Notification: CollectionConfig = {
  slug: 'notifications',
  labels: {
    singular: 'Notification',
    plural: 'Notifications',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'situation', 'read', 'createdAt'],
    description: 'System notifications for admin activity tracking',
    group: 'System',
  },
  access: {
    read: authenticated,
    create: authenticatedAdmin,
    update: authenticatedAdmin,
    delete: authenticatedAdmin,
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
      name: 'situation',
      type: 'select',
      required: true,
      options: [
        { label: 'Creation', value: 'create' },
        { label: 'Update', value: 'update' },
        { label: 'Deletion', value: 'delete' },
        { label: 'Message', value: 'message' },
        { label: 'Other', value: 'other' },
      ],
      defaultValue: 'other',
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
