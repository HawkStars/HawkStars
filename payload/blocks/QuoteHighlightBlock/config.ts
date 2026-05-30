import { PayloadImageField } from '@/payload/fields/ImageType';
import SectionID from '@/payload/fields/SectionID';
import type { Block } from 'payload';

export const QuoteHighlightBlock: Block = {
  slug: 'quoteHighlight',
  interfaceName: 'QuoteHighlightBlock',
  admin: {
    group: 'Content',
  },
  fields: [
    {
      name: 'quote',
      type: 'textarea',
      required: true,
      localized: true,
      label: { en: 'Quote', pt: 'Citação' },
    },
    {
      name: 'author',
      type: 'text',
      required: true,
      localized: true,
      label: { en: 'Author', pt: 'Autor' },
    },
    {
      name: 'authorTitle',
      type: 'text',
      localized: true,
      label: { en: 'Author Title', pt: 'Título do Autor' },
    },
    PayloadImageField({ label: 'Author Photo', name: 'authorPhoto', required: false }),
    {
      name: 'style',
      type: 'select',
      label: { en: 'Style', pt: 'Estilo' },
      options: [
        { label: { en: 'Centered', pt: 'Centrado' }, value: 'centered' },
        { label: { en: 'With Border', pt: 'Com Borda' }, value: 'bordered' },
        { label: { en: 'Highlighted', pt: 'Destacado' }, value: 'highlighted' },
      ],
      defaultValue: 'centered',
    },
    SectionID,
  ],
  labels: {
    plural: { en: 'Quote Highlights', pt: 'Citações em Destaque' },
    singular: { en: 'Quote Highlight', pt: 'Citação em Destaque' },
  },
};
