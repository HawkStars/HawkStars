import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import AppProvider from '@/utils/contexts/AppProvider';
import DetailsStep from './DetailsStep';

const meta = {
  title: 'Donation/Widget/Details Step',
  component: DetailsStep,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    onNameChange: () => {},
    onEmailChange: () => {},
    onPhoneNumberChange: () => {},
    onPhoneIndicativeChange: () => {},
    onCommentChange: () => {},
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
} satisfies Meta<typeof DetailsStep>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  args: {
    name: '',
    email: '',
    phoneNumber: '',
    phoneIndicative: '+351',
    comment: '',
  },
};

export const Filled: Story = {
  args: {
    name: 'Maria Silva',
    email: 'maria@example.com',
    phoneNumber: '912345678',
    phoneIndicative: '+351',
    comment: 'Keep up the great work!',
  },
};
