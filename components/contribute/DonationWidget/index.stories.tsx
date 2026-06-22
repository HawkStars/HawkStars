import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import AppProvider from '@/utils/contexts/AppProvider';
import DonationWidget from './index';

// The full multi-step donation widget. It manages its own state and resolves
// translations from the `contribute` namespace via AppProvider.
const meta = {
  title: 'Contribute/DonationWidget',
  component: DonationWidget,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <AppProvider lng='en'>
        <Story />
      </AppProvider>
    ),
  ],
} satisfies Meta<typeof DonationWidget>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Portuguese: Story = {
  decorators: [
    (Story) => (
      <AppProvider lng='pt'>
        <Story />
      </AppProvider>
    ),
  ],
};
