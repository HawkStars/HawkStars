import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import type { Contribution } from '@/payload-types';
import AppProvider from '@/utils/contexts/AppProvider';
import FormContributions from './FormContributions';

const existingContribution: Contribution = {
  id: '1',
  donor: 'Maria Silva',
  value: 50,
  is_anonymous: false,
  is_confirmed: true,
  contribution_date: '2025-03-12T00:00:00.000Z',
  contribution_type: 'BANK',
  extra_info: 'NIF 123456789',
  updatedAt: '2025-03-12T00:00:00.000Z',
  createdAt: '2025-03-12T00:00:00.000Z',
};

const meta = {
  title: 'Contribute/FormContributions',
  component: FormContributions,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  args: {
    onSubmit: () => {},
    lng: 'en',
  },
  decorators: [
    (Story) => (
      <AppProvider lng='en'>
        <div className='mx-auto max-w-xl'>
          <Story />
        </div>
      </AppProvider>
    ),
  ],
} satisfies Meta<typeof FormContributions>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Create: Story = {
  args: {
    formType: 'create',
  },
};

export const Update: Story = {
  args: {
    formType: 'update',
    contribution: existingContribution,
  },
};
