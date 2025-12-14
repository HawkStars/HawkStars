import type { Meta, StoryObj } from '@storybook/react';
import { AnnouncementBannerBlock } from './Component';

const meta: Meta<typeof AnnouncementBannerBlock> = {
  title: 'Payload Blocks/AnnouncementBannerBlock',
  component: AnnouncementBannerBlock,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof AnnouncementBannerBlock>;

export const Info: Story = {
  args: {
    message: 'New workshop series starting next month! Limited spots available.',
    ctaText: 'Learn More',
    ctaLink: '#workshop',
    variant: 'info',
    dismissible: true,
    id: '1',
    blockName: 'AnnouncementBannerBlock',
    blockType: 'announcementBanner',
  },
};

export const Success: Story = {
  args: {
    ...Info.args,
    message: 'We reached our fundraising goal! Thank you to all our supporters.',
    variant: 'success',
  },
};

export const Warning: Story = {
  args: {
    ...Info.args,
    message: 'Registration closes in 3 days. Don\'t miss out!',
    variant: 'warning',
  },
};

export const Urgent: Story = {
  args: {
    ...Info.args,
    message: 'Emergency fundraising campaign - Help us respond to the community crisis.',
    variant: 'urgent',
  },
};
