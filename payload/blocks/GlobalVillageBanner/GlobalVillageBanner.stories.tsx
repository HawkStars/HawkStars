import type { Meta, StoryObj } from '@storybook/react';

import { GlobalVillageBannerBlockComponent as GlobalVillageBannerBlock } from './Component';

const meta: Meta<typeof GlobalVillageBannerBlock> = {
  title: 'Banner/GlobalVillageBanner',
  component: GlobalVillageBannerBlock,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof GlobalVillageBannerBlock>;

export const Green: Story = {
  args: {
    text: 'Celebrating culture, collaboration, and community across the globe.',
    backgroundColor: 'green',
    id: '1',
    blockName: 'GlobalVillageBanner',
    blockType: 'globalVillageBanner',
  },
};

export const BegeDark: Story = {
  args: {
    text: 'Join the movement to build thriving cultural hubs in every village.',
    backgroundColor: 'bege-dark',
    id: '2',
    blockName: 'GlobalVillageBanner',
    blockType: 'globalVillageBanner',
  },
};

export const BegeLight: Story = {
  args: {
    text: 'Amplifying voices, sharing stories, and weaving resilient communities.',
    backgroundColor: 'bege-light',
    id: '3',
    blockName: 'GlobalVillageBanner',
    blockType: 'globalVillageBanner',
  },
};
