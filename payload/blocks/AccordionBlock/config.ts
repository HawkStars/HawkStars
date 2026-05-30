import SectionID from '@/payload/fields/SectionID';
import type { Block } from 'payload';

export const AccordionBlock: Block = {
  slug: 'accordion',
  interfaceName: 'AccordionBlock',
  imageAltText: 'Accordion Block',
  admin: {
    group: 'Content',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: { en: 'Section Title', pt: 'Título da Secção' },
      localized: true,
      admin: {
        description: {
          en: 'Optional title displayed above the accordion',
          pt: 'Título opcional exibido acima do acordeão',
        },
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: { en: 'Section Description', pt: 'Descrição da Secção' },
      localized: true,
      admin: {
        description: {
          en: 'Optional description displayed below the title',
          pt: 'Descrição opcional exibida abaixo do título',
        },
      },
    },
    {
      name: 'items',
      type: 'array',
      interfaceName: 'AccordionBlockItem',
      label: { en: 'Accordion Items', pt: 'Itens do Acordeão' },
      required: true,
      minRows: 1,
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
          label: { en: 'Item Title', pt: 'Título do Item' },
        },
        {
          name: 'content',
          type: 'textarea',
          required: true,
          localized: true,
          label: { en: 'Item Content', pt: 'Conteúdo do Item' },
        },
        {
          name: 'defaultOpen',
          type: 'checkbox',
          label: { en: 'Open by Default', pt: 'Aberto por Omissão' },
          defaultValue: false,
        },
      ],
    },
    {
      name: 'allowMultiple',
      type: 'checkbox',
      label: { en: 'Allow Multiple Open', pt: 'Permitir Vários Abertos' },
      defaultValue: false,
      admin: {
        description: {
          en: 'Allow multiple accordion items to be open at the same time',
          pt: 'Permitir que vários itens do acordeão estejam abertos ao mesmo tempo',
        },
      },
    },
    {
      name: 'variant',
      type: 'select',
      label: { en: 'Style Variant', pt: 'Variante de Estilo' },
      defaultValue: 'default',
      options: [
        { label: { en: 'Default', pt: 'Padrão' }, value: 'default' },
        { label: { en: 'Bordered', pt: 'Com Borda' }, value: 'bordered' },
        { label: { en: 'Separated', pt: 'Separado' }, value: 'separated' },
      ],
    },
    SectionID,
  ],
  labels: {
    plural: { en: 'Accordion Blocks', pt: 'Blocos de Acordeão' },
    singular: { en: 'Accordion Block', pt: 'Bloco de Acordeão' },
  },
};
