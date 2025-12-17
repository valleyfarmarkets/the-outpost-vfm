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
          selected: 'bg-brand-primary/10 text-brand-primary', // Base selected style (middle)
          range_start: 'bg-brand-primary text-white rounded-l-md hover:bg-brand-primary hover:text-white', // Start cap
          range_end: 'bg-brand-primary text-white rounded-r-md hover:bg-brand-primary hover:text-white', // End cap
          range_middle: 'bg-brand-primary/10 text-brand-primary hover:bg-brand-primary/20', // Middle connection
          today: 'font-bold text-brand-primary',
          disabled: 'opacity-30 cursor-not-allowed text-gray-400',
        }}
        className="rounded-lg border p-4 bg-white shadow-sm"
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
