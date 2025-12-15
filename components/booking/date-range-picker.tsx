'use client';

import { DayPicker } from 'react-day-picker';
import { format } from 'date-fns';
import 'react-day-picker/dist/style.css';

/**
 * Date Range Picker
 *
 * Calendar component using react-day-picker
 * Handles date selection with blocked dates
 */

interface DateRangePickerProps {
  selected: {
    from: Date | undefined;
    to: Date | undefined;
  };
  onSelect: (range: { from: Date | undefined; to: Date | undefined }) => void;
  blockedDates: string[];
  disabled?: boolean;
}

export function DateRangePicker({
  selected,
  onSelect,
  blockedDates,
  disabled,
}: DateRangePickerProps) {
  const disabledDays = [
    { before: new Date() }, // Past dates
    ...blockedDates.map((dateStr) => new Date(dateStr)),
  ];

  return (
    <div className="date-range-picker">
      <DayPicker
        mode="range"
        selected={selected}
        onSelect={(range) => {
          if (range) {
            onSelect({ from: range.from, to: range.to });
          }
        }}
        disabled={disabled ? true : disabledDays}
        numberOfMonths={2}
        modifiersClassNames={{
          selected: 'bg-brand-primary text-white hover:bg-brand-primary',
          today: 'font-bold',
          disabled: 'opacity-40 cursor-not-allowed',
        }}
        className="rounded-lg border p-4"
      />

      {selected.from && selected.to && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">Selected dates:</p>
          <p className="font-medium">
            {format(selected.from, 'MMM d, yyyy')} → {format(selected.to, 'MMM d, yyyy')}
          </p>
        </div>
      )}
    </div>
  );
}
