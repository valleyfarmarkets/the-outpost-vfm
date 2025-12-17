'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronLeft } from 'lucide-react';
import { guestDetailsSchema } from '@/lib/booking/validation';
import { useBookingContext } from '@/context/booking-context';
import { GuestInfoForm } from '../guest-info-form';
import { Button } from '@/components/ui/button';
import type { GuestDetailsFormData } from '@/lib/booking/validation';

/**
 * Step 4: Guest Details - Smart Container
 *
 * Owns form state, validation, and submission logic.
 * Delegates UI rendering to pure GuestInfoForm component.
 */

export function StepGuestDetails() {
  const { state, actions } = useBookingContext();

  // 1. Single Source of Truth for Form State
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<GuestDetailsFormData>({
    resolver: zodResolver(guestDetailsSchema),
    defaultValues: state.guestDetails || {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      notes: '',
    },
  });

  // 2. Clean Submission Logic (Explicit Navigation)
  const onSubmit = (data: GuestDetailsFormData) => {
    // Save data to context
    actions.setGuestDetails(data);

    // Explicitly navigate (clear intent - no implicit side-effects)
    actions.nextStep();
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Your Information</h3>
        <p className="text-sm text-gray-600">
          Please provide your contact details for the reservation confirmation.
        </p>
      </div>

      {/* Quote timer reminder */}
      <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-sm text-yellow-900">
          Remember: Your quote expires in a few minutes. Complete payment soon to secure this price.
        </p>
      </div>

      {/* 3. Native Form for Accessibility & Enter-Key Support */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

        {/* 4. Dumb UI Component */}
        <GuestInfoForm
          register={register}
          errors={errors}
          isSubmitting={isSubmitting}
        />

        {/* 5. Navigation Controls */}
        <div className="flex justify-between pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={actions.previousStep}
            disabled={isSubmitting}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          <Button
            type="submit"
            size="lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Processing...' : 'Continue to Payment'}
          </Button>
        </div>
      </form>
    </div>
  );
}
