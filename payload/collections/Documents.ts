import type { CollectionConfig } from 'payload';

export const Documents: CollectionConfig = {
  slug: 'documents',
  typescript: {
    interface: 'HawkDocument',
  },
  labels: {
    singular: 'Document',
    plural: 'Documents',
  },
  admin: {
    description:
      'Upload and manage documents such as PDFs, spreadsheets, and other files used throughout the website.',
    group: {
      name: 'Management',
    },
    pagination: {
      limits: [10, 25, 50, 100],
      defaultLimit: 10,
    },
    useAsTitle: 'title',
    defaultColumns: ['title', 'folder', 'createdAt'],
  },
  upload: {
    staticDir: 'documents',
    mimeTypes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'text/csv',
    ],
    disableLocalStorage: true,
    bulkUpload: true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'A descriptive title for the document.',
      },
    },
    {
      name: 'folder',
      type: 'select',
      options: [
        { label: 'General', value: 'general' },
        { label: 'Projects', value: 'projects' },
        { label: 'Events', value: 'events' },
        { label: 'Reports', value: 'reports' },
      ],
      admin: { description: 'Optional folder path for organization.' },
    },
    {
      name: 'description',
      type: 'textarea',
      required: false,
      admin: {
        description: 'Optional description of the document contents or purpose.',
      },
    },
  ],
};
