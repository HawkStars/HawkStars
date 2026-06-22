import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import AppProvider from '@/utils/contexts/AppProvider';
import AmountStep from './AmountStep';

const meta = {
  title: 'Contribute/AmountStep',
  component: AmountStep,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    onFrequencyChange: () => {},
    onHandleDonationValue: () => {},
  },
  decorators: [
    (Story) => (
      <AppProvider lng='en'>
        <div className='w-105 rounded-xl bg-white p-6'>
          <Story />
        </div>
      </AppProvider>
    ),
  ],
} satisfies Meta<typeof AmountStep>;

export default meta;
type Story = StoryObj<typeof meta>;

export const OneTime: Story = {
  args: {
    frequency: 'one-time',
    selectedAmount: null,
  },
};

export const Monthly: Story = {
  args: {
    frequency: 'monthly',
    selectedAmount: 25,
  },
};
