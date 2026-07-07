import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { globalVillageLogo } from '@/utils/models/images/logos';
import CrowdfundingBanner from './CrowdfundingBanner';

const meta = {
  title: 'Crowdfunding/Sections/Banner',
  component: CrowdfundingBanner,
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof CrowdfundingBanner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    image: globalVillageLogo,
    alt: 'Global Village crowdfunding banner',
    href: 'https://hawkstars.org/contribute',
    sectionId: 'crowdfunding-banner',
  },
};

export const ExternalImage: Story = {
  args: {
    image: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=1920&h=400&fit=crop',
    alt: 'Campaign banner',
    href: '/contribute',
    sectionId: 'campaign-banner',
  },
};
