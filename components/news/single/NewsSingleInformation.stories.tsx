import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { News } from '@/payload-types';
import NewsSingleInformation from './NewsSingleInformation';

const sections = [
  {
    title: 'O contexto',
    text: 'A Associação HawkStars iniciou este projeto com o objetivo de promover a mobilidade jovem e o intercâmbio cultural entre comunidades europeias.',
  },
  {
    title: 'O impacto',
    text: 'Ao longo de seis meses, mais de 30 jovens participaram em atividades de formação, voluntariado e descoberta cultural.',
  },
] as unknown as NonNullable<News['details']>['sections'];

const references = [
  { id: 'r1', title: 'Página oficial do Erasmus+', url: 'https://erasmus-plus.ec.europa.eu' },
  { id: 'r2', title: 'Salto Youth', url: 'https://www.salto-youth.net' },
];

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
      text: 'Este artigo descreve o lançamento do nosso mais recente projeto, financiado pelo programa Erasmus+, que reúne parceiros de cinco países europeus.\n\nO projeto decorrerá ao longo de doze meses, com atividades em Portugal, Espanha e Itália.',
      sections,
    },
    references,
  },
};

export const TextOnly: Story = {
  args: {
    details: {
      text: 'Um breve comunicado sobre as novidades da associação, sem secções adicionais nem referências.',
    },
    references: [],
  },
};

export const SectionsOnly: Story = {
  args: {
    details: {
      sections,
    },
    references: [],
  },
};
