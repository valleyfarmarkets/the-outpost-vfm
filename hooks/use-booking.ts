import { useBookingContext } from '@/context/booking-context';

/**
 * useBooking Hook
 *
 * Simplified hook to access booking state and actions
 * Usage: const { state, actions, helpers } = useBooking()
 */
export function useBooking() {
  const { state, actions } = useBookingContext();

  // Computed values and helper functions
  const helpers = {
    // Check if dates are selected
    hasDates: Boolean(state.checkIn && state.checkOut),

    // Check if quote is still valid
    isQuoteValid: Boolean(
      state.quote && state.quoteExpiration && new Date(state.quoteExpiration) > new Date()
    ),

    // Calculate nights
    getNights: (): number => {
      if (!state.checkIn || !state.checkOut) return 0;
      const diffTime = Math.abs(state.checkOut.getTime() - state.checkIn.getTime());
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    },

    // Get total guests
    getTotalGuests: (): number => {
      return state.guests.adults + state.guests.children;
    },

    // Check if cabin capacity is exceeded
    isOverCapacity: (): boolean => {
      if (!state.cabin) return false;
      return helpers.getTotalGuests() > state.cabin.capacity;
    },

    // Get time remaining on quote (in minutes)
    getQuoteTimeRemaining: (): number => {
      if (!state.quoteExpiration) return 0;
      const diffMs = new Date(state.quoteExpiration).getTime() - new Date().getTime();
      return Math.max(0, Math.floor(diffMs / 1000 / 60));
    },

    // Check if on final step
    isOnFinalStep: state.currentStep === 6,

    // Check if can proceed to next step
    canProceedToNextStep: (): boolean => {
      switch (state.currentStep) {
        case 1: // Dates
          return helpers.hasDates;
        case 2: // Guests
          return helpers.getTotalGuests() > 0 && !helpers.isOverCapacity();
        case 3: // Quote review
          return helpers.isQuoteValid;
        case 4: // Guest details
          return Boolean(state.guestDetails);
        case 5: // Payment
          return false; // Payment step handles its own submission
        case 6: // Confirmation
          return false; // Final step
        default:
          return false;
      }
    },

    // Get step name
    getStepName: (step: number): string => {
      const steps = [
        '',
        'Select Dates',
        'Choose Guests',
        'Review Quote',
        'Guest Details',
        'Payment',
        'Confirmation',
      ];
      return steps[step] || '';
    },

    // Format date for display
    formatDate: (date: Date | null): string => {
      if (!date) return '';
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }).format(date);
    },

    // Format price
    formatPrice: (amount: number, currency: string = 'USD'): string => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
      }).format(amount);
    },
  };

  return {
    state,
    actions,
    helpers,
  };
}
