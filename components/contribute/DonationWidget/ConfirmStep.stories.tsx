import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import AppProvider from '@/utils/contexts/AppProvider';
import ConfirmStep from './ConfirmStep';
import type { DonationState } from './types';

const donationState: DonationState = {
  frequency: 'one-time',
  amount: 50,
  comment: 'Keep up the great work!',
  name: 'Maria Silva',
  email: 'maria@example.com',
  phone_number: '912345678',
  phone_indicative: '+351',
  paymentMethod: 'MBW',
};

const meta = {
  title: 'Donation/Widget/Confirm Step',
  component: ConfirmStep,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    onBack: () => {},
    onConfirm: () => {},
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
} satisfies Meta<typeof ConfirmStep>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    donationState,
    isSubmitting: false,
    submitError: null,
  },
};

export const Submitting: Story = {
  args: {
    donationState,
    isSubmitting: true,
    submitError: null,
  },
};

export const WithError: Story = {
  args: {
    donationState,
    isSubmitting: false,
    submitError: 'Payment failed. Please try again.',
  },
};

export const MonthlySubscription: Story = {
  args: {
    donationState: { ...donationState, frequency: 'monthly', paymentMethod: 'CC' },
    isSubmitting: false,
    submitError: null,
  },
};
