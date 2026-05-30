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
      label: { en: 'Title', pt: 'Título' },
      admin: {
        description: 'The title displayed above the list of resources.',
      },
    },
    {
      name: 'variation',
      type: 'select',
      label: { en: 'Variation', pt: 'Variação' },
      admin: {
        description:
          'Optional - Used to apply different styles to the resource item. Default is "Default".',
      },
      defaultValue: 'list',
      options: [
        { label: { en: 'List', pt: 'Lista' }, value: 'list' },
        { label: { en: 'Card', pt: 'Cartão' }, value: 'card' },
      ],
    },
    {
      name: 'resources',
      type: 'array',
      interfaceName: 'ResourceItem',
      label: { en: 'Resources', pt: 'Recursos' },
      admin: {
        components: {
          RowLabel: '@/payload/components/admin/GenericArrayRowLabel',
        },
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          localized: true,
          label: { en: 'Title', pt: 'Título' },
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
          label: { en: 'Description', pt: 'Descrição' },
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
          label: { en: 'File', pt: 'Ficheiro' },
        },
        {
          name: 'fileType',
          type: 'select',
          required: false,
          label: { en: 'File Type', pt: 'Tipo de Ficheiro' },
          options: [
            { label: 'PDF', value: 'pdf' },
            { label: { en: 'Document', pt: 'Documento' }, value: 'doc' },
            { label: { en: 'Spreadsheet', pt: 'Folha de Cálculo' }, value: 'xls' },
            { label: { en: 'Image', pt: 'Imagem' }, value: 'image' },
            { label: { en: 'Other', pt: 'Outro' }, value: 'other' },
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
    plural: { en: 'File Download Blocks', pt: 'Blocos de Download de Ficheiro' },
    singular: { en: 'File Download Block', pt: 'Bloco de Download de Ficheiro' },
  },
};
