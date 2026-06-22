import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { InstagramBlockComponent } from './Component';

const meta: Meta<typeof InstagramBlockComponent> = {
  title: 'Blocks/InstagramBlock',
  component: InstagramBlockComponent,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    version: {
      control: 'select',
      options: ['grid', 'widget'],
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof InstagramBlockComponent>;

export const Default: Story = {
  args: {
    version: 'grid',
    id: '1',
    blockName: 'InstagramBlock',
    blockType: 'instagram',
  },
};

export const Grid: Story = {
  args: {
    ...Default.args,
    version: 'grid',
  },
};

export const Widget: Story = {
  args: {
    ...Default.args,
    version: 'widget',
  },
};
