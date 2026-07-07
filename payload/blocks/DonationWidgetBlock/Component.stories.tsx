import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import DonationWidget from '@/components/contribute/DonationWidget';

const meta: Meta<typeof DonationWidget> = {
  title: 'Blocks/Fundraising/Donation Widget',
  component: DonationWidget,
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof DonationWidget>;

export const Default: Story = {};
