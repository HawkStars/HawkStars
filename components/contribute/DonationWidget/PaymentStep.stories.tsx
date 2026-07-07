import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import AppProvider from '@/utils/contexts/AppProvider';
import PaymentStep from './PaymentStep';

const meta = {
  title: 'Donation/Widget/Payment Step',
  component: PaymentStep,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    onSelectMethod: () => {},
    onBack: () => {},
    onNext: () => {},
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
} satisfies Meta<typeof PaymentStep>;

export default meta;
type Story = StoryObj<typeof meta>;

export const OneTime: Story = {
  args: {
    frequency: 'one-time',
    selectedMethod: null,
  },
};

export const MethodSelected: Story = {
  args: {
    frequency: 'one-time',
    selectedMethod: 'MBW',
  },
};

// Subscriptions only allow Credit Card.
export const MonthlySubscription: Story = {
  args: {
    frequency: 'monthly',
    selectedMethod: 'CC',
  },
};
