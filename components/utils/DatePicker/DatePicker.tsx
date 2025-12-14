'use client';

import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { useState } from 'react';
import { useRef } from 'react';

import { Calendar } from '@/components/ui/calendar';

type HawkStarsDatePickerProps = {
  date?: Date | null;
  onChange: (date: unknown) => void;
  labelText?: string;
  minDate?: Date;
};

function HawkStarsDatePicker({ date, onChange, labelText }: HawkStarsDatePickerProps) {
  const datePickerRef = useRef(null);
  const [startDate, setStartDate] = useState<Date>(date ?? new Date());

  const changeDatePickerValue = (value: Date) => {
    setStartDate(value);
    onChange(value);
  };

  return (
    <div ref={datePickerRef} className='flex flex-col gap-2'>
      {labelText && <span className='text-body_semibold'>{labelText}</span>}
      <div>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant='outline'
              data-empty={!date}
              className='w-70 justify-start text-left font-normal'
            >
              <CalendarIcon />
              {date ? format(date, 'dd-MM-yyyy') : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <Calendar
              required
              mode='single'
              selected={startDate}
              onSelect={changeDatePickerValue}
              captionLayout='dropdown'
              className='w-full rounded-lg border'
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}

export default HawkStarsDatePicker;
