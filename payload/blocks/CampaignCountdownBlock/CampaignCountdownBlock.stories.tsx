import type { Meta, StoryObj } from '@storybook/react';
import { CampaignCountdownBlock } from './Component';

const meta: Meta<typeof CampaignCountdownBlock> = {
  title: 'Section/CampaignCountdownBlock',
  component: CampaignCountdownBlock,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    theme: {
      control: 'select',
      options: ['light', 'dark', 'urgent'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof CampaignCountdownBlock>;

// Create a date 7 days from now
const futureDate = new Date();
futureDate.setDate(futureDate.getDate() + 7);

export const Default: Story = {
  args: {
    title: 'Campaign Ends Soon!',
    description: 'Support us before time runs out. Every contribution makes a difference.',
    targetDate: futureDate.toISOString(),
    ctaText: 'Donate Now',
    ctaLink: '#donate',
    showDays: true,
    showHours: true,
    showMinutes: true,
    showSeconds: true,
    theme: 'light',
    completedMessage: 'Campaign Ended',
    id: '1',
    blockName: 'CampaignCountdownBlock',
    blockType: 'campaignCountdown',
  },
};

export const DarkTheme: Story = {
  args: {
    ...Default.args,
    theme: 'dark',
  },
};

export const UrgentTheme: Story = {
  args: {
    ...Default.args,
    title: 'Last Chance to Donate!',
    description: 'Only hours left to reach our goal. Your support is needed now!',
    theme: 'urgent',
  },
};

export const DaysOnly: Story = {
  args: {
    ...Default.args,
    showHours: false,
    showMinutes: false,
    showSeconds: false,
  },
};

export const EventCountdown: Story = {
  args: {
    ...Default.args,
    title: 'Annual Gala Event',
    description: 'Join us for an evening of celebration and fundraising',
    ctaText: 'Register Now',
    ctaLink: '#register',
  },
};
