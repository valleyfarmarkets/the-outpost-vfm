import type { Cabin } from './cabins';

/**
 * Booking Flow Type Definitions
 * Used for managing the booking state in the frontend
 */

export interface BookingDates {
  checkIn: Date;
  checkOut: Date;
}

export interface GuestCount {
  adults: number;
  children: number;
}

export interface GuestDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  notes?: string;
}

export interface PriceBreakdown {
  basePrice: number;
  cleaningFee: number;
  taxAmount: number;
  total: number;
  currency: string;
  nightlyRates: Array<{
    date: string;
    price: number;
  }>;
}

export interface GuestyQuote {
  quoteId: string;
  expiresAt: string; // ISO 8601 date-time
  pricing: PriceBreakdown;
  ratePlan: {
    id: string;
    name: string;
    cancellationPolicy: string;
  };
  terms: string;
}

export interface GuestyReservation {
  reservationId: string;
  confirmationCode: string;
  status: 'confirmed' | 'pending';
  guest: GuestDetails;
  cabin: Cabin;
  dates: BookingDates;
  pricing: PriceBreakdown;
}

export interface BookingState {
  cabin: Cabin | null;
  checkIn: Date | null;
  checkOut: Date | null;
  guests: GuestCount;
  quote: GuestyQuote | null;
  quoteExpiration: Date | null;
  reservation: GuestyReservation | null;
  isModalOpen: boolean;
  minimumStay: number | null;
  maximumStay: number | null;
  blockedDates: string[];
}

export type BookingStep =
  | 'dates'
  | 'guests'
  | 'quote'
  | 'details'
  | 'payment'
  | 'confirmation';

export interface BookingActions {
  openBooking: (cabin: Cabin) => void;
  closeModal: () => void;
  setDates: (checkIn: Date, checkOut: Date) => void;
  setGuests: (guests: GuestCount) => void;
  setQuote: (quote: GuestyQuote) => void;
  setReservation: (reservation: GuestyReservation) => void;
  setAvailability: (minimumStay: number, maximumStay: number, blockedDates: string[]) => void;
  reset: () => void;
  hydrateFromStorage: () => void;
  persistToStorage: () => void;
}
