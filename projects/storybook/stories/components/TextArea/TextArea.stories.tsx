import TextArea from '@/components/utils/TextArea/TextArea';
import type { Meta, StoryObj } from '@storybook/react';



const meta: Meta<typeof TextArea> = {
  component: TextArea,
};

export default meta;
type Story = StoryObj<typeof TextArea>;

export const Primary: Story = {
  args: {
    value: 'TextArea',
  },
};
