import { z } from 'zod';

/**
 * Validation Schemas for Booking Flow
 *
 * Zod schemas for form validation with React Hook Form
 */

/**
 * Guest details form schema
 */
export const guestDetailsSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50, 'First name is too long'),
  lastName: z.string().min(1, 'Last name is required').max(50, 'Last name is too long'),
  email: z.string().email('Please enter a valid email address'),
  phone: z
    .string()
    .regex(/^\+?[\d\s\-()]+$/, 'Please enter a valid phone number')
    .min(10, 'Phone number is too short'),
  notes: z.string().max(500, 'Notes must be under 500 characters').optional(),
});

export type GuestDetailsFormData = z.infer<typeof guestDetailsSchema>;

/**
 * Guest count validation
 */
export function validateGuestCount(
  adults: number,
  children: number,
  capacity: number
): { valid: boolean; error?: string } {
  if (adults < 1) {
    return { valid: false, error: 'At least 1 adult is required' };
  }

  if (adults > 20) {
    return { valid: false, error: 'Maximum 20 adults allowed' };
  }

  if (children < 0 || children > 10) {
    return { valid: false, error: 'Children must be between 0 and 10' };
  }

  const total = adults + children;
  if (total > capacity) {
    return {
      valid: false,
      error: `Total guests (${total}) exceeds cabin capacity (${capacity})`,
    };
  }

  return { valid: true };
}
