import Spinner from '@/components/utils/Spinner/Spinner';
import type { Meta, StoryObj } from '@storybook/react';



const meta: Meta<typeof Spinner> = {
  component: Spinner,
};

export default meta;
type Story = StoryObj<typeof Spinner>;

export const Primary: Story = {
  args: {},
};
