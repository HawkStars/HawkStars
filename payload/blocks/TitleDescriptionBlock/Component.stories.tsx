import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { TitleDescriptionBlock } from './Component';

const meta: Meta<typeof TitleDescriptionBlock> = {
  title: 'Blocks/Content/Title & Description',
  component: TitleDescriptionBlock,
  parameters: { layout: 'padded' },
  argTypes: {
    title: { control: 'text' },
    description: { control: 'text' },
    blockType: { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<typeof TitleDescriptionBlock>;

export const Default: Story = {
  args: {
    blockType: 'titleDescriptionBlock',
    title: 'Our Mission',
    description:
      'We are dedicated to preserving and promoting cultural heritage through innovative programs and community engagement.',
  },
};

export const TitleOnly: Story = {
  args: {
    blockType: 'titleDescriptionBlock',
    title: 'Welcome to HawkStars',
  },
};

export const LongDescription: Story = {
  args: {
    blockType: 'titleDescriptionBlock',
    title: 'About Our Organization',
    description:
      'Founded with a vision to bridge cultures and create meaningful connections, our organization has been at the forefront of cultural preservation for over two decades. We believe in the power of storytelling, art, and community to transform lives and build bridges across generations.',
  },
};

export const ShortDescription: Story = {
  args: {
    blockType: 'titleDescriptionBlock',
    title: 'Join Us',
    description: 'Be part of something bigger.',
  },
};
