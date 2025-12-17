'use client';

import React, { createContext, useCallback, useEffect, useReducer } from 'react';
import type { Cabin } from '@/types/cabins';
import type { GuestyQuote, GuestDetails, GuestCount } from '@/types/booking';

/**
 * Booking Context - Global State Management for Booking Flow
 * 
 * REFACTORED: Uses useReducer for robust state machine management
 * Features:
 * - State Machine pattern
 * - Idempotency Key generation
 * - sessionStorage persistence
 * - Quote expiration tracking
 */

export interface BookingState {
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

  // Idempotency
  idempotencyKey: string | null;

  // UI state
  isModalOpen: boolean;
  currentStep: number; // 1-6: Dates → Guests → Quote → Details → Payment → Confirmation
  isLoading: boolean;
  error: string | null;
}

// Action Types
export type BookingAction =
  | { type: 'OPEN_BOOKING'; payload: Cabin }
  | { type: 'CLOSE_MODAL' }
  | { type: 'SET_DATES'; payload: { checkIn: Date; checkOut: Date } }
  | { type: 'SET_GUESTS'; payload: GuestCount }
  | { type: 'SET_AVAILABILITY'; payload: { minimumStay: number; maximumStay: number; blockedDates: string[] } }
  | { type: 'SET_QUOTE'; payload: GuestyQuote }
  | { type: 'SET_GUEST_DETAILS'; payload: GuestDetails }
  | { type: 'SET_RESERVATION'; payload: { reservationId: string; confirmationCode: string } }
  | { type: 'NEXT_STEP' }
  | { type: 'PREVIOUS_STEP' }
  | { type: 'GO_TO_STEP'; payload: number }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'RESET' }
  | { type: 'HYDRATE'; payload: Partial<BookingState> };

// Initial State
export const initialState: BookingState = {
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
  idempotencyKey: null,
  isModalOpen: false,
  currentStep: 1,
  isLoading: false,
  error: null,
};

// Reducer
export function bookingReducer(state: BookingState, action: BookingAction): BookingState {
  switch (action.type) {
    case 'OPEN_BOOKING':
      return {
        ...initialState,
        cabin: action.payload,
        isModalOpen: true,
        // Preserve context if already set (can be improved)
        guests: state.guests,
        checkIn: state.checkIn,
        checkOut: state.checkOut,
        blockedDates: state.blockedDates,
        minimumStay: state.minimumStay,
        maximumStay: state.maximumStay,
        // Generate new idempotency key for new session
        idempotencyKey: crypto.randomUUID(),
      };
    case 'CLOSE_MODAL':
      return {
        ...state,
        isModalOpen: false,
      };
    case 'SET_DATES':
      return {
        ...state,
        checkIn: action.payload.checkIn,
        checkOut: action.payload.checkOut,
        currentStep: Math.max(state.currentStep, 2),
        error: null,
      };
    case 'SET_GUESTS':
      return {
        ...state,
        guests: action.payload,
        error: null,
      };
    case 'SET_AVAILABILITY':
      return {
        ...state,
        minimumStay: action.payload.minimumStay,
        maximumStay: action.payload.maximumStay,
        blockedDates: action.payload.blockedDates,
      };
    case 'SET_QUOTE':
      return {
        ...state,
        quote: action.payload,
        quoteExpiration: new Date(action.payload.expiresAt),
        currentStep: Math.max(state.currentStep, 3),
        error: null,
        // Regenerate idempotency key if quote changes (new deal = new transaction)
        idempotencyKey: crypto.randomUUID(),
      };
    case 'SET_GUEST_DETAILS':
      return {
        ...state,
        guestDetails: action.payload,
        currentStep: Math.max(state.currentStep, 5), // Jump to payment
        error: null,
      };
    case 'SET_RESERVATION':
      return {
        ...state,
        reservationId: action.payload.reservationId,
        confirmationCode: action.payload.confirmationCode,
        currentStep: 6, // Confirmation
        error: null,
      };
    case 'NEXT_STEP':
      return {
        ...state,
        currentStep: Math.min(state.currentStep + 1, 6),
      };
    case 'PREVIOUS_STEP':
      return {
        ...state,
        currentStep: Math.max(state.currentStep - 1, 1),
      };
    case 'GO_TO_STEP':
      return {
        ...state,
        currentStep: Math.max(1, Math.min(action.payload, 6)),
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };
    case 'RESET':
      return initialState;
    case 'HYDRATE':
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
}

interface BookingContextValue {
  state: BookingState;
  actions: {
    openBooking: (cabin: Cabin) => void;
    closeModal: () => void;
    setDates: (checkIn: Date, checkOut: Date) => void;
    setGuests: (guests: GuestCount) => void;
    setAvailability: (data: { minimumStay: number; maximumStay: number; blockedDates: string[] }) => void;
    setQuote: (quote: GuestyQuote) => void;
    setGuestDetails: (details: GuestDetails) => void;
    setReservation: (reservationId: string, confirmationCode: string) => void;
    nextStep: () => void;
    previousStep: () => void;
    goToStep: (step: number) => void;
    setLoading: (isLoading: boolean) => void;
    setError: (error: string | null) => void;
    reset: () => void;
    hydrateFromStorage: () => void;
    persistToStorage: () => void;
  };
}

const BookingContext = createContext<BookingContextValue | null>(null);

const STORAGE_KEY = 'booking:state:v2'; // Versioned key

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(bookingReducer, initialState);

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
              dispatch({ type: 'HYDRATE', payload: parsed });
            } else {
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

  // Action Creators
  const openBooking = useCallback((cabin: Cabin) => dispatch({ type: 'OPEN_BOOKING', payload: cabin }), []);
  const closeModal = useCallback(() => dispatch({ type: 'CLOSE_MODAL' }), []);
  const setDates = useCallback((checkIn: Date, checkOut: Date) => dispatch({ type: 'SET_DATES', payload: { checkIn, checkOut } }), []);
  const setGuests = useCallback((guests: GuestCount) => dispatch({ type: 'SET_GUESTS', payload: guests }), []);
  const setAvailability = useCallback((data: { minimumStay: number; maximumStay: number; blockedDates: string[] }) => dispatch({ type: 'SET_AVAILABILITY', payload: data }), []);
  const setQuote = useCallback((quote: GuestyQuote) => dispatch({ type: 'SET_QUOTE', payload: quote }), []);
  const setGuestDetails = useCallback((details: GuestDetails) => dispatch({ type: 'SET_GUEST_DETAILS', payload: details }), []);
  const setReservation = useCallback((reservationId: string, confirmationCode: string) => dispatch({ type: 'SET_RESERVATION', payload: { reservationId, confirmationCode } }), []);
  const nextStep = useCallback(() => dispatch({ type: 'NEXT_STEP' }), []);
  const previousStep = useCallback(() => dispatch({ type: 'PREVIOUS_STEP' }), []);
  const goToStep = useCallback((step: number) => dispatch({ type: 'GO_TO_STEP', payload: step }), []);
  const setLoading = useCallback((isLoading: boolean) => dispatch({ type: 'SET_LOADING', payload: isLoading }), []);
  const setError = useCallback((error: string | null) => dispatch({ type: 'SET_ERROR', payload: error }), []);
  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(STORAGE_KEY);
    }
  }, []);
  
  const hydrateFromStorage = useCallback(() => { /* handled by effect, kept for interface compat */ }, []);
  const persistToStorage = useCallback(() => { /* handled by effect, kept for interface compat */ }, []);

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
