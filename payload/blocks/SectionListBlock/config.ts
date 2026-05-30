import SectionID from '@/payload/fields/SectionID';
import { Block } from 'payload';

export const SectionListBlock: Block = {
  slug: 'sectionListBlock',
  interfaceName: 'SectionListBlock',
  labels: {
    singular: { en: 'Section List', pt: 'Lista de Secção' },
    plural: { en: 'Section Lists', pt: 'Listas de Secção' },
  },
  admin: {
    group: 'Content',
  },
  fields: [
    {
      name: 'ordered',
      type: 'checkbox',
      label: { en: 'Ordered (numbered) list', pt: 'Lista Ordenada (numerada)' },
      defaultValue: false,
    },
    {
      name: 'items',
      type: 'array',
      label: { en: 'Items', pt: 'Itens' },
      required: true,
      minRows: 1,
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: '@/payload/components/admin/GenericArrayRowLabel',
        },
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          label: { en: 'Label', pt: 'Rótulo' },
          required: true,
          localized: true,
        },
        {
          name: 'description',
          type: 'text',
          label: { en: 'Description', pt: 'Descrição' },
          required: false,
          localized: true,
        },
      ],
      interfaceName: 'SectionListBlockItem',
    },
    SectionID,
  ],
};
