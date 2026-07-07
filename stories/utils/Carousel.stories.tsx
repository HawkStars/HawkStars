import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';

const meta = {
  title: 'Design System/Carousel',
  component: Carousel,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: { type: 'inline-radio' },
      options: ['horizontal', 'vertical'],
    },
  },
} satisfies Meta<typeof Carousel>;

export default meta;
type Story = StoryObj<typeof meta>;

const Slides = ({ basis }: { basis?: string }) =>
  Array.from({ length: 5 }).map((_, index) => (
    <CarouselItem key={index} className={basis}>
      <Card>
        <CardContent className='flex aspect-square items-center justify-center p-6'>
          <span className='text-3xl font-semibold'>{index + 1}</span>
        </CardContent>
      </Card>
    </CarouselItem>
  ));

export const Default: Story = {
  render: (args) => (
    <Carousel {...args} className='w-64'>
      <CarouselContent>
        <Slides />
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  ),
};

export const MultipleItems: Story = {
  render: (args) => (
    <Carousel {...args} className='w-80'>
      <CarouselContent>
        <Slides basis='basis-1/3' />
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  ),
};

export const Vertical: Story = {
  args: {
    orientation: 'vertical',
  },
  render: (args) => (
    <Carousel {...args} className='w-64' opts={{ align: 'start' }}>
      <CarouselContent className='-mt-1 h-64'>
        <Slides basis='basis-1/2 pt-1' />
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  ),
};

export const Looping: Story = {
  render: (args) => (
    <Carousel {...args} className='w-64' opts={{ loop: true }}>
      <CarouselContent>
        <Slides />
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  ),
};
