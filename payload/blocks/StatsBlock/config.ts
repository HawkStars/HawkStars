import SectionID from '@/payload/fields/SectionID';
import { linkGroup } from '@/payload/fields/linkGroup';
import type { Block } from 'payload';
import PayloadLucideIcon from '@/payload/fields/ImageIcon/payload-lucide-icon';

export const StatsBlock: Block = {
  slug: 'statsBlock',
  interfaceName: 'StatsBlock',
  admin: {
    group: 'Social Proof',
  },
  fields: [
    {
      name: 'columns',
      type: 'select',
      required: true,
      defaultValue: '3',
      label: { en: 'Columns', pt: 'Colunas' },
      options: [
        { label: { en: '2 Columns', pt: '2 Colunas' }, value: '2' },
        { label: { en: '3 Columns', pt: '3 Colunas' }, value: '3' },
        { label: { en: '4 Columns', pt: '4 Colunas' }, value: '4' },
        { label: { en: '5 Columns', pt: '5 Colunas' }, value: '5' },
      ],
      admin: {
        description: {
          en: 'Number of stat cards per row',
          pt: 'Número de cartões de estatísticas por linha',
        },
      },
    },
    {
      name: 'background',
      type: 'select',
      required: true,
      defaultValue: 'white',
      label: { en: 'Background', pt: 'Fundo' },
      options: [
        { label: { en: 'White (Black Text)', pt: 'Branco (Texto Preto)' }, value: 'white' },
        { label: { en: 'Beige (Black Text)', pt: 'Bege (Texto Preto)' }, value: 'bege' },
        { label: { en: 'Green (White Text)', pt: 'Verde (Texto Branco)' }, value: 'green' },
      ],
      admin: {
        description: { en: 'Background color for the section', pt: 'Cor de fundo da secção' },
      },
    },
    {
      name: 'hoverBorderColor',
      type: 'select',
      required: true,
      defaultValue: 'green',
      label: { en: 'Hover Border Color', pt: 'Cor da Borda ao Passar o Rato' },
      options: [
        { label: { en: 'Green', pt: 'Verde' }, value: 'green' },
        { label: { en: 'Beige', pt: 'Bege' }, value: 'bege' },
      ],
      admin: {
        description: {
          en: 'Border color on card hover',
          pt: 'Cor da borda ao passar o rato sobre o cartão',
        },
      },
    },
    {
      name: 'stats',
      type: 'array',
      interfaceName: 'StatsBlockStatItem',
      required: true,
      minRows: 1,
      label: { en: 'Stats', pt: 'Estatísticas' },
      fields: [
        PayloadLucideIcon(),
        {
          name: 'iconAlign',
          type: 'select',
          label: { en: 'Icon Alignment', pt: 'Alinhamento do Ícone' },
          defaultValue: 'center',
          options: [
            { label: { en: 'Left', pt: 'Esquerda' }, value: 'left' },
            { label: { en: 'Center', pt: 'Centro' }, value: 'center' },
            { label: { en: 'Right', pt: 'Direita' }, value: 'right' },
          ],
          admin: {
            description: {
              en: 'Horizontal alignment of the icon',
              pt: 'Alinhamento horizontal do ícone',
            },
            condition: (_, siblingData) => !!siblingData?.icon,
          },
        },
        {
          name: 'title',
          type: 'text',
          localized: true,
          label: { en: 'Title', pt: 'Título' },
          admin: {
            description: {
              en: 'Optional stat title or value (e.g., "500+", "10K Users")',
              pt: 'Título ou valor opcional da estatística (ex: "500+", "10K Utilizadores")',
            },
          },
        },
        {
          name: 'titleAlign',
          type: 'select',
          label: { en: 'Title Alignment', pt: 'Alinhamento do Título' },
          defaultValue: 'center',
          options: [
            { label: { en: 'Left', pt: 'Esquerda' }, value: 'left' },
            { label: { en: 'Center', pt: 'Centro' }, value: 'center' },
            { label: { en: 'Right', pt: 'Direita' }, value: 'right' },
          ],
          admin: {
            description: {
              en: 'Horizontal alignment of the title',
              pt: 'Alinhamento horizontal do título',
            },
            condition: (_, siblingData) => !!siblingData?.title,
          },
        },
        {
          name: 'description',
          type: 'textarea',
          localized: true,
          label: { en: 'Description', pt: 'Descrição' },
          admin: {
            description: {
              en: 'Optional description or label for the stat',
              pt: 'Descrição ou rótulo opcional para a estatística',
            },
          },
        },
        {
          name: 'descriptionAlign',
          type: 'select',
          label: { en: 'Description Alignment', pt: 'Alinhamento da Descrição' },
          defaultValue: 'center',
          options: [
            { label: { en: 'Left', pt: 'Esquerda' }, value: 'left' },
            { label: { en: 'Center', pt: 'Centro' }, value: 'center' },
            { label: { en: 'Right', pt: 'Direita' }, value: 'right' },
          ],
          admin: {
            description: {
              en: 'Horizontal alignment of the description',
              pt: 'Alinhamento horizontal da descrição',
            },
            condition: (_, siblingData) => !!siblingData?.description,
          },
        },
      ],
      admin: {
        description: {
          en: 'List of stat cards to display',
          pt: 'Lista de cartões de estatísticas a exibir',
        },
        components: {
          RowLabel: '@/payload/components/admin/GenericArrayRowLabel',
        },
      },
    },
    linkGroup({
      overrides: {
        maxRows: 2,
        admin: {
          description: { en: 'Optional CTA buttons (max 2)', pt: 'Botões CTA opcionais (máx. 2)' },
        },
      },
    }),
    SectionID,
  ],
  labels: {
    plural: { en: 'Stats Blocks', pt: 'Blocos de Estatísticas' },
    singular: { en: 'Stats Block', pt: 'Bloco de Estatísticas' },
  },
};
