'use client';

import { BookingProvider } from '@/context/booking-context';
import { StripeProvider } from './stripe-provider';

/**
 * Combined Providers Component
 *
 * Wraps the app with all necessary providers in the correct order
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <StripeProvider>
      <BookingProvider>{children}</BookingProvider>
    </StripeProvider>
  );
}
