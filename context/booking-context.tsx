'use client';

import React, { createContext, useCallback, useEffect, useState } from 'react';
import type { Cabin } from '@/types/cabins';
import type { GuestyQuote, GuestDetails, GuestCount, BookingDates } from '@/types/booking';

/**
 * Booking Context - Global State Management for Booking Flow
 *
 * Features:
 * - sessionStorage persistence (survives page refresh)
 * - Quote expiration tracking
 * - Multi-step booking flow state
 * - Type-safe actions
 */

interface BookingState {
  // Current cabin being booked
  cabin: Cabin | null;

  // Selected dates
  checkIn: Date | null;
  checkOut: Date | null;

  // Guest count
  guests: GuestCount;

  // Availability data
  minimumStay: number | null;
  maximumStay: number | null;
  blockedDates: string[]; // ISO date strings

  // Quote data
  quote: GuestyQuote | null;
  quoteExpiration: Date | null;

  // Guest details (collected in final step)
  guestDetails: GuestDetails | null;

  // Reservation result
  reservationId: string | null;
  confirmationCode: string | null;

  // UI state
  isModalOpen: boolean;
  currentStep: number; // 1-6: Dates → Guests → Quote → Details → Payment → Confirmation
  isLoading: boolean;
  error: string | null;
}

interface BookingActions {
  // Modal control
  openBooking: (cabin: Cabin) => void;
  closeModal: () => void;

  // Date selection
  setDates: (checkIn: Date, checkOut: Date) => void;

  // Guest selection
  setGuests: (guests: GuestCount) => void;

  // Availability data
  setAvailability: (data: { minimumStay: number; maximumStay: number; blockedDates: string[] }) => void;

  // Quote
  setQuote: (quote: GuestyQuote) => void;

  // Guest details
  setGuestDetails: (details: GuestDetails) => void;

  // Reservation
  setReservation: (reservationId: string, confirmationCode: string) => void;

  // Navigation
  nextStep: () => void;
  previousStep: () => void;
  goToStep: (step: number) => void;

  // Loading & errors
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;

  // Reset
  reset: () => void;

  // sessionStorage
  hydrateFromStorage: () => void;
  persistToStorage: () => void;
}

interface BookingContextValue {
  state: BookingState;
  actions: BookingActions;
}

const BookingContext = createContext<BookingContextValue | null>(null);

const STORAGE_KEY = 'booking:state';

const initialState: BookingState = {
  cabin: null,
  checkIn: null,
  checkOut: null,
  guests: {
    adults: 2,
    children: 0,
  },
  minimumStay: null,
  maximumStay: null,
  blockedDates: [],
  quote: null,
  quoteExpiration: null,
  guestDetails: null,
  reservationId: null,
  confirmationCode: null,
  isModalOpen: false,
  currentStep: 1,
  isLoading: false,
  error: null,
};

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<BookingState>(initialState);

  // Hydrate from sessionStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          // Convert ISO strings back to Date objects
          if (parsed.checkIn) parsed.checkIn = new Date(parsed.checkIn);
          if (parsed.checkOut) parsed.checkOut = new Date(parsed.checkOut);
          if (parsed.quoteExpiration) parsed.quoteExpiration = new Date(parsed.quoteExpiration);

          // Only restore if quote hasn't expired
          if (parsed.quote && parsed.quoteExpiration) {
            if (new Date(parsed.quoteExpiration) > new Date()) {
              setState((prev) => ({ ...prev, ...parsed }));
            } else {
              // Quote expired, clear it
              sessionStorage.removeItem(STORAGE_KEY);
            }
          }
        } catch (error) {
          console.error('[BookingContext] Failed to hydrate from storage:', error);
        }
      }
    }
  }, []);

  // Persist to sessionStorage on state change
  useEffect(() => {
    if (typeof window !== 'undefined' && state.quote) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state]);

  const openBooking = useCallback((cabin: Cabin) => {
    setState((prev) => ({
      ...initialState,
      cabin,
      isModalOpen: true,
      // Preserve any selections already made on the listing page
      guests: prev.guests,
      checkIn: prev.checkIn,
      checkOut: prev.checkOut,
      blockedDates: prev.blockedDates,
      minimumStay: prev.minimumStay,
      maximumStay: prev.maximumStay,
    }));
  }, []);

  const closeModal = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isModalOpen: false,
    }));
  }, []);

  const setDates = useCallback((checkIn: Date, checkOut: Date) => {
    setState((prev) => ({
      ...prev,
      checkIn,
      checkOut,
      currentStep: Math.max(prev.currentStep, 2), // Advance to guests if not already past it
    }));
  }, []);

  const setGuests = useCallback((guests: GuestCount) => {
    setState((prev) => ({
      ...prev,
      guests,
    }));
  }, []);

  const setAvailability = useCallback(
    (data: { minimumStay: number; maximumStay: number; blockedDates: string[] }) => {
      setState((prev) => ({
        ...prev,
        minimumStay: data.minimumStay,
        maximumStay: data.maximumStay,
        blockedDates: data.blockedDates,
      }));
    },
    []
  );

  const setQuote = useCallback((quote: GuestyQuote) => {
    setState((prev) => ({
      ...prev,
      quote,
      quoteExpiration: new Date(quote.expiresAt),
      currentStep: Math.max(prev.currentStep, 3), // Advance to guest details
    }));
  }, []);

  const setGuestDetails = useCallback((details: GuestDetails) => {
    setState((prev) => ({
      ...prev,
      guestDetails: details,
      currentStep: Math.max(prev.currentStep, 5), // Advance to payment
    }));
  }, []);

  const setReservation = useCallback((reservationId: string, confirmationCode: string) => {
    setState((prev) => ({
      ...prev,
      reservationId,
      confirmationCode,
      currentStep: 6, // Final step - confirmation
    }));

    // Clear sessionStorage on successful booking
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const nextStep = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentStep: Math.min(prev.currentStep + 1, 6),
    }));
  }, []);

  const previousStep = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentStep: Math.max(prev.currentStep - 1, 1),
    }));
  }, []);

  const goToStep = useCallback((step: number) => {
    setState((prev) => ({
      ...prev,
      currentStep: Math.max(1, Math.min(step, 6)),
    }));
  }, []);

  const setLoading = useCallback((isLoading: boolean) => {
    setState((prev) => ({
      ...prev,
      isLoading,
    }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState((prev) => ({
      ...prev,
      error,
      isLoading: false,
    }));
  }, []);

  const reset = useCallback(() => {
    setState(initialState);
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const hydrateFromStorage = useCallback(() => {
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed.checkIn) parsed.checkIn = new Date(parsed.checkIn);
          if (parsed.checkOut) parsed.checkOut = new Date(parsed.checkOut);
          if (parsed.quoteExpiration) parsed.quoteExpiration = new Date(parsed.quoteExpiration);
          setState((prev) => ({ ...prev, ...parsed }));
        } catch (error) {
          console.error('[BookingContext] Failed to hydrate:', error);
        }
      }
    }
  }, []);

  const persistToStorage = useCallback(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state]);

  const value: BookingContextValue = {
    state,
    actions: {
      openBooking,
      closeModal,
      setDates,
      setGuests,
      setAvailability,
      setQuote,
      setGuestDetails,
      setReservation,
      nextStep,
      previousStep,
      goToStep,
      setLoading,
      setError,
      reset,
      hydrateFromStorage,
      persistToStorage,
    },
  };

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}

export function useBookingContext() {
  const context = React.useContext(BookingContext);
  if (!context) {
    throw new Error('useBookingContext must be used within BookingProvider');
  }
  return context;
}
