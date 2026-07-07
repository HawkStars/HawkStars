import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const meta = {
  title: 'Design System/Popover',
  component: Popover,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Popover>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant='outline'>Open Popover</Button>
      </PopoverTrigger>
      <PopoverContent>
        <p className='text-sm'>This is the popover content.</p>
      </PopoverContent>
    </Popover>
  ),
};

export const WithForm: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant='outline'>Edit dimensions</Button>
      </PopoverTrigger>
      <PopoverContent className='w-80'>
        <div className='grid gap-4'>
          <div className='space-y-1'>
            <h4 className='font-medium'>Dimensions</h4>
            <p className='text-muted-foreground text-sm'>Set the dimensions for the layer.</p>
          </div>
          <div className='grid gap-2'>
            <div className='grid grid-cols-3 items-center gap-2'>
              <Label htmlFor='width'>Width</Label>
              <Input id='width' defaultValue='100%' className='col-span-2' />
            </div>
            <div className='grid grid-cols-3 items-center gap-2'>
              <Label htmlFor='height'>Height</Label>
              <Input id='height' defaultValue='25px' className='col-span-2' />
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  ),
};

export const Alignments: Story = {
  render: () => (
    <div className='flex gap-4'>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant='outline'>Start</Button>
        </PopoverTrigger>
        <PopoverContent align='start'>Aligned to start</PopoverContent>
      </Popover>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant='outline'>End</Button>
        </PopoverTrigger>
        <PopoverContent align='end'>Aligned to end</PopoverContent>
      </Popover>
    </div>
  ),
};
