import type { Meta, StoryObj } from '@storybook/react';

import Socials from '../../components/utils/Socials';

const meta: Meta<typeof Socials> = {
  component: Socials,
};

export default meta;
type Story = StoryObj<typeof Socials>;

export const Primary: Story = {
  args: {},
};
