'use client';

import { useState } from 'react';
import DatePicker from 'react-date-picker';
import { useRef } from 'react';
import { Label } from '@headlessui/react/dist/components/label/label';

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

interface HawkStarsDatePickerProps {
  date: Date;
  onChange: (date: any) => void;
  labelText?: string;
  minDate?: Date;
}

function HawkStarsDatePicker({
  date,
  onChange,
  labelText,
  minDate,
}: HawkStarsDatePickerProps) {
  const datePickerRef = useRef(null);
  const [calendarDate, setCalendarDate] = useState<Value>(date);

  const changeDatePickerValue = (value: Value) => {
    setCalendarDate(value);
    onChange(value);
  };

  return (
    <div ref={datePickerRef} className='flex flex-col gap-2'>
      {labelText && <h6>{labelText}</h6>}
      <DatePicker onChange={changeDatePickerValue} value={calendarDate} />
    </div>
  );
}

export default HawkStarsDatePicker;
