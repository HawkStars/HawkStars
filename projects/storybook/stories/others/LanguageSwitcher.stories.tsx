import LanguageSwitcher from '@/components/utils/LanguageSwitcher';
import type { Meta, StoryObj } from '@storybook/react';



const meta: Meta<typeof LanguageSwitcher> = {
  component: LanguageSwitcher,
};

export default meta;
type Story = StoryObj<typeof LanguageSwitcher>;

export const Primary: Story = {
  args: {},
  parameters: {
    nextjs: { appDirectory: true },
  },
};
