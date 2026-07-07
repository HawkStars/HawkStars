import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import AppProvider from '@/utils/contexts/AppProvider';
import DoneStep from './DoneStep';
import type { DonationState } from './types';

const donationState: DonationState = {
  frequency: 'one-time',
  amount: 50,
  comment: '',
  name: 'Maria Silva',
  email: 'maria@example.com',
  phone_number: '912345678',
  phone_indicative: '+351',
  paymentMethod: 'CC',
};

const meta = {
  title: 'Donation/Widget/Done Step',
  component: DoneStep,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    onReset: () => {},
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
} satisfies Meta<typeof DoneStep>;

export default meta;
type Story = StoryObj<typeof meta>;

export const OneTime: Story = {
  args: {
    donationState,
    paymentResponse: null,
  },
};

export const Monthly: Story = {
  args: {
    donationState: { ...donationState, frequency: 'monthly' },
    paymentResponse: null,
  },
};

export const MultibancoReference: Story = {
  args: {
    donationState: { ...donationState, paymentMethod: 'MB' },
    paymentResponse: {
      method: { entity: '12345', reference: '987 654 321' },
    },
  },
};
