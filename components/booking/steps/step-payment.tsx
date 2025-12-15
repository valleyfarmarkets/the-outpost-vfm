'use client';

import { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { AlertCircle, ChevronLeft, Loader2, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useBookingContext } from '@/context/booking-context';
import { useCreateReservation } from '@/hooks/use-create-reservation';
import { useQuoteTimer } from '@/hooks/use-quote-timer';
import { StripePaymentForm } from '../stripe-payment-form';
import { PricingBreakdown } from '../pricing-breakdown';
import { createPaymentToken } from '@/lib/booking/stripe-utils';
import { calculateNights } from '@/lib/booking/date-utils';

/**
 * Step 5: Payment
 *
 * Stripe payment form and reservation creation
 */
export function StepPayment() {
  const { state, actions } = useBookingContext();
  const { createReservation, isLoading: isCreatingReservation, error } = useCreateReservation();
  const { isExpired } = useQuoteTimer(state.quoteExpiration);
  const stripe = useStripe();
  const elements = useElements();

  const [paymentError, setPaymentError] = useState<string | null>(null);

  const quote = state.quote!;
  const guestDetails = state.guestDetails!;
  const nights = calculateNights(state.checkIn!, state.checkOut!);

  const handlePayment = async () => {
    if (!stripe || !elements || isExpired) {
      return;
    }

    setPaymentError(null);

    // Get card element
    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setPaymentError('Payment form not loaded. Please refresh and try again.');
      return;
    }

    // Create payment token
    const { token, error: tokenError } = await createPaymentToken(stripe, cardElement);

    if (tokenError) {
      setPaymentError(tokenError);
      return;
    }

    // Create reservation
    const reservation = await createReservation(
      quote.quoteId,
      guestDetails,
      token,
      guestDetails.notes
    );

    if (reservation) {
      // Success! Move to confirmation
      actions.setReservation(reservation.reservationId, reservation.confirmationCode);
    }
  };

  const handleBack = () => {
    actions.previousStep();
  };

  if (isExpired) {
    return (
      <div className="space-y-6">
        <div className="flex items-start gap-3 p-4 bg-red-50 border-2 border-red-200 rounded-lg">
          <AlertCircle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-red-900">Quote Expired</h3>
            <p className="text-sm text-red-800 mt-1">
              Your quote has expired. Please go back and refresh to get updated pricing.
            </p>
          </div>
        </div>
        <Button variant="outline" onClick={handleBack} className="w-full">
          <ChevronLeft className="h-4 w-4 mr-2" />
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Payment</h3>
        <p className="text-sm text-gray-600">
          Enter your payment information to complete your booking.
        </p>
      </div>

      {/* Order summary */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-3">Order Summary</h4>
        <PricingBreakdown pricing={quote.pricing} nights={nights} />
      </div>

      {/* Guest details summary */}
      <div className="p-4 border rounded-lg">
        <h4 className="font-medium text-gray-900 mb-3">Guest Information</h4>
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-gray-600">Name</dt>
            <dd className="font-medium">
              {guestDetails.firstName} {guestDetails.lastName}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-600">Email</dt>
            <dd className="font-medium">{guestDetails.email}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-600">Phone</dt>
            <dd className="font-medium">{guestDetails.phone}</dd>
          </div>
        </dl>
      </div>

      {/* Payment form */}
      <StripePaymentForm disabled={isCreatingReservation} />

      {/* Security notice */}
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Lock className="h-4 w-4" />
        <span>Secure payment processing by Stripe</span>
      </div>

      {/* Errors */}
      {(error || paymentError) && (
        <div className="flex items-start gap-2 p-3 bg-red-50 rounded-lg">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-900">{error || paymentError}</p>
        </div>
      )}

      {/* Navigation buttons */}
      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={handleBack} disabled={isCreatingReservation}>
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <Button
          onClick={handlePayment}
          disabled={!stripe || isCreatingReservation}
          size="lg"
          className="min-w-[200px]"
        >
          {isCreatingReservation ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            `Pay ${quote.pricing.total.toLocaleString('en-US', { style: 'currency', currency: quote.pricing.currency })}`
          )}
        </Button>
      </div>

      {/* Terms */}
      <p className="text-xs text-gray-500 text-center">
        By completing this booking, you agree to the cabin rental terms and cancellation policy.
      </p>
    </div>
  );
}
