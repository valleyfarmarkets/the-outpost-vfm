"use client";

import { useState, useEffect } from "react";
import { DayPicker, type DateRange } from "react-day-picker";
import { format } from "date-fns";
import * as Popover from "@radix-ui/react-popover";
import { Calendar } from "lucide-react";
import "react-day-picker/dist/style.css";

/**
 * Date Range Input Button
 *
 * Single button that opens a calendar popover for date range selection
 * Used for selecting check-in and check-out dates in one unified calendar
 */

interface DateRangeInputButtonProps {
  checkIn: Date | null;
  checkOut: Date | null;
  onSelect: (checkIn: Date, checkOut: Date) => void;
  blockedDates: string[];
  minDate?: Date;
  disabled?: boolean;
}

export function DateRangeInputButton({
  checkIn,
  checkOut,
  onSelect,
  blockedDates,
  minDate,
  disabled,
}: DateRangeInputButtonProps) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: checkIn || undefined,
    to: checkOut || undefined,
  });

  // Sync external props to internal state when they change
  useEffect(() => {
    setSelected({
      from: checkIn || undefined,
      to: checkOut || undefined,
    });
  }, [checkIn, checkOut]);

  // Auto-close when both dates are selected
  useEffect(() => {
    if (selected.from && selected.to) {
      onSelect(selected.from, selected.to);
      setOpen(false);
    }
  }, [selected, onSelect]);

  const disabledDays = [
    { before: minDate || new Date() }, // Past dates or custom min date
    ...blockedDates.map((dateStr) => new Date(dateStr)),
  ];

  const handleSelect = (range: DateRange | undefined) => {
    if (range) {
      setSelected({ from: range.from, to: range.to });
    }
  };

  // Format display text
  const displayText = checkIn && checkOut
    ? `${format(checkIn, "MMM d")} - ${format(checkOut, "MMM d, yyyy")}`
    : "Select dates";

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          type="button"
          disabled={disabled}
          className="flex w-full items-center justify-between rounded-lg border border-gray-300 px-3 py-2.5 text-left hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-inset disabled:cursor-not-allowed disabled:opacity-50"
        >
          <div className="flex flex-col">
            <span className="text-xs font-semibold uppercase tracking-wide text-gray-700">
              Dates
            </span>
            <span className={checkIn && checkOut ? "text-sm text-gray-900" : "text-sm text-gray-500"}>
              {displayText}
            </span>
          </div>
          <Calendar className="h-5 w-5 text-gray-400" />
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          align="start"
          sideOffset={8}
          className="z-50 rounded-xl border border-gray-200 bg-white p-4 shadow-xl"
        >
          <DayPicker
            mode="range"
            selected={selected}
            onSelect={handleSelect}
            disabled={disabled ? true : disabledDays}
            numberOfMonths={2}
            modifiersClassNames={{
              selected: "bg-brand-primary/10 text-brand-primary",
              range_start: "bg-brand-primary text-white rounded-l-md hover:bg-brand-primary hover:text-white",
              range_end: "bg-brand-primary text-white rounded-r-md hover:bg-brand-primary hover:text-white",
              range_middle: "bg-brand-primary/10 text-brand-primary hover:bg-brand-primary/20",
              today: "font-bold text-brand-primary",
              disabled: "opacity-30 cursor-not-allowed text-gray-400",
            }}
            className="rounded-lg"
          />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
