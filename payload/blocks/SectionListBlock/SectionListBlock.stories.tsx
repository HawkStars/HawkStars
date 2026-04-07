import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { SectionListBlockComponent } from './Component';

const meta: Meta<typeof SectionListBlockComponent> = {
  title: 'Content/SectionListBlock',
  component: SectionListBlockComponent,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    ordered: {
      control: { type: 'boolean' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const benefitItems = [
  {
    id: '1',
    label: 'Formação profissional',
    description: 'Cursos e workshops voltados para o mercado de trabalho atual.',
  },
  {
    id: '2',
    label: 'Coworking',
    description: 'Espaços partilhados equipados para trabalho remoto e colaborativo.',
  },
  {
    id: '3',
    label: 'Cultura e artes',
    description: 'Programação cultural regular com exposições, concertos e performances.',
  },
  {
    id: '4',
    label: 'Gaming & e-sports',
    description: 'Sala dedicada a competições e comunidade de gaming.',
  },
];

const stepItems = [
  {
    id: '1',
    label: 'Escolhe o teu nível de apoio',
    description: 'Seleciona uma das recompensas disponíveis na campanha.',
  },
  {
    id: '2',
    label: 'Realiza o pagamento',
    description: 'Utiliza MB Way, transferência bancária ou cartão de crédito.',
  },
  {
    id: '3',
    label: 'Recebe a confirmação',
    description: 'Enviamos um e-mail com os detalhes da tua contribuição.',
  },
];

export const Default: Story = {
  args: {
    blockType: 'sectionListBlock',
    ordered: false,
    items: benefitItems,
    sectionId: 'beneficios',
  },
};

export const Ordered: Story = {
  args: {
    blockType: 'sectionListBlock',
    ordered: true,
    items: stepItems,
    sectionId: 'como-contribuir',
  },
};

export const LabelsOnly: Story = {
  args: {
    blockType: 'sectionListBlock',
    ordered: false,
    items: [
      { id: '1', label: 'Reabilitação do edifício principal' },
      { id: '2', label: 'Instalação de equipamentos de coworking' },
      { id: '3', label: 'Criação da sala de gaming' },
      { id: '4', label: 'Palco e espaço cultural' },
      { id: '5', label: 'Área de formação profissional' },
    ],
    sectionId: 'fases',
  },
};

export const FewItems: Story = {
  args: {
    blockType: 'sectionListBlock',
    ordered: true,
    items: [
      { id: '1', label: 'Fase 1 — Estrutura', description: 'Obras de reabilitação estrutural.' },
      { id: '2', label: 'Fase 2 — Interior', description: 'Acabamentos e equipamentos interiores.' },
    ],
    sectionId: 'fases-obra',
  },
};
