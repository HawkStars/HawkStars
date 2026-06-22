import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import DonationHeader from './DonationHeader';

const meta = {
  title: 'Contribute/DonationHeader',
  component: DonationHeader,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  args: {
    onNextStep: () => {},
  },
  decorators: [
    (Story) => (
      <div className='mx-auto max-w-105 overflow-hidden rounded-xl bg-white'>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof DonationHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FirstStep: Story = {
  args: {
    title: 'Choose an amount',
    currentStep: 1,
    canAdvance: true,
  },
};

export const MiddleStep: Story = {
  args: {
    title: 'Payment method',
    currentStep: 3,
    canAdvance: true,
  },
};

export const Disabled: Story = {
  args: {
    title: 'Choose an amount',
    currentStep: 1,
    canAdvance: false,
  },
};
