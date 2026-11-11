import type { Block } from 'payload';
import { FixedToolbarFeature, lexicalEditor } from '@payloadcms/richtext-lexical';
import SectionID from '@/payload/fields/SectionID';

/**
 * A long text — a policy, regulation, statute or terms — set in a reading card, with a
 * sticky table of contents built automatically from its H2 headings.
 */
export const LongDocumentBlock: Block = {
  slug: 'longDocument',
  interfaceName: 'LongDocumentBlock',
  labels: {
    singular: { en: 'Long Document', pt: 'Documento Longo' },
    plural: { en: 'Long Documents', pt: 'Documentos Longos' },
  },
  admin: {
    group: 'Content',
  },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      localized: true,
      label: { en: 'Eyebrow', pt: 'Sobretítulo' },
    },
    {
      name: 'title',
      type: 'text',
      localized: true,
      label: { en: 'Title', pt: 'Título' },
    },
    {
      name: 'note',
      type: 'textarea',
      localized: true,
      label: { en: 'Note', pt: 'Nota' },
      admin: {
        description: {
          en: 'Optional highlighted note above the text, e.g. "The official version is in Portuguese."',
          pt: 'Nota opcional em destaque antes do texto, ex.: "A versão oficial é em português."',
        },
      },
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
      localized: true,
      label: { en: 'Text', pt: 'Texto' },
      // Text-only editor: the site default embeds every block — including this one,
      // which makes the schema recursive — and a policy text needs none of them.
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [...defaultFeatures, FixedToolbarFeature()],
      }),
      admin: {
        description: {
          en: 'Use Heading 2 for each section: they become the table of contents.',
          pt: 'Use Título 2 para cada secção: formam o índice.',
        },
      },
    },
    {
      name: 'footnote',
      type: 'textarea',
      localized: true,
      label: { en: 'Footnote', pt: 'Nota final' },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'showContents',
          type: 'checkbox',
          defaultValue: true,
          label: { en: 'Show table of contents', pt: 'Mostrar índice' },
          admin: { width: '50%', style: { alignSelf: 'center' } },
        },
        {
          name: 'background',
          type: 'select',
          required: true,
          defaultValue: 'bege',
          label: { en: 'Background', pt: 'Fundo' },
          options: [
            { label: { en: 'Beige', pt: 'Bege' }, value: 'bege' },
            { label: { en: 'White', pt: 'Branco' }, value: 'white' },
          ],
          admin: { width: '50%' },
        },
      ],
    },
    SectionID,
  ],
};
