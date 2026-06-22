import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { LuCircleAlert, LuInfo } from 'react-icons/lu';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const meta = {
  title: 'UI/Alert',
  component: Alert,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'destructive'],
    },
  },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Alert {...args} className='w-96'>
      <LuInfo />
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>You can add components to your app using the CLI.</AlertDescription>
    </Alert>
  ),
};

export const Destructive: Story = {
  args: {
    variant: 'destructive',
  },
  render: (args) => (
    <Alert {...args} className='w-96'>
      <LuCircleAlert />
      <AlertTitle>Something went wrong</AlertTitle>
      <AlertDescription>Your session has expired. Please log in again.</AlertDescription>
    </Alert>
  ),
};

export const TitleOnly: Story = {
  render: (args) => (
    <Alert {...args} className='w-96'>
      <LuInfo />
      <AlertTitle>A short, single-line notification.</AlertTitle>
    </Alert>
  ),
};

export const WithoutIcon: Story = {
  render: (args) => (
    <Alert {...args} className='w-96'>
      <AlertTitle>No icon alert</AlertTitle>
      <AlertDescription>This alert does not include a leading icon.</AlertDescription>
    </Alert>
  ),
};
