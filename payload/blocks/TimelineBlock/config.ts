import { PayloadImageField } from '@/payload/fields/ImageType';
import SectionID from '@/payload/fields/SectionID';
import type { Block } from 'payload';

export const TimelineBlock: Block = {
  slug: 'timeline',
  interfaceName: 'TimelineBlock',
  admin: {
    group: 'Layout',
  },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      localized: true,
      label: { en: 'Eyebrow', pt: 'Sobretítulo' },
      admin: {
        description: {
          en: 'Small uppercase label above the title (optional)',
          pt: 'Pequeno rótulo em maiúsculas acima do título (opcional)',
        },
      },
    },
    {
      name: 'title',
      type: 'text',
      localized: true,
      label: { en: 'Title', pt: 'Título' },
    },
    {
      name: 'items',
      type: 'array',
      interfaceName: 'TimelineBlockItem',
      label: { en: 'Timeline Items', pt: 'Itens da Linha do Tempo' },
      admin: {
        components: {
          RowLabel: '@/payload/components/admin/GenericArrayRowLabel',
        },
      },
      fields: [
        {
          name: 'year',
          type: 'text',
          required: true,
          label: { en: 'Year', pt: 'Ano' },
        },
        {
          name: 'title',
          type: 'text',
          required: true,
          localized: true,
          label: { en: 'Title', pt: 'Título' },
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
          localized: true,
          label: { en: 'Description', pt: 'Descrição' },
        },
        PayloadImageField({
          label: 'Image',
          name: 'image',
          required: false,
          description: {
            en: 'Image for the timeline item',
            pt: 'Imagem para o item da linha do tempo',
          },
        }),
      ],
    },
    {
      name: 'orientation',
      type: 'select',
      label: { en: 'Orientation', pt: 'Orientação' },
      options: [
        { label: { en: 'Vertical', pt: 'Vertical' }, value: 'vertical' },
        { label: { en: 'Horizontal', pt: 'Horizontal' }, value: 'horizontal' },
      ],
      defaultValue: 'vertical',
    },
    {
      name: 'highlightLast',
      type: 'checkbox',
      label: { en: 'Highlight the last milestone', pt: 'Destacar o último marco' },
      defaultValue: false,
      admin: {
        description: {
          en: 'Shows the final item as the current chapter (green card).',
          pt: 'Mostra o último item como o capítulo atual (cartão verde).',
        },
      },
    },
    SectionID,
  ],
  labels: {
    plural: { en: 'Timelines', pt: 'Linhas do Tempo' },
    singular: { en: 'Timeline', pt: 'Linha do Tempo' },
  },
};
