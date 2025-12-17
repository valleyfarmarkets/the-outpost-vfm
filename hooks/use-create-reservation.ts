'use client';

import { useState, useCallback } from 'react';
import { createReservation, type ReservationResponse } from '@/lib/booking/api-client';
import type { GuestDetails } from '@/types/booking';

/**
 * Hook for creating reservations
 */
export function useCreateReservation() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = useCallback(async (
    quoteId: string,
    guestyListingId: string,
    cabinId: string,
    cabinName: string,
    checkIn: string,
    checkOut: string,
    estimatedTotal: number,
    guests: { adults: number; children: number },
    guest: GuestDetails,
    paymentToken: string,
    idempotencyKey?: string
  ): Promise<ReservationResponse | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await createReservation(
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
        idempotencyKey
      );
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create reservation';
      setError(message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    createReservation: create,
    isLoading,
    error,
    clearError: () => setError(null),
  };
}
