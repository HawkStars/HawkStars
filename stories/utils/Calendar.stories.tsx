import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import type { DateRange } from 'react-day-picker';

import { Calendar } from '@/components/ui/calendar';

const meta = {
  title: 'Design System/Calendar',
  component: Calendar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Calendar>;

export default meta;
type Story = StoryObj<typeof meta>;

function SingleCalendar() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  return (
    <Calendar mode='single' selected={date} onSelect={setDate} className='rounded-md border' />
  );
}

export const Default: Story = {
  render: () => <SingleCalendar />,
};

function RangeCalendar() {
  const [range, setRange] = useState<DateRange | undefined>();
  return (
    <Calendar mode='range' selected={range} onSelect={setRange} className='rounded-md border' />
  );
}

export const RangeSelection: Story = {
  render: () => <RangeCalendar />,
};

export const WithDropdowns: Story = {
  render: () => <Calendar mode='single' captionLayout='dropdown' className='rounded-md border' />,
};

export const MultipleMonths: Story = {
  render: () => <Calendar mode='single' numberOfMonths={2} className='rounded-md border' />,
};
