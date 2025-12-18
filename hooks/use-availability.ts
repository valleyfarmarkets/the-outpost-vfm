'use client';

import { useState, useCallback } from 'react';
import { checkAvailability, type AvailabilityResponse } from '@/lib/booking/api-client';
import type { GuestCount } from '@/types/booking';

/**
 * @deprecated Use useBookingAvailability instead
 *
 * This hook is kept for backward compatibility but should not be used in new code.
 * The new hook (useBookingAvailability) handles debouncing, race conditions, and
 * auto-dispatch to booking context, preventing infinite loops and improving performance.
 *
 * Hook for checking cabin availability
 */
export function useAvailability() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const check = useCallback(async (
    listingId: string,
    checkIn: Date,
    checkOut: Date,
    guests: GuestCount
  ): Promise<AvailabilityResponse | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await checkAvailability(listingId, checkIn, checkOut, guests);
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to check availability';
      setError(message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    checkAvailability: check,
    isLoading,
    error,
    clearError: () => setError(null),
  };
}
