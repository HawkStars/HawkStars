import type { Meta, StoryObj } from '@storybook/react';
import { PartnerShowcaseBlock } from './Component';
import { Media } from '@/payload-types';

const meta: Meta<typeof PartnerShowcaseBlock> = {
  title: 'Payload Blocks/Cards/PartnerShowcaseBlock',
  component: PartnerShowcaseBlock,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof PartnerShowcaseBlock>;

const samplePartners = [
  {
    name: 'Tech Corp',
    logo: {
      url: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?q=80&w=2338&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      alt: 'Tech Corp',
    } as Media,
    website: 'https://example.com',
    description: 'Technology partner providing IT infrastructure and support.',
    id: '1',
  },
  {
    name: 'Local Foundation',
    logo: {
      url: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?q=80&w=2338&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      alt: 'Local Foundation',
    } as Media,
    website: 'https://example.com',
    description: 'Financial support for our youth programs.',
    id: '2',
  },
  {
    name: 'Community Bank',
    logo: {
      url: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?q=80&w=2338&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      alt: 'Community Bank',
    } as Media,
    website: 'https://example.com',
    description: 'Banking partner and sponsor of community events.',
    id: '3',
  },
];

export const LogosOnly: Story = {
  args: {
    title: 'Our Partners',
    partners: samplePartners,
    layout: 'logos',
    id: '1',
    blockName: 'PartnerShowcaseBlock',
    blockType: 'partnerShowcase',
  },
};

export const Detailed: Story = {
  args: {
    ...LogosOnly.args,
    layout: 'detailed',
  },
};
