'use client';

import { useState } from 'react';
import { fetchQuote } from '@/lib/booking/api-client';
import type { GuestCount, GuestyQuote } from '@/types/booking';

/**
 * Hook for fetching pricing quotes
 */
export function useQuote() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getQuote = async (
    listingId: string,
    checkIn: Date,
    checkOut: Date,
    guests: GuestCount
  ): Promise<GuestyQuote | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await fetchQuote(listingId, checkIn, checkOut, guests);
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch quote';
      setError(message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    fetchQuote: getQuote,
    isLoading,
    error,
    clearError: () => setError(null),
  };
}
