'use client';

import { CardElement } from '@stripe/react-stripe-js';
import type { StripeCardElementOptions } from '@stripe/stripe-js';

/**
 * Stripe Payment Form
 *
 * Card input using Stripe Elements
 */

interface StripePaymentFormProps {
  disabled?: boolean;
}

const CARD_ELEMENT_OPTIONS: StripeCardElementOptions = {
  style: {
    base: {
      fontSize: '16px',
      color: '#1f2937',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      '::placeholder': {
        color: '#9ca3af',
      },
    },
    invalid: {
      color: '#dc2626',
      iconColor: '#dc2626',
    },
  },
  hidePostalCode: false,
};

export function StripePaymentForm({ disabled }: StripePaymentFormProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Card Details</label>
        <div className="p-3 border rounded-lg bg-white">
          <CardElement options={CARD_ELEMENT_OPTIONS} />
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Your payment information is secure and encrypted.
        </p>
      </div>

      {disabled && (
        <p className="text-sm text-gray-600">Processing payment...</p>
      )}
    </div>
  );
}
