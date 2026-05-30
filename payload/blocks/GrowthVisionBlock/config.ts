import { PayloadImageField } from '@/payload/fields/ImageType';
import SectionID from '@/payload/fields/SectionID';
import type { Block } from 'payload';

export const GrowthVisionBlock: Block = {
  slug: 'growthVisionBlock',
  interfaceName: 'GrowthVisionBlock',
  admin: {
    group: 'Content',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: { en: 'Title', pt: 'Título' },
      required: true,
      localized: true,
      defaultValue: 'Uma visão em crescimento',
      admin: {
        description: 'Main heading for the section',
      },
    },
    {
      name: 'titleLocation',
      type: 'select',
      label: { en: 'Title Location', pt: 'Posição do Título' },
      options: [
        { label: { en: 'Left', pt: 'Esquerda' }, value: 'left' },
        { label: { en: 'Center', pt: 'Centro' }, value: 'center' },
        { label: { en: 'Right', pt: 'Direita' }, value: 'right' },
      ],
      defaultValue: 'center',
    },
    {
      name: 'background',
      type: 'select',
      label: { en: 'Background', pt: 'Fundo' },
      required: true,
      defaultValue: 'bege',
      options: [
        { label: { en: 'White', pt: 'Branco' }, value: 'white' },
        { label: { en: 'Beige', pt: 'Bege' }, value: 'bege' },
        { label: { en: 'Green', pt: 'Verde' }, value: 'green' },
      ],
      admin: {
        description: 'Background color for the section',
      },
    },
    {
      name: 'phases',
      type: 'array',
      label: { en: 'Phases', pt: 'Fases' },
      required: true,
      minRows: 1,
      maxRows: 5,
      labels: {
        singular: { en: 'Phase', pt: 'Fase' },
        plural: { en: 'Phases', pt: 'Fases' },
      },
      fields: [
        PayloadImageField({
          label: 'Phase Icon Image',
          name: 'icon',
          required: true,
          description: 'Illustration or icon representing this growth phase',
        }),
        {
          name: 'phaseName',
          type: 'text',
          label: { en: 'Phase Name', pt: 'Nome da Fase' },
          required: true,
          localized: true,
          admin: {
            description: 'Phase name (e.g., "Curto prazo (até 2026)")',
          },
        },
        {
          name: 'items',
          type: 'array',
          label: { en: 'Items', pt: 'Itens' },
          interfaceName: 'GrowthVisionPhaseItem',
          required: true,
          minRows: 1,
          labels: {
            singular: { en: 'Item', pt: 'Item' },
            plural: { en: 'Items', pt: 'Itens' },
          },
          fields: [
            {
              name: 'text',
              type: 'text',
              label: { en: 'Text', pt: 'Texto' },
              required: true,
              localized: true,
              admin: {
                description: 'Goal or milestone description',
              },
            },
          ],
          admin: {
            description: 'List of goals/milestones for this phase',
            components: {
              RowLabel: '@/payload/components/admin/GenericArrayRowLabel',
            },
          },
        },
      ],
      interfaceName: 'GrowthVisionPhase',
      admin: {
        description: 'Growth phases with their respective goals',
        components: {
          RowLabel: '@/payload/components/admin/GenericArrayRowLabel',
        },
      },
    },
    SectionID,
  ],
  labels: {
    plural: { en: 'Growth Vision Blocks', pt: 'Blocos de Visão de Crescimento' },
    singular: { en: 'Growth Vision Block', pt: 'Bloco de Visão de Crescimento' },
  },
};
