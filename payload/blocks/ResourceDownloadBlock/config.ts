import type { Block } from 'payload';

export const ResourceDownloadBlock: Block = {
  slug: 'resourceDownload',
  interfaceName: 'ResourceDownloadBlock',
  fields: [
    {
      name: 'title',
      type: 'text',
      defaultValue: 'Download Resources',
    },
    {
      name: 'resources',
      type: 'array',
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
        },
        {
          name: 'file',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'fileType',
          type: 'select',
          options: [
            { label: 'PDF', value: 'pdf' },
            { label: 'Document', value: 'doc' },
            { label: 'Spreadsheet', value: 'xls' },
            { label: 'Image', value: 'image' },
            { label: 'Other', value: 'other' },
          ],
        },
      ],
    },
  ],
  labels: {
    plural: 'Resource Downloads',
    singular: 'Resource Download',
  },
};
