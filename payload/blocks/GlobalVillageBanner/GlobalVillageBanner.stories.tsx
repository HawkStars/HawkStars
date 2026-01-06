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

export const Story: Story = {
  args: {
    text: 'Join the movement to build thriving cultural hubs in every village.',
  },
};
