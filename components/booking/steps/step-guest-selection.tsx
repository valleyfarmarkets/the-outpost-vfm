'use client';

import { useState } from 'react';
import { AlertCircle, Loader2, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useBookingContext } from '@/context/booking-context';
import { useQuote } from '@/hooks/use-quote';
import { GuestCounter } from '../guest-counter';
import { validateGuestCount } from '@/lib/booking/validation';
import { formatDisplayDate } from '@/lib/booking/date-utils';

/**
 * Step 2: Guest Selection
 *
 * User selects number of adults and children
 * Fetches quote when valid
 */
export function StepGuestSelection() {
  const { state, actions } = useBookingContext();
  const { fetchQuote, isLoading, error } = useQuote();

  const [adults, setAdults] = useState(state.guests.adults);
  const [children, setChildren] = useState(state.guests.children);
  const [validationError, setValidationError] = useState<string | null>(null);

  const cabin = state.cabin!;

  const handleContinue = async () => {
    // Validate guest count
    const validation = validateGuestCount(adults, children, cabin.capacity);

    if (!validation.valid) {
      setValidationError(validation.error || 'Invalid guest count');
      return;
    }

    // Update guest count in state
    actions.setGuests({ adults, children });

    // Fetch quote
    const quote = await fetchQuote(
      cabin.guestyListingId,
      state.checkIn!,
      state.checkOut!,
      { adults, children }
    );

    if (quote) {
      actions.setQuote(quote);
    }
  };

  const handleBack = () => {
    actions.previousStep();
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">How Many Guests?</h3>
        <p className="text-sm text-gray-600">
          This cabin accommodates up to {cabin.capacity} guests.
        </p>
      </div>

      {/* Selected dates summary */}
      <div className="p-3 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600">
          {state.checkIn && state.checkOut && (
            <>
              {formatDisplayDate(state.checkIn)} → {formatDisplayDate(state.checkOut)}
            </>
          )}
        </p>
      </div>

      {/* Guest counters */}
      <div className="border rounded-lg">
        <GuestCounter
          label="Adults"
          description="Age 13 or above"
          value={adults}
          min={1}
          max={20}
          onChange={(value) => {
            setAdults(value);
            setValidationError(null);
          }}
        />
        <GuestCounter
          label="Children"
          description="Ages 2-12"
          value={children}
          min={0}
          max={10}
          onChange={(value) => {
            setChildren(value);
            setValidationError(null);
          }}
        />
      </div>

      {/* Total guests */}
      <div className="p-3 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-900">
          <span className="font-semibold">Total: {adults + children} guest{adults + children !== 1 ? 's' : ''}</span>
        </p>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Loader2 className="h-4 w-4 animate-spin" />
          Getting pricing...
        </div>
      )}

      {/* Errors */}
      {(error || validationError) && (
        <div className="flex items-start gap-2 p-3 bg-red-50 rounded-lg">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-900">{error || validationError}</p>
        </div>
      )}

      {/* Navigation buttons */}
      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={handleBack} disabled={isLoading}>
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <Button onClick={handleContinue} disabled={isLoading} size="lg">
          {isLoading ? 'Getting Quote...' : 'Continue to Quote'}
        </Button>
      </div>
    </div>
  );
}
