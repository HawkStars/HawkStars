import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { SocialProofBlock } from './Component';

const meta: Meta<typeof SocialProofBlock> = {
  title: 'Cards/SocialProofBlock',
  component: SocialProofBlock,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof SocialProofBlock>;

export const Default: Story = {
  args: {
    stats: [
      { value: '500+', label: 'Young People Served', id: '1' },
      { value: '50+', label: 'Programs Delivered', id: '2' },
      { value: '95%', label: 'Satisfaction Rate', id: '3' },
      { value: '10+', label: 'Partner Organizations', id: '4' },
    ],
    backgroundColor: 'white',
    id: '1',
    blockName: 'SocialProofBlock',
    blockType: 'socialProof',
  },
};

export const GrayBackground: Story = {
  args: {
    ...Default.args,
    backgroundColor: 'gray',
  },
};

export const Gradient: Story = {
  args: {
    ...Default.args,
    backgroundColor: 'gradient',
  },
};
