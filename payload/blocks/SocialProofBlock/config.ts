import SectionID from '@/payload/fields/SectionID';
import type { Block } from 'payload';

export const SocialProofBlock: Block = {
  slug: 'socialProof',
  interfaceName: 'SocialProofBlock',
  admin: {
    group: 'Social Proof',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: false,
      localized: true,
      label: { en: 'Title', pt: 'Título' },
      admin: {
        description: {
          en: 'Main title for the social proof section. Optional.',
          pt: 'Título principal para a secção de prova social. Opcional.',
        },
      },
    },
    {
      name: 'subtitle',
      type: 'text',
      localized: true,
      required: false,
      label: { en: 'Subtitle', pt: 'Subtítulo' },
      admin: {
        description: {
          en: 'Optional subtitle or description.',
          pt: 'Subtítulo ou descrição opcional.',
        },
      },
    },
    {
      name: 'stats',
      type: 'array',
      interfaceName: 'SocialProofBlockStat',
      label: { en: 'Stats', pt: 'Estatísticas' },
      admin: {
        components: {
          RowLabel: '@/payload/components/admin/GenericArrayRowLabel',
        },
      },
      minRows: 2,
      maxRows: 4,
      fields: [
        {
          name: 'value',
          type: 'text',
          required: true,
          localized: true,
          label: { en: 'Value', pt: 'Valor' },
          admin: {
            description: {
              en: 'Number or stat (e.g., "500+", "95%")',
              pt: 'Número ou estatística (ex: "500+", "95%")',
            },
          },
        },
        {
          name: 'label',
          type: 'text',
          required: true,
          localized: true,
          label: { en: 'Label', pt: 'Rótulo' },
        },
      ],
    },
    {
      name: 'backgroundColor',
      type: 'select',
      label: { en: 'Background Color', pt: 'Cor de Fundo' },
      options: [
        { label: { en: 'White', pt: 'Branco' }, value: 'white' },
        { label: { en: 'Gray', pt: 'Cinzento' }, value: 'gray' },
        { label: { en: 'Gradient', pt: 'Gradiente' }, value: 'gradient' },
      ],
      defaultValue: 'white',
    },
    {
      name: 'textAlign',
      type: 'select',
      label: { en: 'Text Alignment', pt: 'Alinhamento do Texto' },
      options: [
        {
          label: { en: 'Left', pt: 'Esquerda' },
          value: 'left',
        },
        {
          label: { en: 'Center', pt: 'Centro' },
          value: 'center',
        },
        {
          label: { en: 'Right', pt: 'Direita' },
          value: 'right',
        },
      ],
      defaultValue: 'center',
      admin: {
        description: {
          en: 'Text alignment for the social proof section',
          pt: 'Alinhamento do texto para a secção de prova social',
        },
      },
    },
    SectionID,
  ],
  labels: {
    plural: { en: 'Social Proof Blocks', pt: 'Blocos de Prova Social' },
    singular: { en: 'Social Proof Block', pt: 'Bloco de Prova Social' },
  },
};
