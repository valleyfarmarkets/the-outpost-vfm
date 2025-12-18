'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { useBookingContext } from '@/context/booking-context';
import { checkAvailability } from '@/lib/booking/api-client';
import type { GuestCount } from '@/types/booking';

/**
 * Smart hook for checking availability with debouncing and race condition handling
 *
 * This is the ONLY place where checkAvailability should be called.
 * Automatically updates booking context when availability changes.
 *
 * Features:
 * - 500ms debouncing to prevent rapid-fire API calls
 * - AbortController to handle race conditions
 * - Auto-dispatch results to booking context
 * - Clean state management
 */
export function useBookingAvailability(
  listingId: string | undefined,
  checkIn: Date | null,
  checkOut: Date | null,
  guests: GuestCount
) {
  const { actions } = useBookingContext();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);

  // Track the latest request to prevent race conditions
  const abortControllerRef = useRef<AbortController | null>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const checkAndUpdate = useCallback(async () => {
    // Validation
    if (!listingId || !checkIn || !checkOut) {
      setIsAvailable(null);
      setError(null);
      return;
    }

    // Don't check if checkout is before/equal to checkin
    if (checkOut <= checkIn) {
      return;
    }

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController();
    const currentAbortController = abortControllerRef.current;

    setIsLoading(true);
    setError(null);

    try {
      const result = await checkAvailability(
        listingId,
        checkIn,
        checkOut,
        guests
      );

      // Check if this request was aborted
      if (currentAbortController.signal.aborted) {
        return;
      }

      if (result) {
        // Update booking context with availability data
        actions.setAvailability({
          minimumStay: result.minimumStay,
          maximumStay: result.maximumStay,
          blockedDates: result.blockedDates,
        });

        setIsAvailable(result.available);
        if (!result.available) {
          setError('These dates are unavailable.');
        }
      }
    } catch (err) {
      // Only set error if request wasn't aborted
      if (!currentAbortController.signal.aborted) {
        const message = err instanceof Error ? err.message : 'Failed to check availability';
        setError(message);
        setIsAvailable(null);
      }
    } finally {
      if (!currentAbortController.signal.aborted) {
        setIsLoading(false);
      }
    }
  }, [listingId, checkIn, checkOut, guests, actions]);

  // Debounced effect
  useEffect(() => {
    // Clear previous debounce timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Reset state if no dates
    if (!checkIn || !checkOut) {
      setIsAvailable(null);
      setError(null);
      setIsLoading(false);
      return;
    }

    // Debounce the API call by 500ms
    debounceTimerRef.current = setTimeout(() => {
      checkAndUpdate();
    }, 500);

    // Cleanup
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [checkAndUpdate]);

  return {
    isLoading,
    error,
    isAvailable,
    clearError: () => setError(null),
  };
}
