import type { Stripe, StripeCardElement } from '@stripe/stripe-js';

/**
 * Stripe Utilities for Booking Flow
 *
 * Helper functions for Stripe payment processing
 */

/**
 * Create Stripe payment token from card element
 */
export async function createPaymentToken(
  stripe: Stripe | null,
  cardElement: StripeCardElement | null
): Promise<{ token: string; error?: string }> {
  if (!stripe || !cardElement) {
    return { token: '', error: 'Payment system not loaded. Please refresh and try again.' };
  }

  const { token, error } = await stripe.createToken(cardElement);

  if (error) {
    return {
      token: '',
      error: error.message || 'Payment failed. Please check your card details.',
    };
  }

  if (!token) {
    return { token: '', error: 'Failed to create payment token. Please try again.' };
  }

  return { token: token.id };
}

/**
 * Format error message from Stripe
 */
export function formatStripeError(error: unknown): string {
  if (typeof error === 'object' && error !== null && 'message' in error) {
    return (error as { message: string }).message;
  }
  return 'Payment failed. Please try again.';
}
