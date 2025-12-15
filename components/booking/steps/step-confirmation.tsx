'use client';

import { useBookingContext } from '@/context/booking-context';
import { BookingSuccess } from '../booking-success';

/**
 * Step 6: Confirmation
 *
 * Booking success screen with confetti
 */
export function StepConfirmation() {
  const { state, actions } = useBookingContext();

  const cabin = state.cabin!;
  const quote = state.quote!;
  const guestDetails = state.guestDetails!;

  const handleClose = () => {
    // Reset booking state and close modal
    actions.reset();
    actions.closeModal();
  };

  return (
    <BookingSuccess
      confirmationCode={state.confirmationCode || 'PENDING'}
      cabinName={cabin.name}
      guestEmail={guestDetails.email}
      checkIn={state.checkIn!}
      checkOut={state.checkOut!}
      guests={state.guests}
      total={quote.pricing.total}
      currency={quote.pricing.currency}
      onClose={handleClose}
    />
  );
}
