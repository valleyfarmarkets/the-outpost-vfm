'use client';

import { useState, useEffect } from 'react';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useBookingContext } from '@/context/booking-context';
import { useAvailability } from '@/hooks/use-availability';
import { DateRangePicker } from '../date-range-picker';
import { calculateNights, validateDateRange } from '@/lib/booking/date-utils';

/**
 * Step 1: Date Selection
 *
 * User selects check-in and check-out dates
 * Checks availability with API
 */
export function StepDateSelection() {
  const { state, actions } = useBookingContext();
  const { checkAvailability, isLoading, error } = useAvailability();

  const [selectedRange, setSelectedRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: state.checkIn || undefined,
    to: state.checkOut || undefined,
  });

  const [validationError, setValidationError] = useState<string | null>(null);

  const cabin = state.cabin!;
  const nights =
    selectedRange.from && selectedRange.to
      ? calculateNights(selectedRange.from, selectedRange.to)
      : 0;

  // Check availability when dates are selected
  useEffect(() => {
    const checkDates = async () => {
      if (!selectedRange.from || !selectedRange.to) return;

      const result = await checkAvailability(
        cabin.guestyListingId,
        selectedRange.from,
        selectedRange.to,
        state.guests
      );

      if (result) {
        // Store availability data
        actions.setAvailability({
          minimumStay: result.minimumStay,
          maximumStay: result.maximumStay,
          blockedDates: result.blockedDates,
        });
      }
    };

    checkDates();
  }, [selectedRange.from, selectedRange.to, cabin.guestyListingId, state.guests, checkAvailability, actions]);

  const handleContinue = () => {
    if (!selectedRange.from || !selectedRange.to) {
      setValidationError('Please select check-in and check-out dates');
      return;
    }

    // Validate date range
    const validation = validateDateRange(
      selectedRange.from,
      selectedRange.to,
      state.minimumStay,
      state.maximumStay
    );

    if (!validation.valid) {
      setValidationError(validation.error || 'Invalid date range');
      return;
    }

    // Set dates and advance to next step
    actions.setDates(selectedRange.from, selectedRange.to);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Select Your Dates</h3>
        <p className="text-sm text-gray-600">
          Choose your check-in and check-out dates. Minimum stay: {state.minimumStay || 2} nights.
        </p>
      </div>

      {/* Date picker */}
      <DateRangePicker
        selected={selectedRange}
        onSelect={(range) => {
          setSelectedRange(range);
          setValidationError(null);
        }}
        blockedDates={state.blockedDates}
        disabled={isLoading}
      />

      {/* Night count */}
      {nights > 0 && (
        <div className="p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-900">
            <span className="font-semibold">{nights} night{nights !== 1 ? 's' : ''}</span> selected
          </p>
        </div>
      )}

      {/* Loading state */}
      {isLoading && (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Loader2 className="h-4 w-4 animate-spin" />
          Checking availability...
        </div>
      )}

      {/* Errors */}
      {(error || validationError) && (
        <div className="flex items-start gap-2 p-3 bg-red-50 rounded-lg">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-900">{error || validationError}</p>
        </div>
      )}

      {/* Continue button */}
      <div className="flex justify-end pt-4">
        <Button
          onClick={handleContinue}
          disabled={!selectedRange.from || !selectedRange.to || isLoading}
          size="lg"
        >
          Continue to Guests
        </Button>
      </div>
    </div>
  );
}
