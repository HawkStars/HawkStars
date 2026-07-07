import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { SocialProofBlock } from './Component';

const meta: Meta<typeof SocialProofBlock> = {
  title: 'Blocks/Cards/Social Proof',
  component: SocialProofBlock,
  parameters: { layout: 'fullscreen' },
  argTypes: {
    backgroundColor: {
      control: 'select',
      options: ['white', 'gray', 'gradient'],
      description: 'Background colour of the block',
    },
    blockType: { table: { disable: true } },
    id: { table: { disable: true } },
    blockName: { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<typeof SocialProofBlock>;

const sampleStats = [
  { value: '500+', label: 'Young People Served', id: '1' },
  { value: '50+', label: 'Programs Delivered', id: '2' },
  { value: '95%', label: 'Satisfaction Rate', id: '3' },
  { value: '10+', label: 'Partner Organizations', id: '4' },
];

export const Default: Story = {
  args: {
    stats: sampleStats,
    backgroundColor: 'white',
    id: '1',
    blockName: 'SocialProofBlock',
    blockType: 'socialProof',
  },
};

export const GrayBackground: Story = {
  args: { ...Default.args, backgroundColor: 'gray', id: '2' },
};

export const Gradient: Story = {
  args: { ...Default.args, backgroundColor: 'gradient', id: '3' },
};

export const TwoStats: Story = {
  args: { ...Default.args, stats: sampleStats.slice(0, 2), id: '4' },
};
