import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { WhyHereWhyNowBlock } from './Component';
import type { ImageType } from '@/payload-types';

const meta: Meta<typeof WhyHereWhyNowBlock> = {
  title: 'Blocks/WhyHereWhyNowBlock',
  component: WhyHereWhyNowBlock,
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
type Story = StoryObj<typeof WhyHereWhyNowBlock>;

const mockIcon = (label: string): ImageType => ({
  imageType: 'external',
  externalImage: `https://placehold.co/96x96?text=${encodeURIComponent(label)}`,
  alt: label,
});

const sampleChallenges = [
  {
    icon: mockIcon('Pirâmide'),
    label: 'Inversão da pirâmide demográfica',
    id: '1',
  },
  {
    icon: mockIcon('+65'),
    highlightValue: '39,4%',
    label: '39,4% da população com +65 anos',
    id: '2',
  },
  {
    icon: mockIcon('Ensino'),
    highlightValue: '13,8%',
    label: 'Apenas 13,8% com ensino superior',
    id: '3',
  },
  {
    icon: mockIcon('Desemprego'),
    highlightValue: '23,4%',
    label: 'Desemprego jovem de 23,4%',
    id: '4',
  },
];

export const Default: Story = {
  args: {
    id: '1',
    blockName: 'WhyHereWhyNowBlock',
    blockType: 'whyHereWhyNowBlock',
    title: 'Porque aqui? Porque agora?',
    subtitle: 'A região da Beira Interior enfrenta hoje:',
    badge: 'Think Global, Act Local',
    background: 'bege',
    challenges: sampleChallenges,
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

export const WithoutBadge: Story = {
  args: {
    ...Default.args,
    badge: undefined,
  },
};

export const TwoChallenges: Story = {
  args: {
    ...Default.args,
    challenges: sampleChallenges.slice(0, 2),
  },
};

export const ThreeChallenges: Story = {
  args: {
    ...Default.args,
    challenges: sampleChallenges.slice(0, 3),
  },
};
