'use client';

import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar, CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { useState } from 'react';
import { useRef } from 'react';

type HawkStarsDatePickerProps = {
  date: Date | null;
  onChange: (date: any) => void;
  labelText?: string;
  minDate?: Date;
};

function HawkStarsDatePicker({ date, onChange, labelText, minDate }: HawkStarsDatePickerProps) {
  const datePickerRef = useRef(null);
  const [startDate, setStartDate] = useState<Date | null>(date);

  const changeDatePickerValue = (value: Date | null) => {
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
              className='data-[empty=true]:text-muted-foreground w-[280px] justify-start text-left font-normal'
            >
              <CalendarIcon />
              {date ? format(date, 'PPP') : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-auto p-0'>
            <Calendar
              mode='single'
              className='border-bege-dark rounded-xl border-2 p-2'
              // selected={startDate}
              // min={minDate || undefined}
              // onSelect={changeDatePickerValue}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}

export default HawkStarsDatePicker;
