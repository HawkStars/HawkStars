import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import type { Contribution } from '@/payload-types';
import AppProvider from '@/utils/contexts/AppProvider';
import ChairsSections from './ChairsSection';

const ChairIcon = (
  <svg className='h-10 w-10 text-gray-300' fill='currentColor' viewBox='0 0 24 24'>
    <path d='M7 4h10a1 1 0 0 1 1 1v7h-2V6H8v6H6V5a1 1 0 0 1 1-1zM5 13h14v2H5v-2zm1 3h2v4H6v-4zm10 0h2v4h-2v-4z' />
  </svg>
);

const ChairIconFilled = (
  <svg className='text-green h-10 w-10' fill='currentColor' viewBox='0 0 24 24'>
    <path d='M7 4h10a1 1 0 0 1 1 1v7h-2V6H8v6H6V5a1 1 0 0 1 1-1zM5 13h14v2H5v-2zm1 3h2v4H6v-4zm10 0h2v4h-2v-4z' />
  </svg>
);

const makeContribution = (id: string, donor: string | null): Contribution => ({
  id,
  donor,
  value: 250,
  is_anonymous: !donor,
  is_confirmed: true,
  contribution_date: '2025-03-12',
  contribution_type: 'OFFICE_CHAIR',
  updatedAt: '2025-03-12T00:00:00.000Z',
  createdAt: '2025-03-12T00:00:00.000Z',
});

const currentContributions: Contribution[] = [
  makeContribution('1', 'Maria Silva'),
  makeContribution('2', 'João Costa'),
  makeContribution('3', null),
];

const meta = {
  title: 'Donation/Chairs Section',
  component: ChairsSections,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <AppProvider lng='en'>
        <div className='p-6'>
          <Story />
        </div>
      </AppProvider>
    ),
  ],
} satisfies Meta<typeof ChairsSections>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Office Chairs',
    price: '€250 each',
    icon: ChairIcon,
    iconFilled: ChairIconFilled,
    size: 10,
    currentContributions,
  },
};

export const FullyFunded: Story = {
  args: {
    ...Default.args,
    size: 3,
  },
};

export const Empty: Story = {
  args: {
    ...Default.args,
    currentContributions: [],
    size: 8,
  },
};
