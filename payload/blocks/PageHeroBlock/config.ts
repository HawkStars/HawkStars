import { linkGroup } from '@/payload/fields/linkGroup';
import SectionID from '@/payload/fields/SectionID';
import type { Block } from 'payload';

/**
 * The standard org-page header (`PageHero`, components/layout) as a CMS block, so pages
 * built in the admin open exactly like the pages written in code.
 */
export const PageHeroBlock: Block = {
  slug: 'pageHero',
  interfaceName: 'PageHeroBlock',
  labels: {
    singular: { en: 'Page Hero', pt: 'Cabeçalho de Página' },
    plural: { en: 'Page Heroes', pt: 'Cabeçalhos de Página' },
  },
  admin: {
    group: 'Hero & Layout',
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
      required: true,
      localized: true,
      label: { en: 'Title', pt: 'Título' },
      admin: {
        description: {
          en: "The page's main heading. Use one Page Hero per page, at the top.",
          pt: 'O título principal da página. Use um só Cabeçalho de Página, no topo.',
        },
      },
    },
    {
      name: 'description',
      type: 'textarea',
      localized: true,
      label: { en: 'Description', pt: 'Descrição' },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'variant',
          type: 'select',
          required: true,
          defaultValue: 'green',
          label: { en: 'Style', pt: 'Estilo' },
          options: [
            { label: { en: 'Green band', pt: 'Faixa verde' }, value: 'green' },
            { label: { en: 'Beige band', pt: 'Faixa bege' }, value: 'bege' },
          ],
          admin: { width: '50%' },
        },
        {
          name: 'align',
          type: 'select',
          required: true,
          defaultValue: 'left',
          label: { en: 'Alignment', pt: 'Alinhamento' },
          options: [
            { label: { en: 'Left', pt: 'Esquerda' }, value: 'left' },
            { label: { en: 'Centre', pt: 'Centro' }, value: 'center' },
          ],
          admin: { width: '50%' },
        },
      ],
    },
    linkGroup({
      overrides: {
        maxRows: 2,
        admin: {
          description: {
            en: 'Up to two buttons. The first is the main one.',
            pt: 'Até dois botões. O primeiro é o principal.',
          },
        },
      },
    }),
    {
      type: 'row',
      fields: [
        {
          name: 'document',
          type: 'relationship',
          relationTo: 'documents',
          label: { en: 'Download (document)', pt: 'Descarregar (documento)' },
          admin: {
            width: '50%',
            description: {
              en: 'Optional file from Documents (stored on Google Drive), shown as the first button.',
              pt: 'Ficheiro opcional de Documentos (guardado no Google Drive), mostrado como primeiro botão.',
            },
          },
        },
        {
          name: 'documentLabel',
          type: 'text',
          localized: true,
          label: { en: 'Download button label', pt: 'Texto do botão de download' },
          admin: {
            width: '50%',
            condition: (_, siblingData) => Boolean(siblingData?.document),
            placeholder: 'Descarregar (PDF)',
          },
        },
      ],
    },
    {
      name: 'facts',
      type: 'array',
      interfaceName: 'PageHeroFact',
      label: { en: 'Key facts', pt: 'Factos' },
      maxRows: 4,
      admin: {
        initCollapsed: true,
        description: {
          en: 'Small label/value tiles under the header, e.g. "Version — 1.0".',
          pt: 'Pequenos blocos rótulo/valor por baixo do cabeçalho, ex.: "Versão — 1.0".',
        },
        components: { RowLabel: '@/payload/components/admin/GenericArrayRowLabel' },
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'label',
              type: 'text',
              required: true,
              localized: true,
              label: { en: 'Label', pt: 'Rótulo' },
              admin: { width: '40%' },
            },
            {
              name: 'value',
              type: 'text',
              required: true,
              localized: true,
              label: { en: 'Value', pt: 'Valor' },
              admin: { width: '60%' },
            },
          ],
        },
      ],
    },
    SectionID,
  ],
};
