import SectionID from '@/payload/fields/SectionID';
import type { Block } from 'payload';

export const FAQBlock: Block = {
  slug: 'faq',
  interfaceName: 'FAQBlock',
  imageAltText: 'FAQ Block',
  admin: {
    group: 'Content',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: { en: 'Title', pt: 'Título' },
      defaultValue: 'Frequently Asked Questions',
      localized: true,
    },
    {
      name: 'items',
      type: 'array',
      label: { en: 'FAQ Items', pt: 'Itens de FAQ' },
      interfaceName: 'FAQBlockItem',
      admin: {
        components: {
          RowLabel: '@/payload/components/admin/GenericArrayRowLabel',
        },
      },
      fields: [
        {
          name: 'question',
          type: 'text',
          label: { en: 'Question', pt: 'Pergunta' },
          required: true,
          localized: true,
        },
        {
          name: 'answer',
          type: 'textarea',
          label: { en: 'Answer', pt: 'Resposta' },
          required: true,
          localized: true,
        },
      ],
    },
    SectionID,
  ],
  labels: {
    plural: { en: 'FAQ Blocks', pt: 'Blocos de FAQ' },
    singular: { en: 'FAQ Block', pt: 'Bloco de FAQ' },
  },
};
