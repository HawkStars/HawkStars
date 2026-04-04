import SectionID from '@/payload/fields/SectionID';
import type { Block } from 'payload';

export const ResourceDownloadBlock: Block = {
  slug: 'resourceDownload',
  interfaceName: 'ResourceDownloadBlock',
  admin: {
    group: 'Layout',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      defaultValue: 'Download Resources',
      localized: true,
      admin: {
        description: 'The title displayed above the list of resources.',
      },
    },
    {
      name: 'variation',
      type: 'select',
      admin: {
        description:
          'Optional - Used to apply different styles to the resource item. Default is "Default".',
      },
      defaultValue: 'list',
      options: [
        { label: 'List', value: 'list' },
        { label: 'Card', value: 'card' },
      ],
    },
    {
      name: 'resources',
      type: 'array',
      interfaceName: 'ResourceItem',
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          localized: true,
          admin: {
            description: 'A descriptive title for the resource.',
          },
          maxLength: 30,
        },
        {
          name: 'description',
          type: 'textarea',
          localized: true,
          required: false,
          admin: {
            description: 'A brief description of the resource.',
          },
          maxLength: 80,
        },
        {
          name: 'file',
          type: 'upload',
          relationTo: 'documents',
          required: true,
        },
        {
          name: 'fileType',
          type: 'select',
          required: false,
          options: [
            { label: 'PDF', value: 'pdf' },
            { label: 'Document', value: 'doc' },
            { label: 'Spreadsheet', value: 'xls' },
            { label: 'Image', value: 'image' },
            { label: 'Other', value: 'other' },
          ],
          admin: {
            description: 'Optional - Used to determine the icon displayed for the resource.',
          },
        },
      ],
    },
    SectionID,
  ],
  labels: {
    plural: 'File Download Blocks',
    singular: 'File Download Block',
  },
};
