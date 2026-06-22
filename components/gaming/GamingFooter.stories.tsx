import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import GamingFooter from './GamingFooter';

const meta = {
  title: 'Gaming/GamingFooter',
  component: GamingFooter,
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
    },
  },
  tags: ['autodocs'],
  argTypes: {
    lng: { control: 'select', options: ['en', 'pt'] },
  },
} satisfies Meta<typeof GamingFooter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    lng: 'en',
  },
};

export const Portuguese: Story = {
  args: {
    lng: 'pt',
  },
};
