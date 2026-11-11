import { PayloadImageField } from '@/payload/fields/ImageType';
import SectionID from '@/payload/fields/SectionID';
import type { Block } from 'payload';

/**
 * Call to action that sends visitors to the interactive 3D model of the future
 * headquarters (`/sede-3d`). The link is fixed in code, so editors only write the copy.
 */
export const Sede3DCtaBlock: Block = {
  slug: 'sede3dCta',
  interfaceName: 'Sede3DCtaBlock',
  labels: {
    singular: { en: '3D Headquarters CTA', pt: 'CTA Sede em 3D' },
    plural: { en: '3D Headquarters CTAs', pt: 'CTAs Sede em 3D' },
  },
  admin: {
    group: 'CTA & Engagement',
  },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      label: { en: 'Eyebrow', pt: 'Sobretítulo' },
      localized: true,
      admin: {
        description: {
          en: 'Small label above the title. Leave empty for the default ("Explore in 3D").',
          pt: 'Pequeno rótulo acima do título. Deixe vazio para o texto por omissão ("Explora em 3D").',
        },
      },
    },
    {
      name: 'title',
      type: 'text',
      label: { en: 'Title', pt: 'Título' },
      required: true,
      localized: true,
    },
    {
      name: 'description',
      type: 'textarea',
      label: { en: 'Description', pt: 'Descrição' },
      localized: true,
    },
    {
      name: 'highlights',
      type: 'array',
      interfaceName: 'Sede3DCtaHighlight',
      label: { en: 'Highlights', pt: 'Destaques' },
      maxRows: 6,
      admin: {
        initCollapsed: true,
        description: {
          en: 'Short tags shown under the text, e.g. "3 training rooms", "Coworking", "Gaming hub".',
          pt: 'Etiquetas curtas mostradas por baixo do texto, ex.: "3 salas de formação", "Coworking", "Gaming hub".',
        },
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
      ],
    },
    {
      name: 'buttonLabel',
      type: 'text',
      label: { en: 'Button label', pt: 'Texto do botão' },
      localized: true,
      admin: {
        description: {
          en: 'Leave empty for the default ("Explore the building in 3D").',
          pt: 'Deixe vazio para o texto por omissão ("Explorar o edifício em 3D").',
        },
      },
    },
    PayloadImageField({
      name: 'image',
      label: { en: 'Preview image', pt: 'Imagem de pré-visualização' },
      description: {
        en: 'Optional. Defaults to a render of the Global Village building.',
        pt: 'Opcional. Por omissão usa uma imagem do edifício Global Village.',
      },
    }),
    SectionID,
  ],
};
