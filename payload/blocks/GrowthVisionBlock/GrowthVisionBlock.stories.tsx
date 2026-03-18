import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { GrowthVisionBlock } from './Component';
import type { ImageType } from '@/payload-types';

const meta: Meta<typeof GrowthVisionBlock> = {
  title: 'Blocks/GrowthVisionBlock',
  component: GrowthVisionBlock,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    background: {
      control: 'select',
      options: ['white', 'bege', 'green'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof GrowthVisionBlock>;

const mockIcon = (label: string): ImageType => ({
  imageType: 'external',
  externalImage: `https://placehold.co/96x96?text=${encodeURIComponent(label)}`,
  alt: label,
});

const samplePhases = [
  {
    icon: mockIcon('2026'),
    phaseName: 'Curto prazo (até 2026)',
    items: [
      { text: 'Lançamento do projeto local', id: '1a' },
      { text: 'Criação de 1ª rede de 4 hubs para toda a Vila', id: '1b' },
    ],
    id: '1',
  },
  {
    icon: mockIcon('2026–30'),
    phaseName: 'Médio prazo (2026-2030)',
    items: [
      { text: 'Inauguração do centro inovador', id: '2a' },
      { text: 'Criação de laboratórios e programas de inovação social', id: '2b' },
      { text: 'Formação contínua de parcerias internacionais', id: '2c' },
    ],
    id: '2',
  },
  {
    icon: mockIcon('2030+'),
    phaseName: 'Longo prazo (2030+)',
    items: [
      { text: 'Projeção dos modelos HawkStars além-fronteiras', id: '3a' },
      {
        text: 'Replicação como estratégia inteligente a nível Europeu de cidade do Interior',
        id: '3b',
      },
    ],
    id: '3',
  },
];

export const Default: Story = {
  args: {
    id: '1',
    blockName: 'GrowthVisionBlock',
    blockType: 'growthVisionBlock',
    title: 'Uma visão em crescimento',
    subtitle: '(Curto, Médio e Longo Prazo)',
    background: 'bege',
    phases: samplePhases,
  },
};

export const WhiteBackground: Story = {
  args: {
    ...Default.args,
    background: 'white',
  },
};

export const GreenBackground: Story = {
  args: {
    ...Default.args,
    background: 'green',
  },
};

export const SinglePhase: Story = {
  args: {
    ...Default.args,
    phases: samplePhases.slice(0, 1),
  },
};

export const TwoPhases: Story = {
  args: {
    ...Default.args,
    phases: samplePhases.slice(0, 2),
  },
};
