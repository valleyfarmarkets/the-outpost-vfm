'use client';

import { useState } from 'react';
import { createReservation, type ReservationResponse } from '@/lib/booking/api-client';
import type { GuestDetails } from '@/types/booking';

/**
 * Hook for creating reservations
 */
export function useCreateReservation() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = async (
    quoteId: string,
    guest: GuestDetails,
    paymentToken: string,
    notes?: string
  ): Promise<ReservationResponse | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await createReservation(quoteId, guest, paymentToken, notes);
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create reservation';
      setError(message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createReservation: create,
    isLoading,
    error,
    clearError: () => setError(null),
  };
}
