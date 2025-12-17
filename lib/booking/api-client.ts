import type { GuestCount, GuestDetails, GuestyQuote } from '@/types/booking';

/**
 * Booking API Client
 *
 * Centralized frontend wrapper for all booking API endpoints
 * Handles errors and provides type-safe interfaces
 */

export interface AvailabilityResponse {
  available: boolean;
  listing: {
    id: string;
    name: string;
    capacity: number;
  };
  blockedDates: string[]; // ISO date strings
  minimumStay: number;
  maximumStay: number;
}

export interface ReservationResponse {
  reservationId: string;
  confirmationCode: string;
  status: 'confirmed' | 'pending' | 'failed';
  paymentStatus: 'paid' | 'pending' | 'failed';
  guest: GuestDetails;
  listing: {
    id: string;
    name: string;
  };
  dates: {
    checkIn: string;
    checkOut: string;
  };
  pricing: {
    basePrice: number;
    cleaningFee: number;
    taxAmount: number;
    total: number;
    currency: string;
    nightlyRates: Array<{
      date: string;
      price: number;
    }>;
  };
}

/**
 * Check cabin availability for specific dates
 */
export async function checkAvailability(
  listingId: string,
  checkIn: Date,
  checkOut: Date,
  guests: GuestCount
): Promise<AvailabilityResponse> {
  const response = await fetch('/api/booking/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      listingId,
      checkIn: checkIn.toISOString(),
      checkOut: checkOut.toISOString(),
      guests,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Failed to check availability');
  }

  return response.json();
}

/**
 * Fetch pricing quote for selected dates and guests
 */
export async function fetchQuote(
  listingId: string,
  checkIn: Date,
  checkOut: Date,
  guests: GuestCount
): Promise<GuestyQuote> {
  const response = await fetch('/api/booking/quote', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      listingId,
      checkIn: checkIn.toISOString(),
      checkOut: checkOut.toISOString(),
      guests,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    if (error.error === 'Unavailable') {
      throw new Error('These dates are no longer available. Please select different dates.');
    }
    throw new Error(error.message || 'Failed to get quote');
  }

  return response.json();
}

/**
 * Create reservation from quote with payment
 */
export async function createReservation(
  quoteId: string,
  guestyListingId: string, // Guesty listing ID from cabin.guestyListingId
  cabinId: string, // Internal slug from cabin.id
  cabinName: string,
  checkIn: string,
  checkOut: string,
  estimatedTotal: number,
  guests: { adults: number; children: number },
  guest: GuestDetails,
  paymentToken: string,
  idempotencyKey?: string
): Promise<ReservationResponse> {
  const response = await fetch('/api/booking/reservation', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      quoteId,
      guestyListingId,
      cabinId,
      cabinName,
      checkIn,
      checkOut,
      estimatedTotal,
      guests,
      guest,
      paymentToken,
      idempotencyKey,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));

    // Handle specific error cases
    if (error.error === 'Quote Expired') {
      throw new Error('Your quote has expired. Please refresh and try again.');
    }
    if (error.error?.includes('payment')) {
      throw new Error(
        error.message || 'Payment failed. Please check your card details and try again.'
      );
    }
    if (error.error === 'Unavailable') {
      throw new Error('This cabin is no longer available for the selected dates.');
    }

    throw new Error(error.message || 'Failed to create reservation');
  }

  return response.json();
}
