import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import GamingNavbar from './GamingNavbar';

const meta = {
  title: 'Gaming/GamingNavbar',
  component: GamingNavbar,
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
} satisfies Meta<typeof GamingNavbar>;

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
