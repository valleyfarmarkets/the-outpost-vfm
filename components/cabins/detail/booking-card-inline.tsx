"use client";

import { useState } from "react";
import { Calendar, Users } from "lucide-react";
import { useBookingContext } from "@/context/booking-context";
import { GuestCounter } from "@/components/booking/guest-counter";
import { formatPrice } from "@/lib/utils";
import type { Cabin } from "@/types/cabins";
import { cn } from "@/lib/utils";

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
  const { actions } = useBookingContext();
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [showBreakdown, setShowBreakdown] = useState(false);

  const handleCheckAvailability = () => {
    // Set guest count in context
    actions.setGuests({ adults, children });
    // Open booking modal with this cabin
    actions.openBooking(cabin);
  };

  const totalGuests = adults + children;
  const exceedsCapacity = totalGuests > cabin.capacity;

  // Calculate price breakdown (using 3 nights as example)
  const nights = 3;
  const basePrice = cabin.priceRange.min * nights;
  const cleaningAmount = cleaningFee || cabin.cleaningFee || 0;
  const serviceAmount = serviceFee || cabin.serviceFee || 0;
  const totalBeforeTaxes = basePrice + cleaningAmount + serviceAmount;

  return (
    <div
      className={cn(
        "sticky top-24 rounded-2xl border-2 border-gray-200 bg-white p-6 shadow-lg",
        className
      )}
    >
      {/* Price Display */}
      <div className="border-b border-gray-200 pb-6">
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold text-gray-900">
            {formatPrice(cabin.priceRange.min)}
          </span>
          <span className="text-gray-600"> - </span>
          <span className="text-3xl font-bold text-gray-900">
            {formatPrice(cabin.priceRange.max)}
          </span>
        </div>
        <p className="mt-1 text-sm text-gray-600">
          per {cabin.priceRange.unit}
        </p>
      </div>

      {/* Guest Selection */}
      <div className="border-b border-gray-200 py-6">
        <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-gray-900">
          <Users className="h-4 w-4 text-brand-primary" />
          <span>Guests</span>
        </div>

        <div className="space-y-0">
          <GuestCounter
            label="Adults"
            value={adults}
            min={1}
            max={cabin.capacity}
            onChange={setAdults}
            description="Age 13+"
          />
          <GuestCounter
            label="Children"
            value={children}
            min={0}
            max={cabin.capacity - 1}
            onChange={setChildren}
            description="Age 2-12"
          />
        </div>

        {/* Capacity Warning */}
        {exceedsCapacity && (
          <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-800">
            This cabin sleeps a maximum of {cabin.capacity} guests.
          </div>
        )}

        {/* Capacity Info */}
        {!exceedsCapacity && totalGuests > 0 && (
          <div className="mt-4 text-center text-sm text-gray-600">
            {totalGuests} of {cabin.capacity} guests
          </div>
        )}
      </div>

      {/* Check Availability Button */}
      <div className="pt-6">
        <button
          onClick={handleCheckAvailability}
          disabled={exceedsCapacity || totalGuests === 0}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-primary px-6 py-4 text-base font-semibold text-white transition-colors hover:bg-brand-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Calendar className="h-5 w-5" />
          Check Availability
        </button>

        <p className="mt-4 text-center text-xs text-gray-500">
          You won&apos;t be charged yet
        </p>
      </div>

      {/* Price Breakdown */}
      {(cleaningAmount > 0 || serviceAmount > 0) && (
        <div className="mt-6 border-t border-gray-200 pt-6">
          <button
            onClick={() => setShowBreakdown(!showBreakdown)}
            className="mb-4 text-sm font-semibold text-[#221F1F] underline hover:text-[#B13330]"
          >
            {showBreakdown ? "Hide" : "Show"} price details
          </button>

          {showBreakdown && (
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-[#221F1F] underline">
                  {formatPrice(cabin.priceRange.min)} × {nights} nights
                </span>
                <span className="text-[#221F1F]">{formatPrice(basePrice)}</span>
              </div>
              {cleaningAmount > 0 && (
                <div className="flex justify-between">
                  <span className="text-[#221F1F] underline">Cleaning fee</span>
                  <span className="text-[#221F1F]">{formatPrice(cleaningAmount)}</span>
                </div>
              )}
              {serviceAmount > 0 && (
                <div className="flex justify-between">
                  <span className="text-[#221F1F] underline">Service fee</span>
                  <span className="text-[#221F1F]">{formatPrice(serviceAmount)}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-gray-200 pt-3 font-semibold">
                <span className="text-[#221F1F]">Total before taxes</span>
                <span className="text-[#221F1F]">{formatPrice(totalBeforeTaxes)}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Contact Info */}
      <div className="mt-6 border-t border-gray-200 pt-6 text-center">
        <p className="text-sm text-gray-600">
          Questions? Call us
        </p>
        <a
          href="tel:6194738341"
          className="mt-1 block text-lg font-semibold text-brand-primary hover:underline"
        >
          (619) 473-8341
        </a>
      </div>
    </div>
  );
}
