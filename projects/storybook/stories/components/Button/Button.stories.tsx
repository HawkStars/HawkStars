import Button from '@/components/utils/Button';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Button> = {
  component: Button,
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    primary: true,
    label: 'Button',
    children: 'Test',
    padding: 'sm',
    size: 'fit',
    variant: 'success',
    outline: true,
  },
};
