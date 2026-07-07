import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { GlobalVillageBannerBlockComponent as GlobalVillageBannerBlock } from './Component';

const meta: Meta<typeof GlobalVillageBannerBlock> = {
  title: 'Blocks/Info/Global Village Banner',
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
