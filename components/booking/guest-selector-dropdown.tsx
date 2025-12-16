"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import * as Popover from "@radix-ui/react-popover";
import { GuestCounter } from "./guest-counter";
import { Button } from "@/components/ui/button";

/**
 * Guest Selector Dropdown
 *
 * Dropdown button for selecting number of guests (adults and children)
 * Used in the booking card for streamlined guest selection
 */

export interface GuestCount {
  adults: number;
  children: number;
}

interface GuestSelectorDropdownProps {
  adults: number;
  childrenCount: number;
  maxCapacity: number;
  onChange: (guests: GuestCount) => void;
  disabled?: boolean;
}

export function GuestSelectorDropdown({
  adults,
  childrenCount,
  maxCapacity,
  onChange,
  disabled,
}: GuestSelectorDropdownProps) {
  const [open, setOpen] = useState(false);

  const totalGuests = adults + childrenCount;
  const guestText = totalGuests === 1 ? "1 guest" : `${totalGuests} guests`;
  const isOverCapacity = totalGuests > maxCapacity;

  const handleAdultsChange = (newAdults: number) => {
    onChange({ adults: newAdults, children: childrenCount });
  };

  const handleChildrenChange = (newChildren: number) => {
    onChange({ adults, children: newChildren });
  };

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          type="button"
          disabled={disabled}
          className="flex w-full items-center justify-between rounded-lg border border-gray-300 px-3 py-2.5 text-left hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand-primary disabled:cursor-not-allowed disabled:opacity-50"
        >
          <div className="flex flex-col">
            <span className="text-xs font-semibold uppercase tracking-wide text-gray-700">
              GUESTS
            </span>
            <span className="text-sm text-gray-900">{guestText}</span>
          </div>
          <ChevronDown className="h-5 w-5 text-gray-600" />
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          align="start"
          sideOffset={8}
          className="z-50 w-[340px] rounded-xl border border-gray-200 bg-white p-6 shadow-xl"
        >
          <div className="space-y-1">
            <GuestCounter
              label="Adults"
              description="Age 13+"
              value={adults}
              min={1}
              max={maxCapacity}
              onChange={handleAdultsChange}
            />

            <GuestCounter
              label="Children"
              description="Age 2-12"
              value={childrenCount}
              min={0}
              max={maxCapacity - adults}
              onChange={handleChildrenChange}
            />
          </div>

          <div className="mt-4 flex items-center justify-between border-t pt-4">
            <div className="text-sm">
              <span className="font-medium text-gray-900">{totalGuests}</span>
              <span className="text-gray-600"> of {maxCapacity} guests</span>
              {isOverCapacity && (
                <p className="mt-1 text-xs text-red-600">
                  This cabin has a maximum capacity of {maxCapacity} guests.
                </p>
              )}
            </div>

            <Button
              type="button"
              size="sm"
              onClick={() => setOpen(false)}
              className="bg-brand-primary hover:bg-brand-primary/90"
            >
              Done
            </Button>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
