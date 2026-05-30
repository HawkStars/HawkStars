import SectionID from '@/payload/fields/SectionID';
import type { Block } from 'payload';

export const StepsConfigBlock: Block = {
  slug: 'stepsBlock',
  interfaceName: 'StepsBlock',
  admin: {
    group: 'Content Cards',
  },
  fields: [
    {
      type: 'select',
      name: 'numberOfColumnsPerRow',
      required: true,
      label: { en: 'Columns per Row', pt: 'Colunas por Linha' },
      options: [
        { label: '2', value: '2' },
        { label: '3', value: '3' },
        { label: '4', value: '4' },
        { label: '5', value: '5' },
      ],
      admin: {
        description: {
          en: 'Select the number of columns per row for the steps layout.',
          pt: 'Selecione o número de colunas por linha para o layout de passos.',
        },
      },
    },
    {
      type: 'select',
      name: 'dotColor',
      required: true,
      defaultValue: 'blue',
      label: { en: 'Dot Color', pt: 'Cor do Ponto' },
      options: [
        { label: { en: 'Blue', pt: 'Azul' }, value: 'blue' },
        { label: { en: 'Red', pt: 'Vermelho' }, value: 'red' },
        { label: { en: 'Green', pt: 'Verde' }, value: 'green' },
        { label: { en: 'Yellow', pt: 'Amarelo' }, value: 'yellow' },
      ],
      admin: {
        description: {
          en: 'Select the color of the dots for the steps.',
          pt: 'Selecione a cor dos pontos para os passos.',
        },
      },
    },
    {
      type: 'array',
      name: 'steps',
      interfaceName: 'StepsBlockItem',
      minRows: 1,
      required: true,
      label: { en: 'Steps', pt: 'Passos' },
      fields: [
        {
          type: 'text',
          name: 'title',
          localized: true,
          required: true,
          label: { en: 'Title', pt: 'Título' },
          admin: { description: { en: 'Title of the step', pt: 'Título do passo' } },
        },
        {
          type: 'text',
          name: 'description',
          localized: true,
          required: true,
          label: { en: 'Description', pt: 'Descrição' },
          admin: { description: { en: 'Description of the step', pt: 'Descrição do passo' } },
        },
      ],
    },
    SectionID,
  ],
  labels: {
    plural: { en: 'Steps Blocks', pt: 'Blocos de Passos' },
    singular: { en: 'Step Block', pt: 'Bloco de Passos' },
  },
};
