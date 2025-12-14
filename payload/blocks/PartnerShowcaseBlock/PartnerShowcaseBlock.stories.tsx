import type { Meta, StoryObj } from '@storybook/react';
import { PartnerShowcaseBlock } from './Component';

const meta: Meta<typeof PartnerShowcaseBlock> = {
  title: 'Payload Blocks/PartnerShowcaseBlock',
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
      url: 'https://via.placeholder.com/200x100/4F46E5/FFFFFF?text=Tech+Corp',
      alt: 'Tech Corp',
    },
    website: 'https://example.com',
    description: 'Technology partner providing IT infrastructure and support.',
    id: '1',
  },
  {
    name: 'Local Foundation',
    logo: {
      url: 'https://via.placeholder.com/200x100/10B981/FFFFFF?text=Foundation',
      alt: 'Local Foundation',
    },
    website: 'https://example.com',
    description: 'Financial support for our youth programs.',
    id: '2',
  },
  {
    name: 'Community Bank',
    logo: {
      url: 'https://via.placeholder.com/200x100/F59E0B/FFFFFF?text=Bank',
      alt: 'Community Bank',
    },
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
