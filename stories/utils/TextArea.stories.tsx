import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import TextArea from '@/components/utils/TextArea/TextArea';

const meta = {
  title: 'Design System/TextArea',
  component: TextArea,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    disabled: {
      control: { type: 'boolean' },
    },
  },
  render: (args) => (
    <div className='w-72'>
      <TextArea {...args} />
    </div>
  ),
} satisfies Meta<typeof TextArea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: 'message',
    labelText: 'Message',
    placeholder: 'Write your message…',
  },
};

export const WithHint: Story = {
  args: {
    ...Default.args,
    inputHintText: 'Maximum 500 characters.',
  },
};

export const WithError: Story = {
  args: {
    ...Default.args,
    errorMessage: 'This field is required.',
  },
};

export const Disabled: Story = {
  args: {
    ...Default.args,
    disabled: true,
    placeholder: 'Disabled',
  },
};
