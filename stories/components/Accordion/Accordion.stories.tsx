import type { Meta, StoryObj } from '@storybook/react';

import Accordion from '../../../components/utils/Accordion/Accordion';

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
