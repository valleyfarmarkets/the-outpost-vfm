'use client';

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useMemo } from 'react';

/**
 * Stripe Provider Component
 *
 * Wraps the app with Stripe Elements context
 * Required for payment form to work
 */

export function StripeProvider({ children }: { children: React.ReactNode }) {
  // Load Stripe.js with the publishable key
  const stripePromise = useMemo(() => {
    const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

    if (!publishableKey) {
      console.warn(
        '[StripeProvider] NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not set. Payment will not work.'
      );
      return null;
    }

    // Don't load Stripe if using placeholder key
    if (publishableKey.includes('your_key_here')) {
      console.warn('[StripeProvider] Using placeholder Stripe key. Payment will not work.');
      return null;
    }

    return loadStripe(publishableKey);
  }, []);

  // If Stripe is not configured, render children without Elements wrapper
  if (!stripePromise) {
    return <>{children}</>;
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{
        appearance: {
          theme: 'stripe',
          variables: {
            colorPrimary: '#059669', // emerald-600 (matches site theme)
            colorBackground: '#ffffff',
            colorText: '#1f2937', // gray-800
            colorDanger: '#dc2626', // red-600
            fontFamily: 'system-ui, sans-serif',
            spacingUnit: '4px',
            borderRadius: '8px',
          },
        },
      }}
    >
      {children}
    </Elements>
  );
}
