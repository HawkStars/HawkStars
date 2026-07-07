import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Section } from './Section';

const DemoContent = () => (
  <div className='bg-green/10 rounded-lg p-6 text-center'>
    <h2 className='text-h2_bold text-green'>Section content</h2>
    <p className='text-disabled mt-2'>
      The surrounding section controls width, horizontal padding and vertical spacing.
    </p>
  </div>
);

const meta = {
  title: 'Layout/Structure/Section',
  component: Section,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    width: { control: 'select', options: [undefined, 'full', 'half'] },
    padding: { control: 'select', options: ['none', 'default', 'container'] },
    spacing: { control: 'select', options: ['none', 'tight', 'default', 'loose'] },
  },
  decorators: [
    (Story) => (
      <div className='bg-bege-light'>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Section>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: <DemoContent />,
  },
};

export const ContainerPadding: Story = {
  args: {
    padding: 'container',
    children: <DemoContent />,
  },
};

export const DefaultSpacing: Story = {
  args: {
    padding: 'container',
    spacing: 'default',
    children: <DemoContent />,
  },
};

export const LooseSpacing: Story = {
  args: {
    padding: 'container',
    spacing: 'loose',
    children: <DemoContent />,
  },
};

export const NoPadding: Story = {
  args: {
    padding: 'none',
    children: <DemoContent />,
  },
};
