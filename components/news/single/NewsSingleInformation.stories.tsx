import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { News } from '@/payload-types';
import NewsSingleInformation from './NewsSingleInformation';
import { DefaultTypedEditorState } from '@payloadcms/richtext-lexical';

const references = [
  {
    id: 'r1',
    title: 'Página oficial do Erasmus+',
    url: 'https://erasmus-plus.ec.europa.eu',
    platform: 'website',
  },
  { id: 'r2', title: 'Salto Youth', url: 'https://www.salto-youth.net', platform: 'website' },
] as News['references'];

const meta = {
  title: 'Pages/News/Single Information',
  component: NewsSingleInformation,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof NewsSingleInformation>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    details: {
      text: {
        root: {
          type: 'root',
          children: [
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  text: 'Este artigo descreve o lançamento do nosso mais recente projeto, financiado pelo programa Erasmus+, que reúne parceiros de cinco países europeus.\n\nO projeto decorrerá ao longo de doze meses, com atividades em Portugal, Espanha e Itália.',
                },
              ],
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          version: 1,
          text: '',
        },
      } as unknown as DefaultTypedEditorState,
    },
    references,
  },
};
