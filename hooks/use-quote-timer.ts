'use client';

import { useState, useEffect } from 'react';
import { formatTimeRemaining } from '@/lib/booking/date-utils';

/**
 * Hook for quote expiration countdown timer
 *
 * Displays MM:SS countdown from expiration time
 * Warns at 2 minutes remaining
 * Marks as expired when time runs out
 */
export function useQuoteTimer(expiresAt: Date | null) {
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [isExpired, setIsExpired] = useState(false);
  const [isWarning, setIsWarning] = useState(false);

  useEffect(() => {
    if (!expiresAt) {
      setTimeRemaining(0);
      setIsExpired(true);
      setIsWarning(false);
      return;
    }

    // Calculate initial time remaining
    const calculateTimeRemaining = () => {
      const now = new Date().getTime();
      const expires = new Date(expiresAt).getTime();
      const diff = Math.max(0, Math.floor((expires - now) / 1000)); // seconds
      return diff;
    };

    // Update immediately
    const updateTimer = () => {
      const remaining = calculateTimeRemaining();
      setTimeRemaining(remaining);
      setIsExpired(remaining === 0);
      setIsWarning(remaining > 0 && remaining <= 120); // 2 minutes
    };

    updateTimer();

    // Update every second
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [expiresAt]);

  return {
    timeRemaining, // seconds
    formattedTime: formatTimeRemaining(timeRemaining),
    isExpired,
    isWarning,
  };
}
