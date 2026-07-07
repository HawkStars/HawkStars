import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { CrowdfundingImageBannerBlockComponent } from './Component';
import { createPayloadExternalImage, createPayloadLink } from '@/utils/storybook';
import { CrowdfundingImageBannerBlock } from '@/payload-types';

const meta: Meta<typeof CrowdfundingImageBannerBlockComponent> = {
  title: 'Blocks/Fundraising/Crowdfunding Image Banner',
  component: CrowdfundingImageBannerBlockComponent,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof CrowdfundingImageBannerBlockComponent>;

export const Default: Story = {
  args: {
    image: createPayloadExternalImage(
      'external',
      'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=1920&h=400&fit=crop',
      'Crowdfunding campaign banner'
    ) as unknown as CrowdfundingImageBannerBlock['image'],
    url: createPayloadLink(
      'custom',
      'https://hawkstars.org/contribute',
      true,
      'Contribute'
    ) as unknown as CrowdfundingImageBannerBlock['url'],
    id: '1',
    blockName: 'CrowdfundingImageBanner',
    blockType: 'crowdfundingImageBanner',
  },
};

export const TallBanner: Story = {
  args: {
    ...Default.args,
    image: createPayloadExternalImage(
      'external',
      'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=1920&h=800&fit=crop',
      'Tall crowdfunding banner'
    ) as unknown as CrowdfundingImageBannerBlock['image'],
  },
};

export const InternalLink: Story = {
  args: {
    ...Default.args,
    url: createPayloadLink(
      'custom',
      '/contribute',
      false,
      'Get Involved'
    ) as unknown as CrowdfundingImageBannerBlock['url'],
  },
};

export const WithSectionId: Story = {
  args: {
    ...Default.args,
    sectionId: 'crowdfunding-banner',
  },
};
