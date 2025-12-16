"use client";

import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { useBookingContext } from "@/context/booking-context";
import { DateInputButton } from "@/components/booking/date-input-button";
import { GuestSelectorDropdown } from "@/components/booking/guest-selector-dropdown";
import { formatPrice } from "@/lib/utils";
import type { Cabin } from "@/types/cabins";
import { cn } from "@/lib/utils";
import { differenceInDays } from "date-fns";

interface BookingCardInlineProps {
  cabin: Cabin;
  cleaningFee?: number;
  serviceFee?: number;
  className?: string;
}

export function BookingCardInline({
  cabin,
  cleaningFee,
  serviceFee,
  className,
}: BookingCardInlineProps) {
  const bookingEnabled = process.env.NEXT_PUBLIC_ENABLE_GUESTY_BOOKING === 'true';
  const { state, actions } = useBookingContext();
  const { guests } = state;

  // Local state for dates to allow selecting them independently
  const [localCheckIn, setLocalCheckIn] = useState<Date | null>(state.checkIn);
  const [localCheckOut, setLocalCheckOut] = useState<Date | null>(state.checkOut);

  // Sync to context when both dates are selected
  useEffect(() => {
    if (localCheckIn && localCheckOut) {
      actions.setDates(localCheckIn, localCheckOut);
    }
  }, [localCheckIn, localCheckOut, actions]);

  const handleCheckInSelect = (date: Date) => {
    setLocalCheckIn(date);
  };

  const handleCheckOutSelect = (date: Date) => {
    setLocalCheckOut(date);
  };

  const handleGuestsChange = (newGuests: { adults: number; children: number }) => {
    actions.setGuests(newGuests);
  };

  const handleReserve = () => {
    if (!localCheckIn || !localCheckOut) return;

    // Open booking modal with this cabin
    // The modal will use the dates/guests already set in context
    actions.openBooking(cabin);
  };

  // Calculate nights from selected dates
  const nights =
    localCheckIn && localCheckOut ? differenceInDays(localCheckOut, localCheckIn) : 0;

  // Calculate price breakdown
  const basePrice = nights > 0 ? cabin.priceRange.min * nights : 0;
  const cleaningAmount = cleaningFee || cabin.cleaningFee || 0;
  const serviceAmount = serviceFee || cabin.serviceFee || 0;
  const totalBeforeTaxes = basePrice + cleaningAmount + serviceAmount;

  const totalGuests = guests.adults + guests.children;
  const exceedsCapacity = totalGuests > cabin.capacity;

  // Get rating and review count
  const rating = cabin.reviewStats?.averageRating;
  const reviewCount = cabin.reviewStats?.totalReviews;

  return (
    <div
      className={cn(
        "sticky top-24 w-full rounded-2xl border-2 border-gray-200 bg-white p-6 shadow-lg lg:w-[380px]",
        className
      )}
    >
      {/* Price Header with Rating */}
      <div className="mb-6 flex items-start justify-between">
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-bold text-gray-900">
            {formatPrice(cabin.priceRange.min)}
          </span>
          <span className="text-gray-600">/ night</span>
        </div>
        {rating && reviewCount && reviewCount > 0 && (
          <div className="flex items-center gap-1 text-sm text-gray-700">
            <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
            <span className="font-semibold">{rating.toFixed(1)}</span>
            <span className="text-gray-500">
              · {reviewCount} {reviewCount === 1 ? "review" : "reviews"}
            </span>
          </div>
        )}
      </div>

      {/* Date & Guest Inputs */}
      <div className="mb-4 space-y-3">
        {/* Date Row */}
        <div className="grid grid-cols-[1fr_1px_1fr] overflow-hidden rounded-lg border border-gray-300">
          <DateInputButton
            label="CHECK-IN"
            date={localCheckIn}
            onSelect={handleCheckInSelect}
            blockedDates={state.blockedDates}
            minDate={new Date()}
          />
          <div className="border-l border-gray-300" />
          <DateInputButton
            label="CHECKOUT"
            date={localCheckOut}
            onSelect={handleCheckOutSelect}
            blockedDates={state.blockedDates}
            minDate={localCheckIn || new Date()}
          />
        </div>

        {/* Guests Row */}
        <GuestSelectorDropdown
          adults={guests.adults}
          childrenCount={guests.children}
          maxCapacity={cabin.capacity}
          onChange={handleGuestsChange}
        />
      </div>

      {/* Reserve Button */}
      <button
        onClick={handleReserve}
        disabled={!bookingEnabled || !localCheckIn || !localCheckOut || exceedsCapacity}
        className="w-full rounded-lg bg-gradient-to-r from-[#A0563B] to-[#D97945] py-4 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {bookingEnabled ? 'Reserve' : 'Booking Disabled'}
      </button>

      {/* Reassurance Text */}
      <p className="mt-3 text-center text-sm text-gray-600">
        You won&apos;t be charged yet
      </p>

      {!bookingEnabled && (
        <p className="mt-2 text-center text-xs text-gray-500">
          Online booking is disabled in this environment.
        </p>
      )}

      {/* Price Breakdown - Always visible when dates are selected */}
      {nights > 0 && (
        <>
          <div className="my-6 border-t border-gray-200" />

          <div className="space-y-3 text-base">
            <div className="flex justify-between">
              <button className="text-left underline text-gray-900 hover:text-gray-700">
                {formatPrice(cabin.priceRange.min)} x {nights}{" "}
                {nights === 1 ? "night" : "nights"}
              </button>
              <span className="text-gray-900">{formatPrice(basePrice)}</span>
            </div>

            {cleaningAmount > 0 && (
              <div className="flex justify-between text-gray-900">
                <span>Cleaning fee</span>
                <span>{formatPrice(cleaningAmount)}</span>
              </div>
            )}

            {serviceAmount > 0 && (
              <div className="flex justify-between text-gray-900">
                <span>Service fee</span>
                <span>{formatPrice(serviceAmount)}</span>
              </div>
            )}
          </div>

          <div className="mt-6 flex justify-between border-t border-gray-200 pt-4 text-xl font-bold">
            <span className="text-gray-900">Total before taxes</span>
            <span className="text-gray-900">{formatPrice(totalBeforeTaxes)}</span>
          </div>
        </>
      )}
    </div>
  );
}
