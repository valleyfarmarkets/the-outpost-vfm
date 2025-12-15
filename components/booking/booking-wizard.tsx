'use client';

import { useBookingContext } from '@/context/booking-context';
import { ProgressIndicator } from './progress-indicator';

// Step components (to be implemented)
import { StepDateSelection } from './steps/step-date-selection';
import { StepGuestSelection } from './steps/step-guest-selection';
import { StepQuotePreview } from './steps/step-quote-preview';
import { StepGuestDetails } from './steps/step-guest-details';
import { StepPayment } from './steps/step-payment';
import { StepConfirmation } from './steps/step-confirmation';

/**
 * Booking Wizard
 *
 * Orchestrates the multi-step booking flow
 * Renders the appropriate step based on currentStep state
 */
export function BookingWizard() {
  const { state } = useBookingContext();

  if (!state.cabin) {
    return null;
  }

  return (
    <div className="flex flex-col">
      {/* Progress indicator */}
      <ProgressIndicator currentStep={state.currentStep} />

      {/* Step content */}
      <div className="p-6">
        {/* Cabin header */}
        {state.currentStep < 6 && (
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">{state.cabin.name}</h2>
            <p className="text-sm text-gray-600 mt-1">{state.cabin.shortDescription}</p>
          </div>
        )}

        {/* Render current step */}
        {state.currentStep === 1 && <StepDateSelection />}
        {state.currentStep === 2 && <StepGuestSelection />}
        {state.currentStep === 3 && <StepQuotePreview />}
        {state.currentStep === 4 && <StepGuestDetails />}
        {state.currentStep === 5 && <StepPayment />}
        {state.currentStep === 6 && <StepConfirmation />}
      </div>
    </div>
  );
}
