'use client';

import { useState } from 'react';
import DatePicker from 'react-datepicker';
import { useRef } from 'react';

import 'react-datepicker/dist/react-datepicker.css';

type HawkStarsDatePickerProps = {
  date: Date;
  onChange: (date: any) => void;
  labelText?: string;
  minDate?: Date;
};

function HawkStarsDatePicker({ date, onChange, labelText, minDate }: HawkStarsDatePickerProps) {
  const datePickerRef = useRef(null);
  const [startDate, setStartDate] = useState<Date>(date);

  const changeDatePickerValue = (value: Date) => {
    setStartDate(value);
    onChange(value);
  };

  return (
    <div ref={datePickerRef} className='flex flex-col gap-2'>
      {labelText && <h6>{labelText}</h6>}
      <div>
        <DatePicker
          onChange={changeDatePickerValue}
          selected={startDate}
          minDate={minDate || undefined}
          className='rounded-xl border-2 border-bege-dark p-2'
        />
      </div>
    </div>
  );
}

export default HawkStarsDatePicker;
