'use client';

import { useEffect, useRef } from 'react';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useBookingContext } from '@/context/booking-context';
import { PricingBreakdown } from '../pricing-breakdown';
import { QuoteExpirationTimer } from '../quote-expiration-timer';
import { useQuote } from '@/hooks/use-quote';
import { calculateNights, formatDisplayDate } from '@/lib/booking/date-utils';
import { useQuoteTimer } from '@/hooks/use-quote-timer';

/**
 * Step 3: Quote Preview
 *
 * Shows pricing breakdown and expiration timer
 * User reviews before providing details
 */
export function StepQuotePreview() {
  const { state, actions } = useBookingContext();
  const { fetchQuote, isLoading, error } = useQuote();
  const { isExpired } = useQuoteTimer(state.quoteExpiration);
  const hasAutoRefreshed = useRef(false);

  const cabin = state.cabin!;
  const quote = state.quote!;
  const nights = calculateNights(state.checkIn!, state.checkOut!);

  const handleRefreshQuote = async () => {
    const newQuote = await fetchQuote(
      cabin.guestyListingId,
      state.checkIn!,
      state.checkOut!,
      state.guests
    );

    if (newQuote) {
      actions.setQuote(newQuote);
    }
  };

  const handleContinue = () => {
    if (!isExpired) {
      actions.nextStep();
    }
  };

  // Auto-refresh once when quote expires on this screen
  useEffect(() => {
    if (isExpired && !isLoading && !hasAutoRefreshed.current) {
      hasAutoRefreshed.current = true;
      void handleRefreshQuote();
    }
  }, [isExpired, isLoading]);

  const handleBack = () => {
    actions.previousStep();
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Review Your Quote</h3>
        <p className="text-sm text-gray-600">
          Prices are guaranteed for 15 minutes. Complete your booking before the timer expires.
        </p>
      </div>

      {/* Booking summary */}
      <div className="p-4 bg-gray-50 rounded-lg space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Dates</span>
          <span className="font-medium">
            {formatDisplayDate(state.checkIn!)} → {formatDisplayDate(state.checkOut!)}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Guests</span>
          <span className="font-medium">
            {state.guests.adults + state.guests.children} guest
            {state.guests.adults + state.guests.children !== 1 ? 's' : ''}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Rate Plan</span>
          <span className="font-medium">{quote.ratePlan.name}</span>
        </div>
      </div>

      {/* Quote expiration timer */}
      <QuoteExpirationTimer expiresAt={state.quoteExpiration} onRefresh={handleRefreshQuote} />

      {/* Pricing breakdown */}
      <div className="p-4 border rounded-lg">
        <PricingBreakdown pricing={quote.pricing} nights={nights} />
      </div>

      {/* Errors */}
      {error && (
        <div className="flex items-start gap-2 p-3 bg-red-50 rounded-lg">
          <span className="text-sm font-medium text-red-800">{error}</span>
        </div>
      )}

      {/* Cancellation policy */}
      {quote.ratePlan.cancellationPolicy && (
        <div className="p-3 bg-blue-50 rounded-lg">
          <p className="text-sm font-medium text-blue-900">Cancellation Policy</p>
          <p className="text-sm text-blue-800 mt-1">{quote.ratePlan.cancellationPolicy}</p>
        </div>
      )}

      {/* Terms */}
      {quote.terms && (
        <div className="text-xs text-gray-500">
          <p>By continuing, you agree to the booking terms and conditions.</p>
        </div>
      )}

      {/* Navigation buttons */}
      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={handleBack} disabled={isLoading}>
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <Button onClick={handleContinue} disabled={isExpired || isLoading} size="lg">
          Continue to Details
        </Button>
      </div>
    </div>
  );
}
