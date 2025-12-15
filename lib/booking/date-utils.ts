import { format, differenceInDays, isAfter, isBefore, parseISO } from 'date-fns';

/**
 * Date Utilities for Booking Flow
 *
 * Handles date formatting, validation, and calculations
 */

/**
 * Format date for display (e.g., "Jan 15, 2025")
 */
export function formatDisplayDate(date: Date): string {
  return format(date, 'MMM d, yyyy');
}

/**
 * Format date for API (ISO 8601)
 */
export function formatAPIDate(date: Date): string {
  return date.toISOString();
}

/**
 * Calculate number of nights between dates
 */
export function calculateNights(checkIn: Date, checkOut: Date): number {
  return differenceInDays(checkOut, checkIn);
}

/**
 * Validate date range
 */
export function validateDateRange(
  checkIn: Date | null,
  checkOut: Date | null,
  minimumStay?: number | null,
  maximumStay?: number | null
): { valid: boolean; error?: string } {
  if (!checkIn || !checkOut) {
    return { valid: false, error: 'Please select check-in and check-out dates' };
  }

  const now = new Date();
  now.setHours(0, 0, 0, 0);

  // Check if dates are in the past
  if (isBefore(checkIn, now)) {
    return { valid: false, error: 'Check-in date cannot be in the past' };
  }

  // Check if check-out is after check-in
  if (!isAfter(checkOut, checkIn)) {
    return { valid: false, error: 'Check-out must be after check-in' };
  }

  const nights = calculateNights(checkIn, checkOut);

  // Check minimum stay
  if (minimumStay && nights < minimumStay) {
    return {
      valid: false,
      error: `Minimum stay is ${minimumStay} night${minimumStay > 1 ? 's' : ''}`,
    };
  }

  // Check maximum stay
  if (maximumStay && nights > maximumStay) {
    return {
      valid: false,
      error: `Maximum stay is ${maximumStay} night${maximumStay > 1 ? 's' : ''}`,
    };
  }

  return { valid: true };
}

/**
 * Check if date is blocked
 */
export function isDateBlocked(date: Date, blockedDates: string[]): boolean {
  const dateString = format(date, 'yyyy-MM-dd');
  return blockedDates.includes(dateString);
}

/**
 * Parse ISO date string to Date
 */
export function parseDate(dateString: string): Date {
  return parseISO(dateString);
}

/**
 * Format time remaining (MM:SS)
 */
export function formatTimeRemaining(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
