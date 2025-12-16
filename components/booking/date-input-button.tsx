"use client";

import { useState } from "react";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import * as Popover from "@radix-ui/react-popover";
import "react-day-picker/dist/style.css";

/**
 * Date Input Button
 *
 * Button-style date input that opens a calendar popover for single date selection
 * Used for check-in and checkout dates in the booking card
 */

interface DateInputButtonProps {
  label: "CHECK-IN" | "CHECKOUT";
  date: Date | null;
  onSelect: (date: Date) => void;
  blockedDates: string[];
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
}

export function DateInputButton({
  label,
  date,
  onSelect,
  blockedDates,
  minDate,
  maxDate,
  disabled,
}: DateInputButtonProps) {
  const [open, setOpen] = useState(false);

  const disabledDays = [
    { before: minDate || new Date() }, // Past dates or custom min date
    ...(maxDate ? [{ after: maxDate }] : []),
    ...blockedDates.map((dateStr) => new Date(dateStr)),
  ];

  const handleSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      onSelect(selectedDate);
      setOpen(false); // Close popover after selection
    }
  };

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          type="button"
          disabled={disabled}
          className="flex flex-col items-start px-3 py-2.5 text-left hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-inset disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span className="text-xs font-semibold uppercase tracking-wide text-gray-700">
            {label}
          </span>
          <span className={date ? "text-sm text-gray-900" : "text-sm text-gray-500"}>
            {date ? format(date, "MMM d, yyyy") : "Add date"}
          </span>
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          align="start"
          sideOffset={8}
          className="z-50 rounded-xl border border-gray-200 bg-white p-4 shadow-xl"
        >
          <DayPicker
            mode="single"
            selected={date || undefined}
            onSelect={handleSelect}
            disabled={disabled ? true : disabledDays}
            modifiersClassNames={{
              selected: "bg-brand-primary text-white hover:bg-brand-primary",
              today: "font-bold border-2 border-brand-primary",
              disabled: "opacity-40 cursor-not-allowed",
            }}
            className="rounded-lg"
          />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
