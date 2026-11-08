import type { CollectionConfig } from 'payload';
import { GROUP_LABELS } from '../constants';
import { anyone } from '../access/anyone';
import { authenticatedAdmin } from '../access/authenticatedAdmin';
import { authenticated } from '../access/authenticated';
import { moveDocumentDriveFile } from '../hooks/moveDocumentDriveFile';
import { DOCUMENT_URL_ALLOW_LIST } from './uploadAllowList';
import { DOCUMENT_MIME_TYPES } from './documentMimeTypes';
import { setDocumentSource } from '../hooks/setDocumentSource';

export const Documents: CollectionConfig = {
  slug: 'documents',
  typescript: {
    interface: 'HawkDocument',
  },
  labels: {
    singular: { en: 'Document', pt: 'Documento' },
    plural: { en: 'Documents', pt: 'Documentos' },
  },
  // Files are downloaded from public-facing pages (see ResourceDownloadBlock),
  // so read stays public. Any account can create and edit; delete is admin-only
  // because it also removes the file from Google Drive permanently.
  access: {
    admin: authenticated,
    read: anyone,
    create: authenticated,
    delete: authenticatedAdmin,
    update: authenticated,
  },
  admin: {
    description: {
      en: 'Upload and manage documents such as PDFs, spreadsheets, and other files used throughout the website.',
      pt: 'Carregue e gira documentos como PDFs, folhas de cálculo e outros ficheiros utilizados no website.',
    },
    group: {
      ...GROUP_LABELS.management,
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
    mimeTypes: DOCUMENT_MIME_TYPES,
    disableLocalStorage: true,
    bulkUpload: true,
    // Linked Drive files (source: 'linked') are created without an upload. setDocumentSource
    // still rejects any other create that has no file.
    filesRequiredOnCreate: false,
    // Creating from a URL (MCP `createDocuments`, admin "Paste URL") may only fetch from these hosts.
    pasteURL: { allowList: DOCUMENT_URL_ALLOW_LIST },
  },
  hooks: {
    beforeChange: [setDocumentSource],
    afterChange: [moveDocumentDriveFile],
  },
  fields: [
    {
      name: 'title',
      label: { en: 'Title', pt: 'Título' },
      type: 'text',
      required: true,
      admin: {
        description: {
          en: 'A descriptive title for the document.',
          pt: 'Um título descritivo para o documento.',
        },
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
      admin: {
        description: {
          en: 'Optional folder path for organization.',
          pt: 'Pasta opcional para organização.',
        },
      },
    },
    {
      name: 'source',
      label: { en: 'Source', pt: 'Origem' },
      type: 'select',
      defaultValue: 'uploaded',
      options: [
        { label: { en: 'Uploaded', pt: 'Carregado' }, value: 'uploaded' },
        { label: { en: 'Linked from Drive', pt: 'Ligado do Drive' }, value: 'linked' },
      ],
      admin: {
        readOnly: true,
        position: 'sidebar',
        description: {
          en: 'Linked files stay in their original Drive folder: deleting this entry does not delete the file.',
          pt: 'Ficheiros ligados ficam na pasta original do Drive: apagar esta entrada não apaga o ficheiro.',
        },
      },
    },
    {
      name: 'description',
      label: { en: 'Description', pt: 'Descrição' },
      type: 'textarea',
      required: false,
      admin: {
        description: {
          en: 'Optional description of the document contents or purpose.',
          pt: 'Descrição opcional do conteúdo ou propósito do documento.',
        },
      },
    },
  ],
};
