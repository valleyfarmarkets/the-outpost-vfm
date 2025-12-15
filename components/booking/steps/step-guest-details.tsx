'use client';

import { useRef } from 'react';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useBookingContext } from '@/context/booking-context';
import { GuestInfoForm } from '../guest-info-form';
import type { GuestDetailsFormData } from '@/lib/booking/validation';

/**
 * Step 4: Guest Details
 *
 * Collects guest contact information
 */
export function StepGuestDetails() {
  const { state, actions } = useBookingContext();
  const formRef = useRef<HTMLFormElement>(null);

  const handleFormSubmit = (data: GuestDetailsFormData) => {
    // Store guest details in context
    actions.setGuestDetails(data);
  };

  const handleBack = () => {
    actions.previousStep();
  };

  const handleContinue = () => {
    // Trigger form submission
    if (formRef.current) {
      const submitEvent = new Event('submit', { cancelable: true, bubbles: true });
      formRef.current.dispatchEvent(submitEvent);
    }
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

      {/* Form */}
      <div>
        <GuestInfoForm
          ref={formRef}
          defaultValues={state.guestDetails || undefined}
          onSubmit={handleFormSubmit}
          isSubmitting={false}
        />
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={handleBack}>
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <Button onClick={handleContinue} size="lg">
          Continue to Payment
        </Button>
      </div>
    </div>
  );
}
