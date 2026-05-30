import type { CollectionConfig } from 'payload';

export const Documents: CollectionConfig = {
  slug: 'documents',
  typescript: {
    interface: 'HawkDocument',
  },
  labels: {
    singular: { en: 'Document', pt: 'Documento' },
    plural: { en: 'Documents', pt: 'Documentos' },
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
      label: { en: 'Title', pt: 'Título' },
      type: 'text',
      required: true,
      admin: {
        description: 'A descriptive title for the document.',
      },
    },
    {
      name: 'folder',
      label: { en: 'Folder', pt: 'Pasta' },
      type: 'select',
      options: [
        { label: { en: 'General', pt: 'Geral' }, value: 'general' },
        { label: { en: 'Projects', pt: 'Projetos' }, value: 'projects' },
        { label: { en: 'Events', pt: 'Eventos' }, value: 'events' },
        { label: { en: 'Reports', pt: 'Relatórios' }, value: 'reports' },
      ],
      admin: { description: 'Optional folder path for organization.' },
    },
    {
      name: 'description',
      label: { en: 'Description', pt: 'Descrição' },
      type: 'textarea',
      required: false,
      admin: {
        description: 'Optional description of the document contents or purpose.',
      },
    },
  ],
};
