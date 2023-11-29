import { useState } from 'react';
import DatePicker from 'react-date-picker';

import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

interface HawkStarsDatePickerProps {
  date: Date;
  onChange: (date: any) => void;
  className?: string;
  minDate?: Date;
}

function HawkStarsDatePicker({ date, onChange }: HawkStarsDatePickerProps) {
  const [calendarDate, setCalendarDate] = useState<Value>(date);

  const changeDatePickerValue = (value: Value) => {
    setCalendarDate(value);
    onChange(value);
  };

  return (
    <div>
      <DatePicker onChange={changeDatePickerValue} value={calendarDate} />
    </div>
  );
}

export default HawkStarsDatePicker;
