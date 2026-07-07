import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { AnimatedGroup } from '@/components/ui/animated-group';

const meta = {
  title: 'Design System/Animated Group',
  component: AnimatedGroup,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    preset: {
      control: { type: 'select' },
      options: [
        'fade',
        'slide',
        'scale',
        'blur',
        'blur-slide',
        'zoom',
        'flip',
        'bounce',
        'rotate',
        'swing',
      ],
    },
  },
} satisfies Meta<typeof AnimatedGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

const Cards = () =>
  Array.from({ length: 4 }).map((_, index) => (
    <div
      key={index}
      className='bg-card text-card-foreground flex h-24 w-24 items-center justify-center rounded-xl border shadow-sm'
    >
      {index + 1}
    </div>
  ));

export const Default: Story = {
  args: {
    className: 'flex gap-4',
    children: <Cards />,
  },
};

export const Slide: Story = {
  args: {
    preset: 'slide',
    className: 'flex gap-4',
    children: <Cards />,
  },
};

export const Scale: Story = {
  args: {
    preset: 'scale',
    className: 'flex gap-4',
    children: <Cards />,
  },
};

export const BlurSlide: Story = {
  args: {
    preset: 'blur-slide',
    className: 'flex gap-4',
    children: <Cards />,
  },
};

export const Bounce: Story = {
  args: {
    preset: 'bounce',
    className: 'flex gap-4',
    children: <Cards />,
  },
};
