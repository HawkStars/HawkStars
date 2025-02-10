import Accordion from '@/components/utils/Accordion/Accordion';
import type { Meta, StoryObj } from '@storybook/react';


const meta: Meta<typeof Accordion> = {
  component: Accordion,
};

export default meta;
type Story = StoryObj<typeof Accordion>;

export const Primary: Story = {
  args: {
    title: 'Title',
    defaultOpen: false,
    children: <div>Content</div>,
  },
};
